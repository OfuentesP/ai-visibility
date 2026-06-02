import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FaqAccordionServer } from '@/components/FaqAccordionServer'
import { industrias, getIndustria } from '@/lib/industrias'

export function generateStaticParams() {
  return industrias.map((i) => ({ industria: i.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ industria: string }> }) {
  const { industria: slug } = await params
  const ind = getIndustria(slug)
  if (!ind) return {}
  return {
    title: ind.tituloSeo ?? `${ind.tagline} — Auditoría de Visibilidad en ChatGPT | Ai Visibility`,
    description: ind.descripcionSeo ?? ind.descripcion,
    keywords: [ind.tagline, 'GEO Chile', 'Share of Model', 'ChatGPT ' + ind.nombre, 'Ai Visibility'],
    alternates: {
      canonical: `https://ai-visibility.cl/auditar/${ind.id}/`,
      languages: {
        es: `https://ai-visibility.cl/auditar/${ind.id}/`,
        'es-CL': `https://ai-visibility.cl/auditar/${ind.id}/`,
      },
    },
    openGraph: {
      title: `${ind.tagline} | Ai Visibility`,
      description: ind.descripcion,
      url: `https://ai-visibility.cl/auditar/${ind.id}/`,
      siteName: 'Ai Visibility',
      locale: 'es_CL',
      type: 'website',
    },
  }
}

export default async function IndustriaPage({ params }: { params: Promise<{ industria: string }> }) {
  const { industria: slug } = await params
  const ind = getIndustria(slug)
  if (!ind) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://ai-visibility.cl/auditar/${ind.id}/`,
    name: ind.tagline,
    description: ind.descripcion,
    url: `https://ai-visibility.cl/auditar/${ind.id}/`,
    publisher: { '@id': 'https://ai-visibility.cl/#organization' },
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: ind.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  }

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-16 sm:pt-24 pb-12 sm:pb-20">
        <p className="text-xs sm:text-[11px] font-mono text-indigo-600 uppercase tracking-widest mb-5">
          {ind.nombre} · GEO · Share of Model
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight max-w-3xl mb-6">
          {ind.tagline}
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mb-10 leading-relaxed">
          {ind.descripcion}
        </p>
        <Link
          href="/auditar/"
          className="px-8 py-3.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-colors"
        >
          Auditar mi marca gratis →
        </Link>
        <p className="text-slate-500 text-xs font-mono mt-4">Sin tarjeta de crédito · Resultado en &lt;60s</p>
      </section>

      {/* QUERIES que hace tu cliente */}
      <section className="border-t border-slate-200/60 py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs sm:text-[11px] font-mono text-indigo-600 uppercase tracking-widest mb-3 text-center">Lo que preguntan cuando no miras</p>
          <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-10">
            Consultas reales de tus clientes a ChatGPT
          </h2>
          <div className="space-y-3">
            {ind.queries.map((q) => (
              <div key={q} className="bg-slate-50 border border-slate-200 rounded-sm px-5 py-4 flex items-start gap-4">
                <div className="w-6 h-6 rounded-sm bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-slate-900 text-xs font-bold">iA</span>
                </div>
                <p className="text-slate-700 text-sm font-mono leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs font-mono text-center mt-6">
            ¿Apareces en las respuestas? Audítalo gratis.
          </p>
        </div>
      </section>

      {/* DOLORES */}
      <section className="border-t border-slate-200/60 py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs sm:text-[11px] font-mono text-indigo-600 uppercase tracking-widest mb-3 text-center">El problema real</p>
          <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-10">
            Por qué el {ind.nombre} pierde clientes en la era de la iA
          </h2>
          <div className="space-y-5">
            {ind.dolores.map((d) => (
              <div key={d.titulo} className="bg-slate-50 border border-slate-200 rounded-sm p-6 flex gap-5">
                <span className="text-rose-600 text-lg flex-shrink-0 mt-0.5">⚠</span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">{d.titulo}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA MID */}
      <section className="border-t border-slate-200/60 py-12 sm:py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-4">
            Descubre tu Share of Model en ChatGPT — gratis
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Ingresa tu marca y la búsqueda representativa de tu industria. En menos de 60 segundos sabes si la iA te recomienda o le regala tus clientes a la competencia.
          </p>
          <Link
            href="/auditar/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-colors"
          >
            Auditar mi {ind.nombre} →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200/60 py-12 sm:py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs sm:text-[11px] font-mono text-indigo-600 uppercase tracking-widest mb-3 text-center">Preguntas frecuentes</p>
          <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-10">
            GEO para {ind.nombre}
          </h2>
          <FaqAccordionServer items={ind.faq} />
        </div>
      </section>

      {/* LECTURAS RECOMENDADAS — cluster auditar↔blog */}
      {ind.lecturas && ind.lecturas.length > 0 && (
        <section className="border-t border-slate-200/60 py-12 sm:py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs sm:text-[11px] font-mono text-indigo-600 uppercase tracking-widest mb-3 text-center">Profundiza el tema</p>
            <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-10">
              Lecturas recomendadas
            </h2>
            <div className="space-y-3">
              {ind.lecturas.map((l) => (
                <Link
                  key={l.slug}
                  href={`/blog/${l.slug}/`}
                  className="block bg-slate-50 border border-slate-200 hover:border-indigo-600/60 rounded-sm px-5 py-4 transition-colors group"
                >
                  <span className="text-xs sm:text-[10px] font-mono text-indigo-600 uppercase tracking-widest">Blog</span>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mt-1.5 leading-snug">
                    {l.titulo}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER NAV */}
      <section className="border-t border-slate-200/60 py-8 px-4">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <Link href="/" className="text-xs font-mono text-slate-500 hover:text-slate-700 transition-colors">
            ← Volver al inicio
          </Link>
          <div className="flex gap-6">
            {industrias.filter((i) => i.id !== ind.id).map((i) => (
              <Link key={i.id} href={`/auditar/${i.id}/`} className="text-xs font-mono text-slate-500 hover:text-indigo-600 transition-colors capitalize">
                {i.nombre}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
