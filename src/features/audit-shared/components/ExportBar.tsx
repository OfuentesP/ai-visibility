'use client'

import { useState } from 'react'
import { Mail, Loader2, CheckCircle } from 'lucide-react'

interface Props {
  userEmail: string
  userName: string
  marca: string
  query?: string
  score: number
  modo: 'brand' | 'url'
  getShareUrl: () => Promise<string>
}

export function ExportBar({ userEmail, userName, marca, query, score, modo, getShareUrl }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSend = async () => {
    if (!userEmail) { setErrorMsg('Ingresa tu correo arriba para recibir el informe'); setState('error'); return }
    setState('loading')
    try {
      const shareUrl = await getShareUrl()
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, nombre: userName, marca, query, score, shareUrl, modo }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Error al enviar')
      setState('sent')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Error al enviar')
      setState('error')
    }
  }

  return (
    <div className="border-t border-slate-800 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-200">¿Quieres guardar este informe?</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {state === 'error'
            ? <span className="text-rose-400">{errorMsg}</span>
            : state === 'sent'
            ? <span className="text-emerald-400">Informe enviado a {userEmail}</span>
            : `Te lo enviamos directo a ${userEmail || 'tu correo'} para revisarlo cuando quieras.`}
        </p>
      </div>
      <button
        onClick={handleSend}
        disabled={state === 'loading' || state === 'sent'}
        className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
      >
        {state === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
        {state === 'sent' && <CheckCircle className="w-4 h-4" />}
        {state === 'idle' || state === 'error' ? <Mail className="w-4 h-4" /> : null}
        {state === 'loading' ? 'Enviando...' : state === 'sent' ? 'Enviado' : 'Enviar informe a mi correo'}
      </button>
    </div>
  )
}
