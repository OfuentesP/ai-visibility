'use client'

import { useState } from 'react'
import { Search, Lightbulb, BarChart3, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'

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
      opciones_implementacion: Array<{
        tipo: string
        accion_especifica: string
        tiempo_estimado: string
      }>
    }>
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
        { text: 'Analizando competidores...', progress: 60 },
        { text: 'Generando recomendaciones...', progress: 80 },
        { text: 'Finalizando análisis...', progress: 100 },
      ]
      for (let i = 0; i < phases.length; i++) {
        setLoadingPhase(`${phases[i].text} ${phases[i].progress}%`)
        await new Promise((r) => setTimeout(r, 300 + Math.random() * 700))
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
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
      setLoadingPhase('')
    }
  }

  const getScoreColor = (estado: string) => {
    if (estado === 'visible') return 'border-emerald-800/40'
    if (estado === 'en_riesgo') return 'border-orange-800/40'
    return 'border-red-800/40'
  }

  const getScoreTextColor = (estado: string) => {
    if (estado === 'visible') return 'text-emerald-400'
    if (estado === 'en_riesgo') return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreBarColor = (estado: string) => {
    if (estado === 'visible') return 'bg-emerald-700'
    if (estado === 'en_riesgo') return 'bg-orange-700'
    return 'bg-red-800'
  }

  const d = result?.resultados[0]

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 border-b border-slate-800 pb-6 flex items-start justify-between"
          >
            <div>
              <h1 className="text-3xl font-semibold text-slate-100 tracking-tight mb-1">AI Visibility Auditor</h1>
              <p className="text-slate-500 text-sm font-light">Análisis de posicionamiento en motores de búsqueda con IA</p>
              {result && (
                <p className="text-[10px] font-mono text-slate-700 mt-2">
                  {new Date().toLocaleDateString('es-CL')} · {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            {result && (
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-sm text-slate-400 text-sm transition flex items-center gap-2">
                ⬇ PDF
              </button>
            )}
          </motion.div>

          {/* BUSCADOR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-sm p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Marca</label>
                <input
                  type="text"
                  placeholder="Banco Santander"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Búsqueda</label>
                <input
                  type="text"
                  placeholder="mejor banco en chile"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                />
              </div>
            </div>
            <button
              onClick={handleAudit}
              disabled={loading}
              className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-50 font-medium rounded-sm transition flex items-center justify-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
              {loading ? loadingPhase : 'Auditar'}
            </button>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-slate-800 border border-slate-700 rounded-sm text-slate-400 text-xs flex items-center gap-2">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                {loadingPhase}
              </motion.div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-800/50 rounded-sm text-red-300 text-sm">{error}</div>
            )}
          </motion.div>

          {/* RESULTADOS */}
          {result && d && (
            <div className="space-y-5">

              {/* ─── FASE 1: EL DIAGNÓSTICO ────────────── */}

              {/* 1 · TERMÓMETRO */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-slate-900 border ${getScoreColor(d.estado_invisibilidad)} rounded-sm p-6`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mb-3">Visibilidad IA</p>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-5xl font-light tabular-nums ${getScoreTextColor(d.estado_invisibilidad)}`}>{d.invisibilidad_score}</span>
                      <span className="text-slate-600 text-sm">/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className={`h-full ${getScoreBarColor(d.estado_invisibilidad)} transition-all duration-700`} style={{ width: `${d.invisibilidad_score}%` }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mb-3">Estado</p>
                    <p className={`text-2xl font-semibold ${getScoreTextColor(d.estado_invisibilidad)}`}>
                      {d.estado_invisibilidad === 'visible' ? 'Consolidada' : d.estado_invisibilidad === 'en_riesgo' ? 'En Riesgo' : 'Invisible'}
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      {d.posicion_mi_marca === 0 ? 'No detectada en respuesta' : `Posición #${d.posicion_mi_marca}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mb-3">Diagnóstico</p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {d.posicion_mi_marca === 0
                        ? `No apareces en búsquedas sobre "${result.prompt_original}"`
                        : d.estado_invisibilidad === 'visible'
                        ? 'Presencia consolidada. Mantén la estrategia actual.'
                        : 'Mencionado pero sin prominencia. Acción necesaria.'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 2 · SHARE OF VOICE — Progress Bars */}
              {d.marcas_mencionadas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-slate-800 rounded-sm p-6"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100">
                        🇨🇱 Share of Voice — <span className="text-slate-400 font-normal">{result.prompt_original}</span>
                      </h3>
                      <p className="text-slate-600 text-xs mt-1">Orden de aparición en la respuesta IA como proxy de cuota de voz</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-800 border border-slate-700 px-2 py-1 rounded shrink-0">
                      {d.marcas_mencionadas.length} marcas
                    </span>
                  </div>
                  <div className="space-y-3">
                    {d.marcas_mencionadas.map((marca, idx) => {
                      const total = d.marcas_mencionadas.length
                      const barWidth = Math.max(Math.round(100 - idx * (70 / Math.max(total - 1, 1))), 14)
                      const isWinner = marca === d.marca_ganadora
                      const isUser = marca.toLowerCase() === brand.toLowerCase()
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-slate-700 text-[10px] font-mono w-5 shrink-0 text-right">#{idx + 1}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className={`text-xs font-medium ${isUser ? 'text-emerald-300' : isWinner ? 'text-slate-200' : 'text-slate-500'}`}>{marca}</span>
                              {isWinner && !isUser && <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-semibold">LÍDER</span>}
                              {isUser && isWinner && <span className="text-[9px] bg-emerald-900/40 border border-emerald-800/50 text-emerald-400 px-1.5 py-0.5 rounded font-semibold">TÚ · LÍDER</span>}
                              {isUser && !isWinner && <span className="text-[9px] bg-emerald-900/30 border border-emerald-800/40 text-emerald-400 px-1.5 py-0.5 rounded font-semibold">TÚ</span>}
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-sm overflow-hidden">
                              <div
                                className={`h-full rounded-sm transition-all duration-700 ${isUser ? 'bg-emerald-700' : isWinner ? 'bg-slate-500' : 'bg-slate-700'}`}
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-slate-700 text-[10px] font-mono w-8 text-right shrink-0">{barWidth}%</span>
                        </div>
                      )
                    })}
                  </div>
                  {d.posicion_mi_marca === 0 && (
                    <p className="mt-4 text-slate-600 text-xs border-t border-slate-800 pt-3">⚠ Tu marca no fue detectada en esta consulta.</p>
                  )}
                </motion.div>
              )}

              {/* ─── FASE 2: LA AUTOPSIA ───────────────── */}

              {/* 3 · MAPA DE DIFERENCIACIÓN */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-sm p-6"
              >
                <div className="mb-5">
                  {d.posicion_mi_marca === 1 ? (
                    <>
                      <h3 className="text-sm font-semibold text-slate-100 mb-0.5">
                        🛡️ Defensa de Posición — Tú vs <span className="text-slate-400">{d.competidor_principal || d.marca_ganadora}</span>
                      </h3>
                      <p className="text-slate-600 text-xs">Identifica qué intenta posicionar tu competidor para desplazarte</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold text-slate-100 mb-0.5">
                        📊 Brecha Competitiva — Tú vs <span className="text-slate-400">{d.competidor_principal || d.marca_ganadora}</span>
                      </h3>
                      <p className="text-slate-600 text-xs">Qué comunica tu competidor en IA que tú no</p>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-emerald-800/30 bg-emerald-950/10 rounded-sm p-4">
                    <p className="text-emerald-700 text-[10px] font-semibold uppercase tracking-widest mb-3">
                      {d.posicion_mi_marca === 1 ? '✓ Tus fortalezas actuales' : '✓ Lo que ya comunicas'}
                    </p>
                    <div className="space-y-1.5">
                      {['Seguridad', 'Confianza', 'Atención al cliente'].map((c, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/30 rounded-sm">
                          <span className="text-emerald-800 text-xs">—</span>
                          <p className="text-slate-200 text-xs">{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-orange-800/30 bg-orange-950/10 rounded-sm p-4">
                    <p className="text-orange-700 text-[10px] font-semibold uppercase tracking-widest mb-3">
                      {d.posicion_mi_marca === 1
                        ? `⚠ Amenazas emergentes de ${d.competidor_principal || d.marca_ganadora}`
                        : `⚠ Lo que ${(d.competidor_principal || d.marca_ganadora || 'la competencia').toUpperCase()} comunica (y tú no)`}
                    </p>
                    <div className="space-y-1.5">
                      {d.conceptos_faltantes.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-orange-950/30 rounded-sm">
                          <span className="text-orange-800 text-xs">—</span>
                          <p className="text-slate-200 text-xs">{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 4 · EVIDENCIA DE LA IA — Raw Output terminal */}
              {result.texto_original_ia && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-950 border border-slate-800 rounded-sm overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-900">
                    <Terminal className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Evidencia de la IA — Raw Output</span>
                    <span className="ml-auto text-[9px] font-mono text-slate-700 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded">LLM response</span>
                  </div>
                  <div className="p-4 max-h-32 overflow-hidden relative">
                    <p className="text-slate-500 text-xs font-mono leading-relaxed whitespace-pre-wrap">
                      {result.texto_original_ia.slice(0, 480)}{result.texto_original_ia.length > 480 ? '…' : ''}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
                  </div>
                </motion.div>
              )}

              {/* 5 · RADAR DE INTENCIÓN */}
              {d.territorios_desatendidos && d.territorios_desatendidos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-slate-800 rounded-sm p-6"
                >
                  <div className="mb-5">
                    <h3 className="text-sm font-semibold text-slate-100 mb-0.5">📡 Radar de Intención</h3>
                    <p className="text-slate-600 text-xs">Tópicos que los usuarios buscan activamente y tu marca no cubre</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {d.territorios_desatendidos.slice(0, 3).map((t, idx) => (
                      <div key={idx} className="bg-slate-800 border border-slate-700/60 rounded-sm p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${
                            t.volumen_busqueda === 'Alto'
                              ? 'bg-red-900/30 text-red-400 border-red-800/40'
                              : 'bg-orange-900/30 text-orange-400 border-orange-800/40'
                          }`}>
                            {t.volumen_busqueda}
                          </span>
                          <span className="text-slate-700 text-[9px] font-mono">#{idx + 1}</span>
                        </div>
                        <p className="text-slate-100 font-semibold text-xs mb-2">{t.topico_emergente}</p>
                        <p className="text-slate-500 text-[10px] leading-relaxed mb-3">{t.porque_es_oportunidad}</p>
                        <div className="border-t border-slate-700 pt-2">
                          <p className="text-slate-600 text-[9px] uppercase tracking-widest mb-1">Intención</p>
                          <p className="text-slate-400 text-[10px] italic">{t.intension_usuario}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-start gap-3 p-3 bg-slate-800/50 border border-slate-700/40 rounded-sm">
                    <BarChart3 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <p className="text-slate-500 text-xs">Captura de demanda orgánica en segmentos desatendidos. Ventaja competitiva potencial frente a marcas que aún no cubren estos tópicos.</p>
                  </div>
                </motion.div>
              )}

              {/* ─── FASE 3: EL RESCATE ────────────────── */}

              {/* 6 · DIRECTIVA DE EJECUCIÓN ESTRATÉGICA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">⚡ Directiva de Ejecución Estratégica</h3>
                    <p className="text-slate-600 text-xs mt-0.5">Matriz de acción ordenada por esfuerzo técnico requerido</p>
                  </div>
                  <div className={`text-[10px] font-semibold px-2 py-1 rounded border ${
                    d.invisibilidad_score >= 80
                      ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/40'
                      : d.invisibilidad_score >= 50
                      ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40'
                      : 'bg-red-900/30 text-red-400 border-red-800/40'
                  }`}>
                    {d.invisibilidad_score >= 80 ? 'MANTENER' : d.invisibilidad_score >= 50 ? 'DEFENDER' : 'INTERVENIR'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">

                  {/* COL 1: Acciones Ágiles (Sin TI) */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-4 bg-[#2a4060] rounded-full" />
                      <p className="text-[#6b9ec4] text-xs font-semibold uppercase tracking-widest">Acciones Ágiles — Sin TI</p>
                    </div>
                    <p className="text-slate-600 text-[10px] mb-4">Ejecución inmediata. Sin dependencia del equipo de desarrollo.</p>
                    {d.plan_accion?.vehiculos && d.plan_accion.vehiculos.some(v => v.opciones_implementacion.some(o => o.tipo === 'Ágil' || o.tipo === 'Externa')) ? (
                      <div className="space-y-3">
                        {d.plan_accion.vehiculos.flatMap((v, vi) =>
                          v.opciones_implementacion
                            .filter(o => o.tipo === 'Ágil' || o.tipo === 'Externa')
                            .map((o, oi) => (
                              <div key={`agil-${vi}-${oi}`} className="border border-slate-800 bg-slate-950 rounded-sm p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${
                                    o.tipo === 'Ágil'
                                      ? 'bg-[#0f1e2e] border-[#2a4060] text-[#6b9ec4]'
                                      : 'bg-[#0f1e18] border-[#2a4a34] text-[#6bab84]'
                                  }`}>
                                    {o.tipo === 'Ágil' ? 'MODIFICACIÓN' : 'RRSS / PR'}
                                  </span>
                                  <span className="text-slate-700 text-[9px] font-mono">{o.tiempo_estimado}</span>
                                </div>
                                <p className="text-slate-300 text-xs leading-snug">{o.accion_especifica}</p>
                                <p className="text-slate-600 text-[10px] mt-1.5 font-medium">{v.concepto}</p>
                              </div>
                            ))
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="border border-slate-800 bg-slate-950 rounded-sm p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded border bg-[#0f1e2e] border-[#2a4060] text-[#6b9ec4]">MODIFICACIÓN</span>
                            <span className="text-slate-700 text-[9px] font-mono">1–3 días</span>
                          </div>
                          <p className="text-slate-300 text-xs">Actualizar FAQ y meta-descripciones con los conceptos faltantes detectados</p>
                        </div>
                        <div className="border border-slate-800 bg-slate-950 rounded-sm p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded border bg-[#0f1e18] border-[#2a4a34] text-[#6bab84]">RRSS / PR</span>
                            <span className="text-slate-700 text-[9px] font-mono">2–5 días</span>
                          </div>
                          <p className="text-slate-300 text-xs">Publicar en LinkedIn y notas de prensa sobre los tópicos emergentes detectados</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* COL 2: Acciones Estructurales (Con TI) */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-4 bg-slate-600 rounded-full" />
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Acciones Estructurales — Con TI</p>
                    </div>
                    <p className="text-slate-600 text-[10px] mb-4">Impacto profundo. Requiere desarrollo web o infraestructura.</p>
                    {d.plan_accion?.vehiculos && d.plan_accion.vehiculos.some(v => v.opciones_implementacion.some(o => o.tipo === 'Estructural')) ? (
                      <div className="space-y-3">
                        {d.plan_accion.vehiculos.flatMap((v, vi) =>
                          v.opciones_implementacion
                            .filter(o => o.tipo === 'Estructural')
                            .map((o, oi) => (
                              <div key={`est-${vi}-${oi}`} className="border border-slate-800 bg-slate-950 rounded-sm p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded border bg-[#1a1a1a] border-[#383838] text-[#888888]">LANDING</span>
                                  <span className="text-slate-700 text-[9px] font-mono">{o.tiempo_estimado}</span>
                                </div>
                                <p className="text-slate-300 text-xs leading-snug">{o.accion_especifica}</p>
                                <p className="text-slate-600 text-[10px] mt-1.5 font-medium">{v.concepto}</p>
                              </div>
                            ))
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="border border-slate-800 bg-slate-950 rounded-sm p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded border bg-[#1a1a1a] border-[#383838] text-[#888888]">LANDING</span>
                            <span className="text-slate-700 text-[9px] font-mono">7–14 días</span>
                          </div>
                          <p className="text-slate-300 text-xs">Crear landing pages dedicadas para cada concepto clave no cubierto actualmente en el sitio</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {d.plan_accion?.roi_estimado && (
                  <div className="border-t border-slate-800 px-6 py-3 flex items-center gap-3">
                    <Lightbulb className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest shrink-0">Ventaja potencial</span>
                    <span className="w-px h-3 bg-slate-800" />
                    <p className="text-slate-400 text-xs">{d.plan_accion.roi_estimado}</p>
                  </div>
                )}
              </motion.div>

            </div>
          )}

          {/* FOOTER */}
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="border-t border-slate-800 bg-slate-950 p-8 mt-10"
            >
              <div className="max-w-5xl mx-auto">
                <p className="text-slate-700 text-[10px] uppercase tracking-widest font-semibold mb-4">Metodología y Fuentes</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-wide mb-2">Motor de Inteligencia</p>
                    <p className="text-slate-700 text-xs font-mono leading-relaxed">• OpenAI GPT-4o-mini<br />• Análisis Multimodelo<br />• Contexto Regional Chile</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-wide mb-2">Fuentes de Verdad</p>
                    <p className="text-slate-700 text-xs font-mono leading-relaxed">• Google Trends RT (CL)<br />• SERP Data en Tiempo Real<br />• Índice de Menciones IA</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-wide mb-2">Metodología</p>
                    <p className="text-slate-700 text-xs font-mono leading-relaxed">• Synthetic Users Simulation<br />• Score 0–100 Normalizado<br />• PAS: Problema → Solución</p>
                  </div>
                </div>
                <p className="text-slate-800 text-[10px] font-mono mt-6">Datos actualizados: {new Date().toLocaleString('es-CL')}</p>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
