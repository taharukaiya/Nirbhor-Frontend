import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { createJob } from "../services/api.js";
import { locations } from "../data/locations.js";

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
    if (
      !Number.isFinite(budgetMin) ||
      !Number.isFinite(budgetMax) ||
      budgetMax < budgetMin ||
      budgetMax <= 0
    ) {
      showError("Please enter a valid budget range in ৳.");
      return;
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
    <div className="mx-auto w-11/12 max-w-4xl py-10 lg:w-10/12">
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
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Job title
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              placeholder="Need a plumber for bathroom repair"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              rows="5"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              placeholder="Explain the job, requirements, materials, timing, and any other important details."
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Service category
            <select
              name="category"
              value={form.category}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
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
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              placeholder="Optional custom type"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Division
            <select
              name="location.division"
              value={form.location.division}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
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
            District
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
            Budget minimum (৳)
            <input
              type="number"
              min="0"
              name="budgetMin"
              value={form.budgetMin}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Budget maximum (৳)
            <input
              type="number"
              min="0"
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
              value={form.deadline}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-[#0066FF] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0066FF]/20 transition hover:bg-[#011F50] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Posting..." : "Post job"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostJobPage;
