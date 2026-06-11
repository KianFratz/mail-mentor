import Sidebar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import { Outlet } from "react-router";

export default function AppShell() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar/>
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}