export interface SideNavBarProps {
  title: string;
  subtitle: string;
  navItems: NavItem[];
  activeHref: string;
  ctaLabel: string;
  onCtaClick?: () => void;
}

export interface NavItem {
  label: string;
  icon: string;
  href: string;
}