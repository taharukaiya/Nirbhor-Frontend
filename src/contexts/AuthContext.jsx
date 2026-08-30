/**
 * Authentication context boundary for the application.
 */

import { useEffect, useState } from "react";
import { AuthContext } from "./authContext.js";
import { getSession, login, logout, register } from "../services/api.js";

/**
 * AuthProvider — wrap your router / app root with this component.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function setSessionUser(session) {
    setCurrentUser(session?.user ?? session ?? null);
  }

  useEffect(() => {
    const controller = new AbortController();
    getSession(controller.signal)
      .then((session) => setSessionUser(session))
      .catch(() => setSessionUser(null))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  async function signOut() {
    try {
      await logout();
    } finally {
      setCurrentUser(null);
    }
  }

  async function signIn(credentials) {
    const session = await login(credentials);
    setSessionUser(session);
    return session;
  }

  async function signUp(credentials) {
    const session = await register(credentials);
    setSessionUser(session);
    return session;
  }

  async function updateSession(user) {
    setCurrentUser(user ?? null);
  }

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loading,
    signIn,
    signUp,
    signOut,
    updateSession,
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
