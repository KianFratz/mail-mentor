import ScoreItem from "./ScoreItem";
import { useRecentScoresStore } from "@/store/recent-scores.store";
import { useEffect } from "react";

export default function RecentScoresCard({}) {
  const { scores, loading, fetchRecentScores, onViewAll } =
    useRecentScoresStore();
  const recentScores = scores.slice(0, 3);

  useEffect(() => {
    fetchRecentScores(3);
  }, [fetchRecentScores]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="md:col-span-6 bg-white border border-border rounded-2xl p-6 shadow-xs flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Recent Scores
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-primary hover:underline underline-offset-2 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {recentScores.map((score) => (
          <ScoreItem key={score.id} {...score} />
        ))}
      </div>
    </div>
  );
}
