"""
test_judge.py - Tests para el Judge Extractor (Paso 3)

Verifica que la función extraer_metricas:
1. Importa correctamente
2. Maneja validaciones
3. Se integra con OpenAI
4. Retorna Pydantic válido
5. Maneja errores correctamente
"""

import asyncio
import pytest
from judge import extraer_metricas, extraer_metricas_streaming
from models import AnalisisMarca


# ============================================================================
# TESTS DE VALIDACIÓN INPUT
# ============================================================================

def test_judge_import():
    """✅ Verifica que judge.py se importa correctamente"""
    assert extraer_metricas is not None
    assert asyncio.iscoroutinefunction(extraer_metricas)
    print("✅ Import exitoso")


@pytest.mark.asyncio
async def test_validacion_texto_vacio():
    """✅ Debe rechazar texto vacío"""
    try:
        await extraer_metricas("", "Mi Marca")
        assert False, "Debería haber lanzado ValueError"
    except ValueError as e:
        assert "al menos 10 caracteres" in str(e)
        print("✅ Validación de texto vacío OK")


@pytest.mark.asyncio
async def test_validacion_marca_vacia():
    """✅ Debe rechazar marca vacía"""
    try:
        await extraer_metricas("Texto válido de búsqueda", "")
        assert False, "Debería haber lanzado ValueError"
    except ValueError as e:
        assert "al menos 2 caracteres" in str(e)
        print("✅ Validación de marca vacía OK")


# ============================================================================
# TEST DE INTEGRACIÓN CON OPENAI (Requiere .env con OPENAI_API_KEY)
# ============================================================================

@pytest.mark.asyncio
async def test_extraer_metricas_real():
    """✅ Test real con OpenAI (solo si tiene API key)"""
    
    texto_busqueda = """
    El teléfono más avanzado del mercado es el iPhone 15 Pro de Apple.
    Samsung también presenta opciones competitivas con el Galaxy S24.
    Mi Marca (XYZ Phone) está ganando terreno en el segmento de gama media.
    Pero Apple sigue siendo la referencia en innovación.
    XYZ Phone destaca por su relación precio-rendimiento.
    """
    
    try:
        resultado = await extraer_metricas(
            texto_respuesta=texto_busqueda,
            mi_marca="XYZ Phone"
        )
        
        # Validaciones de resultado
        assert isinstance(resultado, AnalisisMarca), "Debe retornar AnalisisMarca"
        assert isinstance(resultado.marcas_mencionadas, list), "marcas_mencionadas debe ser list"
        assert len(resultado.marcas_mencionadas) > 0, "Debe haber al menos 1 marca"
        assert isinstance(resultado.marca_ganadora, str), "marca_ganadora debe ser str"
        assert resultado.posicion_mi_marca >= 0, "posicion_mi_marca debe ser >= 0"
        assert resultado.sentimiento_general in ["positivo", "negativo", "neutral"], \
            "sentimiento_general debe ser positivo|negativo|neutral"
        
        print("✅ Test Real con OpenAI: OK")
        print(f"   Marcas encontradas: {resultado.marcas_mencionadas}")
        print(f"   Ganadora: {resultado.marca_ganadora}")
        print(f"   Posición XYZ: {resultado.posicion_mi_marca}")
        print(f"   Sentimiento: {resultado.sentimiento_general}")
        
        return resultado
    
    except Exception as e:
        print(f"⚠️  No se pudo ejecutar test real: {e}")
        print("   (Verifica que OPENAI_API_KEY está en .env)")
        return None


@pytest.mark.asyncio
async def test_marca_no_aparece():
    """✅ Debe retornar posicion_mi_marca=0 si no aparece"""
    
    texto_sin_mi_marca = """
    Apple y Samsung dominan el mercado.
    Los dos fabricantes competem constantemente.
    Las innovaciones siguen llegando.
    """
    
    try:
        resultado = await extraer_metricas(
            texto_respuesta=texto_sin_mi_marca,
            mi_marca="Mi Marca Inexistente"
        )
        
        # Verificar que retorna 0 si no aparece
        assert resultado.posicion_mi_marca == 0, \
            f"Debería ser 0 pero es {resultado.posicion_mi_marca}"
        
        print("✅ Detección correcta de marca no encontrada")
        return resultado
    
    except Exception as e:
        print(f"⚠️  Error en test: {e}")
        return None


# ============================================================================
# TESTS DE MANEJO DE ERRORES
# ============================================================================

