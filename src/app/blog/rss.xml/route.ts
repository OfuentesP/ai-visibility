import { getPostsOrdenados } from '@/lib/blog'

export const dynamic = 'force-static'

const BASE = 'https://ai-visibility.cl'

function escape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = getPostsOrdenados()
  const lastBuildDate = new Date(posts[0]?.fecha ?? new Date()).toUTCString()

  const items = posts
    .map((p) => {
      const url = `${BASE}/blog/${p.slug}/`
      return `    <item>
      <title>${escape(p.titulo)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.fecha).toUTCString()}</pubDate>
      <category>${escape(p.categoria)}</category>
      <author>noreply@ai-visibility.cl (${escape(p.autor)})</author>
      <description>${escape(p.descripcion)}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog Ai Visibility</title>
    <link>${BASE}/blog/</link>
    <atom:link href="${BASE}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Noticias, análisis y tutoriales sobre cómo los LLM recomiendan marcas. GEO y AEO en español.</description>
    <language>es-CL</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
