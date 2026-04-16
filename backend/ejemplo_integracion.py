"""
ejemplo_integracion.py - Cómo usar judge.py en un flujo real

Muestra:
1. Cómo importar y usar extraer_metricas
2. Cómo se integra con el pipeline
3. Ejemplos prácticos
4. Cómo manejar errores
"""

import asyncio
from judge import extraer_metricas, extraer_metricas_streaming
from models import AnalisisMarca


# ============================================================================
# EJEMPLO 1: USO BÁSICO
# ============================================================================

async def ejemplo_basico():
    """Cómo usar judge.py en su forma más simple"""
    
    print("\n" + "="*70)
    print("📘 EJEMPLO 1: USO BÁSICO")
    print("="*70 + "\n")
    
    # Supongamos que ya obtuvimos este texto del Paso 2 (searcher.py)
    texto_busqueda = """
    El mercado de smartphones en 2024 muestra a Apple liderando con el iPhone 15 Pro.
    Samsung Galaxy S24 mantiene una posición fuerte como segunda opción.
    Mi Marca (Pixel Pro) está ganando cuota de mercado en el segmento premium.
    Apple domina en satisfacción del cliente con 92% de retención.
    Pixel Pro destaca por su procesamiento de imágenes con IA.
    Samsung ofrece mejor relación precio-rendimiento.
    """
    
    try:
        # LLAMAR A JUDGE PARA EXTRAER MÉTRICAS
        print("🔄 Extrayendo métricas...")
        analisis = await extraer_metricas(
            texto_respuesta=texto_busqueda,
            mi_marca="Pixel Pro"
        )
        
        # USAR LOS DATOS ESTRUCTURADOS
        print("\n✅ Análisis completado:\n")
        print(f"   📱 Marcas encontradas: {', '.join(analisis.marcas_mencionadas)}")
        print(f"   👑 Marca ganadora: {analisis.marca_ganadora}")
        print(f"   📍 Posición de Pixel Pro: {analisis.posicion_mi_marca}")
        print(f"   😊 Sentimiento general: {analisis.sentimiento_general}")
        
        # VALIDACIÓN PYDANTIC (garantizada)
        print(f"\n   ✨ Tipo: {type(analisis).__name__} (Validado por Pydantic)")
        
        return analisis
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


# ============================================================================
# EJEMPLO 2: STREAMING PARA UI EN TIEMPO REAL
# ============================================================================

async def ejemplo_streaming():
    """Cómo usar streaming para actualizar UI mientras se procesa"""
    
    print("\n" + "="*70)
    print("📘 EJEMPLO 2: STREAMING (para Streamlit dashboard)")
    print("="*70 + "\n")
    
    texto_busqueda = """
    Intel Core i9 es el procesador más potente.
    AMD Ryzen también es competitivo.
    Mi Marca (XYZ Chip) está emergiendo en el mercado.
    """
    
    print("🔄 Procesando análisis en streaming...\n")
    
    try:
        # USAR STREAMING
        async for chunk in extraer_metricas_streaming(
            texto_respuesta=texto_busqueda,
            mi_marca="XYZ Chip"
        ):
            # Esto se iría actualizando en tiempo real en un dashboard
            print(chunk, end="", flush=True)
        
        print("\n\n✅ Stream completado")
    
    except Exception as e:
        print(f"\n❌ Error: {e}")


# ============================================================================
# EJEMPLO 3: MANEJO DE ERRORES
# ============================================================================

async def ejemplo_manejo_errores():
    """Cómo manejar errores de entrada y OpenAI"""
    
    print("\n" + "="*70)
    print("📘 EJEMPLO 3: MANEJO DE ERRORES")
    print("="*70 + "\n")
    
    # Error 1: Texto muy corto
    print("1️⃣  Probando con texto muy corto...")
    try:
        await extraer_metricas("Corto", "Mi Marca")
    except ValueError as e:
        print(f"   ✅ Capturado: {e}\n")
    
    # Error 2: Marca vacía
    print("2️⃣  Probando con marca vacía...")
    try:
        await extraer_metricas("Este es un texto válido de búsqueda", "")
    except ValueError as e:
        print(f"   ✅ Capturado: {e}\n")
    
    # Error 3: Rate limit de OpenAI (será reintentado automáticamente)
    print("3️⃣  Si OpenAI retorna 429 (rate limit):")
    print("   → Automáticamente reintenta con exponential backoff")
    print("   → Máximo 3 intentos")
    print("   → Espera: 2s → 4s → 8s\n")


# ============================================================================
# EJEMPLO 4: PIPELINE COMPLETO (Cómo se integraría con searcher.py)
# ============================================================================

