'use client'

import { forwardRef, CSSProperties } from 'react'

type UrlResultAction = {
  tactica_tecnica: string
  concepto_objetivo: string
  impacto: number
  confianza: number
  esfuerzo: number
  ice_score: number
  segmento_impactado: string
  tiempo_indexacion_ia: string
  pasos_ejecucion: string[]
  area_responsable: string
  riesgo_inaccion?: string
}

type UrlResultado = {
  arquetipo: string
  driver: string
  query: string
  mencionada: boolean
  posicion: number
  marcas_mencionadas: string[]
  marca_ganadora: string
  sentimiento: string
  snippet: string
  competitor_winning_reasons?: string[]
  cited_sources_types?: string[]
  error?: string
}

type UrlResult = {
  marca: string
  categoria: string
  mercado: string
  diferenciadores: string[]
  resumen_pagina: string
  arquetipos: Array<{ arquetipo: string; driver: string; dealbreaker: string }>
  resultados: UrlResultado[]
  queries_con_mencion: number
  total_queries: number
  visibilidad_pct: number
  keyword_trend?: string
  plan_accion?: {
    vehiculos: Array<{ concepto: string; acciones: UrlResultAction[] }>
    roi_estimado: string
  }
}

const s: Record<string, CSSProperties> = {
  page: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '11px',
    color: '#111827',
    background: '#fff',
    width: '210mm',
    margin: '0 auto',
    padding: '18mm 20mm',
    lineHeight: 1.5,
    boxSizing: 'border-box',
  },
  label: {
    fontSize: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: '#9ca3af',
    fontWeight: 600,
    marginBottom: '6px',
    display: 'block',
  },
  sectionGap: { marginBottom: '28px' },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    padding: '12px 14px',
    marginBottom: '10px',
    pageBreakInside: 'avoid' as const,
  },
  cardGreen: {
    border: '1px solid #bbf7d0',
    borderRadius: '4px',
    padding: '10px 12px',
    background: '#f0fdf4',
    marginTop: '8px',
  },
  cardAmber: {
    border: '1px solid #fde68a',
    borderRadius: '4px',
    padding: '10px 12px',
    background: '#fffbeb',
    marginBottom: '14px',
  },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  th: {
    textAlign: 'left' as const,
    padding: '6px 8px',
    borderBottom: '2px solid #d1d5db',
    color: '#4b5563',
    fontWeight: 600,
    fontSize: '10px',
  },
  td: {
    padding: '6px 8px',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '10px',
    color: '#374151',
  },
}

const pill = (score: number): CSSProperties => ({
  fontSize: '8px',
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: '20px',
  border: '1px solid',
  whiteSpace: 'nowrap' as const,
  ...(score >= 7
    ? { borderColor: '#86efac', color: '#15803d', background: '#f0fdf4' }
    : score >= 5
    ? { borderColor: '#fde68a', color: '#92400e', background: '#fffbeb' }
    : { borderColor: '#d1d5db', color: '#6b7280', background: '#f9fafb' }),
})

