from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
import os
from typing import List, Optional
import logging
from collections import Counter
import asyncio
import json
import uuid

from openai import AsyncOpenAI
import httpx
from pydantic import BaseModel, Field
from config import AI_MODEL, URL_CACHE_TTL, AUDIT_CACHE_TTL_DAYS
from models import ResultadoBusqueda, AnalisisMarca, OportunidadAuditada, DiscoveryResponse, MarketingBriefRequest, OmnichannelBrief
from database import get_db, test_connection, Lead, AuditCache, SharedReport

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)

# In-memory URL audit cache: {url -> (timestamp, result)}
import time as _time
import hashlib
from datetime import datetime, timedelta
_url_cache: dict = {}


def _cache_key(modo: str, marca: str, query: str = "") -> str:
    raw = f"{modo}|{marca.lower().strip()}|{query.lower().strip()}"
    return hashlib.sha256(raw.encode()).hexdigest()


def _get_cache(db, key: str):
    """Devuelve el resultado cacheado si existe y no expiró, si no None."""
    if db is None:
        return None
    try:
        from sqlalchemy import text
        now = datetime.utcnow()
        row = db.query(AuditCache).filter(
            AuditCache.cache_key == key,
            AuditCache.expires_at > now
        ).first()
        if row:
            logger.info(f"[cache] HIT {key[:12]}… expira {row.expires_at.date()}")
            return row
        return None
    except Exception as e:
        logger.warning(f"[cache] get error: {e}")
        return None


def _extract_score(resultado: dict, modo: str) -> float | None:
    try:
        if modo == "brand":
            return resultado.get("resultados", [{}])[0].get("invisibilidad_score")
        if modo == "url":
            return resultado.get("visibilidad_pct")
    except Exception:
        pass
    return None


def _set_cache(db, key: str, modo: str, marca: str, query: str, resultado: dict) -> tuple[float | None, str | None]:
    """Upsert del resultado en audit_cache. Retorna (prev_score, prev_created_at_iso)."""
    if db is None:
        return None, None
    try:
        now = datetime.utcnow()
        expires = now + timedelta(days=AUDIT_CACHE_TTL_DAYS)
        row = db.query(AuditCache).filter(AuditCache.cache_key == key).first()
        prev_score, prev_created_at_iso = None, None
        if row:
            prev_score = _extract_score(row.resultado, modo)
            prev_created_at_iso = row.created_at.isoformat() if row.created_at else None
            row.prev_score = prev_score
            row.prev_created_at = row.created_at
            row.resultado = resultado
            row.created_at = now
            row.expires_at = expires
            row.marca = marca
            row.query = query
        else:
            row = AuditCache(
                cache_key=key, modo=modo, marca=marca, query=query,
                resultado=resultado, created_at=now, expires_at=expires,
            )
            db.add(row)
        db.commit()
        logger.info(f"[cache] SET {key[:12]}… válido hasta {expires.date()}")
        return prev_score, prev_created_at_iso
    except Exception as e:
        db.rollback()
        logger.warning(f"[cache] set error: {e}")
        return None, None


def _check_freemium(db, email: str) -> bool:
    """Retorna True si el email alcanzó el límite gratuito (2 auditorías con resultado)."""
    if db is None or not email:
        return False
    try:
        count = db.query(Lead).filter(
            Lead.email == email.lower().strip(),
            Lead.resultado.isnot(None)
        ).count()
        return count >= 2
    except Exception:
        return False

_openai_api_key = os.getenv("OPENAI_API_KEY")
_openai_client = None
if _openai_api_key:
    _openai_client = AsyncOpenAI(
        api_key=_openai_api_key,
        timeout=httpx.Timeout(15.0, connect=5.0)
    )
else:
    logger.warning("⚠️  OPENAI_API_KEY not set. AI features disabled.")


class SanitizedInputs(BaseModel):
    marca_normalizada: str
    busqueda_corregida: str


def _input_looks_clean(s: str) -> bool:
    return s == s.strip() and "  " not in s


async def sanitizar_inputs(marca_raw: str, busqueda_raw: str) -> SanitizedInputs:
    """Normaliza marca y consulta usando LLM. Omite el LLM si ambos inputs ya parecen limpios."""
    if (
        _input_looks_clean(marca_raw)
        and marca_raw[:1].isupper()
        and _input_looks_clean(busqueda_raw)
    ):
        logger.debug(f"sanitizar_inputs: skip LLM (inputs limpios)")
        return SanitizedInputs(
            marca_normalizada=marca_raw.strip(),
            busqueda_corregida=busqueda_raw.strip(),
        )
    try:
        response = await _openai_client.chat.completions.create(
            model=AI_MODEL,
            max_tokens=100,
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Eres un experto en normalización de datos. Tu trabajo es corregir errores de tipeo, "
                        "espacios extra y capitalización en nombres de marcas y consultas de búsqueda. "
                        "Reglas: Si recibes 'bancodechile' o 'banco . de chile', devuelve 'Banco de Chile'. "
                        "Si recibes 'targeta de credito', devuelve 'tarjeta de crédito'. "
                        "Mantén la intención original de la búsqueda, solo corrige la ortografía y el formato. "
                        "Devuelve SOLO JSON con dos campos: marca_normalizada (str) y busqueda_corregida (str)."
                    )
                },
                {
                    "role": "user",
                    "content": f'marca: "{marca_raw}"\nbusqueda: "{busqueda_raw}"'
                }
            ]
        )
        data = json.loads(response.choices[0].message.content)
        return SanitizedInputs(
            marca_normalizada=data.get("marca_normalizada", marca_raw).strip(),
            busqueda_corregida=data.get("busqueda_corregida", busqueda_raw).strip()
        )
    except Exception as e:
        logger.warning(f"sanitizar_inputs falló ({e}), usando inputs originales")
        return SanitizedInputs(marca_normalizada=marca_raw.strip(), busqueda_corregida=busqueda_raw.strip())

app = FastAPI(
    title="AI Visibility - Brand Analysis API",
    description="API para análisis de visibilidad de marcas en motores de búsqueda con IA",
    version="0.1.0"
)

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "https://ai-visibility.cl",
    "https://www.ai-visibility.cl",
]

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin", "")
    headers = {"Access-Control-Allow-Origin": origin} if origin in origins else {}
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor"},
        headers=headers,
    )


