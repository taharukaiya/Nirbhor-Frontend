import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle } from "../components/ui/Icons.jsx";
import { useAuth } from "../contexts/useAuth.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { Mail, Lock, User, IdCard, Calendar, Briefcase, Eye, EyeOff } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useTranslation } from "react-i18next";
function AuthPage() {
  const location = useLocation();
  const isRegister = location.pathname === "/register";
  useDocumentTitle(isRegister ? "Join Nirbhor" : "Sign In");
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "HIRER",
    nidNumber: "",
    dateOfBirth: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      showError(t("auth.invalidEmail"));
      return;
    }

    if (isRegister) {
      const cleanNid = String(form.nidNumber || "").trim();
      if (!cleanNid || !/^\d{10,17}$/.test(cleanNid)) {
        showError(t("auth.invalidNid"));
        return;
      }
      if (!form.dateOfBirth) {
        showError(t("auth.invalidDob"));
        return;
      }

      const dobRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
      if (!dobRegex.test(form.dateOfBirth)) {
        showError(t("auth.invalidDobFormat"));
        return;
      }
    }

    setSubmitting(true);
    try {
      const session = isRegister
        ? await signUp({
          ...form,
          nidNumber: String(form.nidNumber).trim(),
          dateOfBirth: form.dateOfBirth,
          role:
            form.role === "SERVICE_PROVIDER" ? "SERVICE_PROVIDER" : "HIRER",
        })
        : await signIn({ email: form.email, password: form.password });

      const userRole =
        session?.user?.role || session?.role || form.role || "HIRER";
      const destination =
        userRole === "SERVICE_PROVIDER" ||
          userRole === "WORKER" ||
          userRole === "FREELANCER"
          ? "/jobs"
          : "/services";

      showSuccess(
        isRegister
          ? t("auth.registerSuccess")
          : t("auth.loginSuccess"),
      );
      navigate(destination, { replace: true });
    } catch (requestError) {
      showError(requestError.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#0066FF] hover:text-[#011F50] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> {t("common.back")}
        </Link>
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066FF]">
            {isRegister ? t("auth.registerTitle") : t("auth.signInTitle")}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#011F50]">
            {isRegister
              ? t("auth.registerSubtitle")
              : t("auth.signInSubtitle")}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isRegister
              ? t("auth.hirerDescription")
              : t("auth.providerDescription")}
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {isRegister && (
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            {t("auth.fullName")} (matches NID record)
            <div className="relative group">
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder={t("auth.namePlaceholder")}
                className="w-full relative z-0 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white"
                required
              />
              <User className="absolute z-10 left-4 inset-y-0 my-auto h-5 w-5 text-slate-500 group-focus-within:text-[#0066FF] transition-colors pointer-events-none" />
            </div>
          </label>
        )}
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          {t("auth.email")}
          <div className="relative group">
            <input
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder={t("auth.emailPlaceholder")}
              className="w-full relative z-0 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white"
              type="email"
              autoComplete="email"
              required
            />
            <Mail className="absolute z-10 left-4 inset-y-0 my-auto h-5 w-5 text-slate-500 group-focus-within:text-[#0066FF] transition-colors pointer-events-none" />
          </div>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          {t("auth.password")}
          <div className="relative group">
            <input
              name="password"
              value={form.password}
              onChange={updateField}
              className="w-full relative z-0 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white"
              type={showPassword ? "text" : "password"}
              minLength={8}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
            />
            <Lock className="absolute z-10 left-4 inset-y-0 my-auto h-5 w-5 text-slate-500 group-focus-within:text-[#0066FF] transition-colors pointer-events-none" />
            <button
              type="button"
              className="absolute z-10 right-4 inset-y-0 my-auto flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </label>
        {isRegister && (
          <>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              {t("auth.nidNumber")}
              <div className="relative group">
                <input
                  name="nidNumber"
                  value={form.nidNumber}
                  onChange={updateField}
                  placeholder={t("auth.nidPlaceholder")}
                  className="w-full relative z-0 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white"
                  required
                />
                <IdCard className="absolute z-10 left-4 inset-y-0 my-auto h-5 w-5 text-slate-500 group-focus-within:text-[#0066FF] transition-colors pointer-events-none" />
              </div>
              <span className="text-xs text-slate-400 font-normal">
                {t("auth.invalidNid")}
              </span>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              {t("auth.dateOfBirth")} (matches NID)
              <div className="relative group">
                <input
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={updateField}
                  className="w-full relative z-0 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white"
                  required
                />
                <Calendar className="absolute z-10 left-4 inset-y-0 my-auto h-5 w-5 text-slate-500 group-focus-within:text-[#0066FF] transition-colors pointer-events-none" />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              {t("auth.role")}
              <div className="relative group">
                <select
                  className="w-full relative z-0 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white appearance-none"
                  name="role"
                  value={form.role}
                  onChange={updateField}
                >
                  <option value="HIRER">{t("auth.roleHirer")}</option>
                  <option value="SERVICE_PROVIDER">{t("auth.roleProvider")}</option>
                </select>
                <Briefcase className="absolute z-10 left-4 inset-y-0 my-auto h-5 w-5 text-slate-500 group-focus-within:text-[#0066FF] transition-colors pointer-events-none" />
              </div>
            </label>
          </>
        )}
        <button
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0066FF]/20 transition hover:bg-[#011F50]"
          type="submit"
        >
          {submitting
            ? t("common.loading")
            : isRegister
              ? t("auth.registerButton")
              : t("auth.signInButton")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      {!isRegister && (
        <Link
          className="block text-sm font-semibold text-[#0066FF] hover:text-[#011F50]"
          to="/forgot-password"
        >
          {t("auth.forgotPassword")}
        </Link>
      )}

      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span>
          {isRegister ? t("auth.haveAccount") : t("auth.noAccount")}
        </span>
        <Link
          className="font-bold text-[#0066FF] hover:text-[#011F50]"
          to={isRegister ? "/login" : "/register"}
        >
          {isRegister ? t("auth.signInLink") : t("auth.signUpLink")}
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
