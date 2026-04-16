// AI Engine types
export type AIEngine = 'chatgpt' | 'perplexity' | 'google-ai' | 'bing' | 'duckduckgo';

// Sentiment types
export type Sentimiento = 'positivo' | 'negativo' | 'neutral';

// Brand Analysis Models (Pydantic equivalents in TypeScript)
export interface AnalisisMarca {
  /** Lista de marcas encontradas en el resultado */
  marcas_mencionadas: string[];
  /** Marca con mejor posicionamiento o recomendación */
  marca_ganadora: string;
  /** Posición de tu marca (0 si no aparece) */
  posicion_mi_marca: number;
  /** Sentimiento general: 'positivo', 'negativo' o 'neutral' */
  sentimiento_general: Sentimiento;
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
