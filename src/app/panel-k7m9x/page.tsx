'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? ''
const API = process.env.NEXT_PUBLIC_API_URL ?? ''

// ── Password gate ─────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const check = () => {
    if (!ADMIN_PASSWORD) {
      setError(true)
      return
    }
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
        <p className="text-xs sm:text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-4 text-center">Acceso restringido</p>
        <div className={`bg-slate-900 border rounded-sm p-6 transition-colors ${error ? 'border-rose-700' : 'border-slate-800'}`}>
          <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">Contraseña</label>
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
          {error && (
            <p className="text-rose-400 text-xs text-center mt-3 font-mono">
              {!ADMIN_PASSWORD ? 'NEXT_PUBLIC_ADMIN_PASSWORD no está configurado en el build' : 'Contraseña incorrecta'}
            </p>
          )}
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

interface LeadDetalle extends Lead {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resultado: Record<string, any> | null
}

interface Metrics {
  total_leads: number
  emails_unicos: number
  con_resultado: number
  sin_resultado: number
  por_modo: Record<string, number>
  por_dia: { fecha: string; count: number }[]
  cache_total: number
  cache_activo: number
  freemium_bloqueados: number
}

interface HistorialEntry {
  id: string
  marca: string | null
  query: string | null
  modo: string | null
  score: number | null
  created_at: string | null
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

const PIE_COLORS = ['#818cf8', '#38bdf8', '#a78bfa', '#2dd4bf']

function formatDate(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })
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
    <span className={`inline-block px-2 py-0.5 rounded-sm text-xs sm:text-[10px] font-medium ${cls[color] ?? cls.slate}`}>
      {text}
    </span>
  )
}

// ── Historial modal ───────────────────────────────────────────────────────────

