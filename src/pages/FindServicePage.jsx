import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServices, initiateChat, getCategories } from "../services/api.js";
import { useAuth } from "../contexts/useAuth.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { useRemoteList } from "../hooks/useRemoteList.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";
import { useTranslation } from "react-i18next";
import {
  X,
  MapPin,
  Star,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Clock,
  Briefcase,
  Search,
  Filter,
} from "../components/ui/Icons.jsx";

/* ─── Helpers ────────────────────────────────────────────── */

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "jobs", label: "Most Jobs Done" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const RATING_OPTIONS = [
  { value: 0, label: "Any rating" },
  { value: 4, label: "4.0 & above" },
  { value: 4.5, label: "4.5 & above" },
  { value: 4.8, label: "4.8 & above" },
];

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3.5 w-3.5 ${n <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`}
          filled={n <= Math.round(rating)}
        />
      ))}
    </span>
  );
}

/* ─── ServiceCard ────────────────────────────────────────── */

function ServiceCard({ provider, onViewProfile }) {
  const [imgError, setImgError] = useState(false);

  const {
    name,
    avatar,
    category,
    location,
    rating,
    reviews,
    completedJobs,
    hourlyRate,
    verified,
    availableNow,
    bio,
    skills,
    initials,
    color,
  } = provider;

  return (
    <article className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {avatar && !imgError ? (
          <img
            src={avatar}
            alt={name}
            onError={() => setImgError(true)}
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#0066FF]/10 shadow-sm"
          />
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: color || "#011F50" }}
            aria-hidden="true"
          >
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-[#011F50]">{name}</h3>
            {verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#00C853]/10 px-2 py-0.5 text-xs font-semibold text-[#00C853]">
                <CheckCircle className="h-3 w-3" /> NID Verified
              </span>
            )}
            {availableNow && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0066FF]/10 px-2 py-0.5 text-xs font-semibold text-[#0066FF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0066FF]" />
                Available
              </span>
            )}
          </div>

          <p className="mt-0.5 text-sm text-slate-500">{category}</p>
        </div>
      </div>

      {/* Location */}
      <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {location}
      </div>

      {/* Bio */}
      <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-slate-600">
        {bio || "Experienced service professional."}
      </p>

      {/* Skills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.slice(0, 3).map((s) => (
          <span
            key={s}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600"
          >
            {s}
          </span>
        ))}
        {skills.length > 3 && (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-500">
            +{skills.length - 3}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm">
        <div>
          <div className="flex items-center gap-1.5">
            <StarRating rating={rating} />
            <span className="font-semibold text-slate-800">{rating}</span>
          </div>
          <span className="text-xs text-slate-400">{reviews} reviews</span>
        </div>
        <div className="text-slate-300">|</div>
        <div>
          <div className="font-semibold text-slate-800">{completedJobs}</div>
          <span className="text-xs text-slate-400">jobs done</span>
        </div>
        <div className="ml-auto text-right">
          <div className="font-bold text-[#011F50]">
            ৳{hourlyRate.toLocaleString()}
          </div>
          <span className="text-xs text-slate-400">per hour</span>
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onViewProfile(provider)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#0066FF] px-4 py-2.5 text-sm font-semibold text-[#0066FF] transition-all hover:bg-[#0066FF] hover:text-white"
      >
        View Profile <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}

/* ─── Filter Sidebar ─────────────────────────────────────── */

function FilterPanel({ filters, onChange, onReset, resultCount, categories }) {
  const hasActiveFilters =
    filters.category !== "All" ||
    filters.location !== "All" ||
    filters.minRating > 0 ||
    filters.availableOnly;

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
        <span className="font-semibold text-[#011F50]">{resultCount}</span>{" "}
        providers
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
              name="category"
              value="All"
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
                name="category"
                value={cat.name}
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
                name="location"
                value={loc}
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

      {/* Rating */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          Minimum Rating
        </h3>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <input
                type="radio"
                name="minRating"
                value={value}
                checked={filters.minRating === value}
                onChange={() => onChange("minRating", value)}
                className="h-4 w-4 accent-[#0066FF]"
              />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Available now toggle */}
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={filters.availableOnly}
            onChange={(e) => onChange("availableOnly", e.target.checked)}
          />
          <div
            className={`h-5 w-9 rounded-full transition-colors duration-200 ${
              filters.availableOnly ? "bg-[#0066FF]" : "bg-slate-200"
            }`}
          />
          <div
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
              filters.availableOnly ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </div>
        <span className="text-sm text-slate-700">Available now only</span>
      </label>
    </aside>
  );
}

/* ─── Page ───────────────────────────────────────────────── */

const DEFAULT_FILTERS = {
  category: "All",
  location: "All",
  minRating: 0,
  availableOnly: false,
};

function FindServicePage() {
  useDocumentTitle("Find Services");
  const { t } = useTranslation();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const { data: services, loading, error } = useRemoteList(getServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [categories, setCategories] = useState([]);

  useState(() => {
    getCategories().then((data) => {
      if (data) setCategories(data);
    }).catch(console.error);
  });

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
  }

  async function handleStartChat(providerId) {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await initiateChat({ providerId, targetUserId: providerId });
      const chatId = response.chat?.id || response.chat?._id;
      showSuccess("Conversation initiated.");
      setSelectedProvider(null);
      if (chatId) {
        navigate(`/chat?chatId=${chatId}`);
      } else {
        navigate("/chat");
      }
    } catch (err) {
      showError(err.message || "Unable to initiate chat.");
    }
  }

  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return (services || [])
      .filter((s) => {
        const matchSearch =
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (s.bio && s.bio.toLowerCase().includes(q)) ||
          (s.skills && s.skills.some((sk) => sk.toLowerCase().includes(q)));
        const matchCat =
          filters.category === "All" || s.category === filters.category;
        const matchLoc =
          filters.location === "All" || s.district === filters.location;
        const matchRating = s.rating >= filters.minRating;
        const matchAvail = !filters.availableOnly || s.availableNow;
        return matchSearch && matchCat && matchLoc && matchRating && matchAvail;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "jobs") return (b.completedJobs || 0) - (a.completedJobs || 0);
        if (sortBy === "price_asc") return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        if (sortBy === "price_desc") return (b.hourlyRate || 0) - (a.hourlyRate || 0);
        return 0;
      });
  }, [searchQuery, sortBy, filters, services]);

  const activeFilters = [
    filters.category !== "All" && { key: "category", label: filters.category },
    filters.location !== "All" && { key: "location", label: filters.location },
    filters.minRating > 0 && {
      key: "minRating",
      label: `${filters.minRating}+ stars`,
    },
    filters.availableOnly && { key: "availableOnly", label: "Available now" },
  ].filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#011F50] text-white">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,102,255,0.2),transparent_50%)]" />
          <div className="relative mx-auto w-11/12 py-10 lg:w-10/12 lg:py-14">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                Find Services
              </span>
              <h1 className="text-3xl font-bold lg:text-4xl">
                Discover verified service providers.
              </h1>
              <p className="text-white/70">
                Browse, filter, and connect with NID-verified professionals
                across Bangladesh.
              </p>
            </div>

            {/* Search bar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  id="service-search"
                  type="search"
                  placeholder="Search by name, skill, or category…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] backdrop-blur"
                  aria-label="Search for a service"
                />
              </div>

              {/* Sort dropdown */}
              <div className="relative sm:w-52">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-white/15 bg-white/10 py-3 pl-4 pr-10 text-sm text-white outline-none focus:border-[#0066FF] backdrop-blur"
                  aria-label="Sort results"
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

        {/* Category pills */}
        <div className="border-t border-white/10">
          <div className="mx-auto w-11/12 overflow-x-auto py-3 lg:w-10/12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFilterChange("category", "All")}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filters.category === "All"
                    ? "bg-[#0066FF] text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id || cat.name}
                  type="button"
                  onClick={() => handleFilterChange("category", cat.name)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    filters.category === cat.name
                      ? "bg-[#0066FF] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto w-11/12 min-w-0 py-8 lg:w-10/12">
        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Active filters:</span>
            {activeFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  if (f.key === "availableOnly")
                    handleFilterChange("availableOnly", false);
                  else if (f.key === "minRating")
                    handleFilterChange("minRating", 0);
                  else handleFilterChange(f.key, "All");
                }}
                className="flex items-center gap-1.5 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/10 px-3 py-1 text-xs font-semibold text-[#0066FF] transition-colors hover:bg-[#0066FF]/20"
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
          <div className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onReset={resetFilters}
                resultCount={filteredServices.length}
                categories={categories}
              />
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-[#011F50]">
                  {filteredServices.length}
                </span>{" "}
                provider{filteredServices.length !== 1 ? "s" : ""} found
              </p>
              <div className="relative hidden sm:block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-8 text-sm text-slate-700 outline-none focus:border-[#0066FF] shadow-sm"
                  aria-label="Sort results"
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
                Loading verified providers...
              </p>
            ) : error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
                {error}
              </p>
            ) : filteredServices.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 stagger">
                {filteredServices.map((provider) => (
                  <div key={provider.id} className="animate-fade-in-up">
                    <ServiceCard
                      provider={provider}
                      onViewProfile={(p) => navigate(`/user/${p.id || p._id}`)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Search className="h-7 w-7 text-slate-400" />
                </div>
                <h3 className="text-base font-semibold text-[#011F50]">
                  No providers found
                </h3>
                <p className="mt-2 max-w-xs text-sm text-slate-500">
                  Try adjusting your search term or clearing some filters.
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


      {/* Mobile filter drawer */}
      {filterDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setFilterDrawerOpen(false)}
        >
          <aside
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-[#011F50]">
                Filter Providers
              </h2>
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(false)}
                className="rounded-full border border-slate-200 p-1.5 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              onReset={resetFilters}
              resultCount={filteredServices.length}
              categories={categories}
            />
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(false)}
              className="mt-6 w-full rounded-xl bg-[#0066FF] py-3 text-sm font-semibold text-white"
            >
              Show {filteredServices.length} result
              {filteredServices.length !== 1 ? "s" : ""}
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default FindServicePage;
