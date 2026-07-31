import { cn } from "@/lib/utils";
import { useStreakStore } from "@/store/streak.store";
import { useEffect } from "react";

export default function PracticeStreakCard() {
  const { fetchWeeklyStreak, weeklyStreak, fetchLongestStreak, longestStreak } =
    useStreakStore();

  useEffect(() => {
    fetchWeeklyStreak();
    fetchLongestStreak();
  }, [fetchWeeklyStreak, fetchLongestStreak]);

  return (
    <div className="md:col-span-4 relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between gap-4 bg-primary text-primary-foreground shadow-md">
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-4 w-20 h-20 rounded-full bg-white/5 blur-xl pointer-events-none" />
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70 mb-2">
          Practice Streak
        </p>
        <p className="text-5xl font-extrabold leading-none tracking-tight">
          {longestStreak} <span className="text-2xl font-bold">Days</span>
        </p>
        <p className="mt-2 text-xs text-primary-foreground/75 leading-snug max-w-[180px]">
          You're in the top 5% of active learners this month!
        </p>
      </div>

      <div className="relative z-10 flex gap-2">
        {weeklyStreak.map((day, idx) => {
          const isToday =
            !day.isFuture &&
            !day.completed &&
            idx === weeklyStreak.findLastIndex((d) => !d.isFuture);

          return (
            <div
              key={idx}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors",
                day.completed && "bg-success text-white shadow-sm",
                !day.completed &&
                  day.isFuture &&
                  "bg-white/10 text-primary-foreground/40",
                !day.completed &&
                  !day.isFuture &&
                  "bg-white/15 text-primary-foreground/70 ring-1 ring-inset ring-white/20",
                isToday && "ring-2 ring-white/50",
              )}
            >
              {day.completed ? (
                <span className="material-symbols-outlined text-white text-sm leading-none">
                  check
                </span>
              ) : (
                day.day
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
