import { useState } from 'react'
import { auditByUrl, saveLead, FreemiumError } from '@/features/audit-shared/api'
import type { UrlAuditResult } from '@/features/audit-shared/types'

interface Config {
  userName: string
  userEmail: string
  setError: (msg: string) => void
  onFreemiumHit: () => void
}

export function useUrlAudit({ userName, userEmail, setError, onFreemiumHit }: Config) {
  const [urlInput, setUrlInput] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState('')
  const [urlResult, setUrlResult] = useState<UrlAuditResult | null>(null)

  const handleAuditFromUrl = async () => {
    if (!userName.trim() || !userEmail.trim()) { setError('Ingresa tu nombre y correo para continuar'); return }
    const url = urlInput.trim()
    if (!url) { setError('Ingresa una URL'); return }
    if (!url.startsWith('http://') && !url.startsWith('https://')) { setError('La URL debe comenzar con http:// o https://'); return }
    setError('')
    setUrlResult(null)
    setUrlLoading(true)
    setLoadingPhase('Analizando página...')

    try {
      const phases = [
        'Analizando página... 20%',
        'Generando arquetipos de clientes... 45%',
        'Consultando motores de Ai... 70%',
        'Procesando resultados... 90%',
      ]
      for (const p of phases) {
        setLoadingPhase(p)
        await new Promise(r => setTimeout(r, 400 + Math.random() * 600))
      }

      const data = await auditByUrl({ url, email: userEmail.trim() || undefined })
      setUrlResult(data)
      saveLead({ nombre: userName.trim(), email: userEmail.trim(), marca: url, modo: 'url', resultado: data })

    } catch (err) {
      if (err instanceof FreemiumError) { onFreemiumHit(); return }
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setUrlLoading(false)
      setLoadingPhase('')
    }
  }

  return {
    urlInput, setUrlInput,
    urlLoading, loadingPhase,
    urlResult, setUrlResult,
    handleAuditFromUrl,
  }
}
