import type { NavItem } from "@/types/side-bar.type";

interface TopNavBarProps {
  navItems: NavItem[];
  activeHref: string;
  onProfileCheck?: () => void;
}

export default function TopBar({
  navItems,
  activeHref,
  onProfileCheck,
}: TopNavBarProps) {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-14 bg-white border-b border-border shadow-xs">
      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = item.href === activeHref;
            return (
              <a
                key={item.href}
                href={item.href}
                className={
                  "relative px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 " +
                  (isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60")
                }
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-4/5 h-0.5 bg-primary rounded-full" />
                )}
              </a>
            );
          })}
        </nav>
      </div>

      <button
        onClick={onProfileCheck}
        aria-label="Profile"
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
      >
        <span className="material-symbols-outlined text-xl leading-none">
          account_circle
        </span>
      </button>
    </header>
  );
}
