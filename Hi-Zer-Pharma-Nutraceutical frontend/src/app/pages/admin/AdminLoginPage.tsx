import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router";
import { fs, ff } from "../../lib/constants";
import { useAuth } from "../../hooks/useAuth";
import { ApiClientError } from "../../api/client";

interface LoginForm {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function onSubmit(data: LoginForm) {
    setSubmitting(true);
    setError("");
    try {
      await login(data.email, data.password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center mb-3">
            <span className="text-xl font-bold text-[#0c3f35]" style={fs}>Hi-Zer</span>
            <span className="text-[9px] font-semibold tracking-[0.18em] text-[#28a869] uppercase" style={ff}>Pharma & Nutraceutical</span>
          </div>
          <br />
          <span className="inline-block bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full" style={ff}>Admin Panel</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6" style={ff}>Sign In</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider" style={ff}>Email</label>
              <input
                type="email"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
                style={ff}
                {...register("email", { required: true })}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">Email is required</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider" style={ff}>Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c3f35]/18"
                style={ff}
                {...register("password", { required: true })}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">Password is required</p>}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#0c3f35] text-white rounded-lg font-semibold hover:bg-[#0c3f35]/88 active:scale-[0.98] transition-all disabled:opacity-60"
              style={ff}
            >
              {submitting ? "Signing In…" : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
