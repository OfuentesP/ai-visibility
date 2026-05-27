'use client'

import { useState } from 'react'
import { Globe, Search, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

import { useBrandAudit } from '@/features/audit-brand/useBrandAudit'
import { useUrlAudit } from '@/features/audit-url/useUrlAudit'
import { useCompareAudit } from '@/features/audit-compare/useCompareAudit'
import { useCitaAudit } from '@/features/audit-cita/useCitaAudit'

import { BrandForm } from '@/features/audit-brand/BrandForm'
import { BrandResults } from '@/features/audit-brand/BrandResults'
import { UrlForm } from '@/features/audit-url/UrlForm'
import { UrlResults } from '@/features/audit-url/UrlResults'
import { CompareForm } from '@/features/audit-compare/CompareForm'
import { CitaForm } from '@/features/audit-cita/CitaForm'
import { fetchQuota } from '@/features/audit-shared/api'

import type { AuditMode, QuotaInfo } from '@/features/audit-shared/types'

export default function AuditarPage() {
  // ── Shared identity state ─────────────────────────────────────────────────
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [mode, setMode] = useState<AuditMode>('brand')
  const [error, setError] = useState('')
  const [showFreemiumModal, setShowFreemiumModal] = useState(false)
  const [quota, setQuota] = useState<QuotaInfo | null>(null)

  const handleFetchQuota = async (email: string) => {
    const q = await fetchQuota(email)
    if (q) setQuota(q)
  }

  const hookConfig = { userName, userEmail, setError, onFreemiumHit: () => setShowFreemiumModal(true) }

  // ── Per-flow hooks ────────────────────────────────────────────────────────
  const brand = useBrandAudit(hookConfig)
  const url   = useUrlAudit(hookConfig)
  const cmp   = useCompareAudit({ userName, userEmail, setError })
  const cita  = useCitaAudit({ userName, userEmail, setError })

  // ── JSON download for brand flow ──────────────────────────────────────────
  const handleDownloadJson = () => {
    if (!brand.result) return
    const d = brand.result.resultados[0]
    const payload = {
      auditoria_meta: { marca: brand.brand, consulta: brand.query, fecha: new Date().toISOString(), timestamp: brand.result.timestamp },
      veredicto_ejecutivo: { clasificacion: d.prioridad_ejecutiva?.clasificacion, foco: d.prioridad_ejecutiva?.foco_principal, impacto_esperado: d.prioridad_ejecutiva?.impacto_esperado, roi_score: d.prioridad_ejecutiva?.roi_score },
      share_of_voice: { posicion_mi_marca: d.posicion_mi_marca, estado: d.estado_invisibilidad, score: d.invisibilidad_score, marcas_mencionadas: d.marcas_mencionadas, ganador: d.marca_ganadora },
      diferenciadores: { percepciones_genericas: d.percepciones_genericas, conceptos_faltantes: d.conceptos_faltantes, competidor_principal: d.competidor_principal },
      plan_accion: d.plan_accion ?? null,
      territorios_desatendidos: d.territorios_desatendidos ?? [],
      radar_intencion: brand.discoveryResult ?? null,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `auditoria-${brand.brand.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const isLoading = brand.loading || url.urlLoading
  const loadingPhase = brand.loadingPhase || url.loadingPhase

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

      {/* ── Freemium modal ──────────────────────────────────────────────────── */}
      {showFreemiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4" onClick={() => setShowFreemiumModal(false)}>
          <div className="bg-slate-900 border border-indigo-700/50 rounded-sm max-w-sm w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-3">Plan gratuito</p>
            <h3 className="text-lg font-bold text-white mb-2">Alcanzaste el límite de auditorías gratuitas</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Has usado tus 2 auditorías gratuitas. Para continuar analizando marcas y URLs sin límite, escríbenos y te habilitamos acceso completo.
            </p>
            <a href="mailto:contacto@ai-visibility.cl?subject=Acceso%20completo%20AI%20Visibility" className="block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-sm transition mb-2">
              Solicitar acceso completo →
            </a>
            <button onClick={() => setShowFreemiumModal(false)} className="w-full text-slate-400 text-xs hover:text-slate-300 transition py-1">Cerrar</button>
          </div>
        </div>
      )}

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <motion.div id="zone-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b border-slate-800 pb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-10 h-10 shrink-0">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 opacity-80" />
                <div className="absolute inset-[2px] rounded-[6px] bg-slate-950 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="url(#logo-grad)" opacity="0.9"/>
                    <path d="M2 17l10 5 10-5" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M2 12l10 5 10-5" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6"/>
                    <defs>
                      <linearGradient id="logo-grad" x1="2" y1="2" x2="22" y2="22">
                        <stop stopColor="#38bdf8"/><stop offset="1" stopColor="#818cf8"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Ai Visibility<span className="text-sky-400">.</span></h1>
                <p className="text-slate-500 text-xs font-light tracking-wide">Auditoría de posicionamiento en motores de búsqueda con IA</p>
                {brand.result && (
                  <p className="text-[10px] font-mono text-slate-500 mt-1.5">
                    {new Date().toLocaleDateString('es-CL')} · {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Search form ─────────────────────────────────────────────────── */}
          <motion.div id="zone-buscador" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-slate-900 border border-slate-800 rounded-sm p-6 mb-8">

            {/* User identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 pb-5 border-b border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Tu nombre</label>
                <input
                  type="text" placeholder="María González" value={userName} maxLength={100}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Correo de contacto</label>
                <input
                  type="email" placeholder="maria@empresa.cl" value={userEmail} maxLength={200}
                  onChange={e => setUserEmail(e.target.value)}
                  onBlur={e => handleFetchQuota(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
                />
                {quota && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {quota.limit < 0 ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-mono text-emerald-400 ml-0.5">Demo · auditorías ilimitadas</span>
                      </>
                    ) : (
                      <>
                        {Array.from({ length: quota.limit }).map((_, i) => (
                          <span key={i} className={`w-2 h-2 rounded-full ${i < quota.used ? 'bg-orange-500' : 'bg-slate-700'}`} />
                        ))}
                        <span className="text-[10px] font-mono text-slate-500 ml-0.5">{quota.used} de {quota.limit} auditorías usadas</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-1 mb-5 bg-slate-950 border border-slate-800 rounded-sm p-1 w-fit">
              <button
                onClick={() => { setMode('brand'); setError('') }}
                className={`px-4 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition ${mode === 'brand' ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
              >Por marca</button>
              <button
                onClick={() => { setMode('url'); setError('') }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition ${mode === 'url' ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Globe className="w-3 h-3" /> Por URL
              </button>
              <button
                onClick={() => { setMode('compare'); setError('') }}
                className={`hidden flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition ${mode === 'compare' ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Search className="w-3 h-3" /> Comparar
              </button>
              <button
                onClick={() => { setMode('cita'); setError('') }}
                className={`hidden flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition ${mode === 'cita' ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <span className="text-xs">✦</span> Oportunidades
              </button>
            </div>

            {/* Active form */}
            {mode === 'brand' && (
              <BrandForm
                brand={brand.brand} query={brand.query}
                loading={brand.loading} loadingPhase={brand.loadingPhase}
                onBrandChange={brand.setBrand} onQueryChange={brand.setQuery}
                onSubmit={brand.handleAudit}
              />
            )}
            {mode === 'url' && (
              <UrlForm
                urlInput={url.urlInput} urlLoading={url.urlLoading} loadingPhase={url.loadingPhase}
                onUrlChange={url.setUrlInput}
                onSubmit={url.handleAuditFromUrl}
                onLoadDemo={url.setUrlResult}
              />
            )}
            {mode === 'compare' && (
              <CompareForm
                compareA={cmp.compareA} compareB={cmp.compareB} compareCategoria={cmp.compareCategoria}
                compareLoading={cmp.compareLoading}
                onChangeA={cmp.setCompareA} onChangeB={cmp.setCompareB} onChangeCategoria={cmp.setCompareCategoria}
                onSubmit={cmp.handleCompare}
              />
            )}
            {mode === 'cita' && (
              <CitaForm
                citaMarca={cita.citaMarca} citaCategoria={cita.citaCategoria} citaLoading={cita.citaLoading}
                onChangeMarca={cita.setCitaMarca} onChangeCategoria={cita.setCitaCategoria}
                onSubmit={cita.handleCitability}
              />
            )}

            {/* Loading indicator */}
            {isLoading && (
              <motion.div id="zone-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-slate-800 border border-slate-700 rounded-sm text-slate-400 text-xs flex items-center gap-2">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                {loadingPhase}
              </motion.div>
            )}

            {/* Error */}
            {error && <div id="zone-error" className="mt-4 p-3 bg-red-950/40 border border-red-800/50 rounded-sm text-red-200 text-sm font-medium">{error}</div>}
          </motion.div>

          {/* ── Citability results ──────────────────────────────────────────── */}
          {mode === 'cita' && cita.citaResult && (
            <motion.div id="zone-cita-resultados" className="space-y-5 mb-8" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}>
              <motion.div variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } }} className="bg-slate-900 border border-slate-800 rounded-sm px-6 py-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Directorio de Citabilidad</p>
                    <h2 className="text-slate-100 font-semibold text-lg">{cita.citaResult.marca} · {cita.citaResult.categoria}</h2>
                    <p className="text-slate-400 text-sm mt-1">{cita.citaResult.resumen}</p>
                  </div>
                  <div className="flex gap-4 shrink-0">
                    {[
                      { label: 'Fácil', count: cita.citaResult.total_bajas, color: 'emerald' },
                      { label: 'Media', count: cita.citaResult.total_medias, color: 'amber' },
                      { label: 'Alta', count: cita.citaResult.total_altas, color: 'rose' },
                    ].map(({ label, count, color }) => (
                      <div key={label} className="flex flex-col items-center">
                        <span className={`text-2xl font-light tabular-nums text-${color}-400`}>{count}</span>
                        <span className={`text-[10px] uppercase tracking-wide text-${color}-600`}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Dificultad baja — publica esta semana</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Dificultad media — vale el esfuerzo</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />Dominado — requiere diferenciación fuerte</span>
                </div>
              </motion.div>
              {cita.citaResult.territorios.map((t, i) => {
                const colorMap: Record<string, { bar: string; badge: string; border: string }> = {
                  baja:  { bar: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', border: 'border-emerald-800/30' },
                  media: { bar: 'bg-amber-500',   badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',     border: 'border-amber-800/20' },
                  alta:  { bar: 'bg-rose-500',    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',       border: 'border-rose-800/20' },
                }
                const c = colorMap[t.nivel] ?? colorMap.media
                return (
                  <motion.div key={i} variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }} className={`bg-slate-900 border ${c.border} rounded-sm overflow-hidden`}>
                    <div className="flex items-stretch">
                      <div className="w-1 shrink-0 bg-slate-800 relative">
                        <div className={`absolute bottom-0 left-0 right-0 ${c.bar} transition-all duration-700`} style={{ height: `${100 - t.dificultad}%` }} />
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
                            {t.marcas_mencionadas.slice(0, 5).map((m, j) => <span key={j} className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded">{m}</span>)}
                          </div>
                        )}
                        {t.nivel !== 'alta' && (
                          <div className="mt-2 pt-2 border-t border-slate-800">
                            <p className="text-xs text-slate-300"><span className="text-emerald-500 font-semibold mr-1">→</span>{t.recomendacion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="border-t border-slate-800 pt-3">
                <p className="text-slate-500 text-[10px] font-mono">Gap analysis generado por GPT-4o-mini · {cita.citaResult.territorios.length} territorios auditados · {new Date().toLocaleString('es-CL')}</p>
              </motion.div>
            </motion.div>
          )}

          {/* ── Compare results ─────────────────────────────────────────────── */}
          {mode === 'compare' && cmp.compareResult && (
            <motion.div id="zone-compare-resultados" className="space-y-6 mb-8" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}>
              <motion.div variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } } }} className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
                <div className="flex items-stretch">
                  <div className={`w-1.5 shrink-0 ${cmp.compareResult.marca_recomendada.toLowerCase().includes(cmp.compareResult.marca_a.toLowerCase()) ? 'bg-sky-500' : 'bg-rose-500'}`} />
                  <div className="flex-1 px-6 py-5">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex gap-6 shrink-0">
                        {[{ marca: cmp.compareResult.marca_a, score: cmp.compareResult.score_marca_a }, { marca: cmp.compareResult.marca_b, score: cmp.compareResult.score_marca_b }].map(({ marca, score }) => {
                          const isWinner = cmp.compareResult!.marca_recomendada.toLowerCase().includes(marca.toLowerCase())
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
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Veredicto de la IA</p>
                        <p className="text-slate-200 text-sm leading-relaxed">{cmp.compareResult.veredicto_ia}</p>
                        <p className="text-slate-400 text-xs mt-2">
                          <span className="font-semibold text-sky-400">{cmp.compareResult.marca_recomendada}</span>
                          {' — '}{cmp.compareResult.razon_recomendacion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { marca: cmp.compareResult.marca_a, ventajas: cmp.compareResult.ventajas_marca_a, debilidades: cmp.compareResult.debilidades_marca_a, isWinner: cmp.compareResult.marca_recomendada.toLowerCase().includes(cmp.compareResult.marca_a.toLowerCase()) },
                  { marca: cmp.compareResult.marca_b, ventajas: cmp.compareResult.ventajas_marca_b, debilidades: cmp.compareResult.debilidades_marca_b, isWinner: cmp.compareResult.marca_recomendada.toLowerCase().includes(cmp.compareResult.marca_b.toLowerCase()) },
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
                          <ul className="space-y-1.5">{ventajas.map((v, i) => <li key={i} className="flex items-start gap-2 text-xs text-slate-300"><span className="text-emerald-500 shrink-0 mt-0.5">+</span>{v}</li>)}</ul>
                        </div>
                      )}
                      {debilidades.length > 0 && (
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-rose-500/70 mb-1.5">Debilidades</p>
                          <ul className="space-y-1.5">{debilidades.map((d, i) => <li key={i} className="flex items-start gap-2 text-xs text-slate-400"><span className="text-rose-500 shrink-0 mt-0.5">−</span>{d}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="border-t border-slate-800 pt-3">
                <p className="text-slate-500 text-[10px] font-mono">Análisis generado por GPT-4o-mini · {cmp.compareResult.categoria} · {new Date().toLocaleString('es-CL')}</p>
              </motion.div>
            </motion.div>
          )}

          {/* ── URL results ─────────────────────────────────────────────────── */}
          {mode === 'url' && url.urlResult && (
            <UrlResults
              urlResult={url.urlResult}
              urlInput={url.urlInput}
              userEmail={userEmail}
              userName={userName}
            />
          )}

          {/* ── Brand results ────────────────────────────────────────────────── */}
          {mode === 'brand' && brand.result && (
            <BrandResults
              result={brand.result}
              brand={brand.brand}
              query={brand.query}
              userEmail={userEmail}
              userName={userName}
              discoveryResult={brand.discoveryResult}
              discoveryLoading={brand.discoveryLoading}
              trendsResult={brand.trendsResult}
              trendsLoading={brand.trendsLoading}
              onDownloadJson={handleDownloadJson}
            />
          )}

          {/* ── Brand footer ─────────────────────────────────────────────────── */}
          {mode === 'brand' && brand.result && (
            <motion.div id="zone-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="border-t border-slate-800 bg-slate-950 p-8 mt-10">
              <div className="max-w-5xl mx-auto">
                <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-4">Metodología y Fuentes</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Motor de Inteligencia</p>
                    <p className="text-slate-500 text-xs font-mono leading-relaxed">• OpenAI GPT-4o-mini<br />• Análisis Multimodelo<br />• Contexto Regional Chile</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Fuentes de Verdad</p>
                    <p className="text-slate-500 text-xs font-mono leading-relaxed">• Google Trends RT (CL)<br />• SERP Data en Tiempo Real<br />• Índice de Menciones IA</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide mb-2">Metodología</p>
                    <p className="text-slate-500 text-xs font-mono leading-relaxed">• Synthetic Users Simulation<br />• Score 0–100 Normalizado<br />• PAS: Problema → Solución</p>
                  </div>
                </div>
                <p className="text-slate-800 text-[10px] font-mono mt-6">Datos actualizados: {new Date().toLocaleString('es-CL')}</p>
              </div>
              <div className="border-t border-slate-900 mt-8 pt-6">
                <p className="text-slate-800 text-[10px] leading-relaxed max-w-3xl">
                  Ai Visibility es una plataforma especializada en Generative Engine Optimization (GEO). Nuestra tecnología permite a las empresas auditar su Share of Model (SoM), una métrica crítica que mide el porcentaje de menciones de una marca en las respuestas de modelos de lenguaje de gran escala (LLM). A diferencia del SEO de Google, Ai Visibility se enfoca en la arquitectura de recuperación de información (RAG) y en cómo los agentes de IA sintetizan la reputación corporativa en entornos conversacionales.
                </p>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
