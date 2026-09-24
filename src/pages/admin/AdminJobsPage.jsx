import { useEffect, useState, useMemo } from "react";
import { getAdminJobs } from "../../services/api.js";
import { getAdminUsers } from "../../services/adminApi.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

// ── Helpers ──────────────────────────────────────────────────
function statusConfig(status) {
  const s = String(status || "").toUpperCase();
  const map = {
    OPEN: { label: "Open", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
    IN_PROGRESS: { label: "In Progress", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
    PAYMENT_PENDING: { label: "Payment Pending", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
    COMPLETED: { label: "Completed", cls: "bg-slate-500/15 text-slate-300 border-slate-500/30" },
    CANCELLED: { label: "Cancelled", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  };
  return map[s] || { label: s || "Unknown", cls: "bg-slate-600/20 text-slate-400 border-slate-600/30" };
}

function SkeletonRow() {
  return (
    <tr>
      {[...Array(7)].map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-3.5 rounded-full bg-slate-800/80 animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function AdminJobsPage() {
  useDocumentTitle("Admin — Jobs");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");

  useEffect(() => {
    setLoading(true);
    getAdminJobs()
      .then((res) => {
        if (Array.isArray(res)) setJobs(res);
        else if (Array.isArray(res?.jobs)) setJobs(res.jobs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(jobs.map((j) => j.category || j.serviceType).filter(Boolean));
    return ["ALL", ...Array.from(cats).sort()];
  }, [jobs]);

  const statuses = ["ALL", "OPEN", "IN_PROGRESS", "PAYMENT_PENDING", "COMPLETED", "CANCELLED"];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const now = Date.now();
    const dayMs = 86400000;

    return jobs.filter((job) => {
      // Search
      if (q) {
        const hirerName = (job.hirer?.name || "").toLowerCase();
        const providerName = (job.provider?.name || job.acceptedProvider?.name || "").toLowerCase();
        const title = (job.title || "").toLowerCase();
        if (!title.includes(q) && !hirerName.includes(q) && !providerName.includes(q)) return false;
      }

      // Status
      if (statusFilter !== "ALL") {
        const jobStatus = String(job.status || "").toUpperCase();
        if (jobStatus !== statusFilter) return false;
      }

      // Category
      if (categoryFilter !== "ALL") {
        const cat = job.category || job.serviceType || "";
        if (cat !== categoryFilter) return false;
      }

      // Date
      if (dateFilter !== "ALL") {
        const postedAt = new Date(job.createdAt || job.postedAt || 0).getTime();
        const daysAgo = Number(dateFilter) * dayMs;
        if (now - postedAt > daysAgo) return false;
      }

      return true;
    });
  }, [jobs, search, statusFilter, categoryFilter, dateFilter]);

  const stats = useMemo(() => ({
    total: jobs.length,
    open: jobs.filter((j) => String(j.status).toUpperCase() === "OPEN").length,
    inProgress: jobs.filter((j) => String(j.status).toUpperCase() === "IN_PROGRESS").length,
    completed: jobs.filter((j) => String(j.status).toUpperCase() === "COMPLETED").length,
  }), [jobs]);

  return (
    <div className="space-y-7 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-[#0066FF]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Job Ledger & Moderation</h1>
            <p className="text-xs text-slate-400">
              Audit all posted jobs, track hirers and providers, inspect budgets, payouts, and status lifecycles.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Jobs", value: stats.total, color: "text-white", bg: "bg-slate-800/60" },
          { label: "Open", value: stats.open, color: "text-emerald-300", bg: "bg-emerald-500/5 border-emerald-500/20" },
          { label: "In Progress", value: stats.inProgress, color: "text-blue-300", bg: "bg-blue-500/5 border-blue-500/20" },
          { label: "Completed", value: stats.completed, color: "text-slate-300", bg: "bg-slate-500/5 border-slate-500/20" },
        ].map((kpi) => (
          <div key={kpi.label} className={`rounded-2xl border border-slate-800 ${kpi.bg} p-4 transition hover:border-slate-700`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{kpi.label}</p>
            <p className={`mt-1.5 text-2xl font-black ${kpi.color}`}>{loading ? "—" : kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:flex-row sm:items-end sm:flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title, hirer, or provider..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-[#0066FF] focus:bg-slate-800 focus:ring-2 focus:ring-[#0066FF]/20"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800/60 py-2.5 px-3 text-xs text-white outline-none transition focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s === "ALL" ? "All Statuses" : s.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800/60 py-2.5 px-3 text-xs text-white outline-none transition focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Posted</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800/60 py-2.5 px-3 text-xs text-white outline-none transition focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
          >
            <option value="ALL">All Time</option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(search || statusFilter !== "ALL" || categoryFilter !== "ALL" || dateFilter !== "ALL") && (
          <button
            onClick={() => { setSearch(""); setStatusFilter("ALL"); setCategoryFilter("ALL"); setDateFilter("ALL"); }}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition"
          >
            Clear Filters
          </button>
        )}

        <span className="ml-auto text-xs font-semibold text-slate-500 self-end pb-0.5">
          {filtered.length} of {jobs.length} jobs
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {["Job Title & Category", "Hirer", "Service Provider", "Budget Range", "Payout Breakdown", "Status", "Posted"].map((h) => (
                  <th key={h} className="whitespace-nowrap p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {loading ? (
                [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm font-semibold">No jobs match your filters</p>
                      <p className="text-xs text-slate-600">Try adjusting your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((job) => {
                  const { label: statusLabel, cls: statusCls } = statusConfig(job.status);
                  const hirerId = job.hirer?._id || job.hirer?.id || job.hirer;
                  const hirerName = job.hirer?.name || "—";
                  const hirerEmail = job.hirer?.email || "";
                  const provider = job.provider || job.acceptedProvider || job.acceptedProposal?.provider;
                  const providerName = provider?.name || "—";
                  const providerEmail = provider?.email || "";
                  const providerId = provider?._id || provider?.id || "";
                  const budgetMin = Number(job.budget?.min || 0);
                  const budgetMax = Number(job.budget?.max || 0);
                  const isCompleted = String(job.status).toUpperCase() === "COMPLETED";
                  const payoutAmount = job.providerNetPayout || job.acceptedProposalAmount || job.acceptedProposal?.amount;
                  const platformFee = payoutAmount ? Math.round(payoutAmount * 0.05 * 100) / 100 : null;

                  return (
                    <tr
                      key={job._id || job.id}
                      className="group transition-colors hover:bg-white/[0.03]"
                    >
                      {/* Title & Category */}
                      <td className="p-4 max-w-[220px]">
                        <p className="truncate font-bold text-white group-hover:text-[#4d9fff] transition-colors">
                          {job.title}
                        </p>
                        <span className="mt-0.5 inline-block rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                          {job.category || job.serviceType || "General"}
                        </span>
                      </td>

                      {/* Hirer */}
                      <td className="p-4">
                        {hirerName !== "—" ? (
                          <div>
                            <p className="font-semibold text-slate-200">{hirerName}</p>
                            {hirerEmail && <p className="text-[10px] text-slate-500 truncate max-w-[130px]">{hirerEmail}</p>}
                            {hirerId && (
                              <a
                                href={`/user/${hirerId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#0066FF] hover:underline"
                              >
                                View Profile ↗
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600 italic">—</span>
                        )}
                      </td>

                      {/* Provider */}
                      <td className="p-4">
                        {providerName !== "—" ? (
                          <div>
                            <p className="font-semibold text-slate-200">{providerName}</p>
                            {providerEmail && <p className="text-[10px] text-slate-500 truncate max-w-[130px]">{providerEmail}</p>}
                            {providerId && (
                              <a
                                href={`/user/${providerId}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#0066FF] hover:underline"
                              >
                                View Profile ↗
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600 italic">Not assigned</span>
                        )}
                      </td>

                      {/* Budget Range (raw, never deducted) */}
                      <td className="p-4 font-mono">
                        <span className="font-bold text-emerald-400">
                          ৳{budgetMin.toLocaleString()}
                        </span>
                        {budgetMax > budgetMin && (
                          <>
                            <span className="text-slate-500"> – </span>
                            <span className="font-bold text-emerald-400">৳{budgetMax.toLocaleString()}</span>
                          </>
                        )}
                        <p className="mt-0.5 text-[10px] text-slate-500">{job.budget?.type || "FIXED"}</p>
                      </td>

                      {/* Payout Breakdown (only for completed jobs) */}
                      <td className="p-4">
                        {isCompleted && payoutAmount ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500">Hirer paid:</span>
                              <span className="text-xs font-bold text-white">৳{Number(payoutAmount).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500">Platform (5%):</span>
                              <span className="text-xs font-semibold text-amber-400">
                                ৳{platformFee?.toLocaleString() || "—"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500">Provider net:</span>
                              <span className="text-xs font-bold text-emerald-400">
                                ৳{(Number(payoutAmount) - (platformFee || 0)).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-600 italic text-[10px]">
                            {isCompleted ? "—" : "Pending settlement"}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold ${statusCls}`}>
                          {statusLabel}
                        </span>
                      </td>

                      {/* Posted Date */}
                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {job.createdAt || job.postedAt
                          ? new Date(job.createdAt || job.postedAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
