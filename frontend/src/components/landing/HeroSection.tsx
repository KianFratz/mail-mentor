import { useId, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, CheckCircle2, Send, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { primaryChallengeLabel } from "./landing.constants";

const heroChallenge = {
  draft: `Hi Maya,

I think we should be able to get it done by Friday, but I might need some help if anything else comes up. I'll try to keep you posted.

Thanks,`,
  prompt:
    '"Can you confirm whether the Friday client deadline is still achievable? I need a clear read before today\'s planning call?"',
  badges: ["Real workplace prompt", "Editable reply", "Sample coaching"],
};

const coachingOptions = [
  {
    phrase: "I think we should be able to",
    observation:
      "This sounds vague because it avoids a clear commitment. Take ownership by naming the condition, the next update, and the action you will take if risk appears.",
  },
  {
    phrase: "I might need some help",
    observation:
      "This flags risk without naming what help is needed. Take ownership by saying what is blocked, who can unblock it, and when you will ask.",
  },
  {
    phrase: "I'll try to keep you posted",
    observation:
      "This promises effort instead of a clear update. Take ownership by giving a specific update time and what your manager will learn then.",
  },
];

function getLineToReview(draft: string) {
  const lines = draft
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^hi\b/i.test(line) && !/^thanks\b/i.test(line));

  const phrase = lines[0] ?? draft.trim();

  return phrase.length > 96 ? `${phrase.slice(0, 93)}...` : phrase;
}

function getCoachingForDraft(draft: string) {
  const matchingOption = coachingOptions.find(({ phrase }) =>
    draft.toLowerCase().includes(phrase.toLowerCase()),
  );

  if (matchingOption) {
    return {
      ...matchingOption,
      headline: "Clearer ownership would make this reply easier to trust.",
      phraseLabel: "Concerning phrase",
      skillResult: "Ownership: vague wording detected.",
    };
  }

  return {
    phrase: getLineToReview(draft),
    headline: "No sample hedge detected. Check the commitment itself.",
    observation:
      "This draft avoids the three vague phrases in the sample. Keep taking ownership by making the yes or no explicit, then adding the next update and any condition that could change the answer.",
    phraseLabel: "Line to review",
    skillResult: "Ownership: no sample hedge detected.",
  };
}

export function HeroSection() {
  const draftId = useId();
  const draftErrorId = useId();
  const feedbackId = useId();
  const [draft, setDraft] = useState(heroChallenge.draft);
  const [submittedDraft, setSubmittedDraft] = useState(heroChallenge.draft);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [hasFeedback, setHasFeedback] = useState(false);
  const coaching = getCoachingForDraft(submittedDraft);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim()) {
      setDraftError("Enter a draft reply before requesting coaching.");
      setHasFeedback(false);
      return;
    }

    setDraftError(null);
    setSubmittedDraft(draft);
    setHasFeedback(true);
  }

  return (
    <section
      id="challenge"
      className="relative flex min-h-[calc(100svh-4rem)] scroll-mt-20 items-center overflow-hidden px-4 py-8 md:px-8 lg:py-12"
    >
      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-lg bg-tertiary/12 px-3 py-2 text-sm font-medium text-tertiary">
            <Sparkles aria-hidden="true" className="size-4" />
            {primaryChallengeLabel}
          </div>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-primary md:text-5xl">
            Stop second-guessing your work emails.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Practice one realistic reply and see how a small wording shift can
            make your message clearer, warmer, and easier for a manager to act
            on.
          </p>
          <a
            href="#challenge"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {primaryChallengeLabel}
          </a>
          <div className="grid max-w-xl grid-cols-1 gap-3 text-sm text-foreground sm:grid-cols-3">
            {heroChallenge.badges.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="size-4 text-success"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-xl">
          <form
            className="grid gap-5 p-4 md:p-6"
            onSubmit={handleSubmit}
            noValidate
            aria-describedby={hasFeedback ? feedbackId : undefined}
          >
            <div className="rounded-lg border border-border bg-muted/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Manager message
              </p>
              <p className="mt-2 text-base leading-7 text-foreground">
                {heroChallenge.prompt}
              </p>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor={draftId}
                className="text-sm font-semibold text-foreground"
              >
                Your draft reply
              </label>
              <Textarea
                id={draftId}
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setDraftError(null);
                }}
                required
                aria-invalid={Boolean(draftError)}
                aria-describedby={draftError ? draftErrorId : undefined}
                className="min-h-[152px] resize-y bg-background leading-7"
              />
              {draftError && (
                <p
                  id={draftErrorId}
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {draftError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Anonymous preview. No sign-in, AI request, or backend call.
              </p>
              <Button
                type="submit"
                size="lg"
                className="h-11 rounded-lg px-4"
              >
                <Send aria-hidden="true" className="size-4" />
                Get coaching
              </Button>
            </div>
          </form>

          <div
            id={feedbackId}
            aria-live="polite"
            className="border-t border-border bg-secondary/45 px-4 py-5 md:px-6"
          >
            {hasFeedback ? (
              <div className="grid gap-4 motion-safe:animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                    <CheckCircle2 aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {coaching.headline}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {coaching.phraseLabel}: "{coaching.phrase}"
                      </span>{" "}
                      {coaching.observation}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-success/30 bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-success">
                    Stronger alternative
                  </p>
                  <p className="mt-2 text-sm leading-7 text-foreground">
                    Hi Maya, yes, Friday is achievable if I keep the remaining
                    review time protected today. I'll send you a status update
                    by 3pm with any blocker and the exact help I need, if that
                    changes.
                  </p>
                </div>

                <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Partial skill result
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {coaching.skillResult}
                    </p>
                  </div>
                  <Button asChild size="lg" className="h-11 rounded-lg px-4">
                    <Link to="/register">
                      Create a free account
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-2 text-sm leading-6 text-muted-foreground">
                <p className="font-semibold text-foreground">
                  Submit the draft as-is or tune it first.
                </p>
                <p>
                  You'll get one concrete observation, the exact phrase to
                  review, and a revised response you can compare against your
                  own.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
