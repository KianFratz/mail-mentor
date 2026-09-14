import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

import donutLoveIllustration from "@/assets/undraw_donut-love_5r3x.png";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  const handleTurnBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-background px-6 py-12 text-foreground sm:px-10 lg:px-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_40%),radial-gradient(circle_at_bottom_right,color-mix(in_oklch,var(--accent)_16%,transparent),transparent_42%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-16 -z-10 size-64 rounded-full bg-primary/10 blur-3xl sm:size-80"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-24 -z-10 size-80 rounded-full bg-accent/15 blur-3xl sm:size-96"
      />

      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="animate-fade-in text-center lg:text-left">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-accent">
            Error 404
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Page not found
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg lg:mx-0">
            Looks like this page wandered off in search of something sweet. It
            may have moved, or the address might be incorrect.
          </p>

          <Button
            type="button"
            size="lg"
            onClick={handleTurnBack}
            className="mt-8 h-11 rounded-xl px-5 shadow-lg shadow-primary/20"
          >
            <ArrowLeft aria-hidden="true" />
            Turn Back
          </Button>
        </div>

        <div className="relative mx-auto w-full max-w-2xl animate-fade-in">
          <div
            aria-hidden="true"
            className="absolute inset-x-10 bottom-2 -z-10 h-16 rounded-full bg-primary/15 blur-2xl"
          />
          <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-white p-3 shadow-2xl shadow-primary/10 sm:p-5">
            <img
              src={donutLoveIllustration}
              alt="Playful characters gathering beneath giant purple donuts"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
