import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { JOB_CATEGORIES, JOB_LOCATIONS } from "../data/filterOptions.js";
import { getJobs } from "../services/api.js";
import { useRemoteList } from "../hooks/useRemoteList.js";
import {
  Search,
  Filter,
  X,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ArrowRight,
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

/** Days ago from ISO date string */
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
  const fmt = (n) => `৳${n.toLocaleString()}`;
  const range = min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
  return `${range} ${type === "hourly" ? "/ hr" : "fixed"}`;
}

/* ─── JobCard ────────────────────────────────────────────── */

function JobCard({ job, featured }) {
  const {
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

  const { label: statusLabel, cls: statusCls } = statusConfig[status];

  return (
    <article
      className={`relative rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        featured
          ? "border-[#0066FF]/30 ring-1 ring-[#0066FF]/20"
          : "border-slate-200"
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
        {skills.map((s) => (
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
        {/* Hirer info */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white"
            aria-hidden="true"
          >
            {hirer.initials}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-700">{hirer.name}</p>
            {hirer.verified && (
              <span className="flex items-center gap-0.5 text-xs text-[#00C853]">
                <CheckCircle className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            {proposals} proposal{proposals !== 1 ? "s" : ""}
          </span>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 rounded-xl bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#011F50]"
          >
            Apply <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ─── Filter Sidebar ─────────────────────────────────────── */

function JobFilterPanel({ filters, onChange, onReset, resultCount }) {
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
        <div className="space-y-1.5">
          {JOB_CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <input
                type="radio"
                name="job-category"
                checked={filters.category === cat}
                onChange={() => onChange("category", cat)}
                className="h-4 w-4 accent-[#0066FF]"
              />
              <span className="text-sm text-slate-700">{cat}</span>
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
          {JOB_LOCATIONS.map((loc) => (
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

      <div className="h-px bg-slate-100" />

      {/* Date posted */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          Date Posted
        </h3>
        <div className="space-y-1.5">
          {DATE_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <input
                type="radio"
                name="job-date"
                checked={filters.dateRange === value}
                onChange={() => onChange("dateRange", value)}
                className="h-4 w-4 accent-[#0066FF]"
              />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Budget */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          Max Budget
        </h3>
        <div className="space-y-1.5">
          {BUDGET_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <input
                type="radio"
                name="job-budget"
                checked={filters.maxBudget === value}
                onChange={() => onChange("maxBudget", value)}
                className="h-4 w-4 accent-[#0066FF]"
              />
              <span className="text-sm text-slate-700">{label}</span>
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
  const { data: jobs, loading, error } = useRemoteList(getJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState("All Jobs");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setActiveTab("All Jobs");
  }

  const filteredJobs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return jobs
      .filter((j) => {
        const matchSearch =
          !q ||
          j.title.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.hirer.name.toLowerCase().includes(q);

        const matchCat =
          filters.category === "All" || j.category === filters.category;
        const matchLoc =
          filters.location === "All" || j.district === filters.location;

        const matchStatus =
          filters.status === "All" ||
          (filters.status === "Open" && j.status === "open") ||
          (filters.status === "In Progress" && j.status === "in_progress");

        const matchDate =
          filters.dateRange === "all" ||
          daysAgo(j.postedAt) <= parseInt(filters.dateRange, 10);

        const matchBudget =
          filters.maxBudget === "all" ||
          j.budget.max <= parseInt(filters.maxBudget, 10);

        const matchTab =
          activeTab === "All Jobs" ||
          (activeTab === "Open" && j.status === "open") ||
          (activeTab === "Featured" && j.featured);

        return (
          matchSearch &&
          matchCat &&
          matchLoc &&
          matchStatus &&
          matchDate &&
          matchBudget &&
          matchTab
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.postedAt) - new Date(a.postedAt);
        if (sortBy === "oldest")
          return new Date(a.postedAt) - new Date(b.postedAt);
        if (sortBy === "budget_desc") return b.budget.max - a.budget.max;
        if (sortBy === "budget_asc") return a.budget.min - b.budget.min;
        if (sortBy === "proposals") return b.proposals - a.proposals;
        return 0;
      });
  }, [searchQuery, sortBy, filters, activeTab, jobs]);

  const activeFilters = [
    filters.category !== "All" && { key: "category", label: filters.category },
    filters.location !== "All" && { key: "location", label: filters.location },
    filters.status !== "All" && { key: "status", label: filters.status },
    filters.dateRange !== "all" && {
      key: "dateRange",
      label: DATE_OPTIONS.find((o) => o.value === filters.dateRange)?.label,
    },
    filters.maxBudget !== "all" && {
      key: "maxBudget",
      label: BUDGET_OPTIONS.find((o) => o.value === filters.maxBudget)?.label,
    },
  ].filter(Boolean);

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
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
                    <option
                      key={o.value}
                      value={o.value}
                      className="text-slate-900"
                    >
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              </div>

              {/* Mobile filter button */}
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white sm:hidden"
              >
                <Filter className="h-4 w-4" /> Filters
                {activeFilters.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0066FF] text-xs font-bold">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-white/10">
          <div className="mx-auto w-11/12 lg:w-10/12">
            <div className="flex gap-1 py-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="mx-auto w-11/12 min-w-0 py-8 lg:w-10/12">
        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Active filters:</span>
            {activeFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  if (f.key === "dateRange")
                    handleFilterChange("dateRange", "all");
                  else if (f.key === "maxBudget")
                    handleFilterChange("maxBudget", "all");
                  else handleFilterChange(f.key, "All");
                }}
                className="flex items-center gap-1.5 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/10 px-3 py-1 text-xs font-semibold text-[#0066FF] hover:bg-[#0066FF]/20"
              >
                {f.label} <X className="h-3 w-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <JobFilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onReset={resetFilters}
                resultCount={filteredJobs.length}
              />
            </div>
          </div>

          {/* Job list */}
          <div>
            {/* Result bar */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-[#011F50]">
                  {filteredJobs.length}
                </span>{" "}
                job{filteredJobs.length !== 1 ? "s" : ""} found
              </p>
              <div className="relative hidden sm:block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-8 text-sm text-slate-700 outline-none focus:border-[#0066FF] shadow-sm"
                  aria-label="Sort jobs"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
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
                    <JobCard job={job} featured={job.featured} />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Briefcase className="h-7 w-7 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-[#011F50]">
                  No jobs found
                </h3>
                <p className="mt-2 max-w-xs text-sm text-slate-500">
                  Try a different search term or clear some filters.
                </p>
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

      {/* ── Mobile filter drawer ──────────────────────────── */}
      {filterDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setFilterDrawerOpen(false)}
          aria-hidden="true"
        >
          <aside
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
            aria-label="Job filter options"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#011F50]">
                Filter Jobs
              </h2>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                className="rounded-full border border-slate-200 p-1.5 text-slate-500"
                aria-label="Close filter drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <JobFilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={resetFilters}
              resultCount={filteredJobs.length}
            />
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(false)}
              className="mt-6 w-full rounded-xl bg-[#0066FF] py-3 text-sm font-semibold text-white"
            >
              Show {filteredJobs.length} result
              {filteredJobs.length !== 1 ? "s" : ""}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default FindJobsPage;
