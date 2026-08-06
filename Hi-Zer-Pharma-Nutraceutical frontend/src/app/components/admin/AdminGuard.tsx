import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { ff } from "../../lib/constants";

export function AdminGuard() {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm" style={ff}>
        Loading…
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
