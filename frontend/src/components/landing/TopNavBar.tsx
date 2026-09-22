import { Link } from "react-router";
import { Button } from "../ui/button";
import { Mail } from "lucide-react";
import type { NavItem } from "@/types/side-bar.type";

interface TopNavBarProps {
  brandName?: string;
  navItems?: NavItem[];
  activeHref?: string;
  onProfileClick?: () => void;
}

export function TopNavBar({
  brandName = "Mail Mentor",
  navItems = [],
  activeHref = "",
  onProfileClick,
}: TopNavBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-background shadow-sm border-b border-border">
      <div className="flex items-center gap-2">
        <Mail size={22.5} className="text-primary" />
        <span className="font-bold text-xl text-primary">{brandName}</span>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={
              activeHref === item.href
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-primary"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        {onProfileClick && (
          <Button
            type="button"
            onClick={onProfileClick}
            className="p-4 rounded-md hover:bg-primary hover:text-white bg-muted text-primary"
          >
            Profile
          </Button>
        )}
        <Button
          asChild
          className="p-4 rounded-md hover:bg-primary hover:text-white bg-muted text-primary"
        >
          <Link to="/login">
            <span>Login</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
