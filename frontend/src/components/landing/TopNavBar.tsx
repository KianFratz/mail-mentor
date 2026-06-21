import { Link } from "react-router";
import { Button } from "../ui/button";
import { Mail } from "lucide-react";
import type { NavItem } from "@/types/side-bar";

interface TopNavBarProps {
  brandName: string;
  navItems: NavItem[];
  activeHref: string;
  onProfileClick?: () => void;
}

export function TopNavBar({
  brandName,
  navItems,
  activeHref,
  onProfileClick,
}: TopNavBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-background shadow-sm border-b border-border">
      <div className="flex items-center gap-2">
        <Mail size={22.5} className="text-primary" />
        <span className="font-bold text-xl text-primary">Mail Mentor</span>
      </div>
      <nav className="hidden md:flex items-center gap-8"></nav>
      <div className="flex items-center gap-2">
        <Button className="p-4 rounded-md hover:bg-primary hover:text-white bg-muted text-primary">
          <Link to="/login">
            <span>Login</span>
          </Link>
        </Button>
        <Button className="p-4 rounded-md hover:bg-primary hover:text-white bg-muted text-primary">
          <Link to="/login">
            <span>Register</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
