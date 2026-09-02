import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentProvider } from './payment-provider.interface';
import { CreateSubscriptionInput, SubscriptionResult } from './payment.types';
import Xendit from 'xendit-node';

@Injectable()
export class XenditPaymentProvider implements PaymentProvider {
  private xenditClient: any;

  constructor() {
    this.xenditClient = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY || '',
    });
  }

  async createSubscription(
    input: CreateSubscriptionInput,
  ): Promise<SubscriptionResult> {
    try {
      const { Recurring } = this.xenditClient;
      const recurringInstance = new Recurring({});

      const response = await recurringInstance.createSchedule({
        referenceId: `sub_${Date.now()}`,
        customerId: input.customerId,
        currency: input.currency,
        amount: 100000,
        scheduleInterval: 'MONTH',
        scheduleIntervalCount: 1,
      });

      return {
        id: response.id,
        status: this.mapXenditStatus(response.status),
        currentPeriodEnd: new Date(response.nextScheduledExecution),
        customerId: response.customerId,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Xendit Subscription failed: ${error.message}`,
      );
    }
  }

  async cancelSubscription(
    subscriptionId: string,
  ): Promise<SubscriptionResult> {
    try {
      const { Recurring } = this.xenditClient;
      const recurringInstance = new Recurring({});

      const response = await recurringInstance.stopSchedule({
        id: subscriptionId,
      });

      return {
        id: response.id,
        status: 'canceled',
        currentPeriodEnd: new Date(response.nextScheduledExecution),
        customerId: response.customerId,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Xendit Cancellation failed: ${error.message}`,
      );
    }
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionResult> {
    try {
      const { Recurring } = this.xenditClient;
      const recurringInstance = new Recurring({});

      const response = await recurringInstance.getSchedule({
        id: subscriptionId,
      });

      return {
        id: response.id,
        status: this.mapXenditStatus(response.status),
        currentPeriodEnd: new Date(response.nextScheduledExecution),
        customerId: response.customerId,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Xendit Fetch failed: ${error.message}`,
      );
    }
  }

  private mapXenditStatus(status: string): SubscriptionResult['status'] {
    switch (status) {
      case 'ACTIVE':
        return 'active';
      case 'INACTIVE':
      case 'STOPPED':
        return 'canceled';
      case 'FAILED':
        return 'past_due';
      default:
        return 'incomplete';
    }
  }
}
