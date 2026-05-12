import asyncio
import json
import os
import re
import logging
import unicodedata
from typing import List, Optional
from dotenv import load_dotenv
from openai import AsyncOpenAI
from models import AnalisisMarca, PrioridadEjecutiva, PlanAccion, VehiculoContenido, AccionICE, CATALOGO_TACTICAS_AEO, CompetitorAdvantage, CompetitorAdvantageRow
from config import AI_MODEL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()


# Matriz de tiempos de indexación determinista — fuente: comportamiento real de crawlers IA
_TIEMPO_MATRIZ = [
    (["digital pr", "medios autorizados", "nota de prensa", "prensa"],
     "24 - 48 horas"),
    (["schema faq", "faq", "json-ld", "tablas html", "tabla html", "tabla comparativa"],
     "3 - 7 días"),
    (["landing", "inyección semántica", "inyeccion semantica", "página de destino"],
     "1 - 2 semanas"),
    (["knowledge graph", "grafo", "entidades", "wikidata", "schema organization"],
     "3 - 6 semanas"),
]
_TIEMPO_DEFAULT = "3 - 7 días"


def _tiempo_por_tactica(tactica: str) -> str:
    """Devuelve el tiempo de indexación exacto según la matriz de la industria."""
    tactica_lower = tactica.lower()
    for keywords, tiempo in _TIEMPO_MATRIZ:
        if any(k in tactica_lower for k in keywords):
            return tiempo
    return _TIEMPO_DEFAULT

import httpx


def _strip_accents(s: str) -> str:
    """Remove diacritics/accents for fuzzy brand matching: Colún → colun."""
    return ''.join(
        c for c in unicodedata.normalize('NFD', s)
        if unicodedata.category(c) != 'Mn'
    )


_api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(
    api_key=_api_key,
    timeout=httpx.Timeout(60.0, connect=10.0)
) if _api_key else None


