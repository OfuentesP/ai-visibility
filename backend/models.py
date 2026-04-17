from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime


class PrioridadEjecutiva(BaseModel):
    """Priorización ejecutiva: Lo más urgente para mejorar visibilidad."""
    
    foco_principal: str = Field(
        description="La única cosa que deben arreglar hoy (una sola acción)"
    )
    esfuerzo: str = Field(
        description="Nivel de esfuerzo: Bajo, Medio, Alto"
    )
    tiempo_estimado: str = Field(
        description="Estimación de tiempo para ver resultados (ej: 2 semanas, 1 mes)"
    )
    impacto_esperado: str = Field(
        description="Resultado esperado después de aplicar el foco (ej: Subir al Top 3)"
    )
    roi_score: int = Field(
        ge=1,
        le=10,
        description="Retorno de inversión estimado (1-10 donde 10 es máximo)"
    )
    clasificacion: str = Field(
        description="Clasificación: Mantener, Defender o Atacar"
    )


class AccionMejora(BaseModel):
    """Una acción específica de mejora para visibilidad."""
    accion: str = Field(description="Descripción clara de la acción a tomar")
    esfuerzo: str = Field(description="Bajo, Medio o Alto")
    tiempo: str = Field(description="Estimación de tiempo (ej: 48h, 2 semanas, 1 mes)")
    costo_estimado: str = Field(description="Rango de costo en UF (ej: 5-10 UF)")


class PlanAccion(BaseModel):
    """Plan de rescate de visibilidad con quick wins y acciones estratégicas."""
    quick_win: AccionMejora = Field(
        description="Acción rápida, bajo costo, sin IT, 48-72h"
    )
    estrategico: AccionMejora = Field(
        description="Cambio estratégico más profundo, requiere inversión, 1 mes+"
    )
    roi_estimado: str = Field(
        description="Estimación de ROI (ej: Reducción CAC 15%, aumento de mentions 40%)"
    )


class TerritorioDesatendido(BaseModel):
    """Territorio desatendido: tema emergente que la marca no está cubriendo."""
    topico_emergente: str = Field(
        description="Tema específico con búsquedas altas pero sin cobertura de la marca"
    )
    porque_es_oportunidad: str = Field(
        description="Por qué representa una oportunidad para la marca"
    )
    volumen_busqueda: str = Field(
        description="Volumen de búsqueda: Alto, Medio"
    )
    intension_usuario: str = Field(
        description="Qué busca el usuario cuando realiza búsquedas en este tema"
    )



class AnalisisMarca(BaseModel):
    """Análisis de una marca extraído de texto."""
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "marcas_mencionadas": ["Apple", "Samsung", "Google"],
                "marca_ganadora": "Apple",
                "posicion_mi_marca": 2,
                "sentimiento": "positivo",
                "recomendacion_ia": "Mejora tu comunicación sobre innovación y sostenibilidad para competir con Apple"
            }
        },
        str_strip_whitespace=True,
        validate_default=True
    )
    
    marcas_mencionadas: List[str] = Field(
        default_factory=list,
        description="Lista de marcas mencionadas en el texto (puede estar vacía)"
    )
    marca_ganadora: Optional[str] = Field(
        default=None,
        description="Marca ganadora o líder del análisis"
    )
    posicion_mi_marca: int = Field(
        default=0,
        ge=0,
        description="Posición de mi marca (0 si no aparece)"
    )
    sentimiento: str = Field(
        default="neutral",
        description="Sentimiento general (positivo, negativo, neutral)"
    )
    recomendacion_ia: str = Field(
        default="",
        description="Recomendación basada en IA sobre qué mejorar para competir"
    )
    content_ideas: List[str] = Field(
        default_factory=list,
        description="3 títulos de contenido sugeridos para subir en ranking"
    )
    plan_accion_pro: str = Field(
        default="",
        description="Brief estratégico para mejorar la visibilidad (PRO feature)"
    )
    prioridad_ejecutiva: Optional[PrioridadEjecutiva] = Field(
        default=None,
        description="Priorización ejecutiva para gerentes: Lo más importante"
    )
    conceptos_faltantes: List[str] = Field(
        default_factory=list,
        description="3 conceptos o palabras clave que usa la marca ganadora pero mi_marca no tiene (Mapa de Conceptos Perdidos)"
    )
    competidor_principal: str = Field(
        default="",
        description="Competidor principal con el que se compara: Si mi_marca es #1, es marca en posición #2. Si no es #1, es la marca_ganadora (#1)."
    )
    estado_invisibilidad: str = Field(
        default="invisible",
        description="Estado de invisibilidad: 'visible' (top 3 + sentimiento positivo), 'en_riesgo' (mencionada pero con problemas), 'invisible' (no mencionada)"
    )
    invisibilidad_score: int = Field(
        default=0,
        ge=0,
        le=100,
        description="Puntuación de invisibilidad (0-100, donde 100 es completamente invisible)"
    )
    plan_accion: Optional[PlanAccion] = Field(
        default=None,
        description="Plan de rescate con quick wins y acciones estratégicas"
    )
    territorios_desatendidos: List[TerritorioDesatendido] = Field(
        default_factory=list,
        description="Territorios desatendidos: temas emergentes que la marca no está cubriendo pero tienen alto potencial de búsqueda"
    )
    
    @field_validator('sentimiento')
    @classmethod
    def validate_sentimiento(cls, v: str) -> str:
        sentimientos_validos = {"positivo", "negativo", "neutral"}
        if v.lower() not in sentimientos_validos:
            raise ValueError(f"Sentimiento debe ser uno de {sentimientos_validos}")
        return v.lower()
    
    @field_validator('marcas_mencionadas')
    @classmethod
    def validate_marcas(cls, v: List[str]) -> List[str]:
        # Permitir listas vacías, pero limpiar strings vacíos
        return [marca.strip() for marca in v if marca.strip()]


class ResultadoBusqueda(BaseModel):
    """Resultado de una búsqueda con análisis de marcas."""
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "prompt_original": "¿Cuál es la mejor marca de smartphones?",
                "texto_original_ia": "Based on market research...",
                "resultados": [
                    {
                        "marcas_mencionadas": ["Apple", "Samsung"],
                        "marca_ganadora": "Apple",
                        "posicion_mi_marca": 0,
                        "sentimiento": "positivo"
                    }
                ]
            }
        }
    )
    
    prompt_original: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Prompt original de la búsqueda"
    )
    texto_original_ia: str = Field(
        ...,
        description="Texto crudo devuelto por OpenAI"
    )
    resultados: List[AnalisisMarca] = Field(
        default_factory=list,
        description="Lista de análisis de marcas"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Timestamp de creación"
    )
    
    @field_validator('prompt_original')
    @classmethod
    def validate_prompt(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El prompt no puede estar vacío")
        return v.strip()
