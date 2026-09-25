/**
 * @file HirerDashboardPage.jsx
 * @description Central management hub for Hirers to track jobs, view applications, and manage payments.
 *
 * Architectural Intent:
 * - Data Aggregation: Fetches and consolidates job postings, applicant tracking, and status metrics in a single view.
 * - Complex State Management: Manages overlapping local states for slide-over panels (applicants), modals (payment, review, report, delete), and list filtering.
 * - Workflow Orchestration: Controls the complete lifecycle of a job post from OPEN -> IN_PROGRESS -> PAYMENT_PENDING -> COMPLETED.
 * - Component Delegation: Relies on `PaymentModal` and `ReportModal` to handle specific sub-flows without cluttering the main dashboard state.
 */
import {
  getHirerJobs,
  getJobApplicants,
  initiateChat,
  deleteJob,
  acceptJobProposal,
  rejectJobProposal,
  submitReview,
  updateReview,
  getJobReviews,
  releaseJobPayment,
} from "../services/api.js";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { useToast } from "../contexts/ToastContext.jsx";
import PaymentModal from "../components/PaymentModal.jsx";
import ReportModal from "../components/ReportModal.jsx";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import {
  Briefcase,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  Plus,
  Search,
  X,
  MessageSquare,
  Star,
  DollarSign,
  ArrowRight,
  UserCheck,
  Calendar,
  ChevronRight,
  Info,
  Trash2,
  CreditCard,
  Loader2,
  AlertCircle,
} from "../components/ui/Icons.jsx";

function getInitials(name) {
  if (!name) return "P";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLocation(location, fallback = "Bangladesh") {
  if (!location) return fallback;
  if (typeof location === "object") {
    return location.district || location.division || location.address || fallback;
  }
  if (typeof location !== "string") return fallback;
  const parts = location.split(",").map((p) => p.trim());
  return parts[parts.length - 1] || fallback;
}

function getStatusBadge(status) {
  const norm = String(status || "OPEN").toUpperCase();
  switch (norm) {
    case "OPEN":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Open for Applications
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-600/20">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          In Progress
        </span>
      );
    case "PAYMENT_PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Payment Pending
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-inset ring-slate-600/20">
          <CheckCircle className="h-3.5 w-3.5 text-slate-500" />
          Completed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
          {norm}
        </span>
      );
  }
}

