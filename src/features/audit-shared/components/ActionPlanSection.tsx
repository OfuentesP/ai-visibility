'use client'

import { useState } from 'react'
import { TriangleAlert, Code2, Megaphone, Globe, Terminal, Download, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PlanAccion, PlanAccionItem } from '../types'

interface Props {
  planAccion: PlanAccion
  marca: string
  /** How many resultados were without mention — used to build the subtitle */
  sinMencion?: number
  totalQueries?: number
  sectionIndex?: string
}

const AREA_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  'Marketing / Contenido': { icon: <Megaphone className="w-3.5 h-3.5" />, label: 'Contenido', color: 'text-violet-700 bg-violet-500/10 border-violet-500/20' },
  'TI / Desarrollo':       { icon: <Code2 className="w-3.5 h-3.5" />,    label: 'Técnico',   color: 'text-sky-600 bg-sky-500/10 border-sky-500/20' },
  'PR / Agencia':          { icon: <Globe className="w-3.5 h-3.5" />,    label: 'PR & Medios', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
}

function buildSnippet(tactica: string, concepto: string, marca: string): string {
  const t = tactica.toLowerCase()
  if (t.includes('schema faq') || t.includes('json-ld')) {
    return `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "¿Qué es ${concepto}?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "${marca} ofrece ${concepto}. A diferencia de otras opciones del mercado, nos diferenciamos por [diferenciador clave]. Conoce más en [URL de la página]."\n      }\n    },\n    {\n      "@type": "Question",\n      "name": "¿Cómo funciona ${concepto} en ${marca}?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Con ${marca}, ${concepto} es simple: [paso 1], [paso 2] y [paso 3]. Sin costo oculto ni burocracia."\n      }\n    }\n  ]\n}\n</script>`
  }
  if (t.includes('tablas') || t.includes('html')) {
    return `<!-- Tabla comparativa HTML para ${concepto} -->\n<table>\n  <thead>\n    <tr>\n      <th>Característica</th>\n      <th>${marca}</th>\n      <th>Competidor A</th>\n      <th>Competidor B</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>${concepto}</td>\n      <td>✅ Sí</td>\n      <td>⚠️ Parcial</td>\n      <td>❌ No</td>\n    </tr>\n    <tr>\n      <td>Tiempo de respuesta</td>\n      <td>[Tu dato]</td>\n      <td>[Dato competidor]</td>\n      <td>[Dato competidor]</td>\n    </tr>\n  </tbody>\n</table>`
  }
  if (t.includes('landing') || t.includes('semántica') || t.includes('semantica') || t.includes('evergreen')) {
    return `<!-- Bloque de contenido semántico para landing page -->\n<section>\n  <h2>${concepto}: Guía completa</h2>\n  <p>${concepto} es clave para [perfil del cliente]. ${marca} resuelve esto\n  mediante [diferenciador], lo que lo convierte en la mejor opción para\n  quienes buscan [beneficio principal].</p>\n  <h3>¿Por qué ${marca} para ${concepto}?</h3>\n  <ul>\n    <li><strong>Ventaja 1:</strong> [descripción concreta con datos]</li>\n    <li><strong>Ventaja 2:</strong> [descripción concreta con datos]</li>\n    <li><strong>Ventaja 3:</strong> [descripción concreta con datos]</li>\n  </ul>\n  <p><a href="/[tu-url]">Conoce más sobre ${concepto} en ${marca} →</a></p>\n</section>`
  }
  if (t.includes('digital pr') || t.includes('medios')) {
    return `NOTA DE PRENSA — PLANTILLA COPY-PASTE\n\nTITULAR (máx 80 chars):\n${marca} presenta [propuesta de valor] en el mercado de ${concepto}\n\nPRIMER PÁRRAFO:\n${marca} anunció hoy [acción concreta], consolidando su posición como\nreferente en ${concepto} en [mercado]. La iniciativa responde a [tendencia/dato].\n\nCITA DEL VOCERO:\n"[Nombre, Cargo] de ${marca}: '[cita en 1-2 oraciones]'"\n\nDATOS CLAVE:\n- [Dato 1 con número sobre ${concepto}]\n- [Dato 2: resultado medible]\n- [Dato 3: diferenciador verificable]`
  }
  if (t.includes('knowledge graph') || t.includes('entidades')) {
    return `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "${marca}",\n  "description": "Especialistas en ${concepto}",\n  "url": "https://[tudominio].cl",\n  "sameAs": [\n    "https://www.wikidata.org/wiki/[ID-wikidata]",\n    "https://www.linkedin.com/company/[slug]",\n    "https://www.instagram.com/[usuario]"\n  ],\n  "knowsAbout": ["${concepto}", "[tema 2]", "[tema 3]"],\n  "areaServed": { "@type": "Country", "name": "Chile" }\n}\n</script>`
  }
  return ''
}

