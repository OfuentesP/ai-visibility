'use client'

import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { motion } from 'framer-motion'
import { AlertTriangle, TriangleAlert, ShieldCheck, Terminal, TrendingUp, Globe, Search, Code2 } from 'lucide-react'
import { ExportBar } from '@/features/audit-shared/components/ExportBar'
import {
  ShareOfVoiceChart,
  buildChartDataFromBrand,
} from '@/features/audit-shared/components/ShareOfVoiceChart'
import { ActionPlanSection } from '@/features/audit-shared/components/ActionPlanSection'
import { CacheBadge } from '@/features/audit-shared/components/CacheBadge'
import { shareReport } from '@/features/audit-shared/api'
import type { ResultadoBusqueda, DiscoveryResponse } from '@/features/audit-shared/types'

interface Props {
  result: ResultadoBusqueda
  brand: string
  query: string
  userEmail: string
  userName: string
  discoveryResult: DiscoveryResponse | null
  discoveryLoading: boolean
  trendsResult: Array<{ query: string; value: number; fuente: string }> | null
  trendsLoading: boolean
  onDownloadJson: () => void
}

function getScoreTextColor(estado: string) {
  if (estado === 'visible') return 'text-emerald-700'
  if (estado === 'en_riesgo') return 'text-orange-400'
  return 'text-rose-600'
}
function getScoreBarColor(estado: string) {
  if (estado === 'visible') return 'bg-emerald-700'
  if (estado === 'en_riesgo') return 'bg-orange-700'
  return 'bg-rose-900'
}

