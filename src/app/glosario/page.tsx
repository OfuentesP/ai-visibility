import Link from 'next/link'
import { terminos } from '@/lib/terminos'

export const metadata = {
  title: 'Glosario de Inteligencia Artificial y GEO | Ai Visibility',
  description: 'Diccionario técnico para CMOs y fundadores. Definiciones claras de Share of Model (SoM), GEO, RAG, Alucinaciones de iA y más.',
  keywords: ['Share of Model', 'GEO', 'RAG', 'LLM', 'Alucinación iA', 'Generative Engine Optimization'],
  alternates: {
    canonical: 'https://ai-visibility.cl/glosario/',
    languages: { 'es': 'https://ai-visibility.cl/glosario/', 'es-CL': 'https://ai-visibility.cl/glosario/' },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glosario de iA y GEO | Ai Visibility',
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
  Métrica:      'text-indigo-400 bg-indigo-950/60 border-indigo-800/40',
  Estrategia:   'text-violet-400 bg-violet-950/60 border-violet-800/40',
  Riesgo:       'text-rose-400 bg-rose-950/40 border-rose-800/40',
  Arquitectura: 'text-sky-400 bg-sky-950/40 border-sky-800/40',
  Metodología:  'text-amber-400 bg-amber-950/40 border-amber-800/40',
  Tecnología:   'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
}

export default function GlosarioPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-6xl mx-auto py-10 md:py-16 px-4">

        <div className="mb-8 md:mb-14">
          <p className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest mb-3">Referencia técnica</p>
          <h1 className="text-xl font-semibold text-slate-100 leading-snug">
            Glosario de iA &amp; GEO
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Conceptos fundamentales para entender la visibilidad de marca en motores generativos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 divide-y-0">
          {terminos.map((item, i) => (
            <div key={item.id} id={item.id} className="py-7 flex gap-6 border-b border-slate-800/60">
              <span className="text-[11px] font-mono text-slate-500 pt-0.5 w-5 shrink-0 select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Link
                    href={`/glosario/${item.id}/`}
                    className="text-sm font-semibold text-slate-100 hover:text-indigo-300 transition-colors"
                  >
                    {item.termino}
                  </Link>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${tagColor[item.tag] ?? 'text-slate-500 bg-slate-800 border-slate-700'}`}>
                    {item.tag}
                  </span>
                </div>
                <p className="text-slate-500 text-[13px] leading-relaxed border-l-2 border-slate-800 pl-4 mb-3">
                  {item.definicion}
                </p>
                <Link
                  href={`/glosario/${item.id}/`}
                  className="text-[11px] font-mono text-indigo-500 hover:text-indigo-300 transition-colors"
                >
                  Leer más →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800">
          <Link href="/" className="text-xs font-mono text-slate-400 hover:text-slate-300 transition-colors">
            ← Volver a la auditoría
          </Link>
        </div>

      </main>
    </div>
  )
}
