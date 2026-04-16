"""
GUÍA RÁPIDA - Cliente AI Asíncrono para OpenAI
"""

# ============================================================================
# 1. INSTALACIÓN Y CONFIGURACIÓN
# ============================================================================

"""
PASO 1: Instalar dependencias
$ cd backend
$ pip install -r requirements.txt

PASO 2: Obtener API Key
- Ir a https://platform.openai.com/api-keys
- Crear una nueva clave API
- Copiar la clave

PASO 3: Configurar la clave

Opción A: Variable de entorno
$ export OPENAI_API_KEY="sk-..."

Opción B: Archivo .env en la carpeta backend
OPENAI_API_KEY=sk-...

Opción C: Pasarla al cliente
client = OpenAIClient(api_key="sk-...")
"""


# ============================================================================
# 2. USO BÁSICO
# ============================================================================

import asyncio
from ai_clients import OpenAIClient

async def ejemplo_basico():
    # Crear cliente
    client = OpenAIClient()
    
    # Hacer una consulta
    respuesta = await client.consultar_openai(
        prompt="¿Cuál es la capital de Francia?"
    )
    
    print(respuesta)  # Imprime la respuesta de OpenAI

# Ejecutar
# asyncio.run(ejemplo_basico())


# ============================================================================
# 3. PARÁMETROS PRINCIPALES
# ============================================================================

async def ejemplos_parametros():
    client = OpenAIClient()
    
    # PROMPT: Lo que quieres preguntar
    respuesta = await client.consultar_openai(
        prompt="¿Cuántos años tiene el Universo?"
    )
    print("PROMPT SIMPLE:")
    print(respuesta)
    print("\n")
    
    # SYSTEM_PROMPT: Define el rol/contexto de la IA
    respuesta = await client.consultar_openai(
        prompt="Dame 3 consejos para mejor SEO",
        system_prompt="Eres un experto en SEO con 10 años de experiencia"
    )
    print("CON SYSTEM PROMPT:")
    print(respuesta)
    print("\n")
    
    # TEMPERATURE: Controla la creatividad
    # 0.1 = Muy determinista (ideal para análisis, datos)
    # 0.5-0.7 = Balance
    # 1.0+ = Muy creativo (ideal para brainstorming)
    
    respuesta = await client.consultar_openai(
        prompt="Crea nombres creativos para una marca de tech",
        temperature=1.0  # Muy creativo
    )
    print("TEMPERATURE 1.0 (CREATIVO):")
    print(respuesta)
    print("\n")
    
    respuesta = await client.consultar_openai(
        prompt="¿Es 2+2=4?",
        temperature=0.0  # Determinista
    )
    print("TEMPERATURE 0.0 (DETERMINISTA):")
    print(respuesta)
    print("\n")
    
    # MODEL: Qué modelo usar
    # gpt-4o-mini = Barato y rápido (recomendado para desarrollo)
    # gpt-4o = Más potente pero más caro
    respuesta = await client.consultar_openai(
        prompt="Analiza esto",
        model="gpt-4o-mini"  # Default
    )
    print("MODELO GPT-4O-MINI:")
    print(respuesta[:100] + "...")


# ============================================================================
# 4. MÉTODOS ESPECIALIZADOS
# ============================================================================

async def metodos_especiales():
    client = OpenAIClient()
    
    # ANALIZAR CONTENIDO
    contenido = """
    Apple es líder en innovación tecnológica.
    Samsung es su principal competidor.
    Google está ganando participación de mercado.
    """
    
    analisis = await client.analizar_contenido(contenido)
    print("ANÁLISIS DE CONTENIDO:")
    print(analisis)
    print("\n")
    
    # GENERAR RECOMENDACIONES SEO
    recom = await client.generar_recomendaciones(
        url="https://miempresa.com/productos",
        marca="MiBrand"
    )
    print("RECOMENDACIONES SEO/AEO:")
    print(recom)


# ============================================================================
# 5. MANEJO DE ERRORES
# ============================================================================

async def manejar_errores():
    from openai import APIError, RateLimitError, APIConnectionError
    
    try:
        client = OpenAIClient()
        respuesta = await client.consultar_openai("Tu pregunta")
    
    except RateLimitError:
        print("❌ Rate limit alcanzado. Espera un momento antes de reintentar")
    
    except APIConnectionError:
        print("❌ Error de conexión. Verifica tu internet")
    
    except APIError as e:
        print(f"❌ Error en OpenAI API: {e}")
    
    except ValueError as e:
        print(f"❌ Error en validación: {e}")


