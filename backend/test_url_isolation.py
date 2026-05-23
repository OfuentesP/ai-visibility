"""
Prueba de aislamiento entre URLs.
Verifica que cada URL retorne resultados únicos y no contaminados por otras URLs.
"""
import asyncio
import httpx

API = "http://localhost:8000"

URLS = [
    ("https://www.falabella.com/falabella-cl/", "Falabella"),
    ("https://www.ripley.cl/", "Ripley"),
    ("https://www.sodimac.cl/", "Sodimac"),
    ("https://www.jumbo.cl/", "Jumbo"),
    ("https://www.latam.com/es_cl/", "LATAM"),
    ("https://www.entel.cl/", "Entel"),
    ("https://www.claro.cl/personas/", "Claro"),
    ("https://www.nike.com/cl/", "Nike"),
    ("https://www.paris.cl/", "Paris"),
    ("https://www.easy.cl/", "Easy"),
]

PASS = "\033[92m✓\033[0m"
FAIL = "\033[91m✗\033[0m"
WARN = "\033[93m⚠\033[0m"


async def auditar_url(client: httpx.AsyncClient, url: str) -> dict:
    r = await client.post(
        f"{API}/api/audit/from-url",
        json={"url": url, "pais": "Chile", "email": "test@test.com"},
        timeout=180,
    )
    r.raise_for_status()
    return r.json()


def check_result(url: str, expected_brand: str, data: dict) -> list[str]:
    errores = []

    marca_resp = data.get("marca", "")
    if not marca_resp:
        errores.append("campo 'marca' vacío en la respuesta")
        return errores

    # La marca inferida debe ser razonablemente distinta entre URLs
    # (no exigimos match exacto porque el LLM puede variar el nombre)
    resultados = data.get("resultados", [])
    if not resultados:
        errores.append("sin resultados")
        return errores

    total = data.get("total_queries", 0)
    con_mencion = data.get("queries_con_mencion", 0)
    vis = data.get("visibilidad_pct", -1)

    if not (0 <= vis <= 100):
        errores.append(f"visibilidad_pct fuera de rango: {vis}")

    if total == 0:
        errores.append("total_queries = 0")

    return errores


async def main():
    print(f"\n{'─'*65}")
    print(f"  Test de aislamiento URL — {len(URLS)} sitios")
    print(f"{'─'*65}\n")

    marcas_inferidas = []
    errores_totales = 0

    async with httpx.AsyncClient() as client:
        for url, expected in URLS:
            dominio = url.split("/")[2]
            print(f"  {dominio:<35}", end=" ", flush=True)
            try:
                data = await auditar_url(client, url)
                errores = check_result(url, expected, data)
                marca_inferida = data.get("marca", "?")
                marcas_inferidas.append(marca_inferida.lower())

                cached = " [caché]" if data.get("from_cache") else ""
                vis = data.get("visibilidad_pct", "?")

                if errores:
                    print(FAIL)
                    for e in errores:
                        print(f"    → {e}")
                    errores_totales += len(errores)
                else:
                    print(f"{PASS}  marca='{marca_inferida}'  vis={vis}%{cached}")

            except httpx.HTTPStatusError as ex:
                print(f"{FAIL}  HTTP {ex.response.status_code}: {ex.response.text[:80]}")
                errores_totales += 1
            except Exception as ex:
                print(f"{FAIL}  ERROR: {ex}")
                errores_totales += 1

    # Verificar diversidad de marcas inferidas (detecta cache cruzado)
    print(f"\n{'─'*65}")
    unicas = set(marcas_inferidas)
    if len(unicas) < len(URLS) * 0.7:
        print(f"{FAIL}  ALERTA: solo {len(unicas)} marcas distintas para {len(URLS)} URLs → posible caché cruzado")
        print(f"     Marcas: {unicas}")
        errores_totales += 1
    else:
        print(f"{PASS}  Diversidad de marcas inferidas OK ({len(unicas)} distintas de {len(URLS)})")

    # Verificar que no hay marca que aparezca en >50% de los resultados
    from collections import Counter
    conteo = Counter(marcas_inferidas)
    dominante, freq = conteo.most_common(1)[0]
    if freq > len(URLS) * 0.5:
        print(f"{WARN}  '{dominante}' aparece en {freq}/{len(URLS)} respuestas — revisar si hay fuga de caché")

    print(f"\n  Resultado final: {'PASS ✓' if errores_totales == 0 else f'FAIL — {errores_totales} problema(s)'}")
    print(f"{'─'*65}\n")


if __name__ == "__main__":
    asyncio.run(main())
