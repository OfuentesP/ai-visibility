import Link from 'next/link'
import { Check, X, Minus, Search, Users, PieChart, Terminal } from 'lucide-react'
import { FaqAccordionServer } from '@/components/FaqAccordionServer'

export const metadata = {
  title: 'Ai Visibility | Plataforma de Optimización para Motores Generativos (GEO)',
  description: 'Mide y optimiza el Share of Model (SoM) de tu marca en ChatGPT, Gemini y Perplexity. La plataforma líder en Generative Engine Optimization en Chile.',
  keywords: ['Generative Engine Optimization', 'GEO', 'Share of Model', 'Auditoría iA', 'AI Readiness Score', 'ChatGPT SEO'],
  alternates: {
    canonical: 'https://ai-visibility.cl',
    languages: { 'es': 'https://ai-visibility.cl', 'es-CL': 'https://ai-visibility.cl' },
  },
  openGraph: {
    title: 'Ai Visibility | Auditoría de Visibilidad en Inteligencia Artificial',
    description: 'Descubre qué dicen los modelos de lenguaje sobre tu marca y obtén tu plan de recuperación GEO.',
    url: 'https://ai-visibility.cl',
    siteName: 'Ai Visibility',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ai Visibility | GEO & Share of Model Platform',
    description: 'Descubre qué dicen los modelos de lenguaje sobre tu marca y obtén tu plan de recuperación GEO.',
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://ai-visibility.cl/#software",
      "name": "Ai Visibility Auditor",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web browser",
      "publisher": { "@id": "https://ai-visibility.cl/#organization" },
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CLP" }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "¿Qué es Generative Engine Optimization (GEO)?", "acceptedAnswer": { "@type": "Answer", "text": "Generative Engine Optimization (GEO) es el proceso técnico y estratégico de optimizar la presencia de una marca para que sea recomendada por modelos de lenguaje de gran escala (LLMs) y motores de respuesta generativa, como ChatGPT, Perplexity, Claude y Gemini. A diferencia del SEO, GEO se enfoca en entidades, contexto semántico y recuperación de información (RAG)." } },
        { "@type": "Question", "name": "¿Cuál es la diferencia entre SEO y GEO?", "acceptedAnswer": { "@type": "Answer", "text": "El SEO tradicional busca posicionar enlaces en una lista de resultados de Google. El GEO posiciona tu marca como la respuesta definitiva dentro de un texto conversacional generado por iA, donde no hay listas de enlaces, sino una única recomendación directa." } },
        { "@type": "Question", "name": "¿Qué es el Share of Model (SoM)?", "acceptedAnswer": { "@type": "Answer", "text": "El Share of Model (SoM) es la métrica de nueva generación que reemplaza al Share of Voice. Representa el porcentaje exacto de veces que un modelo de iA cita a tu marca frente a tus competidores directos cuando se le pregunta sobre tu industria." } },
        { "@type": "Question", "name": "¿Por qué mi marca no aparece en ChatGPT o Perplexity?", "acceptedAnswer": { "@type": "Answer", "text": "Si tu marca no aparece en LLMs se debe a falta de densidad de entidades, ausencia en fuentes de alta autoridad o carencia de datos estructurados legibles para máquinas en tu sitio web." } },
        { "@type": "Question", "name": "¿Cómo evalúa Ai Visibility mi presencia en la iA?", "acceptedAnswer": { "@type": "Answer", "text": "Ai Visibility realiza auditorías automatizadas simulando las consultas que harían tus clientes ideales. Extrae métricas clave: si tu marca es mencionada, análisis de sentimiento, porcentaje de visibilidad y qué competidor domina las respuestas." } },
        { "@type": "Question", "name": "¿Pueden garantizar que apareceré siempre como la marca #1?", "acceptedAnswer": { "@type": "Answer", "text": "No, y desconfía de quien lo prometa. Los LLMs son probabilísticos. Lo que garantizamos es una metodología técnica que aumenta tu densidad de entidad y tus probabilidades matemáticas de ser recomendado." } },
        { "@type": "Question", "name": "¿Cuánto tiempo tarda en hacer efecto la optimización GEO?", "acceptedAnswer": { "@type": "Answer", "text": "La inyección de JSON-LD es legible por la iA en 48 horas. Para que los modelos ajusten sus respuestas RAG, suele tomar entre 3 y 6 semanas ver un aumento sostenido." } },
        { "@type": "Question", "name": "¿Por qué la auditoría Beta se centra en ChatGPT?", "acceptedAnswer": { "@type": "Answer", "text": "Porque concentra más del 80% de las consultas generativas B2B y B2C en Chile. Priorizamos dominar el motor principal. Además, optimizar para OpenAI mejora automáticamente tu legibilidad para Gemini, que está en nuestra hoja de ruta." } }
      ]
    }
  ]
}

