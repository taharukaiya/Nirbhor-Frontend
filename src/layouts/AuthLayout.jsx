import { Outlet } from "react-router-dom";

/**
 * AuthLayout
 * 
 * Architectural Intent:
 * Layout wrapper for Authentication-related routes.
 * Provides a beautifully centered, glassmorphic form container 
 * atop a rich gradient background.
 */
function AuthLayout() {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#011F50] via-[#0066FF] to-blue-900 flex items-center justify-center relative">
      {/* Background ambient light effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-[10%] top-0 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px]" />
          <div className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-cyan-400/20 blur-[120px]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[#0066FF]/10 blur-[120px]" />
      </div>

      {/* Form area */}
      <main className="relative z-10 w-full max-w-lg px-5 py-10 sm:px-8">
        <div className="w-full rounded-3xl bg-white/95 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-blue-900/50 ring-1 ring-white/20 animate-fade-in-up">
          <Outlet />
        </div>
        <p className="mt-8 text-center text-sm font-medium text-white/60">
          © {new Date().getFullYear()} Nirbhor. All rights reserved.
        </p>
      </main>
    </div>
  );
}

export default AuthLayout;
