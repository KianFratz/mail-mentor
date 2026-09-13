import api from "@/lib/axios";
import type {
  PlanLimits,
  SubscriptionPlan,
  SubscriptionStatus,
  SubscriptionUsage,
} from "@/types/subscription.type";
import { create } from "zustand";

interface SubscriptionStore {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  limits: PlanLimits;
  usage: SubscriptionUsage;
  billingInterval?: "month" | "year";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  isLoading: boolean;
  isUpgrading: boolean;
  isCanceling: boolean;
  error: string | null;

  fetchSubscription: () => Promise<void>;
  createSubscriptionCheckout: (
    plan?: string,
    interval?: string,
  ) => Promise<{ actions?: { url: string }; [key: string]: any } | null>;
  cancelSubscription: () => Promise<boolean>;
  reset: () => void;
}

const defaultLimits: PlanLimits = {
  aiRepliesPerDay: 5,
  feedbacksPerDay: 1,
  maxHistoryDays: 7,
  maxRecentScores: 3,
  maxBadges: 3,
  allowedLevels: ["beginner"],
  exportEnabled: false,
  priorityAi: false,
};

const defaultUsage: SubscriptionUsage = {
  aiReplyUsedToday: 0,
  feedbackUsedToday: 0,
};

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  plan: "free",
  status: "active",
  limits: defaultLimits,
  usage: defaultUsage,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  isLoading: false,
  isUpgrading: false,
  isCanceling: false,
  error: null,

  fetchSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/subscription/me");
      set({
        plan: data.plan || "free",
        status: data.status || "active",
        limits: data.limits || defaultLimits,
        usage: data.usage || defaultUsage,
        billingInterval: data.billingInterval,
        currentPeriodEnd: data.currentPeriodEnd || null,
        cancelAtPeriodEnd: Boolean(data.cancelAtPeriodEnd),
        isLoading: false,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to fetch subscription details.";
      set({ isLoading: false, error: message });
    }
  },

  createSubscriptionCheckout: async (plan = "pro", interval = "month") => {
    set({ isUpgrading: true, error: null });
    try {
      const { data } = await api.post("/subscription", {
        plan,
        interval,
      });
      set({ isUpgrading: false });
      return data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Failed to initiate subscription payment.";
      set({ isUpgrading: false, error: message });
      return null;
    }
  },

  cancelSubscription: async () => {
    set({ isCanceling: true, error: null });
    try {
      const { data } = await api.delete("/subscription");
      set({
        plan: data.plan,
        status: data.status,
        billingInterval: data.billingInterval,
        currentPeriodEnd: data.currentPeriodEnd || null,
        cancelAtPeriodEnd: Boolean(data.cancelAtPeriodEnd),
        limits: data.limits || defaultLimits,
        usage: data.usage || defaultUsage,
        isCanceling: false,
      });
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to cancel subscription.";
      set({ isCanceling: false, error: message });
      return false;
    }
  },

  reset: () =>
    set({
      plan: "free",
      status: "active",
      limits: defaultLimits,
      usage: defaultUsage,
      billingInterval: undefined,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      isLoading: false,
      isUpgrading: false,
      isCanceling: false,
      error: null,
    }),
}));
