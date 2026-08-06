import { useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronRight, UserPlus } from "lucide-react";
import { ff } from "../../lib/constants";
import { authApi } from "../../api/auth";
import { ApiClientError } from "../../api/client";

interface NewAdminForm {
  name: string;
  email: string;
  password: string;
}

const COMING_SOON = [
  { title: "Store Settings", desc: "Name, logo, contact details, and business hours" },
  { title: "Delivery Rules", desc: "Zones, fees, minimum order thresholds, and free delivery rules" },
  { title: "Roles & Permissions", desc: "Define what each staff role can view and edit" },
];

export default function AdminSettingsPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewAdminForm>();
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-xl font-bold text-gray-900 mb-6" style={ff}>Settings</h1>

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

      <div className="space-y-3">
        {COMING_SOON.map((item) => (
          <div key={item.title} className="w-full bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between opacity-60">
            <div>
              <p className="text-sm font-bold text-gray-900" style={ff}>{item.title}</p>
              <p className="text-xs text-gray-400 mt-0.5" style={ff}>{item.desc} · Coming soon</p>
            </div>
            <ChevronRight size={15} className="text-gray-300 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
