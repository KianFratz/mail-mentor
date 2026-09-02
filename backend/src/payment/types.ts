export interface CreateSubscriptionInput {
  customerId: string;
  priceId: string;
  metadata: Record<string, string>;
}

export interface SubscriptionResult {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: Date;
  customerId: string;
}
