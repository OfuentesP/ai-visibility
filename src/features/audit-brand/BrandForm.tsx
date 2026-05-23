'use client'

import { Search } from 'lucide-react'

interface Props {
  brand: string
  query: string
  loading: boolean
  loadingPhase: string
  onBrandChange: (v: string) => void
  onQueryChange: (v: string) => void
  onSubmit: () => void
}

export function BrandForm({ brand, query, loading, loadingPhase, onBrandChange, onQueryChange, onSubmit }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Marca</label>
          <input
            id="input-brand"
            type="text"
            placeholder="Banco Santander"
            value={brand}
            maxLength={120}
            onChange={e => onBrandChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit()}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Búsqueda</label>
          <input
            id="input-query"
            type="text"
            placeholder="mejor banco en chile"
            value={query}
            maxLength={200}
            onChange={e => onQueryChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit()}
            className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
          />
        </div>
      </div>
      <button
        id="btn-auditar"
        onClick={onSubmit}
        disabled={loading}
        className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-50 font-medium rounded-sm transition flex items-center justify-center gap-2 text-sm"
      >
        <Search className="w-4 h-4" />
        {loading ? loadingPhase : 'Auditar'}
      </button>
    </>
  )
}
