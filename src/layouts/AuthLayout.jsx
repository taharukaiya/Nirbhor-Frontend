import { Outlet } from "react-router-dom";

/**
 * AuthLayout
 * 
 * Architectural Intent:
 * A bare pass-through wrapper for Authentication-related routes.
 * Ensures that pages like Login and Register can implement their own full-screen, 
 * chromeless designs without inheriting the main site's Header or Footer.
 */
function AuthLayout() {
  return <Outlet />;
}

export default AuthLayout;