@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Health check - verifica BD y API"""
    try:
        db.execute("SELECT 1")
        db_status = "ok"
    except Exception as e:
        logger.error(f"Database error: {e}")
        db_status = "error"
    
    return {
        "status": "ok",
        "service": "AI Visibility API",
        "version": "0.1.0",
        "database": db_status
    }


@app.get("/api/info")
async def api_info():
    """Información de la API"""
    return {
        "name": "AI Visibility",
        "description": "Auditoría y optimización para AI Search Engines",
        "version": "0.1.0",
        "features": [
            "Content audit across AI engines",
            "Brand visibility tracking",
            "Optimization recommendations",
            "Analytics & reporting"
        ]
    }



@app.on_event("startup")
async def startup_event():
    """Ejecuta al iniciar la aplicación"""
    logger.info("🚀 Starting AI Visibility API...")
    
    if test_connection():
        logger.info("✅ Database connection OK")
    else:
        logger.warning("⚠️  Database connection failed - check DATABASE_URL")


@app.get("/api/modelos/esquema")
async def obtener_esquema():
    """Retorna el esquema JSON de los modelos Pydantic"""
    return {
        "AnalisisMarca": AnalisisMarca.model_json_schema(),
        "ResultadoBusqueda": ResultadoBusqueda.model_json_schema()
    }


class AuditRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=200)
    brand: str = Field(..., min_length=1, max_length=120)
    email: Optional[str] = None


class DiscoveryRequest(BaseModel):
    brand: str = Field(..., min_length=1, max_length=120)
    topico: str = Field(..., min_length=1, max_length=200)


@app.post("/api/audit", response_model=ResultadoBusqueda)
@limiter.limit("10/minute")
async def audit_pipeline(
    request: Request,
    body: AuditRequest | None = None,
    query: str | None = None,
    brand: str | None = None,
    db: Session = Depends(get_db),
) -> ResultadoBusqueda:
    """
    Pipeline completo: Paso 2 (Buscar) + Paso 3 (Juzgar) + Paso 4 (Brief) + Paso 5 (Plan PRO) + Paso 6 (Prioridad Ejecutiva)
    Accepts JSON body {query, brand} or query params for backward compat.
    """
    # Resolve from body or query params
    q = (body.query if body else None) or query
    b = (body.brand if body else None) or brand
    if not q or not b:
        raise HTTPException(status_code=422, detail="query and brand are required")
    query = q[:200].strip()
    brand = b[:120].strip()
    email = (body.email if body else None)
    try:
        # ── Freemium check ────────────────────────────────────────────────
        if email and _check_freemium(db, email):
            raise HTTPException(status_code=429, detail="FREEMIUM_LIMIT")

        # Sanitizar inputs antes de procesar
        sanitized = await sanitizar_inputs(brand, query)
        brand = sanitized.marca_normalizada
        query = sanitized.busqueda_corregida
        logger.info(f"[Sanitized] brand='{brand}' query='{query}'")

        # ── Supabase cache check ──────────────────────────────────────────
        ck = _cache_key("brand", brand, query)
        cached_row = _get_cache(db, ck)
        if cached_row:
            data = cached_row.resultado
            data["from_cache"] = True
            data["cached_at"] = cached_row.created_at.isoformat()
            return ResultadoBusqueda(**data)

        from searcher import consultar_openai
        from judge import extraer_metricas, generar_prioridad_ejecutiva, extraer_conceptos_faltantes, calcular_estado_invisibilidad, generar_plan_accion
        from discovery import obtener_tendencias_chile, detectar_territorios_desatendidos

        # Paso 2: Searcher
        logger.info(f"[Paso 2] Buscando: {query}")
        texto_busqueda = await consultar_openai(query)

        # Paso 3: Judge
        logger.info(f"[Paso 3] Extrayendo métricas para: {brand}")
        resultado = await extraer_metricas(texto_busqueda, brand)

        # Paso 4: Prioridad Ejecutiva (Growth Strategist)
        logger.info(f"[Paso 4] Generando prioridad ejecutiva para: {brand}")
        prioridad = await generar_prioridad_ejecutiva(
            resultado.posicion_mi_marca,
            resultado.sentimiento,
            resultado.marca_ganadora,
            brand,
            texto_busqueda,
            resultado.recomendacion_ia
        )
        resultado.prioridad_ejecutiva = prioridad

        # Paso 5: Diagnóstico de Vacíos de Contenido (Content Gap Analysis)
        logger.info(f"[Paso 5] Analizando content gap para: {brand}")
        gap_data = await extraer_conceptos_faltantes(
            texto_busqueda,
            resultado.marca_ganadora,
            brand
        )
        resultado.percepciones_genericas = gap_data.get("percepciones_genericas", [])
        resultado.conceptos_faltantes = gap_data.get("diferenciadores_ganador", [])

        # Paso 6: Termómetro de Invisibilidad
        logger.info(f"[Paso 6] Calculando estado de invisibilidad para: {brand}")
        estado, score = calcular_estado_invisibilidad(
            resultado.posicion_mi_marca,
            resultado.sentimiento,
            resultado.marcas_mencionadas,
            brand
        )
        resultado.estado_invisibilidad = estado
        resultado.invisibilidad_score = score

        # Paso 7: Plan de Acción (Quick Wins + Estratégico)
        logger.info(f"[Paso 7] Generando plan de rescate para: {brand}")
        plan_accion = await generar_plan_accion(
            estado,
            resultado.posicion_mi_marca,
            resultado.marca_ganadora,
            brand,
            resultado.conceptos_faltantes,
            texto_busqueda,
            busqueda_usuario=query
        )
        resultado.plan_accion = plan_accion

        # Paso 8: Detectar Territorios Desatendidos (Gap Analysis)
        logger.info(f"[Paso 8] Detectando territorios desatendidos para: {brand}")
        try:
            tendencias = await obtener_tendencias_chile(query)
            comunicacion_actual = resultado.recomendacion_ia or f"Marca {brand} en mercado de {query}"
            territorios = await detectar_territorios_desatendidos(
                query,
                tendencias,
                brand,
                comunicacion_actual
            )
            from trends import enriquecer_territorios
            territorios = enriquecer_territorios(territorios)
            resultado.territorios_desatendidos = territorios
            logger.info(f"✅ Detectados {len(territorios)} territorios desatendidos")
        except Exception as e:
            logger.warning(f"⚠️  No se pudieron detectar territorios desatendidos: {e}")
            resultado.territorios_desatendidos = []

        # Paso 9: Tabla de Ventajas del Competidor
        rival = resultado.competidor_principal or resultado.marca_ganadora
        if rival and rival.lower() != brand.lower():
            logger.info(f"[Paso 10] Analizando ventajas de '{rival}' vs '{brand}'")
            try:
                from judge import analyze_competitor_advantage
                resultado.competitor_advantage = await analyze_competitor_advantage(
                    texto_busqueda, rival, brand
                )
            except Exception as e:
                logger.warning(f"⚠️  competitor_advantage falló: {e}")

        # Retornar ResultadoBusqueda completo
        res = ResultadoBusqueda(
            prompt_original=query,
            texto_original_ia=texto_busqueda,
            resultados=[resultado]
        )
        prev_score, prev_cached_at = _set_cache(db, ck, "brand", brand, query, res.model_dump(mode="json"))
        res.prev_score = prev_score
        res.prev_cached_at = prev_cached_at
        return res

    except Exception as e:
        logger.error(f"Error en pipeline: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/discovery", response_model=DiscoveryResponse)
async def discovery_masivo(
    body: DiscoveryRequest | None = None,
    brand: str | None = None,
    topico: str | None = None,
) -> DiscoveryResponse:
    """
    Escáner Concurrente: genera escenarios (PersonaHub + Google Trends) y
    audita cada pregunta en paralelo con asyncio.gather.
    Accepts JSON body {brand, topico} or query params for backward compat.
    """
    # Resolve from body or query params
    b = (body.brand if body else None) or brand
    t = (body.topico if body else None) or topico
    if not b or not t:
        raise HTTPException(status_code=422, detail="brand and topico are required")
    brand = b[:120].strip()
    topico = t[:200].strip()
    try:
        from discovery import obtener_tendencias_chile, generar_escenarios_ia
        from searcher import consultar_openai
        from judge import (
            extraer_metricas,
            extraer_conceptos_faltantes,
            calcular_estado_invisibilidad,
            generar_plan_accion,
            justificar_eleccion_arquetipo,
        )

        logger.info(f"🚀 [Discovery] topico='{topico}' brand='{brand}'")

        # ── 1. Tendencias + escenarios ──────────────────────────────────────
        tendencias = await obtener_tendencias_chile(topico)
        escenarios = await generar_escenarios_ia(topico, tendencias)
        logger.info(f"✅ {len(escenarios)} escenarios generados")

        # ── 1b. Base audit: posición real de mi_marca en el tópico ──────────
        texto_base = await consultar_openai(topico)
        resultado_base = await extraer_metricas(texto_base, brand)
        base_pos_mi_marca = resultado_base.posicion_mi_marca

        # ── 2. Auditoría individual (con timeout) ───────────────────────────
        async def auditar_uno(escenario: dict) -> OportunidadAuditada:
            perfil   = escenario.get("perfil_base", "")
            pregunta = escenario.get("prompt_ia", "")

            try:
                async def _pipeline():
                    texto = await consultar_openai(pregunta)
                    resultado = await extraer_metricas(texto, brand)

                    # content gap analysis
                    gap_data = await extraer_conceptos_faltantes(
                        texto, resultado.marca_ganadora, brand
                    )
                    resultado.percepciones_genericas = gap_data.get("percepciones_genericas", [])
                    conceptos = gap_data.get("diferenciadores_ganador", [])
                    resultado.conceptos_faltantes = conceptos

                    # estado de invisibilidad
                    estado, score = calcular_estado_invisibilidad(
                        resultado.posicion_mi_marca,
                        resultado.sentimiento,
                        resultado.marcas_mencionadas,
                        brand,
                    )
                    resultado.estado_invisibilidad = estado
                    resultado.invisibilidad_score  = score

                    # plan de acción liviano (solo si invisible/en riesgo)
                    if estado in ("invisible", "en_riesgo"):
                        plan = await generar_plan_accion(
                            estado,
                            resultado.posicion_mi_marca,
                            resultado.marca_ganadora,
                            brand,
                            conceptos,
                            texto,
                            busqueda_usuario=escenario.get('query', ''),
                        )
                        resultado.plan_accion = plan

                    return texto, resultado

                texto_raw, analisis = await asyncio.wait_for(_pipeline(), timeout=55.0)

                # ── Guards + Justificación (mismo pipeline que batch_qa) ──
                marca_elegida = analisis.marca_ganadora or ""
                pos_mi_marca = analisis.posicion_mi_marca
                brand_lower = brand.lower()

                # GUARD A: Anti-Resurrección
                if base_pos_mi_marca == 0:
                    if marca_elegida and marca_elegida.lower() == brand_lower:
                        otras = [m for m in analisis.marcas_mencionadas
                                 if m.lower() != brand_lower]
                        marca_elegida = otras[0] if otras else analisis.competidor_principal or "Sin marca dominante"
                    if pos_mi_marca > 0:
                        pos_mi_marca = 0

                # GUARD B: Anti-Horóscopo + Dealbreaker + Consideration Set
                veredicto = await justificar_eleccion_arquetipo(
                    texto_raw,
                    marca_elegida,
                    escenario.get("arquetipo", ""),
                    escenario.get("driver", ""),
                    escenario.get("dealbreaker", ""),
                    brand,
                    analisis.marcas_mencionadas,
                    texto_base=texto_base,
                )

                return OportunidadAuditada(
                    arquetipo=escenario.get("arquetipo", ""),
                    necesidad_principal=escenario.get("driver", ""),
                    segmento=perfil[:200],
                    tendencia_base=escenario.get("razon", ""),
                    pregunta_generada=pregunta,
                    marca_elegida=marca_elegida,
                    justificacion_basada_en_datos=veredicto["justificacion"],
                    segunda_opcion=veredicto["segunda_opcion"],
                    factor_desempate=veredicto["factor_desempate"],
                    certeza=veredicto["certeza"],
                    dealbreaker_activado=veredicto["dealbreaker_activado"],
                    dealbreaker_detalle=veredicto["dealbreaker_detalle"],
                    resultado_auditoria=analisis,
                )

            except asyncio.TimeoutError:
                logger.warning(f"⏱ Timeout auditando escenario: {pregunta[:60]}")
                return OportunidadAuditada(
                    arquetipo=escenario.get("arquetipo", ""),
                    necesidad_principal=escenario.get("driver", ""),
                    segmento=perfil[:200],
                    tendencia_base=escenario.get("razon", ""),
                    pregunta_generada=pregunta,
                    resultado_auditoria=AnalisisMarca(
                        marcas_mencionadas=[],
                        marca_ganadora="Múltiples competidores",
                        competidor_principal="Múltiples competidores",
                        posicion_mi_marca=0,
                        sentimiento="neutral",
                        recomendacion_ia="Análisis no disponible por timeout.",
                        content_ideas=[],
                        plan_accion_pro="",
                        conceptos_faltantes=[],
                        estado_invisibilidad="invisible",
                        invisibilidad_score=0,
                    ),
                    error="timeout",
                )
            except Exception as exc:
                logger.error(f"\u274c Error en escenario: {exc}")
                return OportunidadAuditada(
                    arquetipo=escenario.get("arquetipo", ""),
                    necesidad_principal=escenario.get("driver", ""),
                    segmento=perfil[:200],
                    tendencia_base=escenario.get("razon", ""),
                    pregunta_generada=pregunta,
                    resultado_auditoria=AnalisisMarca(
                        marcas_mencionadas=[],
                        marca_ganadora="Empate t\u00e9cnico",
                        competidor_principal="Empate t\u00e9cnico",
                        posicion_mi_marca=0,
                        sentimiento="neutral",
                        recomendacion_ia="Análisis no disponible por error.",
                        content_ideas=[],
                        plan_accion_pro="",
                        conceptos_faltantes=[],
                        estado_invisibilidad="invisible",
                        invisibilidad_score=0,
                    ),
                    error=str(exc),
                )

        # ── 3. gather concurrente ───────────────────────────────────────────
        logger.info(f"⚡ Lanzando {len(escenarios)} auditorías en paralelo...")
        oportunidades: list[OportunidadAuditada] = list(
            await asyncio.gather(*[auditar_uno(esc) for esc in escenarios])
        )

        # ── 3b. GUARD C: Anti-Eco (diversidad) ─────────────────────────────
        ops_ok = [op for op in oportunidades if not op.error and op.marca_elegida]
        if len(ops_ok) >= 2:
            elegidas = [op.marca_elegida.lower() for op in ops_ok]
            if len(set(elegidas)) == 1:
                logger.warning(f"⚠️ EFECTO_ECO: Todos los arquetipos eligieron '{ops_ok[0].marca_elegida}'")

        # ── 4. Amenaza principal ────────────────────────────────────────────
        ganadoras = [
            op.resultado_auditoria.marca_ganadora
            for op in oportunidades
            if not op.error and op.resultado_auditoria.marca_ganadora
        ]
        amenaza = Counter(ganadoras).most_common(1)[0][0] if ganadoras else None
        errores = sum(1 for op in oportunidades if op.error)

        logger.info(
            f"✅ [Discovery] completado | auditados={len(oportunidades)} "
            f"errores={errores} amenaza='{amenaza}'"
        )

        return DiscoveryResponse(
            marca_analizada=brand,
            topico=topico,
            oportunidades_auditadas=oportunidades,
            amenaza_principal=amenaza,
            total_auditados=len(oportunidades) - errores,
            total_errores=errores,
        )

    except Exception as e:
        logger.error(f"❌ Error en /api/discovery: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── /api/audit/from-url ─────────────────────────────────────────────────────

class AuditFromUrlRequest(BaseModel):
    url: str = Field(..., description="URL del sitio web del cliente a auditar")
    pais: str = Field(default="Chile", description="País de referencia para las queries")
    email: Optional[str] = None


class AuditFromUrlResponse(BaseModel):
    marca: str
    categoria: str
    mercado: str
    diferenciadores: list[str]
    resumen_pagina: str
    arquetipos: list[dict]         # 3 arquetipos dinámicos generados para esta categoría
    resultados: list[dict]          # 1 resultado por arquetipo (query + auditoría IA)
    queries_con_mencion: int
    total_queries: int
    visibilidad_pct: float
    plan_accion: dict = {}
    keyword_trend: str = "Estable"
    competitive_deep_dive: dict = {}
    untapped_territories: list = []
    from_cache: bool = False
    cached_at: Optional[str] = None
    prev_score: Optional[float] = None
    prev_cached_at: Optional[str] = None


@app.post("/api/audit/from-url", response_model=AuditFromUrlResponse)
@limiter.limit("10/minute")
async def audit_from_url(request: Request, body: AuditFromUrlRequest, db: Session = Depends(get_db)) -> AuditFromUrlResponse:
    """
    Pipeline completo desde URL:
    1. Scraping de la página
    2. GPT infiere marca, categoría, diferenciadores
    3. GPT genera 3 arquetipos de compradores específicos para esa categoría
    4. Cada arquetipo genera su propia query de búsqueda en ChatGPT
    5. Audita cada query y detecta si la marca aparece en la respuesta de la IA
    6. Retorna score de visibilidad + detalle por arquetipo
    """
    from url_analyzer import analizar_url
    from discovery import generar_escenarios_ia
    from searcher import consultar_openai
    from judge import extraer_metricas

    # Validar URL básica
    url = body.url.strip()
    if not url.startswith(("http://", "https://")):
        raise HTTPException(status_code=422, detail="La URL debe comenzar con http:// o https://")

    # ── Freemium check ────────────────────────────────────────────────────
    if body.email and _check_freemium(db, body.email):
        raise HTTPException(status_code=429, detail="FREEMIUM_LIMIT")

    # ── Supabase cache check ──────────────────────────────────────────────
    url_ck = _cache_key("url", url)
    cached_row = _get_cache(db, url_ck)
    if cached_row:
        data = cached_row.resultado
        data["from_cache"] = True
        data["cached_at"] = cached_row.created_at.isoformat()
        return AuditFromUrlResponse(**data)

    # ── In-memory fallback cache ──────────────────────────────────────────
    mem_key = f"{url}|{body.pais or ''}"
    cached = _url_cache.get(mem_key)
    if cached:
        ts, result = cached
        if _time.time() - ts < URL_CACHE_TTL:
            logger.info(f"[from-url] Mem-cache hit: {url}")
            return result
        else:
            del _url_cache[mem_key]

    try:
        # ── 1. Scraping + comprensión + arquetipos dinámicos ─────────────
        logger.info(f"[from-url] Analizando: {url}")
        context = await analizar_url(url, pais_hint=body.pais)
        logger.info(f"[from-url] marca='{context.marca}' arquetipos={len(context.arquetipos)}")

        # ── 2. Cada arquetipo genera su query específica ─────────────────
        # generar_escenarios_ia acepta arquetipos dinámicos via parámetro 'personas'
        escenarios = await generar_escenarios_ia(
            topico=context.categoria,
            tendencias=[],             # sin Google Trends para esta vía (más rápido)
            personas=context.arquetipos,
        )
        logger.info(f"[from-url] {len(escenarios)} escenarios generados por arquetipos")

        # ── 3. Auditoría concurrente: 1 query por arquetipo ──────────────
        async def auditar_escenario(escenario: dict) -> dict:
            query = escenario.get("prompt_ia", "")
            try:
                texto_ia = await asyncio.wait_for(consultar_openai(query), timeout=30.0)
                analisis = await extraer_metricas(texto_ia, context.marca)
                mencionada = analisis.posicion_mi_marca > 0
                return {
                    "arquetipo": escenario.get("arquetipo", ""),
                    "driver": escenario.get("driver", ""),
                    "dealbreaker": escenario.get("dealbreaker", ""),
                    "query": query,
                    "mencionada": mencionada,
                    "posicion": analisis.posicion_mi_marca,
                    "marcas_mencionadas": analisis.marcas_mencionadas[:6],
                    "marca_ganadora": analisis.marca_ganadora,
                    "sentimiento": analisis.sentimiento,
                    "snippet": analisis.recomendacion_ia or "",
                    "competitor_winning_reasons": analisis.competitor_winning_reasons,
                    "cited_sources_types": analisis.cited_sources_types,
                }
            except asyncio.TimeoutError:
                return {
                    "arquetipo": escenario.get("arquetipo", ""),
                    "driver": escenario.get("driver", ""),
                    "dealbreaker": escenario.get("dealbreaker", ""),
                    "query": query, "mencionada": False, "posicion": 0,
                    "marcas_mencionadas": [], "marca_ganadora": "",
                    "sentimiento": "neutral", "snippet": "", "error": "timeout",
                }
            except Exception as exc:
                logger.warning(f"[from-url] Error en escenario '{query[:50]}': {exc}")
                return {
                    "arquetipo": escenario.get("arquetipo", ""),
                    "driver": escenario.get("driver", ""),
                    "dealbreaker": escenario.get("dealbreaker", ""),
                    "query": query, "mencionada": False, "posicion": 0,
                    "marcas_mencionadas": [], "marca_ganadora": "",
                    "sentimiento": "neutral", "snippet": "", "error": str(exc),
                }

        logger.info(f"[from-url] Auditando {len(escenarios)} escenarios en paralelo...")
        resultados: list[dict] = list(
            await asyncio.gather(*[auditar_escenario(e) for e in escenarios])
        )

        # ── 4. Métricas globales ─────────────────────────────────────────
        total = len(resultados)
        con_mencion = sum(1 for r in resultados if r.get("mencionada"))
        visibilidad_pct = round(con_mencion / total * 100, 1) if total > 0 else 0.0

        logger.info(f"[from-url] ✅ visibilidad={visibilidad_pct}% ({con_mencion}/{total})")

        # ── 4b. Tendencia de mercado via Google Trends ───────────────────
        from trends import get_keyword_trend_direction
        keyword_trend = await asyncio.to_thread(get_keyword_trend_direction, context.categoria)
        logger.info(f"[from-url] Trend '{context.categoria}': {keyword_trend}")

        # ── 5. Plan de acción AEO ────────────────────────────────────────
        from url_analyzer import generar_plan_url, generar_inteligencia_competitiva
        plan, intel = await asyncio.gather(
            generar_plan_url(
                marca=context.marca,
                categoria=context.categoria,
                mercado=context.mercado,
                diferenciadores=context.diferenciadores,
                resultados=resultados,
            ),
            generar_inteligencia_competitiva(
                marca=context.marca,
                categoria=context.categoria,
                mercado=context.mercado,
                resultados=resultados,
            ),
        )
        logger.info(f"[from-url] Plan: {len(plan.get('vehiculos', []))} vehículos")
        logger.info(f"[from-url] Intel competitiva: competidor={intel.get('competitive_deep_dive', {}).get('competidor', 'N/A')}")

        result = AuditFromUrlResponse(
            marca=context.marca,
            categoria=context.categoria,
            mercado=context.mercado,
            diferenciadores=context.diferenciadores,
            resumen_pagina=context.resumen_pagina,
            arquetipos=context.arquetipos,
            resultados=resultados,
            queries_con_mencion=con_mencion,
            total_queries=total,
            visibilidad_pct=visibilidad_pct,
            plan_accion=plan,
            keyword_trend=keyword_trend,
            competitive_deep_dive=intel.get("competitive_deep_dive", {}),
            untapped_territories=intel.get("untapped_territories", []),
        )
        _url_cache[mem_key] = (_time.time(), result)
        prev_score, prev_cached_at = _set_cache(db, url_ck, "url", url, "", result.model_dump(mode="json"))
        result.prev_score = prev_score
        result.prev_cached_at = prev_cached_at
        return result

    except HTTPException:
        raise
    except httpx.HTTPStatusError as e:
        status = e.response.status_code
        if status == 403:
            msg = f"El sitio bloqueó el acceso ({status}). Algunos sitios impiden el análisis automático."
        elif status == 404:
            msg = f"La URL no existe ({status}). Verifica que la dirección sea correcta."
        elif status in (401, 407):
            msg = f"El sitio requiere autenticación ({status}). Solo se pueden auditar páginas públicas."
        elif status >= 500:
            msg = f"El sitio está con problemas técnicos ({status}). Inténtalo más tarde."
        else:
            msg = f"El sitio respondió con error {status}. Verifica que la URL sea correcta y pública."
        logger.warning(f"[from-url] HTTP {status} al acceder a {url}")
        raise HTTPException(status_code=422, detail=msg)
    except httpx.ConnectError:
        logger.warning(f"[from-url] No se pudo conectar a {url}")
        raise HTTPException(status_code=422, detail="No se pudo conectar al sitio. Verifica que la URL sea correcta y el sitio esté en línea.")
    except httpx.TimeoutException:
        logger.warning(f"[from-url] Timeout al acceder a {url}")
        raise HTTPException(status_code=422, detail="El sitio tardó demasiado en responder. Inténtalo más tarde.")
    except Exception as e:
        logger.error(f"❌ Error en /api/audit/from-url: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── /api/audit/comparison ────────────────────────────────────────────────────

class ComparisonRequest(BaseModel):
    marca_a: str = Field(..., description="Primera marca a comparar")
    marca_b: str = Field(..., description="Segunda marca a comparar (el rival)")
    categoria: str = Field(..., description="Categoría o rubro del mercado (ej: 'jeans de mujer')")
    mercado: str = Field(default="Chile", description="País de referencia")


class ComparisonResponse(BaseModel):
    marca_a: str
    marca_b: str
    categoria: str
    ventajas_marca_a: list[str]
    debilidades_marca_a: list[str]
    ventajas_marca_b: list[str]
    debilidades_marca_b: list[str]
    veredicto_ia: str
    marca_recomendada: str
    razon_recomendacion: str
    score_marca_a: int   # 0-100 según percepción IA
    score_marca_b: int


@app.post("/api/audit/comparison", response_model=ComparisonResponse)
@limiter.limit("10/minute")
async def audit_comparison(request: Request, body: ComparisonRequest) -> ComparisonResponse:
    """
    Compara dos marcas en una categoría desde la perspectiva de la IA.
    Devuelve ventajas, debilidades y veredicto estructurado.
    """
    if not _openai_client:
        raise HTTPException(status_code=503, detail="OpenAI API key no configurada")

    prompt = f"""Eres un motor de búsqueda con IA (como ChatGPT o Perplexity) en {body.mercado}.
