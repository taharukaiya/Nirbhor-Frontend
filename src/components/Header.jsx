import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import { X, Menu } from "./ui/Icons.jsx";
import { useAuth } from "../contexts/useAuth.js";
import { updateProfile } from "../services/api.js";
import { useToast } from "../contexts/ToastContext.jsx";

function desktopLinkClass({ isActive }) {
  return [
    "relative text-sm font-medium transition-colors duration-200 py-1",
    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:transition-all after:duration-200",
    isActive
      ? "text-[#0066FF] after:w-full after:bg-[#0066FF]"
      : "text-slate-600 hover:text-[#011F50] after:w-0 hover:after:w-full after:bg-[#011F50]",
  ].join(" ");
}

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

function Header() {
  const { currentUser, isAuthenticated, signOut, updateSession } = useAuth();
  const { showSuccess, showError } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);
  const navigate = useNavigate();

  // Build navigation links based on authentication state and role
  const getNavigationLinks = () => {
    const staticLinks = [
      // { label: "Home", to: "/" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "About", to: "/about" },
    ];

    if (!isAuthenticated) {
      return staticLinks;
    }

    // Add role-specific links for authenticated users
    const authLinks = [];
    if (
      currentUser?.activeMode === "SERVICE_PROVIDER" ||
      currentUser?.role === "SERVICE_PROVIDER"
    ) {
      authLinks.push({ label: "Find Jobs", to: "/jobs" });
    } else {
      authLinks.push({ label: "Find Services", to: "/services" });
    }

    return [...authLinks, ...staticLinks];
  };

  const navigationLinks = getNavigationLinks();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    navigate("/");
  };

  const handleRoleSwitch = async () => {
    if (!currentUser) return;
    setSwitchingRole(true);
    try {
      const newMode =
        currentUser.activeMode === "SERVICE_PROVIDER"
          ? "HIRER"
          : "SERVICE_PROVIDER";
      const response = await updateProfile({ activeMode: newMode });
      await updateSession(response.user);
      showSuccess(
        `Switched to ${newMode === "HIRER" ? "Hirer" : "Service Provider"} mode`,
      );
      setProfileOpen(false);
      // Refresh navigation links by re-rendering
      navigate(0);
    } catch (error) {
      showError(error.message || "Failed to switch role");
    } finally {
      setSwitchingRole(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 w-11/12 items-center justify-between lg:w-10/12">
        <Link
          className="flex shrink-0 items-center"
          to="/"
          onClick={closeMenu}
          aria-label="Nirbhor — go to homepage"
        >
          <img
            alt="Nirbhor"
            className="h-12 w-auto object-contain sm:h-14"
            src={logo1}
          />
        </Link>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label="Primary navigation"
        >
          {navigationLinks.map((link) => (
            <NavLink key={link.to} className={desktopLinkClass} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {!isAuthenticated ? (
            <>
              <Link
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-[#0066FF] hover:text-[#0066FF]"
                to="/login"
              >
                Log In
              </Link>
              <Link
                className="rounded-full bg-[#0066FF] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#011F50] hover:shadow-md"
                to="/register"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:border-[#0066FF]/30"
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name || "Profile"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#011F50] text-xs font-bold text-white">
                    {getInitials(currentUser?.name)}
                  </div>
                )}
                <span className="pr-1 text-sm font-semibold text-slate-700">
                  {currentUser?.name?.split(" ")[0] || "Profile"}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-200 pb-2 mb-2">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Current Mode
                    </div>
                    <button
                      type="button"
                      onClick={handleRoleSwitch}
                      disabled={switchingRole}
                      className="w-full rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                    >
                      {switchingRole
                        ? "Switching..."
                        : currentUser?.activeMode === "SERVICE_PROVIDER"
                          ? "🛠️ Service Provider"
                          : "💼 Hirer"}
                    </button>
                    <div className="text-center mt-1">
                      <button
                        type="button"
                        onClick={handleRoleSwitch}
                        disabled={switchingRole}
                        className="text-xs font-medium text-[#0066FF] hover:text-[#011F50] disabled:opacity-50"
                      >
                        Switch Mode
                      </button>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit Profile
                  </Link>
                  {currentUser?.role === "HIRER" ||
                  currentUser?.activeMode === "HIRER" ? (
                    <Link
                      to="/post-job"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Post a Job
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-[#011F50] shadow-sm transition-colors hover:bg-slate-50 md:hidden"
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-[100] h-dvh w-screen overflow-y-auto bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-label="Mobile navigation overlay"
      >
        <aside
          id="mobile-menu"
          className={`absolute inset-y-0 right-0 z-[101] flex h-dvh w-[min(20rem,85vw)] flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <Link to="/" onClick={closeMenu}>
              <img
                alt="Nirbhor"
                className="h-10 w-auto object-contain"
                src={logo1}
              />
            </Link>
            <button
              className="flex items-center justify-center rounded-full border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  [
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#0066FF]/10 text-[#0066FF]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#011F50]",
                  ].join(" ")
                }
                to={link.to}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-100 px-4 pb-6 pt-4 space-y-2.5">
            {!isAuthenticated ? (
              <>
                <Link
                  className="block rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-[#0066FF] hover:text-[#0066FF]"
                  to="/login"
                  onClick={closeMenu}
                >
                  Log In
                </Link>
                <Link
                  className="block rounded-full bg-[#0066FF] px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#011F50]"
                  to="/register"
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="block rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-[#0066FF] hover:text-[#0066FF]"
                  to="/profile"
                  onClick={closeMenu}
                >
                  Edit Profile
                </Link>
                {currentUser?.role === "HIRER" ||
                currentUser?.activeMode === "HIRER" ? (
                  <Link
                    className="block rounded-full bg-[#0066FF] px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#011F50]"
                    to="/post-job"
                    onClick={closeMenu}
                  >
                    Post a Job
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="block w-full rounded-full border border-red-200 bg-red-50 px-5 py-3 text-center text-sm font-semibold text-red-600"
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}

export default Header;