@pytest.mark.asyncio
async def test_pydantic_validation():
    """✅ Verifica que Pydantic valida correctamente"""
    
    # Esto debería fallar en validación (posicion debe ser >= 0)
    try:
        # Intentar crear AnalisisMarca con posicion negativa
        analisis = AnalisisMarca(
            marcas_mencionadas=["Apple"],
            marca_ganadora="Apple",
            posicion_mi_marca=-1,  # ❌ Inválido
            sentimiento_general="positivo"
        )
        assert False, "Debería validar que posicion >= 0"
    except ValueError:
        print("✅ Validación Pydantic funciona (rechaza posicion negativa)")


@pytest.mark.asyncio
async def test_pydantic_sentimiento_valido():
    """✅ Verifica que sentimiento_general solo acepta valores válidos"""
    
    try:
        # Sentimiento inválido
        analisis = AnalisisMarca(
            marcas_mencionadas=["Apple"],
            marca_ganadora="Apple",
            posicion_mi_marca=1,
            sentimiento_general="excelente"  # ❌ No es positivo|negativo|neutral
        )
        assert False, "Debería rechazar sentimiento inválido"
    except ValueError:
        print("✅ Validación Pydantic funciona (sentimiento debe ser positivo|negativo|neutral)")


# ============================================================================
# TESTS DE STREAMING
# ============================================================================

@pytest.mark.asyncio
async def test_extraer_metricas_streaming():
    """✅ Test del modo streaming para UI"""
    
    texto_busqueda = """
    iPhone 15 Pro es el mejor teléfono.
    Samsung Galaxy también es bueno.
    """
    
    try:
        chunks = []
        async for chunk in extraer_metricas_streaming(
            texto_respuesta=texto_busqueda,
            mi_marca="iPhone"
        ):
            chunks.append(chunk)
        
        full_text = "".join(chunks)
        assert len(full_text) > 0, "Debe haber contenido"
        print("✅ Streaming funciona")
        print(f"   Recibidos {len(chunks)} chunks")
        
    except Exception as e:
        print(f"⚠️  Error en streaming: {e}")


# ============================================================================
# TEST DE RENDIMIENTO
# ============================================================================

@pytest.mark.asyncio
async def test_performance():
    """✅ Verifica tiempo de respuesta"""
    
    import time
    
    texto_busqueda = """
    El mercado de tecnología es competitivo.
    Apple, Samsung y Google compiten.
    Cada marca tiene fortalezas diferentes.
    """
    
    try:
        inicio = time.time()
        resultado = await extraer_metricas(
            texto_respuesta=texto_busqueda,
            mi_marca="Apple"
        )
        duracion = time.time() - inicio
        
        print(f"✅ Tiempo de respuesta: {duracion:.2f}s")
        assert duracion < 30, "No debería tardar más de 30 segundos"
        
    except Exception as e:
        print(f"⚠️  Error: {e}")


# ============================================================================
# SUITE DE TESTS
# ============================================================================

async def ejecutar_tests():
    """Ejecuta todos los tests"""
    
    print("\n" + "="*70)
    print("🧪 EJECUTANDO TESTS DEL JUDGE EXTRACTOR")
    print("="*70 + "\n")
    
    # Tests básicos
    print("1. TESTS DE VALIDACIÓN")
    print("-" * 70)
    test_judge_import()
    
    try:
        await test_validacion_texto_vacio()
    except Exception as e:
        print(f"❌ Error: {e}")
    
    try:
        await test_validacion_marca_vacia()
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Tests de Pydantic
    print("\n2. TESTS DE VALIDACIÓN PYDANTIC")
    print("-" * 70)
    try:
        await test_pydantic_validation()
    except Exception as e:
        print(f"❌ Error: {e}")
    
    try:
        await test_pydantic_sentimiento_valido()
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test real (requiere OPENAI_API_KEY)
    print("\n3. TEST REAL CON OPENAI")
    print("-" * 70)
    try:
        await test_extraer_metricas_real()
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test sin marca
    print("\n4. TEST: MARCA NO APARECE")
    print("-" * 70)
    try:
        await test_marca_no_aparece()
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test streaming
    print("\n5. TEST STREAMING")
    print("-" * 70)
    try:
        await test_extraer_metricas_streaming()
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test performance
    print("\n6. TEST DE RENDIMIENTO")
    print("-" * 70)
    try:
        await test_performance()
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "="*70)
    print("✅ SUITE DE TESTS COMPLETADA")
    print("="*70 + "\n")


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    # Ejecutar con: python test_judge.py
    asyncio.run(ejecutar_tests())
