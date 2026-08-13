import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Search } from "lucide-react";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ff, fmt } from "../../lib/constants";
import { useDebounce } from "../../hooks/useDebounce";
import { ordersApi } from "../../api/orders";
import type { Order, OrderStatus } from "../../types";

const STATUS_FILTERS: (OrderStatus | "All")[] = [
  "All",
  "Payment Verification Pending",
  "Processing",
  "Shipped",
  "Received",
  "Delivered",
  "Cancelled",
  "Payment Rejected",
];

export default function AdminOrdersPage() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const [status, setStatus] = useState<OrderStatus | "All">("All");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ordersApi
      .list({ search: debouncedQ || undefined, status })
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [debouncedQ, status]);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6" style={ff}>Orders</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
            style={ff}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus | "All")}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
          style={ff}
        >
          {STATUS_FILTERS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/60">
                {["Order ID", "Customer", "Amount", "Items", "Status", "Date", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider" style={ff}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {!loading && orders.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400" style={ff}>No orders found.</td></tr>
              )}
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-mono text-gray-500 text-xs">{o.orderNumber}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-gray-900" style={ff}>
                    {o.shippingAddress.firstName} {o.shippingAddress.lastName}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold text-gray-900" style={ff}>{fmt(o.total)}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500" style={ff}>{o.items.length}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3.5 text-sm text-gray-400" style={ff}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <Link to={`/admin/orders/${o._id}`} className="text-xs text-[#0c3f35] font-bold hover:underline" style={ff}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
