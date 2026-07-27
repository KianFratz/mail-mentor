import ScoreItem from "@/components/ScoreItem";
import { useRecentScoresStore } from "@/store/recent-scores.store";
import { useEffect } from "react";

export default function AllScoresPage() {
  const { scores, loading, fetchRecentScores } = useRecentScoresStore();

  useEffect(() => {
    fetchRecentScores(10, 1);
  }, [fetchRecentScores]);

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="md:col-span-6 bg-white border border-border rounded-2xl p-6 shadow-xs flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-foreground">All Scores</h3>
      </div>

      <div className="flex flex-col gap-1">
        {scores.map((score) => (
          <ScoreItem key={score.id} {...score} />
        ))}
      </div>
    </div>
  );
}
