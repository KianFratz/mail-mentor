import type { RecentScore } from "@/types/mock-dashboard-data";
import ScoreItem from "./ScoreItem";

interface RecentScoresCardProps {
  title?: string;
  scores: RecentScore[];
  onViewAll?: () => void;
}

export default function RecentScoresCard({
  title = "Recent Scores",
  scores,
  onViewAll,
}: RecentScoresCardProps) {
  return (
    <div className="md:col-span-6 bg-white border border-border rounded-2xl p-6 shadow-xs flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-primary hover:underline underline-offset-2 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Score list */}
      <div className="flex flex-col gap-1">
        {scores.map((score) => (
          <ScoreItem key={score.id} {...score} />
        ))}
      </div>
    </div>
  );
}