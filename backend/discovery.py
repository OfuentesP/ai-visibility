import asyncio
import json
import os
import logging
from typing import List
from dotenv import load_dotenv
from openai import AsyncOpenAI
from pytrends.request import TrendReq

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
_api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=_api_key) if _api_key else None


# Arquetipos Enterprise de decisión de compra (reemplazan personas genéricas)
ARQUETIPOS_COMPRA = [
    {
        "id": "racional_economico",
        "arquetipo": "El Racional / Económico",
        "perfil_base": (
            "Comprador metódico que compara precios antes de decidir. Prioriza descuentos, "
            "comisiones bajas, ROI directo y relación calidad-precio. Usa planillas Excel para "
            "comparar opciones. Desconfía de promesas vagas. Pregunta siempre '¿cuánto me sale?' "
            "antes de '¿qué beneficios tiene?'. Sensible a cargos ocultos y letra chica."
        ),
        "driver": "precio, descuentos, ROI directo, sin comisiones",
        "dealbreaker": "costos ocultos, comisiones no declaradas, falta de transparencia en precios, letra chica",
        "origen": "arquetipo"
    },
    {
        "id": "premium_seguro",
        "arquetipo": "El Premium / Seguro",
        "perfil_base": (
            "Comprador que prioriza reputación de marca, coberturas amplias y cero fricción. "
            "No le importa pagar más si la experiencia es impecable. Valora respaldo institucional, "
            "atención preferencial y exclusividad. Busca tranquilidad total: si algo sale mal, "
            "quiere que alguien resuelva sin que él mueva un dedo. Asocia precio alto con calidad."
        ),
        "driver": "reputación, cobertura total, cero fricción, exclusividad",
        "dealbreaker": "mala reputación, coberturas limitadas, exclusiones en letra chica, mala atención postventa",
        "origen": "arquetipo"
    },
    {
        "id": "impaciente_digital",
        "arquetipo": "El Impaciente / Digital",
        "perfil_base": (
            "Nativo digital que vive en el celular. Prioriza agilidad, onboarding 100% online "
            "y resolución instantánea. Si un proceso toma más de 3 clics, abandona. Valora apps "
            "bien diseñadas, notificaciones inteligentes y autoservicio. Detesta llamar por teléfono "
            "o ir a una sucursal. Compara en redes sociales y confía en reviews de otros usuarios."
        ),
        "driver": "velocidad, 100% digital, autoservicio, UX mobile",
        "dealbreaker": "lentitud, burocracia, procesos presenciales, tener que llamar por teléfono, app mala o inexistente",
        "origen": "arquetipo"
    },
]



# ==================== FUNCIONES ====================
async def obtener_tendencias_chile(topico: str, num_tendencias: int = 3) -> List[str]:
    """
    Obtiene las 3 keywords más populares en Chile para un tópico usando Google Trends.
    """
    try:
        logger.info(f"🔍 Buscando tendencias en Chile para: {topico}")
        pytrends = TrendReq(hl='es-CL', tz=360)
        pytrends.build_payload([topico], cat=0, timeframe='now 7-d', geo='CL')
        
        # Obtener related queries
        related = pytrends.related_queries()
        
        if related and topico in related:
            top_queries = related[topico]['top']
            if top_queries is not None:
                tendencias = top_queries['query'].head(num_tendencias).tolist()
                logger.info(f"✅ Top {num_tendencias} tendencias en Chile: {tendencias}")
                return tendencias
        
        logger.warning(f"⚠️  No hay tendencias disponibles para: {topico}")
        return []
    
    except Exception as e:
        logger.error(f"❌ Error obteniendo tendencias: {e}")
        return []


async def detectar_territorios_desatendidos(
    topico: str,
    tendencias: List[str],
    marca: str,
    comunicacion_actual: str
) -> List[dict]:
    """
    Detecta 'Territorios Desatendidos': temas emergentes con búsquedas altas
    pero donde la marca NO tiene comunicación o oferta clara.
    
    Retorna: [{topico_emergente, porque_es_oportunidad, nivel_oportunidad}, ...]
    """
    try:
        tendencias_str = ", ".join(tendencias) if tendencias else topico
        
        prompt = f"""Analiza como Growth Marketer en Chile. 

MARCA: {marca}
TÓPICO PRINCIPAL: {topico}
TENDENCIAS EMERGENTES EN GOOGLE: {tendencias_str}
COMUNICACIÓN ACTUAL DE LA MARCA: {comunicacion_actual}

Identifica 3 'Territorios Desatendidos': temas específicos donde:
- Existe una tendencia narrativa emergente en el mercado chileno
- La marca NO comunica activamente sobre esto
- Es una oportunidad de posicionamiento para {marca}

REGLA CLAVE: Evalúa el nivel_oportunidad basándote en la tendencia narrativa del mercado (conversaciones en redes, cobertura mediática, relevancia cultural), NO en volumen de búsquedas de Google. No tienes acceso a datos SEO reales, así que no inventes métricas.

EJEMPLOS de territorios desatendidos:
- Para banco: "cashback en bencina", "tarjetas para nómadas digitales", "pago con reloj"
- Para retail: "compra ahora paga después", "suscripciones", "programa de referidos"

Retorna JSON VÁLIDO con exactamente este formato:
{{
    "territorios": [
        {{
            "topico_emergente": "tema específico (máx 8 palabras)",
            "porque_es_oportunidad": "explicación concisa por qué es oportunidad (máx 20 palabras)",
            "nivel_oportunidad": "Alto" o "Medio",
            "intension_usuario": "qué busca el usuario en este tema"
        }},
        ...
    ]
}}

IMPORTANTE: Devuelve SOLO JSON válido, sin texto adicional. Usa topicos reales del mercado chileno."""

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.5,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": "Eres un analista de mercado experto. Retorna SOLO JSON válido."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        data = json.loads(response.choices[0].message.content)
        territorios = data.get("territorios", [])
        
        logger.info(f"✅ Detectados {len(territorios)} territorios desatendidos para {marca}")
        return territorios[:3]  # Máximo 3
        
    except Exception as e:
        logger.error(f"❌ Error detectando territorios desatendidos: {e}")
        return []


