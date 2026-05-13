'use client'

import { useEffect, useState, useRef } from 'react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? ''

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
          <button
            onClick={check}
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-50 text-sm font-medium rounded-sm transition"
          >
            Entrar
          </button>
          {error && <p className="text-rose-400 text-xs text-center mt-3 font-mono">Contraseña incorrecta</p>}
        </div>
      </div>
    </div>
  )
}

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

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

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

export default function AdminPanel() {
  const [unlocked, setUnlocked] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterModo, setFilterModo] = useState<string>('all')

  useEffect(() => {
    if (sessionStorage.getItem('admin_ok') === '1') setUnlocked(true)
    else setLoading(false)
  }, [])

  useEffect(() => {
    if (!unlocked) return
    setLoading(true)
    fetch(`${API}/api/leads`)
      .then((r) => {
        if (!r.ok) throw new Error(`Error ${r.status}`)
        return r.json()
      })
      .then((data) => setLeads(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [unlocked])

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
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-1">Panel de control</p>
            <h1 className="text-2xl font-bold text-white">Leads &amp; Consultas</h1>
          </div>
          <button
            onClick={() => { setLoading(true); setError(''); fetch(`${API}/api/leads`).then(r => r.json()).then(setLeads).catch(e => setError(e.message)).finally(() => setLoading(false)) }}
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
                  <th className="px-4 py-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Resultado</th>
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
                        <span className="font-mono text-xs text-sky-400 truncate block" title={lead.marca ?? ''}>
                          {lead.marca ?? '—'}
                        </span>
                      ) : (
                        <span className="truncate block" title={lead.marca ?? ''}>
                          {lead.marca ?? '—'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-[200px]">
                      <span className="truncate block text-xs" title={lead.query ?? ''}>
                        {lead.query ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {lead.tiene_resultado ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          guardado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
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

        {/* Footer count */}
        {!loading && !error && (
          <p className="text-xs text-slate-700 font-mono mt-3 text-right">
            {filtered.length} de {leads.length} registros
          </p>
        )}
      </div>
    </div>
  )
}