Un usuario pregunta: "¿Cuál es mejor entre {body.marca_a} y {body.marca_b} para {body.categoria}?"

Analiza AMBAS marcas con el conocimiento que tienes sobre ellas hasta tu fecha de corte.
Sé directo, concreto y basado en percepción real del mercado, no en suposiciones genéricas.

Devuelve SOLO JSON con exactamente esta estructura:
{{
  "ventajas_marca_a": ["ventaja 1 concreta", "ventaja 2", "ventaja 3"],
  "debilidades_marca_a": ["debilidad 1 concreta", "debilidad 2"],
  "ventajas_marca_b": ["ventaja 1 concreta", "ventaja 2", "ventaja 3"],
  "debilidades_marca_b": ["debilidad 1 concreta", "debilidad 2"],
  "veredicto_ia": "Párrafo de 2-3 oraciones explicando por qué recomendarías una sobre la otra para {body.categoria} en {body.mercado}. Menciona ambas marcas por nombre.",
  "marca_recomendada": "{body.marca_a} o {body.marca_b} — solo el nombre de la que recomendarías",
  "razon_recomendacion": "Una oración concisa con el factor decisivo",
  "score_marca_a": 75,
  "score_marca_b": 68
}}

REGLAS:
- Los scores reflejan la percepción y presencia de cada marca en la IA (0-100)
- Si no conoces bien una marca, indícalo en las debilidades ("Poca presencia en fuentes de IA")
- No inventes datos específicos (precios, fechas exactas)
- Las ventajas/debilidades deben ser específicas para {body.categoria}, no genéricas"""

    try:
        response = await _openai_client.chat.completions.create(
            model=AI_MODEL,
            max_tokens=700,
            temperature=0.3,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        f"Eres un motor de IA analizando marcas en {body.mercado}. "
                        "Devuelve SOLO JSON válido. Sé específico y directo."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
        )

        data = json.loads(response.choices[0].message.content)

        return ComparisonResponse(
            marca_a=body.marca_a,
            marca_b=body.marca_b,
            categoria=body.categoria,
            ventajas_marca_a=data.get("ventajas_marca_a", []),
            debilidades_marca_a=data.get("debilidades_marca_a", []),
            ventajas_marca_b=data.get("ventajas_marca_b", []),
            debilidades_marca_b=data.get("debilidades_marca_b", []),
            veredicto_ia=data.get("veredicto_ia", ""),
            marca_recomendada=data.get("marca_recomendada", ""),
            razon_recomendacion=data.get("razon_recomendacion", ""),
            score_marca_a=int(data.get("score_marca_a", 50)),
            score_marca_b=int(data.get("score_marca_b", 50)),
        )

    except Exception as e:
        logger.error(f"[comparison] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── /api/trends/related ──────────────────────────────────────────────────────

class TrendsRelatedRequest(BaseModel):
    queries: list[str] = Field(..., description="Queries de usuarios sintéticos para buscar en Google Trends")
    geo: str = Field(default="CL", description="Código de país para Google Trends")
    max_per_query: int = Field(default=5, description="Máximo de queries relacionadas por cada query de entrada")


class TrendItem(BaseModel):
    query: str
    value: int          # interés relativo 0-100
    fuente: str         # query sintética que generó este resultado


class TrendsRelatedResponse(BaseModel):
    resultados: list[TrendItem]
    total: int
    geo: str


@app.post("/api/trends/related", response_model=TrendsRelatedResponse)
async def trends_related(body: TrendsRelatedRequest) -> TrendsRelatedResponse:
    """
    Recibe las queries de los usuarios sintéticos y devuelve las búsquedas
    relacionadas de mayor volumen en Google Trends, deduplicadas y ordenadas.
    """
    import asyncio
    from pytrends.request import TrendReq

    def _fetch_related(query: str, geo: str, max_per_query: int) -> list[dict]:
        """Llamada síncrona a pytrends — se ejecuta en threadpool."""
        try:
            pt = TrendReq(hl="es-CL", tz=360, timeout=(6, 12))
            pt.build_payload([query], cat=0, timeframe="now 7-d", geo=geo)
            related = pt.related_queries()
            if not related or query not in related:
                return []
            top = related[query].get("top")
            if top is None or top.empty:
                return []
            rows = top.head(max_per_query).to_dict(orient="records")
            return [{"query": r["query"], "value": int(r["value"]), "fuente": query} for r in rows]
        except Exception as e:
            logger.warning(f"[trends/related] '{query[:40]}': {e}")
            return []

    loop = asyncio.get_event_loop()
    tasks = [
        loop.run_in_executor(None, _fetch_related, q, body.geo, body.max_per_query)
        for q in body.queries[:6]          # máx 6 queries para no agotar la cuota
    ]
    results_nested = await asyncio.gather(*tasks)

    # Aplanar, deduplicar por query (mantener el de mayor value), ordenar
    seen: dict[str, TrendItem] = {}
    for batch in results_nested:
        for item in batch:
            key = item["query"].lower().strip()
            if key not in seen or item["value"] > seen[key].value:
                seen[key] = TrendItem(**item)

    sorted_items = sorted(seen.values(), key=lambda x: x.value, reverse=True)

    logger.info(f"[trends/related] {len(sorted_items)} queries únicas para {len(body.queries)} inputs")
    return TrendsRelatedResponse(
        resultados=sorted_items,
        total=len(sorted_items),
        geo=body.geo,
    )


# ── /api/audit/citability ────────────────────────────────────────────────────

# Marcas líderes globales y retailers chilenos que significan dificultad ALTA
_MARCAS_LIDERES = {
    # Jeans / Ropa global
    "levi's", "levis", "diesel", "wrangler", "lee", "calvin klein", "tommy hilfiger",
    "gap", "h&m", "zara", "uniqlo", "forever 21", "pull&bear", "bershka",
    # Retailers chilenos grandes (dificultad alta = ya están dominando)
    "falabella", "paris", "ripley", "la polar", "abcdin",
    # Deporte
    "nike", "adidas", "puma", "under armour", "new balance",
    # Genéricos grandes
    "amazon", "mercadolibre", "aliexpress",
}

# Fuentes genéricas / ambiguas → dificultad BAJA
_FUENTES_GENERICAS = {
    "blog", "revista", "guía", "consejos", "tips", "artículo", "post",
    "medium", "quora", "reddit", "wikipedia", "pinterest",
}


def calculate_citability_score(marcas_mencionadas: list[str]) -> dict:
    """
    Calcula el score de dificultad de un territorio (0-100).
    Bajo = fácil de posicionar (oportunidad). Alto = dominado por líderes.

    Returns:
        dict con keys: score (int), nivel (str), razon (str)
    """
    if not marcas_mencionadas:
        return {
            "score": 15,
            "nivel": "baja",
            "razon": "La IA no identifica ninguna marca clara — territorio sin dueño."
        }

    normalized = [m.lower().strip() for m in marcas_mencionadas]

    # Contar cuántas son líderes
    lideres_presentes = [m for m in normalized if any(lider in m for lider in _MARCAS_LIDERES)]
    genericas_presentes = [m for m in normalized if any(g in m for g in _FUENTES_GENERICAS)]

    proporcion_lideres = len(lideres_presentes) / len(normalized)

    if proporcion_lideres >= 0.5:
        score = 85 + min(10, len(lideres_presentes) * 3)
        return {
            "score": min(score, 99),
            "nivel": "alta",
            "razon": f"La IA menciona directamente a {', '.join(set(lideres_presentes[:2]))} — territorio dominado."
        }
    elif proporcion_lideres > 0:
        score = 55 + int(proporcion_lideres * 30)
        return {
            "score": score,
            "nivel": "media",
            "razon": f"La IA mezcla marcas líderes con otras — hay espacio pero hay competencia."
        }
    elif genericas_presentes:
        score = 20
        return {
            "score": score,
            "nivel": "baja",
            "razon": "La IA responde con blogs o consejos genéricos — sin marca dominante local."
        }
    else:
        # Marcas desconocidas o extranjeras no líderes → oportunidad
        score = 30
        return {
            "score": score,
            "nivel": "baja",
            "razon": "La IA menciona marcas poco conocidas o extranjeras — posicionamiento local viable."
        }


class CitabilityRequest(BaseModel):
    marca: str = Field(..., description="Tu marca (ej: 'Amalia Jeans')")
    categoria: str = Field(..., description="Categoría de producto (ej: 'jeans de mujer Chile')")
    mercado: str = Field(default="Chile", description="País de referencia")
    num_territorios: int = Field(default=12, ge=6, le=20)


class CitabilityTerritory(BaseModel):
    query: str
    dificultad: int          # 0-100 (bajo = oportunidad)
    nivel: str               # "baja" | "media" | "alta"
    marcas_mencionadas: list[str]
    razon: str
    recomendacion: str       # Acción concreta para capturar este territorio


class CitabilityResponse(BaseModel):
    marca: str
    categoria: str
    territorios: list[CitabilityTerritory]   # sorted por dificultad ASC
    resumen: str
    total_bajas: int
    total_medias: int
    total_altas: int


@app.post("/api/audit/citability", response_model=CitabilityResponse)
@limiter.limit("10/minute")
async def audit_citability(request: Request, body: CitabilityRequest) -> CitabilityResponse:
    """
    Gap Analysis de Territorios: encuentra queries donde la IA no tiene respuesta
    favorita clara y la marca podría posicionarse fácilmente.
    """
    if not _openai_client:
        raise HTTPException(status_code=503, detail="OpenAI API key no configurada")

    # ── Paso 1: Generar queries de nicho ────────────────────────────────────
    gen_prompt = f"""Eres un experto en AEO (Answer Engine Optimization) para {body.mercado}.
