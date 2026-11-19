// Datos generales del sitio, editables desde /admin (TinaCMS) → content/sitio.json.
import sitio from '../../content/sitio.json'

export { sitio }

/** Link de WhatsApp con el número del sitio y un mensaje precargado. */
export const whatsappUrl = (mensaje: string = sitio.whatsappMensaje) =>
  `https://wa.me/${sitio.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`
