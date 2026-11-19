import { Fragment, type ReactNode } from 'react'
import { Check, X, Minus, Search, Users, PieChart, Terminal } from 'lucide-react'
import { FaqAccordionServer } from '@/components/FaqAccordionServer'
// Contenido editable desde /admin (TinaCMS). El diseño vive aquí; los textos en content/home.json.
import home from '../../content/home.json'
import { whatsappUrl } from '@/lib/sitio'

export const metadata = {
  title: 'Ai Visibility | Plataforma de Optimización para Motores Generativos (GEO)',
  description: 'Mide y optimiza el Share of Model (SoM) de tu marca en ChatGPT, Gemini y Perplexity. La plataforma líder en Generative Engine Optimization en Chile.',
  keywords: ['Generative Engine Optimization', 'GEO', 'Share of Model', 'Auditoría Ai', 'AI Readiness Score', 'ChatGPT SEO'],
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

const { hero, puntoCiego, metodologia, entregables, diagnostico, comparativa, planes, faq, cierre } = home

// El JSON-LD de FAQ se genera desde las mismas preguntas visibles, así nunca quedan desalineados.
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
      "mainEntity": faq.grupos.flatMap((g) => g.preguntas).map((p) => ({
        "@type": "Question",
        "name": p.pregunta,
        "acceptedAnswer": { "@type": "Answer", "text": p.respuesta.replace(/\*\*/g, '') },
      })),
    }
  ]
}

/** Convierte **texto** en negrita. Es la única "sintaxis" que el editor necesita conocer. */
function Rich({ text, strongClassName = 'text-slate-900' }: { text: string; strongClassName?: string }): ReactNode {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className={strongClassName}>{part}</strong>
      : <Fragment key={i}>{part}</Fragment>
  )
}

const pasoIconos = [
  <Search key="search" size={18} className="text-slate-600" />,
  <Users key="users" size={18} className="text-indigo-600" />,
  <PieChart key="pie" size={18} className="text-slate-600" />,
  <Terminal key="terminal" size={18} className="text-emerald-700" />,
]

