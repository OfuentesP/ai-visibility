"""
TrackingGemini — wrapper sobre google.genai.Client que loggea cada
generación a la tabla openai_usage (con provider='gemini').

Comparte el contexto por request con openai_tracking (set_usage_context)
para que las dos integraciones queden tageadas por endpoint/modo.

Gemini SDK: pip install google-genai (>=0.4.0)
"""

from __future__ import annotations

import asyncio
import logging
import os
import time
from typing import Optional, Any

from openai_tracking import _persist_usage, _endpoint_ctx, _modo_ctx  # reuse context vars

logger = logging.getLogger(__name__)

_GEMINI_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

try:
    from google import genai  # type: ignore
    from google.genai import types as genai_types  # type: ignore
    _SDK_OK = True
except Exception as e:  # pragma: no cover
    logger.warning(f"google-genai no disponible: {e}")
    genai = None  # type: ignore
    genai_types = None  # type: ignore
    _SDK_OK = False


_client: Optional[Any] = None
if _SDK_OK and _GEMINI_KEY:
    try:
        _client = genai.Client(api_key=_GEMINI_KEY)
    except Exception as e:
        logger.warning(f"No se pudo crear Gemini client: {e}")
        _client = None


# ── Throttle de concurrencia ──────────────────────────────────────────────────
# El free-tier de Gemini permite ~5 req/min; endpoints como discovery/citability
# disparan N llamadas concurrentes por motor y provocan 429 en ráfaga. Limitamos
# la concurrencia global de llamadas a Gemini. Configurable vía env (tier pago
# puede subirlo). Default conservador para que 'ambos' funcione sin tarjeta.
_GEMINI_MAX_CONCURRENCY = max(1, int(os.getenv("GEMINI_MAX_CONCURRENCY", "3")))
# Espaciado mínimo entre lanzamientos (ms). 0 = sin espaciado. Útil para respetar
# RPM en free-tier (ej. 12000 ≈ 5/min). Default 0 para no frenar tier pago.
_GEMINI_MIN_INTERVAL_S = max(0.0, float(os.getenv("GEMINI_MIN_INTERVAL_MS", "0")) / 1000.0)

_gemini_semaphore: Optional[asyncio.Semaphore] = None
_gemini_last_call: float = 0.0
_gemini_pace_lock: Optional[asyncio.Lock] = None


def _get_semaphore() -> asyncio.Semaphore:
    # Lazy: el loop debe existir al crear primitivos asyncio.
    global _gemini_semaphore
    if _gemini_semaphore is None:
        _gemini_semaphore = asyncio.Semaphore(_GEMINI_MAX_CONCURRENCY)
    return _gemini_semaphore


def _get_pace_lock() -> asyncio.Lock:
    global _gemini_pace_lock
    if _gemini_pace_lock is None:
        _gemini_pace_lock = asyncio.Lock()
    return _gemini_pace_lock


async def _pace() -> None:
    """Asegura un intervalo mínimo entre llamadas a Gemini (si está configurado)."""
    if _GEMINI_MIN_INTERVAL_S <= 0:
        return
    global _gemini_last_call
    async with _get_pace_lock():
        wait = _GEMINI_MIN_INTERVAL_S - (time.monotonic() - _gemini_last_call)
        if wait > 0:
            await asyncio.sleep(wait)
        _gemini_last_call = time.monotonic()


# ── Pricing (USD por 1M tokens) ──────────────────────────────────────────────
# Fuente: https://ai.google.dev/pricing
_PRICING_USD_PER_1M = {
    "gemini-2.5-flash":          {"in": 0.075, "out": 0.30},
    "gemini-2.5-flash-lite":     {"in": 0.04,  "out": 0.15},
    "gemini-2.5-pro":            {"in": 1.25,  "out": 10.00},
    "gemini-2.0-flash":          {"in": 0.075, "out": 0.30},
    "gemini-2.0-flash-lite":     {"in": 0.04,  "out": 0.15},
    "gemini-1.5-flash":          {"in": 0.075, "out": 0.30},
    "gemini-1.5-pro":            {"in": 1.25,  "out": 5.00},
}
_PRICING_FALLBACK = _PRICING_USD_PER_1M["gemini-2.5-flash"]


