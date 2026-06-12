import Link from 'next/link'
import { terminos } from '@/lib/terminos'

export const metadata = {
  title: 'Glosario de Inteligencia Artificial y GEO | Ai Visibility',
  description: 'Diccionario técnico para CMOs y fundadores. Definiciones claras de Share of Model (SoM), GEO, RAG, Alucinaciones de Ai y más.',
  keywords: ['Share of Model', 'GEO', 'RAG', 'LLM', 'Alucinación Ai', 'Generative Engine Optimization'],
  alternates: {
    canonical: 'https://ai-visibility.cl/glosario/',
    languages: { 'es': 'https://ai-visibility.cl/glosario/', 'es-CL': 'https://ai-visibility.cl/glosario/' },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glosario de Ai y GEO | Ai Visibility',
    description: 'Diccionario técnico para CMOs y fundadores. Definiciones claras de Share of Model, GEO, RAG y más.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  '@id': 'https://ai-visibility.cl/glosario#terminos',
  name: 'Glosario de Generative Engine Optimization',
  description: 'Conceptos fundamentales para entender la visibilidad de marca en motores generativos.',
  publisher: { '@id': 'https://ai-visibility.cl/#organization' },
  hasDefinedTerm: terminos.map((t) => ({
    '@type': 'DefinedTerm',
    '@id': `https://ai-visibility.cl/glosario/${t.id}/`,
    name: t.termino,
    description: t.definicion,
  })),
}

const tagColor: Record<string, string> = {
  Métrica:      'text-indigo-600 bg-indigo-50 border-indigo-300',
  Estrategia:   'text-violet-700 bg-violet-50 border-violet-300',
  Riesgo:       'text-rose-600 bg-rose-50 border-rose-300',
  Arquitectura: 'text-sky-600 bg-sky-50 border-sky-300',
  Metodología:  'text-amber-400 bg-amber-50 border-amber-300',
  Tecnología:   'text-emerald-700 bg-emerald-50 border-emerald-300',
}

export default function GlosarioPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-6xl mx-auto py-10 md:py-16 px-4">

        <div className="mb-8 md:mb-14">
          <p className="text-xs sm:text-[10px] font-mono text-indigo-500 uppercase tracking-widest mb-3">Referencia técnica</p>
          <h1 className="text-xl font-semibold text-slate-900 leading-snug">
            Glosario de Ai &amp; GEO
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Conceptos fundamentales para entender la visibilidad de marca en motores generativos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 divide-y-0">
          {terminos.map((item, i) => (
            <div key={item.id} id={item.id} className="py-7 flex gap-6 border-b border-slate-200/60">
              <span className="text-xs sm:text-[11px] font-mono text-slate-500 pt-0.5 w-5 shrink-0 select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Link
                    href={`/glosario/${item.id}/`}
                    className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    {item.termino}
                  </Link>
                  <span className={`text-xs sm:text-[10px] font-mono px-2 py-0.5 rounded border ${tagColor[item.tag] ?? 'text-slate-500 bg-slate-100 border-slate-300'}`}>
                    {item.tag}
                  </span>
                </div>
                <p className="text-slate-500 text-[13px] leading-relaxed border-l-2 border-slate-200 pl-4 mb-3">
                  {item.definicion}
                </p>
                <Link
                  href={`/glosario/${item.id}/`}
                  className="text-xs sm:text-[11px] font-mono text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  Leer más →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200">
          <Link href="/" className="text-xs font-mono text-slate-500 hover:text-slate-700 transition-colors">
            ← Volver a la auditoría
          </Link>
        </div>

      </main>
    </div>
  )
}
