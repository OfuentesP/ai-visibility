export type BloqueBlog =
  | { tipo: 'parrafo'; texto: string }
  | { tipo: 'h2'; texto: string }
  | { tipo: 'h3'; texto: string }
  | { tipo: 'lista'; items: string[] }
  | { tipo: 'cita'; texto: string; fuente?: string }
  | { tipo: 'codigo'; lenguaje?: string; codigo: string }
  | { tipo: 'nota'; texto: string }

export type Post = {
  slug: string
  titulo: string
  descripcion: string
  fecha: string
  fechaActualizacion?: string
  categoria: 'Noticias IA' | 'Análisis LLM' | 'GEO & AEO' | 'Casos & Datos' | 'Tutoriales'
  tags: string[]
  autor: string
  tiempoLectura: string
  destacado?: boolean
  resumen: string
  bloques: BloqueBlog[]
  ctaTexto?: string
  ctaUrl?: string
  relacionados?: string[]
  glosario?: { slug: string; termino: string }[]
}

export const posts: Post[] = [
  {
    slug: 'que-es-rag-como-decide-citas-ia',
    titulo: '¿Qué es RAG (Retrieval-Augmented Generation) y cómo decide qué marcas cita la IA?',
    descripcion:
      'RAG es la arquitectura que permite a ChatGPT y Perplexity buscar en internet antes de responder. Explicamos en simple qué es, cómo funciona paso a paso y por qué determina si la IA recomienda tu marca o la de tu competencia.',
    fecha: '2026-05-27',
    categoria: 'Análisis LLM',
    tags: ['RAG', 'LLM', 'ChatGPT', 'Perplexity', 'GEO'],
    autor: 'Ai Visibility',
    tiempoLectura: '6 min',
    resumen:
      'RAG (Retrieval-Augmented Generation) es la arquitectura donde un LLM recupera documentos de internet y luego genera la respuesta a partir de ellos. Si tu contenido no está en ese paso de recuperación, la IA no puede citarte — por más bueno que seas.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Si te preguntas por qué ChatGPT recomienda a tu competencia y no a ti, la respuesta casi siempre pasa por entender RAG. Es la arquitectura que hoy decide qué marcas entran en una respuesta de IA y cuáles quedan fuera. Y la buena noticia es que se puede influir.',
      },
      { tipo: 'h2', texto: 'Qué significa RAG, en simple' },
      {
        tipo: 'parrafo',
        texto:
          'RAG son las siglas de Retrieval-Augmented Generation: generación aumentada por recuperación. Traducido: en lugar de responder solo con lo que "memorizó" durante su entrenamiento, el modelo primero busca información actual en fuentes externas (internet, bases de datos) y recién entonces redacta la respuesta usando ese material.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Es lo que hace que Perplexity, ChatGPT con búsqueda web y el modo de búsqueda de Claude puedan citar páginas concretas y datos recientes, en vez de inventar o quedarse con información vieja.',
      },
      { tipo: 'h2', texto: 'Cómo funciona, paso a paso' },
      {
        tipo: 'lista',
        items: [
          'Recuperación (retrieval): ante tu pregunta, el sistema busca y trae los documentos más relevantes de fuentes externas.',
          'Aumento (augmentation): esos documentos se inyectan como contexto adicional junto a tu pregunta.',
          'Generación (generation): el modelo redacta la respuesta apoyándose en ese contexto, y suele citar de dónde lo sacó.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'La consecuencia clave: si tu marca no aparece en el paso de recuperación, no existe para la respuesta final. No importa cuán buena sea tu oferta — si no te recuperan, no te citan.',
      },
      { tipo: 'h2', texto: 'Por qué RAG decide si la IA cita tu marca' },
      {
        tipo: 'parrafo',
        texto:
          'El paso de recuperación funciona parecido a un buscador: prioriza fuentes accesibles, con autoridad y alineadas con la consulta. Por eso una marca puede tener un gran producto y aun así ser invisible para la IA: si su contenido no es rastreable, no responde preguntas concretas o no aparece en fuentes que el sistema considera confiables, simplemente no entra al material que el modelo usa para responder.',
      },
      {
        tipo: 'cita',
        texto:
          'En la era RAG, no compites por estar en la memoria del modelo. Compites por estar entre los documentos que recupera en el momento exacto en que tu cliente pregunta.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Qué hacer para que RAG te recupere' },
      {
        tipo: 'lista',
        items: [
          'Asegura que tu sitio sea rastreable e indexable — es la puerta de entrada al paso de recuperación.',
          'Crea contenido que responda preguntas concretas de tu categoría, no textos genéricos.',
          'Usa JSON-LD para que la IA lea tu identidad de marca sin equivocarse de entidad.',
          'Construye presencia en fuentes que los sistemas RAG consideran autoritativas para tu industria (reseñas, medios de nicho, foros).',
          'Mide tu Share of Model para saber si, hoy, te están recuperando o no.',
        ],
      },
      {
        tipo: 'parrafo',
        texto:
          'RAG no es magia ni una caja negra inaccesible. Es un proceso de recuperación que premia el contenido accesible, claro y confiable. La marca que entiende esto deja de rogar por aparecer y empieza a construir las señales que hacen que la IA la elija.',
      },
    ],
    ctaTexto: 'Ver si la IA me recupera →',
    ctaUrl: '/auditar/',
    relacionados: ['google-seo-sigue-vivo-busqueda-ia', 'chatgpt-busqueda-web-cambia-geo-2026', '5-hacks-geo-que-google-dice-no-sirven'],
    glosario: [
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
      { slug: 'llm', termino: 'LLM' },
      { slug: 'alucinacion-ia', termino: 'Alucinación de IA' },
    ],
  },
  {
    slug: '5-hacks-geo-que-google-dice-no-sirven',
    titulo: 'Los 5 hacks de GEO que Google dice que NO sirven (y qué hacer en su lugar)',
    descripcion:
      'Google publicó su guía oficial de optimización para búsqueda con IA y desmiente cinco tácticas de GEO populares: LLMS.txt, fragmentar contenido, reescribir para la IA, buscar menciones artificiales y sobre-optimizar structured data. Analizamos qué es ruido y qué sigue importando.',
    fecha: '2026-05-27',
    categoria: 'Análisis LLM',
    tags: ['Google', 'GEO', 'AEO', 'SEO', 'LLMS.txt'],
    autor: 'Ai Visibility',
    tiempoLectura: '7 min',
    destacado: true,
    resumen:
      'En su guía oficial, Google desmiente 5 hacks de GEO: LLMS.txt, fragmentar contenido, reescribir para IA, buscar menciones falsas y sobre-optimizar structured data. La conclusión: los fundamentos de SEO siguen mandando.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Google publicó su guía oficial de optimización para búsqueda potenciada por IA, y el mensaje incomoda a buena parte de la industria del "GEO": la mayoría de los trucos que se venden como secretos para aparecer en respuestas de IA no mueven la aguja. Lo que importa, según Google, son los fundamentos de siempre.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Repasamos los cinco "hacks" que el documento descarta explícitamente, qué tan ciertos son, y dónde Google deja una rendija que conviene entender si tu marca depende de ser citada por la IA.',
      },
      { tipo: 'h2', texto: '1. Archivos LLMS.txt' },
      {
        tipo: 'parrafo',
        texto:
          'La idea de un archivo tipo robots.txt pero para LLM se viralizó en 2025. Google es claro: no necesitas un archivo legible por máquina especial para que la IA entienda tu sitio. Los sistemas usan el mismo contenido HTML que ya rastrean para búsqueda.',
      },
      {
        tipo: 'nota',
        texto:
          'Matiz importante: Google habla de SU buscador con IA. Algunos crawlers de terceros sí leen LLMS.txt, pero como señal marginal. No es donde está tu retorno — un buen contenido indexable rinde mucho más.',
      },
      { tipo: 'h2', texto: '2. Fragmentar el contenido en bloques pequeños' },
      {
        tipo: 'parrafo',
        texto:
          'Se popularizó la idea de partir artículos en "chunks" cortos porque supuestamente así los RAG los digieren mejor. Google lo descarta: no necesitas trocear tu contenido para que funcione en búsqueda con IA. Escribe páginas completas y bien estructuradas.',
      },
      { tipo: 'h2', texto: '3. Reescribir todo para que lo entienda la IA' },
      {
        tipo: 'parrafo',
        texto:
          'No hay un "lenguaje para IA". Google recomienda escribir de forma natural para personas. El contenido claro y bien organizado que sirve a un humano es exactamente el que la IA procesa mejor.',
      },
      { tipo: 'h2', texto: '4. Conseguir menciones de forma artificial' },
      {
        tipo: 'parrafo',
        texto:
          'Sembrar menciones de marca en foros y comentarios para "alimentar" a los LLM tiene bajo valor según Google, comparado con invertir ese esfuerzo en contenido de calidad que la gente cite de forma orgánica.',
      },
      {
        tipo: 'nota',
        texto:
          'Aquí hay que afinar: una mención genuina en un medio de nicho con autoridad sí pesa. Lo que Google descarta es el spam de menciones, no la cobertura editorial real.',
      },
      { tipo: 'h2', texto: '5. Sobre-optimizar el structured data (JSON-LD)' },
      {
        tipo: 'parrafo',
        texto:
          'El más polémico para quienes vendemos GEO: Google dice que el structured data NO es obligatorio para aparecer en respuestas generadas por IA. No es la palanca mágica que muchos pintan.',
      },
      {
        tipo: 'cita',
        texto:
          'Que no sea obligatorio no significa que sea inútil. El JSON-LD no te hace rankear más alto en IA, pero reduce los errores de entidad: evita que ChatGPT te confunda con otra marca, te ubique en el país equivocado o invente tu antigüedad.',
        fuente: 'Análisis Ai Visibility',
      },
      {
        tipo: 'parrafo',
        texto:
          'Nuestra lectura: usa structured data como higiene de datos, no como hack de ranking. Es barato, evita malentendidos costosos de la IA, pero no reemplaza tener buen contenido y reputación real.',
      },
      { tipo: 'h2', texto: 'Qué hacer en su lugar' },
      {
        tipo: 'lista',
        items: [
          'Aplica los fundamentos de SEO: que tu sitio sea rastreable, indexable y rápido.',
          'Crea contenido con perspectiva propia, no genérico. La IA premia la experiencia real, no el refrito.',
          'Consigue menciones orgánicas en fuentes con autoridad de tu nicho.',
          'Usa JSON-LD para precisión de entidad, no esperando que te suba en el ranking.',
          'Mide tu Share of Model para saber si todo esto está funcionando en ChatGPT y Perplexity, no solo en Google.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'Recuerda: esta guía es de Google sobre su propio buscador con IA. ChatGPT y Perplexity tienen mecánicas distintas. Lo que Google minimiza (structured data, menciones) puede pesar diferente en otros motores. Por eso conviene auditar cada uno por separado.',
      },
    ],
    ctaTexto: 'Auditar mi Share of Model →',
    ctaUrl: '/auditar/',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'contenido-commodity-vs-experiencia-real-ia', 'jsonld-organization-chile'],
  },
  {
    slug: 'google-seo-sigue-vivo-busqueda-ia',
    titulo: 'Google confirmó que el SEO sigue vivo en la era de la búsqueda con IA',
    descripcion:
      'La guía oficial de Google despeja el pánico del "SEO murió": los sistemas de ranking siguen siendo la base, incluso cuando la respuesta la genera una IA. Explicamos en simple cómo funcionan RAG y sub-query generation, y qué significa para tu marca.',
    fecha: '2026-05-23',
    categoria: 'Noticias IA',
    tags: ['Google', 'SEO', 'RAG', 'Búsqueda IA'],
    autor: 'Ai Visibility',
    tiempoLectura: '6 min',
    resumen:
      'Google confirma que sus sistemas de ranking siguen siendo la base de la búsqueda con IA. RAG y sub-query generation usan el mismo índice de siempre: si no rankeas, la IA no te cita.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Cada pocos meses alguien declara muerto al SEO. La guía oficial de Google para búsqueda con IA pone las cosas en su lugar: los sistemas de ranking centrales siguen siendo la base. La IA no reemplaza al índice de búsqueda — se apoya en él.',
      },
      { tipo: 'h2', texto: 'Cómo genera respuestas la IA de Google' },
      {
        tipo: 'parrafo',
        texto:
          'Google describe dos técnicas que conviene entender porque explican por qué el SEO sigue mandando.',
      },
      { tipo: 'h3', texto: 'RAG (Retrieval-Augmented Generation)' },
      {
        tipo: 'parrafo',
        texto:
          'La IA no responde solo de memoria. Primero recupera documentos relevantes del índice de búsqueda y luego genera la respuesta a partir de ellos. Traducción: si tu página no está indexada o no rankea para la consulta, no entra en el material que la IA usa para responder.',
      },
      { tipo: 'h3', texto: 'Sub-query generation' },
      {
        tipo: 'parrafo',
        texto:
          'Ante una pregunta compleja, la IA la descompone en varias búsquedas más pequeñas, recupera resultados para cada una y los sintetiza. Esto multiplica las oportunidades de aparecer: una página puede ser citada por responder muy bien una sub-pregunta específica, aunque no sea la mejor para la consulta general.',
      },
      {
        tipo: 'nota',
        texto:
          'Implicancia práctica: el contenido que responde preguntas específicas y concretas tiene más chances de ser recuperado que el genérico que intenta abarcarlo todo.',
      },
      { tipo: 'h2', texto: 'Qué cambia y qué no' },
      {
        tipo: 'lista',
        items: [
          'No cambia: necesitas estar indexado, ser rastreable y rankear. Eso es la puerta de entrada.',
          'No cambia: la calidad y autoridad del contenido siguen decidiendo si te eligen.',
          'Sí cambia: el formato de la respuesta. El usuario puede resolver su duda sin hacer click, así que aparecer en la síntesis importa tanto como el ranking azul clásico.',
          'Sí cambia: ganan las páginas que responden sub-preguntas precisas, no solo las que apuntan a keywords amplias.',
        ],
      },
      { tipo: 'h2', texto: 'AEO, GEO… ¿es lo mismo que SEO?' },
      {
        tipo: 'parrafo',
        texto:
          'Google básicamente dice que no hay una disciplina nueva mágica: buen SEO es lo que te hace visible en su búsqueda con IA. Dicho eso, en Ai Visibility creemos que sí hay una capa adicional cuando hablas de ChatGPT o Perplexity, motores que no usan el índice de Google. Ahí el SEO clásico es necesario pero no suficiente.',
      },
      {
        tipo: 'cita',
        texto:
          'En el buscador de Google, GEO es básicamente SEO bien hecho. Fuera de Google, en ChatGPT o Perplexity, las reglas del juego cambian — y ahí es donde medir tu Share of Model deja de ser opcional.',
        fuente: 'Análisis Ai Visibility',
      },
    ],
    ctaTexto: 'Ver si la IA me cita →',
    ctaUrl: '/auditar/',
    relacionados: ['guia-google-ia-acciones-marca-chilena', '5-hacks-geo-que-google-dice-no-sirven', 'chatgpt-busqueda-web-cambia-geo-2026'],
  },
  {
    slug: 'contenido-commodity-vs-experiencia-real-ia',
    titulo: 'Contenido "commodity" vs. experiencia real: qué premia la IA según Google',
    descripcion:
      'El corazón de la guía de Google es uno: la IA no necesita más contenido genérico, necesita perspectiva real. Qué es el contenido commodity, por qué la IA lo ignora, y cómo una pyme puede ganar con experiencia que los grandes no tienen.',
    fecha: '2026-05-24',
    categoria: 'GEO & AEO',
    tags: ['Google', 'Contenido', 'E-E-A-T', 'GEO'],
    autor: 'Ai Visibility',
    tiempoLectura: '6 min',
    resumen:
      'Google premia contenido con perspectiva propia y experiencia real, no el genérico que ya existe mil veces. Para una pyme, esto es una ventaja: tu experiencia de nicho es lo que los grandes no pueden replicar.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Si hay una sola idea que rescatar de la guía de Google sobre búsqueda con IA, es esta: el contenido commodity ya no sirve. La IA tiene infinito acceso a información genérica. Lo que necesita —y premia— es perspectiva que no encuentre en otra parte.',
      },
      { tipo: 'h2', texto: 'Qué es contenido "commodity"' },
      {
        tipo: 'parrafo',
        texto:
          'Es el contenido que repite lo que cualquiera ya sabe: "5 tips para elegir zapatillas", "qué considerar al comprar un notebook". Información correcta, pero sin nada que la diferencie de las otras mil páginas iguales. Para la IA, ese contenido es intercambiable — y por eso prescindible.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Google contrapone el ejemplo: en vez de tips genéricos de compra, una reseña basada en uso real, con detalles que solo tiene quien probó el producto de verdad. Eso es lo que la IA cita.',
      },
      { tipo: 'h2', texto: 'Las señales que Google nombra' },
      {
        tipo: 'lista',
        items: [
          'Perspectiva única: una opinión, un dato propio, una experiencia que no se puede copiar.',
          'Contenido people-first: escrito para ayudar a una persona, no para rankear.',
          'Confianza y autoría: que se note quién lo escribe y por qué tiene autoridad para hacerlo.',
          'Medios de calidad: imágenes y videos propios, no de stock genérico.',
          'Sin inflar variantes: no generes 50 versiones casi iguales de la misma página para manipular el ranking.',
        ],
      },
      { tipo: 'h2', texto: 'Por qué esto favorece a una pyme' },
      {
        tipo: 'parrafo',
        texto:
          'Suena contraintuitivo, pero la regla de "experiencia real sobre volumen" nivela la cancha. Una tienda especializada tiene algo que Falabella no puede fabricar a escala: conocimiento profundo y específico de su nicho.',
      },
      {
        tipo: 'cita',
        texto:
          'No vas a ganarle a un retailer gigante en cobertura. Pero sí puedes dominar la consulta específica donde tu experiencia real es insuperable. La IA busca exactamente eso.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Sobre usar IA para escribir tu contenido' },
      {
        tipo: 'parrafo',
        texto:
          'Google no prohíbe usar IA generativa para crear contenido, pero sí advierte: el valor lo aporta tu experiencia y criterio, no el texto autogenerado. Usa la IA como herramienta de redacción, no como reemplazo de tu conocimiento. Contenido autogenerado en masa, sin aporte real, cae justo en la categoría commodity que la IA ignora.',
      },
    ],
    ctaTexto: 'Auditar mi contenido →',
    ctaUrl: '/auditar/',
    relacionados: ['guia-google-ia-acciones-marca-chilena', '5-hacks-geo-que-google-dice-no-sirven', 'google-seo-sigue-vivo-busqueda-ia'],
  },
  {
    slug: 'checklist-tecnico-google-busqueda-ia',
    titulo: 'Checklist técnico de Google para aparecer en la búsqueda con IA',
    descripcion:
      'La base técnica que Google exige para que tu sitio entre en sus respuestas con IA: rastreabilidad, HTML semántico, JavaScript, page experience y manejo de contenido duplicado. Checklist accionable para revisar hoy.',
    fecha: '2026-05-25',
    categoria: 'Tutoriales',
    tags: ['Google', 'SEO técnico', 'Crawlability', 'HTML semántico'],
    autor: 'Ai Visibility',
    tiempoLectura: '7 min',
    resumen:
      'Antes de optimizar contenido, tu sitio debe ser técnicamente apto. Checklist de Google: rastreable, indexable, HTML semántico, JS bien manejado, rápido y sin duplicados.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Puedes tener el mejor contenido del mundo, pero si la IA de Google no puede rastrear ni entender tu sitio, no existes para ella. La guía oficial deja claro que la estructura técnica es el cimiento. Aquí está el checklist, traducido a acciones.',
      },
      { tipo: 'h2', texto: '1. Rastreabilidad e indexación' },
      {
        tipo: 'lista',
        items: [
          'Verifica que tus páginas clave no estén bloqueadas en robots.txt por error.',
          'Confirma que no tengan noindex involuntario.',
          'Revisa la cobertura en Google Search Console: lo que no está indexado, no entra en RAG.',
        ],
      },
      { tipo: 'h2', texto: '2. HTML semántico' },
      {
        tipo: 'parrafo',
        texto:
          'Usa las etiquetas por lo que significan, no solo por cómo se ven. Un h1 para el título, h2/h3 para la jerarquía, listas reales para enumeraciones. La IA usa esa estructura para entender de qué trata cada sección.',
      },
      {
        tipo: 'codigo',
        lenguaje: 'html',
        codigo: `<!-- Bien: estructura semántica clara -->
<article>
  <h1>Guía de compra de notebooks</h1>
  <h2>Mejor opción para diseño gráfico</h2>
  <p>...</p>
  <h2>Mejor relación precio-rendimiento</h2>
  <ul>
    <li>...</li>
  </ul>
</article>`,
      },
      { tipo: 'h2', texto: '3. JavaScript que no esconda tu contenido' },
      {
        tipo: 'parrafo',
        texto:
          'Si tu contenido principal solo aparece tras ejecutar JavaScript, corres riesgo de que no se indexe bien. Asegúrate de que el texto importante esté disponible en el HTML renderizado. Prueba con la herramienta de inspección de URL de Search Console.',
      },
      { tipo: 'h2', texto: '4. Page experience y velocidad' },
      {
        tipo: 'lista',
        items: [
          'Optimiza los Core Web Vitals: carga, interactividad y estabilidad visual.',
          'Que el sitio funcione bien en móvil — la mayoría de las consultas vienen de ahí.',
          'Evita intersticiales agresivos que tapen el contenido.',
        ],
      },
      { tipo: 'h2', texto: '5. Controla el contenido duplicado' },
      {
        tipo: 'parrafo',
        texto:
          'URLs duplicadas diluyen tu señal y confunden a la IA sobre cuál versión citar. Usa etiquetas canonical para indicar la versión principal y consolida las variantes.',
      },
      {
        tipo: 'nota',
        texto:
          'Este checklist es para el buscador de Google. Pero la buena noticia es que un sitio técnicamente sano también es más fácil de rastrear para los crawlers de OpenAI y Perplexity. La higiene técnica rinde en todos los motores.',
      },
    ],
    ctaTexto: 'Auditar mi visibilidad →',
    ctaUrl: '/auditar/',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'jsonld-organization-chile', '5-hacks-geo-que-google-dice-no-sirven'],
  },
  {
    slug: 'comercio-conversacional-agentes-ucp',
    titulo: 'Comercio conversacional y agentes de compra: qué es UCP y por qué importa',
    descripcion:
      'Google adelanta el siguiente capítulo: agentes de IA que reservan, comparan y compran por el usuario, y protocolos como Universal Commerce Protocol (UCP). Qué significa para tu e-commerce y cómo prepararte sin volverte loco.',
    fecha: '2026-05-26',
    categoria: 'Noticias IA',
    tags: ['Agentes IA', 'UCP', 'E-commerce', 'Comercio conversacional'],
    autor: 'Ai Visibility',
    tiempoLectura: '6 min',
    resumen:
      'Google describe agentes de IA que ejecutan tareas (reservar, comparar, comprar) y protocolos como UCP. Para el e-commerce, el nuevo cliente puede ser un agente, no una persona navegando.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'La parte más futurista de la guía de Google es también la más estratégica: las experiencias agénticas. No hablamos de un chatbot que responde, sino de agentes de IA que ejecutan tareas por el usuario — reservar una mesa, comparar productos, completar una compra.',
      },
      { tipo: 'h2', texto: 'Dos tipos de agentes que ya existen' },
      {
        tipo: 'lista',
        items: [
          'Agentes autónomos: reciben un objetivo ("encuéntrame la mejor opción para X y cómprala") y lo ejecutan consultando múltiples fuentes.',
          'Agentes de navegador: acceden a tu sitio visualmente, como lo haría una persona, e interactúan con la interfaz para completar acciones.',
        ],
      },
      { tipo: 'h2', texto: 'Universal Commerce Protocol (UCP)' },
      {
        tipo: 'parrafo',
        texto:
          'Google menciona protocolos emergentes como UCP, pensados para que los agentes y las tiendas "hablen el mismo idioma" en transacciones. La idea: estandarizar cómo un agente consulta stock, precio, despacho y completa una compra sin fricción.',
      },
      {
        tipo: 'nota',
        texto:
          'Es temprano. No necesitas implementar UCP hoy. Pero sí necesitas que la información crítica de tu negocio —precio, stock, despacho, condiciones— sea accesible y precisa, porque eso es lo que un agente va a consultar para decidir.',
      },
      { tipo: 'h2', texto: 'Qué cambia para tu e-commerce' },
      {
        tipo: 'parrafo',
        texto:
          'El cambio mental es grande: tu próximo cliente podría no ser una persona navegando tu web, sino un agente evaluando tu oferta contra la de tu competencia en segundos. Ese agente no se deja seducir por tu diseño — se fija en datos claros y confiables.',
      },
      {
        tipo: 'cita',
        texto:
          'Cuando un agente compra por el usuario, la decisión se toma sobre datos, no sobre branding. La marca que tenga su información estructurada, actualizada y consistente gana la transacción.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Cómo prepararte sin sobre-reaccionar' },
      {
        tipo: 'lista',
        items: [
          'Mantén tu Google Business Profile y feeds de Merchant Center actualizados y correctos.',
          'Asegura consistencia: el precio y stock que muestra tu web debe coincidir con lo que ven los agregadores.',
          'Declara con claridad despacho, garantías y condiciones — son los datos que un agente compara.',
          'Monitorea cómo te describe la IA hoy: si ya te malinterpreta como fuente de información, te malinterpretará como opción de compra.',
        ],
      },
    ],
    ctaTexto: 'Ver cómo me describe la IA →',
    ctaUrl: '/auditar/',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'perplexity-vs-chatgpt-citas-2026', 'chatgpt-busqueda-web-cambia-geo-2026'],
  },
  {
    slug: 'guia-google-ia-acciones-marca-chilena',
    titulo: 'La guía de Google para búsqueda con IA, traducida a acciones para una marca chilena',
    descripcion:
      'Resumen completo y accionable de la guía oficial de Google sobre optimización para búsqueda con IA: qué priorizar, qué ignorar y qué vigilar. Todo aterrizado al contexto de una marca o pyme en Chile.',
    fecha: '2026-05-27',
    categoria: 'GEO & AEO',
    tags: ['Google', 'GEO', 'AEO', 'Guía', 'Chile'],
    autor: 'Ai Visibility',
    tiempoLectura: '9 min',
    resumen:
      'La guía de Google se resume en cuatro acciones: prioriza los fundamentos de SEO, crea contenido con experiencia real, ignora los hacks de GEO y vigila los agentes de IA. Aquí, aterrizada a una marca chilena.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Google publicó su guía oficial de optimización para búsqueda con IA y, en vez de revelar trucos nuevos, hace lo contrario: ordena el ruido. Este es el resumen completo, traducido a lo que realmente debe hacer una marca o pyme en Chile. Es el post pilar — al final tienes los enlaces a cada tema en profundidad.',
      },
      { tipo: 'h2', texto: '1. Prioriza los fundamentos de SEO' },
      {
        tipo: 'parrafo',
        texto:
          'La búsqueda con IA se apoya en los sistemas de ranking de siempre, vía RAG y sub-query generation. Si no estás indexado y no rankeas, la IA no tiene de dónde citarte. Lo técnico no es opcional: rastreabilidad, HTML semántico, velocidad y cero duplicados.',
      },
      {
        tipo: 'nota',
        texto:
          'Profundizamos en esto en "Google confirmó que el SEO sigue vivo" y en el "Checklist técnico de Google".',
      },
      { tipo: 'h2', texto: '2. Crea contenido con experiencia real, no commodity' },
      {
        tipo: 'parrafo',
        texto:
          'La IA tiene infinito contenido genérico. Premia la perspectiva única, la autoría clara y la experiencia que no se puede copiar. Para una pyme chilena, tu conocimiento profundo de nicho es la ventaja que ningún retailer grande puede replicar a escala.',
      },
      { tipo: 'h2', texto: '3. Ignora los hacks de GEO' },
      {
        tipo: 'parrafo',
        texto:
          'Google descarta cinco tácticas populares: LLMS.txt, fragmentar contenido, reescribir para la IA, sembrar menciones artificiales y sobre-optimizar structured data. No gastes energía ahí. El structured data sigue siendo útil para precisión de entidad, pero no es una palanca de ranking.',
      },
      { tipo: 'h2', texto: '4. Vigila los agentes de IA' },
      {
        tipo: 'parrafo',
        texto:
          'Lo que viene: agentes que reservan, comparan y compran por el usuario, y protocolos como UCP. No necesitas implementarlos hoy, pero sí mantener tu información de negocio (precio, stock, despacho) precisa y consistente, porque será lo que un agente consulte para decidir.',
      },
      { tipo: 'h2', texto: 'El matiz que Google no resuelve por ti' },
      {
        tipo: 'parrafo',
        texto:
          'Toda esta guía es de Google sobre SU buscador con IA. Pero tus clientes también preguntan en ChatGPT, Perplexity y Gemini — motores que no usan el índice de Google y pesan distinto las señales. Seguir solo a Google te optimiza para una parte del mapa, no para todo.',
      },
      {
        tipo: 'cita',
        texto:
          'Los fundamentos de Google son la base. Pero tu Share of Model en ChatGPT y Perplexity es un dato aparte que Google no te va a dar — y que cada vez decide más compras.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Tu plan en una semana' },
      {
        tipo: 'lista',
        items: [
          'Día 1: audita tu Share of Model en ChatGPT y Perplexity para tu categoría (gratis).',
          'Día 2: revisa el checklist técnico — indexación, velocidad, duplicados.',
          'Día 3-4: identifica una pieza de contenido commodity y reescríbela con experiencia real.',
          'Día 5: actualiza tu Google Business Profile y JSON-LD de Organization para precisión de entidad.',
          'Continuo: publica con regularidad y vuelve a medir cómo te cita la IA.',
        ],
      },
    ],
    ctaTexto: 'Auditar mi marca gratis →',
    ctaUrl: '/auditar/',
    relacionados: ['5-hacks-geo-que-google-dice-no-sirven', 'contenido-commodity-vs-experiencia-real-ia', 'checklist-tecnico-google-busqueda-ia'],
  },
  {
    slug: 'chatgpt-busqueda-web-cambia-geo-2026',
    titulo: 'ChatGPT con búsqueda web por defecto: lo que cambia para tu marca en 2026',
    descripcion:
      'OpenAI activó búsqueda web nativa en todas las consultas de ChatGPT. Qué significa para el GEO de tu marca, qué señales pesan más ahora y cómo prepararte sin tocar tu presupuesto de SEO.',
    fecha: '2026-05-22',
    categoria: 'Noticias IA',
    tags: ['ChatGPT', 'GEO', 'Search', 'OpenAI'],
    autor: 'Ai Visibility',
    tiempoLectura: '6 min',
    resumen:
      'Desde mayo 2026, ChatGPT consulta la web en la mayoría de respuestas. Las marcas con JSON-LD y reseñas recientes ganan posición; las que dependen del modelo entrenado retroceden.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'La actualización pasó casi sin titulares, pero su impacto en cómo los LLM recomiendan marcas es estructural. ChatGPT ahora resuelve la mayoría de consultas con un paso intermedio de búsqueda web — incluyendo preguntas que antes contestaba desde su corpus de entrenamiento.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Para una marca, esto significa que la fecha de corte del modelo dejó de ser la barrera principal. Lo que importa hoy es qué fuentes responde el crawler de OpenAI cuando alguien pregunta por tu categoría.',
      },
      { tipo: 'h2', texto: 'Qué cambió exactamente' },
      {
        tipo: 'lista',
        items: [
          'La búsqueda web ya no es opt-in: se activa automáticamente cuando ChatGPT detecta intención informacional o comercial.',
          'Las citas aparecen como tarjetas inline, no como nota al pie. Eso cambia el patrón de click y la atribución.',
          'El ranking de fuentes prioriza autoridad de dominio + frescura + alineación con la query — muy similar a un buscador clásico, pero con un re-ranker semántico encima.',
        ],
      },
      { tipo: 'h2', texto: 'Tres señales que ganaron peso' },
      {
        tipo: 'h3',
        texto: '1. JSON-LD estructurado en homepage y páginas de producto',
      },
      {
        tipo: 'parrafo',
        texto:
          'Las marcas que declaran su entidad (Organization, Product, FAQ) son recogidas con mayor precisión. Sin schema, ChatGPT infiere — y suele inferir mal cuando hay nombres similares en el mismo mercado.',
      },
      { tipo: 'h3', texto: '2. Reseñas indexadas en los últimos 90 días' },
      {
        tipo: 'parrafo',
        texto:
          'Google Reviews, Trustpilot y Reclamos.cl siguen siendo las fuentes más consultadas para evaluar confianza. Una marca con últimas reseñas hace 8 meses se lee como inactiva.',
      },
      { tipo: 'h3', texto: '3. Menciones en medios de nicho con frescura' },
      {
        tipo: 'parrafo',
        texto:
          'No necesitas El Mercurio. Una nota en un blog técnico chileno con publicación reciente pesa más que un artículo de 2023 en un medio nacional.',
      },
      {
        tipo: 'nota',
        texto:
          'Si tu última cobertura de prensa es de 2024, tu marca aparece "congelada" para los modelos con búsqueda web. La frescura ahora es una señal de ranking, no un nice-to-have.',
      },
      { tipo: 'h2', texto: 'Qué hacer esta semana' },
      {
        tipo: 'lista',
        items: [
          'Audita tu Share of Model en consultas representativas de tu categoría (gratis con Ai Visibility).',
          'Implementa JSON-LD de tipo Organization en el header global del sitio.',
          'Pide 5 reseñas a clientes recientes para refrescar la señal temporal.',
          'Publica una pieza de contenido propio (caso, análisis, dato) que un medio o blog de nicho pueda citar.',
        ],
      },
    ],
    ctaTexto: 'Auditar mi marca →',
    ctaUrl: '/auditar/',
    relacionados: ['perplexity-vs-chatgpt-citas-2026', 'jsonld-organization-chile'],
  },
  {
    slug: 'perplexity-vs-chatgpt-citas-2026',
    titulo: 'Perplexity vs ChatGPT: cómo citan marcas y cuál te conviene optimizar primero',
    descripcion:
      'Análisis comparativo del patrón de citas de Perplexity y ChatGPT en 2026. Datos de 1.200 consultas en español sobre cuál cita más, con qué frecuencia, y qué fuentes prioriza cada uno.',
    fecha: '2026-05-19',
    categoria: 'Análisis LLM',
    tags: ['Perplexity', 'ChatGPT', 'Citas', 'GEO'],
    autor: 'Ai Visibility',
    tiempoLectura: '8 min',
    resumen:
      'Perplexity cita 4,2 fuentes por respuesta promedio; ChatGPT cita 2,1. Pero la conversión a tráfico es distinta: Perplexity envía clicks, ChatGPT envía decisión sin click.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Pasamos 1.200 consultas en español por ambos motores durante abril 2026, en seis verticales (e-commerce, SaaS, salud, banca, retail e inmobiliaria). El patrón que emergió no es el que esperábamos.',
      },
      { tipo: 'h2', texto: 'Citas: cantidad vs calidad' },
      {
        tipo: 'lista',
        items: [
          'Perplexity: 4,2 fuentes promedio por respuesta, con citas visibles inline.',
          'ChatGPT (con búsqueda web): 2,1 fuentes promedio, citas a veces colapsadas en una tarjeta.',
          'Solapamiento de fuentes citadas entre ambos: solo 31%.',
        ],
      },
      {
        tipo: 'parrafo',
        texto:
          'La conclusión interesante: no son competidores midiendo lo mismo. Perplexity actúa como un motor de búsqueda con resumen; ChatGPT actúa como un consejero que ocasionalmente verifica.',
      },
      { tipo: 'h2', texto: 'Qué optimizar primero' },
      {
        tipo: 'parrafo',
        texto:
          'Si tu marca depende de tráfico de descubrimiento, prioriza Perplexity: cita más, link más, y los clicks llegan con intención investigativa. Si tu marca depende de cierre de decisión (alguien que ya conoce la categoría y elige proveedor), prioriza ChatGPT: cita menos, pero su recomendación cierra la compra.',
      },
      {
        tipo: 'cita',
        texto:
          'Estar en Perplexity te trae usuarios investigando. Estar en ChatGPT te trae usuarios decidiendo. El segundo grupo es más pequeño pero convierte 3x más en B2B.',
        fuente: 'Análisis Ai Visibility, abril 2026',
      },
    ],
    ctaTexto: 'Ver mi Share of Model →',
    ctaUrl: '/auditar/',
    relacionados: ['chatgpt-busqueda-web-cambia-geo-2026'],
  },
  {
    slug: 'jsonld-organization-chile',
    titulo: 'JSON-LD Organization para marcas chilenas: plantilla lista para copiar',
    descripcion:
      'Plantilla de JSON-LD tipo Organization optimizada para marcas chilenas que quieren aparecer correctamente en ChatGPT, Perplexity y AI Overviews de Google. Incluye campos críticos y errores comunes.',
    fecha: '2026-05-12',
    categoria: 'Tutoriales',
    tags: ['JSON-LD', 'Schema', 'GEO', 'Chile'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Plantilla copy-paste de JSON-LD Organization con los campos que los LLM realmente leen. Incluye sameAs, areaServed y aggregateRating.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'El 80% de los JSON-LD que auditamos en marcas chilenas están incompletos o mal formados. El problema no es técnico — es que las guías genéricas omiten los campos que los LLM realmente usan para validar entidad.',
      },
      { tipo: 'h2', texto: 'Plantilla base' },
      {
        tipo: 'codigo',
        lenguaje: 'json',
        codigo: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://tumarca.cl/#organization",
  "name": "Tu Marca",
  "url": "https://tumarca.cl",
  "logo": "https://tumarca.cl/logo.png",
  "description": "Descripción concisa de qué hace tu marca y para quién.",
  "foundingDate": "2018",
  "areaServed": { "@type": "Country", "name": "Chile" },
  "sameAs": [
    "https://www.linkedin.com/company/tumarca",
    "https://www.instagram.com/tumarca",
    "https://x.com/tumarca"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "areaServed": "CL",
    "availableLanguage": ["Spanish"]
  }
}`,
      },
      { tipo: 'h2', texto: 'Campos que hacen la diferencia' },
      {
        tipo: 'lista',
        items: [
          'foundingDate: los LLM lo usan como señal de antigüedad. Marcas con >5 años se citan más en consultas de "confiable".',
          'sameAs: conecta tu entidad con perfiles externos. Sin esto, la IA no puede confirmar que tu marca es real.',
          'areaServed: evita que ChatGPT te recomiende a clientes en México o España cuando solo despachas en Chile.',
          'aggregateRating: si tienes reseñas reales en Google, declararlas en JSON-LD acelera la indexación de la señal.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'Nunca inventes aggregateRating. Google y los LLM cruzan el dato con fuentes externas — un rating declarado sin reseñas verificables te penaliza más de lo que ayuda.',
      },
    ],
    ctaTexto: 'Auditar mi JSON-LD →',
    ctaUrl: '/auditar/',
    relacionados: ['chatgpt-busqueda-web-cambia-geo-2026'],
  },
]

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getPostsOrdenados(): Post[] {
  return [...posts].sort((a, b) => b.fecha.localeCompare(a.fecha))
}

export function getPostsRelacionados(slugs: string[] = []): Post[] {
  return slugs.map((s) => getPost(s)).filter((p): p is Post => Boolean(p))
}

export function getCategorias(): string[] {
  return Array.from(new Set(posts.map((p) => p.categoria)))
}
