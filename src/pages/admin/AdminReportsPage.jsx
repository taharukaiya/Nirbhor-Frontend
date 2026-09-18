import { useEffect, useState, useMemo } from "react";
import { getFinancialReports, changeAdminPassword } from "../../services/adminApi.js";
import { useAdmin } from "../../contexts/useAdmin.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatTaka(amount) {
  return `৳${Number(amount || 0).toLocaleString("en-BD", { maximumFractionDigits: 0 })}`;
}

function StatCard({ label, value, sub, color = "blue" }) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  };
  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
      {sub && <p className="mt-1 text-xs opacity-60">{sub}</p>}
    </div>
  );
}

export default function AdminReportsPage() {
  useDocumentTitle("Admin  Reports");
  const { isSuperAdmin, signOut } = useAdmin();
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Password change state
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getFinancialReports(period, year)
      .then((res) => setData(res.data || null))
      .catch((err) => setError(err.message || "Failed to load reports"))
      .finally(() => setLoading(false));
  }, [period, year]);

  const chartData = useMemo(() => {
    if (!data?.series) return [];
    return data.series.map((item) => ({
      name:
        period === "monthly"
          ? MONTHS[(item._id.month || 1) - 1]
          : period === "weekly"
          ? `W${item._id.week}`
          : `${item._id.day}/${item._id.month}`,
      gross: item.grossVolume || 0,
      fee: item.platformFee || 0,
      payout: item.providerPayout || 0,
      transactions: item.count || 0,
    }));
  }, [data, period]);

  async function handlePasswordChange(e) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (pwForm.next.length < 8) {
      setPwMsg({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    setPwLoading(true);
    setPwMsg(null);
    try {
      const res = await changeAdminPassword(pwForm.current, pwForm.next);
      setPwMsg({ type: "success", text: res.message || "Password changed. Logging out..." });
      setTimeout(() => signOut(), 2000);
    } catch (err) {
      setPwMsg({ type: "error", text: err.message || "Failed to change password." });
    } finally {
      setPwLoading(false);
    }
  }



  const yt = data?.yearTotals;
  const at = data?.allTimeTotals;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0066FF]">Admin</span>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">Financial Reports</h1>
          <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">Platform revenue, transactions, and payout data.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowPwForm((v) => !v)}
          className="self-start rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-slate-600 hover:text-slate-900 dark:text-white sm:self-auto"
        >
          🔑 Change Password
        </button>
      </div>

      {/* Password Change Form */}
      {showPwForm && (
        <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
          <h2 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Change Admin Password</h2>
          <form onSubmit={handlePasswordChange} className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Current Password</label>
              <input
                type="password"
                value={pwForm.current}
                onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                required
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 outline-none focus:border-[#0066FF]"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">New Password</label>
              <input
                type="password"
                value={pwForm.next}
                onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                required
                minLength={8}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 outline-none focus:border-[#0066FF]"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Confirm New Password</label>
              <input
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                required
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 outline-none focus:border-[#0066FF]"
                placeholder="Repeat new password"
              />
            </div>
            {pwMsg && (
              <div className={`sm:col-span-3 rounded-xl px-4 py-2.5 text-xs font-semibold ${pwMsg.type === "error" ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                {pwMsg.text}
              </div>
            )}
            <div className="flex gap-3 sm:col-span-3">
              <button
                type="submit"
                disabled={pwLoading}
                className="rounded-xl bg-[#0066FF] px-5 py-2 text-xs font-bold text-slate-900 dark:text-white hover:bg-blue-600 disabled:opacity-60"
              >
                {pwLoading ? "Saving..." : "Save New Password"}
              </button>
              <button
                type="button"
                onClick={() => { setShowPwForm(false); setPwMsg(null); }}
                className="rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
          {["monthly", "weekly", "daily"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs font-bold capitalize transition ${
                period === p ? "bg-[#0066FF] text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#0066FF]"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-[#0066FF]" />
        </div>
      )}

      {/* KPI Cards */}
      {!loading && data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label={`${year} Gross Volume`} value={formatTaka(yt?.totalGross)} sub="All completed payments" color="blue" />
            <StatCard label={`${year} Platform Revenue`} value={formatTaka(yt?.totalFee)} sub="5% commission" color="green" />
            <StatCard label={`${year} Provider Payouts`} value={formatTaka(yt?.totalPayout)} sub="Net to providers" color="purple" />
            <StatCard label={`${year} Transactions`} value={String(yt?.totalTransactions || 0)} sub="Paid jobs" color="amber" />
          </div>

          {/* All-time summary */}
          <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-6">
            <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">All-Time Platform Totals</h3>
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Gross Volume</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{formatTaka(at?.totalGross)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Platform Revenue</p>
                <p className="text-lg font-black text-emerald-400">{formatTaka(at?.totalFee)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Provider Payouts</p>
                <p className="text-lg font-black text-purple-400">{formatTaka(at?.totalPayout)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Transactions</p>
                <p className="text-lg font-black text-amber-400">{at?.totalTransactions || 0}</p>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          {chartData.length > 0 ? (
            <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-6">
              <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Revenue Overview ({period})</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `৳${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(v, name) => [formatTaka(v), name]}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
                  <Bar dataKey="gross" name="Gross Volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fee" name="Platform Fee" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="payout" name="Provider Payout" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No payment data found for this period.
            </div>
          )}

          {/* Transaction trend */}
          {chartData.length > 0 && (
            <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-6">
              <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Transaction Volume</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", fontSize: "12px" }}
                  />
                  <Line type="monotone" dataKey="transactions" name="Transactions" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
