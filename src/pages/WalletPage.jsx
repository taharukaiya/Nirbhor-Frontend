import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWalletData } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import { CreditCard, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

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
              onClick={() => alert("Deposit via SSLCommerz not implemented yet.")}
              className="flex-1 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#0066FF] shadow-sm hover:bg-slate-50"
            >
              Add Funds
            </button>
            <button
              onClick={() => alert("Withdraw feature not implemented yet.")}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-500"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Ledger List */}
        <div className="col-span-1 md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
    </div>
  );
}