# ============================================================================
# 6. CASOS DE USO PRÁCTICOS PARA AI VISIBILITY
# ============================================================================

async def casos_practicos():
    client = OpenAIClient()
    
    # CASO 1: Analizar visibilidad en AI
    caso_1 = await client.consultar_openai(
        prompt="""Analiza cómo optimizar esta página para aparecer en 
        ChatGPT, Perplexity y Google AI Overviews: https://ejemplo.com""",
        system_prompt="Eres experto en AEO (Answer Engine Optimization)",
        temperature=0.2
    )
    print("CASO 1 - Optimización para AI:")
    print(caso_1[:300])
    print("\n")
    
    # CASO 2: Extracción de palabras clave
    caso_2 = await client.consultar_openai(
        prompt="¿Cuáles son las 10 palabras clave top para un blog de tecnología?",
        system_prompt="Eres expert en keyword research",
        temperature=0.1
    )
    print("CASO 2 - Keywords:")
    print(caso_2)
    print("\n")
    
    # CASO 3: Análisis de competencia
    caso_3 = await client.consultar_openai(
        prompt="""Analiza cómo se posicionan estas marcas en AI Overviews:
        - Apple
        - Samsung
        - Google
        
        ¿Cuál destaca más? ¿Por qué?""",
        system_prompt="Eres experto en análisis competitivo para IA",
        temperature=0.2
    )
    print("CASO 3 - Análisis Competencia:")
    print(caso_3[:300])


# ============================================================================
# 7. CONSULTAR MÚLTIPLES IAs EN PARALELO
# ============================================================================

async def multiples_ias():
    from ai_clients import consultar_multiple_ias
    
    # Esto es más eficiente que llamar una por una
    resultados = await consultar_multiple_ias(
        prompt="¿Cuál es el mejor enfoque para SEO?",
        use_openai=True,
        use_claude=False  # Cambiar a True si tienes ANTHROPIC_API_KEY
    )
    
    print("RESPUESTAS DE MÚLTIPLES IAs:")
    for ia, respuesta in resultados.items():
        if respuesta:
            print(f"\n--- {ia.upper()} ---")
            print(respuesta[:200] + "...")


# ============================================================================
# 8. INFORMACIÓN DE COSTOS
# ============================================================================

"""
PRECIOS (al 2024):

OpenAI:
- gpt-4o-mini: $0.15 por millón de tokens INPUT / $0.60 OUTPUT
- gpt-4o: $5 per 1M input / $15 output

Anthropic:
- claude-3-haiku: $0.25 / $1.25
- claude-3-opus: $15 / $75

RECOMENDACIÓN PARA DESARROLLO:
Usa gpt-4o-mini o claude-3-haiku - son baratos y funcionan bien

ESTIMAR COSTOS:
- 1 párrafo ≈ 150-200 tokens
- 1 página web ≈ 2,000-3,000 tokens
- Si haces 1000 análisis al mes con gpt-4o-mini ≈ $0.15-0.50
"""


# ============================================================================
# 9. MEJORES PRÁCTICAS
# ============================================================================

"""
✅ HACER:
- Usar temperature=0.1-0.2 para análisis y datos
- Usar system_prompt para establecer contexto
- Manejar excepciones (RateLimitError, APIError)
- Usar gpt-4o-mini para desarrollo (es barato)
- Pedir respuestas en formato estructurado (JSON, markdown)

❌ NO HACER:
- Dejar API key en el código
- Usar temperature > 1.5 para análisis
- No manejar errores
- Hacer llamadas síncronas (siempre async)
- Confiar ciegamente en respuestas de IA (verificar)
"""


# ============================================================================
# 10. PRÓXIMOS PASOS
# ============================================================================

"""
1. Configura tu OPENAI_API_KEY
2. Ejecuta: python test_ai_clients.py
3. Lee los ejemplos en test_ai_clients.py
4. Llama consultar_openai() en tus endpoints FastAPI
5. Integra en integration_examples.py
6. Crea tus propios prompts especializados
"""

if __name__ == "__main__":
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║       CLIENTE OPENAI ASÍNCRONO - GUÍA RÁPIDA             ║
    ╚════════════════════════════════════════════════════════════╝
    
    Ver ejemplos en este archivo.
    
    Para ejecutar ejemplos:
    $ python test_ai_clients.py
    
    Para integrar en FastAPI:
    $ python integration_examples.py
    """)
