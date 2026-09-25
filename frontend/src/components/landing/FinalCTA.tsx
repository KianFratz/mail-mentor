import { Link } from "react-router";
import { primaryChallengeLabel } from "./landing.constants";
import { trackAnalyticsEvent } from "@/lib/analytics";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-24 text-primary-foreground md:px-8">
      <div className="absolute inset-0 opacity-10 pointer-events-none"></div>
      <div className="container mx-auto max-w-4xl text-center relative z-10 space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Practise the difficult email before it matters.
        </h2>
        <p className="text-lg text-primary-foreground/90 max-w-xl mx-auto">
          Try a realistic workplace reply, see where your wording creates
          uncertainty, and build a clearer response before the real moment.
        </p>
        <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
          <a
            href="#challenge"
            onClick={() =>
              trackAnalyticsEvent("landing_challenge_started", {
                source_surface: "final_cta",
              })
            }
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-background px-10 py-4 font-semibold text-primary transition-all hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            {primaryChallengeLabel}
          </a>
          <Link
            to="/register"
            onClick={() =>
              trackAnalyticsEvent("landing_registration_clicked", {
                source_surface: "final_cta",
              })
            }
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-primary-foreground/40 px-10 py-4 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Create a free account
          </Link>
        </div>
        <p className="text-xs text-primary-foreground/60">
          Start on the Free plan. No credit card is required.
        </p>
      </div>
    </section>
  );
}
