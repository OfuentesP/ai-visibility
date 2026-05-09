#!/usr/bin/env python3
# Ejecutar con: ./venv/bin/python3 scripts/batch_qa.py
"""
Batch QA — Auditoría masiva sin frontend.
Uso: python scripts/batch_qa.py
Salida: qa_exports/<marca>_<busqueda>_qa.json
"""

import asyncio
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

# Resolver PYTHONPATH al backend desde cualquier cwd
BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

# ── Casos de prueba ──────────────────────────────────────────────────────────
CASOS = [
    {"marca": "Banco de Chile",        "busqueda": "Mejor Cuenta Corriente Chile"},
    {"marca": "Banco Santander",       "busqueda": "Crédito Hipotecario Tasa Baja"},
    {"marca": "BCI",                   "busqueda": "Tarjeta de Crédito Sin Comisión"},
    {"marca": "Banco Estado",          "busqueda": "Cuenta de Ahorro para Jóvenes"},
]

# Leer argumento de límite desde la terminal (ej: ./venv/bin/python3 scripts/batch_qa.py 2)
if len(sys.argv) > 1:
    try:
        _limite = int(sys.argv[1])
        CASOS = CASOS[:_limite]
        print(f"\n⚠️  MODO RÁPIDO: Ejecutando solo los primeros {_limite} casos.\n")
    except ValueError:
        print("\n⚠️  Argumento inválido. Ejecutando todos los casos.\n")

# ── Helpers ──────────────────────────────────────────────────────────────────
EXPORT_DIR = Path(__file__).resolve().parent.parent / "qa_exports"

def sanitize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[áàä]", "a", text)
    text = re.sub(r"[éèë]", "e", text)
    text = re.sub(r"[íìï]", "i", text)
    text = re.sub(r"[óòö]", "o", text)
    text = re.sub(r"[úùü]", "u", text)
    text = re.sub(r"[ñ]", "n", text)
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")

def filename_for(marca: str, busqueda: str) -> str:
    return f"{sanitize(marca)}_{sanitize(busqueda)}_qa.json"

