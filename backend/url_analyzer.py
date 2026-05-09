"""
url_analyzer.py
Analiza una URL de cliente y genera:
  - Nombre de la marca (inferido)
  - Categoría de negocio
  - Mercado/país
  - Diferenciadores clave
  - 8 queries que un comprador haría en IA
"""
import json
import logging
import os
import re
from typing import Optional

import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from openai import AsyncOpenAI
from pydantic import BaseModel, HttpUrl

load_dotenv()
logger = logging.getLogger(__name__)

_api_key = os.getenv("OPENAI_API_KEY")
_openai = AsyncOpenAI(
    api_key=_api_key,
    timeout=httpx.Timeout(30.0, connect=10.0)
) if _api_key else None


# ─── Modelos ────────────────────────────────────────────────────────────────

class SiteContext(BaseModel):
    marca: str
    categoria: str
    mercado: str
    diferenciadores: list[str]
    queries: list[str]
    resumen_pagina: str
    arquetipos: list[dict] = []  # 3 arquetipos dinámicos generados para esta categoría


# ─── Scraping ───────────────────────────────────────────────────────────────

async def scrape_url(url: str) -> dict:
    """
    Descarga la página y extrae: título, meta description, headings y
    los primeros 1 200 caracteres de texto visible.
    Sigue redirecciones, acepta certificados comunes.
    """
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (compatible; AIVisibilityBot/1.0; "
            "+https://aivisibility.com/bot)"
        ),
        "Accept-Language": "es-CL,es;q=0.9",
    }
    async with httpx.AsyncClient(
        follow_redirects=True,
        timeout=httpx.Timeout(15.0, connect=8.0),
        verify=False,          # algunos sitios PyME tienen certs mal configurados
    ) as client:
        resp = await client.get(url, headers=headers)
        resp.raise_for_status()
        html = resp.text

    soup = BeautifulSoup(html, "lxml")

    # Título
    title = soup.title.string.strip() if soup.title and soup.title.string else ""

    # Meta description
    meta_desc = ""
    tag = soup.find("meta", attrs={"name": re.compile(r"description", re.I)})
    if tag and tag.get("content"):
        meta_desc = tag["content"].strip()

    # Headings (h1, h2)
    headings = [
        h.get_text(separator=" ", strip=True)
        for h in soup.find_all(["h1", "h2"])
        if h.get_text(strip=True)
    ][:10]

    # Texto visible — elimina scripts, styles, nav, footer
    for tag in soup(["script", "style", "nav", "footer", "header", "noscript"]):
        tag.decompose()
    body_text = " ".join(soup.stripped_strings)[:1500]

    return {
        "url": url,
        "title": title,
        "meta_description": meta_desc,
        "headings": headings,
        "body_text": body_text,
    }


# ─── Análisis GPT ───────────────────────────────────────────────────────────

async def analizar_con_gpt(page_data: dict, pais_hint: str = "Chile") -> SiteContext:
    """
    Envía el contenido scrapeado a GPT-4o-mini y obtiene:
    marca, categoría, mercado, diferenciadores y 8 queries de comprador.
    """
    prompt = f"""Eres un experto en marketing digital y AI SEO. Analiza el siguiente contenido de una página web y extrae información clave.

URL: {page_data['url']}
TÍTULO: {page_data['title']}
META DESCRIPTION: {page_data['meta_description']}
HEADINGS: {'; '.join(page_data['headings'])}
TEXTO VISIBLE: {page_data['body_text'][:800]}

País de referencia del negocio: {pais_hint}

Tarea:
1. Identifica el nombre real de la marca (no el dominio, sino el nombre comercial).
2. Define la categoría de negocio en 4-6 palabras (ej: "jeans de mujer premium").
3. Determina el mercado principal (ej: "Chile").
4. Lista 3-5 diferenciadores únicos que el negocio comunica (ej: "calce perfecto", "industria nacional").
5. Genera 8 queries DISTINTAS que un potencial comprador haría HOY en ChatGPT, Perplexity o Google.
   - Varía el tipo: comparativas, de mejor opción, de problema, de ubicación, de atributo.
   - Usa lenguaje natural chileno (ej: "¿dónde comprar...", "mejores marcas de...", "qué jeans...").
   - NO incluyas el nombre de la marca en las queries (queremos ver si la IA la menciona espontáneamente).
6. Escribe un resumen de la página en 1 oración.

Devuelve SOLO JSON válido con este esquema exacto:
{{
  "marca": "string",
  "categoria": "string",
  "mercado": "string",
  "diferenciadores": ["string", "string", "string"],
  "queries": ["query1", "query2", ..., "query8"],
  "resumen_pagina": "string"
}}"""

    response = await _openai.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.3,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "Eres un analista de marketing. Devuelve SOLO JSON válido."},
            {"role": "user", "content": prompt},
        ],
    )

    data = json.loads(response.choices[0].message.content)

    return SiteContext(
        marca=data.get("marca", "").strip(),
        categoria=data.get("categoria", "").strip(),
        mercado=data.get("mercado", pais_hint).strip(),
        diferenciadores=data.get("diferenciadores", []),
        queries=data.get("queries", [])[:8],
        resumen_pagina=data.get("resumen_pagina", "").strip(),
    )


