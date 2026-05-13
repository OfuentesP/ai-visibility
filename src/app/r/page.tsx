'use client'

import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

const MODO_LABEL: Record<string, string> = {
  brand: 'Auditoría de marca',
  url: 'Auditoría por URL',
  compare: 'Comparación de marcas',
  cita: 'Análisis de citabilidad',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Score({ value, max = 100, label }: { value: number; max?: number; label: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const color = pct >= 60 ? 'bg-emerald-500' : pct >= 30 ? 'bg-orange-500' : 'bg-rose-500'
  const text = pct >= 60 ? 'text-emerald-400' : pct >= 30 ? 'text-orange-400' : 'text-rose-400'
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-sm p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold mb-2 ${text}`}>{value}</p>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Pill({ text }: { text: string }) {
  return <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] rounded-sm">{text}</span>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BrandView({ r, marca }: { r: any; marca: string | null }) {
  const d = r?.resultados?.[0]
  if (!d) return <p className="text-slate-600 text-sm">Sin datos de análisis.</p>

  const rawScore = d.invisibilidad_score ?? 0
  const displayScore = rawScore === 0 ? 10 : rawScore
  const estado = d.estado_invisibilidad
  const strokeColor = estado === 'visible' ? '#10b981' : estado === 'en_riesgo' ? '#f97316' : '#f43f5e'
  const label = rawScore === 0 ? 'Riesgo Crítico' : estado === 'visible' ? 'Visible' : estado === 'en_riesgo' ? 'En Riesgo' : 'Invisible'
  const r54 = 54, cx = 64, cy = 64
  const circ = 2 * Math.PI * r54
  const dash = circ * (1 - displayScore / 100)

  const sent = d.sentimiento
  const sentColor = sent === 'positivo' ? 'text-emerald-400' : sent === 'negativo' ? 'text-rose-400' : 'text-yellow-400'
  const sentBg = sent === 'positivo' ? 'bg-emerald-950/30 border-emerald-800/40' : sent === 'negativo' ? 'bg-rose-950/30 border-rose-800/40' : 'bg-yellow-950/30 border-yellow-800/40'
  const sentLabel = sent === 'positivo' ? 'Positivo' : sent === 'negativo' ? 'Negativo / Riesgo de Alucinación' : 'Neutral'

  const pos = d.posicion_mi_marca
  const ganador = d.competidor_principal || d.marca_ganadora || 'la competencia'
  const clasificacion = d.prioridad_ejecutiva?.clasificacion ?? (pos === 0 || pos > 5 ? 'Atacar' : pos <= 2 ? 'Mantener' : 'Defender')
  const isAtacar = clasificacion === 'Atacar'
  const accentBorder = isAtacar ? 'border-l-rose-500' : clasificacion === 'Defender' ? 'border-l-amber-500' : 'border-l-emerald-500'

  const marcasRivales = (d.marcas_mencionadas ?? []).filter((m: string) => m.toLowerCase() !== (marca ?? '').toLowerCase()).slice(0, 2)
  const rivales = marcasRivales.length >= 2 ? `${marcasRivales[0]} y ${marcasRivales[1]}` : marcasRivales[0] || ganador

  let titulo = '', subtitulo = ''
  if (pos === 0 || rawScore < 10) {
    titulo = 'Riesgo Crítico de Invisibilidad Digital'
    subtitulo = `Sus clientes potenciales están siendo derivados activamente a ${rivales} porque la IA no encuentra fuentes de confianza que validen su propuesta de valor.`
  } else if (pos > 5 || rawScore < 30) {
    titulo = `${marca ?? 'Tu marca'} está perdiendo demanda activa`
    subtitulo = `${rivales} captura la intención de compra de sus clientes antes de que lleguen a usted.`
  } else if (pos === 1) {
    titulo = `${marca ?? 'Tu marca'} lidera — proteja esa posición`
    subtitulo = `La IA lo recomienda primero, pero ${ganador} está invirtiendo para desplazarle.`
  } else {
    titulo = `${marca ?? 'Tu marca'} aparece, pero ${ganador} se lleva la decisión`
    subtitulo = `Está en posición #${pos}. Los compradores que llegan a la IA ven primero a ${ganador}.`
  }

  // share of voice
  const brandFreq: Record<string, number> = {}
  ;(d.marcas_mencionadas ?? []).forEach((m: string, i: number) => {
    brandFreq[m] = Math.max(10 - i * 2, 1)
  })
  const sov = Object.entries(brandFreq).sort((a, b) => b[1] - a[1])
  const maxFreq = sov[0]?.[1] || 1

  const topActions: { tactica_tecnica: string; tiempo_indexacion_ia: string; ice_score: number; area_responsable?: string }[] =
    (d.plan_accion?.vehiculos ?? []).flatMap((v: { acciones: unknown[] }) => v.acciones)
      .sort((a: { ice_score: number }, b: { ice_score: number }) => b.ice_score - a.ice_score)
      .slice(0, 3)

  return (
    <div className="space-y-6">

      {/* Score ring + sentimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 flex items-center gap-6">
          <svg width="128" height="128" viewBox="0 0 128 128" className="shrink-0">
            <circle cx={cx} cy={cy} r={r54} fill="none" stroke="#1e293b" strokeWidth="10" />
            <circle cx={cx} cy={cy} r={r54} fill="none" stroke={strokeColor} strokeWidth="10"
              strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
              transform="rotate(-90 64 64)" />
            <text x="64" y="60" textAnchor="middle" fill={strokeColor} fontSize="22" fontWeight="300" fontFamily="monospace">{displayScore}</text>
            <text x="64" y="76" textAnchor="middle" fill="#64748b" fontSize="10">/100</text>
          </svg>
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">AI Readiness Score</p>
            <p className="text-lg font-semibold" style={{ color: strokeColor }}>{label}</p>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">Posición #{pos} en el radar de la IA</p>
          </div>
        </div>

        <div className={`border rounded-sm p-6 ${sentBg}`}>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Percepción de la IA</p>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${sentBg} ${sentColor} mb-3 inline-block`}>{sentLabel}</span>
          {d.recomendacion_ia && (
            <p className="text-slate-300 text-sm leading-relaxed mt-2 line-clamp-4">{d.recomendacion_ia}</p>
          )}
        </div>
      </div>

      {/* Resumen ejecutivo */}
      <div className={`bg-slate-900 border border-slate-700 border-l-4 ${accentBorder} rounded-sm p-5`}>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Resumen ejecutivo</p>
        <p className="text-white font-bold text-base leading-snug mb-2">{titulo}</p>
        <p className="text-slate-400 text-sm leading-relaxed mb-3">{subtitulo}</p>
        {d.prioridad_ejecutiva && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-800 text-xs">
            <div><span className="text-slate-500">Foco: </span><span className="text-slate-200">{d.prioridad_ejecutiva.foco_principal}</span></div>
            <div><span className="text-slate-500">Impacto: </span><span className="text-slate-200">{d.prioridad_ejecutiva.impacto_esperado}</span></div>
          </div>
        )}
      </div>

      {/* Share of Voice */}
      {sov.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">¿A quién recomienda la IA?</p>
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 space-y-3">
            {sov.map(([m, freq], i) => {
              const pct = Math.round((freq / maxFreq) * 100)
              const isUser = m.toLowerCase() === (marca ?? '').toLowerCase()
              return (
                <div key={m} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-600 w-4 shrink-0">#{i + 1}</span>
                  <span className={`text-xs w-28 shrink-0 truncate ${isUser ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}>
                    {isUser ? `→ ${m}` : m}
                  </span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${isUser ? 'bg-sky-500' : i === 0 ? 'bg-orange-500' : 'bg-slate-600'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 w-8 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Brecha semántica */}
      {d.conceptos_faltantes?.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Conceptos que la IA no asocia a tu marca</p>
          <div className="flex flex-wrap gap-1.5">
            {d.conceptos_faltantes.map((c: string) => (
              <span key={c} className="inline-block px-2 py-0.5 bg-rose-900/30 text-rose-300 text-[10px] rounded-sm">{c}</span>
            ))}
          </div>
        </section>
      )}

      {/* Plan de acción */}
      {topActions.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Plan de acción — top acciones</p>
          <div className="space-y-2">
            {topActions.map((a, i) => (
              <div key={i} className={`bg-slate-900 border rounded-sm p-4 ${i === 0 ? 'border-amber-800/60' : 'border-slate-800'}`}>
                {i === 0 && <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-1">↑ Empezar aquí</p>}
                <p className="text-slate-200 text-sm font-medium leading-snug mb-1">{a.tactica_tecnica}</p>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono">
                  <span>ICE {a.ice_score}</span>
                  <span>·</span>
                  <span>{a.tiempo_indexacion_ia}</span>
                  {a.area_responsable && <><span>·</span><span>{a.area_responsable}</span></>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CompareView({ r }: { r: any }) {
  const scoreColorA = r.score_marca_a >= 60 ? 'text-emerald-400' : r.score_marca_a >= 30 ? 'text-orange-400' : 'text-rose-400'
  const scoreColorB = r.score_marca_b >= 60 ? 'text-emerald-400' : r.score_marca_b >= 30 ? 'text-orange-400' : 'text-rose-400'
  return (
    <div className="space-y-6">
      {/* Scores */}
      <section className="grid grid-cols-2 gap-4">
        {[
          { label: r.marca_a, score: r.score_marca_a, color: scoreColorA },
          { label: r.marca_b, score: r.score_marca_b, color: scoreColorB },
        ].map(({ label, score, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-sm p-4">
            <p className="text-xs text-slate-500 mb-1 truncate">{label}</p>
            <p className={`text-3xl font-bold font-mono ${color}`}>{score}</p>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
              <div className={`h-full rounded-full ${color.replace('text-', 'bg-').replace('-400', '-500')}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        ))}
      </section>

      {/* Veredicto */}
      {r.veredicto_ia && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Veredicto de la IA</p>
          <p className="text-slate-300 text-sm leading-relaxed bg-slate-900 border border-slate-800 rounded-sm p-4">{r.veredicto_ia}</p>
        </section>
      )}

      {/* Recomendada */}
      {r.marca_recomendada && (
        <div className="flex items-center gap-3 bg-emerald-900/20 border border-emerald-800/40 rounded-sm p-4">
          <span className="text-emerald-400 text-lg">✓</span>
          <div>
            <p className="text-[10px] text-emerald-600 uppercase tracking-widest mb-0.5">Recomendada por la IA</p>
            <p className="text-emerald-300 font-bold">{r.marca_recomendada}</p>
            {r.razon_recomendacion && <p className="text-slate-400 text-xs mt-1">{r.razon_recomendacion}</p>}
          </div>
        </div>
      )}

      {/* Ventajas y debilidades */}
      {[
        { marca: r.marca_a, ventajas: r.ventajas_marca_a, debilidades: r.debilidades_marca_a },
        { marca: r.marca_b, ventajas: r.ventajas_marca_b, debilidades: r.debilidades_marca_b },
      ].map(({ marca, ventajas, debilidades }) => (
        <section key={marca}>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">{marca}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ventajas?.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-sm p-3">
                <p className="text-[10px] text-emerald-600 uppercase tracking-widest mb-2">Ventajas</p>
                <ul className="space-y-1">
                  {ventajas.map((v: string) => <li key={v} className="text-slate-300 text-xs flex gap-2"><span className="text-emerald-500 shrink-0">+</span>{v}</li>)}
                </ul>
              </div>
            )}
            {debilidades?.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-sm p-3">
                <p className="text-[10px] text-rose-600 uppercase tracking-widest mb-2">Debilidades</p>
                <ul className="space-y-1">
                  {debilidades.map((d: string) => <li key={d} className="text-slate-300 text-xs flex gap-2"><span className="text-rose-500 shrink-0">−</span>{d}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CitaView({ r }: { r: any }) {
  const nivelColor: Record<string, string> = {
    baja: 'text-emerald-400 bg-emerald-900/20 border-emerald-800/40',
    media: 'text-orange-400 bg-orange-900/20 border-orange-800/40',
    alta: 'text-rose-400 bg-rose-900/20 border-rose-800/40',
  }
  const nivelLabel: Record<string, string> = {
    baja: 'Oportunidad alta',
    media: 'Competencia media',
    alta: 'Territorio dominado',
  }
  return (
    <div className="space-y-6">
      {/* Resumen stats */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{r.total_bajas ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-1">Oportunidades</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 text-center">
          <p className="text-2xl font-bold text-orange-400">{r.total_medias ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-1">Competencia media</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 text-center">
          <p className="text-2xl font-bold text-rose-400">{r.total_altas ?? 0}</p>
          <p className="text-[10px] text-slate-500 mt-1">Dominados</p>
        </div>
      </section>

      {/* Resumen texto */}
      {r.resumen && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Resumen</p>
          <p className="text-slate-300 text-sm leading-relaxed bg-slate-900 border border-slate-800 rounded-sm p-4">{r.resumen}</p>
        </section>
      )}

      {/* Territorios */}
      {r.territorios?.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Territorios analizados</p>
          <div className="space-y-3">
            {r.territorios.map((t: { query: string; dificultad: number; nivel: string; marcas_mencionadas: string[]; razon: string; recomendacion: string }, i: number) => (
              <div key={i} className={`border rounded-sm p-4 ${nivelColor[t.nivel] ?? 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-slate-200 text-xs font-medium flex-1">{t.query}</p>
                  <span className={`text-[10px] font-mono shrink-0 ${t.nivel === 'baja' ? 'text-emerald-400' : t.nivel === 'media' ? 'text-orange-400' : 'text-rose-400'}`}>
                    {nivelLabel[t.nivel] ?? t.nivel}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mb-2">{t.razon}</p>
                {t.recomendacion && (
                  <p className="text-slate-300 text-[11px] border-t border-slate-700 pt-2 mt-2">→ {t.recomendacion}</p>
                )}
                {t.marcas_mencionadas?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.marcas_mencionadas.map((m: string) => (
                      <span key={m} className="inline-block px-1.5 py-0.5 bg-slate-800/60 text-slate-400 text-[10px] rounded-sm">{m}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UrlView({ r }: { r: any }) {
  const score = Math.round(r.visibilidad_pct ?? 0)
  const invisible = (r.total_queries ?? 0) - (r.queries_con_mencion ?? 0)
  const scoreColor = score === 0 ? 'text-rose-400' : score < 60 ? 'text-amber-400' : 'text-emerald-400'
  const accentBorder = score === 0 ? 'border-l-rose-500' : score < 60 ? 'border-l-amber-500' : 'border-l-emerald-500'

  // calcular top competitor
  const ganadorCounts: Record<string, number> = {}
  ;(r.resultados ?? []).forEach((res: { marca_ganadora?: string }) => {
    if (res.marca_ganadora && res.marca_ganadora.toLowerCase() !== (r.marca ?? '').toLowerCase()) {
      ganadorCounts[res.marca_ganadora] = (ganadorCounts[res.marca_ganadora] || 0) + 1
    }
  })
  const topCompetitor = Object.entries(ganadorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'la competencia'

  // share of voice — marcas mencionadas con frecuencia
  const brandFreq: Record<string, number> = {}
  ;(r.resultados ?? []).forEach((res: { marcas_mencionadas?: string[] }) => {
    (res.marcas_mencionadas ?? []).forEach((m: string, i: number) => {
      brandFreq[m] = (brandFreq[m] || 0) + Math.max(10 - i * 2, 1)
    })
  })
  const shareOfVoice = Object.entries(brandFreq).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxFreq = shareOfVoice[0]?.[1] || 1

  // top 3 actions from plan
  const topActions: { tactica_tecnica: string; tiempo_indexacion_ia: string; ice_score: number; area_responsable?: string }[] =
    (r.plan_accion?.vehiculos ?? []).flatMap((v: { acciones: unknown[] }) => v.acciones)
      .sort((a: { ice_score: number }, b: { ice_score: number }) => b.ice_score - a.ice_score)
      .slice(0, 3)

  return (
    <div className="space-y-6">

      {/* Resumen ejecutivo */}
      <div className={`bg-slate-900 border border-slate-700 border-l-4 ${accentBorder} rounded-sm overflow-hidden`}>
        <div className="px-5 pt-5 pb-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">{r.marca} · {r.mercado}</p>
            <p className="text-xs font-mono text-slate-600">{r.categoria}</p>
          </div>
          <div className="text-right shrink-0">
            <p className={`text-3xl font-bold font-mono tabular-nums ${scoreColor}`}>{score}<span className="text-lg">%</span></p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">visibilidad en IA</p>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          <div className="px-5 py-4 flex gap-3 items-start">
            <span className="text-rose-400 text-base font-bold leading-none mt-0.5 shrink-0">①</span>
            <div>
              <p className="text-sm font-semibold text-white leading-snug mb-1">
                {invisible === 0
                  ? 'Apareces en todas las búsquedas de IA'
                  : invisible === r.total_queries
                  ? 'La IA no te menciona en ninguna búsqueda'
                  : `De ${r.total_queries} búsquedas con IA, ${invisible} no te incluyen`}
              </p>
              <p className="text-sm text-slate-400">{invisible === 0 ? 'Mantén y expande tu posición.' : `Esas consultas las gana ${topCompetitor}.`}</p>
            </div>
          </div>
          <div className="px-5 py-4 flex gap-3 items-start">
            <span className="text-amber-400 text-base font-bold leading-none mt-0.5 shrink-0">②</span>
            <div>
              <p className="text-sm font-semibold text-white leading-snug mb-1">La IA elige a <span className="text-amber-400">{topCompetitor}</span> en esas búsquedas</p>
              <p className="text-sm text-slate-400">Tiene más presencia en las fuentes que la IA consulta.</p>
            </div>
          </div>
          <div className="px-5 py-4 flex gap-3 items-start">
            <span className="text-emerald-400 text-base font-bold leading-none mt-0.5 shrink-0">③</span>
            <div>
              <p className="text-sm font-semibold text-white leading-snug mb-1">
                {topActions.length > 0 ? `${topActions.length} acciones concretas para recuperar posición` : 'Plan de recuperación disponible más abajo'}
              </p>
              <p className="text-sm text-slate-400">
                {topActions[0]?.tiempo_indexacion_ia ? `Primera acción visible en ${topActions[0].tiempo_indexacion_ia.split('(')[0].trim()}` : 'Ver plan detallado más abajo'}
              </p>
            </div>
          </div>
        </div>

        {r.diferenciadores?.length > 0 && (
          <div className="border-t border-slate-800/60 px-5 py-3">
            <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-2">Diferenciadores que la IA no menciona</p>
            <div className="flex flex-wrap gap-2">
              {r.diferenciadores.slice(0, 4).map((d: string) => (
                <span key={d} className="text-xs text-slate-400 bg-slate-800/50 border border-slate-700/60 rounded px-2.5 py-1">{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share of voice */}
      {shareOfVoice.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">¿A quién recomienda la IA?</p>
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 space-y-3">
            {shareOfVoice.map(([marca, freq]) => {
              const pct = Math.round((freq / maxFreq) * 100)
              const isUser = marca.toLowerCase() === (r.marca ?? '').toLowerCase()
              return (
                <div key={marca} className="flex items-center gap-3">
                  <span className={`text-xs w-32 shrink-0 truncate ${isUser ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}>
                    {isUser ? `→ ${marca}` : marca}
                  </span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isUser ? 'bg-sky-500' : 'bg-slate-600'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 w-8 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Resultados por perfil */}
      {r.resultados?.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Resultados por perfil de búsqueda</p>
          <div className="space-y-2">
            {r.resultados.map((res: { arquetipo: string; query: string; mencionada: boolean; marca_ganadora?: string }, i: number) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-sm p-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-slate-300 text-xs font-medium truncate">{res.arquetipo}</p>
                  <p className="text-slate-600 text-[10px] truncate">{res.query}</p>
                  {!res.mencionada && res.marca_ganadora && (
                    <p className="text-[10px] text-amber-600 mt-0.5">Gana: {res.marca_ganadora}</p>
                  )}
                </div>
                <span className={`text-[10px] font-mono shrink-0 ${res.mencionada ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {res.mencionada ? 'Mencionada' : 'No mencionada'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Plan de acción */}
      {topActions.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Plan de acción — top acciones</p>
          <div className="space-y-2">
            {topActions.map((a, i) => (
              <div key={i} className={`bg-slate-900 border rounded-sm p-4 ${i === 0 ? 'border-amber-800/60' : 'border-slate-800'}`}>
                {i === 0 && <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-1">↑ Empezar aquí</p>}
                <p className="text-slate-200 text-sm font-medium leading-snug mb-1">{a.tactica_tecnica}</p>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono">
                  <span>ICE {a.ice_score}</span>
                  <span>·</span>
                  <span>{a.tiempo_indexacion_ia}</span>
                  {a.area_responsable && <><span>·</span><span>{a.area_responsable}</span></>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default function SharedReportPage() {
  const [data, setData] = useState<{
    code: string; modo: string; marca: string | null
    query: string | null; resultado: Record<string, unknown>; created_at: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('c')
    if (!code) { setError('Código de informe no especificado.'); setLoading(false); return }
    fetch(`${API}/api/r/${code}`)
      .then(r => { if (!r.ok) throw new Error('Informe no encontrado'); return r.json() })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-2">Informe compartido · AI Visibility</p>
          {data && (
            <>
              <h1 className="text-2xl font-bold text-white mb-1">
                {MODO_LABEL[data.modo] ?? data.modo}
                {data.marca && <span className="text-slate-400 font-normal"> — {data.marca}</span>}
              </h1>
              {data.query && <p className="text-slate-500 text-sm">Consulta: {data.query}</p>}
              <p className="text-slate-700 text-xs font-mono mt-1">Generado el {formatDate(data.created_at)}</p>
            </>
          )}
        </div>

        {loading && <p className="text-slate-600 font-mono text-sm">Cargando informe...</p>}
        {error && <p className="text-rose-400 text-sm">{error}</p>}

        {data && (
          <div>
            {data.modo === 'brand' && <BrandView r={data.resultado} marca={data.marca} />}
            {data.modo === 'url' && <UrlView r={data.resultado} />}
            {data.modo === 'compare' && <CompareView r={data.resultado} />}
            {data.modo === 'cita' && <CitaView r={data.resultado} />}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-800 text-center">
          <a href="/auditar" className="text-xs text-slate-600 hover:text-indigo-400 transition font-mono">
            Auditar mi propia marca → ai-visibility.cl
          </a>
        </div>
      </div>
    </div>
  )
}
