import ScoreItem from "@/components/ScoreItem";
import { useRecentScoresStore } from "@/store/recent-scores.store";
import { useEffect } from "react";
import { Sparkles, Inbox, TrendingUp } from "lucide-react";

export default function AllScoresPage() {
  const { scores, loading, fetchRecentScores } = useRecentScoresStore();

  useEffect(() => {
    fetchRecentScores(10, 1);
  }, [fetchRecentScores]);

  const scoreValues = scores
    .map((s: any) => s.overallScore ?? s.score)
    .filter((v: unknown): v is number => typeof v === "number");
  const average = scoreValues.length
    ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
    : null;

  return (
    <div className="md:col-span-6 bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-accent" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground leading-tight">
              All Scores
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {scores.length} recent session{scores.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {average !== null && (
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 text-success px-3 py-1.5 text-xs font-medium">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.5} />
            Avg {average}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-muted animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      )}

      {!loading && scores.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
          <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
            <Inbox className="w-5 h-5 text-muted-foreground" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              No sessions yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Finish a scenario to see your feedback here.
            </p>
          </div>
        </div>
      )}

      {!loading && scores.length > 0 && (
        <div className="flex flex-col gap-1">
          {scores.map((score, i) => (
            <div
              key={score.id}
              className="animate-fade-in rounded-xl transition-colors hover:bg-secondary/60"
              style={{ animationDelay: `${i * 45}ms` }}
            >
              <ScoreItem {...score} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}