# Backend - AI Visibility

Backend Python con FastAPI para análisis de visibilidad de marcas en motores de búsqueda con IA.

## Estructura

```
backend/
├── main.py              # Aplicación FastAPI
├── models.py            # Modelos Pydantic
├── requirements.txt     # Dependencias Python
└── __init__.py
```

## Modelos Pydantic

### AnalisisMarca

```python
class AnalisisMarca(BaseModel):
    marcas_mencionadas: List[str]
    marca_ganadora: str
    posicion_mi_marca: int = 0
    sentimiento_general: str  # 'positivo', 'negativo', 'neutral'
```

**Ejemplo:**
```json
{
  "marcas_mencionadas": ["Apple", "Samsung", "Tu Marca"],
  "marca_ganadora": "Apple",
  "posicion_mi_marca": 3,
  "sentimiento_general": "positivo"
}
```

### ResultadoBusqueda

```python
class ResultadoBusqueda(BaseModel):
    prompt: str
    analisis_marcas: List[AnalisisMarca]
    timestamp: datetime = Field(default_factory=datetime.now)
```

**Ejemplo:**
```json
{
  "prompt": "mejores smartphones 2024",
  "analisis_marcas": [
    {
      "marcas_mencionadas": ["Apple", "Samsung"],
      "marca_ganadora": "Apple",
      "posicion_mi_marca": 0,
      "sentimiento_general": "positivo"
    }
  ],
  "timestamp": "2024-04-15T10:30:00"
}
```

### AnalisisCompetencia

Análisis agregado de múltiples búsquedas:

```python
class AnalisisCompetencia(BaseModel):
    total_resultados: int
    apariciones_mi_marca: int
    posicion_promedio: float
    marca_competidora_principal: str
    sentimiento_dominante: str
    recomendaciones: List[str]
```

## Instalación

```bash
# Crear venv
python -m venv venv
source venv/bin/activate  # macOS/Linux
# o
venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements.txt
```

## Ejecutar

```bash
python main.py
```

El servidor estará disponible en `http://localhost:8000`

### Documentación interactiva

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Cliente AI Asíncrono

El módulo `ai_clients.py` proporciona clientes asíncrónos para OpenAI y Anthropic.

### Configuración

Primero, asegúrate de tener tu API key configurada:

```bash
# En .env
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
```

O como variable de entorno:

```bash
export OPENAI_API_KEY="sk-..."
```

### Uso Básico

```python
import asyncio
from ai_clients import OpenAIClient

async def main():
    client = OpenAIClient()
    
    # Consulta simple
    respuesta = await client.consultar_openai("¿Cuál es la capital de Francia?")
    print(respuesta)
    
    # Con system prompt y temperatura
    respuesta = await client.consultar_openai(
        prompt="Recomienda estrategias de SEO",
        system_prompt="Eres experto en SEO",
        temperature=0.2
    )
    print(respuesta)
    
    # Analizar contenido
    analisis = await client.analizar_contenido(
        contenido="Aquí va tu contenido..."
    )
    print(analisis)
    
    # Generar recomendaciones
    recom = await client.generar_recomendaciones(
        url="https://miempresa.com/producto",
        marca="MiBrand"
    )
    print(recom)

asyncio.run(main())
```

### Métodos Disponibles

#### OpenAIClient

```python
await client.consultar_openai(
    prompt: str,
    model: str = "gpt-4o-mini",
    temperature: float = 0.1,
    max_tokens: int = 2000,
    system_prompt: Optional[str] = None
) -> str
```

Realiza una consulta al modelo de OpenAI.

**Parámetros:**
- `prompt`: La consulta a enviar
- `model`: Modelo a usar (default: gpt-4o-mini para bajo costo)
- `temperature`: 0.1 = determinista, 1.0 = creativo
- `max_tokens`: Máximo de tokens en respuesta
- `system_prompt`: Instrucciones de rol/contexto

