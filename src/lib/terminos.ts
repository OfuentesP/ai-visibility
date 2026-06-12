export type Termino = {
  id: string
  tag: string
  termino: string
  definicion: string
  ampliacion: string[]
  relacionados: string[]
  tituloSeo?: string
  descripcionSeo?: string
  lecturas?: { slug: string; titulo: string }[]
}

export const terminos: Termino[] = [
  {
    id: 'share-of-model',
    tag: 'Métrica',
    termino: 'Share of Model (SoM)',
    definicion:
      'Métrica que cuantifica el porcentaje de veces que un modelo de inteligencia artificial (LLM) menciona a una marca específica en comparación con sus competidores al responder consultas sobre una industria o categoría. Es la evolución del tradicional "Share of Voice".',
    ampliacion: [
      'Como el Share of Voice medía cuántas veces aparecía tu marca en medios pagados o espontáneos, el Share of Model mide cuántas veces la Ai te recomienda cuando un potencial cliente le pregunta sobre tu industria. Se calcula dividiendo el número de respuestas donde tu marca es mencionada entre el total de consultas auditadas para tu categoría.',
      'Un SoM del 0% significa que la Ai nunca te recomienda, independiente de cuánto inviertas en SEO o publicidad digital. Un SoM alto significa que la Ai se convierte en tu mejor vendedor, activo las 24 horas. La mayoría de marcas en Chile no conoce su SoM — ese desconocimiento es la brecha competitiva que el mercado aún no vio.',
      'Para medir el SoM de tu marca necesitas auditar activamente los principales LLMs con prompts representativos de las consultas reales de tus compradores, cruzar los resultados con los de tus competidores directos, y repetir el proceso de forma periódica para detectar tendencias.',
    ],
    relacionados: ['geo', 'seo', 'llm', 'auditoria-arquetipos'],
  },
  {
    id: 'geo',
    tag: 'Estrategia',
    termino: 'Generative Engine Optimization (GEO)',
    definicion:
      'Conjunto de estrategias y técnicas diseñadas para optimizar la presencia y el sentimiento de una marca dentro de los motores de respuesta generativa (como ChatGPT, Perplexity o Claude), asegurando que la Ai recomiende la marca como la mejor solución.',
    ampliacion: [
      'A diferencia del SEO (que optimiza para algoritmos de crawl, palabras clave y backlinks), el GEO opera sobre los mecanismos de recuperación semántica de los LLMs. Las principales palancas son: datos estructurados JSON-LD para que los modelos puedan leer tu identidad de marca con precisión, densidad de entidad en fuentes de autoridad que los LLMs indexan (Wikipedia, foros técnicos, medios especializados), y Digital PR en publicaciones que Perplexity y ChatGPT usan como fuentes de confianza.',
      'El GEO no reemplaza al SEO — lo complementa. Un sitio bien posicionado en Google sigue siendo importante porque muchos LLMs con acceso web lo usan como señal de autoridad. La diferencia es que el SEO optimiza para una lista de 10 links; el GEO optimiza para ser la única respuesta recomendada en un texto conversacional.',
      'El horizonte temporal del GEO es diferente al del SEO. La inyección correcta de JSON-LD puede ser legible por sistemas RAG en 48 horas. Para que los modelos con conocimiento estático actualicen sus respuestas, el ciclo es de semanas a meses — razón por la que empezar hoy genera ventaja sobre quien empiece el próximo trimestre.',
    ],
    relacionados: ['share-of-model', 'aeo', 'seo', 'rag', 'llm'],
  },
  {
    id: 'alucinacion-ia',
    tag: 'Riesgo',
    termino: 'Alucinación de Ai',
    definicion:
      'Fenómeno donde un modelo de lenguaje genera respuestas que suenan plausibles y seguras, pero que son factualmente incorrectas o no están basadas en sus datos de entrenamiento. En marketing, puede resultar en la invención de características de productos o atribución incorrecta de liderazgo a un competidor.',
    ampliacion: [
      'Las alucinaciones no son errores aleatorios — ocurren cuando el LLM no tiene suficiente información de alta calidad sobre una entidad y "rellena" los vacíos con datos plausibles pero falsos. Si tu marca tiene escasa presencia en fuentes indexables, el modelo puede inventar características de tus productos, confundir tu empresa con un competidor o, peor, afirmar que cerraste operaciones.',
      'Para una marca, la alucinación es un riesgo de reputación invisible: los usuarios que reciben una respuesta incorrecta sobre tu empresa raramente verifican la información — simplemente toman la decisión de compra basados en lo que la Ai les dijo. Detectar alucinaciones activas requiere auditorías sistemáticas con prompts variados, no una revisión manual esporádica.',
      'La solución técnica es aumentar la densidad de entidad en fuentes de autoridad: JSON-LD bien estructurado en tu sitio, menciones en medios indexados, y reseñas en plataformas de alta confianza (G2, Trustpilot, foros sectoriales). Mientras más fuentes de calidad confirmen los datos de tu marca, menor es la probabilidad de que el modelo los "imagine".',
    ],
    relacionados: ['llm', 'rag'],
  },
  {
    id: 'rag',
    tag: 'Arquitectura',
    termino: 'RAG (Retrieval-Augmented Generation)',
    tituloSeo: '¿Qué es RAG? Retrieval-Augmented Generation explicado simple | Ai Visibility',
    descripcionSeo:
      'RAG (Retrieval-Augmented Generation) es la arquitectura que permite a ChatGPT y Perplexity buscar información en internet antes de responder. Te explicamos qué es, cómo funciona y por qué decide si la Ai cita tu marca.',
    lecturas: [
      { slug: 'que-es-rag-como-decide-citas-ia', titulo: '¿Qué es RAG y cómo decide qué marcas cita la Ai?' },
      { slug: 'google-seo-sigue-vivo-busqueda-ia', titulo: 'Google confirmó que el SEO sigue vivo en la búsqueda con Ai' },
    ],
    definicion:
      'Arquitectura técnica donde un LLM busca información externa en tiempo real (como bases de datos o internet) antes de generar una respuesta. Es el motor detrás de herramientas como Perplexity, haciendo crucial que las marcas tengan información estructurada y accesible.',
    ampliacion: [
      'En un sistema RAG, el proceso tiene dos fases: primero el modelo recupera documentos relevantes de fuentes externas (páginas web, bases de datos, APIs), y luego usa esos documentos como contexto para generar su respuesta. Esto significa que la calidad y estructura de tu contenido en línea determina directamente si serás incluido en la conversación.',
      'Perplexity, ChatGPT con búsqueda web y los modos de búsqueda de Claude operan bajo arquitecturas RAG. Para estas plataformas, aparecer en la respuesta depende de si tu sitio es accesible, si tus datos estructurados son legibles para máquinas y si apareces en las fuentes que el sistema RAG considera autoritativas para tu industria.',
      'La implicancia práctica para una marca es que el SEO técnico clásico (velocidad de carga, indexabilidad, estructura de URLs) sigue siendo relevante en el contexto RAG — pero ya no es suficiente. El contenido debe estar marcado con Schema.org, responder preguntas concretas y provenir de o ser citado en fuentes que el sistema de recuperación clasifique como confiables.',
    ],
    relacionados: ['llm', 'geo', 'alucinacion-ia'],
  },
  {
    id: 'auditoria-arquetipos',
    tag: 'Metodología',
    termino: 'Auditoría por Arquetipos',
    definicion:
      'Metodología de evaluación de Ai que simula los prompts que realizarían diferentes perfiles de clientes ideales (ej. "Comprador Económico" o "Gerente de Innovación") para analizar cómo varía la recomendación de la Ai según el contexto del usuario.',
    ampliacion: [
      'Un mismo LLM puede recomendar tu marca a un "Gerente de TI evaluando proveedores enterprise" pero ignorarla cuando responde a un "Emprendedor buscando herramientas económicas para su startup". La variabilidad no es un defecto — es una característica de los LLMs que responden al contexto implícito del prompt. La auditoría por arquetipos convierte esa variabilidad en información accionable.',
      'Cada arquetipo se define por tres elementos: un perfil demográfico y de rol, una intención de búsqueda (exploración, comparación, decisión) y un set de prompts representativos de sus consultas reales. Al auditar los mismos LLMs con múltiples arquetipos, obtienes un mapa de visibilidad segmentada: sabes exactamente en qué contexto eres visible y en cuáles no.',
      'El resultado práctico es una hoja de ruta de contenido muy específica. Si tu SoM es alto para el arquetipo "decisor senior" pero nulo para el "evaluador técnico", sabes que necesitas crear contenido técnico profundo (documentación, integraciones, casos de uso de ingeniería) para recuperar ese segmento — en lugar de invertir donde ya eres fuerte.',
    ],
    relacionados: ['share-of-model', 'geo'],
  },
  {
    id: 'llm',
    tag: 'Tecnología',
    termino: 'LLM (Large Language Model)',
    definicion:
      'Modelo de lenguaje de gran escala entrenado sobre grandes volúmenes de texto para generar, resumir y razonar sobre lenguaje natural. ChatGPT (GPT-4o), Claude, Gemini y Perplexity son ejemplos de interfaces construidas sobre LLMs que hoy influyen directamente en las decisiones de compra B2B y B2C.',
    ampliacion: [
      'Los LLMs no "buscan" información como Google — generan texto prediciendo cuál es la continuación más probable dado su contexto de entrenamiento y el prompt del usuario. Esto tiene una implicancia directa para las marcas: si tu empresa no aparece en los textos con los que el modelo fue entrenado (artículos de medios, foros técnicos, documentación), el modelo literalmente no "sabe" que existes y no puede recomendarte.',
      'GPT-4o, el modelo detrás de ChatGPT, tiene un corte de conocimiento estático (training cutoff) pero opera con acceso a web en tiempo real vía RAG en su modo de búsqueda. Gemini y Claude tienen acceso web nativo. Perplexity es RAG puro. Esto significa que distintos LLMs requieren estrategias GEO ligeramente diferentes: unos necesitan que tu contenido esté en su corpus de entrenamiento, otros requieren que estés indexado y estructurado para ser recuperado en tiempo real.',
      'Para una estrategia GEO, la prioridad es dominar primero los LLMs con mayor cuota de mercado en tu industria (típicamente ChatGPT en B2B latinoamericano) y luego extender la cobertura a Perplexity y Gemini. La buena noticia es que las mejoras técnicas que aumentan tu legibilidad para un LLM (JSON-LD, densidad de entidad) mejoran tu visibilidad en todos — son complementarios, no excluyentes.',
    ],
    relacionados: ['geo', 'rag', 'alucinacion-ia'],
  },
  {
    id: 'aeo',
    tag: 'Estrategia',
    termino: 'AEO (Answer Engine Optimization)',
    definicion:
      'Conjunto de técnicas orientadas a optimizar el contenido para que aparezca como respuesta directa en motores de respuesta (featured snippets de Google, resultados de voz, paneles de conocimiento). Es el precursor conceptual del GEO, surgido antes de la irrupción masiva de los LLMs generativos.',
    ampliacion: [
      'AEO surge como respuesta a la evolución de Google hacia un "motor de respuestas" que muestra la información directamente en la SERP, sin requerir que el usuario haga clic en ningún enlace. Las técnicas clásicas incluyen Schema FAQ, HowTo y Q&A, estructura de contenido en formato pregunta-respuesta y optimización para búsqueda por voz (Google Assistant, Siri, Alexa).',
      'La diferencia entre AEO y GEO es sutil pero determinante: AEO optimiza para aparecer en las respuestas estructuradas de Google — featured snippets, voice search, People Also Ask — que siguen siendo generadas por un motor de búsqueda tradicional con resultados enriquecidos. GEO va un paso más allá: optimiza para que un LLM generativo como ChatGPT te incluya en una respuesta sintetizada completamente nueva, sin citar links y sin jerarquía de resultados.',
      'En la práctica, AEO y GEO comparten muchas tácticas técnicas: datos estructurados JSON-LD, claridad semántica, contenido en formato Q&A. Una estrategia de AEO bien ejecutada crea una base sólida para GEO. Sin embargo, AEO no garantiza visibilidad en LLMs puros — es posible dominar los featured snippets de Google y tener un Share of Model del 0% en ChatGPT. Por eso GEO requiere una capa adicional de estrategia específica para la arquitectura de los modelos generativos.',
    ],
    relacionados: ['geo', 'llm', 'rag'],
  },
  {
    id: 'seo',
    tag: 'Estrategia',
    termino: 'SEO (Search Engine Optimization)',
    definicion:
      'Conjunto de técnicas para posicionar páginas web en los primeros resultados orgánicos de motores de búsqueda como Google o Bing. Optimiza principalmente para algoritmos de crawl, relevancia de palabras clave y autoridad de dominio medida en backlinks.',
    ampliacion: [
      'El SEO tradicional opera sobre un modelo de resultados en lista: el objetivo es aparecer entre los 10 primeros links que Google muestra para una consulta determinada. Las palancas clásicas son el on-page SEO (títulos, metadescripciones, densidad de keywords, velocidad de carga), el off-page SEO (backlinks de dominios de autoridad) y el SEO técnico (indexabilidad, Core Web Vitals, estructura de URLs).',
      'El problema del SEO en la era generativa es estructural, no de ejecución: está diseñado para un paradigma donde el usuario ve una lista y hace clic. Cuando el usuario le pregunta directamente a ChatGPT "¿cuál es el mejor software de RRHH en Chile?", no existe lista de 10 links — existe una sola respuesta sintetizada. En ese escenario, el SEO no tiene jurisdicción; el GEO sí.',
      'SEO y GEO no son estrategias excluyentes. Un sitio bien posicionado en Google tiene mayor probabilidad de ser rastreado e indexado por los sistemas RAG que alimentan a ChatGPT con búsqueda web. Sin embargo, un SoM alto requiere capas adicionales que el SEO no cubre: densidad de entidad en fuentes de autoridad, JSON-LD estructurado para que los LLMs lean tu identidad de marca, y presencia en los medios que la Ai cita como fuentes confiables.',
    ],
    relacionados: ['geo', 'aeo', 'share-of-model'],
  },
]

export function getTermino(id: string): Termino | undefined {
  return terminos.find((t) => t.id === id)
}
