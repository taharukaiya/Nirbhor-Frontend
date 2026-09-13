import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "../../contexts/useAdmin.js";

export function AdminRoute({ requiredPermission, superAdminOnly = false }) {
  const { isAuthenticated, isSuperAdmin, hasPermission, loading } = useAdmin();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