const features = [
  {
    icon: '◉',
    title: 'AI Readiness Score (0–100)',
    desc: 'Un puntaje y un estado: Riesgo Crítico, En Riesgo o Visible. La métrica que llevas al directorio.',
  },
  {
    icon: '◈',
    title: 'Cómo te cita ChatGPT',
    desc: 'Tu posición exacta, el sentimiento de la mención (positivo, neutral o riesgo de alucinación) y la marca ganadora que recomienda en tu lugar.',
  },
  {
    icon: '△',
    title: 'Brecha semántica',
    desc: 'Los conceptos y temas que la iA asocia a tu competencia y no a ti. La hoja de ruta de contenido que sí tienes que crear.',
  },
  {
    icon: '▶',
    title: 'Plan ICE con ejecutor',
    desc: 'Acciones priorizadas por Impacto, Confianza y Esfuerzo. Cada una con quién la ejecuta (TI, marketing, agencia) + JSON-LD listo para copiar.',
  },
]

const faqConceptos = [
  {
    q: '¿Qué es Generative Engine Optimization (GEO)?',
    a: 'Generative Engine Optimization (GEO) es el proceso técnico y estratégico de optimizar la presencia de una marca para que sea recomendada por modelos de lenguaje de gran escala (LLMs) y motores de respuesta generativa, como ChatGPT, Perplexity, Claude y Gemini. A diferencia del SEO, GEO se enfoca en entidades, contexto semántico y recuperación de información (RAG).',
  },
  {
    q: '¿Cuál es la diferencia entre SEO y GEO?',
    a: 'El SEO tradicional busca posicionar enlaces en una lista de resultados de Google basándose en palabras clave. El GEO busca posicionar tu marca como la "respuesta definitiva" dentro de un texto conversacional generado por iA, donde no hay listas de enlaces, sino una única recomendación directa.',
  },
  {
    q: '¿Qué es el Share of Model (SoM)?',
    a: 'El Share of Model (SoM) es la métrica de nueva generación que reemplaza al "Share of Voice". Representa el porcentaje exacto de veces que un modelo de iA cita a tu marca en comparación con tus competidores directos cuando se le pregunta sobre tu industria, productos o servicios.',
  },
  {
    q: '¿Por qué mi marca no aparece en ChatGPT o Perplexity?',
    a: 'Los LLMs construyen sus respuestas basándose en sus datos de entrenamiento y en fuentes indexadas en tiempo real. Si tu marca no aparece, se debe a falta de densidad de entidades, ausencia en fuentes de alta autoridad (medios, foros técnicos) o carencia de datos estructurados legibles para máquinas en tu propio sitio web.',
  },
]

