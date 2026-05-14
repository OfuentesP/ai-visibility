export type Industria = {
  id: string
  nombre: string
  tagline: string
  descripcion: string
  queries: string[]
  dolores: { titulo: string; desc: string }[]
  faq: { q: string; a: string }[]
}

export const industrias: Industria[] = [
  {
    id: 'saas',
    nombre: 'SaaS & Software',
    tagline: 'GEO para SaaS en Chile',
    descripcion:
      'Los compradores B2B evalúan software preguntándole directamente a ChatGPT. Si tu solución no aparece cuando buscan tu categoría, pierdes el deal antes de saber que existía.',
    queries: [
      '"¿Cuál es el mejor CRM para pymes en Chile?"',
      '"Alternativas a [Competidor] para empresas latinoamericanas"',
      '"¿Qué herramienta usan las startups chilenas para [proceso]?"',
      '"Compara [Tu SaaS] con [Competidor]"',
    ],
    dolores: [
      {
        titulo: 'El ciclo de evaluación empieza sin ti',
        desc: 'El 67% de los compradores B2B ya investigó con IA antes de su primera llamada con ventas. Si ChatGPT no te menciona en esa fase, no entras al shortlist.',
      },
      {
        titulo: 'Tu competidor internacional domina las respuestas',
        desc: 'Salesforce, HubSpot y Monday tienen miles de menciones en fuentes que los LLMs indexan. Sin una estrategia GEO activa, siempre aparecerán primero — aunque tu producto sea mejor para el mercado chileno.',
      },
      {
        titulo: 'Las reseñas en G2 y Capterra alimentan a la IA',
        desc: 'Perplexity y ChatGPT usan plataformas de reseñas como fuente de autoridad. Un perfil sin reseñas recientes es invisible para el modelo.',
      },
    ],
    faq: [
      {
        q: '¿Cuánto tarda en aparecer mi SaaS en ChatGPT?',
        a: 'Con JSON-LD bien estructurado y menciones en fuentes de autoridad, los sistemas RAG (Perplexity, ChatGPT con búsqueda web) pueden indexarte en 48–72 horas. Para el modelo base de GPT-4o, que tiene un training cutoff estático, el impacto se ve en el siguiente ciclo de reentrenamiento — pero el RAG es suficiente para la mayoría de las consultas de evaluación B2B.',
      },
      {
        q: '¿Cómo compito con Salesforce en las respuestas de IA?',
        a: 'No compites en volumen de menciones — compites en especificidad. Los LLMs recomiendan soluciones contextuales: si tu copy y tu JSON-LD posicionan tu SaaS como "la alternativa local para pymes chilenas con integración al SII", aparecerás en ese contexto aunque Salesforce domine las queries genéricas.',
      },
      {
        q: '¿Sirve para software B2B con ciclos de venta largos?',
        a: 'Es donde más impacto tiene. En ventas enterprise con múltiples stakeholders, cada evaluador hace sus propias consultas a la IA. Aparecer en cada una de esas consultas es equivalente a tener un SDR trabajando en cada cuenta, 24/7.',
      },
    ],
  },
  {
    id: 'retail',
    nombre: 'Retail & E-commerce',
    tagline: 'GEO para Retail en Chile',
    descripcion:
      'ChatGPT ya reemplaza a Google para comparar tiendas y productos. Cuando alguien pregunta dónde comprar, la IA da una sola respuesta — o eres tú, o es tu competencia.',
    queries: [
      '"¿Dónde comprar [producto] online en Chile con despacho rápido?"',
      '"Mejor tienda de [categoría] en Santiago — calidad vs precio"',
      '"¿Es confiable comprar en [Tu Tienda]?"',
      '"Compara [producto] en las principales tiendas chilenas"',
    ],
    dolores: [
      {
        titulo: 'La IA valida la confianza antes que tú puedas hablar',
        desc: 'Antes de ingresar a tu sitio, el comprador le preguntó a ChatGPT si tu tienda es confiable. Si la IA no tiene datos estructurados de tus reseñas y políticas, la respuesta será genérica — o peor, mencionará a tu competidor.',
      },
      {
        titulo: 'El SEO de producto no funciona en IA',
        desc: 'Rankear en Google para "zapatillas running baratas" no garantiza que ChatGPT te recomiende. La IA sintetiza una respuesta basada en reputación y autoridad de fuentes — no en keywords ni meta tags.',
      },
      {
        titulo: 'Las temporadas altas te pasan por arriba',
        desc: 'En CyberDay y Navidad, las consultas a ChatGPT sobre dónde comprar se disparan. Sin Share of Model trabajado antes, esa demanda va íntegra a quien ya esté posicionado en los LLMs.',
      },
    ],
    faq: [
      {
        q: '¿El GEO sirve para tiendas físicas también?',
        a: 'Sí. Las consultas de IA locales ("mejor tienda de muebles en Providencia") están creciendo más rápido que las genéricas. JSON-LD de tipo LocalBusiness con horarios, dirección y reseñas es el punto de partida para retail con presencia física.',
      },
      {
        q: '¿Qué tan importante son las reseñas para el GEO en retail?',
        a: 'Críticas. Perplexity cita Google Reviews, Trustpilot y foros chilenos (Reclamos.cl) como señal de confianza. Una tienda con 4.5+ estrellas en fuentes indexadas tiene una ventaja estructural en las respuestas de IA sobre recomendaciones de compra.',
      },
      {
        q: '¿Cómo audito mi visibilidad para una categoría específica de productos?',
        a: 'Ingresas tu nombre de tienda y la búsqueda representativa de tu categoría (ej. "tiendas de electrónica en Chile") en la plataforma. El informe muestra si apareces, con qué sentimiento y qué competidor te está quitando ese tráfico generativo.',
      },
    ],
  },
  {
    id: 'salud',
    nombre: 'Salud & Clínicas',
    tagline: 'GEO para Clínicas y Salud en Chile',
    descripcion:
      'Los pacientes preguntan a ChatGPT qué clínica les recomienda antes de agendar. Si no tienes presencia en los LLMs, el sistema de salud digital te dejó fuera de la conversación.',
    queries: [
      '"¿Cuál es la mejor clínica de [especialidad] en Santiago?"',
      '"¿Dónde atenderse de [condición] sin esperar meses en Chile?"',
      '"Médico recomendado para [especialidad] con Fonasa o Isapre"',
      '"¿Es buena la clínica [Nombre] para [tratamiento]?"',
    ],
    dolores: [
      {
        titulo: 'La decisión de salud ya se toma con IA',
        desc: 'El paciente llega a tu agenda de citas habiendo preguntado antes a ChatGPT. Si el modelo recomienda otra clínica —o no te menciona— el proceso de captación se rompe antes de que puedas mostrar tus credenciales.',
      },
      {
        titulo: 'La desinformación sobre tu clínica es un riesgo real',
        desc: 'Si los LLMs no tienen datos estructurados precisos sobre tus especialidades, médicos y coberturas, pueden generar respuestas incorrectas (alucinaciones). Un paciente mal informado por la IA es un riesgo clínico y reputacional.',
      },
      {
        titulo: 'Las clínicas grandes dominan por volumen de menciones',
        desc: 'Clínica Las Condes, UC Christus y Bupa acumulan miles de menciones en medios que los LLMs usan como fuente. Sin una estrategia GEO, las clínicas medianas son invisibles en las respuestas — independiente de la calidad de su atención.',
      },
    ],
    faq: [
      {
        q: '¿El GEO aplica para consultas médicas privadas también?',
        a: 'Especialmente. Un médico o especialista con nombre propio se beneficia enormemente del GEO: JSON-LD de tipo MedicalClinic o Physician con especialidades, credenciales y reseñas hace que ChatGPT pueda recomendarte en consultas específicas de especialidad.',
      },
      {
        q: '¿Cómo manejo la información sensible de salud en el GEO?',
        a: 'El GEO no expone datos de pacientes — trabaja sobre información pública de tu clínica: especialidades, médicos, tecnología disponible, coberturas de seguros y reseñas. Es información que ya debería estar en tu sitio, solo estructurada para que la IA pueda leerla correctamente.',
      },
      {
        q: '¿Puedo auditar para una especialidad específica como oncología o cardiología?',
        a: 'Sí. En la auditoría ingresas tu nombre de clínica y la búsqueda específica ("clínicas de oncología en Santiago"). El informe muestra tu Share of Model para esa especialidad y qué institución domina actualmente las respuestas de ChatGPT.',
      },
    ],
  },
]

export function getIndustria(id: string): Industria | undefined {
  return industrias.find((i) => i.id === id)
}
