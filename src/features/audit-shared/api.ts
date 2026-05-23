import type {
  ResultadoBusqueda,
  UrlAuditResult,
  CompareResult,
  CitaResult,
  DiscoveryResponse,
} from './types'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

// ─── Core audit endpoints ─────────────────────────────────────────────────────

export async function auditByBrand(params: {
  brand: string
  query: string
  email?: string
}): Promise<ResultadoBusqueda> {
  const res = await fetch(`${API}/api/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: params.query, brand: params.brand, email: params.email }),
  })
  if (res.status === 429) throw new FreemiumError()
  if (!res.ok) { const t = await res.text(); throw new Error(`Error ${res.status}: ${t}`) }
  return res.json()
}

export async function auditByUrl(params: {
  url: string
  pais?: string
  email?: string
}): Promise<UrlAuditResult> {
  const res = await fetch(`${API}/api/audit/from-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: params.url, pais: params.pais ?? 'Chile', email: params.email }),
  })
  if (res.status === 429) throw new FreemiumError()
  if (!res.ok) {
    try {
      const body = await res.json()
      throw new Error(body.detail ?? `Error ${res.status}`)
    } catch (e) {
      if (e instanceof Error && e.message !== `Error ${res.status}`) throw e
      throw new Error(`Error ${res.status}`)
    }
  }
  return res.json()
}

export async function auditCompare(params: {
  marca_a: string
  marca_b: string
  categoria: string
  mercado?: string
}): Promise<CompareResult> {
  const res = await fetch(`${API}/api/audit/comparison`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...params, mercado: params.mercado ?? 'Chile' }),
  })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

export async function auditCitability(params: {
  marca: string
  categoria: string
  mercado?: string
  num_territorios?: number
}): Promise<CitaResult> {
  const res = await fetch(`${API}/api/audit/citability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      marca: params.marca,
      categoria: params.categoria,
      mercado: params.mercado ?? 'Chile',
      num_territorios: params.num_territorios ?? 12,
    }),
  })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

// ─── Background / secondary endpoints ────────────────────────────────────────

export async function fetchDiscovery(brand: string, topico: string): Promise<DiscoveryResponse> {
  const res = await fetch(`${API}/api/discovery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand, topico }),
  })
  if (!res.ok) throw new Error(`Discovery ${res.status}`)
  const d: DiscoveryResponse = await res.json()
  if (!d.oportunidades_auditadas) throw new Error('Invalid discovery response')
  return d
}

export async function fetchTrends(queries: string[]): Promise<Array<{ query: string; value: number; fuente: string }>> {
  const res = await fetch(`${API}/api/trends/related`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queries, geo: 'CL', max_per_query: 5 }),
  })
  if (!res.ok) throw new Error(`Trends ${res.status}`)
  const t = await res.json()
  return t.resultados ?? []
}

export async function shareReport(params: {
  modo: string
  marca?: string
  query?: string
  resultado: unknown
}): Promise<string> {
  const res = await fetch(`${API}/api/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  const data = await res.json()
  return data.code as string
}

export function saveLead(params: {
  nombre: string
  email: string
  marca?: string
  query?: string
  modo?: string
  resultado?: unknown
}): void {
  fetch(`${API}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }).catch(() => {})
}

export async function fetchQuota(email: string): Promise<{ used: number; limit: number } | null> {
  const e = email.trim()
  if (!e || !e.includes('@')) return null
  try {
    const r = await fetch(`${API}/api/user/quota?email=${encodeURIComponent(e)}`)
    if (r.ok) return r.json()
  } catch { /* silent */ }
  return null
}

// ─── Sentinel error for quota exceeded ───────────────────────────────────────

export class FreemiumError extends Error {
  constructor() { super('quota_exceeded') }
}
