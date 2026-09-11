import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<string>('MAIL_PORT')),
      secure: Number(this.configService.get<string>('MAIL_PORT')) === 465,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    } as nodemailer.TransportOptions);
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to,
        subject,
        html,
      });

      this.logger.log({ event: 'email_sent' });
      return info;
    } catch (err) {
      this.logger.error({ event: 'email_send_failed' });
      throw err;
    }
  }

  async sendEmailChangeVerification(toEmail: string, rawToken: string) {
    const baseUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const verifyUrl = `${baseUrl}/settings/verify-email?token=${rawToken}`;

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: toEmail,
        subject: 'Confrim your new email address',
        html: `
        <p>You requested to change your Mail Mentor email to this address.</p>
        <p><a href="${verifyUrl}">Click here to confirm</a> (expires in 30 minutes).</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    } catch (err) {
      this.logger.error({ event: 'verification_email_failed' });
      throw err;
    }
  }

  async sendEmailChangeNotice(oldEmail: string) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: oldEmail,
        subject: 'Email change requested on your account',
        html: `
        <p>Someone requested to change the email address on your Mail Mentor account.</p>
        <p>If this was you, no action is needed — check your new inbox to confirm the change.</p>
        <p><strong>If this wasn't you</strong>, your password may be compromised.
        Please reset your password immediately and contact support.</p>
      `,
      });
    } catch (err) {
      this.logger.error({ event: 'email_change_notice_failed' });
      throw err;
    }
  }
}
