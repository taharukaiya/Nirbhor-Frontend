/**
 * User Auth Context Hook
 * 
 * Architectural Intent:
 * Provides a consumer hook for the main user Auth Context.
 * Throws an error if invoked outside the `AuthProvider` boundary to catch 
 * rendering hierarchy bugs early.
 */
import { useContext } from "react";
import { AuthContext } from "./authContext.js";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an <AuthProvider>.");
  return context;
}
