import { useState } from "react";
import { useSearchParams } from "react-router";
import { Check, Circle, Search } from "lucide-react";
import { ff, fs, fmt } from "../../lib/constants";
import { ordersApi } from "../../api/orders";
import { ApiClientError } from "../../api/client";
import type { Order, OrderStatus } from "../../types";

const TIMELINE_STEPS: OrderStatus[] = ["Processing", "Shipped", "Received", "Delivered"];

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [contact, setContact] = useState(searchParams.get("contact") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    if (!orderNumber || !contact) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const result = await ordersApi.track(orderNumber, contact);
      setOrder(result);
    } catch (err) {
      setOrder(null);
      setError(err instanceof ApiClientError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-[#0c1a16] mb-1" style={fs}>Order Tracking</h1>
      <p className="text-[#0c1a16]/45 mb-8 text-sm" style={ff}>
        Enter your order number and the email or phone used at checkout.
      </p>

      <form onSubmit={lookup} className="bg-white rounded-2xl border border-[#0c3f35]/8 p-6 mb-6 space-y-3">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order Number (e.g. #HZ-2024-001)"
          className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
          style={ff}
        />
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Email or Phone used at checkout"
          className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
          style={ff}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#0c3f35] text-white rounded-xl font-semibold hover:bg-[#0c3f35]/88 active:scale-[0.98] transition-all disabled:opacity-60"
          style={ff}
        >
          <Search size={15} />
          {loading ? "Searching…" : "Track Order"}
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </form>

      {order && (
        <div className="bg-white rounded-2xl border border-[#0c3f35]/8 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-bold text-[#0c1a16]" style={ff}>{order.orderNumber}</p>
              <p className="text-xs text-[#0c1a16]/45" style={ff}>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName} · {fmt(order.total)}
              </p>
            </div>
          </div>

          {order.status === "Cancelled" ? (
            <p className="text-sm font-semibold text-red-600" style={ff}>This order was cancelled.</p>
          ) : (
            <div className="relative">
              <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-[#0c3f35]/8" />
              <div className="space-y-9">
                {TIMELINE_STEPS.map((step) => {
                  const historyEntry = order.statusHistory.find((h) => h.status === step);
                  const currentIndex = TIMELINE_STEPS.indexOf(order.status as OrderStatus);
                  const stepIndex = TIMELINE_STEPS.indexOf(step);
                  const done = stepIndex <= currentIndex;
                  return (
                    <div key={step} className="flex items-start gap-5 relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-all ${
                          done ? "bg-[#28a869] border-[#28a869] shadow-md shadow-[#28a869]/25" : "bg-white border-[#0c3f35]/15"
                        }`}
                      >
                        {done ? <Check size={15} className="text-white" strokeWidth={2.5} /> : <Circle size={14} className="text-[#0c1a16]/20" />}
                      </div>
                      <div className="pt-1.5">
                        <p className={`text-sm font-bold ${done ? "text-[#0c1a16]" : "text-[#0c1a16]/35"}`} style={ff}>
                          {step === "Received" ? "Out for Delivery" : step === "Processing" ? "Order Received" : step}
                        </p>
                        <p className="text-xs text-[#0c1a16]/40 mt-0.5" style={ff}>
                          {historyEntry ? new Date(historyEntry.changedAt).toLocaleString() : "Pending"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {searched && !order && !loading && !error && (
        <p className="text-sm text-[#0c1a16]/40 text-center" style={ff}>No order found.</p>
      )}
    </div>
  );
}