const estilosPlan = {
  principal: {
    card: 'border-2 border-indigo-500/50',
    sello: 'bg-indigo-600',
    etiqueta: 'text-indigo-600',
    check: 'text-indigo-600',
    boton: 'bg-indigo-600 hover:bg-indigo-500 text-white',
  },
  normal: {
    card: 'border border-slate-200',
    sello: 'bg-slate-700',
    etiqueta: 'text-slate-500',
    check: 'text-indigo-600',
    boton: 'bg-slate-100 hover:bg-slate-100 border border-slate-300 text-slate-900',
  },
  premium: {
    card: 'border-2 border-violet-500/50',
    sello: 'bg-violet-600',
    etiqueta: 'text-violet-700',
    check: 'text-violet-700',
    boton: 'bg-violet-600 hover:bg-violet-500 text-white',
  },
} as const

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
          {hero.antetitulo}
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight max-w-3xl mb-6">
          {hero.tituloLinea1}<br className="hidden sm:block" /> {hero.tituloLinea2}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            {hero.tituloDestacado}
          </span>
        </h1>
        <p className="hidden sm:block text-slate-700 text-lg max-w-xl mb-10 leading-relaxed">
          <Rich text={hero.descripcion} />
        </p>
        <p className="sm:hidden text-slate-700 text-base max-w-xl mb-10 leading-relaxed px-2">
          <Rich text={hero.descripcionMovil} />
        </p>
        <div className="flex justify-center w-full">
          <a
            href="/auditar/"
            className="w-full sm:w-auto px-10 py-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all text-center"
          >
            {hero.botonTexto}
          </a>
        </div>

        {/* Social proof strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs">
          {hero.motores.map((m, i) => (
            <Fragment key={m}>
              {i > 0 && <span className="text-slate-800">·</span>}
              <span>{m}</span>
            </Fragment>
          ))}
        </div>
      </section>

      {/* ── FOMO ──────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-xs sm:text-[11px] text-rose-600 uppercase tracking-widest mb-4">{puntoCiego.antetitulo}</p>
              <h2 className="hidden sm:block text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-5">
                {puntoCiego.tituloIntro}{' '}
                <span className="text-slate-700 font-normal">{puntoCiego.titulo}</span>
              </h2>
              <h2 className="sm:hidden text-2xl font-extrabold text-slate-900 leading-tight mb-5">
                {puntoCiego.titulo}
              </h2>
              <p className="text-slate-700 text-base leading-relaxed mb-8">
                <Rich text={puntoCiego.texto} />
              </p>
              <a href="/auditar/" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all">
                {puntoCiego.botonTexto}
              </a>
            </div>
            <div className="bg-white shadow-sm border border-slate-200 rounded-sm p-5">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-7 h-7 rounded-sm bg-slate-100 border border-slate-300 flex items-center justify-center flex-shrink-0 text-xs">👤</div>
                <div className="bg-slate-100 rounded-sm px-4 py-3 text-slate-700 text-sm leading-relaxed">
                  {puntoCiego.ejemploPregunta}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-sm bg-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">Ai</div>
                <div className="bg-white border border-slate-200 rounded-sm px-4 py-4 w-full text-sm">
                  <p className="text-slate-500 mb-3 leading-relaxed">{puntoCiego.ejemploIntro}</p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-emerald-800 font-medium bg-emerald-50 px-3 py-2 rounded-md border border-emerald-200 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 flex-shrink-0" />{puntoCiego.ejemploRecomendado}
                    </li>
                    <li className="flex items-center gap-2 text-slate-600 px-3 py-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />{puntoCiego.ejemploOtro}
                    </li>
                  </ul>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2">
                    <span className="text-rose-600 flex-shrink-0 text-sm mt-0.5">⚠</span>
                    <p className="text-rose-900 text-sm sm:text-xs leading-relaxed"><Rich text={puntoCiego.ejemploAlerta} strongClassName="" /></p>
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
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">{metodologia.antetitulo}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">{metodologia.titulo}</h2>
            <p className="hidden sm:block text-slate-600 text-base max-w-xl mx-auto leading-relaxed">{metodologia.subtitulo}</p>
            <p className="sm:hidden text-slate-600 text-base max-w-xl mx-auto leading-relaxed">{metodologia.subtituloMovil}</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute left-11 top-8 bottom-8 w-px bg-slate-200" />
            <div className="space-y-6">
              {metodologia.pasos.map((step, i) => {
                const n = String(i + 1).padStart(2, '0')
                return (
                  <div key={n} className="relative flex flex-col md:flex-row gap-5 md:gap-6 items-start">
                    <div className={`relative z-10 w-[88px] h-[88px] rounded-md flex flex-col items-center justify-center shrink-0 border ${step.destacado ? 'bg-indigo-50 border-indigo-300' : 'bg-white shadow-sm border-slate-200'}`}>
                      {pasoIconos[i % pasoIconos.length]}
                      <span className={`mt-1.5 text-xs sm:text-[10px] font-bold tracking-widest ${step.destacado ? 'text-indigo-700' : 'text-slate-500'}`}>{n}</span>
                    </div>
                    <div className={`flex-1 p-6 rounded-md border transition-all ${step.destacado ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white shadow-sm border-slate-200 hover:shadow-md'}`}>
                      {step.destacado && <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs sm:text-[10px] font-bold uppercase tracking-wider rounded mb-2">{metodologia.etiquetaDestacado}</span>}
                      <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">{step.titulo}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{step.descripcion}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="border-t border-slate-200/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">{entregables.antetitulo}</p>
            <h2 className="hidden sm:block text-2xl sm:text-3xl font-extrabold text-slate-900">{entregables.titulo}</h2>
            <h2 className="sm:hidden text-2xl font-extrabold text-slate-900">{entregables.tituloMovil}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {entregables.items.map((f) => (
              <div key={f.titulo} className="bg-white shadow-sm border border-slate-200 rounded-md p-6 hover:shadow-md transition-shadow">
                <span className="text-indigo-600 text-2xl block mb-4 leading-none">{f.icono}</span>
                <h3 className="text-sm font-semibold text-slate-900 mb-2 leading-snug">{f.titulo}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.descripcion}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="/auditar/" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all">
              {entregables.botonTexto}
            </a>
          </div>
        </div>
      </section>

      {/* ── DIAGNÓSTICO ───────────────────────────────────────────── */}
      <section className="border-t border-slate-200/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">{diagnostico.antetitulo}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">{diagnostico.titulo}</h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
              {diagnostico.texto}
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mb-6">
            {diagnostico.tarjetas.map((card) => (
              <div key={card.titulo} className="bg-white shadow-sm border border-slate-200 rounded-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border text-rose-700 bg-rose-50 border-rose-200">{card.etiqueta}</span>
                  <span className="text-lg font-bold text-rose-600">{card.icono}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{card.titulo}</h3>
                <p className="text-slate-500 text-sm sm:text-xs leading-relaxed">{card.descripcion}</p>
              </div>
            ))}
          </div>
          {/* Metadata bar */}
          <div className="border border-slate-200 rounded-sm bg-slate-50/50 px-5 py-3 flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {diagnostico.datos.map((m) => (
              <span key={m} className="text-slate-500 text-xs sm:text-[11px]">{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── GEO vs SEO ────────────────────────────────────────────── */}
      <section className="border-t border-slate-200/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">{comparativa.antetitulo}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
              {comparativa.titulo}
            </h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
              <Rich text={comparativa.texto} strongClassName="text-slate-800 font-semibold" />
            </p>
          </div>

          <div className="border border-slate-200 rounded-sm overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-2 md:grid-cols-3 border-b border-slate-200 bg-white shadow-sm">
              <div className="p-5 hidden md:block" />
              <div className="p-5 border-b-2 border-indigo-500 bg-indigo-500/5">
                <span className="text-xs sm:text-[10px] text-indigo-600 uppercase tracking-widest block mb-1">{comparativa.nosotrosEtiqueta}</span>
                <p className="text-slate-900 font-bold text-sm">{comparativa.nosotrosNombre}</p>
              </div>
              <div className="p-5">
                <span className="text-xs sm:text-[10px] text-slate-600 uppercase tracking-widest block mb-1">{comparativa.otrosEtiqueta}</span>
                <p className="text-slate-900 font-bold text-sm">{comparativa.otrosNombre}</p>
              </div>
            </div>

            {/* Rows */}
            {comparativa.filas.map((row) => (
              <div key={row.nombre} className="grid grid-cols-2 md:grid-cols-3 border-b border-slate-200/60 last:border-0 hover:bg-slate-100/20 transition-colors">
                <div className="p-4 md:p-5 hidden md:flex items-center border-r border-slate-200/60">
                  <span className="text-slate-700 text-sm font-medium">{row.nombre}</span>
                </div>
                <div className="p-4 md:p-5 bg-indigo-500/5 flex items-center gap-3 border-r border-slate-200/60">
                  <div className="w-5 h-5 rounded-sm bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-indigo-600" />
                  </div>
                  <span className="text-slate-900 text-sm font-medium">{row.nosotros}</span>
                </div>
                <div className="p-4 md:p-5 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-sm bg-slate-200 flex items-center justify-center flex-shrink-0">
                    {row.iconoOtros === 'x'
                      ? <X size={12} className="text-slate-700" />
                      : <Minus size={12} className="text-slate-700" />
                    }
                  </div>
                  <span className="text-slate-900 text-sm">{row.otros}</span>
                </div>
              </div>
            ))}

            {/* Footer CTA */}
            <div className="bg-white shadow-sm px-5 py-4 text-center border-t border-slate-200">
              <p className="text-slate-500 text-sm mb-2">{comparativa.pieTexto}</p>
              <a href="/auditar/" className="text-indigo-600 hover:text-indigo-600 text-sm font-medium transition-colors">
                {comparativa.pieBoton}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section id="planes" className="border-t border-slate-200/60 py-12 sm:py-20 px-4 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">{planes.antetitulo}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">{planes.titulo}</h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">{planes.texto}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
            {planes.items.map((plan, i) => {
              const s = estilosPlan[(plan.estilo as keyof typeof estilosPlan)] ?? estilosPlan.normal
              return (
                <div key={plan.nombre} className={`bg-white shadow-sm ${s.card} rounded-sm p-6 relative flex flex-col`}>
                  {plan.sello && (
                    <span className={`absolute -top-3 left-5 ${s.sello} text-white text-xs sm:text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm`}>{plan.sello}</span>
                  )}
                  <p className={`text-xs sm:text-[10px] ${s.etiqueta} uppercase tracking-widest mb-2`}>{`${String(i + 1).padStart(2, '0')} · ${plan.nombre}`}</p>
                  <p className="text-3xl font-extrabold text-slate-900 mb-1">{plan.precio}</p>
                  <p className="text-slate-500 text-xs mb-5">{plan.unidad}</p>
                  <p className="text-slate-700 text-sm mb-5 leading-relaxed">
                    {plan.descripcion}
                  </p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.incluye.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-slate-700 text-sm">
                        <Check size={14} className={`${s.check} flex-shrink-0 mt-0.5`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={whatsappUrl(plan.mensajeWhatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center px-5 py-3 rounded-sm ${s.boton} font-semibold text-sm transition-colors`}
                  >
                    {plan.botonTexto}
                  </a>
                </div>
              )
            })}
          </div>
          <p className="text-slate-500 text-xs sm:text-[11px] text-center mt-8">
            {planes.nota}
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq-geo" className="border-t border-slate-200/60 py-12 sm:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-3">{faq.antetitulo}</p>
            <h2 className="text-2xl font-bold text-slate-900">{faq.titulo}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {faq.grupos.map((grupo) => (
              <div key={grupo.titulo}>
                <p className="text-xs sm:text-[10px] text-slate-500 uppercase tracking-widest mb-5">{grupo.titulo}</p>
                <FaqAccordionServer items={grupo.preguntas.map((p) => ({ q: p.pregunta, a: p.respuesta }))} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA CIERRE ────────────────────────────────────────────── */}
      <section className="border-t border-slate-200/60 py-16 sm:py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs sm:text-[11px] text-indigo-600 uppercase tracking-widest mb-5">{cierre.antetitulo}</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-5">
            {cierre.titulo}
          </h2>
          <p className="hidden sm:block text-slate-700 text-base leading-relaxed mb-10">
            {cierre.texto}
          </p>
          <p className="sm:hidden text-slate-700 text-base leading-relaxed mb-10">
            {cierre.textoMovil}
          </p>
          <a
            href="/auditar/"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
          >
            {cierre.botonTexto}
          </a>
          <p className="text-slate-500 text-sm sm:text-xs mt-5">{cierre.nota}</p>
        </div>
      </section>

    </div>
  )
}
