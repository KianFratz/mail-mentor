import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PaymentProvider } from './payment-provider.interface';
import { CreateSubscriptionInput, SubscriptionResult } from './payment.types';
import { Xendit } from 'xendit-node';

@Injectable()
export class XenditPaymentProvider implements PaymentProvider {
  private readonly logger = new Logger(XenditPaymentProvider.name);
  private xenditClient: Xendit;

  constructor() {
    const secretKey = process.env.XENDIT_SECRET_KEY || '';
    if (!secretKey) {
      this.logger.error('XENDIT_SECRET_KEY is not set in environment variables');
    }
    this.xenditClient = new Xendit({ secretKey });
  }

  async createSubscription(
    input: CreateSubscriptionInput,
  ): Promise<SubscriptionResult> {
    try {
      this.logger.log(
        `Creating invoice for user ${input.userId}, amount: ${input.amount} ${input.currency || 'PHP'}`,
      );

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

      this.logger.log(
        `Invoice created successfully: ${response.id}, URL: ${response.invoiceUrl}`,
      );

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
      this.logger.error(
        `Xendit createInvoice failed: ${error.errorMessage || error.message || JSON.stringify(error)}`,
      );

      // Surface meaningful Xendit errors
      const status = error.status || error.statusCode;
      const msg =
        error.errorMessage ||
        error.message ||
        'Payment provider request failed';

      if (status === 403) {
        throw new ForbiddenException(
          `Xendit API key lacks required permissions. Please enable Invoice API access in your Xendit Dashboard. Details: ${msg}`,
        );
      }
      if (status === 400) {
        throw new BadRequestException(`Xendit: ${msg}`);
      }

      throw new InternalServerErrorException(`Xendit: ${msg}`);
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
      throw new InternalServerErrorException(
        `Xendit Cancellation failed: ${error.errorMessage || error.message || error}`,
      );
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
      throw new InternalServerErrorException(
        `Xendit Fetch failed: ${error.errorMessage || error.message || error}`,
      );
    }
  }
}
