/**
 * Auth Context Reference
 * 
 * Architectural Intent:
 * Decouples the Context instantiation from the Provider logic to avoid circular dependencies
 * when Hooks and Providers reference each other.
 */
import { createContext } from "react";

export const AuthContext = createContext(null);
