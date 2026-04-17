import asyncio
import json
import os
import logging
from typing import List, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from openai import AsyncOpenAI
from pytrends.request import TrendReq
from datasets import load_dataset

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# Fallback local (perfiles por defecto si falla HF)
PERSONAS_FALLBACK = [
    {
        "id": "ingeniero_comercial",
        "perfil_base": "Ingeniero Comercial de 35 años, buscando invertir en fondos mutuos con asesoría profesional. Nivel tech alto, poder adquisitivo medio-alto. Busca maximizar retorno con riesgo moderado.",
        "origen": "local"
    },
    {
        "id": "estudiante_tarjeta",
        "perfil_base": "Estudiante de Administración de 22 años, obteniendo su primera tarjeta de crédito. Bajo poder adquisitivo, tech savvy alto. Busca beneficios en compras online y sin comisiones.",
        "origen": "local"
    },
    {
        "id": "mama_ahorro",
        "perfil_base": "Madre soltera de 38 años, gerenta administrativo. Poder adquisitivo medio, tech medio. Busca formas seguras de ahorrar para educación de sus 2 hijos.",
        "origen": "local"
    },
    {
        "id": "emprendedor_flujo",
        "perfil_base": "Dueño de pequeña ferretería en Santiago, 42 años. Bajo tech, poder adquisitivo medio. Necesita soluciones para gestionar flujo de caja diario de su negocio.",
        "origen": "local"
    },
    {
        "id": "jubilado_digital",
        "perfil_base": "Jubilado de 68 años, recibe pensión. Tech bajo, busca usar canales digitales pero valora atención personalizada. Desconfiado de plataformas nuevas.",
        "origen": "local"
    }
]


async def obtener_personas_huggingface(cantidad: int = 5) -> List[dict]:
    """
    Obtiene perfiles sintéticos de grado investigación desde PersonaHub (Hugging Face).
    Usa streaming=True para no descargar dataset completo.
    
    Timeout: 5 segundos. Si falla, retorna fallback local.
    Retorna: [{perfil_base, origen}, ...]
    """
    async def cargar_hf():
        try:
            logger.info(f"🔄 Cargando {cantidad} personas de investigación desde PersonaHub...")
            dataset = load_dataset(
                'proj-persona/PersonaHub',
                streaming=True,
                split='train'
            )
            
            personas_hf = []
            for idx, item in enumerate(dataset):
                if idx >= cantidad:
                    break
                
                # Extraer descripción psicológica detallada
                perfil_completo = item.get('persona_description', '')
                if not perfil_completo:
                    continue
                
                persona = {
                    "id": f"hf_persona_{idx}",
                    "perfil_base": perfil_completo[:500],  # Descripción completa de investigación
                    "nombre": item.get('persona_name', f'Persona {idx}'),
                    "origen": "hugging_face"
                }
                personas_hf.append(persona)
            
            if personas_hf:
                logger.info(f"✅ Cargadas {len(personas_hf)} personas de PersonaHub")
                return personas_hf
            else:
                logger.warning("⚠️  PersonaHub vacío, usando fallback")
                return None
                
        except Exception as e:
            logger.warning(f"⚠️  Error cargando PersonaHub: {e}")
            return None
    
    # Ejecutar con timeout de 5 segundos
    try:
        result = await asyncio.wait_for(cargar_hf(), timeout=5.0)
        if result:
            return result
    except asyncio.TimeoutError:
        logger.warning("⚠️  Timeout descargando PersonaHub (>5s), usando fallback")
    except Exception as e:
        logger.error(f"❌ Error en obtener_personas_huggingface: {e}")
    
    # Fallback: usar personas locales
    logger.info(f"📦 Usando {len(PERSONAS_FALLBACK)} personas locales como fallback")
    return PERSONAS_FALLBACK[:cantidad]


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
    
    Retorna: [{topico_emergente, porque_es_oportunidad, volumen_busqueda}, ...]
    """
    try:
        tendencias_str = ", ".join(tendencias) if tendencias else topico
        
        prompt = f"""Analiza como Growth Marketer en Chile. 

MARCA: {marca}
TÓPICO PRINCIPAL: {topico}
TENDENCIAS EMERGENTES EN GOOGLE: {tendencias_str}
COMUNICACIÓN ACTUAL DE LA MARCA: {comunicacion_actual}

Identifica 3 'Territorios Desatendidos': temas específicos donde:
- Hay búsquedas altas en Google Trends Chile
- La marca NO comunica activamente sobre esto
- Es una oportunidad de posicionamiento para {marca}

EJEMPLOS de territorios desatendidos:
- Para banco: "cashback en bencina", "tarjetas para nómadas digitales", "pago con reloj"
- Para retail: "compra ahora paga después", "suscripciones", "programa de referidos"

Retorna JSON VÁLIDO con exactamente este formato:
{{
    "territorios": [
        {{
            "topico_emergente": "tema específico (máx 8 palabras)",
            "porque_es_oportunidad": "explicación concisa por qué es oportunidad (máx 20 palabras)",
            "volumen_busqueda": "Alto" o "Medio",
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


async def generar_escenarios_ia(topico: str, tendencias: List[str]) -> List[dict]:
    """
    Genera preguntas naturales en jerga chilena para cada persona de investigación.
    Usa contexto psicológico detallado de PersonaHub.
    
    Retorna: [{perfil_base, prompt_ia, persona_id, origen}, ...]
    """
    # Cargar personas de grado investigación (HF o fallback)
    personas = await obtener_personas_huggingface(cantidad=5)
    
    escenarios = []
    tendencias_str = ", ".join(tendencias) if tendencias else "el tópico general"
    
    for persona in personas:
        try:
            perfil_base = persona.get('perfil_base', '')
            
            # Prompt actualizado según especificación
            prompt_sistema = """Eres un analista de mercado especializado en comportamiento de consumidores chilenos.

Tu tarea: Toma la descripción psicológica detallada de un usuario y contextualiza esa persona en Chile.
Luego escribe la pregunta EXACTA (en jerga chilena natural) que este usuario escribiría en ChatGPT.

La pregunta debe:
- Usar lenguaje coloquial chileno auténtico (NO formal)
- Reflejar motivaciones y necesidades específicas del perfil psicológico
- Ser práctica, urgente y realista
- Incluir contexto local chileno (ciudades, bancos, contexto económico, etc.)

Retorna JSON válido con exactamente este formato:
{
    "prompt": "la pregunta exacta en jerga chilena",
    "razon": "por qué esta persona hace esta pregunta"
}"""
            
            prompt_usuario = f"""Descripción psicológica detallada del usuario:
{perfil_base}

Tópico de búsqueda: {topico}
Tendencias relacionadas en Chile: {tendencias_str}

Genera la pregunta exacta (en jerga chilena natural) que ESTA PERSONA escribiría en ChatGPT para {topico}.
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
                "perfil_base": perfil_base,  # Descripción completa de investigación
                "prompt_ia": data.get("prompt", ""),  # Pregunta generada
                "razon": data.get("razon", ""),
                "persona_id": persona.get('id', ''),
                "origen": persona.get('origen', 'local')
            })
            
            logger.info(f"✅ Generado escenario: {persona.get('id')} - {data.get('prompt', '')[:50]}...")
            
        except Exception as e:
            logger.error(f"❌ Error generando escenario para persona {persona.get('id')}: {e}")
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
            print(f"    └─ Volumen: {terr['volumen_busqueda']}\n")
        
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
