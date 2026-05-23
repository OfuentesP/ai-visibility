'use client'

interface Props {
  citaMarca: string
  citaCategoria: string
  citaLoading: boolean
  onChangeMarca: (v: string) => void
  onChangeCategoria: (v: string) => void
  onSubmit: () => void
}

export function CitaForm({ citaMarca, citaCategoria, citaLoading, onChangeMarca, onChangeCategoria, onSubmit }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Tu marca</label>
          <input
            type="text"
            placeholder="Amalia Jeans"
            value={citaMarca}
            onChange={e => onChangeMarca(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit()}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Categoría de producto</label>
          <input
            type="text"
            placeholder="jeans de mujer Chile"
            value={citaCategoria}
            onChange={e => onChangeCategoria(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit()}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
          />
        </div>
      </div>
      <p className="text-slate-600 text-xs mb-4">
        Generamos 12 queries de nicho, auditamos qué marcas menciona la IA y priorizamos donde puedes entrar más fácilmente.
      </p>
      <button
        onClick={onSubmit}
        disabled={citaLoading}
        className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-50 font-medium rounded-sm transition flex items-center justify-center gap-2 text-sm"
      >
        <span className="text-sm">✦</span>
        {citaLoading ? 'Analizando territorios…' : 'Encontrar oportunidades'}
      </button>
    </>
  )
}
