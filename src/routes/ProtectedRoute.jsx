import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";

function ProtectedRoute() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading your workspace...
      </div>
    );
  if (!currentUser)
    return <Navigate replace state={{ from: location }} to="/login" />;
  return <Outlet />;
}

export default ProtectedRoute;
