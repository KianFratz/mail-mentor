import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateSubscriptionInput, SubscriptionResult } from './payment.types';
import { Xendit } from 'xendit-node';

@Injectable()
export class XenditPaymentProvider {
  private readonly logger = new Logger(XenditPaymentProvider.name);
  private xenditClient: Xendit;

  constructor() {
    const secretKey = process.env.XENDIT_SECRET_KEY || '';

    if (!secretKey) {
      this.logger.error(
        'XENDIT_SECRET_KEY is not set in environment variables',
      );
    }

    this.xenditClient = new Xendit({ secretKey });
  }

  async createSubscription(
    input: CreateSubscriptionInput,
  ): Promise<SubscriptionResult> {
    try {
      this.logger.log({ event: 'payment_invoice_creating' });

      const response = await this.xenditClient.Invoice.createInvoice({
        data: {
          externalId: input.externalId,
          amount: input.amount,
          currency: input.currency || 'PHP',
          payerEmail: input.payerEmail,
          description: input.description || 'Mail Mentor Pro Subscription',
          successRedirectUrl: input.successRedirectUrl,
          failureRedirectUrl: input.failureRedirectUrl,
          metadata: input.metadata,
        },
      });

      this.logger.log({ event: 'payment_invoice_created' });

      return {
        id: response.id || '',
        externalId: response.externalId,
        status: response.status,
        invoiceUrl: response.invoiceUrl,
        checkoutUrl: response.invoiceUrl,
        amount: response.amount,
        currency: response.currency || 'PHP',
        customerId: input.userId,
      };
    } catch (error: any) {
      this.logger.error({ event: 'payment_invoice_failed' });
      throw new InternalServerErrorException('Payment provider request failed');
    }
  }

  async cancelSubscription(
    subscriptionId: string,
  ): Promise<SubscriptionResult> {
    try {
      const response = await this.xenditClient.Invoice.expireInvoice({
        invoiceId: subscriptionId,
      });

      return {
        id: response.id || subscriptionId,
        externalId: response.externalId,
        status: response.status,
        invoiceUrl: response.invoiceUrl,
        checkoutUrl: response.invoiceUrl,
        amount: response.amount,
        currency: response.currency || 'PHP',
      };
    } catch (error: any) {
      throw new InternalServerErrorException('Payment provider request failed');
    }
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionResult> {
    try {
      const response = await this.xenditClient.Invoice.getInvoiceById({
        invoiceId: subscriptionId,
      });

      return {
        id: response.id || subscriptionId,
        externalId: response.externalId,
        status: response.status,
        invoiceUrl: response.invoiceUrl,
        checkoutUrl: response.invoiceUrl,
        amount: response.amount,
        currency: response.currency || 'PHP',
      };
    } catch (error: any) {
      throw new InternalServerErrorException('Payment provider request failed');
    }
  }
}
