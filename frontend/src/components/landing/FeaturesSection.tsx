import {
  CalendarClock,
  CalendarX2,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router";
import { trackAnalyticsEvent } from "@/lib/analytics";

interface WorkplaceMoment {
  number: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  tension: string;
  practice: string;
  action: string;
  actionLabel: string;
}

const workplaceMoments: WorkplaceMoment[] = [
  {
    number: "01",
    icon: CalendarClock,
    eyebrow: "When timing slips",
    title: "Ask for a deadline extension without appearing unreliable.",
    tension:
      "You need more time, but a vague apology can make a manageable delay sound bigger than it is.",
    practice:
      "Name the constraint, propose a realistic date, and show what you will do next.",
    action: "Practise asking for more time",
    actionLabel:
      "Create a free account to practise asking for a deadline extension",
  },
  {
    number: "02",
    icon: Handshake,
    eyebrow: "After a good conversation",
    title: "Follow up after networking without sounding needy.",
    tension:
      "You want to keep the connection going without turning your interest into pressure for the other person.",
    practice:
      "Refer to something specific, thank them clearly, and suggest a low-pressure next step.",
    action: "Practise a thoughtful follow-up",
    actionLabel:
      "Create a free account to practise following up after networking",
  },
  {
    number: "03",
    icon: CalendarX2,
    eyebrow: "When priorities collide",
    title: "Decline a meeting without appearing uncooperative.",
    tension:
      "You need to protect important work while making it clear that you still want the team to move forward.",
    practice:
      "Give a concise reason, offer another way to contribute, and suggest a useful alternative.",
    action: "Practise a constructive decline",
    actionLabel:
      "Create a free account to practise declining a meeting",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="scenarios"
      aria-labelledby="workplace-moments-heading"
      className="scroll-mt-20 bg-secondary/45 px-4 py-24 md:px-8"
    >
      <div className="container mx-auto">
        <div className="mx-auto mb-14 max-w-3xl space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-tertiary">
            The moments that make you pause
          </p>
          <h2
            id="workplace-moments-heading"
            className="font-serif text-3xl font-bold leading-tight text-primary md:text-5xl"
          >
            Practise the emails you will actually need early in your career.
          </h2>
          <p className="text-base leading-7 text-muted-foreground md:text-lg">
            Mail Mentor gives you a place to work through the tension before
            you have to press send at work.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {workplaceMoments.map(
            ({
              number,
              icon: Icon,
              eyebrow,
              title,
              tension,
              practice,
              action,
              actionLabel,
            }) => (
              <article
                key={title}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm md:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <span className="font-serif text-3xl text-muted-foreground/45">
                    {number}
                  </span>
                </div>

                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-snug text-primary">
                  {title}
                </h3>

                <div className="mt-7 space-y-5 border-t border-border pt-5 text-sm leading-6">
                  <div>
                    <p className="font-semibold text-foreground">The tension</p>
                    <p className="mt-1 text-muted-foreground">{tension}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Practise the skill
                    </p>
                    <p className="mt-1 text-muted-foreground">{practice}</p>
                  </div>
                </div>

                <Link
                  to="/register"
                  onClick={() =>
                    trackAnalyticsEvent("landing_registration_clicked", {
                      source_surface: "features",
                    })
                  }
                  aria-label={actionLabel}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {action}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
