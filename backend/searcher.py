import asyncio
from openai_tracking import TrackingAsyncOpenAI as AsyncOpenAI
from dotenv import load_dotenv
import os
import logging
from config import AI_MODEL, GEMINI_MODEL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

_api_key = os.getenv("OPENAI_API_KEY")
client = AsyncOpenAI(api_key=_api_key) if _api_key else None


_SYSTEM_PROMPT = (
    "Eres un asistente de IA respondiendo a un usuario chileno. "
    "Responde la pregunta directamente, como lo haría ChatGPT en una conversación real. "
    "Menciona marcas o servicios relevantes para Chile cuando corresponda. "
    "No analices tu propio razonamiento. No expliques tus fuentes. Solo responde la pregunta."
)


def _con_contexto_cl(prompt: str) -> str:
    return prompt if "Chile" in prompt or "chile" in prompt else f"{prompt} en el mercado de Chile"


async def consultar_openai(prompt: str) -> str:
    """Busca contenido usando OpenAI con AI_MODEL. Contexto: Mercado chileno."""
    try:
        message = await client.chat.completions.create(
            model=AI_MODEL,
            max_tokens=1024,
            temperature=0.1,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": _con_contexto_cl(prompt)},
            ],
        )
        return message.choices[0].message.content
    except Exception as e:
        logger.error(f"Error en búsqueda OpenAI: {e}")
        raise


async def consultar_gemini(prompt: str) -> str:
    """Busca contenido usando Gemini con GEMINI_MODEL. Contexto: Mercado chileno."""
    from gemini_tracking import generate_text, gemini_available
    if not gemini_available():
        raise RuntimeError("Gemini no configurado (falta GEMINI_API_KEY o SDK google-genai).")
    try:
        return await generate_text(
            model=GEMINI_MODEL,
            prompt=_con_contexto_cl(prompt),
            system_instruction=_SYSTEM_PROMPT,
            max_output_tokens=1024,
            temperature=0.1,
        )
    except Exception as e:
        logger.error(f"Error en búsqueda Gemini: {e}")
        raise


async def consultar_motor(prompt: str, motor: str = "chatgpt") -> str:
    """Dispatcher: motor='chatgpt' usa OpenAI, motor='gemini' usa Gemini."""
    if motor == "gemini":
        return await consultar_gemini(prompt)
    return await consultar_openai(prompt)


if __name__ == "__main__":
    async def main():
        prompt = "Nombra las 3 mejores cuentas corrientes para empresas en Chile"
        response = await consultar_openai(prompt)
        print(f"Prompt: {prompt}\n")
        print(f"Respuesta:\n{response}")

    asyncio.run(main())
