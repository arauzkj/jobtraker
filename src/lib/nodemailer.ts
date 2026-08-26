import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendPasswordResetEmailParams {
  to: string;
  userName?: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  to,
  userName,
  resetUrl,
}: SendPasswordResetEmailParams) {
  const from = process.env.EMAIL_FROM || '"Trayecto" <no-reply@trayecto.app>';
  const recipientName = userName ? userName : "estimado(a) usuario(a)";

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer contraseña - Trayecto</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #09090b; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #18181b; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; padding: 32px 28px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);">
          <!-- Header / Logo -->
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #27272a;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #fafafa; color: #09090b; font-weight: bold; border-radius: 8px; width: 36px; height: 36px; text-align: center; vertical-align: middle; font-size: 18px;">
                    💼
                  </td>
                  <td style="padding-left: 12px; font-size: 16px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #fafafa;">
                    Trayecto
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding-top: 28px; padding-bottom: 20px;">
              <h1 style="margin: 0 0 12px; font-size: 22px; font-weight: 600; color: #fafafa; letter-spacing: -0.02em;">
                Restablece tu contraseña
              </h1>
              <p style="margin: 0 0 18px; font-size: 14px; line-height: 1.6; color: #a1a1aa;">
                Hola <strong style="color: #f4f4f5;">${recipientName}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #a1a1aa;">
                Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Trayecto</strong>. Para configurar una nueva contraseña, haz clic en el siguiente botón:
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding-bottom: 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #fafafa;">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 600; color: #09090b; text-decoration: none; border-radius: 8px; letter-spacing: 0.5px; text-transform: uppercase;">
                      Restablecer Contraseña
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Link fallback -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0 0 8px; font-size: 12px; line-height: 1.5; color: #71717a;">
                Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; word-break: break-all;">
                <a href="${resetUrl}" style="color: #38bdf8; text-decoration: underline;">
                  ${resetUrl}
                </a>
              </p>
            </td>
          </tr>

          <!-- Security note & expiration -->
          <tr>
            <td style="border-top: 1px solid #27272a; padding-top: 20px;">
              <p style="margin: 0 0 8px; font-size: 12px; line-height: 1.5; color: #71717a;">
                ⏳ Este enlace tiene una validez de <strong>1 hora</strong>.
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #71717a;">
                Si tú no solicitaste este cambio, puedes ignorar este correo con total tranquilidad. Tu contraseña actual no se modificará.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const textContent = `Hola ${recipientName},

Recibimos una solicitud para restablecer tu contraseña en Trayecto.

Para cambiar tu contraseña, ingresa al siguiente enlace:
${resetUrl}

Este enlace expirará en 1 hora.

Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.`;

  return await transporter.sendMail({
    from,
    to,
    subject: "Restablece tu contraseña - Trayecto",
    text: textContent,
    html: htmlContent,
  });
}
