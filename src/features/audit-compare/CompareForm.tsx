'use client'

import { Search } from 'lucide-react'

interface Props {
  compareA: string
  compareB: string
  compareCategoria: string
  compareLoading: boolean
  onChangeA: (v: string) => void
  onChangeB: (v: string) => void
  onChangeCategoria: (v: string) => void
  onSubmit: () => void
}

export function CompareForm({ compareA, compareB, compareCategoria, compareLoading, onChangeA, onChangeB, onChangeCategoria, onSubmit }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="compare-marca-a" className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Marca A (tuya)</label>
          <input
            id="compare-marca-a"
            type="text"
            placeholder="Falabella"
            value={compareA}
            onChange={e => onChangeA(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit()}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-sm text-slate-900 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
          />
        </div>
        <div>
          <label htmlFor="compare-marca-b" className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Marca B (rival)</label>
          <input
            id="compare-marca-b"
            type="text"
            placeholder="Ripley"
            value={compareB}
            onChange={e => onChangeB(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit()}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-sm text-slate-900 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
          />
        </div>
        <div>
          <label htmlFor="compare-categoria" className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Categoría</label>
          <input
            id="compare-categoria"
            type="text"
            placeholder="retail de moda"
            value={compareCategoria}
            onChange={e => onChangeCategoria(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit()}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-sm text-slate-900 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
          />
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={compareLoading}
        className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-50 font-medium rounded-sm transition flex items-center justify-center gap-2 text-sm"
      >
        <Search className="w-4 h-4" />
        {compareLoading ? 'Comparando con Ai…' : 'Comparar marcas'}
      </button>
    </>
  )
}
