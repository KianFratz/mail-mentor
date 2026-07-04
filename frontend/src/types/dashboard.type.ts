import type { NavItem } from "./side-bar.type";

export interface SkillProficiency {
  name: string;
  percentage: number; // 0-100
}

export interface RecentScore {
  id: string;
  icon: string;
  title: string;
  date: string;
  score: number;
}

export type BadgeVariant = "tertiary" | "secondary";

export interface EarnedBadge {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  variant: BadgeVariant;
}

export interface LockedBadgeProgress {
  title: string;
  progressPercentage: number; // 0-100
}

export interface WeekDay {
  label: string; // e.g. "M", "T", or a checkmark day
  completed: boolean;
}

export interface AISuggestion {
  eyebrow: string;
  message: string;
  ctaLabel: string;
  onCtaClick?: () => void;
}

export interface DashboardDataProps {
  userName: string;
  subtitle: string;
  activeNavHref: string;
  sideNavTitle: string;
  sideNavSubtitle: string;
  sideNavItems: NavItem[];
  activeSideNavHref: string;
  sideNavCtaLabel: string;
  onSideNavCtaClick?: () => void;
  overallScore: number;
  skills: SkillProficiency[];
  streakDays: number;
  streakMessage: string;
  weekDays: WeekDay[];
  recentScores: RecentScore[];
  onViewAllScores?: () => void;
  earnedBadges: EarnedBadge[];
  lockedBadge?: LockedBadgeProgress;
  aiSuggestion: AISuggestion;
  mobileNavItems: NavItem[];
  activeMobileNavHref: string;
  onProfileClick?: () => void;
}
