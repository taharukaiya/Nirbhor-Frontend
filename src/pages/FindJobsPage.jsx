/**
 * @file FindJobsPage.jsx
 * @description Primary discovery interface for Service Providers to browse and apply to open jobs.
 *
 * Architectural Intent:
 * - Complex Data Fetching: Utilizes `useRemoteList` to fetch job postings dynamically.
 * - Client-Side Filtering: Implements extensive client-side filtering (category, location, status, budget) and sorting for immediate UI feedback.
 * - Application Flow: Manages the modal-based application flow (`ApplyModal`) and validates offer amounts against the job's defined budget bounds.
 * - Mode Switching: Integrates automatic role switching if a Hirer attempts to apply to a job, converting them seamlessly to a Provider mode.
 * - Responsive Layout: Employs a sticky sidebar for filters on desktop, transitioning to a drawer on mobile.
 */
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getJobs, applyToJob, switchMode, getMyApplications, getCategories } from "../services/api.js";
import { useAuth } from "../contexts/useAuth.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { useRemoteList } from "../hooks/useRemoteList.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useTranslation } from "react-i18next";
import {
  Filter,
  X,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Send,
  Search,
} from "../components/ui/Icons.jsx";

/* ─── Helpers ────────────────────────────────────────────── */

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "budget_desc", label: "Budget: High to Low" },
  { value: "budget_asc", label: "Budget: Low to High" },
  { value: "proposals", label: "Most Proposals" },
];

