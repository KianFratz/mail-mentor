import type { EarnedBadge } from "@/types/dashboard-type";

const VARIANT_STYLES: Record<
  EarnedBadge["variant"],
  { card: string; iconBg: string; iconText: string }
> = {
  tertiary: {
    card: "bg-accent/10 border border-accent/20",
    iconBg: "bg-accent",
    iconText: "text-accent-foreground",
  },
  secondary: {
    card: "bg-success/10 border border-success/20",
    iconBg: "bg-success",
    iconText: "text-success-foreground",
  },
};

export default function BadgeItem({
  icon,
  title,
  subtitle,
  variant,
}: EarnedBadge) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-200 hover:scale-[1.03] hover:shadow-md cursor-default ${styles.card}`}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-sm ${styles.iconBg}`}
      >
        <span
          className={`material-symbols-outlined text-2xl leading-none ${styles.iconText}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <p className="text-sm font-semibold text-foreground leading-tight">
        {title}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
  );
}
