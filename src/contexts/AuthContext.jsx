/**
 * Authentication context boundary for the application.
 */

import { useState } from "react";
import { AuthContext } from "./authContext.js";

/**
 * AuthProvider — wrap your router / app root with this component.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const loading = false;

  async function signOut() {
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loading,
    signOut,
  };

  // Don't render children until auth state is known (prevents flash of wrong UI)
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0066FF]" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
