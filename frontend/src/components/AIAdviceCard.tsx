import type { AISuggestion } from "@/types/mock-dashboard-data";

export default function AIAdviceCard({
  eyebrow = "AI Suggestion",
  message,
  ctaLabel,
  onCtaClick,
}: AISuggestion) {
  return (
    <div className="mt-6 relative overflow-hidden rounded-2xl bg-primary p-5 flex items-center gap-5 shadow-md">
      {/* Decorative blob */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      {/* Icon */}
      <div className="hidden sm:flex w-10 h-10 rounded-full bg-white/15 items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary-foreground text-xl leading-none">
          auto_awesome
        </span>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/70 mb-0.5">
          {eyebrow}
        </p>
        <p className="text-sm text-primary-foreground leading-snug">{message}</p>
      </div>

      {/* CTA */}
      <button
        onClick={onCtaClick}
        className="relative z-10 shrink-0 px-5 py-2 bg-white text-primary text-sm font-semibold rounded-xl hover:bg-white/90 active:scale-[0.97] transition-all duration-150 shadow-sm"
      >
        {ctaLabel}
      </button>
    </div>
  );
}