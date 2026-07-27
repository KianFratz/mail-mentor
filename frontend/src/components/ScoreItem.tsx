import { formatDate } from "@/lib/dashboard";
import type { RecentScore } from "@/types/dashboard.type";

export default function ScoreItem({ title, date, score }: RecentScore) {
  const scoreColor =
    score >= 90
      ? "text-success"
      : score >= 80
        ? "text-primary"
        : "text-muted-foreground";

  return (
    <div className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-default">
      <div className="flex items-center gap-3">
        <div>
          <p className="text-sm font-medium text-foreground leading-tight">
            {title}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(date)}
          </p>
        </div>
      </div>
      <span className={`text-xl font-bold tabular-nums ${scoreColor}`}>
        {score}
      </span>
    </div>
  );
}
