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

export class XenditWebhookPayload {
  id: string;
  user_id: string;
  reference_id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUCCEEDED' | 'FAILED';
  created: string;
  updated: string;
  recurring_plan_id?: string;
  recurring_cycle_id?: string;
  amount?: number;
  currency?: string;
  [key: string]: any;
}

export class XenditWebhook {
  event: string;
  type?: string;
  created: string;
  business_id: string;
  data: XenditWebhookPayload;
}
