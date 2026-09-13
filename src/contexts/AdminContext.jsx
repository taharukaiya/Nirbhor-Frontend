import { useEffect, useState } from "react";
import { AdminContext } from "./useAdmin.js";
import { adminLogin, adminLogout, getAdminSession } from "../services/adminApi.js";

export function AdminProvider({ children }) {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    getAdminSession()
      .then((res) => {
        if (res?.admin) setCurrentAdmin(res.admin);
        else setCurrentAdmin(null);
      })
      .catch(() => setCurrentAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  async function signIn(email, password) {
    const res = await adminLogin(email, password);
    if (res?.admin) {
      setCurrentAdmin(res.admin);
    }
    return res;
  }

  async function signOut() {
    try {
      await adminLogout();
    } finally {
      setCurrentAdmin(null);
    }
  }

  const isSuperAdmin = currentAdmin?.role === "SUPER_ADMIN";
  const permissions = currentAdmin?.permissions || {};

  function hasPermission(permKey) {
    if (isSuperAdmin) return true;
    return Boolean(permissions[permKey]);
  }

  const value = {
    currentAdmin,
    isAuthenticated: Boolean(currentAdmin),
    isSuperAdmin,
    permissions,
    hasPermission,
    loading,
    signIn,
    signOut,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-[#0066FF]" />
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Loading Admin Session...
          </span>
        </div>
      </div>
    );
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
