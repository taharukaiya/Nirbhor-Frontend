import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "../components/ui/Icons.jsx";
import { forgotPassword, resetPassword, verifyEmail } from "../services/api.js";

function AccountActionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const action = location.pathname.startsWith("/forgot-password")
    ? "forgot"
    : location.pathname.startsWith("/reset-password")
      ? "reset"
      : "verify";
  const token = location.pathname.split("/").pop();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(action === "verify");

  useEffect(() => {
    if (action !== "verify") return;
    verifyEmail(token)
      .then(() =>
        setMessage("Your email has been verified. You can sign in now."),
      )
      .catch(() => setError("This verification link is invalid or expired."))
      .finally(() => setWorking(false));
  }, [action, token]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setWorking(true);
    try {
      if (action === "forgot")
        setMessage((await forgotPassword(email)).message);
      else {
        await resetPassword(token, password);
        setMessage("Your password has been reset. You can sign in now.");
      }
    } catch (requestError) {
      setError(requestError.message || "Unable to complete this request.");
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#0066FF] hover:text-[#011F50] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Go to Home
        </Link>
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066FF]">
            Account security
          </span>
          <h1 className="mt-2 text-3xl font-bold text-[#011F50]">
            {action === "forgot"
              ? "Recover your account."
              : action === "reset"
                ? "Choose a new password."
                : "Verify your email."}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {action === "forgot"
              ? "We will send a short-lived reset link if an account exists."
              : action === "reset"
                ? "Use a strong password you have not used elsewhere."
                : "We are checking your verification link."}
          </p>
        </div>
      </div>
      {action !== "verify" && (
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {action === "forgot" ? (
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Email address
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0066FF]"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
          ) : (
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              New password
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-[#0066FF]"
                type="password"
                minLength="8"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
          )}
          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#011F50]"
            disabled={working}
            type="submit"
          >
            {working
              ? "Working..."
              : action === "forgot"
                ? "Send reset link"
                : "Reset password"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}
      {working && action === "verify" && (
        <p className="text-sm text-slate-500">
          Checking verification status...
        </p>
      )}
      {message && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="flex items-center gap-4 text-sm">
        <Link
          className="font-bold text-[#0066FF] hover:text-[#011F50]"
          to="/login"
        >
          Back to sign in
        </Link>
        <span className="text-slate-300">•</span>
        <Link
          className="font-semibold text-slate-600 hover:text-[#0066FF]"
          to="/"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default AccountActionPage;
