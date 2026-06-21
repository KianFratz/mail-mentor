export interface SideNavBarProps {
  title: string;
  subtitle: string;
  navItems: NavItem[];
  activeHref: string;
  ctaLabel: string;
}

export interface NavItem {
  label: string;
  icon: string;
  href: string;
}