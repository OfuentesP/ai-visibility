'use client'

import { Download, Share2, FlaskConical } from 'lucide-react'

interface Props {
  onExportPng: () => void
  onDownloadJson?: () => void
  onShare: () => void
  shareLoading: boolean
  shareCopied: boolean
  onSchedule?: () => void
}

export function ExportBar({ onExportPng, onDownloadJson, onShare, shareLoading, shareCopied, onSchedule }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onExportPng}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 border border-slate-700/60 px-3 py-1.5 rounded-sm transition-colors"
      >
        <Download className="w-3.5 h-3.5" /> PNG
      </button>
      {onDownloadJson && (
        <button
          onClick={onDownloadJson}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 border border-slate-700/60 px-3 py-1.5 rounded-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> JSON
        </button>
      )}
      <button
        onClick={onShare}
        disabled={shareLoading}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 border border-slate-700/60 px-3 py-1.5 rounded-sm transition-colors disabled:opacity-50"
      >
        <Share2 className="w-3.5 h-3.5" />
        {shareCopied ? '¡Link copiado!' : shareLoading ? 'Generando...' : 'Compartir'}
      </button>
      {onSchedule && (
        <button
          onClick={onSchedule}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 border border-slate-700/60 px-3 py-1.5 rounded-sm transition-colors"
        >
          <FlaskConical className="w-3.5 h-3.5" /> Agendar revisión
        </button>
      )}
    </div>
  )
}
