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

    try:
        # google-genai aio surface: client.aio.models.generate_content(...)
        response = await _client.aio.models.generate_content(
            model=model,
            contents=prompt,
            config=genai_types.GenerateContentConfig(**config),
        )
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
