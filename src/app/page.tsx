'use client'

import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import ExecutiveReportTemplate from '@/components/ExecutiveReportTemplate'

import { Search, Terminal, TriangleAlert, Code2, Megaphone, Globe, AlertTriangle, TrendingUp, ShieldCheck, Download, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ReferenceLine, Cell, ResponsiveContainer, Tooltip, LabelList } from 'recharts'

interface AnalisisMarca {
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
  plan_accion?: {
    vehiculos: Array<{
      concepto: string
      acciones: Array<{
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
      }>
    }>
    roi_estimado: string
  }
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
}

interface ResultadoBusqueda {
  prompt_original: string
  texto_original_ia: string
  resultados: AnalisisMarca[]
  timestamp?: string
}

interface OportunidadAuditada {
  arquetipo: string
  necesidad_principal: string
  segmento: string
  tendencia_base: string
  pregunta_generada: string
  resultado_auditoria: AnalisisMarca
  error?: string | null
}

interface DiscoveryResponse {
  marca_analizada: string
  topico: string
  oportunidades_auditadas: OportunidadAuditada[]
  amenaza_principal: string | null
  total_auditados: number
  total_errores: number
}

/** Extrae 3 intenciones de búsqueda cortas de una query larga */
function queryToBullets(query: string): string[] {
  // Split by common separators (commas, 'y', 'que', semicolons)
  const cleaned = query.replace(/^¿/, '').replace(/\?$/, '').trim()
  const parts = cleaned
    .split(/,|;|\sy\s|\sque\s|\sademas\s|\stambien\s/i)
    .map(s => s.trim())
    .filter(s => s.length > 4)
  if (parts.length >= 3) {
    return parts.slice(0, 3).map(p => p.charAt(0).toUpperCase() + p.slice(1))
  }
  // Fallback: split by word count into 3 chunks
  const words = cleaned.split(' ')
  const chunkSize = Math.ceil(words.length / 3)
  return [
    words.slice(0, chunkSize).join(' '),
    words.slice(chunkSize, chunkSize * 2).join(' '),
    words.slice(chunkSize * 2).join(' '),
  ].filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1))
}

export default function Dashboard() {
  const [brand, setBrand] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState('')
  const [result, setResult] = useState<ResultadoBusqueda | null>(null)
  const [error, setError] = useState('')
  const [discoveryResult, setDiscoveryResult] = useState<DiscoveryResponse | null>(null)
  const [discoveryLoading, setDiscoveryLoading] = useState(false)
  const [trendsResult, setTrendsResult] = useState<Array<{ query: string; value: number; fuente: string }> | null>(null)
  const [trendsLoading, setTrendsLoading] = useState(false)

  // ── Modo Comparación ───────────────────────────────────────────────────────
  const [compareA, setCompareA] = useState('')
  const [compareB, setCompareB] = useState('')
  const [compareCategoria, setCompareCategoria] = useState('')
  const [compareLoading, setCompareLoading] = useState(false)
  const [compareResult, setCompareResult] = useState<{
    marca_a: string; marca_b: string; categoria: string
    ventajas_marca_a: string[]; debilidades_marca_a: string[]
    ventajas_marca_b: string[]; debilidades_marca_b: string[]
    veredicto_ia: string; marca_recomendada: string
    razon_recomendacion: string
    score_marca_a: number; score_marca_b: number
  } | null>(null)

  // ── Modo Citabilidad ──────────────────────────────────────────────────────
  const [citaMarca, setCitaMarca] = useState('')
  const [citaCategoria, setCitaCategoria] = useState('')
  const [citaLoading, setCitaLoading] = useState(false)
  const [citaResult, setCitaResult] = useState<{
    marca: string; categoria: string; resumen: string
    total_bajas: number; total_medias: number; total_altas: number
    territorios: Array<{
      query: string; dificultad: number; nivel: string
      marcas_mencionadas: string[]; razon: string; recomendacion: string
    }>
  } | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeModal, setActiveModal] = useState<any | null>(null)
  const [expandedActionKey, setExpandedActionKey] = useState<string | null>(null)
  const [showInlineCode, setShowInlineCode] = useState(false)
  const [inlineTab, setInlineTab] = useState<'marketing' | 'ti'>('marketing')
  const [briefData, setBriefData] = useState<{
    blog_title_suggestion: string
    instagram_reel_hook: string
    ecommerce_product_description_snippet: string
    required_trust_signals: string[]
    strategic_faqs: { question: string; suggested_answer_angle: string }[]
  } | null>(null)
  const [briefLoading, setBriefLoading] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showRawOutput, setShowRawOutput] = useState(false)
  const [showUrlSnippet, setShowUrlSnippet] = useState<Record<number, boolean>>({})
  const [showPerfilesDetalle, setShowPerfilesDetalle] = useState(false)
  const [showModalCode, setShowModalCode] = useState(false)

  // ── PDF Export ────────────────────────────────────────────────────────────
  const reportRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `AI Visibility - Informe`,
    pageStyle: `
      @page { size: A4 portrait; margin: 0; }
      @media print {
        html, body { background: white !important; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `,
  })

  // ── Modo URL ──────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<'brand' | 'url' | 'compare' | 'cita'>('brand')
  const [urlInput, setUrlInput] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const [urlResult, setUrlResult] = useState<{
    marca: string
    categoria: string
    mercado: string
    diferenciadores: string[]
    resumen_pagina: string
    arquetipos: Array<{ arquetipo: string; driver: string; dealbreaker: string }>
    resultados: Array<{
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
    }>
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
    plan_accion?: {
      vehiculos: Array<{
        concepto: string
        acciones: Array<{
          tactica_tecnica: string
          concepto_objetivo: string
          impacto: number
          confianza: number
          esfuerzo: number
          ice_score: number
          segmento_impactado: string
          tiempo_indexacion_ia: string
          pasos_ejecucion: string[]
          area_responsable: string
          riesgo_inaccion?: string
        }>
      }>
      roi_estimado: string
    }
  } | null>(null)

  const downloadJSON = () => {
    if (!result) return
    const d = result.resultados[0]
    const payload = {
      auditoria_meta: {
        marca: brand,
        consulta: query,
        fecha: new Date().toISOString(),
        timestamp: result.timestamp,
      },
      veredicto_ejecutivo: {
        clasificacion: d.prioridad_ejecutiva?.clasificacion,
        foco: d.prioridad_ejecutiva?.foco_principal,
        impacto_esperado: d.prioridad_ejecutiva?.impacto_esperado,
        roi_score: d.prioridad_ejecutiva?.roi_score,
      },
      share_of_voice: {
        posicion_mi_marca: d.posicion_mi_marca,
        estado: d.estado_invisibilidad,
        score: d.invisibilidad_score,
        marcas_mencionadas: d.marcas_mencionadas,
        ganador: d.marca_ganadora,
      },
      diferenciadores: {
        percepciones_genericas: d.percepciones_genericas,
        conceptos_faltantes: d.conceptos_faltantes,
        competidor_principal: d.competidor_principal,
      },
      plan_accion: d.plan_accion ?? null,
      territorios_desatendidos: d.territorios_desatendidos ?? [],
      radar_intencion: discoveryResult ?? null,
      cierre_estrategico: {
        timeline: [
          { dia: '0-3', tarea: 'Implementación Técnica', responsable: 'TI + Marketing' },
          { dia: '4-10', tarea: 'Re-crawleo de Motores', responsable: 'GPTBot / Perplexity' },
          { dia: '15', tarea: 'Auditoría de Validación de Impacto', fecha: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0] },
        ],
        quick_wins: [
          { area: 'TI / Desarrollo', acciones: 2, detalle: 'Schema / Tablas HTML' },
          { area: 'Marketing', acciones: 1, detalle: 'Contenido Landing' },
          { area: 'PR / Agencia', acciones: 1, detalle: 'Menciones Externas' },
        ],
      },
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const fecha = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `auditoria-${brand.toLowerCase().replace(/\s+/g, '-')}-${fecha}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCitability = async () => {
    if (!citaMarca.trim() || !citaCategoria.trim()) {
      setError('Completa marca y categoría')
      return
    }
    setError('')
    setCitaLoading(true)
    setCitaResult(null)
    try {
      const res = await fetch('/api/audit/citability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marca: citaMarca.trim(),
          categoria: citaCategoria.trim(),
          mercado: 'Chile',
          num_territorios: 12,
        }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setCitaResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setCitaLoading(false)
    }
  }

  const handleCompare = async () => {
    if (!compareA.trim() || !compareB.trim() || !compareCategoria.trim()) {
      setError('Completa los tres campos')
      return
    }
    setError('')
    setCompareLoading(true)
    setCompareResult(null)
    try {
      const res = await fetch('/api/audit/comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marca_a: compareA.trim(),
          marca_b: compareB.trim(),
          categoria: compareCategoria.trim(),
          mercado: 'Chile',
        }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.json()
      setCompareResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setCompareLoading(false)
    }
  }

  const handleAudit = async () => {
    if (!brand.trim() || !query.trim()) {
      setError('Completa ambos campos')
      return
    }
    setError('')
    setLoading(true)
    setLoadingPhase('Inicializando análisis...')
    setResult(null)
    setDiscoveryResult(null)
    setTrendsResult(null)
    try {
      const phases = [
        { text: 'Buscando con Google Trends...', progress: 20 },
        { text: 'Consultando con GPT-4o...', progress: 40 },
        { text: 'Analizando competidores...', progress: 60 },
        { text: 'Generando recomendaciones...', progress: 80 },
        { text: 'Finalizando análisis...', progress: 100 },
      ]
      for (let i = 0; i < phases.length; i++) {
        setLoadingPhase(`${phases[i].text} ${phases[i].progress}%`)
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 700))
      }
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), brand: brand.trim() }),
      })
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Error ${response.status}: ${text}`)
      }
      const data: ResultadoBusqueda = await response.json()
      setResult(data)
      // Fire /api/discovery in background — non-blocking
      setDiscoveryResult(null)
      setTrendsResult(null)
      setDiscoveryLoading(true)
      fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand: brand.trim(), topico: query.trim() }),
      })
        .then((r) => {
          if (!r.ok) throw new Error(`Discovery ${r.status}`)
          return r.json()
        })
        .then((d: DiscoveryResponse) => {
          if (!d.oportunidades_auditadas) throw new Error('Invalid discovery response')
          setDiscoveryResult(d)
          // Fire trends fetch using the synthetic queries — non-blocking
          const syntheticQueries = d.oportunidades_auditadas
            .map((op) => op.pregunta_generada)
            .filter(Boolean)
            .slice(0, 6)
          if (syntheticQueries.length > 0) {
            setTrendsLoading(true)
            fetch('/api/trends/related', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ queries: syntheticQueries, geo: 'CL', max_per_query: 5 }),
            })
              .then((r) => r.ok ? r.json() : Promise.reject(`Trends ${r.status}`))
              .then((t) => setTrendsResult(t.resultados ?? []))
              .catch((e) => console.warn('Trends error:', e))
              .finally(() => setTrendsLoading(false))
          }
        })
        .catch((e) => console.error('Discovery error:', e))
        .finally(() => setDiscoveryLoading(false))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
      setLoadingPhase('')
    }
  }

  const handleAuditFromUrl = async () => {
    const url = urlInput.trim()
    if (!url) { setError('Ingresa una URL'); return }
    if (!url.startsWith('http://') && !url.startsWith('https://')) { setError('La URL debe comenzar con http:// o https://'); return }
    setError('')
    setUrlResult(null)
    setUrlLoading(true)
    setLoadingPhase('Analizando página...')
    try {
      const phases = [
        'Analizando página... 20%',
        'Generando arquetipos de clientes... 45%',
        'Consultando motores de IA... 70%',
        'Procesando resultados... 90%',
      ]
      for (const p of phases) {
        setLoadingPhase(p)
        await new Promise((r) => setTimeout(r, 400 + Math.random() * 600))
      }
      const res = await fetch('/api/audit/from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, pais: 'Chile' }),
      })
      if (!res.ok) { const t = await res.text(); throw new Error(`Error ${res.status}: ${t}`) }
      const data = await res.json()
      setUrlResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setUrlLoading(false)
      setLoadingPhase('')
    }
  }

  const getScoreTextColor = (estado: string) => {
    if (estado === 'visible') return 'text-emerald-400'
    if (estado === 'en_riesgo') return 'text-orange-400'
    return 'text-rose-400'
  }

  const getScoreBarColor = (estado: string) => {
    if (estado === 'visible') return 'bg-emerald-700'
    if (estado === 'en_riesgo') return 'bg-orange-700'
    return 'bg-rose-900'
  }




  const d = result?.resultados[0]

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Schedule Validation Modal */}
      {showScheduleModal && (
        <div id="modal-schedule-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setShowScheduleModal(false)}>
          <div id="modal-schedule" className="bg-slate-900 border border-slate-700/60 rounded-xl max-w-md w-full relative shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-800/50 border-b border-slate-700/40 px-6 py-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-sky-400 font-medium mb-1">Próxima revisión</p>
                <h3 className="text-base font-bold text-white leading-snug">Agendar seguimiento</h3>
              </div>
              <button id="btn-schedule-close" onClick={() => setShowScheduleModal(false)} className="text-slate-500 hover:text-slate-300 text-lg leading-none">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-sky-950/20 rounded-sm border border-sky-500/15">
                <TrendingUp className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <p className="text-slate-200 text-sm leading-relaxed">
                  Se generará una re-auditoría automática el{' '}
                  <span className="text-sky-400 font-bold">
                    {new Date(Date.now() + 15 * 86400000).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>{' '}
                  para medir el avance de las acciones implementadas.
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Quién recibe el reporte</p>
                <div className="space-y-2">
                  {[
                    { area: 'TI / Desarrollo', color: 'text-sky-400', dot: 'bg-sky-400', desc: 'cambios técnicos (schema, HTML)' },
                    { area: 'Marketing / Contenido', color: 'text-violet-400', dot: 'bg-violet-400', desc: 'contenido y landing pages' },
                    { area: 'PR / Agencia', color: 'text-teal-400', dot: 'bg-teal-400', desc: 'menciones en medios' },
                  ].map((r) => (
                    <div key={r.area} className="flex items-center gap-2 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${r.dot} shrink-0`} />
                      <span className={`font-semibold ${r.color}`}>{r.area}</span>
                      <span className="text-slate-500">— {r.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                id="btn-schedule-confirm"
                onClick={() => setShowScheduleModal(false)}
                className="w-full py-2.5 rounded-sm bg-sky-600/80 hover:bg-sky-500 text-white text-sm font-semibold tracking-wide transition-colors"
              >
                Agendar revisión
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal && (
        <div id="modal-detalle-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setActiveModal(null)}>
          <div id="modal-detalle" className="bg-slate-900 border border-slate-700/80 rounded-xl max-w-3xl w-full relative shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-slate-800/60 border-b border-slate-700/60 px-6 py-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Iniciativa de Negocio</p>
                <h3 className="text-lg font-bold text-white leading-snug mb-1">{activeModal.tactica_tecnica}</h3>
                <p className="text-slate-500 text-sm mt-1 truncate" title={activeModal.concepto_objetivo}>
                  Consulta objetivo: <span className="text-slate-400">{activeModal.concepto_objetivo}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full border ${
                    activeModal.ice_score >= 7
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : activeModal.ice_score >= 5
                      ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
                      : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                  }`}>
                    {activeModal.ice_score >= 7 ? '↑ Impacto Alto' : activeModal.ice_score >= 5 ? '→ Impacto Medio' : '↓ Complementaria'}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full border ${
                    activeModal.area_responsable === 'TI / Desarrollo'
                      ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                      : activeModal.area_responsable === 'Marketing / Contenido'
                      ? 'bg-violet-500/10 text-violet-300 border-violet-500/20'
                      : 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                  }`}>
                    {activeModal.area_responsable === 'TI / Desarrollo' ? '⚙️' : activeModal.area_responsable === 'Marketing / Contenido' ? '✏️' : '📣'}
                    {' '}{activeModal.area_responsable}
                  </span>
                  {activeModal.tiempo_indexacion_ia && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full border bg-slate-800 text-slate-300 border-slate-600">
                      ⏱️ {activeModal.tiempo_indexacion_ia?.split(' (')[0]}
                    </span>
                  )}
                </div>
              </div>
              <button id="btn-detalle-close" onClick={() => setActiveModal(null)} className="shrink-0 mt-0.5 text-slate-500 hover:text-white transition-colors text-lg leading-none">✕</button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Oportunidad de mercado */}
              {activeModal.segmento_impactado && (
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2">🎯 Oportunidad de Mercado</p>
                  <p className="text-slate-200 text-base font-medium leading-snug">{activeModal.segmento_impactado}</p>
                </div>
              )}

              {/* Instrucción de trabajo */}
              <div>
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2">📋 Instrucción de Trabajo</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {(() => {
                    const area: string = activeModal.area_responsable || ''
                    const tactica: string = activeModal.tactica_tecnica || ''
                    const concepto: string = activeModal.concepto_objetivo || ''
                    if (area === 'TI / Desarrollo' || tactica.toLowerCase().includes('schema') || tactica.toLowerCase().includes('json-ld') || tactica.toLowerCase().includes('código')) {
                      return `El equipo de TI debe copiar el bloque de código que se encuentra al final de este panel e insertarlo dentro de la etiqueta <head> de la página que corresponda a "${concepto}", luego solicitar la re-indexación en Google Search Console.`
                    } else if (area === 'Marketing / Contenido' || tactica.toLowerCase().includes('artículo') || tactica.toLowerCase().includes('contenido') || tactica.toLowerCase().includes('landing') || tactica.toLowerCase().includes('evergreen')) {
                      return `El equipo de Marketing debe redactar un artículo o página de destino que responda directamente a la consulta "${concepto}". El contenido debe citar fuentes verificables, incluir datos concretos y mencionar explícitamente los diferenciadores de la marca frente a la competencia.`
                    } else if (tactica.toLowerCase().includes('digital pr') || tactica.toLowerCase().includes('prensa') || tactica.toLowerCase().includes('medios')) {
                      return `El equipo de Comunicaciones debe elaborar una nota de prensa utilizando la plantilla al final de este panel, dirigida a medios digitales de referencia en el segmento "${concepto}". La publicación en medios externos es la señal que la IA necesita para validar la autoridad de la marca.`
                    } else {
                      return `El equipo de ${area || 'responsable'} debe implementar "${tactica}" enfocado en capturar la consulta "${concepto}". Revisar el código de referencia al final de este panel como punto de partida.`
                    }
                  })()}
                </p>
              </div>

              {/* Retorno proyectado (ROI) */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/25">
                <TrendingUp className="shrink-0 mt-0.5 text-emerald-400" size={16} />
                <div>
                  <p className="text-sm uppercase tracking-widest text-emerald-400 font-bold mb-1.5">Retorno Proyectado (ROI)</p>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {activeModal.segmento_impactado
                      ? `Al implementar esto, la marca entra al top 3 de recomendaciones para ${activeModal.segmento_impactado.split(/[,.]/).at(0)?.trim()}, capturando tráfico calificado en etapa de decisión de compra.`
                      : 'Al implementar esto, la marca mejora su posición en los motores de IA, accediendo a demanda de alta intención de compra que hoy captura la competencia.'
                    }
                  </p>
                </div>
              </div>

              {/* Costo de la inacción */}
              {activeModal.riesgo_inaccion && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <TriangleAlert className="shrink-0 mt-0.5 text-rose-400" size={15} />
                  <div>
                    <p className="text-sm uppercase tracking-widest text-rose-400 font-bold mb-1.5">Si no actúas</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{activeModal.riesgo_inaccion}</p>
                  </div>
                </div>
              )}

              {/* Código copy-paste listo */}
              {(() => {
                const tactica: string = activeModal.tactica_tecnica || ''
                const concepto: string = activeModal.concepto_objetivo || 'tu concepto aquí'
                const marca: string = activeModal.segmento_impactado?.match(/(?:para|de)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñA-Z]+)/)?.[1] || 'TuMarca'

                let snippet = ''
                let lang = 'html'

                if (tactica.toLowerCase().includes('schema faq') || tactica.toLowerCase().includes('json-ld')) {
                  lang = 'json'
                  snippet = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es ${concepto}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${marca} ofrece ${concepto}. A diferencia de otras opciones del mercado, nos diferenciamos por [diferenciador clave]. Conoce más en [URL de la página]."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo funciona ${concepto} en ${marca}?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Con ${marca}, ${concepto} es simple: [paso 1], [paso 2] y [paso 3]. Sin costo oculto ni burocracia."
      }
    }
  ]
}
</script>`
                } else if (tactica.toLowerCase().includes('tablas') || tactica.toLowerCase().includes('html')) {
                  lang = 'html'
                  snippet = `<!-- Tabla comparativa HTML para ${concepto} -->
