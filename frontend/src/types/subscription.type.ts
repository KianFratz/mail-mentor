export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';

export interface PlanLimits {
  aiRepliesPerDay: number;
  feedbacksPerDay: number;
  maxHistoryDays: number;
  maxRecentScores: number;
  maxBadges: number;
  allowedLevels: string[];
  exportEnabled: boolean;
  priorityAi: boolean;
}

export interface SubscriptionUsage {
  aiReplyUsedToday: number;
  feedbackUsedToday: number;
  usageResetAt?: string;
}

export interface SubscriptionData {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  limits: PlanLimits;
  usage: SubscriptionUsage;
}
