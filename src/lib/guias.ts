export type SeccionGuia = {
  h2: string
  parrafos: string[]
  lista?: string[]
  nota?: string
}

export type Guia = {
  slug: string
  titulo: string
  descripcion: string
  fecha: string
  categoria: string
  intro: string
  secciones: SeccionGuia[]
  faq: { q: string; a: string }[]
  ctaTexto: string
  ctaUrl: string
}

export const guias: Guia[] = [
  {
    slug: 'cyberday-2026-chatgpt',
    titulo: 'Cómo preparar tu marca para el CyberDay 2026 antes de que ChatGPT decida por tus clientes',
    descripcion:
      'El CyberDay 2026 (1–3 de junio) se gana en ChatGPT la semana antes, no en tu landing de descuentos. Guía práctica para emprendedores y tiendas online que quieren aparecer en las respuestas de IA cuando sus clientes validan la compra.',
    fecha: '2026-05-14',
    categoria: 'E-commerce & CyberDay',
    intro:
      'El CyberDay 2026 en Chile es el 1 al 3 de junio. Lo que la mayoría de los emprendedores no calcula: la decisión de compra ya está ocurriendo. Los clientes le preguntan a ChatGPT qué tiendas son confiables, cuáles inflan precios y cuáles tienen el mejor stock — días antes de que abras tu sala de descuentos. Si tu marca no aparece en esa respuesta, el precio deja de ser el factor que te diferencia.',
    secciones: [
      {
        h2: 'El CyberDay no empieza el 1 de junio',
        parrafos: [
          'Para el comprador moderno, el CyberDay empieza cuando abre ChatGPT y pregunta "¿qué tiendas de electrónica tienen buen CyberDay en Chile?" o "¿es confiable comprar en [tienda] para el Cyber?". Esas consultas ocurren entre el 25 y el 31 de mayo — una semana antes del evento.',
          'En esa ventana, la IA actúa como un consejero de compra que sintetiza reseñas, historial de precios y reputación de marca. Si no estás en esa síntesis, no entras al proceso de decisión. El cliente llega a tu competidor con la decisión tomada.',
        ],
      },
      {
        h2: 'Qué pregunta tu cliente a ChatGPT antes de comprar',
        parrafos: [
          'No son queries de producto — son queries de validación. El comprador ya sabe lo que quiere comprar; lo que necesita confirmar es dónde comprarlo.',
        ],
        lista: [
          '"¿Es confiable [Tu Tienda] para el CyberDay 2026 o inflan precios?"',
          '"Mejores tiendas de [categoría] para el CyberDay — experiencias reales"',
          '"[Tienda A] vs [Tienda B] para comprar [producto] en el Cyber Chile"',
          '"¿Vale la pena esperar el CyberDay en [Tu Tienda] o es mejor el Black Friday?"',
          '"Tiendas de [categoría] con despacho rápido y garantía real en Chile"',
        ],
        nota: 'Ninguna de estas queries tiene tu landing de CyberDay como respuesta. Las responde ChatGPT con las fuentes que tiene disponibles — y tú no controlas cuáles son, a menos que trabajes el GEO.',
      },
      {
        h2: 'Los 3 errores que hacen invisible tu tienda en la IA',
        parrafos: [
          'No es un problema de presupuesto. Es un problema de infraestructura de datos. Los LLMs construyen su opinión sobre tu marca usando tres fuentes principales: tu propio sitio web, las plataformas de reseñas y los medios que tienen autoridad en tu industria.',
        ],
        lista: [
          'Sin JSON-LD en tu homepage: ChatGPT no sabe qué vendes, dónde despachas ni cuánto tiempo llevas operando. Infiere esa información de fuentes de terceros — y puede equivocarse.',
          'Sin reseñas recientes en fuentes indexadas: Google Reviews, Trustpilot y Reclamos.cl son las plataformas que los LLMs usan para evaluar la confianza de una tienda. Menos de 10 reseñas en los últimos 6 meses es señal de poca actividad.',
          'Sin menciones en medios de nicho: Un artículo en un blog de tecnología chilena, una mención en un medio de consumidores o una nota en La Tercera Tendencias vale más para la IA que 50 posts en Instagram.',
        ],
      },
      {
        h2: 'Qué hacer en los próximos 15 días (antes del 1 de junio)',
        parrafos: [
          'No hay tiempo para estrategias de largo plazo. Esto es lo que mueve la aguja en semanas, no meses.',
        ],
        lista: [
          'Audita tu Share of Model hoy: Antes de optimizar, sabe dónde estás. Usa AI Visibility para ver si ChatGPT te menciona cuando preguntan por tu categoría en CyberDay. El diagnóstico tarda menos de 60 segundos.',
          'Agrega JSON-LD de tipo Organization + Store: Declara quién eres, qué vendes, en qué comunas despachas y cuántos años llevas. Es código que tu equipo puede copiar y pegar en el header de tu sitio esta tarde.',
          'Consigue 5 reseñas nuevas en Google esta semana: Escríbele a tus últimos 20 clientes satisfechos. Una tasa de respuesta del 25% ya te da el volumen necesario para que la IA tenga señales de confianza actualizadas.',
          'Publica un artículo o nota en un medio de nicho: No necesita ser La Tercera. Un blog de tecnología, una nota en Emprende.cl o una publicación en LinkedIn de un periodista chileno con buen alcance son suficientes para que Perplexity te empiece a citar como fuente.',
        ],
        nota: 'Los sistemas RAG de Perplexity y ChatGPT con búsqueda web indexan contenido nuevo en 48 a 72 horas. Si implementas el JSON-LD hoy, estarás en la ventana de indexación antes del peak de búsquedas del 25 al 31 de mayo.',
      },
      {
        h2: 'Por qué Falabella, Paris y Ripley ganan sin hacer nada',
        parrafos: [
          'No es que tengan mejor GEO — es que tienen años de menciones acumuladas en fuentes que los LLMs pesan como autoritativas. Medios nacionales, miles de reseñas, comparadores de precio y foros de consumidores. Esa densidad de entidad es casi imposible de igualar en volumen.',
          'Pero el volumen no lo es todo. Los LLMs también responden consultas específicas donde una marca más pequeña puede dominar: "tienda de [nicho muy específico] confiable en Chile", "mejor opción para [producto especializado] con garantía extendida". Ahí, con el JSON-LD correcto y tres reseñas de calidad, una tienda mediana puede aparecer como primera recomendación.',
          'La estrategia correcta para una pyme o emprendimiento en CyberDay no es competir con Falabella en las queries genéricas. Es dominar el nicho donde tienes ventaja real, y hacer que la IA lo sepa.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Es demasiado tarde para trabajar el GEO antes del CyberDay 2026?',
        a: 'No, si actúas esta semana. Los sistemas RAG de Perplexity y ChatGPT con búsqueda web indexan cambios de contenido en 48 a 72 horas. Implementar JSON-LD hoy y conseguir reseñas nuevas antes del 25 de mayo te da presencia en el peak de búsquedas de validación previas al evento.',
      },
      {
        q: '¿El GEO reemplaza al SEO para CyberDay?',
        a: 'No, los complementa. El SEO capta a quien llega a Google a buscar tu oferta. El GEO capta a quien le pregunta a ChatGPT si tu tienda es confiable antes de buscar la oferta. Son dos momentos del mismo proceso de compra — perder uno es perder la mitad del embudo.',
      },
      {
        q: '¿Funciona para una tienda que participa en CyberDay por primera vez?',
        a: 'Sí, y es donde más ventaja proporciona. Las tiendas nuevas no tienen historial de precios que la IA pueda consultar. Pero sí pueden construir señales de confianza rápidas: JSON-LD declarando especialización, reseñas en Google y una mención en un medio de nicho. Con eso, ChatGPT puede recomendarte en consultas específicas de tu categoría.',
      },
      {
        q: '¿Cómo sé si ChatGPT me está recomendando o diciéndole a mis clientes que vayan a otro lado?',
        a: 'Auditando activamente. Entra a AI Visibility, ingresa tu nombre de tienda y una búsqueda representativa de tu cliente en CyberDay. El informe muestra en tiempo real si ChatGPT te menciona, con qué sentimiento y qué competidor está capturando ese tráfico en tu lugar. Es gratuito y tarda menos de 60 segundos.',
      },
    ],
    ctaTexto: 'Auditar mi tienda antes del CyberDay →',
    ctaUrl: '/auditar/',
  },
]

export function getGuia(slug: string): Guia | undefined {
  return guias.find((g) => g.slug === slug)
}
