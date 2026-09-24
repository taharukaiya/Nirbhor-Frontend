import { useState } from "react";
import { X, AlertCircle } from "./ui/Icons.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import { reportDispute } from "../services/api.js";

const REASONS = [
  "Inappropriate behavior or language",
  "Unresponsive or missing in action",
  "Work quality not as described",
  "Payment or scope dispute",
  "Spam or scam",
  "Other"
];

export default function ReportModal({ job, onClose, onSuccess }) {
  const { showError, showSuccess } = useToast();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!job) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!reason) {
      showError("Please select a reason for your report.");
      return;
    }
    if (!description.trim()) {
      showError("Please provide a description.");
      return;
    }

    setSubmitting(true);
    try {
      await reportDispute({
        jobId: job._id || job.id,
        reason,
        description: description.trim(),
      });
      showSuccess("Dispute submitted successfully. Our team will review it shortly.");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      showError(error.message || "Failed to submit dispute.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <h3 className="text-lg font-bold">Report an Issue</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Reason for Reporting
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">Select a reason...</option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                rows="4"
                placeholder="Please provide specific details about the issue..."
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Our support team will review your report and take appropriate action.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
