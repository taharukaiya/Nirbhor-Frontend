import { Outlet } from "react-router-dom";

/**
 * AuthLayout
 * 
 * Architectural Intent:
 * Layout wrapper for Authentication-related routes.
 * Provides a full-screen split design with brand messaging on the left
 * and a glassmorphic form container on the right.
 */
function AuthLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#011F50] via-[#0066FF] to-blue-900">
      <main className="flex min-h-[calc(100vh)] flex-col lg:flex-row relative">
        {/* Background ambient light */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -left-[10%] top-0 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px]" />
            <div className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-cyan-400/20 blur-[120px]" />
        </div>

        {/* Left — branding panel (desktop only) */}
        <div className="relative z-10 hidden min-w-0 flex-1 flex-col justify-center overflow-hidden p-10 lg:flex xl:p-14">

          {/* Quote block */}
          <div className="flex flex-col justify-center gap-5 relative space-y-6">
            <blockquote className="text-4xl font-bold leading-snug text-white xl:text-5xl">
              A cleaner, safer way to hire and work — built on trust.
            </blockquote>
            <div className="flex flex-wrap gap-3">
              {[
                "NID Verified",
                "Secure Payments",
                "Job-based Chat",
                "Trusted Reviews",
              ].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md"
                >
                  {badge}
                </span>
              ))}
            </div>
            <p className="text-sm text-white/50 mt-12">
              © {new Date().getFullYear()} Nirbhor. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right — form area */}
        <div className="relative z-10 flex min-w-0 flex-1 flex-col lg:pl-10">
          {/* Page content (Login / Register / etc.) */}
          <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
            <div className="w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-blue-900/50 ring-1 ring-white/20 animate-fade-in-up">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
