import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ff, fs, fmt } from "../../lib/constants";
import { ordersApi } from "../../api/orders";
import { ApiClientError } from "../../api/client";
import type { Order, OrderStatus } from "../../types";

const STATUSES: OrderStatus[] = ["Processing", "Shipped", "Received", "Delivered", "Cancelled"];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  function load() {
    if (!id) return;
    setLoading(true);
    ordersApi
      .get(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }

  useEffect(load, [id]);

  async function handleStatusChange(status: OrderStatus) {
    if (!id) return;
    setUpdating(true);
    setError("");
    try {
      const updated = await ordersApi.updateStatus(id, status);
      setOrder(updated);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not update status");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <div className="p-8 text-sm text-gray-400" style={ff}>Loading…</div>;
  if (!order) return <div className="p-8 text-sm text-red-500" style={ff}>Order not found.</div>;

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={() => navigate("/admin/orders")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 mb-6 transition-colors" style={ff}>
        ← Back to Orders
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900" style={ff}>{order.orderNumber}</h1>
          <p className="text-xs text-gray-400 mt-0.5" style={ff}>{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3" style={ff}>Customer</h2>
          <p className="text-sm text-gray-700" style={ff}>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
          <p className="text-xs text-gray-400 mt-1" style={ff}>{order.shippingAddress.email}</p>
          <p className="text-xs text-gray-400" style={ff}>{order.shippingAddress.phone}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3" style={ff}>Delivery Address</h2>
          <p className="text-sm text-gray-700" style={ff}>{order.shippingAddress.street}</p>
          <p className="text-xs text-gray-400 mt-1" style={ff}>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
        </div>
      </div>

      {order.requiresPrescription && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3" style={ff}>Prescription</h2>
          {order.prescriptionUrl ? (
            <a href={order.prescriptionUrl} target="_blank" rel="noreferrer" className="text-sm text-[#0c3f35] font-semibold hover:underline" style={ff}>
              View uploaded prescription
            </a>
          ) : (
            <p className="text-sm text-red-500" style={ff}>No prescription uploaded</p>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-5">
        <div className="px-5 py-3 border-b border-gray-50">
          <h2 className="text-sm font-bold text-gray-900" style={ff}>Items</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items.map((item, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900" style={ff}>{item.name} {item.rx && <span className="text-[#b4502a] text-xs font-bold ml-1">Rx</span>}</p>
                <p className="text-xs text-gray-400" style={ff}>Qty {item.quantity} × {fmt(item.price)}</p>
              </div>
              <p className="text-sm font-bold text-gray-900" style={ff}>{fmt(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-gray-50 space-y-1.5" style={ff}>
          <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
          <div className="flex justify-between text-sm text-gray-500"><span>Delivery</span><span>{order.deliveryFee === 0 ? "Free" : fmt(order.deliveryFee)}</span></div>
          <div className="flex justify-between text-sm font-bold text-gray-900 pt-1.5 border-t border-gray-50"><span>Total</span><span>{fmt(order.total)}</span></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-3" style={ff}>Update Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={updating || order.status === s}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${
                order.status === s ? "bg-[#0c3f35] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
              style={ff}
            >
              {s}
            </button>
          ))}
        </div>
        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
}
