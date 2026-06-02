import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audita tu Marca en ChatGPT y Gemini | Ai Visibility',
  description: 'Genera tu AI Readiness Score gratis. Analiza tu visibilidad, descubre tu brecha semántica y obtén tácticas de recuperación para dominar los LLMs.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://ai-visibility.cl/auditar',
    languages: { 'es': 'https://ai-visibility.cl/auditar', 'es-CL': 'https://ai-visibility.cl/auditar' },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audita tu Marca en ChatGPT y Gemini | Ai Visibility',
    description: 'Genera tu AI Readiness Score gratis. Analiza tu visibilidad, descubre tu brecha semántica y obtén tácticas de recuperación para dominar los LLMs.',
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Generador de Reportes GEO - Ai Visibility",
  "url": "https://ai-visibility.cl/auditar",
  "description": "Herramienta online para analizar el Share of Model de marcas en modelos fundacionales de inteligencia artificial.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "All",
  "provider": { "@id": "https://ai-visibility.cl/#organization" },
  "featureList": [
    "Cálculo de AI Readiness Score",
    "Análisis de sentimiento de marca en iA",
    "Hoja de ruta estratégica para ChatGPT, Gemini y Perplexity"
  ]
}

export default function AuditarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
