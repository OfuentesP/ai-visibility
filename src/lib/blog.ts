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
    slug: 'ecommerce-latam-cambio-modelo-busqueda-2026',
    titulo: 'El e-commerce LATAM frente al cambio del modelo de búsqueda: cómo se mueve cada país',
    descripcion:
      'Brasil, México, Colombia, Chile y Perú no están entrando a la era de la búsqueda con iA al mismo ritmo. Mapa comparativo 2026 con tamaños de mercado, velocidad de adopción y dónde priorizar el esfuerzo GEO si operas en varios países de la región.',
    fecha: '2026-05-29',
    categoria: 'Casos & Datos',
    tags: ['LATAM', 'E-commerce', 'GEO', 'Brasil', 'México', 'Colombia', 'Perú', 'Chile'],
    autor: 'Ai Visibility',
    tiempoLectura: '10 min',
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
      { tipo: 'h2', texto: 'Cómo estructurar una estrategia GEO multi-país en LATAM' },
      {
        tipo: 'parrafo',
        texto:
          'Si operas en varios mercados, intentar lanzar GEO simultáneo en todos es la receta para no mover la aguja en ninguno. Recomendación práctica para marketers regionales:',
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
    tiempoLectura: '9 min',
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
      { tipo: 'h2', texto: 'Checklist para llegar al CyberDay con tu marca visible' },
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
    tiempoLectura: '7 min',
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
      { tipo: 'h2', texto: 'Checklist GEO para un SaaS chileno' },
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
    tiempoLectura: '6 min',
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
      { tipo: 'h2', texto: 'Checklist GEO para retail físico chileno' },
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
    tiempoLectura: '7 min',
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
      { tipo: 'h2', texto: 'Checklist GEO para una clínica o centro médico chileno' },
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
    tiempoLectura: '7 min',
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
      { tipo: 'h2', texto: 'Checklist GEO para banca y fintech chilena' },
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
    tiempoLectura: '6 min',
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
      { tipo: 'h2', texto: 'El plan de 14 días para una pyme' },
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
    tiempoLectura: '7 min',
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
      { tipo: 'h2', texto: 'Checklist GEO para una inmobiliaria o corredor chileno' },
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
    tiempoLectura: '6 min',
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
      { tipo: 'h2', texto: 'Qué hacer para que RAG te recupere' },
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
    tiempoLectura: '7 min',
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
      { tipo: 'h2', texto: 'Qué hacer en su lugar' },
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
    tiempoLectura: '6 min',
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
    tiempoLectura: '6 min',
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
    tiempoLectura: '7 min',
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
    tiempoLectura: '6 min',
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
      { tipo: 'h2', texto: 'Cómo prepararte sin sobre-reaccionar' },
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
    tiempoLectura: '9 min',
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
      { tipo: 'h2', texto: 'Tu plan en una semana' },
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
