import React from "react";

function RecentScoreCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 w-32 rounded bg-muted" />{" "}
        <div className="h-8 w-20 rounded bg-muted" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-16 rounded-lg bg-muted" />{" "}
        <div className="h-16 rounded-lg bg-muted" />{" "}
        <div className="h-16 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default RecentScoreCardSkeleton;
