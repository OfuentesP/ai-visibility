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
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
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
    title: 'AI Readiness Score',
    desc: 'Puntaje 0–100 que mide cuán preparada está tu marca para ser recomendada por LLMs. Riesgo Crítico, En Riesgo o Visible.',
  },
  {
    icon: '△',
    title: 'Brecha Semántica',
    desc: 'Detecta los conceptos y entidades que la iA asocia a tus competidores pero no a ti. Son exactamente los temas que debes crear.',
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
          ¿Te menciona la iA<br className="hidden sm:block" /> cuando alguien busca{' '}
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
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-slate-400 text-xs font-mono">
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
      <section className="border-t border-slate-800/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-[11px] font-mono text-rose-400 uppercase tracking-widest mb-4">El punto ciego de tu estrategia</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-5">
                Miles de chilenos usan ChatGPT para decidir qué comprar.{' '}
                <span className="text-slate-400 font-normal">Si no estás en la respuesta, tu competencia se lleva la venta.</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                El SEO optimiza para una lista de 10 links. La iA genera <strong className="text-slate-200">una sola respuesta sintetizada</strong>. O apareces en esa síntesis, o literalmente no existes.
              </p>
              <div className="space-y-5 mb-9">
                {[
                  { n: '1', title: 'Lo que preguntan cuando no miras', desc: '"¿Cuál es el mejor software de RRHH en Chile?" o "Compara [Tu Marca] con [Competencia]".' },
                  { n: '2', title: 'El costo de la invisibilidad', desc: 'Si la iA no tiene datos estructurados de tu web para validar tu autoridad, le entrega la venta al competidor que sí los tenga.' },
                ].map((item) => (
                  <div key={item.n} className="flex gap-4">
                    <div className="w-7 h-7 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-slate-400 text-xs font-bold font-mono">{item.n}</span>
                    </div>
                    <div>
                      <p className="text-slate-200 text-sm font-semibold mb-1">{item.title}</p>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/auditar" className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors">
                Descubrir si mi marca aparece →
              </Link>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-sm p-5">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-7 h-7 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-xs">👤</div>
                <div className="bg-slate-800 rounded-sm px-4 py-3 text-slate-300 text-sm leading-relaxed">
                  ¿Cuál es el mejor proveedor de impresoras 3D y toners para empresas en Santiago?
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-sm bg-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">iA</div>
                <div className="bg-slate-950 border border-slate-800 rounded-sm px-4 py-4 w-full text-sm">
                  <p className="text-slate-400 mb-3 leading-relaxed">Basado en reseñas y autoridad técnica, las mejores opciones en Santiago son:</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-emerald-400 font-medium bg-emerald-400/10 px-3 py-2 rounded-sm border border-emerald-400/20 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />Toner Chile — Recomendado
                    </li>
                    <li className="flex items-center gap-2 text-slate-400 px-3 py-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0" />3D Studio Santiago
                    </li>
                  </ul>
                  <div className="p-3 bg-rose-950/40 border border-rose-900/40 rounded-sm flex items-start gap-2">
                    <span className="text-rose-500 flex-shrink-0 text-xs mt-0.5">⚠</span>
                    <p className="text-rose-300/90 text-xs leading-relaxed"><strong>Tu marca no fue mencionada.</strong> El tráfico de esta consulta fue derivado 100% a la competencia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ───────────────────────────────────────────── */}
      <section className="border-t border-slate-800/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest mb-3">Nuestra metodología</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">No es magia. Es ingeniería inversa.</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">De la pregunta del usuario a la inserción de tu código técnico, en 4 pasos auditables.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-11 top-0 bottom-0 w-px bg-slate-800/60" />
            <div className="space-y-8">
              {[
                { n: '01', icon: <Search size={18} className="text-slate-400" />, title: 'Mapeo del ecosistema', desc: 'Ingresas tu dominio o nombre de marca y nuestro motor perfila el entorno competitivo y las intenciones de búsqueda de tu industria. Sin configuraciones complejas.', highlight: false },
                { n: '02', icon: <Users size={18} className="text-indigo-400" />, title: 'Auditoría con usuarios sintéticos', desc: 'Desplegamos múltiples agentes sintéticos que simulan perfiles de compradores reales — exploración, comparación, decisión — para auditar cómo ChatGPT responde a cada contexto.', highlight: true },
                { n: '03', icon: <PieChart size={18} className="text-slate-400" />, title: 'Diagnóstico de posicionamiento', desc: 'Procesamos las respuestas crudas de los LLMs y te revelamos tu Share of Model real: sentimiento de marca, con quién te comparan y qué competidor se está llevando tu tráfico.', highlight: false },
                { n: '04', icon: <Terminal size={18} className="text-emerald-400" />, title: 'Hoja de ruta de recuperación GEO', desc: 'Pasamos del diagnóstico a la ejecución. Un plan priorizado por ICE que incluye código JSON-LD estructurado listo para que tu equipo de TI lo copie y pegue.', highlight: false },
              ].map((step) => (
                <div key={step.n} className="relative flex flex-col md:flex-row gap-6 items-start">
                  <div className={`relative z-10 w-[88px] h-[88px] rounded-sm flex flex-col items-center justify-center shrink-0 border ${step.highlight ? 'bg-indigo-950/40 border-indigo-500/30' : 'bg-slate-900 border-slate-800'}`}>
                    {step.icon}
                    <span className={`mt-1.5 font-mono text-[10px] font-bold tracking-widest ${step.highlight ? 'text-indigo-400' : 'text-slate-500'}`}>{step.n}</span>
                  </div>
                  <div className={`flex-1 p-6 rounded-sm border ${step.highlight ? 'bg-indigo-950/20 border-indigo-900/40' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/60 transition-colors'}`}>
                    {step.highlight && <span className="inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-sm mb-2">Tecnología exclusiva</span>}
                    <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-sm p-6 hover:border-indigo-500/30 transition-colors">
                <span className="text-indigo-400 text-xl block mb-3 font-mono">{f.icon}</span>
                <h3 className="text-sm font-semibold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/auditar" className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">
              Obtener mi informe GEO →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIAGNÓSTICO ───────────────────────────────────────────── */}
      <section className="border-t border-slate-800/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest mb-3">Ejemplo de diagnóstico real</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Lo que tu informe revela — con precisión quirúrgica</h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
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
                badgeColor: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
                title: 'Sin Schema JSON-LD en tu homepage',
                desc: 'ChatGPT extrae datos estructurados de tu sitio para describir tu negocio. Sin JSON-LD, la iA infiere quién eres desde fuentes de terceros — y puede equivocarse.',
                icon: '✗',
                iconColor: 'text-rose-400',
              },
              {
                badge: 'Autoridad en medios',
                badgeColor: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
                title: '0 menciones en medios indexados (90 días)',
                desc: 'Tu competencia aparece citada en La Tercera, Emol y Pulso. La iA usa esas citas como señal de autoridad. Quien no aparece en medios que la iA indexa, no existe para ella.',
                icon: '✗',
                iconColor: 'text-rose-400',
              },
            ].map((card) => (
              <div key={card.title} className="bg-slate-900 border border-slate-800 rounded-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${card.badgeColor}`}>{card.badge}</span>
                  <span className={`text-lg font-bold ${card.iconColor}`}>{card.icon}</span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{card.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
          {/* Metadata bar */}
          <div className="border border-slate-800 rounded-sm bg-slate-900/50 px-5 py-3 flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {['14 fuentes analizadas', '3 arquetipos de comprador simulados', 'Tiempo de análisis: 47s', 'Motor: ChatGPT GPT-4o'].map((m) => (
              <span key={m} className="text-slate-500 text-[11px] font-mono">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── GEO vs SEO ────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest mb-3">GEO vs SEO</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              ¿Por qué el SEO tradicional ya no es suficiente?
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              Pagar una agencia SEO no garantiza que ChatGPT sepa quién eres. El juego cambió de{' '}
              <span className="text-slate-200 font-semibold">"buscar listas"</span> a{' '}
              <span className="text-slate-200 font-semibold">"recibir respuestas"</span>.
            </p>
          </div>

          <div className="border border-slate-800 rounded-sm overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-2 md:grid-cols-3 border-b border-slate-800 bg-slate-900">
              <div className="p-5 hidden md:block" />
              <div className="p-5 border-b-2 border-indigo-500 bg-indigo-500/5">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block mb-1">Plataforma GEO</span>
                <p className="text-white font-bold text-sm">Ai Visibility</p>
              </div>
              <div className="p-5 opacity-60">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1">Marketing tradicional</span>
                <p className="text-slate-300 font-bold text-sm">Agencia SEO</p>
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
              <div key={row.name} className="grid grid-cols-2 md:grid-cols-3 border-b border-slate-800/60 last:border-0 hover:bg-slate-800/20 transition-colors">
                <div className="p-4 md:p-5 hidden md:flex items-center border-r border-slate-800/60">
                  <span className="text-slate-300 text-sm font-medium">{row.name}</span>
                </div>
                <div className="p-4 md:p-5 bg-indigo-500/5 flex items-center gap-3 border-r border-slate-800/60">
                  <div className="w-5 h-5 rounded-sm bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-indigo-400" />
                  </div>
                  <span className="text-white text-sm font-medium">{row.ai}</span>
                </div>
                <div className="p-4 md:p-5 flex items-center gap-3 opacity-60">
                  <div className="w-5 h-5 rounded-sm bg-slate-800 flex items-center justify-center flex-shrink-0">
                    {row.xType === 'x'
                      ? <X size={12} className="text-slate-500" />
                      : <Minus size={12} className="text-slate-500" />
                    }
                  </div>
                  <span className="text-slate-400 text-sm">{row.seo}</span>
                </div>
              </div>
            ))}

            {/* Footer CTA */}
            <div className="bg-slate-900 px-5 py-4 text-center border-t border-slate-800">
              <p className="text-slate-500 text-sm mb-2">Protege tu cuota de mercado en ChatGPT hoy.</p>
              <Link href="/auditar" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                Auditar mi marca en ChatGPT →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest mb-3">Precio</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Gratis durante el Beta</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">Sin tarjeta de crédito. Sin configuración. Tu primer diagnóstico GEO en menos de 60 segundos.</p>
          </div>
          <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-5 pt-4">
            {/* Beta free */}
            <div className="bg-slate-900 border-2 border-indigo-500/50 rounded-sm p-7 relative">
              <span className="absolute -top-3 left-5 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm">Disponible ahora</span>
              <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-2">Beta gratuito</p>
              <p className="text-4xl font-extrabold text-white mb-1">$0</p>
              <p className="text-slate-500 text-xs mb-6">2 auditorías completas por email</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Share of Model vs competidores',
                  'Plan de acción con tácticas ICE',
                  'Código JSON-LD listo para copiar',
                  'Análisis de sentimiento de marca',
                  'Informe compartible en 1 clic',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                    <Check size={14} className="text-indigo-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auditar" className="block w-full text-center px-5 py-3 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors">
                Auditar mi marca gratis →
              </Link>
            </div>
            {/* Pro coming soon */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-sm p-7 opacity-70">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Pro</p>
              <p className="text-4xl font-extrabold text-slate-400 mb-1">Pronto</p>
              <p className="text-slate-400 text-xs mb-6">Auditorías ilimitadas + monitoreo continuo</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Todo lo del plan Beta',
                  'Auditorías ilimitadas',
                  'Alertas semanales de posición',
                  'Comparación multi-competidor',
                  'API access',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-500 text-sm">
                    <Minus size={14} className="text-slate-700 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="block w-full text-center px-5 py-3 rounded-sm bg-slate-800 text-slate-400 font-semibold text-sm cursor-not-allowed">
                Próximamente
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq-geo" className="border-t border-slate-800/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest mb-3">Preguntas Frecuentes</p>
            <h2 className="text-2xl font-bold text-white">Todo lo que necesitas saber sobre GEO</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-5">Conceptos clave</p>
              <FaqAccordionServer items={faqConceptos} />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-5">Estrategia y resultados</p>
              <FaqAccordionServer items={faqEstrategia} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA CIERRE ────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/60 py-16 sm:py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest mb-5">Última llamada</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-5">
            Tu competencia ya está optimizando para la iA.
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-10">
            Cada día que la iA recomienda a otro, es un cliente que no llegó a ti. Audita tu marca en 60 segundos — gratis durante el Beta.
          </p>
          <Link
            href="/auditar"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-colors"
          >
            Auditar mi marca ahora →
          </Link>
          <p className="text-slate-500 text-xs font-mono mt-5">Sin tarjeta de crédito · 2 auditorías gratis · Resultado en &lt;60s</p>
        </div>
      </section>

    </div>
  )
}
