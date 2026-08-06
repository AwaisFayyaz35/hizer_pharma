import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { AlertTriangle, Check, Upload } from "lucide-react";
import { ff, fs, fmt, FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE } from "../../lib/constants";
import { useCart } from "../../hooks/useCart";
import { ordersApi } from "../../api/orders";
import { uploadApi } from "../../api/upload";
import { ApiClientError } from "../../api/client";
import type { ShippingAddress } from "../../types";

export default function CheckoutPage() {
  const { cart, hasRx, clearCart } = useCart();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddress>();

  const [prescriptionUrl, setPrescriptionUrl] = useState<string | undefined>();
  const [uploadingRx, setUploadingRx] = useState(false);
  const [rxError, setRxError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ orderNumber: string; email: string } | null>(null);

  const subtotal = cart.reduce((s, i) => s + (i.product.discountPrice ?? i.product.price) * i.quantity, 0);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

  async function handlePrescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingRx(true);
    setRxError("");
    try {
      const result = await uploadApi.prescription(file);
      setPrescriptionUrl(result.url);
    } catch (err) {
      setRxError(err instanceof ApiClientError ? err.message : "Upload failed, please try again");
    } finally {
      setUploadingRx(false);
    }
  }

  async function onSubmit(shippingAddress: ShippingAddress) {
    if (hasRx && !prescriptionUrl) {
      setRxError("Please upload a valid prescription to continue");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const order = await ordersApi.place({
        items: cart.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
        shippingAddress,
        prescriptionUrl,
      });
      setConfirmedOrder({ orderNumber: order.orderNumber, email: shippingAddress.email });
      clearCart();
    } catch (err) {
      setSubmitError(err instanceof ApiClientError ? err.message : "Could not place order, please try again");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-[#28a869]/12 rounded-full flex items-center justify-center mx-auto mb-5">
          <Check size={26} className="text-[#28a869]" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold text-[#0c1a16] mb-2" style={fs}>Order Placed!</h2>
        <p className="text-sm text-[#0c1a16]/55 mb-1" style={ff}>
          Order <span className="font-semibold text-[#0c1a16]">{confirmedOrder.orderNumber}</span> confirmed.
        </p>
        <p className="text-xs text-[#0c1a16]/40 mb-8" style={ff}>
          Save your order number — you'll need it with your email or phone to track this order.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() =>
              navigate(`/orders/track?orderNumber=${encodeURIComponent(confirmedOrder.orderNumber)}&contact=${encodeURIComponent(confirmedOrder.email)}`)
            }
            className="px-6 py-3 bg-[#0c3f35] text-white rounded-xl font-semibold"
            style={ff}
          >
            Track Order
          </button>
          <button onClick={() => navigate("/")} className="px-6 py-3 border border-[#0c3f35]/15 rounded-xl font-semibold text-[#0c1a16]/65" style={ff}>
            Home
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <p className="text-[#0c1a16]/45 mb-6" style={ff}>Your cart is empty.</p>
        <button onClick={() => navigate("/shop")} className="px-8 py-3 bg-[#0c3f35] text-white rounded-xl font-semibold" style={ff}>
          Shop Products
        </button>
      </div>
    );
  }

  return (
    <form className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl font-bold text-[#0c1a16] mb-8" style={fs}>Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-5">
          {/* Info */}
          <div className="bg-white rounded-2xl border border-[#0c3f35]/8 p-6">
            <h2 className="font-bold text-[#0c1a16] mb-4" style={ff}>Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  placeholder="First Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
                  style={ff}
                  {...register("firstName", { required: true })}
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">First name is required</p>}
              </div>
              <div>
                <input
                  placeholder="Last Name"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
                  style={ff}
                  {...register("lastName", { required: true })}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">Last name is required</p>}
              </div>
              <div className="sm:col-span-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
                  style={ff}
                  {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">A valid email is required</p>}
              </div>
              <div className="sm:col-span-2">
                <input
                  placeholder="Phone Number"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
                  style={ff}
                  {...register("phone", { required: true })}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">Phone number is required</p>}
              </div>
            </div>
          </div>
          {/* Address */}
          <div className="bg-white rounded-2xl border border-[#0c3f35]/8 p-6">
            <h2 className="font-bold text-[#0c1a16] mb-4" style={ff}>Delivery Address</h2>
            <div className="space-y-3">
              <div>
                <input
                  placeholder="Street Address"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
                  style={ff}
                  {...register("street", { required: true })}
                />
                {errors.street && <p className="text-xs text-red-500 mt-1">Street address is required</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    placeholder="City"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
                    style={ff}
                    {...register("city", { required: true })}
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">City is required</p>}
                </div>
                <div>
                  <input
                    placeholder="Province"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f8f9fa] border border-[#0c3f35]/8 text-sm focus:outline-none focus:ring-2 focus:ring-[#28a869]/25"
                    style={ff}
                    {...register("province", { required: true })}
                  />
                  {errors.province && <p className="text-xs text-red-500 mt-1">Province is required</p>}
                </div>
              </div>
            </div>
          </div>
          {/* Payment */}
          <div className="bg-white rounded-2xl border border-[#0c3f35]/8 p-6">
            <h2 className="font-bold text-[#0c1a16] mb-4" style={ff}>Payment Method</h2>
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#0c3f35] bg-[#0c3f35]/3">
              <input type="radio" checked readOnly className="accent-[#0c3f35]" />
              <span className="text-lg">💵</span>
              <span className="text-sm font-medium text-[#0c1a16]" style={ff}>Cash on Delivery</span>
            </label>
          </div>
          {/* RX Upload */}
          {hasRx && (
            <div className="bg-[#b4502a]/5 border border-[#b4502a]/18 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={15} className="text-[#b4502a]" />
                <h2 className="font-bold text-[#b4502a] text-sm" style={ff}>Prescription Upload Required</h2>
              </div>
              <p className="text-xs text-[#b4502a]/70 mb-4 leading-relaxed" style={ff}>
                Your cart contains prescription-required items. Upload a valid prescription to proceed.
              </p>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#b4502a]/25 rounded-xl p-6 cursor-pointer hover:bg-[#b4502a]/5 transition-colors">
                {prescriptionUrl ? (
                  <>
                    <Check size={18} className="text-[#28a869]" />
                    <span className="text-sm text-[#28a869] font-semibold" style={ff}>Prescription uploaded</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} className="text-[#b4502a]/55" />
                    <span className="text-sm text-[#b4502a]/70 font-semibold" style={ff}>
                      {uploadingRx ? "Uploading…" : "Upload Prescription"}
                    </span>
                    <span className="text-xs text-[#b4502a]/40" style={ff}>JPG, PNG, or PDF · max 10 MB</span>
                  </>
                )}
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handlePrescriptionChange} disabled={uploadingRx} />
              </label>
              {rxError && <p className="text-xs text-red-500 mt-2">{rxError}</p>}
            </div>
          )}
        </div>
        <div>
          <div className="bg-white rounded-2xl border border-[#0c3f35]/8 p-6 lg:sticky lg:top-24">
            <h2 className="font-bold text-[#0c1a16] mb-4" style={ff}>Order Summary</h2>
            <div className="text-sm space-y-2.5 mb-5" style={ff}>
              <div className="flex justify-between text-[#0c1a16]/55"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="flex justify-between text-[#0c1a16]/55">
                <span>Delivery</span>
                <span>{delivery === 0 ? <span className="text-[#28a869] font-medium">Free</span> : fmt(delivery)}</span>
              </div>
              <div className="border-t border-[#0c3f35]/8 pt-3 flex justify-between font-bold text-[#0c1a16] text-base">
                <span>Total</span><span>{fmt(subtotal + delivery)}</span>
              </div>
            </div>
            {submitError && <p className="text-xs text-red-500 mb-3">{submitError}</p>}
            <button
              type="submit"
              disabled={submitting || uploadingRx}
              className="w-full py-4 bg-[#0c3f35] text-white rounded-xl font-bold hover:bg-[#0c3f35]/88 active:scale-[0.98] transition-all shadow-md shadow-[#0c3f35]/15 disabled:opacity-60"
              style={ff}
            >
              {submitting ? "Placing Order…" : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
