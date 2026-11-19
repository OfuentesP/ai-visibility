'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, AlertTriangle, HelpCircle, Pencil, ExternalLink } from 'lucide-react'

type Cambio = { donde: string; tipo: 'modificado' | 'agregado' | 'eliminado'; antes: string; despues: string }

type Estado = {
  estado: 'publicando' | 'publicado' | 'error' | 'desconocido' | 'no_configurado'
  cambios?: { tipo: 'contenido' | 'tecnico'; lista: Cambio[]; mas?: number } | null
  paso?: number
  pasos_total?: number
  iniciado?: string
  actualizado?: string
}

const API = `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/deploy-status`
const INTERVALO_MS = 15_000

const hora = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Santiago' })
    : '—'

const fecha = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  const hoy = new Date()
  const mismoDia = d.toLocaleDateString('es-CL', { timeZone: 'America/Santiago' }) ===
    hoy.toLocaleDateString('es-CL', { timeZone: 'America/Santiago' })
  return mismoDia ? 'hoy' : d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', timeZone: 'America/Santiago' })
}

function Cambios({ cambios, titulo }: { cambios: Estado['cambios']; titulo: string }) {
  if (!cambios) return null
  if (cambios.tipo === 'tecnico' || cambios.lista.length === 0) {
    return (
      <p className="text-slate-500 text-sm mt-4 pt-4 border-t border-slate-100">
        Es un ajuste técnico del sitio: no cambia textos de la página.
      </p>
    )
  }
  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <p className="text-xs sm:text-[11px] text-slate-500 uppercase tracking-widest mb-3">{titulo}</p>
      <ul className="space-y-3">
        {cambios.lista.map((c, i) => (
          <li key={i} className="text-sm">
            <p className="text-slate-500 text-xs mb-1">{c.donde}</p>
            {c.tipo === 'modificado' && (c.antes.length + c.despues.length > 50) && (
              <div className="space-y-1.5 leading-relaxed">
                <p className="bg-rose-50 text-rose-800 px-2 py-1 rounded-sm"><span className="font-semibold">Antes: </span><span className="line-through decoration-rose-400">{c.antes || '(vacío)'}</span></p>
                <p className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-sm"><span className="font-semibold">Ahora: </span>{c.despues || '(vacío)'}</p>
              </div>
            )}
            {c.tipo === 'modificado' && (c.antes.length + c.despues.length <= 50) && (
              <p className="leading-relaxed">
                <span className="bg-rose-50 text-rose-800 line-through decoration-rose-400 px-1.5 py-0.5 rounded-sm">{c.antes || '(vacío)'}</span>
                <span className="text-slate-400 mx-1.5" aria-hidden>→</span>
                <span className="sr-only"> cambió a </span>
                <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-sm font-medium">{c.despues || '(vacío)'}</span>
              </p>
            )}
            {c.tipo === 'agregado' && (
              <p><span className="text-emerald-700 font-semibold">Agregado: </span><span className="text-slate-800">{c.despues}</span></p>
            )}
            {c.tipo === 'eliminado' && (
              <p><span className="text-rose-700 font-semibold">Eliminado: </span><span className="text-slate-800 line-through decoration-rose-400">{c.antes}</span></p>
            )}
          </li>
        ))}
      </ul>
      {!!cambios.mas && <p className="text-slate-500 text-xs mt-3">…y {cambios.mas} cambio{cambios.mas === 1 ? '' : 's'} más.</p>}
    </div>
  )
}

