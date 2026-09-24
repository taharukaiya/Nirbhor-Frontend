import { Outlet } from "react-router-dom";

/**
 * AuthLayout — bare pass-through wrapper.
 * Each auth page (AuthPage, AccountActionPage, etc.) owns its own
 * full-screen layout, background, and visual design.
 * This layout intentionally has NO chrome, no padding, no background.
 */
function AuthLayout() {
  return <Outlet />;
}

export default AuthLayout;
