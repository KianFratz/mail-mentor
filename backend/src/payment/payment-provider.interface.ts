import { CreateSubscriptionInput, SubscriptionResult } from './payment.types';

export interface PaymentProvider {
  createSubscription(
    input: CreateSubscriptionInput,
  ): Promise<SubscriptionResult>;
  cancelSubscription(subscriptionId: string): Promise<SubscriptionResult>;
  getSubscription(subscriptionId: string): Promise<SubscriptionResult>;
}
