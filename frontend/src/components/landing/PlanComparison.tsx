import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { subscriptionPlanDetails } from "../../constants/subscription-plans.constant";

type PlanKey = keyof typeof subscriptionPlanDetails;

function PlanCard({ planKey }: { planKey: PlanKey }) {
  const plan = subscriptionPlanDetails[planKey];
  const isPro = planKey === "pro";

  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border p-6 shadow-sm md:p-8 ${
        isPro
          ? "border-primary bg-primary text-primary-foreground shadow-lg"
          : "border-border bg-card"
      }`}
    >
      {isPro && (
        <div className="absolute -top-3 left-6 inline-flex items-center gap-1.5 rounded-full bg-tertiary px-3 py-1 text-xs font-semibold text-tertiary-foreground">
          <Sparkles aria-hidden="true" className="size-3.5" />
          For continued progress
        </div>
      )}

      <div>
        <p
          className={`text-sm font-semibold uppercase tracking-[0.16em] ${
            isPro ? "text-primary-foreground/70" : "text-tertiary"
          }`}
        >
          {plan.name}
        </p>
        <h3 className="mt-3 text-2xl font-bold">{plan.description}</h3>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-3xl font-bold">{plan.priceMonthly}</span>
          <span
            className={`text-sm ${
              isPro
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            }`}
          >
            {isPro ? "for one month" : "forever"}
          </span>
          {planKey === "pro" && (
            <p className="basis-full text-sm text-primary-foreground/70">
              Or {plan.priceAnnual} for one year (
              {subscriptionPlanDetails[planKey].annualMonthlyEquivalent}/month
              equivalent)
            </p>
          )}
        </div>

        <ul className="mt-7 grid gap-3 border-t border-current/15 pt-6">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <Check
                aria-hidden="true"
                className={`mt-0.5 size-4 shrink-0 ${
                  isPro ? "text-tertiary" : "text-success"
                }`}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to={isPro ? "/pricing" : "/register"}
        className={`mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          isPro
            ? "bg-background text-primary hover:bg-background/90"
            : "bg-primary text-primary-foreground hover:bg-primary/80"
        }`}
      >
        {isPro ? "See Pro access" : "Start for free"}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </article>
  );
}

export function PlanComparison() {
  return (
    <section
      id="pricing"
      aria-labelledby="plan-comparison-heading"
      className="scroll-mt-20 bg-secondary/45 px-4 py-24 md:px-8"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-tertiary">
            Choose your practice pace
          </p>
          <h2
            id="plan-comparison-heading"
            className="font-serif text-3xl font-bold leading-tight text-primary md:text-5xl"
          >
            Progress comes from consistent practice.
          </h2>
          <p className="text-base leading-7 text-muted-foreground md:text-lg">
            Start free, then choose Pro when you want more room to practise,
            review feedback, and keep your progress moving—not simply more AI.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          <PlanCard planKey="free" />
          <PlanCard planKey="pro" />
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Need the full plan details?{" "}
          <Link
            to="/pricing"
            className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View full pricing
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
