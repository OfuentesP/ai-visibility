import asyncio
import json
import os
import logging
from typing import List, Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from openai import AsyncOpenAI
from pytrends.request import TrendReq

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# ==================== PERSONAS CHILE ====================
PERSONAS_CHILE = [
    {
        "id": "estudiante",
        "nombre": "Estudiante Universitario",
        "edad": 20,
        "descripcion": "Estudia administración en universidad. Le importa no pagar comisiones.",
        "poder_adquisitivo": "bajo",
        "tech_savvy": "alto"
    },
    {
        "id": "emprendedor",
        "nombre": "Emprendedor de PYME",
        "edad": 40,
        "descripcion": "Dueño de ferretería. Necesita gestionar flujo de caja.",
        "poder_adquisitivo": "medio",
        "tech_savvy": "bajo"
    },
    {
        "id": "familia",
        "nombre": "Padre de familia buscando ahorro",
        "edad": 35,
        "descripcion": "Mamá de 2 hijos. Busca seguridad y ahorro en compras.",
        "poder_adquisitivo": "medio",
        "tech_savvy": "medio"
    },
    {
        "id": "adulto_mayor",
        "nombre": "Adulto Mayor",
        "edad": 65,
        "descripcion": "Jubilado. Valora seguridad y atención personalizada.",
        "poder_adquisitivo": "medio",
        "tech_savvy": "bajo"
    }
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
    Genera escenarios naturales chilenos para cada persona basado en tendencias.
    Retorna: [{persona, prompt_ia, preocupacion_principal}, ...]
    """
    escenarios = []
    tendencias_str = ", ".join(tendencias) if tendencias else "el tópico general"
    
    for persona in PERSONAS_CHILE:
        try:
            # Generar prompt con IA
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type": "json_object"},
                temperature=0.7,
                messages=[
                    {
                        "role": "system",
                        "content": """Eres un experto en lenguaje coloquial chileno. 
                        Genera una pregunta natural que haría esta persona en ChatGPT.
                        La pregunta debe:
                        - Usar lenguaje chileno natural (NO formal)
                        - Reflejar la necesidad específica de la persona
                        - Ser práctica y urgente
                        - Incorporar contexto local chileno
                        
                        Retorna JSON: {"prompt": "pregunta aquí", "preocupacion": "necesidad principal"}"""
                    },
                    {
                        "role": "user",
                        "content": f"""Genera pregunta para: {persona['nombre']} ({persona['edad']} años)
                        Descripción: {persona['descripcion']}
                        Tópico: {topico}
                        Tendencias relacionadas en Chile: {tendencias_str}
                        
                        Retorna JSON con prompt y preocupacion."""
                    }
                ]
            )
            
            data = json.loads(response.choices[0].message.content)
            
            escenarios.append({
                "persona": f"{persona['nombre']} ({persona['edad']} años)",
                "prompt_ia": data.get("prompt", ""),
                "preocupacion_principal": data.get("preocupacion", ""),
                "persona_id": persona['id']
            })
            
            logger.info(f"✅ Generado escenario: {persona['nombre']} - {data['prompt'][:60]}...")
            
        except Exception as e:
            logger.error(f"❌ Error generando escenario para {persona['nombre']}: {e}")
            continue
    
    return escenarios


if __name__ == "__main__":
    # Test: obtener tendencias, detectar territorios desatendidos y generar escenarios
    async def test():
        topico = "mejor banco en chile"
        marca = "MiBanco"
        comunicacion_actual = "Enfocados en cuentas corrientes y depósitos a plazo. No tenemos comunicación sobre tarjetas, cashback o servicios digitales."
        
        tendencias = await obtener_tendencias_chile(topico)
        print(f"\n✅ Tendencias: {tendencias}\n")
        
        # NUEVO: Detectar territorios desatendidos
        territorios = await detectar_territorios_desatendidos(topico, tendencias, marca, comunicacion_actual)
        print("📍 TERRITORIOS DESATENDIDOS DETECTADOS:\n")
        for terr in territorios:
            print(f"  • {terr['topico_emergente']}")
            print(f"    └─ Oportunidad: {terr['porque_es_oportunidad']}")
            print(f"    └─ Volumen: {terr['volumen_busqueda']}")
            print(f"    └─ Intención: {terr['intension_usuario']}\n")
        
        escenarios = await generar_escenarios_ia(topico, tendencias)
        print("\n👥 ESCENARIOS DE USUARIOS:\n")
        for esc in escenarios:
            print(f"Persona: {esc['persona']}")
            print(f"Prompt: {esc['prompt_ia']}")
            print(f"Preocupación: {esc['preocupacion_principal']}\n")
    
    asyncio.run(test())
