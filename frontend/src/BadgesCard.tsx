import { useEffect } from "react";
import type {
  BadgeVariant,
  EarnedBadge,
  LockedBadgeProgress,
} from "./types/dashboard.type";
import BadgeItem from "./components/BadgeItem";
import { useBadgeStore } from "./store/badge.store";

interface BadgesCardProps {
  title?: string;
  badges?: EarnedBadge[];
  lockedBadge?: LockedBadgeProgress;
}

export default function BadgesCard({
  title = "Earned Badges",
  badges: fallbackBadges = [],
  lockedBadge: fallbackLockedBadge,
}: BadgesCardProps) {
  const { userBadges, fetchUserBadge, loading } = useBadgeStore();

  useEffect(() => {
    fetchUserBadge();
  }, [fetchUserBadge]);

  const earnedUserBadges: EarnedBadge[] = userBadges
    .filter((record) => record.earnedAt !== null)
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
    <div className="md:col-span-6 bg-white border border-border rounded-2xl p-6 shadow-xs flex flex-col gap-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      <div className="grid grid-cols-2 gap-3">
        {badgesToDisplay.map((badge) => (
          <BadgeItem key={badge.id} {...badge} />
        ))}
      </div>

      {lockedBadgeToDisplay && (
        <div className="mt-1 p-3 border border-dashed border-border rounded-xl flex items-center gap-3 opacity-60">
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
