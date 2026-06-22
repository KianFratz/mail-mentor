import React from "react";
import type { EarnedBadge, LockedBadgeProgress } from "./types/dashboard.type";
import BadgeItem from "./components/BadgeItem";

interface BadgesCardProps {
  title?: string;
  badges: EarnedBadge[];
  lockedBadge?: LockedBadgeProgress;
}

export default function BadgesCard({
  title = "Earned Badges",
  badges,
  lockedBadge,
}: BadgesCardProps) {
  return (
    <div className="md:col-span-6 bg-white border border-border rounded-2xl p-6 shadow-xs flex flex-col gap-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      {/* Badge grid */}
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge) => (
          <BadgeItem key={badge.id} {...badge} />
        ))}
      </div>

      {/* Locked badge */}
      {lockedBadge && (
        <div className="mt-1 p-3 border border-dashed border-border rounded-xl flex items-center gap-3 opacity-60">
          <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-muted-foreground text-[18px] leading-none">
              lock
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              Next: {lockedBadge.title}
            </p>
            <div className="h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${lockedBadge.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
