import { useState } from "react";
import { X, CreditCard, Lock, Loader2, ShieldCheck } from "./ui/Icons.jsx";
import { initiateJobPayment, processJobPayment, processWalletPayment } from "../services/api";
import { parseAmount } from "../utils/numberUtils";

export default function PaymentModal({ isOpen, onClose, jobId, amount, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("mock"); // "mock" | "sslcommerz"

  if (!isOpen) return null;

  const parsedAmount = parseAmount(amount);
  const platformFee = Math.round(parsedAmount * 0.05);
  const providerPayout = parsedAmount - platformFee;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === "sslcommerz") {
      setIsProcessing(true);
      setError(null);
      try {
        const response = await initiateJobPayment(jobId);
        if (response?.gatewayPageUrl) {
          window.location.href = response.gatewayPageUrl;
        } else {
          setError("Failed to retrieve payment gateway URL");
          setIsProcessing(false);
        }
      } catch (err) {
        setError(err.message || "Failed to initiate SSLCommerz payment");
        setIsProcessing(false);
      }
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      if (activeTab === "wallet") {
        await processWalletPayment(jobId);
      } else {
        await processJobPayment(jobId, amount);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <h2 className="text-xl font-bold text-[#011F50] flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" /> Secure Payment
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Method Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("mock")}
            className={`flex-1 min-w-max px-4 py-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === "mock"
                ? "border-[#0066FF] text-[#0066FF] bg-blue-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <CreditCard className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Demo Payment
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wallet")}
            className={`flex-1 min-w-max px-4 py-3 text-xs font-bold transition-colors border-b-2 relative ${
              activeTab === "wallet"
                ? "border-emerald-500 text-emerald-700 bg-emerald-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            Nirbhor Wallet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sslcommerz")}
            className={`flex-1 min-w-max px-4 py-3 text-xs font-bold transition-colors border-b-2 relative ${
              activeTab === "sslcommerz"
                ? "border-amber-500 text-amber-700 bg-amber-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            SSLCommerz
            <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-inset ring-amber-200">
              Live
            </span>
          </button>
        </div>

        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
          {/* Amount Display */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-5 border border-blue-100/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Provider Payout (95%)</span>
              <span className="text-sm font-bold text-slate-700">৳{providerPayout.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between border-b border-blue-200/50 pb-3">
              <span className="text-sm font-semibold text-slate-500">Platform Fee (5%)</span>
              <span className="text-sm font-bold text-slate-700">৳{platformFee.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-base font-bold text-slate-700">Total Amount</span>
              <span className="text-2xl font-black text-[#011F50]">৳{parsedAmount.toLocaleString()}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold border border-red-100 flex items-start gap-2">
              <span>{error}</span>
            </div>
          )}

          {/* Mock Payment Tab */}
          {activeTab === "mock" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Card Number (Demo)</label>
                <input
                  type="text"
                  placeholder="•••• •••• •••• ••••"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-slate-50/50"
                  required
                  disabled={isProcessing}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-slate-50/50"
                    required
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">CVC</label>
                  <input
                    type="text"
                    placeholder="•••"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none bg-slate-50/50"
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                This is a demo payment for development. No actual charges will be made.
              </p>
            </div>
          )}

          {/* SSLCommerz Content Tab */}
          {activeTab === "sslcommerz" && (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#011F50]">Pay with SSLCommerz</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  You will be securely redirected to the SSLCommerz payment gateway.
                  Supports bKash, Nagad, Rocket, Visa, Mastercard, and more.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {["bKash", "Nagad", "Rocket", "Visa", "Mastercard"].map((method) => (
                  <span
                    key={method}
                    className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Wallet Content Tab */}
          {activeTab === "wallet" && (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <CreditCard className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#011F50]">Pay with Nirbhor Wallet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  The amount will be directly deducted from your platform wallet balance.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> {activeTab === "sslcommerz" ? "Redirecting..." : "Processing Payment..."}
              </>
            ) : (
              <>Pay ৳{parseAmount(amount).toLocaleString()}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
