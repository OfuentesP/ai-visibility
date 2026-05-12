
import Link from 'next/link';

export const metadata = {
  title: 'Glosario de Inteligencia Artificial y GEO | AI Visibility',
  description: 'Aprende los términos clave sobre Generative Engine Optimization, Share of Model, RAG y auditorías en modelos de lenguaje.',
};

const terminos = [
  {
    id: "share-of-model",
    tag: "Métrica",
    termino: "Share of Model (SoM)",
    definicion: "Métrica que cuantifica el porcentaje de veces que un modelo de inteligencia artificial (LLM) menciona a una marca específica en comparación con sus competidores al responder consultas sobre una industria o categoría. Es la evolución del tradicional 'Share of Voice'."
  },
  {
    id: "geo",
    tag: "Estrategia",
    termino: "Generative Engine Optimization (GEO)",
    definicion: "Conjunto de estrategias y técnicas diseñadas para optimizar la presencia y el sentimiento de una marca dentro de los motores de respuesta generativa (como ChatGPT, Perplexity o Claude), asegurando que la IA recomiende la marca como la mejor solución."
  },
  {
    id: "alucinacion-ia",
    tag: "Riesgo",
    termino: "Alucinación de IA",
    definicion: "Fenómeno donde un modelo de lenguaje genera respuestas que suenan plausibles y seguras, pero que son factualmente incorrectas o no están basadas en sus datos de entrenamiento. En marketing, puede resultar en la invención de características de productos o atribución incorrecta de liderazgo a un competidor."
  },
  {
    id: "rag",
    tag: "Arquitectura",
    termino: "RAG (Retrieval-Augmented Generation)",
    definicion: "Arquitectura técnica donde un LLM busca información externa en tiempo real (como bases de datos o internet) antes de generar una respuesta. Es el motor detrás de herramientas como Perplexity, haciendo crucial que las marcas tengan información estructurada y accesible."
  },
  {
    id: "auditoria-arquetipos",
    tag: "Metodología",
    termino: "Auditoría por Arquetipos",
    definicion: "Metodología de evaluación de IA que simula los prompts que realizarían diferentes perfiles de clientes ideales (ej. 'Comprador Económico' o 'Gerente de Innovación') para analizar cómo varía la recomendación de la IA según el contexto del usuario."
  },
  {
    id: "llm",
    tag: "Tecnología",
    termino: "LLM (Large Language Model)",
    definicion: "Modelo de lenguaje de gran escala entrenado sobre grandes volúmenes de texto para generar, resumir y razonar sobre lenguaje natural. ChatGPT (GPT-4o), Claude, Gemini y Perplexity son ejemplos de interfaces construidas sobre LLMs que hoy influyen directamente en las decisiones de compra B2B y B2C."
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "name": "Glosario de Inteligencia Artificial y GEO",
  "description": "Definiciones técnicas sobre optimización para motores generativos.",
  "hasDefinedTerm": terminos.map(t => ({
    "@type": "DefinedTerm",
    "name": t.termino,
    "description": t.definicion
  }))
};

const tagColor: Record<string, string> = {
  Métrica:     'text-indigo-400 bg-indigo-950/60 border-indigo-800/40',
  Estrategia:  'text-violet-400 bg-violet-950/60 border-violet-800/40',
  Riesgo:      'text-rose-400 bg-rose-950/40 border-rose-800/40',
  Arquitectura:'text-sky-400 bg-sky-950/40 border-sky-800/40',
  Metodología: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
  Tecnología:  'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
}

export default function GlosarioPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-6xl mx-auto py-16 px-4">

        {/* Header */}
        <div className="mb-14">
          <p className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest mb-3">Referencia técnica</p>
          <h1 className="text-xl font-semibold text-slate-100 leading-snug">
            Glosario de IA &amp; GEO
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Conceptos fundamentales para entender la visibilidad de marca en motores generativos.
          </p>
        </div>

        {/* Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 divide-y-0">
          {terminos.map((item, i) => (
            <div key={item.id} id={item.id} className="py-7 flex gap-6 border-b border-slate-800/60">
              {/* Index */}
              <span className="text-[11px] font-mono text-slate-700 pt-0.5 w-5 shrink-0 select-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-sm font-semibold text-slate-100">{item.termino}</h2>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${tagColor[item.tag] ?? 'text-slate-500 bg-slate-800 border-slate-700'}`}>
                    {item.tag}
                  </span>
                </div>
                <p className="text-slate-500 text-[13px] leading-relaxed border-l-2 border-slate-800 pl-4">
                  {item.definicion}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-12 pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="text-xs font-mono text-slate-600 hover:text-slate-300 transition-colors"
          >
            ← Volver a la auditoría
          </Link>
        </div>

      </main>
    </div>
  );
}