<table>
  <thead>
    <tr>
      <th>Característica</th>
      <th>${marca}</th>
      <th>Competidor A</th>
      <th>Competidor B</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${concepto}</td>
      <td>✅ Sí</td>
      <td>⚠️ Parcial</td>
      <td>❌ No</td>
    </tr>
    <tr>
      <td>Tiempo de respuesta</td>
      <td>[Tu dato]</td>
      <td>[Dato competidor]</td>
      <td>[Dato competidor]</td>
    </tr>
  </tbody>
</table>`
                } else if (tactica.toLowerCase().includes('landing') || tactica.toLowerCase().includes('semántica') || tactica.toLowerCase().includes('semantica') || tactica.toLowerCase().includes('evergreen')) {
                  lang = 'html'
                  snippet = `<!-- Bloque de contenido semántico para landing page -->
<section>
  <h2>${concepto}: Guía completa</h2>
  <p>
    ${concepto} es clave para [perfil del cliente]. ${marca} resuelve esto 
    mediante [diferenciador], lo que lo convierte en la mejor opción para 
    quienes buscan [beneficio principal].
  </p>
  <h3>¿Por qué ${marca} para ${concepto}?</h3>
  <ul>
    <li><strong>Ventaja 1:</strong> [descripción concreta con datos]</li>
    <li><strong>Ventaja 2:</strong> [descripción concreta con datos]</li>
    <li><strong>Ventaja 3:</strong> [descripción concreta con datos]</li>
  </ul>
  <p>
    <a href="/[tu-url]">Conoce más sobre ${concepto} en ${marca} →</a>
  </p>
</section>`
                } else if (tactica.toLowerCase().includes('digital pr') || tactica.toLowerCase().includes('medios')) {
                  lang = 'text'
                  snippet = `NOTA DE PRENSA — PLANTILLA COPY-PASTE

TITULAR (máx 80 chars):
${marca} presenta [propuesta de valor] en el mercado de ${concepto}

PRIMER PÁRRAFO (quién, qué, cuándo, dónde, por qué):
${marca} anunció hoy [acción concreta], consolidando su posición como 
referente en ${concepto} en [mercado]. La iniciativa responde a [tendencia/dato].

CITA DEL VOCERO:
"[Nombre, Cargo] de ${marca} comenta: '[cita sobre ${concepto} en 1-2 oraciones]'"

DATOS CLAVE (lo que los periodistas copian):
- [Dato 1 con número sobre ${concepto}]
- [Dato 2: resultado medible]
- [Dato 3: diferenciador verificable]

