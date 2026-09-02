export interface CreateSubscriptionInput {
  customerId: string;
  priceId: string;
  currency: string;
  paymentMethodId?: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionResult {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodEnd: Date;
  customerId: string;
}
