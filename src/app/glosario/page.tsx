
import Link from 'next/link';

export const metadata = {
  title: 'Glosario de Inteligencia Artificial y GEO | AI Visibility',
  description: 'Aprende los términos clave sobre Generative Engine Optimization, Share of Model, RAG y auditorías en modelos de lenguaje.',
};

const terminos = [
  {
    id: "share-of-model",
    termino: "Share of Model (SoM)",
    definicion: "Métrica que cuantifica el porcentaje de veces que un modelo de inteligencia artificial (LLM) menciona a una marca específica en comparación con sus competidores al responder consultas sobre una industria o categoría. Es la evolución del tradicional 'Share of Voice'."
  },
  {
    id: "geo",
    termino: "Generative Engine Optimization (GEO)",
    definicion: "Conjunto de estrategias y técnicas diseñadas para optimizar la presencia y el sentimiento de una marca dentro de los motores de respuesta generativa (como ChatGPT, Perplexity o Claude), asegurando que la IA recomiende la marca como la mejor solución."
  },
  {
    id: "alucinacion-ia",
    termino: "Alucinación de IA",
    definicion: "Fenómeno donde un modelo de lenguaje genera respuestas que suenan plausibles y seguras, pero que son factualmente incorrectas o no están basadas en sus datos de entrenamiento. En marketing, puede resultar en la invención de características de productos o atribución incorrecta de liderazgo a un competidor."
  },
  {
    id: "rag",
    termino: "RAG (Retrieval-Augmented Generation)",
    definicion: "Arquitectura técnica donde un LLM busca información externa en tiempo real (como bases de datos o internet) antes de generar una respuesta. Es el motor detrás de herramientas como Perplexity, haciendo crucial que las marcas tengan información estructurada y accesible."
  },
  {
    id: "auditoria-arquetipos",
    termino: "Auditoría por Arquetipos",
    definicion: "Metodología de evaluación de IA que simula los prompts (instrucciones) que realizarían diferentes perfiles de clientes ideales (ej. 'Comprador Económico' o 'Gerente de Innovación') para analizar cómo varía la recomendación de la IA según el contexto del usuario."
  }
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

export default function GlosarioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Glosario de Inteligencia Artificial
          </h1>
          <p className="text-lg text-gray-600">
            Los conceptos fundamentales que necesitas dominar para entender la nueva era del descubrimiento de marcas mediante IA.
          </p>
        </div>

        <div className="space-y-8">
          {terminos.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <h2 className="text-2xl font-bold text-blue-600 mb-3">
                {item.termino}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {item.definicion}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Volver a la Auditoría
          </Link>
        </div>
      </main>
    </div>
  );
}
