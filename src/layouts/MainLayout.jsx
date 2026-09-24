import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function MainLayout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden overflow-y-auto bg-slate-50 text-slate-900 relative">
      {/* ── Ambient background ─────────────── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
        <div className="absolute -top-[20%] -left-[15%] w-[55%] h-[55%] rounded-full bg-[#0066FF]/10 blur-[130px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-1/2 left-[30%] w-[30%] h-[30%] rounded-full bg-sky-500/5 blur-[100px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-2 pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