async def justificar_eleccion_arquetipo(
    texto_ia_raw: str,
    marca_elegida: str,
    arquetipo: str,
    driver: str,
    dealbreaker: str,
    mi_marca: str,
    marcas_mencionadas: list,
    texto_base: str = "",
) -> dict:
    """Genera justificación GROUNDED + consideration set + confidence score + dealbreaker check.
    Retorna dict con: justificacion, segunda_opcion, factor_desempate, certeza, dealbreaker_activado, dealbreaker_detalle."""
    # Armar lista de marcas para consideration set
    marcas_str = ", ".join(marcas_mencionadas[:6]) if marcas_mencionadas else "las marcas del texto"
    
    # Contexto extra del texto base para dealbreaker detection
    texto_base_ctx = ""
    if texto_base and mi_marca.lower() in texto_base.lower():
        texto_base_ctx = f"""

TEXTO BASE (donde {mi_marca} SÍ aparece — úsalo para evaluar dealbreaker):
{texto_base[:1000]}"""

    response = await client.chat.completions.create(
        model=AI_MODEL,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": f"""Eres un simulador forense de decisión de compra.

CONTEXTO: Un usuario sintético con arquetipo "{arquetipo}" (driver: {driver}) leyó el texto de una IA.
Eligió a "{marca_elegida}" como primera opción.
Marcas disponibles en el texto: {marcas_str}
Marca auditada (del cliente): "{mi_marca}"

DEALBREAKER de este arquetipo: [{dealbreaker}]
Si el texto asocia ALGUNA marca con estas fricciones, ese arquetipo la BLOQUEA instantáneamente.

Debes retornar un JSON con EXACTAMENTE estos 6 campos:

1. "justificacion": (string, máx 2 frases) Cita un dato CONCRETO del texto que justifique la elección.
   PROHIBIDO: frases genéricas ("es confiable", "me da paz mental"). DEBE referenciar algo del texto.

2. "segunda_opcion": (string) La marca que quedó en segundo lugar en la terna de este arquetipo.
   DEBE ser una marca DIFERENTE a marca_elegida y que aparezca en el texto.

3. "factor_desempate": (string, máx 1 frase) Qué factor concreto del texto hizo que marca_elegida
   ganara sobre segunda_opcion. CRÍTICO: el factor DEBE favorecer a marca_elegida, NO a segunda_opcion.
   ✅ CORRECTO: "Banco Estado no cobra mantención, Scotiabank sí cobra $3.990 mensuales"
   ❌ INCORRECTO: "Banco Falabella es casi instantánea pero elegí a BICE" (favorece al perdedor)
   La frase debe demostrar POR QUÉ el ganador es MEJOR que el segundo en el driver del arquetipo.

4. "certeza": (int, 50-100) Qué tan seguro está este arquetipo de su elección.
   - 90-100: Ganador claro, sin duda
   - 70-89: Buena opción pero la segunda estaba cerca
   - 50-69: Decisión ajustada, podría cambiar con una campaña menor

5. "dealbreaker_activado": (bool) ¿ALGUNO de los textos (principal o base) asocia a "{mi_marca}" con estos dealbreakers: [{dealbreaker}]?
   true = CUALQUIER texto menciona lentitud, costos ocultos, burocracia u otra fricción intolerable ASOCIADA a "{mi_marca}".
   IMPORTANTE: También busca señales IMPLÍCITAS. Si el texto dice que "{mi_marca}" tiene "comisiones" o "mantención" y el dealbreaker es "costos ocultos", eso CUENTA.
   Si el texto dice que otra marca es "más rápida" que "{mi_marca}", eso implica que "{mi_marca}" es lenta → dealbreaker para el Digital.
   false = no hay evidencia directa ni implícita de esa fricción.

6. "dealbreaker_detalle": (string) Si dealbreaker_activado=true, cita la evidencia exacta del texto.
   Si false, escribe "Sin fricción detectada".

REGLAS:
- Si "{mi_marca}" NO aparece en el texto, dealbreaker_activado=false y segunda_opcion NUNCA puede ser "{mi_marca}".
- Todos los datos DEBEN venir del texto provisto. No inventes."""
            },
            {
                "role": "user",
                "content": f"Texto de la IA:\n{texto_ia_raw[:2000]}{texto_base_ctx}\n\nMarca elegida: {marca_elegida}\nArquetipo: {arquetipo}\nDriver: {driver}\nDealbreaker: {dealbreaker}\nMarca auditada: {mi_marca}"
            }
        ]
    )
    data = json.loads(response.choices[0].message.content)
    
    # Post-guard: coherencia del factor_desempate
    factor = data.get("factor_desempate", "")
    segunda = data.get("segunda_opcion", "")
    if factor and segunda and marca_elegida:
        # Si el desempate menciona a segunda_opcion con superlativos, está contradiciéndose
        factor_lower = factor.lower()
        segunda_lower = segunda.lower()
        contradiccion_patterns = ["instantáne", "más rápid", "mejor que", "supera a", "más económic"]
        # Check: "segunda_opcion" + superlativo en factor
        if segunda_lower in factor_lower:
            for pat in contradiccion_patterns:
                if pat in factor_lower:
                    # Desempate favorece al perdedor → reescribir
                    factor = f"{marca_elegida} fue destacada por el texto con ventajas específicas en {driver} que {segunda} no iguala."
                    data["factor_desempate"] = factor
                    logger.warning(f"COHERENCIA: factor_desempate contradecía la elección de {marca_elegida}, reescrito")
                    break
    
    return {
        "justificacion": data.get("justificacion", f"{marca_elegida} fue destacada en el análisis"),
        "segunda_opcion": data.get("segunda_opcion", ""),
        "factor_desempate": data.get("factor_desempate", ""),
        "certeza": max(50, min(100, int(data.get("certeza", 75)))),
        "dealbreaker_activado": bool(data.get("dealbreaker_activado", False)),
        "dealbreaker_detalle": data.get("dealbreaker_detalle", "Sin fricción detectada"),
    }


async def extraer_metricas(texto_ia: str, mi_marca: str) -> AnalisisMarca:
    """Extrae métricas y recomendación de texto usando OpenAI con JSON mode."""
    
    response = await client.chat.completions.create(
        model=AI_MODEL,
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
   - IMPORTANTE: Distingue entre FABRICANTES (Samsung, LG, Bosch, Nike) y RETAILERS/CANALES (Falabella, Ripley, Sodimac, Paris). Incluye AMBOS tipos.

2. "marca_ganadora": La marca más recomendada/mencionada positivamente en el texto (string o null).
   ✅ REGLA DE HONESTIDAD: Reporta FIELMENTE quién es la marca #1 según el texto. Si '{mi_marca}' genuinamente aparece primero y con mejor recomendación, entonces marca_ganadora = '{mi_marca}'. NO inventes un falso ganador.
   ⚠️ REGLA RETAILER vs FABRICANTE: Si '{mi_marca}' es un RETAILER (tienda/e-commerce como Falabella, Ripley, Paris, Sodimac, Líder), la marca_ganadora DEBE ser otro RETAILER o '{mi_marca}' si es #1, NO un fabricante.

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

REGLA DE INTEGRIDAD DE DATOS: La marca definida como 'marca_ganadora' y la marca que menciones como líder en la 'recomendacion_ia' DEBE SER EXACTAMENTE la misma marca que pongas en la PRIMERA posición (índice 0) de la lista 'marcas_mencionadas'. Prohibido mencionar a un competidor como dominante si no es el número 1 en la lista. Si marca_ganadora = "Ripley", entonces marcas_mencionadas[0] DEBE ser "Ripley".

REGLA DE PRECISIÓN DE MARCA (ANTI-COLISIÓN): Presta extrema atención a la ortografía exacta de la marca auditada. En el mercado financiero, marcas como 'BCI' (Banco de Crédito e Inversiones) y 'BICE' (Banco BICE) son competidores DISTINTOS. NO asumas que son errores tipográficos. Si la marca auditada es 'BCI', busca exclusivamente 'BCI' o 'Banco de Crédito e Inversiones'. Si el texto dice 'BICE', NO lo cuentes como una mención para BCI. La extracción de 'marcas_mencionadas' debe ser literal y exacta al texto provisto.

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
        marcas_list = response_json.get("marcas_mencionadas", [])
        
        if posicion == 1:
            # Mi marca es #1: competidor = primera marca que no sea mi_marca
            otras = [m for m in marcas_list if m.lower() != mi_marca.lower()]
            response_json["competidor_principal"] = otras[0] if otras else ""
        else:
            # Mi marca no es #1: competidor = marca_ganadora
            response_json["competidor_principal"] = marca_ganadora or ""
    
    # Asegurar que competidor_principal nunca sea igual a mi_marca
    if response_json.get("competidor_principal", "").lower() == mi_marca.lower():
        otras = [m for m in response_json.get("marcas_mencionadas", []) if m.lower() != mi_marca.lower()]
        response_json["competidor_principal"] = otras[0] if otras else ""

    # Si mi_marca ES la ganadora, competidor_principal debe ser la amenaza #2
    ganadora = response_json.get("marca_ganadora", "") or ""
    if ganadora.lower() == mi_marca.lower():
        otras = [m for m in response_json.get("marcas_mencionadas", []) if m.lower() != mi_marca.lower()]
        response_json["competidor_principal"] = otras[0] if otras else ""
    
    # Guardia: competidor_principal no puede ser igual a marca_ganadora (salvo que mi_marca sea ganadora)
    comp = (response_json.get("competidor_principal", "") or "").lower()
    gan = (response_json.get("marca_ganadora", "") or "").lower()
    if comp and gan and comp == gan and gan != mi_marca.lower():
        otras = [m for m in response_json.get("marcas_mencionadas", []) if m.lower() != mi_marca.lower() and m.lower() != gan]
        response_json["competidor_principal"] = otras[0] if otras else ""

    # RESOLUCIÓN DE ENTIDADES: recalcular posicion_mi_marca ANTES del reorden de INTEGRIDAD
    marcas_pre_reorden = response_json.get("marcas_mencionadas", [])
    marca_objetivo = _strip_accents(mi_marca.lower().strip())
    posicion_real = 0  # invisible por defecto
    for i, marca_mencionada in enumerate(marcas_pre_reorden):
        marca_norm = _strip_accents(marca_mencionada.lower().strip())
        # Anti-colisión: "bci" NO matchea "bice"
        if marca_objetivo == "bci" and "bice" in marca_norm:
            continue
        if marca_objetivo == marca_norm or re.search(rf'\b{re.escape(marca_objetivo)}\b', marca_norm):
            posicion_real = i + 1
            break
    if posicion_real != response_json.get("posicion_mi_marca", 0):
        logger.warning(f"RESOLUCIÓN: posicion_mi_marca corregida de {response_json.get('posicion_mi_marca')} a {posicion_real} para [{mi_marca}]")
    response_json["posicion_mi_marca"] = posicion_real

    # INTEGRIDAD DE DATOS: marca_ganadora DEBE ser marcas_mencionadas[0]
    marcas = response_json.get("marcas_mencionadas", [])
    ganadora_final = response_json.get("marca_ganadora", "") or ""
    if marcas and ganadora_final and marcas[0].lower() != ganadora_final.lower():
        marcas_sin = [m for m in marcas if m.lower() != ganadora_final.lower()]
        response_json["marcas_mencionadas"] = [ganadora_final] + marcas_sin
        logger.warning(f"INTEGRIDAD: Reordenó marcas_mencionadas para que [{ganadora_final}] sea índice 0")

    logger.info(f"Extracted metrics for {mi_marca}: {response_json}")
    return AnalisisMarca(**response_json)


async def generar_plan_accion_pro(
    texto_ia: str,
    marca_usuario: str,
    marca_ganadora: Optional[str],
    posicion: int,
    recomendacion: str
) -> str:
    """Genera 3 acciones concretas para que la marca aparezca en respuestas de IA."""
    try:
        competidor = marca_ganadora or "la competencia"
        response = await client.chat.completions.create(
            model=AI_MODEL,
            messages=[{
                "role": "system",
                "content": "Eres un asesor de marketing digital. Escribe en español, oraciones cortas, sin jargon técnico. Habla de clientes y resultados, no de algoritmos."
            }, {
                "role": "user",
                "content": f"""{marca_usuario} no aparece cuando sus clientes buscan en ChatGPT o Perplexity. {competidor} sí aparece.

Genera exactamente 3 acciones concretas y distintas para que {marca_usuario} empiece a aparecer. Cada acción debe:
- Tener un título corto (5 palabras máximo)
- Explicar qué hacer en 2 oraciones
- Decir quién lo ejecuta (marketing, TI o agencia)
- Estimar cuánto tarda en verse el resultado

Sin introducciones. Directo al punto."""
            }]
        )

        plan = response.choices[0].message.content
        logger.info(f"Generated action plan for {marca_usuario}")
        return plan
    except Exception as e:
        logger.error(f"Error generating action plan: {e}")
        return ""


async def generar_content_brief(recomendacion: str, marca_ganadora: str, marca_usuario: str) -> List[str]:
    """Genera 3 títulos de contenido accionables para subir en ranking."""
    try:
        response = await client.chat.completions.create(
            model=AI_MODEL,
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
    Content Gap Analysis: Identifica vacíos de contenido entre mi_marca y el ganador.

    Columna A — percepciones_genericas: atributos genéricos que la IA asocia con mi_marca
                pero que NO disparan recomendación para esta búsqueda específica.
    Columna B — diferenciadores_ganador: conceptos específicos que usa el ganador y que
                mi_marca omite completamente.

    Regla estricta: NINGÚN concepto puede aparecer en ambas listas.
    """
    try:
        if not marca_ganadora or marca_ganadora.lower() == mi_marca.lower():
            marca_ganadora = "el competidor en posición #2"

        response = await client.chat.completions.create(
            model=AI_MODEL,
            response_format={"type": "json_object"},
            temperature=0.2,
            messages=[
                {
                    "role": "system",
                    "content": f"""Eres un consultor de estrategia digital brutal y sin filtros. Tu trabajo es diagnosticar por qué '{mi_marca}' pierde contra '{marca_ganadora}' en los motores de IA.

DEBES retornar EXACTAMENTE este JSON con dos listas distintas y sin superposición:

{{
  "percepciones_genericas": ["atributo1", "atributo2", "atributo3"],
  "diferenciadores_ganador": ["concepto1", "concepto2", "concepto3"]
}}

REGLA CRÍTICA #1 — EXTRACCIÓN DEL TEXTO:
Los diferenciadores_ganador DEBEN ser CONCEPTOS ESTRATÉGICOS QUE '{mi_marca}' PUEDE RECLAMAR como propios pero que actualmente NO comunica.
NO son atributos exclusivos del competidor que no aplican a '{mi_marca}'.
Pregúntate: "¿Puede '{mi_marca}' legítimamente ofrecer o comunicar esto?" Si la respuesta es NO, DESCÁRTALO.
PROHIBIDO: atributos que son IDENTITARIOS del competidor (ej: "ideal para usuarios de Apple" si mi_marca NO es Apple, "marca internacional" si mi_marca es local).
CORRECTO: beneficios GENÉRICOS del mercado que '{mi_marca}' podría comunicar pero no lo hace (ej: "playlists personalizadas con IA", "envío gratuito same-day", "garantía extendida 3 años").

REGLA CRÍTICA #2 — INDUSTRIA ESPECÍFICA:
Las percepciones_genericas deben reflejar cómo '{mi_marca}' aparece en el CONTEXTO ESPECÍFICO de esta búsqueda.
PROHIBIDO copiar frases bancarias genéricas si la búsqueda es de otro rubro (seguros, retail, etc.).
Las percepciones deben incomodar al gerente mostrando la brecha real con el ganador EN ESTE MERCADO.

REGLA CRÍTICA #3 — FILTRO DE APLICABILIDAD:
Cada concepto en diferenciadores_ganador DEBE pasar AMBOS tests:
  TEST A: '¿Puede '{mi_marca}' reclamar esto como diferenciador competitivo?' → Si NO, rechazar.
  TEST B: '¿Es un beneficio que el público busca en esta categoría?' → Si NO, rechazar.
❌ RECHAZAR: 'ideal para usuarios de Apple' (identitario de Apple), 'marca internacional' (identitario de Nestlé), 'buenas ofertas' (genérico vacío)
✅ ACEPTAR: 'recomendaciones personalizadas con IA', 'precio garantizado más bajo', 'devolución sin preguntas' (beneficios que cualquier marca puede comunicar)

DEFINICIONES:
- percepciones_genericas: Atributos que la IA asocia con '{mi_marca}' en este contexto pero que suenan obsoletos, genéricos o débiles frente a '{marca_ganadora}'. Tono directo e incómodo.
- diferenciadores_ganador: Conceptos ACCIONABLES que '{marca_ganadora}' comunica exitosamente y que '{mi_marca}' PODRÍA comunicar pero NO lo hace. Deben ser territorios que '{mi_marca}' puede legítimamente reclamar.

REGLAS ADICIONALES:
1. NUNCA repitas un concepto en ambas listas.
2. Si '{mi_marca}' tiene score 0 (invisible), las percepciones deben reflejar ausencia total.
3. NUNCA retornes listas vacías. Mínimo 3 ítems por lista.
4. Los diferenciadores deben ser frases de 2-5 palabras que representen BENEFICIOS CONCRETOS o FEATURES DIFERENCIADORES que '{mi_marca}' podría adoptar.
5. TEST OBLIGATORIO: ¿'{mi_marca}' puede legítimamente ofrecer esto? Si no, DESCÁRTALO."""
                },
                {
                    "role": "user",
                    "content": f"""Texto completo de la búsqueda (LEE CON ATENCIÓN — los conceptos deben salir de aquí):
{texto_ia[:1200]}

Mi marca: {mi_marca}
Ganador/Competidor de referencia: {marca_ganadora}

Identifica:
1. ¿Cómo aparece '{mi_marca}' en este texto específico? ¿Qué percepción transmite que suena obsoleta? → percepciones_genericas
2. ¿Qué palabras y beneficios concretos menciona el texto para '{marca_ganadora}' que '{mi_marca}' NO menciona? → diferenciadores_ganador

RECUERDA: Los diferenciadores DEBEN estar en el texto. NO INVENTES.
Retorna SOLO JSON válido."""
                }
            ]
        )

        data = json.loads(response.choices[0].message.content)
        percepciones = data.get("percepciones_genericas", [])
        diferenciadores = data.get("diferenciadores_ganador", [])

        # Limpieza
        percepciones = [c.strip() for c in percepciones if c.strip()][:3]
        diferenciadores = [c.strip() for c in diferenciadores if c.strip()][:3]

        # Filtro estricto: eliminar duplicados entre listas (case-insensitive)
        percep_lower = {c.lower() for c in percepciones}
        diferenciadores = [c for c in diferenciadores if c.lower() not in percep_lower]

        # Fallbacks si alguna lista quedó vacía
        if not percepciones:
            percepciones = ["Baja visibilidad en motores IA para esta categoría", "Sin diferenciación comunicada en el texto", "Posicionamiento débil frente al ganador"]
        if not diferenciadores:
            diferenciadores = [c.strip() for c in texto_ia[:400].split(',') if len(c.strip()) > 5][:3] or ["Cobertura especializada", "Contratación online", "Atención inmediata"]

        logger.info(f"Content Gap for {mi_marca}: {len(percepciones)} percepciones, {len(diferenciadores)} diferenciadores")
        return {"percepciones_genericas": percepciones, "diferenciadores_ganador": diferenciadores}

    except Exception as e:
        logger.error(f"Error extracting content gap: {e}")
        return {
            "percepciones_genericas": ["Baja visibilidad en esta categoría", "Sin diferenciación comunicada", "Posicionamiento débil frente al ganador"],
            "diferenciadores_ganador": ["Cobertura especializada", "Proceso simplificado", "Atención inmediata"]
        }


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
            model=AI_MODEL,
            response_format={"type": "json_object"},
            temperature=0.3,
            messages=[
                {
                    "role": "system",
                    "content": """Eres un Revenue Strategist que asesora a CEOs y CMOs. Tu trabajo NO es dar consejos técnicos de SEO — es traducir la invisibilidad en IA a lenguaje de costo de oportunidad comercial.

Tu respuesta será presentada en un board ejecutivo. Usa el idioma del dinero y los clientes, no el de los rankings.

Retorna EXACTAMENTE este JSON (ningún otro campo):
{
  "foco_principal": "Una sola acción de contenido o credibilidad (máx 12 palabras). Habla de capturar demanda o recuperar clientes, no de 'subir posiciones'. Ej: 'Publicar caso de éxito que la IA pueda citar como prueba de confianza'",
  "esfuerzo": "Bajo/Medio/Alto",
  "tiempo_estimado": "Ej: '2 semanas', '1 mes', '3 meses'",
  "impacto_esperado": "Cuantifica el costo de oportunidad recuperado. Habla de clientes, no de rankings. Ej: 'Dejar de perder los compradores que actualmente la IA deriva a [competidor]' o 'Capturar el segmento de búsqueda que hoy convierte en el competidor'. NUNCA uses frases como Subir de #X a #Y.",
  "roi_score": número entre 1-10
}

REGLAS:
- Habla siempre en términos de clientes perdidos, demanda capturada, ingresos no realizados
- Si la marca no aparece, el tono es urgente: hay clientes activos siendo derivados a la competencia
- Si la marca aparece pero no lidera, el tono es oportunidad: hay demanda cualificada que no está convirtiendo
- roi_score: 10=máximo impacto comercial, 1=mínimo
- Ignora toda recomendación técnica de bajo impacto en ingresos"""
                },
                {
                    "role": "user",
                    "content": f"""Datos del análisis:
- Marca analizada: {mi_marca}
- Presencia en la IA: {'No aparece en ninguna respuesta' if posicion_mi_marca == 0 else f'Posición #{posicion_mi_marca} — {"está siendo mencionado pero no lidera" if posicion_mi_marca <= 3 else "apenas aparece, la demanda va a la competencia"}'}
- Sentimiento percibido: {sentimiento}
- Marca que capta la demanda hoy: {marca_ganadora or 'competidores no identificados'}
- Clasificación estratégica: {clasificacion} — {estrategia}

Análisis de la IA:
{texto_ia[:500]}

Contexto adicional:
{recomendacion_ia}

Pregunta: ¿Cuál es el ÚNICO movimiento que haría que {mi_marca} deje de perder clientes ante la IA esta semana?
Formula la respuesta en términos de costo de oportunidad comercial, no de rankings técnicos.

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
        return PrioridadEjecutiva(
            foco_principal=f"Publicar contenido de autoridad que la IA pueda citar como fuente de confianza",
            esfuerzo="Medio",
            tiempo_estimado="2 semanas",
            impacto_esperado="Dejar de perder clientes potenciales que actualmente son derivados a la competencia por la IA",
            roi_score=5,
            clasificacion="Atacar" if posicion_mi_marca > 5 else "Defender"
        )


async def analyze_competitor_advantage(
    texto_ia: str,
    rival: str,
    mi_marca: str,
) -> CompetitorAdvantage:
    """
    Analiza por qué la IA prefiere al rival y extrae una tabla comparativa con:
    - Atributo Ganador: el diferenciador que la IA le reconoce al rival
    - Fuente de Verdad: de dónde la IA obtiene esa percepción
    - Gap de nuestra Marca: qué le falta a mi_marca para competir en ese atributo
    """
    prompt = f"""Eres un analista de inteligencia competitiva. Se te proporciona el snippet de texto que una IA generativa (ChatGPT/Perplexity) produjo al comparar marcas.

Tu tarea: identificar POR QUÉ la IA prefiere o recomienda a "{rival}" sobre "{mi_marca}".

Texto del motor de IA:
---
{texto_ia[:1200]}
---

Extrae exactamente 3-4 ventajas concretas del rival. Para cada una devuelve:
1. "atributo_ganador": el atributo específico que le reconoce la IA al rival (ej: "Durabilidad comprobada en telas denim", NO genérico como "buena calidad")
2. "fuente_de_verdad": de dónde obtiene la IA esa percepción (ej: "Citado en reviews de blogs de moda chilenos", "Mencionado en foros de estilo de vida", "Presente en comparativas de retailers")
3. "gap_nuestra_marca": qué le falta a "{mi_marca}" específicamente para competir en ese atributo (ej: "No publica información sobre composición de telas en su web", "Ausente en medios especializados que la IA indexa")

También incluye una "conclusion" ejecutiva de 1-2 oraciones sobre cuál es la brecha más crítica a cerrar.

Devuelve SOLO JSON válido:
{{
  "filas": [
    {{
      "atributo_ganador": "...",
      "fuente_de_verdad": "...",
      "gap_nuestra_marca": "..."
    }}
  ],
  "conclusion": "..."
}}"""

    try:
        response = await client.chat.completions.create(
            model=AI_MODEL,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Eres un analista de inteligencia competitiva. "
                        "Extraes ventajas del competidor de forma concreta y accionable. "
                        "Devuelve SOLO JSON válido."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
        )
        data = json.loads(response.choices[0].message.content)
        filas_raw = data.get("filas", [])
        filas = [
            CompetitorAdvantageRow(
                atributo_ganador=r.get("atributo_ganador", ""),
                fuente_de_verdad=r.get("fuente_de_verdad", ""),
                gap_nuestra_marca=r.get("gap_nuestra_marca", ""),
            )
            for r in filas_raw
            if r.get("atributo_ganador")
        ]
        conclusion = data.get("conclusion", "")
        logger.info(f"[competitor_advantage] {len(filas)} atributos extraídos para rival={rival}")
        return CompetitorAdvantage(
            rival=rival,
            nuestra_marca=mi_marca,
            filas=filas,
            conclusion=conclusion,
        )
    except Exception as e:
        logger.error(f"[competitor_advantage] Error: {e}")
        return CompetitorAdvantage(
            rival=rival,
            nuestra_marca=mi_marca,
            filas=[],
            conclusion="No se pudo extraer el análisis de ventajas competitivas.",
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
    texto_ia: str,
    busqueda_usuario: str = ""
) -> Optional[PlanAccion]:
    """
    Genera Plan de Accion usando Framework ICE (Impact, Confidence, Effort).
    Para cada concepto faltante selecciona 3 tacticas del catalogo oficial AEO y las puntua.
    """

    def _anclar_concepto(concepto: str, query: str) -> str:
        """Post-proc: si el concepto no contiene ninguna keyword sustantiva de la query, lo reformula."""
        if not query:
            return concepto
        _STOPWORDS = {"mejor", "mejores", "para", "como", "donde", "cual", "cuales",
                       "bueno", "buena", "buenos", "buenas", "este", "esta", "estos",
                       "estas", "tiene", "tienen", "puede", "pueden", "algo", "mucho",
                       "poco", "todo", "cada", "otro", "otra", "otros", "gran", "buen",
                       "más", "menos", "bien", "aquí", "allí", "sobre", "bajo", "entre",
                       "desde", "hasta", "también", "solo", "solo"}
        kws = [w.lower() for w in query.split() if len(w) > 3 and w.lower() not in _STOPWORDS]
        if not kws:
            return concepto
        import re
        c_lower = concepto.lower()
        # Check con plurales: keyword puede tener 's' o 'es' extra
        if any(re.search(r'\b' + re.escape(kw) + r'e?s?\b', c_lower) or
               re.search(r'\b' + re.escape(kw.rstrip('ses').rstrip('s')) + r'e?s?\b', c_lower)
               for kw in kws if len(kw) > 3):
            return concepto
        # Usar el primer keyword sustantivo (= producto en queries e-commerce)
        anchor = kws[0]
        return f"{concepto} de {anchor}"

    try:
        conceptos_str = ', '.join(conceptos_faltantes[:3]) if conceptos_faltantes else "tu propuesta de valor"
        conceptos_list = conceptos_faltantes[:3] if conceptos_faltantes else ["tu propuesta de valor"]

        # Filtrar conceptos demasiado genéricos que no aportan especificidad
        _GENERICOS_SUBSTR = [
            "interfaz amigable", "soporte al cliente", "atención personalizada",
            "tecnología avanzada", "enfoque en la seguridad", "servicio de calidad",
            "plataforma digital", "experiencia de usuario", "precios competitivos",
            "buena reputación", "innovación constante", "compromiso con el cliente",
            "facilidad de uso", "rapidez en el servicio", "seguridad robusta",
            "aplicación móvil", "buen servicio",
        ]
        def _es_generico(concepto: str) -> bool:
            c = concepto.lower().strip()
            return any(g in c for g in _GENERICOS_SUBSTR)

        conceptos_filtrados = [c for c in conceptos_list if not _es_generico(c)]
        if not conceptos_filtrados:
            # Todos eran genéricos → pedir al LLM que genere específicos
            conceptos_filtrados = [f"[GENERAR concepto específico sobre '{busqueda_usuario}' que '{mi_marca}' pueda respaldar]"]
        conceptos_list = conceptos_filtrados
        conceptos_str = ', '.join(conceptos_list)

        # Sanitizar texto_ia: eliminar frases genéricas para que el LLM no las copie
        texto_ia_limpio = texto_ia
        for g in _GENERICOS_SUBSTR:
            texto_ia_limpio = texto_ia_limpio.replace(g, "___")

        conceptos_enumerados = '\n'.join([f'  {i+1}. "{c}"' for i, c in enumerate(conceptos_list)])
        catalogo_numerado = '\n'.join([f'  - [{t}]' for t in CATALOGO_TACTICAS_AEO])

        # Beneficios gerenciales por táctica — el LLM usa esto para describir el "para qué"
        beneficios_tactica = """
BENEFICIO GERENCIAL POR TÁCTICA (usa esta descripción orientada a resultados en pasos_ejecucion y segmento_impactado):
  - [Inyección de Schema FAQ / Tablas HTML / JSON-LD]: "Habilitar la lectura automática para que la IA extraiga nuestros precios y beneficios sin errores."
  - [Digital PR en Medios Autorizados]: "Generar autoridad de marca en sitios externos para que la IA nos cite como fuente confiable."
  - [Inyección Semántica en Landing]: "Crear una página especializada que la IA encuentre y recomiende cuando alguien busque exactamente este tema."
  - [Optimización de Knowledge Graph]: "Registrar formalmente la marca en el mapa de entidades de Google/Bing para aparecer en respuestas directas."
  - [Contenido Evergreen Estructurado]: "Publicar contenido de referencia que los modelos IA reutilicen como respuesta estándar ante la pregunta del cliente."
Describe las tácticas en términos de BENEFICIO para el negocio, no de proceso técnico."""

        # Ejemplos concretos para el prompt usando los conceptos reales
        ejemplo_concepto = conceptos_list[0]
        ejemplo_competidor = marca_ganadora or 'la competencia'

        prompt_content = f"""Eres un Product Manager experto en AEO (Answer Engine Optimization) y GEO (Generative Engine Optimization).

⚠️ REGLA ABSOLUTA DE NOMBRE DE MARCA: El nombre oficial y normalizado de la marca es "{mi_marca}". Usa EXACTAMENTE este nombre en TODO el JSON de respuesta: en pasos_ejecucion, en segmento_impactado, en roi_estimado y en cualquier mención. NUNCA uses variantes sin formato, errores de tipeo ni versiones del usuario. Si el contexto de análisis menciona una versión sucia del nombre, IGNÓRALA y usa siempre "{mi_marca}".

🔒 REGLA DE ANCLAJE CONTEXTUAL (OBLIGATORIA): La búsqueda del usuario es "{busqueda_usuario or 'no especificada'}". TODO el plan — segmento_impactado, pasos_ejecucion, roi_estimado — DEBE estar 100% anclado a la temática de esa búsqueda, NO a la industria general de la marca. Si la marca es un banco pero la búsqueda es sobre viajes, habla de viajeros, turismo y decisiones de viaje. TIENES PROHIBIDO usar términos genéricos de la industria de la marca (ej: 'productos financieros', 'blogs de finanzas') si la búsqueda pertenece a otra categoría. Adapta cada paso al nicho exacto de la búsqueda.

🎯 REGLA DE COHERENCIA MARCA-CONCEPTO (OBLIGATORIA): Cada concepto_objetivo y sus pasos_ejecucion DEBEN representar algo que "{mi_marca}" PUEDE REALMENTE ofrecer, publicar o respaldar como organización en el contexto de "{busqueda_usuario or 'no especificada'}". Piensa: ¿qué ángulo CREÍBLE tiene "{mi_marca}" para hablar de este concepto? Ejemplos:
- ✅ Copec + "Autos eléctricos" → conceptos válidos: "red de electrolineras", "carga rápida en ruta", "energía para movilidad eléctrica" (Copec SÍ opera estaciones de carga)
- ❌ Copec + "Autos eléctricos" → conceptos INVÁLIDOS: "pruebas de manejo", "concesionarios", "financiamiento automotriz" (Copec NO vende autos)
- ✅ Banco de Chile + "Viajes" → conceptos válidos: "tarjeta para viajeros", "seguro de viaje", "financiamiento de vacaciones" (un banco SÍ ofrece estos productos)
- ❌ Banco de Chile + "Viajes" → conceptos INVÁLIDOS: "interfaz amigable", "productos financieros" (genérico, no anclado a viajes)
Si algún concepto de la lista no tiene un ángulo creíble para "{mi_marca}" en el contexto de "{busqueda_usuario or 'no especificada'}", DESCÁRTALO y reemplázalo por un concepto que SÍ sea realizable. El concepto reemplazante debe seguir siendo relevante para la búsqueda del usuario.

🔑 REGLA DE ESPECIFICIDAD DEL CONCEPTO (OBLIGATORIA): PROHIBIDO usar conceptos genéricos como "interfaz amigable", "soporte al cliente", "atención personalizada", "tecnología avanzada", "enfoque en la seguridad". Cada concepto_objetivo DEBE ser ESPECÍFICO al nicho de la búsqueda "{busqueda_usuario or 'no especificada'}". Test: si el concepto podría aplicarse a CUALQUIER industria sin cambiar una palabra, es demasiado genérico → RECHÁZALO y genera uno específico.
- ❌ "soporte al cliente" (genérico, aplica a cualquier empresa)
- ❌ "interfaz amigable" (genérico, aplica a cualquier app)
- ❌ "tecnología avanzada" (genérico, no dice nada)
- ❌ "diseño cómodo" (genérico, no menciona el producto)
- ❌ "garantía extendida" (genérico, no menciona el producto)
- ✅ "wallet de criptomonedas para principiantes" (específico a cripto)
- ✅ "nutrición de alto rendimiento para escaladores" (específico a deportes extremos)
- ✅ "conectividad 5G en zonas costeras" (específico a trabajo remoto en playa)

📌 REGLA DE KEYWORD EN CONCEPTO (OBLIGATORIA): Cada concepto_objetivo DEBE contener al menos una KEYWORD SUSTANTIVA de la búsqueda "{busqueda_usuario or 'no especificada'}". Si la búsqueda es "Mejores auriculares con cancelación de ruido", cada concepto debe incluir "auriculares" o "cancelación de ruido" o "ruido". Si la búsqueda es "Botas de invierno impermeables", cada concepto debe incluir "botas" o "impermeables" o "invierno".
- ❌ "diseño cómodo" (no tiene ninguna keyword de la búsqueda)
- ❌ "opciones formales y casuales" (no tiene ninguna keyword de la búsqueda)
- ✅ "auriculares con cancelación activa de ruido" (contiene "auriculares" + "cancelación" + "ruido")
- ✅ "botas impermeables con membrana Gore-Tex" (contiene "botas" + "impermeables")

Mi marca: {mi_marca}
Búsqueda del usuario: {busqueda_usuario or 'no especificada'}
Estado de visibilidad: {estado_invisibilidad}
Posicion actual: #{posicion_mi_marca if posicion_mi_marca > 0 else 'No detectada'}
Competidor principal: {ejemplo_competidor}

CONCEPTOS REALES A POSICIONAR — EXTRAIDOS DEL CONTEXTO DE LA COMPETENCIA:
{conceptos_enumerados}

Contexto del analisis (lee esto para entender los conceptos reales):
{texto_ia_limpio[:500]}

Selecciona tacticas del CATALOGO OFICIAL AEO:

{catalogo_numerado}

{beneficios_tactica}

REGLAS ICE (evalua cada tactica del 1 al 10):
- impacto: cuanto sube la visibilidad en motores IA
- confianza: probabilidad de exito de la tactica para este concepto
- esfuerzo: 10=muy facil, 1=muy dificil
- ice_score = (impacto + confianza + esfuerzo) / 3  [redondea a 1 decimal]

LÍMITE DE ACCIONES: Devuelve un MÁXIMO ABSOLUTO de 4 acciones en total (las de mayor ICE Score). Prefiere 2 o 3 acciones altamente efectivas antes que 6 mediocres. Ordena el array resultante de mayor a menor ice_score antes de cerrar el JSON.

=========================================
CÓMO GENERAR LAS ACCIONES TÉCNICAS
=========================================
PASO 1 — Lee la lista de conceptos de arriba. Cada concepto es una palabra o frase EXACTA que tu competidor usa y tú no.

PASO 2 — Para cada concepto, EVALÚA dos cosas:
A) ¿"{mi_marca}" puede realmente ofrecer esto en el contexto de "{busqueda_usuario or 'no especificada'}"?
B) ¿El concepto contiene al menos una KEYWORD SUSTANTIVA de la búsqueda "{busqueda_usuario or 'no especificada'}"?

REGLAS:
- Si cumple A y B: copia el concepto tal cual como concepto_objetivo.
- Si cumple A pero NO cumple B: REFORMULA el concepto para incluir una keyword de la búsqueda. Ej: si la búsqueda es "botas de invierno impermeables" y el concepto es "variedad de marcas reconocidas" → reformula a "variedad de marcas de botas impermeables".
- Si NO cumple A: DESCARTA y genera uno nuevo que cumpla A y B.
- NUNCA uses un concepto_objetivo que no contenga al menos una keyword de "{busqueda_usuario or 'no especificada'}".

Ejemplos:
- Búsqueda "notebooks para programar" → ✅ "notebooks con procesador de alto rendimiento" ❌ "batería de larga duración"
- Búsqueda "auriculares cancelación de ruido" → ✅ "auriculares con cancelación activa híbrida" ❌ "diseño cómodo"
- Búsqueda "botas invierno impermeables" → ✅ "botas impermeables con membrana Gore-Tex" ❌ "variedad de marcas reconocidas"

PASO 3 — Genera 3 pasos_ejecucion técnicos y detallados para lograr indexar esa palabra exacta en Google y en modelos RAG (ChatGPT, Perplexity). Cada paso DEBE mencionar el concepto literal entre [corchetes].
Ejemplo de paso válido: "Crear bloque JSON-LD @type:FAQPage con la pregunta '¿Qué es [{ejemplo_concepto}]?' y una respuesta de 50 palabras que posicione a {mi_marca} vs {ejemplo_competidor}"
IMPORTANTE: Al redactar los pasos de ejecución, debes referirte a la marca EXCLUSIVAMENTE como "{mi_marca}". Prohibido usar cualquier otra variante u ortografía del nombre de la marca.

REGLAS ADICIONALES:
4. CAMPO segmento_impactado: perfil REAL del usuario (cargo + contexto de búsqueda). Ejemplo: "Dueño de PYME que compara [{ejemplo_concepto}] en ChatGPT antes de contratar"
5. CAMPO tiempo_indexacion_ia: ESTÁ PROHIBIDO INVENTAR TIEMPOS. Asigna el valor EXACTO según esta tabla:
   - [Digital PR en Medios Autorizados] → "24 - 48 horas (Perplexity/SearchGPT favorecen medios vivos)"
   - [Inyección de Schema FAQ] o [Tablas HTML] → "3 - 7 días (Requiere forzar re-indexación manual en Google Search Console)"
   - [Inyección Semántica en Landing] → "1 - 2 semanas (Depende del Crawl Budget orgánico de GPTBot)"
   - [Optimización de Knowledge Graph] → "3 - 6 semanas (Los grafos de entidades tienen latencia alta)"
   No uses ningún otro valor. Copia literalmente el texto de esta tabla.
6. NO uses la misma táctica dos veces para el mismo concepto.
7. Ordena las 3 acciones de mayor a menor ice_score.
8. CAMPO area_responsable: Asigna EXACTAMENTE uno de estos tres valores según la táctica:
   - 'TI / Desarrollo' → para Inyección de Schema FAQ, Knowledge Graph, Tablas HTML, JSON-LD
   - 'Marketing / Contenido' → para Inyección Semántica en Landing
   - 'PR / Agencia' → para Digital PR en Medios Autorizados
9. CAMPO riesgo_inaccion: Debe ser una frase ÚNICA y ESPECÍFICA al contexto de {mi_marca} y '{ejemplo_concepto}'. OBLIGATORIO mencionar '{ejemplo_competidor}' POR NOMBRE. PROHIBIDO usar 'la competencia' o frases genéricas. PROHIBIDO usar siempre el mismo template 'Sin [X], [marca] seguirá cediendo el territorio...'. Varía la estructura: puede ser una consecuencia de mercado, una pérdida de oportunidad, un dato sobre la ventana de tiempo, o una predicción competitiva. Cada riesgo_inaccion debe sonar distinto a los demás.

EJEMPLO COMPLETO DE VEHICULO VALIDO:
{{
  "concepto": "{ejemplo_concepto}",
  "acciones": [
    {{
      "tactica_tecnica": "Inyeccion de Schema FAQ (JSON-LD)",
      "concepto_objetivo": "{ejemplo_concepto}",
      "impacto": 9, "confianza": 7, "esfuerzo": 6, "ice_score": 7.3,
      "segmento_impactado": "Usuario que busca '{ejemplo_concepto}' en Perplexity antes de tomar una decision de compra",
      "tiempo_indexacion_ia": "3 - 7 días (Requiere forzar re-indexación manual en Google Search Console)",
      "pasos_ejecucion": [
        "Crear bloque JSON-LD @type:FAQPage en la URL principal de {mi_marca}",
        "Insertar Q: '\u00bfQue es [{ejemplo_concepto}]?' + respuesta de 50 palabras mencionando {mi_marca} y diferenciandolo de {ejemplo_competidor}",
        "Verificar markup en Rich Results Test y enviar sitemap actualizado a Google Search Console"
      ],      "area_responsable": "TI / Desarrollo",      "riesgo_inaccion": "Si no se inyecta [{ejemplo_concepto}], la IA continuar\u00e1 consolidando a {ejemplo_competidor} como la \u00fanica opci\u00f3n v\u00e1lida, eliminando a {mi_marca} del set de consideraci\u00f3n del cliente en menos de 30 d\u00edas."
    }}
  ]
}}

Retorna JSON con exactamente esta estructura para los {len(conceptos_list)} conceptos:
{{
  "vehiculos": [ ...un objeto por concepto de la lista... ],
  "roi_estimado": "estimacion cualitativa y contextual del impacto esperado"
}}

REGLAS DE CALIDAD ESTRATÉGICA:

ROI DINÁMICO: PROHIBIDO usar siempre la fórmula '30% en 30 días' ni '40% en 45 días' ni ninguna variante genérica con porcentaje+días. El roi_estimado debe ser una estimación cualitativa y contextual adaptada al sector, la marca y la situación competitiva. Ejemplos válidos: 'Alto impacto en visibilidad de nicho financiero en 3 semanas gracias a la baja competencia en Schema FAQ', 'Recuperación de la primera posición frente a {ejemplo_competidor} en 45 días si se ejecuta Digital PR en paralelo', 'Entrada al Top 3 de menciones IA para [{ejemplo_concepto}] en el segmento retail chileno'. Cada roi_estimado debe ser ÚNICO y nunca repetirse entre auditorías.

PASOS HIPER-PERSONALIZADOS: Aunque el nombre de la Táctica y el Área sean fijos (ej: 'Inyección de Schema FAQ'), los pasos_ejecucion deben mencionar el producto específico de {mi_marca}, el concepto exacto [{ejemplo_concepto}], y un ángulo creativo único para este mercado. No uses plantillas genéricas. Cada paso debe sonar como si un consultor humano lo hubiera escrito exclusivamente para {mi_marca}.

Devuelve SOLO el JSON. NADA MAS."""

        response = await client.chat.completions.create(
            model=AI_MODEL,
            temperature=0.3,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": (
                    "Eres un Product Manager AEO senior. Devuelve SOLO JSON valido. "
                    "MAXIMO 4 acciones en total, ordenadas de mayor a menor ice_score. "
                    "ICE SCORES REALISTAS Y ÚNICOS: Cada acción DEBE tener valores DISTINTOS de impacto, confianza y esfuerzo. "
                    "PROHIBIDO que dos acciones compartan el mismo ice_score. Varía los números genuinamente: "
                    "- Schema FAQ / JSON-LD: impacto 7-9, confianza 6-8, esfuerzo 6-9 "
                    "- Digital PR en Medios Autorizados: impacto 8-10, confianza 4-6, esfuerzo 3-5 "
                    "- Inyección Semántica Landing: impacto 6-8, confianza 7-9, esfuerzo 5-7 "
                    "- Knowledge Graph: impacto 7-9, confianza 5-7, esfuerzo 4-6 "
                    "- Tablas de Datos HTML: impacto 6-8, confianza 7-9, esfuerzo 7-9 "
                    "Usa el RANGO COMPLETO. No ancles en los mismos números. "
                    "REGLA DE ORO PARA concepto_objetivo: Extrae la palabra exacta. "
                    "❌ MAL: Inyeccion de Schema FAQ -> conceptos faltantes detectados. "
                    "✅ BIEN: Inyeccion de Schema FAQ -> seguros de ahorro. "
                    f"Conceptos reales a usar (copia uno de estos literalmente): {conceptos_str}. "
                    "EXCEPCION CRITICA: Si un concepto de la lista es GENÉRICO (ej: 'interfaz amigable', 'soporte al cliente', "
                    "'tecnología avanzada', 'atención personalizada', 'enfoque en la seguridad', 'diseño cómodo', "
                    "'garantía extendida', 'opciones formales'), NO lo copies. "
                    "Reemplázalo por un concepto ESPECÍFICO al nicho de la búsqueda que la marca pueda respaldar. "
                    f"KEYWORD OBLIGATORIA: Cada concepto_objetivo DEBE contener al menos una keyword sustantiva de la búsqueda '{busqueda_usuario}'. "
                    "Ej: si la búsqueda es 'auriculares cancelación de ruido', el concepto debe incluir 'auriculares' o 'cancelación' o 'ruido'. "
                    "PROHIBIDO conceptos que no mencionen ninguna palabra clave de la búsqueda del usuario. "
                    f"Tacticas validas: {', '.join(CATALOGO_TACTICAS_AEO)}. "
                    f"NOMBRE OFICIAL DE LA MARCA (usa SIEMPRE este, sin variantes): '{mi_marca}'. "
                    "REGLA DE COHERENCIA MARCA-CONCEPTO: Si un concepto de la lista NO es algo que la marca puede "
                    "realmente ofrecer o respaldar en el contexto de la búsqueda, DESCÁRTALO y reemplázalo por uno "
                    "que la marca SÍ pueda ejecutar. Ej: una gasolinera NO ofrece 'pruebas de manejo' pero SÍ 'electrolineras'. "
                    "REGLA DE COHERENCIA ESTRICTA: DEBES MANTENER UNA CORRELACION ABSOLUTA ENTRE LA TACTICA, LOS PASOS Y EL AREA. "
                    "Si la tactica es 'Schema FAQ / JSON-LD' o 'Tablas de Datos HTML' o 'Knowledge Graph', el area_responsable DEBE ser 'TI / Desarrollo' y los pasos deben ser tecnicos (JSON-LD, HTML, GSC). "
                    "Si la tactica es 'Inyeccion Semantica en Landing Page' o 'Contenido Evergreen Estructurado', el area_responsable DEBE ser 'Marketing / Contenido' y los pasos deben ser de creacion de contenido. "
                    "Si la tactica es 'Digital PR en Medios Autorizados', el area_responsable DEBE ser 'PR / Agencia' y los pasos deben ser de relaciones publicas (nota de prensa, publicacion en medios). "
                    "REGLA DE RIGOR TÉCNICO (KNOWLEDGE GRAPH): Cuando la táctica sea 'Optimización de Meta-Entidades para Knowledge Graph', "
                    "los pasos TIENEN PROHIBIDO hablar de PR tradicional ('enviar a blogs', 'publicar en medios'). "
                    "DEBEN usar terminología de SEO Semántico estricto: inyección de schema.org/Organization, "
                    "reclamación de entidad en Wikidata, reclamación de Google Knowledge Panel, "
                    "reconciliación de entidades (sameAs, owl:sameAs), y verificación en Google Search Console. "
                    "NO MEZCLES los nombres de las tacticas con las descripciones de otras areas. "
                    "EJEMPLO CORRECTO: tactica='Digital PR en Medios Autorizados' -> area='PR / Agencia' -> pasos sobre notas de prensa. "
                    "EJEMPLO INCORRECTO: tactica='Digital PR en Medios Autorizados' -> area='TI / Desarrollo' -> pasos sobre JSON-LD."
                )},
                {"role": "user", "content": prompt_content}
            ]
        )

        data = json.loads(response.choices[0].message.content)

        # Construir vehiculos con AccionICE
        vehiculos_raw = data.get("vehiculos", [])
        logger.info(f"LLM returned {len(vehiculos_raw)} vehiculos_raw for {mi_marca}")

        # Detectar estructura plana vs anidada
        # Plana: vehiculos = [{tactica_tecnica, concepto_objetivo, ...}, ...]
        # Anidada: vehiculos = [{concepto, acciones: [{tactica_tecnica, ...}]}, ...]
        if vehiculos_raw and "tactica_tecnica" in vehiculos_raw[0]:
            logger.info(f"  Detected FLAT structure — converting to nested")
            # Agrupar acciones por concepto_objetivo
            from collections import defaultdict
            grouped = defaultdict(list)
            for a in vehiculos_raw:
                key = a.get("concepto_objetivo") or a.get("concepto", "general")
                grouped[key].append(a)
            vehiculos_raw = [
                {"concepto": concepto, "acciones": acciones}
                for concepto, acciones in grouped.items()
            ]

        vehiculos = []
        todas_acciones = []  # pool global para aplicar límite de 4
        for v in vehiculos_raw:
            acciones_raw = v.get("acciones", [])
            acciones = []
            for a in acciones_raw:
              try:
                tactica = a.get("tactica_tecnica", "")
                # Validar que la tactica este en el catalogo (fuzzy match por substring)
                tactica_valida = next(
                    (t for t in CATALOGO_TACTICAS_AEO if t.lower() in tactica.lower() or tactica.lower() in t.lower()),
                    None
                )
                if not tactica_valida:
                    tactica_valida = CATALOGO_TACTICAS_AEO[0]
                impacto = max(1, min(10, int(a.get("impacto", 7))))
                confianza = max(1, min(10, int(a.get("confianza", 7))))
                esfuerzo = max(1, min(10, int(a.get("esfuerzo", 7))))
                ice_score = round((impacto + confianza + esfuerzo) / 3, 1)
                concepto_obj = a.get("concepto_objetivo") or v.get("concepto", "")
                # Guardia anti-pereza: rechaza frases genericas
                frases_prohibidas = ["conceptos faltantes", "conceptos estructurales", "conceptos detectados", "concepto a inyectar"]
                if any(f in concepto_obj.lower() for f in frases_prohibidas):
                    concepto_obj = v.get("concepto", concepto_obj)
                # Post-proc: anclar keyword de búsqueda si falta
                concepto_obj = _anclar_concepto(concepto_obj, busqueda_usuario)
                pasos = a.get("pasos_ejecucion") or []
                if not pasos or len(pasos) < 3:
                    pasos = [
                        f"Identificar URL objetivo donde agregar '{concepto_obj}'",
                        f"Implementar {tactica_valida} referenciando '{concepto_obj}' explicitamente",
                        "Verificar indexacion con Google Search Console y esperar re-crawl de GPTBot"
                    ]
                _AREA_MAP = {
                    "digital pr": "PR / Agencia",
                    "inyección semántica": "Marketing / Contenido",
                    "inyeccion semantica": "Marketing / Contenido",
                    "landing": "Marketing / Contenido",
                }
                area_raw = a.get("area_responsable") or ""
                area_valida = area_raw if area_raw in ("TI / Desarrollo", "Marketing / Contenido", "PR / Agencia") else None
                if not area_valida:
                    tactica_lower2 = tactica_valida.lower()
                    area_valida = next(
                        (v for k, v in _AREA_MAP.items() if k in tactica_lower2),
                        "TI / Desarrollo"
                    )
                accion = AccionICE(
                    tactica_tecnica=tactica_valida,
                    concepto_objetivo=concepto_obj,
                    impacto=impacto,
                    confianza=confianza,
                    esfuerzo=esfuerzo,
                    ice_score=ice_score,
                    segmento_impactado=a.get("segmento_impactado") or f"Usuario que busca '{concepto_obj}' en motores IA",
                    tiempo_indexacion_ia=a.get("tiempo_indexacion_ia") or _tiempo_por_tactica(tactica_valida),
                    pasos_ejecucion=pasos[:3],
                    riesgo_inaccion=a.get("riesgo_inaccion") or f"Sin acción, la IA continuará excluyendo a {mi_marca} de las recomendaciones sobre '{concepto_obj}'.",
                    area_responsable=area_valida,
                )
                acciones.append(accion)
                todas_acciones.append((accion, v.get("concepto", "")))
              except Exception as e_accion:
                logger.warning(f"Error creating AccionICE for {mi_marca}: {e_accion} — raw: {a}")
                continue
            if acciones:
                vehiculos.append(VehiculoContenido(
                    concepto=v.get("concepto", ""),
                    acciones=acciones
                ))

        # Guardia Python: máximo 4 acciones globales, ordenadas por ice_score desc
        todas_acciones.sort(key=lambda x: x[0].ice_score, reverse=True)
        todas_acciones = todas_acciones[:4]

        # Desduplicar ice_scores: si dos acciones tienen el mismo score, ajustar -0.1 a la segunda
        seen_scores = set()
        for accion, _ in todas_acciones:
            while accion.ice_score in seen_scores:
                accion.ice_score = round(accion.ice_score - 0.1, 1)
            seen_scores.add(accion.ice_score)

        if vehiculos and todas_acciones:
            # Reconstruir un único vehículo con las top-4 acciones
            top_acciones = [a for a, _ in todas_acciones]
            vehiculos = [VehiculoContenido(
                concepto=vehiculos[0].concepto,
                acciones=top_acciones
            )]

        # Fallback si el LLM no devolvio vehiculos validos
        if not vehiculos and conceptos_faltantes:
            logger.warning(f"⚠️ FALLBACK activado para {mi_marca}: LLM no devolvió vehiculos válidos. vehiculos_raw={len(vehiculos_raw)}")
            _comp = ejemplo_competidor
            _fallback_scores = [
                (9, 8, 7, 8.0),  # Schema FAQ: alto impacto, técnico rápido
                (7, 6, 5, 6.0),  # Landing semántica: medio, requiere contenido
                (8, 5, 4, 5.7),  # Digital PR: alto impacto, baja confianza, coordinación
            ]
            for i, concepto in enumerate(conceptos_faltantes[:3]):
                tacticas = [
                    CATALOGO_TACTICAS_AEO[i % len(CATALOGO_TACTICAS_AEO)],
                    CATALOGO_TACTICAS_AEO[(i + 1) % len(CATALOGO_TACTICAS_AEO)],
                    CATALOGO_TACTICAS_AEO[(i + 2) % len(CATALOGO_TACTICAS_AEO)],
                ]
                # Variar scores por concepto (offset +/-1 por índice)
                scores = [
                    (min(10, s[0] + i % 2), max(1, s[1] - i % 3), s[2], 0)
                    for s in _fallback_scores
                ]
                scores = [
                    (imp, conf, esf, round((imp + conf + esf) / 3, 1))
                    for imp, conf, esf, _ in scores
                ]
                vehiculos.append(VehiculoContenido(
                    concepto=concepto,
                    acciones=[
                        AccionICE(
                            tactica_tecnica=tacticas[0], concepto_objetivo=concepto,
                            impacto=scores[0][0], confianza=scores[0][1], esfuerzo=scores[0][2], ice_score=scores[0][3],
                            segmento_impactado=f"Usuario que busca '{concepto}' en motores IA",
                            tiempo_indexacion_ia=_tiempo_por_tactica(tacticas[0]),
                            pasos_ejecucion=[
                                f"Crear bloque JSON-LD FAQ con pregunta literal sobre '{concepto}'",
                                f"Insertar respuesta de 40-60 palabras mencionando '{concepto}' en la pagina principal de {mi_marca}",
                                "Verificar con Google Rich Results Test y enviar sitemap a GSC"
                            ],
                            riesgo_inaccion=f"Sin posicionar [{concepto}], {mi_marca} seguirá cediendo este territorio a {_comp}, que consolidará su liderazgo en menos de 30 días.",
                            area_responsable="TI / Desarrollo",
                        ),
                        AccionICE(
                            tactica_tecnica=tacticas[1], concepto_objetivo=concepto,
                            impacto=scores[1][0], confianza=scores[1][1], esfuerzo=scores[1][2], ice_score=scores[1][3],
                            segmento_impactado=f"Segmento que compara opciones de '{concepto}' en ChatGPT",
                            tiempo_indexacion_ia=_tiempo_por_tactica(tacticas[1]),
                            pasos_ejecucion=[
                                f"Crear landing /{concepto.lower().replace(' ', '-')} con H1 que incluya '{concepto}'",
                                f"Agregar tabla comparativa HTML posicionando a {mi_marca} vs {_comp} en '{concepto}'",
                                "Solicitar indexacion manual en Search Console y verificar cobertura"
                            ],
                            riesgo_inaccion=f"Sin una landing dedicada a [{concepto}], {_comp} seguirá siendo la única opción que la IA recomienda para este término.",
                            area_responsable="Marketing / Contenido",
                        ),
                        AccionICE(
                            tactica_tecnica=tacticas[2], concepto_objetivo=concepto,
                            impacto=scores[2][0], confianza=scores[2][1], esfuerzo=scores[2][2], ice_score=scores[2][3],
                            segmento_impactado=f"Audiencia que valida '{concepto}' en medios digitales",
                            tiempo_indexacion_ia=_tiempo_por_tactica(tacticas[2]),
                            pasos_ejecucion=[
                                f"Redactar nota de prensa con '{concepto}' en titulo y primer parrafo, mencionando a {mi_marca}",
                                "Publicar en medio autorizado (Emol, BioBio, La Tercera) con enlace al sitio",
                                f"Monitorear mencion de {mi_marca} en Perplexity y ChatGPT con busqueda manual a los 7 dias"
                            ],
                            riesgo_inaccion=f"Sin cobertura de medios sobre [{concepto}], la IA no encontrará fuentes externas y {_comp} mantendrá su dominio absoluto en este territorio.",
                            area_responsable="PR / Agencia",
                        ),
                    ]
                ))
            # Aplicar max-4 al fallback también
            todas_fb = [(a, v.concepto) for v in vehiculos for a in v.acciones]
            todas_fb.sort(key=lambda x: x[0].ice_score, reverse=True)
            todas_fb = todas_fb[:4]
            if todas_fb:
                top_acciones = [a for a, _ in todas_fb]
                vehiculos = [VehiculoContenido(concepto=vehiculos[0].concepto, acciones=top_acciones)]

        plan = PlanAccion(
            vehiculos=vehiculos,
            roi_estimado=str(data.get("roi_estimado", "Aumento en mentions y visibilidad en motores IA en 30 dias"))
        )

        # Guardia ROI: prohibir patrón genérico %+días/semanas Y texto vago sin métricas
        roi_text = plan.roi_estimado.lower()
        is_generic_pct = re.search(r'\d+\s*%.*\d+\s*(días|dias|semanas)', plan.roi_estimado, re.IGNORECASE)
        is_vague = any(p in roi_text for p in [
            "incremento significativo", "aumento significativo", "mejora significativa",
            "mayor visibilidad", "mejor posicionamiento", "incremento en la visibilidad",
        ]) and not any(p in roi_text for p in ["top 3", "top 5", "primera posición", "posición #"])
        
        if is_generic_pct or is_vague:
            logger.warning(f"ROI GUARDIA: Reescribiendo roi_estimado genérico/vago para {mi_marca}")
            plan.roi_estimado = (
                f"Entrada al Top 3 de menciones IA para [{conceptos_list[0] if conceptos_list else 'este segmento'}] "
                f"frente a {ejemplo_competidor}, ejecutando las {len(vehiculos[0].acciones) if vehiculos else 3} tácticas "
                f"en orden de prioridad ICE."
            )

        logger.info(f"Generated {len(vehiculos)} vehiculos ICE para {mi_marca}")
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
