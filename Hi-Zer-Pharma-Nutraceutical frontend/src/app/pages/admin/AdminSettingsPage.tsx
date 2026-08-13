import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Landmark, Truck, UserPlus } from "lucide-react";
import { ff } from "../../lib/constants";
import { authApi } from "../../api/auth";
import { settingsApi } from "../../api/settings";
import { uploadApi } from "../../api/upload";
import { ApiClientError } from "../../api/client";

interface NewAdminForm {
  name: string;
  email: string;
  password: string;
}

interface PaymentSettingsForm {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
}

interface DeliverySettingsForm {
  deliveryFee: number;
}

export default function AdminSettingsPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewAdminForm>();
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    reset: resetPayment,
    formState: { errors: paymentErrors },
  } = useForm<PaymentSettingsForm>();
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [qrCode, setQrCode] = useState<{ url: string; publicId: string } | null>(null);
  const [uploadingQr, setUploadingQr] = useState(false);

  const {
    register: registerDelivery,
    handleSubmit: handleDeliverySubmit,
    reset: resetDelivery,
    formState: { errors: deliveryErrors },
  } = useForm<DeliverySettingsForm>();
  const [deliveryStatus, setDeliveryStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [deliveryError, setDeliveryError] = useState("");
  const [deliverySuccess, setDeliverySuccess] = useState("");

  useEffect(() => {
    settingsApi
      .get()
      .then((s) => {
        resetPayment({
          bankName: s.bankName,
          accountTitle: s.accountTitle,
          accountNumber: s.accountNumber,
          iban: s.iban,
        });
        resetDelivery({ deliveryFee: s.deliveryFee });
        if (s.qrCodeImage) setQrCode(s.qrCodeImage);
        setPaymentStatus("idle");
        setDeliveryStatus("idle");
      })
      .catch(() => {
        setPaymentStatus("error");
        setDeliveryStatus("error");
      });
  }, [resetPayment, resetDelivery]);

  async function onSubmit(data: NewAdminForm) {
    setStatus("saving");
    setError("");
    setSuccess("");
    try {
      await authApi.createAdmin(data.name, data.email, data.password);
      setSuccess(`Admin account created for ${data.email}`);
      reset();
      setStatus("idle");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not create account");
      setStatus("error");
    }
  }

  async function handleQrChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingQr(true);
    setPaymentError("");
    try {
      const result = await uploadApi.qrCode(file);
      setQrCode({ url: result.url, publicId: result.publicId });
    } catch (err) {
      setPaymentError(err instanceof ApiClientError ? err.message : "QR code upload failed");
    } finally {
      setUploadingQr(false);
    }
  }

  async function onPaymentSubmit(data: PaymentSettingsForm) {
    setPaymentStatus("saving");
    setPaymentError("");
    setPaymentSuccess("");
    try {
      const updated = await settingsApi.update({
        bankName: data.bankName,
        accountTitle: data.accountTitle,
        accountNumber: data.accountNumber,
        iban: data.iban,
        ...(qrCode ? { qrCodeImage: qrCode } : {}),
      });
      setPaymentSuccess("Bank transfer details updated");
      setQrCode(updated.qrCodeImage ?? null);
      setPaymentStatus("idle");
    } catch (err) {
      setPaymentError(err instanceof ApiClientError ? err.message : "Could not save bank details");
      setPaymentStatus("error");
    }
  }

  async function onDeliverySubmit(data: DeliverySettingsForm) {
    setDeliveryStatus("saving");
    setDeliveryError("");
    setDeliverySuccess("");
    try {
      await settingsApi.update({ deliveryFee: Number(data.deliveryFee) });
      setDeliverySuccess("Delivery fee updated");
      setDeliveryStatus("idle");
    } catch (err) {
      setDeliveryError(err instanceof ApiClientError ? err.message : "Could not save delivery fee");
      setDeliveryStatus("error");
    }
  }

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-xl font-bold text-gray-900 mb-6" style={ff}>Settings</h1>

      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Truck size={16} className="text-[#0c3f35]" />
          <p className="text-sm font-bold text-gray-900" style={ff}>Delivery Fee</p>
        </div>
        <p className="text-xs text-gray-400 mb-4" style={ff}>
          Used to calculate delivery charges on new orders. Saves independently of the bank details below.
        </p>
        <form onSubmit={handleDeliverySubmit(onDeliverySubmit)} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5" style={ff}>Delivery Fee (Rs.)</label>
            <input
              type="number"
              min={0}
              step="1"
              placeholder="Delivery Fee"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
              {...registerDelivery("deliveryFee", { required: true, min: 0, valueAsNumber: true })}
            />
            {deliveryErrors.deliveryFee && <p className="text-xs text-red-500 mt-1">Enter a valid delivery fee</p>}
          </div>
          {deliveryError && <p className="text-xs text-red-500">{deliveryError}</p>}
          {deliverySuccess && <p className="text-xs text-[#28a869] font-medium">{deliverySuccess}</p>}
          <button
            type="submit"
            disabled={deliveryStatus === "saving"}
            className="px-4 py-2.5 bg-[#0c3f35] text-white rounded-lg text-sm font-semibold hover:bg-[#0c3f35]/88 disabled:opacity-60"
            style={ff}
          >
            {deliveryStatus === "saving" ? "Saving…" : "Save Delivery Fee"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <Landmark size={16} className="text-[#0c3f35]" />
          <p className="text-sm font-bold text-gray-900" style={ff}>Bank Transfer</p>
        </div>
        <p className="text-xs text-gray-400 mb-4" style={ff}>
          Shown to customers at checkout for Bank Transfer Payment.
        </p>
        <form onSubmit={handlePaymentSubmit(onPaymentSubmit)} className="space-y-3">
          <div>
            <input
              placeholder="Bank Name"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
              {...registerPayment("bankName", { required: true })}
            />
            {paymentErrors.bankName && <p className="text-xs text-red-500 mt-1">Bank name is required</p>}
          </div>
          <div>
            <input
              placeholder="Account Title"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
              {...registerPayment("accountTitle", { required: true })}
            />
            {paymentErrors.accountTitle && <p className="text-xs text-red-500 mt-1">Account title is required</p>}
          </div>
          <div>
            <input
              placeholder="Account Number"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
              {...registerPayment("accountNumber", { required: true })}
            />
            {paymentErrors.accountNumber && <p className="text-xs text-red-500 mt-1">Account number is required</p>}
          </div>
          <div>
            <input
              placeholder="IBAN"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
              {...registerPayment("iban", { required: true })}
            />
            {paymentErrors.iban && <p className="text-xs text-red-500 mt-1">IBAN is required</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5" style={ff}>Bank QR / Scanner Image</label>
            <div className="flex items-center gap-3">
              {qrCode?.url && (
                <img src={qrCode.url} alt="Bank QR code" className="w-16 h-16 object-contain rounded-lg border border-gray-200" />
              )}
              <label className="px-3.5 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors" style={ff}>
                {uploadingQr ? "Uploading…" : qrCode ? "Replace Image" : "Upload Image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleQrChange} disabled={uploadingQr} />
              </label>
            </div>
          </div>

          {paymentError && <p className="text-xs text-red-500">{paymentError}</p>}
          {paymentSuccess && <p className="text-xs text-[#28a869] font-medium">{paymentSuccess}</p>}
          <button
            type="submit"
            disabled={paymentStatus === "saving" || uploadingQr}
            className="px-4 py-2.5 bg-[#0c3f35] text-white rounded-lg text-sm font-semibold hover:bg-[#0c3f35]/88 disabled:opacity-60"
            style={ff}
          >
            {paymentStatus === "saving" ? "Saving…" : "Save Bank Details"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-3">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus size={16} className="text-[#0c3f35]" />
          <p className="text-sm font-bold text-gray-900" style={ff}>Admin Users</p>
        </div>
        <p className="text-xs text-gray-400 mb-4" style={ff}>Create another staff account with admin access to this panel.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input
              placeholder="Full Name"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
              {...register("name", { required: true })}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">Name is required</p>}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
              {...register("email", { required: true })}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">Email is required</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
              style={ff}
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>}
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {success && <p className="text-xs text-[#28a869] font-medium">{success}</p>}
          <button
            type="submit"
            disabled={status === "saving"}
            className="px-4 py-2.5 bg-[#0c3f35] text-white rounded-lg text-sm font-semibold hover:bg-[#0c3f35]/88 disabled:opacity-60"
            style={ff}
          >
            {status === "saving" ? "Creating…" : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
