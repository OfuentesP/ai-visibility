# Motor de Búsqueda - Cliente AI Asíncrono

## 📁 Archivos Creados

```
backend/
├── ai_clients.py                  ✨ NUEVO - Cliente OpenAI/Anthropic asíncrono
├── test_ai_clients.py             ✨ NUEVO - 8 ejemplos de uso
├── integration_examples.py        ✨ NUEVO - Integración con FastAPI
├── QUICK_START.py                 ✨ NUEVO - Guía rápida
├── requirements.txt               ✏️ ACTUALIZADO - Agregadas openai, anthropic
└── README.md                      ✏️ ACTUALIZADO - Sección Cliente AI
```

## 🚀 Inicio Rápido

### 1️⃣ Instalar Dependencias

```bash
cd backend
pip install -r requirements.txt
```

### 2️⃣ Configurar API Key

```bash
# Opción A: Variable de entorno
export OPENAI_API_KEY="sk-..."

# Opción B: Archivo .env
echo 'OPENAI_API_KEY=sk-...' >> backend/.env

# Opción C: Directo en código (no recomendado)
client = OpenAIClient(api_key="sk-...")
```

### 3️⃣ Ejecutar Ejemplos

```bash
python test_ai_clients.py
```

## 📖 Documentación

### Archivo: `ai_clients.py`

**Clases principales:**
- `OpenAIClient` - Cliente asíncrono para OpenAI
- `AnthropicClient` - Cliente asíncrono para Claude
- `consultar_multiple_ias()` - Consultar varias IAs en paralelo

**Métodos principales:**

```python
# Consulta simple
await client.consultar_openai(prompt: str) -> str

# Consulta avanzada
await client.consultar_openai(
    prompt: str,
    model: str = "gpt-4o-mini",
    temperature: float = 0.1,
    max_tokens: int = 2000,
    system_prompt: Optional[str] = None
) -> str

# Métodos especializados
await client.analizar_contenido(contenido: str) -> str
await client.generar_recomendaciones(url: str, marca: str) -> str
```

### Ejemplo Básico

```python
import asyncio
from ai_clients import OpenAIClient

async def main():
    client = OpenAIClient()
    
    respuesta = await client.consultar_openai(
        "¿Cuál es la capital de Francia?"
    )
    
    print(respuesta)

asyncio.run(main())
```

## 📊 Parámetros Clave

### `temperature` (0 a 2)
- **0.0-0.3**: Determinista (ideal para análisis)
- **0.5-0.7**: Balance (content general)
- **0.8-2.0**: Creativo (brainstorming)

### `model` 
- **gpt-4o-mini**: Barato (~$0.15/1M tokens) ⭐ Recomendado desarrollo
- **gpt-4o**: Potente (~$5/1M tokens)
- **claude-3-haiku**: Barato (~$0.25/1M tokens)
- **claude-3-opus**: Potente (~$15/1M tokens)

### `system_prompt`
Define el rol/contexto de la IA:

```python
system_prompt = "Eres experto en AEO y análisis de contenido web"
```

## 🔥 Casos de Uso - AI Visibility

### 1. Análisis de Contenido

```python
contenido = "..."  # Tu contenido
analisis = await client.analizar_contenido(contenido)
# Retorna: palabras clave, sentimiento, recomendaciones
```

### 2. Recomendaciones SEO/AEO

```python
recom = await client.generar_recomendaciones(
    url="https://miempresa.com/producto",
    marca="MiBrand"
)
# Retorna: palabras clave, estructura, semantic markup
```

### 3. Análisis de Competencia

```python
respuesta = await client.consultar_openai(
    prompt="""Analiza posicionamiento de estas marcas:
    - Apple
    - Samsung
    - Google
    """,
    system_prompt="Eres experto en análisis competitivo",
    temperature=0.2
)
```

### 4. Optimización para AI Engines

