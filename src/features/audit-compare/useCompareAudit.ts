import { useState } from 'react'
import { auditCompare, saveLead } from '@/features/audit-shared/api'
import type { CompareResult } from '@/features/audit-shared/types'

interface Config {
  userName: string
  userEmail: string
  setError: (msg: string) => void
}

export function useCompareAudit({ userName, userEmail, setError }: Config) {
  const [compareA, setCompareA] = useState('')
  const [compareB, setCompareB] = useState('')
  const [compareCategoria, setCompareCategoria] = useState('')
  const [compareLoading, setCompareLoading] = useState(false)
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null)

  const handleCompare = async () => {
    if (!userName.trim() || !userEmail.trim()) { setError('Ingresa tu nombre y correo para continuar'); return }
    if (!compareA.trim() || !compareB.trim() || !compareCategoria.trim()) { setError('Completa los tres campos'); return }
    setError('')
    setCompareLoading(true)
    setCompareResult(null)

    try {
      const data = await auditCompare({ marca_a: compareA.trim(), marca_b: compareB.trim(), categoria: compareCategoria.trim() })
      setCompareResult(data)
      saveLead({ nombre: userName.trim(), email: userEmail.trim(), marca: compareA.trim(), query: compareCategoria.trim(), modo: 'compare', resultado: data })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setCompareLoading(false)
    }
  }

  return {
    compareA, setCompareA,
    compareB, setCompareB,
    compareCategoria, setCompareCategoria,
    compareLoading,
    compareResult,
    handleCompare,
  }
}
