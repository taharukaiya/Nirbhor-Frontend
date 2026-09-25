/**
 * AdminMessageReportsPage
 * 
 * Architectural Intent:
 * RBAC-protected administrative view for managing and overseeing platform messagereports.
 * Integrates directly with the `adminApi.js` service to perform privileged mutations (e.g., bans, approvals, deletions).
 * 
 * Security:
 * Strictly enclosed by the `<AdminRoute>` wrapper. Requires a valid Admin JWT and specific RBAC permissions matrix.
 */
import { useEffect, useState } from "react";
import { getMessageReports, moderateMessageReport } from "../../services/adminApi.js";
import { useToast } from "../../contexts/ToastContext.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

const REASON_LABELS = {
  harassment: "Harassment",
  inappropriate_language: "Inappropriate Language",
  attempted_circumvention: "Circumvention Attempt",
  scam: "Scam",
  spam: "Spam",
  other: "Other",
};

const STATUS_CFG = {
  pending: { label: "Pending", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  reviewed: { label: "Reviewed", cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  actioned: { label: "Actioned", cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  dismissed: { label: "Dismissed", cls: "bg-slate-500/15 text-slate-400 border-slate-600/30" },
};

export function AdminMessageReportsPage() {
  useDocumentTitle("Admin — Message Reports");
  const [reports, setReports] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [moderating, setModerating] = useState(false);
  const [action, setAction] = useState("reviewed");
  const [adminNote, setAdminNote] = useState("");
  const [suspendUser, setSuspendUser] = useState(false);
  const { showSuccess, showError } = useToast();

  function load(status = statusFilter) {
    setLoading(true);
    getMessageReports(status ? { status } : {})
      .then((res) => {
        if (res?.data?.reports) {
          setReports(res.data.reports);
          setPendingCount(res.data.pendingCount || 0);
        }
      })
      .catch((err) => showError(err.message || "Failed to load reports"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [statusFilter]);

  async function handleModerate(e) {
    e.preventDefault();
    if (!selected || moderating) return;
    setModerating(true);
    try {
      await moderateMessageReport(selected._id || selected.id, {
        status: action,
        adminNote,
        suspendUser: suspendUser && action === "actioned",
      });
      showSuccess(`Report marked as "${action}"${suspendUser && action === "actioned" ? " and user suspended" : ""}.`);
      setSelected(null);
      setAdminNote("");
      setSuspendUser(false);
      load();
    } catch (err) {
      showError(err.message || "Moderation failed");
    } finally {
      setModerating(false);
    }
  }

  const statusTabs = [
    { value: "", label: "All", count: null },
    { value: "pending", label: "Pending", count: pendingCount },
    { value: "reviewed", label: "Reviewed", count: null },
    { value: "actioned", label: "Actioned", count: null },
    { value: "dismissed", label: "Dismissed", count: null },
  ];

  return (
    <div className="space-y-7 font-sans">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Message Report Moderation</h1>
          <p className="text-xs text-slate-400">
            Review user-reported chat messages, take action on violations, and suspend accounts as needed.
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="ml-auto rounded-full border border-rose-500/30 bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300">
            {pendingCount} Pending
          </span>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${
              statusFilter === tab.value
                ? "border-[#0066FF] bg-[#0066FF] text-white"
                : "border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500 hover:text-white"
            }`}
          >
            {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span className="rounded-full bg-rose-500/20 px-1.5 py-0.5 text-[10px] text-rose-300">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {["Reported By", "Reported User", "Message Snapshot", "Reason", "Status", "Reported At", "Actions"].map((h) => (
                  <th key={h} className="whitespace-nowrap p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="p-4">
                        <div className="h-3.5 rounded-full bg-slate-800/80 animate-pulse" style={{ width: `${50 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-semibold">No reports found</p>
                      <p className="text-xs text-slate-600">The queue is clear for the selected filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const { cls: sCls, label: sLabel } = STATUS_CFG[report.status] || STATUS_CFG.pending;
                  return (
                    <tr key={report._id} className="group transition-colors hover:bg-white/[0.03]">
                      {/* Reporter */}
                      <td className="p-4">
                        <p className="font-semibold text-slate-200">{report.reporterId?.name || "Unknown"}</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[110px]">{report.reporterId?.email}</p>
                      </td>

                      {/* Reported User */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-200">{report.reportedUserId?.name || "Unknown"}</p>
                          {report.reportedUserId?.suspended && (
                            <span className="rounded border border-rose-500/30 bg-rose-500/15 px-1.5 py-0.5 text-[9px] font-bold text-rose-400">
                              SUSPENDED
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate max-w-[110px]">{report.reportedUserId?.email}</p>
                      </td>

                      {/* Message Snapshot */}
                      <td className="p-4 max-w-[200px]">
                        <p className="truncate italic text-slate-400">"{report.snapshotContent}"</p>
                      </td>

                      {/* Reason */}
                      <td className="p-4">
                        <span className="rounded-lg bg-slate-800/80 px-2.5 py-1 font-semibold text-slate-300">
                          {REASON_LABELS[report.reason] || report.reason}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold ${sCls}`}>
                          {sLabel}
                        </span>
                      </td>

                      {/* Reported At */}
                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <button
                          disabled={report.status !== "pending"}
                          onClick={() => {
                            setSelected(report);
                            setAction("reviewed");
                            setAdminNote(report.adminNote || "");
                            setSuspendUser(false);
                          }}
                          className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold transition ${
                            report.status === "pending"
                              ? "border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                              : "border-slate-700 bg-slate-800/50 text-slate-500 cursor-not-allowed opacity-60"
                          }`}
                        >
                          {report.status === "pending" ? "Review" : "Resolved"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderation Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-extrabold text-white">Moderate Report</h3>
              <button
                onClick={() => setSelected(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Message Detail */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reported Message</span>
                <p className="mt-1 italic text-slate-300">"{selected.snapshotContent}"</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reported By</span>
                  <p className="mt-1 font-semibold text-slate-200">{selected.reporterId?.name}</p>
                  <p className="text-[10px] text-slate-500">{selected.reporterId?.email}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reported User</span>
                  <p className="mt-1 font-semibold text-slate-200">{selected.reportedUserId?.name}</p>
                  <p className="text-[10px] text-slate-500">{selected.reportedUserId?.email}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reason</span>
                <p className="mt-1 text-amber-300 font-semibold">{REASON_LABELS[selected.reason] || selected.reason}</p>
              </div>
            </div>

            <form onSubmit={handleModerate} className="space-y-4">
              {/* Action selection */}
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Action</label>
                <div className="flex gap-2.5">
                  {[
                    { value: "reviewed", label: "Mark Reviewed", cls: "border-blue-500 bg-blue-500/20 text-blue-300", inactiveCls: "border-slate-700 bg-slate-800/60 text-slate-400" },
                    { value: "actioned", label: "Take Action", cls: "border-rose-500 bg-rose-500/20 text-rose-300", inactiveCls: "border-slate-700 bg-slate-800/60 text-slate-400" },
                    { value: "dismissed", label: "Dismiss", cls: "border-slate-500 bg-slate-500/20 text-slate-300", inactiveCls: "border-slate-700 bg-slate-800/60 text-slate-400" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAction(opt.value)}
                      className={`flex-1 rounded-xl border py-2.5 text-xs font-bold transition ${action === opt.value ? opt.cls : opt.inactiveCls}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suspend User option (only when actioning) */}
              {action === "actioned" && (
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
                  <input
                    type="checkbox"
                    checked={suspendUser}
                    onChange={(e) => setSuspendUser(e.target.checked)}
                    className="h-4 w-4 cursor-pointer accent-rose-500"
                  />
                  <span className="text-xs font-bold text-rose-300">
                    Also suspend "{selected.reportedUserId?.name}" from the platform
                  </span>
                </label>
              )}

              {/* Admin Note */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin Note (optional)</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder="Internal note for audit records..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-3 text-xs text-white outline-none placeholder-slate-500 transition focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800/60 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={moderating}
                  className="flex-1 rounded-xl bg-[#0066FF] py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 disabled:opacity-50 transition"
                >
                  {moderating ? "Submitting..." : "Submit Decision"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
