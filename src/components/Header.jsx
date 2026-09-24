import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo2 from "../assets/logo2.png";
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
      ? "text-primary after:w-full after:bg-primary"
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
  const { t, i18n } = useTranslation();
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
  const isHome = location.pathname === "/";

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
      .catch(() => { });

    getNotifications()
      .then((res) => {
        if (res?.success) {
          setNotifications(res.notifications);
          setUnreadNotificationCount(res.unreadCount);
        }
      })
      .catch(() => { });
  }, [isAuthenticated]);

  // Increment badge on new messages and notifications
  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubMsg = onNewMessage(() => {
      if (!isChatPage) setUnreadCount((prev) => prev + 1);
    });
    const unsubNotif = onNewNotification((notif) => {
      if (notif.action === "FORCE_LOGOUT") {
        showError(notif.message || "Your account has been suspended.");
        signOut().then(() => {
          navigate("/login");
        });
        return;
      }
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
    const homeLink = { label: t("nav.home", "Home"), to: "/" };
    const staticLinks = [
      { label: t("nav.howItWorks", "How It Works"), to: "/how-it-works" },
      { label: t("nav.about", "About"), to: "/about" },
    ];

    if (!isAuthenticated) return [homeLink, ...staticLinks];

    const authLinks = [];
    const isServiceMode =
      (currentUser?.activeMode || currentUser?.role) === "SERVICE_PROVIDER";
    if (isServiceMode) {
      authLinks.push({ label: t("nav.findJobs", "Find Jobs"), to: "/jobs" });
      authLinks.push({ label: t("nav.myApplications", "My Applications"), to: "/provider/jobs" });
    } else {
      authLinks.push({ label: t("nav.findServices", "Find Services"), to: "/services" });
      authLinks.push({ label: t("nav.myJobs", "My Jobs"), to: "/hirer/jobs" });
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
      ? t("dashboard.providerMode")
      : t("dashboard.hirerMode");
  const switchLabel =
    (currentUser?.activeMode || currentUser?.role) === "SERVICE_PROVIDER"
      ? t("dashboard.switchToHirer")
      : t("dashboard.switchToProvider");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || !isHome
        ? "bg-white/90 shadow-sm backdrop-blur-xl border-b border-slate-200"
        : "bg-transparent py-2"
        }`}
    >
      <div className="mx-auto flex h-16 w-[95%] max-w-7xl items-center justify-between rounded-2xl transition-all duration-300">

        {/* ── Logo ── */}
        <Link
          className="group flex shrink-0 items-center gap-2"
          to="/"
          onClick={closeMenu}
          aria-label="Nirbhor — go to homepage"
        >
          <img src={logo2} alt="Nirbhor Logo" className="h-10 w-auto drop-shadow-lg transition-transform duration-300 group-hover:scale-105" />
          <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${scrolled || !isHome ? "text-slate-800" : "text-white drop-shadow-md"}`}>
            Nirbhor
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          className={`hidden items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md shadow-sm lg:flex transition-all duration-300 ${scrolled || !isHome ? "border-slate-200 bg-white/50 hover:bg-slate-50" : "border-white/20 bg-white/10 hover:bg-white/20"}`}
          aria-label="Primary navigation"
        >
          {navigationLinks.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) => [
                "relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 overflow-hidden group",
                isActive
                  ? (scrolled || !isHome ? "text-white bg-primary shadow-md shadow-primary/20" : "text-primary bg-white shadow-lg")
                  : (scrolled || !isHome ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80" : "text-white/90 hover:text-white hover:bg-white/20")
              ].join(" ")}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Desktop right actions ── */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* <button
            type="button"
            onClick={() => {
              const newLng = i18n.language === 'en' ? 'bn' : 'en';
              i18n.changeLanguage(newLng);
              localStorage.setItem('appLanguage', newLng);
            }}
            title={i18n.language === 'en' ? 'Switch to Bangla' : 'Switch to English'}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all duration-300 ${
              scrolled || !isHome
                ? "border-slate-200 bg-white text-slate-700 hover:border-[#0066FF] hover:text-[#0066FF] shadow-sm"
                : "border-white/30 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <span className="text-sm">{i18n.language === 'en' ? '🇧🇩' : '🇬🇧'}</span>
            <span>{i18n.language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button> */}

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
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${scrolled || !isHome
                    ? "bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-primary"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    }`}
                  aria-label={unreadNotificationCount > 0 ? `${unreadNotificationCount} unread notifications` : "Notifications"}
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm animate-pulse">
                      {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-full z-[200] mt-4 w-80 rounded-2xl border border-white/20 bg-white/90 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col max-h-[400px] overflow-hidden transform origin-top-right transition-all duration-300">
                    <div className="flex items-center justify-between border-b border-slate-200/50 px-5 py-4 bg-white/50">
                      <h3 className="font-bold text-slate-800">Notifications</h3>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={() => handleMarkAsRead('all')}
                          className="text-xs text-primary font-semibold hover:text-[#0047b3] transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto p-2 flex flex-col gap-1">
                      {notifications.length === 0 ? (
                        <div className="py-10 flex flex-col items-center justify-center text-slate-400">
                          <Bell className="h-8 w-8 mb-2 opacity-20" />
                          <span className="text-sm font-medium">No notifications yet</span>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`flex items-start gap-3 rounded-xl p-3 cursor-pointer transition-all duration-200 ${notif.read ? 'bg-transparent hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
                              }`}
                            onClick={() => {
                              if (!notif.read) handleMarkAsRead(notif._id);
                              if (notif.link) {
                                navigate(notif.link);
                                setNotificationsOpen(false);
                              }
                            }}
                          >
                            <div className="mt-0.5 shrink-0">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${notif.read ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                                <Bell className="h-3.5 w-3.5" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm leading-tight ${notif.read ? 'font-medium text-slate-600' : 'font-bold text-slate-800'}`}>{notif.title}</p>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                              <p className="text-[10px] text-slate-400 mt-1.5 font-medium flex items-center gap-1">
                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="shrink-0 pt-1 flex items-center">
                                <div className="h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary/40"></div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat icon with badge */}
              <Link
                to="/chat"
                className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${scrolled || !isHome
                  ? "bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-primary"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                aria-label={unreadCount > 0 ? `${unreadCount} unread messages` : "Messages"}
              >
                <MessageSquare className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm animate-pulse">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {!isAuthenticated ? (
            <div className="flex items-center gap-3 ml-2">
              <Link
                className={`text-sm font-semibold transition-colors duration-200 ${scrolled || !isHome ? "text-slate-600 hover:text-slate-900" : "text-white/90 hover:text-white"}`}
                to="/login"
              >
                {t('nav.signIn')}
              </Link>
              <Link
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                to="/register"
              >
                <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <span className="relative">{t('nav.signUp')}</span>
              </Link>
            </div>
          ) : (
            <div className="relative ml-2" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className={`flex items-center gap-2.5 rounded-full p-1.5 pr-4 transition-all duration-300 ${scrolled || !isHome
                  ? "bg-white shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300"
                  : "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
                  }`}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <UserAvatar user={currentUser} size="sm" imgError={imgError} onError={() => setImgError(true)} />
                <span className={`max-w-[100px] truncate text-sm font-bold ${scrolled || !isHome ? "text-slate-700" : "text-white"}`}>
                  {currentUser?.name?.split(" ")[0] || "Profile"}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-[200] mt-4 w-64 rounded-2xl border border-white/20 bg-white/95 backdrop-blur-2xl p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] origin-top-right transition-all duration-300">
                  {/* Current mode */}
                  <div className="mb-3 rounded-xl bg-slate-50/80 p-4 border border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {t('dashboard.currentMode')}
                    </div>
                    <div className="text-sm font-extrabold text-slate-800">{modeLabel}</div>
                    <button
                      type="button"
                      onClick={handleRoleSwitch}
                      disabled={switchingRole}
                      className="mt-3 w-full rounded-lg bg-white border border-primary/20 px-3 py-2 text-xs font-bold text-primary shadow-sm transition hover:bg-primary hover:text-white disabled:opacity-50"
                    >
                      {switchingRole ? t('common.loading') : switchLabel}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                      {t('nav.profile')}
                    </Link>
                    <Link to="/chat" onClick={() => setProfileOpen(false)} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                      {t('nav.messages')}
                      {unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/wallet" onClick={() => setProfileOpen(false)} className="flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                      {t('nav.wallet')}
                    </Link>
                    <Link to="/transactions" onClick={() => setProfileOpen(false)} className="flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                      {t('wallet.transactions')}
                    </Link>
                    {isHirer && (
                      <>
                        <Link to="/hirer/jobs" onClick={() => setProfileOpen(false)} className="flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                          {t('dashboard.myJobs')}
                        </Link>
                        <Link to="/post-job" onClick={() => setProfileOpen(false)} className="flex items-center rounded-xl px-3 py-2 text-sm font-semibold text-primary transition hover:bg-blue-50">
                          {t('nav.postJob')}
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="mt-2 border-t border-slate-100 pt-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      {t('nav.signOut')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Mobile right cluster ── */}
        <div className="flex items-center gap-3 lg:hidden">
          {isAuthenticated && (
            <>
              {/* Notification icon on mobile */}
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${scrolled || !isHome
                  ? "bg-slate-100/80 text-slate-600"
                  : "bg-white/10 text-white border border-white/20"
                  }`}
              >
                <Bell className="h-4 w-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm animate-pulse">
                    {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Mobile Notifications Overlay */}
              {notificationsOpen && (
                <div className="fixed inset-x-4 top-20 z-[200] max-h-[60vh] rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/80 shrink-0">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={() => handleMarkAsRead('all')}
                        className="text-xs text-primary font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto p-2 flex flex-col gap-1">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center text-sm font-medium text-slate-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`flex items-start gap-3 rounded-xl p-3 transition ${notif.read ? 'bg-transparent' : 'bg-blue-50/50'}`}
                          onClick={() => {
                            if (!notif.read) handleMarkAsRead(notif._id);
                            if (notif.link) {
                              navigate(notif.link);
                              setNotificationsOpen(false);
                            }
                          }}
                        >
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm ${notif.read ? 'font-medium text-slate-600' : 'font-bold text-slate-800'}`}>{notif.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
                          </div>
                          {!notif.read && (
                            <div className="shrink-0 pt-1 flex items-center">
                              <div className="h-2 w-2 rounded-full bg-primary shadow-sm"></div>
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
                className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${scrolled
                  ? "bg-slate-100/80 text-slate-600"
                  : "bg-white/10 text-white border border-white/20"
                  }`}
                aria-label={unreadCount > 0 ? `${unreadCount} unread messages` : "Messages"}
              >
                <MessageSquare className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm animate-pulse">
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
            className={`inline-flex items-center justify-center rounded-full p-2 transition-colors ${scrolled ? "bg-slate-100 text-slate-700" : "bg-white/10 text-white border border-white/20"
              }`}
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
        className={`fixed inset-0 z-[100] h-dvh w-screen overflow-hidden bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={closeMenu}
        aria-label="Mobile navigation overlay"
      >
        <aside
          id="mobile-menu"
          className={`absolute inset-y-0 right-0 z-[101] flex h-dvh w-[min(22rem,90vw)] flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          onClick={(e) => e.stopPropagation()}
          aria-label="Mobile navigation"
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0066FF] to-[#0047b3] shadow-md">
                <span className="font-bold text-white tracking-tight">N</span>
              </div>
              <span className="font-extrabold text-slate-800 text-lg">Nirbhor</span>
            </Link>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* User info strip (authenticated) */}
          {isAuthenticated && (
            <div className="flex items-center gap-4 px-6 py-5 bg-slate-50/50">
              <UserAvatar user={currentUser} size="lg" imgError={imgError} onError={() => setImgError(true)} />
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-slate-800">{currentUser?.name}</p>
                <p className="text-xs font-semibold text-primary mt-0.5">{modeLabel}</p>
              </div>
            </div>
          )}

          {/* Navigation links */}
          <nav className="flex flex-col gap-1 px-4 py-6">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  [
                    "rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
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
                className="flex items-center justify-between rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <span>{t('nav.messages')}</span>
                {unreadCount > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-[11px] font-bold text-white shadow-sm">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}
          </nav>

          {/* Bottom action buttons */}
          <div className="mt-auto border-t border-slate-100 px-6 pb-10 pt-6 space-y-3">
            {!isAuthenticated ? (
              <>
                <Link
                  className="block rounded-xl border-2 border-slate-200 px-6 py-3.5 text-center text-sm font-bold text-slate-700 transition-colors hover:border-primary hover:text-primary"
                  to="/login"
                  onClick={closeMenu}
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  className="block rounded-xl bg-primary px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] hover:bg-[#0052cc]"
                  to="/register"
                  onClick={closeMenu}
                >
                  {t('nav.signUp')}
                </Link>
              </>
            ) : (
              <>
                {/* Role switch card */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 mb-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('dashboard.currentMode')}</p>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${(currentUser?.activeMode || currentUser?.role) === "SERVICE_PROVIDER"
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
                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-5 py-3 text-sm font-bold text-primary shadow-sm transition hover:bg-blue-50 hover:border-blue-200 active:scale-[0.98] disabled:opacity-50"
                  >
                    {switchingRole ? t('common.loading') : switchLabel}
                  </button>
                </div>

                <Link
                  className="block rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  to="/profile"
                  onClick={closeMenu}
                >
                  {t('nav.profile')}
                </Link>

                <Link
                  className="block rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  to="/wallet"
                  onClick={closeMenu}
                >
                  {t('nav.wallet')}
                </Link>

                <Link
                  className="block rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  to="/transactions"
                  onClick={closeMenu}
                >
                  {t('wallet.transactions')}
                </Link>

                {isHirer && (
                  <>
                    <Link
                      className="block rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      to="/hirer/jobs"
                      onClick={closeMenu}
                    >
                      {t('dashboard.myJobs')}
                    </Link>
                    <Link
                      className="block rounded-xl bg-blue-50 px-5 py-3 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                      to="/post-job"
                      onClick={closeMenu}
                    >
                      {t('nav.postJob')}
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="block w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-center text-sm font-bold text-red-600 transition hover:bg-red-100 hover:border-red-300"
                >
                  {t('nav.signOut')}
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
