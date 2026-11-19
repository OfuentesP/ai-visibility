"""Estado de publicación del sitio (para la página /estado/ que usa el editor de contenidos).

Consulta el último deploy en DigitalOcean App Platform y devuelve solo lo necesario
(fase, progreso, horas y qué textos cambiaron). El token de DigitalOcean nunca sale del backend.

"Qué cambió" se calcula comparando content/home.json entre el commit desplegado y su
padre (el repo es público; GITHUB_TOKEN es opcional y solo sube el límite de la API).

Env:
  DO_API_TOKEN  token de DigitalOcean con scope de solo lectura (secreto, runtime)
  DO_APP_ID     ID de la app en App Platform
  GITHUB_TOKEN  opcional
"""
import os
import time
import logging
from typing import Any

import httpx
from fastapi import APIRouter

logger = logging.getLogger(__name__)
router = APIRouter()

_CACHE_TTL = 8  # segundos: la página consulta cada 15 s; esto protege la API de DO
_cache: dict = {"t": 0.0, "data": None}
_cambios_cache: dict[str, dict] = {}  # sha -> resultado (un commit nunca cambia)

_EN_CURSO = {"PENDING_BUILD", "BUILDING", "PENDING_DEPLOY", "DEPLOYING"}
_PUBLICADO = {"ACTIVE", "SUPERSEDED"}

CONTENT_PATH = "content/home.json"
MAX_CAMBIOS = 12
MAX_TEXTO = 160

# Mismos nombres que ve el editor en Tina (tina/config.ts).
_SECCIONES = {
    "whatsapp": "Número de WhatsApp",
    "hero": "Portada",
    "puntoCiego": "El punto ciego",
    "metodologia": "Cómo trabajamos",
    "entregables": "Qué te llevas",
    "diagnostico": "Ejemplo de diagnóstico",
    "comparativa": "GEO vs SEO (tabla)",
    "planes": "Planes y precios",
    "faq": "Preguntas frecuentes",
    "cierre": "Llamado final",
}
_CAMPOS = {
    "antetitulo": "Antetítulo", "titulo": "Título", "tituloMovil": "Título (celular)",
    "tituloLinea1": "Título — primera línea", "tituloLinea2": "Título — segunda línea",
    "tituloDestacado": "Título — parte en color", "tituloIntro": "Inicio del título",
    "descripcion": "Descripción", "descripcionMovil": "Descripción (celular)",
    "subtitulo": "Subtítulo", "subtituloMovil": "Subtítulo (celular)",
    "texto": "Texto", "textoMovil": "Texto (celular)", "botonTexto": "Texto del botón",
    "motores": "Motores", "ejemploPregunta": "Ejemplo de chat — pregunta",
    "ejemploIntro": "Ejemplo de chat — inicio de la respuesta",
    "ejemploRecomendado": "Ejemplo de chat — marca recomendada",
    "ejemploOtro": "Ejemplo de chat — segunda marca", "ejemploAlerta": "Ejemplo de chat — alerta",
    "etiquetaDestacado": "Etiqueta del paso destacado", "pasos": "Pasos", "destacado": "Destacado",
    "items": "", "icono": "Símbolo", "tarjetas": "Tarjetas", "etiqueta": "Etiqueta", "datos": "Datos",
    "nosotrosEtiqueta": "Columna Ai Visibility — etiqueta", "nosotrosNombre": "Columna Ai Visibility — nombre",
    "otrosEtiqueta": "Columna competencia — etiqueta", "otrosNombre": "Columna competencia — nombre",
    "filas": "", "nombre": "Nombre", "nosotros": "Ai Visibility", "otros": "Agencia SEO",
    "iconoOtros": "Ícono agencia SEO", "pieTexto": "Texto bajo la tabla", "pieBoton": "Enlace bajo la tabla",
    "sello": "Sello", "estilo": "Color de la tarjeta", "precio": "Precio", "unidad": "Bajo el precio",
    "incluye": "Qué incluye", "mensajeWhatsapp": "Mensaje de WhatsApp", "nota": "Nota",
    "grupos": "", "preguntas": "", "pregunta": "Pregunta", "respuesta": "Respuesta",
}
_NOMBRE_ITEM = ("nombre", "titulo", "pregunta")


