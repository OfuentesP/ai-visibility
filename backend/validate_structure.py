#!/usr/bin/env python
"""
Script de validación de estructura del proyecto
Verifica que todos los módulos se importan correctamente y valida schemas
"""

import sys
import json


def test_imports():
    """Prueba que todos los módulos se importan correctamente"""
    print("🔍 Validando importaciones...\n")
    
    try:
        from models import AnalisisMarca, ResultadoBusqueda
        print("✅ models.py: OK")
    except Exception as e:
        print(f"❌ models.py: ERROR - {e}")
        return False
    
    try:
        from ai_clients import consultar_openai
        print("✅ ai_clients.py: OK")
    except Exception as e:
        print(f"❌ ai_clients.py: ERROR - {e}")
        return False
    
    return True


def test_pydantic_schemas():
    """Prueba que los esquemas Pydantic funcionan correctamente"""
    print("\n🔍 Validando esquemas Pydantic...\n")
    
    from models import AnalisisMarca, ResultadoBusqueda
    
    # Test AnalisisMarca válido
    try:
        marca = AnalisisMarca(
            marcas_mencionadas=["Apple", "Samsung"],
            marca_ganadora="Apple",
            posicion_mi_marca=1,
            sentimiento="positivo"
        )
        print("✅ AnalisisMarca: Validación OK")
    except Exception as e:
        print(f"❌ AnalisisMarca: {e}")
        return False
    
    # Test AnalisisMarca con defaults
    try:
        marca2 = AnalisisMarca(
            marcas_mencionadas=["Google"],
            sentimiento="neutral"
        )
        assert marca2.posicion_mi_marca == 0, "Default posicion_mi_marca debe ser 0"
        assert marca2.marca_ganadora is None, "Default marca_ganadora debe ser None"
        print("✅ AnalisisMarca (defaults): OK")
    except Exception as e:
        print(f"❌ AnalisisMarca (defaults): {e}")
        return False
    
    # Test sentimiento inválido
    try:
        marca_bad = AnalisisMarca(
            marcas_mencionadas=["Test"],
            sentimiento="invalid"
        )
        print("❌ AnalisisMarca: Debería haber rechazado sentimiento inválido")
        return False
    except ValueError:
        print("✅ AnalisisMarca (validación): Rechazo correcto de sentimiento inválido")
    
    # Test ResultadoBusqueda
    try:
        resultado = ResultadoBusqueda(
            prompt_original="¿cuál es la mejor marca?",
            resultados=[marca]
        )
        assert len(resultado.resultados) == 1
        assert resultado.timestamp is not None
        print("✅ ResultadoBusqueda: OK")
    except Exception as e:
        print(f"❌ ResultadoBusqueda: {e}")
        return False
    
    return True


def test_structure():
    """Verifica la estructura del proyecto"""
    print("\n📁 Verificando estructura del proyecto...\n")
    
    import os
    
    required_files = [
        "models.py",
        "ai_clients.py",
        "judge.py",
        "requirements.txt",
        "__init__.py"
    ]
    
    for file in required_files:
        path = os.path.join(os.path.dirname(__file__), file)
        if os.path.exists(path):
            print(f"✅ {file}")
        else:
            print(f"❌ {file}: NO ENCONTRADO")
            return False
    
    return True


def main():
    """Ejecuta todas las pruebas"""
    print("=" * 70)
    print("🧪 VALIDACIÓN DE ESTRUCTURA DEL PROYECTO")
    print("=" * 70)
    
    all_ok = True
    
    # Test 1: Estructura
    if not test_structure():
        all_ok = False
    
    # Test 2: Importaciones
    if not test_imports():
        all_ok = False
    
    # Test 3: Esquemas Pydantic
    if not test_pydantic_schemas():
        all_ok = False
    
    print("\n" + "=" * 70)
    if all_ok:
        print("✅ TODAS LAS PRUEBAS PASARON")
        print("=" * 70)
        return 0
    else:
        print("❌ ALGUNAS PRUEBAS FALLARON")
        print("=" * 70)
        return 1


if __name__ == "__main__":
    sys.exit(main())
