import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "../contexts/useAdmin.js";
import { getAdminMetrics, getMessageReports } from "../services/adminApi.js";
import logo2 from "../assets/logo2.png";

export function AdminLayout() {
  const { currentAdmin, isSuperAdmin, hasPermission, signOut } = useAdmin();
  const [pendingNidCount, setPendingNidCount] = useState(0);
  const [openDisputesCount, setOpenDisputesCount] = useState(0);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("adminTheme", "dark");
  }, []);

  useEffect(() => {
    getAdminMetrics()
      .then((res) => {
        if (res?.data?.stats) {
          setPendingNidCount(res.data.stats.pendingNidCount || 0);
          setOpenDisputesCount(res.data.stats.openDisputes || 0);
        }
      })
      .catch(() => {});
    // Fetch pending message report count separately
    getMessageReports({ status: "pending" })
      .then((res) => {
        setPendingReportsCount(res?.data?.pagination?.total || 0);
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await signOut();
    navigate("/admin/login");
  }

  const menuItems = [
    { label: "Overview", to: "/admin/dashboard", icon: "📊", show: true },
    { label: "Users", to: "/admin/users", icon: "👥", show: hasPermission("canManageUsers") },
    { label: "Job Moderation", to: "/admin/jobs", icon: "💼", show: hasPermission("canManageJobs") },
    {
      label: "Categories",
      to: "/admin/categories",
      icon: "🏷️",
      show: hasPermission("canModerateContent") || isSuperAdmin,
    },
    {
      label: "Message Reports",
      to: "/admin/message-reports",
      icon: "🚨",
      badge: pendingReportsCount > 0 ? pendingReportsCount : null,
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      show: hasPermission("canModerateContent") || isSuperAdmin,
    },
    {
      label: "Dispute Center",
      to: "/admin/disputes",
      icon: "⚖️",
      badge: openDisputesCount > 0 ? openDisputesCount : null,
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      show: hasPermission("canHandleDisputes"),
    },
    { label: "Financial Reports", to: "/admin/reports", icon: "📈", show: isSuperAdmin },
    {
      label: "Admin Managers",
      to: "/admin/managers",
      icon: "🛡️",
      show: isSuperAdmin || hasPermission("canPromoteAdmins"),
    },
    {
      label: "Audit Logs",
      to: "/admin/audit-logs",
      icon: "📜",
      show: isSuperAdmin || hasPermission("canViewAuditLogs"),
    },
  ];

  const visibleItems = menuItems.filter((item) => item.show);

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-slate-900/95 backdrop-blur-md transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <img src={logo2} alt="Nirbhor" className="h-7 w-auto object-contain" />
            <span className="ml-1 rounded-md bg-[#0066FF]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0066FF]">
              Admin
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#0066FF] text-white shadow-md shadow-blue-600/25"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Admin card */}
        <div className="shrink-0 border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white ring-1 ring-slate-700">
              {currentAdmin?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{currentAdmin?.name || "Admin"}</p>
              <span
                className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  isSuperAdmin
                    ? "border border-purple-500/30 bg-purple-500/20 text-purple-300"
                    : "border border-blue-500/30 bg-blue-500/20 text-blue-300"
                }`}
              >
                {isSuperAdmin ? "Super Admin" : "Admin"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
              title="Logout"
            >
              Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white lg:hidden"
              aria-label="Open navigation menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 sm:flex">
              <span>Management Console</span>
              <span>/</span>
              <span className="font-semibold text-white">
                {isSuperAdmin ? "Super Admin Mode" : "Operational Admin Mode"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="hidden rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-500 hover:text-white sm:inline-block transition"
            >
              ← Marketplace
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