function HistorialModal({ email, onClose }: { email: string; onClose: () => void }) {
  const [entries, setEntries] = useState<HistorialEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/api/user/history?email=${encodeURIComponent(email)}`)
      .then(r => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json() })
      .then(setEntries)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [email])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/90 backdrop-blur-sm p-4 pt-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-sm w-full max-w-2xl shadow-2xl mb-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <p className="text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Historial de consultas</p>
            <h2 className="text-sm font-bold text-white">{email}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-300 text-lg leading-none">✕</button>
        </div>

        <div className="px-6 py-5">
          {loading && <p className="text-slate-400 text-sm text-center py-8 font-mono">Cargando...</p>}
          {error && <p className="text-rose-400 text-sm text-center py-8">{error}</p>}
          {!loading && !error && entries.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-8">Sin auditorías registradas para este email.</p>
          )}
          {entries.length > 0 && (
            <div className="space-y-2">
              {entries.map((e) => {
                const scoreVal = e.score != null ? Math.round(e.score) : null
                const scoreColor = scoreVal == null ? 'text-slate-400' : scoreVal >= 60 ? 'text-emerald-400' : scoreVal >= 30 ? 'text-orange-400' : 'text-rose-400'
                return (
                  <div key={e.id} className="bg-slate-950/60 border border-slate-800 rounded-sm p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {e.modo && (
                          <span className={`inline-block px-1.5 py-0.5 rounded-sm text-xs sm:text-[10px] font-semibold border ${MODO_COLOR[e.modo] ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                            {MODO_LABEL[e.modo] ?? e.modo}
                          </span>
                        )}
                        <span className="text-slate-300 text-xs font-medium truncate">{e.marca ?? e.query ?? '—'}</span>
                      </div>
                      {e.query && e.marca && (
                        <p className="text-slate-400 text-xs sm:text-[10px] truncate">{e.query}</p>
                      )}
                      <p className="text-slate-400 text-xs sm:text-[10px] font-mono mt-1">{formatDateShort(e.created_at)}</p>
                    </div>
                    {scoreVal != null && (
                      <div className="text-right shrink-0">
                        <p className={`text-2xl font-bold font-mono ${scoreColor}`}>{scoreVal}</p>
                        <p className="text-slate-400 text-xs sm:text-[10px]">score</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Metrics tab ───────────────────────────────────────────────────────────────

function MetricsTab() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/api/admin/metrics`)
      .then(r => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json() })
      .then(setMetrics)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-20 text-center text-slate-400 text-sm font-mono">Cargando métricas...</div>
  if (error) return <div className="py-20 text-center text-rose-400 text-sm">{error}</div>
  if (!metrics) return null

  const modoChartData = Object.entries(metrics.por_modo).map(([modo, count], i) => ({
    name: MODO_LABEL[modo] ?? modo,
    value: count,
    fill: PIE_COLORS[i % PIE_COLORS.length],
  }))

  const cacheData = [
    { name: 'Activo', value: metrics.cache_activo, fill: '#34d399' },
    { name: 'Expirado', value: metrics.cache_total - metrics.cache_activo, fill: '#475569' },
  ]

  return (
    <div className="space-y-8">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total leads', value: metrics.total_leads, color: 'text-white' },
          { label: 'Emails únicos', value: metrics.emails_unicos, color: 'text-indigo-400' },
          { label: 'Con resultado', value: metrics.con_resultado, color: 'text-emerald-400' },
          { label: 'Freemium bloqueados', value: metrics.freemium_bloqueados, color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-sm p-4">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Leads per day */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-5">
        <p className="text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4">Leads por día — últimos 30 días</p>
        {metrics.por_dia.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">Sin datos en este período</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={metrics.por_dia} barCategoryGap="30%">
              <XAxis
                dataKey="fecha"
                tick={{ fontSize: 10, fill: '#475569', fontFamily: 'monospace' }}
                tickFormatter={v => v.slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#475569', fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={24}
              />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 4, fontSize: 11 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#818cf8' }}
                cursor={{ fill: '#1e293b' }}
              />
              <Bar dataKey="count" name="Leads" fill="#818cf8" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Por modo */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-5">
          <p className="text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4">Distribución por tipo</p>
          {modoChartData.every(d => d.value === 0) ? (
            <p className="text-slate-400 text-sm text-center py-8">Sin datos</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={modoChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {modoChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 4, fontSize: 11 }}
                  itemStyle={{ color: '#94a3b8' }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Cache stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-5">
          <p className="text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4">Estado del caché</p>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total en BD</span>
              <span className="text-slate-200 font-mono">{metrics.cache_total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Activo (no expirado)</span>
              <span className="text-emerald-400 font-mono">{metrics.cache_activo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Expirado</span>
              <span className="text-slate-400 font-mono">{metrics.cache_total - metrics.cache_activo}</span>
            </div>
          </div>
          {metrics.cache_total > 0 && (
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie
                  data={cacheData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={44}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {cacheData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 4, fontSize: 11 }}
                  itemStyle={{ color: '#94a3b8' }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────

type Tab = 'leads' | 'metricas'

export default function AdminPanel() {
  const [unlocked, setUnlocked] = useState(false)
  const [tab, setTab] = useState<Tab>('leads')
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterModo, setFilterModo] = useState<string>('all')
  const [detalleLoading, setDetalleLoading] = useState<string | null>(null)
  const [historialEmail, setHistorialEmail] = useState<string | null>(null)

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

  const openDetalle = useCallback(async (lead: Lead) => {
    if (!lead.tiene_resultado) return
    setDetalleLoading(lead.id)
    try {
      const r1 = await fetch(`${API}/api/leads/${lead.id}`)
      if (!r1.ok) throw new Error(`Error ${r1.status}`)
      const data: LeadDetalle = await r1.json()

      const r2 = await fetch(`${API}/api/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modo: data.modo, marca: data.marca, query: data.query, resultado: data.resultado }),
      })
      if (!r2.ok) throw new Error('No se pudo crear el link')
      const { code } = await r2.json()
      window.open(`/r/?c=${code}`, '_blank')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error abriendo informe')
    } finally {
      setDetalleLoading(null)
    }
  }, [])

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
      {historialEmail && <HistorialModal email={historialEmail} onClose={() => setHistorialEmail(null)} />}

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs sm:text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-1">Panel de control</p>
            <h1 className="text-2xl font-bold text-white">Ai Visibility</h1>
          </div>
          <button
            onClick={() => {
              setLoading(true); setError('')
              fetch(`${API}/api/leads`).then(r => r.json()).then(setLeads).catch(e => setError(e.message)).finally(() => setLoading(false))
            }}
            className="text-xs text-slate-400 hover:text-slate-300 border border-slate-800 hover:border-slate-600 px-3 py-1.5 rounded-sm transition font-mono"
          >
            ↺ Actualizar
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-800">
          {([['leads', 'Leads'], ['metricas', 'Métricas']] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-xs font-semibold transition border-b-2 -mb-px ${
                tab === key
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'metricas' && <MetricsTab />}

        {tab === 'leads' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900 border border-slate-800 rounded-sm p-4">
                <p className="text-xs text-slate-400 mb-1">Total leads</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-sm p-4">
                <p className="text-xs text-slate-400 mb-1">Con resultado guardado</p>
                <p className="text-3xl font-bold text-emerald-400">{stats.conResultado}</p>
              </div>
              {stats.porModo.slice(0, 2).map(({ modo, count }) => (
                <div key={modo} className="bg-slate-900 border border-slate-800 rounded-sm p-4">
                  <p className="text-xs text-slate-400 mb-1">{MODO_LABEL[modo] ?? modo}</p>
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
                        : 'text-slate-400 border-slate-800 hover:text-slate-300'
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
                <div className="py-20 text-center text-slate-400 text-sm font-mono">Cargando...</div>
              ) : error ? (
                <div className="py-20 text-center text-rose-400 text-sm">{error}</div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-sm">Sin registros</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="px-4 py-3 text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest">Fecha</th>
                      <th className="px-4 py-3 text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest">Nombre</th>
                      <th className="px-4 py-3 text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest">Correo</th>
                      <th className="px-4 py-3 text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest">Tipo</th>
                      <th className="px-4 py-3 text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest">Marca / URL</th>
                      <th className="px-4 py-3 text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest">Consulta</th>
                      <th className="px-4 py-3 text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest">Informe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filtered.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-4 py-3 text-slate-200 font-medium whitespace-nowrap">
                          {lead.nombre}
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          <button
                            onClick={() => setHistorialEmail(lead.email)}
                            className="hover:text-indigo-400 transition-colors text-left"
                            title="Ver historial de este email"
                          >
                            {lead.email}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          {lead.modo ? (
                            <span className={`inline-block px-2 py-0.5 rounded-sm text-xs sm:text-[10px] font-semibold border ${MODO_COLOR[lead.modo] ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                              {MODO_LABEL[lead.modo] ?? lead.modo}
                            </span>
                          ) : <span className="text-slate-400">—</span>}
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
                              className="inline-flex items-center gap-1.5 text-xs sm:text-[10px] font-mono text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition-colors"
                            >
                              {detalleLoading === lead.id ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                              )}
                              {detalleLoading === lead.id ? 'cargando...' : 'ver informe'}
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs sm:text-[10px] text-slate-400 font-mono">
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
              <p className="text-xs text-slate-400 font-mono mt-3 text-right">
                {filtered.length} de {leads.length} registros
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