const faqEstrategia = [
  {
    q: '¿Cómo evalúa Ai Visibility mi presencia en la iA?',
    a: 'Ai Visibility realiza auditorías automatizadas simulando las consultas que harían tus clientes ideales. La plataforma consulta a los principales LLMs en tiempo real y extrae métricas clave: si tu marca es mencionada, el análisis de sentimiento, tu porcentaje de visibilidad y qué competidor está dominando las respuestas.',
  },
  {
    q: '¿Pueden garantizar que apareceré siempre como la marca #1?',
    a: 'No, y desconfía de quien lo prometa. Los LLMs son probabilísticos. Lo que garantizamos es una metodología técnica que aumenta tu densidad de entidad y tus probabilidades matemáticas de ser recomendado: desde JSON-LD hasta PR en medios que la iA indexa como fuentes de autoridad.',
  },
  {
    q: '¿Cuánto tiempo tarda en hacer efecto la optimización GEO?',
    a: 'La inyección de JSON-LD es legible por la iA en 48 horas. Para que los modelos ajusten sus respuestas de recuperación (RAG), suele tomar entre 3 y 6 semanas ver un aumento sostenido. El Digital PR en medios autorizados puede impactar Perplexity en 24–48 horas.',
  },
  {
    q: '¿Por qué la auditoría Beta se centra en ChatGPT?',
    a: 'Porque concentra más del 80% de las consultas generativas B2B y B2C en Chile. Priorizamos dominar el motor principal antes de diluir esfuerzos. Además, optimizar tu JSON-LD para OpenAI mejora automáticamente tu legibilidad para Gemini, que está en nuestra hoja de ruta.',
  },
]

