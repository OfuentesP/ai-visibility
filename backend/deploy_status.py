"""Estado de publicación del sitio (para la página /estado/ que usa el editor de contenidos).

Consulta el último deploy en DigitalOcean App Platform y devuelve solo lo necesario
(fase, progreso, horas). El token de DigitalOcean nunca sale del backend.

Env:
  DO_API_TOKEN  token de DigitalOcean con scope de solo lectura (secreto, runtime)
  DO_APP_ID     ID de la app en App Platform
"""
import os
import time
import logging

import httpx
from fastapi import APIRouter

logger = logging.getLogger(__name__)
router = APIRouter()

_CACHE_TTL = 8  # segundos: la página consulta cada 15 s; esto protege la API de DO
_cache: dict = {"t": 0.0, "data": None}

_EN_CURSO = {"PENDING_BUILD", "BUILDING", "PENDING_DEPLOY", "DEPLOYING"}
_PUBLICADO = {"ACTIVE", "SUPERSEDED"}


def _resumen(dep: dict) -> dict:
    phase = dep.get("phase", "UNKNOWN")
    progress = dep.get("progress") or {}
    git = (dep.get("cause_details") or {}).get("git_push") or {}
    if phase in _EN_CURSO:
        estado = "publicando"
    elif phase in _PUBLICADO:
        estado = "publicado"
    elif phase == "ERROR":
        estado = "error"
    else:
        estado = "desconocido"
    return {
        "estado": estado,
        "fase": phase,
        "paso": progress.get("success_steps", 0),
        "pasos_total": progress.get("total_steps", 0),
        "iniciado": dep.get("created_at"),
        "actualizado": dep.get("updated_at"),
        "mensaje": next(iter((git.get("commit_message") or "").strip().splitlines()), None),
    }


async def _consultar_do() -> dict:
    token = os.getenv("DO_API_TOKEN")
    app_id = os.getenv("DO_APP_ID")
    if not token or not app_id:
        return {"estado": "no_configurado"}

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(
            f"https://api.digitalocean.com/v2/apps/{app_id}/deployments",
            params={"per_page": 5},
            headers={"Authorization": f"Bearer {token}"},
        )
        r.raise_for_status()
        deployments = r.json().get("deployments") or []

    # Un deploy cancelado suele ser reemplazado por uno más nuevo: se ignora.
    relevantes = [d for d in deployments if d.get("phase") != "CANCELED"]
    if not relevantes:
        return {"estado": "desconocido"}
    return _resumen(relevantes[0])


@router.get("/api/deploy-status")
async def deploy_status():
    now = time.monotonic()
    if _cache["data"] is not None and now - _cache["t"] < _CACHE_TTL:
        return _cache["data"]
    try:
        data = await _consultar_do()
    except Exception as e:  # noqa: BLE001 — la página debe degradar con gracia
        logger.warning("deploy-status: no se pudo consultar DigitalOcean: %s", e)
        return {"estado": "desconocido"}
    _cache.update(t=now, data=data)
    return data
