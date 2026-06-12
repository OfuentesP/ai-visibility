'use client'

import { BarChart, Bar, XAxis, YAxis, ReferenceLine, Cell, ResponsiveContainer, Tooltip, LabelList } from 'recharts'
import type { ChartEntry } from '../types'

interface Props {
  chartData: ChartEntry[]
  userBrandName: string
  winnerReasons: string[]
  winnerSources: string[]
  /** Unique suffix for SVG gradient IDs to avoid collisions when both charts render simultaneously */
  gradientSuffix: string
  ghostLabel?: string
}

export function ShareOfVoiceChart({
  chartData,
  userBrandName,
  winnerReasons,
  winnerSources,
  gradientSuffix,
  ghostLabel,
}: Props) {
  const chartHeight = Math.max(chartData.length * 52, 180)
  const competitorWidths = chartData.filter(e => !e.isUser).map(e => e.score)
  const promedio = competitorWidths.length > 0
    ? Math.round(competitorWidths.reduce((a, b) => a + b, 0) / competitorWidths.length)
    : 0

  const userGradId = `userGradient-${gradientSuffix}`
  const dominantGradId = `dominantGradient-${gradientSuffix}`

  return (
    <>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart layout="vertical" data={chartData} margin={{ top: 2, right: 56, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={userGradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id={dominantGradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="marca"
            width={140}
            tick={(props) => {
              const { x, y, payload, index } = props as { x: number; y: number; payload: { value: string }; index: number }
              const entry = chartData[index]
              const isGhost = entry?.ghost
              const rank = index + 1
              return (
                <g>
                  {!isGhost && (
                    <text x={x - 118} y={y} dy={4} textAnchor="end" fill={rank === 1 ? '#fbbf24' : '#475569'} fontWeight={700} fontSize={9} fontFamily="ui-monospace, monospace">
                      #{rank}
                    </text>
                  )}
                  <text
                    x={x - 4} y={y} dy={4} textAnchor="end"
                    fill={isGhost ? '#334155' : entry?.isUser ? '#38bdf8' : entry?.isWinner ? '#fbbf24' : '#94a3b8'}
                    fontWeight={entry?.isUser && !isGhost ? 700 : 400}
                    fontSize={11}
                    fontStyle={isGhost ? 'italic' : 'normal'}
                  >
                    {entry?.isUser && !isGhost ? `→ ${payload?.value}` : payload?.value}
                  </text>
                </g>
              )
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            content={(props) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { active, payload } = props as any
              if (!active || !payload?.length) return null
              const item = payload[0].payload
              if (item.ghost) return null
              const isWinnerHover = item.isWinner
              return (
                <div style={{ background: 'rgba(10,16,36,0.98)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: 8, padding: '12px 16px', fontSize: 14, color: '#f1f5f9', maxWidth: 280, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.6)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.marca}</div>
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>Presencia: <strong style={{ color: '#7dd3fc' }}>{item.score}%</strong></div>
                  {isWinnerHover && winnerReasons.length > 0 && (
                    <div style={{ marginTop: 10, borderTop: '1px solid rgba(100,116,139,0.2)', paddingTop: 8 }}>
                      <div style={{ color: '#fbbf24', fontSize: 12, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>¿Por qué nos ganan?</div>
                      {winnerReasons.map((r, ri) => (
                        <div key={ri} style={{ color: '#fca5a5', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                          <span style={{ color: '#f97316', marginTop: 2 }}>•</span>{r}
                        </div>
                      ))}
                      {winnerSources.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ color: '#a78bfa', fontSize: 12, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fuentes Ai</div>
                          {winnerSources.map((s, si) => (
                            <div key={si} style={{ color: '#c4b5fd', fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
                              <span style={{ color: '#a78bfa' }}>→</span>{s}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            }}
          />

          <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={16} background={{ fill: '#0f172a', radius: 4 }}>
            {chartData.map((entry, idx) => {
              const isDominant = entry.isWinner && entry.score >= 90
              return (
                <Cell
                  key={idx}
                  fill={
                    entry.ghost
                      ? 'rgba(56,189,248,0.08)'
                      : entry.isUser
                      ? `url(#${userGradId})`
                      : isDominant
                      ? `url(#${dominantGradId})`
                      : entry.isWinner
                      ? '#b45309'
                      : `rgba(51, 65, 85, ${Math.max(0.65 - idx * 0.07, 0.15)})`
                  }
                />
              )
            })}
            <LabelList
              dataKey="score"
              position="right"
              content={(props) => {
                const { x, y, width, height, value, index } = props as { x: number; y: number; width: number; height: number; value: number; index: number }
                const entry = chartData[index]
                const isDominant = entry?.isWinner && entry.score >= 90
                if (entry?.ghost) {
                  return (
                    <text x={(x ?? 0) + 8} y={(y ?? 0) + (height ?? 0) / 2} dy={4} fill="#334155" fontSize={11} fontFamily="ui-sans-serif, system-ui" fontStyle="italic">
                      {ghostLabel ?? `${userBrandName} — no aparece`}
                    </text>
                  )
                }
                return (
                  <text
                    x={(x ?? 0) + (width ?? 0) + 8}
                    y={(y ?? 0) + (height ?? 0) / 2}
                    dy={4}
                    fill={entry?.isUser ? '#38bdf8' : isDominant ? '#fb923c' : '#64748b'}
                    fontWeight={entry?.isUser || isDominant ? 700 : 400}
                    fontSize={11}
                    fontFamily="ui-monospace, monospace"
                  >
                    {value}%
                  </text>
                )
              }}
            />
          </Bar>

          <ReferenceLine
            x={promedio}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            strokeOpacity={0.5}
            label={{ value: `Promedio: ${promedio}%`, position: 'insideTopRight', fill: '#b45309', fontSize: 10, fontFamily: 'ui-monospace, monospace' }}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-5 mt-4 px-1">
        <span className="flex items-center gap-1.5 text-xs text-sky-600">
          <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-sky-500 to-indigo-500 shrink-0" />
          Tu marca
        </span>
        <span className="flex items-center gap-1.5 text-xs text-orange-400">
          <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-orange-600 to-orange-400 shrink-0" />
          Líder actual
        </span>
        <span className="flex items-center gap-1.5 text-xs text-amber-500/70">
          <span className="w-4 border-t border-dashed border-amber-500/60 shrink-0" />
          Promedio del mercado
        </span>
      </div>
    </>
  )
}

// ─── Helpers to build normalized ChartEntry[] from each flow's data ──────────

/** For the URL flow: compute brand frequencies from resultados[] */
export function buildChartDataFromUrl(
  resultados: Array<{ marcas_mencionadas: string[] }>,
  marcaUsuario: string
): ChartEntry[] {
  const brandFreq: Record<string, number> = {}
  resultados.forEach(r => {
    r.marcas_mencionadas.forEach((m, i) => {
      const weight = Math.max(10 - i * 2, 1)
      brandFreq[m] = (brandFreq[m] || 0) + weight
    })
  })
  const allBrands = Object.entries(brandFreq).sort((a, b) => b[1] - a[1])
  const maxScore = allBrands[0]?.[1] || 1
  const chartDataRaw: ChartEntry[] = allBrands.map(([marca, raw]) => ({
    marca,
    score: Math.round((raw / maxScore) * 100),
    isUser: marca.toLowerCase() === marcaUsuario.toLowerCase(),
    isWinner: marca.toLowerCase() === allBrands[0][0].toLowerCase(),
    ghost: false,
  }))
  const miMarcaEnLista = chartDataRaw.some(e => e.isUser)
  return miMarcaEnLista
    ? chartDataRaw
    : [...chartDataRaw, { marca: 'Tu marca', score: 1, isUser: true, isWinner: false, ghost: true }]
}

/** For the brand flow: build from marcas_mencionadas[] with position-based scoring */
export function buildChartDataFromBrand(
  marcas: string[],
  marcaGanadora: string | null,
  marcaUsuario: string
): ChartEntry[] {
  const total = marcas.length
  const esMiMarca = (m: string) => {
    const a = m.toLowerCase().trim()
    const b = marcaUsuario.toLowerCase().trim()
    return a === b || a.includes(b) || b.includes(a)
  }
  const chartDataRaw: ChartEntry[] = marcas
    .map((marca, i) => ({
      marca,
      score: total === 1 ? 100 : Math.max(Math.round(100 - i * (70 / (total - 1))), 14),
      isUser: esMiMarca(marca),
      isWinner: marca.toLowerCase().trim() === (marcaGanadora ?? '').toLowerCase().trim(),
      ghost: false,
    }))
    .sort((a, b) => b.score - a.score)
  const miMarcaEnLista = chartDataRaw.some(e => e.isUser)
  return miMarcaEnLista
    ? chartDataRaw
    : [...chartDataRaw, { marca: marcaUsuario, score: 1, isUser: true, isWinner: false, ghost: true }]
}
