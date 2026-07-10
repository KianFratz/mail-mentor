import type { IssueSeverity } from "@/types/feedback.type";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export const STATUS_ICON: Record<IssueSeverity, typeof CheckCircle2> = {
  minor: CheckCircle2,
  moderate: AlertTriangle,
  major: XCircle,
};

export const STATUS_ICON_CLASS: Record<IssueSeverity, string> = {
  minor: "text-emerald-500",
  moderate: "text-amber-500",
  major: "text-red-500",
};

export const STATUS_BAR_CLASS: Record<IssueSeverity, string> = {
  minor: "[&>div]:bg-emerald-500",
  moderate: "[&>div]:bg-amber-500",
  major: "[&>div]:bg-red-500",
};

export const SEVERITY_META: Record<IssueSeverity, { label: string; dot: string; badge: string }> = {
  major: { label: "MAJOR", dot: "bg-red-500", badge: "text-red-600 dark:text-red-400" },
  moderate: { label: "MODERATE", dot: "bg-red-500", badge: "text-red-600 dark:text-red-400" },
  minor: { label: "MINOR", dot: "bg-amber-500", badge: "text-amber-600 dark:text-amber-400" },
};

export const STATUS_COLOR: Record<string, string> = {
  good: "stroke-emerald-500",
  warning: "stroke-amber-500",
  bad: "stroke-red-500",
};