Tu tarea: generar {body.num_territorios} queries de nicho muy específicas sobre "{body.categoria}" en {body.mercado}.

Reglas:
- Cada query debe ser una pregunta real que haría un comprador concreto
- Deben cubrir nichos específicos: post-parto, tallas grandes, ocasiones especiales, materiales, dudas técnicas, comparativas de precio, etc.
- Deben ser búsquedas en español, naturales para Chile
- NO incluyas el nombre "{body.marca}" en las queries (queremos ver si la IA ya tiene respuesta sin tu ayuda)

Devuelve SOLO JSON:
{{"queries": ["query 1", "query 2", ..., "query {body.num_territorios}"]}}"""

    try:
        gen_response = await _openai_client.chat.completions.create(
            model=AI_MODEL,
            max_tokens=400,
            temperature=0.8,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "Generador de queries de nicho. Devuelve SOLO JSON válido."},
                {"role": "user", "content": gen_prompt},
            ],
        )
        queries_data = json.loads(gen_response.choices[0].message.content)
        queries = queries_data.get("queries", [])[:body.num_territorios]
    except Exception as e:
        logger.error(f"[citability] Error generando queries: {e}")
        raise HTTPException(status_code=500, detail="Error generando territorios")

    if not queries:
        raise HTTPException(status_code=500, detail="No se generaron queries")

    # ── Paso 2: Mini-auditoría paralela ─────────────────────────────────────
    async def audit_one(query: str) -> CitabilityTerritory:
        audit_prompt = f"""Eres ChatGPT/Perplexity respondiendo en {body.mercado}.
