"""
TrackingAsyncOpenAI — wrapper sobre AsyncOpenAI que loggea cada
chat.completions.create en la tabla openai_usage de Supabase.

Reemplaza la importación `from openai import AsyncOpenAI` por
`from openai_tracking import TrackingAsyncOpenAI as AsyncOpenAI`
y todas las llamadas existentes loggean automáticamente sin tocar
los call sites.

Contexto por request: usar `set_usage_context(endpoint, modo)` en un
middleware FastAPI para que cada fila quede etiquetada por endpoint.
"""

from __future__ import annotations

import asyncio
import logging
import os
import time
import uuid
from contextvars import ContextVar
from datetime import datetime, timedelta
from typing import Any, Optional

import httpx
from openai import AsyncOpenAI

from database import SessionLocal, OpenAIUsage

logger = logging.getLogger(__name__)

# Contexto por request: poblado por el middleware en main.py
_endpoint_ctx: ContextVar[Optional[str]] = ContextVar("openai_endpoint", default=None)
_modo_ctx: ContextVar[Optional[str]] = ContextVar("openai_modo", default=None)


def set_usage_context(endpoint: Optional[str], modo: Optional[str] = None) -> None:
    _endpoint_ctx.set(endpoint)
    _modo_ctx.set(modo)


def clear_usage_context() -> None:
    _endpoint_ctx.set(None)
    _modo_ctx.set(None)


# ── Pricing (USD por 1M tokens) ──────────────────────────────────────────────
# Fuente: https://openai.com/api/pricing/ (actualizar manualmente cuando cambien)
# Solo precios que efectivamente usamos. Cualquier modelo no listado
# cae al fallback de gpt-4o-mini.
_PRICING_USD_PER_1M = {
    "gpt-4o-mini":           {"in": 0.150, "out": 0.600},
    "gpt-4o-mini-2024-07-18":{"in": 0.150, "out": 0.600},
    "gpt-4o":                {"in": 2.500, "out": 10.000},
    "gpt-4o-2024-08-06":     {"in": 2.500, "out": 10.000},
    "gpt-4o-2024-11-20":     {"in": 2.500, "out": 10.000},
    "gpt-4.1":               {"in": 2.000, "out": 8.000},
    "gpt-4.1-mini":          {"in": 0.400, "out": 1.600},
    "gpt-4.1-nano":          {"in": 0.100, "out": 0.400},
    "o1-mini":               {"in": 1.100, "out": 4.400},
    "o3-mini":               {"in": 1.100, "out": 4.400},
}
_PRICING_FALLBACK = _PRICING_USD_PER_1M["gpt-4o-mini"]


def estimate_cost_usd(model: str, prompt_tokens: int, completion_tokens: int) -> float:
    p = _PRICING_USD_PER_1M.get(model, _PRICING_FALLBACK)
    return (prompt_tokens * p["in"] + completion_tokens * p["out"]) / 1_000_000.0


def _persist_usage(
    *,
    provider: str = "openai",
    model: str,
    prompt_tokens: int,
    completion_tokens: int,
    total_tokens: int,
    cost_usd: float,
    latency_ms: int,
    ok: bool,
    endpoint: Optional[str],
    modo: Optional[str],
) -> None:
    """Inserta una fila en openai_usage. Falla silenciosamente: el tracking
    no debe romper el endpoint."""
    if SessionLocal is None:
        return
    db = SessionLocal()
    try:
        row = OpenAIUsage(
            id=str(uuid.uuid4()),
            created_at=datetime.utcnow(),
            provider=provider,
            model=model,
            endpoint=endpoint,
            modo=modo,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            cost_usd=cost_usd,
            latency_ms=latency_ms,
            ok=1 if ok else 0,
        )
        db.add(row)
        db.commit()
    except Exception as e:
        logger.warning(f"[openai_usage] no se pudo persistir: {e}")
        try:
            db.rollback()
        except Exception:
            pass
    finally:
        try:
            db.close()
        except Exception:
            pass


# ── Wrapper de cliente ───────────────────────────────────────────────────────


class _TrackedCompletions:
    def __init__(self, inner):
        self._inner = inner

    async def create(self, *args, **kwargs):
        model = kwargs.get("model") or (args[0] if args else "unknown")
        endpoint = _endpoint_ctx.get()
        modo = _modo_ctx.get()
        start = time.perf_counter()
        try:
            response = await self._inner.create(*args, **kwargs)
        except Exception:
            latency_ms = int((time.perf_counter() - start) * 1000)
            _persist_usage(
                model=str(model),
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                cost_usd=0.0,
                latency_ms=latency_ms,
                ok=False,
                endpoint=endpoint,
                modo=modo,
            )
            raise
        latency_ms = int((time.perf_counter() - start) * 1000)
        usage = getattr(response, "usage", None)
        pt = int(getattr(usage, "prompt_tokens", 0) or 0)
        ct = int(getattr(usage, "completion_tokens", 0) or 0)
        tt = int(getattr(usage, "total_tokens", 0) or (pt + ct))
        cost = estimate_cost_usd(str(model), pt, ct)
        try:
            await asyncio.to_thread(
                _persist_usage,
                model=str(model),
                prompt_tokens=pt,
                completion_tokens=ct,
                total_tokens=tt,
                cost_usd=cost,
                latency_ms=latency_ms,
                ok=True,
                endpoint=endpoint,
                modo=modo,
            )
        except Exception as e:
            logger.warning(f"[openai_usage] persistencia async falló: {e}")
        return response


