import api from "@/lib/axios";
import type { SideNavBarProps } from "@/types/side-bar.type";
import { useAuth } from "@/context/AuthContext";

export default function SideNavbar({
  title,
  subtitle,
  navItems,
  activeHref,
  ctaLabel,
}: SideNavBarProps) {
  const { logout } = useAuth();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      logout();
    }
  };

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 bg-white border-r border-border py-6 px-3 gap-6 shrink-0">
      <div className="px-3">
        <h2 className="text-sm font-bold text-foreground leading-tight">
          {title}
        </h2>
        <p className="text-xs text-primary font-medium mt-0.5">{subtitle}</p>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => {
          const isActive = item.href === activeHref;
          return (
            <a
              key={item.href}
              href={item.href}
              className={
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 " +
                (isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground")
              }
            >
              <span
                className="material-symbols-outlined text-[18px] leading-none shrink-0"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="px-1">
        <button
          onClick={handleLogout}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-sm"
        >
          {ctaLabel}
        </button>
      </div>
    </aside>
  );
}
