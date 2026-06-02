'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, AlertTriangle, TrendingUp } from 'lucide-react'
import { ExportBar } from '@/features/audit-shared/components/ExportBar'
import { shareReport } from '@/features/audit-shared/api'
import {
  ShareOfVoiceChart,
  buildChartDataFromUrl,
} from '@/features/audit-shared/components/ShareOfVoiceChart'
import { ActionPlanSection } from '@/features/audit-shared/components/ActionPlanSection'
import { CacheBadge } from '@/features/audit-shared/components/CacheBadge'
import type { UrlAuditResult } from '@/features/audit-shared/types'

function queryToBullets(query: string): string[] {
  const cleaned = query.replace(/^¿/, '').replace(/\?$/, '').trim()
  const parts = cleaned
    .split(/,|;|\sy\s|\sque\s|\sademas\s|\stambien\s/i)
    .map(s => s.trim()).filter(s => s.length > 4)
  if (parts.length >= 3) return parts.slice(0, 3).map(p => p.charAt(0).toUpperCase() + p.slice(1))
  const words = cleaned.split(' ')
  const chunk = Math.ceil(words.length / 3)
  return [words.slice(0, chunk).join(' '), words.slice(chunk, chunk * 2).join(' '), words.slice(chunk * 2).join(' ')]
    .filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1))
}

interface Props {
  urlResult: UrlAuditResult
  urlInput: string
  userEmail: string
  userName: string
}

