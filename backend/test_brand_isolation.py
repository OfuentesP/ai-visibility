"""
Prueba de aislamiento entre marcas.
Verifica que cada consulta retorne resultados únicos y no contaminados por otras marcas.
"""
import asyncio
import httpx
import json

API = "http://localhost:8000"

MARCAS = [
    ("Nike", "zapatillas deportivas Chile"),
    ("Falabella", "retail moda Chile"),
    ("Copec", "combustible Chile"),
    ("Claro", "telefonía móvil Chile"),
    ("Banco Santander", "banco retail Chile"),
    ("Jumbo", "supermercado Chile"),
    ("Entel", "internet hogar Chile"),
    ("Sodimac", "ferretería construcción Chile"),
    ("Latam", "aerolínea Chile"),
    ("Rappi", "delivery comida Chile"),
]

PASS = "\033[92m✓\033[0m"
FAIL = "\033[91m✗\033[0m"


async def auditar(client: httpx.AsyncClient, marca: str, query: str) -> dict:
    r = await client.post(
        f"{API}/api/audit",
        json={"brand": marca, "query": query, "email": "test@test.com"},
        timeout=120,
    )
    r.raise_for_status()
    return r.json()


def check_result(marca: str, query: str, data: dict) -> list[str]:
    errores = []

    # 1. El campo marca en la respuesta debe coincidir
    resp_marca = data.get("prompt_original", "") or data.get("marca", "")
    if marca.lower() not in resp_marca.lower() and query.lower() not in resp_marca.lower():
        errores.append(f"prompt_original '{resp_marca}' no contiene la marca ni la query enviada")

    resultados = data.get("resultados", [])
    if not resultados:
        errores.append("sin resultados")
        return errores

    d = resultados[0]

    # 2. La marca ganadora no debe ser idéntica en todas las pruebas (se verifica cross-run)
    ganadora = d.get("marca_ganadora", "")

    # 3. Si la marca está en marcas_mencionadas, su posición debe ser > 0
    mencionadas = [m.lower() for m in d.get("marcas_mencionadas", [])]
    pos = d.get("posicion_mi_marca", 0)
    if marca.lower() in mencionadas and pos == 0:
        errores.append(f"'{marca}' aparece en marcas_mencionadas pero posicion_mi_marca=0")

    # 4. invisibilidad_score debe estar entre 0-100
    score = d.get("invisibilidad_score", -1)
    if not (0 <= score <= 100):
        errores.append(f"invisibilidad_score fuera de rango: {score}")

    return errores, ganadora


async def main():
    print(f"\n{'─'*60}")
    print(f"  Test de aislamiento — {len(MARCAS)} marcas")
    print(f"{'─'*60}\n")

    ganadoras = []
    errores_totales = 0

    async with httpx.AsyncClient() as client:
        for marca, query in MARCAS:
            print(f"  Probando: {marca} / {query} ...", end=" ", flush=True)
            try:
                data = await auditar(client, marca, query)
                errores, ganadora = check_result(marca, query, data)
                ganadoras.append(ganadora)

                if errores:
                    print(FAIL)
                    for e in errores:
                        print(f"    → {e}")
                    errores_totales += len(errores)
                else:
                    cached = " [caché]" if data.get("from_cache") else ""
                    print(f"{PASS}  ganadora={ganadora or 'ninguna'} score={data.get('resultados', [{}])[0].get('invisibilidad_score', '?')}{cached}")
            except Exception as ex:
                print(f"{FAIL}  ERROR: {ex}")
                errores_totales += 1

    # 5. Verificar que las ganadoras no son todas iguales (indicaría caché cruzado)
    print(f"\n{'─'*60}")
    ganadoras_unicas = set(g for g in ganadoras if g)
    if len(ganadoras_unicas) < 3:
        print(f"{FAIL}  ALERTA: solo {len(ganadoras_unicas)} marca(s) ganadora(s) distintas → posible caché cruzado")
        print(f"     Ganadoras: {ganadoras_unicas}")
        errores_totales += 1
    else:
        print(f"{PASS}  Diversidad de ganadoras OK ({len(ganadoras_unicas)} distintas)")

    print(f"\n  Resultado final: {'PASS ✓' if errores_totales == 0 else f'FAIL — {errores_totales} problema(s)'}")
    print(f"{'─'*60}\n")


if __name__ == "__main__":
    asyncio.run(main())
