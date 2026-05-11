from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List, Literal
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


class CompetitorAdvantageRow(BaseModel):
    """Una fila de la tabla comparativa de ventajas del competidor."""
    atributo_ganador: str = Field(description="Atributo que el competidor comunica mejor (ej: 'Durabilidad comprobada')")
    fuente_de_verdad: str = Field(description="De dónde obtiene la IA esta percepción (ej: 'Citado en blogs de moda chilenos')")
    gap_nuestra_marca: str = Field(description="Qué le falta a nuestra marca para competir en este atributo (ej: 'Ausencia de información sobre materiales en su web')")


class CompetitorAdvantage(BaseModel):
    """Análisis de ventajas competitivas del rival según la IA."""
    rival: str
    nuestra_marca: str
    filas: List[CompetitorAdvantageRow]
    conclusion: str = Field(description="Síntesis ejecutiva de 1-2 oraciones sobre la brecha más crítica")


# Catálogo oficial de tácticas AEO — la IA SÓLO puede elegir de esta lista
CATALOGO_TACTICAS_AEO = [
    "Inyección de Schema FAQ (JSON-LD)",
    "Reestructuración de Tablas de Datos HTML",
    "Optimización de Meta-Entidades para Knowledge Graph",
    "Inyección Semántica en Landing Page Principal",
    "Digital PR en Medios Autorizados",
]


class AccionICE(BaseModel):
    """Acción AEO evaluada con Framework ICE (Impact, Confidence, Effort)."""
    tactica_tecnica: Literal[
        "Inyección de Schema FAQ (JSON-LD)",
        "Reestructuración de Tablas de Datos HTML",
        "Optimización de Meta-Entidades para Knowledge Graph",
        "Inyección Semántica en Landing Page Principal",
        "Digital PR en Medios Autorizados",
    ] = Field(
        description=(
            "Táctica AEO del catálogo oficial. "
            "REGLA DE COHERENCIA: "
            "'Inyección de Schema FAQ (JSON-LD)' → area='TI / Desarrollo', pasos técnicos de JSON-LD. "
            "'Reestructuración de Tablas de Datos HTML' → area='TI / Desarrollo', pasos técnicos de HTML. "
            "'Optimización de Meta-Entidades para Knowledge Graph' → area='TI / Desarrollo', pasos de Knowledge Graph. "
            "'Inyección Semántica en Landing Page Principal' → area='Marketing / Contenido', pasos de contenido landing. "
            "'Digital PR en Medios Autorizados' → area='PR / Agencia', pasos de nota de prensa en medios."
        )
    )
    area_responsable: Literal[
        "TI / Desarrollo",
        "Marketing / Contenido",
        "PR / Agencia",
    ] = Field(
        description=(
            "Área responsable. CORRELACIÓN OBLIGATORIA con tactica_tecnica: "
            "Schema FAQ / Tablas HTML / Knowledge Graph → 'TI / Desarrollo'. "
            "Inyección Semántica Landing → 'Marketing / Contenido'. "
            "Digital PR → 'PR / Agencia'. "
            "NO MEZCLAR."
        )
    )
    concepto_objetivo: str = Field(
        ...,
        description="ESTRICTAMENTE PROHIBIDO usar frases genéricas. DEBE ser la palabra clave exacta del negocio. Ejemplo Correcto: 'Seguros de Vida'. Ejemplo Incorrecto: 'conceptos faltantes'."
    )
    impacto: int = Field(
        ge=1, le=10,
        description="Impacto esperado en visibilidad IA (1=mínimo, 10=máximo)"
    )
    confianza: int = Field(
        ge=1, le=10,
        description="Confianza en éxito de la táctica dado el contexto (1=baja, 10=alta)"
    )
    esfuerzo: int = Field(
        ge=1, le=10,
        description="Facilidad de implementación (1=muy difícil, 10=muy fácil)"
    )
    ice_score: float = Field(
        description="Promedio simple: (impacto + confianza + esfuerzo) / 3"
    )
    segmento_impactado: str = Field(
        description="Perfil del usuario objetivo que realiza esta busqueda (ej: 'Dueno de PYME que busca seguros')"
    )
    tiempo_indexacion_ia: str = Field(
        description="Debe ser asignado ESTRICTAMENTE según la matriz de tácticas de la industria. PROHIBIDO inventar tiempos libres. Usar exactamente el valor correspondiente a la táctica seleccionada."
    )
    pasos_ejecucion: List[str] = Field(
        description="3 pasos tecnicos concretos para implementar esta tactica (sin generalidades)"
    )
    riesgo_inaccion: str = Field(
        default="Sin acción, la IA continuará excluyendo esta marca de las recomendaciones sobre este concepto.",
        description="Una frase corta y directa sobre el costo de NO implementar esta táctica. Menciona el competidor ganador y el plazo."
    )


class VehiculoContenido(BaseModel):
    """Vehículo de contenido para comunicar un concepto faltante."""
    concepto: str = Field(
        description="El concepto faltante que se busca comunicar"
    )
    acciones: List[AccionICE] = Field(
        description="Tácticas AEO con scoring ICE para inyectar este concepto en motores IA"
    )


class AccionMejora(BaseModel):
    """Una acción específica de mejora para visibilidad."""
    accion: str = Field(description="Descripción clara de la acción a tomar")
    esfuerzo: str = Field(description="Bajo, Medio o Alto")
    tiempo: str = Field(description="Estimación de tiempo (ej: 48h, 2 semanas, 1 mes)")
    costo_estimado: str = Field(description="Rango de costo en UF (ej: 5-10 UF)")


