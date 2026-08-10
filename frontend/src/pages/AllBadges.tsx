import { useEffect, useState } from "react";
import { Sparkles, Trophy, Lock } from "lucide-react";
import { useBadgeStore } from "@/store/badge.store";
import { getBadgeRequirementNote } from "@/utils/badge-helper";
import emptyStateImage from "@/assets/undraw_no-data_ig65.png";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function AllBadgesPage() {
  const { userBadges, loading, fetchUserBadge } = useBadgeStore();
  const [filter, setFilter] = useState<"all" | "earned" | "in-progress">("all");

  useEffect(() => {
    fetchUserBadge();
  }, [fetchUserBadge]);

  const earnedCount = userBadges.filter((b) => b.earnedAt !== null).length;
  const totalCount = userBadges.length;

  const filteredBadges = userBadges.filter((record) => {
    if (filter === "earned") return record.earnedAt !== null;
    if (filter === "in-progress") return record.earnedAt === null;
    return true;
  });

  return (
    <div className="md:col-span-6 bg-card border border-border rounded-2xl p-8 pt-6 mt-6 shadow-xs flex flex-col h-[90vh]">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <Trophy className="w-4.5 h-4.5 text-accent" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground leading-tight">
              All Badges
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {earnedCount} of {totalCount} Badges Earned
            </p>
          </div>
        </div>

        <div className="flex bg-muted/50 p-1 rounded-lg">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            className="text-xs h-7 px-3"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "earned" ? "default" : "ghost"}
            size="sm"
            className="text-xs h-7 px-3"
            onClick={() => setFilter("earned")}
          >
            Earned
          </Button>
          <Button
            variant={filter === "in-progress" ? "default" : "ghost"}
            size="sm"
            className="text-xs h-7 px-3"
            onClick={() => setFilter("in-progress")}
          >
            In Progress
          </Button>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-muted animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      )}

      {!loading && filteredBadges.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
          <img
            src={emptyStateImage}
            alt="No badges found"
            className="w-48 h-auto opacity-80"
          />
          <div>
            <p className="text-sm font-medium text-foreground">
              No badges found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {filter === "earned"
                ? "You haven't earned any badges yet. Keep practicing!"
                : "No badges available for this filter."}
            </p>
          </div>
        </div>
      )}

      {!loading && filteredBadges.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-4">
          {filteredBadges.map((record, i) => {
            const isEarned = record.earnedAt !== null;
            const progress = isEarned ? 100 : record.progress || 0;
            const requirementNote = getBadgeRequirementNote(record.badge);
            
            const variantStyles: Record<string, string> = {
              tertiary: "bg-accent text-accent-foreground",
              secondary: "bg-success text-success-foreground",
              primary: "bg-primary text-primary-foreground",
            };
            const iconBgClass = variantStyles[record.badge.variant] || "bg-muted text-muted-foreground";

            return (
              <div
                key={record.id}
                className="animate-fade-in p-4 rounded-xl border border-border bg-card flex flex-col gap-3 transition-all hover:shadow-sm"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${iconBgClass} ${!isEarned ? 'opacity-50 grayscale' : ''}`}>
                    <span
                      className="material-symbols-outlined text-[24px] leading-none"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {record.badge.icon || "military_tech"}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {record.badge.title}
                      </h4>
                      {isEarned ? (
                        <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" /> Earned
                        </span>
                      ) : (
                        <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {record.badge.subTitle}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-3 mt-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-foreground">Progress</span>
                    <span className="text-xs font-bold text-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    <span className="font-medium text-foreground mr-1">Requirement:</span>
                    {requirementNote}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