Un usuario pregunta: "{query}"

Responde como lo harías normalmente. Luego devuelve SOLO JSON con:
{{
  "marcas_mencionadas": ["marca1", "marca2"],   // marcas, tiendas, blogs o fuentes que citarías
  "recomendacion_para_{body.marca.replace(' ', '_')}": "Qué debería publicar o crear {body.marca} para aparecer en esta respuesta (1-2 oraciones accionables)"
}}

Si no mencionarías ninguna marca específica, devuelve marcas_mencionadas como lista vacía o con fuentes genéricas como ["blogs de moda", "guías generales"]."""

        try:
            resp = await _openai_client.chat.completions.create(
                model=AI_MODEL,
                max_tokens=300,
                temperature=0.2,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "Motor de búsqueda IA. Devuelve SOLO JSON."},
                    {"role": "user", "content": audit_prompt},
                ],
                timeout=12,
            )
            data = json.loads(resp.choices[0].message.content)
            marcas = data.get("marcas_mencionadas", [])
            recomendacion_key = f"recomendacion_para_{body.marca.replace(' ', '_')}"
            recomendacion = data.get(recomendacion_key) or data.get("recomendacion", "Crear contenido específico sobre este tema.")

        except Exception as e:
            logger.warning(f"[citability] query '{query[:40]}' falló: {e}")
            marcas = []
            recomendacion = "Crear contenido específico sobre este tema en el blog."

        score_data = calculate_citability_score(marcas)
        return CitabilityTerritory(
            query=query,
            dificultad=score_data["score"],
            nivel=score_data["nivel"],
            marcas_mencionadas=marcas,
            razon=score_data["razon"],
            recomendacion=recomendacion,
        )

    territorios = await asyncio.gather(*[audit_one(q) for q in queries])

    # ── Paso 3: Ordenar por dificultad ASC (mejores oportunidades primero) ──
    territorios_sorted = sorted(territorios, key=lambda t: t.dificultad)

    bajas = [t for t in territorios_sorted if t.nivel == "baja"]
    medias = [t for t in territorios_sorted if t.nivel == "media"]
    altas = [t for t in territorios_sorted if t.nivel == "alta"]

    resumen = (
        f"Se encontraron {len(bajas)} territorios de oportunidad inmediata, "
        f"{len(medias)} de dificultad media y {len(altas)} ya dominados por marcas líderes. "
        f"Prioriza los territorios en verde: publica un artículo o landing page esta semana."
    )

    return CitabilityResponse(
        marca=body.marca,
        categoria=body.categoria,
        territorios=list(territorios_sorted),
        resumen=resumen,
        total_bajas=len(bajas),
        total_medias=len(medias),
        total_altas=len(altas),
    )


# ──────────────────────────────────────────────────────────────
# MARKETING BRIEF — Omnicanal + FAQs estratégicas
# ──────────────────────────────────────────────────────────────


@app.post("/api/marketing/brief", response_model=OmnichannelBrief)
async def generate_marketing_brief(body: MarketingBriefRequest) -> OmnichannelBrief:
    """
    Traduce una Oportunidad de Mercado detectada por la IA en un plan de contenidos
    omnicanal listo para ejecutar (blog, Instagram, e-commerce) + FAQs estratégicas.
    """
    if not _openai_client:
        raise HTTPException(status_code=503, detail="OpenAI API key no configurada")

    prompt = f"""Eres un Director Comercial experto en SEO Semántico y Omnicanalidad.

