import asyncio
from searcher import consultar_openai
from judge import extraer_metricas

async def main():
    """Test end-to-end: Paso 2 (Searcher) → Paso 3 (Judge)"""
    
    # Paso 2: Buscar
    prompt = "¿Cuáles son los mejores bancos para empresas en Chile? Menciona 5 opciones."
    print(f"🔍 Buscando: {prompt}\n")
    
    texto_busqueda = await consultar_openai(prompt)
    print(f"📄 Resultado búsqueda:\n{texto_busqueda[:500]}...\n")
    
    # Paso 3: Juzgar
    print("⚖️ Extrayendo métricas...\n")
    resultado = await extraer_metricas(texto_busqueda, "Banco Santander")
    
    print(f"✅ Análisis completado:")
    print(f"   Marcas encontradas: {resultado.marcas_mencionadas}")
    print(f"   Marca ganadora: {resultado.marca_ganadora}")
    print(f"   Posición Santander: {resultado.posicion_mi_marca}")
    print(f"   Sentimiento: {resultado.sentimiento}")

asyncio.run(main())
