import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminMetrics } from "../../services/adminApi.js";

export function AdminOverviewPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminMetrics()
      .then((res) => {
        if (res?.data) setData(res.data);
      })
      .catch((err) => setError(err.message || "Failed to load metrics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-[#0066FF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-300">
        {error}
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentUsers = data?.recentUsers || [];
  const recentJobs = data?.recentJobs || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">System Overview</h1>
        <p className="mt-1 text-xs text-slate-400">
          Real-time metrics, platform revenue from 5% commission, and recent activity
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Users
            </span>
            <span className="text-xl">👥</span>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white">{stats.totalUsers || 0}</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-semibold">
            {stats.nidVerificationRate || 0}% NID Verified
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Jobs
            </span>
            <span className="text-xl">💼</span>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white">{stats.activeJobs || 0}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Out of {stats.totalJobs || 0} total requests
          </div>
        </div>

        {stats.totalPlatformCommission !== undefined && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Platform Revenue (5%)
              </span>
              <span className="text-xl">💰</span>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-emerald-400">
              ৳{Number(stats.totalPlatformCommission || 0).toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              Gross Volume: ৳{Number(stats.totalGrossPaymentVolume || 0).toLocaleString()}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Actions
            </span>
            <span className="text-xl">⚠️</span>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-extrabold text-amber-400">
              {stats.pendingNidCount || 0} NID
            </span>
            <span className="text-2xl font-extrabold text-rose-400">
              {stats.openDisputes || 0} Disputes
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Requires administrative review</div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Registered Users */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Recent Users
            </h2>
            <Link to="/admin/users" className="text-xs font-bold text-[#0066FF] hover:underline">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">NID Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentUsers.map((u) => (
                  <tr key={u._id || u.email}>
                    <td className="py-2.5 font-semibold text-white">{u.name}</td>
                    <td className="py-2.5 text-slate-400">{u.activeMode || u.role}</td>
                    <td className="py-2.5">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          u.nidVerified
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-amber-500/20 text-amber-300"
                        }`}
                      >
                        {u.nidVerified ? "VERIFIED" : "UNVERIFIED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Job Posts */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Recent Job Posts
            </h2>
            <Link to="/admin/jobs" className="text-xs font-bold text-[#0066FF] hover:underline">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentJobs.map((j) => (
                  <tr key={j._id || j.title}>
                    <td className="py-2.5 font-semibold text-white truncate max-w-[150px]">
                      {j.title}
                    </td>
                    <td className="py-2.5 text-slate-400">{j.category}</td>
                    <td className="py-2.5">
                      <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                        {j.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
