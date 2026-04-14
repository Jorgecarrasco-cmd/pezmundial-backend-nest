import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) { }

  async sendWelcomeEmail(to: string, name: string, link: string) {
    const html = `
    
    <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table width="600" cellpadding="20" cellspacing="0" style="background:#ffffff;">
                
                <tr>
                  <td align="center" style="background:#111;color:white;">
                    <h1>Mi Plataforma</h1>
                  </td>
                </tr>

                <tr>
                  <td>
                    <h2>Hola ${name} 👋</h2>
                    <p>Bienvenido a nuestra plataforma.</p>
                    <p>Haz clic en el botón para activar tu cuenta:</p>

                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#2563eb" style="padding:12px 24px;border-radius:6px;">
                          <a href="${link}" style="color:white;text-decoration:none;font-weight:bold;">
                            Activar cuenta
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <tr>
                  <td align="center" style="font-size:12px;color:#999;">
                    © 2026 Mi Empresa
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }
}
