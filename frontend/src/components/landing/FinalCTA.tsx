import { Link } from "react-router";

export function FinalCTA() {
  return (
    <section className="py-24 px-4 md:px-8 bg-primary text-primary-foreground overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none"></div>
      <div className="container mx-auto max-w-4xl text-center relative z-10 space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Ready to Elevate Your Writing?
        </h2>
        <p className="text-lg text-primary-foreground/90 max-w-xl mx-auto">
          Join 10,000+ professionals mastering the art of correspondence with
          Mail Mentor.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button className="px-10 py-5 bg-background text-primary rounded-2xl font-semibold hover:shadow-2xl transition-all active:scale-95">
            <Link to="/login">Start Writing for Free</Link>
          </button>
          <button className="px-10 py-5 border border-primary-foreground/20 hover:bg-primary-foreground/10 rounded-2xl font-semibold transition-all">
            <Link to="/login">Schedule a Demo</Link>
          </button>
        </div>
        <p className="text-xs text-primary-foreground/60">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
