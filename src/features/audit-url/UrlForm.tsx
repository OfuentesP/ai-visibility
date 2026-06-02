'use client'

import { Globe, FlaskConical } from 'lucide-react'
import { DEMO_URL_DATA } from '@/lib/demo-data'
import type { UrlAuditResult } from '@/features/audit-shared/types'

interface Props {
  urlInput: string
  urlLoading: boolean
  loadingPhase: string
  onUrlChange: (v: string) => void
  onSubmit: () => void
  onLoadDemo: (data: UrlAuditResult) => void
}

export function UrlForm({ urlInput, urlLoading, loadingPhase, onUrlChange, onSubmit, onLoadDemo }: Props) {
  return (
    <>
      <div className="mb-4">
        <label htmlFor="input-url" className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">URL del sitio web</label>
        <input
          id="input-url"
          type="url"
          placeholder="https://www.tuempresa.cl/"
          value={urlInput}
          onChange={e => onUrlChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-sm text-slate-900 placeholder-slate-600 focus:outline-none focus:border-slate-600 text-sm transition"
        />
        <p className="text-slate-500 text-xs mt-1.5">
          Analizamos tu página, generamos 3 perfiles de clientes reales y auditamos si la iA te menciona cuando ellos buscan.
        </p>
      </div>
      <button
        id="btn-auditar-url"
        onClick={onSubmit}
        disabled={urlLoading}
        className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-50 font-medium rounded-sm transition flex items-center justify-center gap-2 text-sm"
      >
        <Globe className="w-4 h-4" />
        {urlLoading ? loadingPhase : 'Analizar URL'}
      </button>
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => onLoadDemo(DEMO_URL_DATA as unknown as UrlAuditResult)}
          className="w-full px-6 py-2 bg-transparent border border-slate-300 hover:border-indigo-600 hover:text-indigo-600 text-slate-500 font-medium rounded-sm transition flex items-center justify-center gap-2 text-xs"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Modo demo — amaliajeans.cl
        </button>
      )}
    </>
  )
}
