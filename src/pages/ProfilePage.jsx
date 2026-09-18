import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { updateProfile, uploadAvatar, changePassword, getUserReviews } from "../services/api.js";
import { useTranslation } from "react-i18next";
import { useToast } from "../contexts/ToastContext.jsx";
import { Lock, EyeOff, Eye, Star, CheckCircle } from "../components/ui/Icons.jsx";
import { locations } from "../data/locations.js";
import { useDocumentTitle } from "../hooks/useDocumentTitle.js";

// Removed hardcoded categories

const initialProfile = {
  name: "",
  email: "",
  phone: "",
  location: { division: "", district: "", thana: "", road: "" },
  category: "",
  hourlyRate: "",
  workingHoursStart: "09:00",
  workingHoursEnd: "18:00",
  workingHours: "09:00 AM - 06:00 PM",
  availableNow: false,
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
  const { t } = useTranslation();
  useDocumentTitle(t("profile.title", "Profile Setup"));
  const navigate = useNavigate();
  const { currentUser, updateSession, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [changePwForm, setChangePwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changingPw, setChangingPw] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewTab, setReviewTab] = useState("PROVIDER"); // "PROVIDER" or "HIRER"
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);

  const isWorker = useMemo(
    () =>
      currentUser?.activeMode === "SERVICE_PROVIDER" ||
      currentUser?.role === "SERVICE_PROVIDER",
    [currentUser],
  );

  const renderTimeSelectors = (fieldName, timeValue) => {
    const [hStr, mStr] = (timeValue || "09:00").split(":");
    let hour24 = parseInt(hStr, 10) || 0;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    let hour12 = hour24 % 12;
    if (hour12 === 0) hour12 = 12;

    return (
      <div className="flex items-center gap-1">
        <select
          value={String(hour12).padStart(2, "0")}
          onChange={(e) => {
            let newH = parseInt(e.target.value, 10);
            if (ampm === "PM" && newH !== 12) newH += 12;
            if (ampm === "AM" && newH === 12) newH = 0;
            updateField({
              target: { name: fieldName, value: `${String(newH).padStart(2, "0")}:${mStr}` },
            });
          }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 text-sm"
        >
          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((hr) => (
            <option key={hr} value={hr}>{hr}</option>
          ))}
        </select>
        <span className="text-slate-400 font-bold">:</span>
        <select
          value={mStr}
          onChange={(e) => {
            updateField({
              target: { name: fieldName, value: `${String(hour24).padStart(2, "0")}:${e.target.value}` },
            });
          }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 text-sm"
        >
          {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={ampm}
          onChange={(e) => {
            let newH = hour24;
            const newAmpm = e.target.value;
            if (newAmpm === "PM" && newH < 12) newH += 12;
            if (newAmpm === "AM" && newH >= 12) newH -= 12;
            updateField({
              target: { name: fieldName, value: `${String(newH).padStart(2, "0")}:${mStr}` },
            });
          }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 font-bold outline-none transition focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 text-sm"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    );
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    if (!currentUser) return;

    // Fetch categories
    import("../services/api.js").then(({ getCategories }) => {
      getCategories().then((data) => {
        if (data) setCategories(data);
      }).catch(console.error);
    });

    let startTime = "09:00";
    let endTime = "18:00";

    if (currentUser.profile?.workingHours && currentUser.profile.workingHours.includes("-")) {
      const parts = currentUser.profile.workingHours.split("-").map(s => s.trim());
      if (parts.length === 2) {
        const parseTime = (tStr) => {
          const match = tStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (match) {
            let h = parseInt(match[1], 10);
            const m = match[2];
            const ampm = match[3].toUpperCase();
            if (ampm === "PM" && h < 12) h += 12;
            if (ampm === "AM" && h === 12) h = 0;
            return `${String(h).padStart(2, '0')}:${m}`;
          }
          return tStr;
        };
        startTime = parseTime(parts[0]);
        endTime = parseTime(parts[1]);
      }
    }

    setForm({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone ? currentUser.phone.replace("+880", "") : "",
      location: currentUser.location || { division: "", district: "", thana: "", road: "" },
      category: currentUser.profile?.category || "",
      hourlyRate: currentUser.profile?.hourlyRate?.toString() || "",
      workingHoursStart: startTime,
      workingHoursEnd: endTime,
      workingHours: currentUser.profile?.workingHours || "09:00 AM - 06:00 PM",
      availableNow: Boolean(currentUser.profile?.availableNow),
      bio: currentUser.profile?.bio || "",
      skills: (currentUser.profile?.skills || []).join(", "),
      password: "",
      confirmPassword: "",
      avatar: currentUser.avatar || "",
    });
    setImgError(false);

    // Fetch reviews
    setReviewsLoading(true);
    const controller = new AbortController();
    getUserReviews(currentUser._id, controller.signal)
      .then((data) => {
        if (data?.reviews) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {})
      .finally(() => setReviewsLoading(false));

    return () => controller.abort();
  }, [currentUser, isAuthenticated, navigate]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
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
      setForm((current) => ({
        ...current,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }

  async function handleAvatarFileSelect(file) {
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
    setUploadingAvatar(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      try {
        const response = await uploadAvatar(base64Data);
        if (response?.user) {
          updateSession(response.user);
          setForm((current) => ({
            ...current,
            avatar: response.user.avatar || response.avatar,
          }));
          setImgError(false);
          showSuccess("Profile picture updated permanently.");
        }
      } catch (error) {
        showError(error.message || "Failed to upload profile picture.");
      } finally {
        setUploadingAvatar(false);
      }
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

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      showError("Please enter a valid email address.");
      return;
    }
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      showError("Phone number must contain exactly 10 digits after +880.");
      return;
    }

    setSaving(true);
    try {
      const formatTime = (timeStr) => {
        if (!timeStr) return "";
        const [hStr, mStr] = timeStr.split(":");
        let h = parseInt(hStr, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        return `${String(h).padStart(2, '0')}:${mStr} ${ampm}`;
      };

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone ? `+880${form.phone}` : "",
        location: form.location,
        avatar: form.avatar || undefined,
        bio: form.bio,
      };

      if (isWorker) {
        payload.category = form.category;
        payload.hourlyRate = Number(form.hourlyRate || 0);
        payload.workingHours = `${formatTime(form.workingHoursStart)} - ${formatTime(form.workingHoursEnd)}`;
        payload.availableNow = form.availableNow;
        payload.skills = form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }

      const response = await updateProfile(payload);
      if (response?.user) {
        updateSession(response.user);
      }
      showSuccess("Profile updated successfully.");
    } catch (error) {
      showError(error.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!changePwForm.currentPassword || !changePwForm.newPassword) {
      showError("All password fields are required.");
      return;
    }
    if (changePwForm.newPassword.length < 8) {
      showError("New password must be at least 8 characters.");
      return;
    }
    if (changePwForm.newPassword !== changePwForm.confirmPassword) {
      showError("New passwords do not match.");
      return;
    }
    setChangingPw(true);
    try {
      await changePassword(changePwForm.currentPassword, changePwForm.newPassword);
      setChangePwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showSuccess("Password changed successfully. Your other sessions have been signed out.");
    } catch (error) {
      showError(error.message || "Failed to change password.");
    } finally {
      setChangingPw(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0066FF]/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-[30rem] w-[30rem] translate-x-1/3 translate-y-1/3 rounded-full bg-[#0066FF]/5 blur-[120px]" />

      <div className="mx-auto max-w-5xl px-4 md:px-6 relative z-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0066FF]">
            Profile Settings ({isWorker ? "Service Provider" : "Hirer"} Mode)
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#011F50]">
            Edit your account profile
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1.1fr_2fr]"
      >
        <aside className="rounded-3xl border border-white/50 bg-white/60 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
          <div className="flex flex-col items-center text-center">
            {form.avatar && !imgError ? (
              <img
                src={form.avatar}
                alt={form.name || "Profile avatar"}
                className="h-28 w-28 rounded-full object-cover ring-4 ring-[#0066FF]/10 shadow-md"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#011F50] text-3xl font-bold text-white ring-4 ring-[#0066FF]/10 shadow-md">
                {getInitials(form.name)}
              </div>
            )}
            <h2 className="mt-4 text-xl font-bold text-[#011F50]">
              {form.name || "Your Name"}
            </h2>
            <p className="mt-1 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {isWorker ? "🛠️ Service Provider" : "💼 Hirer"}
            </p>

            <div className="mt-6 flex gap-4 w-full justify-center">
              <div className="flex flex-col items-center p-3 rounded-2xl bg-white/50 border border-slate-100 shadow-sm backdrop-blur-sm w-1/2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hirer Rating</span>
                <div className="flex items-center gap-1.5 text-amber-500 mt-1">
                  <Star className="h-5 w-5 fill-amber-500" />
                  <span className="text-lg font-bold text-slate-700">
                    {currentUser?.profile?.hirerRating > 0 ? currentUser.profile.hirerRating.toFixed(1) : "New"}
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-0.5">{currentUser?.profile?.hirerReviews || 0} reviews</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-2xl bg-white/50 border border-slate-100 shadow-sm backdrop-blur-sm w-1/2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Provider Rating</span>
                <div className="flex items-center gap-1.5 text-amber-500 mt-1">
                  <Star className="h-5 w-5 fill-amber-500" />
                  <span className="text-lg font-bold text-slate-700">
                    {currentUser?.profile?.providerRating > 0 ? currentUser.profile.providerRating.toFixed(1) : "New"}
                  </span>
                </div>
                <span className="text-xs text-slate-400 mt-0.5">{currentUser?.profile?.providerReviews || 0} reviews</span>
              </div>
            </div>
          </div>

          <label className="mt-6 block text-sm font-medium text-slate-700">
            {t("profile.avatar", "Profile Picture")}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-2 rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 backdrop-blur-sm ${
                dragActive
                  ? "border-[#0066FF] bg-[#0066FF]/10 scale-[1.02]"
                  : "border-slate-300 bg-white/40 hover:bg-white/60 hover:border-slate-400"
              }`}
            >
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileInputChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer text-sm text-slate-600 flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] transition-transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-[#0066FF]">
                  {uploadingAvatar
                    ? "Uploading image..."
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  PNG, JPG, WebP up to 5MB
                </p>
              </label>
            </div>
            {avatarFile && (
              <p className="mt-2 text-xs text-slate-600 truncate">
                Selected: {avatarFile.name}
              </p>
            )}
          </label>
        </aside>

        <div className="rounded-3xl border border-white/50 bg-white/60 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
          <h3 className="mb-4 text-lg font-bold text-[#011F50] border-b border-slate-100 pb-3">
            {t("profile.personalInfo", "Personal Information")}
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                {t("profile.fullName", "Full name")}
                {currentUser?.nidVerified && (
                  <span title={t("profile.nameLocked")} className="text-green-500 bg-green-50 p-1 rounded-full"><CheckCircle className="w-4 h-4" /></span>
                )}
              </div>
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                disabled={currentUser?.nidVerified}
                className={`rounded-xl border bg-slate-50 px-4 py-3 font-normal outline-none transition ${currentUser?.nidVerified ? "border-slate-100 text-slate-400 cursor-not-allowed" : "border-slate-200 focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"}`}
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              {t("profile.email", "Email")}
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
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-within focus-within:border-[#0066FF] focus-within:ring-4 focus-within:ring-[#0066FF]/10">
                <span className="flex items-center bg-slate-100 px-4 text-slate-500 font-medium border-r border-slate-200 select-none">
                  +880
                </span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setForm(cur => ({ ...cur, phone: value }));
                  }}
                  className="w-full px-4 py-3 font-normal outline-none bg-transparent"
                  placeholder="17XXXXXXXX"
                  maxLength={10}
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Division
              <select
                name="location.division"
                value={form.location?.division || ""}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
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
                value={form.location?.district || ""}
                onChange={updateField}
                disabled={!form.location?.division}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 disabled:opacity-50"
              >
                <option value="">Select District</option>
                {form.location?.division && locations[form.location.division]
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
                value={form.location?.thana || ""}
                onChange={updateField}
                disabled={!form.location?.district}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 disabled:opacity-50"
              >
                <option value="">Select Thana</option>
                {form.location?.division && form.location?.district && locations[form.location.division]?.[form.location.district]
                  ? locations[form.location.division][form.location.district].map((thana) => (
                      <option key={thana} value={thana}>
                        {thana}
                      </option>
                    ))
                  : null}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Road / Area
              <input
                name="location.road"
                value={form.location?.road || ""}
                onChange={updateField}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                placeholder="e.g. Road 15"
              />
            </label>
          </div>

          {/* Service Provider Specific Configuration Options */}
          {isWorker ? (
            <div className="mt-8 border-t border-slate-100 pt-6 relative z-10">
              <h3 className="mb-4 text-lg font-bold text-[#011F50] border-b border-slate-100 pb-3">
                Service Provider Settings
              </h3>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Service category
                  <select
                    name="category"
                    value={form.category}
                    onChange={updateField}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                  >
                    <option value="">Select a primary service</option>
                    {categories.map((c) => (
                      <option key={c._id || c.name} value={c.name}>
                        {c.name}
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
                    placeholder="e.g. 500"
                  />
                </label>

                <div className="grid gap-2 text-sm font-semibold text-slate-700">
                  Working hours
                  <div className="flex items-center gap-2 flex-wrap">
                    {renderTimeSelectors("workingHoursStart", form.workingHoursStart)}
                    <span className="text-slate-400 font-bold px-1">to</span>
                    {renderTimeSelectors("workingHoursEnd", form.workingHoursEnd)}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="availableNow"
                    name="availableNow"
                    checked={form.availableNow}
                    onChange={updateField}
                    className="h-5 w-5 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <label htmlFor="availableNow" className="cursor-pointer text-sm font-semibold text-slate-700">
                    Available for immediate work
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
                  Skills (comma separated)
                  <input
                    name="skills"
                    value={form.skills}
                    onChange={updateField}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                    placeholder="e.g. Electrical wiring, Pipe repair, House cleaning"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
                  Provider Bio & Experience
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={updateField}
                    rows="4"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                    placeholder="Describe your expertise, experience, tools, and services provided."
                  />
                </label>
              </div>
            </div>
          ) : (
            /* Hirer Specific Section */
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="mb-4 text-lg font-bold text-[#011F50] border-b border-slate-100 pb-3">
                Hirer Configuration
              </h3>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                About You / Hirer Notes
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={updateField}
                  rows="4"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                  placeholder="Share details about your household or business service needs."
                />
              </label>
            </div>
          )}

          {/* Change Password Section */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <div className="mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#0066FF]" />
              <h3 className="text-lg font-bold text-[#011F50]">Change Password</h3>
            </div>
            <p className="mb-5 text-sm text-slate-500">Changing your password will sign out all other active sessions.</p>

            <form onSubmit={handleChangePassword} className="grid gap-4 md:grid-cols-3">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Current Password
                <div className="relative">
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    value={changePwForm.currentPassword}
                    onChange={(e) => setChangePwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                    placeholder="Current password"
                    autoComplete="current-password"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowCurrentPw((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                New Password
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    value={changePwForm.newPassword}
                    onChange={(e) => setChangePwForm((p) => ({ ...p, newPassword: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowNewPw((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Confirm New Password
                <input
                  type="password"
                  value={changePwForm.confirmPassword}
                  onChange={(e) => setChangePwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal outline-none transition focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                />
              </label>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={changingPw || !changePwForm.currentPassword || !changePwForm.newPassword || !changePwForm.confirmPassword}
                  className="rounded-xl bg-[#011F50] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0066FF] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {changingPw ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="mb-4 text-lg font-bold text-[#011F50]">Reviews</h3>
            
            <div className="mb-6 flex gap-2 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setReviewTab("PROVIDER")}
                className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                  reviewTab === "PROVIDER"
                    ? "border-[#0066FF] text-[#0066FF]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                As Service Provider
              </button>
              <button
                type="button"
                onClick={() => setReviewTab("HIRER")}
                className={`border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                  reviewTab === "HIRER"
                    ? "border-[#0066FF] text-[#0066FF]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                As Hirer
              </button>
            </div>

            {reviewsLoading ? (
              <div className="py-8 text-center text-sm text-slate-500">Loading reviews...</div>
            ) : (
              <div className="space-y-4">
                {reviews.filter((r) => r.role === (reviewTab === "PROVIDER" ? "HIRER_TO_PROVIDER" : "PROVIDER_TO_HIRER")).length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">No reviews found.</p>
                ) : (
                  reviews
                    .filter((r) => r.role === (reviewTab === "PROVIDER" ? "HIRER_TO_PROVIDER" : "PROVIDER_TO_HIRER"))
                    .map((review) => (
                      <div key={review._id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-amber-400">
                              <Star className="mr-1 h-4 w-4 fill-amber-400" />
                              <span className="font-bold text-slate-700">{review.rating}</span>
                            </div>
                            <span className="text-xs text-slate-400">
                              • {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-[#0066FF] bg-[#0066FF]/10 px-2 py-1 rounded">
                            {review.job?.title || "Job"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{review.comment || "No comment provided."}</p>
                        <p className="mt-3 text-xs font-medium text-slate-400">
                          Reviewed by {review.reviewer?.name || "Unknown"}
                        </p>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
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
              className="rounded-xl bg-[#0066FF] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,102,255,0.25)] transition-all duration-300 hover:bg-[#0052cc] hover:shadow-[0_12px_24px_rgba(0,102,255,0.35)] hover:-translate-y-0.5 focus:ring-4 focus:ring-[#0066FF]/20 disabled:opacity-70 mt-6 md:mt-0"
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </div>
      </form>
      </div>
    </main>
  );
}

export default ProfilePage;
