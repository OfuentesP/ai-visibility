import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FaqAccordionServer } from '@/components/FaqAccordionServer'
import { guias, getGuia } from '@/lib/guias'

export function generateStaticParams() {
  return guias.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = getGuia(slug)
  if (!g) return {}
  return {
    title: `${g.titulo} | Ai Visibility`,
    description: g.descripcion,
    keywords: [g.categoria, 'GEO Chile', 'AEO', 'ChatGPT marketing', 'Ai Visibility'],
    alternates: {
      canonical: `https://ai-visibility.cl/guias/${g.slug}/`,
      languages: {
        es: `https://ai-visibility.cl/guias/${g.slug}/`,
        'es-CL': `https://ai-visibility.cl/guias/${g.slug}/`,
      },
    },
    openGraph: {
      title: g.titulo,
      description: g.descripcion,
      url: `https://ai-visibility.cl/guias/${g.slug}/`,
      siteName: 'Ai Visibility',
      locale: 'es_CL',
      type: 'article',
      publishedTime: g.fecha,
    },
  }
}

export default async function GuiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = getGuia(slug)
  if (!g) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `https://ai-visibility.cl/guias/${g.slug}/`,
        headline: g.titulo,
        description: g.descripcion,
        datePublished: g.fecha,
        dateModified: g.fecha,
        inLanguage: 'es-CL',
        author: {
          '@type': 'Organization',
          '@id': 'https://ai-visibility.cl/#organization',
          name: 'Ai Visibility',
        },
        publisher: { '@id': 'https://ai-visibility.cl/#organization' },
        url: `https://ai-visibility.cl/guias/${g.slug}/`,
        mainEntityOfPage: `https://ai-visibility.cl/guias/${g.slug}/`,
      },
      {
        '@type': 'FAQPage',
        mainEntity: g.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-10">
          <Link href="/" className="hover:text-slate-400 transition-colors">Ai Visibility</Link>
          <span>/</span>
          <span className="text-slate-500">Guías</span>
          <span>/</span>
          <span className="text-slate-500 truncate max-w-[160px]">{g.categoria}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <span className="inline-block text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-4">
            {g.categoria}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-6">
            {g.titulo}
          </h1>
          {/* Intro — optimizado para AI Overviews: respuesta directa en el primer párrafo */}
          <p className="text-slate-300 text-base leading-relaxed border-l-2 border-indigo-500/50 pl-5">
            {g.intro}
          </p>
          <div className="flex items-center gap-4 mt-6 text-[11px] font-mono text-slate-500">
            <span>Ai Visibility</span>
            <span>·</span>
            <time dateTime={g.fecha}>{new Date(g.fecha).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        </header>

        {/* Contenido */}
        <div className="space-y-12">
          {g.secciones.map((sec) => (
            <section key={sec.h2}>
              <h2 className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-800">
                {sec.h2}
              </h2>
              <div className="space-y-4">
                {sec.parrafos.map((p, i) => (
                  <p key={i} className="text-slate-400 text-sm leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              {sec.lista && (
                <ul className="mt-5 space-y-3">
                  {sec.lista.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="text-indigo-500 font-mono flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-slate-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {sec.nota && (
                <p className="mt-5 text-[12px] text-slate-400 font-mono leading-relaxed border-l-2 border-slate-800 pl-4">
                  {sec.nota}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* CTA mid */}
        <div className="my-12 border border-indigo-900/40 bg-indigo-950/20 rounded-sm p-6">
          <p className="text-slate-300 text-sm font-semibold mb-2">¿Aparece tu tienda cuando tus clientes preguntan en ChatGPT?</p>
          <p className="text-slate-500 text-xs leading-relaxed mb-5">
            Audita tu Share of Model gratis. Resultado en menos de 60 segundos.
          </p>
          <Link
            href={g.ctaUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
          >
            {g.ctaTexto}
          </Link>
        </div>

        {/* FAQ — estructurado para AI Overviews y featured snippets */}
        <section id="faq">
          <h2 className="text-lg font-bold text-white mb-6 pb-3 border-b border-slate-800">
            Preguntas frecuentes
          </h2>
          <FaqAccordionServer items={g.faq} />
        </section>

        {/* Footer nav */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex justify-between items-center">
          <Link href="/" className="text-xs font-mono text-slate-400 hover:text-slate-300 transition-colors">
            ← Volver al inicio
          </Link>
          <Link href={g.ctaUrl} className="text-xs font-mono text-indigo-500 hover:text-indigo-300 transition-colors">
            Auditar mi marca →
          </Link>
        </div>

      </main>
    </div>
  )
}
