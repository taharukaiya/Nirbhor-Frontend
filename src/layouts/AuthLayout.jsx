import { Link, Outlet } from "react-router-dom";
import { CheckCircle } from "../components/ui/Icons.jsx";
import logo2 from "../assets/logo2.png";

/**
 * AuthLayout - split-screen shell for login / register / password recovery
 * (and the admin auth pages). The left brand panel mirrors the homepage hero
 * (navy gradient, grid, floating shapes, glow orbs); the right side hosts the form.
 */
function AuthLayout() {
  const points = [
    "NID-verified hirers & providers",
    "Protected, transparent payments",
    "Job-specific chat, in one place",
  ];

  return (
    <div className="relative min-h-screen w-full bg-slate-50 lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* ── Brand panel ── */}
      <aside className="relative isolate hidden overflow-hidden bg-[#011F50] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:p-14">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -left-[20%] -top-[10%] h-[34rem] w-[34rem] animate-pulse rounded-full bg-gradient-to-br from-[#0066FF]/40 to-purple-600/30 blur-[100px]"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute -bottom-[15%] -right-[15%] h-[30rem] w-[30rem] animate-pulse rounded-full bg-gradient-to-tl from-[#00d4a0]/25 to-[#00b3ff]/20 blur-[110px]"
            style={{ animationDuration: "12s" }}
          />
          <div className="animate-float absolute left-[12%] top-[48%] h-20 w-20 rotate-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm" />
          <div className="animate-float absolute right-[14%] top-[22%] h-14 w-14 rounded-full border border-[#00d4a0]/30 bg-[#00d4a0]/10 [animation-delay:2s]" />
          <div className="animate-float absolute bottom-[18%] right-[30%] h-10 w-10 -rotate-12 rounded-xl border border-white/10 bg-[#0066FF]/20 [animation-delay:4s]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        <Link to="/" className="flex w-fit items-center gap-3">
          <img src={logo2} alt="Nirbhor" className="h-11 w-auto drop-shadow-lg" />
          <span className="text-xl font-extrabold tracking-tight">Nirbhor</span>
        </Link>

        <div>
          <span className="animate-slide-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d4a0]" />
            Trusted local services
          </span>
          <h2 className="animate-slide-up mt-7 max-w-md text-5xl font-extrabold leading-[1.05] tracking-tight [animation-delay:100ms] xl:text-6xl">
            Work you can <span className="text-gradient-light">trust.</span>
          </h2>
          <p className="animate-slide-up mt-6 max-w-md text-base font-medium leading-relaxed text-white/70 [animation-delay:200ms]">
            Find skilled help or offer your skills — verified, protected and simple.
          </p>
          <ul className="mt-9 space-y-3">
            {points.map((item, i) => (
              <li
                key={item}
                style={{ animationDelay: `${300 + i * 120}ms` }}
                className="animate-slide-up flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur-md"
              >
                <CheckCircle className="h-4 w-4 text-[#00d4a0]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm font-medium text-white/50">
          © {new Date().getFullYear()} Nirbhor. All rights reserved.
        </p>
      </aside>

      {/* ── Form area ── */}
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-10">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-[#f4f8ff] via-white to-[#f3fbf8]" />
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#0066FF]/10 blur-[110px]" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#00d4a0]/10 blur-[110px]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(1,31,80,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(1,31,80,0.025) 1px,transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          {/* Mobile brand */}
          <Link to="/" className="mb-6 flex w-fit items-center gap-2.5 lg:hidden">
            <img src={logo2} alt="Nirbhor" className="h-10 w-auto" />
            <span className="text-lg font-extrabold tracking-tight text-[#011F50]">
              Nirbhor
            </span>
          </Link>
          <div className="animate-fade-in-up rounded-[2rem] border border-slate-200/70 bg-white/85 p-7 shadow-2xl shadow-[#011F50]/10 backdrop-blur-xl sm:p-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
