import { CreateSubscriptionInput, SubscriptionResult } from './payment.types';

export interface PaymentProvider {
  createSubscription(
    input: CreateSubscriptionInput,
  ): Promise<SubscriptionResult>;
}