CONTACTO DE PRENSA:
Nombre: [Nombre]
Email: [email]
Tel: [teléfono]`
                } else if (tactica.toLowerCase().includes('knowledge graph') || tactica.toLowerCase().includes('entidades')) {
                  lang = 'json'
                  snippet = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${marca}",
  "description": "Especialistas en ${concepto}",
  "url": "https://[tudominio].cl",
  "sameAs": [
    "https://www.wikidata.org/wiki/[ID-wikidata]",
    "https://www.linkedin.com/company/[slug]",
    "https://www.instagram.com/[usuario]"
  ],
  "knowsAbout": [
    "${concepto}",
    "[tema relacionado 2]",
    "[tema relacionado 3]"
  ],
  "areaServed": {
    "@type": "Country",
    "name": "Chile"
  }
}
</script>`
                }

                if (!snippet) return null

                return (
                  <div className="border border-slate-700/40 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setShowModalCode(!showModalCode)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800/40 hover:bg-slate-800/70 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Terminal className="w-3.5 h-3.5 text-sky-500" />
                        Ver ejemplo de código listo para copiar
                      </span>
                      <span className={`text-slate-500 text-xs transition-transform ${showModalCode ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {showModalCode && (
                      <div className="relative">
                        <button
                          onClick={() => navigator.clipboard.writeText(snippet)}
                          className="absolute top-2 right-2 z-10 flex items-center gap-1 text-[10px] text-slate-500 hover:text-sky-400 bg-slate-900 border border-slate-700 px-2 py-1 rounded transition-colors"
                        >
                          <Download className="w-3 h-3" /> Copiar
                        </button>
                        <pre className="p-4 bg-slate-950 text-[11px] font-mono text-slate-400 overflow-x-auto leading-relaxed max-h-72 whitespace-pre">
                          <code>{snippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* Footer */}
            <div className="bg-slate-800/30 border-t border-slate-700/60 px-6 py-3 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-1.5 rounded border border-slate-700 hover:border-slate-500">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}
          <motion.div
            id="zone-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 border-b border-slate-800 pb-6 flex items-start justify-between"
          >
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative w-10 h-10 shrink-0">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 opacity-80" />
                <div className="absolute inset-[2px] rounded-[6px] bg-slate-950 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#logo-grad)" opacity="0.9"/>
                    <path d="M2 17l10 5 10-5" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M2 12l10 5 10-5" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6"/>
                    <defs>
                      <linearGradient id="logo-grad" x1="2" y1="2" x2="22" y2="22">
                        <stop stopColor="#38bdf8"/>
                        <stop offset="1" stopColor="#818cf8"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  AI Visibility<span className="text-sky-400">.</span>
                </h1>
                <p className="text-slate-500 text-xs font-light tracking-wide">Auditoría de posicionamiento en motores de búsqueda con IA</p>
                {result && (
                  <p className="text-[10px] font-mono text-slate-700 mt-1.5">
                    {new Date().toLocaleDateString('es-CL')} · {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
            {result && (
              <button id="btn-pdf" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-sm text-slate-400 text-sm transition flex items-center gap-2">
                ⬇ PDF
              </button>
            )}
          </motion.div>

          {/* BUSCADOR */}
          <motion.div
            id="zone-buscador"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-sm p-6 mb-8"
          >
            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-slate-950 border border-slate-800 rounded-sm p-1 w-fit">
              <button
                onClick={() => { setMode('brand'); setError(''); setUrlResult(null) }}
                className={`px-4 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition ${
                  mode === 'brand' ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Por marca
              </button>
              <button
                onClick={() => { setMode('url'); setError(''); setResult(null) }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition ${
                  mode === 'url' ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Globe className="w-3 h-3" />
                Por URL
              </button>
              <button
                onClick={() => { setMode('compare'); setError(''); setResult(null); setUrlResult(null) }}
                className={`hidden flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition ${
                  mode === 'compare' ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Search className="w-3 h-3" />
                Comparar
              </button>
              <button
                onClick={() => { setMode('cita'); setError(''); setResult(null); setUrlResult(null) }}
                className={`hidden flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition ${
                  mode === 'cita' ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className="text-xs">✦</span>
                Oportunidades
              </button>
            </div>

            {mode === 'brand' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Marca</label>
                    <input
                      id="input-brand"
                      type="text"
                      placeholder="Banco Santander"
                      value={brand}
                      maxLength={120}
                      onChange={(e) => setBrand(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Búsqueda</label>
                    <input
                      id="input-query"
                      type="text"
                      placeholder="mejor banco en chile"
                      value={query}
                      maxLength={200}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                    />
                  </div>
                </div>
                <button
                  id="btn-auditar"
                  onClick={handleAudit}
                  disabled={loading}
                  className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-50 font-medium rounded-sm transition flex items-center justify-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                  {loading ? loadingPhase : 'Auditar'}
                </button>
              </>
            ) : mode === 'url' ? (
              <>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">URL del sitio web</label>
                  <input
                    id="input-url"
                    type="url"
                    placeholder="https://www.tuempresa.cl/"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAuditFromUrl()}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                  />
                  <p className="text-slate-600 text-xs mt-1.5">Analizamos tu página, generamos 3 perfiles de clientes reales y auditamos si la IA te menciona cuando ellos buscan.</p>
                </div>
                <button
                  id="btn-auditar-url"
                  onClick={handleAuditFromUrl}
                  disabled={urlLoading}
                  className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-50 font-medium rounded-sm transition flex items-center justify-center gap-2 text-sm"
                >
                  <Globe className="w-4 h-4" />
                  {urlLoading ? loadingPhase : 'Analizar URL'}
                </button>
              </>
            ) : mode === 'compare' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Marca A (tuya)</label>
                    <input
                      type="text"
                      placeholder="Falabella"
                      value={compareA}
                      onChange={(e) => setCompareA(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Marca B (rival)</label>
                    <input
                      type="text"
                      placeholder="Ripley"
                      value={compareB}
                      onChange={(e) => setCompareB(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Categoría</label>
                    <input
                      type="text"
                      placeholder="retail de moda"
                      value={compareCategoria}
                      onChange={(e) => setCompareCategoria(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCompare}
                  disabled={compareLoading}
                  className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-50 font-medium rounded-sm transition flex items-center justify-center gap-2 text-sm"
                >
                  <Search className="w-4 h-4" />
                  {compareLoading ? 'Comparando con IA…' : 'Comparar marcas'}
                </button>
              </>
            ) : mode === 'cita' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Tu marca</label>
                    <input
                      type="text"
                      placeholder="Amalia Jeans"
                      value={citaMarca}
                      onChange={(e) => setCitaMarca(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCitability()}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Categoría de producto</label>
                    <input
                      type="text"
                      placeholder="jeans de mujer Chile"
                      value={citaCategoria}
                      onChange={(e) => setCitaCategoria(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCitability()}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                    />
                  </div>
                </div>
                <p className="text-slate-600 text-xs mb-4">Generamos 12 queries de nicho, auditamos qué marcas menciona la IA y priorizamos donde puedes entrar más fácilmente.</p>
                <button
                  onClick={handleCitability}
                  disabled={citaLoading}
                  className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-50 font-medium rounded-sm transition flex items-center justify-center gap-2 text-sm"
                >
                  <span className="text-sm">✦</span>
                  {citaLoading ? 'Analizando territorios…' : 'Encontrar oportunidades'}
                </button>
              </>
            ) : null}

            {(loading || urlLoading) && (
              <motion.div id="zone-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-slate-800 border border-slate-700 rounded-sm text-slate-400 text-xs flex items-center gap-2">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                {loadingPhase}
              </motion.div>
            )}
            {error && (
              <div id="zone-error" className="mt-4 p-3 bg-red-950/30 border border-red-900/50 rounded-sm text-red-700/80 text-sm">{error}</div>
            )}
          </motion.div>

          {/* RESULTADOS CITABILIDAD */}
          {citaResult && (
            <motion.div
              id="zone-cita-resultados"
              className="space-y-5 mb-8"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {/* Header resumen */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } }}
                className="bg-slate-900 border border-slate-800 rounded-sm px-6 py-5"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Directorio de Citabilidad</p>
                    <h2 className="text-slate-100 font-semibold text-lg">{citaResult.marca} · {citaResult.categoria}</h2>
                    <p className="text-slate-400 text-sm mt-1">{citaResult.resumen}</p>
                  </div>
                  <div className="flex gap-4 shrink-0">
                    {[
                      { label: 'Fácil', count: citaResult.total_bajas, color: 'emerald' },
                      { label: 'Media', count: citaResult.total_medias, color: 'amber' },
                      { label: 'Alta', count: citaResult.total_altas, color: 'rose' },
                    ].map(({ label, count, color }) => (
                      <div key={label} className="flex flex-col items-center">
                        <span className={`text-2xl font-light tabular-nums text-${color}-400`}>{count}</span>
                        <span className={`text-[10px] uppercase tracking-wide text-${color}-600`}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Dificultad baja — publica esta semana</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Dificultad media — vale el esfuerzo</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />Dominado — requiere diferenciación fuerte</span>
                </div>
              </motion.div>

              {/* Territorios */}
              {citaResult.territorios.map((t, i) => {
                const colorMap: Record<string, { bar: string; badge: string; border: string; text: string }> = {
                  baja: { bar: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', border: 'border-emerald-800/30', text: 'text-emerald-300' },
                  media: { bar: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', border: 'border-amber-800/20', text: 'text-amber-300' },
                  alta: { bar: 'bg-rose-500', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20', border: 'border-rose-800/20', text: 'text-rose-300' },
                }
                const c = colorMap[t.nivel] ?? colorMap.media
                return (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
                    className={`bg-slate-900 border ${c.border} rounded-sm overflow-hidden`}
                  >
                    <div className="flex items-stretch">
                      {/* Difficulty bar */}
                      <div className="w-1 shrink-0 bg-slate-800 relative">
                        <div
                          className={`absolute bottom-0 left-0 right-0 ${c.bar} transition-all duration-700`}
                          style={{ height: `${100 - t.dificultad}%` }}
                        />
                      </div>
                      <div className="flex-1 px-5 py-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="text-slate-200 text-sm font-medium leading-snug flex-1">{t.query}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badge}`}>
                              {t.nivel === 'baja' ? 'OPORTUNIDAD' : t.nivel === 'media' ? 'COMPETIDO' : 'DOMINADO'}
                            </span>
                            <span className="text-xs tabular-nums text-slate-500">{t.dificultad}</span>
                          </div>
                        </div>
                        <p className="text-slate-500 text-xs mb-2">{t.razon}</p>
                        {t.marcas_mencionadas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {t.marcas_mencionadas.slice(0, 5).map((m, j) => (
                              <span key={j} className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">{m}</span>
                            ))}
                          </div>
                        )}
                        {t.nivel !== 'alta' && (
                          <div className="mt-2 pt-2 border-t border-slate-800">
                            <p className="text-xs text-slate-300">
                              <span className="text-emerald-500 font-semibold mr-1">→</span>
                              {t.recomendacion}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}

              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="border-t border-slate-800 pt-3"
              >
                <p className="text-slate-700 text-[10px] font-mono">
                  Gap analysis generado por GPT-4o-mini · {citaResult.territorios.length} territorios auditados · {new Date().toLocaleString('es-CL')}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* RESULTADOS COMPARACIÓN */}
          {compareResult && (
            <motion.div
              id="zone-compare-resultados"
              className="space-y-6 mb-8"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {/* Veredicto */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } }}
                className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden"
              >
                <div className="flex items-stretch">
                  <div className={`w-1.5 shrink-0 ${
                    compareResult.marca_recomendada.toLowerCase().includes(compareResult.marca_a.toLowerCase())
                      ? 'bg-sky-500' : 'bg-rose-500'
                  }`} />
                  <div className="flex-1 px-6 py-5">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Scores */}
                      <div className="flex gap-6 shrink-0">
                        {[
                          { marca: compareResult.marca_a, score: compareResult.score_marca_a },
                          { marca: compareResult.marca_b, score: compareResult.score_marca_b },
                        ].map(({ marca, score }) => {
                          const isWinner = compareResult.marca_recomendada.toLowerCase().includes(marca.toLowerCase())
                          return (
                            <div key={marca} className="flex flex-col items-center">
                              <span className={`text-3xl font-light tabular-nums ${isWinner ? 'text-sky-400' : 'text-slate-500'}`}>{score}</span>
                              <div className="w-20 h-1.5 bg-slate-800/60 rounded-full overflow-hidden mt-1.5">
                                <div className={`h-full rounded-full transition-all duration-700 ${isWinner ? 'bg-sky-500' : 'bg-slate-600'}`} style={{ width: `${score}%` }} />
                              </div>
                              <p className={`text-xs mt-1 font-semibold ${isWinner ? 'text-sky-400' : 'text-slate-500'}`}>{marca}</p>
                            </div>
                          )
                        })}
                      </div>
                      {/* Veredicto texto */}
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Veredicto de la IA</p>
                        <p className="text-slate-200 text-sm leading-relaxed">{compareResult.veredicto_ia}</p>
                        <p className="text-slate-400 text-xs mt-2">
                          <span className="font-semibold text-sky-400">{compareResult.marca_recomendada}</span>
                          {' — '}{compareResult.razon_recomendacion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tabla comparativa */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[
                  {
                    marca: compareResult.marca_a,
                    ventajas: compareResult.ventajas_marca_a,
                    debilidades: compareResult.debilidades_marca_a,
                    isWinner: compareResult.marca_recomendada.toLowerCase().includes(compareResult.marca_a.toLowerCase()),
                  },
                  {
                    marca: compareResult.marca_b,
                    ventajas: compareResult.ventajas_marca_b,
                    debilidades: compareResult.debilidades_marca_b,
                    isWinner: compareResult.marca_recomendada.toLowerCase().includes(compareResult.marca_b.toLowerCase()),
                  },
                ].map(({ marca, ventajas, debilidades, isWinner }) => (
                  <div key={marca} className={`border rounded-sm overflow-hidden ${isWinner ? 'border-sky-800/40 bg-sky-950/10' : 'border-slate-800 bg-slate-900'}`}>
                    <div className={`px-5 py-3 border-b flex items-center justify-between ${isWinner ? 'border-sky-800/30' : 'border-slate-800'}`}>
                      <h3 className={`font-semibold text-sm ${isWinner ? 'text-sky-300' : 'text-slate-300'}`}>{marca}</h3>
                      {isWinner && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30">IA prefiere</span>}
                    </div>
                    <div className="px-5 py-4 space-y-3">
                      {ventajas.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-emerald-500/70 mb-1.5">Ventajas</p>
                          <ul className="space-y-1.5">
                            {ventajas.map((v, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                <span className="text-emerald-500 shrink-0 mt-0.5">+</span>{v}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {debilidades.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-rose-500/70 mb-1.5">Debilidades</p>
                          <ul className="space-y-1.5">
                            {debilidades.map((d, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="text-rose-500 shrink-0 mt-0.5">−</span>{d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="border-t border-slate-800 pt-3"
              >
                <p className="text-slate-700 text-[10px] font-mono">
                  Análisis generado por GPT-4o-mini · {compareResult.categoria} · {new Date().toLocaleString('es-CL')}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* RESULTADOS URL */}
          {urlResult && (<>
            <motion.div
              id="zone-url-resultados"
              className="space-y-6 mb-8"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            >

              {/* 1 · VEREDICTO EJECUTIVO URL */}
              {(() => {
                const score = urlResult.visibilidad_pct
                const visible = urlResult.queries_con_mencion
                const total = urlResult.total_queries
                const ganadorCounts: Record<string, number> = {}
                urlResult.resultados.forEach(r => {
                  if (r.marca_ganadora && r.marca_ganadora.toLowerCase() !== urlResult.marca.toLowerCase()) {
                    ganadorCounts[r.marca_ganadora] = (ganadorCounts[r.marca_ganadora] || 0) + 1
                  }
                })
                const topCompetitor = Object.entries(ganadorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'la competencia'
                const isAtacar = score === 0
                const isMantener = visible === total
                const theme = isAtacar
                  ? { bg: 'bg-rose-950/20', border: 'border-rose-500/30', bar: 'bg-rose-500', icon: <AlertTriangle className="w-5 h-5 text-rose-400" /> }
                  : isMantener
                  ? { bg: 'bg-emerald-950/20', border: 'border-emerald-900/30', bar: 'bg-emerald-500', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> }
                  : { bg: 'bg-amber-950/25', border: 'border-amber-900/40', bar: 'bg-amber-500', icon: <TriangleAlert className="w-5 h-5 text-amber-500" /> }
                let titulo = ''
                let subtitulo = ''
                if (visible === 0) {
                  titulo = 'Riesgo Crítico de Visibilidad Digital'
                  subtitulo = `La marca está fuera del set de consideración del 100% de los compradores que utilizan IA para esta categoría. El tráfico orgánico está siendo derivado a la competencia.`
                } else if (visible === total) {
                  titulo = `${urlResult.marca} lidera su categoría en IA`
                  subtitulo = `Apareces para los ${total} perfiles auditados. El competidor más activo es ${topCompetitor}.`
                } else {
                  titulo = `${urlResult.marca} aparece para ${visible} de ${total} perfiles`
                  subtitulo = `${total - visible} perfil${total - visible > 1 ? 'es' : ''} no te encuentran. La IA prefiere a ${topCompetitor} en esas búsquedas.`
                }
                return (
                  <motion.div
                    id="zone-url-veredicto"
                    variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } }}
                    className={`${theme.bg} border ${theme.border} rounded-sm flex items-stretch overflow-hidden`}
                  >
                    <div className={`w-1.5 shrink-0 ${theme.bar}`} />
                    <div className="flex-1 px-6 py-5">
                      <div className="flex flex-col md:flex-row md:items-start gap-5">
                        {/* Score */}
                        <div className="shrink-0 flex flex-col items-center md:items-start">
                          <div className="flex items-baseline gap-1">
                            <span className={`text-4xl font-light tabular-nums ${score >= 100 ? 'text-emerald-400' : score > 0 ? 'text-amber-400' : 'text-rose-400'}`}>{score}</span>
                            <span className="text-slate-500 text-base">%</span>
                          </div>
                          <div className="w-28 bg-slate-800/60 h-1.5 rounded-full overflow-hidden mt-2">
                            <div className={`h-full rounded-full ${theme.bar} transition-all duration-700`} style={{ width: `${score}%` }} />
                          </div>
                          <p className="text-slate-500 text-sm mt-1">{visible}/{total} perfiles</p>
                        </div>
                        {/* Narrative */}
                        <div className="flex-1">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5">{theme.icon}</div>
                            <div>
                              <h2 className="text-base font-semibold text-slate-100 leading-snug">{titulo}</h2>
                              <p className="text-slate-300 text-sm mt-1 leading-relaxed">{subtitulo}</p>
                              <div className="mt-3 flex flex-col gap-0.5 self-start">
                                <span className="text-[11px] uppercase tracking-widest text-slate-500 font-medium">Mercado auditado</span>
                                <span className="text-sm font-medium text-slate-300 bg-slate-800/60 border border-slate-700/50 rounded-full px-3 py-0.5 self-start">{urlResult.categoria} · {urlResult.mercado}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Diferenciadores */}
                        <div className="shrink-0 flex flex-col gap-2 max-w-xs">
                          <div className="border border-slate-700/40 rounded-sm px-4 py-3 bg-slate-900/60">
                            <p className="text-sm font-semibold text-slate-300 mb-1">La Brecha de Mensaje</p>
                            <p className="text-slate-500 text-xs mb-3 leading-relaxed">Su web intenta posicionar estos conceptos, pero la IA no los valida en fuentes externas:</p>
                            <div className="flex flex-wrap gap-1.5">
                              {urlResult.diferenciadores.slice(0, 5).map((dif, i) => (
                                <span key={i} className="text-sm px-2.5 py-1 bg-slate-800/70 border border-slate-700/50 rounded-full text-slate-300 max-w-[200px] truncate" title={dif}>{dif}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })()}

              {/* 2 · AMENAZA — ¿A quién está eligiendo la IA? (Share of Voice primero para generar urgencia) */}
              {urlResult.resultados.some(r => r.marcas_mencionadas.length > 0) && (() => {
                const brandFreq: Record<string, number> = {}
                urlResult.resultados.forEach(r => {
                  r.marcas_mencionadas.forEach((m, i) => {
                    const weight = Math.max(10 - i * 2, 1)
                    brandFreq[m] = (brandFreq[m] || 0) + weight
                  })
                })
                const allBrands = Object.entries(brandFreq).sort((a, b) => b[1] - a[1])
                const maxScore = allBrands[0]?.[1] || 1
                const chartData = allBrands.map(([marca, raw]) => ({
                  marca,
                  score: Math.round((raw / maxScore) * 100),
                  isUser: marca.toLowerCase() === urlResult.marca.toLowerCase(),
                  isWinner: marca.toLowerCase() === allBrands[0][0].toLowerCase(),
                }))
                const miMarcaEnLista = chartData.some(e => e.isUser)
                const competitorWidths = chartData.filter(e => !e.isUser).map(e => e.score)
                const promedio = competitorWidths.length > 0
                  ? Math.round(competitorWidths.reduce((a, b) => a + b, 0) / competitorWidths.length)
                  : 0
                const chartHeight = Math.max(chartData.length * 52, 180)

                // Aggregate competitor reasons for custom tooltip
                const winnerName = allBrands[0]?.[0] || ''
                const winnerReasons = urlResult.resultados
                  .filter(r => r.marca_ganadora?.toLowerCase() === winnerName.toLowerCase())
                  .flatMap(r => r.competitor_winning_reasons || [])
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .slice(0, 4)
                const winnerSources = urlResult.resultados
                  .filter(r => r.marca_ganadora?.toLowerCase() === winnerName.toLowerCase())
                  .flatMap(r => r.cited_sources_types || [])
                  .filter((v, i, a) => a.indexOf(v) === i)
                  .slice(0, 4)
                return (
                  <motion.div
                    id="zone-url-share-of-voice"
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-slate-950 border border-slate-800 rounded-sm p-6"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-100">Dominio de Mercado en Motores de IA <span className="text-slate-500 font-normal">(Share of Voice)</span></h3>
                        <p className="text-gray-400 text-sm mt-1">Marcas que están capturando actualmente la demanda de sus clientes potenciales.</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-sm font-mono text-slate-500 bg-slate-800 border border-slate-700 px-2 py-1 rounded">
                          {chartData.length} marcas
                        </span>
                        {urlResult.keyword_trend && (
                          <span className={`text-sm font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                            urlResult.keyword_trend === 'Al alza'
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20'
                              : urlResult.keyword_trend === 'Baja'
                              ? 'bg-rose-950/40 text-rose-400 border-rose-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {urlResult.keyword_trend === 'Al alza' ? '↑' : urlResult.keyword_trend === 'Baja' ? '↓' : '→'}
                            {' '}Demanda en CL: <strong>{urlResult.keyword_trend}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={chartHeight}>
                      <BarChart layout="vertical" data={chartData} margin={{ top: 2, right: 56, bottom: 2, left: 0 }}>
                        <defs>
                          <linearGradient id="userGradientUrl" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                          <linearGradient id="dominantGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ea580c" />
                            <stop offset="100%" stopColor="#f97316" />
                          </linearGradient>
                        </defs>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis
                          type="category"
                          dataKey="marca"
                          width={140}
                          tick={(props) => {
                            const { x, y, payload, index } = props as { x: number; y: number; payload: { value: string }; index: number }
                            const entry = chartData[index]
                            const isUser = entry?.isUser
                            const rank = index + 1
                            return (
                              <g>
                                <text x={x - 118} y={y} dy={4} textAnchor="end" fill={rank === 1 ? '#fbbf24' : '#475569'} fontWeight={700} fontSize={9} fontFamily="ui-monospace, monospace">#{rank}</text>
                                <text x={x - 4} y={y} dy={4} textAnchor="end" fill={isUser ? '#38bdf8' : entry?.isWinner ? '#fbbf24' : '#94a3b8'} fontWeight={isUser || entry?.isWinner ? 700 : 400} fontSize={11}>
                                  {isUser ? '→ ' : ''}{payload?.value}
                                </text>
                              </g>
                            )
                          }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                          content={(props) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const { active, payload } = props as any
                            if (!active || !payload?.length) return null
                            const item = payload[0].payload
                            return (
                              <div style={{ background: 'rgba(10,16,36,0.98)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: 8, padding: '12px 16px', fontSize: 14, color: '#f1f5f9', maxWidth: 280, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.6)' }}>
                                <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.marca}</div>
                                <div style={{ color: '#94a3b8', fontSize: 13 }}>Presencia: <strong style={{ color: '#7dd3fc' }}>{item.score}%</strong></div>
                                {item.isWinner && winnerReasons.length > 0 && (
                                  <div style={{ marginTop: 10, borderTop: '1px solid rgba(100,116,139,0.2)', paddingTop: 8 }}>
                                    <div style={{ color: '#fbbf24', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>¿Por qué nos ganan?</div>
                                    {winnerReasons.map((r, ri) => (
                                      <div key={ri} style={{ color: '#fca5a5', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                                        <span style={{ color: '#f97316', marginTop: 2 }}>•</span>{r}
                                      </div>
                                    ))}
                                    {winnerSources.length > 0 && (
                                      <div style={{ marginTop: 8 }}>
                                        <div style={{ color: '#a78bfa', fontSize: 12, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fuentes IA</div>
                                        {winnerSources.map((s, si) => (
                                          <div key={si} style={{ color: '#c4b5fd', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
                                            <span style={{ color: '#a78bfa' }}>→</span>{s}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          }}
                        />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={16} background={{ fill: '#0f172a', radius: 4 }}>
                          {chartData.map((entry, idx) => {
                            const isDominant = entry.isWinner && entry.score >= 90
                            return (
                              <Cell
                                key={idx}
                                fill={
                                  entry.isUser
                                    ? 'url(#userGradientUrl)'
                                    : isDominant
                                    ? 'url(#dominantGradient)'
                                    : entry.isWinner
                                    ? '#b45309'
                                    : `rgba(51, 65, 85, ${Math.max(0.6 - idx * 0.07, 0.15)})`
                                }
                              />
                            )
                          })}
                          <LabelList
                            dataKey="score"
                            position="right"
                            content={(props) => {
                              const { x, y, width, height, value, index } = props as { x: number; y: number; width: number; height: number; value: number; index: number }
                              const entry = chartData[index]
                              const isDominant = entry?.isWinner && entry.score >= 90
                              return (
                                <text x={(x ?? 0) + (width ?? 0) + 8} y={(y ?? 0) + (height ?? 0) / 2} dy={4} fill={entry?.isUser ? '#38bdf8' : isDominant ? '#fb923c' : '#64748b'} fontWeight={entry?.isUser || isDominant ? 700 : 400} fontSize={11} fontFamily="ui-monospace, monospace">
                                  {value}%
                                </text>
                              )
                            }}
                          />
                        </Bar>
                        <ReferenceLine x={promedio} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.45} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center flex-wrap gap-x-5 gap-y-1.5 mt-2 px-1">
                      <span className="flex items-center gap-1.5 text-sm text-sky-400">
                        <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-sky-500 to-indigo-500 shrink-0" /> → Tu marca
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-amber-400">
                        <span className="w-2.5 h-2.5 rounded-sm bg-amber-700 shrink-0" /> #1 Competidor
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-orange-400">
                        <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-orange-600 to-orange-400 shrink-0" /> Dominancia absoluta (≥90%)
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-amber-500/70">
                        <span className="w-3 h-px border-t border-dashed border-amber-500/50 shrink-0" /> Promedio competidores
                      </span>
                      {miMarcaEnLista && (() => {
                        const userEntry = chartData.find(e => e.isUser)
                        const userScore = userEntry ? userEntry.score : 0
                        const delta = userScore - promedio
                        if (delta === 0) return null
                        return (
                          <span className={`ml-auto text-sm font-semibold px-2.5 py-0.5 rounded-full ${delta > 0 ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 'bg-rose-950/40 text-rose-400 border border-rose-500/20'}`}>
                            {delta > 0 ? `+${delta}pp vs promedio` : `${delta}pp vs promedio`}
                          </span>
                        )
                      })()}
                    </div>
                  </motion.div>
                )
              })()}

              {/* 3 · DIAGNÓSTICO — CompetitiveDeepDive */}
              {urlResult.competitive_deep_dive && urlResult.competitive_deep_dive.competidor && (
                <motion.div
                  id="zone-url-competitive-deep-dive"
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                  className="bg-slate-950 border border-slate-800 rounded-sm overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-slate-800 flex items-start gap-3">
                    <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-rose-500 to-violet-600 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Diagnóstico Competitivo</p>
                      <h3 className="text-base font-semibold text-slate-100">
                        ¿Por qué la IA prioriza a <span className="text-amber-400">{urlResult.competitive_deep_dive.competidor}</span>?
                      </h3>
                      <p className="text-slate-500 text-sm mt-0.5">Análisis de la brecha de autoridad digital entre tu marca y el líder actual.</p>
                    </div>
                  </div>

                  {/* Dos tarjetas enfrentadas */}
                  <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
                    {/* Tarjeta izquierda — percepción nuestra */}
                    <div className="px-5 py-5">
                      <p className="text-[10px] uppercase tracking-widest font-semibold text-rose-400 mb-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500/60 inline-block" />
                        Percepción de {urlResult.marca} en la IA
                      </p>
                      <div className="border border-rose-500/15 bg-rose-950/10 rounded-sm px-4 py-3.5">
                        <p className="text-slate-300 text-sm leading-relaxed">{urlResult.competitive_deep_dive.percepcion_nuestra_marca}</p>
                      </div>
                    </div>
                    {/* Tarjeta derecha — ventajas competidor */}
                    <div className="px-5 py-5">
                      <p className="text-[10px] uppercase tracking-widest font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500/60 inline-block" />
                        Ventajas Competitivas de {urlResult.competitive_deep_dive.competidor}
                      </p>
                      <div className="border border-emerald-500/15 bg-emerald-950/10 rounded-sm px-4 py-3.5">
                        <p className="text-slate-300 text-sm leading-relaxed">{urlResult.competitive_deep_dive.mensaje_competidor}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tabla de atributos */}
                  {urlResult.competitive_deep_dive.tabla_atributos && urlResult.competitive_deep_dive.tabla_atributos.length > 0 && (
                    <div className="border-t border-slate-800/60 px-5 pb-5 pt-4">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">
                        Atributos donde {urlResult.competitive_deep_dive.competidor} supera a {urlResult.marca}
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr>
                              <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 font-semibold pb-2.5 pr-4 w-1/3">Atributo Ganador</th>
                              <th className="text-left text-[10px] uppercase tracking-widest text-violet-400 font-semibold pb-2.5 pr-4 w-1/3">Autoridad Digital <span className="text-slate-600 normal-case">(Por qué les creen)</span></th>
                              <th className="text-left text-[10px] uppercase tracking-widest text-rose-400 font-semibold pb-2.5 w-1/3">Impacto Comercial <span className="text-slate-600 normal-case">(Lo que perdemos)</span></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/40">
                            {urlResult.competitive_deep_dive.tabla_atributos.map((row, ri) => (
                              <tr key={ri} className={ri % 2 === 0 ? 'bg-slate-900/20' : ''}>
                                <td className="py-3 pr-4 align-top">
                                  <span className="font-semibold text-slate-200">{row.atributo}</span>
                                </td>
                                <td className="py-3 pr-4 align-top text-violet-300/80 text-xs leading-relaxed">{row.autoridad_digital}</td>
                                <td className="py-3 align-top text-rose-300/80 text-xs leading-relaxed">{row.impacto_comercial}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* 4 · ESPERANZA — UntappedTerritories */}
              {urlResult.untapped_territories && urlResult.untapped_territories.length > 0 && (
                <motion.div
                  id="zone-url-untapped-territories"
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                  className="bg-slate-950 border border-slate-800 rounded-sm overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-slate-800">
                    <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold mb-1">Vectores de Crecimiento</p>
                    <h3 className="text-base font-semibold text-slate-100">Oportunidades de Baja Competencia</h3>
                    <p className="text-slate-500 text-sm mt-0.5">
                      Nichos de mercado validados donde los líderes actuales no tienen autoridad consolidada en IA. Ideales para captura rápida.
                    </p>
                  </div>

                  {/* Lista de territorios */}
                  <div className="divide-y divide-slate-800/50">
                    {urlResult.untapped_territories.map((territory, ti) => (
                      <div
                        key={ti}
                        className="flex items-start gap-4 px-5 py-4 hover:bg-slate-900/40 transition-colors cursor-pointer group"
                      >
                        {/* Icono */}
                        <div className="shrink-0 mt-0.5">
                          <div className="w-8 h-8 rounded-sm bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <p className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">{territory.titulo}</p>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                territory.nivel_competencia_ia === 'Nula'
                                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/25'
                                  : territory.nivel_competencia_ia === 'Muy baja'
                                  ? 'bg-teal-950/40 text-teal-300 border-teal-500/25'
                                  : 'bg-sky-950/40 text-sky-300 border-sky-500/25'
                              }`}>
                                Competencia {territory.nivel_competencia_ia}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                territory.tendencia.startsWith('↗')
                                  ? 'bg-amber-950/30 text-amber-400 border-amber-500/20'
                                  : territory.tendencia.startsWith('⚡')
                                  ? 'bg-violet-950/30 text-violet-300 border-violet-500/20'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}>
                                {territory.tendencia}
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            <span className="text-slate-500 font-medium">Justificación: </span>
                            {territory.justificacion_negocio}
                          </p>
                        </div>

                        {/* Arrow hint */}
                        <span className="text-slate-700 group-hover:text-emerald-500 transition-colors text-sm shrink-0 mt-1">›</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer CTA */}
                  <div className="border-t border-slate-800/60 px-5 py-3 bg-emerald-950/10">
                    <p className="text-xs text-emerald-400/70 text-center">
                      Estos nichos son el punto de partida para la Hoja de Ruta de Recuperación ↓
                    </p>
                  </div>
                </motion.div>
              )}

              {/* 5 · SOLUCIÓN — Estrategia de Recuperación */}
              {urlResult.plan_accion && urlResult.plan_accion.vehiculos.length > 0 && (() => {
                const allActions = urlResult.plan_accion!.vehiculos
                  .flatMap(v => v.acciones)
                  .sort((a, b) => b.ice_score - a.ice_score)
                const grouped: Record<string, typeof allActions> = {}
                allActions.forEach(a => {
                  const area = a.area_responsable || 'Equipo'
                  if (!grouped[area]) grouped[area] = []
                  grouped[area].push(a)
                })
                const areaOrder = Object.keys(grouped).sort((a, b) => {
                  const maxA = Math.max(...grouped[a].map(x => x.ice_score))
                  const maxB = Math.max(...grouped[b].map(x => x.ice_score))
                  return maxB - maxA
                })
                const areaConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
                  'Marketing / Contenido': { icon: <Megaphone className="w-3.5 h-3.5" />, label: 'Contenido', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
                  'TI / Desarrollo': { icon: <Code2 className="w-3.5 h-3.5" />, label: 'Técnico', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
                  'PR / Agencia': { icon: <Globe className="w-3.5 h-3.5" />, label: 'PR & Medios', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
                }
                const perfilesConError = urlResult.resultados.filter(r => !r.mencionada).length
                const topAction = allActions[0]
                return (
                  <motion.div
                    id="zone-url-plan"
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden"
                  >
                    <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-slate-100">Hoja de Ruta de Recuperación <span className="text-slate-500 font-normal text-sm">(Plan a 30–60 días)</span></h3>
                        <p className="text-slate-500 text-sm mt-0.5">
                          {perfilesConError === 0
                            ? `${urlResult.marca} aparece en todos los perfiles de comprador`
                            : perfilesConError === urlResult.total_queries
                            ? `${urlResult.marca} no aparece en ningún perfil de comprador`
                            : `${urlResult.marca} pierde ${perfilesConError} de ${urlResult.total_queries} tipos de cliente`
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePrint()}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <FileText size={12} />
                          Exportar PDF
                        </button>
                        <div className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                          urlResult.visibilidad_pct === 0
                            ? 'bg-rose-950/40 text-rose-200 border-rose-500/30'
                            : urlResult.visibilidad_pct < 100
                            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40'
                            : 'bg-emerald-900/30 text-emerald-400 border-emerald-800/40'
                        }`}>
                          {urlResult.visibilidad_pct === 0 ? '⚠ INTERVENIR' : urlResult.visibilidad_pct < 100 ? 'DEFENDER' : 'MANTENER'}
                        </div>
                      </div>
                    </div>

                    {/* Acción destacada */}
                    {topAction && (
                      <div className="px-6 pt-4 pb-2">
                        <div className="flex items-start gap-3 px-4 py-3 bg-amber-950/20 border border-amber-800/30 rounded-sm">
                          <span className="text-amber-400 font-bold shrink-0 mt-0.5">✦</span>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-amber-500 mb-1">Acción prioritaria esta semana</p>
                            <p className="text-amber-100 text-sm font-semibold leading-snug">{topAction.tactica_tecnica}</p>
                            <p className="text-amber-700 text-xs mt-1 truncate" title={topAction.concepto_objetivo}>{topAction.concepto_objetivo} · {topAction.tiempo_indexacion_ia}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="px-5 pb-5 pt-3 space-y-5">
                      {areaOrder.map(area => {
                        const cfg = areaConfig[area] || { icon: null, label: area, color: 'text-slate-500' }
                        return (
                          <div key={area}>
                            {/* Área como divisor-etiqueta */}
                            <div className="flex items-center gap-3 mb-2.5">
                              <span className={`text-[11px] font-semibold uppercase tracking-wider ${cfg.color.split(' ')[0]}`}>
                                {cfg.icon} {cfg.label}
                              </span>
                              <div className="flex-1 h-px bg-slate-800" />
                            </div>
                            <div className="space-y-1.5">
                              {grouped[area].map((a, ai) => {
                                const globalIdx = allActions.indexOf(a) + 1
                                const isTop = globalIdx === 1
                                const actionKey = `${area}-${ai}`
                                const isExpanded = expandedActionKey === actionKey
                                const tacticaInline: string = a.tactica_tecnica || ''
                                const conceptoInline: string = a.concepto_objetivo || 'tu concepto aquí'
                                const marcaInline: string = a.segmento_impactado?.match(/(?:para|de)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñA-Z]+)/)?.[1] || 'TuMarca'
                                let snippetInline = ''
                                if (tacticaInline.toLowerCase().includes('schema faq') || tacticaInline.toLowerCase().includes('json-ld')) {
                                  snippetInline = `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "¿Qué es ${conceptoInline}?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "${marcaInline} ofrece ${conceptoInline}. A diferencia de otras opciones del mercado, nos diferenciamos por [diferenciador clave]. Conoce más en [URL de la página]."\n      }\n    },\n    {\n      "@type": "Question",\n      "name": "¿Cómo funciona ${conceptoInline} en ${marcaInline}?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Con ${marcaInline}, ${conceptoInline} es simple: [paso 1], [paso 2] y [paso 3]. Sin costo oculto ni burocracia."\n      }\n    }\n  ]\n}\n</script>`
                                } else if (tacticaInline.toLowerCase().includes('tablas') || tacticaInline.toLowerCase().includes('html')) {
                                  snippetInline = `<!-- Tabla comparativa HTML para ${conceptoInline} -->\n<table>\n  <thead>\n    <tr>\n      <th>Característica</th>\n      <th>${marcaInline}</th>\n      <th>Competidor A</th>\n      <th>Competidor B</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>${conceptoInline}</td>\n      <td>✅ Sí</td>\n      <td>⚠️ Parcial</td>\n      <td>❌ No</td>\n    </tr>\n    <tr>\n      <td>Tiempo de respuesta</td>\n      <td>[Tu dato]</td>\n      <td>[Dato competidor]</td>\n      <td>[Dato competidor]</td>\n    </tr>\n  </tbody>\n</table>`
                                } else if (tacticaInline.toLowerCase().includes('landing') || tacticaInline.toLowerCase().includes('semántica') || tacticaInline.toLowerCase().includes('semantica') || tacticaInline.toLowerCase().includes('evergreen')) {
                                  snippetInline = `<!-- Bloque de contenido semántico para landing page -->\n<section>\n  <h2>${conceptoInline}: Guía completa</h2>\n  <p>\n    ${conceptoInline} es clave para [perfil del cliente]. ${marcaInline} resuelve esto\n    mediante [diferenciador], lo que lo convierte en la mejor opción para\n    quienes buscan [beneficio principal].\n  </p>\n  <h3>¿Por qué ${marcaInline} para ${conceptoInline}?</h3>\n  <ul>\n    <li><strong>Ventaja 1:</strong> [descripción concreta con datos]</li>\n    <li><strong>Ventaja 2:</strong> [descripción concreta con datos]</li>\n    <li><strong>Ventaja 3:</strong> [descripción concreta con datos]</li>\n  </ul>\n  <p>\n    <a href="/[tu-url]">Conoce más sobre ${conceptoInline} en ${marcaInline} →</a>\n  </p>\n</section>`
                                } else if (tacticaInline.toLowerCase().includes('digital pr') || tacticaInline.toLowerCase().includes('medios')) {
                                  snippetInline = `NOTA DE PRENSA — PLANTILLA COPY-PASTE\n\nTITULAR (máx 80 chars):\n${marcaInline} presenta [propuesta de valor] en el mercado de ${conceptoInline}\n\nPRIMER PÁRRAFO (quién, qué, cuándo, dónde, por qué):\n${marcaInline} anunció hoy [acción concreta], consolidando su posición como\nreferente en ${conceptoInline} en [mercado]. La iniciativa responde a [tendencia/dato].\n\nCITA DEL VOCERO:\n"[Nombre, Cargo] de ${marcaInline} comenta: '[cita sobre ${conceptoInline} en 1-2 oraciones]'"\n\nDATOS CLAVE (lo que los periodistas copian):\n- [Dato 1 con número sobre ${conceptoInline}]\n- [Dato 2: resultado medible]\n- [Dato 3: diferenciador verificable]\n\nCONTACTO DE PRENSA:\nNombre: [Nombre]\nEmail: [email]\nTel: [teléfono]`
                                } else if (tacticaInline.toLowerCase().includes('knowledge graph') || tacticaInline.toLowerCase().includes('entidades')) {
                                  snippetInline = `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "${marcaInline}",\n  "description": "Especialistas en ${conceptoInline}",\n  "url": "https://[tudominio].cl",\n  "sameAs": [\n    "https://www.wikidata.org/wiki/[ID-wikidata]",\n    "https://www.linkedin.com/company/[slug]",\n    "https://www.instagram.com/[usuario]"\n  ],\n  "knowsAbout": [\n    "${conceptoInline}",\n    "[tema relacionado 2]",\n    "[tema relacionado 3]"\n  ],\n  "areaServed": {\n    "@type": "Country",\n    "name": "Chile"\n  }\n}\n</script>`
                                }
                                return (
                                  <div key={`url-action2-${area}-${ai}`}>
                                    {/* Row */}
                                    <div
                                      className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors ${
                                        isExpanded
                                          ? isTop
                                            ? 'border-l-2 border-amber-500/50 border-t border-x border-slate-700/30 bg-slate-800/30 rounded-t-sm'
                                            : 'border-t border-x border-slate-700/20 bg-slate-800/20 rounded-t-sm'
                                          : isTop
                                            ? 'border-l-2 border-amber-500/50 border-y border-r border-slate-700/30 bg-slate-800/30 hover:bg-slate-800/50 rounded-sm'
                                            : 'border border-slate-700/20 bg-slate-800/10 hover:bg-slate-800/30 rounded-sm'
                                      }`}
                                      onClick={() => {
                                        if (isExpanded) { setExpandedActionKey(null) }
                                        else { setExpandedActionKey(actionKey); setShowInlineCode(false); setInlineTab('marketing'); setBriefData(null) }
                                      }}
                                    >
                                      <span className={`text-sm font-mono tabular-nums shrink-0 w-5 ${isTop ? 'text-amber-400 font-bold' : 'text-slate-600'}`}>{globalIdx}.</span>
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-sm leading-snug ${isTop ? 'text-slate-100 font-semibold' : 'text-slate-300 font-medium'}`}>{a.concepto_objetivo}</p>
                                        <p className="text-slate-600 text-xs mt-0.5 truncate">{a.tactica_tecnica}</p>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        {a.ice_score >= 7 ? (
                                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/12 text-emerald-400 border border-emerald-500/25">↑ Alto impacto</span>
                                        ) : a.ice_score >= 5 ? (
                                          <span className="text-xs text-amber-600">→ Medio</span>
                                        ) : (
                                          <span className="text-xs text-slate-600">Complementaria</span>
                                        )}
                                        <span className={`text-slate-500 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>›</span>
                                      </div>
                                    </div>
                                    {/* Inline detail */}
                                    {isExpanded && (
                                      <div className={`border-b border-x rounded-b-sm bg-slate-900/40 ${
                                        isTop ? 'border-slate-700/30 border-l-2 border-amber-500/30' : 'border-slate-700/20'
                                      }`}>
                                        {/* Context header — always visible */}
                                        {a.segmento_impactado && (
                                          <div className="px-5 pt-4 pb-0">
                                            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1">🎯 Oportunidad de Mercado</p>
                                            <p className="text-slate-200 text-sm font-medium leading-snug">{a.segmento_impactado}</p>
                                          </div>
                                        )}

                                        {/* Tab strip */}
                                        <div className="flex gap-0 border-b border-slate-800 mt-4 px-5">
                                          <button
                                            onClick={(e) => { e.stopPropagation(); setInlineTab('marketing') }}
                                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border-b-2 transition-colors ${
                                              inlineTab === 'marketing'
                                                ? 'border-violet-500 text-violet-300'
                                                : 'border-transparent text-slate-500 hover:text-slate-300'
                                            }`}
                                          >
                                            📝 Brief para Marketing
                                          </button>
                                          <button
                                            onClick={(e) => { e.stopPropagation(); setInlineTab('ti') }}
                                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border-b-2 transition-colors ${
                                              inlineTab === 'ti'
                                                ? 'border-sky-500 text-sky-300'
                                                : 'border-transparent text-slate-500 hover:text-slate-300'
                                            }`}
                                          >
                                            ⚙️ Ejecución TI (Código)
                                          </button>
                                        </div>

                                        {/* TAB 1: Brief para Marketing */}
                                        {inlineTab === 'marketing' && (
                                          <div className="px-5 py-4 space-y-4">
                                            {briefLoading && (
                                              <div className="space-y-3">
                                                {[0,1,2].map(i => <div key={i} className="h-10 bg-slate-800/50 rounded animate-pulse" />)}
                                                <p className="text-xs text-slate-600 text-center">Generando brief con IA...</p>
                                              </div>
                                            )}

                                            {!briefLoading && !briefData && (
                                              <button
                                                onClick={async (e) => {
                                                  e.stopPropagation()
                                                  setBriefLoading(true)
                                                  setBriefData(null)
                                                  try {
                                                    const res = await fetch('/api/marketing/brief', {
                                                      method: 'POST',
                                                      headers: { 'Content-Type': 'application/json' },
                                                      body: JSON.stringify({
                                                        market_opportunity: a.concepto_objetivo,
                                                        archetype: urlResult.arquetipos?.[0]?.arquetipo || 'Cliente objetivo',
                                                        brand: urlResult.marca,
                                                        categoria: urlResult.categoria,
                                                      }),
                                                    })
                                                    if (res.ok) setBriefData(await res.json())
                                                  } catch { /* silent */ } finally { setBriefLoading(false) }
                                                }}
                                                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-violet-500/30 bg-violet-500/5 text-violet-300 text-sm font-medium hover:bg-violet-500/10 transition-colors"
                                              >
                                                ✨ Generar Brief con IA
                                              </button>
                                            )}

                                            {briefData && (
                                              <>
                                                {/* Blog title */}
                                                <div className="p-3.5 rounded-lg border border-slate-700/40 bg-slate-800/20">
                                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                                                    📄 Título de Blog Sugerido
                                                  </p>
                                                  <p className="text-slate-100 text-sm font-medium leading-snug">{briefData.blog_title_suggestion}</p>
                                                </div>

                                                {/* Instagram */}
                                                <div className="p-3.5 rounded-lg border border-pink-800/30 bg-pink-950/10">
                                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-pink-400 mb-1 flex items-center gap-1.5">
                                                    📱 Idea para Reel / Short
                                                  </p>
                                                  <p className="text-slate-200 text-sm leading-snug">{briefData.instagram_reel_hook}</p>
                                                </div>

                                                {/* E-commerce */}
                                                <div className="p-3.5 rounded-lg border border-slate-700/40 bg-slate-800/20">
                                                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                                                    🛒 Texto para E-commerce / Landing
                                                  </p>
                                                  <p className="text-slate-300 text-sm leading-relaxed">{briefData.ecommerce_product_description_snippet}</p>
                                                </div>

                                                {/* Trust signals */}
                                                {briefData.required_trust_signals.length > 0 && (
                                                  <div className="p-3.5 rounded-lg border border-amber-800/30 bg-amber-950/10">
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-2">⭐ Señales de Confianza a Recopilar</p>
                                                    <ul className="space-y-1.5">
                                                      {briefData.required_trust_signals.map((sig, si) => (
                                                        <li key={si} className="flex items-start gap-2 text-sm text-slate-300">
                                                          <span className="text-amber-500 mt-0.5 shrink-0">·</span>
                                                          {sig}
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                )}

                                                {/* Strategic FAQs */}
                                                {briefData.strategic_faqs.length > 0 && (
                                                  <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">❓ FAQs Estratégicas</p>
                                                    <div className="space-y-2">
                                                      {briefData.strategic_faqs.map((faq, fi) => (
                                                        <div key={fi} className="p-3 rounded border border-slate-700/30 bg-slate-800/10">
                                                          <p className="text-slate-200 text-sm font-medium">{faq.question}</p>
                                                          <p className="text-slate-500 text-xs mt-1 italic">{faq.suggested_answer_angle}</p>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}

                                                {/* Regenerate */}
                                                <button
                                                  onClick={async (e) => {
                                                    e.stopPropagation()
                                                    setBriefLoading(true)
                                                    setBriefData(null)
                                                    try {
                                                      const res = await fetch('/api/marketing/brief', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                          market_opportunity: a.concepto_objetivo,
                                                          archetype: urlResult.arquetipos?.[0]?.arquetipo || 'Cliente objetivo',
                                                          brand: urlResult.marca,
                                                          categoria: urlResult.categoria,
                                                        }),
                                                      })
                                                      if (res.ok) setBriefData(await res.json())
                                                    } catch { /* silent */ } finally { setBriefLoading(false) }
                                                  }}
                                                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                                                >
                                                  ↻ Regenerar brief
                                                </button>
                                              </>
                                            )}

                                            {/* ROI always in Marketing tab */}
                                            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/25">
                                              <TrendingUp className="shrink-0 mt-0.5 text-emerald-400" size={14} />
                                              <div>
                                                <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">Retorno Proyectado</p>
                                                <p className="text-slate-200 text-sm leading-relaxed">
                                                  {a.segmento_impactado
                                                    ? `Al implementar esto, la marca entra al top 3 de recomendaciones para ${a.segmento_impactado.split(/[,.]/).at(0)?.trim()}, capturando tráfico calificado en etapa de decisión de compra.`
                                                    : 'Al implementar esto, la marca mejora su posición en los motores de IA, accediendo a demanda de alta intención de compra que hoy captura la competencia.'
                                                  }
                                                </p>
                                              </div>
                                            </div>
                                            {a.riesgo_inaccion && (
                                              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                                <TriangleAlert className="shrink-0 mt-0.5 text-rose-400" size={14} />
                                                <div>
                                                  <p className="text-xs uppercase tracking-widest text-rose-400 font-bold mb-1">Si no actúas</p>
                                                  <p className="text-slate-300 text-sm leading-relaxed">{a.riesgo_inaccion}</p>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* TAB 2: Ejecución TI */}
                                        {inlineTab === 'ti' && (
                                          <div className="px-5 py-4 space-y-4">
                                            <div>
                                              <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-1.5">📋 Instrucción de Trabajo para TI</p>
                                              <p className="text-slate-300 text-sm leading-relaxed">
                                                {(() => {
                                                  const area2: string = a.area_responsable || ''
                                                  const tac: string = a.tactica_tecnica || ''
                                                  const con: string = a.concepto_objetivo || ''
                                                  if (area2 === 'TI / Desarrollo' || tac.toLowerCase().includes('schema') || tac.toLowerCase().includes('json-ld') || tac.toLowerCase().includes('código')) {
                                                    return `El equipo de TI debe copiar el bloque de código que se encuentra más abajo e insertarlo dentro de la etiqueta <head> de la página que corresponda a "${con}", luego solicitar la re-indexación en Google Search Console.`
                                                  } else if (area2 === 'Marketing / Contenido' || tac.toLowerCase().includes('artículo') || tac.toLowerCase().includes('contenido') || tac.toLowerCase().includes('landing') || tac.toLowerCase().includes('evergreen')) {
                                                    return `El equipo de TI debe publicar la landing page o artículo generado por Marketing bajo la URL canónica correcta, garantizando que sea rastreable por los bots de IA (sin bloqueos en robots.txt ni requiriendo JavaScript para renderizar el contenido clave).`
                                                  } else if (tac.toLowerCase().includes('digital pr') || tac.toLowerCase().includes('prensa') || tac.toLowerCase().includes('medios')) {
                                                    return `El equipo de TI debe verificar que las páginas vinculadas en la nota de prensa devuelvan status 200, cargan en menos de 2s y tienen el Schema Organization correcto. Agregar rel="canonical" si corresponde.`
                                                  } else {
                                                    return `El equipo de TI debe revisar la implementación técnica de "${tac}" para "${con}", asegurando que el contenido sea indexable y los metadatos estructurados estén correctos.`
                                                  }
                                                })()}
                                              </p>
                                            </div>

                                            {snippetInline && (
                                              <div className="border border-slate-700/40 rounded-lg overflow-hidden">
                                                <button
                                                  onClick={(e) => { e.stopPropagation(); setShowInlineCode(v => !v) }}
                                                  className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-800/40 hover:bg-slate-800/70 transition-colors text-left"
                                                >
                                                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                                    <Terminal className="w-3.5 h-3.5 text-sky-500" />
                                                    Ver código listo para copiar
                                                  </span>
                                                  <span className={`text-slate-500 text-xs transition-transform ${showInlineCode ? 'rotate-180' : ''}`}>▼</span>
                                                </button>
                                                {showInlineCode && (
                                                  <div className="relative">
                                                    <button
                                                      onClick={() => navigator.clipboard.writeText(snippetInline)}
                                                      className="absolute top-2 right-2 z-10 flex items-center gap-1 text-[10px] text-slate-500 hover:text-sky-400 bg-slate-900 border border-slate-700 px-2 py-1 rounded transition-colors"
                                                    >
                                                      <Download className="w-3 h-3" /> Copiar
                                                    </button>
                                                    <pre className="p-4 bg-slate-950 text-[11px] font-mono text-slate-400 overflow-x-auto leading-relaxed max-h-72 whitespace-pre"><code>{snippetInline}</code></pre>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {urlResult.plan_accion!.roi_estimado && (
                      <div className="border-t border-slate-800/60 px-5 py-4">
                        <div className="flex items-start gap-3 px-4 py-3 bg-emerald-950/20 border border-emerald-900/20 rounded-sm">
                          <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <p className="text-slate-300 text-sm leading-relaxed">{urlResult.plan_accion!.roi_estimado}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })()}

              {/* 6 · EVIDENCIA — Anexo técnico, colapsado por defecto */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => setShowPerfilesDetalle(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-300">Ver Anexo Técnico: Análisis de Arquetipos y Prompts</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{urlResult.total_queries} perfiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{showPerfilesDetalle ? 'Ocultar' : 'Expandir anexo'}</span>
                    <span className={`text-slate-500 text-xs transition-transform ${showPerfilesDetalle ? 'rotate-180' : ''}`}>▾</span>
                  </div>
                </button>

                {showPerfilesDetalle && (
                  <div className="border-t border-slate-800 divide-y divide-slate-800/60">
                    {urlResult.resultados.map((r, i) => (
                      <div
                        key={i}
                        className={`${r.mencionada ? 'bg-emerald-950/10' : 'bg-slate-950/40'}`}
                      >
                        {/* Header arquetipo */}
                        <div className="px-5 py-3 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-100">{r.arquetipo}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Busca: <span className="text-slate-400">{r.driver}</span></p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {r.sentimiento && (
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                r.sentimiento === 'positivo'
                                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-700/30'
                                  : r.sentimiento === 'negativo'
                                  ? 'bg-rose-950/20 text-rose-400 border-rose-800/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}>
                                {r.sentimiento === 'positivo' ? '😊' : r.sentimiento === 'negativo' ? '😞' : '😐'} {r.sentimiento}
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${r.mencionada ? 'bg-emerald-950/30 text-emerald-400 border-emerald-700/40' : 'bg-rose-950/20 text-rose-400 border-rose-800/40'}`}>
                              {r.mencionada ? `#${r.posicion} ✓` : 'No aparece'}
                            </span>
                          </div>
                        </div>

                        {/* Query + marcas + snippet */}
                        <div className="px-5 pb-4 space-y-3">
                          <div className="bg-slate-900 border border-slate-800 rounded-sm px-3 py-2.5">
                            <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-2">Intención de Búsqueda Simulada</p>
                            <ul className="space-y-1">
                              {queryToBullets(r.query).map((bullet, bi) => (
                                <li key={bi} className="flex items-start gap-1.5 text-xs text-slate-400">
                                  <span className="text-slate-600 shrink-0 mt-0.5">•</span>
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {r.marcas_mencionadas.length > 0 && (() => {
                            // winner first, then up to 2 more — max 3 total
                            const winner = r.marcas_mencionadas[0]
                            const rest = r.marcas_mencionadas.slice(1).filter(m => m.toLowerCase() !== urlResult!.marca.toLowerCase()).slice(0, 2)
                            const visible = [winner, ...rest]
                            const hidden = r.marcas_mencionadas.length - visible.length
                            return (
                              <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-1.5">La IA recomienda a</p>
                                <div className="flex flex-wrap gap-1.5 items-center">
                                  {visible.map((m, j) => {
                                    const isWinner = j === 0
                                    const isOurBrand = m.toLowerCase() === urlResult!.marca.toLowerCase()
                                    const slug = m.toLowerCase().replace(/\s+/g, '')
                                    const href = `https://www.${slug}.com`
                                    return (
                                      <a
                                        key={j}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-opacity hover:opacity-80 ${
                                          isOurBrand
                                            ? 'bg-sky-950/40 text-sky-400 border-sky-700/40'
                                            : isWinner
                                            ? 'bg-amber-950/30 text-amber-400 border-amber-800/40'
                                            : 'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}
                                      >
                                        {isWinner && !isOurBrand && <span>👑</span>}
                                        {m}
                                        <svg className="w-2.5 h-2.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                      </a>
                                    )
                                  })}
                                  {hidden > 0 && (
                                    <span className="text-[10px] text-slate-600">+{hidden} más</span>
                                  )}
                                </div>
                              </div>
                            )
                          })()}
                          {!r.mencionada && (
                            <div className="flex items-start gap-2 p-2.5 bg-rose-950/15 border border-rose-900/30 rounded-sm">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              <p className="text-rose-300/80 text-xs">Este comprador no te encuentra. La IA recomienda a <span className="font-semibold text-rose-300">{r.marca_ganadora || 'la competencia'}</span>.</p>
                            </div>
                          )}
                          {r.snippet && (
                            <div>
                              <button
                                onClick={() => setShowUrlSnippet(prev => ({ ...prev, [i]: !prev[i] }))}
                                className="flex items-center gap-1.5 text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
                              >
                                <Terminal className="w-3 h-3" />
                                {showUrlSnippet[i] ? 'Ocultar respuesta original' : 'Ver respuesta original de la IA'}
                              </button>
                              {showUrlSnippet[i] && (
                                <div className="mt-2 p-3 bg-slate-900/80 border border-slate-800 rounded-sm max-h-40 overflow-y-auto">
                                  <p className="text-slate-500 text-[11px] font-mono leading-relaxed whitespace-pre-wrap">{r.snippet}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Footer */}
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="border-t border-slate-800 pt-4"
              >
                <p className="text-slate-700 text-[10px] font-mono">
                  Análisis generado por IA · {new Date().toLocaleDateString('es-CL')} · {urlResult!.total_queries} tipos de cliente · {urlResult!.mercado}
                </p>
              </motion.div>

            </motion.div>

            {/* ── Hidden PDF template (fuera de pantalla, accesible al motor de impresión) ── */}
            <div id="executive-report-print" style={{ position: 'fixed', top: '-9999px', left: '-9999px', zIndex: -1 }} aria-hidden="true">
              <ExecutiveReportTemplate ref={reportRef} urlResult={urlResult!} />
            </div>
          </>)}


          {/* RESULTADOS */}
          {result && d && (
            <motion.div
              id="zone-resultados"
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            >

              {/* ─── VEREDICTO + SCORE (fusionado) ─────────────── */}
              {(() => {
                const pos = d.posicion_mi_marca
                const ganador = d.competidor_principal || d.marca_ganadora || 'la competencia'
                const accion = d.prioridad_ejecutiva?.foco_principal
                const impacto = d.prioridad_ejecutiva?.impacto_esperado
                const clasificacion = d.prioridad_ejecutiva?.clasificacion ?? (pos === 0 || pos > 5 ? 'Atacar' : pos <= 2 ? 'Mantener' : 'Defender')

                const isAtacar = clasificacion === 'Atacar'
                const isDefender = clasificacion === 'Defender'

                const theme = isAtacar
                  ? { bg: 'bg-rose-950/20', border: 'border-rose-500/30', bar: 'bg-rose-500', icon: <AlertTriangle className="w-5 h-5 text-rose-400" /> }
                  : isDefender
                  ? { bg: 'bg-amber-950/25', border: 'border-amber-900/40', bar: 'bg-amber-500', icon: <TriangleAlert className="w-5 h-5 text-amber-500" /> }
                  : { bg: 'bg-emerald-950/20', border: 'border-emerald-900/30', bar: 'bg-emerald-500', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> }

                const score = d.invisibilidad_score ?? 0
                const marcasRivales = d.marcas_mencionadas?.filter((m: string) => m.toLowerCase() !== brand.toLowerCase()).slice(0, 2) ?? []
                const rivales = marcasRivales.length >= 2
                  ? `${marcasRivales[0]} y ${marcasRivales[1]}`
                  : marcasRivales[0] || ganador

                let titulo = ''
                let subtitulo = ''
                if (pos === 0 || score < 10) {
                  titulo = 'Riesgo Crítico de Invisibilidad Digital'
                  subtitulo = `Sus clientes potenciales están siendo derivados activamente a ${rivales} porque la IA no encuentra fuentes de confianza que validen su propuesta de valor. Cada búsqueda que no los menciona es un cliente que nunca llega.`
                } else if (pos > 5 || score < 30) {
                  titulo = `Alerta: ${brand} está perdiendo demanda activa`
                  subtitulo = `${rivales} captura la intención de compra de sus clientes antes de que lleguen a usted. Cada día sin presencia en la IA es ingresos que no se van a recuperar retroactivamente.`
                } else if (pos === 1) {
                  titulo = `${brand} lidera — proteja esa posición`
                  subtitulo = `La IA lo recomienda primero, pero ${ganador} está invirtiendo para desplazarle. El liderazgo en IA se pierde más rápido de lo que se construye.`
                } else {
                  titulo = `${brand} aparece, pero ${ganador} se lleva la decisión`
                  subtitulo = `Está en posición #${pos}. Los compradores que llegan a la IA ven primero a ${ganador}: ese es el cliente que usted no está convirtiendo.`
                }

                return (
                  <motion.div
                    id="zone-veredicto"
                    variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } }}
                    className={`${theme.bg} border ${theme.border} rounded-sm flex items-stretch overflow-hidden`}
                  >
                    <div className={`w-1.5 shrink-0 ${theme.bar}`} />
                    <div className="flex-1 px-6 py-5">
                      <div className="flex flex-col md:flex-row md:items-start gap-5">
                        {/* Score */}
                        <div className="shrink-0 flex flex-col items-center md:items-start">
                          <div className="flex items-baseline gap-1">
                            <span className={`text-4xl font-light tabular-nums ${getScoreTextColor(d.estado_invisibilidad)}`}>{d.invisibilidad_score}</span>
                            <span className="text-slate-500 text-base">/ 100</span>
                          </div>
                          <div className="w-28 bg-slate-800/60 h-1.5 rounded-full overflow-hidden mt-2">
                            <div className={`h-full rounded-full ${getScoreBarColor(d.estado_invisibilidad)} transition-all duration-700`} style={{ width: `${d.invisibilidad_score}%` }} />
                          </div>
                        </div>

                        {/* Narrative */}
                        <div className="flex-1">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5">{theme.icon}</div>
                            <div>
                              <h2 className="text-base font-semibold text-slate-100 leading-snug">{titulo}</h2>
                              <p className="text-slate-400 text-sm mt-1 leading-relaxed">{subtitulo}</p>
                              {accion && (
                                <p className="text-slate-300 text-sm mt-3">
                                  <span className="font-semibold">Siguiente paso:</span> {accion}{impacto ? `. ${impacto}.` : '.'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })()}

              {/* 2 · SHARE OF VOICE — Progress Bars */}
              {d.marcas_mencionadas.length > 0 && (
                <motion.div
                  id="zone-share-of-voice"
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                  className="bg-slate-950 border border-slate-800 rounded-sm p-6"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">
                        ¿A quién recomienda la IA para <span className="text-slate-400 font-normal italic">"{result.prompt_original}"</span>?
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">Marcas ordenadas por relevancia en la respuesta</p>
                    </div>
                    <span className="text-xs font-mono text-slate-500 bg-slate-800 border border-slate-700 px-2 py-1 rounded shrink-0">
                      {d.marcas_mencionadas.length} marcas
                    </span>
                  </div>
                  {(() => {
                    const total = d.marcas_mencionadas.length
                    const allWidths = d.marcas_mencionadas.map((_, i) =>
                      total === 1 ? 100 : Math.max(Math.round(100 - i * (70 / (total - 1))), 14)
                    )
                    const esMiMarcaFn = (m: string) => {
                      const a = m.toLowerCase().trim()
                      const b = brand.toLowerCase().trim()
                      return a === b || a.includes(b) || b.includes(a)
                    }
                    const miMarcaEnLista = d.marcas_mencionadas.some(m => esMiMarcaFn(m))
                    const competitorWidths = allWidths.filter((_, i) =>
                      !esMiMarcaFn(d.marcas_mencionadas[i])
                    )
                    const promedio = competitorWidths.length > 0
                      ? Math.round(competitorWidths.reduce((a, b) => a + b, 0) / competitorWidths.length)
                      : 0
                    const chartData = d.marcas_mencionadas.map((marca, idx) => ({
                      marca,
                      score: allWidths[idx],
                      isUser: esMiMarcaFn(marca),
                      isWinner: marca.toLowerCase().trim() === (d.marca_ganadora ?? '').toLowerCase().trim(),
                    })).sort((a, b) => b.score - a.score)
                    const chartHeight = Math.max(chartData.length * 52, 180)
                    return (
                      <>
                        <ResponsiveContainer width="100%" height={chartHeight}>
                          <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 2, right: 56, bottom: 2, left: 0 }}
                          >
                            <defs>
                              <linearGradient id="userGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#0ea5e9" />
                                <stop offset="100%" stopColor="#6366f1" />
                              </linearGradient>
                            </defs>
                            <XAxis
                              type="number"
                              domain={[0, 100]}
                              hide
                            />
                            <YAxis
                              type="category"
                              dataKey="marca"
                              width={140}
                              tick={(props) => {
                                const { x, y, payload, index } = props as { x: number; y: number; payload: { value: string }; index: number }
                                const entry = chartData[index]
                                const isUser = entry?.isUser
                                const isWinner = entry?.isWinner
                                const rank = index + 1
                                return (
                                  <g>
                                    <text
                                      x={x - 118}
                                      y={y}
                                      dy={4}
                                      textAnchor="end"
                                      fill={rank === 1 ? '#fbbf24' : '#475569'}
                                      fontWeight={700}
                                      fontSize={9}
                                      fontFamily="ui-monospace, monospace"
                                    >
                                      #{rank}
                                    </text>
                                    <text
                                      x={x - 4}
                                      y={y}
                                      dy={4}
                                      textAnchor="end"
                                      fill={isUser ? '#38bdf8' : isWinner ? '#fbbf24' : '#94a3b8'}
                                      fontWeight={isUser || isWinner ? 700 : 400}
                                      fontSize={11}
                                    >
                                      {isUser ? '→ ' : ''}{payload?.value}
                                    </text>
                                  </g>
                                )
                              }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip
                              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                              contentStyle={{
                                background: 'rgba(15,23,42,0.95)',
                                border: '1px solid rgba(100,116,139,0.3)',
                                borderRadius: 6,
                                fontSize: 12,
                                color: '#f1f5f9',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(12px)',
                              }}
                              formatter={(value) => [
                                <span key="v" style={{ color: '#7dd3fc', fontWeight: 700 }}>{value}%</span>,
                                <span key="l" style={{ color: '#94a3b8', fontSize: 11 }}>Relevancia</span>,
                              ]}
                              labelStyle={{ color: '#f8fafc', fontWeight: 700, marginBottom: 4 }}
                            />
                            <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={16} background={{ fill: '#0f172a', radius: 4 }}>
                              {chartData.map((entry, idx) => (
                                <Cell
                                  key={idx}
                                  fill={
                                    entry.isUser
                                      ? 'url(#userGradient)'
                                      : entry.isWinner
                                      ? '#92400e'
                                      : `rgba(51, 65, 85, ${Math.max(0.7 - idx * 0.08, 0.2)})`
                                  }
                                />
                              ))}
                              <LabelList
                                dataKey="score"
                                position="right"
                                content={(props) => {
                                  const { x, y, width, height, value, index } = props as { x: number; y: number; width: number; height: number; value: number; index: number }
                                  const entry = chartData[index]
                                  const isUser = entry?.isUser
                                  return (
                                    <text
                                      x={(x ?? 0) + (width ?? 0) + 8}
                                      y={(y ?? 0) + (height ?? 0) / 2}
                                      dy={4}
                                      fill={isUser ? '#38bdf8' : '#64748b'}
                                      fontWeight={isUser ? 700 : 400}
                                      fontSize={11}
                                      fontFamily="ui-monospace, monospace"
                                    >
                                      {value}%
                                    </text>
                                  )
                                }}
                              />
                            </Bar>
                            <ReferenceLine
                              x={promedio}
                              stroke="#f59e0b"
                              strokeDasharray="3 3"
                              strokeOpacity={0.45}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                        {/* Legend */}
                        <div className="flex items-center flex-wrap gap-x-5 gap-y-1.5 mt-2 px-1">
                          <span className="flex items-center gap-1.5 text-[10px] text-sky-400/70">
                            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-sky-500 to-indigo-500 shrink-0" /> → Tu marca
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] text-amber-400/70">
                            <span className="w-2.5 h-2.5 rounded-sm bg-amber-800 shrink-0" /> #1 Más recomendada
                          </span>
                          <span className="flex items-center gap-1.5 text-[10px] text-amber-500/50">
                            <span className="w-3 h-px border-t border-dashed border-amber-500/50 shrink-0" /> Promedio competidores
                          </span>
                          {miMarcaEnLista && (() => {
                            const userEntry = chartData.find(e => e.isUser)
                            const userScore = userEntry ? userEntry.score : 0
                            const delta = userScore - promedio
                            if (delta === 0) return null
                            return (
                              <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                delta > 0
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-950/40 text-rose-400 border border-rose-500/20'
                              }`}>
                                {delta > 0 ? `+${delta}pp vs promedio` : `${delta}pp vs promedio`}
                              </span>
                            )
                          })()}
                        </div>
                        {/* Raw output toggle — colapsado por defecto */}
                        {result.texto_original_ia && (
                          <div className="mt-3">
                            <button
                              onClick={() => setShowRawOutput(!showRawOutput)}
                              className="flex items-center gap-1.5 text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
                            >
                              <Terminal className="w-3 h-3" />
                              {showRawOutput ? 'Ocultar respuesta original' : 'Ver respuesta original de la IA'}
                            </button>
                            {showRawOutput && (
                              <div className="mt-2 p-3 bg-slate-900/80 border border-slate-800 rounded-sm max-h-40 overflow-y-auto">
                                <p className="text-slate-500 text-[11px] font-mono leading-relaxed whitespace-pre-wrap">
                                  {result.texto_original_ia}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </motion.div>
              )}

              {/* ─── FASE 2: LA AUTOPSIA ───────────────── */}

              {/* 3 · MAPA DE DIFERENCIACIÓN */}
              <motion.div
                id="zone-diferenciacion"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-sm p-6"
              >
                {(() => {
                  const rival = d.competidor_principal || (d.marca_ganadora?.toLowerCase() !== brand.toLowerCase() ? d.marca_ganadora : null) || 'la competencia'
                  return (
                    <div className="mb-5">
                      <h3 className="text-sm font-semibold text-slate-100 mb-0.5">
                        🔍 Por qué la IA prefiere a <span className="text-rose-400 font-bold">{rival}</span> sobre ti
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">
                        {d.posicion_mi_marca === 0
                          ? 'Tu marca no aparece. Esto es lo que la IA asocia con cada uno.'
                          : d.posicion_mi_marca === 1
                          ? 'Lideras, pero estos son los flancos que tu competidor puede explotar.'
                          : `Estás en posición #${d.posicion_mi_marca}. Así ve la IA a cada marca.`}
                      </p>
                    </div>
                  )
                })()}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {d.posicion_mi_marca === 0 && (
                    <div className="md:col-span-2 flex items-start gap-2.5 px-3 py-2.5 rounded-sm bg-rose-950/20 border border-rose-500/30 mb-1">
                      <TriangleAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <p className="text-rose-300 text-xs leading-snug">
                        <span className="font-bold">No existes para la IA.</span> Cada búsqueda de este tipo redirige al usuario directamente a la competencia.
                      </p>
                    </div>
                  )}
                  <div className="border border-slate-700/40 bg-slate-800/20 rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
                        {d.posicion_mi_marca === 0
                          ? 'Cómo te percibe la IA'
                          : d.posicion_mi_marca === 1
                          ? 'Tus atributos que no diferencian'
                          : 'Lo que la IA asocia contigo'}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {(d.percepciones_genericas?.length > 0
                        ? d.percepciones_genericas
                        : ['Analizando…']
                      ).map((c, idx) => (
                        <div key={idx} className="flex items-start gap-2 px-3 py-1.5 bg-slate-800/50 rounded-sm">
                          <span className="text-slate-600 text-xs mt-0.5 shrink-0">✕</span>
                          <p className="text-slate-400 text-xs">{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-emerald-800/30 bg-emerald-950/10 rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
                        Lo que tú no comunicas y {d.posicion_mi_marca === 1 ? 'podrían usar en tu contra' : 'el ganador sí'}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {(d.conceptos_faltantes?.length > 0
                        ? d.conceptos_faltantes
                        : ['Analizando…']
                      ).map((c, idx) => (
                        <div key={idx} className="flex items-start gap-2 px-3 py-1.5 bg-emerald-950/30 rounded-sm">
                          <span className="text-emerald-500 text-xs mt-0.5 shrink-0">+</span>
                          <p className="text-slate-200 text-xs">{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tabla de Ventajas del Competidor */}
                {d.competitor_advantage && d.competitor_advantage.filas.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                        Por qué la IA prefiere a <span className="text-rose-400">{d.competitor_advantage.rival}</span>
                      </p>
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-800/60 px-2 py-0.5 rounded">Análisis de Ventaja Competitiva</span>
                    </div>
                    <div className="overflow-x-auto rounded-sm border border-slate-800">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 bg-slate-800/50">
                            <th className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wider w-[30%]">Atributo Ganador</th>
                            <th className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wider w-[35%]">Fuente de Verdad IA</th>
                            <th className="text-left px-4 py-2.5 text-slate-400 font-semibold uppercase tracking-wider w-[35%]">Gap de {d.competitor_advantage.nuestra_marca}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {d.competitor_advantage.filas.map((fila, i) => (
                            <tr key={i} className={`border-b border-slate-800/60 ${i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-950'}`}>
                              <td className="px-4 py-3 text-slate-200 font-medium leading-snug">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 shrink-0 align-middle" />
                                {fila.atributo_ganador}
                              </td>
                              <td className="px-4 py-3 text-slate-400 leading-snug">{fila.fuente_de_verdad}</td>
                              <td className="px-4 py-3 leading-snug">
                                <span className="text-amber-400">{fila.gap_nuestra_marca}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {d.competitor_advantage.conclusion && (
                      <div className="mt-3 flex items-start gap-2 px-4 py-3 bg-amber-950/20 border border-amber-800/30 rounded-sm">
                        <span className="text-amber-500 text-sm shrink-0 mt-0.5">→</span>
                        <p className="text-amber-200/80 text-xs leading-relaxed">{d.competitor_advantage.conclusion}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* ─── FASE 2B: LA OPORTUNIDAD ────────────── */}

              {/* 4 · TERRITORIOS DESATENDIDOS */}
              {d.territorios_desatendidos && d.territorios_desatendidos.length > 0 && (
                <motion.div
                  id="zone-territorios"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-slate-800 rounded-sm p-6"
                >
                  <h3 className="text-sm font-semibold text-slate-100 mb-0.5">Territorios desatendidos</h3>
                  <p className="text-slate-500 text-xs mb-5">Temas emergentes donde tu marca no tiene presencia. Validados con Google Trends.</p>
                  <div className="space-y-3">
                    {d.territorios_desatendidos.map((t, idx) => {
                      const esAlza = t.crecimiento_trends?.startsWith('+')
                      const esBaja = t.crecimiento_trends?.startsWith('-')
                      return (
                        <div key={idx} className="flex items-start gap-4 bg-slate-800/30 border border-slate-700/40 rounded-sm px-4 py-3.5">
                          <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-slate-100 text-sm font-semibold">{t.topico_emergente}</p>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                t.nivel_oportunidad === 'Alto'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                              }`}>
                                {t.nivel_oportunidad}
                              </span>
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                                esAlza ? 'bg-emerald-500/10 text-emerald-400' : esBaja ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-700/50 text-slate-400'
                              }`}>
                                📈 {t.crecimiento_trends || 'Buscando datos...'}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs mt-1">{t.porque_es_oportunidad}</p>
                            <p className="text-slate-600 text-[11px] mt-1 italic">Intención: {t.intension_usuario}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* 5 · CÓMO BUSCAN EN GOOGLE */}
              {(trendsLoading || (trendsResult && trendsResult.length > 0)) && (
                <motion.div
                  id="zone-google-trends"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-slate-800 rounded-sm p-6"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 mb-0.5">
                        Así buscan en Google
                      </h3>
                      <p className="text-slate-500 text-xs">
                        Búsquedas reales de alta demanda en Chile relacionadas con las queries de tus usuarios sintéticos
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 px-2 py-1 rounded shrink-0">
                      Google Trends · CL
                    </span>
                  </div>

                  {trendsLoading && (
                    <div className="space-y-2">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 bg-slate-800/40 rounded-sm animate-pulse" style={{ width: `${85 - i * 10}%` }} />
                      ))}
                    </div>
                  )}

                  {!trendsLoading && trendsResult && trendsResult.length > 0 && (() => {
                    const maxValue = Math.max(...trendsResult.map(t => t.value), 1)
                    // Group by fuente query for context
                    const grouped: Record<string, typeof trendsResult> = {}
                    trendsResult.forEach(t => {
                      if (!grouped[t.fuente]) grouped[t.fuente] = []
                      grouped[t.fuente].push(t)
                    })

                    return (
                      <div className="space-y-1.5">
                        {trendsResult.map((item, idx) => {
                          const barWidth = Math.round((item.value / maxValue) * 100)
                          const isTop = idx === 0
                          return (
                            <div key={idx} className="flex items-center gap-3 group">
                              {/* Rank */}
                              <span className={`shrink-0 text-[10px] font-mono w-4 text-right ${isTop ? 'text-amber-400 font-bold' : 'text-slate-600'}`}>
                                {idx + 1}
                              </span>
                              {/* Query text */}
                              <div className="flex-1 min-w-0 relative">
                                <div
                                  className={`absolute inset-y-0 left-0 rounded-sm transition-all duration-500 ${
                                    isTop ? 'bg-amber-500/15' : 'bg-slate-700/25'
                                  }`}
                                  style={{ width: `${barWidth}%` }}
                                />
                                <div className="relative flex items-center justify-between gap-2 px-2.5 py-1.5">
                                  <span className={`text-xs truncate ${isTop ? 'text-amber-300 font-medium' : 'text-slate-300'}`}>
                                    {item.query}
                                  </span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className={`text-[10px] font-mono tabular-nums ${isTop ? 'text-amber-400' : 'text-slate-500'}`}>
                                      {item.value}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {/* Fuente */}
                              <span className="shrink-0 text-[9px] text-slate-700 max-w-[100px] truncate hidden md:block group-hover:text-slate-500 transition-colors" title={item.fuente}>
                                ← {item.fuente.split('?')[0].slice(0, 35)}{item.fuente.length > 35 ? '…' : ''}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}

                  {!trendsLoading && trendsResult && trendsResult.length === 0 && (
                    <p className="text-slate-600 text-xs py-2">Google Trends no devolvió datos para estas queries. Puede ser por volumen insuficiente o límite de tasa.</p>
                  )}

                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-800/60">
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <span className="w-2 h-2 rounded-sm bg-amber-500/40 shrink-0" /> #1 Mayor interés
                    </span>
                    <span className="text-[10px] text-slate-600">
                      Escala 0–100 relativa al pico del período (7 días)
                    </span>
                  </div>
                </motion.div>
              )}

              {/* 6 · PLAN DE ACCIÓN + BÚSQUEDAS */}
              {(discoveryLoading || discoveryResult) && (
              <motion.div
                id="zone-plan-recuperacion"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100">Qué hacer ahora</h3>
                    {discoveryLoading && (
                      <p className="text-slate-500 text-sm mt-0.5">Simulando búsquedas asociadas a &ldquo;{query}&rdquo;…</p>
                    )}
                    {discoveryResult && discoveryResult.oportunidades_auditadas.length > 0 && (() => {
                      const ops = discoveryResult.oportunidades_auditadas
                      const FAKE_SET = new Set(['múltiples competidores', 'empate técnico'])
                      const validOps = ops.filter(op => {
                        const g = op.resultado_auditoria.marca_ganadora
                        return !op.error && g && !FAKE_SET.has(g.toLowerCase())
                      })
                      const losses = validOps.filter(op => {
                        const pos = op.resultado_auditoria.posicion_mi_marca
                        return !(pos === 1 || pos === 2)
                      }).length
                      const valid = validOps.length
                      return (
                        <p className="text-slate-500 text-sm mt-0.5">
                          {valid === 0
                            ? `Simulamos ${ops.length} búsquedas sobre "${query}"`
                            : losses === 0
                            ? `Dominas las ${valid} búsquedas sobre "${query}"`
                            : losses === valid
                            ? `No apareces en ${valid} búsquedas sobre "${query}"`
                            : `Pierdes ${losses} de ${valid} búsquedas sobre "${query}"`
                          }
                        </p>
                      )
                    })()}
                  </div>
                  {(() => {
                    const p = d.posicion_mi_marca
                    const clasif = d.prioridad_ejecutiva?.clasificacion ?? (p === 0 || p > 5 ? 'Atacar' : p <= 2 ? 'Mantener' : 'Defender')
                    return (
                      <div className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                        clasif === 'Mantener'
                          ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/40'
                          : clasif === 'Defender'
                          ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40'
                          : 'bg-rose-950/40 text-rose-200 border-rose-500/30'
                      }`}>
                        {clasif === 'Mantener' ? 'MANTENER' : clasif === 'Defender' ? 'DEFENDER' : '⚠ INTERVENIR'}
                      </div>
                    )
                  })()}
                </div>

                {/* Búsquedas simuladas */}
                {discoveryResult && discoveryResult.oportunidades_auditadas.length > 0 && (() => {
                  const ops = discoveryResult.oportunidades_auditadas
                  const FAKE_SET = new Set(['múltiples competidores', 'empate técnico'])
                  const displayOps = ops.map(op => {
                    const g = op.resultado_auditoria.marca_ganadora
                    const isFake = !g || FAKE_SET.has(g.toLowerCase())
                    const hasError = !!op.error
                    const pos = op.resultado_auditoria.posicion_mi_marca
                    const isWin = !hasError && !isFake && (pos === 1 || pos === 2)
                    const ganador = (!hasError && !isFake) ? g! : null
                    return { ...op, ganador, isWin, hasError, isFake }
                  })

                  return (
                    <div className="px-6 pb-3 space-y-2">
                      {displayOps.map((op, idx) => {
                        const arquetipo = op.arquetipo || `Perfil ${idx + 1}`
                        const nombre = arquetipo.replace(/^El\s+/i, '').split('/')[0].trim()
                        const iconos = ['💰', '🛡️', '⚡']
                        const raw = op.pregunta_generada
                        const firstQ = raw.indexOf('?')
                        const preguntaCorta = firstQ > 0 ? raw.slice(0, firstQ + 1) : raw
                        const esMiMarca = op.ganador?.toLowerCase() === brand.toLowerCase()

                        return (
                          <div
                            key={idx}
                            className={`rounded-sm border px-4 py-3 ${
                              op.isWin
                                ? 'bg-emerald-950/10 border-emerald-900/20'
                                : op.ganador
                                ? 'bg-slate-950/40 border-rose-900/15'
                                : 'bg-amber-950/10 border-amber-800/20'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <p className="text-slate-500 text-xs mb-1">
                                  {iconos[idx] || '👤'} {nombre}
                                  {op.necesidad_principal && <span className="text-slate-600"> · {op.necesidad_principal.split(',')[0]}</span>}
                                </p>
                                <p className="text-slate-200 text-sm leading-relaxed">{preguntaCorta}</p>
                              </div>
                              <div className="shrink-0 text-right mt-0.5">
                                {op.ganador ? (
                                  <span className={`text-sm font-semibold ${esMiMarca ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {esMiMarca ? `✓ ${brand}` : op.ganador}
                                  </span>
                                ) : (
                                  <div className="flex flex-col items-end">
                                    <span className="text-amber-400 text-xs font-semibold">Territorio libre</span>
                                    <span className="text-slate-600 text-[10px]">Ninguna marca satisface</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}

                <div className="p-5">
                  {discoveryLoading ? (
                    <div className="space-y-3 py-2">
                      {[0, 1, 2].map((i) => (
                        <div key={`action-skel-${i}`} className="h-12 bg-slate-800/40 rounded-sm animate-pulse" />
                      ))}
                    </div>
                  ) : d.plan_accion?.vehiculos && d.plan_accion.vehiculos.some(v => v.acciones.length > 0) ? (
                    (() => {
                      const allActions = d.plan_accion!.vehiculos
                        .flatMap(v => v.acciones)
                        .sort((a, b) => b.ice_score - a.ice_score)
                      // Group by area
                      const grouped: Record<string, typeof allActions> = {}
                      allActions.forEach(a => {
                        const area = a.area_responsable || 'Equipo'
                        if (!grouped[area]) grouped[area] = []
                        grouped[area].push(a)
                      })
                      const areaOrder = Object.keys(grouped).sort((a, b) => {
                        const maxA = Math.max(...grouped[a].map(x => x.ice_score))
                        const maxB = Math.max(...grouped[b].map(x => x.ice_score))
                        return maxB - maxA
                      })
                      const areaConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
                        'Marketing / Contenido': {
                          icon: <Megaphone className="w-3.5 h-3.5" />,
                          label: 'Contenido',
                          color: 'text-violet-400 bg-violet-500/10 border-violet-500/20'
                        },
                        'TI / Desarrollo': {
                          icon: <Code2 className="w-3.5 h-3.5" />,
                          label: 'Técnico',
                          color: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                        },
                        'PR / Agencia': {
                          icon: <Globe className="w-3.5 h-3.5" />,
                          label: 'PR & Medios',
                          color: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
                        },
                      }
                      return (
                        <div className="space-y-4">
                          {areaOrder.map(area => {
                            const cfg = areaConfig[area] || { icon: null, label: area, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' }
                            return (
                              <div key={area}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}>
                                    {cfg.icon} {cfg.label}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {grouped[area].map((a, ai) => {
                                    const globalIdx = allActions.indexOf(a) + 1
                                    return (
                                      <div
                                        key={`action-${area}-${ai}`}
                                        className="flex items-start gap-4 px-4 py-3 border border-slate-700/40 rounded-sm bg-slate-800/20 hover:bg-slate-800/40 cursor-pointer transition-colors"
                                        onClick={() => { setActiveModal(a); setShowModalCode(false) }}
                                      >
                                        <span className={`text-sm font-mono tabular-nums mt-0.5 shrink-0 w-5 font-bold ${globalIdx === 1 ? 'text-amber-400' : globalIdx === 2 ? 'text-slate-300' : 'text-slate-500'}`}>{globalIdx}.</span>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-slate-200 text-sm leading-relaxed">
                                            <span className="text-white font-medium">{a.concepto_objetivo}</span>
                                          </p>
                                          <p className="text-slate-500 text-xs mt-0.5">{a.tactica_tecnica}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                                            a.ice_score >= 7 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : a.ice_score >= 5 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                          }`}>{a.ice_score}</span>
                                          <span className="text-slate-600 text-xs">→</span>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })()
                  ) : (
                    <p className="text-slate-500 text-sm py-4">Ejecuta un análisis para ver las acciones recomendadas.</p>
                  )}
                </div>

                {/* ROI + CTA */}
                {!discoveryLoading && (
                <div className="border-t border-slate-800/50 px-6 py-5">
                  {d.plan_accion?.roi_estimado && (
                    <div className="flex items-start gap-3 mb-5 px-4 py-3 bg-emerald-950/20 border border-emerald-900/20 rounded-sm">
                      <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm leading-relaxed">{d.plan_accion.roi_estimado}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3">
                      <button
                        id="btn-export-json"
                        onClick={downloadJSON}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700 text-slate-400 text-sm transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Exportar
                      </button>
                      <button
                        id="btn-agendar-validacion"
                        onClick={() => setShowScheduleModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
                      >
                        <TrendingUp className="w-3.5 h-3.5" /> Agendar validación
                      </button>
                  </div>
                </div>
                )}
              </motion.div>
              )}

            </motion.div>
          )}

          {/* FAQ GEO */}
          <section id="faq-geo" className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-slate-200 mb-2">Preguntas Frecuentes sobre AI Visibility y GEO</h2>
            <p className="text-slate-500 text-sm mb-10">Respuestas directas sobre Generative Engine Optimization, Share of Model y visibilidad en LLMs.</p>
            <div className="space-y-8">
              {[
                {
                  q: '¿Qué es Generative Engine Optimization (GEO)?',
                  a: 'Generative Engine Optimization (GEO) es el proceso técnico y estratégico de optimizar la presencia de una marca para que sea recomendada por modelos de lenguaje de gran escala (LLMs) y motores de respuesta generativa, como ChatGPT, Perplexity, Claude y Gemini. A diferencia del SEO, GEO se enfoca en entidades, contexto semántico y recuperación de información (RAG).'
                },
                {
                  q: '¿Cuál es la diferencia entre SEO y GEO?',
                  a: 'El SEO tradicional (Search Engine Optimization) busca posicionar enlaces en una lista de resultados de Google basándose en palabras clave. El GEO busca posicionar tu marca como la "respuesta definitiva" dentro de un texto conversacional generado por Inteligencia Artificial, donde no hay listas de enlaces, sino una única recomendación directa.'
                },
                {
                  q: '¿Cómo evalúa AI Visibility mi presencia en la IA?',
                  a: 'AI Visibility realiza auditorías automatizadas simulando las consultas que harían tus clientes ideales (arquetipos). Nuestra plataforma consulta a los principales LLMs en tiempo real y extrae métricas clave: si tu marca es mencionada, el análisis de sentimiento de esa mención, tu porcentaje de visibilidad y qué competidor está dominando las respuestas.'
                },
                {
                  q: '¿Qué es el Share of Model (SoM)?',
                  a: 'El Share of Model (SoM) es la métrica de nueva generación que reemplaza al "Share of Voice". Representa el porcentaje exacto de veces que un modelo de inteligencia artificial cita a tu marca en comparación con tus competidores directos cuando se le pregunta sobre tu industria, productos o servicios.'
                },
                {
                  q: '¿Por qué mi marca no aparece en ChatGPT o Perplexity?',
                  a: 'Los LLMs construyen sus respuestas basándose en sus datos de entrenamiento y en fuentes indexadas en tiempo real. Si tu marca no aparece, se debe a una falta de densidad de entidades, ausencia en fuentes de alta autoridad (medios, foros técnicos) o a la carencia de datos estructurados legibles para máquinas en tu propio sitio web.'
                }
              ].map((item, i) => (
                <div key={i} className="border-l-2 border-slate-700 pl-6">
                  <h3 className="text-slate-200 font-semibold text-base mb-2">{item.q}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FOOTER */}
          {result && (
            <motion.div
              id="zone-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="border-t border-slate-800 bg-slate-950 p-8 mt-10"
            >
              <div className="max-w-5xl mx-auto">
                <p className="text-slate-600 text-xs uppercase tracking-widest font-semibold mb-4">Metodología y Fuentes</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Motor de Inteligencia</p>
                    <p className="text-slate-700 text-xs font-mono leading-relaxed">• OpenAI GPT-4o-mini<br />• Análisis Multimodelo<br />• Contexto Regional Chile</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Fuentes de Verdad</p>
                    <p className="text-slate-700 text-xs font-mono leading-relaxed">• Google Trends RT (CL)<br />• SERP Data en Tiempo Real<br />• Índice de Menciones IA</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-wide mb-2">Metodología</p>
                    <p className="text-slate-700 text-xs font-mono leading-relaxed">• Synthetic Users Simulation<br />• Score 0–100 Normalizado<br />• PAS: Problema → Solución</p>
                  </div>
                </div>
                <p className="text-slate-800 text-[10px] font-mono mt-6">Datos actualizados: {new Date().toLocaleString('es-CL')}</p>
              </div>
              <div className="border-t border-slate-900 mt-8 pt-6">
                <p className="text-slate-800 text-[10px] leading-relaxed max-w-3xl">
                  AI Visibility es una plataforma especializada en Generative Engine Optimization (GEO). Nuestra tecnología permite a las empresas auditar su Share of Model (SoM), una métrica crítica que mide el porcentaje de menciones de una marca en las respuestas de modelos de lenguaje de gran escala (LLM). A diferencia del SEO de Google, AI Visibility se enfoca en la arquitectura de recuperación de información (RAG) y en cómo los agentes de IA sintetizan la reputación corporativa en entornos conversacionales.
                </p>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
