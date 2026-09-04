import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { updateProfile } from "../services/api.js";
import { useToast } from "../contexts/ToastContext.jsx";

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

const initialProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  category: "",
  hourlyRate: "",
  bio: "",
  skills: "",
  password: "",
  confirmPassword: "",
  avatar: "",
};

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, updateSession, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const isWorker = useMemo(
    () =>
      currentUser?.role === "SERVICE_PROVIDER" ||
      currentUser?.activeMode === "SERVICE_PROVIDER",
    [currentUser],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    if (!currentUser) return;

    setForm({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      location: currentUser.location || currentUser.profile?.district || "",
      category: currentUser.profile?.category || "",
      hourlyRate: currentUser.profile?.hourlyRate?.toString() || "",
      bio: currentUser.profile?.bio || "",
      skills: (currentUser.profile?.skills || []).join(", "),
      password: "",
      confirmPassword: "",
      avatar: currentUser.avatar || "",
    });
  }, [currentUser, isAuthenticated, navigate]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleAvatarFileSelect(file) {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please select a valid image file");
      return;
    }

    setAvatarFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((current) => ({ ...current, avatar: e.target.result }));
    };
    reader.readAsDataURL(file);
  }

  function handleFileInputChange(event) {
    const file = event.target.files?.[0];
    if (file) handleAvatarFileSelect(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleAvatarFileSelect(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!currentUser) return;

    if (form.password && form.password !== form.confirmPassword) {
      showError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        category: isWorker ? form.category : undefined,
        hourlyRate: isWorker ? Number(form.hourlyRate || 0) : undefined,
        bio: form.bio,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        password: form.password || undefined,
        avatar: form.avatar || undefined,
      };

      const response = await updateProfile(payload);
      updateSession(response.user ?? response);
      showSuccess("Profile updated successfully.");
    } catch (error) {
      showError(error.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-11/12 max-w-5xl py-10 lg:w-10/12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066FF]">
            Profile
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#011F50]">
            Edit your account
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1.1fr_2fr]"
      >
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            {form.avatar ? (
              <img
                src={form.avatar}
                alt={form.name || "Profile avatar"}
                className="h-28 w-28 rounded-full object-cover ring-4 ring-[#0066FF]/10"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#011F50] text-3xl font-bold text-white ring-4 ring-[#0066FF]/10">
                {getInitials(form.name)}
              </div>
            )}
            <h2 className="mt-4 text-xl font-bold text-[#011F50]">
              {form.name || "Your Name"}
            </h2>
            <p className="text-sm text-slate-500">
              {currentUser?.role || "User"}
            </p>
          </div>

          <label className="mt-6 block text-sm font-medium text-slate-700">
            Profile Picture
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-2 rounded-xl border-2 border-dashed p-6 text-center transition ${
                dragActive
                  ? "border-[#0066FF] bg-[#0066FF]/5"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer text-sm text-slate-600"
              >
                <p className="font-medium text-[#0066FF]">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </label>
            </div>
            {avatarFile && (
              <p className="mt-2 text-xs text-slate-600">
                Selected: {avatarFile.name}
              </p>
            )}
          </label>
        </aside>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Full name
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Phone number
              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Location
              <input
                name="location"
                value={form.location}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
              />
            </label>

            {isWorker && (
              <>
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Service category
                  <select
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                  >
                    <option value="">Select a service</option>
                    {SERVICE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Hourly rate (৳)
                  <input
                    type="number"
                    min="0"
                    name="hourlyRate"
                    value={form.hourlyRate}
                    onChange={updateField}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                  />
                </label>
              </>
            )}

            <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
              Skills
              <input
                name="skills"
                value={form.skills}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                placeholder="Electrical work, painting, plumbing"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
              Bio
              <textarea
                name="bio"
                value={form.bio}
                onChange={updateField}
                rows="4"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                placeholder="Tell hirers about your experience and reliability."
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              New password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                placeholder="Leave blank to keep current"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Confirm password
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                placeholder="Repeat new password"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#0066FF] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0066FF]/20 transition hover:bg-[#011F50] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
