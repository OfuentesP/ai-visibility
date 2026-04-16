from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os
from typing import List, Optional
import logging
from collections import Counter
import asyncio

from models import ResultadoBusqueda, AnalisisMarca
from database import get_db, test_connection
from crud import (
    crear_cliente, obtener_cliente, listar_clientes, obtener_urls_cliente,
    agregar_url_auditar, guardar_auditoria, obtener_auditorias_url,
    guardar_recomendacion, obtener_recomendaciones_url, obtener_metricas_cliente
)

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Visibility - Brand Analysis API",
    description="API para análisis de visibilidad de marcas en motores de búsqueda con IA",
    version="0.1.0"
)

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


@app.post("/api/clients/create")
async def crear_nuevo_cliente(
    nombre: str,
    email: str,
    website: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Crea un nuevo cliente"""
    try:
        cliente = crear_cliente(db, nombre, email, website)
        return {
            "success": True,
            "cliente": cliente,
            "mensaje": "Cliente creado exitosamente"
        }
    except Exception as e:
        logger.error(f"Error creando cliente: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/clients/{cliente_id}")
async def obtener_datos_cliente(
    cliente_id: str,
    db: Session = Depends(get_db)
):
    """Obtiene datos de un cliente con URLs y métricas"""
    try:
        cliente = obtener_cliente(db, cliente_id)
        if not cliente:
            raise HTTPException(status_code=404, detail="Cliente no encontrado")
        
        urls = obtener_urls_cliente(db, cliente_id)
        metricas = obtener_metricas_cliente(db, cliente_id)
        
        return {
            "success": True,
            "cliente": cliente,
            "urls": urls,
            "metricas": metricas
        }
    except Exception as e:
        logger.error(f"Error obteniendo cliente: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/clients")
async def listar_todos_clientes(db: Session = Depends(get_db)):
    """Lista todos los clientes"""
    try:
        clientes = listar_clientes(db)
        return {
            "success": True,
            "total": len(clientes),
            "clientes": clientes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/urls/add")
async def agregar_url(
    cliente_id: str,
    url: str,
    titulo: str,
    descripcion: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Agrega una URL para auditar"""
    try:
        if not url.startswith(("http://", "https://")):
            raise ValueError("URL debe comenzar con http:// o https://")
        
        url_auditoria = agregar_url_auditar(
            db, url, titulo, cliente_id, descripcion
        )
        
        return {
            "success": True,
            "url_auditoria": url_auditoria,
            "mensaje": "URL agregada exitosamente"
        }
    except Exception as e:
        logger.error(f"Error agregando URL: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/clients/{cliente_id}/urls")
async def obtener_urls_cliente_endpoint(
    cliente_id: str,
    db: Session = Depends(get_db)
):
    """Obtiene todas las URLs de un cliente"""
    try:
        urls = obtener_urls_cliente(db, cliente_id)
        return {
            "success": True,
            "total": len(urls),
            "urls": urls
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/audits/save")
async def guardar_resultado_auditoria(
    url_id: str,
    ai_engine: str,
    cited_status: str,
    snippet: Optional[str] = None,
    position: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Guarda resultado de auditoría"""
    try:
        resultado = guardar_auditoria(
            db, url_id, ai_engine, cited_status, snippet, position
        )
        
        return {
            "success": True,
            "auditoria": resultado,
            "mensaje": "Auditoría guardada"
        }
    except Exception as e:
        logger.error(f"Error guardando auditoría: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/urls/{url_id}/audits")
async def obtener_auditorias(url_id: str, db: Session = Depends(get_db)):
    """Obtiene todas las auditorías de una URL"""
    try:
        auditorias = obtener_auditorias_url(db, url_id)
        return {
            "success": True,
            "total": len(auditorias),
            "auditorias": auditorias
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/recommendations/save")
async def guardar_recomendacion_endpoint(
    url_id: str,
    engine: str,
    tipo: str,
    prioridad: str,
    descripcion: str,
    action_items: List[str],
    estimated_impact: int,
    db: Session = Depends(get_db)
):
    """Guarda una recomendación"""
    try:
        if not 0 <= estimated_impact <= 100:
            raise ValueError("estimated_impact debe estar entre 0 y 100")
        
        recom = guardar_recomendacion(
            db, url_id, engine, tipo, prioridad, descripcion,
            action_items, estimated_impact
        )
        
        return {
            "success": True,
            "recomendacion": recom
        }
    except Exception as e:
        logger.error(f"Error guardando recomendación: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/urls/{url_id}/recommendations")
async def obtener_recomendaciones(url_id: str, db: Session = Depends(get_db)):
    """Obtiene recomendaciones de una URL"""
    try:
        recomendaciones = obtener_recomendaciones_url(db, url_id)
        return {
            "success": True,
            "total": len(recomendaciones),
            "recomendaciones": recomendaciones
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/clients/{cliente_id}/metrics")
async def obtener_metricas(cliente_id: str, db: Session = Depends(get_db)):
    """Obtiene métricas de visibilidad del cliente"""
    try:
        metricas = obtener_metricas_cliente(db, cliente_id)
        return {
            "success": True,
            "metricas": metricas
        }
    except Exception as e:
        logger.error(f"Error obteniendo métricas: {e}")
        raise HTTPException(status_code=500, detail=str(e))


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


@app.post("/api/audit", response_model=ResultadoBusqueda)
async def audit_pipeline(query: str, brand: str) -> ResultadoBusqueda:
    """
    Pipeline completo: Paso 2 (Buscar) + Paso 3 (Juzgar) + Paso 4 (Brief) + Paso 5 (Plan PRO) + Paso 6 (Prioridad Ejecutiva)
    
    Args:
        query: Pregunta de búsqueda
        brand: Marca a analizar
        
    Returns:
        ResultadoBusqueda con análisis completo incluyendo prioridad ejecutiva
    """
    try:
        from searcher import consultar_openai
        from judge import extraer_metricas, generar_content_brief, generar_plan_accion_pro, generar_prioridad_ejecutiva, extraer_conceptos_faltantes, calcular_estado_invisibilidad, generar_plan_accion
        from discovery import obtener_tendencias_chile, detectar_territorios_desatendidos
        
        # Paso 2: Searcher
        logger.info(f"[Paso 2] Buscando: {query}")
        texto_busqueda = await consultar_openai(query)
        
        # Paso 3: Judge
        logger.info(f"[Paso 3] Extrayendo métricas para: {brand}")
        resultado = await extraer_metricas(texto_busqueda, brand)
        
        # Paso 4: Content Brief Generator (PRO)
        logger.info(f"[Paso 4] Generando brief de contenido para: {brand}")
        if resultado.recomendacion_ia and resultado.marca_ganadora:
            content_ideas = await generar_content_brief(
                resultado.recomendacion_ia,
                resultado.marca_ganadora,
                brand
            )
            resultado.content_ideas = content_ideas
        
        # Paso 5: Plan de Acción PRO (Consultor Senior)
        logger.info(f"[Paso 5] Generando plan estratégico PRO para: {brand}")
        plan_pro = await generar_plan_accion_pro(
            texto_busqueda,
            brand,
            resultado.marca_ganadora,
            resultado.posicion_mi_marca,
            resultado.recomendacion_ia
        )
        resultado.plan_accion_pro = plan_pro
        
        # Paso 6: Prioridad Ejecutiva (Growth Strategist)
        logger.info(f"[Paso 6] Generando prioridad ejecutiva para: {brand}")
        prioridad = await generar_prioridad_ejecutiva(
            resultado.posicion_mi_marca,
            resultado.sentimiento,
            resultado.marca_ganadora,
            brand,
            texto_busqueda,
            resultado.recomendacion_ia
        )
        resultado.prioridad_ejecutiva = prioridad
        
        # Paso 7: Mapa de Conceptos Perdidos (Competitive Intelligence)
        logger.info(f"[Paso 7] Extrayendo conceptos faltantes para: {brand}")
        conceptos = await extraer_conceptos_faltantes(
            texto_busqueda,
            resultado.marca_ganadora,
            brand
        )
        resultado.conceptos_faltantes = conceptos
        
        # Paso 8: Termómetro de Invisibilidad
        logger.info(f"[Paso 8] Calculando estado de invisibilidad para: {brand}")
        estado, score = calcular_estado_invisibilidad(
            resultado.posicion_mi_marca,
            resultado.sentimiento,
            resultado.marcas_mencionadas,
            brand
        )
        resultado.estado_invisibilidad = estado
        resultado.invisibilidad_score = score
        
        # Paso 9: Plan de Acción (Quick Wins + Estratégico)
        logger.info(f"[Paso 9] Generando plan de rescate para: {brand}")
        plan_accion = await generar_plan_accion(
            estado,
            resultado.posicion_mi_marca,
            resultado.marca_ganadora,
            brand,
            resultado.conceptos_faltantes,
            texto_busqueda
        )
        resultado.plan_accion = plan_accion
        
        # Paso 10: Detectar Territorios Desatendidos (Gap Analysis)
        logger.info(f"[Paso 10] Detectando territorios desatendidos para: {brand}")
        try:
            # Obtener tendencias de Google Trends
            tendencias = await obtener_tendencias_chile(query)
            
            # Comunicación actual de la marca (información de contexto)
            comunicacion_actual = resultado.recomendacion_ia or f"Marca {brand} en mercado de {query}"
            
            # Detectar territorios desatendidos
            territorios = await detectar_territorios_desatendidos(
                query,
                tendencias,
                brand,
                comunicacion_actual
            )
            resultado.territorios_desatendidos = territorios
            logger.info(f"✅ Detectados {len(territorios)} territorios desatendidos")
        except Exception as e:
            logger.warning(f"⚠️  No se pudieron detectar territorios desatendidos: {e}")
            resultado.territorios_desatendidos = []
        
        # Retornar ResultadoBusqueda completo
        return ResultadoBusqueda(
            prompt_original=query,
            texto_original_ia=texto_busqueda,
            resultados=[resultado]
        )
        
    except Exception as e:
        logger.error(f"Error en pipeline: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/discovery")
async def discovery_masivo(brand: str, topico: str) -> dict:
    """
    Endpoint Maestro: Orquestador de Auditoría Masiva.
    
    Genera 4 escenarios con personas chilenas, obtiene tendencias,
    y ejecuta 4 auditorías simultáneamente usando asyncio.gather.
    
    Args:
        brand: Marca del cliente a analizar
        topico: Tópico a auditar (ej: "tarjetas de crédito")
        
    Returns:
        {
            "escenarios_auditados": Lista con resultados por persona,
            "score_general": Promedio de posición de la marca,
            "amenaza_principal": Marca competidora que más veces ganó
        }
    """
    try:
        from discovery import obtener_tendencias_chile, generar_escenarios_ia
        from searcher import consultar_openai
        from judge import extraer_metricas
        from collections import Counter
        
        logger.info(f"🚀 [Discovery Masivo] Iniciando: {topico} | Brand: {brand}")
        
        # PASO 1: Obtener tendencias de Google Trends Chile
        tendencias = await obtener_tendencias_chile(topico)
        logger.info(f"✅ Tendencias encontradas: {tendencias}")
        
        # PASO 2: Generar escenarios IA con personas chilenas
        escenarios = await generar_escenarios_ia(topico, tendencias)
        logger.info(f"✅ Escenarios generados: {len(escenarios)}")
        
        # PASO 3: Función auxiliar para auditar un escenario
        async def auditar_escenario(escenario):
            """Ejecuta auditoría completa para un escenario específico."""
            try:
                # Buscar con el prompt específico
                texto_busqueda = await consultar_openai(escenario["prompt_ia"])
                
                # Extraer métricas
                resultado = await extraer_metricas(texto_busqueda, brand)
                
                return {
                    "persona": escenario["persona"],
                    "preocupacion_principal": escenario["preocupacion_principal"],
                    "prompt_ia": escenario["prompt_ia"],
                    "posicion_marca": resultado.posicion_mi_marca,
                    "marca_ganadora": resultado.marca_ganadora,
                    "marcas_mencionadas": resultado.marcas_mencionadas,
                    "sentimiento": resultado.sentimiento
                }
            except Exception as e:
                logger.error(f"❌ Error auditando escenario {escenario['persona']}: {e}")
                return {
                    "persona": escenario["persona"],
                    "error": str(e)
                }
        
        # PASO 4: Ejecutar todas las auditorías en paralelo con asyncio.gather
        logger.info("⚡ Ejecutando 4 auditorías en paralelo...")
        auditorias = await asyncio.gather(*[auditar_escenario(esc) for esc in escenarios])
        
        # PASO 5: Compilar resumen con estadísticas agregadas
        posiciones_validas = []
        todas_marcas_ganadoras = []
        
        for auditoria in auditorias:
            if "error" not in auditoria:
                pos = auditoria.get("posicion_marca", 0)
                if pos and pos > 0:
                    posiciones_validas.append(pos)
                
                ganadora = auditoria.get("marca_ganadora")
                if ganadora:
                    todas_marcas_ganadoras.append(ganadora)
        
        # Calcular estadísticas
        score_general = round(sum(posiciones_validas) / len(posiciones_validas), 2) if posiciones_validas else None
        amenaza_principal = Counter(todas_marcas_ganadoras).most_common(1)[0][0] if todas_marcas_ganadoras else None
        
        resumen = {
            "topico": topico,
            "brand": brand,
            "tendencias_identificadas": tendencias,
            "escenarios_auditados": auditorias,
            "score_general": score_general,
            "amenaza_principal": amenaza_principal,
            "total_escenarios": len(auditorias)
        }
        
        logger.info(f"✅ [Discovery Masivo] Completado. Score: {score_general} | Amenaza: {amenaza_principal}")
        return resumen
        
    except Exception as e:
        logger.error(f"❌ Error en discovery masivo: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/batch-audit")
async def batch_audit_masivo(topico: str, mi_marca: str) -> dict:
    """
    Orquestador de Auditoría Masiva (versión anterior): Ejecuta 5 auditorías simultáneamente.
    
    Args:
        topico: Tema a auditar (ej: "tarjetas de crédito")
        mi_marca: Marca del cliente a analizar
        
    Returns:
        Resumen con promedio de posición, marcas mencionadas, y 5 resultados individuales
    """
    try:
        from discovery import obtener_tendencias_chile, generar_escenarios_ia
        from searcher import consultar_openai
        from judge import extraer_metricas, generar_content_brief, generar_plan_accion_pro
        
        logger.info(f"[Batch Audit] Iniciando: {topico} | Cliente: {mi_marca}")
        
        # PASO 1: Obtener tendencias y generar escenarios
        tendencias = await obtener_tendencias_chile(topico)
        escenarios = await generar_escenarios_ia(topico, tendencias)
        logger.info(f"[Batch Audit] Generados {len(escenarios)} escenarios")
        
        # PASO 2: Función auxiliar para auditar un único escenario
        async def auditar_escenario(escenario):
            """Ejecuta auditoría completa para un escenario específico."""
            try:
                # Paso 2: Buscar con el prompt del escenario
                texto_busqueda = await consultar_openai(escenario["prompt_ia"])
                
                # Paso 3: Extraer métricas
                resultado = await extraer_metricas(texto_busqueda, mi_marca)
                
                # Paso 4: Generar content brief si es necesario
                if resultado.recomendacion_ia and resultado.marca_ganadora:
                    content_ideas = await generar_content_brief(
                        resultado.recomendacion_ia,
                        resultado.marca_ganadora,
                        mi_marca
                    )
                    resultado.content_ideas = content_ideas
                
                # Paso 5: Generar plan PRO
                plan_pro = await generar_plan_accion_pro(
                    texto_busqueda,
                    mi_marca,
                    resultado.marca_ganadora,
                    resultado.posicion_mi_marca,
                    resultado.recomendacion_ia
                )
                resultado.plan_accion_pro = plan_pro
                
                return {
                    "persona": escenario["persona"],
                    "prompt": escenario["prompt_ia"],
                    "resultado": resultado.model_dump()
                }
            except Exception as e:
                logger.error(f"Error auditando escenario {escenario['persona']}: {e}")
                return {
                    "persona": escenario["persona"],
                    "prompt": escenario["prompt_ia"],
                    "error": str(e)
                }
        
        # PASO 3: Ejecutar todas las auditorías en paralelo con asyncio.gather
        logger.info("[Batch Audit] Ejecutando auditorías en paralelo...")
        auditorias = await asyncio.gather(*[auditar_escenario(esc) for esc in escenarios])
        
        # PASO 4: Compilar resumen con estadísticas agregadas
        posiciones_validas = []
        todas_marcas = []
        
        for auditoria in auditorias:
            if "resultado" in auditoria and auditoria["resultado"]:
                pos = auditoria["resultado"].get("posicion_mi_marca")
                if pos and pos > 0:
                    posiciones_validas.append(pos)
                
                # Colectar todas las marcas mencionadas
                marcas = auditoria["resultado"].get("marcas_mencionadas", [])
                todas_marcas.extend(marcas)
        
        # Calcular estadísticas
        promedio_posicion = sum(posiciones_validas) / len(posiciones_validas) if posiciones_validas else None
        marcas_mas_mencionadas = [marca for marca, _ in Counter(todas_marcas).most_common(5)]
        
        resumen = {
            "topico": topico,
            "mi_marca": mi_marca,
            "total_auditorias": len(auditorias),
            "promedio_posicion": round(promedio_posicion, 2) if promedio_posicion else None,
            "posiciones_validas": len(posiciones_validas),
            "marcas_mas_mencionadas": marcas_mas_mencionadas,
            "resultados_individuales": auditorias
        }
        
        logger.info(f"[Batch Audit] Completado. Promedio posición: {promedio_posicion}")
        return resumen
        
    except Exception as e:
        logger.error(f"Error en batch audit: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
