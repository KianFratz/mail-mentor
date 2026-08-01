import ScoreItem from "@/components/ScoreItem";
import { useRecentScoresStore } from "@/store/recent-scores.store";
import { useEffect } from "react";
import { Sparkles, TrendingUp } from "lucide-react";
import { useSearchParams } from "react-router";
import emptyStateImage from "@/assets/undraw_no-data_ig65.png";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AllScoresPage() {
  const { scores, loading, fetchRecentScores, totalPages } =
    useRecentScoresStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 10);

  useEffect(() => {
    fetchRecentScores(limit, page);
  }, [page, limit]);

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    params.set("limit", String(limit));
    setSearchParams(params);
  };

  const scoreValues = scores
    .map((s: any) => s.overallScore ?? s.score)
    .filter((v: unknown): v is number => typeof v === "number");
  const average = scoreValues.length
    ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
    : null;

  return (
    <div className="md:col-span-6 bg-card border border-border rounded-2xl p-8 pt-6 mt-6 shadow-xs flex flex-col h-[90vh]">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-accent" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground leading-tight">
              All Scores
            </h3>
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
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <img
            src={emptyStateImage}
            alt="No sessions yet"
            className="w-48 h-auto opacity-80"
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              No sessions yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Finish a scenario to see all your scores here
            </p>
          </div>
        </div>
      )}

      {!loading && scores.length > 0 && (
        <div className="flex flex-col gap-1 flex-1 overflow-y-auto pr-2">
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
      <div className="mt-auto pt-4">
        <Pagination>
          <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) goToPage(page - 1);
              }}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={page === pageNumber}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(pageNumber);
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) goToPage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
