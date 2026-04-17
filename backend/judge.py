import asyncio
import json
import os
import logging
from typing import List, Optional
from dotenv import load_dotenv
from openai import AsyncOpenAI
from models import AnalisisMarca, PrioridadEjecutiva, PlanAccion, AccionMejora

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


async def extraer_metricas(texto_ia: str, mi_marca: str) -> AnalisisMarca:
    """Extrae métricas y recomendación de texto usando OpenAI con JSON mode."""
    
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": f"""Eres un experto en análisis de mercado. DEBES extraer EXACTAMENTE 6 campos en JSON válido:

1. "marcas_mencionadas": Array de TODAS las marcas, empresas, bancos o tiendas detectadas. Sé EXTREMADAMENTE minucioso:
   - Si dice "el Santander" o "Santander" → "Banco Santander"
   - Si dice "Chile" en contexto de banco/empresa → "Banco de Chile"
   - Si dice "Falabella" o "Falabella.com" → "Falabella"
   - Si dice "Amazon", "Best Buy", "Mercado Libre", "Ripley" → inclúyelos todos
   - Busca nombres propios de empresas, marcas comerciales, instituciones
   - Si realmente NO hay marcas identifiables, devuelve lista vacía []

2. "marca_ganadora": La marca más recomendada/mencionada positivamente (string o null)

3. "posicion_mi_marca": Primera aparición de la marca buscada (1=primera, 2=segunda, etc.). 0 si NO aparece

4. "sentimiento": Una ÚNICA palabra: "positivo", "negativo" o "neutral"

