import { Link } from "react-router";
import { primaryChallengeLabel, supportDestination } from "./landing.constants";
import { trackAnalyticsEvent } from "@/lib/analytics";

const footerLinkClassName =
  "rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function Footer() {
  return (
    <footer className="bg-card py-16 px-4 md:px-8 border-t border-border">
      <div className="container mx-auto">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 space-y-6 md:col-span-1">
            <Link
              to="/"
              className="inline-block rounded-sm text-2xl font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Mail Mentor
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered email-writing practice with interactive scenarios and
              post-session feedback.
            </p>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
              Product
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <a href="#how-it-works" className={footerLinkClassName}>
                  How it works
                </a>
              </li>
              <li>
                <a href="#scenarios" className={footerLinkClassName}>
                  Scenarios
                </a>
              </li>
              <li>
                <Link to="/pricing" className={footerLinkClassName}>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
              Practice
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                  <a
                    href="#challenge"
                    className={footerLinkClassName}
                    onClick={() =>
                      trackAnalyticsEvent("landing_challenge_started", {
                        source_surface: "footer",
                      })
                    }
                  >
                  {primaryChallengeLabel}
                </a>
              </li>
              <li>
                <a href="#scenarios" className={footerLinkClassName}>
                  Workplace scenarios
                </a>
              </li>
              <li>
                <Link
                  to="/register"
                  className={footerLinkClassName}
                  onClick={() =>
                    trackAnalyticsEvent("landing_registration_clicked", {
                      source_surface: "footer",
                    })
                  }
                >
                  Create an account
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-foreground">
              Account & support
            </h2>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>Under active development</li>
              <li>
                <Link to="/login" className={footerLinkClassName}>
                  Sign in
                </Link>
              </li>
              <li>
                <a
                  href={supportDestination}
                  target="_blank"
                  rel="noreferrer"
                  className={footerLinkClassName}
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-6 border-t border-border pt-12 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 Mail Mentor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
