import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicUser, getUserReviews } from "../services/api.js";
import {
  MapPin,
  Calendar,
  Star,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  MessageSquare,
  Award,
  ChevronLeft
} from "lucide-react";

/**
 * ARCHITECTURAL INTENT:
 * PublicProfilePage renders a read-only view of a user's profile, accessible to anyone (authenticated or not).
 * It aggregates data from two API endpoints (`getPublicUser`, `getUserReviews`) to display
 * personal information, skills, location, verification status, and historical reviews.
 * 
 * STATE MANAGEMENT:
 * - Uses `Promise.all` in `useEffect` to fetch user details and reviews concurrently.
 * - `user` & `reviews`: Local state variables caching the fetched data.
 * - Display logic forks based on the user's `activeMode` (PROVIDER vs HIRER) to show relevant metrics (e.g., `hirerRating` vs `rating`).
 */

export default function PublicProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewTab, setReviewTab] = useState("PROVIDER");

  useEffect(() => {
    async function fetchProfileData() {
      try {
        setLoading(true);
        setError(null);
        
        const [userRes, reviewsRes] = await Promise.all([
          getPublicUser(id),
          getUserReviews(id)
        ]);
        
        if (userRes.success) {
          setUser(userRes.user);
        } else {
          setError(userRes.error?.message || "Failed to load profile");
        }
        
        if (reviewsRes.success) {
          setReviews(reviewsRes.reviews);
        }
      } catch (err) {
        console.error("Profile load error:", err);
        setError("An unexpected error occurred while loading the profile.");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchProfileData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0066FF]/20 border-t-[#0066FF]"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white/60 backdrop-blur-2xl border border-white/40 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full text-center transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,102,255,0.1)] hover:border-[#0066FF]/20">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Profile Not Found</h2>
          <p className="text-slate-600 mb-6">{error || "This user does not exist or has been removed."}</p>
          <Link to="/services" className="inline-flex items-center gap-2 bg-[#0066FF] text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-md shadow-[#0066FF]/20">
            <ChevronLeft className="w-4 h-4" /> Go Back
          </Link>
        </div>
      </div>
    );
  }

  const { profile } = user;
  const isProvider = user.activeMode === "PROVIDER";
  
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const displayRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  const displayReviews = reviews.length;
  const filteredReviews = reviews.filter((r) => r.role === (reviewTab === "PROVIDER" ? "HIRER_TO_PROVIDER" : "PROVIDER_TO_HIRER"));

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-[#0066FF] transition-colors font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden relative transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,102,255,0.1)] hover:border-[#0066FF]/20">
          {/* Cover Gradient */}
          <div className="h-32 bg-gradient-to-r from-[#0066FF] to-blue-400"></div>
          
          <div className="px-8 pb-8">
            <div className="relative flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 mb-6">
              <div className="relative w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-white overflow-hidden shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#0066FF]">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {user.nidVerified && (
                  <div className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                      {user.name}
                    </h1>
                    <p className="text-lg text-slate-600 font-medium mt-1">
                      {profile?.category || (isProvider ? "Service Provider" : "Client")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Info Column */}
              <div className="space-y-4">
                {profile?.bio && (
                  <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#0066FF]/20">
                    <h3 className="text-sm font-bold text-[#011F50] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#0066FF]" /> About
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-100 flex items-start gap-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#0066FF]/30 group">
                    <MapPin className="w-5 h-5 text-[#0066FF]/60 shrink-0 group-hover:text-[#0066FF] transition-colors" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Location</p>
                      <p className="text-sm text-slate-800 font-semibold">
                        {typeof user.location === 'object' 
                          ? (user.location?.fullAddress || user.location?.district || "Not specified")
                          : (user.location || "Not specified")}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-100 flex items-start gap-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#0066FF]/30 group">
                    <Calendar className="w-5 h-5 text-[#0066FF]/60 shrink-0 group-hover:text-[#0066FF] transition-colors" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Member Since</p>
                      <p className="text-sm text-slate-800 font-semibold">
                        {new Date(user.memberSince).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                {profile?.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, idx) => (
                        <span key={idx} className="px-4 py-2 bg-gradient-to-r from-[#0066FF]/5 to-[#0066FF]/10 text-[#0066FF] rounded-xl text-sm font-semibold border border-[#0066FF]/20 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-[#0066FF] hover:text-white cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-blue-600 fill-current" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Overall Rating</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">{displayRating > 0 ? displayRating.toFixed(1) : "0.0"}</span>
                      {displayReviews > 0 && <span className="text-slate-500 font-medium">({displayReviews} reviews)</span>}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Award className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Completed</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">{profile?.completedJobs || 0}</span>
                      <span className="text-slate-500 font-medium">jobs</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-5 border border-indigo-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-indigo-600 fill-current" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Hirer Rating</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">{profile?.hirerRating > 0 ? profile.hirerRating.toFixed(1) : "0.0"}</span>
                      <span className="text-slate-500 font-medium">({profile?.hirerReviews || 0} reviews)</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-5 border border-purple-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-purple-600 fill-current" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Provider Rating</h4>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">{profile?.providerRating > 0 ? profile.providerRating.toFixed(1) : "0.0"}</span>
                      <span className="text-slate-500 font-medium">({profile?.providerReviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verification
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Identity (NID)</span>
                    {user.nidVerified ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Platform Status</span>
                    <span className="px-3 py-1 bg-blue-100 text-[#0066FF] text-xs font-bold rounded-full">
                      Active Member
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#0066FF]" /> 
              Reviews ({reviews.length})
            </h2>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
              <button
                onClick={() => setReviewTab("PROVIDER")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  reviewTab === "PROVIDER"
                    ? "bg-white text-[#011F50] shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                As Provider
              </button>
              <button
                onClick={() => setReviewTab("HIRER")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  reviewTab === "HIRER"
                    ? "bg-white text-[#011F50] shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                As Hirer
              </button>
            </div>
          </div>
          
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map((review) => (
                <div 
                  key={review._id} 
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <Link 
                      to={`/user/${review.reviewer?._id || review.reviewer}`} 
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-[#0066FF]/30 transition-all">
                        {review.reviewer?.avatar ? (
                          <img src={review.reviewer.avatar} alt={review.reviewer.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-[#0066FF] font-bold">
                            {review.reviewer?.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
                          {review.reviewer?.name || "Unknown User"}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                      <span className="font-bold text-amber-600 text-sm mr-1">{review.rating.toFixed(1)}</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${star <= review.rating ? "text-amber-500 fill-amber-500" : "text-slate-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {review.job && (
                    <div className="mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Job: </span>
                      <span className="text-sm font-medium text-slate-700">{review.job.title}</span>
                    </div>
                  )}

                  <p className="text-slate-600 leading-relaxed text-sm">
                    "{review.comment}"
                  </p>
                  
                  {review.tags && review.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {review.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">No Reviews Yet</h3>
              <p className="text-slate-500">This user hasn't received any reviews yet.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