export default function LandingPage() {
  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-16 sm:pt-24 pb-12 sm:pb-20">
        <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-5">
          Generative Engine Optimization · Share of Model
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight max-w-3xl mb-6">
          ¿Te menciona la iA<br className="hidden sm:block" /> cuando alguien busca{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            lo que tú vendes?
          </span>
        </h1>
        <p className="hidden sm:block text-slate-700 text-lg max-w-xl mb-10 leading-relaxed">
          Mide tu <strong className="text-slate-900">Share of Model</strong> en ChatGPT, Perplexity y Gemini.
          Detecta quién te está quitando clientes en la era generativa y ejecuta tácticas GEO en días.
        </p>
        <p className="sm:hidden text-slate-700 text-base max-w-xl mb-10 leading-relaxed px-2">
          Mide tu <strong className="text-slate-900">Share of Model</strong> en ChatGPT, Perplexity y Gemini. Descubre quién te está quitando clientes.
        </p>
        <div className="flex justify-center w-full">
          <Link
            href="#planes"
            className="w-full sm:w-auto px-10 py-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all text-center"
          >
            Auditar mi marca →
          </Link>
        </div>

        {/* Social proof strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs">
          <span>ChatGPT · GPT-4o</span>
          <span className="text-slate-800">·</span>
          <span>Perplexity AI</span>
          <span className="text-slate-800">·</span>
          <span>Google Gemini</span>
          <span className="text-slate-800">·</span>
          <span>Claude Anthropic</span>
        </div>
      </section>

      {/* ── FOMO ──────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-xs sm:text-[11px] text-rose-600 uppercase tracking-widest mb-4">El punto ciego de tu estrategia</p>
              <h2 className="hidden sm:block text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-5">
                Mientras mejoras tu landing,{' '}
                <span className="text-slate-700 font-normal">ChatGPT y Gemini ya le recomendaron otra marca a tu cliente.</span>
              </h2>
              <h2 className="sm:hidden text-2xl font-extrabold text-slate-900 leading-tight mb-5">
                ChatGPT y Gemini ya le recomendaron otra marca a tu cliente.
              </h2>
              <p className="text-slate-700 text-base leading-relaxed mb-8">
                La iA sintetiza <strong className="text-slate-900">una sola respuesta</strong>. Si tu marca no está en esa síntesis, no entras al proceso de decisión — ni siquiera para perderlo.
              </p>
              <Link href="#planes" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all">
                Ver cómo me cita ChatGPT y Gemini →
              </Link>
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-sm p-5">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-7 h-7 rounded-sm bg-slate-100 border border-slate-300 flex items-center justify-center flex-shrink-0 text-xs">👤</div>
                <div className="bg-slate-100 rounded-sm px-4 py-3 text-slate-700 text-sm leading-relaxed">
                  ¿Cuál es el mejor proveedor de impresoras 3D y toners para empresas en Santiago?
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-sm bg-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">iA</div>
                <div className="bg-white border border-slate-200 rounded-sm px-4 py-4 w-full text-sm">
                  <p className="text-slate-500 mb-3 leading-relaxed">Basado en reseñas y autoridad técnica, las mejores opciones en Santiago son:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-emerald-800 font-medium bg-emerald-50 px-3 py-2 rounded-md border border-emerald-200 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />Toner Chile — Recomendado
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 px-3 py-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />3D Studio Santiago
                    </li>
                  </ul>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2">
                    <span className="text-rose-600 flex-shrink-0 text-sm mt-0.5">⚠</span>
                    <p className="text-rose-900 text-sm sm:text-xs leading-relaxed"><strong>Tu marca no fue mencionada.</strong> El tráfico se fue 100% a la competencia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ───────────────────────────────────────────── */}
      <section className="border-t border-slate-200/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">Cómo trabajamos</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">No es magia. Es ingeniería inversa.</h2>
            <p className="hidden sm:block text-slate-600 text-base max-w-xl mx-auto leading-relaxed">4 pasos auditables para ir del diagnóstico al código que la iA lee.</p>
            <p className="sm:hidden text-slate-600 text-base max-w-xl mx-auto leading-relaxed">4 pasos del diagnóstico al código.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-11 top-8 bottom-8 w-px bg-slate-200" />
            <div className="space-y-6">
              {[
                { n: '01', icon: <Search size={18} className="text-slate-600" />, title: 'Mapeamos tu mercado', desc: 'Identificamos las preguntas reales que tus clientes le hacen a la iA sobre tu categoría.', highlight: false },
                { n: '02', icon: <Users size={18} className="text-indigo-600" />, title: 'Te auditamos en ChatGPT, Perplexity y Gemini', desc: 'Simulamos a tus compradores reales para ver qué dice cada motor cuando preguntan por lo que tú vendes.', highlight: true },
                { n: '03', icon: <PieChart size={18} className="text-slate-600" />, title: 'Te mostramos quién se lleva tu venta', desc: 'Recibes tu Share of Model real, el sentimiento de marca y el competidor exacto que la iA recomienda en tu lugar.', highlight: false },
                { n: '04', icon: <Terminal size={18} className="text-emerald-700" />, title: 'Te entregamos qué tocar primero', desc: 'Plan priorizado por ICE + código JSON-LD listo para copiar y pegar. Tu equipo de TI lo implementa el mismo día.', highlight: false },
              ].map((step) => (
                <div key={step.n} className="relative flex flex-col md:flex-row gap-5 md:gap-6 items-start">
                  <div className={`relative z-10 w-[88px] h-[88px] rounded-md flex flex-col items-center justify-center shrink-0 border ${step.highlight ? 'bg-indigo-50 border-indigo-300' : 'bg-white shadow-sm border-slate-200'}`}>
                    {step.icon}
                    <span className={`mt-1.5 text-xs sm:text-[10px] font-bold tracking-widest ${step.highlight ? 'text-indigo-700' : 'text-slate-500'}`}>{step.n}</span>
                  </div>
                  <div className={`flex-1 p-6 rounded-md border transition-all ${step.highlight ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white shadow-sm border-slate-200 hover:shadow-md'}`}>
                    {step.highlight && <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs sm:text-[10px] font-bold uppercase tracking-wider rounded mb-2">Nuestro core</span>}
                    <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="border-t border-slate-200/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">Qué te llevas</p>
            <h2 className="hidden sm:block text-2xl sm:text-3xl font-extrabold text-slate-900">Un informe que tu equipo puede ejecutar mañana</h2>
            <h2 className="sm:hidden text-2xl font-extrabold text-slate-900">Un informe que se ejecuta</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white shadow-sm border border-slate-200 rounded-md p-6 hover:shadow-md transition-shadow">
                <span className="text-indigo-600 text-2xl block mb-4 leading-none">{f.icon}</span>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 leading-snug">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="#planes" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all">
              Quiero mi informe →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIAGNÓSTICO ───────────────────────────────────────────── */}
      <section className="border-t border-slate-200/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">Ejemplo de diagnóstico real</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Lo que tu informe revela — con precisión quirúrgica</h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
              No decimos "mejora tu presencia digital". Te decimos exactamente qué fuente de datos le falta a la iA para recomendarte.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mb-6">
            {[
              {
                badge: 'Foros y comunidades',
                badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
                title: 'Sin menciones en Reddit Chile ni Reclamos.cl',
                desc: 'Perplexity valida la confianza de una marca usando foros y reviews de usuarios reales. Sin menciones en estas fuentes, la iA no tiene evidencia social para recomendarte.',
                icon: '⚠',
                iconColor: 'text-amber-400',
              },
              {
                badge: 'Datos estructurados',
                badgeColor: 'text-rose-600 bg-rose-400/10 border-rose-400/20',
                title: 'Sin Schema JSON-LD en tu homepage',
                desc: 'ChatGPT extrae datos estructurados de tu sitio para describir tu negocio. Sin JSON-LD, la iA infiere quién eres desde fuentes de terceros — y puede equivocarse.',
                icon: '✗',
                iconColor: 'text-rose-600',
              },
              {
                badge: 'Autoridad en medios',
                badgeColor: 'text-rose-600 bg-rose-400/10 border-rose-400/20',
                title: '0 menciones en medios indexados (90 días)',
                desc: 'Tu competencia aparece citada en La Tercera, Emol y Pulso. La iA usa esas citas como señal de autoridad. Quien no aparece en medios que la iA indexa, no existe para ella.',
                icon: '✗',
                iconColor: 'text-rose-600',
              },
            ].map((card) => (
              <div key={card.title} className="bg-white shadow-sm border border-slate-200 rounded-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${card.badgeColor}`}>{card.badge}</span>
                  <span className={`text-lg font-bold ${card.iconColor}`}>{card.icon}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-slate-500 text-sm sm:text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
          {/* Metadata bar */}
          <div className="border border-slate-200 rounded-sm bg-slate-50/50 px-5 py-3 flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {['14 fuentes analizadas', '3 arquetipos de comprador simulados', 'Tiempo de análisis: 47s', 'Motor: ChatGPT GPT-4o'].map((m) => (
              <span key={m} className="text-slate-500 text-xs sm:text-[11px]">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── GEO vs SEO ────────────────────────────────────────────── */}
      <section className="border-t border-slate-200/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">GEO vs SEO</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
              ¿Por qué el SEO tradicional ya no es suficiente?
            </h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
              Pagar una agencia SEO no garantiza que ChatGPT sepa quién eres. El juego cambió de{' '}
              <span className="text-slate-800 font-semibold">"buscar listas"</span> a{' '}
              <span className="text-slate-800 font-semibold">"recibir respuestas"</span>.
            </p>
          </div>

          <div className="border border-slate-200 rounded-sm overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-2 md:grid-cols-3 border-b border-slate-200 bg-white shadow-sm">
              <div className="p-5 hidden md:block" />
              <div className="p-5 border-b-2 border-indigo-500 bg-indigo-500/5">
                <span className="text-xs sm:text-[10px] text-indigo-600 uppercase tracking-widest block mb-1">Plataforma GEO</span>
                <p className="text-slate-900 font-bold text-sm">Ai Visibility</p>
              </div>
              <div className="p-5 opacity-60">
                <span className="text-xs sm:text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Marketing tradicional</span>
                <p className="text-slate-700 font-bold text-sm">Agencia SEO</p>
              </div>
            </div>

            {/* Rows */}
            {[
              {
                name: 'Métricas de éxito',
                ai: 'Share of Model (SoM) y citas en iA',
                seo: 'Posición en los 10 links de Google',
                xType: 'minus',
              },
              {
                name: 'Motores auditados',
                ai: 'ChatGPT · Gemini próximamente',
                seo: 'Solo Google Search',
                xType: 'minus',
              },
              {
                name: 'Análisis de sentimiento',
                ai: 'Sí — positivo, neutral, alucinación',
                seo: 'No (solo volumen y clics)',
                xType: 'x',
              },
              {
                name: 'Estrategia técnica',
                ai: 'JSON-LD, RAG y densidad de entidad',
                seo: 'Keywords, backlinks y meta tags',
                xType: 'minus',
              },
              {
                name: 'El objetivo final',
                ai: 'Ser la recomendación única de la iA',
                seo: 'Pelear por clics en una lista',
                xType: 'x',
              },
            ].map((row) => (
              <div key={row.name} className="grid grid-cols-2 md:grid-cols-3 border-b border-slate-200/60 last:border-0 hover:bg-slate-100/20 transition-colors">
                <div className="p-4 md:p-5 hidden md:flex items-center border-r border-slate-200/60">
                  <span className="text-slate-700 text-sm font-medium">{row.name}</span>
                </div>
                <div className="p-4 md:p-5 bg-indigo-500/5 flex items-center gap-3 border-r border-slate-200/60">
                  <div className="w-5 h-5 rounded-sm bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-indigo-600" />
                  </div>
                  <span className="text-slate-900 text-sm font-medium">{row.ai}</span>
                </div>
                <div className="p-4 md:p-5 flex items-center gap-3 opacity-60">
                  <div className="w-5 h-5 rounded-sm bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {row.xType === 'x'
                      ? <X size={12} className="text-slate-500" />
                      : <Minus size={12} className="text-slate-500" />
                    }
                  </div>
                  <span className="text-slate-500 text-sm">{row.seo}</span>
                </div>
              </div>
            ))}

            {/* Footer CTA */}
            <div className="bg-white shadow-sm px-5 py-4 text-center border-t border-slate-200">
              <p className="text-slate-500 text-sm mb-2">Protege tu cuota de mercado en ChatGPT hoy.</p>
              <Link href="#planes" className="text-indigo-600 hover:text-indigo-600 text-sm font-medium transition-colors">
                Auditar mi marca en ChatGPT →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section id="planes" className="border-t border-slate-200/60 py-12 sm:py-20 px-4 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">Planes</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Cuatro formas de trabajar con Ai Visibility</h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">Desde un diagnóstico puntual hasta la creación y medición mes a mes. Empieza por donde lo necesites.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">

            {/* 1. Diagnóstico */}
            <div className="bg-white shadow-sm border-2 border-indigo-500/50 rounded-sm p-6 relative flex flex-col">
              <span className="absolute -top-3 left-5 bg-indigo-600 text-white text-xs sm:text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">Disponible ahora</span>
              <p className="text-xs sm:text-[10px] text-indigo-600 uppercase tracking-widest mb-2">01 · Diagnóstico</p>
              <p className="text-3xl font-extrabold text-slate-900 mb-1">$190.000</p>
              <p className="text-slate-500 text-xs mb-5">CLP · pago único</p>
              <p className="text-slate-700 text-sm mb-5 leading-relaxed">
                La radiografía de cómo te ve la iA hoy frente a tu competencia. Punto de partida con datos, no opiniones.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Share of Model vs competidores',
                  'Plan de acción con tácticas ICE',
                  'Código JSON-LD listo para copiar',
                  'Análisis de sentimiento',
                  'Informe compartible',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700 text-sm">
                    <Check size={14} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/56997065555?text=Hola%2C%20me%20interesa%20el%20Diagn%C3%B3stico%20de%20Ai%20Visibility"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-5 py-3 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
              >
                Empezar diagnóstico →
              </a>
            </div>

            {/* 2. Asesoría */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-sm p-6 flex flex-col">
              <p className="text-xs sm:text-[10px] text-slate-500 uppercase tracking-widest mb-2">02 · Asesoría</p>
              <p className="text-3xl font-extrabold text-slate-900 mb-1">$290.000</p>
              <p className="text-slate-500 text-xs mb-5">CLP · pago único</p>
              <p className="text-slate-700 text-sm mb-5 leading-relaxed">
                Una sesión con tu equipo para definir qué contenido crear, cómo y en qué orden. Sales con un plan, no con apuntes.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Diagnóstico previo incluido',
                  'Sesión 1:1 con tu equipo (90 min)',
                  'Roadmap de prioridades de contenido',
                  'Recomendaciones por canal y motor',
                  'Reporte ejecutivo descargable',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700 text-sm">
                    <Check size={14} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/56997065555?text=Hola%2C%20me%20interesa%20la%20Asesor%C3%ADa%20de%20Ai%20Visibility"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-5 py-3 rounded-sm bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-900 font-semibold text-sm transition-colors"
              >
                Conversemos →
              </a>
            </div>

            {/* 3. Capacitación */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-sm p-6 flex flex-col">
              <p className="text-xs sm:text-[10px] text-slate-500 uppercase tracking-widest mb-2">03 · Capacitación</p>
              <p className="text-3xl font-extrabold text-slate-900 mb-1">$490.000</p>
              <p className="text-slate-500 text-xs mb-5">CLP · programa de 3 clases</p>
              <p className="text-slate-700 text-sm mb-5 leading-relaxed">
                Tu equipo interno aprende a crear contenido que la iA recomiende — sin depender de una agencia externa cada mes.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Diagnóstico inicial incluido',
                  '3 sesiones en vivo (90 min c/u)',
                  'Crear contenido que la iA cite',
                  'Estructura técnica para que la iA lea',
                  'Material y grabaciones descargables',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700 text-sm">
                    <Check size={14} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/56997065555?text=Hola%2C%20me%20interesa%20la%20Capacitaci%C3%B3n%20de%20Ai%20Visibility"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-5 py-3 rounded-sm bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-900 font-semibold text-sm transition-colors"
              >
                Reservar cupos →
              </a>
            </div>

            {/* 4. Plan Mensual */}
            <div className="bg-white shadow-sm border-2 border-violet-500/50 rounded-sm p-6 relative flex flex-col">
              <span className="absolute -top-3 left-5 bg-violet-600 text-white text-xs sm:text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">Más completo</span>
              <p className="text-xs sm:text-[10px] text-violet-700 uppercase tracking-widest mb-2">04 · Plan Mensual</p>
              <p className="text-3xl font-extrabold text-slate-900 mb-1">$690.000</p>
              <p className="text-slate-500 text-xs mb-5">CLP · por mes</p>
              <p className="text-slate-700 text-sm mb-5 leading-relaxed">
                Trabajamos junto a tu equipo todos los meses: objetivos, contenidos y medición. La forma sostenida de mover tu Share of Model.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Diagnóstico inicial incluido',
                  'Definición de objetivos mensuales',
                  'Creación de contenidos mensuales',
                  'Implementación técnica continua',
                  'Reporte y reunión de avances mensual',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700 text-sm">
                    <Check size={14} className="text-violet-700 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/56997065555?text=Hola%2C%20me%20interesa%20el%20Plan%20Mensual%20de%20Ai%20Visibility"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-5 py-3 rounded-sm bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors"
              >
                Conversemos →
              </a>
            </div>

          </div>
          <p className="text-slate-500 text-xs sm:text-[11px] text-center mt-8">
            Valores referenciales en CLP
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq-geo" className="border-t border-slate-200/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">Preguntas Frecuentes</p>
            <h2 className="text-2xl font-bold text-slate-900">Todo lo que necesitas saber sobre GEO</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <p className="text-xs sm:text-[10px] text-slate-500 uppercase tracking-widest mb-5">Conceptos clave</p>
              <FaqAccordionServer items={faqConceptos} />
            </div>
            <div>
              <p className="text-xs sm:text-[10px] text-slate-500 uppercase tracking-widest mb-5">Estrategia y resultados</p>
              <FaqAccordionServer items={faqEstrategia} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA CIERRE ────────────────────────────────────────────── */}
      <section className="border-t border-slate-200/60 py-16 sm:py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-5">Última llamada</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-5">
            Tu competencia ya está optimizando para la iA.
          </h2>
          <p className="hidden sm:block text-slate-700 text-base leading-relaxed mb-10">
            Cada día que la iA recomienda a otro, es un cliente que no llegó a ti. Empieza con un diagnóstico claro de dónde estás hoy.
          </p>
          <p className="sm:hidden text-slate-700 text-base leading-relaxed mb-10">
            Cada día que la iA recomienda a otro, es un cliente que no llegó a ti.
          </p>
          <Link
            href="#planes"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
          >
            Auditar mi marca ahora →
          </Link>
          <p className="text-slate-500 text-sm sm:text-xs mt-5">Diagnóstico $190.000 CLP · Resultado en menos de 60 segundos</p>
        </div>
      </section>

    </div>
  )
}
