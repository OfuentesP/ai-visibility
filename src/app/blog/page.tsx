import Link from 'next/link'
import type { Metadata } from 'next'
import { getPostsOrdenados, getCategorias } from '@/lib/blog'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Blog | Ai Visibility — Noticias y análisis de iA y LLM',
  description:
    'Actualizaciones, análisis y casos sobre cómo ChatGPT, Perplexity y otros LLM recomiendan marcas. GEO, AEO y Share of Model en español, con foco en Chile.',
  keywords: ['blog GEO', 'noticias iA', 'análisis LLM', 'ChatGPT marcas', 'Perplexity Chile', 'Ai Visibility blog'],
  alternates: {
    canonical: 'https://ai-visibility.cl/blog/',
    types: {
      'application/rss+xml': 'https://ai-visibility.cl/blog/rss.xml',
    },
  },
  openGraph: {
    title: 'Blog Ai Visibility — Noticias y análisis de iA y LLM',
    description:
      'Cómo los LLM recomiendan marcas en 2026. Análisis, casos y tácticas de GEO en español.',
    url: 'https://ai-visibility.cl/blog/',
    siteName: 'Ai Visibility',
    locale: 'es_CL',
    type: 'website',
  },
}

export default function BlogIndexPage() {
  const todos = getPostsOrdenados()
  const destacado = todos.find((p) => p.destacado) ?? todos[0]
  const resto = todos.filter((p) => p.slug !== destacado?.slug)
  const categorias = getCategorias()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://ai-visibility.cl/blog/#blog',
    name: 'Blog Ai Visibility',
    description:
      'Noticias, análisis y tutoriales sobre cómo los LLM recomiendan marcas. GEO y AEO en español.',
    url: 'https://ai-visibility.cl/blog/',
    inLanguage: 'es-CL',
    publisher: {
      '@type': 'Organization',
      '@id': 'https://ai-visibility.cl/#organization',
      name: 'Ai Visibility',
    },
    blogPost: todos.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.titulo,
      description: p.descripcion,
      datePublished: p.fecha,
      url: `https://ai-visibility.cl/blog/${p.slug}/`,
    })),
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-[11px] font-mono text-slate-400 mb-10">
          <Link href="/" className="hover:text-slate-300 transition-colors">Ai Visibility</Link>
          <span>/</span>
          <span className="text-slate-400">Blog</span>
        </nav>

        {/* Header */}
        <header className="mb-14 max-w-3xl">
          <span className="inline-block text-xs sm:text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-4">
            Blog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-5">
            Noticias y análisis de cómo los LLM recomiendan marcas
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Cobertura editorial sobre ChatGPT, Perplexity, Gemini y los cambios que impactan tu Share of Model.
            Sin humo: datos, casos y tácticas que se aplican esta semana.
          </p>
        </header>

        {/* Categorías */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categorias.map((c) => (
            <span
              key={c}
              className="text-xs sm:text-[10px] font-mono uppercase tracking-wider text-slate-400 border border-slate-800 px-3 py-1.5 rounded-sm"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Destacado */}
        {destacado && (
          <Link
            href={`/blog/${destacado.slug}/`}
            className="block mb-16 group border border-slate-800 hover:border-indigo-600/60 bg-gradient-to-br from-slate-900/40 to-slate-950 rounded-sm p-7 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs sm:text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                Destacado · {destacado.categoria}
              </span>
              <span className="text-xs sm:text-[10px] font-mono text-slate-600">
                {new Date(destacado.fecha).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors leading-tight mb-3">
              {destacado.titulo}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-3xl">
              {destacado.resumen}
            </p>
            <div className="flex items-center gap-4 text-xs sm:text-[11px] font-mono text-slate-400">
              <span>{destacado.autor}</span>
              <span>·</span>
              <span>{destacado.tiempoLectura}</span>
              <span>·</span>
              <span className="text-indigo-400 group-hover:text-indigo-300 transition-colors">Leer →</span>
            </div>
          </Link>
        )}

        {/* Lista */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resto.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}/`}
              className="group border border-slate-800 hover:border-slate-700 bg-slate-900/30 rounded-sm p-6 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs sm:text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                  {p.categoria}
                </span>
                <span className="text-xs sm:text-[10px] font-mono text-slate-600">
                  {new Date(p.fecha).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug mb-3">
                {p.titulo}
              </h3>
              <p className="text-slate-400 text-sm sm:text-xs leading-relaxed mb-4 line-clamp-3">
                {p.resumen}
              </p>
              <div className="flex items-center gap-3 text-xs sm:text-[10px] font-mono text-slate-400">
                <span>{p.tiempoLectura}</span>
                <span>·</span>
                <span className="text-indigo-500 group-hover:text-indigo-300 transition-colors">Leer →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* RSS hint */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs font-mono text-slate-400">
            ¿Quieres recibir las novedades en tu lector? Suscríbete al feed RSS.
          </p>
          <a
            href="/blog/rss.xml"
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            /blog/rss.xml →
          </a>
        </div>
      </main>
    </div>
  )
}