Oportunidad de mercado: "{body.market_opportunity}"
Arquetipo de comprador: "{body.archetype}"
Marca: "{body.brand}"
Categoría: "{body.categoria}"

Basado en esta oportunidad, genera:
1. blog_title_suggestion: Un título de artículo que responda a una búsqueda transaccional real (ej: Cómo elegir..., La guía definitiva de...). Debe incluir palabras clave de intención.
2. instagram_reel_hook: El gancho de los primeros 2 segundos de un Reel/Short. Máximo 2 líneas. Emocional o sorpresivo, que detenga el scroll.
3. ecommerce_product_description_snippet: Un párrafo corto (2-3 oraciones) para descripción de producto, con palabras clave de intención de compra y el diferenciador principal.
4. required_trust_signals: Lista de 3-4 señales de confianza concretas que la marca debe recopilar para validar esta oportunidad (ej: "Testimonios con foto de clientes reales usando el producto").
5. strategic_faqs: Exactamente 3 preguntas que el arquetipo "{body.archetype}" le haría a ChatGPT o Google antes de comprar. Cada FAQ tiene:
   - question: Debe comenzar con Qué, Cómo o Cuál
   - suggested_answer_angle: 1 línea de instrucción sobre cómo la marca debe responder para persuadir a la IA y al usuario

