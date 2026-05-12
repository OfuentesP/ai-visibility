import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://ai-visibility.cl'
  return [
    { url: base,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/auditar`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/glosario`,lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
