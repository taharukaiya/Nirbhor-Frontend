import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import logo1 from "../assets/logo1.png";
import { X, Menu, MessageSquare, Bell, CheckCircle } from "./ui/Icons.jsx";
import { useAuth } from "../contexts/useAuth.js";
import { switchMode, getConversations, getNotifications, markNotificationAsRead } from "../services/api.js";
import { useToast } from "../contexts/ToastContext.jsx";
import { initSocket, onNewMessage, onNewNotification } from "../services/socketService.js";
import { formatDistanceToNow } from "date-fns";

/* ─── Helpers ──────────────────────────────────────────────── */

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

/* ─── Avatar component ─────────────────────────────────────── */

function UserAvatar({ user, size = "sm", onError, imgError }) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  if (user?.avatar && !imgError) {
    return (
      <img
        src={user.avatar}
        alt={user.name || "Profile"}
        className={`${sizeClass} rounded-full object-cover ring-1 ring-slate-200`}
        onError={onError}
      />
    );
  }
  return (
    <div className={`${sizeClass} flex items-center justify-center rounded-full bg-[#011F50] font-bold text-white shadow-inner`}>
      {getInitials(user?.name)}
    </div>
  );
}

/* ─── Header ───────────────────────────────────────────────── */

function Header() {
  const { currentUser, isAuthenticated, signOut, updateSession } = useAuth();
  const { showSuccess, showError } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");

  useEffect(() => {
    setImgError(false);
  }, [currentUser?.avatar]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Close profile dropdown on click-outside
  useEffect(() => {
    function handler(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch initial unread count & notifications
  useEffect(() => {
    if (!isAuthenticated) { 
      setUnreadCount(0); 
      setUnreadNotificationCount(0);
      setNotifications([]);
      return; 
    }
    initSocket();
    getConversations()
      .then((res) => {
        const total = (res?.conversations || []).reduce(
          (sum, c) => sum + (c.unreadCount || 0),
          0,
        );
        setUnreadCount(total);
      })
      .catch(() => {});
      
    getNotifications()
      .then((res) => {
        if (res?.success) {
          setNotifications(res.notifications);
          setUnreadNotificationCount(res.unreadCount);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  // Increment badge on new messages and notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubMsg = onNewMessage(() => {
      if (!isChatPage) setUnreadCount((prev) => prev + 1);
    });
    const unsubNotif = onNewNotification((notif) => {
      setUnreadNotificationCount((prev) => prev + 1);
      setNotifications((prev) => [notif, ...prev]);
    });
    return () => {
      unsubMsg();
      unsubNotif();
    };
  }, [isAuthenticated, isChatPage]);

  // Reset badge when navigating to chat
  useEffect(() => {
    if (isChatPage) setUnreadCount(0);
  }, [isChatPage]);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNavigationLinks = () => {
    const homeLink = { label: "Home", to: "/" };
    const staticLinks = [
      { label: "How It Works", to: "/how-it-works" },
      { label: "About", to: "/about" },
    ];

    if (!isAuthenticated) return [homeLink, ...staticLinks];

    const authLinks = [];
    const isServiceMode =
      (currentUser?.activeMode || currentUser?.role) === "SERVICE_PROVIDER";
    if (isServiceMode) {
      authLinks.push({ label: "Find Jobs", to: "/jobs" });
      authLinks.push({ label: "My Applications", to: "/provider/jobs" });
    } else {
      authLinks.push({ label: "Find Services", to: "/services" });
      authLinks.push({ label: "My Jobs", to: "/hirer/jobs" });
    }
    return [homeLink, ...authLinks, ...staticLinks];
  };

  const navigationLinks = getNavigationLinks();
  const closeMenu = () => setMobileMenuOpen(false);

  const handleSignOut = async () => {
    setProfileOpen(false);
    closeMenu();
    await signOut();
    navigate("/");
  };

  const handleRoleSwitch = async () => {
    if (!currentUser || switchingRole) return;
    setSwitchingRole(true);
    try {
      const newMode =
        (currentUser.activeMode || currentUser.role) === "SERVICE_PROVIDER"
          ? "HIRER"
          : "SERVICE_PROVIDER";
      const response = await switchMode(newMode);
      if (response?.user) await updateSession(response.user);
      showSuccess(
        `Switched to ${newMode === "HIRER" ? "Hirer" : "Service Provider"} mode`,
      );
      setProfileOpen(false);
    } catch (error) {
      showError(error.message || "Failed to switch role");
    } finally {
      setSwitchingRole(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      if (id === "all") {
        setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
        setUnreadNotificationCount(0);
      } else {
        setNotifications((prev) => prev.map(n => n._id === id ? { ...n, read: true } : n));
        setUnreadNotificationCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      showError("Failed to mark notification as read");
    }
  };

  const isHirer =
    currentUser?.role === "HIRER" || currentUser?.activeMode === "HIRER";
  const modeLabel =
    (currentUser?.activeMode || currentUser?.role) === "SERVICE_PROVIDER"
      ? "🛠️ Service Provider"
      : "💼 Hirer";
  const switchLabel =
    (currentUser?.activeMode || currentUser?.role) === "SERVICE_PROVIDER"
      ? "Switch to Hirer Mode 💼"
      : "Switch to Service Provider 🛠️";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 w-11/12 items-center justify-between lg:w-10/12">

        {/* ── Logo ── */}
        <Link
          className="flex shrink-0 items-center"
          to="/"
          onClick={closeMenu}
          aria-label="Nirbhor — go to homepage"
        >
          <img
            alt="Nirbhor"
            className="h-10 w-auto object-contain sm:h-12"
            src={logo1}
          />
        </Link>

        {/* ── Desktop nav (hidden on mobile & tablet) ── */}
        <nav
          className="hidden items-center gap-5 lg:flex lg:gap-7"
          aria-label="Primary navigation"
        >
          {navigationLinks.map((link) => (
            <NavLink key={link.to} className={desktopLinkClass} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Desktop right actions (hidden on mobile & tablet) ── */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {isAuthenticated && (
            <>
              {/* Notifications Dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileOpen(false);
                  }}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#0066FF]/40 hover:text-[#0066FF]"
                  aria-label={unreadNotificationCount > 0 ? `${unreadNotificationCount} unread notifications` : "Notifications"}
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white shadow-sm">
                      {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                    </span>
                  )}
                </button>
                
                {notificationsOpen && (
                  <div className="absolute right-0 top-full z-[200] mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col max-h-[400px]">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 shrink-0">
                      <h3 className="font-bold text-slate-700">Notifications</h3>
                      {unreadNotificationCount > 0 && (
                        <button 
                          onClick={() => handleMarkAsRead('all')}
                          className="text-xs text-[#0066FF] font-semibold hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto p-2 flex flex-col gap-1">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-sm text-slate-500">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif._id}
                            className={`flex items-start gap-3 rounded-xl p-3 transition ${notif.read ? 'bg-white opacity-70' : 'bg-blue-50/50'}`}
                            onClick={() => {
                              if (!notif.read) handleMarkAsRead(notif._id);
                              if (notif.link) {
                                navigate(notif.link);
                                setNotificationsOpen(false);
                              }
                            }}
                          >
                            <div className="mt-0.5 shrink-0">
                              <Bell className={`h-4 w-4 ${notif.read ? 'text-slate-400' : 'text-[#0066FF]'}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm ${notif.read ? 'font-medium text-slate-700' : 'font-bold text-[#011F50]'}`}>{notif.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                              <p className="text-[10px] text-slate-400 mt-1 font-medium">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
                            </div>
                            {!notif.read && (
                              <div className="shrink-0 pt-1 flex items-center">
                                <div className="h-2 w-2 rounded-full bg-[#0066FF]"></div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/chat"
                id="header-messages-btn"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#0066FF]/40 hover:text-[#0066FF]"
                aria-label={unreadCount > 0 ? `${unreadCount} unread messages` : "Messages"}
              >
                <MessageSquare className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white shadow-sm">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}

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
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition hover:border-[#0066FF]/30"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <UserAvatar user={currentUser} size="sm" imgError={imgError} onError={() => setImgError(true)} />
                <span className="max-w-[90px] truncate pr-1 text-sm font-semibold text-slate-700">
                  {currentUser?.name?.split(" ")[0] || "Profile"}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-[200] mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  {/* Current mode */}
                  <div className="border-b border-slate-100 pb-2 mb-2">
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Active Mode
                    </div>
                    <div className="px-3 py-1.5 text-sm font-bold text-slate-700">{modeLabel}</div>
                    <button
                      type="button"
                      onClick={handleRoleSwitch}
                      disabled={switchingRole}
                      className="mt-1 w-full rounded-xl border border-[#0066FF]/20 bg-blue-50 px-3 py-2 text-xs font-bold text-[#0066FF] transition hover:bg-[#0066FF] hover:text-white disabled:opacity-50"
                    >
                      {switchingRole ? "Switching..." : switchLabel}
                    </button>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Edit Profile
                  </Link>
                  <Link
                    to="/chat"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Messages
                    {unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0066FF] px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/wallet"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Wallet
                  </Link>
                  {isHirer && (
                    <>
                      <Link
                        to="/hirer/jobs"
                        onClick={() => setProfileOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        My Posted Jobs
                      </Link>
                      <Link
                        to="/post-job"
                        onClick={() => setProfileOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        Post a Job
                      </Link>
                    </>
                  )}
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

        {/* ── Mobile right cluster (visible on mobile & tablet only) ── */}
        <div className="flex items-center gap-2 lg:hidden">
          {isAuthenticated && (
            <>
              {/* Notification icon on mobile */}
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#0066FF]/40 hover:text-[#0066FF]"
              >
                <Bell className="h-4 w-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white shadow-sm">
                    {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                  </span>
                )}
              </button>
              
              {/* Mobile Notifications Overlay (Simplified version for mobile) */}
              {notificationsOpen && (
                <div className="fixed inset-x-4 top-16 z-[200] max-h-[60vh] rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 shrink-0">
                    <h3 className="font-bold text-slate-700">Notifications</h3>
                    {unreadNotificationCount > 0 && (
                      <button 
                        onClick={() => handleMarkAsRead('all')}
                        className="text-xs text-[#0066FF] font-semibold hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto p-2 flex flex-col gap-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif._id}
                          className={`flex items-start gap-3 rounded-xl p-3 transition ${notif.read ? 'bg-white' : 'bg-blue-50/50'}`}
                          onClick={() => {
                            if (!notif.read) handleMarkAsRead(notif._id);
                            if (notif.link) {
                              navigate(notif.link);
                              setNotificationsOpen(false);
                            }
                          }}
                        >
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm ${notif.read ? 'font-medium text-slate-700' : 'font-bold text-[#011F50]'}`}>{notif.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
                          </div>
                          {!notif.read && (
                            <div className="shrink-0 pt-1 flex items-center">
                              <div className="h-2 w-2 rounded-full bg-[#0066FF]"></div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Chat icon with badge */}
              <Link
                to="/chat"
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#0066FF]/40 hover:text-[#0066FF]"
                aria-label={unreadCount > 0 ? `${unreadCount} unread messages` : "Messages"}
              >
                <MessageSquare className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white shadow-sm">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Profile avatar — tap opens mobile menu */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex items-center"
              aria-label="Open menu"
            >
              <UserAvatar user={currentUser} size="sm" imgError={imgError} onError={() => setImgError(true)} />
            </button>
          )}

          {/* Hamburger button */}
          <button
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-[#011F50] shadow-sm transition-colors hover:bg-slate-50"
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
      </div>

      {/* ── Mobile slide-in drawer ── */}
      <div
        className={`fixed inset-0 z-[100] h-dvh w-screen overflow-hidden bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-label="Mobile navigation overlay"
      >
        <aside
          id="mobile-menu"
          className={`absolute inset-y-0 right-0 z-[101] flex h-dvh w-[min(20rem,88vw)] flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
          aria-label="Mobile navigation"
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <Link to="/" onClick={closeMenu}>
              <img alt="Nirbhor" className="h-9 w-auto object-contain" src={logo1} />
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

          {/* User info strip (authenticated) */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <UserAvatar user={currentUser} size="lg" imgError={imgError} onError={() => setImgError(true)} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#011F50]">{currentUser?.name}</p>
                <p className="text-xs text-slate-500">{modeLabel}</p>
              </div>
            </div>
          )}

          {/* Navigation links */}
          <nav className="flex flex-col gap-1 px-4 py-4">
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

            {/* Messages link in drawer */}
            {isAuthenticated && (
              <Link
                to="/chat"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#011F50]"
              >
                <span>Messages</span>
                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0066FF] px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}
          </nav>

          {/* Bottom action buttons */}
          <div className="mt-auto border-t border-slate-100 px-4 pb-8 pt-4 space-y-2.5">
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
                {/* Role switch card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Active Mode</p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      (currentUser?.activeMode || currentUser?.role) === "SERVICE_PROVIDER"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {modeLabel}
                  </span>
                  <button
                    type="button"
                    onClick={handleRoleSwitch}
                    disabled={switchingRole}
                    className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#0066FF] shadow-sm transition hover:bg-blue-50 active:scale-[0.98] disabled:opacity-50"
                  >
                    {switchingRole ? "Switching..." : switchLabel}
                  </button>
                </div>

                <Link
                  className="block rounded-xl border border-slate-200 px-5 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  to="/profile"
                  onClick={closeMenu}
                >
                  Edit Profile
                </Link>

                <Link
                  className="block rounded-xl border border-slate-200 px-5 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  to="/wallet"
                  onClick={closeMenu}
                >
                  Wallet
                </Link>

                {isHirer && (
                  <>
                    <Link
                      className="block rounded-xl border border-slate-200 px-5 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      to="/hirer/jobs"
                      onClick={closeMenu}
                    >
                      My Posted Jobs
                    </Link>
                    <Link
                      className="block rounded-full bg-[#0066FF] px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#011F50]"
                      to="/post-job"
                      onClick={closeMenu}
                    >
                      Post a Job
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="block w-full rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-center text-sm font-semibold text-red-600 transition hover:bg-red-100"
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
