import { Link, useRouteError } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useTranslation } from "react-i18next";

function NotFoundPage() {
  useDocumentTitle("Not Found");
  const error = useRouteError();
  const { t } = useTranslation();
  if (error) {
    console.error("Route Error Caught by NotFoundPage:", error);
  }
  
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-20 text-center">
      {/* Animated 404 */}
      <div className="relative mb-8 select-none">
        <span className="block text-[8rem] font-black leading-none text-slate-100 sm:text-[11rem]">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-[#0066FF]/10 px-5 py-2">
            <span className="text-sm font-bold tracking-widest text-[#0066FF] uppercase">
              {t("notFound.title")}
            </span>
          </div>
        </div>
      </div>

      {/* Illustration */}
      <div className="mb-8">
        <svg
          className="mx-auto h-32 w-32 text-slate-300"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="4" strokeDasharray="12 6" />
          <circle cx="100" cy="100" r="50" fill="currentColor" opacity="0.08" />
          <path d="M80 85 Q100 70 120 85" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <circle cx="82" cy="95" r="6" fill="currentColor" />
          <circle cx="118" cy="95" r="6" fill="currentColor" />
          <path d="M82 120 Q100 130 118 120" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-[#011F50] sm:text-3xl">
        Oops — {t("notFound.message")}
      </h1>
      <p className="mt-3 max-w-sm text-slate-500">
        {t("notFound.message")}
      </p>
      {error && (
        <div className="mt-8 max-w-2xl bg-red-50 text-red-600 p-4 rounded-xl text-left overflow-auto text-xs font-mono">
          <p className="font-bold">Error Caught by Boundary:</p>
          <p>{error.message || String(error)}</p>
          <pre className="mt-2">{error.stack}</pre>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          className="rounded-full bg-[#0066FF] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#011F50] hover:shadow-md"
          to="/"
        >
          {t("notFound.backHome")}
        </Link>
        <Link
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#0066FF] hover:text-[#0066FF]"
          to="/services"
        >
          {t("nav.findServices")}
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
