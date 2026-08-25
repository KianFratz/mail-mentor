export const colorMap = {
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  green: "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
};

export const levelColorMap: Record<
  string,
  { badge: string; dot: string; label: string }
> = {
  beginner: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    dot: "bg-emerald-500",
    label: "Beginner",
  },
  intermediate: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200/80",
    dot: "bg-amber-500",
    label: "Intermediate",
  },
  advanced: {
    badge: "bg-rose-50 text-rose-700 border border-rose-200/80",
    dot: "bg-rose-500",
    label: "Advanced",
  },
  hard: {
    badge: "bg-rose-50 text-rose-700 border border-rose-200/80",
    dot: "bg-rose-500",
    label: "Hard",
  },
};