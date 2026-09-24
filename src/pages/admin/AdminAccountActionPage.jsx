import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "../../components/ui/Icons.jsx";
import { forgotPasswordAdmin, resetPasswordAdmin } from "../../services/api.js";
import { useTranslation } from "react-i18next";
import { Mail, Lock, ShieldCheck } from "lucide-react";

function AdminAccountActionPage() {
  const { t } = useTranslation();
  useDocumentTitle("Admin Security");
  const location = useLocation();
  const action = location.pathname.startsWith("/admin/forgot-password")
    ? "forgot"
    : "reset";
  const token = location.pathname.split("/").pop();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setWorking(true);
    try {
      if (action === "forgot")
        setMessage((await forgotPasswordAdmin(email)).message);
      else {
        await resetPasswordAdmin(token, password);
        setMessage(t("accountAction.passwordResetMsg"));
      }
    } catch (requestError) {
      setError(requestError.message || t("accountAction.errorGeneric"));
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#011F50] overflow-hidden py-12">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#0066FF]/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="w-full max-w-md relative z-10 px-6 sm:px-0">
        <div className="mb-8">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Admin Login
          </Link>
        </div>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[2rem] p-8 sm:p-10 shadow-2xl overflow-hidden relative">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="mb-8 text-center sm:text-left">
              <span className="inline-block rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400 mb-4">
                Admin Security
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                {action === "forgot"
                  ? t("accountAction.recoverTitle")
                  : t("accountAction.choosePasswordTitle")}
              </h1>
              <p className="text-sm text-white/70 leading-relaxed">
                {action === "forgot"
                  ? "Enter your admin email address to receive a password reset link."
                  : t("accountAction.choosePasswordDesc")}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {action === "forgot" ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/90 ml-1">Admin Email</label>
                  <div className="relative group">
                    <input
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-red-500 focus:bg-white/10 focus:ring-4 focus:ring-red-500/20"
                      type="email"
                      value={email}
                      placeholder="admin@nirbhor.com"
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/90 ml-1">{t("accountAction.newPassword")}</label>
                  <div className="relative group">
                    <input
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-red-500 focus:bg-white/10 focus:ring-4 focus:ring-red-500/20"
                      type="password"
                      minLength="8"
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 group-focus-within:text-red-500 transition-colors pointer-events-none" />
                  </div>
                </div>
              )}
              
              <button
                className="group relative w-full overflow-hidden rounded-xl bg-red-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-700 hover:shadow-red-600/50 focus:outline-none focus:ring-4 focus:ring-red-600/30 mt-6"
                disabled={working}
                type="submit"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-[-100%] transition-transform duration-300 ease-out group-hover:translate-y-[100%]" />
                <span className="relative flex items-center justify-center gap-2">
                  {working
                    ? t("common.working")
                    : action === "forgot"
                      ? t("accountAction.sendResetLink")
                      : t("accountAction.resetPasswordBtn")}
                  {!working && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </span>
              </button>
            </form>

            {message && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-200">
                  {message}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-200">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAccountActionPage;