async def ejemplo_pipeline_completo():
    """Simula el pipeline: Paso 2 (Searcher) → Paso 3 (Judge)"""
    
    print("\n" + "="*70)
    print("📘 EJEMPLO 4: PIPELINE COMPLETO")
    print("="*70 + "\n")
    
    # Este sería el output del Paso 2 (searcher.py)
    print("PASO 2: Búsqueda en Perplexity/ChatGPT")
    print("-" * 70)
    
    texto_from_searcher = """
    Las mejores marcas de televisores en 2024 son:
    
    1. Samsung QN95D - Considera la mejor en calidad de imagen con tecnología Mini-LED.
       Precio: $3,999
    
    2. LG OLED77G4 - Excelente con OLED technology, colores perfectos.
       Precio: $3,499
    
    3. Mi Marca (ProView 85") - Nueva marca que entra en el mercado premium.
       Usuarios reportan excelente relación precio-calidad.
       Precio: $2,299
    
    4. Sony K-95XR - Buena opción, pero más cara que LG.
       Precio: $4,499
    
    Samsung lidera el mercado con 35% de cuota. Mi Marca está creciendo
    rápidamente en el segmento de televisores grandes.
    """
    
    print(f"Búsqueda de: 'mejores televisores 2024'")
    print(f"Caracteres recibidos: {len(texto_from_searcher)}")
    print(f"Preview: {texto_from_searcher[:100]}...\n")
    
    # PASO 3: Judge extrae métricas
    print("PASO 3: Judge extrae métricas estructuradas")
    print("-" * 70)
    
    try:
        resultado = await extraer_metricas(
            texto_respuesta=texto_from_searcher,
            mi_marca="Mi Marca"
        )
        
        print(f"\n✅ Resultado estructurado:")
        print(f"   Marcas encontradas: {resultado.marcas_mencionadas}")
        print(f"   Ganadora: {resultado.marca_ganadora}")
        print(f"   Mi Marca posición: {resultado.posicion_mi_marca}")
        print(f"   Sentimiento: {resultado.sentimiento_general}")
        
        # Este resultado se guardaría en BD
        print(f"\n   📊 Próximo: Guardar en BD...")
        
        return resultado
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


# ============================================================================
# EJEMPLO 5: MÚLTIPLES ANÁLISIS (Batch)
# ============================================================================

async def ejemplo_multiples_marcas():
    """Cómo analizar múltiples marcas en paralelo"""
    
    print("\n" + "="*70)
    print("📘 EJEMPLO 5: ANÁLISIS DE MÚLTIPLES MARCAS (Paralelo)")
    print("="*70 + "\n")
    
    # Datos de entrada
    busquedas = {
        "Apple": """
            Apple domina el mercado de smartphones.
            iPhone 15 es el mejor teléfono.
            Android tiene opciones competitivas.
            Apple lidera en satisfacción.
        """,
        "Samsung": """
            Samsung Galaxy es una buena alternativa a iPhone.
            Galaxy S24 compite bien en el mercado.
            Samsung mejora constantemente.
            Pero Apple sigue siendo la número 1.
        """,
        "Google": """
            Google Pixel destaca en fotografía IA.
            Es una opción valiosa en el mercado.
            Google compite con Apple y Samsung.
        """
    }
    
    try:
        # Ejecutar análisis en paralelo
        print("🔄 Analizando marcas en paralelo...\n")
        
        tasks = []
        for marca, texto in busquedas.items():
            tasks.append(extraer_metricas(texto, marca))
        
        resultados = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Mostrar resultados
        print("✅ Resultados:\n")
        for marca, resultado in zip(busquedas.keys(), resultados):
            if isinstance(resultado, Exception):
                print(f"   ❌ {marca}: Error - {resultado}")
            else:
                print(f"   ✅ {marca}:")
                print(f"      Ganadora: {resultado.marca_ganadora}")
                print(f"      Posición: {resultado.posicion_mi_marca}")
                print()
    
    except Exception as e:
        print(f"❌ Error: {e}")


# ============================================================================
# EJEMPLO 6: INTEGRACIÓN CON FASTAPI (Futuro)
# ============================================================================

async def ejemplo_fastapi_endpoint():
    """Cómo se vería en un endpoint FastAPI"""
    
    print("\n" + "="*70)
    print("📘 EJEMPLO 6: INTEGRACIÓN CON FASTAPI (Paso siguiente)")
    print("="*70 + "\n")
    
    print("""
# Esto se agregaría a backend/main.py (Paso siguiente):

@app.post("/api/audits/analyze", response_model=AnalisisMarca)
async def analizar_marca(
    nombre_marca: str,
    texto_busqueda: str = Query(..., min_length=50),
    db: AsyncSession = Depends(get_db)
) -> AnalisisMarca:
    \"\"\"
    Endpoint que ejecuta el pipeline completo:
    Paso 2 (búsqueda) → Paso 3 (judge extrae métricas)
    \"\"\"
    try:
        # PASO 3: Usar judge para extraer métricas
        analisis = await extraer_metricas(
            texto_respuesta=texto_busqueda,
            mi_marca=nombre_marca
        )
        
        # Guardar en BD
        db_audit = Audit(
            marca=nombre_marca,
            marcas_mencionadas=analisis.marcas_mencionadas,
            marca_ganadora=analisis.marca_ganadora,
            posicion=analisis.posicion_mi_marca,
            sentimiento=analisis.sentimiento_general
        )
        db.add(db_audit)
        await db.commit()
        
        return analisis
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500)


# Ejemplo de llamada:
POST /api/audits/analyze?nombre_marca=Mi+Marca
{
    "texto_busqueda": "Apple es el líder... Samsung compite... Mi Marca crece..."
}

Response:
{
    "marcas_mencionadas": ["Apple", "Samsung", "Mi Marca"],
    "marca_ganadora": "Apple",
    "posicion_mi_marca": 3,
    "sentimiento_general": "positivo"
}
    """)


# ============================================================================
# MAIN - EJECUTAR TODOS LOS EJEMPLOS
# ============================================================================

async def main():
    """Ejecuta todos los ejemplos"""
    
    print("\n" + "="*70)
    print("🎓 EJEMPLOS DE USO - JUDGE EXTRACTOR (Paso 3)")
    print("="*70)
    
    # Ejecutar ejemplos
    await ejemplo_basico()
    await ejemplo_streaming()
    await ejemplo_manejo_errores()
    await ejemplo_pipeline_completo()
    await ejemplo_multiples_marcas()
    await ejemplo_fastapi_endpoint()
    
    print("\n" + "="*70)
    print("✅ EJEMPLOS COMPLETADOS")
    print("="*70 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