**Ejemplo:**
```python
respuesta = await client.consultar_openai(
    prompt="Analiza esta página web...",
    system_prompt="Eres experto en AEO",
    temperature=0.1  # Muy determinista
)
```

#### Métodos especializados

```python
# Analizar contenido
await client.analizar_contenido(contenido: str) -> str

# Generar recomendaciones SEO/AEO
await client.generar_recomendaciones(url: str, marca: str) -> str
```

### AnthropicClient

Uso similar al de OpenAI:

```python
from ai_clients import AnthropicClient

async def main():
    client = AnthropicClient()
    
    respuesta = await client.consultar_claude(
        prompt="Tu pregunta aquí",
        model="claude-3-haiku-20240307",
        temperature=0.1
    )
    print(respuesta)

asyncio.run(main())
```

### Consultar Múltiples IAs

```python
from ai_clients import consultar_multiple_ias

async def main():
    resultados = await consultar_multiple_ias(
        prompt="¿Cuál es el mejor smartphone?",
        use_openai=True,
        use_claude=True
    )
    
    print(resultados["openai"])
    print(resultados["claude"])

asyncio.run(main())
```

### Manejo de Errores

```python
from openai import APIError, RateLimitError, APIConnectionError

try:
    respuesta = await client.consultar_openai(prompt)
except RateLimitError:
    print("Rate limit alcanzado, espera un momento")
except APIConnectionError:
    print("Error de conexión")
except APIError as e:
    print(f"Error en API: {e}")
```

### Ejecutar Ejemplos

```bash
# Asegúrate de tener OPENAI_API_KEY configurada
python test_ai_clients.py
```

Esto ejecutará 8 ejemplos incluyendo:
1. Consulta básica
2. Con system prompt
3. Análisis de contenido
4. Recomendaciones SEO/AEO
5. Efectos de temperatura
6. Manejo de errores
7. Consultas múltiples IAs
8. Casos prácticos para AI Visibility

### Performance y Costos

- **gpt-4o-mini**: Muy económico, bueno para análisis simple (~$0.15/1M tokens)
- **gpt-4o**: Más potente pero más caro (~$5/1M tokens)
- **claude-3-haiku**: Económico (~$0.25/1M tokens)
- **claude-3-opus**: Más potente (~$15/1M tokens)

Para desarrollo, usa gpt-4o-mini o claude-3-haiku.

## Endpoints

### POST /api/analizar
Analiza un resultado de búsqueda.

**Request:**
```json
{
  "prompt": "mejores smartphones",
  "analisis_marcas": [...]
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "mensaje": "Análisis procesado exitosamente"
}
```

### POST /api/competencia
Analiza múltiples búsquedas para generar análisis de competencia.

**Request:**
```json
[
  {
    "prompt": "...",
    "analisis_marcas": [...]
  }
]
```

**Response:**
```json
{
  "total_resultados": 10,
  "apariciones_mi_marca": 3,
  "posicion_promedio": 2.5,
  "marca_competidora_principal": "Apple",
  "sentimiento_dominante": "positivo",
  "recomendaciones": [...]
}
```

### GET /api/modelos/esquema
Retorna los esquemas JSON de todos los modelos Pydantic.

### GET /health
Health check del servicio.

## Integración con Next.js

El frontend envía resultados al backend para análisis:

```typescript
import { ResultadoBusqueda } from '@/types';
import { apiClient } from '@/lib/api-client';

const resultado: ResultadoBusqueda = {
  prompt: "consulta de búsqueda",
  analisis_marcas: [
    {
      marcas_mencionadas: ["marca1", "marca2"],
      marca_ganadora: "marca1",
      posicion_mi_marca: 0,
      sentimiento_general: "positivo"
    }
  ],
  timestamp: new Date().toISOString()
};

// Enviar al backend
const response = await fetch('http://localhost:8000/api/analizar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(resultado)
});
```

## Variables de Entorno

Crear `.env` en la carpeta backend:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_visibility
NEXT_PUBLIC_API_URL=http://localhost:8000
OPENAI_API_KEY=sk-...
```
