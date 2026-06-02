'use client'

interface Props {
  fromCache: boolean | undefined
  cachedAt: string | null | undefined
}

export function CacheBadge({ fromCache, cachedAt }: Props) {
  if (!fromCache || !cachedAt) return null
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-300 rounded-sm text-xs text-amber-400/80 font-mono">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
      Resultado desde caché · generado el {new Date(cachedAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
      <span className="text-amber-600 ml-auto">válido 14 días</span>
    </div>
  )
}
