export type BloqueBlog =
  | { tipo: 'parrafo'; texto: string }
  | { tipo: 'h2'; texto: string }
  | { tipo: 'h3'; texto: string }
  | { tipo: 'lista'; items: string[] }
  | { tipo: 'cita'; texto: string; fuente?: string }
  | { tipo: 'codigo'; lenguaje?: string; codigo: string }
  | { tipo: 'nota'; texto: string }
  | { tipo: 'referencias'; items: { label: string; url: string }[] }

export type Post = {
  slug: string
  titulo: string
  descripcion: string
  fecha: string
  fechaActualizacion?: string
  categoria: 'Noticias iA' | 'Análisis LLM' | 'GEO & AEO' | 'Casos & Datos' | 'Tutoriales'
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
    slug: '8-reglas-google-sitios-aptos-agentes',
    titulo: 'Google publicó 8 reglas para que tu sitio sea apto para agentes — y son las mismas 8 reglas de accesibilidad que llevas posponiendo',
    descripcion:
      'Google publicó en web.dev una guía oficial para hacer sitios apto para agentes de iA: 8 reglas técnicas concretas. El detalle interesante: cada una es una pauta de accesibilidad WCAG existente, solo que dirigida a otra audiencia. Una sola inversión, dos audiencias recuperadas.',
    fecha: '2026-06-02',
    categoria: 'Tutoriales',
    tags: ['Google', 'Agentes iA', 'Accesibilidad', 'WCAG', 'Tailwind', 'Semantic HTML'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Google publicó en web.dev (abril 2026) 8 reglas técnicas para hacer tu sitio apto para agentes de iA: HTML semántico, cursor: pointer, labels asociadas, layout estable, sin overlays fantasma, elementos > 8 px². Cada regla es una pauta WCAG existente. Si ya inviertes en accesibilidad, tu sitio ya es agent-friendly. Y al revés.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'El 1 de abril de 2026, Google publicó en web.dev una guía oficial para hacer sitios apto para agentes de iA. Son 8 reglas técnicas, escritas por el equipo de Chrome para developers. La novedad no es que existan — es lo que se ve cuando las miras al lado de la guía WCAG: son exactamente las mismas reglas que llevamos años pidiendo para usuarios con tecnología asistiva.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Para una marca chilena que tiene la accesibilidad en "lista de pendientes" desde hace tres años, la noticia es buena: el ROI dejó de ser solo ético — ahora también es comercial. Una sola auditoría, dos audiencias recuperadas.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Si tienes prisa, esto se reduce a tres cambios concretos que puedes hacer esta semana: (1) arreglar el cursor de tus botones, (2) auditar tus 5 páginas críticas y (3) ordenar la semántica de tus formularios. Abajo está el contexto y, al final, el detalle accionable de cada uno.',
      },
      { tipo: 'h2', texto: 'Cómo "ven" los agentes tu sitio' },
      {
        tipo: 'parrafo',
        texto:
          'Antes de las reglas, conviene entender el qué. Un agente de iA (Chrome auto-browse, Gemini Spark, ChatGPT con navegación) no consume tu sitio como humano. Lo procesa con 3 modalidades:',
      },
      {
        tipo: 'lista',
        items: [
          'Capturas de pantalla — modelos de visión analizan la página renderizada, identifican elementos por color, tamaño y proximidad. Caro en tokens, se usa como respaldo.',
          'HTML / DOM — análisis de la jerarquía estructural, atributos, anidación. Un botón "Comprar" dentro de un contenedor de producto es legible como "acción de compra del producto".',
          'Árbol de accesibilidad — la API nativa del navegador que destila roles, nombres y estados. Es el "resumen semántico" que ignora el ruido visual. Es lo que mejor entiende un agente.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'La regla implícita: si tu sitio depende solo de capturas de pantalla para ser entendido (porque tu DOM es un mar de divs sin semántica), eres caro de procesar — y los agentes te abandonan.',
      },
      { tipo: 'h2', texto: 'Las 8 reglas oficiales de Google' },
      {
        tipo: 'parrafo',
        texto:
          'Estas son las 8 reglas que Google publicó. Al lado de cada una marco la pauta WCAG que es exactamente la misma idea, escrita para otra audiencia:',
      },
      {
        tipo: 'lista',
        items: [
          '1. Refleja cada acción en la interfaz. Cuando el usuario (o el agente) hace click en "Agregar al carro", tiene que pasar algo visible. Acciones silenciosas son invisibles para agentes. (WCAG 4.1.3, mensajes de estado)',
          '2. Mantén el layout estable. Elementos interactivos en posiciones consistentes entre páginas. Saltos visuales rompen el análisis. (WCAG 3.2, predecible)',
          '3. Sin elementos fantasma ni superposiciones transparentes. Cualquier elemento que cubra un componente interactivo lo descarta del análisis visual, aunque sea transparente. (WCAG 2.4.7, foco visible)',
          '4. Usa HTML semántico. <button>, <a>, <nav>, <main>. Nada de divs estilizados para botones. (WCAG 4.1.2, nombre, rol, valor)',
          '5. Si no puedes usar HTML semántico, usa role y tabindex como fallback. <div role="button" tabindex="0"> es legible. <div onclick="..."> sin más es invisible para agentes y para lectores de pantalla.',
          '6. cursor: pointer en CSS para elementos interactivos. "Una señal fuerte de accionabilidad", según Google literalmente. (WCAG 1.3.3, características sensoriales)',
          '7. Asocia <label> a <input> con el atributo for. Mapea el texto visible al campo subyacente. Sin esto, ni el agente ni el lector de pantalla saben qué campo es cuál. (WCAG 1.3.1, info y relaciones)',
          '8. Elementos interactivos > 8 píxeles cuadrados. Los modelos de visión filtran lo más chico. (WCAG 2.5.5, tamaño del objetivo)',
        ],
      },
      { tipo: 'h2', texto: 'El bug de Tailwind v4 que rompe la regla 6 (y muchas pymes chilenas lo tienen)' },
      {
        tipo: 'parrafo',
        texto:
          'Tailwind CSS v4 cambió el estilo nativo de los botones de cursor: pointer a cursor: default. Si tu sitio usa Tailwind v4 (mucha pyme chilena modernizó a v4 en 2025), todos tus <button> nativos rompen la regla 6 de Google sin que lo sepas. El fix son tres líneas en tu CSS global:',
      },
      {
        tipo: 'codigo',
        lenguaje: 'css',
        codigo: `@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}`,
      },
      {
        tipo: 'parrafo',
        texto:
          'Cinco minutos de trabajo. Vuelves a cumplir la regla 6 — y, de paso, WCAG 1.3.3.',
      },
      { tipo: 'h2', texto: 'La oportunidad: una inversión, dos audiencias' },
      {
        tipo: 'parrafo',
        texto:
          'La mayoría de los equipos de producto chilenos tratan accesibilidad y "preparación para iA" como dos workstreams distintos. Distintos planes, distintos presupuestos, distintos plazos. Es desperdicio.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Las 8 reglas de Google son la misma auditoría que pasa una persona con lector de pantalla. La empresa que se toma WCAG en serio ya tiene 80% del trabajo hecho para Chrome auto-browse, Gemini Spark y los agentes que vienen. La empresa que lo posterga paga dos veces: en clientes con discapacidad que no pueden completar la compra, y en agentes de iA que mandan al cliente a la competencia.',
      },
      {
        tipo: 'cita',
        texto:
          'Todo lo que sugerimos para que un sitio esté listo para agentes, también lo hace mejor para humanos.',
        fuente: 'Kasper Kulikowski y Omkar More — Equipo Chrome, web.dev',
      },
      {
        tipo: 'nota',
        texto:
          'Dato curioso: las búsquedas de "web accessibility" en Google Trends se mantuvieron planas entre 2021 y 2024, y se cuadruplicaron en 2025-2026 — cuando la cobertura de agentes de iA empezó a alinearse con accesibilidad. La presión de proveedores movió la aguja más que la regulación de la European Accessibility Act (vigente desde junio 2025).',
      },
      { tipo: 'h2', texto: 'Los 3 cambios concretos que puedes hacer esta semana' },
      {
        tipo: 'lista',
        items: [
          'Cambio 1 — Arregla el cursor (5 minutos). Si usas Tailwind v4, pega el snippet de cursor: pointer en tu globals.css. Recuperas la regla 6 de un golpe en todos los botones del sitio, sin tocar componente por componente.',
          'Cambio 2 — Audita tus 5 páginas críticas (30 minutos). Homepage, formulario de captura, página de producto principal, checkout y login: pásales un Lighthouse en categoría Accessibility más un escaneo con axe DevTools o WAVE (los dos gratis). Anota cada error de "name/role" y cada botón primario con contraste bajo 4.5:1 — la iA usa ese mismo criterio para decidir si algo "se ve clickeable".',
          'Cambio 3 — Ordena la semántica de tus formularios (1 a 2 horas). Cada <input> con su <label for="...">, cada botón como <button> nativo (no un <div onclick>), y los mensajes de error en texto legible por máquinas, no solo iconos rojos. Con este paso cubres las reglas 1, 4, 7 y 8 a la vez.',
        ],
      },
      {
        tipo: 'parrafo',
        texto:
          'En una semana de trabajo de un developer, puedes resolver las 8 reglas para tus páginas críticas. Cuando llegue Chrome auto-browse (fines de junio en Android), tu sitio va a estar listo. Y de paso, vas a estar más cerca de cumplir la Ley 20.422 chilena de inclusión.',
      },
      {
        tipo: 'referencias',
        items: [
          { label: 'Crea sitios web aptos para agentes — web.dev / Google (Kasper Kulikowski, Omkar More, abril 2026)', url: 'https://web.dev/articles/ai-agent-site-ux?hl=es-419' },
          { label: "Google's Agent-Friendly Checklist Is the Accessibility Audit Restated — NoHacks", url: 'https://nohacks.co/blog/google-agent-friendly-checklist' },
          { label: 'WebMCP — estándar web propuesto (Chrome team)', url: 'https://developer.chrome.com/blog/webmcp-epp?hl=es-419' },
          { label: 'Árbol de accesibilidad en Chrome DevTools', url: 'https://developer.chrome.com/docs/devtools/accessibility/reference?hl=es-419#tree' },
          { label: 'Aprender accesibilidad — web.dev', url: 'https://web.dev/learn/accessibility' },
        ],
      },
    ],
    ctaTexto: 'Auditar mi sitio para agentes de iA →',
    ctaUrl: '/#planes',
    relacionados: ['lighthouse-mide-navegacion-con-ia', 'fin-de-la-pagina-como-destino', 'visitante-de-ia-viene-a-comprar', '5-hacks-geo-que-google-dice-no-sirven'],
    glosario: [
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
    ],
  },
  {
    slug: 'un-ano-de-ai-mode-datos-google',
    titulo: 'Un año de AI Mode según Google: queries 3x más largas, planning crece 80% y 1 de cada 6 búsquedas ya es multimodal',
    descripcion:
      'Google publicó (mayo 2026) los datos del primer año de AI Mode: 1.000 millones de usuarios mensuales, queries 3x más largas que la búsqueda tradicional y más voz/imagen que nunca. Te traducimos los 5 datos clave para entender qué cambia en cómo te buscan tus clientes — y qué hacer al respecto.',
    fecha: '2026-06-02',
    categoria: 'Casos & Datos',
    tags: ['AI Mode', 'Google', 'Multimodal', 'Search Behavior', 'Planning'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Google publicó (mayo 2026) los datos del primer año de AI Mode: 1.000 millones de usuarios mensuales, queries 3x más largas que la búsqueda tradicional, planning queries crecen 80% más rápido que el promedio, y 1 de cada 6 búsquedas ya usa voz o imágenes. La conducta de búsqueda cambió en serio.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'El 19 de mayo de 2026, Shivani Mohan (VP de Data Science y UXR en Google) publicó los datos oficiales del primer año de AI Mode. No son cifras del marketing del producto — son las métricas reales de comportamiento de búsqueda. Para una marca que vive de aparecer en Google, conviene leerlas con calma.',
      },
      {
        tipo: 'parrafo',
        texto:
          'El titular es contundente: las nuevas funciones de iA son la razón principal por la que Google ve un máximo histórico de búsquedas. La gente no busca menos por la iA — busca más, y busca distinto.',
      },
      { tipo: 'h2', texto: 'Los 5 datos que conviene memorizar' },
      {
        tipo: 'lista',
        items: [
          'AI Mode llegó a 1.000 millones de usuarios activos al mes — y las queries se duplican cada trimestre desde el lanzamiento.',
          'Las queries en AI Mode son aproximadamente 3 veces más largas que las búsquedas tradicionales.',
          'Más de 1 de cada 6 búsquedas ya incorpora voz o imágenes (multimodal).',
          'Las búsquedas con imagen crecen 40% mes a mes.',
          'Las queries de "planning" (planificación) crecen 80% más rápido que el promedio. Las de "brainstorming" crecen 30% más rápido.',
        ],
      },
      { tipo: 'h2', texto: '"Queries 3x más largas" — qué significa en práctica' },
      {
        tipo: 'parrafo',
        texto:
          'No es un detalle de longitud, es un cambio de naturaleza. La búsqueda tradicional optimizaba para queries cortas y específicas: "mejor CRM Chile". AI Mode permite y premia el contexto: "cuál CRM con integración al SII y soporte en español me sirve para una pyme de servicios de 8 personas que ya tiene HubSpot pero le sale caro".',
      },
      {
        tipo: 'parrafo',
        texto:
          'Para tu sitio, la implicancia es directa: el contenido que solo responde a la query corta queda corto. El que responde con la profundidad de la query larga — incluyendo casos, comparaciones, contexto y restricciones — es el que la iA usa para componer la respuesta. Y la gente que llega ya tomó la decisión basada en esa síntesis.',
      },
      { tipo: 'h2', texto: '1 de cada 6 búsquedas ya es multimodal' },
      {
        tipo: 'parrafo',
        texto:
          'Esta cifra cambia el peso de algo que muchas marcas chilenas tratan como secundario: las imágenes de producto y los datos visuales. Más del 16% de las búsquedas ya usa voz o imagen, y la búsqueda por imagen específicamente crece 40% mes a mes. El usuario saca una foto de un producto en una vitrina y le pregunta a Google qué es y dónde comprarlo.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Lo que tienes que asegurar: imágenes de producto reales (no stock), alt text descriptivo en español, structured data de Product con imágenes declaradas, y nombre del producto consistente entre sitio, Google Business Profile y Merchant Center. La iA cruza las tres fuentes para identificar la entidad.',
      },
      { tipo: 'h2', texto: 'Planning + brainstorming: la decisión se cocina antes del click' },
      {
        tipo: 'parrafo',
        texto:
          'Los datos de mayor crecimiento son las queries de planificación y exploración. Búsquedas que empiezan con "dónde puedo", "qué debería", "ideas para". El usuario no llega a Google con la decisión tomada — la cocina dentro de AI Mode, refinando varias veces, hasta que sale con un proveedor elegido.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Si tu marca no aparece en esa fase exploratoria — que dura minutos, no segundos — ni siquiera entras al shortlist. Y como cubrimos en nuestro post anterior, cuando finalmente el visitante hace click, viene a ejecutar, no a que lo convenzas.',
      },
      { tipo: 'h2', texto: 'Los 5 cambios concretos que puedes hacer esta semana' },
      {
        tipo: 'lista',
        items: [
          'Audita tu Share of Model en queries largas y de planificación, no solo en las cortas. Los volúmenes de cola larga son donde está el crecimiento real.',
          'Crea contenido que responda preguntas con contexto completo (caso, comparativa, restricciones, criterios). El contenido "5 tips de…" ya no compite.',
          'Refresca tus imágenes de producto y agrega alt text descriptivo en español. La búsqueda por imagen +40% mes a mes ya está afectando tráfico de descubrimiento.',
          'Implementa structured data de Product (con imágenes, precio, disponibilidad) si vendes; LocalBusiness con horarios actuales si tienes presencia física; Organization con sameAs si todavía no lo hiciste.',
          'Segmenta tu tráfico en GA4 por queries 3+ palabras vs 1-2 palabras. La proporción te muestra si ya estás recibiendo el tráfico nuevo o solo el viejo.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'El cambio no es solo en cómo busca la gente — es en qué espera encontrar. Una landing genérica con "Somos la mejor solución" pierde frente a una página con datos concretos, comparativas reales y casos. La iA premia precisión informativa, no persuasión.',
      },
      {
        tipo: 'referencias',
        items: [
          { label: 'How AI Mode is changing the way people search in the U.S. — Google Blog (mayo 2026)', url: 'https://blog.google/products-and-platforms/products/search/ai-mode-us-insights/' },
          { label: 'AI Mode — Plataforma oficial', url: 'https://g.ai/' },
          { label: 'AI Mode Sends a Different Visitor — NoHacks (lectura complementaria)', url: 'https://nohacks.co/blog/ai-mode-sends-different-visitor' },
        ],
      },
    ],
    ctaTexto: 'Auditar cómo aparece mi marca en AI Mode →',
    ctaUrl: '/#planes',
    relacionados: ['visitante-de-ia-viene-a-comprar', 'fin-de-la-pagina-como-destino', 'lighthouse-mide-navegacion-con-ia', 'ecommerce-chileno-busqueda-ia-cyberday-2026'],
    glosario: [
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
    ],
  },
  {
    slug: 'fin-de-la-pagina-como-destino',
    titulo: 'Si Google compone la respuesta con tus datos, tu landing dejó de ser el destino',
    descripcion:
      'En Google I/O 2026 se confirmó la Generative UI en Search: Google compone una interfaz por consulta usando datos indexados de tu sitio. Tu data renderiza dentro de Google, no en tu landing. Qué significa eso, por qué cambia la métrica y qué tienes que hacer ahora.',
    fecha: '2026-06-01',
    categoria: 'Noticias iA',
    tags: ['Google I/O', 'Generative UI', 'Schema', 'MCP', 'Gemini'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Google I/O 2026 confirmó la Generative UI en Search: Google compone una interfaz por consulta con tus datos, dentro de su layout y con su CTA al lado. La unidad de medida pasa de page views a "tus datos fueron los que se renderizaron". Schema.org deja de ser opcional para entrar al render.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'En Google I/O 2026, Sundar Pichai describió el upgrade más grande del Search box en 25 años. Detrás de los titulares de Gemini 3.5 Flash, los Information Agents y el lanzamiento de Spark, hay un cambio de modelo que conviene mirar sin filtro de hype: la página dejó de ser el destino del usuario.',
      },
      {
        tipo: 'parrafo',
        texto:
          'La razón se llama Generative UI. Google ya no devuelve una lista de diez links azules. Compone una interfaz a medida para cada consulta, usando datos que extrae de los sitios indexados. Tu data se renderiza adentro de la UI de Google — con la tipografía de Google, su modelo de interacción, y su botón de acción al lado.',
      },
      { tipo: 'h2', texto: 'Qué es la Generative UI, en simple' },
      {
        tipo: 'parrafo',
        texto:
          'En vez de mandarte a una landing para que esa landing responda tu pregunta, Google compone la respuesta directamente en la página de resultados. Si preguntas por horarios de un restorán, Google muestra los horarios con un botón para reservar — sin que el usuario entre al sitio del restorán. Los datos vienen del restorán; la interfaz, el diseño y el CTA son de Google.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Es la lógica del AI Overview llevada al siguiente nivel: ya no es solo un resumen textual arriba de los resultados — es una interfaz interactiva por consulta. AI Mode llegó a 1.000 millones de usuarios al mes este trimestre, el ramp-up más rápido en la historia de Google. La pregunta importante no es "cuándo llega esto" — ya llegó.',
      },
      { tipo: 'h2', texto: 'La frase que cambia el modelo' },
      {
        tipo: 'cita',
        texto:
          'El usuario nunca llega. Tus datos se renderizan dentro del layout de Google, con la tipografía de Google, el modelo de interacción de Google, y el CTA de Google al lado.',
        fuente: 'NoHacks — Generative UI in Search Ends the Page-as-Destination Era',
      },
      {
        tipo: 'parrafo',
        texto:
          'Detrás de la frase hay una implicancia operativa concreta: bounce rate, tiempo en página y conversión por landing pierden sentido como métricas centrales. La nueva pregunta de medición es: ¿fueron mis datos los que se renderizaron en la respuesta?',
      },
      { tipo: 'h2', texto: 'Schema.org deja de ser opcional (con matiz)' },
      {
        tipo: 'parrafo',
        texto:
          'Hace unas semanas Google publicó su guía de optimización para búsqueda con iA y dijo que el structured data no es obligatorio para aparecer. Lo cubrimos en nuestro post sobre los 5 hacks que Google descartó. Esa afirmación sigue siendo cierta — pero solo para aparecer como link en respuestas tradicionales.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Para que tus datos sean los que Google use al renderizar la Generative UI, schema.org sí es el mecanismo. El JSON-LD le dice a Google qué entidad eres, qué datos tienes y cómo conectarlos con la consulta. Sin schema, tus datos siguen indexándose, pero el sistema generativo tiene menos certeza para usarlos en una interfaz compuesta — y prefiere usar los del competidor que sí los declaró.',
      },
      {
        tipo: 'nota',
        texto:
          'No es contradicción con la postura anterior — es la misma idea afinada: schema no es un hack de ranking, pero sí es la forma de que tus datos entren al render generativo. Un detalle técnico que se vuelve estratégico.',
      },
      { tipo: 'h2', texto: '4 anuncios de I/O 2026 que te tocan' },
      {
        tipo: 'lista',
        items: [
          'Generative UI en Search — disponible para AI Pro y Ultra, partiendo en EE.UU. Llega al resto en los próximos meses.',
          'Information Agents (verano 2026) — agentes que ejecutan tareas de búsqueda y agendamiento en background, sin abrir tu sitio.',
          'Gemini en Chrome auto-browse (fines de junio, Android 12+) — el navegador completa formularios y ejecuta compras por el usuario, con casos demo en SpotHero (estacionamiento) y Chewy (e-commerce).',
          'Gemini Spark — agente personal 24/7 que usa el protocolo MCP para integrar herramientas de terceros. Tu sitio entra al ecosistema solo si es alcanzable vía MCP.',
        ],
      },
      {
        tipo: 'parrafo',
        texto:
          'En paralelo, Google publicó en enero de 2026 una patente sobre landings generadas por iA — interfaces creadas automáticamente a partir del feed de tus productos. El destino, literalmente, se vuelve generativo.',
      },
      { tipo: 'h2', texto: 'Los 3 chequeos concretos que puedes hacer hoy (15 minutos)' },
      {
        tipo: 'parrafo',
        texto:
          'No tienes que esperar a que llegue todo a Chile para empezar. El primer ejercicio se hace en 15 minutos. Tomas las queries representativas de tu categoría — las que tus clientes hacen cuando están por decidir — y las corres en AI Mode (donde esté disponible) o en Perplexity. Miras qué se renderiza.',
      },
      {
        tipo: 'lista',
        items: [
          '¿Aparecen datos? ¿De dónde? Si la respuesta es de tu competencia, ya sabes el gap.',
          '¿El botón de acción al lado del dato apunta a tu marca o a un comparador / marketplace? La atribución del click vale tanto como el render.',
          '¿Qué entidad reconoce Google al hablar de tu categoría? Si no eres tú, hay un problema de densidad de entidad que tu schema y tus menciones tienen que arreglar.',
        ],
      },
      { tipo: 'h2', texto: 'Lo que esto cambia para una marca chilena' },
      {
        tipo: 'parrafo',
        texto:
          'A corto plazo, la Generative UI en Search llega primero a EE.UU. y Tier 1. Pero Perplexity, ChatGPT con búsqueda web y Copilot ya operan con lógicas similares en español, y AI Mode se expande rápido. La preparación se hace ahora, no cuando la versión chilena esté disponible.',
      },
      {
        tipo: 'lista',
        items: [
          'Implementa JSON-LD de Organization, Product, LocalBusiness o el tipo que corresponda — con datos reales y consistentes.',
          'Asegura que cada dato crítico (precio, stock, despacho, horario) esté declarado en structured data, no solo en HTML visible.',
          'Audita tu Share of Model para saber cuándo tu marca es la fuente que la iA usa hoy, y dónde es la competencia.',
          'Prepara formularios y flujos para visitantes-software: labels claros, validación predecible, mensajes de error legibles para máquinas. Es la misma higiene que pide MCP — y que va a usar Gemini Spark.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'La métrica vieja era "cuántas visitas trajo Google a mi sitio". La nueva es "cuántas veces mi marca fue la fuente que Google usó al componer la respuesta". Tu equipo de analytics todavía no la mide. Tu auditoría de Share of Model sí.',
      },
    ],
    ctaTexto: 'Auditar qué datos míos renderiza la iA →',
    ctaUrl: '/#planes',
    relacionados: ['visitante-de-ia-viene-a-comprar', 'lighthouse-mide-navegacion-con-ia', '5-hacks-geo-que-google-dice-no-sirven', 'comercio-conversacional-agentes-ucp'],
    glosario: [
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
    ],
  },
  {
    slug: 'visitante-de-ia-viene-a-comprar',
    titulo: 'El visitante que llega desde la iA viene a comprar — y tu landing está optimizada para convencerlo',
    descripcion:
      'Google AI Mode llegó a 1.000 millones de usuarios activos al mes y el tráfico de iA convierte 42% más que el orgánico clásico. La razón es contra-intuitiva: el visitante ya hizo la investigación dentro de la iA. Llega a completar una tarea, no a que lo convenzas — y tu landing está peleando contra eso.',
    fecha: '2026-06-01',
    categoria: 'Casos & Datos',
    tags: ['AI Mode', 'Conversión', 'Adobe', 'Google', 'Landing'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'El tráfico desde iA convierte 42% más que el orgánico clásico (Adobe Q2 2026) porque el visitante ya hizo la investigación dentro de ChatGPT o AI Mode. Llega a completar una tarea — no a leer tu propuesta de valor. La mayoría de las landings chilenas le pelean al visitante con un funnel "awareness → decisión" que él ya recorrió.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Google reportó en mayo de 2026 que su AI Mode alcanzó 1.000 millones de usuarios activos al mes. Adobe, en su Q2 2026 AI Traffic Report, midió algo que cambia la conversación: el tráfico desde iA convierte 42% más que el orgánico clásico. El dato es real. La conclusión que la mayoría saca de él, no.',
      },
      {
        tipo: 'parrafo',
        texto:
          'La lectura fácil es "necesito más tráfico de iA". La lectura correcta es que el visitante que llega desde la iA es otra persona — con otra intención, otro nivel de información y otras necesidades — y la mayoría de las landings chilenas están preparadas para el visitante orgánico de hace 5 años.',
      },
      { tipo: 'h2', texto: 'Por qué el visitante de iA es otra cosa' },
      {
        tipo: 'parrafo',
        texto:
          'Tres datos lo definen. Primero: las queries dentro de AI Mode son aproximadamente 3 veces más largas que las búsquedas tradicionales. El usuario no escribe "mejor CRM Chile"; escribe "cuál CRM con integración al SII y soporte en español me sirve para una pyme de servicios de 8 personas que ya tiene HubSpot pero le sale caro". Segundo: las queries de "planning" crecen 80% más rápido que el promedio. Tercero: el visitante refina su pregunta dentro de la iA varias veces antes de hacer click.',
      },
      {
        tipo: 'parrafo',
        texto:
          'La consecuencia: cuando llega a tu sitio, ya comparó opciones, ya descartó alternativas y ya decidió cuál evaluar más a fondo. Tu landing no es el primer paso de su funnel — es el último.',
      },
      {
        tipo: 'cita',
        texto:
          'El visitante comparó tres productos dentro de ChatGPT, eligió uno y hizo click. Llega a tu página con la intención que un visitante orgánico tradicional tarda cinco páginas en construir.',
        fuente: 'NoHacks — AI Mode Sends a Different Visitor',
      },
      { tipo: 'h2', texto: 'La trampa: tu landing fue diseñada para otro visitante' },
      {
        tipo: 'parrafo',
        texto:
          'La estructura clásica de landing chilena va así: hero con propuesta de valor, sección de beneficios, social proof, "por qué confiar en nosotros", testimonios, FAQ, y al final un CTA. Es el funnel "awareness → consideración → decisión" empaquetado en una página. Funciona perfecto para alguien que llegó por Google Ads y necesita persuasión.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Pero para el visitante que llega desde la iA, esa estructura es un obstáculo. Él no necesita que le expliques quién eres — la iA ya se lo dijo. No necesita social proof — la iA ya le dijo si confiar o no. No necesita beneficios — la iA ya los listó. Lo que necesita es ejecutar: ver el precio exacto, agendar la reunión, llenar el formulario corto, completar la compra.',
      },
      {
        tipo: 'nota',
        texto:
          'En la práctica, cada scroll que le pides al visitante de iA antes de la acción es fricción gratuita. El bounce rate de esa cohorte es alto no porque el visitante no estaba calificado — al revés, era el más calificado del día y lo perdiste haciéndolo leer.',
      },
      { tipo: 'h2', texto: 'Tres cambios concretos en tu landing' },
      {
        tipo: 'lista',
        items: [
          'Mueve la acción principal arriba. El formulario, el precio, el botón "agendar / comprar / empezar". Que estén en el primer scroll, sin scroll inicial obligatorio.',
          'Datos críticos visibles antes del fold: precio real (no "consultar"), tiempo de despacho, política de devolución, plazos. La iA ya respondió al "qué". El visitante valida el "cuándo y cuánto".',
          'Elimina o relega la sección "por qué confiar en nosotros" abajo del fold de acción. Esa información ya fue procesada antes del click. Repetirla retrasa la conversión.',
        ],
      },
      { tipo: 'h2', texto: 'Cómo identificar qué páginas necesitan el cambio' },
      {
        tipo: 'parrafo',
        texto:
          'No tienes que rehacer todo el sitio. Auditas tus 10 landings que más tráfico de iA reciben (segmenta GA4 por referrers de chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com) y aplicas un solo criterio: ¿puede este visitante completar la tarea por la que vino en los primeros 30 segundos?',
      },
      {
        tipo: 'parrafo',
        texto:
          'Si la respuesta es "sí pero hay que scrollear" o "sí pero hay que buscar el formulario en el menú", esa landing está dejando dinero arriba de la mesa. La iA te trajo al cliente listo. Tu trabajo es no entorpecerlo.',
      },
      { tipo: 'h2', texto: 'Lo que viene: el visitante no clickeará' },
      {
        tipo: 'parrafo',
        texto:
          'A fines de junio de 2026, Chrome activa en Android su modo de auto-browse — un agente que navega sitios web por el usuario, completa formularios y ejecuta acciones sin que el visitante tenga que clickear cada paso. El concepto se extiende: en pocos meses, el "visitante" más rentable de tu sitio puede no ser una persona, sino un agente que llega con instrucciones específicas.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Las landings que ya están optimizadas para el visitante de iA son también las que el agente puede procesar más rápido. Las que requieren persuasión multi-scroll son las que el agente abandona. La inversión que hagas hoy en simplificar el camino a la acción rinde por dos vías.',
      },
      { tipo: 'h2', texto: 'Los 4 cambios concretos que puedes hacer esta semana' },
      {
        tipo: 'lista',
        items: [
          'Segmenta tu tráfico en GA4 por referrer de iA. Sabes exactamente qué landings ya están recibiendo este perfil.',
          'En las top 3 más visitadas desde iA, mueve el CTA principal y los datos transaccionales al primer scroll. Mide una semana.',
          'Compara conversión antes y después. Si replicas el patrón Adobe (+42%), tienes el caso de negocio para extender el cambio al resto del sitio.',
          'Audita tu Share of Model en paralelo: aparecer en la iA y convertir bien al visitante de iA son dos palancas distintas. La primera sin la segunda es tráfico que rebota.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'El dato de Adobe (+42% de conversión) es promedio. Las marcas con landings optimizadas para tráfico de iA están bien arriba de esa cifra. Las que dejaron su funnel intacto, bien abajo. El número agregado esconde la verdadera dispersión — y es exactamente ahí donde se decide si la iA es un canal de ganancia o de pérdida silenciosa.',
      },
    ],
    ctaTexto: 'Auditar cómo me cita la iA →',
    ctaUrl: '/#planes',
    relacionados: ['ecommerce-chileno-busqueda-ia-cyberday-2026', 'chatgpt-busqueda-web-cambia-geo-2026', 'comercio-conversacional-agentes-ucp', 'lighthouse-mide-navegacion-con-ia'],
    glosario: [
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
    ],
  },
  {
    slug: 'lighthouse-mide-navegacion-con-ia',
    titulo: 'Chrome agregó un audit de "navegación con iA" a Lighthouse: lo que mide y por qué pasar el test no significa que la iA te entienda',
    descripcion:
      'Lighthouse 13.3 incorpora una categoría experimental de "Agentic Browsing" que audita llms.txt y WebMCP. Te explicamos qué mide, por qué Google ya dijo que llms.txt no mueve visibilidad y qué señales sí importan para que la iA entienda tu marca.',
    fecha: '2026-06-01',
    categoria: 'Noticias iA',
    tags: ['Lighthouse', 'LLMS.txt', 'WebMCP', 'Agentic Browsing', 'Chrome'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Lighthouse 13.3 incluye un audit experimental de "navegación con iA": chequea árbol de accesibilidad, CLS, llms.txt y tres métricas de WebMCP. Pasarlo es fácil — pero Google ya dijo en mayo 2026 que llms.txt no mueve visibilidad en su búsqueda con iA. El audit mide parseabilidad, no utilidad.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Chrome publicó Lighthouse 13.3.0 con algo que vale la pena notar: una categoría experimental nueva llamada "Agentic Browsing". Es la primera vez que herramientas mainstream de auditoría web reconocen explícitamente la navegación con iA como un eje a medir junto a Performance, SEO y Accessibility.',
      },
      {
        tipo: 'parrafo',
        texto:
          'La noticia es buena por lo simbólico: el ecosistema asume que tu sitio ya no le habla solo a humanos y a Googlebot. Pero antes de correr a "pasar el audit", conviene entender qué mide en serio — y qué no.',
      },
      { tipo: 'h2', texto: 'Qué mide el nuevo audit' },
      {
        tipo: 'parrafo',
        texto:
          'A diferencia de las categorías clásicas que devuelven un score de 0 a 100, esta usa ratios fraccionarios de "passed" sobre 6 métricas:',
      },
      {
        tipo: 'lista',
        items: [
          'Validación del árbol de accesibilidad (lo que un agente "lee" de tu DOM).',
          'Cumulative Layout Shift (CLS) — la misma métrica de Core Web Vitals.',
          'Descubribilidad de llms.txt — si el archivo existe y está en la ruta esperada.',
          'WebMCP tools registradas — herramientas que tu sitio expone a agentes vía Model Context Protocol.',
          'WebMCP cobertura de formularios — qué porcentaje de tus formularios puede ejecutar un agente.',
          'WebMCP validez de schemas — si tu structured data se ajusta a las expectativas del agente.',
        ],
      },
      { tipo: 'h2', texto: 'La trampa: el audit mide parseabilidad, no utilidad' },
      {
        tipo: 'parrafo',
        texto:
          'Aquí está el matiz que casi nadie explica. El audit no evalúa si tu sitio es útil para un agente de iA. Evalúa si tus archivos son legibles por máquinas. Es una distinción crítica.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Ejemplo concreto: el plugin AIOSEO de WordPress (lo usan más de 3 millones de sitios) genera automáticamente un llms.txt con sintaxis markdown válida. Pasa el audit sin problema. Pero el contenido del archivo suele ser una lista vacía o genérica. Un archivo curado a mano con descripciones útiles pero sin la sintaxis exacta de markdown, falla.',
      },
      {
        tipo: 'cita',
        texto:
          'El audit revisa si tu archivo es parseable. No revisa si tu archivo es útil.',
        fuente: 'NoHacks — Lighthouse, Agentic Browsing, llms.txt, and Markdown',
      },
      {
        tipo: 'parrafo',
        texto:
          'Traducción para tu equipo: "Lighthouse Agentic Browsing 1.0" es un buen check de higiene técnica, no una garantía de que la iA va a recomendar tu marca.',
      },
      { tipo: 'h2', texto: 'WebMCP — lo interesante de verdad' },
      {
        tipo: 'parrafo',
        texto:
          'Las tres métricas de WebMCP son las que apuntan al futuro real. WebMCP es la versión web del Model Context Protocol: una forma estandarizada de que un agente de iA descubra qué acciones puede ejecutar en tu sitio (reservar, comprar, comparar) sin necesidad de "ver" la página como un humano.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Hoy es temprano para implementarlo en una pyme. Pero tener Schema.org sólido y formularios bien estructurados es la base sobre la que WebMCP se construye. Esa inversión sí rinde, con o sin agentes.',
      },
      { tipo: 'h2', texto: 'Lo que NO cambia: Google ya dijo que llms.txt no rankea' },
      {
        tipo: 'parrafo',
        texto:
          'En mayo de 2026, Google Search Central confirmó explícitamente que los archivos llms.txt no influyen en la visibilidad de tu marca en su búsqueda con iA. Que Lighthouse ahora lo audite no cambia esa realidad — son herramientas distintas con objetivos distintos.',
      },
      {
        tipo: 'nota',
        texto:
          'Si llegaste aquí porque alguien te vendió que llms.txt iba a posicionarte en ChatGPT, te recomendamos nuestro post "Los 5 hacks de GEO que Google dice que NO sirven". llms.txt es el #1 de esa lista.',
      },
      { tipo: 'h2', texto: 'El comando para auditar tu sitio hoy' },
      {
        tipo: 'parrafo',
        texto:
          'Si quieres correr el audit en tu sitio, es una línea:',
      },
      {
        tipo: 'codigo',
        lenguaje: 'bash',
        codigo: `npx lighthouse@latest https://tumarca.cl --only-categories=agentic-browsing`,
      },
      {
        tipo: 'parrafo',
        texto:
          'Te devuelve un reporte HTML con el detalle de cada métrica. Si falla por "missing links" en llms.txt, convertir descripciones de texto plano a sintaxis markdown ([texto](url)) toma menos de 5 minutos.',
      },
      { tipo: 'h2', texto: 'Los 3 cambios concretos para una marca chilena' },
      {
        tipo: 'lista',
        items: [
          'Corre el audit. Te da higiene técnica gratis y un punto de partida medible.',
          'No confundas el resultado con visibilidad real en iA. Pasa el audit como hygiene, no como estrategia. Para saber si ChatGPT te cita en tu categoría, audita tu Share of Model — que es otra cosa.',
          'Empieza a trabajar Schema.org con seriedad. Es la base de WebMCP, de los rich results de Google con iA, y de la precisión de entidad que evita que la iA te confunda con otra marca.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'La noticia es que Chrome reconoce la "navegación con iA" como categoría. El matiz es que medir parseabilidad no equivale a vender más. La capa que sí mueve la aguja sigue siendo la misma: contenido con experiencia real, structured data correcto, presencia en fuentes que los LLM consideran autoridad para tu industria.',
      },
    ],
    ctaTexto: 'Ver mi diagnóstico real →',
    ctaUrl: '/#planes',
    relacionados: ['5-hacks-geo-que-google-dice-no-sirven', 'checklist-tecnico-google-busqueda-ia', 'comercio-conversacional-agentes-ucp', 'google-seo-sigue-vivo-busqueda-ia'],
    glosario: [
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'llm', termino: 'LLM' },
    ],
  },
  {
    slug: 'ecommerce-latam-cambio-modelo-busqueda-2026',
    titulo: 'El e-commerce LATAM frente al cambio del modelo de búsqueda: cómo se mueve cada país',
    descripcion:
      'Brasil, México, Colombia, Chile y Perú no están entrando a la era de la búsqueda con iA al mismo ritmo. Mapa comparativo 2026 con tamaños de mercado, velocidad de adopción y dónde priorizar el esfuerzo GEO si operas en varios países de la región.',
    fecha: '2026-05-29',
    categoria: 'Casos & Datos',
    tags: ['LATAM', 'E-commerce', 'GEO', 'Brasil', 'México', 'Colombia', 'Perú', 'Chile'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'El e-commerce LATAM proyectado en USD 1,78 billones en 2026, con Brasil (45%) y México (26%) concentrando >70% del volumen. Pero la velocidad de adopción de iA en búsqueda y la saturación de GEO varían por país — y eso cambia dónde conviene invertir primero si operas en varios mercados.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Si manejas marketing para una marca que opera en varios países de LATAM, la pregunta no es "¿hay que hacer GEO?". Es "¿en qué mercado empezar?". La respuesta no se contesta solo con tamaño de mercado — porque en algunos países el espacio en respuestas de iA ya empieza a saturarse, y en otros está completamente abierto.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Este es el mapa 2026: dónde está el volumen, dónde está la velocidad, y dónde está la ventaja competitiva real para una marca regional.',
      },
      { tipo: 'h2', texto: 'El tamaño del juego: dónde está el volumen' },
      {
        tipo: 'parrafo',
        texto:
          'El e-commerce LATAM se proyecta en USD 1,78 billones en 2026, con una penetración promedio del 18% sobre el comercio total. Pero esa cifra agregada esconde una concentración fuerte: Brasil y México juntos superan el 70% del volumen regional. El resto se reparte entre Argentina, Colombia, Chile y Perú.',
      },
      {
        tipo: 'lista',
        items: [
          'Brasil: ~45% del volumen LATAM. El mercado más grande, en portugués — requiere optimización diferenciada del resto.',
          'México: ~26% del volumen. Puerta hacia Norteamérica, en plena expansión acelerada.',
          'Colombia: 186,4 millones de transacciones e-commerce solo en Q1 2026 (+22,2% YoY).',
          'Perú: proyección de +35% en ventas online para 2026. 7 de cada 10 peruanos ya compran en línea.',
          'Chile: ~USD 9 mil millones proyectados a fin de 2026, 15% de penetración. Mercado pequeño pero maduro y con primer agente oficial de iA (Cyber AI).',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'Lectura estratégica: priorizar solo por volumen te lleva a Brasil y México. Priorizar por velocidad de cambio y baja saturación competitiva en iA te lleva a Chile, Colombia y Perú primero. La decisión correcta depende de tu producto y tu capacidad operativa por país.',
      },
      { tipo: 'h2', texto: 'Cómo se mueve cada país en iA + e-commerce' },
      { tipo: 'h3', texto: 'Brasil — gran volumen, capa de idioma propia' },
      {
        tipo: 'parrafo',
        texto:
          'Es el mercado más grande, pero también el más particular: el portugués brasileño tiene comportamiento propio en los LLMs. Lo que optimices en español para México o Chile no aplica directo. Para una marca regional, Brasil suele requerir un equipo o agencia local y contenido nativo en portugués — no traducciones. La buena noticia: la saturación de GEO sigue siendo baja en portugués, incluso con un mercado enorme.',
      },
      { tipo: 'h3', texto: 'México — el "nuevo asistente de ventas" según AMVO' },
      {
        tipo: 'parrafo',
        texto:
          'La AMVO documentó en 2026 que los compradores mexicanos ya usan iA como "asistente de ventas" — comparan productos, validan ofertas y resuelven dudas antes de llegar al checkout. La cita más reveladora: en una búsqueda tradicional un retailer muestra cientos de productos; un agente de iA propone cinco. Tu marca está en esos cinco, o no existe.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Un estudio mexicano reciente encontró que publicar contenido con datos objetivos (estadísticas, comparativas) mejora la visibilidad en iA en ~33%. Implicancia directa para marcas con presencia regional: el contenido tipo "informe", "estudio" o "comparativa" rinde fuerte en el mercado mexicano.',
      },
      { tipo: 'h3', texto: 'Colombia — crecimiento sostenido, momento de adopción iA' },
      {
        tipo: 'parrafo',
        texto:
          'Con +22% interanual en transacciones e-commerce el primer trimestre de 2026, Colombia está en una fase de crecimiento sostenido que coincide con el inicio masivo de la conversación sobre iA en el sector. El eCommerce Day Colombia 2026 puso la iA al centro junto con pagos digitales — señal de que el ecosistema apenas empieza a moverse. Ventana abierta para quien se posicione primero.',
      },
      { tipo: 'h3', texto: 'Perú — agentic commerce como tesis central' },
      {
        tipo: 'parrafo',
        texto:
          'Los reportes peruanos para 2026 son explícitos: la tesis es agentic commerce. Agentes de iA que median entre el consumidor y la marca, ejecutando búsqueda, comparación y compra. Para un mercado con +35% de crecimiento proyectado, es la combinación más interesante de la región — volumen creciendo y un consenso emergente sobre hacia dónde va el modelo.',
      },
      { tipo: 'h3', texto: 'Chile — primer agente oficial dentro del evento (Cyber AI)' },
      {
        tipo: 'parrafo',
        texto:
          'Chile va adelante en un aspecto puntual: el CyberDay 2026 (1-3 de junio) incorpora "Cyber AI", un agente conversacional oficial dentro del portal del evento. Es el primer caso en la región donde un agente vive en el e-commerce mismo, no solo en ChatGPT o Perplexity. Además, Latam-GPT (lanzado en Chile con inversión pública-privada) opera ya como modelo regional.',
      },
      { tipo: 'h2', texto: 'Tres patrones que se repiten en toda la región' },
      {
        tipo: 'lista',
        items: [
          'El retail LATAM no es legible para máquinas. Adobe documentó que los sitios de retail tienen JSON-LD incompleto o ausente — patrón uniforme en todos los países.',
          'Los equipos enterprise ya empezaron con GEO; los equipos pyme aún no. La brecha es estructural y deja una ventana competitiva clara para quien se mueve primero.',
          'El idioma sigue siendo determinante. Lo que optimizas en español de Chile, Colombia, Perú o México sí transfiere razonablemente entre esos mercados. Brasil necesita estrategia propia.',
        ],
      },
      { tipo: 'h2', texto: 'Latam-GPT: la dimensión regional que recién aparece' },
      {
        tipo: 'parrafo',
        texto:
          'Lanzado en 2026 con inversión pública y privada desde Chile, Latam-GPT es el primer LLM entrenado con datos regionales y orientado a reducir el sesgo de los modelos angloparlantes. Aún es temprano para medir impacto comercial real, pero la señal estratégica para marcas regionales es nítida: el contenido en español local, con referencias a marcas, medios y contexto LATAM, empieza a ser una palanca diferencial.',
      },
      {
        tipo: 'cita',
        texto:
          'La ventaja competitiva en 2026 no está en acceder a herramientas de iA — está en qué tan organizada y estructurada está la información de tu negocio para que esas IAs la entiendan y la usen.',
        fuente: 'Tendencias e-Commerce LATAM 2026',
      },
      { tipo: 'h2', texto: 'Los 6 cambios concretos para una estrategia GEO multi-país en LATAM' },
      {
        tipo: 'parrafo',
        texto:
          'Si operas en varios mercados, intentar lanzar GEO simultáneo en todos es la receta para no mover la aguja en ninguno. Estos son los pasos concretos para marketers regionales:',
      },
      {
        tipo: 'lista',
        items: [
          'Empieza por 1 o 2 mercados donde la combinación volumen + velocidad de cambio + saturación competitiva te favorezca. Para marcas regionales pequeñas, Chile, Colombia o Perú suelen ser mejor primer paso que México por menor saturación.',
          'Trata Brasil como track independiente con equipo o agencia local en portugués.',
          'Centraliza el contenido de autoridad (estudios propios, comparativas, datos) y traduce/adapta por mercado, manteniendo cifras y referencias locales.',
          'Audita tu Share of Model país por país. La visibilidad de tu marca en ChatGPT México puede ser muy distinta a la de ChatGPT Chile — son consultas distintas con corpus distintos.',
          'Sincroniza Merchant Center por país: el 83% del carrusel de ChatGPT Shopping se nutre de Google Shopping, y la indexación es por mercado.',
          'Construye señales locales: reseñas en plataformas indexadas del país, menciones en medios de nicho locales y entidades regionales en tu JSON-LD (Organization con areaServed por país).',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'El error más común en marcas regionales: copiar el JSON-LD de su sitio global y servirlo igual en todos los países. Una Organization sin areaServed específico y sin sameAs hacia perfiles locales hace que la iA no pueda ubicarte en el mercado correcto — y por defecto recomiende a competencia local que sí tiene esa señal.',
      },
    ],
    ctaTexto: 'Auditar mi marca por país →',
    ctaUrl: '/auditar/ecommerce/',
    relacionados: ['ecommerce-chileno-busqueda-ia-cyberday-2026', 'comercio-conversacional-agentes-ucp', 'perplexity-vs-chatgpt-citas-2026', 'chatgpt-busqueda-web-cambia-geo-2026'],
    glosario: [
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
    ],
  },
  {
    slug: 'ecommerce-chileno-busqueda-ia-cyberday-2026',
    titulo: 'El e-commerce chileno frente a la búsqueda con iA: lo que ya cambió y qué hacer antes del CyberDay 2026',
    descripcion:
      'En 2025-2026 el tráfico desde iA generativa al retail creció +4.700% y convierte hasta 5x más que el orgánico clásico. En Chile, el CyberDay 2026 incorpora "Cyber AI" oficial y Latam-GPT empieza a operar. Guía aterrizada para una pyme chilena que quiere llegar al evento siendo recomendada por ChatGPT, no ignorada.',
    fecha: '2026-05-29',
    categoria: 'Casos & Datos',
    tags: ['Chile', 'E-commerce', 'CyberDay', 'ChatGPT', 'Cyber AI', 'Latam-GPT'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    destacado: true,
    resumen:
      'El tráfico desde iA generativa al retail creció +4.700% en 2025 y convierte hasta 5x más que el orgánico clásico. En Chile, el CyberDay 2026 (1-3 junio) incorpora "Cyber AI" oficial y ya opera Latam-GPT. Para una pyme local, optimizar para iA antes de junio es la ventana más rentable del año.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'El cliente chileno que va a comprar en el CyberDay 2026 ya no abre primero Google. Abre ChatGPT y pregunta si tu tienda es confiable, si tus precios son reales, o cuál opción de tu categoría conviene más. Esa conversación ocurre antes de que tu landing exista en su mente — y, si la iA no te conoce, ya perdiste la venta.',
      },
      {
        tipo: 'parrafo',
        texto:
          'No es una predicción. Los datos de 2025-2026 muestran que el cambio ya pasó. En Chile, además, el CyberDay 2026 incorpora un agente conversacional oficial llamado "Cyber AI" y al mismo tiempo opera Latam-GPT, el primer modelo de iA pensado para nuestra región. La ventana para entrar al mapa con ventaja se cuenta en semanas, no meses.',
      },
      { tipo: 'h2', texto: 'Los números que cambiaron el juego en 2025-2026' },
      {
        tipo: 'lista',
        items: [
          'El tráfico desde iA generativa al retail creció +4.700% interanual en 2025 (Adobe). Cyber Monday por sí solo subió +670%.',
          'Las visitas que llegan desde ChatGPT, Perplexity y AI Overviews convierten entre 4x y 5x más que el orgánico clásico — múltiples estudios independientes 2025-2026 lo confirman.',
          'El tráfico de ChatGPT específicamente convierte +31% sobre el no-branded organic (Visibility Labs, 94 tiendas analizadas).',
          'Perplexity cita el 4,2% de las páginas optimizadas; Google AI Overviews solo el 2,1%. Diferencia material a la hora de elegir dónde poner el esfuerzo.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'Traducción para una pyme chilena: cada visita que llega desde iA vale como 4 o 5 visitas de Google. No estás eligiendo entre canales que pesan igual — estás eligiendo entre el canal viejo y el que multiplica conversión.',
      },
      { tipo: 'h2', texto: 'Lo que ya cambió en Chile' },
      { tipo: 'h3', texto: 'CyberDay 2026 con "Cyber AI" oficial' },
      {
        tipo: 'parrafo',
        texto:
          'La Cámara de Comercio de Santiago confirmó que el CyberDay 2026 (1 al 3 de junio) incorpora "Cyber AI", un agente conversacional que ayuda al consumidor a buscar productos, comparar opciones y obtener recomendaciones personalizadas durante el evento. Es la primera vez que el agente vive dentro del evento mismo — no solo en ChatGPT, también en el portal oficial.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Implicancia directa: tu marca tiene que ser legible por ese agente. Si tu catálogo, precios y políticas no están estructurados, el "Cyber AI" puede recomendar a tu competencia incluso desde el portal donde tú participas.',
      },
      { tipo: 'h3', texto: 'Latam-GPT, el modelo regional' },
      {
        tipo: 'parrafo',
        texto:
          'Lanzado en Chile con inversión pública y privada, Latam-GPT es el primer LLM entrenado con datos regionales. Aún es temprano para medir su impacto comercial, pero la señal estratégica es clara: el contenido local, en español de Chile, con referencias a marcas y medios chilenos, empieza a ser una ventaja competitiva, no solo una nota de color.',
      },
      { tipo: 'h2', texto: 'La paradoja del retail chileno' },
      {
        tipo: 'parrafo',
        texto:
          'Adobe documentó en 2026 algo incómodo: el tráfico desde iA crece, pero los sitios de retail no son legibles para máquinas. Falta JSON-LD, los datos de producto son inconsistentes, y las plataformas estándar (Tiendanube, Shopify) no agregan structured data por defecto. Esa brecha es uniforme en LATAM — y en Chile la viven incluso retailers grandes.',
      },
      {
        tipo: 'parrafo',
        texto:
          'El otro dato que importa: la mayoría de los equipos de marketing enterprise ya tienen una iniciativa de GEO en marcha, pero la mayoría de los equipos de pyme aún no empezó. Eso significa una cosa concreta: la ventaja competitiva está abierta para quien se mueva primero, antes de que el espacio se sature.',
      },
      {
        tipo: 'cita',
        texto:
          'La ventaja competitiva ya no está en acceder a herramientas de iA — está en qué tan organizada y estructurada está la información de tu negocio para que esas IAs la entiendan y la usen.',
        fuente: 'Tendencias e-Commerce LATAM 2026',
      },
      { tipo: 'h2', texto: 'Por qué Google Shopping sigue siendo palanca (sí, en serio)' },
      {
        tipo: 'parrafo',
        texto:
          'Uno de los hallazgos más accionables de 2026: el 83% del carrusel de productos de ChatGPT Shopping se nutre directamente de Google Shopping (Merchant Center). Para una tienda chilena, esto significa que la inversión que ya hiciste en feed de Merchant Center está alimentando tu visibilidad en ChatGPT — quieras o no.',
      },
      {
        tipo: 'lista',
        items: [
          'Revisa que tu feed de Merchant Center esté activo, sin errores, con precios y stock actualizados.',
          'Completa los atributos opcionales (GTIN, marca, condición, despacho) — son los que la iA usa para decidir.',
          'Asegúrate de que las imágenes sean de tu catálogo real, no stock genérico.',
          'Sincroniza políticas de devolución y despacho con lo que muestra tu sitio. Inconsistencia = pérdida de confianza para el agente.',
        ],
      },
      { tipo: 'h2', texto: 'Los 6 cambios concretos para llegar al CyberDay con tu marca visible' },
      {
        tipo: 'lista',
        items: [
          'Audita tu Share of Model esta semana: descubre si ChatGPT te recomienda hoy en queries reales de tu categoría.',
          'Implementa JSON-LD de tipo Organization, Store y Product en tu sitio. Es código que tu equipo puede pegar esta tarde.',
          'Pide 5 reseñas nuevas en Google Reviews esta semana. Frescura es señal de ranking en el paso de recuperación.',
          'Limpia tu feed de Merchant Center — es lo que alimenta el carrusel de ChatGPT Shopping.',
          'Publica una pieza propia con datos o experiencia real (no contenido genérico) que medios de nicho o blogs chilenos puedan citar.',
          'Verifica consistencia entre tu sitio, Google Business Profile y feeds. La iA cruza fuentes — si discrepan, te penaliza.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'Quedan pocos días para el CyberDay. Los sistemas RAG de Perplexity y ChatGPT con búsqueda web indexan cambios en 48-72 horas. Lo que implementes ahora alcanza la ventana de búsquedas de validación previas al peak (25 al 31 de mayo).',
      },
    ],
    ctaTexto: 'Auditar mi tienda antes del CyberDay →',
    ctaUrl: '/auditar/ecommerce/',
    relacionados: ['5-hacks-geo-que-google-dice-no-sirven', 'que-es-rag-como-decide-citas-ia', 'chatgpt-busqueda-web-cambia-geo-2026', 'comercio-conversacional-agentes-ucp'],
    glosario: [
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
    ],
  },
  {
    slug: 'geo-saas-chile-aparecer-chatgpt-salesforce-hubspot',
    titulo: 'GEO para SaaS en Chile: cómo aparecer en ChatGPT cuando comparan tu producto con Salesforce o HubSpot',
    descripcion:
      'El 67% de los compradores B2B ya consulta a la iA antes de su primera llamada con ventas. Cómo posicionar un SaaS chileno o latinoamericano en ChatGPT y Perplexity cuando los evaluadores buscan alternativas a software internacional.',
    fecha: '2026-05-29',
    categoria: 'GEO & AEO',
    tags: ['SaaS', 'B2B', 'ChatGPT', 'GEO', 'Chile'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'El comprador B2B ya armó su shortlist con ChatGPT antes de tu primera llamada. Para un SaaS chileno o LATAM, pelear contra Salesforce o HubSpot en queries genéricas es perdido — ganar las queries de especificidad ("alternativa local con integración al SII") es posible y barato.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Si vendes un SaaS B2B en Chile y todavía mides el funnel desde el primer formulario, te estás perdiendo el 67% del proceso de evaluación. Esa fracción —según múltiples estudios B2B de 2025-2026— ya pasó antes de que el comprador hable contigo. Y cada vez más, esa investigación previa la modera ChatGPT.',
      },
      { tipo: 'h2', texto: 'El ciclo B2B se mudó al chat' },
      {
        tipo: 'parrafo',
        texto:
          'Los compradores ya no comparan tres pestañas abiertas en el navegador. Le preguntan a ChatGPT cuál es el mejor CRM para una pyme chilena, qué alternativas a HubSpot existen en LATAM, o si tu producto sirve mejor que el de la competencia para su industria. Si no apareces en esas respuestas, ni siquiera entras al shortlist.',
      },
      {
        tipo: 'nota',
        texto:
          'La consecuencia operativa es directa: las leads que llegan a tu CRM hoy son solo los que ChatGPT ya validó. Los que la iA descartó ni se contactan. Tu pipeline está siendo filtrado antes de que existas para él.',
      },
      { tipo: 'h2', texto: 'Por qué pelear contra Salesforce en queries genéricas es la trampa' },
      {
        tipo: 'parrafo',
        texto:
          'Salesforce, HubSpot y Monday acumularon una década de menciones en fuentes que los LLM indexan como autoritativas: G2, Capterra, TechCrunch, Forrester, Gartner. Esa densidad de entidad es prácticamente imposible de igualar a corto plazo. Si tu estrategia GEO es "aparecer en \'mejor CRM\'", ya empezaste perdiendo.',
      },
      {
        tipo: 'parrafo',
        texto:
          'La buena noticia: los LLM no responden solo queries genéricas. Recompensan especificidad. Una query como "CRM para pyme chilena con integración al SII y atención en español" no la gana Salesforce — la gana quien posicione exactamente esa propuesta de valor.',
      },
      { tipo: 'h2', texto: 'Las 3 categorías de queries donde un SaaS local puede ganar' },
      {
        tipo: 'lista',
        items: [
          'Queries de alternativa-a-X: "alternativa a HubSpot para empresas latinoamericanas con ciclos de venta cortos". El comprador ya conoce al líder y busca la opción local.',
          'Queries de integración específica: "software de facturación con conexión al SII y multi-RUT". La especificidad técnica es tu cancha.',
          'Queries de comparación entre dos: "comparar [Tu SaaS] vs [Competidor directo]". Si no controlas cómo se cuenta esa comparación, lo hace tu competidor.',
        ],
      },
      { tipo: 'h2', texto: 'La señal más subestimada: G2, Capterra y Software Advice' },
      {
        tipo: 'parrafo',
        texto:
          'Perplexity y ChatGPT con búsqueda web tratan las plataformas de reseñas B2B como fuentes de alta confianza. Un perfil de G2 con menos de 10 reseñas en el último año es señal de inactividad — la iA prefiere recomendar un producto con menor calificación pero más reseñas recientes que uno con 5 estrellas y silencio prolongado.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Para un SaaS chileno, lo accionable es invertir en perfil de G2 y Capterra, pedir reseñas a clientes activos cada trimestre, y responder públicamente las negativas. Es donde la iA mira primero cuando alguien le pregunta por tu categoría.',
      },
      {
        tipo: 'cita',
        texto:
          'En enterprise B2B con múltiples stakeholders, cada evaluador hace sus propias consultas a la iA. Aparecer en cada una de esas consultas equivale a tener un SDR trabajando 24/7 en cada cuenta — sin payroll.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Los 5 cambios concretos GEO para un SaaS chileno' },
      {
        tipo: 'lista',
        items: [
          'Implementa JSON-LD de tipo SoftwareApplication con featureList, applicationCategory y precio. Es lo que la iA usa para clasificarte.',
          'Construye un perfil sólido en G2 y Capterra con reseñas recientes. Mide cantidad y frescura, no solo rating.',
          'Identifica 3-5 queries de alternativa-a-X o integración específica que sí puedes ganar. Crea contenido propio que las responda con experiencia real.',
          'Trabaja Digital PR en medios tech de LATAM (FayerWayer, Pisapapeles, blogs de startups) — no necesitas TechCrunch.',
          'Audita tu Share of Model en queries de tu categoría todos los meses. Mide drift, no estado.',
        ],
      },
    ],
    ctaTexto: 'Auditar mi SaaS en ChatGPT →',
    ctaUrl: '/auditar/saas/',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'contenido-commodity-vs-experiencia-real-ia', 'perplexity-vs-chatgpt-citas-2026'],
    glosario: [
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
    ],
  },
  {
    slug: 'geo-retail-chile-tiendas-fisicas-chatgpt',
    titulo: 'GEO para retail en Chile: por qué tus tiendas físicas también necesitan aparecer en ChatGPT',
    descripcion:
      'Las consultas locales a iA ("mejor tienda de [categoría] en [comuna]") crecen más rápido que las genéricas. Cómo estructurar un retail con presencia física para aparecer en ChatGPT, Perplexity y AI Overviews cuando un cliente busca cerca.',
    fecha: '2026-05-29',
    categoria: 'GEO & AEO',
    tags: ['Retail', 'Local SEO', 'LocalBusiness', 'GEO', 'Chile'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Las queries del tipo "mejor [categoría] en [comuna]" están creciendo más rápido que las genéricas en ChatGPT. Un retail con tiendas físicas necesita JSON-LD LocalBusiness por sucursal, Google Business Profile actualizado y reseñas frescas por local — no solo a nivel marca.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Todo el discurso de "GEO para retail" termina hablando de e-commerce. Pero el retail con tiendas físicas en Chile tiene una oportunidad propia, y la mayoría la está dejando pasar: las consultas locales a iA son el segmento que más crece, y el más fácil de ganar.',
      },
      { tipo: 'h2', texto: 'La consulta local es el segmento de mayor crecimiento' },
      {
        tipo: 'parrafo',
        texto:
          'Cuando alguien le pregunta a ChatGPT "mejor tienda de muebles en Providencia" o "ferretería con despacho mismo día en Ñuñoa", la iA responde con marcas específicas — y en esas respuestas, la ventaja no es del retailer con más facturación, sino del que tiene su información local estructurada.',
      },
      { tipo: 'h2', texto: 'LocalBusiness, no Organization' },
      {
        tipo: 'parrafo',
        texto:
          'El error técnico más común en retail multi-sucursal: tener un único JSON-LD de Organization a nivel marca. Para queries locales, eso no sirve. La iA necesita un nodo LocalBusiness (o subtipo más específico: HomeAndConstructionBusiness, ClothingStore, Pharmacy) por cada sucursal, con su dirección, horarios, teléfono y enlace al GBP correspondiente.',
      },
      { tipo: 'h2', texto: 'Google Business Profile sigue mandando (sí, en la era de la iA)' },
      {
        tipo: 'parrafo',
        texto:
          'Tanto Google AI Overviews como ChatGPT con búsqueda web consultan datos de Google Business Profile cuando responden queries locales. Un GBP completo, con horarios actualizados, fotos recientes y reseñas respondidas, es la señal estructurada más fácil y de mayor retorno que un retail puede mover esta semana.',
      },
      {
        tipo: 'nota',
        texto:
          'Verifica además que cada sucursal tenga su GBP propio (no uno solo a nivel marca). Esto es lo que permite a la iA responder por comuna y no por nombre comercial.',
      },
      { tipo: 'h2', texto: 'Reseñas por sucursal, no por marca' },
      {
        tipo: 'parrafo',
        texto:
          'Una tienda con 4,8 estrellas globales pero con sucursales sin reseñas individuales pierde en queries locales. La iA prefiere recomendar una sucursal con 4,3 y reseñas recientes específicas a esa dirección que una marca con buen promedio pero datos genéricos. Pídeles reseñas a tus clientes mencionando la sucursal.',
      },
      {
        tipo: 'cita',
        texto:
          'En retail físico, el JSON-LD LocalBusiness por sucursal + GBP completo + reseñas por dirección es la trinidad técnica. Sin esos tres, eres invisible en queries locales — el segmento donde más fácil ganas.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Los 5 cambios concretos GEO para retail físico chileno' },
      {
        tipo: 'lista',
        items: [
          'JSON-LD LocalBusiness (o subtipo) por cada sucursal, con address, openingHours, telephone y sameAs al GBP.',
          'GBP por sucursal, con categorías correctas, horarios actualizados y al menos 10 fotos recientes.',
          'Campaña de reseñas por sucursal: pide al cliente que mencione la dirección o comuna en su review.',
          'Consistencia de datos entre tu sitio, GBP y portales tipo Reclamos.cl o Yelp Chile.',
          'Audita Share of Model por comuna, no solo a nivel marca. La visibilidad puede variar fuerte entre sucursales.',
        ],
      },
    ],
    ctaTexto: 'Auditar mi retail en ChatGPT →',
    ctaUrl: '/auditar/retail/',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'ecommerce-chileno-busqueda-ia-cyberday-2026', 'jsonld-organization-chile'],
    glosario: [
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
    ],
  },
  {
    slug: 'geo-clinicas-chile-evitar-alucinacion-ia',
    titulo: 'GEO para clínicas en Chile: cómo evitar que ChatGPT desinforme sobre tu centro médico',
    descripcion:
      'Las alucinaciones de iA en salud son riesgo clínico, no solo reputacional. Cómo estructurar la información pública de una clínica chilena para que los LLM respondan con precisión sobre especialidades, médicos y coberturas — y no inventen datos.',
    fecha: '2026-05-29',
    categoria: 'GEO & AEO',
    tags: ['Salud', 'Clínicas', 'JSON-LD', 'Alucinación iA', 'Chile'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Una alucinación de iA sobre tu clínica —especialidad inventada, médico mal atribuido, cobertura equivocada— es riesgo clínico, no solo de marketing. La defensa es JSON-LD MedicalClinic/Physician preciso y consistencia entre tu sitio, GBP, redes y portales de salud.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'En cualquier industria, una alucinación de iA sobre tu marca es un problema. En salud, es algo más serio: un paciente que llega a la consulta con la convicción de que tu clínica tiene una especialidad que no tiene, o que cubre un seguro que no cubre, ya tomó una decisión basada en información incorrecta. La responsabilidad de prevenir eso es de la clínica, no del LLM.',
      },
      { tipo: 'h2', texto: 'Cómo se ve una alucinación de iA sobre una clínica' },
      {
        tipo: 'parrafo',
        texto:
          'No son errores estridentes. Son errores plausibles. Un LLM puede afirmar con seguridad que tu centro médico cubre Isapre Cruz Blanca cuando no lo hace, que tu jefe de cardiología es alguien que se fue hace dos años, o que tu sucursal de Las Condes atiende urgencias 24/7 cuando solo es ambulatoria. El paciente no verifica — actúa.',
      },
      { tipo: 'h2', texto: 'Por qué pasa: el LLM rellena vacíos cuando faltan datos estructurados' },
      {
        tipo: 'parrafo',
        texto:
          'Las alucinaciones no son errores aleatorios. Ocurren cuando el modelo no tiene suficiente información de alta calidad sobre una entidad y "rellena" con datos plausibles. Si tu sitio no declara qué especialidades ofreces, qué isapres cubres y qué médicos integran tu staff de forma estructurada, la iA infiere. Y a veces, mal.',
      },
      { tipo: 'h2', texto: 'Schema.org tiene tipos médicos que casi nadie usa' },
      {
        tipo: 'parrafo',
        texto:
          'La mayoría de las clínicas chilenas declara como mucho un Organization genérico. Schema.org tiene tipos específicos diseñados para reducir ambigüedad: MedicalClinic, Hospital, Physician, MedicalSpecialty, MedicalProcedure, HealthInsurancePlan. Cada uno tiene campos pensados para que la iA lea sin inferir.',
      },
      {
        tipo: 'lista',
        items: [
          'MedicalClinic o Hospital para el centro: medicalSpecialty, availableService, paymentAccepted.',
          'Physician por cada médico: medicalSpecialty, availableService, hospitalAffiliation.',
          'HealthInsurancePlan listando isapres y previsiones que efectivamente cubres.',
          'MedicalProcedure para tratamientos especializados con descripción clara.',
        ],
      },
      { tipo: 'h2', texto: 'La consistencia importa más que la cantidad' },
      {
        tipo: 'parrafo',
        texto:
          'Los LLM cruzan tu sitio con Google Business Profile, portales como Doctoralia o Examedi y redes sociales. Si tu sitio dice una cosa y tu GBP otra, la iA elige cualquiera de las dos versiones, y a veces inventa una tercera. Auditoría de consistencia es tan importante como agregar más datos.',
      },
      {
        tipo: 'cita',
        texto:
          'En salud, el problema no es que la iA te omita. Es que te describa con datos plausibles pero erróneos. Tu defensa no es contenido más persuasivo — es información estructurada y consistente que cierre el espacio donde la iA podría inferir.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Lo que NO recomendamos hacer en salud' },
      {
        tipo: 'lista',
        items: [
          'No infles aggregateRating ni inventes reseñas: los LLM cruzan con fuentes externas y te penalizan más de lo que ganarías.',
          'No uses iA generativa para contenido médico sin revisión profesional. El riesgo regulatorio y clínico no compensa el ahorro de tiempo.',
          'No omitas información negativa o limitaciones reales: la iA premia la transparencia, y un paciente que llega informado de verdad es un paciente que vuelve.',
        ],
      },
      { tipo: 'h2', texto: 'Los 5 cambios concretos GEO para una clínica o centro médico chileno' },
      {
        tipo: 'lista',
        items: [
          'Implementa JSON-LD con tipos médicos específicos (MedicalClinic, Physician, MedicalSpecialty), no solo Organization.',
          'Audita consistencia entre tu sitio, GBP, Doctoralia, Examedi y redes sociales.',
          'Lista explícitamente isapres y previsiones cubiertas en tu sitio y en datos estructurados.',
          'Mantén actualizado el staff médico — un médico que ya no atiende y sigue listado es una alucinación esperando ocurrir.',
          'Audita tu Share of Model por especialidad. Tu visibilidad puede ser distinta en cardiología que en pediatría, incluso siendo la misma clínica.',
        ],
      },
    ],
    ctaTexto: 'Auditar mi clínica en ChatGPT →',
    ctaUrl: '/auditar/salud/',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'jsonld-organization-chile', '5-hacks-geo-que-google-dice-no-sirven'],
    glosario: [
      { slug: 'alucinacion-ia', termino: 'Alucinación de iA' },
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
    ],
  },
  {
    slug: 'geo-banca-fintech-chile-comparativas-ia',
    titulo: 'GEO para banca en Chile: cómo aparecer en las comparativas que ChatGPT hace de productos financieros',
    descripcion:
      'Tasas, comisiones y requisitos: los clientes le piden a ChatGPT que les compare bancos y fintechs antes de decidir. Cómo posicionar tu institución para entrar en esas síntesis, declarando explícitamente la regulación CMF como señal estructurada.',
    fecha: '2026-05-29',
    categoria: 'GEO & AEO',
    tags: ['Banca', 'Fintech', 'CMF', 'Comparativas', 'Chile'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'ChatGPT ya hace comparativas de productos financieros chilenos antes de que el cliente entre al comparador. La señal más subestimada para aparecer: declarar tu regulación CMF en JSON-LD. Sin eso, la iA puede omitirte como opción "no validada" frente a alternativas más conocidas.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'El cliente chileno que está por contratar un crédito, abrir una cuenta o tomar un seguro ya no entra primero a un comparador. Le pregunta a ChatGPT cuál banco le conviene, qué fintech tiene mejor tasa, o si tal institución es confiable. La síntesis que recibe define gran parte de la decisión — y la mayoría de las instituciones medianas y fintechs no aparece en ella.',
      },
      { tipo: 'h2', texto: 'Anatomía de una comparativa que hace ChatGPT' },
      {
        tipo: 'parrafo',
        texto:
          'Cuando un usuario pregunta "compara cuenta corriente empresarial entre BCI y Banco Estado", el LLM no recupera un comparador prearmado: sintetiza datos públicos (tasas referenciales, comisiones, requisitos) que encuentra en los sitios de las propias instituciones, en medios financieros y en foros. Si esos datos no están legibles en tu sitio, la iA usa los del competidor — y arma la comparativa sin ti.',
      },
      { tipo: 'h2', texto: 'Por qué declarar regulación CMF cambia tu visibilidad' },
      {
        tipo: 'parrafo',
        texto:
          'Los LLM evalúan confianza antes de recomendar. En servicios financieros, la regulación es la señal de confianza institucional más importante. Pero ChatGPT no sabe que estás regulado por la CMF a menos que lo declares de forma estructurada en tu JSON-LD (campo memberOf o award referenciando CMF) y en el contenido visible.',
      },
      {
        tipo: 'nota',
        texto:
          'Es una de las brechas más fáciles de cerrar y de mayor impacto: una fintech regulada cuyo sitio no menciona explícitamente la fiscalización CMF puede ser omitida en respuestas comparativas frente a un banco grande que sí lo declara desde el footer.',
      },
      { tipo: 'h2', texto: 'Digital PR financiero como palanca crítica' },
      {
        tipo: 'parrafo',
        texto:
          'Pulso, Diario Financiero y El Mercurio Economía son fuentes que los LLM tratan como autoridad para temas financieros chilenos. Una mención editorial (no publicidad) en cualquiera de esos medios pesa más en la respuesta de ChatGPT que tres meses de campañas en Meta Ads. Para una institución mediana o fintech, esta es la palanca más subestimada.',
      },
      { tipo: 'h2', texto: 'Fintechs: la ventana específica donde sí pueden ganar' },
      {
        tipo: 'parrafo',
        texto:
          'Una fintech no le va a ganar a BCI en queries genéricas ("mejor banco para pymes"). Pero sí puede dominar consultas específicas: "crédito rápido para independientes sin aval", "cuenta para freelancers con boleta de honorarios", "tasa más baja para crédito automotriz para profesionales jóvenes". Cada una de esas consultas tiene volumen real y baja competencia GEO.',
      },
      {
        tipo: 'cita',
        texto:
          'La regulación CMF declarada de forma estructurada y un par de menciones recientes en medios financieros pesan más en el ranking del LLM que diez años de presencia de marca sin esa señal.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Los 5 cambios concretos GEO para banca y fintech chilena' },
      {
        tipo: 'lista',
        items: [
          'Declara la regulación CMF en JSON-LD (memberOf, award) y en footer visible del sitio.',
          'Implementa JSON-LD FinancialProduct para cuentas, créditos y seguros, con campos de tasa referencial y requisitos.',
          'Identifica 5 queries de nicho donde tu producto tiene ventaja real y crea contenido propio que las responda.',
          'Invierte en Digital PR de medios financieros chilenos — la mención editorial pesa más que la pauta.',
          'Audita tu Share of Model en queries comparativas ("comparar X vs Y") cada mes.',
        ],
      },
    ],
    ctaTexto: 'Auditar mi institución en ChatGPT →',
    ctaUrl: '/auditar/banca/',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'perplexity-vs-chatgpt-citas-2026', 'jsonld-organization-chile'],
    glosario: [
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
    ],
  },
  {
    slug: 'geo-pymes-chile-competir-grandes-chatgpt',
    titulo: 'GEO para pymes en Chile: cómo competir con las grandes en ChatGPT sin presupuesto de retail',
    descripcion:
      'Las pymes chilenas son invisibles por defecto en las respuestas de ChatGPT. La buena noticia: el GEO escala con esfuerzo, no con presupuesto. Cómo una pyme puede dominar nichos específicos donde Falabella o Sodimac no pueden alcanzarte.',
    fecha: '2026-05-29',
    categoria: 'GEO & AEO',
    tags: ['Pyme', 'Emprendimiento', 'Especialización', 'GEO', 'Chile'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Una pyme chilena no le va a ganar a Falabella en queries genéricas. Pero sí puede dominar consultas específicas de nicho ("ferretería con despacho en Ñuñoa con atención personalizada") con JSON-LD bien estructurado y 5 reseñas frescas. El GEO escala con esfuerzo, no con plata.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Si eres una pyme chilena y miras los rankings genéricos de ChatGPT, la conclusión es desmoralizante: Falabella, Sodimac, Banco Estado y Walmart dominan casi todo. Pero esa lectura está incompleta. El GEO funciona distinto para una pyme — y entendiendo esa diferencia, hay una cancha donde sí puedes ganar.',
      },
      { tipo: 'h2', texto: 'La regla pyme: especificidad gana' },
      {
        tipo: 'parrafo',
        texto:
          'La query "mejor ferretería en Chile" la responde Sodimac y no hay nada que hacer ahí. Pero la query "ferretería en Ñuñoa con despacho mismo día y asesoría para electricistas residenciales" no la responde Sodimac — la responde quien posicione exactamente esa propuesta. Y ese alguien puedes ser tú, con muy poco esfuerzo.',
      },
      { tipo: 'h2', texto: 'La economía del GEO para una pyme' },
      {
        tipo: 'parrafo',
        texto:
          'A diferencia de la publicidad masiva, el GEO no escala con presupuesto, escala con esfuerzo focalizado. Un JSON-LD bien configurado se paga una vez. Una reseña real cuesta un mensaje de WhatsApp a un cliente satisfecho. Una mención en un blog de nicho cuesta un buen email a su autor. La inversión total para mover el Share of Model de una pyme en consultas específicas se mide en horas, no en pesos.',
      },
      {
        tipo: 'nota',
        texto:
          'Esta es la ventana real: la mayoría de los equipos de marketing pyme aún no empezó con GEO. La saturación está en grandes empresas, no en nichos. Quien se mueva primero captura el espacio.',
      },
      { tipo: 'h2', texto: 'Tu zona, tu nicho, tu ventaja' },
      {
        tipo: 'parrafo',
        texto:
          'Identificar tus queries ganadoras es un ejercicio concreto: combina tu ubicación geográfica (comuna o región), tu nicho de especialización y un atributo diferenciador. Tres dimensiones. La intersección de las tres define un terreno donde casi nadie compite. Ejemplos: "estudio de yoga en Ñuñoa con clases de embarazadas", "veterinaria de exóticos en Providencia", "carpintero a domicilio en Maipú con experiencia en muebles a medida".',
      },
      { tipo: 'h2', texto: 'Los 5 cambios concretos: tu plan de 14 días para una pyme' },
      {
        tipo: 'lista',
        items: [
          'Días 1-2: Audita tu Share of Model en 3 queries específicas de tu nicho. Identifica el gap.',
          'Días 3-4: Implementa JSON-LD LocalBusiness con tu zona, especialidad y atributos diferenciadores claros.',
          'Días 5-7: Pide 5 reseñas a clientes recientes en Google Reviews. Pídeles que mencionen tu zona o especialidad en el texto.',
          'Días 8-10: Actualiza tu Google Business Profile con fotos recientes, horarios, y categorías secundarias relevantes.',
          'Días 11-14: Escribe a 3 blogs o medios locales de tu nicho con una propuesta de contenido valioso (no autopromoción). Una sola mención editorial mueve la aguja.',
        ],
      },
      {
        tipo: 'cita',
        texto:
          'A diferencia de las grandes, la pyme no necesita ganar 100 queries. Necesita ganar las 5 queries específicas donde su cliente ideal realmente pregunta. Ahí, el GEO es la palanca de captación más barata que existe hoy.',
        fuente: 'Análisis Ai Visibility',
      },
    ],
    ctaTexto: 'Auditar mi pyme en ChatGPT →',
    ctaUrl: '/auditar/pyme/',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'jsonld-organization-chile', 'contenido-commodity-vs-experiencia-real-ia'],
    glosario: [
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
    ],
  },
  {
    slug: 'geo-inmobiliarias-chile-decision-comprar-ia',
    titulo: 'GEO para inmobiliarias en Chile: cómo aparecer en ChatGPT cuando alguien decide dónde vivir',
    descripcion:
      'La búsqueda de propiedad empieza meses antes del contacto, y ChatGPT ya es el primer consejero. Cómo posicionar una inmobiliaria o corredor chileno en consultas sobre comunas, proyectos en preventa y decisión de compra vs arriendo.',
    fecha: '2026-05-29',
    categoria: 'GEO & AEO',
    tags: ['Inmobiliaria', 'Propiedades', 'RealEstate', 'GEO', 'Chile'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'La decisión inmobiliaria se cocina por meses en ChatGPT antes del primer contacto con un corredor. Para una inmobiliaria o corredor chileno, aparecer en esa fase exploratoria —preguntas sobre comunas, valores y proyectos— es la palanca de captación más subestimada hoy.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'En e-commerce, una visita en ChatGPT termina en compra en horas. En inmobiliario, la ventana es de meses. El cliente que llega a tu corredor en agosto empezó a preguntarle a ChatGPT en marzo sobre qué comuna le conviene, cuánto vale el metro cuadrado y qué inmobiliarias son confiables. Si no apareciste en esa conversación de cinco meses, llegaste tarde aunque te llame.',
      },
      { tipo: 'h2', texto: 'La fase exploratoria es donde se gana o se pierde' },
      {
        tipo: 'parrafo',
        texto:
          'La búsqueda inmobiliaria tiene una característica única: el comprador investiga por mucho tiempo y le hace preguntas amplias a la iA. "¿Conviene comprar en Ñuñoa o Maipú?", "¿qué pasa con las tasas hipotecarias?", "¿es buena inversión un departamento de un dormitorio en Estación Central?". En ninguna de esas queries el usuario está pidiendo un corredor — pero cada respuesta de ChatGPT está moldeando a quién contactará cuando esté listo.',
      },
      { tipo: 'h2', texto: 'La iA opina sobre comunas con o sin ti' },
      {
        tipo: 'parrafo',
        texto:
          'ChatGPT responde con confianza sobre qué comunas están en alza, cuáles tienen mejor proyección y qué barrios conviene evitar. Esos contenidos los toma de medios, foros y portales. Si tu inmobiliaria publica análisis de mercado fundamentados (datos reales de tu cartera, observaciones de campo, comparativas con cifras) en tu blog o en medios chilenos, te conviertes en una de las fuentes que la iA cita cuando alguien pregunta. Si no publicas nada, la iA cita a tu competencia.',
      },
      { tipo: 'h2', texto: 'RealEstateListing: la ventana técnica para proyectos en preventa' },
      {
        tipo: 'parrafo',
        texto:
          'Un proyecto en preventa con JSON-LD de tipo RealEstateListing (ubicación, tipologías, precio referencial, fecha de entrega, área en m²) puede aparecer en respuestas de ChatGPT antes de que tenga su primer aviso pagado en portal inmobiliario. Es una ventaja temporal que casi nadie está usando.',
      },
      { tipo: 'h2', texto: 'El riesgo asimétrico de las reseñas negativas' },
      {
        tipo: 'parrafo',
        texto:
          'Los LLM ponderan reseñas negativas con más peso que positivas cuando responden sobre decisiones de alto monto. Una reseña negativa en un portal indexado puede hacer que ChatGPT te incluya en la respuesta con advertencia ("la inmobiliaria X aparece mencionada pero algunos clientes reportan…"). Auditar tu Share of Model incluye detectar si estás siendo recomendado o "recomendado con asterisco" — algo invisible en cualquier dashboard tradicional.',
      },
      {
        tipo: 'cita',
        texto:
          'En inmobiliario, no estás compitiendo por aparecer cuando el cliente busca un corredor. Estás compitiendo por aparecer cinco meses antes, cuando todavía decide en qué comuna mirar. Esa fase la define ChatGPT, y la inmobiliaria que lo entienda primero captura el ciclo entero.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Los 6 cambios concretos GEO para una inmobiliaria o corredor chileno' },
      {
        tipo: 'lista',
        items: [
          'Publica análisis de mercado con datos propios (variación de precios por comuna, demanda observada, tipologías más buscadas). Esto te convierte en fuente para la iA.',
          'JSON-LD RealEstateOrganization o RealEstateAgent con areaServed por comuna y especialización por tipo de propiedad.',
          'RealEstateListing para cada proyecto en preventa, con datos completos y consistentes.',
          'Pide reseñas a clientes recientes en Google Reviews y portales como Mercado Libre Propiedades. Tres reseñas positivas por trimestre mantienen la frescura.',
          'Monitorea reseñas negativas — responde públicamente y resuelve. El LLM lee la respuesta y ajusta su síntesis.',
          'Audita Share of Model en queries exploratorias ("conviene comprar en Ñuñoa", "cuánto vale el metro cuadrado en Providencia") — no solo en "inmobiliarias confiables en Chile".',
        ],
      },
    ],
    ctaTexto: 'Auditar mi inmobiliaria en ChatGPT →',
    ctaUrl: '/auditar/inmobiliaria/',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'jsonld-organization-chile', 'contenido-commodity-vs-experiencia-real-ia'],
    glosario: [
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'alucinacion-ia', termino: 'Alucinación de iA' },
    ],
  },
  {
    slug: 'que-es-rag-como-decide-citas-ia',
    titulo: '¿Qué es RAG (Retrieval-Augmented Generation) y cómo decide qué marcas cita la iA?',
    descripcion:
      'RAG es la arquitectura que permite a ChatGPT y Perplexity buscar en internet antes de responder. Explicamos en simple qué es, cómo funciona paso a paso y por qué determina si la iA recomienda tu marca o la de tu competencia.',
    fecha: '2026-05-27',
    categoria: 'Análisis LLM',
    tags: ['RAG', 'LLM', 'ChatGPT', 'Perplexity', 'GEO'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'RAG (Retrieval-Augmented Generation) es la arquitectura donde un LLM recupera documentos de internet y luego genera la respuesta a partir de ellos. Si tu contenido no está en ese paso de recuperación, la iA no puede citarte — por más bueno que seas.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Si te preguntas por qué ChatGPT recomienda a tu competencia y no a ti, la respuesta casi siempre pasa por entender RAG. Es la arquitectura que hoy decide qué marcas entran en una respuesta de iA y cuáles quedan fuera. Y la buena noticia es que se puede influir.',
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
      { tipo: 'h2', texto: 'Por qué RAG decide si la iA cita tu marca' },
      {
        tipo: 'parrafo',
        texto:
          'El paso de recuperación funciona parecido a un buscador: prioriza fuentes accesibles, con autoridad y alineadas con la consulta. Por eso una marca puede tener un gran producto y aun así ser invisible para la iA: si su contenido no es rastreable, no responde preguntas concretas o no aparece en fuentes que el sistema considera confiables, simplemente no entra al material que el modelo usa para responder.',
      },
      {
        tipo: 'cita',
        texto:
          'En la era RAG, no compites por estar en la memoria del modelo. Compites por estar entre los documentos que recupera en el momento exacto en que tu cliente pregunta.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Los 5 cambios concretos para que RAG te recupere' },
      {
        tipo: 'lista',
        items: [
          'Asegura que tu sitio sea rastreable e indexable — es la puerta de entrada al paso de recuperación.',
          'Crea contenido que responda preguntas concretas de tu categoría, no textos genéricos.',
          'Usa JSON-LD para que la iA lea tu identidad de marca sin equivocarse de entidad.',
          'Construye presencia en fuentes que los sistemas RAG consideran autoritativas para tu industria (reseñas, medios de nicho, foros).',
          'Mide tu Share of Model para saber si, hoy, te están recuperando o no.',
        ],
      },
      {
        tipo: 'parrafo',
        texto:
          'RAG no es magia ni una caja negra inaccesible. Es un proceso de recuperación que premia el contenido accesible, claro y confiable. La marca que entiende esto deja de rogar por aparecer y empieza a construir las señales que hacen que la iA la elija.',
      },
    ],
    ctaTexto: 'Ver si la iA me recupera →',
    ctaUrl: '/#planes',
    relacionados: ['google-seo-sigue-vivo-busqueda-ia', 'chatgpt-busqueda-web-cambia-geo-2026', '5-hacks-geo-que-google-dice-no-sirven'],
    glosario: [
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
      { slug: 'llm', termino: 'LLM' },
      { slug: 'alucinacion-ia', termino: 'Alucinación de iA' },
    ],
  },
  {
    slug: '5-hacks-geo-que-google-dice-no-sirven',
    titulo: 'Los 5 hacks de GEO que Google dice que NO sirven (y qué hacer en su lugar)',
    descripcion:
      'Google publicó su guía oficial de optimización para búsqueda con iA y desmiente cinco tácticas de GEO populares: LLMS.txt, fragmentar contenido, reescribir para la iA, buscar menciones artificiales y sobre-optimizar structured data. Analizamos qué es ruido y qué sigue importando.',
    fecha: '2026-05-27',
    categoria: 'Análisis LLM',
    tags: ['Google', 'GEO', 'AEO', 'SEO', 'LLMS.txt'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'En su guía oficial, Google desmiente 5 hacks de GEO: LLMS.txt, fragmentar contenido, reescribir para iA, buscar menciones falsas y sobre-optimizar structured data. La conclusión: los fundamentos de SEO siguen mandando.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Google publicó su guía oficial de optimización para búsqueda potenciada por iA, y el mensaje incomoda a buena parte de la industria del "GEO": la mayoría de los trucos que se venden como secretos para aparecer en respuestas de iA no mueven la aguja. Lo que importa, según Google, son los fundamentos de siempre.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Repasamos los cinco "hacks" que el documento descarta explícitamente, qué tan ciertos son, y dónde Google deja una rendija que conviene entender si tu marca depende de ser citada por la iA.',
      },
      { tipo: 'h2', texto: '1. Archivos LLMS.txt' },
      {
        tipo: 'parrafo',
        texto:
          'La idea de un archivo tipo robots.txt pero para LLM se viralizó en 2025. Google es claro: no necesitas un archivo legible por máquina especial para que la iA entienda tu sitio. Los sistemas usan el mismo contenido HTML que ya rastrean para búsqueda.',
      },
      {
        tipo: 'nota',
        texto:
          'Matiz importante: Google habla de SU buscador con iA. Algunos crawlers de terceros sí leen LLMS.txt, pero como señal marginal. No es donde está tu retorno — un buen contenido indexable rinde mucho más.',
      },
      { tipo: 'h2', texto: '2. Fragmentar el contenido en bloques pequeños' },
      {
        tipo: 'parrafo',
        texto:
          'Se popularizó la idea de partir artículos en "chunks" cortos porque supuestamente así los RAG los digieren mejor. Google lo descarta: no necesitas trocear tu contenido para que funcione en búsqueda con iA. Escribe páginas completas y bien estructuradas.',
      },
      { tipo: 'h2', texto: '3. Reescribir todo para que lo entienda la iA' },
      {
        tipo: 'parrafo',
        texto:
          'No hay un "lenguaje para iA". Google recomienda escribir de forma natural para personas. El contenido claro y bien organizado que sirve a un humano es exactamente el que la iA procesa mejor.',
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
          'El más polémico para quienes vendemos GEO: Google dice que el structured data NO es obligatorio para aparecer en respuestas generadas por iA. No es la palanca mágica que muchos pintan.',
      },
      {
        tipo: 'cita',
        texto:
          'Que no sea obligatorio no significa que sea inútil. El JSON-LD no te hace rankear más alto en iA, pero reduce los errores de entidad: evita que ChatGPT te confunda con otra marca, te ubique en el país equivocado o invente tu antigüedad.',
        fuente: 'Análisis Ai Visibility',
      },
      {
        tipo: 'parrafo',
        texto:
          'Nuestra lectura: usa structured data como higiene de datos, no como hack de ranking. Es barato, evita malentendidos costosos de la iA, pero no reemplaza tener buen contenido y reputación real.',
      },
      { tipo: 'h2', texto: 'Los 5 cambios concretos que sí mueven la aguja' },
      {
        tipo: 'lista',
        items: [
          'Aplica los fundamentos de SEO: que tu sitio sea rastreable, indexable y rápido.',
          'Crea contenido con perspectiva propia, no genérico. La iA premia la experiencia real, no el refrito.',
          'Consigue menciones orgánicas en fuentes con autoridad de tu nicho.',
          'Usa JSON-LD para precisión de entidad, no esperando que te suba en el ranking.',
          'Mide tu Share of Model para saber si todo esto está funcionando en ChatGPT y Perplexity, no solo en Google.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'Recuerda: esta guía es de Google sobre su propio buscador con iA. ChatGPT y Perplexity tienen mecánicas distintas. Lo que Google minimiza (structured data, menciones) puede pesar diferente en otros motores. Por eso conviene auditar cada uno por separado.',
      },
    ],
    ctaTexto: 'Auditar mi Share of Model →',
    ctaUrl: '/#planes',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'contenido-commodity-vs-experiencia-real-ia', 'jsonld-organization-chile'],
  },
  {
    slug: 'google-seo-sigue-vivo-busqueda-ia',
    titulo: 'Google confirmó que el SEO sigue vivo en la era de la búsqueda con iA',
    descripcion:
      'La guía oficial de Google despeja el pánico del "SEO murió": los sistemas de ranking siguen siendo la base, incluso cuando la respuesta la genera una iA. Explicamos en simple cómo funcionan RAG y sub-query generation, y qué significa para tu marca.',
    fecha: '2026-05-23',
    categoria: 'Noticias iA',
    tags: ['Google', 'SEO', 'RAG', 'Búsqueda iA'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Google confirma que sus sistemas de ranking siguen siendo la base de la búsqueda con iA. RAG y sub-query generation usan el mismo índice de siempre: si no rankeas, la iA no te cita.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Cada pocos meses alguien declara muerto al SEO. La guía oficial de Google para búsqueda con iA pone las cosas en su lugar: los sistemas de ranking centrales siguen siendo la base. La iA no reemplaza al índice de búsqueda — se apoya en él.',
      },
      { tipo: 'h2', texto: 'Cómo genera respuestas la iA de Google' },
      {
        tipo: 'parrafo',
        texto:
          'Google describe dos técnicas que conviene entender porque explican por qué el SEO sigue mandando.',
      },
      { tipo: 'h3', texto: 'RAG (Retrieval-Augmented Generation)' },
      {
        tipo: 'parrafo',
        texto:
          'La iA no responde solo de memoria. Primero recupera documentos relevantes del índice de búsqueda y luego genera la respuesta a partir de ellos. Traducción: si tu página no está indexada o no rankea para la consulta, no entra en el material que la iA usa para responder.',
      },
      { tipo: 'h3', texto: 'Sub-query generation' },
      {
        tipo: 'parrafo',
        texto:
          'Ante una pregunta compleja, la iA la descompone en varias búsquedas más pequeñas, recupera resultados para cada una y los sintetiza. Esto multiplica las oportunidades de aparecer: una página puede ser citada por responder muy bien una sub-pregunta específica, aunque no sea la mejor para la consulta general.',
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
          'Google básicamente dice que no hay una disciplina nueva mágica: buen SEO es lo que te hace visible en su búsqueda con iA. Dicho eso, en Ai Visibility creemos que sí hay una capa adicional cuando hablas de ChatGPT o Perplexity, motores que no usan el índice de Google. Ahí el SEO clásico es necesario pero no suficiente.',
      },
      {
        tipo: 'cita',
        texto:
          'En el buscador de Google, GEO es básicamente SEO bien hecho. Fuera de Google, en ChatGPT o Perplexity, las reglas del juego cambian — y ahí es donde medir tu Share of Model deja de ser opcional.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Los 3 cambios concretos que puedes hacer hoy' },
      {
        tipo: 'lista',
        items: [
          'Revisa los fundamentos de SEO de tu sitio (indexación, velocidad, HTML semántico): es la base que Google sigue usando para citarte en su búsqueda con iA.',
          'Corre tus queries clave en ChatGPT y Perplexity, no solo en Google. Fuera del índice de Google las reglas cambian y necesitas saber si ahí te citan.',
          'Implementa JSON-LD de Organization para precisión de entidad, así la iA no te confunde con otra marca al sintetizar la respuesta.',
        ],
      },
    ],
    ctaTexto: 'Ver si la iA me cita →',
    ctaUrl: '/#planes',
    relacionados: ['guia-google-ia-acciones-marca-chilena', '5-hacks-geo-que-google-dice-no-sirven', 'chatgpt-busqueda-web-cambia-geo-2026'],
  },
  {
    slug: 'contenido-commodity-vs-experiencia-real-ia',
    titulo: 'Contenido "commodity" vs. experiencia real: qué premia la iA según Google',
    descripcion:
      'El corazón de la guía de Google es uno: la iA no necesita más contenido genérico, necesita perspectiva real. Qué es el contenido commodity, por qué la iA lo ignora, y cómo una pyme puede ganar con experiencia que los grandes no tienen.',
    fecha: '2026-05-24',
    categoria: 'GEO & AEO',
    tags: ['Google', 'Contenido', 'E-E-A-T', 'GEO'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Google premia contenido con perspectiva propia y experiencia real, no el genérico que ya existe mil veces. Para una pyme, esto es una ventaja: tu experiencia de nicho es lo que los grandes no pueden replicar.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Si hay una sola idea que rescatar de la guía de Google sobre búsqueda con iA, es esta: el contenido commodity ya no sirve. La iA tiene infinito acceso a información genérica. Lo que necesita —y premia— es perspectiva que no encuentre en otra parte.',
      },
      { tipo: 'h2', texto: 'Qué es contenido "commodity"' },
      {
        tipo: 'parrafo',
        texto:
          'Es el contenido que repite lo que cualquiera ya sabe: "5 tips para elegir zapatillas", "qué considerar al comprar un notebook". Información correcta, pero sin nada que la diferencie de las otras mil páginas iguales. Para la iA, ese contenido es intercambiable — y por eso prescindible.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Google contrapone el ejemplo: en vez de tips genéricos de compra, una reseña basada en uso real, con detalles que solo tiene quien probó el producto de verdad. Eso es lo que la iA cita.',
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
          'No vas a ganarle a un retailer gigante en cobertura. Pero sí puedes dominar la consulta específica donde tu experiencia real es insuperable. La iA busca exactamente eso.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Sobre usar iA para escribir tu contenido' },
      {
        tipo: 'parrafo',
        texto:
          'Google no prohíbe usar iA generativa para crear contenido, pero sí advierte: el valor lo aporta tu experiencia y criterio, no el texto autogenerado. Usa la iA como herramienta de redacción, no como reemplazo de tu conocimiento. Contenido autogenerado en masa, sin aporte real, cae justo en la categoría commodity que la iA ignora.',
      },
      { tipo: 'h2', texto: 'Los 3 cambios concretos que puedes hacer hoy' },
      {
        tipo: 'lista',
        items: [
          'Toma tu pieza más genérica ("5 tips de…") y reescríbela con un dato, caso o resultado real que solo tú puedes contar. Eso la saca de la categoría commodity.',
          'Agrega señales de experiencia visibles: autor con credenciales, fecha de actualización real y ejemplos propios. La iA premia E-E-A-T, no volumen.',
          'Audita si tienes landings autogeneradas en masa sin aporte real y decide reescribirlas o despublicarlas antes de que arrastren tu autoridad.',
        ],
      },
    ],
    ctaTexto: 'Auditar mi contenido →',
    ctaUrl: '/#planes',
    relacionados: ['guia-google-ia-acciones-marca-chilena', '5-hacks-geo-que-google-dice-no-sirven', 'google-seo-sigue-vivo-busqueda-ia'],
  },
  {
    slug: 'checklist-tecnico-google-busqueda-ia',
    titulo: 'Checklist técnico de Google para aparecer en la búsqueda con iA',
    descripcion:
      'La base técnica que Google exige para que tu sitio entre en sus respuestas con iA: rastreabilidad, HTML semántico, JavaScript, page experience y manejo de contenido duplicado. Checklist accionable para revisar hoy.',
    fecha: '2026-05-25',
    categoria: 'Tutoriales',
    tags: ['Google', 'SEO técnico', 'Crawlability', 'HTML semántico'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Antes de optimizar contenido, tu sitio debe ser técnicamente apto. Checklist de Google: rastreable, indexable, HTML semántico, JS bien manejado, rápido y sin duplicados.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Puedes tener el mejor contenido del mundo, pero si la iA de Google no puede rastrear ni entender tu sitio, no existes para ella. La guía oficial deja claro que la estructura técnica es el cimiento. Aquí está el checklist, traducido a acciones.',
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
          'Usa las etiquetas por lo que significan, no solo por cómo se ven. Un h1 para el título, h2/h3 para la jerarquía, listas reales para enumeraciones. La iA usa esa estructura para entender de qué trata cada sección.',
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
          'URLs duplicadas diluyen tu señal y confunden a la iA sobre cuál versión citar. Usa etiquetas canonical para indicar la versión principal y consolida las variantes.',
      },
      {
        tipo: 'nota',
        texto:
          'Este checklist es para el buscador de Google. Pero la buena noticia es que un sitio técnicamente sano también es más fácil de rastrear para los crawlers de OpenAI y Perplexity. La higiene técnica rinde en todos los motores.',
      },
    ],
    ctaTexto: 'Auditar mi visibilidad →',
    ctaUrl: '/#planes',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'jsonld-organization-chile', '5-hacks-geo-que-google-dice-no-sirven'],
  },
  {
    slug: 'comercio-conversacional-agentes-ucp',
    titulo: 'Comercio conversacional y agentes de compra: qué es UCP y por qué importa',
    descripcion:
      'Google adelanta el siguiente capítulo: agentes de iA que reservan, comparan y compran por el usuario, y protocolos como Universal Commerce Protocol (UCP). Qué significa para tu e-commerce y cómo prepararte sin volverte loco.',
    fecha: '2026-05-26',
    categoria: 'Noticias iA',
    tags: ['Agentes iA', 'UCP', 'E-commerce', 'Comercio conversacional'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Google describe agentes de iA que ejecutan tareas (reservar, comparar, comprar) y protocolos como UCP. Para el e-commerce, el nuevo cliente puede ser un agente, no una persona navegando.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'La parte más futurista de la guía de Google es también la más estratégica: las experiencias agénticas. No hablamos de un chatbot que responde, sino de agentes de iA que ejecutan tareas por el usuario — reservar una mesa, comparar productos, completar una compra.',
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
      { tipo: 'h2', texto: 'Los 4 cambios concretos para prepararte sin sobre-reaccionar' },
      {
        tipo: 'lista',
        items: [
          'Mantén tu Google Business Profile y feeds de Merchant Center actualizados y correctos.',
          'Asegura consistencia: el precio y stock que muestra tu web debe coincidir con lo que ven los agregadores.',
          'Declara con claridad despacho, garantías y condiciones — son los datos que un agente compara.',
          'Monitorea cómo te describe la iA hoy: si ya te malinterpreta como fuente de información, te malinterpretará como opción de compra.',
        ],
      },
    ],
    ctaTexto: 'Ver cómo me describe la iA →',
    ctaUrl: '/#planes',
    relacionados: ['guia-google-ia-acciones-marca-chilena', 'perplexity-vs-chatgpt-citas-2026', 'chatgpt-busqueda-web-cambia-geo-2026'],
  },
  {
    slug: 'guia-google-ia-acciones-marca-chilena',
    titulo: 'La guía de Google para búsqueda con iA, traducida a acciones para una marca chilena',
    descripcion:
      'Resumen completo y accionable de la guía oficial de Google sobre optimización para búsqueda con iA: qué priorizar, qué ignorar y qué vigilar. Todo aterrizado al contexto de una marca o pyme en Chile.',
    fecha: '2026-05-27',
    categoria: 'GEO & AEO',
    tags: ['Google', 'GEO', 'AEO', 'Guía', 'Chile'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'La guía de Google se resume en cuatro acciones: prioriza los fundamentos de SEO, crea contenido con experiencia real, ignora los hacks de GEO y vigila los agentes de iA. Aquí, aterrizada a una marca chilena.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Google publicó su guía oficial de optimización para búsqueda con iA y, en vez de revelar trucos nuevos, hace lo contrario: ordena el ruido. Este es el resumen completo, traducido a lo que realmente debe hacer una marca o pyme en Chile. Es el post pilar — al final tienes los enlaces a cada tema en profundidad.',
      },
      { tipo: 'h2', texto: '1. Prioriza los fundamentos de SEO' },
      {
        tipo: 'parrafo',
        texto:
          'La búsqueda con iA se apoya en los sistemas de ranking de siempre, vía RAG y sub-query generation. Si no estás indexado y no rankeas, la iA no tiene de dónde citarte. Lo técnico no es opcional: rastreabilidad, HTML semántico, velocidad y cero duplicados.',
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
          'La iA tiene infinito contenido genérico. Premia la perspectiva única, la autoría clara y la experiencia que no se puede copiar. Para una pyme chilena, tu conocimiento profundo de nicho es la ventaja que ningún retailer grande puede replicar a escala.',
      },
      { tipo: 'h2', texto: '3. Ignora los hacks de GEO' },
      {
        tipo: 'parrafo',
        texto:
          'Google descarta cinco tácticas populares: LLMS.txt, fragmentar contenido, reescribir para la iA, sembrar menciones artificiales y sobre-optimizar structured data. No gastes energía ahí. El structured data sigue siendo útil para precisión de entidad, pero no es una palanca de ranking.',
      },
      { tipo: 'h2', texto: '4. Vigila los agentes de iA' },
      {
        tipo: 'parrafo',
        texto:
          'Lo que viene: agentes que reservan, comparan y compran por el usuario, y protocolos como UCP. No necesitas implementarlos hoy, pero sí mantener tu información de negocio (precio, stock, despacho) precisa y consistente, porque será lo que un agente consulte para decidir.',
      },
      { tipo: 'h2', texto: 'El matiz que Google no resuelve por ti' },
      {
        tipo: 'parrafo',
        texto:
          'Toda esta guía es de Google sobre SU buscador con iA. Pero tus clientes también preguntan en ChatGPT, Perplexity y Gemini — motores que no usan el índice de Google y pesan distinto las señales. Seguir solo a Google te optimiza para una parte del mapa, no para todo.',
      },
      {
        tipo: 'cita',
        texto:
          'Los fundamentos de Google son la base. Pero tu Share of Model en ChatGPT y Perplexity es un dato aparte que Google no te va a dar — y que cada vez decide más compras.',
        fuente: 'Análisis Ai Visibility',
      },
      { tipo: 'h2', texto: 'Los 5 cambios concretos: tu plan en una semana' },
      {
        tipo: 'lista',
        items: [
          'Día 1: audita tu Share of Model en ChatGPT y Perplexity para tu categoría (gratis).',
          'Día 2: revisa el checklist técnico — indexación, velocidad, duplicados.',
          'Día 3-4: identifica una pieza de contenido commodity y reescríbela con experiencia real.',
          'Día 5: actualiza tu Google Business Profile y JSON-LD de Organization para precisión de entidad.',
          'Continuo: publica con regularidad y vuelve a medir cómo te cita la iA.',
        ],
      },
    ],
    ctaTexto: 'Auditar mi marca gratis →',
    ctaUrl: '/#planes',
    relacionados: ['5-hacks-geo-que-google-dice-no-sirven', 'contenido-commodity-vs-experiencia-real-ia', 'checklist-tecnico-google-busqueda-ia'],
  },
  {
    slug: 'chatgpt-busqueda-web-cambia-geo-2026',
    titulo: 'ChatGPT con búsqueda web por defecto: lo que cambia para tu marca en 2026',
    descripcion:
      'OpenAI activó búsqueda web nativa en todas las consultas de ChatGPT. Qué significa para el GEO de tu marca, qué señales pesan más ahora y cómo prepararte sin tocar tu presupuesto de SEO.',
    fecha: '2026-05-22',
    categoria: 'Noticias iA',
    tags: ['ChatGPT', 'GEO', 'Search', 'OpenAI'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
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
      { tipo: 'h2', texto: 'Los 4 cambios concretos que puedes hacer esta semana' },
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
    ctaUrl: '/#planes',
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
    tiempoLectura: '5 min',
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
      { tipo: 'h2', texto: 'Los 3 cambios concretos que puedes hacer hoy' },
      {
        tipo: 'lista',
        items: [
          'Corre las mismas 3 queries de tu categoría en Perplexity y en ChatGPT, y anota en cuál te citan y en cuál no. Ese gap te dice dónde priorizar.',
          'Para ganar en Perplexity: refuerza páginas citables (datos propios, comparativas, FAQ) y consigue menciones en fuentes que el motor indexa. Es recuperación en vivo, premia frescura y claridad.',
          'Para ganar en ChatGPT: trabaja consistencia de entidad (JSON-LD Organization con sameAs) y presencia en fuentes de autoridad de tu nicho. Pesa más el modelo que el link del momento.',
        ],
      },
    ],
    ctaTexto: 'Ver mi Share of Model →',
    ctaUrl: '/#planes',
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
          'sameAs: conecta tu entidad con perfiles externos. Sin esto, la iA no puede confirmar que tu marca es real.',
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
    ctaUrl: '/#planes',
    relacionados: ['chatgpt-busqueda-web-cambia-geo-2026'],
  },
  {
    slug: 'contenido-ia-google-que-permite-castiga-2026',
    titulo: 'Contenido generado con iA: qué permite Google, qué te marca como spam y la etiqueta TrainedAlgorithmicMedia que casi nadie usa',
    descripcion:
      'Google actualizó (marzo 2026) su guía oficial sobre usar IA generativa para crear contenido SEO. Permite, condiciona y castiga — y exige etiquetar las imágenes con metadata IPTC TrainedAlgorithmicMedia y los feeds de producto AI-generated. Te traducimos las reglas y mostramos cómo aplicarlas en una operación chilena de e-commerce o medios.',
    fecha: '2026-06-04',
    categoria: 'GEO & AEO',
    tags: ['Google', 'Contenido iA', 'Spam policy', 'IPTC', 'E-E-A-T', 'Merchant Center'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Google permite usar IA generativa para escalar contenido si agrega valor — y castiga como spam la generación masiva sin aporte. Exige metadata IPTC TrainedAlgorithmicMedia en imágenes con iA y etiquetar como AI-generated los atributos de producto en Merchant Center. Te mostramos qué cambia para equipos chilenos que ya usan ChatGPT o Gemini para escribir, generar imágenes y mantener feeds.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'El equipo de Google Search actualizó (marzo 2026) la guía oficial sobre cómo se debe usar contenido generado con IA dentro del SEO. El documento ya estaba — desde 2023 Google permitía la IA generativa siempre que "agregara valor" — pero la versión nueva agrega exigencias técnicas concretas que la mayoría de los equipos en Chile todavía no aplican.',
      },
      {
        tipo: 'parrafo',
        texto:
          'El doc se mueve en tres ejes: qué está permitido, qué cuenta como spam, y qué metadata tienes que adjuntar para no parecer que estás escondiendo el origen del contenido. Te traducimos las reglas y mostramos cómo se ven aplicadas en una operación chilena (un e-commerce con catálogo grande, una marca de medios que genera resúmenes, una clínica que mantiene FAQ).',
      },
      { tipo: 'h2', texto: 'Lo que Google permite: IA como "andamio", no como "pluma"' },
      {
        tipo: 'parrafo',
        texto:
          'La cita textual del doc actualizado:',
      },
      {
        tipo: 'cita',
        texto: '"La IA generativa puede ser particularmente útil cuando se investiga un tema y se agrega estructura al contenido original."',
        fuente: 'developers.google.com — Uso de contenido generado por IA (es-419)',
      },
      {
        tipo: 'parrafo',
        texto:
          'La frase es chica pero define la postura completa: Google permite usar iA para investigar (resumir fuentes, organizar bullets, validar fechas) y para estructurar (armar el outline, sugerir titulares, generar la tabla de contenidos). Lo que no quiere ver es contenido cuya razón de existir sea la iA — texto producido al por mayor solo porque la iA lo permite, sin que detrás haya investigación, experiencia o aporte real.',
      },
      {
        tipo: 'parrafo',
        texto:
          'En la práctica: un copywriter usando Claude para limpiar redacción es legítimo. Un equipo de SEO generando 500 landings de "mejor X en Y ciudad" con ChatGPT, no.',
      },
      { tipo: 'h2', texto: 'Lo que cuenta como spam' },
      {
        tipo: 'cita',
        texto: '"Usar herramientas de IA generativa […] con el objetivo de generar muchas páginas sin agregar valor para los usuarios puede incumplir la política de spam de Google."',
        fuente: 'developers.google.com — Uso de contenido generado por IA (es-419)',
      },
      {
        tipo: 'parrafo',
        texto:
          'Tres señales concretas que Google cruza para clasificar contenido iA como spam:',
      },
      {
        tipo: 'lista',
        items: [
          'Patrones de generación masiva: cientos o miles de URLs creadas en pocas semanas con la misma plantilla y diferencias mínimas (nombre de ciudad, marca, modelo). Cuando esa explosión coincide con un dropdown en el sitio "Selecciona tu comuna" y genera una landing por cada opción, la huella es obvia.',
          'Falta de información de origen: no hay autor verificable, no hay fecha de publicación coherente, no hay enlaces a fuentes primarias. La iA suele alucinar fuentes, así que Google revisa si esas citas existen.',
          'Métricas de calidad pobres: pogo-sticking (usuarios que entran y vuelven al SERP en menos de 5 segundos), tiempo en página casi cero, cero conversión orgánica. Google y los LLM cruzan esto con datos de Chrome y SERP behavior.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'Si tu sitio fue parte de una operación masiva con iA antes de 2025 y aún tienes esas páginas vivas, la limpieza es prioritaria. Google empezó a degradar dominios completos por contaminación con contenido iA mal hecho (incluso si parte del sitio es legítima).',
      },
      { tipo: 'h2', texto: 'La regla técnica que casi nadie aplica: TrainedAlgorithmicMedia' },
      {
        tipo: 'parrafo',
        texto:
          'Acá está el cambio menos comentado del doc actualizado. Google exige que las imágenes generadas con iA lleven metadata IPTC declarando que son sintéticas. La especificación es la del estándar IPTC Photo Metadata, campo DigitalSourceType con valor TrainedAlgorithmicMedia.',
      },
      {
        tipo: 'codigo',
        lenguaje: 'xml',
        codigo: `<!-- Metadata IPTC embebida en JPEG/PNG -->
<DigitalSourceType>
  http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia
</DigitalSourceType>`,
      },
      {
        tipo: 'parrafo',
        texto:
          'En Photoshop o Lightroom, la metadata IPTC se edita desde File Info. Con CLI, herramientas como exiftool permiten setearla en batch:',
      },
      {
        tipo: 'codigo',
        lenguaje: 'bash',
        codigo: `exiftool -DigitalSourceType="trainedAlgorithmicMedia" \\
  -overwrite_original *.jpg`,
      },
      {
        tipo: 'parrafo',
        texto:
          'Por qué importa: Google Images usa esta metadata para etiquetar visualmente los resultados ("Imagen generada con iA") y para el sistema de Synthetic Content Detection. Una imagen sin la metadata correcta corre el riesgo de quedar mal clasificada — y un sitio que genera imágenes con iA y omite el metadata sistemáticamente puede recibir señal negativa.',
      },
      { tipo: 'h2', texto: 'Feeds de producto: el otro requerimiento que se está pasando por alto' },
      {
        tipo: 'cita',
        texto: '"Los datos de productos generados por IA […] deben especificarse por separado y etiquetarse como generados por IA."',
        fuente: 'developers.google.com — Uso de contenido generado por IA (es-419)',
      },
      {
        tipo: 'parrafo',
        texto:
          'En Google Merchant Center, los atributos de producto generados con iA (descripción, especificaciones, materiales sugeridos) deben ir marcados como AI-generated en el campo correspondiente del feed. La estructura del XML/JSON tiene un atributo opcional que casi ninguna tienda chilena está poblando.',
      },
      {
        tipo: 'codigo',
        lenguaje: 'xml',
        codigo: `<!-- Ejemplo feed Merchant Center -->
<item>
  <g:id>SKU-12345</g:id>
  <title>Zapatilla running mujer talla 38</title>
  <description ai_generated="true">
    Diseño ergonómico con tecnología de amortiguación...
  </description>
  <g:product_detail>
    <g:attribute_name ai_generated="true">Material</g:attribute_name>
    <g:attribute_value>Malla técnica con refuerzo TPU</g:attribute_value>
  </g:product_detail>
</item>`,
      },
      {
        tipo: 'parrafo',
        texto:
          'En Chile, prácticamente todos los e-commerce grandes (Falabella, Paris, Ripley, Linio antes) usan IA generativa para completar descripciones de SKUs que llegan del proveedor sin texto. Pocos están etiquetando esa columna como AI-generated. Cuando Google active el matching cruzado de calidad iA por categoría, esa omisión va a importar.',
      },
      { tipo: 'h2', texto: 'Transparencia: declarar el origen, sin esconderse y sin presumir' },
      {
        tipo: 'parrafo',
        texto:
          'Google recomienda — no exige — que cuando el contenido es predominantemente iA o asistido por iA, se declare al lector. Sin escándalo y sin ocultarlo. Algunas formas que sí funcionan en sitios chilenos:',
      },
      {
        tipo: 'lista',
        items: [
          'Pie de artículo con la línea "Borrador inicial asistido por iA. Editado y verificado por [autor humano]". Le dice al lector que hubo iA y a Google que hubo revisión humana.',
          'En las FAQ que se generan automáticamente a partir del catálogo, agregar un disclaimer global ("Respuestas iniciales generadas automáticamente y validadas por nuestro equipo de soporte").',
          'En el byline del artículo, ambos nombres: el autor humano que firma y el modelo de iA usado como herramienta (no como autor).',
        ],
      },
      { tipo: 'h2', texto: 'Cómo se ve esto en una operación chilena típica' },
      {
        tipo: 'h3', texto: 'E-commerce con catálogo grande',
      },
      {
        tipo: 'lista',
        items: [
          'Descripciones de producto generadas por iA: legítimo, siempre que se etiqueten en el feed y que detrás haya revisión editorial mínima (un revisor humano que vea el 10% al azar).',
          'Imágenes "lifestyle" hechas con generadores de imagen: metadata IPTC TrainedAlgorithmicMedia obligatorio.',
          'Landing por categoría con texto SEO al pie generado con iA: legítimo si la categoría existe y vende. Spam si la categoría es inventada solo para capturar long-tail.',
        ],
      },
      { tipo: 'h3', texto: 'Marca de medios o blog corporativo' },
      {
        tipo: 'lista',
        items: [
          'Resúmenes diarios automáticos a partir de notas humanas: legítimo, con disclaimer.',
          'Artículos completos escritos por iA y publicados sin revisión: spam según la definición nueva.',
          'Outlines y estructuras armadas con Claude, escritura humana: el caso ideal según el doc de Google.',
        ],
      },
      { tipo: 'h3', texto: 'Clínica o servicio profesional' },
      {
        tipo: 'lista',
        items: [
          'FAQ generadas a partir de un input médico verificado: legítimo, con autor profesional firmando.',
          'Contenido YMYL (Your Money Your Life) escrito 100% con iA: alto riesgo de penalización. Aquí Google es especialmente estricto.',
          'Sugerencias automáticas de "qué especialista necesitas según tus síntomas": peligroso. Mejor herramienta de chat con disclaimer claro que no es diagnóstico.',
        ],
      },
      { tipo: 'h2', texto: 'Lo que esto implica para Ai Visibility y Share of Model' },
      {
        tipo: 'parrafo',
        texto:
          'Una marca que genera contenido con iA mal etiquetado tiene un problema doble: pierde ranking orgánico (penalización Google) y pierde citas en LLMs (los modelos cruzan la calidad técnica con la confianza del dominio). Mientras tanto, una marca que usa iA con disciplina — etiqueta imágenes, marca feeds, revisa contenido, declara el origen — gana en ambos frentes.',
      },
      {
        tipo: 'parrafo',
        texto:
          'En las auditorías Share of Model, cuando vemos un dominio con bajo score de visibilidad pero buena cobertura de keywords, una de las primeras hipótesis es que el contenido tiene huella iA mal manejada. Es una pregunta concreta que respondemos: ¿tu metadata IPTC está poblada? ¿tu feed Merchant Center etiqueta lo iA? ¿hay revisión humana visible?',
      },
      { tipo: 'h2', texto: 'Los 5 cambios concretos antes de seguir escalando con iA' },
      {
        tipo: 'lista',
        items: [
          'Imágenes generadas con iA: agregar IPTC TrainedAlgorithmicMedia en todas las que están vivas en el sitio. Audit en batch con exiftool.',
          'Feed Merchant Center: agregar atributo ai_generated="true" en descripciones y atributos creados con iA.',
          'Pie de artículo: incluir el patrón "Asistido por iA, revisado por [humano]" cuando aplique.',
          'Política de revisión humana: definir un % mínimo que se revisa antes de publicar, con un autor responsable visible.',
          'Auditoría de contenido legacy: identificar landings masivas generadas pre-2025 sin revisión y decidir si se mantienen, reescriben o despublican.',
        ],
      },
      {
        tipo: 'parrafo',
        texto:
          'Si recién estás partiendo el uso de iA en producción de contenido, hacer estas 5 cosas desde el día uno te ahorra el dolor de hacerlas cuando el sitio ya tiene 5.000 URLs contaminadas y un drop de tráfico que no sabes a qué atribuir.',
      },
      {
        tipo: 'referencias',
        items: [
          { label: 'Uso de contenido generado por IA — Google Search Central (es-419)', url: 'https://developers.google.com/search/docs/fundamentals/using-gen-ai-content?hl=es-419' },
          { label: 'Crear contenido útil — Google Search Central', url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=es-419' },
          { label: 'IPTC Photo Metadata Standard — DigitalSourceType', url: 'https://cv.iptc.org/newscodes/digitalsourcetype/' },
          { label: 'Políticas de contenido generado con IA — Merchant Center', url: 'https://support.google.com/merchants/answer/13046728?hl=es-419' },
          { label: 'exiftool — herramienta de metadata IPTC en batch', url: 'https://exiftool.org/' },
        ],
      },
    ],
    ctaTexto: 'Auditar mi contenido frente a la política de iA →',
    ctaUrl: '/#planes',
    relacionados: ['5-hacks-geo-que-google-dice-no-sirven', 'contenido-commodity-vs-experiencia-real-ia', 'guia-google-ia-acciones-marca-chilena', 'checklist-tecnico-google-busqueda-ia'],
    glosario: [
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'aeo', termino: 'AEO (Answer Engine Optimization)' },
    ],
  },
  {
    slug: 'escribir-para-ia-8-tecnicas-citacion-2026',
    titulo: 'Escribir para iA en 2026: 8 técnicas concretas para que ChatGPT, Perplexity y Gemini te citen (y no a tu competencia)',
    descripcion:
      'Los LLM eligen pocas fuentes para citar. Cuando ChatGPT, Perplexity o Gemini construyen una respuesta, suelen quedarse con 3-5 dominios — y tu marca compite por estar en ese set. Te entregamos 8 técnicas de escritura accionables (pirámide invertida, FAQ semánticas, listicles, E-E-A-T en cada pieza) traducidas para equipos chilenos.',
    fecha: '2026-06-04',
    categoria: 'Tutoriales',
    tags: ['Escritura iA', 'GEO', 'AEO', 'Content Strategy', 'FAQ', 'E-E-A-T'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'Un playbook práctico de 8 técnicas para que tus artículos sean citados por LLMs: pirámide invertida en cada pieza, respuesta directa antes del contexto, FAQ con preguntas semánticas reales, señales E-E-A-T visibles, autoridad temática site-wide, frescura continua, formato listicle/comparativa, URLs y estructura técnica. Cada técnica viene con un ejemplo aplicable a una marca chilena y una métrica para medir si está funcionando.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'La pregunta cambió. Antes era "¿cómo escribo para rankear en Google?". Ahora es "¿cómo escribo para que ChatGPT, Perplexity o Gemini me elijan como la fuente que citan cuando un cliente pregunta?". Es una diferencia chica en redacción pero enorme en mecánica.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Los LLM no muestran 10 resultados — citan 3 a 5. La distribución es brutalmente desigual: la fuente número 1 se lleva la mención completa, el resto aparece como nota al pie. Si tu marca no está en el top 5 de fuentes para una query relevante, prácticamente no existe en la conversación. Este post es el manual de campo para entrar a ese top 5.',
      },
      { tipo: 'h2', texto: 'Cómo decide un LLM a quién citar (resumen de 60 segundos)' },
      {
        tipo: 'parrafo',
        texto:
          'Los modelos modernos usan RAG (Retrieval-Augmented Generation): cuando reciben una pregunta, hacen una búsqueda interna a través de un índice (propio o vía conectores como Bing/Google), recuperan 10-30 documentos relevantes, y eligen los 3-5 que usarán para construir la respuesta. La elección se basa en 5 señales:',
      },
      {
        tipo: 'lista',
        items: [
          'Confianza del dominio (validación externa, citas recibidas, presencia en otros índices).',
          'Relevancia directa (qué tan rápido el documento responde literalmente la pregunta).',
          'Profundidad temática (¿el dominio cubre el tema en profundidad o es una pieza aislada?).',
          'Frescura y exactitud (fecha del contenido, datos verificables).',
          'Patrones de contenido (estructura coherente, tono autoritativo, presencia de citas).',
        ],
      },
      {
        tipo: 'parrafo',
        texto:
          'Las 8 técnicas que siguen impactan estas señales de forma directa. No son "trucos para SEO" — son cambios reales en cómo se redacta, estructura y publica.',
      },
      { tipo: 'h2', texto: '1. Pirámide invertida en cada pieza, sin excepción' },
      {
        tipo: 'parrafo',
        texto:
          'La regla periodística clásica vuelve con fuerza: lo más importante arriba, el detalle abajo. Los LLM leen los primeros párrafos primero y, cuando deciden a quién citar, pesan más lo que aparece en el lead.',
      },
      {
        tipo: 'parrafo',
        texto:
          'En la práctica: la primera oración o párrafo de un post sobre "mejor cuenta corriente PyME en Chile" debería responder literalmente esa pregunta. No "Las cuentas corrientes son fundamentales para una pyme…". Sí: "Las 3 cuentas corrientes PyME mejor evaluadas en Chile a 2026 son Banco de Chile EmpresaCheq, Santander Pyme y BancoEstado Microempresas. Te explicamos por qué."',
      },
      {
        tipo: 'cita',
        texto: '"La primera oración o párrafo te dice exactamente de qué se trata esta página y por qué importa."',
        fuente: 'Suso Digital — Writing for Robots',
      },
      {
        tipo: 'parrafo',
        texto:
          'Métrica para validar: pega tu primer párrafo en Perplexity y pregúntale "¿qué pregunta responde este texto?". Si Perplexity no puede sintetizar la pregunta en una línea, tu lead falla.',
      },
      { tipo: 'h2', texto: '2. Responder primero, contextualizar después' },
      {
        tipo: 'parrafo',
        texto:
          'Esto es una variante operativa de la pirámide invertida. Si la query es una pregunta directa ("¿cuánto cuesta arrendar un coworking en Las Condes?"), responder en el primer párrafo con el rango ($350.000-$650.000 CLP/mes) y después contar la metodología, las variables que mueven el precio y los 3 mejores espacios.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Los LLM citan a la fuente que les ahorra el trabajo de sintetizar. Si tu contenido obliga al modelo a leer 600 palabras para extraer un número, el modelo prefiere la fuente que da el número en línea 2.',
      },
      {
        tipo: 'nota',
        texto:
          'Trampa común: el SEO tradicional premiaba "atrapar" al usuario con contexto antes del dato. En GEO eso te castiga. El usuario no llega — el modelo decide. Optimiza para el modelo.',
      },
      { tipo: 'h2', texto: '3. FAQ con preguntas semánticas reales (no las que tú quieres)' },
      {
        tipo: 'parrafo',
        texto:
          'La sección FAQ al pie de cada post pasó de ser un nice-to-have de SEO a ser el bloque más citado por LLMs. Pero solo funciona si las preguntas son las que la gente realmente hace — no las que tu equipo cree que debería hacer.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Cómo obtener las preguntas reales: combinar Search Console (queries de tu sitio), AlsoAsked.com (sugerencias semánticas), Reddit y Quora (lenguaje natural de la audiencia), y consultar a ChatGPT o Gemini con "¿Qué preguntas comunes hace la gente sobre [tema]?" — los LLM revelan las queries que ya están viendo internamente.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Estructura técnica: cada FAQ marcada con JSON-LD FAQPage (Schema.org), con la pregunta como mainEntity y la respuesta concreta debajo. Mantener las respuestas debajo de 60 palabras — los LLM citan respuestas concisas con más probabilidad que párrafos largos.',
      },
      { tipo: 'h2', texto: '4. Señales E-E-A-T visibles en cada pieza (no solo en el About)' },
      {
        tipo: 'parrafo',
        texto:
          'Experiencia, Expertise, Authoritativeness, Trustworthiness. La regla nueva es que cada artículo lleva sus propias señales E-E-A-T, no solo el sitio en general. Concretamente:',
      },
      {
        tipo: 'lista',
        items: [
          'Byline con nombre y credencial (Director SEO, Médico cirujano, Abogado tributario, etc.) y link al perfil del autor en LinkedIn o Google Knowledge Panel.',
          'Sección "Sobre la fuente" al pie del post: 2 líneas sobre el experto, no sobre la empresa.',
          'Citas a fuentes primarias (papers, datos gubernamentales, declaraciones públicas) — minimo 3 por pieza, idealmente fuera del propio dominio.',
          'Fecha de publicación visible al lado del título y fecha de última actualización si cambió.',
          'Editorial trail: indicar quién editó si es distinto del autor (ej. "Editado por [equipo]").',
        ],
      },
      { tipo: 'h2', texto: '5. Autoridad temática site-wide, no por pieza' },
      {
        tipo: 'parrafo',
        texto:
          'Los LLM evalúan el dominio completo cuando deciden si una fuente es confiable en un tema. No basta con escribir un buen post — necesitas un cluster de piezas relacionadas que demuestren cobertura profunda. Una pyme escribiendo un artículo brillante sobre IFRS 16 sin ningún otro post sobre tributación o contabilidad va a perder citas contra una contadora chilena con 30 posts sobre temas relacionados, aunque cada pieza sea menos detallada.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Cómo operacionalizarlo: para cada tema central de tu negocio, definir 8-12 piezas que arman cluster. Una pillar page central + 5-7 posts satélite que se enlazan entre sí + 2-3 FAQ pages + 1-2 estudios de caso. Eso es lo que un LLM "ve" como autoridad temática.',
      },
      { tipo: 'h2', texto: '6. Frescura continua, no solo "última actualización: hoy"' },
      {
        tipo: 'parrafo',
        texto:
          'Frescura ≠ cambiar la fecha de actualización. Los LLM detectan revisiones reales versus updates cosméticos. Lo que funciona:',
      },
      {
        tipo: 'lista',
        items: [
          'Actualizar números, estadísticas y rangos de precio al menos cada 6 meses si son parte del contenido.',
          'Agregar bloques nuevos (no reescribir párrafos viejos) cuando aparece información nueva relevante.',
          'Versionado visible: mantener un changelog al pie ("Última revisión sustantiva: junio 2026 — agregamos sección sobre Gemini 2.5") en lugar de solo cambiar fechas.',
          'Eliminar contenido obsoleto en vez de dejarlo como decoración. Un post de 2022 sobre "el futuro de la búsqueda con iA" que sigue vivo daña tu autoridad.',
        ],
      },
      { tipo: 'h2', texto: '7. Formato listicle y comparativa siguen dominando' },
      {
        tipo: 'parrafo',
        texto:
          'Los LLM citan listicles y comparativas más que prosa narrativa. La razón es mecánica: el formato lista es fácil de fragmentar y re-citar en una respuesta sintetizada. Cuando un usuario pregunta "¿cuáles son los mejores CRM para pymes chilenas?", el modelo prefiere una fuente que ya tiene la lista hecha — no una que la sugiere en medio de un ensayo.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Formatos que ganan citas:',
      },
      {
        tipo: 'lista',
        items: [
          'Listas numeradas con criterio explícito ("Las 5 mejores X según [variable concreta]").',
          'Tablas comparativas con columnas claras (precio, característica clave, ideal para).',
          'How-to step-by-step con pasos enumerados.',
          'Pros y contras de una decisión.',
          'Definiciones tipo "X es Y. Funciona así: …" para temas técnicos.',
        ],
      },
      { tipo: 'h2', texto: '8. URLs semánticas + checklist técnico mínimo' },
      {
        tipo: 'parrafo',
        texto:
          'No es solo redacción. El packaging técnico de tu post pesa en la decisión del LLM:',
      },
      {
        tipo: 'lista',
        items: [
          'URL semántica que refleje la query real ("/mejor-cuenta-corriente-pyme-chile" en vez de "/post-12345").',
          'Title tag y H1 que coincidan literalmente con la pregunta que respondes.',
          'Meta description que sea un resumen útil — los LLM la usan como snippet candidato.',
          'Tiempo de carga LCP < 2,5 segundos (los LLM consultan vía bot, y los bots descartan páginas lentas).',
          'JSON-LD Article + FAQPage donde aplique.',
          'Estructura HTML semántica (article, h1-h3 jerárquicos, sin h2 huérfanos).',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'El checklist técnico no es opcional, pero tampoco te salva si el contenido es flojo. Es la cuarta parte del trabajo. Las 3 primeras (1-2-3) son las que más mueven la aguja.',
      },
      { tipo: 'h2', texto: 'Cómo se mide si tus piezas están funcionando' },
      {
        tipo: 'parrafo',
        texto:
          'Sin dashboard oficial de "citas en LLMs", estas son las 4 señales prácticas que sí puedes monitorear:',
      },
      {
        tipo: 'lista',
        items: [
          'Tráfico de referal desde chatgpt.com, perplexity.ai, gemini.google.com y copilot.microsoft.com en Google Analytics 4 — etiquétalos como canal "AI Search" para filtrarlos juntos.',
          'Picos de tráfico directo después de publicar piezas relevantes (los LLM citan pero muchos usuarios escriben la URL a mano después de ver la cita).',
          'Volumen de búsqueda brandeada en Search Console: si subes en citas LLM, tu marca empieza a buscarse más.',
          'Auditoría manual periódica: cada 2-4 semanas, hacer 10 queries relevantes a tu negocio en ChatGPT, Perplexity y Gemini, y registrar quién aparece. Esto es exactamente lo que hace una auditoría Share of Model.',
        ],
      },
      { tipo: 'h2', texto: 'El error más común que vemos en equipos chilenos' },
      {
        tipo: 'parrafo',
        texto:
          'Aplicar 1 o 2 técnicas de la lista y esperar resultados. Las 8 son un sistema: la frescura sin autoridad temática no sirve, la autoridad temática sin pirámide invertida tampoco, las FAQ sin E-E-A-T son ruido. Lo que funciona es elegir un cluster temático prioritario (no más de 2 al inicio) y aplicar las 8 técnicas en cada pieza nueva de ese cluster durante 3-4 meses.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Para un equipo chico (1-2 personas escribiendo), eso significa publicar menos pero mejor. Un post bien construido con las 8 técnicas en cluster temático bate a 10 posts genéricos en cualquier benchmark de citas LLM. La economía de visibilidad cambió.',
      },
      {
        tipo: 'referencias',
        items: [
          { label: 'Writing for Robots: Content Writing Best Practices for AI Visibility — Suso Digital', url: 'https://susodigital.com/thoughts/writing-for-robots-content-writing-best-practices-for-ai-visibility/' },
          { label: 'Guía de Google para optimización con IA (es-419)', url: 'https://developers.google.com/search/docs/fundamentals/ai-optimization-guide?hl=es-419' },
          { label: 'Search Quality Evaluator Guidelines (E-E-A-T) — Google', url: 'https://services.google.com/fh/files/misc/hsw-sqrg.pdf' },
          { label: 'Schema.org FAQPage', url: 'https://schema.org/FAQPage' },
        ],
      },
    ],
    ctaTexto: 'Auditar mis piezas frente al estándar LLM →',
    ctaUrl: '/#planes',
    relacionados: ['contenido-commodity-vs-experiencia-real-ia', 'visitante-de-ia-viene-a-comprar', 'que-es-rag-como-decide-citas-ia', 'jsonld-organization-chile'],
    glosario: [
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'aeo', termino: 'AEO (Answer Engine Optimization)' },
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
      { slug: 'share-of-model', termino: 'Share of Model' },
    ],
  },
  {
    slug: 'volvio-pr-digital-rag-cobertura-editorial',
    titulo: 'Volvió el PR digital: por qué RAG hace que la cobertura editorial valga más que el SEO técnico',
    descripcion:
      'Los LLM no muestran 10 resultados — citan 3 a 5 fuentes por respuesta. Y la primera señal que usan para decidir esas pocas fuentes es la validación externa: cobertura editorial, menciones en medios reconocidos, citas en wikis y comunidades. Esto convierte al PR de "nice-to-have" en infraestructura de visibilidad. Te contamos qué medios chilenos pesan, cómo se construye una estrategia de earned media para LLMs y qué métricas mirar.',
    fecha: '2026-06-04',
    categoria: 'GEO & AEO',
    tags: ['PR digital', 'Earned media', 'RAG', 'Medios chilenos', 'Estrategia'],
    autor: 'Ai Visibility',
    tiempoLectura: '5 min',
    resumen:
      'RAG concentra las citas LLM en 3-5 fuentes por respuesta. La validación externa (cobertura en medios, menciones en wikis, presencia en comunidades reconocidas) es la primera señal que los modelos usan para elegir esas pocas fuentes. Te entregamos un mapa de los medios chilenos que más pesan en LLMs, una estrategia de outreach para earned media GEO-friendly, y las métricas concretas para medir si tu PR está moviendo la aguja en ChatGPT, Perplexity y Gemini.',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Durante 15 años el PR digital fue secundario. Los equipos de marketing pusieron presupuesto en SEO, ads y contenido propio, y la cobertura editorial quedó como "lo que pasa cuando el CEO da una entrevista". Eso cambió rápido en los últimos 18 meses, y el cambio no es por una decisión humana — es por cómo funcionan los LLM.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Cuando ChatGPT, Perplexity o Gemini construyen una respuesta sobre tu industria, no muestran 10 resultados como hace Google. Citan entre 3 y 5 fuentes. La pregunta clave es: ¿cómo deciden esas pocas fuentes? Una respuesta corta y disruptiva: por validación externa antes que por contenido propio. Cobertura editorial, citas de terceros, presencia en wikis y comunidades. Es exactamente el dominio del PR.',
      },
      {
        tipo: 'cita',
        texto: '"La cobertura editorial de terceros es una de las señales más fuertes que un modelo de IA usa para decidir si una fuente vale la pena citar."',
        fuente: 'Suso Digital — Writing for Robots',
      },
      { tipo: 'h2', texto: 'Por qué RAG cambió la ecuación' },
      {
        tipo: 'parrafo',
        texto:
          'RAG (Retrieval-Augmented Generation) es la técnica que usan los LLM modernos para responder con datos actualizados. El modelo recibe la pregunta, hace una búsqueda interna sobre un índice de millones de documentos, recupera los más relevantes y los usa para construir la respuesta. La búsqueda interna usa muchas señales — pero la confianza del dominio pesa desproporcionadamente cuando hay que elegir 3-5 fuentes de 30.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Y la confianza del dominio se construye, en gran parte, por validación externa. Un dominio que aparece 50 veces citado en La Tercera, Diario Financiero, El Mercurio y Pulso tiene un perfil de confianza distinto a uno que tiene el mismo contenido pero solo se cita a sí mismo. El segundo puede tener mejor SEO técnico — y aún así pierde la cita LLM.',
      },
      { tipo: 'h2', texto: 'Lo que ya no funciona' },
      {
        tipo: 'lista',
        items: [
          'Comprar enlaces de baja calidad en directorios o sitios temáticos sin tráfico. Los LLM cruzan la calidad del dominio que enlaza — un backlink desde un sitio con 0 autoridad genera 0 valor.',
          'Generar menciones falsas vía bots o granjas de contenido. Los modelos detectan patrones de menciones inauthentic y los descartan.',
          'PR transaccional (sponsored content disfrazado de nota editorial). Los LLM distinguen el contenido sponsored — declarado o no — y lo pesan menos.',
          'Cobertura "todo terreno" sin estrategia temática. Aparecer en una nota de tecnología y otra de moda y otra de salud no construye autoridad en ninguna. La autoridad es temática.',
        ],
      },
      { tipo: 'h2', texto: 'Qué medios chilenos pesan en LLMs' },
      {
        tipo: 'parrafo',
        texto:
          'Los LLM no publican una lista oficial — pero hay patrones consistentes que se ven al hacer auditorías Share of Model. Por categoría:',
      },
      {
        tipo: 'h3', texto: 'Negocios y economía' },
      {
        tipo: 'lista',
        items: [
          'Diario Financiero — peso alto en queries sobre empresas, M&A, estrategia.',
          'Pulso (La Tercera) — peso alto en queries de mercados, inversiones, fintech.',
          'La Tercera Negocios — peso medio-alto en queries generales de negocio.',
          'El Mercurio Inversiones — peso alto en queries de inversión retail y mercados.',
          'Emol Economía — peso medio en queries generales.',
        ],
      },
      {
        tipo: 'h3', texto: 'Tecnología y startups' },
      {
        tipo: 'lista',
        items: [
          'Pisapapeles / Fayerwayer (anglo-chileno) — peso alto en gadgets y reviews.',
          'TrendTIC — peso medio-alto en queries B2B tech.',
          'BiobíoChile Tecnología — peso medio en queries generales.',
          'Diario Financiero Innovación — peso alto en queries de innovación corporativa.',
        ],
      },
      {
        tipo: 'h3', texto: 'Salud, derecho, ámbitos especializados' },
      {
        tipo: 'lista',
        items: [
          'Medwave (académico) — peso muy alto en queries médicas (revista indexada).',
          'Estado Diario — peso medio-alto en queries legales y regulatorias.',
          'Diario Constitucional — peso alto en queries constitucionales y derecho público.',
          'Revistas universitarias indexadas (Scielo) — peso alto en queries técnicos.',
        ],
      },
      {
        tipo: 'h3', texto: 'General y consumo' },
      {
        tipo: 'lista',
        items: [
          'La Tercera — peso alto transversal.',
          'El Mercurio — peso alto transversal.',
          'Cooperativa.cl — peso medio-alto en queries de actualidad.',
          'BiobíoChile — peso medio en queries regionales y de consumo masivo.',
        ],
      },
      {
        tipo: 'nota',
        texto:
          'Este ranking se mueve. La autoridad LLM no es estable — un medio que pesaba mucho hace 2 años puede haber bajado y al revés. Auditarlo cada 3-6 meses con queries reales de tu industria es la única forma de mantenerlo actualizado.',
      },
      { tipo: 'h2', texto: 'Los 4 cambios concretos para construir autoridad en LLMs (earned media)' },
      {
        tipo: 'parrafo',
        texto:
          'No es el PR tradicional. La estrategia que funciona para construir autoridad LLM tiene 4 pilares concretos:',
      },
      { tipo: 'h3', texto: '1. Data propietaria como ancla' },
      {
        tipo: 'parrafo',
        texto:
          'Los medios chilenos publican lo que les sirve a su audiencia, y lo que más les sirve son datos exclusivos. Hacer un estudio anual de tu industria (ej. "Estado del e-commerce chileno 2026", "Cómo invierten las pymes en marketing", "Tendencias de salud digital en LATAM") te genera 6-12 menciones por publicación durante 8-10 semanas. Es la unidad básica de cobertura LLM-friendly.',
      },
      { tipo: 'h3', texto: '2. Experto vocero con perfil indexable' },
      {
        tipo: 'parrafo',
        texto:
          'El medio chileno cita a personas con nombre, no a marcas anónimas. Necesitas 1-2 voceros con autoridad real en tu equipo (CEO o C-level de área) con perfil LinkedIn completo, Google Knowledge Panel armado (cuando aplique), y disponibilidad para entrevistas. Sin vocero, el medio cita a tu competidor que sí tiene uno.',
      },
      { tipo: 'h3', texto: '3. Ritmo predecible, no campañas aisladas' },
      {
        tipo: 'parrafo',
        texto:
          'La autoridad LLM se construye con repetición. Un equipo de PR que consigue 2 menciones al mes consistentemente durante 12 meses construye más autoridad que 30 menciones explosivas en un trimestre y silencio el resto del año. Los LLM dan más peso a fuentes que aparecen con regularidad en el medio.',
      },
      { tipo: 'h3', texto: '4. Wikipedia y comunidades especializadas' },
      {
        tipo: 'parrafo',
        texto:
          'ChatGPT cita mucho a Wikipedia. Perplexity cita mucho a Reddit y comunidades. Gemini cita mucho a sitios oficiales y .gob. Esto significa que la estrategia de "menciones" no es solo prensa — incluye:',
      },
      {
        tipo: 'lista',
        items: [
          'Crear o mejorar la página Wikipedia de tu marca/sector si calificas para los criterios de notabilidad (no fácil, pero alto valor cuando se logra).',
          'Participar de forma genuina en subreddits relevantes (r/chile, r/empresas, r/CL_chile, r/programacionchile, r/SaaSChile, etc.) sin spam y aportando valor.',
          'Responder en Quora preguntas relevantes a tu industria con tu nombre y credencial.',
          'Presencia en directorios oficiales y certificaciones del rubro (ej. ProChile, Cámara Comercio, asociaciones gremiales).',
          'Datos publicados en sitios .gob (INE, Banco Central, Estadísticas SII) cuando el contenido permite ser fuente.',
        ],
      },
      { tipo: 'h2', texto: 'Métricas concretas para medir si funciona' },
      {
        tipo: 'parrafo',
        texto:
          'El PR tradicional medía con métricas tipo "AVE" (Advertising Value Equivalent). Eso ya no sirve. Para PR LLM-friendly las métricas concretas son:',
      },
      {
        tipo: 'lista',
        items: [
          'Citas en LLMs: número de queries en ChatGPT/Perplexity/Gemini donde tu marca aparece como fuente citada. Auditoría manual periódica o herramienta como Share of Model.',
          'Posición de mención: cuando apareces citado, ¿eres la fuente principal o nota al pie? La fuente principal vale 4-5x más.',
          'Cobertura por medio TOP: número de menciones en los 10 medios chilenos que más pesan en LLMs para tu vertical, por trimestre.',
          'Diversidad de medios: ratio entre medios distintos y total de menciones — alto = autoridad distribuida = mejor para LLMs.',
          'Tráfico orgánico de marca: búsquedas brand-name en Search Console — sube cuando tu marca empieza a ser citada por LLMs (los usuarios buscan el nombre después de verlo).',
        ],
      },
      { tipo: 'h2', texto: 'El presupuesto se reparte distinto' },
      {
        tipo: 'parrafo',
        texto:
          'Si en 2020 una distribución típica era 50% performance, 30% SEO/contenido, 20% PR, el patrón que vemos en marcas chilenas que ganan citas LLM en 2026 es más cercano a 35% performance, 25% SEO/contenido propio, 25% PR/earned media, 15% data/estudios propios. No porque PR sea más barato — es porque la unidad de visibilidad en el ecosistema LLM responde más al earned media que al owned content.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Esto no significa abandonar el SEO. Significa reconocer que el SEO técnico solo, sin validación externa, ya no es suficiente para entrar al top 5 de fuentes citadas. Y que la inversión que mueve la aguja en 2026 es la combinación: contenido propio impecable + cobertura editorial constante + data propietaria publicable.',
      },
      { tipo: 'h2', texto: 'Cómo se ve esto en una operación chilena' },
      {
        tipo: 'h3', texto: 'PyME (1-50 empleados)' },
      {
        tipo: 'lista',
        items: [
          'Vocero único (fundador) con LinkedIn fuerte.',
          '1 estudio anual de tu industria publicado bajo tu marca.',
          'Outreach activo a 3-5 medios verticales del rubro (no a todos).',
          'Presencia activa en 1-2 comunidades online relevantes.',
          'Meta realista: 8-12 menciones reales al año en medios que pesan en tu vertical.',
        ],
      },
      { tipo: 'h3', texto: 'Empresa mediana (50-300 empleados)' },
      {
        tipo: 'lista',
        items: [
          '2 voceros (C-level + experto técnico).',
          '2 estudios anuales + reportes mensuales con data agregada.',
          'Agencia PR boutique con foco vertical (no de todo).',
          'Programa de speakers en conferencias del sector.',
          'Meta realista: 30-50 menciones al año, presencia en 3-4 wikis/directorios especializados.',
        ],
      },
      { tipo: 'h3', texto: 'Corporación (300+ empleados)' },
      {
        tipo: 'lista',
        items: [
          'Equipo PR in-house + agencia.',
          'Calendario editorial trimestral con anclas de data propietaria.',
          'Programa de Op-Eds con voceros C-level firmando en medios TOP.',
          'Página Wikipedia activa y mantenida.',
          'Meta realista: 100+ menciones anuales y aparición regular en top 5 de citas LLM en queries de la industria.',
        ],
      },
      { tipo: 'h2', texto: 'El cambio mental que falta' },
      {
        tipo: 'parrafo',
        texto:
          'El SEO se medía contra tu sitio: trafico orgánico, ranking de keywords, conversiones desde búsqueda. El GEO se mide contra la conversación: ¿apareces cuando se habla de tu categoría? ¿eres la primera fuente o la séptima? ¿la respuesta del modelo te incluye o te ignora?',
      },
      {
        tipo: 'parrafo',
        texto:
          'Esa diferencia hace que el PR — que durante años fue criticado por ser "difícil de medir" — vuelva a ser estratégico. Hoy es perfectamente medible: la métrica es tu Share of Model en queries relevantes. Y la forma de moverla no es publicar más en tu blog. Es lograr que terceros relevantes hablen de ti con la frecuencia y profundidad suficientes para que los modelos de iA te elijan como fuente confiable.',
      },
      {
        tipo: 'referencias',
        items: [
          { label: 'Writing for Robots: Content Writing Best Practices for AI Visibility — Suso Digital', url: 'https://susodigital.com/thoughts/writing-for-robots-content-writing-best-practices-for-ai-visibility/' },
          { label: 'Guía de Google para optimización con IA (es-419)', url: 'https://developers.google.com/search/docs/fundamentals/ai-optimization-guide?hl=es-419' },
          { label: 'Wikipedia: Notabilidad de empresas (es)', url: 'https://es.wikipedia.org/wiki/Wikipedia:Notabilidad/Empresas' },
          { label: 'Search Console: medir búsquedas brandeadas', url: 'https://support.google.com/webmasters/answer/9128668?hl=es-419' },
        ],
      },
    ],
    ctaTexto: 'Medir mi Share of Model y autoridad LLM →',
    ctaUrl: '/#planes',
    relacionados: ['que-es-rag-como-decide-citas-ia', 'guia-google-ia-acciones-marca-chilena', 'ecommerce-chileno-busqueda-ia-cyberday-2026', 'jsonld-organization-chile'],
    glosario: [
      { slug: 'geo', termino: 'Generative Engine Optimization (GEO)' },
      { slug: 'share-of-model', termino: 'Share of Model' },
      { slug: 'rag', termino: 'RAG (Retrieval-Augmented Generation)' },
      { slug: 'aeo', termino: 'AEO (Answer Engine Optimization)' },
    ],
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
