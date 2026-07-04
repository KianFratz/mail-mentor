import type { DashboardDataProps } from "@/types/dashboard.type";

export const DashboardData: DashboardDataProps = {
  userName: "Alex",
  subtitle:
    "Your communication mastery is evolving. Here is your current performance snapshot.",

  activeNavHref: "/dashboard",
  onProfileClick: () => console.log("Profile clicked"),

  sideNavTitle: "Mail Mentor",
  sideNavSubtitle: "AI-Powered Coaching",
  sideNavItems: [
    { label: "Dashboard", icon: "home", href: "/dashboard" },
    { label: "Scenarios", icon: "library_books", href: "/scenarios" },
    { label: "Conversation", icon: "chat", href: "/conversation" },
    { label: "Draft", icon: "draft", href: "/draft" },
    { label: "Progress", icon: "area_chart", href: "/progress" },
    { label: "Settings", icon: "settings", href: "/settings" },
  ],
  activeSideNavHref: "/drafting",
  sideNavCtaLabel: "Logout",

  overallScore: 79,
  skills: [
    { name: "Grammar", percentage: 85 },
    { name: "Tone", percentage: 72 },
    { name: "Clarity", percentage: 88 },
    { name: "Structure", percentage: 80 },
    { name: "Etiquette", percentage: 69 },
  ],

  streakDays: 12,
  streakMessage: "You're in the top 5% of active learners this month!",
  weekDays: [
    { label: "", completed: true },
    { label: "", completed: true },
    { label: "", completed: true },
    { label: "M", completed: false },
    { label: "T", completed: false },
  ],

  recentScores: [
    {
      id: "1",
      icon: "mail",
      title: "Negotiation Email",
      date: "Oct 24, 2023",
      score: 92,
    },
    {
      id: "2",
      icon: "campaign",
      title: "Crisis Response",
      date: "Oct 22, 2023",
      score: 88,
    },
    {
      id: "3",
      icon: "groups",
      title: "Meeting Follow-up",
      date: "Oct 20, 2023",
      score: 76,
    },
  ],
  onViewAllScores: () => console.log("View All clicked"),

  earnedBadges: [
    {
      id: "1",
      icon: "psychology",
      title: "Tone Master",
      subtitle: "Emotional Resonance",
      variant: "tertiary",
    },
    {
      id: "2",
      icon: "verified",
      title: "Grammar Expert",
      subtitle: "Perfect Syntax",
      variant: "secondary",
    },
  ],
  lockedBadge: { title: "Conciseness King", progressPercentage: 66 },

  aiSuggestion: {
    eyebrow: "AI Suggestion",
    message:
      'Your Etiquette score is currently your biggest growth opportunity. Try the "Managing Up" scenario to practice professional deference.',
    ctaLabel: "Try Now",
    onCtaClick: () => console.log("Try Now clicked"),
  },

  mobileNavItems: [
    { label: "Home", icon: "dashboard", href: "/dashboard" },
    { label: "Scenarios", icon: "explore", href: "/scenarios" },
    { label: "Stats", icon: "trending_up", href: "/stats" },
    { label: "Profile", icon: "person", href: "/profile" },
  ],
  activeMobileNavHref: "/dashboard",
};
