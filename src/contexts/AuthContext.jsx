/**
 * Authentication context boundary for the application.
 */

import { useEffect, useState, useCallback } from "react";
import { AuthContext } from "./authContext.js";
import { getSession, login, logout, register } from "../services/api.js";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(
  /\/$/,
  "",
);

/**
 * AuthProvider — wrap your router / app root with this component.
 *
 * Fixes the "refresh causes logout" bug by attempting a token refresh
 * when the initial session call fails with 401.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function setSessionUser(session) {
    if (session && 'user' in session) {
      setCurrentUser(session.user);
    } else {
      setCurrentUser(session || null);
    }
  }

  /**
   * Attempt to silently refresh the access token via the refresh_token cookie.
   * Returns the refreshed session user or null.
   */
  const attemptSilentRefresh = useCallback(async (signal) => {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        signal,
      });
      if (!refreshRes.ok) return null;
      const data = await refreshRes.json();
      
      if (data && 'user' in data) {
        return data.user;
      }
      return data || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function restoreSession() {
      try {
        // First, try to get the session with the current access_token
        const session = await getSession(controller.signal);
        setSessionUser(session);
      } catch (error) {
        if (error.name === "AbortError") return;
        // If getSession fails (likely 401 — access_token expired),
        // attempt a silent refresh using the refresh_token cookie.
        const user = await attemptSilentRefresh(controller.signal);
        setCurrentUser(user || null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    restoreSession();
    return () => controller.abort();
  }, [attemptSilentRefresh]);

  async function signOut() {
    try {
      await logout();
    } finally {
      setCurrentUser(null);
      import("../services/socketService.js").then((mod) => mod.disconnectSocket());
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

  // We no longer block rendering children here.
  // Instead, ProtectedRoute and other components read `loading`
  // from the context to render their own loading states or defer redirects.

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
