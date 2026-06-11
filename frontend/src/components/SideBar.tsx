import { NavLink } from "react-router";

const nav = [
  { label: "Dashboard", to: "/dashboard", icon: "🏠" },
  { label: "Reports", to: "/reports", icon: "📊" },
  { label: "Settings", to: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-w-56 h-screen flex flex-col border-r border-gray-200 bg-white">
      <div className="px-6 py-5 text-lg font-semibold border-b border-gray-200">
        My app
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
               ${
                 isActive
                   ? "bg-blue-50 text-blue-600 font-medium"
                   : "text-gray-600 hover:bg-gray-100"
               }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 text-sm text-gray-500">
        Kian
      </div>
    </aside>
  );
}