```python
respuesta = await client.consultar_openai(
    prompt="""Cómo optimizar para:
    - ChatGPT
    - Perplexity
    - Google AI Overviews
    """,
    system_prompt="Eres experto en AEO",
    temperature=0.1
)
```

## 🔌 Integración con FastAPI

Ver `integration_examples.py` para ejemplos de endpoints:

```python
@app.post("/api/consultar")
async def consultar_ia(req: ConsultaRequest):
    client = OpenAIClient()
    respuesta = await client.consultar_openai(req.prompt)
    return {"respuesta": respuesta}

@app.post("/api/analizar-contenido")
async def analizar_contenido(req: AnalisisContenidoRequest):
    client = OpenAIClient()
    analisis = await client.analizar_contenido(req.contenido)
    return {"analisis": analisis}
```

## ⚠️ Manejo de Errores

```python
from openai import APIError, RateLimitError, APIConnectionError

try:
    respuesta = await client.consultar_openai(prompt)
except RateLimitError:
    print("Rate limit - espera antes de reintentar")
except APIConnectionError:
    print("Error de conexión")
except APIError as e:
    print(f"Error API: {e}")
except ValueError as e:
    print(f"Input inválido: {e}")
```

## 💰 Estimación de Costos

```
1 análisis con gpt-4o-mini: ~$0.0001-$0.0005

Ejemplos:
- 1,000 análisis: ~$0.10-$0.50
- 10,000 análisis: ~$1-$5
- 100,000 análisis: ~$10-$50
```

## 🧪 Tests Disponibles

```bash
# Ejecutar todos los ejemplos
python test_ai_clients.py

# Ejemplos incluidos:
# 1. Consulta básica
# 2. System prompt
# 3. Analizar contenido
# 4. Recomendaciones SEO
# 5. Efectos de temperatura
# 6. Manejo de errores
# 7. Múltiples IAs
# 8. Casos prácticos
```

## 📝 Archivos Generados

### `ai_clients.py` (350 líneas)
- `OpenAIClient` class con 4 métodos
- `AnthropicClient` class
- `consultar_multiple_ias()` function
- Logging completo
- Manejo robusto de errores

### `test_ai_clients.py` (250 líneas)
- 8 ejemplos de uso
- Casos prácticos para AI Visibility
- Manejo de errores
- Comparación de temperaturas

### `integration_examples.py` (350 líneas)
- 8 endpoints FastAPI
- Integración con modelos Pydantic
- Ejemplos de uso en producción

### `QUICK_START.py` (200 líneas)
- Guía rápida completa
- Mejores prácticas
- Información de costos

## ✅ Checklist de Configuración

- [ ] API Key de OpenAI obtenida
- [ ] `OPENAI_API_KEY` configurada
- [ ] Dependencias instaladas: `pip install -r requirements.txt`
- [ ] Tests ejecutados: `python test_ai_clients.py`
- [ ] Documentación leída: `README.md`

## 🎯 Próximos Pasos

1. ✅ Cliente AI creado
2. ➡️ Integrar en endpoints FastAPI
3. ➡️ Conectar con base de datos (Prisma)
4. ➡️ Agregar más IAs (Anthropic, Perplexity)
5. ➡️ Cache/Rate limiting
6. ➡️ Webhooks para análisis asíncrono

## 📚 Recursos

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic Claude Docs](https://docs.anthropic.com)
- [Async Python](https://docs.python.org/3/library/asyncio.html)
- [FastAPI Docs](https://fastapi.tiangolo.com)

## 💡 Tips

- Usa `temperature=0.1` para análisis deterministas
- Sempre incluye `system_prompt` para mejores resultados
- Maneja excepciones para producción
- Monitorea costos en dashboard de OpenAI
- Usa `max_tokens` para controlar longitud
- Cache respuestas para prompts idénticos

---

**¿Preguntas?** Revisa `QUICK_START.py` o contacta al equipo.