5. "competidor_principal": REGLA ESTRICTA:
   - Si posicion_mi_marca es 1 (mi_marca es #1): competidor_principal = la marca en posición #2 (segunda marca más mencionada positivamente)
   - Si posicion_mi_marca NO es 1 (mi_marca no es #1 o no aparece): competidor_principal = marca_ganadora (la marca #1)
   - Si no hay suficientes marcas, usa la marca_ganadora
   - IMPORTANTE: competidor_principal NUNCA debe ser igual a mi_marca
   - Retorna string vacío "" si no se puede determinar

6. "recomendacion_ia": Recomendación accionable en una frase (máx 150 caracteres):
   - Si mi_marca NO aparece: "Aumenta tu presencia en este tema [tema]. Posiciónate como experto en [característica]"
   - Si es #1 o #2: "Refuerza tu comunicación sobre [punto fuerte del ganador] para mantener liderazgo"
   - Si está más abajo: "Enfatiza [diferenciador de ganador]. Mi_marca debe comunicar mejor sobre [aspecto]"

REGLAS:
- Retorna JSON válido SOLAMENTE
- marca_ganadora puede ser null
- sentimiento siempre es uno de los 3 valores
- marcas_mencionadas puede estar vacía si no hay marcas
- recomendacion_ia SIEMPRE debe tener un valor específico y accionable
- competidor_principal es CRÍTICO para el Mapa de Diferenciación

Marca a buscar: {mi_marca}"""
            },
            {
                "role": "user",
                "content": f"Marca a buscar: {mi_marca}\n\nTexto para analizar:\n{texto_ia}\n\nRetorna JSON con los 6 campos. ESPECIALMENTE IMPORTANTE: calcula competidor_principal según la regla."
            }
        ]
    )
    
    response_json = json.loads(response.choices[0].message.content)
    
    # Asegurar tipos correctos
    if "marcas_mencionadas" not in response_json or not isinstance(response_json["marcas_mencionadas"], list):
        response_json["marcas_mencionadas"] = []
    if "sentimiento" not in response_json or response_json["sentimiento"] not in ["positivo", "negativo", "neutral"]:
        response_json["sentimiento"] = "neutral"
    if "posicion_mi_marca" not in response_json or not isinstance(response_json["posicion_mi_marca"], int):
        response_json["posicion_mi_marca"] = 0
    if "recomendacion_ia" not in response_json or not response_json["recomendacion_ia"]:
        response_json["recomendacion_ia"] = f"Analiza el mercado y mejora tu posicionamiento frente a {response_json.get('marca_ganadora', 'la competencia')}"
    
    # Validar competidor_principal según la regla
    if "competidor_principal" not in response_json or not response_json["competidor_principal"]:
        posicion = response_json.get("posicion_mi_marca", 0)
        marca_ganadora = response_json.get("marca_ganadora", "")
        
        # Si mi_marca es #1 o no aparece pero tenemos marca_ganadora, usarla como fallback
        response_json["competidor_principal"] = marca_ganadora or ""
    
    # Asegurar que competidor_principal nunca sea igual a mi_marca
    if response_json.get("competidor_principal", "").lower() == mi_marca.lower():
        response_json["competidor_principal"] = response_json.get("marca_ganadora", "")
    
    logger.info(f"Extracted metrics for {mi_marca}: {response_json}")
    return AnalisisMarca(**response_json)


async def generar_plan_accion_pro(
    texto_ia: str,
    marca_usuario: str,
    marca_ganadora: Optional[str],
    posicion: int,
    recomendacion: str
) -> str:
    """Genera un plan de acción estratégico PRO con tono de Consultor Senior."""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "system",
                "content": """Eres un Consultor Senior de Estrategia Digital con 15 años en el mercado chileno. 
Tu rol es redactar briefs estratégicos que las empresas EJECUTAN inmediatamente.
Tono: Profesional, directo, sin rodeos. Habla como si fueras el CTO de una agencia premium.
Formato: Redacta en párrafos cortos (máx 120 caracteres c/u), sin bullets, fluido y ejecutable."""
            },
            {
                "role": "user",
                "content": f"""Analiza este contexto y redacta un PLAN DE ACCIÓN ESTRATÉGICO de 3 puntos:

CONTEXTO:
- Mi marca: {marca_usuario}
- Posición actual: {"#" + str(posicion) if posicion > 0 else "No detectada"}
- Marca líder: {marca_ganadora or "No hay"}
- Análisis IA: {texto_ia[:500]}

TAREAS (responde como Consultor Senior):

1. CONTENIDO FALTANTE: ¿Qué contenido exacto (título, tema, formato) necesitamos en nuestra web para que la IA nos prefiera? Sé específico.

2. NEUTRALIZAR COMPETENCIA: ¿Qué atributos de {marca_ganadora} debemos neutralizar o superar en nuestra comunicación?

3. KEYWORD CHILENA: ¿Qué concepto, palabra clave o insight del mercado chileno DEBEMOS dominar para ganar posiciones?

Redacta en 3 párrafos cortos. Sin viñetas. Tono ejecutivo. Sé directo."""
            }]
        )
        
        plan = response.choices[0].message.content
        logger.info(f"Generated PRO action plan for {marca_usuario}")
        return plan
    except Exception as e:
        logger.error(f"Error generating action plan: {e}")
        return ""


async def generar_content_brief(recomendacion: str, marca_ganadora: str, marca_usuario: str) -> List[str]:
    """Genera 3 títulos de contenido accionables para subir en ranking."""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[{
                "role": "system",
                "content": "Eres un copywriter experto en marketing digital para Chile. Generas títulos SEO-friendly para posts/landing pages."
            },
            {
                "role": "user",
                "content": f"""Basándote en esta recomendación de mejora:
'{recomendacion}'

Marca del usuario: {marca_usuario}
Marca ganadora: {marca_ganadora}

Genera EXACTAMENTE 3 títulos de contenido que {marca_usuario} debería crear INMEDIATAMENTE para competir.
Cada título debe ser:
- SEO-friendly (con keywords implícitas)
- Accionable (no genérico)
- Orientado al mercado chileno

Retorna JSON válido SOLAMENTE: {{"titles": ["título 1", "título 2", "título 3"]}}"""
            }]
        )
        
        data = json.loads(response.choices[0].message.content)
        titles = data.get("titles", [])
        if isinstance(titles, list) and len(titles) == 3:
            logger.info(f"Generated 3 content ideas for {marca_usuario}")
            return titles
        else:
            return []
    except Exception as e:
        logger.error(f"Error generating content brief: {e}")
        return []


async def extraer_conceptos_faltantes(
    texto_ia: str,
    marca_ganadora: Optional[str],
    mi_marca: str
) -> List[str]:
    """
    Mapa de Conceptos Perdidos: Identifica 3 palabras clave o conceptos que 
    la marca ganadora usa y que mi_marca no tiene.
    
    Ej: Santander: "cuota cero, puntos ilimitados, atención 24/7"
        Mi marca (BancoX) no menciona estos.
    """
    try:
        # No comparar mi_marca consigo misma
        if not marca_ganadora or marca_ganadora.lower() == mi_marca.lower():
            return []
        
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            temperature=0.3,
            messages=[
                {
                    "role": "system",
                    "content": """Eres un analista de marketing competitivo. Tu tarea es identificar las palabras clave y conceptos diferenciadores.

Analiza el texto y extrae EXACTAMENTE 3 conceptos o palabras clave que la marca ganadora menciona o implica, pero que la marca del usuario NO mencionó.

Estos conceptos deben ser:
- Beneficios específicos (ej: "cuota cero", "puntos ilimitados")
- Características distintivas (ej: "atención 24/7", "app móvil avanzada")
- Promesas de valor (ej: "proceso rápido", "sin comisiones")
- Palabras clave de posicionamiento (ej: "innovación", "confianza", "premium")

Retorna SOLO JSON válido: {"conceptos": ["concepto1", "concepto2", "concepto3"]}

Si no puedes identificar 3 conceptos claros, devuelve solo lo que encuentres."""
                },
                {
                    "role": "user",
                    "content": f"""Marca ganadora/competidor: {marca_ganadora}
Mi marca: {mi_marca}

Texto de análisis:
{texto_ia}

Identifica 3 conceptos clave que {marca_ganadora} comunica pero que {mi_marca} NO menciona. Asegúrate de que sean diferenciadores reales y no coincidan.

Retorna SOLO JSON válido."""
                }
            ]
        )

        data = json.loads(response.choices[0].message.content)
        conceptos = data.get("conceptos", [])
        
        if isinstance(conceptos, list) and len(conceptos) > 0:
            # Limitar a 3 máximo
            conceptos = [c.strip() for c in conceptos if c.strip()][:3]
            logger.info(f"Extracted {len(conceptos)} missing concepts for {mi_marca}")
            return conceptos
        else:
            return []
        
    except Exception as e:
        logger.error(f"Error extracting missing concepts: {e}")
        return []
    except Exception as e:
        logger.error(f"Error generating content brief: {e}")
        return []


async def generar_prioridad_ejecutiva(
    posicion_mi_marca: int,
    sentimiento: str,
    marca_ganadora: Optional[str],
    mi_marca: str,
    texto_ia: str,
    recomendacion_ia: str
) -> PrioridadEjecutiva:
    """
    Growth Strategist: Filtra lo irrelevante y destaca solo lo más urgente.
    Determina la estrategia: Mantener, Defender o Atacar.
    """
    try:
        # Determinar clasificación basada en posición y sentimiento
        if posicion_mi_marca in [1, 2]:
            clasificacion = "Mantener"
            estrategia = "Posición consolidada. Enfócate en mantener el liderazgo"
        elif posicion_mi_marca in [3, 4, 5]:
            clasificacion = "Defender"
            estrategia = "Estás cerca del Top 3. Pequeños movimientos pueden impulsar crecimiento"
        else:
            clasificacion = "Atacar"
            estrategia = "Necesitas ganar visibilidad. Hay una oportunidad clara"

        # Generar prioridad usando IA
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            temperature=0.3,
            messages=[
                {
                    "role": "system",
                    "content": """Eres un Growth Strategist ejecutivo. Tu trabajo es filtrar ruido y elegir LA ÚNICA acción más importante.

Tu respuesta será usada por C-level executives. Sé brutalmente honesto y práctico.

Retorna EXACTAMENTE este JSON (ningún otro campo):
{
  "foco_principal": "Una sola acción (máx 10 palabras). Ej: 'Publicar guía sobre beneficios sin comisiones'",
  "esfuerzo": "Bajo/Medio/Alto",
  "tiempo_estimado": "Ej: '2 semanas', '1 mes', '3 meses'",
  "impacto_esperado": "Resultado específico. Ej: 'Subir de #5 a #2 en el segmento millennials'",
  "roi_score": número entre 1-10
}

REGLAS:
- foco_principal: Una ÚNICA acción que tenga mayor ROI
- esfuerzo: Sé realista
- tiempo_estimado: Basado en contenido web o cambios de reputación
- roi_score: 10=máximo impacto, 1=mínimo
- Ignora TODA recomendación genérica o de bajo impacto"""
                },
                {
                    "role": "user",
                    "content": f"""Contexto:
- Mi marca: {mi_marca}
- Posición actual: #{posicion_mi_marca if posicion_mi_marca > 0 else 'No aparece'}
- Sentimiento: {sentimiento}
- Marca ganadora: {marca_ganadora or 'N/A'}
- Clasificación: {clasificacion} ({estrategia})

Recomendación general:
{recomendacion_ia}

Texto de análisis:
{texto_ia[:500]}

¿Cuál es EL ÚNICO movimiento más importante que {mi_marca} debe hacer AHORA para mejorar su posición?

Retorna SOLO JSON válido."""
                }
            ]
        )

        data = json.loads(response.choices[0].message.content)
        
        # Validar y completar campos
        foco = data.get("foco_principal", "Crear contenido diferenciado")
        esfuerzo = data.get("esfuerzo", "Medio")
        tiempo = data.get("tiempo_estimado", "2 semanas")
        impacto = data.get("impacto_esperado", "Mejorar visibilidad en segmento clave")
        roi = data.get("roi_score", 5)
        
        # Asegurar valores válidos
        if esfuerzo not in ["Bajo", "Medio", "Alto"]:
            esfuerzo = "Medio"
        if not isinstance(roi, int) or roi < 1 or roi > 10:
            roi = 5

        prioridad = PrioridadEjecutiva(
            foco_principal=foco,
            esfuerzo=esfuerzo,
            tiempo_estimado=tiempo,
            impacto_esperado=impacto,
            roi_score=roi,
            clasificacion=clasificacion
        )
        
        logger.info(f"Generated executive priority for {mi_marca}: {clasificacion}")
        return prioridad
        
    except Exception as e:
        logger.error(f"Error generating executive priority: {e}")
        # Retornar default si falla
        return PrioridadEjecutiva(
            foco_principal=f"Mejorar visibilidad en mercado chileno",
            esfuerzo="Medio",
            tiempo_estimado="2 semanas",
            impacto_esperado="Aumentar presencia en búsquedas clave",
            roi_score=5,
            clasificacion="Atacar" if posicion_mi_marca > 5 else "Defender"
        )


def calcular_estado_invisibilidad(
    posicion_mi_marca: int,
    sentimiento: str,
    marcas_mencionadas: list,
    mi_marca: str
) -> tuple:
    """
    Calcula el estado de invisibilidad de una marca.
    
    Retorna: (estado_invisibilidad, visibilidad_score)
    - estado: "visible" (top 3)
    - estado: "en_riesgo" (posición 4-10 o top 3 con sentimiento negativo)
    - estado: "invisible" (no mencionada)
    - score: 0-100 (100=máxima visibilidad, 0=completamente invisible)
    """
    # Si posición es 0 -> no fue detectada
    if posicion_mi_marca == 0:
        return "invisible", 0
    
    # Si está en top 3 -> VISIBLE (independientemente del sentimiento)
    # porque estar en top 3 significa que fue mencionada y bien posicionada
    if posicion_mi_marca <= 3:
        if sentimiento == "positivo":
            # Posición 1-3 con sentimiento positivo: 80-100
            score = 100 - (posicion_mi_marca - 1) * 10
            return "visible", score
        else:
            # Posición 1-3 con sentimiento neutral/negativo: 60-75
            score = 75 - (posicion_mi_marca - 1) * 5
            return "visible", score
    
    # Si está en posición 4-10 -> EN_RIESGO
    if 4 <= posicion_mi_marca <= 10:
        # Posición 4+ disminuye score de forma moderada
        score = max(50 - (posicion_mi_marca - 4) * 8, 20)
        return "en_riesgo", score
    
    # Si está en posición 11+ -> INVISIBLE
    if posicion_mi_marca > 10:
        return "en_riesgo", max(15 - (posicion_mi_marca - 11), 5)
    
    # Default
    return "en_riesgo", 50


async def generar_plan_accion(
    estado_invisibilidad: str,
    posicion_mi_marca: int,
    marca_ganadora: Optional[str],
    mi_marca: str,
    conceptos_faltantes: List[str],
    texto_ia: str
) -> Optional[PlanAccion]:
    """
    Senior Growth Marketer: Genera plan de rescate con quick wins y acciones estratégicas.
    - Quick win: Acción sin IT, bajo costo, 48-72h
    - Estratégico: Cambio profundo, 1 mes, mayor inversión
    - ROI estimado: Cuantificable
    """
    
    if estado_invisibilidad == "visible":
        return None  # No necesita plan de rescate
    
    try:
        prompt_content = f"""Eres un Senior Growth Marketer en Chile con experiencia en posicionamiento de marcas ante IA.

Tu marca: {mi_marca}
Estado: {estado_invisibilidad}
Posición: #{posicion_mi_marca if posicion_mi_marca > 0 else "No detectada"}
Competidor principal: {marca_ganadora or "Varios"}
Conceptos que falta comunicar: {', '.join(conceptos_faltantes[:3]) if conceptos_faltantes else "N/A"}

Contexto de búsqueda:
{texto_ia[:800]}

Genera un plan de rescate en JSON con:

1. QUICK WIN (48-72h, SIN IT, costo bajo):
   - Acción específica y accionable (ej: "Crear 5 posts en LinkedIn sobre [concepto]", "Responder FAQs en foros")
   - Esfuerzo: "Bajo"
   - Tiempo: "48-72h"
   - Costo estimado en UF: 3-8 UF (ej: "5-8 UF")

2. ESTRATÉGICO (1 mes+, requiere inversión):
   - Acción concreta (ej: "Landing page optimizada para [concepto]", "Actualizar sección de [tema] en web")
   - Esfuerzo: "Medio" o "Alto"
   - Tiempo: "1 mes" o "6 semanas"
   - Costo estimado en UF: 15-30 UF (ej: "15-25 UF")

3. ROI ESTIMADO:
   - Cuantificable (ej: "Aumento en mentions de 35%, reducción CAC 20%", "Posicionarse en top 3 en 30 días")

Retorna SOLO JSON válido."""

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.3,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": "Eres un analista experto en growth marketing. Retorna SOLO JSON válido con estructura exacta."
                },
                {
                    "role": "user",
                    "content": prompt_content
                }
            ]
        )
        
        data = json.loads(response.choices[0].message.content)
        
        # Extrae campos
        quick_win_data = data.get("quick_win", {})
        estrategico_data = data.get("estrategico", {})
        roi = data.get("roi_estimado", "Aumento en visibilidad y mentions")
        
        plan = PlanAccion(
            quick_win=AccionMejora(
                accion=quick_win_data.get("accion", f"Crear contenido sobre '{conceptos_faltantes[0] if conceptos_faltantes else 'tu propuesta'}'"),
                esfuerzo=quick_win_data.get("esfuerzo", "Bajo"),
                tiempo=quick_win_data.get("tiempo", "48-72h"),
                costo_estimado=quick_win_data.get("costo_estimado", "5-8 UF")
            ),
            estrategico=AccionMejora(
                accion=estrategico_data.get("accion", f"Optimizar web con conceptos clave: {', '.join(conceptos_faltantes[:2])}"),
                esfuerzo=estrategico_data.get("esfuerzo", "Medio"),
                tiempo=estrategico_data.get("tiempo", "1 mes"),
                costo_estimado=estrategico_data.get("costo_estimado", "15-25 UF")
            ),
            roi_estimado=str(roi)
        )
        
        logger.info(f"Generated action plan for {mi_marca}")
        return plan
        
    except Exception as e:
        logger.error(f"Error generating action plan: {e}")
        return None


if __name__ == "__main__":
    async def main():
        texto = """
        Banco de Chile es la institución más confiable del mercado.
        Banco Santander ofrece excelentes servicios a empresas.
        Mi Marca (BancoX) crece rápidamente en el sector.
        Banco BICE también es competitivo.
        BancoX destaca por su atención digital.
        """
        
        resultado = await extraer_metricas(texto, "BancoX")
        print(f"Marcas: {resultado.marcas_mencionadas}")
        print(f"Ganadora: {resultado.marca_ganadora}")
        print(f"Posición: {resultado.posicion_mi_marca}")
        print(f"Sentimiento: {resultado.sentimiento}")

    asyncio.run(main())