const DATE_OPTIONS = [
  { value: "all", label: "Any time" },
  { value: "1", label: "Last 24 hours" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
];

const BUDGET_OPTIONS = [
  { value: "all", label: "Any budget" },
  { value: "5000", label: "Under ৳5,000" },
  { value: "20000", label: "Under ৳20,000" },
  { value: "50000", label: "Under ৳50,000" },
];

const STATUS_OPTIONS = ["All", "Open", "In Progress"];

function daysAgo(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const ago = daysAgo(dateStr);
  if (ago === 0) return "Today";
  if (ago === 1) return "Yesterday";
  if (ago < 7) return `${ago} days ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatBudget({ min, max, type }) {
  const fmt = (n) => `৳${(n || 0).toLocaleString()}`;
  const range = min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
  return `${range} ${type === "hourly" ? "/ hr" : "fixed"}`;
}

/* ─── JobCard ────────────────────────────────────────────── */

function JobCard({ job, featured, hasApplied, onApply, onViewProfile }) {
  const {
    id,
    title,
    category,
    location,
    budget,
    postedAt,
    deadline,
    status,
    description,
    skills,
    hirer,
    proposals,
  } = job;

  const statusConfig = {
    open: { label: "Open", cls: "bg-[#00C853]/10 text-[#00C853]" },
    in_progress: { label: "In Progress", cls: "bg-amber-50 text-amber-600" },
  };

  const { label: statusLabel, cls: statusCls } =
    statusConfig[status] || statusConfig.open;

  return (
    <article
      className={`relative rounded-2xl border bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        featured
          ? "border-[#0066FF]/30 ring-[#0066FF]/20"
          : "border-slate-100 ring-slate-100"
      }`}
    >
      {featured && (
        <span className="absolute right-4 top-4 rounded-full bg-[#0066FF] px-2.5 py-0.5 text-xs font-semibold text-white">
          Featured
        </span>
      )}

      {/* Top meta */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {category}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusCls}`}
        >
          {statusLabel}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3 w-3" /> {formatDate(postedAt)}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-base font-semibold text-[#011F50] leading-snug pr-16">
        {title}
      </h3>

      {/* Location + Budget */}
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" />
          <span className="font-semibold text-[#011F50]">
            {formatBudget(budget)}
          </span>
        </span>
      </div>

      {/* Deadline */}
      {deadline && (
        <p className="mt-1 text-xs text-slate-400">
          Deadline:{" "}
          <span className="font-medium text-slate-600">
            {new Date(deadline).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </p>
      )}

      {/* Description */}
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
        {description}
      </p>

      {/* Skills needed */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(skills || []).map((s) => (
          <span
            key={s}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-500"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        {/* Hirer info — click to view public profile */}
        <button
          type="button"
          onClick={() => hirer?.id && onViewProfile(hirer.id)}
          className="flex items-center gap-2 rounded-xl p-1 -ml-1 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]/40"
          aria-label={`View ${hirer?.name || "Hirer"}'s profile`}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white"
            aria-hidden="true"
          >
            {hirer?.initials || "H"}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-700 hover:text-[#0066FF] transition">{hirer?.name || "Hirer"}</p>
            {hirer?.verified && (
              <span className="flex items-center gap-0.5 text-xs text-[#00C853]">
                <CheckCircle className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            {proposals || 0} proposal{proposals !== 1 ? "s" : ""}
          </span>
          
          {hasApplied ? (
            <button
              type="button"
              disabled
              className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-600 cursor-default"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Applied
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onApply(job)}
              className="flex items-center gap-1.5 rounded-xl bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#011F50]"
            >
              Apply <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─── ApplyModal ─────────────────────────────────────────── */

function ApplyModal({ job, onClose, onSuccess }) {
  const { showError, showSuccess } = useToast();
  const [amount, setAmount] = useState(job.budget?.max || job.budget?.min || 500);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!job) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) {
      showError("Please write a short proposal note.");
      return;
    }

    const numAmount = Number(amount);
    const minBudget = job.budget?.min || 0;
    const maxBudget = job.budget?.max || Infinity;

    if (numAmount < minBudget || numAmount > maxBudget) {
      showError(
        `Offer must be between ৳${minBudget} and ${
          maxBudget === Infinity ? "no limit" : `৳${maxBudget}`
        }`
      );
      return;
    }

    setSubmitting(true);
    try {
      await applyToJob(job.id, {
        amount: Number(amount),
        message: message.trim(),
      });
      showSuccess("Application submitted successfully!");
      onSuccess(job.id);
      onClose();
    } catch (err) {
      showError(err.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-[#011F50]">Apply for Job</h2>
        <p className="mt-1 text-sm font-semibold text-[#0066FF]">{job.title}</p>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 space-y-1">
          <p>
            <span className="font-semibold text-slate-700">Category:</span> {job.category}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Budget Range:</span> {formatBudget(job.budget)}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Posted by:</span> {job.hirer?.name || "Hirer"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Your Offer (৳)
              </label>
              {job.budget?.min && job.budget?.max && (
                <p className="text-xs text-slate-500 mb-2">
                  Budget Range: ৳{job.budget.min} - ৳{job.budget.max}
                </p>
              )}
              <input
                type="number"
                min={job.budget?.min || 0}
                max={job.budget?.max}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Cover Note / Proposal Message
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain your experience, availability, and why you are the best fit for this job."
              required
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-normal outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
            />
          </label>

          <div className="mt-6 flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || amount < (job.budget?.min || 0) || amount > (job.budget?.max || Infinity)}
              className="flex-1 rounded-xl bg-[#0066FF] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#011F50] disabled:opacity-50 inline-flex justify-center items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Filter Sidebar ─────────────────────────────────────── */

function JobFilterPanel({ filters, onChange, onReset, resultCount, categories }) {
  const hasActiveFilters =
    filters.category !== "All" ||
    filters.location !== "All" ||
    filters.status !== "All" ||
    filters.dateRange !== "all" ||
    filters.maxBudget !== "all";

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#011F50]">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs font-medium text-[#0066FF] hover:text-[#011F50]"
            type="button"
          >
            Reset all
          </button>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Showing{" "}
        <span className="font-semibold text-[#011F50]">{resultCount}</span> jobs
      </p>

      <div className="h-px bg-slate-100" />

      {/* Category */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          Category
        </h3>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="radio"
              name="job-category"
              checked={filters.category === "All"}
              onChange={() => onChange("category", "All")}
              className="h-4 w-4 accent-[#0066FF]"
            />
            <span className="text-sm text-slate-700">All Categories</span>
          </label>
          {categories.map((cat) => (
            <label
              key={cat._id || cat.name}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <input
                type="radio"
                name="job-category"
                checked={filters.category === cat.name}
                onChange={() => onChange("category", cat.name)}
                className="h-4 w-4 accent-[#0066FF]"
              />
              <span className="text-sm text-slate-700">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Location */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          Location
        </h3>
        <div className="space-y-1.5">
          {/* Static locations for now, but will eventually be dynamic */}
          {["All", "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"].map((loc) => (
            <label
              key={loc}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <input
                type="radio"
                name="job-location"
                checked={filters.location === loc}
                onChange={() => onChange("location", loc)}
                className="h-4 w-4 accent-[#0066FF]"
              />
              <span className="text-sm text-slate-700">{loc}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Status */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          Job Status
        </h3>
        <div className="space-y-1.5">
          {STATUS_OPTIONS.map((s) => (
            <label key={s} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="job-status"
                checked={filters.status === s}
                onChange={() => onChange("status", s)}
                className="h-4 w-4 accent-[#0066FF]"
              />
              <span className="text-sm text-slate-700">{s}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ─── Page ───────────────────────────────────────────────── */

const DEFAULT_FILTERS = {
  category: "All",
  location: "All",
  status: "All",
  dateRange: "all",
  maxBudget: "all",
};

const TABS = ["All Jobs", "Open", "Featured"];

function FindJobsPage() {
  useDocumentTitle("Find Jobs");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, updateSession } = useAuth();
  const { showError, showSuccess } = useToast();
  const { data: jobs, loading, error, reload } = useRemoteList(getJobs);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState("All Jobs");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((data) => {
      if (data) setCategories(data);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const controller = new AbortController();
      getMyApplications(controller.signal)
        .then(data => {
          if (data && data.applications) {
            setAppliedJobIds(new Set(data.applications.map(app => app._id)));
          }
        })
        .catch(err => {
          if (err.name !== "AbortError") {
            console.error("Failed to fetch applications:", err);
          }
        });
      return () => controller.abort();
    }
  }, [isAuthenticated]);

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setActiveTab("All Jobs");
  }

  async function handleApplyClick(job) {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const mode = currentUser?.activeMode || currentUser?.role;
    if (mode !== "SERVICE_PROVIDER") {
      try {
        const response = await switchMode("SERVICE_PROVIDER");
        if (response?.user) {
          await updateSession(response.user);
          showSuccess("Switched to Service Provider mode to apply for jobs.");
        }
      } catch {
        showError("Please switch to Service Provider mode to apply for jobs.");
        return;
      }
    }

    setSelectedApplyJob(job);
  }

  function handleApplicationSuccess(jobId) {
    setAppliedJobIds((prev) => new Set(prev).add(jobId));
    if (typeof reload === "function") reload();
  }

  const filteredJobs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return (jobs || [])
      .filter((j) => {
        const matchSearch =
          !q ||
          j.title.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          (j.skills && j.skills.some((s) => s.toLowerCase().includes(q))) ||
          (j.hirer && j.hirer.name.toLowerCase().includes(q));

        const matchCat =
          filters.category === "All" || j.category === filters.category;
        const matchLoc =
          filters.location === "All" || j.district === filters.location;
        const matchStatus =
          filters.status === "All" ||
          (filters.status === "Open" && j.status === "open") ||
          (filters.status === "In Progress" && j.status === "in_progress");

        return matchSearch && matchCat && matchLoc && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.postedAt) - new Date(a.postedAt);
        if (sortBy === "oldest") return new Date(a.postedAt) - new Date(b.postedAt);
        return 0;
      });
  }, [searchQuery, sortBy, filters, jobs]);

  const activeFilters = [
    filters.category !== "All" && { key: "category", label: filters.category },
    filters.location !== "All" && { key: "location", label: filters.location },
    filters.status !== "All" && { key: "status", label: filters.status },
  ].filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#011F50] text-white">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,200,83,0.12),transparent_50%)]" />
          <div className="relative mx-auto w-11/12 py-10 lg:w-10/12 lg:py-14">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                Find Jobs
              </span>
              <h1 className="text-3xl font-bold lg:text-4xl">
                Explore open jobs from verified Hirers.
              </h1>
              <p className="text-white/70">
                Browse jobs posted by NID-verified hirers across all service
                categories. Apply with a proposal and win the work.
              </p>
            </div>

            {/* Search bar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  id="job-search"
                  type="search"
                  placeholder="Search by job title, skill, or category…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] backdrop-blur"
                  aria-label="Search for a job"
                />
              </div>

              {/* Sort */}
              <div className="relative sm:w-52">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-white/15 bg-white/10 py-3 pl-4 pr-10 text-sm text-white outline-none focus:border-[#0066FF] backdrop-blur"
                  aria-label="Sort jobs"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="text-slate-900">
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto w-11/12 min-w-0 py-8 lg:w-10/12">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <JobFilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onReset={resetFilters}
                resultCount={filteredJobs.length}
                categories={categories}
              />
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-[#011F50]">
                  {filteredJobs.length}
                </span>{" "}
                job{filteredJobs.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {loading ? (
              <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                Loading open jobs...
              </p>
            ) : error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
                {error}
              </p>
            ) : filteredJobs.length > 0 ? (
              <div className="grid gap-4 stagger">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="animate-fade-in-up">
                    <JobCard
                      job={job}
                      featured={job.featured}
                      hasApplied={appliedJobIds.has(job.id)}
                      onApply={handleApplyClick}
                      onViewProfile={(id) => navigate(`/user/${id}`)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Briefcase className="h-7 w-7 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-[#011F50]">
                  No jobs found
                </h3>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-full bg-[#0066FF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#011F50]"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {selectedApplyJob && (
        <ApplyModal
          job={selectedApplyJob}
          onClose={() => setSelectedApplyJob(null)}
          onSuccess={handleApplicationSuccess}
        />
      )}

    </div>
  );
}

export default FindJobsPage;
