"""
Integración de ai_clients.py con FastAPI
Ejemplos de cómo usar los clientes AI en tus endpoints
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import asyncio
from ai_clients import OpenAIClient, consultar_multiple_ias


app = FastAPI(title="AI Integration Examples")


# ============================================================================
# Modelos Pydantic para requests/responses
# ============================================================================

class ConsultaRequest(BaseModel):
    """Request para hacer una consulta a IA"""
    prompt: str
    temperatura: float = 0.1
    modelo: str = "gpt-4o-mini"


class AnalisisContenidoRequest(BaseModel):
    """Request para analizar contenido"""
    contenido: str


class RecomendacionRequest(BaseModel):
    """Request para generar recomendaciones"""
    url: str
    marca: str


class AnalisisCompetenciaRequest(BaseModel):
    """Request para análisis de competencia"""
    marcas: list[str]
    contenido: str


# ============================================================================
# Endpoints - Ejemplos de uso
# ============================================================================

@app.post("/api/consultar")
async def consultar_ia(req: ConsultaRequest):
    """
    Endpoint para hacer una consulta simple a OpenAI
    
    Example:
        POST /api/consultar
        {
            "prompt": "¿Cuál es la mejor estrategia de SEO?",
            "temperatura": 0.2,
            "modelo": "gpt-4o-mini"
        }
    """
    
    if not req.prompt or len(req.prompt) == 0:
        raise HTTPException(status_code=400, detail="Prompt no puede estar vacío")
    
    try:
        client = OpenAIClient()
        
        respuesta = await client.consultar_openai(
            prompt=req.prompt,
            temperature=req.temperatura,
            model=req.modelo
        )
        
        return {
            "success": True,
            "respuesta": respuesta,
            "modelo": req.modelo,
            "temperatura": req.temperatura
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en la consulta: {str(e)}"
        )


@app.post("/api/analizar-contenido")
async def analizar_contenido(req: AnalisisContenidoRequest):
    """
    Endpoint para analizar contenido usando IA
    
    Retorna:
    - Palabras clave principales
    - Sentimiento
    - Recomendaciones de optimización
    
    Example:
        POST /api/analizar-contenido
        {
            "contenido": "Apple es la mejor marca de smartphones..."
        }
    """
    
    if not req.contenido or len(req.contenido) < 10:
        raise HTTPException(
            status_code=400,
            detail="Contenido debe tener al menos 10 caracteres"
        )
    
    try:
        client = OpenAIClient()
        
        analisis = await client.analizar_contenido(req.contenido)
        
        return {
            "success": True,
            "contenido_length": len(req.contenido),
            "analisis": analisis
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en análisis: {str(e)}"
        )


@app.post("/api/recomendaciones-seo")
async def obtener_recomendaciones(req: RecomendacionRequest):
    """
    Endpoint para obtener recomendaciones de SEO/AEO
    
    Example:
        POST /api/recomendaciones-seo
        {
            "url": "https://miempresa.com/productos",
            "marca": "MiBrand"
        }
    """
    
    if not req.url or not req.marca:
        raise HTTPException(
            status_code=400,
            detail="URL y marca son requeridas"
        )
    
    try:
        client = OpenAIClient()
        
        recomendaciones = await client.generar_recomendaciones(
            url=req.url,
            marca=req.marca
        )
        
        return {
            "success": True,
            "url": req.url,
            "marca": req.marca,
            "recomendaciones": recomendaciones
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generando recomendaciones: {str(e)}"
        )


@app.post("/api/analizar-competencia-ia")
async def analizar_competencia(req: AnalisisCompetenciaRequest):
    """
    Endpoint para analizar competencia usando IA
    
    Example:
        POST /api/analizar-competencia-ia
        {
            "marcas": ["Apple", "Samsung", "Google"],
            "contenido": "Comparativa de smartphones..."
        }
    """
    
    if not req.marcas or len(req.marcas) == 0:
        raise HTTPException(
            status_code=400,
            detail="Se requieren al menos 1 marca"
        )
    
    try:
        client = OpenAIClient()
        
        prompt = f"""
Analiza el siguiente contenido con enfoque en las siguientes marcas: {', '.join(req.marcas)}

Contenido:
{req.contenido}

