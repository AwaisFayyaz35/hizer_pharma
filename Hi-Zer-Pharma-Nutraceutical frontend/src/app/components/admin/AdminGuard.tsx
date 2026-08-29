import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { ff } from "../../lib/constants";
import { setNoIndex } from "../../lib/seo";

export function AdminGuard() {
  const { admin, loading } = useAuth();

  // The whole /admin area must never be indexed by search engines.
  useEffect(() => {
    setNoIndex();
  }, []);

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
