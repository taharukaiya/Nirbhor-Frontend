/**
 * Main Application Layout
 * 
 * Architectural Intent:
 * The primary wrapper for all public and authenticated standard user routes.
 * Provides the sticky Header, Footer, and global ambient background effects.
 * 
 * Features:
 * - Implements Framer Motion `AnimatePresence` to orchestrate smooth page transitions 
 *   as users navigate between routes.
 */
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50 text-slate-900 relative">
      {/* ── Ambient background ─────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f8ff] via-white to-[#f3fbf8]" />
        <div className="absolute -top-[20%] -left-[15%] w-[55%] h-[55%] rounded-full bg-[#0066FF]/10 blur-[130px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[50%] h-[50%] rounded-full bg-[#00d4a0]/10 blur-[120px]" />
        <div className="absolute top-1/2 left-[30%] w-[30%] h-[30%] rounded-full bg-sky-500/5 blur-[100px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(rgba(1,31,80,0.025) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(1,31,80,0.025) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className={`flex-1 pb-8 ${isHome ? "" : "pt-20"}`}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
