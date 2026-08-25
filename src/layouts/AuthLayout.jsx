import { Link, Outlet } from "react-router-dom";
import logo2 from "../assets/logo2.png";

/**
 * AuthLayout — minimal, centered layout for Login, Register, and Forgot Password pages.
 * Renders a branded split panel on large screens.
 */
function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left — branding panel (desktop only) */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-[#011F50] p-10 lg:flex xl:p-14">
        {/* Background accents */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#0066FF]/20 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-[#00C853]/15 blur-3xl" />

        {/* Logo */}
        <Link to="/" aria-label="Nirbhor homepage">
          <img alt="Nirbhor" className="h-14 w-auto object-contain" src={logo2} />
        </Link>

        {/* Quote block */}
        <div className="relative space-y-6">
          <blockquote className="text-2xl font-bold leading-snug text-white xl:text-3xl">
            "A cleaner, safer way to hire and work — built on trust."
          </blockquote>
          <div className="flex flex-wrap gap-3">
            {["NID Verified", "Secure Payments", "Job-based Chat", "Trusted Reviews"].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80"
                >
                  {badge}
                </span>
              )
            )}
          </div>
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Nirbhor. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right — form area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile logo */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 lg:hidden">
          <Link to="/">
            <img alt="Nirbhor" className="h-10 w-auto object-contain" src={logo2} />
          </Link>
          <Link
            className="text-sm font-medium text-slate-500 hover:text-[#0066FF]"
            to="/"
          >
            ← Home
          </Link>
        </div>

        {/* Page content (Login / Register / etc.) */}
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
