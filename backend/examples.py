"""
Ejemplos de uso de los modelos Pydantic
"""

from models import AnalisisMarca, ResultadoBusqueda, AnalisisCompetencia
from datetime import datetime


# Ejemplo 1: Crear un AnalisisMarca individual
ejemplo_marca_1 = AnalisisMarca(
    marcas_mencionadas=["Apple", "Samsung", "Google", "Tu Marca"],
    marca_ganadora="Apple",
    posicion_mi_marca=4,
    sentimiento_general="positivo"
)

print("Ejemplo 1 - AnalisisMarca:")
print(ejemplo_marca_1.model_dump_json(indent=2))
print("\n" + "="*50 + "\n")


# Ejemplo 2: Crear múltiples análisis
ejemplo_marca_2 = AnalisisMarca(
    marcas_mencionadas=["Samsung", "Tu Marca", "Xiaomi", "OnePlus"],
    marca_ganadora="Samsung",
    posicion_mi_marca=2,
    sentimiento_general="neutral"
)

ejemplo_marca_3 = AnalisisMarca(
    marcas_mencionadas=["Google", "Pixel", "Tu Marca"],
    marca_ganadora="Google",
    posicion_mi_marca=0,  # Tu marca no aparece
    sentimiento_general="negativo"
)

print("Ejemplo 2 - Múltiples AnalisisMarca:")
print(f"Marca 1: {ejemplo_marca_1.marca_ganadora} (tu marca en posición {ejemplo_marca_1.posicion_mi_marca})")
print(f"Marca 2: {ejemplo_marca_2.marca_ganadora} (tu marca en posición {ejemplo_marca_2.posicion_mi_marca})")
print(f"Marca 3: {ejemplo_marca_3.marca_ganadora} (tu marca en posición {ejemplo_marca_3.posicion_mi_marca})")
print("\n" + "="*50 + "\n")


# Ejemplo 3: Crear un ResultadoBusqueda
resultado_busqueda = ResultadoBusqueda(
    prompt="mejores smartphones 2024",
    analisis_marcas=[
        ejemplo_marca_1,
        ejemplo_marca_2,
        ejemplo_marca_3
    ]
)

print("Ejemplo 3 - ResultadoBusqueda:")
print(resultado_busqueda.model_dump_json(indent=2))
print("\n" + "="*50 + "\n")


# Ejemplo 4: Crear múltiples ResultadoBusqueda
resultado_busqueda_2 = ResultadoBusqueda(
    prompt="teléfonos más populares",
    analisis_marcas=[
        AnalisisMarca(
            marcas_mencionadas=["Apple", "Samsung"],
            marca_ganadora="Apple",
            posicion_mi_marca=1,
            sentimiento_general="positivo"
        )
    ]
)

print("Ejemplo 4 - Múltiples búsquedas para AnalisisCompetencia:")
print(f"Búsqueda 1: '{resultado_busqueda.prompt}' con {len(resultado_busqueda.analisis_marcas)} análisis")
print(f"Búsqueda 2: '{resultado_busqueda_2.prompt}' con {len(resultado_busqueda_2.analisis_marcas)} análisis")
print("\n" + "="*50 + "\n")


# Ejemplo 5: Procesar múltiples resultados para AnalisisCompetencia
from collections import Counter

resultados = [resultado_busqueda, resultado_busqueda_2]
total_resultados = sum(len(r.analisis_marcas) for r in resultados)

apariciones = 0
posiciones = []
sentimientos = []
marcas_ganadoras = []

for resultado in resultados:
    for analisis in resultado.analisis_marcas:
        if analisis.posicion_mi_marca > 0:
            apariciones += 1
            posiciones.append(analisis.posicion_mi_marca)
        sentimientos.append(analisis.sentimiento_general)
        marcas_ganadoras.append(analisis.marca_ganadora)

posicion_promedio = sum(posiciones) / len(posiciones) if posiciones else 0
marca_mas_frecuente = Counter(marcas_ganadoras).most_common(1)[0][0]
sentimiento_dominante = Counter(sentimientos).most_common(1)[0][0]

analisis_competencia = AnalisisCompetencia(
    total_resultados=total_resultados,
    apariciones_mi_marca=apariciones,
    posicion_promedio=round(posicion_promedio, 2),
    marca_competidora_principal=marca_mas_frecuente,
    sentimiento_dominante=sentimiento_dominante,
    recomendaciones=[
        "Crear más contenido sobre comparativas de marcas",
        "Mejorar SEO para palabras clave competitivas",
        "Aumentar presencia en reseñas de usuarios",
        "Optimizar fichas de producto"
    ]
)

print("Ejemplo 5 - AnalisisCompetencia:")
print(analisis_competencia.model_dump_json(indent=2))
