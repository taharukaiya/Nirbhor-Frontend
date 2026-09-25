/**
 * Admin Context Hook
 * 
 * Architectural Intent:
 * Provides a type-safe consumer hook for the Admin Context.
 * Throws a descriptive error if used outside the `AdminProvider` boundary.
 */
import { createContext, useContext } from "react";

export const AdminContext = createContext(null);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
