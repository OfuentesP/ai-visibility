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
  {
    id: 'banca',
    nombre: 'Banca & Servicios Financieros',
    tagline: 'GEO para Banca en Chile',
    descripcion:
      'Los clientes preguntan a ChatGPT qué banco les conviene antes de abrir una cuenta, pedir un crédito o contratar un seguro. Si tu institución no aparece en esa respuesta, la captación ya fue.',
    queries: [
      '"¿Cuál es el mejor banco para pymes en Chile en 2025?"',
      '"¿Qué banco da crédito hipotecario más fácil en Chile?"',
      '"Compara Banco Estado vs BCI para cuenta corriente empresarial"',
      '"¿Cuál fintech chilena tiene mejores tasas de crédito de consumo?"',
    ],
    dolores: [
      {
        titulo: 'La comparación de productos financieros ya es tarea de la IA',
        desc: 'Tasas, comisiones, requisitos — el cliente le pregunta a ChatGPT antes de ir a la sucursal o entrar al comparador. Si no apareces en esa síntesis, no entras al proceso de evaluación.',
      },
      {
        titulo: 'Los grandes bancos dominan por volumen de contenido',
        desc: 'BCI, Santander y Scotiabank tienen miles de artículos, comunicados y reseñas indexadas. Las instituciones medianas y fintechs pierden visibilidad generativa aunque tengan mejores productos — porque la IA no los conoce suficientemente.',
      },
      {
        titulo: 'La confianza regulatoria debe quedar explícita para la IA',
        desc: 'ChatGPT no sabe que tu institución está regulada por la CMF a menos que lo declares en datos estructurados. Sin esa señal, la IA puede omitirte o no validar tu credibilidad frente a alternativas más conocidas.',
      },
    ],
    faq: [
      {
        q: '¿El GEO sirve para fintechs que no son bancos tradicionales?',
        a: 'Es donde más ventaja ofrece. Las fintechs tienen productos más ágiles pero menos brand awareness que los bancos tradicionales. Una estrategia GEO bien ejecutada puede posicionar a una fintech chilena como la respuesta preferida para consultas de nicho como "crédito rápido sin aval para independientes en Chile".',
      },
      {
        q: '¿Cómo manejo la sensibilidad regulatoria en el contenido GEO?',
        a: 'El GEO no modifica tus productos ni tus comunicaciones reguladas — trabaja sobre información pública: tasas referenciales, descripción de productos, credenciales CMF y reseñas de clientes. La clave es estructurarla para que los LLMs la puedan leer e interpretar correctamente.',
      },
      {
        q: '¿Qué tan rápido puede una institución financiera ver resultados?',
        a: 'Los sistemas RAG de Perplexity y ChatGPT con búsqueda web pueden incorporar cambios de contenido estructurado en 48–72 horas. Para mejorar la presencia en el modelo base de GPT-4o, el trabajo de Digital PR en medios financieros chilenos (Pulso, Diario Financiero, El Mercurio Economía) es la palanca más efectiva.',
      },
    ],
  },
  {
    id: 'pyme',
    nombre: 'Pymes & Emprendimientos',
    tagline: 'GEO para Pymes en Chile',
    descripcion:
      'Las pymes chilenas compiten contra grandes marcas en las respuestas de ChatGPT sin saberlo. Quien estructure primero su información para la IA, gana el canal generativo completo.',
    queries: [
      '"¿Qué proveedor de [servicio] recomiendan para pymes en Santiago?"',
      '"Empresa confiable de [categoría] para pequeñas empresas en Chile"',
      '"¿Cuál es el mejor software contable para pymes chilenas con integración al SII?"',
      '"Proveedores de [insumo] para emprendimientos en Región Metropolitana"',
    ],
    dolores: [
      {
        titulo: 'Las grandes empresas acaparan las respuestas de IA',
        desc: 'Cuando ChatGPT responde sobre proveedores de tu industria, menciona primero a las empresas con más presencia en medios y con datos estructurados en su web. Las pymes, aunque sean mejores, son invisibles si no tienen esa infraestructura.',
      },
      {
        titulo: 'El boca a boca ya no llega a la IA',
        desc: 'Una pyme puede tener excelente reputación en su red de contactos, pero si esa reputación no está en fuentes que los LLMs indexan (reseñas de Google, foros, medios), la IA no puede recomendarla — y el canal generativo le pertenece a quien sí lo tenga documentado.',
      },
      {
        titulo: 'El costo de entrada al GEO es proporcional',
        desc: 'A diferencia de campañas de publicidad masiva, el GEO escala con esfuerzo, no con presupuesto. Un JSON-LD bien configurado y dos artículos en medios de nicho pueden poner a una pyme en las respuestas de ChatGPT para consultas específicas de su industria.',
      },
    ],
    faq: [
      {
        q: '¿Necesito un equipo técnico para implementar GEO en mi pyme?',
        a: 'No. La auditoría te entrega el código JSON-LD listo para copiar y pegar en tu sitio web. Si tienes WordPress, Wix o cualquier CMS, tu equipo puede implementarlo en menos de 30 minutos. AI Visibility genera el código estructurado específico para tu modelo de negocio.',
      },
      {
        q: '¿Puede una pyme competir con Falabella o Sodimac en las respuestas de IA?',
        a: 'En queries genéricas, no. Pero tampoco necesitas hacerlo. El GEO para pymes funciona por especialización: una ferretería de Ñuñoa puede dominar las respuestas de ChatGPT para "ferretería con despacho en Ñuñoa con atención personalizada" aunque nunca gane la query genérica "ferretería en Chile".',
      },
      {
        q: '¿Con cuántas auditorías necesito para ver si mi pyme tiene visibilidad?',
        a: 'Con una auditoría de la búsqueda más representativa de tu negocio ya obtienes un diagnóstico completo: tu Share of Model, quién te está quitando clientes en ChatGPT y un plan de acción priorizado. El plan Beta incluye 2 auditorías completas sin costo.',
      },
    ],
  },
  {
    id: 'inmobiliaria',
    nombre: 'Inmobiliaria & Propiedades',
    tagline: 'GEO para Inmobiliarias en Chile',
    descripcion:
      'Comprar o arrendar es la decisión económica más grande de una familia chilena — y cada vez más, empieza con una pregunta a ChatGPT. Si tu inmobiliaria o corredor no aparece en esa respuesta, el cliente llegará a tu competencia.',
    queries: [
      '"¿Cuál es la mejor inmobiliaria para comprar departamento en Santiago en 2025?"',
      '"Corredor de propiedades confiable en [comuna] — recomendaciones"',
      '"¿Conviene comprar en [comuna] o es mejor arrendar con la tasa actual?"',
      '"Inmobiliarias con proyectos de departamentos con subsidio en Chile"',
    ],
    dolores: [
      {
        titulo: 'La búsqueda de propiedades empieza meses antes del contacto',
        desc: 'Los compradores investigan comunas, inmobiliarias y corredores durante meses antes de contactar a alguien. ChatGPT es su primer consejero. Si tu empresa no aparece en esa fase exploratoria, nunca entrarás al proceso de decisión.',
      },
      {
        titulo: 'La IA opina sobre comunas y valores — con o sin tu marca',
        desc: 'ChatGPT responde preguntas sobre dónde vivir, qué comunas están en alza y qué inmobiliarias son confiables. Si no tienes datos estructurados que la IA pueda usar para validarte, esa conversación la gana quien sí los tenga.',
      },
      {
        titulo: 'Las reseñas negativas pesan más en el canal generativo',
        desc: 'Un LLM que encuentra reseñas negativas en portales y foros sobre tu inmobiliaria las incorpora a su respuesta. Auditar tu Share of Model incluye detectar si estás siendo recomendado con advertencias — algo que ningún Google Analytics te muestra.',
      },
    ],
    faq: [
      {
        q: '¿El GEO sirve para corredores independientes además de inmobiliarias?',
        a: 'Especialmente. Un corredor independiente con nombre propio puede posicionarse en ChatGPT para consultas específicas de su zona (ej. "corredor de propiedades en Vitacura con experiencia en departamentos de lujo") con una inversión mínima en JSON-LD y un par de reseñas en plataformas de autoridad.',
      },
      {
        q: '¿Cómo afecta la tasa de interés y el contexto macro a las respuestas de IA?',
        a: 'Los LLMs con acceso web actualizan su contexto económico con noticias recientes. Si tu inmobiliaria tiene contenido publicado sobre el impacto de la tasa en el mercado chileno, la IA te puede citar como fuente de autoridad en esas consultas — que tienen altísimo volumen en períodos de incertidumbre.',
      },
      {
        q: '¿Para proyectos en preventa también aplica el GEO?',
        a: 'Sí, y es una ventaja competitiva enorme. Un proyecto en preventa con JSON-LD de tipo RealEstateListing con ubicación, metrajes, precio referencial y fecha de entrega puede aparecer en las respuestas de ChatGPT antes de que el proyecto tenga su primer aviso en portal.',
      },
    ],
  },
]

export function getIndustria(id: string): Industria | undefined {
  return industrias.find((i) => i.id === id)
}
