import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { createJob } from "../services/api.js";
import { locations } from "../data/locations.js";
import { useTranslation } from "react-i18next";

/**
 * ARCHITECTURAL INTENT:
 * PostJobPage handles the creation of a new job/service request by a Hirer.
 * It features a comprehensive form capturing job details, hierarchical location data (division -> district -> thana),
 * budget constraints, and skill requirements.
 * 
 * STATE MANAGEMENT:
 * - `form`: A complex nested object managing all form fields. 
 * - Location State: Hierarchical selection updates dynamically reset child fields (e.g., changing division resets district/thana).
 * - `categories`: Loaded asynchronously on mount using `getCategories` from the API.
 * - Validation: Performed before submission ensuring minimum viable job details and budget integrity.
 */
// Removed hardcoded categories

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  serviceType: "",
  location: {
    division: "",
    district: "",
    thana: "",
    road: "",
  },
  budgetMin: "",
  budgetMax: "",
  budgetType: "FIXED",
  skills: "",
  payRate: "",
  deadline: "",
};

function PostJobPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useState(() => {
    import("../services/api.js").then(({ getCategories }) => {
      getCategories().then((data) => {
        if (data) setCategories(data);
      }).catch(console.error);
    });
  });

  const isAuthenticated = useMemo(() => Boolean(currentUser), [currentUser]);

  function updateField(event) {
    const { name, value } = event.target;
    if (name.startsWith("location.")) {
      const locField = name.split(".")[1];
      setForm((current) => {
        const newLocation = { ...current.location, [locField]: value };
        // Reset downstream fields
        if (locField === "division") {
          newLocation.district = "";
          newLocation.thana = "";
        } else if (locField === "district") {
          newLocation.thana = "";
        }
        return {
          ...current,
          location: newLocation,
        };
      });
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!currentUser) {
      showError("Please sign in to post a job.");
      return;
    }

    const budgetMin = Number(form.budgetMin || 0);
    const budgetMax = Number(form.budgetMax || 0);
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.category ||
      !form.location.division.trim() ||
      !form.location.district.trim()
    ) {
      showError(
        "Please complete the title, description, category, and location fields.",
      );
      return;
    }
    if (!Number.isFinite(budgetMin) || budgetMin < 300) {
      showError("Budget minimum cannot be less than 300 ৳.");
      return;
    }

    if (!Number.isFinite(budgetMax) || budgetMax < budgetMin) {
      showError("Budget maximum cannot be less than the budget minimum.");
      return;
    }

    if (form.deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(form.deadline);
      if (selectedDate < today) {
        showError("Preferred completion date cannot be in the past.");
        return;
      }
    }

    setSubmitting(true);
    try {
      await createJob({
        title: form.title,
        description: form.description,
        category: form.category,
        serviceType: form.serviceType || form.category,
        location: {
          ...form.location,
          address: form.location.road || form.location.thana || form.location.district,
          city: form.location.district,
        },
        budget: {
          min: budgetMin,
          max: budgetMax,
          type: form.budgetType,
        },
        budgetMin,
        budgetMax,
        budgetType: form.budgetType,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        payRate: Number(form.payRate || budgetMax),
        deadline: form.deadline || undefined,
      });
      showSuccess("Job posted successfully.");
      navigate("/jobs");
    } catch (error) {
      showError(error.message || "Unable to create the job post right now.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#011F50]">Sign in required</h1>
        <p className="mt-3 text-slate-600">
          Please sign in to your account to post a service request.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066FF]/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[30rem] w-[30rem] translate-x-1/3 translate-y-1/3 rounded-full bg-[#0066FF]/5 blur-[120px]" />

      <div className="mx-auto w-11/12 max-w-4xl relative z-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066FF]">
            Post a job
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#011F50]">
            Create a service request
          </h1>
        </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/50 bg-white/60 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-xl relative overflow-hidden transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
        <div className="grid gap-5 md:grid-cols-2 relative z-10">
          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            <span>Job title <span className="text-red-500">*</span></span>
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal outline-none transition focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
              placeholder="Need a plumber for bathroom repair"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            <span>Description <span className="text-red-500">*</span></span>
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              rows="5"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal outline-none transition focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
              placeholder="Explain the job, requirements, materials, timing, and any other important details."
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            <span>Service category <span className="text-red-500">*</span></span>
            <select
              name="category"
              value={form.category}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal outline-none transition focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
              required
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c._id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Service type
            <input
              name="serviceType"
              value={form.serviceType}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal outline-none transition focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
              placeholder="Optional custom type"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            <span>Division <span className="text-red-500">*</span></span>
            <select
              name="location.division"
              value={form.location.division}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal outline-none transition focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
              required
            >
              <option value="">Select Division</option>
              {Object.keys(locations).map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            <span>District <span className="text-red-500">*</span></span>
            <select
              name="location.district"
              value={form.location.district}
              onChange={updateField}
              disabled={!form.location.division}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 disabled:opacity-50"
              required
            >
              <option value="">Select District</option>
              {form.location.division && locations[form.location.division]
                ? Object.keys(locations[form.location.division]).map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))
                : null}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Thana / Upazila
            <select
              name="location.thana"
              value={form.location.thana}
              onChange={updateField}
              disabled={!form.location.district}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 disabled:opacity-50"
            >
              <option value="">Select Thana</option>
              {form.location.division && form.location.district && locations[form.location.division]?.[form.location.district]
                ? locations[form.location.division][form.location.district].map((thana) => (
                    <option key={thana} value={thana}>
                      {thana}
                    </option>
                  ))
                : null}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Exact address / Road
            <input
              name="location.road"
              value={form.location.road}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              placeholder="House #12, Road 3"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            <span>Budget minimum (৳) <span className="text-red-500">*</span></span>
            <input
              type="number"
              min="300"
              name="budgetMin"
              value={form.budgetMin}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            <span>Budget maximum (৳) <span className="text-red-500">*</span></span>
            <input
              type="number"
              min={form.budgetMin || 300}
              name="budgetMax"
              value={form.budgetMax}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Budget type
            <select
              name="budgetType"
              value={form.budgetType}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
            >
              <option value="FIXED">Fixed</option>
              <option value="HOURLY">Hourly</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Pay rate / hour (optional)
            <input
              type="number"
              min="0"
              name="payRate"
              value={form.payRate}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Skills needed
            <input
              name="skills"
              value={form.skills}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              placeholder="Plumbing, pipe fitting, leak repair"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Preferred completion date
            <input
              type="date"
              name="deadline"
              min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]}
              value={form.deadline}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal outline-none transition focus:border-[#0066FF] focus:bg-white focus:ring-4 focus:ring-[#0066FF]/10"
            />
          </label>
        </div>

        <div className="mt-8 flex justify-end relative z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-200 bg-white/50 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 backdrop-blur-sm shadow-sm mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-[#0066FF] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,102,255,0.25)] transition-all duration-300 hover:bg-[#0052cc] hover:shadow-[0_12px_24px_rgba(0,102,255,0.35)] hover:-translate-y-0.5 focus:ring-4 focus:ring-[#0066FF]/20 disabled:opacity-70"
          >
            {submitting ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
      </div>
    </main>
  );
}

export default PostJobPage;
