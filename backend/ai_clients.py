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
    Consulta OpenAI con el modelo gpt-4o-mini.
    
    Args:
        prompt: El prompt para enviar a OpenAI
        
    Returns:
        str: La respuesta de OpenAI
    """
    try:
        message = await client.chat.completions.create(
            model="gpt-4o-mini",
            max_tokens=1024,
            temperature=0.1,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return message.choices[0].message.content
    except Exception as e:
        logger.error(f"Error consultando OpenAI: {e}")
        raise


if __name__ == "__main__":
    async def main():
        prompt = "Nombra las 3 mejores tarjetas de crédito sin costo de mantención en Chile"
        response = await consultar_openai(prompt)
        print(f"Prompt: {prompt}\n")
        print(f"Respuesta:\n{response}")

    asyncio.run(main())
