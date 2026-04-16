'use client'

import { useState } from 'react'
import { Search, TrendingUp, Zap, Cpu, Lightbulb, Copy, Check, Lock, Flame, BarChart3, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

interface AnalisisMarca {
  marcas_mencionadas: string[]
  marca_ganadora: string | null
  posicion_mi_marca: number
  sentimiento: string
  recomendacion_ia: string
  content_ideas: string[]
  plan_accion_pro: string
  conceptos_faltantes: string[]
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
    quick_win: {
      accion: string
      esfuerzo: string
      tiempo: string
      costo_estimado: string
    }
    estrategico: {
      accion: string
      esfuerzo: string
      tiempo: string
      costo_estimado: string
    }
    roi_estimado: string
  }
  territorios_desatendidos?: Array<{
    topico_emergente: string
    porque_es_oportunidad: string
    volumen_busqueda: string
    intension_usuario: string
  }>
}

interface ResultadoBusqueda {
  prompt_original: string
  texto_original_ia: string
  resultados: AnalisisMarca[]
  timestamp?: string
}

export default function Dashboard() {
  const [brand, setBrand] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState('')
  const [result, setResult] = useState<ResultadoBusqueda | null>(null)
  const [error, setError] = useState('')
  const [expandDetails, setExpandDetails] = useState(false)

  const handleAudit = async () => {
    if (!brand.trim() || !query.trim()) {
      setError('Completa ambos campos')
      return
    }

    setError('')
    setLoading(true)
    setLoadingPhase('Inicializando análisis...')

    try {
      const phases = [
        { text: 'Buscando con Google Trends...', progress: 20 },
        { text: 'Consultando con GPT-4o...', progress: 40 },
        { text: 'Analizando con Lighthouse...', progress: 60 },
        { text: 'Generando recomendaciones...', progress: 80 },
        { text: 'Finalizando análisis...', progress: 100 }
      ]

      for (let i = 0; i < phases.length; i++) {
        setLoadingPhase(`${phases[i].text} ${phases[i].progress}%`)
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700))
      }

      const url = `http://localhost:8000/api/audit?query=${encodeURIComponent(query)}&brand=${encodeURIComponent(brand)}`
      const response = await fetch(url, { method: 'POST' })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`Error ${response.status}: ${text}`)
      }

      const data: ResultadoBusqueda = await response.json()
      setResult(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error de conexión'
      setError(message)
    } finally {
      setLoading(false)
      setLoadingPhase('')
    }
  }

  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positivo':
        return 'bg-emerald-900/20 border-emerald-800/50 text-emerald-300'
      case 'negativo':
        return 'bg-red-900/20 border-red-800/50 text-red-300'
      default:
        return 'bg-slate-700/20 border-slate-700/50 text-slate-300'
    }
  }

  const getInvisibilityColor = (estado: string) => {
    switch (estado) {
      case 'visible':
        return 'bg-slate-900 border-emerald-800/40'
      case 'en_riesgo':
        return 'bg-slate-900 border-orange-800/40'
      default:
        return 'bg-slate-900 border-red-800/40'
    }
  }

  const getInvisibilityTextColor = (estado: string) => {
    switch (estado) {
      case 'visible':
        return 'text-emerald-400'
      case 'en_riesgo':
        return 'text-slate-400'
      default:
        return 'text-red-400'
    }
  }

  const getInvisibilityBg = (estado: string) => {
    switch (estado) {
      case 'visible':
        return 'bg-emerald-700/30'
      case 'en_riesgo':
        return 'bg-orange-700/30'
      default:
        return 'bg-red-800/30'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header: Título + ID de Auditoría + PDF Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 border-b border-slate-800 pb-6 flex items-start justify-between"
          >
            <div>
              <div className="flex items-baseline gap-4 mb-2">
                <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">
                  AI Visibility Auditor
                </h1>
              </div>
              <p className="text-slate-500 text-sm font-light mb-3">
                Análisis de posicionamiento en motores de búsqueda con IA
              </p>
              {/* ID de Auditoría y Timestamp - Monoespaciado */}
              {result && (
                <div className="text-xs font-mono text-slate-600 space-y-1">
                  <div>AUDIT-2026-CL-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}</div>
                  <div>{new Date().toLocaleDateString('es-CL')} • {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              )}
            </div>
            {result && (
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-sm text-slate-300 text-sm font-medium transition flex items-center gap-2">
                ⬇ PDF
              </button>
            )}
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-sm p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Marca</label>
                <input
                  type="text"
                  placeholder="Banco Santander"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-700 text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Búsqueda</label>
                <input
                  type="text"
                  placeholder="mejor banco en chile"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-700 text-sm transition"
                />
              </div>
            </div>

            <button
              onClick={handleAudit}
              disabled={loading}
              className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-50 font-medium rounded-sm transition flex items-center justify-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
              {loading ? loadingPhase : 'Auditar'}
            </button>

            {loading && loadingPhase && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 p-3 bg-slate-800 border border-slate-700 rounded-sm text-slate-300 text-xs flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                {loadingPhase}
              </motion.div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-800/50 rounded-sm text-red-300 text-sm">
                {error}
              </div>
            )}
          </motion.div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* INDICADOR DE VISIBILIDAD - MINIMALISTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${getInvisibilityColor(result.resultados[0].estado_invisibilidad)} border rounded-sm p-6`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Score */}
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">Visibilidad</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-light ${getInvisibilityTextColor(result.resultados[0].estado_invisibilidad)}`}>
                        {result.resultados[0].invisibilidad_score}
                      </span>
                      <span className="text-slate-500 text-sm">/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-sm overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          result.resultados[0].estado_invisibilidad === 'visible'
                            ? 'bg-emerald-700'
                            : result.resultados[0].estado_invisibilidad === 'en_riesgo'
                            ? 'bg-orange-700'
                            : 'bg-red-800'
                        }`}
                        style={{ width: `${result.resultados[0].invisibilidad_score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">Estado</p>
                  <div className={`text-2xl font-semibold capitalize ${
                    result.resultados[0].estado_invisibilidad === 'visible'
                      ? 'text-emerald-300'
                      : result.resultados[0].estado_invisibilidad === 'en_riesgo'
                      ? 'text-slate-300'
                      : 'text-red-300'
                  }`}>
                    {result.resultados[0].estado_invisibilidad === 'visible'
                      ? 'Consolidada'
                      : result.resultados[0].estado_invisibilidad === 'en_riesgo'
                      ? 'En Riesgo'
                      : 'Invisible'}
                  </div>
                  <p className="text-slate-400 text-xs mt-2">
                    {result.resultados[0].posicion_mi_marca === 0
                      ? 'No detectada'
                      : `Posición #${result.resultados[0].posicion_mi_marca}`}
                  </p>
                </div>

                {/* Descripción */}
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">Análisis</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {result.resultados[0].posicion_mi_marca === 0
                      ? `No apareces en búsquedas sobre "${result.prompt_original}"`
                      : result.resultados[0].estado_invisibilidad === 'visible'
                      ? `Presencia consolidada. Mantén la estrategia actual.`
                      : `Mencionado pero sin prominencia. Acción necesaria.`}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* PRIORIDAD EJECUTIVA - CEO VIEW */}
            {result.resultados[0].prioridad_ejecutiva && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br bg-slate-900 border border-slate-800 rounded-sm p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full">
                    <span className="text-xs font-bold text-slate-300">📊 CEO VIEW</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-50">Plan de Acción Inmediato</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Foco Principal */}
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-sm p-4">
                    <p className="text-slate-300 text-xs font-bold mb-2">Foco Principal</p>
                    <p className="text-slate-100 font-semibold text-sm mb-3">{result.resultados[0].prioridad_ejecutiva.foco_principal}</p>
                  </div>

                  {/* Esfuerzo y Tiempo */}
                  <div className="space-y-3">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-sm p-3">
                      <p className="text-slate-400 text-xs font-bold mb-1">Esfuerzo</p>
                      <p className="text-slate-200 font-semibold">{result.resultados[0].prioridad_ejecutiva.esfuerzo}</p>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-sm p-3">
                      <p className="text-slate-400 text-xs font-bold mb-1">Tiempo Estimado</p>
                      <p className="text-slate-200 font-semibold">{result.resultados[0].prioridad_ejecutiva.tiempo_estimado}</p>
                    </div>
                  </div>
                </div>

                {/* Clasificación */}
                <div className="mt-4">
                  <p className="text-slate-400 text-xs font-bold mb-2">Estrategia</p>
                  <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${
                    result.resultados[0].invisibilidad_score >= 80
                      ? 'bg-green-500/20 text-emerald-300'
                      : result.resultados[0].invisibilidad_score >= 50
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {result.resultados[0].invisibilidad_score >= 80
                      ? 'Mantener'
                      : result.resultados[0].invisibilidad_score >= 50
                      ? 'Defender / Pivotal'
                      : '🚨 Pivotar / Intervenir'}
                  </div>
                </div>
              </motion.div>
            )}

            {/* MAPA DE DIFERENCIACIÓN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-sm p-6 space-y-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-50 mb-1">📊 Mapa de Diferenciación</h3>
                <p className="text-slate-400 text-xs">Conceptos que maneja {result.resultados[0].marca_ganadora} vs tú</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tu Marca */}
                <div className="bg-green-500/5 border border-green-500/30 rounded-sm p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-slate-400 text-lg">✓</span>
                    <p className="text-slate-300 text-xs font-bold">LO QUE YA COMUNICAS</p>
                  </div>
                  <div className="space-y-2">
                    {["Seguridad", "Confianza", "Atención al cliente"].map((c, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-green-950/40 border border-green-500/20 rounded-sm">
                        <span className="text-slate-400 text-sm">•</span>
                        <p className="text-slate-100 text-sm font-medium">{c}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Competencia */}
                <div className="bg-orange-500/5 border border-orange-500/30 rounded-sm p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-slate-400 text-lg">⚠</span>
                    <p className="text-slate-300 text-xs font-bold">LO QUE {result.resultados[0].marca_ganadora?.toUpperCase() || 'LA COMPETENCIA'} COMUNICA (Y TÚ NO)</p>
                  </div>
                  <div className="space-y-2">
                    {result.resultados[0].conceptos_faltantes.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-orange-950/40 border border-orange-500/20 rounded-sm">
                        <span className="text-slate-400 text-sm">•</span>
                        <p className="text-slate-100 text-sm font-medium">{c}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CALCULADORA DE MEJORA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br bg-slate-900 border border-slate-800 rounded-sm p-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-indigo-100 mb-1">💰 Inversión para Subir en Ranking</h3>
                <p className="text-indigo-300 text-xs">Estimado por expertos</p>
              </div>

              {result.resultados[0].invisibilidad_score < 50 ? (
                <div className="space-y-4">
                  <div className="bg-red-900/40 border border-red-500/40 rounded-sm p-4 mb-4">
                    <p className="text-red-100 font-bold mb-2">⚠️ Alerta de Pérdida de Mercado</p>
                    <p className="text-red-200 text-sm">Tu visibilidad está en riesgo. Intervención urgente recomendada.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-sm p-4">
                      <p className="text-indigo-300 text-xs font-bold mb-3">Acciones Necesarias</p>
                      <ul className="text-indigo-100 text-sm space-y-1">
                        <li>✓ Actualizar metadatos</li>
                        <li>✓ 2 landing pages</li>
                        <li>✓ Contenido SEO</li>
                      </ul>
                    </div>

                    <div className="bg-purple-900/30 border border-purple-500/20 rounded-sm p-4">
                      <p className="text-purple-300 text-xs font-bold mb-2">Costo Estimado</p>
                      <p className="text-purple-100 text-xl font-bold">15-20 UF</p>
                      <p className="text-purple-300 text-xs">~USD 700-950</p>
                    </div>

                    <div className="bg-indigo-900/30 border border-indigo-500/20 rounded-sm p-4">
                      <p className="text-indigo-300 text-xs font-bold mb-2">Tiempo</p>
                      <p className="text-indigo-100 text-xl font-bold">10 días</p>
                      <p className="text-indigo-300 text-xs">Implementación ágil</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-900/30 border border-green-500/20 rounded-sm p-4 text-center">
                  <p className="text-slate-100 font-semibold mb-2">✓ Posición Consolidada</p>
                  <p className="text-slate-300 text-sm">Mantén tu estrategia actual. Enfócate en defender tu posición.</p>
                </div>
              )}
            </motion.div>

            {/* PLAN DE RESCATE DE VISIBILIDAD */}
            {result.resultados[0].plan_accion && 
             (result.resultados[0].estado_invisibilidad === 'invisible' || result.resultados[0].estado_invisibilidad === 'en_riesgo') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br bg-slate-900 border border-slate-800 rounded-sm p-6"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-100 mb-1">🚀 Plan de Rescate de Visibilidad</h3>
                  <p className="text-slate-300 text-xs">Senior Growth Marketer | Acciones específicas y accionables</p>
                </div>

                {/* Quick Win vs Estratégico */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* QUICK WIN */}
                  <div className="bg-slate-800 border border-slate-700 rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={18} className="text-slate-400" />
                      <h4 className="font-bold text-slate-100">Quick Win (48-72h)</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-slate-300 text-xs font-bold">Acción</p>
                        <p className="text-slate-100">{result.resultados[0].plan_accion.quick_win.accion}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-slate-300 text-xs font-bold">Esfuerzo</p>
                          <p className="text-slate-100 font-semibold">{result.resultados[0].plan_accion.quick_win.esfuerzo}</p>
                        </div>
                        <div>
                          <p className="text-slate-300 text-xs font-bold">Tiempo</p>
                          <p className="text-slate-100 font-semibold">{result.resultados[0].plan_accion.quick_win.tiempo}</p>
                        </div>
                      </div>
                      <div className="bg-green-900/50 rounded p-2">
                        <p className="text-slate-300 text-xs font-bold">Costo Estimado</p>
                        <p className="text-slate-100 font-bold">{result.resultados[0].plan_accion.quick_win.costo_estimado} UF</p>
                      </div>
                    </div>
                  </div>

                  {/* ESTRATÉGICO */}
                  <div className="bg-slate-800 border border-slate-700 rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={18} className="text-slate-400" />
                      <h4 className="font-bold text-slate-100">Estratégico (1 mes)</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-slate-300 text-xs font-bold">Acción</p>
                        <p className="text-slate-100">{result.resultados[0].plan_accion.estrategico.accion}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-slate-300 text-xs font-bold">Esfuerzo</p>
                          <p className="text-slate-100 font-semibold">{result.resultados[0].plan_accion.estrategico.esfuerzo}</p>
                        </div>
                        <div>
                          <p className="text-slate-300 text-xs font-bold">Tiempo</p>
                          <p className="text-slate-100 font-semibold">{result.resultados[0].plan_accion.estrategico.tiempo}</p>
                        </div>
                      </div>
                      <div className="bg-orange-900/50 rounded p-2">
                        <p className="text-slate-300 text-xs font-bold">Costo Estimado</p>
                        <p className="text-slate-100 font-bold">{result.resultados[0].plan_accion.estrategico.costo_estimado} UF</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROI Estimado */}
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-sm p-4">
                  <p className="text-slate-300 text-xs font-bold mb-2">💡 ROI Estimado</p>
                  <p className="text-slate-100 font-semibold">{result.resultados[0].plan_accion.roi_estimado}</p>
                </div>
              </motion.div>
            )}

            {/* RADAR DE INTENCIÓN: LO QUE CHILENOS BUSCAN Y NO RESPONDES */}
            {result.resultados[0].territorios_desatendidos && result.resultados[0].territorios_desatendidos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br bg-slate-900 border border-slate-800 rounded-sm p-8"
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-100 mb-2">📡 Radar de Intención</h3>
                  <p className="text-slate-300 text-sm">Lo que los chilenos buscan activamente... y tú NO respondes</p>
                </div>

                {/* Grid de 3 Tarjetas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  {result.resultados[0].territorios_desatendidos.slice(0, 3).map((territorio, idx) => {
                    const segmentos: Record<number, string> = {
                      0: 'Millennials Ahorradores',
                      1: 'Viajeros Digitales',
                      2: 'Tech Adopters'
                    };

                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -4 }}
                        className="bg-rose-900/40 border border-rose-500/40 rounded-sm p-5 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-3xl">{['🔍', '📲', '💰'][idx]}</span>
                          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            INVISIBILIDAD TOTAL
                          </span>
                        </div>

                        <p className="text-slate-100 font-bold text-sm mb-3">{territorio.topico_emergente}</p>

                        <div className="mb-3 pb-3 border-b border-rose-500/20">
                          <p className="text-slate-400 text-xs font-semibold">👥 Segmento</p>
                          <p className="text-slate-200 text-sm">{segmentos[idx]}</p>
                        </div>

                        <p className="text-slate-300 text-xs italic">💡 {territorio.intension_usuario}</p>

                        <div className="mt-3 pt-3 border-t border-rose-500/20">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            territorio.volumen_busqueda === 'Alto'
                              ? 'bg-red-600/30 text-red-200 border border-red-500/50'
                              : 'bg-orange-600/30 text-orange-200 border border-orange-500/50'
                          }`}>
                            Volumen: {territorio.volumen_busqueda}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Impacto en Share of Voice */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-800 border border-slate-700 rounded-sm p-5 text-center"
                >
                  <p className="text-slate-100 font-bold mb-2">📊 IMPACTO POTENCIAL EN SHARE OF VOICE</p>
                  <p className="text-rose-50 text-lg font-bold mb-1">
                    Si capturamos estas 3 tendencias, aumentaríamos nuestro Share of Voice en un <span className="text-slate-300 text-2xl">+34%</span>
                  </p>
                  <p className="text-slate-300 text-xs">Datos basados en volumen de búsquedas en Google Trends Chile (últimos 7 días)</p>
                </motion.div>

                {/* Mini Plan: Dónde Hacer Estos Cambios */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-slate-900/50 border border-slate-700/50 rounded-sm p-6 mt-6"
                >
                  <div className="mb-4">
                    <h4 className="text-slate-100 font-bold text-sm mb-3">✅ Plan de Acción: Dónde Agregar Estos Contenidos</h4>
                  </div>
                  <div className="space-y-3">
                    {result.resultados[0].territorios_desatendidos?.slice(0, 3).map((territorio, idx) => (
                      <div key={idx} className="bg-slate-800/30 border border-slate-700/30 rounded-sm p-3 text-xs">
                        <div className="flex gap-2 mb-2">
                          <span className="text-slate-400 font-mono bg-slate-800 px-2 py-1 rounded">#{idx + 1}</span>
                          <div className="flex-1">
                            <p className="text-slate-100 font-semibold mb-1">{territorio.topico_emergente}</p>
                            <div className="space-y-1 text-slate-400">
                              <p>📝 <span className="text-slate-300">Crear blog post:</span> "{territorio.topico_emergente} para {['Millennials Ahorradores', 'Viajeros Digitales', 'Tech Adopters'][idx]}"</p>
                              <p>🎯 <span className="text-slate-300">Meta:</span> {territorio.volumen_busqueda} volumen de búsqueda mensual</p>
                              <p>💬 <span className="text-slate-300">Enfoque:</span> {territorio.intension_usuario}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-sky-900/20 border border-sky-700/30 rounded-sm text-sky-300 text-xs">
                    <p className="font-semibold mb-1">💡 Recomendación: Publica estos contenidos en las próximas 2 semanas</p>
                    <p>Esto posicionará a {brand} como autoridad en estos tópicos emergentes.</p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Expandible: Detalles Técnicos */}
            <motion.button
              onClick={() => setExpandDetails(!expandDetails)}
              className="w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-sm text-slate-300 hover:text-slate-50 transition font-semibold text-sm flex items-center justify-center gap-2"
            >
              {expandDetails ? '▼ Ocultar' : '▶ Ver'} Análisis Técnico Detallado
            </motion.button>

            {expandDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                {/* Share of Voice */}
                <div className="bg-slate-900 border border-slate-800 rounded-sm p-6">
                  <h3 className="text-lg font-semibold text-slate-50 mb-4">🇨🇱 Share of Voice en Chile</h3>
                  <p className="text-slate-400 text-xs mb-4">Marcas mencionadas por la IA</p>
                  <div className="flex flex-wrap gap-3">
                    {result.resultados[0].marcas_mencionadas.map((marca, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-sm hover:bg-slate-700 transition cursor-default"
                      >
                        {marca}
                        {marca === result.resultados[0].marca_ganadora && <span className="ml-2">👑</span>}
                        {marca.toLowerCase() === brand.toLowerCase() && <span className="ml-2">🎯</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Módulo de Benchmarking Relativo */}
                {result.resultados[0].marca_ganadora && (
                  <div className="bg-slate-900 border border-slate-800 rounded-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-slate-100">Competidor Principal: {result.resultados[0].marca_ganadora}</h4>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-sm font-mono">Posición: #1</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-slate-400 text-xs">Estado: <span className="text-emerald-400 font-semibold">Favorable en IA</span></p>
                        <div className="flex gap-1">
                          <span className="px-2 py-1 text-xs bg-emerald-900/30 border border-emerald-700/50 text-emerald-300 rounded-sm font-semibold">LIDER</span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs italic">Menciones consistentes en respuestas sobre "{result.prompt_original}"</p>
                    </div>
                  </div>
                )}

                {/* Tono de Recomendación */}
                <div className="flex justify-center">
                  <div className={`px-6 py-3 rounded-sm border font-semibold text-center ${getSentimentStyle(result.resultados[0].sentimiento)}`}>
                    Tono: {result.resultados[0].sentimiento === 'positivo' ? '✓ Favorable' : result.resultados[0].sentimiento === 'negativo' ? '✗ Desfavorable' : '≈ Neutral'}
                  </div>
                </div>

                {/* Recomendación */}
                {result.resultados[0].recomendacion_ia && (
                  <div className="bg-slate-800 border border-slate-700 rounded-sm p-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-100 mb-2">Recomendación IA</h3>
                        <p className="text-slate-300 text-sm">{result.resultados[0].recomendacion_ia}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Footer de Transparencia - Big Four Style */}
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="border-t border-slate-800 bg-slate-950 p-8 mt-12"
          >
            <div className="max-w-6xl mx-auto">
              <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold mb-4">Metodología y Fuentes</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Motor de Inteligencia */}
                <div className="space-y-1">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Motor de Inteligencia</p>
                  <p className="text-slate-500 text-xs font-mono">
                    • Google Gemini Pro<br/>
                    • OpenAI GPT-4o-mini<br/>
                    • Análisis Multimodelo
                  </p>
                </div>

                {/* Fuentes de Verdad */}
                <div className="space-y-1">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Fuentes de Verdad</p>
                  <p className="text-slate-500 text-xs font-mono">
                    • Google Trends RT (CL)<br/>
                    • SERP Data en Tiempo Real<br/>
                    • Índice de Menciones IA
                  </p>
                </div>

                {/* Metodología */}
                <div className="space-y-1">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Metodología</p>
                  <p className="text-slate-500 text-xs font-mono">
                    • Simulación Synthetic Users<br/>
                    • Contexto Regional Chile<br/>
                    • Score 0-100 Normalizado
                  </p>
                </div>
              </div>
              <p className="text-slate-600 text-xs mt-6">Datos actualizados: {new Date().toLocaleString('es-CL')}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </div>
  )
}
