import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { StatusBadge } from "../../components/common/StatusBadge";
import { ff, fmt } from "../../lib/constants";
import { ordersApi } from "../../api/orders";
import { ApiClientError } from "../../api/client";
import type { Order, OrderStatus } from "../../types";

const STATUSES: OrderStatus[] = ["Processing", "Shipped", "Received", "Delivered", "Cancelled"];

const PAYMENT_STATUS_MAP: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

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

  async function handleApprovePayment() {
    if (!id) return;
    setVerifying(true);
    setPaymentError("");
    try {
      const updated = await ordersApi.approvePayment(id);
      setOrder(updated);
    } catch (err) {
      setPaymentError(err instanceof ApiClientError ? err.message : "Could not approve payment");
    } finally {
      setVerifying(false);
    }
  }

  async function handleRejectPayment() {
    if (!id) return;
    setVerifying(true);
    setPaymentError("");
    try {
      const updated = await ordersApi.rejectPayment(id, rejectNote || undefined);
      setOrder(updated);
      setShowRejectForm(false);
      setRejectNote("");
    } catch (err) {
      setPaymentError(err instanceof ApiClientError ? err.message : "Could not reject payment");
    } finally {
      setVerifying(false);
    }
  }

  if (loading) return <div className="p-8 text-sm text-gray-400" style={ff}>Loading…</div>;
  if (!order) return <div className="p-8 text-sm text-red-500" style={ff}>Order not found.</div>;

  const paymentApproved = order.paymentStatus === "approved";

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

      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900" style={ff}>
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer Payment"}
          </h2>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${PAYMENT_STATUS_MAP[order.paymentStatus] ?? PAYMENT_STATUS_MAP.pending}`}
            style={ff}
          >
            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
          </span>
        </div>
        {order.paymentDetails ? (
          <>
            <p className="text-sm text-gray-700 mb-1" style={ff}>
              Transaction ID: <span className="font-mono font-semibold">{order.paymentDetails.transactionId}</span>
            </p>
            <div className="mt-3">
              {order.paymentDetails.screenshotUrl ? (
                <a href={order.paymentDetails.screenshotUrl} target="_blank" rel="noreferrer">
                  <img
                    src={order.paymentDetails.screenshotUrl}
                    alt="Payment screenshot"
                    className="w-40 h-40 object-cover rounded-lg border border-gray-100"
                  />
                </a>
              ) : (
                <p className="text-sm text-gray-400" style={ff}>
                  Screenshot no longer available{order.paymentDetails.screenshotDeletedAt && " (auto-deleted after verification)"}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400" style={ff}>No bank transfer details on file for this order.</p>
        )}

        {order.paymentStatus === "pending" && (
          <div className="mt-4 pt-4 border-t border-gray-50">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleApprovePayment}
                disabled={verifying}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-[#28a869] text-white hover:bg-[#28a869]/88 disabled:opacity-50 transition-colors"
                style={ff}
              >
                <CheckCircle2 size={14} /> Approve Payment
              </button>
              <button
                type="button"
                onClick={() => setShowRejectForm((v) => !v)}
                disabled={verifying}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
                style={ff}
              >
                <XCircle size={14} /> Reject Payment
              </button>
            </div>
            {showRejectForm && (
              <div className="mt-3 flex flex-col sm:flex-row gap-2">
                <input
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Reason for rejection (optional)"
                  className="flex-1 px-3.5 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
                  style={ff}
                />
                <button
                  type="button"
                  onClick={handleRejectPayment}
                  disabled={verifying}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  style={ff}
                >
                  Confirm Reject
                </button>
              </div>
            )}
            {paymentError && <p className="text-xs text-red-500 mt-2">{paymentError}</p>}
          </div>
        )}
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
        {!paymentApproved && (
          <p className="text-xs text-amber-600 mb-3" style={ff}>
            Shipping statuses are locked until payment is approved.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => {
            const shippingStatus = s !== "Cancelled";
            const disabled = updating || order.status === s || (shippingStatus && !paymentApproved);
            return (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={disabled}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 ${
                  order.status === s ? "bg-[#0c3f35] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                style={ff}
              >
                {s}
              </button>
            );
          })}
        </div>
        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
}
