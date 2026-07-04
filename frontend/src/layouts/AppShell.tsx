import Sidebar from "@/components/SideBar";
import { DashboardData } from "@/constants/dashboard-layout.constant";
import { Outlet, useLocation, useNavigate } from "react-router";

export default function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        title={DashboardData.sideNavTitle}
        subtitle={DashboardData.sideNavSubtitle}
        navItems={DashboardData.sideNavItems}
        activeHref={pathname}
        ctaLabel={DashboardData.sideNavCtaLabel}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-2 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
