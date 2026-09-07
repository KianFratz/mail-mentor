export interface CreateSubscriptionInput {
  userId: string;
  externalId: string;
  amount: number;
  currency?: string;
  payerEmail?: string;
  description?: string;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionResult {
  id: string;
  externalId?: string;
  status: string;
  invoiceUrl: string;
  checkoutUrl?: string;
  amount: number;
  currency: string;
  currentPeriodEnd?: Date;
  customerId?: string;
}

export interface XenditWebhookPayload {
  id?: string;
  user_id?: string;
  customer_id?: string;
  external_id?: string;
  externalId?: string;
  reference_id?: string;
  status?: string;
  created?: string;
  updated?: string;
  amount?: number;
  paid_amount?: number;
  paid_at?: string;
  currency?: string;
  payer_email?: string;
  recurring_plan_id?: string;
  recurring_cycle_id?: string;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export interface XenditWebhook {
  event?: string;
  type?: string;
  created?: string;
  business_id?: string;
  data?: XenditWebhookPayload;
  id?: string;
  external_id?: string;
  externalId?: string;
  status?: string;
  amount?: number;
  paid_amount?: number;
  paid_at?: string;
  currency?: string;
  metadata?: Record<string, any>;
  [key: string]: any;
}

