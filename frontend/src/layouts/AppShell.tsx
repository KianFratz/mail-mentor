import Sidebar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import { sampleDashboardData } from "@/constants/dashboard-mock-data";
import { Outlet, useLocation, useNavigate } from "react-router";

export default function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        title={sampleDashboardData.sideNavTitle}
        subtitle={sampleDashboardData.sideNavSubtitle}
        navItems={sampleDashboardData.sideNavItems}
        activeHref={pathname}
        ctaLabel={sampleDashboardData.sideNavCtaLabel}
        onCtaClick={sampleDashboardData.onSideNavCtaClick}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          navItems={sampleDashboardData.navItems}
          activeHref={pathname}
          onProfileCheck={() => navigate("/settings")}
        />
        <main className="flex-1 overflow-y-auto px-6 py-2 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}