export function UrlResults({ urlResult, urlInput, userEmail, userName }: Props) {
  const reportRef = useRef<HTMLDivElement>(null)
  const [showPerfilesDetalle, setShowPerfilesDetalle] = useState(false)
  const [showUrlSnippet, setShowUrlSnippet] = useState<Record<number, boolean>>({})
  const score = urlResult.visibilidad_pct
  const invisible = urlResult.total_queries - urlResult.queries_con_mencion
  const ganadorCounts: Record<string, number> = {}
  urlResult.resultados.forEach(r => {
    if (r.marca_ganadora && r.marca_ganadora.toLowerCase() !== urlResult.marca.toLowerCase())
      ganadorCounts[r.marca_ganadora] = (ganadorCounts[r.marca_ganadora] || 0) + 1
  })
  const topCompetitor = Object.entries(ganadorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'la competencia'
  const topActions = urlResult.plan_accion?.vehiculos.flatMap(v => v.acciones).sort((a, b) => b.ice_score - a.ice_score).slice(0, 3) ?? []
  const scoreColor = score === 0 ? 'text-rose-400' : score < 60 ? 'text-amber-400' : 'text-emerald-400'
  const accentBorder = score === 0 ? 'border-l-rose-500' : score < 60 ? 'border-l-amber-500' : 'border-l-emerald-500'

  // Chart data
  const hasMentions = urlResult.resultados.some(r => r.marcas_mencionadas.length > 0)
  const chartData = hasMentions ? buildChartDataFromUrl(urlResult.resultados, urlResult.marca) : []
  const winnerName = chartData.find(e => e.isWinner)?.marca?.toLowerCase() ?? ''
  const winnerReasons = urlResult.resultados
    .filter(r => r.marca_ganadora?.toLowerCase() === winnerName)
    .flatMap(r => r.competitor_winning_reasons || [])
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)
  const winnerSources = urlResult.resultados
    .filter(r => r.marca_ganadora?.toLowerCase() === winnerName)
    .flatMap(r => r.cited_sources_types || [])
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, 4)

  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
  const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }
  const fade = { hidden: { opacity: 0 }, visible: { opacity: 1 } }

  return (
    <motion.div ref={reportRef} id="zone-url-resultados" className="space-y-4 mb-8" initial="hidden" animate="visible" variants={stagger}>

      {/* Cache badge */}
      <CacheBadge fromCache={urlResult.from_cache} cachedAt={urlResult.cached_at} />

      {/* Delta score */}
      {urlResult.prev_score != null && urlResult.prev_cached_at && (() => {
        const curr = Math.round(urlResult.visibilidad_pct)
        const prev = Math.round(urlResult.prev_score!)
        const delta = curr - prev
        const days = Math.round((Date.now() - new Date(urlResult.prev_cached_at!).getTime()) / 86400000)
        const up = delta > 0
        return (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-sm border text-sm ${up ? 'bg-emerald-950/30 border-emerald-800/40' : 'bg-rose-950/30 border-rose-800/40'}`}>
            <span className={`text-2xl font-bold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>{up ? '↑' : '↓'}</span>
            <div>
              <p className={`font-semibold ${up ? 'text-emerald-300' : 'text-rose-300'}`}>
                {up ? `Subiste ${delta}%` : `Bajaste ${Math.abs(delta)}%`} de visibilidad en {days} días
              </p>
              <p className="text-slate-500 text-xs font-mono">Visibilidad anterior: {prev}% → actual: {curr}%</p>
            </div>
          </div>
        )
      })()}

      {/* 01 · Resumen Ejecutivo */}
      <motion.div variants={fade} className="flex items-center gap-3 px-1 mt-10 mb-3">
        <span className="text-xs font-mono text-slate-500 shrink-0">01</span>
        <span className="text-sm text-slate-400 font-medium">Resumen ejecutivo</span>
        <div className="flex-1 h-px bg-slate-800/30" />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}
        className={`bg-slate-900 border border-slate-700 border-l-4 ${accentBorder} rounded-sm overflow-hidden`}
      >
        <div className="px-6 pt-5 pb-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">{urlResult.marca} · {urlResult.mercado}</p>
            <p className="text-xs font-mono text-slate-400">{urlResult.categoria}</p>
          </div>
          <div className="text-right shrink-0">
            <p className={`text-3xl font-bold font-mono tabular-nums ${scoreColor}`}>{score}<span className="text-lg">%</span></p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">visibilidad en iA</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
          <div className="px-5 py-5 flex gap-3 items-start">
            <span className="text-rose-400 text-base font-bold leading-none mt-0.5 shrink-0">①</span>
            <div>
              <p className="text-sm font-semibold text-white leading-snug mb-1">
                {invisible === 0 ? 'Apareces en todas las búsquedas de iA' : invisible === urlResult.total_queries ? 'La iA no te menciona en ninguna búsqueda' : `De cada ${urlResult.total_queries} búsquedas con iA, ${invisible} no te incluyen`}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">{invisible === 0 ? 'Mantén y expande tu posición.' : `Esas consultas las gana ${topCompetitor}.`}</p>
            </div>
          </div>
          <div className="px-5 py-5 flex gap-3 items-start">
            <span className="text-amber-400 text-base font-bold leading-none mt-0.5 shrink-0">②</span>
            <div>
              <p className="text-sm font-semibold text-white leading-snug mb-1">La iA elige a <span className="text-amber-400">{topCompetitor}</span> en esas búsquedas</p>
              <p className="text-sm text-slate-400 leading-relaxed">Tiene más presencia en las fuentes que la iA consulta.</p>
            </div>
          </div>
          <div className="px-5 py-5 flex gap-3 items-start">
            <span className="text-emerald-400 text-base font-bold leading-none mt-0.5 shrink-0">③</span>
            <div>
              <p className="text-sm font-semibold text-white leading-snug mb-1">
                {topActions.length > 0 ? `${topActions.length} acciones concretas para recuperar posición` : 'Plan de recuperación disponible más abajo'}
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                {topActions[0]?.tiempo_indexacion_ia ? `Primera acción visible en ${topActions[0].tiempo_indexacion_ia.split('(')[0].trim()}` : 'Ver plan detallado más abajo'}
              </p>
            </div>
          </div>
        </div>
        {urlResult.diferenciadores.length > 0 && (
          <div className="border-t border-slate-800/60 px-6 py-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Diferenciadores que la iA no menciona</p>
            <div className="flex flex-wrap gap-2">
              {urlResult.diferenciadores.slice(0, 4).map((dif, i) => (
                <span key={i} className="text-xs text-slate-400 bg-slate-800/50 border border-slate-700/60 rounded px-2.5 py-1">{dif}</span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* 02 · Share of Voice */}
      {hasMentions && (
        <>
          <motion.div variants={fade} className="flex items-center gap-3 px-1 mt-10 mb-3">
            <span className="text-xs font-mono text-slate-500 shrink-0">02</span>
            <span className="text-sm text-slate-400 font-medium">¿A quién recomienda la iA cuando tu cliente busca?</span>
            <div className="flex-1 h-px bg-slate-800/30" />
          </motion.div>
          <motion.div id="zone-url-share-of-voice" variants={fadeUp} className="bg-slate-950 border border-slate-800 rounded-sm p-6">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-100">¿A quién recomienda la iA cuando tu cliente busca?</h3>
              <p className="text-slate-400 text-sm mt-1">Estas son las marcas que aparecen cuando un comprador real le pregunta a ChatGPT, Gemini o Perplexity.</p>
            </div>
            <ShareOfVoiceChart
              chartData={chartData}
              userBrandName={urlResult.marca}
              winnerReasons={winnerReasons}
              winnerSources={winnerSources}
              gradientSuffix="url"
              ghostLabel={`${urlResult.marca} — no aparece en estas búsquedas`}
            />
          </motion.div>
        </>
      )}

      {/* 03 · Competitive Deep Dive */}
      {urlResult.competitive_deep_dive?.competidor && (
        <>
          <motion.div variants={fade} className="flex items-center gap-3 px-1 mt-10 mb-3">
            <span className="text-xs font-mono text-slate-500 shrink-0">03</span>
            <span className="text-sm text-slate-400 font-medium">Diagnóstico Competitivo</span>
            <div className="flex-1 h-px bg-slate-800/30" />
          </motion.div>
          <motion.div id="zone-url-competitive-deep-dive" variants={fadeUp} className="bg-slate-950 border border-slate-800 rounded-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-start gap-3">
              <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-rose-500 to-violet-600 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Diagnóstico Competitivo</p>
                <h3 className="text-base font-semibold text-slate-100">Por qué <span className="text-amber-400">{urlResult.competitive_deep_dive.competidor}</span> aparece donde tú no</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-5 gap-0 border-b border-slate-800/60">
              <div className="md:col-span-2 px-5 py-4 border-b md:border-b-0 md:border-r border-slate-800/60 border-l-2 border-l-rose-600/50">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-rose-400 mb-3">Cómo nos ven tus clientes</p>
                <ul className="space-y-1.5">
                  {(urlResult.competitive_deep_dive.percepcion_nuestra_marca ?? '').split(/\.\s+/).map(s => s.replace(/\.$/, '').trim()).filter(s => s.length > 8).slice(0, 3).map((bullet, bi) => (
                    <li key={bi} className="flex items-start gap-2">
                      <span className="text-rose-500/70 text-xs mt-0.5 shrink-0">·</span>
                      <span className="text-sm text-slate-300 leading-snug">{bullet}.</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-3 px-5 py-4 border-l-2 border-l-amber-600/40">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-amber-400 mb-3">Por qué prefieren a {urlResult.competitive_deep_dive.competidor}</p>
                <ul className="space-y-1.5">
                  {(urlResult.competitive_deep_dive.mensaje_competidor ?? '').split(/\.\s+/).map(s => s.replace(/\.$/, '').trim()).filter(s => s.length > 8).slice(0, 3).map((bullet, bi) => (
                    <li key={bi} className="flex items-start gap-2">
                      <span className="text-amber-500/70 text-xs mt-0.5 shrink-0">·</span>
                      <span className="text-sm text-slate-300 leading-snug">{bullet}.</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {urlResult.competitive_deep_dive.tabla_atributos?.length > 0 && (
              <div className="px-5 pb-4 pt-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-3">Dónde exactamente te gana</p>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 font-semibold pb-2 pr-6 w-[28%]">Qué tiene</th>
                      <th className="text-left text-[10px] uppercase tracking-widest text-slate-500 font-semibold pb-2 pr-6 w-[32%]">Dónde está publicado</th>
                      <th className="text-left text-[10px] uppercase tracking-widest text-rose-400 font-semibold pb-2 w-[40%]">Clientes que te pierdes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urlResult.competitive_deep_dive.tabla_atributos.map((row, ri) => (
                      <tr key={ri} className="border-b border-slate-800/40 last:border-0">
                        <td className="py-3.5 pr-6 align-top"><span className="text-sm font-semibold text-slate-100">{row.atributo}</span></td>
                        <td className="py-3.5 pr-6 align-top"><span className="text-sm text-slate-400">{row.autoridad_digital}</span></td>
                        <td className="py-3.5 align-top"><span className="text-sm text-rose-300">{row.impacto_comercial}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* 04 · Untapped Territories */}
      {urlResult.untapped_territories && urlResult.untapped_territories.length > 0 && (
        <>
          <motion.div variants={fade} className="flex items-center gap-3 px-1 mt-10 mb-3">
            <span className="text-xs font-mono text-slate-500 shrink-0">04</span>
            <span className="text-sm text-slate-400 font-medium">Temas donde la iA no tiene un ganador claro</span>
            <div className="flex-1 h-px bg-slate-800/30" />
          </motion.div>
          <motion.div id="zone-url-untapped-territories" variants={fadeUp} className="bg-slate-950 border border-emerald-900/40 rounded-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800 flex items-start gap-4">
              <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-emerald-500 to-teal-600 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold mb-1">Contenido sin dueño</p>
                <h3 className="text-base font-semibold text-slate-100">Temas donde la iA no tiene un ganador claro</h3>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">Ningún competidor tiene contenido de autoridad en estas búsquedas.</p>
              </div>
            </div>
            <div className="divide-y divide-slate-800/50">
              {urlResult.untapped_territories.map((territory, ti) => {
                const n = territory.nivel_competencia_ia
                const cfg = n === 'Nula' ? { label: 'Sin competencia', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' } : n === 'Muy baja' ? { label: 'Fácil de ganar', cls: 'bg-teal-500/15 text-teal-300 border-teal-500/40' } : { label: 'Moderada', cls: 'bg-sky-500/10 text-sky-300 border-sky-500/30' }
                return (
                  <div key={ti} className="flex items-start gap-4 px-5 py-4">
                    <span className="text-[11px] font-mono text-slate-500 pt-1 w-5 shrink-0 select-none">{String(ti + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <p className="text-sm font-semibold text-slate-100 leading-snug">{territory.titulo}</p>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.cls}`}>{cfg.label}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{territory.justificacion_negocio}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-800/60 px-6 py-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500/60 shrink-0" />
              <p className="text-xs text-slate-500">El plan de acción de abajo prioriza cuál de estos temas atacar primero y cómo hacerlo.</p>
            </div>
          </motion.div>
        </>
      )}

      {/* 05 · Plan de Acción */}
      {urlResult.plan_accion && urlResult.plan_accion.vehiculos.length > 0 && (
        <ActionPlanSection
          planAccion={urlResult.plan_accion}
          marca={urlResult.marca}
          sinMencion={urlResult.resultados.filter(r => !r.mencionada).length}
          totalQueries={urlResult.total_queries}
          sectionIndex="05"
        />
      )}

      {/* 06 · Evidencia */}
      <motion.div variants={fade} className="flex items-center gap-3 px-1 mt-10 mb-3">
        <span className="text-xs font-mono text-slate-500 shrink-0">06</span>
        <span className="text-sm text-slate-400 font-medium">Exportar informe</span>
        <div className="flex-1 h-px bg-slate-800/30" />
      </motion.div>
      <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }} className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
        <button
          onClick={() => setShowPerfilesDetalle(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-800/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-300">Ver los prompts exactos que usamos para este análisis</span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{urlResult.total_queries} perfiles</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{showPerfilesDetalle ? 'Cerrar' : 'Ver evidencia →'}</span>
            <span className={`text-slate-500 text-xs transition-transform ${showPerfilesDetalle ? 'rotate-180' : ''}`}>▾</span>
          </div>
        </button>
        {showPerfilesDetalle && (
          <div className="border-t border-slate-800 divide-y divide-slate-800/60">
            {urlResult.resultados.map((r, i) => (
              <div key={i} className={r.mencionada ? 'bg-emerald-950/10' : 'bg-slate-950/40'}>
                <div className="px-5 py-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{r.arquetipo}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Busca: <span className="text-slate-400">{r.driver}</span></p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {r.sentimiento && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${r.sentimiento === 'positivo' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-700/30' : r.sentimiento === 'negativo' ? 'bg-rose-950/20 text-rose-400 border-rose-800/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {r.sentimiento === 'positivo' ? '😊' : r.sentimiento === 'negativo' ? '😞' : '😐'} {r.sentimiento}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${r.mencionada ? 'bg-emerald-950/30 text-emerald-400 border-emerald-700/40' : 'bg-rose-950/20 text-rose-400 border-rose-800/40'}`}>
                      {r.mencionada ? `#${r.posicion} ✓` : 'No aparece'}
                    </span>
                  </div>
                </div>
                <div className="px-5 pb-4 space-y-3">
                  <div className="bg-slate-900 border border-slate-800 rounded-sm px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Intención de Búsqueda Simulada</p>
                    <ul className="space-y-1">
                      {queryToBullets(r.query).map((bullet, bi) => (
                        <li key={bi} className="flex items-start gap-1.5 text-xs text-slate-400">
                          <span className="text-slate-400 shrink-0 mt-0.5">•</span><span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {r.marcas_mencionadas.length > 0 && (() => {
                    const winner = r.marcas_mencionadas[0]
                    const rest = r.marcas_mencionadas.slice(1).filter(m => m.toLowerCase() !== urlResult.marca.toLowerCase()).slice(0, 2)
                    const visible = [winner, ...rest]
                    const hidden = r.marcas_mencionadas.length - visible.length
                    return (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">La iA recomienda a</p>
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {visible.map((m, j) => {
                            const isWinner = j === 0
                            const isOurBrand = m.toLowerCase() === urlResult.marca.toLowerCase()
                            return (
                              <span key={j} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border ${isOurBrand ? 'bg-sky-950/40 text-sky-400 border-sky-700/40' : isWinner ? 'bg-amber-950/30 text-amber-400 border-amber-800/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                {isWinner && !isOurBrand && <span>👑</span>}{m}
                              </span>
                            )
                          })}
                          {hidden > 0 && <span className="text-[10px] text-slate-400">+{hidden} más</span>}
                        </div>
                      </div>
                    )
                  })()}
                  {!r.mencionada && (
                    <div className="flex items-start gap-2 p-2.5 bg-rose-950/15 border border-rose-900/30 rounded-sm">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <p className="text-rose-300/80 text-xs">Este comprador no te encuentra. La iA recomienda a <span className="font-semibold text-rose-300">{r.marca_ganadora || 'la competencia'}</span>.</p>
                    </div>
                  )}
                  {r.snippet && (
                    <div>
                      <button onClick={() => setShowUrlSnippet(prev => ({ ...prev, [i]: !prev[i] }))} className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-slate-300 transition-colors">
                        <Terminal className="w-3 h-3" />
                        {showUrlSnippet[i] ? 'Ocultar respuesta original' : 'Ver respuesta original de la iA'}
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

      {/* Footer metadata */}
      <motion.div variants={fade} className="pt-2">
        <p className="text-slate-500 text-[10px] font-mono">
          Análisis generado por iA · {new Date().toLocaleDateString('es-CL')} · {urlResult.total_queries} tipos de cliente · {urlResult.mercado}
        </p>
      </motion.div>

      {/* Export */}
      <ExportBar
        userEmail={userEmail}
        userName={userName}
        marca={urlInput}
        score={urlResult.visibilidad_pct}
        modo="url"
        resultado={urlResult}
        getShareUrl={async () => {
          const code = await shareReport({ modo: 'url', marca: urlInput, resultado: urlResult })
          return `${window.location.origin}/r/?c=${code}`
        }}
      />

    </motion.div>
  )
}
