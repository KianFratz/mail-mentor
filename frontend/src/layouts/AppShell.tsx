import Sidebar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import { sampleDashboardData } from "@/constants/dashboard-layout.constant";
import { Outlet, useLocation, useNavigate } from "react-router";

export default function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        title={sampleDashboardData.sideNavTitle}
        subtitle={sampleDashboardData.sideNavSubtitle}
        navItems={sampleDashboardData.sideNavItems}
        activeHref={pathname}
        ctaLabel={sampleDashboardData.sideNavCtaLabel}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-2 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