async def generar_escenarios_ia(topico: str, tendencias: List[str], personas: List[dict] = None) -> List[dict]:
    """
    Genera preguntas naturales en jerga chilena para cada arquetipo de compra.
    
    Args:
        topico: Tema a auditar
        tendencias: Keywords de Google Trends
        personas: Lista de arquetipos a usar. Si es None, usa ARQUETIPOS_COMPRA (los 3 genéricos).
                  Acepta arquetipos dinámicos generados por url_analyzer.generar_arquetipos_para_categoria()
    
    Retorna: [{perfil_base, prompt_ia, persona_id, arquetipo, driver, origen}, ...]
    """
    # Usar arquetipos recibidos o los genéricos como fallback
    personas = personas if personas is not None else ARQUETIPOS_COMPRA
    
    escenarios = []
    tendencias_str = ", ".join(tendencias) if tendencias else "el tópico general"
    
    for persona in personas:
        try:
            perfil_base = persona.get('perfil_base', '')
            arquetipo = persona.get('arquetipo', '')
            driver = persona.get('driver', '')
            
            prompt_sistema = f"""Eres un simulador de usuarios reales chilenos para investigación de mercado.

ARQUETIPO: {arquetipo}
DRIVER DE DECISIÓN: {driver}

Tu tarea: Genera la búsqueda EXACTA que este usuario escribiría en ChatGPT o Google.

REGLAS:
1. Una sola pregunta simple. Sin sub-preguntas encadenadas.
2. El driver guía el ángulo: precio → "más barato / mejor precio", calidad → "mejor / más confiable", velocidad → "más rápido / sin trámites".
3. Jerga chilena natural. Como habla la gente, no como escribe un periodista.
4. Máximo 15 palabras. Las búsquedas reales son cortas.
5. NO incluir el nombre de ninguna marca específica en la pregunta.

EJEMPLOS para "Mejor Cuenta Corriente Chile":
- Driver precio:   "cuál banco cobra menos mantención cuenta corriente chile"
- Driver calidad:  "mejor banco para cuenta corriente en chile"
- Driver digital:  "banco con mejor app cuenta corriente chile sin ir a sucursal"

Retorna JSON válido:
{{
    "prompt": "la búsqueda exacta en jerga chilena",
    "razon": "por qué este arquetipo busca esto"
}}"""
            
            prompt_usuario = f"""Perfil del arquetipo:
{perfil_base}

Tópico: {topico}
Tendencias en Chile: {tendencias_str}

Genera la búsqueda corta y natural que {arquetipo} escribiría en ChatGPT para encontrar {topico}.
Driver: [{driver}]. Una sola pregunta, máximo 15 palabras, sin sub-preguntas.
Retorna JSON con 'prompt' y 'razon'."""
            
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type": "json_object"},
                temperature=0.7,
                messages=[
                    {"role": "system", "content": prompt_sistema},
                    {"role": "user", "content": prompt_usuario}
                ]
            )
            
            data = json.loads(response.choices[0].message.content)
            
            escenarios.append({
                "perfil_base": perfil_base,
                "prompt_ia": data.get("prompt", ""),
                "razon": data.get("razon", ""),
                "persona_id": persona.get('id', ''),
                "arquetipo": arquetipo,
                "driver": driver,
                "dealbreaker": persona.get('dealbreaker', ''),
                "origen": persona.get('origen', 'arquetipo')
            })
            
            logger.info(f"✅ [{arquetipo}] → {data.get('prompt', '')[:60]}...")
            
        except Exception as e:
            logger.error(f"❌ Error generando escenario para {persona.get('id')}: {e}")
            continue
    
    return escenarios


if __name__ == "__main__":
    # Test: Flujo completo de descubrimiento
    async def test():
        topico = "mejor banco en chile"
        marca = "MiBanco"
        comunicacion_actual = "Enfocados en cuentas corrientes y depósitos a plazo. No tenemos comunicación sobre tarjetas, cashback o servicios digitales."
        
        # 1. Obtener tendencias
        tendencias = await obtener_tendencias_chile(topico)
        print(f"\n✅ TENDENCIAS EN CHILE:\n{tendencias}\n")
        
        # 2. Detectar territorios desatendidos
        territorios = await detectar_territorios_desatendidos(topico, tendencias, marca, comunicacion_actual)
        print("📍 TERRITORIOS DESATENDIDOS:")
        for terr in territorios:
            print(f"  • {terr['topico_emergente']}")
            print(f"    └─ Oportunidad: {terr['porque_es_oportunidad']}")
            print(f"    └─ Oportunidad: {terr['nivel_oportunidad']}\n")
        
        # 3. Generar escenarios con personas de investigación
        escenarios = await generar_escenarios_ia(topico, tendencias)
        print("\n👥 ESCENARIOS CON PERSONAS DE INVESTIGACIÓN (PersonaHub):\n")
        for esc in escenarios:
            print(f"Persona ID: {esc['persona_id']}")
            print(f"Origen: {esc['origen']}")
            print(f"Perfil Base:\n{esc['perfil_base']}\n")
            print(f"Pregunta (jerga chilena):\n{esc['prompt_ia']}\n")
            print(f"Razón: {esc['razon']}\n")
            print("-" * 80 + "\n")
    
    asyncio.run(test())