def _gemini_cost(model: str, prompt_tokens: int, completion_tokens: int) -> float:
    p = _PRICING_USD_PER_1M.get(model, _PRICING_FALLBACK)
    return (prompt_tokens * p["in"] + completion_tokens * p["out"]) / 1_000_000.0


def gemini_available() -> bool:
    return _client is not None


_RETRYABLE_STATUS = {429, 503}
_MAX_RETRIES = 3


def _status_code(exc: Exception) -> Optional[int]:
    """Extrae el HTTP status de un error de google.genai (ServerError/ClientError)."""
    code = getattr(exc, "code", None) or getattr(exc, "status_code", None)
    try:
        return int(code) if code is not None else None
    except (TypeError, ValueError):
        return None


async def _generate_with_retry(*, model: str, prompt: str, config: dict) -> Any:
    """Llama a generate_content reintentando transitorios con backoff exponencial."""
    last_exc: Optional[Exception] = None
    for attempt in range(_MAX_RETRIES):
        try:
            return await _client.aio.models.generate_content(
                model=model,
                contents=prompt,
                config=genai_types.GenerateContentConfig(**config),
            )
        except Exception as e:  # noqa: BLE001
            last_exc = e
            if _status_code(e) not in _RETRYABLE_STATUS or attempt == _MAX_RETRIES - 1:
                raise
            backoff = 2 ** attempt  # 1s, 2s, 4s
            logger.warning(f"[gemini] {type(e).__name__} transitorio, retry {attempt+1}/{_MAX_RETRIES} en {backoff}s")
            await asyncio.sleep(backoff)
    raise last_exc  # pragma: no cover


async def generate_text(
    *,
    model: str,
    prompt: str,
    system_instruction: Optional[str] = None,
    max_output_tokens: int = 1024,
    temperature: float = 0.1,
    json_mode: bool = False,
) -> str:
    """Genera texto con Gemini y loggea uso en openai_usage.

    Devuelve el texto de respuesta (str).
    """
    if _client is None:
        raise RuntimeError(
            "Gemini no está disponible. Falta GEMINI_API_KEY o el SDK google-genai."
        )

    endpoint = _endpoint_ctx.get()
    modo = _modo_ctx.get()
    start = time.perf_counter()

    config: dict = {
        "temperature": temperature,
        "max_output_tokens": max_output_tokens,
    }
    if system_instruction:
        config["system_instruction"] = system_instruction
    if json_mode:
        config["response_mime_type"] = "application/json"
        # gemini-2.5-* trae "thinking" activado por defecto y los tokens de
        # razonamiento consumen el presupuesto de salida, truncando el JSON.
        # Para salidas estructuradas lo desactivamos.
        try:
            config["thinking_config"] = genai_types.ThinkingConfig(thinking_budget=0)
        except Exception:  # SDK viejo sin ThinkingConfig
            pass

    try:
        # google-genai aio surface: client.aio.models.generate_content(...)
        # Retry con backoff en transitorios (503 UNAVAILABLE / 429 RESOURCE_EXHAUSTED),
        # frecuentes en el free-tier y que de otro modo degradan 'ambos' a un solo motor.
        # Semáforo: limita la concurrencia global para no saturar el rate-limit.
        async with _get_semaphore():
            await _pace()
            response = await _generate_with_retry(model=model, prompt=prompt, config=config)
    except Exception:
        latency_ms = int((time.perf_counter() - start) * 1000)
        await asyncio.to_thread(
            _persist_usage,
            provider="gemini",
            model=model,
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
    usage = getattr(response, "usage_metadata", None)
    pt = int(getattr(usage, "prompt_token_count", 0) or 0)
    ct = int(getattr(usage, "candidates_token_count", 0) or 0)
    tt = int(getattr(usage, "total_token_count", 0) or (pt + ct))
    cost = _gemini_cost(model, pt, ct)

    try:
        await asyncio.to_thread(
            _persist_usage,
            provider="gemini",
            model=model,
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
        logger.warning(f"[gemini_usage] persistencia async falló: {e}")

    text = getattr(response, "text", None)
    if text:
        return text
    # Fallback: buscar en candidates
    try:
        return response.candidates[0].content.parts[0].text or ""
    except Exception:
        return ""
