import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private fromAddress: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromAddress = process.env.MAIL_FROM || 'onboarding@resend.dev';
  }

  async sendEmailChangeVerification(toEmail: string, rawToken: string) {
    const verifyUrl = `${process.env.APP_URL}/settings/email/verify?token=${rawToken}`;

    await this.resend.emails.send({
      from: this.fromAddress,
      to: toEmail,
      subject: 'Confrim your new email address',
      html: `
        <p>You requested to change your Mail Mentor email to this address.</p>
        <p><a href="${verifyUrl}">Click here to confirm</a> (expires in 30 minutes).</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        `,
    });
  }

  async sendEmailChangeNotice(oldEmail: string) {
    await this.resend.emails.send({
      from: this.fromAddress,
      to: oldEmail,
      subject: 'Email change requested on your account',
      html: `
        <p>Someone requested to change the email address on your Mail Mentor account.</p>
        <p>If this was you, no action is needed — check your new inbox to confirm the change.</p>
        <p><strong>If this wasn't you</strong>, your password may be compromised.
        Please reset your password immediately and contact support.</p>
      `,
    });
  }
}
