import Link from 'next/link'
import { notFound } from 'next/navigation'
import { posts, getPost, getPostsRelacionados } from '@/lib/blog'

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getPost(slug)
  if (!p) return {}
  const url = `https://ai-visibility.cl/blog/${p.slug}/`
  return {
    title: `${p.titulo} | Blog Ai Visibility`,
    description: p.descripcion,
    keywords: [...p.tags, p.categoria, 'GEO', 'AEO', 'Ai Visibility'],
    alternates: {
      canonical: url,
      languages: {
        es: url,
        'es-CL': url,
      },
    },
    openGraph: {
      title: p.titulo,
      description: p.descripcion,
      url,
      siteName: 'Ai Visibility',
      locale: 'es_CL',
      type: 'article',
      publishedTime: p.fecha,
      modifiedTime: p.fechaActualizacion ?? p.fecha,
      authors: [p.autor],
      tags: p.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: p.titulo,
      description: p.descripcion,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getPost(slug)
  if (!p) notFound()

  const url = `https://ai-visibility.cl/blog/${p.slug}/`
  const relacionados = getPostsRelacionados(p.relacionados)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        '@id': url,
        headline: p.titulo,
        description: p.descripcion,
        datePublished: p.fecha,
        dateModified: p.fechaActualizacion ?? p.fecha,
        inLanguage: 'es-CL',
        articleSection: p.categoria,
        keywords: p.tags.join(', '),
        author: {
          '@type': 'Organization',
          '@id': 'https://ai-visibility.cl/#organization',
          name: p.autor,
        },
        publisher: { '@id': 'https://ai-visibility.cl/#organization' },
        url,
        mainEntityOfPage: url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ai Visibility', item: 'https://ai-visibility.cl/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://ai-visibility.cl/blog/' },
          { '@type': 'ListItem', position: 3, name: p.titulo, item: url },
        ],
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
        <nav className="flex items-center gap-2 text-xs sm:text-[11px] font-mono text-slate-400 mb-10">
          <Link href="/" className="hover:text-slate-300 transition-colors">Ai Visibility</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-slate-300 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-slate-400 truncate max-w-[180px]">{p.categoria}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <span className="inline-block text-xs sm:text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-4">
            {p.categoria}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-6">
            {p.titulo}
          </h1>
          <p className="text-slate-300 text-base leading-relaxed border-l-2 border-indigo-500/50 pl-5">
            {p.resumen}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-6 text-xs sm:text-[11px] font-mono text-slate-400">
            <span>{p.autor}</span>
            <span>·</span>
            <time dateTime={p.fecha}>
              {new Date(p.fecha).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <span>·</span>
            <span>{p.tiempoLectura} de lectura</span>
          </div>
        </header>

        {/* Cuerpo */}
        <article className="space-y-6">
          {p.bloques.map((b, i) => {
            if (b.tipo === 'h2') {
              return (
                <h2 key={i} className="text-lg font-bold text-white pt-6 pb-3 border-b border-slate-800">
                  {b.texto}
                </h2>
              )
            }
            if (b.tipo === 'h3') {
              return (
                <h3 key={i} className="text-base font-semibold text-slate-100 pt-2">
                  {b.texto}
                </h3>
              )
            }
            if (b.tipo === 'parrafo') {
              return (
                <p key={i} className="text-slate-400 text-sm leading-relaxed">
                  {b.texto}
                </p>
              )
            }
            if (b.tipo === 'lista') {
              return (
                <ul key={i} className="space-y-3">
                  {b.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-sm">
                      <span className="text-indigo-500 font-mono flex-shrink-0 mt-0.5">
                        {String(j + 1).padStart(2, '0')}
                      </span>
                      <span className="text-slate-300 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )
            }
            if (b.tipo === 'cita') {
              return (
                <blockquote key={i} className="border-l-2 border-indigo-500/60 pl-5 py-1">
                  <p className="text-slate-200 text-sm italic leading-relaxed">"{b.texto}"</p>
                  {b.fuente && (
                    <footer className="mt-2 text-xs sm:text-[11px] font-mono text-slate-400">— {b.fuente}</footer>
                  )}
                </blockquote>
              )
            }
            if (b.tipo === 'codigo') {
              return (
                <pre
                  key={i}
                  className="bg-slate-900 border border-slate-800 rounded-sm p-4 overflow-x-auto text-[12px] font-mono text-slate-300 leading-relaxed"
                >
                  <code>{b.codigo}</code>
                </pre>
              )
            }
            if (b.tipo === 'nota') {
              return (
                <p
                  key={i}
                  className="text-[12px] text-slate-400 font-mono leading-relaxed border-l-2 border-slate-800 pl-4"
                >
                  {b.texto}
                </p>
              )
            }
            return null
          })}
        </article>

        {/* CTA */}
        {p.ctaTexto && p.ctaUrl && (
          <div className="my-12 border border-indigo-900/40 bg-indigo-950/20 rounded-sm p-6">
            <p className="text-slate-300 text-sm font-semibold mb-2">
              ¿Aparece tu marca cuando tus clientes preguntan en ChatGPT?
            </p>
            <p className="text-slate-400 text-sm sm:text-xs leading-relaxed mb-5">
              Audita tu Share of Model gratis. Resultado en menos de 60 segundos.
            </p>
            <Link
              href={p.ctaUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
            >
              {p.ctaTexto}
            </Link>
          </div>
        )}

        {/* Tags */}
        {p.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-800">
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs sm:text-[10px] font-mono text-slate-400 border border-slate-800 px-2.5 py-1 rounded-sm"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Conceptos del glosario */}
        {p.glosario && p.glosario.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-800">
            <p className="text-xs sm:text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4">Conceptos relacionados</p>
            <div className="flex flex-wrap gap-3">
              {p.glosario.map((g) => (
                <Link
                  key={g.slug}
                  href={`/glosario/${g.slug}/`}
                  className="px-3 py-1.5 rounded-sm bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors"
                >
                  {g.termino}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Relacionados */}
        {relacionados.length > 0 && (
          <section className="mt-14">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Sigue leyendo
            </h2>
            <div className="space-y-3">
              {relacionados.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}/`}
                  className="block border border-slate-800 hover:border-indigo-700/60 bg-slate-900/30 rounded-sm p-4 transition-colors group"
                >
                  <span className="text-xs sm:text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                    {r.categoria}
                  </span>
                  <p className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors mt-1.5">
                    {r.titulo}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="mt-14 pt-6 border-t border-slate-800 flex justify-between items-center">
          <Link
            href="/blog"
            className="text-xs font-mono text-slate-400 hover:text-slate-300 transition-colors"
          >
            ← Todos los posts
          </Link>
          <Link
            href="/auditar/"
            className="text-xs font-mono text-indigo-500 hover:text-indigo-300 transition-colors"
          >
            Auditar mi marca →
          </Link>
        </div>
      </main>
    </div>
  )
}
