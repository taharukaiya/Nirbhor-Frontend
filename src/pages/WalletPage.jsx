import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWalletData } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { CreditCard, ArrowUpRight, ArrowDownRight, Clock, X } from "lucide-react";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useTranslation } from "react-i18next";

/**
 * ARCHITECTURAL INTENT:
 * WalletPage is the central hub for a user's financial interactions.
 * It displays current available balance, transaction history (ledger), 
 * and handles interactions for Depositing (via SSLCommerz) and Withdrawing funds.
 * 
 * STATE MANAGEMENT:
 * - `balance` & `ledger`: Populated via `getWalletData` on mount.
 * - Modal States: Manages isolated state for deposit and withdrawal flows (amounts, methods, account details).
 * - Async API integration dynamically lazy-loads specific actions (`requestWithdrawal`, `initiateWalletDeposit`) 
 *   to keep the initial bundle lighter until needed.
 */

export default function WalletPage() {
  useDocumentTitle("Wallet");
  const { t } = useTranslation();
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Withdraw Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bKash");
  const [accountDetails, setAccountDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deposit Modal State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);

  const { showError, showSuccess } = useToast();

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      try {
        const data = await getWalletData(abortController.signal);
        setBalance(data.balance || 0);
        setLedger(data.ledger || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          showError(err.message || "Failed to load wallet data");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => abortController.abort();
  }, [showError]);

  async function handleWithdraw(e) {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      return showError("Enter a valid amount");
    }
    if (amount > balance) {
      return showError("Insufficient balance");
    }
    if (withdrawMethod !== "Bank Transfer") {
      if (!/^\+880\d{10}$/.test(accountDetails.trim())) {
        return showError("Account number must be +880 followed by 10 digits");
      }
    } else if (!accountDetails.trim()) {
      return showError("Enter account details");
    }

    setIsSubmitting(true);
    try {
      const { requestWithdrawal } = await import("../services/api");
      await requestWithdrawal(amount, withdrawMethod, accountDetails);
      showSuccess("Withdrawal requested successfully!");
      setBalance(b => b - amount);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount("");
      setAccountDetails("");
      
      // Optionally refresh the ledger here
      const { getWalletData } = await import("../services/api");
      const data = await getWalletData();
      setLedger(data.ledger || []);
    } catch (err) {
      showError(err.message || "Failed to process withdrawal");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeposit(e) {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      return showError("Enter a valid deposit amount");
    }

    setIsDepositing(true);
    try {
      const { initiateWalletDeposit } = await import("../services/api");
      const res = await initiateWalletDeposit(amount);
      if (res?.gatewayPageUrl) {
        window.location.href = res.gatewayPageUrl;
      } else {
        showError("Failed to initiate deposit payment");
      }
    } catch (err) {
      showError(err.message || "Failed to process deposit");
      setIsDepositing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0066FF]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Wallet</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your funds and view transaction history
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance Card */}
        <div className="col-span-1 rounded-2xl bg-gradient-to-br from-[#0066FF] to-blue-700 p-6 text-white shadow-xl shadow-blue-500/20">
          <div className="flex items-center gap-2 mb-4 text-blue-100">
            <CreditCard className="h-5 w-5" />
            <span className="font-semibold uppercase tracking-wider text-xs">Available Balance</span>
          </div>
          <div className="text-4xl font-extrabold">
            ৳{balance.toLocaleString()}
          </div>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="flex-1 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm hover:bg-slate-50"
            >
              Add Funds
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-500"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Ledger List */}
        <div className="col-span-1 md:col-span-2 rounded-2xl border border-slate-100 bg-white/70 p-6 shadow-xl ring-1 ring-slate-100 backdrop-blur-md">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Transactions</h2>
          
          {ledger.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p>No transactions found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ledger.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        tx.type === "CREDIT"
                          ? "bg-emerald-100 text-emerald-600"
                          : tx.type === "DEBIT"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {tx.type === "CREDIT" ? (
                        <ArrowDownRight className="h-5 w-5" />
                      ) : tx.type === "DEBIT" ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{tx.desc}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(tx.date).toLocaleDateString()} at{" "}
                        {new Date(tx.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        tx.type === "CREDIT"
                          ? "text-emerald-600"
                          : tx.type === "DEBIT"
                          ? "text-rose-600"
                          : "text-amber-600"
                      }`}
                    >
                      {tx.type === "CREDIT" ? "+" : tx.type === "DEBIT" ? "-" : ""}
                      ৳{Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                      {tx.status === "HELD_IN_ESCROW" ? "Escrow" : tx.status === "RELEASED" ? "Completed" : tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white/70 p-6 shadow-2xl ring-1 ring-slate-100 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Withdraw Funds</h3>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">Available: ৳{balance.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Withdrawal Method
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  required
                >
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  {withdrawMethod === "Bank Transfer" ? "Account Details" : "Account Number"}
                </label>
                {withdrawMethod === "Bank Transfer" ? (
                  <textarea
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    placeholder="Bank Name, Branch, Account Number, etc."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    value={accountDetails}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (!val.startsWith("+880") && val.length > 0) {
                        if (val.startsWith("880")) val = "+" + val;
                        else if (val.startsWith("0")) val = "+88" + val;
                        else val = "+880" + val;
                      }
                      setAccountDetails(val);
                    }}
                    placeholder="+8801700000000"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                    required
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !withdrawAmount || !accountDetails}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white/70 p-6 shadow-2xl ring-1 ring-slate-100 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Add Funds</h3>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  min="1"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  required
                />
                <p className="mt-2 text-xs text-slate-500">
                  You will be securely redirected to SSLCommerz to complete the payment.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDepositing || !depositAmount}
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDepositing ? "Redirecting..." : "Deposit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