export function EstadoPublicacion() {
  const [data, setData] = useState<Estado | null>(null)
  const [revisado, setRevisado] = useState<Date | null>(null)

  useEffect(() => {
    let vivo = true
    const consultar = async () => {
      try {
        const r = await fetch(API, { cache: 'no-store' })
        const j: Estado = r.ok ? await r.json() : { estado: 'desconocido' }
        if (vivo) setData(j)
      } catch {
        if (vivo) setData({ estado: 'desconocido' })
      }
      if (vivo) setRevisado(new Date())
    }
    consultar()
    const id = setInterval(consultar, INTERVALO_MS)
    return () => { vivo = false; clearInterval(id) }
  }, [])

  const total = data?.pasos_total || 7
  const paso = Math.min(data?.paso ?? 0, total)

  return (
    <div className="min-h-[70vh] bg-white px-4 py-12 sm:py-20">
      <div className="max-w-xl mx-auto">
        <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">Panel de contenidos</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Estado de la web</h1>
        <p className="text-slate-600 text-base mb-8 leading-relaxed">
          Después de guardar un cambio en el editor, vuelve aquí para ver cuándo queda publicado.
          Normalmente toma unos <strong className="text-slate-900">5 minutos</strong>.
        </p>

        {/* Tarjeta de estado */}
        <div aria-live="polite" className="rounded-md border p-6 mb-6 shadow-sm bg-white border-slate-200">
          {!data && (
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="animate-spin" size={22} /> Revisando…
            </div>
          )}

          {data?.estado === 'publicando' && (
            <div>
              <div className="flex items-start gap-3 mb-4">
                <Loader2 className="animate-spin text-amber-600 shrink-0 mt-0.5" size={26} />
                <div>
                  <p className="text-lg font-bold text-slate-900">Publicando tu cambio…</p>
                  <p className="text-slate-600 text-sm">
                    {paso === 0 ? 'Preparando la publicación' : `Paso ${paso} de ${total}`} · empezó a las {hora(data.iniciado)}
                  </p>
                </div>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={paso}>
                <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${Math.max(8, (paso / total) * 100)}%` }} />
              </div>
              <p className="text-slate-500 text-sm mt-3">Puedes dejar esta página abierta: se actualiza sola.</p>
              <Cambios cambios={data.cambios} titulo="Qué se está publicando" />
            </div>
          )}

          {data?.estado === 'publicado' && (
            <div>
              <div className="flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={26} />
              <div>
                <p className="text-lg font-bold text-slate-900">Publicado. Ya se ve en la web.</p>
                <p className="text-slate-600 text-sm">Último cambio publicado {fecha(data.actualizado)} a las {hora(data.actualizado)}.</p>
                <p className="text-slate-500 text-sm mt-3">
                  Si acabas de guardar y la hora es anterior a tu cambio, espera unos segundos: la publicación tarda un momento en empezar.
                </p>
              </div>
              </div>
              <Cambios cambios={data.cambios} titulo="Qué cambió" />
            </div>
          )}

          {data?.estado === 'error' && (
            <div>
              <div className="flex items-start gap-3">
              <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={26} />
              <div>
                <p className="text-lg font-bold text-slate-900">Hubo un problema al publicar.</p>
                <p className="text-slate-600 text-sm">
                  El intento de las {hora(data.iniciado)} no se pudo publicar. La web sigue mostrando la versión anterior, no se perdió nada.
                  Avísale a Oscar.
                </p>
              </div>
              </div>
              <Cambios cambios={data.cambios} titulo="Qué se intentó publicar" />
            </div>
          )}

          {(data?.estado === 'desconocido' || data?.estado === 'no_configurado') && (
            <div className="flex items-start gap-3">
              <HelpCircle className="text-slate-500 shrink-0 mt-0.5" size={26} />
              <div>
                <p className="text-lg font-bold text-slate-900">No pude revisar el estado ahora.</p>
                <p className="text-slate-600 text-sm">Lo vuelvo a intentar solo en unos segundos. Si sigue así, avísale a Oscar.</p>
              </div>
            </div>
          )}
        </div>

        {/* Accesos */}
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="/admin/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-sm transition-colors"
          >
            <Pencil size={18} /> Editar contenidos
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-md bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-semibold text-base transition-colors"
          >
            <ExternalLink size={18} /> Ver la página
          </a>
        </div>

        {revisado && (
          <p className="text-slate-500 text-xs mt-6 text-center">
            Revisado a las {revisado.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · se actualiza cada 15 segundos
          </p>
        )}
      </div>
    </div>
  )
}
