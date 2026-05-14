import Link from 'next/link'
import { notFound } from 'next/navigation'
import { terminos, getTermino } from '@/lib/terminos'

const tagColor: Record<string, string> = {
  Métrica:      'text-indigo-400 bg-indigo-950/60 border-indigo-800/40',
  Estrategia:   'text-violet-400 bg-violet-950/60 border-violet-800/40',
  Riesgo:       'text-rose-400 bg-rose-950/40 border-rose-800/40',
  Arquitectura: 'text-sky-400 bg-sky-950/40 border-sky-800/40',
  Metodología:  'text-amber-400 bg-amber-950/40 border-amber-800/40',
  Tecnología:   'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
}

export function generateStaticParams() {
  return terminos.map((t) => ({ slug: t.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = getTermino(slug)
  if (!t) return {}
  return {
    title: `${t.termino} — Definición y Guía GEO | AI Visibility`,
    description: t.definicion,
    keywords: [t.termino, 'GEO', 'Generative Engine Optimization', 'LLM marketing', 'AI Visibility'],
    alternates: {
      canonical: `https://ai-visibility.cl/glosario/${t.id}/`,
      languages: {
        es: `https://ai-visibility.cl/glosario/${t.id}/`,
        'es-CL': `https://ai-visibility.cl/glosario/${t.id}/`,
      },
    },
    openGraph: {
      title: `${t.termino} | Glosario GEO — AI Visibility`,
      description: t.definicion,
      url: `https://ai-visibility.cl/glosario/${t.id}/`,
      siteName: 'AI Visibility',
      locale: 'es_CL',
      type: 'article',
    },
  }
}

export default async function TerminoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = getTermino(slug)
  if (!t) notFound()

  const relacionados = t.relacionados.map((id) => getTermino(id)).filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `https://ai-visibility.cl/glosario/${t.id}/`,
    name: t.termino,
    description: t.definicion,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': 'https://ai-visibility.cl/glosario#terminos',
      name: 'Glosario de Generative Engine Optimization',
    },
    publisher: { '@id': 'https://ai-visibility.cl/#organization' },
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-2xl mx-auto py-12 md:py-20 px-4">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-mono text-slate-600 mb-10">
          <Link href="/" className="hover:text-slate-400 transition-colors">AI Visibility</Link>
          <span>/</span>
          <Link href="/glosario/" className="hover:text-slate-400 transition-colors">Glosario</Link>
          <span>/</span>
          <span className="text-slate-500">{t.termino}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded border mb-4 ${tagColor[t.tag] ?? 'text-slate-500 bg-slate-800 border-slate-700'}`}>
            {t.tag}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-5">
            {t.termino}
          </h1>
          <p className="text-slate-300 text-base leading-relaxed border-l-2 border-indigo-500/50 pl-5">
            {t.definicion}
          </p>
        </div>

        {/* Extended content */}
        <div className="space-y-5 mb-12">
          {t.ampliacion.map((p, i) => (
            <p key={i} className="text-slate-400 text-sm leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* Related terms */}
        {relacionados.length > 0 && (
          <div className="border-t border-slate-800 pt-8 mb-12">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-4">Términos relacionados</p>
            <div className="flex flex-wrap gap-3">
              {relacionados.map((r) => r && (
                <Link
                  key={r.id}
                  href={`/glosario/${r.id}/`}
                  className="px-3 py-1.5 rounded-sm bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
                >
                  {r.termino}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="border border-indigo-900/40 bg-indigo-950/20 rounded-sm p-6">
          <p className="text-slate-300 text-sm font-semibold mb-2">¿Tu marca aparece cuando un cliente pregunta sobre tu industria?</p>
          <p className="text-slate-500 text-xs leading-relaxed mb-5">
            Audita tu Share of Model en ChatGPT gratis — resultado en menos de 60 segundos.
          </p>
          <Link
            href="/auditar/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
          >
            Auditar mi marca →
          </Link>
        </div>

        {/* Back */}
        <div className="mt-10 pt-6 border-t border-slate-800">
          <Link href="/glosario/" className="text-xs font-mono text-slate-600 hover:text-slate-300 transition-colors">
            ← Todos los términos
          </Link>
        </div>

      </main>
    </div>
  )
}
