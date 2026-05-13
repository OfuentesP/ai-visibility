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
  return (
    <div className="space-y-6">
      {d.prioridad_ejecutiva && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Veredicto ejecutivo</p>
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Clasificación</span><span className="text-slate-200 font-medium">{d.prioridad_ejecutiva.clasificacion}</span></div>
            <div className="flex justify-between gap-4"><span className="text-slate-500 shrink-0">Foco</span><span className="text-slate-200 text-right">{d.prioridad_ejecutiva.foco_principal}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Impacto</span><span className="text-slate-200">{d.prioridad_ejecutiva.impacto_esperado}</span></div>
          </div>
        </section>
      )}
      <section className="grid grid-cols-2 gap-4">
        <Score value={d.invisibilidad_score ?? 0} label="AI Readiness Score" />
        <Score value={d.posicion_mi_marca ?? 0} max={10} label={`Posición de ${marca ?? 'tu marca'}`} />
      </section>
      {d.marcas_mencionadas?.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Marcas en el radar de la IA</p>
          <div className="flex flex-wrap gap-1.5">{d.marcas_mencionadas.map((m: string) => <Pill key={m} text={m} />)}</div>
        </section>
      )}
      {d.conceptos_faltantes?.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Brecha semántica</p>
          <div className="flex flex-wrap gap-1.5">{d.conceptos_faltantes.map((c: string) => <span key={c} className="inline-block px-2 py-0.5 bg-rose-900/30 text-rose-300 text-[10px] rounded-sm">{c}</span>)}</div>
        </section>
      )}
      {d.plan_accion?.vehiculos?.[0]?.acciones?.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Top acciones recomendadas</p>
          <div className="space-y-2">
            {d.plan_accion.vehiculos.flatMap((v: { acciones: unknown[] }) => v.acciones).slice(0, 3).map((a: { tactica_tecnica: string; ice_score: number; tiempo_indexacion_ia: string }, i: number) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-sm p-3">
                <p className="text-slate-200 text-xs font-medium">{a.tactica_tecnica}</p>
                <p className="text-slate-600 text-[10px] font-mono mt-1">ICE {a.ice_score} · {a.tiempo_indexacion_ia}</p>
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
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-4">
        <Score value={Math.round(r.visibilidad_pct ?? 0)} label="Visibilidad IA (%)" />
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-4">
          <p className="text-xs text-slate-500 mb-1">Consultas con mención</p>
          <p className="text-3xl font-bold text-slate-200">{r.queries_con_mencion ?? 0}<span className="text-slate-600 text-lg"> / {r.total_queries ?? 0}</span></p>
        </div>
      </section>
      {r.diferenciadores?.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Diferenciadores detectados</p>
          <div className="flex flex-wrap gap-1.5">{r.diferenciadores.map((d: string) => <span key={d} className="inline-block px-2 py-0.5 bg-indigo-900/30 text-indigo-300 text-[10px] rounded-sm">{d}</span>)}</div>
        </section>
      )}
      {r.resultados?.length > 0 && (
        <section>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Resultados por perfil</p>
          <div className="space-y-2">
            {r.resultados.slice(0, 5).map((res: { arquetipo: string; query: string; mencionada: boolean }, i: number) => (
              <div key={i} className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-sm p-3 gap-3">
                <div className="min-w-0">
                  <p className="text-slate-300 text-xs font-medium truncate">{res.arquetipo}</p>
                  <p className="text-slate-600 text-[10px] truncate">{res.query}</p>
                </div>
                <span className={`text-[10px] font-mono shrink-0 ${res.mencionada ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {res.mencionada ? 'Mencionada' : 'No mencionada'}
                </span>
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
            {(data.modo === 'compare' || data.modo === 'cita') && (
              <pre className="text-slate-400 text-xs font-mono bg-slate-900 border border-slate-800 rounded-sm p-4 overflow-auto">
                {JSON.stringify(data.resultado, null, 2)}
              </pre>
            )}
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
