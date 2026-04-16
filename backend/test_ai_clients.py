"""
Ejemplos de uso del cliente OpenAI asíncrono
"""

import asyncio
import os
from dotenv import load_dotenv
from ai_clients import OpenAIClient, AnthropicClient, consultar_multiple_ias

# Cargar variables de entorno
load_dotenv()


async def ejemplo_1_consulta_basica():
    """Ejemplo 1: Consulta básica a OpenAI"""
    print("\n" + "="*60)
    print("EJEMPLO 1: Consulta Básica")
    print("="*60)
    
    try:
        client = OpenAIClient()
        
        prompt = "¿Cuál es la capital de Francia?"
        respuesta = await client.consultar_openai(prompt)
        
        print(f"Prompt: {prompt}")
        print(f"Respuesta:\n{respuesta}")
    
    except Exception as e:
        print(f"Error: {e}")


async def ejemplo_2_sistema_prompt():
    """Ejemplo 2: Usar system prompt para roles específicos"""
    print("\n" + "="*60)
    print("EJEMPLO 2: Con System Prompt")
    print("="*60)
    
    try:
        client = OpenAIClient()
        
        system_prompt = """Eres un experto en SEO y AEO (Answer Engine Optimization).
Tu rol es analizar contenido y proporcionar recomendaciones para mejorar su visibilidad
en motores de búsqueda con IA como ChatGPT, Perplexity y Google AI Overviews."""
        
        prompt = "¿Cómo debo estructurar mi contenido para aparecer en AI Overviews?"
        
        respuesta = await client.consultar_openai(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=0.2
        )
        
        print(f"Prompt: {prompt}")
        print(f"Respuesta:\n{respuesta}")
    
    except Exception as e:
        print(f"Error: {e}")


async def ejemplo_3_analizar_contenido():
    """Ejemplo 3: Usar método especializado para analizar contenido"""
    print("\n" + "="*60)
    print("EJEMPLO 3: Analizar Contenido")
    print("="*60)
    
    try:
        client = OpenAIClient()
        
        contenido = """
Apple Inc. es una empresa tecnológica que se destaca por sus innovadores productos.
El iPhone es el smartphone más vendido del mundo y proporciona experiencias únicas.
Samsung también es competidor fuerte en el mercado de teléfonos móviles.
Google Pixel ofrece excelente fotografía computacional.
"""
        
        analisis = await client.analizar_contenido(contenido)
        
        print(f"Contenido:\n{contenido}")
        print(f"\nAnálisis:\n{analisis}")
    
    except Exception as e:
        print(f"Error: {e}")


async def ejemplo_4_recomendaciones_seo():
    """Ejemplo 4: Generar recomendaciones SEO/AEO"""
    print("\n" + "="*60)
    print("EJEMPLO 4: Recomendaciones SEO/AEO")
    print("="*60)
    
    try:
        client = OpenAIClient()
        
        url = "https://www.miempresa.com/productos/smartphones"
        marca = "MiBrand"
        
        recomendaciones = await client.generar_recomendaciones(url, marca)
        
        print(f"URL: {url}")
        print(f"Marca: {marca}")
        print(f"\nRecomendaciones:\n{recomendaciones}")
    
    except Exception as e:
        print(f"Error: {e}")


async def ejemplo_5_temperatura():
    """Ejemplo 5: Comparar diferentes temperaturas"""
    print("\n" + "="*60)
    print("EJEMPLO 5: Efectos de la Temperatura")
    print("="*60)
    
    try:
        client = OpenAIClient()
        
        prompt = "Dame 3 nombres creativos para una marca de tecnología"
        
        for temp in [0.1, 0.5, 1.0]:
            print(f"\n--- Temperature: {temp} ---")
            respuesta = await client.consultar_openai(
                prompt=prompt,
                temperature=temp
            )
            print(respuesta[:200] + "...")  # Mostrar primeros 200 caracteres
    
    except Exception as e:
        print(f"Error: {e}")


