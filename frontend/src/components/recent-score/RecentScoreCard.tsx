import ScoreItem from "../ScoreItem";
import { useRecentScoresStore } from "@/store/recent-scores.store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import emptyState from "../../assets/undraw_books_wxzz.png";
import RecentScoreCardSkeleton from "./RecentScoreCardSkeleton";

export default function RecentScoresCard({}) {
  const { scores, loading, fetchRecentScores } = useRecentScoresStore();
  const recentScores = scores.slice(0, 3);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentScores(3);
  }, [fetchRecentScores]);

  if (loading) {
    return <RecentScoreCardSkeleton />;
  }

  return (
    <div className="md:col-span-6 bg-white border border-border rounded-2xl p-6 shadow-xs flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Recent Scores
        </h3>
        <Button
          onClick={() => navigate(`/scores/me?page=$1&limit=10`)}
          className="text-xs font-semibold"
        >
          View All
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        {recentScores.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
            <img
              src={emptyState}
              alt="No recent scores"
              className="w-32 h-auto object-contain py-4"
            />
            <p className="text-sm font-medium text-foreground">
              No recent scores yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Finish a scenario to see your recent scores here
            </p>
          </div>
        ) : (
          recentScores.map((score) => <ScoreItem key={score.id} {...score} />)
        )}
      </div>
    </div>
  );
}
