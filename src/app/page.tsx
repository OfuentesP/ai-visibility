import Link from 'next/link'
import { FaqAccordionServer } from '@/components/FaqAccordionServer'

export const metadata = {
  title: 'AI Visibility | Plataforma de Optimización para Motores Generativos (GEO)',
  description: 'Mide y optimiza el Share of Model (SoM) de tu marca en ChatGPT, Gemini y Perplexity. La plataforma líder en Generative Engine Optimization en Chile.',
  keywords: ['Generative Engine Optimization', 'GEO', 'Share of Model', 'Auditoría IA', 'AI Readiness Score', 'ChatGPT SEO'],
  alternates: {
    canonical: 'https://ai-visibility.cl',
    languages: { 'es': 'https://ai-visibility.cl', 'es-CL': 'https://ai-visibility.cl' },
  },
  openGraph: {
    title: 'AI Visibility | Auditoría de Visibilidad en Inteligencia Artificial',
    description: 'Descubre qué dicen los modelos de lenguaje sobre tu marca y obtén tu plan de recuperación GEO.',
    url: 'https://ai-visibility.cl',
    siteName: 'AI Visibility',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Visibility | GEO & Share of Model Platform',
    description: 'Descubre qué dicen los modelos de lenguaje sobre tu marca y obtén tu plan de recuperación GEO.',
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ai-visibility.cl/#organization",
      "name": "AI Visibility",
      "url": "https://ai-visibility.cl",
      "description": "Empresa especializada en análisis de Share of Model y Generative Engine Optimization.",
      "address": { "@type": "PostalAddress", "addressCountry": "CL" }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://ai-visibility.cl/#software",
      "name": "AI Visibility Auditor",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web browser",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "¿Qué es Generative Engine Optimization (GEO)?", "acceptedAnswer": { "@type": "Answer", "text": "Generative Engine Optimization (GEO) es el proceso técnico y estratégico de optimizar la presencia de una marca para que sea recomendada por modelos de lenguaje de gran escala (LLMs) y motores de respuesta generativa, como ChatGPT, Perplexity, Claude y Gemini. A diferencia del SEO, GEO se enfoca en entidades, contexto semántico y recuperación de información (RAG)." } },
        { "@type": "Question", "name": "¿Cuál es la diferencia entre SEO y GEO?", "acceptedAnswer": { "@type": "Answer", "text": "El SEO tradicional busca posicionar enlaces en una lista de resultados de Google. El GEO posiciona tu marca como la respuesta definitiva dentro de un texto conversacional generado por IA." } },
        { "@type": "Question", "name": "¿Qué es el Share of Model (SoM)?", "acceptedAnswer": { "@type": "Answer", "text": "El Share of Model (SoM) es la métrica de nueva generación que reemplaza al Share of Voice. Representa el porcentaje exacto de veces que un modelo de IA cita a tu marca frente a tus competidores." } },
        { "@type": "Question", "name": "¿Por qué mi marca no aparece en ChatGPT o Perplexity?", "acceptedAnswer": { "@type": "Answer", "text": "Si tu marca no aparece en LLMs se debe a falta de densidad de entidades, ausencia en fuentes de alta autoridad o carencia de datos estructurados legibles para máquinas en tu sitio web." } }
      ]
    }
  ]
}

const features = [
  {
    icon: '◉',
    title: 'AI Readiness Score',
    desc: 'Puntaje 0–100 que mide cuán preparada está tu marca para ser recomendada por LLMs. Riesgo Crítico, En Riesgo o Visible.',
  },
  {
    icon: '△',
    title: 'Brecha Semántica',
    desc: 'Detecta los conceptos y entidades que la IA asocia a tus competidores pero no a ti. Son exactamente los temas que debes crear.',
  },
  {
    icon: '▶',
    title: 'Tácticas Accionables (ICE)',
    desc: 'Hoja de ruta priorizada por impacto, confianza y esfuerzo: desde JSON-LD hasta PR en Reddit y Perplexity Pages.',
  },
  {
    icon: '◈',
    title: 'Share of Model (SoM)',
    desc: 'Benchmark contra competidores directos: quién domina las respuestas de ChatGPT, Gemini y Perplexity en tu categoría.',
  },
]

