import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { useSubscriptionStore } from "@/store/subscription.store";

export function SubscriptionStatusCard() {
  const navigate = useNavigate();
  const { plan, limits, usage, fetchSubscription } = useSubscriptionStore();

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isPro = plan === "pro";

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Subscription & Plan
            </h3>
            <p className="text-xs text-muted-foreground">
              Manage your Mail Mentor plan, limits, and usage status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPro ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              Pro Plan
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              Free Tier
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            AI Replies Today
          </span>
          <p className="text-base font-bold text-foreground">
            {isPro ? "Unlimited" : `${usage.aiReplyUsedToday ?? 0} / ${limits.aiRepliesPerDay ?? 5}`}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Feedback Today
          </span>
          <p className="text-base font-bold text-foreground">
            {isPro ? "Unlimited" : `${usage.feedbackUsedToday ?? 0} / ${limits.feedbacksPerDay ?? 1}`}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            History Access
          </span>
          <p className="text-base font-bold text-foreground">
            {limits.maxHistoryDays ? `${limits.maxHistoryDays} Days` : "Unlimited"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {isPro
            ? "Thank you for supporting Mail Mentor Pro!"
            : "Upgrade to Pro (₱449/mo) for unlimited replies, all scenario levels, and PDF data export."}
        </p>

        <Button
          onClick={() => navigate("/pricing")}
          className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-sm text-xs font-semibold rounded-xl"
        >
          {isPro ? "View Plan Details" : "Upgrade to Pro"}
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default SubscriptionStatusCard;
