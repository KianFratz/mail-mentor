import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';

@Injectable()
export class MailService {
  private resend: Resend;
  private fromAddress: string;
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: Number(this.configService.get<string>('MAIL_PORT')),
      secure: false, // true for port 465, false for 587
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    } as nodemailer.TransportOptions);
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromAddress = process.env.MAIL_FROM || 'onboarding@resend.dev';
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent: ${info.message}`);
      return info;
    } catch (err) {
      this.logger.error('Failed to send email', error);
      throw error;
    }
  }

  async sendEmailChangeVerification(toEmail: string, rawToken: string) {
    const baseUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      this.configService.get<string>('APP_URL');
    const verifyUrl = `${baseUrl}/settings/email/verify?token=${rawToken}`;

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
      this.logger.error(`Failed to send verification email to ${toEmail}`, err);
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
      this.logger.error(
        `Failed to send change notice email to ${oldEmail}`,
        err,
      );
      throw err;
    }
  }
}