const faqItems = [
  {
    q: '¿Qué es Generative Engine Optimization (GEO)?',
    a: 'Generative Engine Optimization (GEO) es el proceso técnico y estratégico de optimizar la presencia de una marca para que sea recomendada por modelos de lenguaje de gran escala (LLMs) y motores de respuesta generativa, como ChatGPT, Perplexity, Claude y Gemini. A diferencia del SEO, GEO se enfoca en entidades, contexto semántico y recuperación de información (RAG).',
  },
  {
    q: '¿Cuál es la diferencia entre SEO y GEO?',
    a: "El SEO tradicional busca posicionar enlaces en una lista de resultados de Google basándose en palabras clave. El GEO busca posicionar tu marca como la \"respuesta definitiva\" dentro de un texto conversacional generado por Inteligencia Artificial, donde no hay listas de enlaces, sino una única recomendación directa.",
  },
  {
    q: '¿Cómo evalúa AI Visibility mi presencia en la IA?',
    a: 'AI Visibility realiza auditorías automatizadas simulando las consultas que harían tus clientes ideales (arquetipos). Nuestra plataforma consulta a los principales LLMs en tiempo real y extrae métricas clave: si tu marca es mencionada, el análisis de sentimiento de esa mención, tu porcentaje de visibilidad y qué competidor está dominando las respuestas.',
  },
  {
    q: '¿Qué es el Share of Model (SoM)?',
    a: "El Share of Model (SoM) es la métrica de nueva generación que reemplaza al \"Share of Voice\". Representa el porcentaje exacto de veces que un modelo de inteligencia artificial cita a tu marca en comparación con tus competidores directos cuando se le pregunta sobre tu industria, productos o servicios.",
  },
  {
    q: '¿Por qué mi marca no aparece en ChatGPT o Perplexity?',
    a: 'Los LLMs construyen sus respuestas basándose en sus datos de entrenamiento y en fuentes indexadas en tiempo real. Si tu marca no aparece, se debe a una falta de densidad de entidades, ausencia en fuentes de alta autoridad (medios, foros técnicos) o a la carencia de datos estructurados legibles para máquinas en tu propio sitio web.',
  },
]

export default function LandingPage() {
  return (
    <div className="bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-16 sm:pt-24 pb-12 sm:pb-20">
        <p className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest mb-5">
          Generative Engine Optimization · Share of Model
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-3xl mb-6">
          ¿Te menciona la IA<br className="hidden sm:block" /> cuando alguien busca{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
            lo que tú vendes?
          </span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed">
          Mide tu <strong className="text-slate-200">Share of Model</strong> en ChatGPT, Perplexity y Gemini.
          Detecta quién te está quitando clientes en la era generativa y ejecuta tácticas GEO en días.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto">
          <Link
            href="/auditar"
            className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-colors text-center"
          >
            Auditar mi marca gratis →
          </Link>
          <Link
            href="/glosario"
            className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-base transition-colors text-center"
          >
            Glosario de GEO
          </Link>
        </div>

        {/* Social proof strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-slate-600 text-xs font-mono">
          <span>ChatGPT · GPT-4o</span>
          <span className="text-slate-800">·</span>
          <span>Perplexity AI</span>
          <span className="text-slate-800">·</span>
          <span>Google Gemini</span>
          <span className="text-slate-800">·</span>
          <span>Claude Anthropic</span>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest mb-3">Qué incluye el informe</p>
            <h2 className="text-2xl font-bold text-white">Todo lo que necesitas para dominar los LLMs</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-slate-900 border border-slate-800 rounded-sm p-6 hover:border-indigo-500/30 transition-colors"
              >
                <span className="text-indigo-400 text-xl block mb-3 font-mono">{f.icon}</span>
                <h3 className="text-sm font-semibold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/auditar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              Ver informe completo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq-geo" className="border-t border-slate-800/60 py-12 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest mb-3">Preguntas Frecuentes</p>
            <h2 className="text-xl font-semibold text-slate-100 leading-snug">AI Visibility &amp; Generative Engine Optimization</h2>
            <p className="text-slate-600 text-sm mt-2">Conceptos clave para entender cómo los LLMs construyen reputación de marca.</p>
          </div>
          <FaqAccordionServer items={faqItems} />
        </div>
      </section>

    </div>
  )
}
