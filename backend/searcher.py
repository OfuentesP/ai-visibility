import asyncio
from openai import AsyncOpenAI
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


async def consultar_openai(prompt: str) -> str:
    """
    Busca contenido usando OpenAI con gpt-4o-mini.
    Contexto: Mercado chileno.
    
    Args:
        prompt: Consulta a enviar
        
    Returns:
        str: Respuesta de OpenAI
    """
    # Inyectar "en Chile" si no está presente
    prompt_con_contexto = prompt if "Chile" in prompt or "chile" in prompt else f"{prompt} en el mercado de Chile"
    
    try:
        message = await client.chat.completions.create(
            model="gpt-4o-mini",
            max_tokens=1024,
            temperature=0.1,
            messages=[
                {
                    "role": "system",
                    "content": "Eres un asistente experto en el mercado chileno. Tu objetivo es dar recomendaciones de productos o servicios disponibles localmente en Chile, basándote en la calidad y relevancia para el usuario chileno. Solo recomiendas marcas, tiendas o servicios que operen físicamente o digitalmente para el público chileno."
                },
                {"role": "user", "content": prompt_con_contexto}
            ]
        )
        return message.choices[0].message.content
    except Exception as e:
        logger.error(f"Error en búsqueda: {e}")
        raise


if __name__ == "__main__":
    async def main():
        prompt = "Nombra las 3 mejores cuentas corrientes para empresas en Chile"
        response = await consultar_openai(prompt)
        print(f"Prompt: {prompt}\n")
        print(f"Respuesta:\n{response}")

    asyncio.run(main())
