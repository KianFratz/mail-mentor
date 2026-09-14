import type { AISuggestion } from "@/types/dashboard.type";

export default function AIAdviceCard({
  eyebrow = "AI Suggestion",
  message,
  ctaLabel,
  onCtaClick,
}: AISuggestion) {
  return (
    <div className="mt-6 relative overflow-hidden rounded-2xl bg-primary p-5 flex items-center gap-5 shadow-md mb-4">
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-md font-extrabold uppercase tracking-wide text-primary-foreground mb-1">
          {eyebrow}
        </p>
        <p className="text-xs text-primary-foreground/70 leading-snug">
          {message}
        </p>
      </div>

      <button
        onClick={onCtaClick}
        className="relative z-10 shrink-0 px-5 py-2 bg-white text-primary text-sm font-semibold rounded-xl hover:bg-white/90 active:scale-[0.97] transition-all duration-150 shadow-sm"
      >
        {ctaLabel}
      </button>
    </div>
  );
}