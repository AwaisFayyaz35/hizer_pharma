import { NavLink } from "react-router";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  FileText,
  Users,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";
import { ff, fs } from "../../lib/constants";
import { useAuth } from "../../hooks/useAuth";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { to: "/admin/products", label: "Products", icon: <ShoppingBag size={16} /> },
  { to: "/admin/categories", label: "Categories", icon: <Tag size={16} /> },
  { to: "/admin/orders", label: "Orders", icon: <FileText size={16} /> },
  { to: "/admin/customers", label: "Customers", icon: <Users size={16} /> },
  { to: "/admin/messages", label: "Messages", icon: <Mail size={16} /> },
  { to: "/admin/settings", label: "Settings", icon: <Settings size={16} /> },
];

export function AdminSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <span className="text-[17px] font-bold text-[#0c3f35]" style={fs}>Hi-Zer</span>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5" style={ff}>
          Admin Dashboard
        </p>
      </div>
      <nav className="flex-1 p-2.5 space-y-0.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? "bg-[#0c3f35] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            style={ff}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-2.5 border-t border-gray-100">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
          style={ff}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
