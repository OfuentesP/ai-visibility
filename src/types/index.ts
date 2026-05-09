// AI Engine types
export type AIEngine = 'chatgpt' | 'perplexity' | 'google-ai' | 'bing' | 'duckduckgo';

// Sentiment types
export type Sentimiento = 'positivo' | 'negativo' | 'neutral';

// Brand Analysis Models (Pydantic equivalents in TypeScript)
export interface PrioridadEjecutiva {
  clasificacion: string;
  veredicto_ejecutivo: string;
  riesgo_inaccion: string;
}

export interface PlanAccion {
  quick_wins: string[];
  estrategia_mediano_plazo: string[];
  roi_estimado: string;
}

export interface TerritorioDesatendido {
  topico_emergente: string;
  porque_es_oportunidad: string;
  nivel_oportunidad: string;
  intension_usuario: string;
  crecimiento_trends: string;
}

export interface AnalisisMarca {
  /** Lista de marcas encontradas en el resultado */
  marcas_mencionadas: string[];
  /** Marca con mejor posicionamiento o recomendación */
  marca_ganadora: string | null;
  /** Competidor principal contra el que se compara */
  competidor_principal: string;
  /** Posición de tu marca (0 si no aparece) */
  posicion_mi_marca: number;
  /** Sentimiento general: 'positivo', 'negativo' o 'neutral' */
  sentimiento: Sentimiento;
  /** Recomendación basada en IA */
  recomendacion_ia: string;
  /** 3 títulos de contenido sugeridos */
  content_ideas: string[];
  /** Brief estratégico PRO */
  plan_accion_pro: string;
  /** Priorización ejecutiva */
  prioridad_ejecutiva?: PrioridadEjecutiva;
  /** Atributos genéricos que la IA asocia con mi_marca pero no son relevantes */
  percepciones_genericas: string[];
  /** Diferenciadores del ganador que mi_marca omite */
  conceptos_faltantes: string[];
  /** Estado: 'visible', 'en_riesgo', 'invisible' */
  estado_invisibilidad: string;
  /** 0-100, donde 100 es completamente invisible */
  invisibilidad_score: number;
  /** Plan de rescate con quick wins y estrategia */
  plan_accion?: PlanAccion;
  /** Territorios desatendidos con alto potencial */
  territorios_desatendidos: TerritorioDesatendido[];
}

export interface ResultadoBusqueda {
  /** Prompt/consulta original utilizado en la búsqueda */
  prompt: string;
  /** Análisis de marcas por resultado de búsqueda */
  analisis_marcas: AnalisisMarca[];
  /** Timestamp del análisis */
  timestamp: string; // ISO 8601 format
}

export interface AnalisisCompetencia {
  /** Total de resultados analizados */
  total_resultados: number;
  /** Cuántas veces apareció tu marca */
  apariciones_mi_marca: number;
  /** Posición promedio de tu marca */
  posicion_promedio: number;
  /** Marca competidora dominante */
  marca_competidora_principal: string;
  /** Sentimiento más frecuente */
  sentimiento_dominante: Sentimiento;
  /** Recomendaciones de optimización */
  recomendaciones: string[];
}

// Content Audit types
export interface ContentAudit {
  id: string;
  urlId: string;
  aiEngine: AIEngine;
  citedStatus: 'cited' | 'not-cited' | 'partial';
  lastChecked: Date;
  snippet?: string;
  position?: number;
}

// URL to audit
export interface AuditURL {
  id: string;
  url: string;
  title: string;
  description?: string;
  clientId: string;
  createdAt: Date;
  audits: ContentAudit[];
}

// Client/Organization
export interface Client {
  id: string;
  name: string;
  email: string;
  website?: string;
  apiKey: string;
  createdAt: Date;
}

// Recommendation
export interface Recommendation {
  id: string;
  urlId: string;
  engine: AIEngine;
  type: 'keyword' | 'content' | 'structure' | 'semantic';
  priority: 'high' | 'medium' | 'low';
  description: string;
  actionItems: string[];
  estimatedImpact: number; // 0-100
  createdAt: Date;
}

// Analytics
export interface AnalyticsMetrics {
  totalURLs: number;
  citedCount: number;
  citationRate: number;
  engineBreakdown: Record<AIEngine, number>;
  lastUpdated: Date;
}

// Discovery: Arquetipos Enterprise
export type Arquetipo = 'El Racional / Económico' | 'El Premium / Seguro' | 'El Impaciente / Digital';

export interface OportunidadAuditada {
  arquetipo: string;
  necesidad_principal: string;
  segmento: string;
  tendencia_base: string;
  pregunta_generada: string;
  marca_elegida: string;
  justificacion_basada_en_datos: string;
  segunda_opcion: string;
  factor_desempate: string;
  certeza: number; // 50-100
  dealbreaker_activado: boolean;
  dealbreaker_detalle: string;
  resultado_auditoria: AnalisisMarca;
  error?: string;
}

export interface DiscoveryResponse {
  marca_analizada: string;
  topico: string;
  oportunidades_auditadas: OportunidadAuditada[];
  amenaza_principal?: string;
  total_auditados: number;
  total_errores: number;
}