# ─── Arquetipos dinámicos ───────────────────────────────────────────────────

async def generar_arquetipos_para_categoria(context: SiteContext) -> list[dict]:
    """
    Genera 3 arquetipos de compradores reales específicos para la categoría del negocio.
    Usa el mismo esquema que ARQUETIPOS_COMPRA de discovery.py para ser intercambiables.
    """
    prompt = f"""Eres un experto en psicología del consumidor chileno.

Negocio analizado:
- Marca: {context.marca}
- Categoría: {context.categoria}
- Mercado: {context.mercado}
- Diferenciadores: {', '.join(context.diferenciadores)}
- Descripción: {context.resumen_pagina}

Genera exactamente 3 arquetipos de compradores chilenos reales que buscarían este tipo de producto/servicio.
Sean ESPECÍFICOS para esta categoría — NO uses arquetipos bancarios/financieros a menos que el negocio sea financiero.

Cada arquetipo debe:
- Tener un nombre memorable que refleje su mentalidad de compra (ej: "La Fashionista Consciente", "El Corredor Urbano")
- Describir en 2-3 frases quién es y cómo compra en {context.mercado}
- Definir su driver: qué lo lleva a buscar esta categoría (4-6 palabras clave)
- Definir su dealbreaker: qué lo hace NO comprar (4-6 palabras clave)

Los 3 arquetipos deben cubrir perspectivas DISTINTAS y complementarias del mercado de {context.categoria}.

Devuelve SOLO JSON válido:
{{
  "arquetipos": [
    {{
      "id": "slug_sin_espacios",
      "arquetipo": "Nombre del Arquetipo",
      "perfil_base": "Descripción de 2-3 frases del perfil y comportamiento de compra en Chile.",
      "driver": "valor1, valor2, valor3",
      "dealbreaker": "friccion1, friccion2, friccion3"
    }}
  ]
}}"""

    response = await _openai.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.6,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "Eres un investigador de consumidores. Devuelve SOLO JSON válido."},
            {"role": "user", "content": prompt},
        ],
    )

    data = json.loads(response.choices[0].message.content)
    arquetipos = data.get("arquetipos", [])[:3]

    for a in arquetipos:
        a["origen"] = "dinamico"  # compatible con el campo 'origen' de ARQUETIPOS_COMPRA

    logger.info(f"[url_analyzer] ✅ Arquetipos generados: {[a['arquetipo'] for a in arquetipos]}")
    return arquetipos


# ─── Plan de acción AEO ─────────────────────────────────────────────────────

