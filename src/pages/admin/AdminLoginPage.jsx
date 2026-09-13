import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/useAdmin.js";
import logo1 from "../../assets/logo1.png";


export function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in as administrator.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 font-sans text-slate-100">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <img src={logo1} alt="Nirbhor" className="h-12 w-auto object-contain" />
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Admin Console
          </h1>
          <p className="text-xs text-slate-400">
            Sign in with authorized Super Admin or Admin credentials
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl space-y-4 backdrop-blur-md"
        >
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-300">
              {error}
            </div>
          )}

          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider space-y-1.5">
            Admin Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]"
              placeholder="superadmin@nirbhor.com"
            />
          </label>

          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider space-y-1.5">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]"
              placeholder="••••••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#0066FF] py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-600 disabled:opacity-50"
          >
            {submitting ? "Authenticating..." : "Sign In to Admin Console"}
          </button>
        </form>
      </div>
    </div>
  );
}
