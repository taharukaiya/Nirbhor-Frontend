import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";

function ProtectedRoute() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0066FF]" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }
  if (!currentUser)
    return <Navigate replace state={{ from: location }} to="/login" />;
  return <Outlet />;
}

export default ProtectedRoute;