Proporciona:
1. Marca más mencionada
2. Sentimiento general para cada marca
3. Posicionamiento relativo
4. Recomendaciones para mejorar
"""
        
        analisis = await client.consultar_openai(
            prompt=prompt,
            system_prompt="Eres experto en análisis competitivo de marcas",
            temperature=0.2
        )
        
        return {
            "success": True,
            "marcas_analizadas": req.marcas,
            "analisis": analisis
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en análisis de competencia: {str(e)}"
        )


@app.post("/api/consultar-multiples-ias")
async def consultar_multiples(req: ConsultaRequest):
    """
    Endpoint para consultar múltiples IAs simultáneamente
    Compara respuestas de OpenAI y Claude
    
    Example:
        POST /api/consultar-multiples-ias
        {
            "prompt": "¿Cómo mejorar AEO?",
            "temperatura": 0.1
        }
    """
    
    if not req.prompt:
        raise HTTPException(status_code=400, detail="Prompt requerido")
    
    try:
        # Consultar múltiples IAs en paralelo
        resultados = await consultar_multiple_ias(
            prompt=req.prompt,
            use_openai=True,
            use_claude=False  # Cambiar a True si tienes ANTHROPIC_API_KEY
        )
        
        # Filtrar None values
        respuestas_validas = {k: v for k, v in resultados.items() if v}
        
        return {
            "success": True,
            "prompt": req.prompt,
            "respuestas": respuestas_validas,
            "total_ias": len(respuestas_validas)
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error consultando IAs: {str(e)}"
        )


# ============================================================================
# Integración con modelos de base de datos
# ============================================================================

class URLAnalisisModel(BaseModel):
    """Ejemplo de cómo guardar análisis en BD"""
    url: str
    contenido: str
    analisis_ia: str
    sentimiento: str
    palabras_clave: list[str]


@app.post("/api/analizar-url-completo")
async def analizar_url_completo(url: str):
    """
    Endpoint que:
    1. Obtiene contenido de la URL (ejemplo simulado)
    2. Lo analiza con IA
    3. Lo guardaría en BD (implementar según tu schema Prisma)
    
    Example:
        POST /api/analizar-url-completo?url=https://ejemplo.com
    """
    
    try:
        client = OpenAIClient()
        
        # En producción, aquí traerías el contenido real de la URL
        # usando requests, beautifulsoup, etc.
        contenido_simulado = """
        Este es el contenido de ejemplo de la URL.
        Aquí iría el HTML parseado o texto extraído.
        Incluiría los títulos, párrafos principales, etc.
        """
        
        # Analizar con IA
        prompt_analisis = f"""
Analiza el siguiente contenido de una página web.
Proporciona:
1. 5 palabras clave principales
2. Sentimiento general del contenido
3. Recomendaciones para AEO (Answer Engine Optimization)

Contenido:
{contenido_simulado}
"""
        
        analisis = await client.consultar_openai(
            prompt=prompt_analisis,
            system_prompt="Eres experto en AEO y análisis de contenido web",
            temperature=0.2,
            max_tokens=1500
        )
        
        # Aquí guardarías en BD usando Prisma/SQLAlchemy:
        # await db.url_analisis.create({
        #     "url": url,
        #     "contenido": contenido_simulado,
        #     "analisis_ia": analisis,
        #     ...
        # })
        
        return {
            "success": True,
            "url": url,
            "analisis": analisis,
            "status": "Análisis completado (no guardado en BD aún)"
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analizando URL: {str(e)}"
        )


# ============================================================================
# Utilidades
# ============================================================================

@app.get("/api/estado-ias")
async def estado_ias():
    """
    Endpoint para verificar disponibilidad de las IAs
    """
    
    estado = {
        "openai": "disponible" if OpenAIClient() else "no disponible",
        "claude": "próximamente",
        "backend": "ok"
    }
    
    return estado


if __name__ == "__main__":
    import uvicorn
    
    print("\n" + "="*60)
    print("INTEGRACIÓN AI CLIENTS - EJEMPLOS FASTAPI")
    print("="*60)
    print("\nEndpoints disponibles:")
    print("  POST /api/consultar - Consulta simple")
    print("  POST /api/analizar-contenido - Analizar texto")
    print("  POST /api/recomendaciones-seo - Recomendaciones SEO/AEO")
    print("  POST /api/analizar-competencia-ia - Análisis competencia")
    print("  POST /api/consultar-multiples-ias - Múltiples IAs")
    print("  POST /api/analizar-url-completo - Análisis URL completo")
    print("  GET  /api/estado-ias - Estado de IAs")
    print("\nDocumentación: http://localhost:8001/docs")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8001)
