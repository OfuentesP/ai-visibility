import { useState } from 'react'
import { auditCitability, saveLead } from '@/features/audit-shared/api'
import type { CitaResult } from '@/features/audit-shared/types'

interface Config {
  userName: string
  userEmail: string
  setError: (msg: string) => void
}

export function useCitaAudit({ userName, userEmail, setError }: Config) {
  const [citaMarca, setCitaMarca] = useState('')
  const [citaCategoria, setCitaCategoria] = useState('')
  const [citaLoading, setCitaLoading] = useState(false)
  const [citaResult, setCitaResult] = useState<CitaResult | null>(null)

  const handleCitability = async () => {
    if (!userName.trim() || !userEmail.trim()) { setError('Ingresa tu nombre y correo para continuar'); return }
    if (!citaMarca.trim() || !citaCategoria.trim()) { setError('Completa marca y categoría'); return }
    setError('')
    setCitaLoading(true)
    setCitaResult(null)

    try {
      const data = await auditCitability({ marca: citaMarca.trim(), categoria: citaCategoria.trim() })
      setCitaResult(data)
      saveLead({ nombre: userName.trim(), email: userEmail.trim(), marca: citaMarca.trim(), query: citaCategoria.trim(), modo: 'cita', resultado: data })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setCitaLoading(false)
    }
  }

  return {
    citaMarca, setCitaMarca,
    citaCategoria, setCitaCategoria,
    citaLoading,
    citaResult,
    handleCitability,
  }
}
