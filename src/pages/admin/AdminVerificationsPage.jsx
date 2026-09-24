import { useEffect, useState } from "react";
import { getVerifications, reviewNid } from "../../services/adminApi.js";
import { useToast } from "../../contexts/ToastContext.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

export function AdminVerificationsPage() {
  useDocumentTitle("Admin  Verifications");
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const { showSuccess, showError } = useToast();

  function loadData() {
    setLoading(true);
    getVerifications(filterStatus)
      .then((res) => {
        if (res?.verifications) setVerifications(res.verifications);
      })
      .catch((err) => showError(err.message || "Failed to load verifications"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  async function handleAction(approved) {
    if (!selectedItem) return;
    setProcessing(true);
    try {
      await reviewNid(selectedItem.userId, approved, rejectReason);
      showSuccess(approved ? "NID approved successfully" : "NID rejected with reason");
      setSelectedItem(null);
      setRejectReason("");
      loadData();
    } catch (err) {
      showError(err.message || "Failed to submit verification action");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">NID Identity Verification Queue</h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Review user national identity document numbers, date of birth, and approve authentic accounts
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 text-xs font-semibold">
          <button
            onClick={() => setFilterStatus("pending")}
            className={`rounded-lg px-3 py-1.5 transition ${
              filterStatus === "pending"
                ? "bg-[#0066FF] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setFilterStatus("all")}
            className={`rounded-lg px-3 py-1.5 transition ${
              filterStatus === "all"
                ? "bg-[#0066FF] text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
            }`}
          >
            All Submissions
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-[#0066FF]" />
        </div>
      ) : verifications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-12 text-center text-xs text-slate-600 dark:text-slate-400">
          No verification requests found matching the filter criteria.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-100 dark:bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">NID Number</th>
                <th className="p-4">Date of Birth</th>
                <th className="p-4">Submitted At</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {verifications.map((item) => (
                <tr key={item.id} className="group transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:shadow-[inset_2px_0_0_0_#0066FF]">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">{item.email}</div>
                  </td>
                  <td className="p-4 font-mono font-semibold text-blue-300">{item.nidNumber}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    {item.dateOfBirth
                      ? new Date(item.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    {new Date(item.submittedAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded px-2.5 py-1 text-[10px] font-bold ${
                        item.nidVerified
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : item.status === "PENDING"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="rounded-lg bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 font-bold text-blue-300 hover:bg-blue-600/30"
                    >
                      Inspect & Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg space-y-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">NID Inspection & Verification</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Applicant Name:</span>{" "}
                <span className="font-bold text-slate-900 dark:text-white">{selectedItem.name}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Email:</span>{" "}
                <span className="text-slate-700 dark:text-slate-300">{selectedItem.email}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Submitted NID:</span>{" "}
                <span className="font-mono font-bold text-blue-400">{selectedItem.nidNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Date of Birth:</span>{" "}
                <span className="text-slate-700 dark:text-slate-300">
                  {selectedItem.dateOfBirth
                    ? new Date(selectedItem.dateOfBirth).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Rejection / Feedback Notes (Optional if approving)
              </label>
              <textarea
                rows="3"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason if rejecting submission..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0066FF]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => handleAction(false)}
                disabled={processing}
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50"
              >
                Reject Verification
              </button>
              <button
                onClick={() => handleAction(true)}
                disabled={processing}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50"
              >
                Approve NID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
