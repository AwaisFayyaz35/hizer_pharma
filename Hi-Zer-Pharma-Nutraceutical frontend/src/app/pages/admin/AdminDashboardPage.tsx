import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AlertTriangle, FileText, ShoppingBag, TrendingUp } from "lucide-react";
import { StatWidget } from "../../components/admin/StatWidget";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ff, fmt } from "../../lib/constants";
import { dashboardApi } from "../../api/dashboard";
import type { DashboardStats } from "../../types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .stats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-sm text-gray-400" style={ff}>Loading dashboard…</div>;
  }
  if (!stats) {
    return <div className="p-8 text-sm text-red-500" style={ff}>Could not load dashboard stats.</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-900" style={ff}>Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5" style={ff}>
          {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatWidget label="Total Orders" value={String(stats.totalOrders)} icon={<FileText size={16} />} colorClass="text-blue-600 bg-blue-50" />
        <StatWidget label="Revenue" value={fmt(stats.revenue)} icon={<TrendingUp size={16} />} colorClass="text-emerald-600 bg-emerald-50" />
        <StatWidget label="Products" value={String(stats.totalProducts)} icon={<ShoppingBag size={16} />} colorClass="text-teal-600 bg-teal-50" />
        <StatWidget label="Low Stock Alerts" value={String(stats.lowStockCount)} sub={stats.lowStockCount > 0 ? "Needs attention" : undefined} icon={<AlertTriangle size={16} />} colorClass="text-orange-600 bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-sm" style={ff}>Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-[#0c3f35] font-semibold" style={ff}>View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.length === 0 && (
              <p className="px-5 py-6 text-sm text-gray-400" style={ff}>No orders yet.</p>
            )}
            {stats.recentOrders.map((o) => (
              <Link key={o._id} to={`/admin/orders/${o._id}`} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate" style={ff}>
                    {o.shippingAddress.firstName} {o.shippingAddress.lastName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5" style={ff}>{o.orderNumber} · {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <p className="text-sm font-bold text-gray-900" style={ff}>{fmt(o.total)}</p>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900 text-sm" style={ff}>Low Stock Products</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.lowStockProducts.length === 0 && (
              <p className="px-5 py-6 text-sm text-gray-400" style={ff}>All products are well stocked.</p>
            )}
            {stats.lowStockProducts.map((p) => {
              const categoryName = typeof p.category === "string" ? p.category : p.category?.name;
              const imageUrl = p.images?.[0]?.url;
              return (
                <div key={p._id} className="px-5 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0">
                    {imageUrl && <img src={imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate" style={ff}>{p.name}</p>
                    <p className="text-xs text-gray-400" style={ff}>{categoryName}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      p.stock === 0 ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                    }`}
                    style={ff}
                  >
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