class PlanAccion(BaseModel):
    """Menú de implementación con vehículos de contenido por velocidad de ejecución."""
    vehiculos: List[VehiculoContenido] = Field(
        default_factory=list,
        description="Lista de vehículos de contenido, uno por concepto faltante"
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
    nivel_oportunidad: str = Field(
        description="Nivel de oportunidad narrativa: Alto, Medio. Basado en tendencia del mercado, NO en volumen de búsquedas de Google."
    )
    intension_usuario: str = Field(
        description="Qué busca el usuario cuando realiza búsquedas en este tema"
    )
    crecimiento_trends: str = Field(
        default="Buscando datos...",
        description="Crecimiento real según Google Trends (ej: '+120% de interés', 'Tendencia estable')"
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
    percepciones_genericas: List[str] = Field(
        default_factory=list,
        description="Atributos genéricos que la IA asocia con mi_marca pero que NO son relevantes para la búsqueda específica (por eso es invisible)"
    )
    conceptos_faltantes: List[str] = Field(
        default_factory=list,
        description="Diferenciadores específicos que usa el ganador y que mi_marca omite completamente en su contenido"
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
    competitor_advantage: Optional['CompetitorAdvantage'] = Field(
        default=None,
        description="Tabla comparativa de ventajas del competidor principal vs nuestra marca"
    )
    estimated_search_volume: int = Field(
        default=0,
        ge=0,
        le=100,
        description="Volumen de búsqueda relativo estimado por la IA (0-100) basado en la intención de búsqueda"
    )
    competitor_winning_reasons: List[str] = Field(
        default_factory=list,
        description="Razones concretas por las que el competidor principal gana (ej: 'Autoridad de dominio', 'Menciones en prensa')"
    )
    cited_sources_types: List[str] = Field(
        default_factory=list,
        description="Tipos de fuentes que la IA consulta mentalmente para validar (ej: 'Revistas de moda', 'Blogs locales')"
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


class OportunidadAuditada(BaseModel):
    """Resultado de auditar un escenario generado por Discovery."""
    arquetipo: str = Field("", description="Arquetipo de compra: Racional/Económico, Premium/Seguro, Impaciente/Digital")
    necesidad_principal: str = Field("", description="Driver de decisión del arquetipo (ej: precio, reputación, velocidad)")
    segmento: str = Field(..., description="Descripción del perfil de persona")
    tendencia_base: str = Field(..., description="Pregunta generada en jerga chilena")
    pregunta_generada: str = Field(..., description="Prompt exacto enviado al LLM")
    marca_elegida: Optional[str] = Field("", description="Marca que el LLM recomendó como ganadora para este arquetipo")
    justificacion_basada_en_datos: str = Field("", description="Razón concreta por la que el LLM eligió esa marca, extraída del texto raw")
    segunda_opcion: str = Field("", description="Segunda marca en la terna del arquetipo")
    factor_desempate: str = Field("", description="Factor concreto que hizo ganar a marca_elegida sobre segunda_opcion")
    certeza: int = Field(75, ge=50, le=100, description="Nivel de certeza del arquetipo en su decisión (50-100)")
    dealbreaker_activado: bool = Field(False, description="True si el texto asocia a mi_marca con una fricción intolerable")
    dealbreaker_detalle: str = Field("Sin fricción detectada", description="Evidencia del dealbreaker en el texto")
    resultado_auditoria: AnalisisMarca = Field(..., description="Análisis completo del juez")
    error: Optional[str] = Field(None, description="Error si falló esta auditoría")


class DiscoveryResponse(BaseModel):
    """Respuesta del endpoint /api/discovery con auditorías concurrentes."""
    marca_analizada: str
    topico: str
    oportunidades_auditadas: List[OportunidadAuditada]
    amenaza_principal: Optional[str] = None
    total_auditados: int = 0
    total_errores: int = 0


class OmnichannelBrief(BaseModel):
    """Brief de contenido omnicanal generado a partir de una oportunidad de mercado."""
    blog_title_suggestion: str = Field(
        description="Título de artículo que responde a búsqueda transaccional (ej: Cómo elegir...)"
    )
    instagram_reel_hook: str = Field(
        description="Primer texto del Reel/Short, máximo 2 líneas, gancho emocional/curioso"
    )
    ecommerce_product_description_snippet: str = Field(
        description="Snippet de descripción de producto con palabras clave de intención de compra"
    )
    required_trust_signals: List[str] = Field(
        description="Señales de confianza que la marca debe recopilar (ej: 'Testimonios sobre durabilidad')"
    )
    strategic_faqs: List[dict] = Field(
        default_factory=list,
        description="3 FAQs estratégicas con question y suggested_answer_angle"
    )


class MarketingBriefRequest(BaseModel):
    """Request para generar brief omnicanal."""
    market_opportunity: str = Field(
        description="Oportunidad de mercado detectada (concepto_objetivo o segmento_impactado)"
    )
    archetype: str = Field(
        description="Arquetipo de comprador (ej: La Profesional Exigente)"
    )
    brand: str = Field(
        description="Nombre de la marca"
    )
    categoria: str = Field(
        default="",
        description="Categoría del producto o servicio"
    )
