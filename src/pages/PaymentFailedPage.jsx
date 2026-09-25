/**
 * @file PaymentFailedPage.jsx
 * @description Callback page for failed payment gateway transactions.
 *
 * Architectural Intent:
 * - Query Parameter Parsing: Extracts `tran_id` and `reason` from the URL to display specific failure context to the user.
 * - Redirection: Provides immediate pathways back to the dashboard to retry the transaction.
 */
import { useSearchParams, Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, RefreshCcw } from "../components/ui/Icons.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useTranslation } from "react-i18next";

export default function PaymentFailedPage() {
  useDocumentTitle("Payment Failed");
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const reason = searchParams.get("reason");
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center space-y-6 border border-slate-100">
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-black text-[#011F50]">{t("payment.failed")}</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            {reason || t("payment.failedCopy")}
          </p>
        </div>

        {tranId && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t("payment.transactionId")}</p>
            <p className="text-sm font-mono font-medium text-slate-700 break-all">{tranId}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4">
          <Link
            to="/dashboard"
            className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-[#0066FF] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-[#011F50] hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 outline-none"
          >
            <RefreshCcw className="h-4 w-4" />
            {t("payment.tryAgain")}
          </Link>
          <Link
            to="/dashboard"
            className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-slate-100 px-4 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 outline-none"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")} {t("nav.dashboard")}
          </Link>
        </div>
      </div>
    </div>
  );
}
