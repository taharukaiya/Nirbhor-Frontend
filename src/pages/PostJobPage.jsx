import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { createJob } from "../services/api.js";

const SERVICE_CATEGORIES = [
  "Maid",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Cleaner",
  "Driver",
  "Mechanic",
  "Painter",
  "Cook",
  "Tutor",
  "Other",
];

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  serviceType: "",
  location: "",
  city: "",
  address: "",
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

  const isHirer = useMemo(
    () => currentUser?.role === "HIRER" || currentUser?.activeMode === "HIRER",
    [currentUser],
  );

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isHirer) {
      showError("Only hirers can post jobs.");
      return;
    }

    const budgetMin = Number(form.budgetMin || 0);
    const budgetMax = Number(form.budgetMax || 0);
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.category ||
      !form.location.trim()
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
          district: form.location,
          city: form.city || form.location,
          address: form.address || form.location,
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

  if (!isHirer) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#011F50]">Hire only</h1>
        <p className="mt-3 text-slate-600">
          Please sign in with a hirer account to post a service request.
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
              {SERVICE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
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
            Location
            <input
              name="location"
              value={form.location}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              placeholder="Dhaka"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            City
            <input
              name="city"
              value={form.city}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              placeholder="Dhanmondi"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Exact address
            <input
              name="address"
              value={form.address}
              onChange={updateField}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              placeholder="House #12, Road 3, Dhanmondi"
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