class _TrackedChat:
    def __init__(self, inner):
        self._inner = inner
        self.completions = _TrackedCompletions(inner.completions)

    def __getattr__(self, name):
        return getattr(self._inner, name)


class TrackingAsyncOpenAI:
    """Drop-in para AsyncOpenAI. Solo intercepta chat.completions.create."""

    def __init__(self, *args, **kwargs):
        self._client = AsyncOpenAI(*args, **kwargs)
        self._chat = _TrackedChat(self._client.chat)

    @property
    def chat(self):
        return self._chat

    def __getattr__(self, name):
        return getattr(self._client, name)


# ── OpenAI Admin API (Costs / Usage) ─────────────────────────────────────────
#
# Docs: https://platform.openai.com/docs/api-reference/usage
# Requiere una admin key (sk-admin-...) en OPENAI_ADMIN_KEY.

_ADMIN_KEY = os.getenv("OPENAI_ADMIN_KEY")
_OPENAI_API_BASE = "https://api.openai.com/v1"


async def fetch_openai_costs(days: int = 30) -> dict:
    """Llama a /v1/organization/costs y devuelve el agregado por día."""
    if not _ADMIN_KEY:
        return {"error": "OPENAI_ADMIN_KEY no configurado", "available": False}
    end = int(datetime.utcnow().timestamp())
    start = int((datetime.utcnow() - timedelta(days=days)).timestamp())
    headers = {"Authorization": f"Bearer {_ADMIN_KEY}"}
    # Costs API con bucket_width=1d acepta limit 1..180
    params = {
        "start_time": start,
        "end_time": end,
        "bucket_width": "1d",
        "limit": min(max(days + 1, 1), 180),
    }
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            r = await client.get(
                f"{_OPENAI_API_BASE}/organization/costs",
                headers=headers,
                params=params,
            )
            if r.status_code != 200:
                return {
                    "error": f"OpenAI respondió {r.status_code}",
                    "detail": r.text[:300],
                    "available": False,
                }
            data = r.json()
    except Exception as e:
        return {"error": f"Fallo de red: {e}", "available": False}

    series = []
    total_usd = 0.0
    for bucket in data.get("data", []):
        ts = bucket.get("start_time")
        fecha = datetime.utcfromtimestamp(ts).date().isoformat() if ts else None
        bucket_usd = 0.0
        for res in bucket.get("results", []):
            amount = res.get("amount", {})
            bucket_usd += float(amount.get("value", 0) or 0)
        series.append({"fecha": fecha, "usd": round(bucket_usd, 4)})
        total_usd += bucket_usd
    return {
        "available": True,
        "total_usd": round(total_usd, 4),
        "por_dia": series,
        "rango_dias": days,
    }


async def fetch_openai_token_usage(days: int = 30) -> dict:
    """Llama a /v1/organization/usage/completions para tokens reales según OpenAI."""
    if not _ADMIN_KEY:
        return {"error": "OPENAI_ADMIN_KEY no configurado", "available": False}
    end = int(datetime.utcnow().timestamp())
    start = int((datetime.utcnow() - timedelta(days=days)).timestamp())
    headers = {"Authorization": f"Bearer {_ADMIN_KEY}"}
    # Usage API con bucket_width=1d acepta limit 1..31
    params = {
        "start_time": start,
        "end_time": end,
        "bucket_width": "1d",
        "limit": min(max(days + 1, 1), 31),
    }
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            r = await client.get(
                f"{_OPENAI_API_BASE}/organization/usage/completions",
                headers=headers,
                params=params,
            )
            if r.status_code != 200:
                return {
                    "error": f"OpenAI respondió {r.status_code}",
                    "detail": r.text[:300],
                    "available": False,
                }
            data = r.json()
    except Exception as e:
        return {"error": f"Fallo de red: {e}", "available": False}

    series = []
    total_in = 0
    total_out = 0
    for bucket in data.get("data", []):
        ts = bucket.get("start_time")
        fecha = datetime.utcfromtimestamp(ts).date().isoformat() if ts else None
        b_in = 0
        b_out = 0
        for res in bucket.get("results", []):
            b_in += int(res.get("input_tokens", 0) or 0)
            b_out += int(res.get("output_tokens", 0) or 0)
        series.append({"fecha": fecha, "in": b_in, "out": b_out, "total": b_in + b_out})
        total_in += b_in
        total_out += b_out
    return {
        "available": True,
        "total_in": total_in,
        "total_out": total_out,
        "total_tokens": total_in + total_out,
        "por_dia": series,
        "rango_dias": days,
    }
