import { injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';

@injectable()
export class EmailConfig {
  createTransporter(): Transporter {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password',
      },
    });
  }
}