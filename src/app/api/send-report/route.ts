import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email, nombre, marca, query, score, shareUrl, modo } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const asunto = modo === 'url'
    ? `Tu auditoría de visibilidad IA: ${marca}`
    : `Tu auditoría de visibilidad IA: ${marca} — "${query}"`

  const { error } = await resend.emails.send({
    from: 'Ai Visibility <production@ai-visibility.cl>',
    to: email,
    replyTo: 'contacto@ai-visibility.cl',
    subject: asunto,
    html: buildEmailHtml({ nombre, marca, query, score, shareUrl, modo }),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

function buildEmailHtml({ nombre, marca, query, score, shareUrl, modo }: {
  nombre: string
  marca: string
  query?: string
  score: number
  shareUrl: string
  modo: 'brand' | 'url'
}) {
  const scoreColor = score >= 60 ? '#10b981' : score >= 30 ? '#f97316' : '#f43f5e'
  const scoreLabel = score >= 60 ? 'Visible' : score >= 30 ? 'En Riesgo' : 'Invisible'
  const saludo = nombre ? `Hola ${nombre.split(' ')[0]},` : 'Hola,'
  const contexto = modo === 'url'
    ? `Analizamos la URL <strong>${marca}</strong> frente a los principales motores de IA.`
    : `Analizamos cómo posiciona la IA a <strong>${marca}</strong> para la búsqueda <em>"${query}"</em>.`

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${nombre ? `Informe de ${marca}` : 'Tu informe Ai Visibility'}</title>
</head>
<body style="margin:0;padding:0;background:#020617;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#020617;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 28px 0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:28px;height:28px;background:linear-gradient(135deg,#38bdf8,#818cf8);border-radius:6px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:11px;font-weight:700;">AI</span>
                  </td>
                  <td style="padding-left:10px;color:#e2e8f0;font-size:15px;font-weight:600;letter-spacing:-0.3px;">
                    Ai Visibility
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#0f172a;border:1px solid #1e293b;border-radius:4px;overflow:hidden;">

              <!-- Score bar -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="height:4px;background:${scoreColor};"></td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 32px 0 32px;">
                <tr>
                  <td>
                    <p style="margin:0 0 20px 0;color:#94a3b8;font-size:13px;">${saludo}</p>
                    <p style="margin:0 0 20px 0;color:#cbd5e1;font-size:15px;line-height:1.6;">
                      ${contexto}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Score pill -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 28px 32px;">
                <tr>
                  <td style="background:#020617;border:1px solid #1e293b;border-radius:4px;padding:20px 24px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:20px;border-right:1px solid #1e293b;">
                          <p style="margin:0;color:#475569;font-size:10px;font-family:monospace;text-transform:uppercase;letter-spacing:1px;">AI Readiness Score</p>
                          <p style="margin:4px 0 0 0;font-size:36px;font-weight:300;color:${scoreColor};font-family:monospace;">${score}</p>
                          <p style="margin:2px 0 0 0;color:#475569;font-size:11px;font-family:monospace;">/100 · ${scoreLabel}</p>
                        </td>
                        <td style="padding-left:20px;">
                          <p style="margin:0;color:#64748b;font-size:12px;line-height:1.5;">
                            ${score < 30
                              ? 'Tu marca está prácticamente invisible para los motores de IA. Tus clientes potenciales están siendo derivados a la competencia.'
                              : score < 60
                              ? 'Tu marca aparece en algunas búsquedas pero la competencia captura la mayoría de la intención de compra.'
                              : 'Tu marca lidera la visibilidad en IA. Mantén la ventaja con contenido de autoridad constante.'}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:0 32px 32px 32px;">
                <tr>
                  <td align="center" style="background:#1e293b;border-radius:4px;padding:20px;">
                    <p style="margin:0 0 16px 0;color:#94a3b8;font-size:13px;">Ver el informe completo con diagnóstico competitivo y plan de acción</p>
                    <a href="${shareUrl}" style="display:inline-block;background:#4f46e5;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:4px;">
                      Ver mi informe completo →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0 0;">
              <p style="margin:0;color:#334155;font-size:11px;font-family:monospace;line-height:1.7;">
                Ai Visibility · Av. Apoquindo 4501, Of. 12, Las Condes, Santiago<br/>
                Este correo fue solicitado desde la plataforma. Si no lo pediste, ignóralo.<br/>
                <a href="mailto:contacto@ai-visibility.cl" style="color:#475569;text-decoration:none;">contacto@ai-visibility.cl</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
