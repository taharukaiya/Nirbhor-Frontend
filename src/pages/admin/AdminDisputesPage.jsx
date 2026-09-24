import { useEffect, useState } from "react";
import { getDisputeDetails, getDisputes, resolveDispute } from "../../services/adminApi.js";
import { useToast } from "../../contexts/ToastContext.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

export function AdminDisputesPage() {
  useDocumentTitle("Admin  Disputes");
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisputeId, setSelectedDisputeId] = useState(null);
  const [disputeDetail, setDisputeDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [decision, setDecision] = useState("REFUND_HIRER");
  const [resolutionText, setResolutionText] = useState("");
  const [resolving, setResolving] = useState(false);
  const { showSuccess, showError } = useToast();

  function loadDisputes() {
    setLoading(true);
    getDisputes()
      .then((res) => {
        if (res?.disputes) setDisputes(res.disputes);
      })
      .catch((err) => showError(err.message || "Failed to load disputes"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadDisputes();
  }, []);

  function handleInspect(id) {
    setSelectedDisputeId(id);
    setDetailLoading(true);
    getDisputeDetails(id)
      .then((res) => {
        if (res?.dispute) setDisputeDetail(res.dispute);
      })
      .catch((err) => showError(err.message || "Failed to load dispute details"))
      .finally(() => setDetailLoading(false));
  }

  async function handleResolve() {
    if (!selectedDisputeId || !decision) return;
    setResolving(true);
    try {
      await resolveDispute(selectedDisputeId, decision, resolutionText);
      showSuccess(`Dispute resolved with decision: ${decision}`);
      setSelectedDisputeId(null);
      setDisputeDetail(null);
      setResolutionText("");
      loadDisputes();
    } catch (err) {
      showError(err.message || "Failed to resolve dispute");
    } finally {
      setResolving(false);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dispute Resolution Console</h1>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Review escalated marketplace job disputes, examine escrow payments, read chat history, and issue binding resolutions
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-[#0066FF]" />
        </div>
      ) : disputes.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-12 text-center text-xs text-slate-600 dark:text-slate-400">
          No dispute cases found in the platform record.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-100 dark:bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <tr>
                <th className="p-4">Job Title</th>
                <th className="p-4">Raised By</th>
                <th className="p-4">Reason Summary</th>
                <th className="p-4">Opened At</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {disputes.map((d) => (
                <tr key={d._id || d.id} className="group transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:shadow-[inset_2px_0_0_0_#0066FF]">
                  <td className="p-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                    {d.job?.title || "Associated Job"}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{d.openedBy?.name || "User"}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{d.openedBy?.email}</div>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">{d.reason}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded px-2.5 py-1 text-[10px] font-bold ${
                        d.status === "RESOLVED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleInspect(d._id || d.id)}
                      className="rounded-lg bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 font-bold text-blue-300 hover:bg-blue-600/30"
                    >
                      Inspect Console
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dispute Incident Modal */}
      {selectedDisputeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Dispute Incident Console</h3>
              <button
                onClick={() => {
                  setSelectedDisputeId(null);
                  setDisputeDetail(null);
                }}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              >
                ✕
              </button>
            </div>

            {detailLoading || !disputeDetail ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-[#0066FF]" />
              </div>
            ) : (
              <div className="space-y-5 text-xs">
                {/* Job & Escrow Details */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Job Details
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{disputeDetail.job?.title}</div>
                    <div className="text-slate-600 dark:text-slate-400">{disputeDetail.job?.description}</div>
                    <div className="text-emerald-400 font-semibold">
                      Budget: ৳{disputeDetail.job?.budget?.min || 0} - ৳{disputeDetail.job?.budget?.max || 0}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Escrow Payment State
                    </div>
                    {disputeDetail.payment ? (
                      <>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          Gross Amount: ৳{disputeDetail.payment.amount}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400">
                          Platform Fee (5%): ৳{disputeDetail.payment.platformFee}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400">
                          Provider Net: ৳{disputeDetail.payment.providerNetPayout}
                        </div>
                        <div className="inline-block rounded bg-amber-500/20 px-2 py-0.5 font-bold text-amber-300">
                          Status: {disputeDetail.payment.status}
                        </div>
                      </>
                    ) : (
                      <div className="text-slate-500 dark:text-slate-400">No payment transaction linked</div>
                    )}
                  </div>
                </div>

                {/* Dispute Reason */}
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                    Reason Statement (Raised by {disputeDetail.openedBy?.name})
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-medium">{disputeDetail.reason}</div>
                </div>

                {/* Read-Only Chat History */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Read-Only Job Chat Log ({disputeDetail.chatLogs?.length || 0} Messages)
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 space-y-2">
                    {disputeDetail.chatLogs?.length === 0 ? (
                      <div className="text-slate-500 dark:text-slate-400 italic">No chat messages recorded</div>
                    ) : (
                      disputeDetail.chatLogs?.map((msg, idx) => (
                        <div key={idx} className="border-b border-slate-900 pb-1.5">
                          <span className="font-bold text-blue-400">
                            {msg.sender?.name || "Participant"}:
                          </span>{" "}
                          <span className="text-slate-700 dark:text-slate-300">{msg.body}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Resolution Decision Tools */}
                {disputeDetail.status === "RESOLVED" ? (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Dispute Case Closed
                    </div>
                    <div className="text-slate-900 dark:text-white font-bold">
                      Resolution: {disputeDetail.resolution}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Binding Administrative Resolution
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setDecision("REFUND_HIRER")}
                        className={`flex-1 rounded-xl border p-3 font-bold transition ${
                          decision === "REFUND_HIRER"
                            ? "border-rose-500 bg-rose-500/20 text-rose-300"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        Refund Hirer ↩️
                      </button>
                      <button
                        type="button"
                        onClick={() => setDecision("PAY_PROVIDER")}
                        className={`flex-1 rounded-xl border p-3 font-bold transition ${
                          decision === "PAY_PROVIDER"
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        Release to Provider 💸
                      </button>
                      <button
                        type="button"
                        onClick={() => setDecision("SPLIT_PAYOUT")}
                        className={`flex-1 rounded-xl border p-3 font-bold transition ${
                          decision === "SPLIT_PAYOUT"
                            ? "border-amber-500 bg-amber-500/20 text-amber-300"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        Split Payout ⚖️
                      </button>
                    </div>

                    <textarea
                      rows="2"
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="Enter official resolution notes for audit records..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0066FF]"
                    />

                    <button
                      onClick={handleResolve}
                      disabled={resolving}
                      className="w-full rounded-xl bg-[#0066FF] py-3 font-bold text-slate-900 dark:text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 disabled:opacity-50"
                    >
                      {resolving ? "Executing Resolution..." : "Issue Binding Resolution"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