export function BrandResults({ result, brand, query, userEmail, userName, discoveryResult, discoveryLoading, trendsResult, trendsLoading, onDownloadJson }: Props) {
  const reportRef = useRef<HTMLDivElement>(null)
  const [showRawOutput, setShowRawOutput] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  const d = result.resultados[0]
  if (!d) return null

  // Chart data
  const chartData = buildChartDataFromBrand(d.marcas_mencionadas, d.marca_ganadora, brand)
  const winnerReasons = (d.competitor_winning_reasons ?? []).slice(0, 4)
  const winnerSources = (d.cited_sources_types ?? []).slice(0, 4)

  // Veredicto
  const pos = d.posicion_mi_marca
  const ganador = d.competidor_principal || d.marca_ganadora || 'la competencia'
  const accion = d.prioridad_ejecutiva?.foco_principal
  const impacto = d.prioridad_ejecutiva?.impacto_esperado
  const clasificacion = d.prioridad_ejecutiva?.clasificacion ?? (pos === 0 || pos > 5 ? 'Atacar' : pos <= 2 ? 'Mantener' : 'Defender')
  const isAtacar = clasificacion === 'Atacar'
  const isDefender = clasificacion === 'Defender'
  const theme = isAtacar
    ? { bg: 'bg-rose-950/20', border: 'border-rose-500/30', bar: 'bg-rose-500', icon: <AlertTriangle className="w-5 h-5 text-rose-600" /> }
    : isDefender
    ? { bg: 'bg-amber-950/25', border: 'border-amber-900/40', bar: 'bg-amber-500', icon: <TriangleAlert className="w-5 h-5 text-amber-500" /> }
    : { bg: 'bg-emerald-950/20', border: 'border-emerald-900/30', bar: 'bg-emerald-500', icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> }
  const score = d.invisibilidad_score ?? 0
  const marcasRivales = d.marcas_mencionadas?.filter((m: string) => m.toLowerCase() !== brand.toLowerCase()).slice(0, 2) ?? []
  const rivales = marcasRivales.length >= 2 ? `${marcasRivales[0]} y ${marcasRivales[1]}` : marcasRivales[0] || ganador
  let titulo = ''
  let subtitulo = ''
  if (pos === 0 || score < 10) {
    titulo = 'Riesgo Crítico de Invisibilidad Digital'
    subtitulo = `Sus clientes potenciales están siendo derivados activamente a ${rivales} porque la iA no encuentra fuentes de confianza que validen su propuesta de valor.`
  } else if (pos > 5 || score < 30) {
    titulo = `Alerta: ${brand} está perdiendo demanda activa`
    subtitulo = `${rivales} captura la intención de compra de sus clientes antes de que lleguen a usted.`
  } else if (pos === 1) {
    titulo = `${brand} lidera — proteja esa posición`
    subtitulo = `La iA lo recomienda primero, pero ${ganador} está invirtiendo para desplazarle.`
  } else {
    titulo = `${brand} aparece, pero ${ganador} se lleva la decisión`
    subtitulo = `Está en posición #${pos}. Los compradores que llegan a la iA ven primero a ${ganador}.`
  }

  // Score ring
  const rawScore = d.invisibilidad_score ?? 0
  const displayScore = rawScore === 0 ? 10 : rawScore
  const estado = d.estado_invisibilidad
  const r_ring = 54, cx = 64, cy = 64
  const circ = 2 * Math.PI * r_ring
  const dash = circ * (1 - displayScore / 100)
  const strokeColor = estado === 'visible' ? '#10b981' : estado === 'en_riesgo' ? '#f97316' : '#f43f5e'
  const label = rawScore === 0 ? 'Riesgo Crítico' : estado === 'visible' ? 'Visible' : estado === 'en_riesgo' ? 'En Riesgo' : 'Invisible'
  const sent = d.sentimiento
  const sentColor = sent === 'positivo' ? 'text-emerald-700' : sent === 'negativo' ? 'text-rose-600' : 'text-yellow-400'
  const sentBg = sent === 'positivo' ? 'bg-emerald-950/30 border-emerald-800/40' : sent === 'negativo' ? 'bg-rose-950/30 border-rose-800/40' : 'bg-yellow-950/30 border-yellow-800/40'
  const sentLabel = sent === 'positivo' ? 'Positivo' : sent === 'negativo' ? 'Negativo / Riesgo de Alucinación' : 'Neutral'

  const rival = d.competidor_principal || (d.marca_ganadora?.toLowerCase() !== brand.toLowerCase() ? d.marca_ganadora : null) || 'la competencia'

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
  const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }
  const fade = { hidden: { opacity: 0 }, visible: { opacity: 1 } }

  return (
    <motion.div ref={reportRef} id="zone-resultados" className="space-y-6" initial="hidden" animate="visible" variants={stagger}>

      {/* Cache badge */}
      <CacheBadge fromCache={result.from_cache} cachedAt={result.cached_at} />

      {/* Delta score */}
      {result.prev_score != null && result.prev_cached_at && (() => {
        const curr = d.invisibilidad_score
        const prev = result.prev_score!
        const delta = Math.round(curr - prev)
        const days = Math.round((Date.now() - new Date(result.prev_cached_at!).getTime()) / 86400000)
        const up = delta > 0
        return (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-sm border text-sm ${up ? 'bg-emerald-950/30 border-emerald-800/40' : 'bg-rose-950/30 border-rose-800/40'}`}>
            <span className={`text-2xl font-bold ${up ? 'text-emerald-700' : 'text-rose-600'}`}>{up ? '↑' : '↓'}</span>
            <div>
              <p className={`font-semibold ${up ? 'text-emerald-300' : 'text-rose-300'}`}>
                {up ? `Subiste ${delta} puntos` : `Bajaste ${Math.abs(delta)} puntos`} en {days} días
              </p>
              <p className="text-slate-500 text-xs font-mono">Score anterior: {Math.round(prev)} → Score actual: {curr}</p>
            </div>
          </div>
        )
      })()}

      {/* AI Readiness Score */}
      <motion.div variants={{ hidden: { opacity: 0, y: -12 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } }} className="grid md:grid-cols-2 gap-4">
        <div className="bg-white shadow-sm border border-slate-200 rounded-sm p-6 flex items-center gap-6">
          <svg width="128" height="128" viewBox="0 0 128 128" className="shrink-0">
            <circle cx={cx} cy={cy} r={r_ring} fill="none" stroke="#1e293b" strokeWidth="10" />
            <circle cx={cx} cy={cy} r={r_ring} fill="none" stroke={strokeColor} strokeWidth="10" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round" transform="rotate(-90 64 64)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
            <text x="64" y="60" textAnchor="middle" fill={strokeColor} fontSize="22" fontWeight="300" fontFamily="monospace">{displayScore}</text>
            <text x="64" y="76" textAnchor="middle" fill="#64748b" fontSize="10">/100</text>
          </svg>
          <div>
            <p className="text-xs sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">AI Readiness Score</p>
            <p className="text-lg font-semibold" style={{ color: strokeColor }}>{label}</p>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">Nivel de preparación de {brand} para la era generativa</p>
          </div>
        </div>
        <div className={`border rounded-sm p-6 ${sentBg}`}>
          <p className="text-xs sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Percepción de la iA (Contexto Semántico)</p>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${sentBg} ${sentColor}`}>{sentLabel}</span>
          </div>
          {d.recomendacion_ia && <p className="text-slate-700 text-sm leading-relaxed line-clamp-4">{d.recomendacion_ia}</p>}
        </div>
      </motion.div>

      {/* 01 · Resumen Ejecutivo */}
      <motion.div variants={fade} className="flex items-center gap-3 px-1 mt-10 mb-3">
        <span className="text-xs font-mono text-slate-500 shrink-0">01</span>
        <span className="text-sm text-slate-500 font-medium">Resumen ejecutivo</span>
        <div className="flex-1 h-px bg-slate-100/30" />
      </motion.div>
      <motion.div id="zone-veredicto" variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } }}
        className={`${theme.bg} border ${theme.border} rounded-sm flex items-stretch overflow-hidden`}
      >
        <div className={`w-1.5 shrink-0 ${theme.bar}`} />
        <div className="flex-1 px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            <div className="shrink-0 flex flex-col items-center md:items-start">
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-light tabular-nums ${getScoreTextColor(d.estado_invisibilidad)}`}>{d.invisibilidad_score}</span>
                <span className="text-slate-500 text-base">/ 100</span>
              </div>
              <div className="w-28 bg-slate-100/60 h-1.5 rounded-full overflow-hidden mt-2">
                <div className={`h-full rounded-full ${getScoreBarColor(d.estado_invisibilidad)} transition-all duration-700`} style={{ width: `${d.invisibilidad_score}%` }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">{theme.icon}</div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 leading-snug">{titulo}</h2>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">{subtitulo}</p>
                  {accion && <p className="text-slate-700 text-sm mt-3"><span className="font-semibold">Siguiente paso:</span> {accion}{impacto ? `. ${impacto}.` : '.'}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 02 · Share of Voice */}
      {d.marcas_mencionadas.length > 0 && (
        <>
          <motion.div variants={fade} className="flex items-center gap-3 px-1 mt-10 mb-3">
            <span className="text-xs font-mono text-slate-500 shrink-0">02</span>
            <span className="text-sm text-slate-500 font-medium">¿A quién recomienda la iA cuando tu cliente busca?</span>
            <div className="flex-1 h-px bg-slate-100/30" />
          </motion.div>
          <motion.div id="zone-share-of-voice" variants={fadeUp} className="bg-white border border-slate-200 rounded-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">¿A quién recomienda la iA para <span className="text-slate-500 font-normal italic">&ldquo;{result.prompt_original}&rdquo;</span>?</h3>
                <p className="text-slate-500 text-xs mt-1">Marcas ordenadas por relevancia en la respuesta</p>
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 border border-slate-300 px-2 py-1 rounded shrink-0">{d.marcas_mencionadas.length} marcas</span>
            </div>
            <ShareOfVoiceChart
              chartData={chartData}
              userBrandName={brand}
              winnerReasons={winnerReasons}
              winnerSources={winnerSources}
              gradientSuffix="brand"
              ghostLabel={`${brand} — no aparece en esta búsqueda`}
            />
            {result.texto_original_ia && (
              <div className="mt-3">
                <button onClick={() => setShowRawOutput(!showRawOutput)} className="flex items-center gap-1.5 text-xs sm:text-[10px] text-slate-500 hover:text-slate-700 transition-colors">
                  <Terminal className="w-3 h-3" />
                  {showRawOutput ? 'Ocultar respuesta original' : 'Ver respuesta original de la iA'}
                </button>
                {showRawOutput && (
                  <div className="mt-2 p-3 bg-slate-50/80 border border-slate-200 rounded-sm max-h-40 overflow-y-auto">
                    <p className="text-slate-500 text-xs sm:text-[11px] font-mono leading-relaxed whitespace-pre-wrap">{result.texto_original_ia}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* 03 · Diagnóstico Competitivo */}
      <motion.div variants={fade} className="flex items-center gap-3 px-1 mt-10 mb-3">
        <span className="text-xs font-mono text-slate-500 shrink-0">03</span>
        <span className="text-sm text-slate-500 font-medium">Diagnóstico Competitivo</span>
        <div className="flex-1 h-px bg-slate-100/30" />
      </motion.div>
      <motion.div id="zone-diferenciacion" variants={fadeUp} className="bg-white border border-slate-200 rounded-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-rose-500 to-violet-600 shrink-0" />
          <div>
            <p className="text-xs sm:text-[10px] uppercase tracking-widest text-slate-500 mb-1">Diagnóstico Competitivo</p>
            <h3 className="text-base font-semibold text-slate-900">Por qué <span className="text-amber-400">{rival}</span> aparece donde tú no</h3>
          </div>
        </div>
        <div className="grid md:grid-cols-5 gap-0 border-b border-slate-200/60">
          <div className="md:col-span-2 px-5 py-4 border-b md:border-b-0 md:border-r border-slate-200/60 border-l-2 border-l-rose-600/50">
            <p className="text-xs sm:text-[10px] uppercase tracking-widest font-semibold text-rose-600 mb-3">Cómo nos ven tus clientes</p>
            <ul className="space-y-1.5">
              {(d.percepciones_genericas?.length > 0 ? d.percepciones_genericas : ['Analizando…']).slice(0, 3).map((c: string, bi: number) => (
                <li key={bi} className="flex items-start gap-2">
                  <span className="text-rose-600/70 text-xs mt-0.5 shrink-0">·</span>
                  <span className="text-sm text-slate-700 leading-snug">{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-3 px-5 py-4 border-l-2 border-l-amber-600/40">
            <p className="text-xs sm:text-[10px] uppercase tracking-widest font-semibold text-amber-400 mb-3">Por qué prefieren a {rival}</p>
            <ul className="space-y-1.5">
              {(d.conceptos_faltantes?.length > 0 ? d.conceptos_faltantes : ['Analizando…']).slice(0, 3).map((c: string, bi: number) => (
                <li key={bi} className="flex items-start gap-2">
                  <span className="text-amber-500/70 text-xs mt-0.5 shrink-0">·</span>
                  <span className="text-sm text-slate-700 leading-snug">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {d.competitor_advantage && d.competitor_advantage.filas.length > 0 && (
          <div className="px-5 pb-4 pt-4">
            <p className="text-xs sm:text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">Dónde exactamente te gana</p>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-xs sm:text-[10px] uppercase tracking-widest text-slate-500 font-semibold pb-2 pr-6 w-[28%]">Qué tiene</th>
                  <th className="text-left text-xs sm:text-[10px] uppercase tracking-widest text-slate-500 font-semibold pb-2 pr-6 w-[32%]">Dónde está publicado</th>
                  <th className="text-left text-xs sm:text-[10px] uppercase tracking-widest text-rose-600 font-semibold pb-2 w-[40%]">Clientes que te pierdes</th>
                </tr>
              </thead>
              <tbody>
                {d.competitor_advantage.filas.map((fila, i) => (
                  <tr key={i} className="border-b border-slate-200/40 last:border-0">
                    <td className="py-3.5 pr-6 align-top"><span className="text-sm font-semibold text-slate-900">{fila.atributo_ganador}</span></td>
                    <td className="py-3.5 pr-6 align-top"><span className="text-sm text-slate-500">{fila.fuente_de_verdad}</span></td>
                    <td className="py-3.5 align-top"><span className="text-sm text-rose-300">{fila.gap_nuestra_marca}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {d.competitor_advantage.conclusion && (
              <div className="mt-3 flex items-start gap-2 px-4 py-3 bg-slate-100/40 border border-slate-300/40 rounded-sm">
                <span className="text-slate-500 text-sm shrink-0 mt-0.5">→</span>
                <p className="text-slate-500 text-sm sm:text-xs leading-relaxed">{d.competitor_advantage.conclusion}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* 04 · Territorios Desatendidos */}
      {d.territorios_desatendidos && d.territorios_desatendidos.length > 0 && (
        <>
          <motion.div variants={fade} className="flex items-center gap-3 px-1 mt-10 mb-3">
            <span className="text-xs font-mono text-slate-500 shrink-0">04</span>
            <span className="text-sm text-slate-500 font-medium">Temas donde la iA no tiene un ganador claro</span>
            <div className="flex-1 h-px bg-slate-100/30" />
          </motion.div>
          <motion.div id="zone-territorios" variants={fadeUp} className="bg-white border border-slate-200 rounded-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-emerald-500 to-teal-600 shrink-0" />
              <div>
                <p className="text-xs sm:text-[10px] uppercase tracking-widest text-emerald-700 font-semibold mb-1">Contenido sin dueño</p>
                <h3 className="text-base font-semibold text-slate-900">Temas donde la iA no tiene un ganador claro</h3>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">Ningún competidor tiene contenido de autoridad en estas búsquedas.</p>
              </div>
            </div>
            <div className="divide-y divide-slate-800/50">
              {d.territorios_desatendidos.map((t, idx) => {
                const n = t.nivel_oportunidad
                const esAlza = t.crecimiento_trends?.startsWith('+')
                const esBaja = t.crecimiento_trends?.startsWith('-')
                const opp = n === 'Alto' ? { label: 'Sin competencia', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' } : n === 'Medio' ? { label: 'Fácil de ganar', cls: 'bg-teal-500/15 text-teal-300 border-teal-500/40' } : { label: 'Moderada', cls: 'bg-sky-500/10 text-sky-300 border-sky-500/30' }
                return (
                  <div key={idx} className="flex items-start gap-4 px-5 py-4">
                    <span className="text-xs sm:text-[11px] font-mono text-slate-500 pt-1 w-5 shrink-0 select-none">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <p className="text-sm font-semibold text-slate-900 leading-snug">{t.topico_emergente}</p>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${opp.cls}`}>{opp.label}</span>
                        {t.crecimiento_trends && (
                          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${esAlza ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : esBaja ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-slate-100/60 text-slate-500 border-slate-300'}`}>
                            {t.crecimiento_trends}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm leading-relaxed">{t.porque_es_oportunidad}</p>
                      {t.intension_usuario && <p className="text-slate-500 text-xs mt-1.5 italic">Intención: {t.intension_usuario}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-200/60 px-6 py-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500/60 shrink-0" />
              <p className="text-xs text-slate-500">El plan de acción de abajo prioriza cuál de estos temas atacar primero y cómo hacerlo.</p>
            </div>
          </motion.div>
        </>
      )}

      {/* 05 · Google Trends */}
      {(trendsLoading || (trendsResult && trendsResult.length > 0)) && (
        <>
          <motion.div variants={fade} className="flex items-center gap-3 px-1 mt-10 mb-3">
            <span className="text-xs font-mono text-slate-500 shrink-0">05</span>
            <span className="text-sm text-slate-500 font-medium">Cómo buscan en Google</span>
            <div className="flex-1 h-px bg-slate-100/30" />
          </motion.div>
          <motion.div id="zone-google-trends" variants={fadeUp} className="bg-white shadow-sm border border-slate-200 rounded-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-0.5">Así buscan en Google</h3>
                <p className="text-slate-500 text-xs">Búsquedas reales de alta demanda en Chile relacionadas con las queries de tus usuarios sintéticos</p>
              </div>
              <span className="text-xs sm:text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-300 px-2 py-1 rounded shrink-0">Google Trends · CL</span>
            </div>
            {trendsLoading && (
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-slate-100/40 rounded-sm animate-pulse" style={{ width: `${85 - i * 10}%` }} />)}
              </div>
            )}
            {!trendsLoading && trendsResult && trendsResult.length > 0 && (() => {
              const maxValue = Math.max(...trendsResult.map(t => t.value), 1)
              return (
                <div className="space-y-1.5">
                  {trendsResult.map((item, idx) => {
                    const barWidth = Math.round((item.value / maxValue) * 100)
                    const isTop = idx === 0
                    return (
                      <div key={idx} className="flex items-center gap-3 group">
                        <span className={`shrink-0 text-xs sm:text-[10px] font-mono w-4 text-right ${isTop ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{idx + 1}</span>
                        <div className="flex-1 min-w-0 relative">
                          <div className={`absolute inset-y-0 left-0 rounded-sm transition-all duration-500 ${isTop ? 'bg-amber-500/15' : 'bg-slate-700/25'}`} style={{ width: `${barWidth}%` }} />
                          <div className="relative flex items-center justify-between gap-2 px-2.5 py-1.5">
                            <span className={`text-xs truncate ${isTop ? 'text-amber-300 font-medium' : 'text-slate-700'}`}>{item.query}</span>
                            <span className={`text-xs sm:text-[10px] font-mono tabular-nums ${isTop ? 'text-amber-400' : 'text-slate-500'}`}>{item.value}</span>
                          </div>
                        </div>
                        <span className="shrink-0 text-[9px] text-slate-500 max-w-[100px] truncate hidden md:block group-hover:text-slate-500 transition-colors" title={item.fuente}>← {item.fuente.split('?')[0].slice(0, 35)}{item.fuente.length > 35 ? '…' : ''}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })()}
            {!trendsLoading && trendsResult && trendsResult.length === 0 && (
              <p className="text-slate-500 text-xs py-2">Google Trends no devolvió datos para estas queries.</p>
            )}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-200/60">
              <span className="flex items-center gap-1.5 text-xs sm:text-[10px] text-slate-500"><span className="w-2 h-2 rounded-sm bg-amber-500/40 shrink-0" /> #1 Mayor interés</span>
              <span className="text-xs sm:text-[10px] text-slate-500">Escala 0–100 relativa al pico del período (7 días)</span>
            </div>
          </motion.div>
        </>
      )}

      {/* 06 · Plan de Acción + Discovery */}
      {(discoveryLoading || discoveryResult) && (
        <>
          <motion.div variants={fade} className="flex items-center gap-3 px-1 mt-10 mb-3">
            <span className="text-xs font-mono text-slate-500 shrink-0">06</span>
            <span className="text-sm text-slate-500 font-medium">Plan de acción</span>
            <div className="flex-1 h-px bg-slate-100/30" />
          </motion.div>
          <motion.div id="zone-plan-recuperacion" variants={fadeUp} className="bg-white shadow-sm border border-slate-200 rounded-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-semibold text-slate-900">Qué hacer ahora</h3>
              {discoveryLoading && <p className="text-slate-500 text-sm mt-0.5">Simulando búsquedas asociadas a &ldquo;{query}&rdquo;…</p>}
              {discoveryResult && discoveryResult.oportunidades_auditadas.length > 0 && (() => {
                const ops = discoveryResult.oportunidades_auditadas
                const FAKE_SET = new Set(['múltiples competidores', 'empate técnico'])
                const validOps = ops.filter(op => { const g = op.resultado_auditoria.marca_ganadora; return !op.error && g && !FAKE_SET.has(g.toLowerCase()) })
                const losses = validOps.filter(op => { const pos = op.resultado_auditoria.posicion_mi_marca; return !(pos === 1 || pos === 2) }).length
                const valid = validOps.length
                return (
                  <p className="text-slate-500 text-sm mt-0.5">
                    {valid === 0 ? `Simulamos ${ops.length} búsquedas sobre "${query}"` : losses === 0 ? `Dominas las ${valid} búsquedas sobre "${query}"` : losses === valid ? `No apareces en ${valid} búsquedas sobre "${query}"` : `Pierdes ${losses} de ${valid} búsquedas sobre "${query}"`}
                  </p>
                )
              })()}
            </div>
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
                      <div key={idx} className={`rounded-sm border px-4 py-3 ${op.isWin ? 'bg-emerald-950/10 border-emerald-900/20' : op.ganador ? 'bg-white/40 border-rose-900/15' : 'bg-amber-950/10 border-amber-800/20'}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-500 text-xs mb-1">{iconos[idx] || '👤'} {nombre}{op.necesidad_principal && <span className="text-slate-500"> · {op.necesidad_principal.split(',')[0]}</span>}</p>
                            <p className="text-slate-800 text-sm leading-relaxed">{preguntaCorta}</p>
                          </div>
                          <div className="shrink-0 text-right mt-0.5">
                            {op.ganador ? (
                              <span className={`text-sm font-semibold ${esMiMarca ? 'text-emerald-700' : 'text-rose-600'}`}>{esMiMarca ? `✓ ${brand}` : op.ganador}</span>
                            ) : (
                              <div className="flex flex-col items-end">
                                <span className="text-amber-400 text-xs font-semibold">Territorio libre</span>
                                <span className="text-slate-500 text-xs sm:text-[10px]">Ninguna marca satisface</span>
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
            {discoveryLoading ? (
              <div className="px-5 py-4 space-y-3">{[0, 1, 2].map(i => <div key={i} className="h-12 bg-slate-100/40 rounded-sm animate-pulse" />)}</div>
            ) : d.plan_accion?.vehiculos && d.plan_accion.vehiculos.some(v => v.acciones.length > 0) ? (
              <div className="px-5 pb-5 pt-3">
                <ActionPlanSection planAccion={d.plan_accion} marca={brand} sectionIndex="" />
              </div>
            ) : (
              <p className="text-slate-500 text-sm px-5 py-4">Ejecuta un análisis para ver las acciones recomendadas.</p>
            )}
            {!discoveryLoading && d.plan_accion?.roi_estimado && (
              <div className="px-6 pb-5">
                <div className="flex items-start gap-3 px-4 py-3 bg-emerald-950/20 border border-emerald-900/20 rounded-sm">
                  <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-slate-700 text-sm leading-relaxed">{d.plan_accion.roi_estimado}</p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Herramientas de indexación */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-sm border border-slate-200 rounded-sm p-6">
        <p className="text-xs sm:text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Herramientas Oficiales Gratuitas</p>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Fuerza la indexación en LLMs — hazlo tú mismo</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-4 bg-slate-100/60 border border-slate-300 rounded-sm hover:border-indigo-500/50 hover:bg-slate-100 transition-colors group">
            <Globe className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900 group-hover:text-slate-900">Conectar con ChatGPT</p>
              <p className="text-slate-500 text-xs mt-0.5">Bing Webmaster Tools → IndexNow</p>
            </div>
          </a>
          <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-4 bg-slate-100/60 border border-slate-300 rounded-sm hover:border-emerald-500/50 hover:bg-slate-100 transition-colors group">
            <Search className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900 group-hover:text-slate-900">Conectar con Gemini</p>
              <p className="text-slate-500 text-xs mt-0.5">Google Search Console → Inspección de URL</p>
            </div>
          </a>
        </div>
      </motion.div>

      {/* Prompt de rescate */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-300 rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-600" />
            <p className="text-xs font-mono text-slate-700">Inicia tu recuperación GEO hoy. Copia este prompt en ChatGPT:</p>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText('Actúa como un experto en GEO. Toma las características de mi marca y redáctalas en 5 preguntas frecuentes usando formato BLUF (Bottom Line Up Front) y sujeto-verbo-predicado para indexar en LLMs.'); setPromptCopied(true); setTimeout(() => setPromptCopied(false), 2000) }}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-100 border border-slate-600 text-slate-700 transition-colors"
          >
            <Code2 className="w-3 h-3" />
            {promptCopied ? 'Copiado ✓' : 'Copiar'}
          </button>
        </div>
        <pre className="px-5 py-4 text-sm text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
          {`Actúa como un experto en GEO. Toma las características de mi marca y redáctalas en 5 preguntas frecuentes usando formato BLUF (Bottom Line Up Front) y sujeto-verbo-predicado para indexar en LLMs.`}
        </pre>
      </motion.div>

      {/* Export */}
      <ExportBar
        userEmail={userEmail}
        userName={userName}
        marca={brand}
        query={query}
        score={d.invisibilidad_score ?? 0}
        modo="brand"
        resultado={result}
        getShareUrl={async () => {
          const code = await shareReport({ modo: 'brand', marca: brand, query, resultado: result })
          return `${window.location.origin}/r/?c=${code}`
        }}
      />

    </motion.div>
  )
}
