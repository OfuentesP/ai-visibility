// ─── Core domain types shared across all audit flows ────────────────────────

export interface PlanAccionItem {
  tactica_tecnica: string
  concepto_objetivo: string
  impacto: number
  confianza: number
  esfuerzo: number
  ice_score: number
  segmento_impactado: string
  tiempo_indexacion_ia: string
  pasos_ejecucion: string[]
  riesgo_inaccion?: string
  area_responsable?: string
}

export interface PlanAccion {
  vehiculos: Array<{
    concepto: string
    acciones: PlanAccionItem[]
  }>
  roi_estimado: string
}

export interface AnalisisMarca {
  marcas_mencionadas: string[]
  marca_ganadora: string | null
  competidor_principal: string
  posicion_mi_marca: number
  sentimiento: string
  recomendacion_ia: string
  content_ideas: string[]
  plan_accion_pro: string
  conceptos_faltantes: string[]
  percepciones_genericas: string[]
  estado_invisibilidad: string
  invisibilidad_score: number
  prioridad_ejecutiva?: {
    foco_principal: string
    esfuerzo: string
    tiempo_estimado: string
    impacto_esperado: string
    roi_score: number
    clasificacion: string
  }
  plan_accion?: PlanAccion
  territorios_desatendidos?: Array<{
    topico_emergente: string
    porque_es_oportunidad: string
    nivel_oportunidad: string
    intension_usuario: string
    crecimiento_trends: string
  }>
  competitor_advantage?: {
    rival: string
    nuestra_marca: string
    conclusion: string
    filas: Array<{
      atributo_ganador: string
      fuente_de_verdad: string
      gap_nuestra_marca: string
    }>
  }
  competitor_winning_reasons?: string[]
  cited_sources_types?: string[]
}

export interface ResultadoBusqueda {
  prompt_original: string
  texto_original_ia: string
  resultados: AnalisisMarca[]
  timestamp?: string
  from_cache?: boolean
  cached_at?: string | null
  prev_score?: number | null
  prev_cached_at?: string | null
  motor?: 'chatgpt' | 'gemini' | 'ambos'
  por_motor?: {
    chatgpt?: ResultadoBusqueda
    gemini?: ResultadoBusqueda
  }
}

export interface OportunidadAuditada {
  arquetipo: string
  necesidad_principal: string
  segmento: string
  tendencia_base: string
  pregunta_generada: string
  resultado_auditoria: AnalisisMarca
  error?: string | null
}

export interface DiscoveryResponse {
  marca_analizada: string
  topico: string
  oportunidades_auditadas: OportunidadAuditada[]
  amenaza_principal: string | null
  total_auditados: number
  total_errores: number
  motor?: 'chatgpt' | 'gemini' | 'ambos'
  por_motor?: { chatgpt?: DiscoveryResponse; gemini?: DiscoveryResponse }
}

// ─── URL audit specific types ────────────────────────────────────────────────

export interface UrlResultado {
  arquetipo: string
  driver: string
  query: string
  mencionada: boolean
  posicion: number
  marcas_mencionadas: string[]
  marca_ganadora: string
  sentimiento: string
  snippet: string
  competitor_winning_reasons?: string[]
  cited_sources_types?: string[]
  error?: string
}

export interface UrlAuditResult {
  marca: string
  categoria: string
  mercado: string
  diferenciadores: string[]
  resumen_pagina: string
  arquetipos: Array<{ arquetipo: string; driver: string; dealbreaker: string }>
  resultados: UrlResultado[]
  queries_con_mencion: number
  total_queries: number
  visibilidad_pct: number
  keyword_trend?: string
  competitive_deep_dive?: {
    competidor: string
    percepcion_nuestra_marca: string
    mensaje_competidor: string
    tabla_atributos: Array<{
      atributo: string
      autoridad_digital: string
      impacto_comercial: string
    }>
  }
  untapped_territories?: Array<{
    titulo: string
    justificacion_negocio: string
    tendencia: string
    nivel_competencia_ia: string
  }>
  plan_accion?: PlanAccion
  from_cache?: boolean
  cached_at?: string | null
  prev_score?: number | null
  prev_cached_at?: string | null
  motor?: 'chatgpt' | 'gemini' | 'ambos'
  por_motor?: { chatgpt?: UrlAuditResult; gemini?: UrlAuditResult }
}

// ─── Compare audit specific types ────────────────────────────────────────────

export interface CompareResult {
  marca_a: string
  marca_b: string
  categoria: string
  ventajas_marca_a: string[]
  debilidades_marca_a: string[]
  ventajas_marca_b: string[]
  debilidades_marca_b: string[]
  veredicto_ia: string
  marca_recomendada: string
  razon_recomendacion: string
  score_marca_a: number
  score_marca_b: number
  motor?: 'chatgpt' | 'gemini' | 'ambos'
  por_motor?: { chatgpt?: CompareResult; gemini?: CompareResult }
}

// ─── Cita (citability) audit specific types ──────────────────────────────────

export interface CitaTerritorio {
  query: string
  dificultad: number
  nivel: string
  marcas_mencionadas: string[]
  razon: string
  recomendacion: string
}

export interface CitaResult {
  marca: string
  categoria: string
  resumen: string
  total_bajas: number
  total_medias: number
  total_altas: number
  territorios: CitaTerritorio[]
  motor?: 'chatgpt' | 'gemini' | 'ambos'
  por_motor?: { chatgpt?: CitaResult; gemini?: CitaResult }
}

// ─── Shared UI types ─────────────────────────────────────────────────────────

export type AuditMode = 'brand' | 'url' | 'compare' | 'cita'

export interface UserIdentity {
  userName: string
  userEmail: string
}

export interface QuotaInfo {
  used: number
  limit: number
}

// ─── Normalized chart entry (used by ShareOfVoiceChart) ──────────────────────

export interface ChartEntry {
  marca: string
  score: number
  isUser: boolean
  isWinner: boolean
  ghost: boolean
}
