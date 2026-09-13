import { useEffect, useRef, useState } from "react";
import { getPublicUser } from "../services/api.js";
import { ShieldCheck, MapPin, Star, Briefcase, X } from "./ui/Icons.jsx";

function getInitials(name) {
  if (!name) return "U";
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function RatingStars({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.round(rating) ? "text-amber-400" : "text-slate-300"}`}
          filled={i < Math.round(rating)}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-slate-600">
        {rating > 0 ? rating.toFixed(1) : "No ratings yet"}
      </span>
    </span>
  );
}

export function UserProfileModal({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    getPublicUser(userId)
      .then((res) => setUser(res?.user || null))
      .catch(() => setError("Unable to load user profile."))
      .finally(() => setLoading(false));
  }, [userId]);

  // Close on overlay click
  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!userId) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          aria-label="Close profile"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header gradient */}
        <div className="h-24 bg-gradient-to-br from-[#011F50] to-[#0066FF]" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-12 mb-4 flex items-end justify-between">
            <div className="relative">
              {user?.avatar && !imgError ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#011F50] text-xl font-bold text-white ring-4 ring-white shadow-lg">
                  {loading ? "…" : getInitials(user?.name)}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-4 w-32 rounded bg-slate-100" />
              <div className="h-4 w-56 rounded bg-slate-100" />
            </div>
          ) : error ? (
            <div className="py-8 text-center text-sm text-red-500">{error}</div>
          ) : user ? (
            <>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#011F50]">{user.name}</h2>
                {user.nidVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    <ShieldCheck className="h-3 w-3" /> NID Verified
                  </span>
                )}
              </div>

              {user.profile?.category && (
                <p className="mt-1 text-sm font-medium text-[#0066FF]">{user.profile.category}</p>
              )}

              {user.location && (
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {user.location}
                </p>
              )}

              {user.memberSince && (
                <p className="mt-1 text-xs text-slate-400">
                  Member since {new Date(user.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              )}

              <hr className="my-4 border-slate-100" />

              {/* Ratings */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">As Provider</p>
                  <RatingStars rating={user.profile?.rating || 0} />
                  <p className="mt-0.5 text-xs text-slate-500">{user.profile?.reviews || 0} reviews</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">As Hirer</p>
                  <RatingStars rating={user.profile?.hirerRating || 0} />
                  <p className="mt-0.5 text-xs text-slate-500">{user.profile?.hirerReviews || 0} reviews</p>
                </div>
              </div>

              {user.profile?.completedJobs > 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5">
                  <Briefcase className="h-4 w-4 text-[#0066FF]" />
                  <span className="text-sm font-semibold text-[#0066FF]">{user.profile.completedJobs} jobs completed</span>
                </div>
              )}

              {user.profile?.bio && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">About</p>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">{user.profile.bio}</p>
                </div>
              )}

              {user.profile?.skills?.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.profile.skills.map((s) => (
                      <span key={s} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-sm text-slate-400">User not found</div>
          )}
        </div>
      </div>
    </div>
  );
}
export default UserProfileModal;
