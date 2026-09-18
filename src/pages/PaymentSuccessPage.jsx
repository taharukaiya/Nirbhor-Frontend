import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "../components/ui/Icons.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useTranslation } from "react-i18next";

export default function PaymentSuccessPage() {
  useDocumentTitle("Payment Success");
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center space-y-6 border border-slate-100">
        <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        
        <div>
          <h2 className="text-2xl font-black text-[#011F50]">{t("payment.success")}</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            {t("payment.successCopy")}
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
            {t("nav.dashboard")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
