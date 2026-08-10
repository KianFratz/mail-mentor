import { useEffect } from "react";
import { useNavigate } from "react-router";
import type {
  BadgeVariant,
  EarnedBadge,
  LockedBadgeProgress,
} from "./types/dashboard.type";
import BadgeItem from "./components/BadgeItem";
import { useBadgeStore } from "./store/badge.store";
import { Button } from "./components/ui/button";

interface BadgesCardProps {
  title?: string;
  badges?: EarnedBadge[];
  lockedBadge?: LockedBadgeProgress;
}

export default function BadgesCard({
  badges: fallbackBadges = [],
  lockedBadge: fallbackLockedBadge,
}: BadgesCardProps) {
  const navigate = useNavigate();
  const { userBadges, fetchUserBadge, loading } = useBadgeStore();

  useEffect(() => {
    fetchUserBadge();
  }, [fetchUserBadge]);

  const earnedUserBadges: EarnedBadge[] = userBadges
    .filter((record) => record.earnedAt !== null)
    .sort(
      (a, b) =>
        new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime(),
    )
    .slice(0, 2)
    .map((record) => ({
      id: record.id,
      icon: record.badge.icon || "military_tech",
      title: record.badge.title,
      subtitle: record.badge.subTitle,
      variant:
        record.badge.variant === "tertiary" ||
        record.badge.variant === "secondary"
          ? (record.badge.variant as BadgeVariant)
          : "tertiary",
    }));

  const badgesToDisplay =
    earnedUserBadges.length > 0 ? earnedUserBadges : fallbackBadges;

  console.log("badges to display", badgesToDisplay);

  const lockedRecords = userBadges
    .filter((record) => record.earnedAt === null)
    .sort((a, b) => b.progress - a.progress);

  const lockedBadgeToDisplay =
    lockedRecords.length > 0
      ? {
          title: lockedRecords[0].badge.title,
          progressPercentage: lockedRecords[0].progress,
        }
      : fallbackLockedBadge;

  return (
    <div className="md:col-span-6 bg-white border border-border rounded-2xl p-6 shadow-xs flex flex-col gap-4 min-h-[200px]">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="text-base font-semibold text-foreground">
          Earned Badges
        </h3>
        <Button
          onClick={() => navigate("/badges/me")}
          className="text-xs font-semibold h-8"
        >
          View All
        </Button>
      </div>

      {badgesToDisplay.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 content-start">
          {badgesToDisplay.map((badge) => (
            <BadgeItem key={badge.id} {...badge} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 border border-dashed border-border rounded-xl p-4">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-30">
            military_tech
          </span>
          <span className="text-sm font-medium">No Badges Yet</span>
          <span className="text-xs text-center opacity-70 mt-1">
            Complete writing sessions to earn badges
          </span>
        </div>
      )}

      {lockedBadgeToDisplay && (
        <div className="mt-auto p-3 border border-dashed border-border rounded-xl flex items-center gap-3 opacity-60 shrink-0">
          <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-muted-foreground text-[18px] leading-none">
              lock
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              Next: {lockedBadgeToDisplay.title}
            </p>
            <div className="h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${lockedBadgeToDisplay.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
