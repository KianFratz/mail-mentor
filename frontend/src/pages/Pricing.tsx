import { useState, useEffect } from "react";
import {
  Check,
  Shield,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { useSubscriptionStore } from "@/store/subscription.store";
import { toastManager } from "@/components/ui/toast";

export default function Pricing() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const { plan, fetchSubscription, createSubscriptionCheckout } =
    useSubscriptionStore();
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Handle payment failure redirect from Xendit
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "failed") {
      toastManager.add({
        title: "Payment Failed",
        description: "Your payment was not completed. Please try again.",
        type: "error",
      });
      // Clean up the query param
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSelectPlan = async (targetPlan: "pro") => {
    if (plan === targetPlan) {
      toastManager.add({
        title: "Current Plan",
        description: `You are already subscribed to the ${targetPlan.toUpperCase()} plan.`,
        type: "info",
      });
      return;
    }

    try {
      setUpgradingPlan(targetPlan);
      const res = await createSubscriptionCheckout(
        targetPlan,
        billingCycle === "annual" ? "year" : "month"
      );
      const checkoutUrl =
        res?.invoiceUrl || res?.checkoutUrl || res?.url || res?.actions?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toastManager.add({
          title: "Error",
          description: "Could not get checkout URL. Please try again.",
          type: "error",
        });
      }
    } catch (err: any) {
      toastManager.add({
        title: "Checkout Failed",
        description: err?.message || "Failed to initiate payment.",
        type: "error",
      });
    } finally {
      setUpgradingPlan(null);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free Tier",
      description: "Essential tools to start practicing email communication.",
      priceMonthly: "₱0",
      priceAnnual: "₱0",
      period: "forever",
      popular: false,
      features: [
        "5 AI Replies per day",
        "1 AI Feedback report per day",
        "Access to Beginner scenarios",
        "7 days of history retention",
        "Standard response times",
      ],
      buttonText: plan === "free" ? "Current Plan" : "Free Plan",
      buttonVariant: "outline" as const,
      disabled: plan === "free",
    },
    {
      id: "pro",
      name: "Pro Plan",
      description:
        "Supercharge your email writing skills with unlimited AI access.",
      priceMonthly: "₱449",
      priceAnnual: "₱359",
      period: "per month",
      popular: true,
      features: [
        "Unlimited AI Conversation Replies",
        "Unlimited Daily Feedback & Grading",
        "Unlock All Scenarios (Intermediate & Advanced)",
        "Full Conversation History Retention",
        "Export Data (JSON, CSV, PDF)",
        "Priority AI Response Generation",
      ],
      buttonText: plan === "pro" ? "Current Plan" : "Upgrade to Pro",
      buttonVariant: "default" as const,
      disabled: plan === "pro",
    },
  ];

  const faqs = [
    {
      q: "Can I change my plan or cancel anytime?",
      a: "Yes! You can upgrade, downgrade, or cancel your subscription at any time without hidden fees or cancellation penalties.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support Credit/Debit Cards, GCash, Maya, Bank Transfers, and QR PH via Xendit payment gateway.",
    },
    {
      q: "How do daily usage resets work?",
      a: "Daily limits for Free users reset automatically every 24 hours (at midnight local server time).",
    },
    {
      q: "What happens to my history if I downgrade?",
      a: "Your data remains safe. When on the Free tier, history older than 7 days is temporarily hidden until you upgrade back to Pro.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-white tracking-tight">
            Mail Mentor
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-6 pb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
          Simple, Transparent Pricing
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Unlock Your Full Potential in <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
            Professional Communication
          </span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Choose the plan that fits your growth. Upgrade anytime to access
          unlimited AI feedback and all practice scenarios.
        </p>

        {/* Billing cycle toggle */}
        <div className="pt-6 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-medium ${
              billingCycle === "monthly" ? "text-white" : "text-slate-400"
            }`}
          >
            Monthly Billing
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")
            }
            className="relative w-14 h-8 rounded-full bg-slate-800 border border-slate-700 p-1 transition-colors focus:outline-none"
          >
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-transform ${
                billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium flex items-center gap-1.5 ${
              billingCycle === "annual" ? "text-white" : "text-slate-400"
            }`}
          >
            Annual Billing
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Save 20%
            </span>
          </span>
        </div>
      </section>

      {/* Plan Cards Grid */}
      <section className="relative z-10 max-w-4xl w-full mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
              p.popular
                ? "bg-slate-800/90 border-2 border-violet-500 shadow-2xl shadow-violet-500/20 -translate-y-2"
                : "bg-slate-800/40 border border-slate-700/60 hover:border-slate-600"
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
                Most Popular
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                {plan === p.id && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40">
                    Active
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 min-h-[32px] mb-6">
                {p.description}
              </p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-white">
                  {billingCycle === "annual" ? p.priceAnnual : p.priceMonthly}
                </span>
                <span className="text-sm text-slate-400">{p.period}</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-slate-700/60 mb-8">
                {p.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              onClick={() => {
                if (p.id === "pro") {
                  handleSelectPlan("pro");
                }
              }}
              disabled={p.disabled || upgradingPlan === p.id}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                p.popular
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/30"
                  : "bg-slate-700 hover:bg-slate-600 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {upgradingPlan === p.id
                ? "Redirecting to checkout..."
                : p.buttonText}
            </Button>
          </div>
        ))}
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 max-w-4xl w-full mx-auto px-6 pb-20 border-t border-slate-800 pt-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl font-bold text-white">
            Got Questions? We’ve got answers.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 space-y-2"
            >
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400 shrink-0" />
                {faq.q}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
