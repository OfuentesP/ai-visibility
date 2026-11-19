import { defineConfig, type TinaField } from 'tinacms'

// Panel de edición: https://ai-visibility.cl/admin/
// Cada "Guardar" hace un commit en GitHub (rama main) y DigitalOcean republica el sitio solo (~3–5 min).

const branch =
  process.env.TINA_BRANCH || process.env.GITHUB_BRANCH || process.env.HEAD || 'main'

const NEGRITA = 'Para poner algo en negrita, enciérralo entre dos asteriscos: **así**.'
const MOVIL = 'Versión corta que se muestra en celulares.'
const ANTETITULO = 'Texto pequeño en mayúsculas que va sobre el título.'

const text = (name: string, label: string, description?: string): TinaField => ({
  type: 'string', name, label, description, required: true,
})
const textarea = (name: string, label: string, description?: string): TinaField => ({
  type: 'string', name, label, description, required: true, ui: { component: 'textarea' },
})
const list = (name: string, label: string, description?: string): TinaField => ({
  type: 'string', name, label, description, list: true,
})
const group = (name: string, label: string, fields: TinaField[]): TinaField => ({
  type: 'object', name, label, fields,
})
const itemList = (
  name: string, label: string, fields: TinaField[], labelField: string, description?: string,
): TinaField => ({
  type: 'object', name, label, description, list: true, fields,
  ui: { itemProps: (item: Record<string, string>) => ({ label: item?.[labelField] || 'Nuevo' }) },
})

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: { mediaRoot: 'uploads', publicFolder: 'public' },
  },

  schema: {
    collections: [
      {
        name: 'sitio',
        label: 'Datos generales del sitio',
        path: 'content',
        format: 'json',
        match: { include: 'sitio' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          text('whatsapp', 'Número de WhatsApp', 'Con código de país, sin "+" ni espacios. Ej: 56912345678. Se usa en TODO el sitio: botón verde flotante, footer y botones de los planes.'),
          textarea('whatsappMensaje', 'Mensaje precargado de WhatsApp', 'Lo que aparece escrito al tocar el botón verde flotante o el ícono del footer. (Los planes tienen su propio mensaje.)'),
          text('whatsappBotonTexto', 'Texto del botón verde flotante', 'Aparece al pasar el mouse sobre el botón. Ej: ¿Hablamos?'),
          textarea('footerDescripcion', 'Descripción de la empresa (footer)'),
          group('direccion', 'Dirección (footer y Google)', [
            text('calle', 'Calle y número'),
            { type: 'string', name: 'edificio', label: 'Edificio / oficina (opcional)' },
            text('comuna', 'Comuna'),
            text('ciudad', 'Ciudad'),
            text('region', 'Región'),
          ]),
          { type: 'string', name: 'footerNota', label: 'Nota al pie (opcional)', description: 'Va después de "© 2026 Ai Visibility ·" al final de cada página.' },
          text('instagram', 'Link de Instagram', 'Dirección completa, empezando con https://'),
          text('linkedin', 'Link de LinkedIn', 'Dirección completa, empezando con https://'),
        ],
      },
      {
        name: 'home',
        label: 'Página de inicio',
        path: 'content',
        format: 'json',
        match: { include: 'home' },
        ui: {
          // Es una sola página: no se puede crear ni borrar, solo editar.
          allowedActions: { create: false, delete: false },
        },
        fields: [
          group('hero', '1 · Portada (lo primero que se ve)', [
            text('antetitulo', 'Antetítulo', ANTETITULO),
            text('tituloLinea1', 'Título — primera línea'),
            text('tituloLinea2', 'Título — segunda línea'),
            text('tituloDestacado', 'Título — parte en color', 'Se muestra con degradado morado al final del título.'),
            textarea('descripcion', 'Descripción', NEGRITA),
            textarea('descripcionMovil', 'Descripción (celular)', `${MOVIL} ${NEGRITA}`),
            text('botonTexto', 'Texto del botón'),
            list('motores', 'Motores (franja inferior)', 'Nombres separados por puntos en la franja bajo el botón.'),
          ]),

          group('puntoCiego', '2 · El punto ciego', [
            text('antetitulo', 'Antetítulo', ANTETITULO),
            text('tituloIntro', 'Inicio del título (solo computador)', 'Va en negrita antes del título.'),
            text('titulo', 'Título'),
            textarea('texto', 'Texto', NEGRITA),
            text('botonTexto', 'Texto del botón'),
            textarea('ejemploPregunta', 'Ejemplo de chat — pregunta del usuario'),
            textarea('ejemploIntro', 'Ejemplo de chat — inicio de la respuesta'),
            text('ejemploRecomendado', 'Ejemplo de chat — marca recomendada (verde)'),
            text('ejemploOtro', 'Ejemplo de chat — segunda marca'),
            textarea('ejemploAlerta', 'Ejemplo de chat — alerta en rojo', NEGRITA),
          ]),

          group('metodologia', '3 · Cómo trabajamos', [
            text('antetitulo', 'Antetítulo', ANTETITULO),
            text('titulo', 'Título'),
            text('subtitulo', 'Subtítulo'),
            text('subtituloMovil', 'Subtítulo (celular)', MOVIL),
            text('etiquetaDestacado', 'Etiqueta del paso destacado'),
            itemList('pasos', 'Pasos', [
              text('titulo', 'Título'),
              textarea('descripcion', 'Descripción'),
              { type: 'boolean', name: 'destacado', label: 'Destacar este paso (fondo morado + etiqueta)' },
            ], 'titulo', 'Los íconos se asignan solos según el orden (lupa, personas, gráfico, terminal).'),
          ]),

          group('entregables', '4 · Qué te llevas', [
            text('antetitulo', 'Antetítulo', ANTETITULO),
            text('titulo', 'Título'),
            text('tituloMovil', 'Título (celular)', MOVIL),
            itemList('items', 'Tarjetas', [
              text('icono', 'Símbolo', 'Un carácter, por ejemplo ◉ ◈ △ ▶'),
              text('titulo', 'Título'),
              textarea('descripcion', 'Descripción'),
            ], 'titulo'),
            text('botonTexto', 'Texto del botón'),
          ]),

          group('diagnostico', '5 · Ejemplo de diagnóstico', [
            text('antetitulo', 'Antetítulo', ANTETITULO),
            text('titulo', 'Título'),
            textarea('texto', 'Texto'),
            itemList('tarjetas', 'Tarjetas', [
              text('etiqueta', 'Etiqueta (arriba, en rojo)'),
              text('icono', 'Símbolo', 'Por ejemplo ⚠ o ✗'),
              text('titulo', 'Título'),
              textarea('descripcion', 'Descripción'),
            ], 'titulo'),
            list('datos', 'Datos de la barra inferior'),
          ]),

          group('comparativa', '6 · GEO vs SEO (tabla)', [
            text('antetitulo', 'Antetítulo', ANTETITULO),
            text('titulo', 'Título'),
            textarea('texto', 'Texto', NEGRITA),
            text('nosotrosEtiqueta', 'Columna Ai Visibility — etiqueta'),
            text('nosotrosNombre', 'Columna Ai Visibility — nombre'),
            text('otrosEtiqueta', 'Columna competencia — etiqueta'),
            text('otrosNombre', 'Columna competencia — nombre'),
            itemList('filas', 'Filas de la tabla', [
              text('nombre', 'Concepto (columna izquierda)'),
              text('nosotros', 'Ai Visibility'),
              text('otros', 'Agencia SEO'),
              {
                type: 'string', name: 'iconoOtros', label: 'Ícono para la agencia SEO',
                options: [{ value: 'minus', label: '— (parcial)' }, { value: 'x', label: '✗ (no tiene)' }],
              },
            ], 'nombre'),
            text('pieTexto', 'Texto bajo la tabla'),
            text('pieBoton', 'Enlace bajo la tabla'),
          ]),

          group('planes', '7 · Planes y precios', [
            text('antetitulo', 'Antetítulo', ANTETITULO),
            text('titulo', 'Título'),
            textarea('texto', 'Texto'),
            itemList('items', 'Planes', [
              text('nombre', 'Nombre del plan'),
              { type: 'string', name: 'sello', label: 'Sello superior (opcional)', description: 'Ej: "Disponible ahora". Déjalo vacío para no mostrar sello.' },
              {
                type: 'string', name: 'estilo', label: 'Color de la tarjeta', required: true,
                options: [
                  { value: 'principal', label: 'Morado azulado (destacado)' },
                  { value: 'normal', label: 'Normal (gris)' },
                  { value: 'premium', label: 'Violeta (premium)' },
                ],
              },
              text('precio', 'Precio', 'Ej: $190.000'),
              text('unidad', 'Bajo el precio', 'Ej: CLP · pago único'),
              textarea('descripcion', 'Descripción'),
              list('incluye', 'Qué incluye'),
              text('botonTexto', 'Texto del botón'),
              textarea('mensajeWhatsapp', 'Mensaje de WhatsApp', 'Lo que aparece escrito cuando la persona aprieta el botón.'),
            ], 'nombre'),
            text('nota', 'Nota bajo los planes'),
          ]),

          group('faq', '8 · Preguntas frecuentes', [
            text('antetitulo', 'Antetítulo', ANTETITULO),
            text('titulo', 'Título'),
            itemList('grupos', 'Columnas de preguntas', [
              text('titulo', 'Título de la columna'),
              itemList('preguntas', 'Preguntas', [
                text('pregunta', 'Pregunta'),
                textarea('respuesta', 'Respuesta'),
              ], 'pregunta'),
            ], 'titulo', 'Estas preguntas también se publican para Google y las IAs (datos estructurados).'),
          ]),

          group('cierre', '9 · Llamado final', [
            text('antetitulo', 'Antetítulo', ANTETITULO),
            text('titulo', 'Título'),
            textarea('texto', 'Texto'),
            textarea('textoMovil', 'Texto (celular)', MOVIL),
            text('botonTexto', 'Texto del botón'),
            text('nota', 'Nota bajo el botón'),
          ]),
        ],
      },
    ],
  },
})