function HirerDashboardPage() {
  useDocumentTitle("Hirer Dashboard");
  const { currentUser } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const { jobId: applicantJobId } = useParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Applicant Drawer State
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantSearch, setApplicantSearch] = useState("");

  // Detailed Provider Profile Preview Modal State
  const [initiatingChatId, setInitiatingChatId] = useState(null);

  // Delete Job Confirm Modal State
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Payment State
  const [paymentJob, setPaymentJob] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [releasingPaymentId, setReleasingPaymentId] = useState(null);

  // Review State
  const [reviewJob, setReviewJob] = useState(null);
  const [reportJob, setReportJob] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewedJobs, setReviewedJobs] = useState(new Set());

  const isHirer = useMemo(
    () => currentUser?.role === "HIRER" || currentUser?.activeMode === "HIRER",
    [currentUser],
  );

  useEffect(() => {
    if (!isHirer) return;

    const controller = new AbortController();
    setLoading(true);
    getHirerJobs(controller.signal)
      .then((data) => setJobs(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          showError(err.message || "Failed to load posted jobs.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [isHirer]);

  useEffect(() => {
    if (!applicantJobId || selectedJob || loading || jobs.length === 0) return;
    const job = jobs.find((item) => item.id === applicantJobId);
    if (!job) {
      showError("The requested job could not be found.");
      navigate("/hirer/jobs", { replace: true });
      return;
    }
    handleOpenApplicants(job, false);
  }, [applicantJobId, jobs, loading, selectedJob]);

  // Open applicant tracking panel for specific job
  async function handleOpenApplicants(job, shouldNavigate = true) {
    if (!job?.id) {
      showError("This job has no valid identifier.");
      return;
    }
    if (shouldNavigate) {
      navigate(`/hirer/jobs/${encodeURIComponent(job.id)}/applicants`);
    }
    setSelectedJob(job);
    setLoadingApplicants(true);
    setApplicantSearch("");
    try {
      const response = await getJobApplicants(job.id);
      setApplicants(response.applicants || []);
    } catch (err) {
      showError(err.message || "Failed to load job applicants.");
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  }

  // Handle direct chat initiation with applicant
  async function handleStartChat(applicant) {
    setInitiatingChatId(applicant.proposalId);
    try {
      const payload = {
        jobId: selectedJob?.id || applicant.jobId,
        proposalId: applicant.proposalId,
        providerId: applicant.provider?.id,
      };
      const result = await initiateChat(payload);
      const chatId =
        result?.chatId ||
        result?.id ||
        (typeof result === "string" ? result : null);
      if (chatId) {
        showSuccess(`Opening conversation with ${applicant.provider?.name}...`);
        navigate(`/chat?chatId=${chatId}`);
      } else {
        navigate(
          `/chat/${selectedJob?.id || applicant.jobId}/${applicant.proposalId}`,
        );
      }
    } catch (err) {
      showError(err.message || "Unable to start chat with applicant.");
    } finally {
      setInitiatingChatId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!jobToDelete || deleting) return;
    setDeleting(true);
    try {
      await deleteJob(jobToDelete.id);
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
      showSuccess("Job post deleted successfully.");
      setJobToDelete(null);
      // If the deleted job was open in applicants panel, close it
      if (selectedJob?.id === jobToDelete.id) setSelectedJob(null);
    } catch (err) {
      showError(err.message || "Failed to delete job post.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleAccept(jobId, proposalId) {
    try {
      await acceptJobProposal(jobId, proposalId);
      showSuccess("Proposal accepted! Job is now in progress.");
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: "PAYMENT_PENDING" } : j,
        ),
      );
      // Update applicants list locally
      setApplicants((prev) =>
        prev.map((app) =>
          app.proposalId === proposalId
            ? { ...app, status: "ACCEPTED" }
            : { ...app, status: "REJECTED" },
        ),
      );
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob({ ...selectedJob, status: "PAYMENT_PENDING" });
      }
    } catch (err) {
      showError(err.message || "Failed to accept proposal");
    }
  }

  async function handleReject(jobId, proposalId) {
    try {
      await rejectJobProposal(jobId, proposalId);
      showSuccess("Proposal rejected.");
      setApplicants((prev) =>
        prev.map((app) =>
          app.proposalId === proposalId ? { ...app, status: "REJECTED" } : app,
        ),
      );
    } catch (err) {
      showError(err.message || "Failed to reject proposal");
    }
  }

  function handleOpenPayment(job) {
    const acceptedApplicant = applicants.find(
      (applicant) =>
        applicant.jobId === job.id && applicant.status === "ACCEPTED",
    );
    const agreedAmount = Number(
      job.acceptedProposalAmount || acceptedApplicant?.amount,
    );
    if (!Number.isFinite(agreedAmount) || agreedAmount < 0) {
      showError(
        "The accepted proposal amount is unavailable. Please reload the applicants.",
      );
      return;
    }
    setPaymentJob(job);
    setPaymentAmount(agreedAmount);
  }

  function handlePaymentSuccess() {
    showSuccess("Payment processed successfully!");
    setJobs((prev) =>
      prev.map((j) =>
        j.id === paymentJob.id ? { ...j, status: "IN_PROGRESS" } : j,
      ),
    );
    if (selectedJob && selectedJob.id === paymentJob.id) {
      setSelectedJob({ ...selectedJob, status: "IN_PROGRESS" });
    }
    setPaymentJob(null);
  }

  async function handleReleasePayment(job) {
    if (releasingPaymentId) return;
    setReleasingPaymentId(job.id);
    try {
      await releaseJobPayment(job.id);
      showSuccess("Payment released and job completed.");
      setJobs((prev) =>
        prev.map((item) =>
          item.id === job.id ? { ...item, status: "COMPLETED" } : item,
        ),
      );
    } catch (err) {
      showError(err.message || "Failed to release payment.");
    } finally {
      setReleasingPaymentId(null);
    }
  }

  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);

  async function handleOpenReview(job) {
    try {
      const res = await getJobReviews(job.id);
      
      const myReview = res.myReview;
      const hasReviewed = res.hasReviewed;

      if (myReview || hasReviewed) {
        setReviewedJobs((prev) => new Set(prev).add(job.id));
        setReviewJob(job);
        setReviewRating(myReview?.rating || 0);
        setReviewComment(myReview?.comment || "");
        setIsEditingReview(true);
        setEditReviewId(myReview?._id || null);
      } else {
        setReviewJob(job);
        setReviewRating(0);
        setReviewComment("");
        setIsEditingReview(false);
        setEditReviewId(null);
      }
    } catch (err) {
      showError("Failed to check review status.");
      // Fallback: still open it so they can try, but it might fail if they already reviewed
      setReviewJob(job);
      setReviewRating(0);
      setReviewComment("");
      setIsEditingReview(false);
      setEditReviewId(null);
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (reviewRating < 1 || reviewRating > 5) {
      showError("Please select a rating between 1 and 5.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      if (isEditingReview) {
        await updateReview(reviewJob.id, {
          rating: reviewRating,
          comment: reviewComment,
        });
        showSuccess("Review updated successfully!");
      } else {
        await submitReview(reviewJob.id, {
          rating: reviewRating,
          comment: reviewComment,
        });
        showSuccess("Review submitted successfully!");
      }
      setReviewedJobs((prev) => new Set(prev).add(reviewJob.id));
      setReviewJob(null);
    } catch (err) {
      showError(err.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const location = formatLocation(
        job.location,
        job.district || "Bangladesh",
      );
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        String(job.status).toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const openJobs = jobs.filter(
      (j) => String(j.status).toUpperCase() === "OPEN",
    ).length;
    const totalApplicants = jobs.reduce(
      (sum, j) => sum + (j.applicantCount || j.totalApplicants || 0),
      0,
    );
    return { totalJobs, openJobs, totalApplicants };
  }, [jobs]);

  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      const query = applicantSearch.toLowerCase();
      return (
        app.provider?.name?.toLowerCase()?.includes(query) ||
        app.provider?.category?.toLowerCase()?.includes(query) ||
        app.provider?.skills?.some((s) => s.toLowerCase()?.includes(query)) ||
        app.note?.toLowerCase()?.includes(query)
      );
    });
  }, [applicants, applicantSearch]);

  if (!isHirer) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <Briefcase className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-[#011F50]">
          Hirer Mode Required
        </h1>
        <p className="mt-2 text-slate-600">
          Please switch to Hirer mode using the navigation menu to access job
          management and applicant tracking.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066FF]/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[30rem] w-[30rem] translate-x-1/3 translate-y-1/3 rounded-full bg-[#0066FF]/5 blur-[120px]" />

      <div className="mx-auto w-11/12 max-w-7xl relative z-10 lg:w-10/12">
      {/* Top Banner & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066FF]">
            Dashboard & Management
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#011F50]">
            Hirer Job Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor your service listings, track applicant proposals, and
            connect directly with verified providers.
          </p>
        </div>
        <Link
          to="/post-job"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#0066FF] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0066FF]/20 transition hover:bg-[#011F50] active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          Post New Job
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="glass-panel rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Posted Jobs
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#0066FF]">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-[#011F50]">
            {loading ? "..." : stats.totalJobs}
          </p>
          <p className="mt-1 text-xs text-slate-400">Created across platform</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Open Listings
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-[#011F50]">
            {loading ? "..." : stats.openJobs}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Actively receiving proposals
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Applicants
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-black text-[#011F50]">
            {loading ? "..." : stats.totalApplicants}
          </p>
          <p className="mt-1 text-xs text-slate-400">Received applications</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="mt-10 flex flex-col gap-4 glass-panel rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {["ALL", "OPEN", "IN_PROGRESS", "COMPLETED"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${
                statusFilter === tab
                  ? "bg-[#011F50] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab === "ALL" ? "All Jobs" : tab.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:min-w-[240px] sm:w-auto">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-sm py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
          />
        </div>
      </div>

      {/* Job Postings List */}
      <div className="mt-6">
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0066FF]" />
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Loading your job posts...
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#011F50]">
              No Job Posts Found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {searchQuery || statusFilter !== "ALL"
                ? "No posted jobs matched your active filters. Try adjusting your search."
                : "You haven't created any service requests yet. Post a job to hire service providers!"}
            </p>
            <Link
              to="/post-job"
              className="mt-5 rounded-2xl bg-[#0066FF] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#011F50]"
            >
              Post a Job Now
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredJobs.map((job) => {
              const count = job.applicantCount || job.totalApplicants || 0;
              return (
                <div
                  key={job.id}
                  className="group glass-panel rounded-3xl p-6 transition-all duration-300 hover:border-[#0066FF]/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                          {job.category}
                        </span>
                        {getStatusBadge(job.status)}
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                          <Calendar className="h-3.5 w-3.5" /> Posted{" "}
                          {formatDate(job.postedAt)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#011F50] group-hover:text-[#0066FF] transition-colors">
                        {job.title}
                      </h3>

                      <p className="line-clamp-2 text-sm text-slate-600">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-5 pt-1 text-xs font-semibold text-slate-600">
                        <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                          <DollarSign className="h-4 w-4 text-emerald-600" />
                          Budget: ৳{job.budget?.min?.toLocaleString()} - ৳
                          {job.budget?.max?.toLocaleString()} (
                          {job.budget?.type || "FIXED"})
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {formatLocation(
                            job.location,
                            job.district || "Bangladesh",
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0">
                      <button
                        type="button"
                        onClick={() => handleOpenApplicants(job)}
                        className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition active:scale-[0.98] ${
                          count > 0
                            ? "bg-[#0066FF]/10 text-[#0066FF] hover:bg-[#0066FF] hover:text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <Users className="h-4 w-4" />
                        <span>
                          {count} {count === 1 ? "Applicant" : "Applicants"}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      {/* Delete button — only for OPEN jobs */}
                      {["open", "OPEN"].includes(String(job.status)) && (
                        <button
                          type="button"
                          onClick={() => setJobToDelete(job)}
                          title="Delete this job post"
                          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}

                      {/* Secure payment after a provider has been selected */}
                      {["payment_pending", "PAYMENT_PENDING"].includes(
                        String(job.status),
                      ) && (
                        <>
                          <button
                            type="button"
                            onClick={() => setReportJob(job)}
                            className="flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-xs font-bold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
                          >
                            <AlertCircle className="h-4 w-4" />
                            Report Issue
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenPayment(job)}
                            className="flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.98]"
                          >
                            <CreditCard className="h-4 w-4" />
                            Pay & Complete Job
                          </button>
                        </>
                      )}

                      {String(job.status).toUpperCase() === "IN_PROGRESS" && (
                        <button
                          type="button"
                          onClick={() => handleReleasePayment(job)}
                          disabled={releasingPaymentId === job.id}
                          className="flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-60"
                        >
                          <CreditCard className="h-4 w-4" />
                          {releasingPaymentId === job.id
                            ? "Releasing..."
                            : "Release Payment"}
                        </button>
                      )}

                      {/* Leave Review button - for COMPLETED jobs */}
                      {["completed", "COMPLETED", "in_progress", "IN_PROGRESS"].includes(
                        String(job.status),
                      ) &&
                        !(job.hasReviewed || reviewedJobs.has(job.id)) && (
                          <button
                            type="button"
                            onClick={() => handleOpenReview(job)}
                            className="flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-amber-600 active:scale-[0.98]"
                          >
                            <Star className="h-4 w-4 fill-white text-white" />
                            Leave Review
                          </button>
                        )}

                      {["completed", "COMPLETED", "in_progress", "IN_PROGRESS"].includes(
                        String(job.status),
                      ) &&
                        (job.hasReviewed || reviewedJobs.has(job.id)) && (
                          <button
                            type="button"
                            onClick={() => handleOpenReview(job)}
                            className="flex items-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-200 active:scale-[0.98]"
                          >
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            Edit Review
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Applicant Tracking Slide-Over Modal / Side Panel */}
      {selectedJob && createPortal((
        <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-900/40 backdrop-blur-md transition-all duration-500 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => {
              setSelectedJob(null);
              if (applicantJobId) navigate("/hirer/jobs");
            }}
            aria-label="Close applicant panel"
          />

          <aside className="relative z-10 flex h-full max-h-screen w-full max-w-2xl flex-col overflow-hidden bg-white/95 backdrop-blur-3xl shadow-2xl transition-transform duration-500 animate-in slide-in-from-right">
            {/* Slide-over Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-white/50 px-6 py-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF]">
                  Applicant Tracking
                </span>
                <h2 className="text-xl font-bold text-[#011F50] line-clamp-1">
                  {selectedJob.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {applicants.length} Total Applications Received
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedJob(null);
                  if (applicantJobId) navigate("/hirer/jobs");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Applicant Search */}
            <div className="border-b border-slate-100 px-6 py-4 bg-white/40">
              <div className="relative group">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-[#0066FF]" />
                <input
                  type="text"
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                  placeholder="Filter applicants by name or skill..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>

            {/* Applicants List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {loadingApplicants ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0066FF]" />
                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    Retrieving applicant profiles...
                  </p>
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="flex min-h-[250px] flex-col items-center justify-center text-center px-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Users className="h-6 w-6" />
                  </div>
                  <h4 className="mt-3 text-base font-bold text-[#011F50]">
                    No Applicants Found
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 max-w-xs">
                    {applicantSearch
                      ? "No applicants matched your search term."
                      : "No service providers have applied to this job request yet."}
                  </p>
                </div>
              ) : (
                filteredApplicants.map((applicant, idx) => {
                  const provider = applicant.provider || {};
                  return (
                    <div
                      key={applicant.proposalId}
                      className="rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-xl p-5 shadow-sm space-y-4 transition-all duration-300 hover:border-[#0066FF]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0066FF]/5"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {/* Applicant Profile Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <Link to={`/user/${provider._id || provider.id}`} className="shrink-0 hover:opacity-80 transition-opacity">
                            {provider.avatar ? (
                              <img
                                src={provider.avatar}
                                alt={provider.name}
                                className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-200"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#011F50] text-sm font-bold text-white">
                                {provider.initials || getInitials(provider.name)}
                              </div>
                            )}
                          </Link>

                          <div>
                            <div className="flex items-center gap-2">
                              <Link to={`/user/${provider._id || provider.id}`} className="hover:underline hover:text-[#0066FF] transition-colors">
                                <h4 className="font-bold text-[#011F50] text-base">
                                  {provider.name}
                                </h4>
                              </Link>
                              {provider.nidVerified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                  <CheckCircle className="h-3 w-3 text-emerald-600" />
                                  NID Verified
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1 font-semibold text-amber-600">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                {provider.rating > 0
                                  ? provider.rating.toFixed(1)
                                  : "New"}{" "}
                                ({provider.reviews || 0} reviews)
                              </span>
                              <span>•</span>
                              <span>
                                {provider.district ||
                                  formatLocation(provider.location, "Bangladesh")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs text-slate-400 block">
                            Proposed Bid
                          </span>
                          <span className="text-lg font-black text-[#0066FF]">
                            ৳{applicant.amount?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Hourly Rate & Category Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {provider.hourlyRate > 0 && (
                          <span className="rounded-xl bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                            Rate: ৳{provider.hourlyRate}/hr
                          </span>
                        )}
                        {provider.category && (
                          <span className="rounded-xl bg-blue-50 px-3 py-1 font-semibold text-[#0066FF]">
                            Category: {provider.category}
                          </span>
                        )}
                        <span className="rounded-xl bg-slate-100 px-3 py-1 font-medium text-slate-500">
                          Applied: {formatDate(applicant.appliedDate)}
                        </span>
                      </div>

                      {/* Proposal Application Note */}
                      {/* Applicant Proposal Context */}
                      {applicant.note && (
                        <div className="rounded-2xl bg-slate-50/80 backdrop-blur-md p-4 text-sm text-slate-700 leading-relaxed border border-slate-100 shadow-inner">
                          <span className="font-bold text-slate-800 block mb-1">
                            Proposal Note:
                          </span>
                          "{applicant.note}"
                        </div>
                      )}

                      {/* Provider Skills Badges */}
                      {provider.skills && provider.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {provider.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                        {/* Show accept/reject only if job is still open and proposal is pending */}
                        {selectedJob?.status === "OPEN" &&
                          applicant.status === "PENDING" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleAccept(
                                    selectedJob.id,
                                    applicant.proposalId,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Accept
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleReject(
                                    selectedJob.id,
                                    applicant.proposalId,
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 px-4 py-2 text-xs font-bold text-red-600 shadow-sm transition hover:bg-red-200"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </button>
                            </>
                          )}
                        <button
                          type="button"
                          onClick={() => navigate(`/user/${provider._id || provider.id}`)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Info className="h-4 w-4 text-slate-500" />
                          View Profile
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStartChat(applicant)}
                          disabled={initiatingChatId === applicant.proposalId}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0066FF] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#011F50] disabled:opacity-50"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {initiatingChatId === applicant.proposalId
                            ? "Starting Chat..."
                            : "Message / Chat"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        </div>
      ), document.body)}

      {/* Delete Confirmation Modal */}
      {jobToDelete && createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-2 text-center text-lg font-bold text-slate-900">
              Delete Job Post?
            </h3>
            <p className="mb-6 text-center text-sm text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                "{jobToDelete.title}"
              </span>
              ? This action cannot be undone and will remove all associated
              applications.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setJobToDelete(null)}
                className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50 inline-flex justify-center items-center gap-2"
              >
                {deleting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={!!paymentJob}
        onClose={() => setPaymentJob(null)}
        jobId={paymentJob?.id}
        amount={paymentAmount}
        onSuccess={handlePaymentSuccess}
      />

      {/* Review Modal */}
      {reviewJob && createPortal(
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-[#011F50]">
                Leave a Review
              </h3>
              <button
                type="button"
                onClick={() => setReviewJob(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the service?"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-[#0066FF] focus:bg-white focus:ring-1 focus:ring-[#0066FF] outline-none transition"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewJob(null)}
                  disabled={isSubmittingReview}
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview || reviewRating === 0}
                  className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-[#0066FF] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#011F50] disabled:opacity-50"
                >
                  {isSubmittingReview && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
      {reportJob && (
        <ReportModal job={reportJob} onClose={() => setReportJob(null)} />
      )}
      </div>
    </main>
  );
}

export default HirerDashboardPage;
