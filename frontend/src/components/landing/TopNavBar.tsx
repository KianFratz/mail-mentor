import { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { primaryChallengeLabel } from "./landing.constants";

const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Scenarios", href: "#scenarios" },
  { label: "Pricing", href: "#pricing" },
];

export function TopNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <Link
          to="/"
          className="rounded-sm text-xl font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={closeMenu}
        >
          Mail Mentor
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-sm text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="#challenge"
            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {primaryChallengeLabel}
          </a>
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Create account
          </Link>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="grid gap-1 border-t border-border bg-background px-4 py-3 md:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#challenge"
            className="rounded-lg bg-primary px-3 py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={closeMenu}
          >
            {primaryChallengeLabel}
          </a>
          <Link
            to="/login"
            className="rounded-lg px-3 py-3 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={closeMenu}
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-primary px-3 py-3 text-center text-sm font-semibold text-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={closeMenu}
          >
            Create account
          </Link>
        </nav>
      )}
    </header>
  );
}
