import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Users,
  Star,
} from "lucide-react";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminLayout() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
      <aside>
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink-soft mb-3">
          Admin
        </p>
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 text-sm rounded-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-ink text-paper"
                    : "text-ink-soft hover:bg-paper-raised hover:text-ink"
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
