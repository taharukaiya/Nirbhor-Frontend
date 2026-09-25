/**
 * Admin RBAC Guard Route
 * 
 * Architectural Intent:
 * An interceptor component used by `react-router` to enforce Role-Based Access Control 
 * on administrative views.
 * 
 * Logic:
 * - Ensures the user is authenticated in the Admin Context.
 * - Can restrict a route to strictly `SUPER_ADMIN` roles.
 * - Can restrict a route based on granular granular permissions (e.g., `MANAGE_USERS`).
 * - Unauthorised attempts are silently redirected to the admin dashboard.
 */
import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "../contexts/useAdmin.js";

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