def _corto(v: Any) -> str:
    if isinstance(v, bool):
        return "Sí" if v else "No"
    if isinstance(v, (dict, list)):
        return ""
    s = "" if v is None else str(v)
    return s if len(s) <= MAX_TEXTO else s[: MAX_TEXTO - 1] + "…"


def _nombre_item(item: Any, i: int) -> str:
    if isinstance(item, dict):
        for k in _NOMBRE_ITEM:
            if item.get(k):
                return _corto(item[k])
    return f"#{i + 1}"


def _diff(antes: Any, despues: Any, ruta: list[str], out: list[dict]) -> None:
    if antes == despues:
        return
    if isinstance(antes, dict) and isinstance(despues, dict):
        for k in list(antes.keys()) + [k for k in despues if k not in antes]:
            etiqueta = _SECCIONES.get(k) if not ruta else _CAMPOS.get(k, k)
            _diff(antes.get(k), despues.get(k), ruta + ([etiqueta] if etiqueta else []), out)
        return
    if isinstance(antes, list) and isinstance(despues, list):
        for i in range(max(len(antes), len(despues))):
            a = antes[i] if i < len(antes) else None
            d = despues[i] if i < len(despues) else None
            if a is None:
                out.append({"donde": " › ".join(ruta), "tipo": "agregado", "antes": "", "despues": _corto(d) or _nombre_item(d, i)})
            elif d is None:
                out.append({"donde": " › ".join(ruta), "tipo": "eliminado", "antes": _corto(a) or _nombre_item(a, i), "despues": ""})
            elif isinstance(a, dict) or isinstance(d, dict):
                _diff(a, d, ruta + [_nombre_item(d, i)], out)
            else:
                _diff(a, d, ruta, out)
        return
    out.append({"donde": " › ".join(ruta), "tipo": "modificado", "antes": _corto(antes), "despues": _corto(despues)})


async def _cambios_de_commit(client: httpx.AsyncClient, repo: str, sha: str) -> dict:
    if sha in _cambios_cache:
        return _cambios_cache[sha]
    headers = {"Accept": "application/vnd.github+json"}
    if os.getenv("GITHUB_TOKEN"):
        headers["Authorization"] = f"Bearer {os.environ['GITHUB_TOKEN']}"
    r = await client.get(f"https://api.github.com/repos/{repo}/commits/{sha}", headers=headers)
    r.raise_for_status()
    commit = r.json()
    archivos = [f.get("filename") for f in commit.get("files") or []]
    parents = commit.get("parents") or []
    if CONTENT_PATH not in archivos or not parents:
        res = {"tipo": "tecnico", "lista": []}
    else:
        raw = "https://raw.githubusercontent.com/{repo}/{ref}/" + CONTENT_PATH
        ra = await client.get(raw.format(repo=repo, ref=parents[0]["sha"]))
        rd = await client.get(raw.format(repo=repo, ref=sha))
        rd.raise_for_status()
        if ra.status_code == 404:  # el archivo se creó en este commit: no hay "antes"
            res = {"tipo": "tecnico", "lista": []}
        else:
            ra.raise_for_status()
            lista: list[dict] = []
            _diff(ra.json(), rd.json(), [], lista)
            res = {"tipo": "contenido", "lista": lista[:MAX_CAMBIOS], "mas": max(0, len(lista) - MAX_CAMBIOS)}
    _cambios_cache[sha] = res
    return res


def _resumen(dep: dict) -> dict:
    phase = dep.get("phase", "UNKNOWN")
    progress = dep.get("progress") or {}
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
        "cambios": None,
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
        dep = relevantes[0]
        data = _resumen(dep)

        git = (dep.get("cause_details") or {}).get("git_push") or {}
        sha = git.get("commit_sha")
        repo = (git.get("github") or {}).get("repo")
        if sha and repo:
            try:
                data["cambios"] = await _cambios_de_commit(client, repo, sha)
            except Exception as e:  # noqa: BLE001 — sin detalle de cambios, el estado igual sirve
                logger.warning("deploy-status: no se pudo calcular cambios de %s: %s", sha, e)
        else:
            # Deploy sin commit (p. ej. cambio de configuración en DigitalOcean).
            data["cambios"] = {"tipo": "tecnico", "lista": []}
    return data


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
