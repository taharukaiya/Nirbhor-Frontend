import { Link, useLocation } from "react-router-dom";
import { ArrowRight, CheckCircle } from "../components/ui/Icons.jsx";

function AuthPage() {
  const isRegister = useLocation().pathname === "/register";

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066FF]">
          {isRegister ? "Join Nirbhor" : "Welcome back"}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#011F50]">
          {isRegister
            ? "Build trust into every job."
            : "Your trusted work network."}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {isRegister
            ? "Create an account to hire verified professionals or find your next opportunity."
            : "Sign in to manage your jobs, proposals, and conversations."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        {isRegister && (
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Full name
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              required
            />
          </label>
        )}
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Email address
          <input
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Password
          <input
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
          />
        </label>
        {isRegister && (
          <label className="flex items-start gap-3 text-sm text-slate-500">
            <input className="mt-1 accent-[#0066FF]" type="checkbox" required />
            <span>I agree to the Nirbhor terms and privacy policy.</span>
          </label>
        )}
        <button
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0066FF]/20 transition hover:bg-[#011F50]"
          type="submit"
        >
          {isRegister ? "Create account" : "Sign in"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span>
          {isRegister ? "Already have an account?" : "New to Nirbhor?"}
        </span>
        <Link
          className="font-bold text-[#0066FF] hover:text-[#011F50]"
          to={isRegister ? "/login" : "/register"}
        >
          {isRegister ? "Sign in" : "Get started"}
        </Link>
      </div>

      <div className="grid gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600 sm:grid-cols-3">
        {["NID verification", "Protected payments", "Job-based chat"].map(
          (item) => (
            <span key={item} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#00C853]" />
              {item}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

export default AuthPage;