const ExecutiveReportTemplate = forwardRef<HTMLDivElement, { urlResult: UrlResult }>(
  ({ urlResult }, ref) => {
    const allActions: UrlResultAction[] =
      urlResult.plan_accion?.vehiculos.flatMap(v => v.acciones) ?? []

    const scoreColor =
      urlResult.visibilidad_pct === 0
        ? '#dc2626'
        : urlResult.visibilidad_pct < 50
        ? '#d97706'
        : urlResult.visibilidad_pct < 100
        ? '#ca8a04'
        : '#16a34a'

    const topAction = allActions.find(a => a.ice_score >= 7) ?? allActions[0]

    const getInstruccion = (a: UrlResultAction) => {
      const area = a.area_responsable || ''
      const tactica = a.tactica_tecnica.toLowerCase()
      const concepto = a.concepto_objetivo || ''
      if (area === 'TI / Desarrollo' || tactica.includes('schema') || tactica.includes('json-ld'))
        return `El equipo de TI debe insertar el bloque de código correspondiente dentro de <head> en la página de "${concepto}" y solicitar re-indexación en Google Search Console.`
      if (area === 'Marketing / Contenido' || tactica.includes('artículo') || tactica.includes('landing') || tactica.includes('evergreen'))
        return `El equipo de Marketing debe redactar una página de destino que responda directamente a "${concepto}", con datos verificables y diferenciadores frente a la competencia.`
      if (tactica.includes('digital pr') || tactica.includes('prensa') || tactica.includes('medios'))
        return `El equipo de Comunicaciones debe publicar una nota de prensa en medios digitales del segmento "${concepto}". Las menciones externas validan la autoridad de la marca ante la IA.`
      return `El equipo de ${area || 'responsable'} debe implementar "${a.tactica_tecnica}" para capturar la consulta "${concepto}".`
    }

    const getRoi = (a: UrlResultAction) =>
      a.segmento_impactado
        ? `Al implementar esto, la marca entra al top 3 de recomendaciones para ${a.segmento_impactado.split(/[,.]/).at(0)?.trim()}, capturando tráfico calificado en etapa de decisión de compra.`
        : 'Al implementar esto, la marca mejora su posición en los motores de IA, accediendo a demanda de alta intención de compra que hoy captura la competencia.'

    const today = new Date().toLocaleDateString('es-CL', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    return (
      <div ref={ref} style={s.page}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', marginBottom: '24px', borderBottom: '2px solid #111827' }}>
          <div>
            <span style={s.label}>Informe de Visibilidad en IA · Confidencial</span>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{urlResult.marca}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{urlResult.categoria} · {urlResult.mercado}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '9px', color: '#9ca3af' }}>{today}</div>
            <div style={{ fontSize: '9px', color: '#9ca3af', marginTop: '2px' }}>AI Visibility Platform</div>
          </div>
        </div>

        {/* 1. DIAGNÓSTICO */}
        <div style={s.sectionGap}>
          <span style={s.label}>1. Diagnóstico de Visibilidad</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '48px', fontWeight: 300, color: scoreColor, lineHeight: 1 }}>{urlResult.visibilidad_pct}%</span>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>de perfiles de comprador te mencionan</div>
              <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
                {urlResult.queries_con_mencion} con mención · {urlResult.total_queries - urlResult.queries_con_mencion} sin mención · {urlResult.total_queries} perfiles totales
              </div>
            </div>
            <div style={{ flex: 1, paddingBottom: '8px' }}>
              <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${urlResult.visibilidad_pct}%`, height: '100%', background: scoreColor, borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          {urlResult.resumen_pagina && (
            <div style={{ fontSize: '10px', color: '#4b5563', marginBottom: '10px', fontStyle: 'italic' }}>
              {urlResult.resumen_pagina}
            </div>
          )}

          {urlResult.diferenciadores.length > 0 && (
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '10px 12px' }}>
              <span style={{ ...s.label, marginBottom: '4px' }}>La Brecha de Mensaje — atributos de tu web que la IA no valida</span>
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginTop: '4px' }}>
                {urlResult.diferenciadores.slice(0, 8).map((d, i) => (
                  <span key={i} style={{ fontSize: '9px', padding: '2px 8px', border: '1px solid #d1d5db', borderRadius: '20px', color: '#374151' }}>{d}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. ANÁLISIS COMPETITIVO */}
        <div style={s.sectionGap}>
          <span style={s.label}>2. Análisis Competitivo por Perfil de Comprador</span>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Perfil de comprador</th>
                <th style={s.th}>Driver de decisión</th>
                <th style={s.th}>Marca ganadora (IA)</th>
                <th style={s.th}>{urlResult.marca}</th>
              </tr>
            </thead>
            <tbody>
              {urlResult.resultados.map((r, i) => (
                <tr key={i}>
                  <td style={s.td}>{r.arquetipo}</td>
                  <td style={{ ...s.td, color: '#6b7280', fontStyle: 'italic' }}>{r.driver}</td>
                  <td style={{ ...s.td, fontWeight: 600 }}>{r.marca_ganadora || '—'}</td>
                  <td style={s.td}>
                    {r.error ? (
                      <span style={{ color: '#9ca3af' }}>n/a</span>
                    ) : r.mencionada ? (
                      <span style={{ color: '#15803d', fontWeight: 600 }}>#{r.posicion}</span>
                    ) : (
                      <span style={{ color: '#dc2626' }}>No mencionada</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. PLAN DE RECUPERACIÓN */}
        {allActions.length > 0 && (
          <div style={s.sectionGap}>
            <span style={s.label}>3. Plan de Recuperación</span>

            {topAction && (
              <div style={s.cardAmber}>
                <span style={{ ...s.label, color: '#92400e', marginBottom: '4px' }}>✦ Acción Prioritaria Esta Semana</span>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{topAction.tactica_tecnica}</div>
                <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>{topAction.concepto_objetivo}</div>
                <div style={{ fontSize: '9px', color: '#92400e', marginTop: '4px' }}>Equipo: {topAction.area_responsable} · Plazo: {topAction.tiempo_indexacion_ia}</div>
              </div>
            )}

            {allActions.map((a, i) => (
              <div key={i} style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '9px', color: '#9ca3af', marginRight: '6px' }}>{i + 1}.</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#111827' }}>{a.tactica_tecnica}</span>
                    <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px', marginLeft: '14px' }}>{a.concepto_objetivo}</div>
                  </div>
                  <span style={pill(a.ice_score)}>
                    {a.ice_score >= 7 ? 'Alto impacto' : a.ice_score >= 5 ? 'Impacto medio' : 'Complementaria'}
                  </span>
                </div>

                <div style={{ marginLeft: '14px' }}>
                  <div style={{ fontSize: '9px', color: '#4b5563', marginBottom: '6px' }}>
                    <strong>Equipo:</strong> {a.area_responsable} &nbsp;·&nbsp; <strong>Plazo:</strong> {a.tiempo_indexacion_ia}
                  </div>

                  {a.segmento_impactado && (
                    <div style={{ fontSize: '9px', color: '#4b5563', marginBottom: '6px' }}>
                      <strong>Oportunidad:</strong> {a.segmento_impactado}
                    </div>
                  )}

                  <div style={{ borderLeft: '2px solid #d1d5db', paddingLeft: '8px', marginBottom: '6px' }}>
                    <span style={{ ...s.label, marginBottom: '2px' }}>Instrucción de Trabajo</span>
                    <div style={{ fontSize: '9px', color: '#374151', lineHeight: 1.6 }}>{getInstruccion(a)}</div>
                  </div>

                  <div style={s.cardGreen}>
                    <span style={{ ...s.label, color: '#15803d', marginBottom: '2px' }}>Retorno Proyectado</span>
                    <div style={{ fontSize: '9px', color: '#374151', lineHeight: 1.6 }}>{getRoi(a)}</div>
                  </div>

                  {a.riesgo_inaccion && (
                    <div style={{ borderLeft: '3px solid #fca5a5', paddingLeft: '10px', marginTop: '8px' }}>
                      <span style={{ ...s.label, color: '#b91c1c', marginBottom: '2px' }}>Si no actúas</span>
                      <div style={{ fontSize: '9px', color: '#7f1d1d', lineHeight: 1.6 }}>{a.riesgo_inaccion}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ROI GLOBAL */}
        {urlResult.plan_accion?.roi_estimado && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', padding: '12px 14px', marginBottom: '28px' }}>
            <span style={{ ...s.label, color: '#15803d' }}>Retorno Global Estimado</span>
            <div style={{ fontSize: '10px', color: '#374151', lineHeight: 1.6 }}>{urlResult.plan_accion.roi_estimado}</div>
          </div>
        )}

        {/* FOOTER */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '8px', color: '#9ca3af' }}>Generado por AI Visibility Platform</span>
          <span style={{ fontSize: '8px', color: '#9ca3af' }}>{today}</span>
        </div>
      </div>
    )
  }
)

ExecutiveReportTemplate.displayName = 'ExecutiveReportTemplate'
export default ExecutiveReportTemplate
