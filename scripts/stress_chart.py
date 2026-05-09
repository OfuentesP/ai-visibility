#!/usr/bin/env python3
"""
Stress test: Coherencia Cuota de Voz.
Ejecuta N auditorías idénticas y valida que ganador == marcas_mencionadas[0].
Uso: ./venv/bin/python3 scripts/stress_chart.py [N]
"""

import asyncio
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND_DIR))

MARCA = "Banco de Chile"
BUSQUEDA = "Seguros de Vida"
N = int(sys.argv[1]) if len(sys.argv) > 1 else 10


async def main():
    from main import audit_pipeline

    ok = 0
    fail = 0
    results = []

    for i in range(1, N + 1):
        print(f"\n[{i}/{N}] Auditando '{MARCA}' — {BUSQUEDA}...")
        try:
            r = await audit_pipeline(BUSQUEDA, MARCA)
            ganador = r.marca_ganadora or "(null)"
            marcas = r.marcas_mencionadas or []
            primer_lugar = marcas[0] if marcas else "(vacío)"

            if ganador == primer_lugar:
                print(f"  ✅ PASÓ: {ganador} coincide en texto y gráfico.")
                ok += 1
            else:
                print(f"  ❌ FALLO CRÍTICO: El texto dice {ganador} pero el gráfico pondrá a {primer_lugar} en 100%")
                fail += 1

            results.append({
                "run": i,
                "ganador": ganador,
                "primer_lugar": primer_lugar,
                "match": ganador == primer_lugar,
                "marcas": marcas,
            })
        except Exception as e:
            print(f"  💥 ERROR: {e}")
            fail += 1
            results.append({"run": i, "error": str(e)})

    # Resumen
    print("\n" + "=" * 60)
    print(f"RESULTADOS: {ok} ✅  /  {fail} ❌  /  {N} total")
    print(f"Tasa de coherencia: {ok/N*100:.0f}%")
    print("=" * 60)

    for r in results:
        if "error" in r:
            print(f"  Run {r['run']}: 💥 {r['error']}")
        else:
            flag = "✅" if r["match"] else "❌"
            print(f"  Run {r['run']}: {flag} ganador={r['ganador']}  marcas[0]={r['primer_lugar']}")


if __name__ == "__main__":
    asyncio.run(main())
