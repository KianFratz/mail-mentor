import type { WeekDay } from "@/types/dashboard-type";

interface PracticeStreakCardProps {
  title?: string;
  days: number;
  message: string;
  weekDays: WeekDay[];
}

export default function PracticeStreakCard({
  title = "Practice Streak",
  days,
  message,
  weekDays,
}: PracticeStreakCardProps) {
  return (
    <div className="md:col-span-4 relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between gap-4 bg-primary text-primary-foreground shadow-md">
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-4 w-20 h-20 rounded-full bg-white/5 blur-xl pointer-events-none" />
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70 mb-2">
          {title}
        </p>
        <p className="text-5xl font-extrabold leading-none tracking-tight">
          {days} <span className="text-2xl font-bold">Days</span>
        </p>
        <p className="mt-2 text-xs text-primary-foreground/75 leading-snug max-w-[180px]">
          {message}
        </p>
      </div>

      <div className="relative z-10 flex gap-2">
        {weekDays.map((day, idx) =>
          day.completed ? (
            <div
              key={idx}
              className="w-8 h-8 rounded-full bg-success flex items-center justify-center shadow-sm"
            >
              <span className="material-symbols-outlined text-white text-sm leading-none">
                check
              </span>
            </div>
          ) : (
            <div
              key={idx}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-semibold text-primary-foreground/80"
            >
              {day.label}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
