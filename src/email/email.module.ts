import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer'
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';



@Module({
  providers: [EmailService],
  imports: [MailerModule.forRoot({
    transport: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    },
    defaults: {
      from: '"Mi app" <no-reply@miapp.com>'
    },
  },
  )],
  exports : [EmailService]
})
export class EmailModule { }