Devuelve SOLO JSON válido con exactamente estas claves:
{{
  "blog_title_suggestion": "...",
  "instagram_reel_hook": "...",
  "ecommerce_product_description_snippet": "...",
  "required_trust_signals": ["...", "...", "..."],
  "strategic_faqs": [
    {{"question": "...", "suggested_answer_angle": "..."}},
    {{"question": "...", "suggested_answer_angle": "..."}},
    {{"question": "...", "suggested_answer_angle": "..."}}
  ]
}}"""

    try:
        response = await _openai_client.chat.completions.create(
            model=AI_MODEL,
            max_tokens=800,
            temperature=0.7,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "Generador de briefs de marketing omnicanal. Devuelve SOLO JSON válido."},
                {"role": "user", "content": prompt},
            ],
        )
        data = json.loads(response.choices[0].message.content)
        return OmnichannelBrief(**data)
    except Exception as e:
        logger.error(f"Error generando marketing brief: {e}")
        raise HTTPException(status_code=500, detail=f"Error generando brief: {str(e)}")


@app.get("/api/leads/{lead_id}")
async def obtener_lead(lead_id: str, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=503, detail="DB no disponible")
    try:
        from database import Lead as LeadModel
        row = db.query(LeadModel).filter(LeadModel.id == lead_id).first()
        if not row:
            raise HTTPException(status_code=404, detail="Lead no encontrado")
        return {
            "id": row.id,
            "nombre": row.nombre,
            "email": row.email,
            "marca": row.marca,
            "query": row.query,
            "modo": row.modo,
            "resultado": row.resultado,
            "created_at": row.created_at.isoformat() if row.created_at else None,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error obteniendo lead {lead_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/leads")
async def listar_leads(db: Session = Depends(get_db)):
    if db is None:
        return []
    try:
        from database import Lead as LeadModel
        rows = db.query(LeadModel).order_by(LeadModel.created_at.desc()).all()
        return [
            {
                "id": r.id,
                "nombre": r.nombre,
                "email": r.email,
                "marca": r.marca,
                "query": r.query,
                "modo": r.modo,
                "tiene_resultado": r.resultado is not None,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rows
        ]
    except Exception as e:
        logger.error(f"Error listando leads: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class LeadRequest(BaseModel):
    nombre: str
    email: str
    marca: Optional[str] = None
    query: Optional[str] = None
    modo: Optional[str] = None
    resultado: Optional[dict] = None


@app.post("/api/leads", status_code=201)
async def guardar_lead(body: LeadRequest, db: Session = Depends(get_db)):
    if not body.nombre.strip() or not body.email.strip():
        raise HTTPException(status_code=422, detail="nombre y email son requeridos")
    try:
        lead = Lead(
            id=str(uuid.uuid4()),
            nombre=body.nombre.strip(),
            email=body.email.strip().lower(),
            marca=body.marca.strip() if body.marca else None,
            query=body.query.strip() if body.query else None,
            modo=body.modo,
            resultado=body.resultado,
        )
        if db is not None:
            db.add(lead)
            db.commit()
            logger.info(f"Lead guardado: {body.email} [{body.modo}]")
        return {"ok": True}
    except Exception as e:
        if db is not None:
            db.rollback()
        logger.error(f"Error guardando lead: {e}")
        return {"ok": False}


# ── Shared Reports ────────────────────────────────────────────────────────────

class ShareRequest(BaseModel):
    modo: str
    marca: Optional[str] = None
    query: Optional[str] = None
    resultado: dict


@app.post("/api/share", status_code=201)
async def crear_share(body: ShareRequest, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=503, detail="DB no disponible")
    import secrets
    code = secrets.token_urlsafe(8)
    try:
        row = SharedReport(
            code=code,
            modo=body.modo,
            marca=body.marca,
            query=body.query,
            resultado=body.resultado,
        )
        db.add(row)
        db.commit()
        return {"code": code}
    except Exception as e:
        db.rollback()
        logger.error(f"Error creando share: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/r/{code}")
async def obtener_share(code: str, db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=503, detail="DB no disponible")
    row = db.query(SharedReport).filter(SharedReport.code == code).first()
    if not row:
        raise HTTPException(status_code=404, detail="Informe no encontrado")
    return {
        "code": row.code,
        "modo": row.modo,
        "marca": row.marca,
        "query": row.query,
        "resultado": row.resultado,
        "created_at": row.created_at.isoformat() if row.created_at else None,
    }


# ── Admin metrics ─────────────────────────────────────────────────────────────

@app.get("/api/admin/metrics")
async def admin_metrics(db: Session = Depends(get_db)):
    if db is None:
        raise HTTPException(status_code=503, detail="DB no disponible")
    try:
        from sqlalchemy import func, cast, Date
        total = db.query(Lead).count()
        con_resultado = db.query(Lead).filter(Lead.resultado.isnot(None)).count()
        emails_unicos = db.query(func.count(func.distinct(Lead.email))).scalar()
        por_modo = {
            m: db.query(Lead).filter(Lead.modo == m).count()
            for m in ["brand", "url", "compare", "cita"]
        }
        # leads por día últimos 30 días
        from datetime import timedelta as td
        hoy = datetime.utcnow().date()
        hace_30 = hoy - td(days=29)
        rows = (
            db.query(cast(Lead.created_at, Date).label("fecha"), func.count().label("count"))
            .filter(Lead.created_at >= hace_30)
            .group_by(cast(Lead.created_at, Date))
            .order_by(cast(Lead.created_at, Date))
            .all()
        )
        por_dia = [{"fecha": str(r.fecha), "count": r.count} for r in rows]
        cache_total = db.query(AuditCache).count()
        cache_activo = db.query(AuditCache).filter(AuditCache.expires_at > datetime.utcnow()).count()
        # emails bloqueados por freemium
        bloqueados = (
            db.query(Lead.email)
            .filter(Lead.resultado.isnot(None))
            .group_by(Lead.email)
            .having(func.count() >= 2)
            .count()
        )
        return {
            "total_leads": total,
            "emails_unicos": emails_unicos,
            "con_resultado": con_resultado,
            "sin_resultado": total - con_resultado,
            "por_modo": por_modo,
            "por_dia": por_dia,
            "cache_total": cache_total,
            "cache_activo": cache_activo,
            "freemium_bloqueados": bloqueados,
        }
    except Exception as e:
        logger.error(f"Error en metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── Historial por email ───────────────────────────────────────────────────────

@app.get("/api/user/history")
async def historial_usuario(email: str, db: Session = Depends(get_db)):
    if db is None:
        return []
    try:
        rows = (
            db.query(Lead)
            .filter(Lead.email == email.lower().strip(), Lead.resultado.isnot(None))
            .order_by(Lead.created_at.desc())
            .all()
        )
        def get_score(r):
            try:
                res = r.resultado
                if r.modo == "brand":
                    return res.get("resultados", [{}])[0].get("invisibilidad_score")
                if r.modo == "url":
                    return res.get("visibilidad_pct")
            except Exception:
                pass
            return None

        return [
            {
                "id": r.id,
                "marca": r.marca,
                "query": r.query,
                "modo": r.modo,
                "score": get_score(r),
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rows
        ]
    except Exception as e:
        logger.error(f"Error en historial: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/user/quota")
async def user_quota(email: str, db: Session = Depends(get_db)):
    """Retorna cuántas auditorías gratuitas ha usado el email."""
    limit = 2
    if db is None or not email:
        return {"used": 0, "limit": limit, "remaining": limit}
    try:
        used = db.query(Lead).filter(
            Lead.email == email.lower().strip(),
            Lead.resultado.isnot(None)
        ).count()
        return {"used": used, "limit": limit, "remaining": max(0, limit - used)}
    except Exception:
        return {"used": 0, "limit": limit, "remaining": limit}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


# ── Email ─────────────────────────────────────────────────────────────────────

class SendReportRequest(BaseModel):
    email: str
    nombre: Optional[str] = ""
    marca: str
    query: Optional[str] = ""
    score: float
    shareUrl: str
    modo: str  # "brand" | "url"

@app.post("/api/send-report")
async def send_report(payload: SendReportRequest):
    import resend
    resend.api_key = os.getenv("RESEND_API_KEY", "")
    if not resend.api_key:
        raise HTTPException(status_code=500, detail="RESEND_API_KEY no configurado")

    score = round(payload.score)
    score_color = "#10b981" if score >= 60 else "#f97316" if score >= 30 else "#f43f5e"
    score_label = "Visible" if score >= 60 else "En Riesgo" if score >= 30 else "Invisible"
    saludo = f"Hola {payload.nombre.split()[0]}," if payload.nombre else "Hola,"
    contexto = (
        f"Analizamos la URL <strong>{payload.marca}</strong> frente a los principales motores de IA."
        if payload.modo == "url"
        else f'Analizamos cómo posiciona la IA a <strong>{payload.marca}</strong> para la búsqueda <em>"{payload.query}"</em>.'
    )
    if score < 30:
        score_desc = "Tu marca está prácticamente invisible para los motores de IA. Tus clientes potenciales están siendo derivados a la competencia."
    elif score < 60:
        score_desc = "Tu marca aparece en algunas búsquedas pero la competencia captura la mayoría de la intención de compra."
    else:
        score_desc = "Tu marca lidera la visibilidad en IA. Mantén la ventaja con contenido de autoridad constante."

    asunto = (
        f"Tu auditoría de visibilidad IA: {payload.marca}"
        if payload.modo == "url"
        else f'Tu auditoría de visibilidad IA: {payload.marca} — "{payload.query}"'
    )

    html = f"""<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#020617;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#020617;padding:40px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="padding:0 0 28px 0;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="width:28px;height:28px;background:linear-gradient(135deg,#38bdf8,#818cf8);border-radius:6px;text-align:center;vertical-align:middle;">
        <span style="color:#fff;font-size:11px;font-weight:700;">AI</span>
      </td>
      <td style="padding-left:10px;color:#e2e8f0;font-size:15px;font-weight:600;">Ai Visibility</td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#0f172a;border:1px solid #1e293b;border-radius:4px;overflow:hidden;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="height:4px;background:{score_color};"></td>
    </tr></table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 32px 0 32px;"><tr><td>
      <p style="margin:0 0 16px 0;color:#94a3b8;font-size:13px;">{saludo}</p>
      <p style="margin:0 0 24px 0;color:#cbd5e1;font-size:15px;line-height:1.6;">{contexto}</p>
    </td></tr></table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 28px 32px;"><tr>
      <td style="background:#020617;border:1px solid #1e293b;border-radius:4px;padding:20px 24px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:20px;border-right:1px solid #1e293b;">
            <p style="margin:0;color:#475569;font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">AI Readiness Score</p>
            <p style="margin:4px 0 0 0;font-size:36px;font-weight:300;color:{score_color};font-family:monospace;">{score}</p>
            <p style="margin:2px 0 0 0;color:#475569;font-size:11px;font-family:monospace;">/100 · {score_label}</p>
          </td>
          <td style="padding-left:20px;">
            <p style="margin:0;color:#64748b;font-size:12px;line-height:1.5;">{score_desc}</p>
          </td>
        </tr></table>
      </td>
    </tr></table>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px 32px;"><tr>
      <td align="center" style="background:#1e293b;border-radius:4px;padding:20px;">
        <p style="margin:0 0 16px 0;color:#94a3b8;font-size:13px;">Ver el informe completo con diagnóstico competitivo y plan de acción</p>
        <a href="{payload.shareUrl}" style="display:inline-block;background:#4f46e5;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">
          Ver mi informe completo →
        </a>
      </td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:24px 0 0 0;">
    <p style="margin:0;color:#334155;font-size:11px;font-family:monospace;line-height:1.7;">
      Ai Visibility · Av. Apoquindo 4501, Of. 12, Las Condes, Santiago<br/>
      Este correo fue solicitado desde la plataforma. Si no lo pediste, ignóralo.<br/>
      <a href="mailto:contacto@ai-visibility.cl" style="color:#475569;text-decoration:none;">contacto@ai-visibility.cl</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>"""

    try:
        resend.Emails.send({
            "from": "Ai Visibility <production@ai-visibility.cl>",
            "to": payload.email,
            "reply_to": "contacto@ai-visibility.cl",
            "subject": asunto,
            "html": html,
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"ok": True}