async def generar_plan_url(
    marca: str,
    categoria: str,
    mercado: str,
    diferenciadores: list[str],
    resultados: list[dict],
) -> dict:
    """
    Genera un plan de acción AEO con ICE scoring para la marca auditada.
    Basado en qué arquetipos no encontraron la marca y qué competidores ganaron.
    Devuelve estructura compatible con plan_accion de judge.py (vehiculos + roi_estimado).
    """
    if not _openai:
        return {"vehiculos": [], "roi_estimado": ""}

    # Armar contexto de resultados para el prompt
    lines = []
    for r in resultados:
        estado = "✅ aparece" if r.get("mencionada") else "❌ no aparece"
        ganador = r.get("marca_ganadora") or "ninguna"
        lines.append(
            f"- Perfil «{r.get('arquetipo', '?')}» | busca: {r.get('driver', '?')} | "
            f"query: \"{r.get('query', '')}\" | {estado} | la IA recomienda: {ganador}"
        )
    audit_summary = "\n".join(lines)

    perfiles_sin_aparicion = [r for r in resultados if not r.get("mencionada")]
    competidores_ganadores = list({
        r["marca_ganadora"] for r in resultados
        if r.get("marca_ganadora") and r["marca_ganadora"].lower() != marca.lower()
    })

    prompt = f"""Eres un consultor AEO (Answer Engine Optimization) senior especializado en hacer que marcas aparezcan en ChatGPT, Perplexity y Google AI Overviews.

## MARCA AUDITADA
Marca: {marca}
Categoría: {categoria}
Mercado: {mercado}
Diferenciadores: {', '.join(diferenciadores)}

## RESULTADO DE LA AUDITORÍA (por perfil de comprador)
{audit_summary}

## PROBLEMA A RESOLVER
{len(perfiles_sin_aparicion)} de {len(resultados)} perfiles de comprador NO encuentran a {marca}.
Competidores que ganan terreno: {', '.join(competidores_ganadores) if competidores_ganadores else 'varios'}.

## TU TAREA
Genera exactamente 3 acciones concretas y distintas para que {marca} empiece a aparecer en esas búsquedas.
Cada acción debe usar UNA táctica del catálogo oficial AEO:
- "Inyeccion de Schema FAQ (JSON-LD)" → área: TI / Desarrollo
- "Tablas de Datos HTML Comparativas" → área: TI / Desarrollo
- "Inyeccion Semantica en Landing Page" → área: Marketing / Contenido
- "Contenido Evergreen Estructurado" → área: Marketing / Contenido
- "Digital PR en Medios Autorizados" → área: PR / Agencia
- "Optimizacion de Meta-Entidades para Knowledge Graph" → área: TI / Desarrollo

REGLAS ICE (del 1 al 10):
- impacto: cuánto sube la visibilidad de {marca} en motores IA
- confianza: probabilidad de éxito para esta categoría específica
- esfuerzo: 10=muy fácil de implementar, 1=muy difícil
- ice_score = redondear((impacto + confianza + esfuerzo) / 3, 1 decimal)

TIEMPOS DE INDEXACIÓN (usa EXACTAMENTE uno de estos):
- Schema FAQ / JSON-LD / Tablas HTML → "3 - 7 días (Requiere forzar re-indexación manual en Google Search Console)"
- Inyección Semántica en Landing → "1 - 2 semanas (Depende del Crawl Budget orgánico de GPTBot)"
- Digital PR → "24 - 48 horas (Perplexity/SearchGPT favorecen medios vivos)"
- Knowledge Graph → "3 - 6 semanas (Los grafos de entidades tienen latencia alta)"

REGLAS:
1. Cada acción debe atacar un perfil de comprador distinto que no encontró a {marca}.
2. El concepto_objetivo DEBE contener palabras de la categoría "{categoria}".
3. Los pasos_ejecucion (3 pasos) deben ser técnicos, específicos a {marca} y mencionar el concepto entre [corchetes].
4. riesgo_inaccion debe mencionar al competidor ganador por nombre, no "la competencia".
5. segmento_impactado = perfil del usuario de ese arquetipo + su query específica.
6. Ordena las 3 acciones de mayor a menor ice_score.

Devuelve SOLO JSON:
{{
  "vehiculos": [
    {{
      "concepto": "string corto del tema a posicionar",
      "acciones": [
        {{
          "tactica_tecnica": "nombre exacto de la táctica del catálogo",
          "concepto_objetivo": "frase con keywords de la categoría",
          "impacto": 8, "confianza": 7, "esfuerzo": 6, "ice_score": 7.0,
          "segmento_impactado": "perfil del comprador que no encontró la marca",
          "tiempo_indexacion_ia": "texto exacto de la tabla de tiempos",
          "pasos_ejecucion": ["paso 1 técnico", "paso 2", "paso 3"],
          "area_responsable": "una de las 3 áreas exactas",
          "riesgo_inaccion": "consecuencia específica con nombre del competidor"
        }}
      ]
    }}
  ],
  "roi_estimado": "estimación cualitativa y contextual del impacto esperado para {marca} en {mercado}"
}}"""

    try:
        response = await _openai.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.4,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": (
                    f"Eres un consultor AEO senior. Genera un plan ESPECÍFICO para {marca} en {categoria}. "
                    "Devuelve SOLO JSON válido. 3 acciones, ordenadas por ice_score desc. "
                    "Usa nombres EXACTOS de tácticas del catálogo AEO. "
                    f"NUNCA uses 'la competencia': menciona a {', '.join(competidores_ganadores[:2]) if competidores_ganadores else 'el competidor'} por nombre."
                )},
                {"role": "user", "content": prompt},
            ],
        )
        data = json.loads(response.choices[0].message.content)
        logger.info(f"[url_analyzer] ✅ Plan generado: {len(data.get('vehiculos', []))} vehículos")
        return data
    except Exception as e:
        logger.warning(f"[url_analyzer] Error generando plan: {e}")
        return {"vehiculos": [], "roi_estimado": ""}


# ─── Función principal ──────────────────────────────────────────────────────

async def analizar_url(url: str, pais_hint: str = "Chile") -> SiteContext:
    """
    Pipeline completo: scraping → análisis GPT → arquetipos dinámicos → SiteContext.
    Lanza httpx.HTTPStatusError si la URL no es accesible.
    """
    logger.info(f"[url_analyzer] Scraping: {url}")
    page_data = await scrape_url(url)

    logger.info(f"[url_analyzer] Analizando con GPT: título='{page_data['title'][:60]}'")
    context = await analizar_con_gpt(page_data, pais_hint=pais_hint)

    logger.info(f"[url_analyzer] Generando arquetipos para: {context.categoria}")
    context.arquetipos = await generar_arquetipos_para_categoria(context)

    logger.info(f"[url_analyzer] ✅ marca='{context.marca}' arquetipos={len(context.arquetipos)}")
    return context