function ActionRow({ action, index, isTop, marca }: { action: PlanAccionItem; index: number; isTop: boolean; marca: string }) {
  const [expanded, setExpanded] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const areaCfg = AREA_CONFIG[action.area_responsable || ''] ?? {
    icon: null,
    label: action.area_responsable || 'Equipo',
    color: 'text-slate-500 bg-slate-100/60 border-slate-300',
  }
  const concepto = action.concepto_objetivo || 'tu concepto aquí'
  const snippet = buildSnippet(action.tactica_tecnica || '', concepto, marca)

  return (
    <div>
      <div
        className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors ${
          expanded
            ? isTop
              ? 'border-l-2 border-amber-500/50 border-t border-x border-slate-300/30 bg-slate-100/30 rounded-t-sm'
              : 'border-t border-x border-slate-300/20 bg-slate-100/20 rounded-t-sm'
            : isTop
              ? 'border-l-2 border-amber-500/50 border-y border-r border-slate-300/30 bg-slate-100/30 hover:bg-slate-100/50 rounded-sm'
              : 'border border-slate-300/20 bg-slate-100/10 hover:bg-slate-100/30 rounded-sm'
        }`}
        onClick={() => { setExpanded(v => !v); if (expanded) setShowCode(false) }}
      >
        <span className={`text-sm font-mono tabular-nums shrink-0 w-5 ${isTop ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
          {index + 1}.
        </span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm leading-snug ${isTop ? 'text-slate-900 font-semibold' : 'text-slate-700 font-medium'}`}>
            {concepto.charAt(0).toUpperCase() + concepto.slice(1)}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-slate-500 text-xs truncate">{action.tactica_tecnica}</p>
            {action.area_responsable && (
              <span className={`hidden sm:inline text-xs sm:text-[10px] font-semibold px-1.5 py-px rounded border shrink-0 ${areaCfg.color.split(' ').slice(0, 3).join(' ')}`}>
                {areaCfg.label}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {action.tiempo_indexacion_ia && (
            <span className="hidden sm:inline text-xs sm:text-[10px] font-mono text-slate-500 border border-slate-300/60 px-1.5 py-0.5 rounded">
              {action.tiempo_indexacion_ia.split('(')[0].trim()}
            </span>
          )}
          {action.ice_score >= 7 ? (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/12 text-emerald-700 border border-emerald-500/25">↑ Alto</span>
          ) : action.ice_score >= 5 ? (
            <span className="text-xs text-amber-600">→ Medio</span>
          ) : (
            <span className="text-xs text-slate-500">Complementaria</span>
          )}
          <span className={`text-slate-500 text-xs transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>›</span>
        </div>
      </div>

      {expanded && (
        <div className={`border-b border-r border-l-2 ${
          isTop ? 'border-amber-500/40 border-b-slate-700/30 border-r-slate-700/30' : 'border-slate-300/30 border-b-slate-700/20 border-r-slate-700/20'
        } bg-slate-50/40 rounded-b-sm`}>
          <div className="px-5 py-4 space-y-3">
            {action.riesgo_inaccion ? (
              <div className="flex items-start gap-2.5">
                <TriangleAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 leading-snug">{action.riesgo_inaccion}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 leading-snug">{concepto}</p>
            )}
            {action.area_responsable && (
              <p className="text-xs text-slate-500">
                Responsable: <span className="text-slate-700">{action.area_responsable}</span>
              </p>
            )}
          </div>

          {(action.pasos_ejecucion?.length > 0 || snippet) && (
            <div className="border-t border-slate-200/60">
              <button
                onClick={(e) => { e.stopPropagation(); setShowCode(v => !v) }}
                className="w-full flex items-center justify-between px-5 py-2.5 text-left hover:bg-slate-100/30 transition-colors"
              >
                <span className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors">Ver cómo implementarlo</span>
                <span className={`text-slate-500 text-xs transition-transform duration-200 ${showCode ? 'rotate-90' : ''}`}>›</span>
              </button>

              {showCode && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-200/40">
                  {action.pasos_ejecucion?.length > 0 && (
                    <ol className="space-y-2.5 pt-1">
                      {action.pasos_ejecucion.map((paso, pi) => (
                        <li key={pi} className="flex items-start gap-3">
                          <span className="text-xs sm:text-[11px] font-mono text-slate-500 pt-0.5 w-4 shrink-0 select-none">{pi + 1}.</span>
                          <span className="text-sm text-slate-700 leading-snug">{paso}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                  {snippet && (
                    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-50/60 border-b border-slate-200">
                        <span className="flex items-center gap-2 font-mono text-xs text-slate-500">
                          <Terminal className="w-3 h-3 text-sky-500" />
                          Código listo para copiar
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(snippet) }}
                          className="flex items-center gap-1 text-xs sm:text-[10px] text-slate-500 hover:text-sky-600 transition-colors font-mono"
                        >
                          <Download className="w-3 h-3" /> Copiar
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-slate-700 overflow-x-auto leading-relaxed max-h-64 whitespace-pre"><code>{snippet}</code></pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ActionPlanSection({ planAccion, marca, sinMencion, totalQueries, sectionIndex = '05' }: Props) {
  const allActions = planAccion.vehiculos
    .flatMap(v => v.acciones)
    .sort((a, b) => b.ice_score - a.ice_score)
  const topAction = allActions[0]

  const subtitle = sinMencion === undefined
    ? `Plan de recuperación · ${allActions.length} acciones priorizadas`
    : sinMencion === 0
    ? `${marca} aparece en todos los perfiles — plan de consolidación y expansión`
    : sinMencion === totalQueries
    ? `Plan de recuperación completa · 30–60 días · ${allActions.length} acciones priorizadas`
    : `${sinMencion} tipo${sinMencion > 1 ? 's' : ''} de cliente sin atender · plan en ${allActions.length} pasos`

  return (
    <>
      <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="flex items-center gap-3 px-1 mt-10 mb-3">
        <span className="text-xs font-mono text-slate-500 shrink-0">{sectionIndex}</span>
        <span className="text-sm text-slate-500 font-medium">Plan de acción</span>
        <div className="flex-1 h-px bg-slate-100/30" />
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
        className="bg-white shadow-sm border border-slate-200 rounded-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Qué necesitamos hacer y quién lo ejecuta</h3>
          <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>
        </div>

        {topAction && (
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-300 rounded-sm">
              <span className="text-amber-400 font-bold shrink-0 mt-0.5">✦</span>
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-500 mb-1">Empezar aquí</p>
                <p className="text-amber-100 text-sm font-semibold leading-snug">{topAction.tactica_tecnica}</p>
                <p className="text-amber-700 text-xs mt-1 truncate" title={topAction.concepto_objetivo}>
                  {topAction.concepto_objetivo.charAt(0).toUpperCase() + topAction.concepto_objetivo.slice(1)} · {topAction.tiempo_indexacion_ia.split('(')[0].trim()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="px-5 pb-5 pt-3 space-y-1.5">
          {allActions.map((action, ai) => (
            <ActionRow key={`action-${ai}`} action={action} index={ai} isTop={ai === 0} marca={marca} />
          ))}
        </div>

        {planAccion.roi_estimado && (
          <div className="border-t border-slate-200/60 px-5 py-4">
            <div className="flex items-start gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-slate-700 text-sm leading-relaxed">{planAccion.roi_estimado}</p>
            </div>
          </div>
        )}
      </motion.div>
    </>
  )
}
