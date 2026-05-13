'use client'

import { useEffect, useState, useRef } from 'react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? ''
const API = process.env.NEXT_PUBLIC_API_URL ?? ''

// ── Password gate ─────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const check = () => {
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_ok', '1')
      onUnlock()
    } else {
      setError(true)
      setValue('')
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-4 text-center">Acceso restringido</p>
        <div className={`bg-slate-900 border rounded-sm p-6 transition-colors ${error ? 'border-rose-700' : 'border-slate-800'}`}>
          <label className="block text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Contraseña</label>
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm mb-4"
          />
          <button onClick={check} className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-50 text-sm font-medium rounded-sm transition">
            Entrar
          </button>
          {error && <p className="text-rose-400 text-xs text-center mt-3 font-mono">Contraseña incorrecta</p>}
        </div>
      </div>
    </div>
  )
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Lead {
  id: string
  nombre: string
  email: string
  marca: string | null
  query: string | null
  modo: string | null
  tiene_resultado: boolean
  created_at: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResultadoData = Record<string, any>

interface LeadDetalle extends Lead {
  resultado: ResultadoData | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const MODO_LABEL: Record<string, string> = {
  brand: 'Marca',
  url: 'URL',
  compare: 'Comparación',
  cita: 'Citabilidad',
}

const MODO_COLOR: Record<string, string> = {
  brand: 'bg-indigo-900/40 text-indigo-300 border-indigo-800',
  url: 'bg-sky-900/40 text-sky-300 border-sky-800',
  compare: 'bg-violet-900/40 text-violet-300 border-violet-800',
  cita: 'bg-teal-900/40 text-teal-300 border-teal-800',
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

function Score({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100)
  const color = pct >= 60 ? 'bg-emerald-500' : pct >= 30 ? 'bg-orange-500' : 'bg-rose-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-300 w-8 text-right">{value}</span>
    </div>
  )
}

function Pill({ text, color = 'slate' }: { text: string; color?: string }) {
  const cls: Record<string, string> = {
    slate: 'bg-slate-800 text-slate-300',
    indigo: 'bg-indigo-900/40 text-indigo-300',
    rose: 'bg-rose-900/40 text-rose-300',
    emerald: 'bg-emerald-900/40 text-emerald-300',
    orange: 'bg-orange-900/40 text-orange-300',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-medium ${cls[color] ?? cls.slate}`}>
      {text}
    </span>
  )
}

// ── Detail modal ──────────────────────────────────────────────────────────────

function DetalleModal({ lead, onClose }: { lead: LeadDetalle; onClose: () => void }) {
  const r = lead.resultado
  const modo = lead.modo

  // brand mode: resultado has shape ResultadoBusqueda { resultados: [AnalisisMarca] }
  const brandData = (modo === 'brand' && r?.resultados?.[0]) ? r.resultados[0] : null

  // url mode: resultado has flat shape with resultados[]
  const urlData = modo === 'url' ? r : null

  // compare mode
  const compareData = modo === 'compare' ? r : null

  // cita mode
  const citaData = modo === 'cita' ? r : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/90 backdrop-blur-sm p-4 pt-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-sm w-full max-w-3xl shadow-2xl mb-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-800">
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Detalle del informe</p>
            <h2 className="text-base font-bold text-white">{lead.nombre}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{lead.email} · {formatDate(lead.created_at)}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {lead.modo && (
              <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-semibold border ${MODO_COLOR[lead.modo] ?? ''}`}>
                {MODO_LABEL[lead.modo] ?? lead.modo}
              </span>
            )}
            <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-lg leading-none">✕</button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* Consulta */}
          <div className="flex flex-wrap gap-4 text-sm">
            {lead.marca && (
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Marca / URL</p>
                <p className="text-slate-200 font-medium">{lead.marca}</p>
              </div>
            )}
            {lead.query && (
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">Consulta</p>
                <p className="text-slate-200">{lead.query}</p>
              </div>
            )}
          </div>

          {!r && (
            <p className="text-slate-600 text-sm text-center py-8">Sin datos de resultado guardados para esta consulta.</p>
          )}

          {/* ── BRAND MODE ─────────────────────────────────────────────────── */}
          {brandData && (
            <>
              {/* Veredicto */}
              {brandData.prioridad_ejecutiva && (
                <section>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Veredicto ejecutivo</p>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-sm p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs">Clasificación</span>
                      <Pill text={brandData.prioridad_ejecutiva.clasificacion ?? '—'} color={brandData.prioridad_ejecutiva.clasificacion === 'Visible' ? 'emerald' : brandData.prioridad_ejecutiva.clasificacion === 'En Riesgo' ? 'orange' : 'rose'} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs">Foco principal</span>
                      <span className="text-slate-200 text-xs text-right max-w-[60%]">{brandData.prioridad_ejecutiva.foco_principal}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs">Impacto esperado</span>
                      <span className="text-slate-200 text-xs">{brandData.prioridad_ejecutiva.impacto_esperado}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-400 text-xs shrink-0">ROI Score</span>
                      <div className="flex-1 max-w-[200px]">
                        <Score value={brandData.prioridad_ejecutiva.roi_score ?? 0} />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Share of Voice */}
              <section>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Share of Voice</p>
                <div className="bg-slate-950/60 border border-slate-800 rounded-sm p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">Posición</span>
                    <span className="text-slate-200 text-xs font-mono">#{brandData.posicion_mi_marca ?? '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">Estado</span>
                    <Pill text={brandData.estado_invisibilidad ?? '—'} color={brandData.estado_invisibilidad === 'visible' ? 'emerald' : brandData.estado_invisibilidad === 'en_riesgo' ? 'orange' : 'rose'} />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400 text-xs shrink-0">Score</span>
                    <div className="flex-1 max-w-[200px]">
                      <Score value={brandData.invisibilidad_score ?? 0} />
                    </div>
                  </div>
                  {brandData.marca_ganadora && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs">Marca ganadora</span>
                      <span className="text-rose-300 text-xs font-medium">{brandData.marca_ganadora}</span>
                    </div>
                  )}
                  {brandData.marcas_mencionadas?.length > 0 && (
                    <div>
                      <span className="text-slate-400 text-xs block mb-1.5">Marcas mencionadas</span>
                      <div className="flex flex-wrap gap-1.5">
                        {brandData.marcas_mencionadas.map((m: string) => <Pill key={m} text={m} />)}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Conceptos faltantes */}
              {brandData.conceptos_faltantes?.length > 0 && (
                <section>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Brecha semántica</p>
                  <div className="flex flex-wrap gap-1.5">
                    {brandData.conceptos_faltantes.map((c: string) => <Pill key={c} text={c} color="rose" />)}
                  </div>
                </section>
              )}

              {/* Plan de acción — top 3 acciones */}
              {brandData.plan_accion?.vehiculos?.length > 0 && (
                <section>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Top acciones del plan</p>
                  <div className="space-y-2">
                    {brandData.plan_accion.vehiculos.flatMap((v: ResultadoData) => v.acciones ?? []).slice(0, 3).map((a: ResultadoData, i: number) => (
                      <div key={i} className="bg-slate-950/60 border border-slate-800 rounded-sm p-3">
                        <p className="text-slate-200 text-xs font-medium mb-1">{a.tactica_tecnica}</p>
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
            </>
          )}

          {/* ── URL MODE ───────────────────────────────────────────────────── */}
          {urlData && (
            <>
              <section>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Visibilidad en IA</p>
                <div className="bg-slate-950/60 border border-slate-800 rounded-sm p-4 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-400 text-xs shrink-0">Visibilidad</span>
                    <div className="flex-1 max-w-[200px]">
                      <Score value={Math.round(urlData.visibilidad_pct ?? 0)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">Consultas con mención</span>
                    <span className="text-slate-200 text-xs font-mono">{urlData.queries_con_mencion ?? 0} / {urlData.total_queries ?? 0}</span>
                  </div>
                  {urlData.categoria && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs">Categoría detectada</span>
                      <span className="text-slate-200 text-xs">{urlData.categoria}</span>
                    </div>
                  )}
                  {urlData.mercado && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs">Mercado</span>
                      <span className="text-slate-200 text-xs">{urlData.mercado}</span>
                    </div>
                  )}
                </div>
              </section>

              {urlData.diferenciadores?.length > 0 && (
                <section>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Diferenciadores detectados</p>
                  <div className="flex flex-wrap gap-1.5">
                    {urlData.diferenciadores.map((d: string) => <Pill key={d} text={d} color="indigo" />)}
                  </div>
                </section>
              )}

              {urlData.resultados?.length > 0 && (
                <section>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Resultados por perfil</p>
                  <div className="space-y-2">
                    {urlData.resultados.slice(0, 5).map((res: ResultadoData, i: number) => (
                      <div key={i} className="bg-slate-950/60 border border-slate-800 rounded-sm p-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-slate-300 text-xs font-medium truncate">{res.arquetipo}</p>
                          <p className="text-slate-600 text-[10px] truncate">{res.query}</p>
                        </div>
                        <Pill text={res.mencionada ? 'Mencionada' : 'No mencionada'} color={res.mencionada ? 'emerald' : 'rose'} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* ── COMPARE MODE ───────────────────────────────────────────────── */}
          {compareData && (
            <>
              <section>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Comparación de marcas</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: compareData.marca_a, score: compareData.score_marca_a },
                    { label: compareData.marca_b, score: compareData.score_marca_b },
                  ].map(({ label, score }) => (
                    <div key={label} className="bg-slate-950/60 border border-slate-800 rounded-sm p-3">
                      <p className="text-slate-300 text-xs font-medium mb-2">{label}</p>
                      <Score value={score ?? 0} />
                    </div>
                  ))}
                </div>
              </section>
              {compareData.veredicto_ia && (
                <section>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Veredicto IA</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{compareData.veredicto_ia}</p>
                </section>
              )}
              {compareData.marca_recomendada && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs">Recomendada:</span>
                  <Pill text={compareData.marca_recomendada} color="emerald" />
                </div>
              )}
            </>
          )}

          {/* ── CITA MODE ──────────────────────────────────────────────────── */}
          {citaData && (
            <>
              <section>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Citabilidad</p>
                <div className="bg-slate-950/60 border border-slate-800 rounded-sm p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">Alta citabilidad</span>
                    <Pill text={String(citaData.total_altas ?? 0)} color="emerald" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">Media citabilidad</span>
                    <Pill text={String(citaData.total_medias ?? 0)} color="orange" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">Baja citabilidad</span>
                    <Pill text={String(citaData.total_bajas ?? 0)} color="rose" />
                  </div>
                </div>
              </section>
              {citaData.resumen && (
                <section>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Resumen</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{citaData.resumen}</p>
                </section>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [unlocked, setUnlocked] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterModo, setFilterModo] = useState<string>('all')
  const [detalle, setDetalle] = useState<LeadDetalle | null>(null)
  const [detalleLoading, setDetalleLoading] = useState<string | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('admin_ok') === '1') setUnlocked(true)
    else setLoading(false)
  }, [])

  useEffect(() => {
    if (!unlocked) return
    setLoading(true)
    fetch(`${API}/api/leads`)
      .then((r) => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json() })
      .then(setLeads)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [unlocked])

  const openDetalle = (lead: Lead) => {
    if (!lead.tiene_resultado) return
    setDetalleLoading(lead.id)
    fetch(`${API}/api/leads/${lead.id}`)
      .then((r) => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json() })
      .then((data: LeadDetalle) => setDetalle(data))
      .catch((e) => setError(e.message))
      .finally(() => setDetalleLoading(null))
  }

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      l.nombre.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.marca ?? '').toLowerCase().includes(q) ||
      (l.query ?? '').toLowerCase().includes(q)
    const matchModo = filterModo === 'all' || l.modo === filterModo
    return matchSearch && matchModo
  })

  const stats = {
    total: leads.length,
    conResultado: leads.filter((l) => l.tiene_resultado).length,
    porModo: ['brand', 'url', 'compare', 'cita'].map((m) => ({
      modo: m,
      count: leads.filter((l) => l.modo === m).length,
    })),
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      {detalle && <DetalleModal lead={detalle} onClose={() => setDetalle(null)} />}

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-1">Panel de control</p>
            <h1 className="text-2xl font-bold text-white">Leads &amp; Consultas</h1>
          </div>
          <button
            onClick={() => {
              setLoading(true); setError('')
              fetch(`${API}/api/leads`).then(r => r.json()).then(setLeads).catch(e => setError(e.message)).finally(() => setLoading(false))
            }}
            className="text-xs text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-600 px-3 py-1.5 rounded-sm transition font-mono"
          >
            ↺ Actualizar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-4">
            <p className="text-xs text-slate-500 mb-1">Total leads</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-4">
            <p className="text-xs text-slate-500 mb-1">Con resultado guardado</p>
            <p className="text-3xl font-bold text-emerald-400">{stats.conResultado}</p>
          </div>
          {stats.porModo.slice(0, 2).map(({ modo, count }) => (
            <div key={modo} className="bg-slate-900 border border-slate-800 rounded-sm p-4">
              <p className="text-xs text-slate-500 mb-1">{MODO_LABEL[modo] ?? modo}</p>
              <p className="text-3xl font-bold text-slate-200">{count}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            placeholder="Buscar por nombre, correo, marca o consulta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm"
          />
          <div className="flex gap-2">
            {(['all', 'brand', 'url', 'compare', 'cita'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setFilterModo(m)}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition border ${
                  filterModo === m
                    ? 'bg-slate-700 text-slate-100 border-slate-600'
                    : 'text-slate-500 border-slate-800 hover:text-slate-300'
                }`}
              >
                {m === 'all' ? 'Todos' : MODO_LABEL[m]}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-slate-600 text-sm font-mono">Cargando...</div>
          ) : error ? (
            <div className="py-20 text-center text-rose-400 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-600 text-sm">Sin registros</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Fecha</th>
                  <th className="px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Nombre</th>
                  <th className="px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Correo</th>
                  <th className="px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Tipo</th>
                  <th className="px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Marca / URL</th>
                  <th className="px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Consulta</th>
                  <th className="px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Informe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono whitespace-nowrap">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-200 font-medium whitespace-nowrap">
                      {lead.nombre}
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      <a href={`mailto:${lead.email}`} className="hover:text-indigo-400 transition-colors">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      {lead.modo ? (
                        <span className={`inline-block px-2 py-0.5 rounded-sm text-[10px] font-semibold border ${MODO_COLOR[lead.modo] ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                          {MODO_LABEL[lead.modo] ?? lead.modo}
                        </span>
                      ) : <span className="text-slate-700">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-[180px]">
                      {lead.modo === 'url' ? (
                        <span className="font-mono text-xs text-sky-400 truncate block" title={lead.marca ?? ''}>{lead.marca ?? '—'}</span>
                      ) : (
                        <span className="truncate block" title={lead.marca ?? ''}>{lead.marca ?? '—'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-[200px]">
                      <span className="truncate block text-xs" title={lead.query ?? ''}>{lead.query ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      {lead.tiene_resultado ? (
                        <button
                          onClick={() => openDetalle(lead)}
                          disabled={detalleLoading === lead.id}
                          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition-colors"
                        >
                          {detalleLoading === lead.id ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                          )}
                          {detalleLoading === lead.id ? 'cargando...' : 'ver informe'}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-700 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                          sin datos
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && !error && (
          <p className="text-xs text-slate-700 font-mono mt-3 text-right">
            {filtered.length} de {leads.length} registros
          </p>
        )}
      </div>
    </div>
  )
}
