/**
 * @file ProviderDashboardPage.jsx
 * @description Dashboard for Service Providers to track their job applications and active engagements.
 *
 * Architectural Intent:
 * - Data Fetching & Metrics: Uses `getProviderProposals` to fetch both individual application histories and aggregated metrics (Accepted, Pending, etc.).
 * - Status Filtering: Client-side filtering mechanism to sort proposals by their lifecycle status.
 * - Action Delegation: Provides contextual actions (Message, Report, Review) based on the specific status of the job proposal.
 * - Inline Components: Encapsulates the `ReviewModal` locally for submitting feedback on completed jobs.
 */
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { getProviderProposals, submitReview, getJobReviews } from "../services/api.js";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  Star,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "../components/ui/Icons.jsx";
import ReportModal from "../components/ReportModal.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

const STATUS_FILTERS = ["ALL", "PENDING", "ACCEPTED", "REJECTED", "COMPLETED"];

function ReviewModal({ job, onClose, onSuccess }) {
  const { showError, showSuccess } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!job) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      showError("Please select a rating between 1 and 5 stars.");
      return;
    }

    setSubmitting(true);
    try {
      await submitReview(job._id, {
        rating,
        comment: comment.trim(),
        revieweeId: job.hirer?._id || job.hirer, // Rate the hirer
      });
      showSuccess("Review submitted successfully!");
      onSuccess(job._id);
    } catch (error) {
      showError(error.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl glass-panel shadow-2xl">
        <div className="border-b border-slate-100 px-6 py-5 bg-white/40">
          <h3 className="text-xl font-black tracking-tight text-[#011F50]">Rate Hirer</h3>
          <p className="mt-1 text-sm text-slate-500">
            How was your experience working with the hirer for "{job.title}"?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-8 flex justify-center gap-2 rounded-2xl bg-white/40 py-6 border border-white/60">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-9 w-9 ${
                    star <= rating ? "fill-amber-400 text-amber-400 drop-shadow-md" : "text-slate-200"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/50 p-4 text-sm focus:border-[#0066FF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0066FF]/10 transition-all resize-none"
                rows="4"
                placeholder="Share your experience working on this job..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="inline-flex justify-center items-center gap-2 rounded-xl bg-[#0066FF] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#0066FF]/20 transition hover:bg-[#011F50] disabled:opacity-50"
              >
                {submitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Submit Review
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  , document.body);
}

export default function ProviderDashboardPage() {
  useDocumentTitle("Provider Dashboard");
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showError } = useToast();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [reviewJob, setReviewJob] = useState(null);
  const [reportJob, setReportJob] = useState(null);
  const [reviewedJobs, setReviewedJobs] = useState(new Set());

  const [metrics, setMetrics] = useState({
    totalApplied: 0,
    accepted: 0,
    pending: 0,
    rejected: 0,
    completed: 0,
  });

  const isProvider = useMemo(
    () => currentUser?.role === "SERVICE_PROVIDER" || currentUser?.activeMode === "SERVICE_PROVIDER",
    [currentUser],
  );

  useEffect(() => {
    if (!isProvider) return;

    const controller = new AbortController();
    setLoading(true);
    getProviderProposals(controller.signal)
      .then((data) => {
        if (data && data.proposals) {
          setJobs(data.proposals);
          if (data.metrics) {
            setMetrics(data.metrics);
          }
            // Review fetching for all jobs isn't currently supported by a single endpoint
            // For now, we will rely on individual job clicks to check if reviewed.
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          showError(err.message || "Failed to load applied jobs.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [isProvider, currentUser]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchStatus =
        statusFilter === "ALL" ||
        String(job.status).toUpperCase() === statusFilter;

      return matchStatus;
    });
  }, [jobs, statusFilter]);

  if (!isProvider) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
          <p className="text-slate-500">
            You must be in Service Provider mode to view your job applications.
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-[#0066FF] px-6 py-2 font-medium text-white hover:bg-[#011F50]"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden pb-20 pt-24">
      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066FF]/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[30rem] w-[30rem] translate-x-1/3 translate-y-1/3 rounded-full bg-[#0066FF]/5 blur-[120px]" />

      <main className="mx-auto mt-8 w-full max-w-5xl flex-1 px-6 relative z-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#011F50] sm:text-3xl">
              My Applications
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track the status of jobs you have applied to.
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="glass-panel rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <p className="text-sm font-medium text-slate-500">Total Applied</p>
            <p className="mt-2 text-3xl font-bold text-[#011F50]">{metrics.totalApplied}</p>
          </div>
          <div className="glass-panel rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <p className="text-sm font-medium text-slate-500">Accepted</p>
            <p className="mt-2 text-3xl font-bold text-[#00C853]">{metrics.accepted}</p>
          </div>
          <div className="glass-panel rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <p className="mt-2 text-3xl font-bold text-amber-500">{metrics.pending}</p>
          </div>
          <div className="glass-panel rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-[#0066FF]">{metrics.completed}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === status
                  ? "bg-[#0066FF] text-white"
                  : "bg-white/50 backdrop-blur-sm text-slate-600 shadow-sm hover:bg-white border border-slate-200"
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex py-20 justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066FF]/20 border-t-[#0066FF]" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center glass-panel border-dashed border-slate-300 rounded-2xl py-24 text-center">
            <Briefcase className="mb-4 h-12 w-12 text-slate-300" />
            <h3 className="mb-1 text-lg font-bold text-slate-900">
              No applications found
            </h3>
            <p className="max-w-sm text-sm text-slate-500">
              {statusFilter !== "ALL"
                ? `You don't have any applications with the status "${statusFilter}".`
                : "You haven't applied to any jobs yet. Start exploring available jobs!"}
            </p>
            {statusFilter === "ALL" && (
              <Link
                to="/jobs"
                className="mt-6 rounded-xl bg-[#0066FF] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#011F50]"
              >
                Find Jobs
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => {
              const statusColors = {
                PENDING: "bg-amber-100 text-amber-700",
                ACCEPTED: "bg-[#00C853]/10 text-[#00C853]",
                REJECTED: "bg-red-100 text-red-700",
                COMPLETED: "bg-[#0066FF]/10 text-[#0066FF]",
              };

              const statusColor = statusColors[job.status] || "bg-slate-100 text-slate-700";

              return (
                <div
                  key={job.proposalId}
                  className="group glass-panel rounded-2xl p-5 transition-all duration-300 hover:border-[#0066FF]/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${statusColor}`}
                        >
                          {job.status}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          Applied
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                        {job.job?.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.job?.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.job?.location?.district || "Bangladesh"}
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-[#0066FF]">
                        {job.job?.budget?.max
                          ? `${job.job.budget.min} - ${job.job.budget.max} BDT`
                          : `${job.job?.budget?.min || 500} BDT`}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                    <div className="flex gap-4 text-sm text-slate-500">
                      {job.job?.deadline && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>
                            Deadline: {new Date(job.job.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                      {(job.status === "ACCEPTED" || job.status === "IN_PROGRESS") && (
                        <>
                          <Link
                            to={`/chat/${job.job?._id}/${job.proposalId}`}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white hover:text-[#011F50]"
                          >
                            Message Hirer
                          </Link>
                          <button
                            onClick={() => setReportJob(job.job)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                          >
                            <AlertCircle className="h-4 w-4" /> Report Issue
                          </button>
                        </>
                      )}
                      
                      {["IN_PROGRESS", "COMPLETED"].includes(job.status) && !(job.hasReviewed || reviewedJobs.has(job.job?._id)) && (
                        <button
                          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-600 transition hover:bg-yellow-100 hover:text-yellow-700 w-full sm:w-auto justify-center"
                          onClick={() => setReviewJob(job.job)}
                        >
                          <Star className="h-4 w-4" /> Review
                        </button>
                      )}
                      {["IN_PROGRESS", "COMPLETED"].includes(job.status) && (job.hasReviewed || reviewedJobs.has(job.job?._id)) && (
                         <button
                           disabled
                           className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400"
                         >
                           <CheckCircle className="h-4 w-4" /> Reviewed
                         </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {reviewJob && (
        <ReviewModal
          job={reviewJob}
          onClose={() => setReviewJob(null)}
          onSuccess={(jobId) => {
            setReviewedJobs((prev) => new Set([...prev, jobId]));
            setReviewJob(null);
          }}
        />
      )}

      {reportJob && (
        <ReportModal
          job={reportJob}
          onClose={() => setReportJob(null)}
        />
      )}
    </div>
  );
}
