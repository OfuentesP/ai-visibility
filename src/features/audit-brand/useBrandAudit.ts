import { useState } from 'react'
import {
  auditByBrand,
  fetchDiscovery,
  fetchTrends,
  saveLead,
  FreemiumError,
} from '@/features/audit-shared/api'
import type { ResultadoBusqueda, DiscoveryResponse } from '@/features/audit-shared/types'

interface Config {
  userName: string
  userEmail: string
  setError: (msg: string) => void
  onFreemiumHit: () => void
}

export function useBrandAudit({ userName, userEmail, setError, onFreemiumHit }: Config) {
  const [brand, setBrand] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState('')
  const [result, setResult] = useState<ResultadoBusqueda | null>(null)
  const [discoveryResult, setDiscoveryResult] = useState<DiscoveryResponse | null>(null)
  const [discoveryLoading, setDiscoveryLoading] = useState(false)
  const [trendsResult, setTrendsResult] = useState<Array<{ query: string; value: number; fuente: string }> | null>(null)
  const [trendsLoading, setTrendsLoading] = useState(false)

  const handleAudit = async () => {
    if (!userName.trim() || !userEmail.trim()) { setError('Ingresa tu nombre y correo para continuar'); return }
    if (!brand.trim() || !query.trim()) { setError('Completa ambos campos'); return }
    setError('')
    setLoading(true)
    setLoadingPhase('Inicializando análisis...')
    setResult(null)
    setDiscoveryResult(null)
    setTrendsResult(null)

    try {
      const phases = [
        { text: 'Buscando con Google Trends...', progress: 20 },
        { text: 'Consultando con GPT-4o...', progress: 40 },
        { text: 'Analizando competidores...', progress: 60 },
        { text: 'Generando recomendaciones...', progress: 80 },
        { text: 'Finalizando análisis...', progress: 100 },
      ]
      for (const p of phases) {
        setLoadingPhase(`${p.text} ${p.progress}%`)
        await new Promise(r => setTimeout(r, 300 + Math.random() * 700))
      }

      const data = await auditByBrand({ brand: brand.trim(), query: query.trim(), email: userEmail.trim() || undefined })
      setResult(data)
      saveLead({ nombre: userName.trim(), email: userEmail.trim(), marca: brand.trim(), query: query.trim(), modo: 'brand', resultado: data })

      // Background: discovery → trends (non-blocking)
      setDiscoveryLoading(true)
      fetchDiscovery(brand.trim(), query.trim())
        .then(d => {
          setDiscoveryResult(d)
          const syntheticQueries = d.oportunidades_auditadas.map(op => op.pregunta_generada).filter(Boolean).slice(0, 6)
          if (syntheticQueries.length > 0) {
            setTrendsLoading(true)
            fetchTrends(syntheticQueries)
              .then(t => setTrendsResult(t))
              .catch(e => console.warn('Trends error:', e))
              .finally(() => setTrendsLoading(false))
          }
        })
        .catch(e => console.error('Discovery error:', e))
        .finally(() => setDiscoveryLoading(false))

    } catch (err) {
      if (err instanceof FreemiumError) { onFreemiumHit(); return }
      setError(err instanceof Error ? err.message : 'Error de conexión')
    } finally {
      setLoading(false)
      setLoadingPhase('')
    }
  }

  return {
    brand, setBrand,
    query, setQuery,
    loading, loadingPhase,
    result,
    discoveryResult, discoveryLoading,
    trendsResult, trendsLoading,
    handleAudit,
  }
}
