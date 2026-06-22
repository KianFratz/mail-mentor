import type { RecentScore } from "@/types/dashboard-type";

export default function ScoreItem({ icon, title, date, score }: RecentScore) {
  const scoreColor =
    score >= 90
      ? "text-success"
      : score >= 80
        ? "text-primary"
        : "text-muted-foreground";

  return (
    <div className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-default">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
          <span className="material-symbols-outlined text-primary text-[18px] leading-none">
            {icon}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground leading-tight">
            {title}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
        </div>
      </div>
      <span className={`text-xl font-bold tabular-nums ${scoreColor}`}>
        {score}
      </span>
    </div>
  );
}
