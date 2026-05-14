import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const base = 'https://ai-visibility.cl'
const hoy = new Date('2026-05-14')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Core
    { url: `${base}/`,        lastModified: hoy, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/auditar/`,lastModified: hoy, changeFrequency: 'weekly',  priority: 0.9 },

    // Industrias
    { url: `${base}/auditar/cyberday/`,     lastModified: hoy, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/auditar/saas/`,         lastModified: hoy, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/auditar/ecommerce/`,    lastModified: hoy, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/auditar/retail/`,       lastModified: hoy, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/auditar/salud/`,        lastModified: hoy, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/auditar/banca/`,        lastModified: hoy, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/auditar/pyme/`,         lastModified: hoy, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/auditar/inmobiliaria/`, lastModified: hoy, changeFrequency: 'monthly', priority: 0.8 },

    // Guías
    { url: `${base}/guias/cyberday-2026-chatgpt/`, lastModified: hoy, changeFrequency: 'weekly', priority: 0.85 },

    // Glosario
    { url: `${base}/glosario/`,                lastModified: hoy, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/glosario/geo/`,            lastModified: hoy, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/glosario/share-of-model/`, lastModified: hoy, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/glosario/aeo/`,            lastModified: hoy, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/glosario/seo/`,            lastModified: hoy, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/glosario/rag/`,            lastModified: hoy, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/glosario/llm/`,            lastModified: hoy, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/glosario/alucinacion-ia/`, lastModified: hoy, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/glosario/auditoria-arquetipos/`, lastModified: hoy, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