async def ejemplo_6_manejo_errores():
    """Ejemplo 6: Manejo de errores"""
    print("\n" + "="*60)
    print("EJEMPLO 6: Manejo de Errores")
    print("="*60)
    
    try:
        client = OpenAIClient()
        
        # Error 1: Prompt vacío
        print("\n1. Intentando prompt vacío...")
        try:
            await client.consultar_openai("")
        except ValueError as e:
            print(f"   Error capturado: {e}")
        
        # Error 2: Temperature inválida
        print("\n2. Intentando temperature fuera de rango...")
        try:
            await client.consultar_openai("Hola", temperature=3.0)
        except ValueError as e:
            print(f"   Error capturado: {e}")
        
        # Error 3: Prompt válido
        print("\n3. Consulta válida...")
        respuesta = await client.consultar_openai("¿Hola?")
        print(f"   Éxito: {respuesta[:100]}...")
    
    except Exception as e:
        print(f"Error general: {e}")


async def ejemplo_7_multiple_ias():
    """Ejemplo 7: Consultar múltiples IAs simultáneamente"""
    print("\n" + "="*60)
    print("EJEMPLO 7: Consultar Múltiples IAs")
    print("="*60)
    
    try:
        prompt = "¿Cuáles son los beneficios principales de la IA para el marketing?"
        
        print(f"Consultando OpenAI y Claude...")
        resultados = await consultar_multiple_ias(
            prompt=prompt,
            use_openai=True,
            use_claude=False  # Cambiar a True si tienes API key de Claude
        )
        
        for ia, respuesta in resultados.items():
            if respuesta:
                print(f"\n--- {ia.upper()} ---")
                print(respuesta[:300] + "...")
            else:
                print(f"\n--- {ia.upper()} --- (Error o no disponible)")
    
    except Exception as e:
        print(f"Error: {e}")


async def ejemplo_8_casos_practicos():
    """Ejemplo 8: Casos prácticos para AI Visibility"""
    print("\n" + "="*60)
    print("EJEMPLO 8: Casos Prácticos - AI Visibility")
    print("="*60)
    
    try:
        client = OpenAIClient()
        
        casos = [
            {
                "nombre": "Análisis de competencia",
                "system": "Eres un experto en análisis competitivo. Analiza a fondo.",
                "prompt": "Analiza cómo posicionar una marca de smartphones frente a Apple"
            },
            {
                "nombre": "Extracción de palabras clave",
                "system": "Eres experto en keyword research. Sé preciso.",
                "prompt": "¿Cuáles son las 10 palabras clave más importantes para un blog de tecnología?"
            },
            {
                "nombre": "Evaluación de snippet",
                "system": "Evalúa si un contenido está optimizado para rich snippets.",
                "prompt": "Evalúa esta meta descripción: 'Los mejores smartphones 2024 - comparativa completa'"
            }
        ]
        
        for caso in casos:
            print(f"\n### {caso['nombre'].upper()} ###")
            respuesta = await client.consultar_openai(
                prompt=caso["prompt"],
                system_prompt=caso["system"],
                temperature=0.2
            )
            print(respuesta[:400] + "...")
    
    except Exception as e:
        print(f"Error: {e}")


async def main():
    """Ejecutar todos los ejemplos"""
    
    print("\n" + "="*60)
    print("CLIENTE OPENAI ASÍNCRONO - EJEMPLOS")
    print("="*60)
    
    # Verificar que tenemos API key
    if not os.getenv("OPENAI_API_KEY"):
        print("\n⚠️  ADVERTENCIA: OPENAI_API_KEY no está configurada")
        print("Para usar estos ejemplos, ejecuta:")
        print("  export OPENAI_API_KEY='tu-api-key-aqui'")
        print("\nO configura en .env:")
        print("  OPENAI_API_KEY=tu-api-key-aqui")
        return
    
    # Ejecutar ejemplos (comentar los que no quieras usar)
    try:
        await ejemplo_1_consulta_basica()
        await ejemplo_2_sistema_prompt()
        await ejemplo_3_analizar_contenido()
        await ejemplo_4_recomendaciones_seo()
        await ejemplo_5_temperatura()
        await ejemplo_6_manejo_errores()
        await ejemplo_7_multiple_ias()
        await ejemplo_8_casos_practicos()
    
    except KeyboardInterrupt:
        print("\n\nEjecución cancelada por el usuario")
    except Exception as e:
        print(f"\nError fatal: {e}")


if __name__ == "__main__":
    # Ejecutar con asyncio
    asyncio.run(main())