def to_serializable(obj):
    """Convierte cualquier objeto (Pydantic v1/v2, dict, list) a tipo serializable."""
    if obj is None:
        return None
    if isinstance(obj, dict):
        return {k: to_serializable(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [to_serializable(i) for i in obj]
    if hasattr(obj, "model_dump"):   # Pydantic v2
        return to_serializable(obj.model_dump())
    if hasattr(obj, "dict"):         # Pydantic v1
        return to_serializable(obj.dict())
    return obj

# ── Motor de auditoría ───────────────────────────────────────────────────────
async def auditar(marca: str, busqueda: str) -> dict:
    from searcher import consultar_openai
    from judge import (
        extraer_metricas,
        generar_content_brief,
        generar_plan_accion_pro,
        generar_prioridad_ejecutiva,
        extraer_conceptos_faltantes,
        calcular_estado_invisibilidad,
        generar_plan_accion,
        justificar_eleccion_arquetipo,
    )
    from discovery import (
        obtener_tendencias_chile,
        detectar_territorios_desatendidos,
        ARQUETIPOS_COMPRA,
        generar_escenarios_ia,
    )

    texto = await consultar_openai(busqueda)
    resultado = await extraer_metricas(texto, marca)

    if resultado.recomendacion_ia and resultado.marca_ganadora:
        resultado.content_ideas = await generar_content_brief(
            resultado.recomendacion_ia, resultado.marca_ganadora, marca
        )

    resultado.plan_accion_pro = await generar_plan_accion_pro(
        texto, marca, resultado.marca_ganadora, resultado.posicion_mi_marca, resultado.recomendacion_ia
    )

    resultado.prioridad_ejecutiva = await generar_prioridad_ejecutiva(
        resultado.posicion_mi_marca, resultado.sentimiento,
        resultado.marca_ganadora, marca, texto, resultado.recomendacion_ia
    )

    gap = await extraer_conceptos_faltantes(texto, resultado.marca_ganadora, marca)
    resultado.percepciones_genericas = gap.get("percepciones_genericas", [])
    resultado.conceptos_faltantes = gap.get("diferenciadores_ganador", [])

    estado, score = calcular_estado_invisibilidad(
        resultado.posicion_mi_marca, resultado.sentimiento,
        resultado.marcas_mencionadas, marca
    )
    resultado.estado_invisibilidad = estado
    resultado.invisibilidad_score = score

    resultado.plan_accion = await generar_plan_accion(
        estado, resultado.posicion_mi_marca, resultado.marca_ganadora,
        marca, resultado.conceptos_faltantes, texto
    )

    # ── Radar de Intención: Arquetipos Enterprise ──────────────────────────
    # Guards: Anti-Resurrección, Anti-Horóscopo, Anti-Eco
    radar_intencion = []
    marcas_base = [m.lower() for m in resultado.marcas_mencionadas]
    marca_lower = marca.lower()
    marca_visible_en_base = resultado.posicion_mi_marca > 0

    try:
        tendencias = await obtener_tendencias_chile(busqueda)
        resultado.territorios_desatendidos = await detectar_territorios_desatendidos(
            busqueda, tendencias, marca, resultado.recomendacion_ia or ""
        )

        escenarios = await generar_escenarios_ia(busqueda, tendencias)
        for esc in escenarios:
            esc_texto = await consultar_openai(esc.get("prompt_ia", busqueda))
            esc_resultado = await extraer_metricas(esc_texto, marca)

            marca_elegida = esc_resultado.marca_ganadora
            pos_mi_marca = esc_resultado.posicion_mi_marca

            # ── GUARD A: Anti-Resurrección ──────────────────────────────
            # Si mi_marca fue invisible (pos=0) en el texto BASE,
            # ningún arquetipo puede elegirla ni reportar posición > 0
            if not marca_visible_en_base:
                if marca_elegida and marca_elegida.lower() == marca_lower:
                    # Forzar a que elija al competidor real
                    otras = [m for m in esc_resultado.marcas_mencionadas
                             if m.lower() != marca_lower]
                    marca_elegida = otras[0] if otras else (
                        esc_resultado.competidor_principal
                        if hasattr(esc_resultado, 'competidor_principal')
                        and esc_resultado.competidor_principal
                        and esc_resultado.competidor_principal.lower() != marca_lower
                        else "Sin marca dominante"
                    )
                # Si el arquetipo "encontró" la marca en su texto propio, no confiar
                if pos_mi_marca > 0:
                    pos_mi_marca = 0  # Respetar la verdad del texto base

            # ── GUARD B: Anti-Horóscopo (justificación grounded) ────────
            # + Dealbreaker + Consideration Set + Confidence Score
            veredicto = await justificar_eleccion_arquetipo(
                esc_texto,
                marca_elegida,
                esc.get("arquetipo", ""),
                esc.get("driver", ""),
                esc.get("dealbreaker", ""),
                marca,
                esc_resultado.marcas_mencionadas,
                texto_base=texto,
            )

            radar_intencion.append({
                "arquetipo": esc.get("arquetipo", ""),
                "necesidad_principal": esc.get("driver", ""),
                "dealbreaker": esc.get("dealbreaker", ""),
                "pregunta_generada": esc.get("prompt_ia", ""),
                "marca_elegida": marca_elegida,
                "justificacion_basada_en_datos": veredicto["justificacion"],
                "segunda_opcion": veredicto["segunda_opcion"],
                "factor_desempate": veredicto["factor_desempate"],
                "certeza": veredicto["certeza"],
                "dealbreaker_activado": veredicto["dealbreaker_activado"],
                "dealbreaker_detalle": veredicto["dealbreaker_detalle"],
                "posicion_mi_marca": pos_mi_marca,
            })

        # ── GUARD C: Anti-Eco (diversidad) ──────────────────────────────
        if len(radar_intencion) >= 2:
            elegidas = [r["marca_elegida"] for r in radar_intencion if r["marca_elegida"]]
            if len(elegidas) >= 2 and len(set(e.lower() for e in elegidas)) == 1:
                # Todos eligieron la misma marca → flag de eco
                for r in radar_intencion:
                    r["_warning"] = "EFECTO_ECO: Todos los arquetipos eligieron la misma marca"

    except Exception as e:
        logger.warning(f"⚠️ Error en radar/discovery: {e}")
        if not resultado.territorios_desatendidos:
            resultado.territorios_desatendidos = []

    return {
        "meta": {
            "marca": marca,
            "busqueda": busqueda,
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "texto_ia_raw": texto,
        },
        "veredicto_ejecutivo": to_serializable(resultado.prioridad_ejecutiva),
        "share_of_voice": {
            "posicion": resultado.posicion_mi_marca,
            "estado": resultado.estado_invisibilidad,
            "score": resultado.invisibilidad_score,
            "marcas_mencionadas": resultado.marcas_mencionadas,
            "ganador": resultado.marca_ganadora,
            "competidor_principal": resultado.competidor_principal,
        },
        "diferenciadores": {
            "percepciones_genericas": resultado.percepciones_genericas,
            "conceptos_faltantes": resultado.conceptos_faltantes,
        },
        "plan_accion": to_serializable(resultado.plan_accion),
        "territorios_desatendidos": to_serializable(resultado.territorios_desatendidos or []),
        "radar_intencion": radar_intencion,
    }

# ── Runner ───────────────────────────────────────────────────────────────────
async def main():
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)

    # Crear subcarpeta con timestamp por cada ejecución
    run_ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    run_label = f"batch_{run_ts}_{len(CASOS)}casos"
    run_dir = EXPORT_DIR / run_label
    run_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Carpeta de resultados: qa_exports/{run_label}/\n")

    total_casos = len(CASOS)
    for idx, caso in enumerate(CASOS, start=1):
        marca = caso["marca"]
        busqueda = caso["busqueda"]
        fname = filename_for(marca, busqueda)
        out_path = run_dir / fname
        avance_pct = int((idx / total_casos) * 100)

        print(f"\n[{idx}/{total_casos}] ({avance_pct}%) 🔄 Auditando {marca} — {busqueda}...")

        try:
            payload = await auditar(marca, busqueda)
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2, ensure_ascii=False)
            print(f"          ✅ Guardado en qa_exports/{run_label}/{fname}")
        except Exception as exc:
            import traceback
            print(f"          ❌ ERROR: {exc}")
            print(traceback.format_exc())
            error_path = run_dir / fname.replace("_qa.json", "_qa_ERROR.json")
            with open(error_path, "w", encoding="utf-8") as f:
                json.dump({
                    "marca": marca,
                    "busqueda": busqueda,
                    "error": str(exc),
                    "traceback": traceback.format_exc(),
                    "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                }, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Batch QA completado — resultados en qa_exports/")

if __name__ == "__main__":
    asyncio.run(main())
