import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/useAdmin.js";
import { getAdminMetrics } from "../../services/adminApi.js";
import logo2 from "../../assets/logo2.png";


export function AdminLayout() {
  const { currentAdmin, isSuperAdmin, hasPermission, signOut } = useAdmin();
  const [pendingNidCount, setPendingNidCount] = useState(0);
  const [openDisputesCount, setOpenDisputesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getAdminMetrics()
      .then((res) => {
        if (res?.data?.stats) {
          setPendingNidCount(res.data.stats.pendingNidCount || 0);
          setOpenDisputesCount(res.data.stats.openDisputes || 0);
        }
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await signOut();
    navigate("/admin/login");
  }

  const menuItems = [
    {
      label: "Overview",
      to: "/admin/dashboard",
      icon: "📊",
      show: true,
    },
    {
      label: "NID Queue",
      to: "/admin/verifications",
      icon: "🪪",
      badge: pendingNidCount > 0 ? pendingNidCount : null,
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      show: hasPermission("canVerifyNID"),
    },
    {
      label: "Users",
      to: "/admin/users",
      icon: "👥",
      show: hasPermission("canManageUsers"),
    },
    {
      label: "Job Moderation",
      to: "/admin/jobs",
      icon: "💼",
      show: hasPermission("canManageJobs"),
    },
    {
      label: "Categories",
      to: "/admin/categories",
      icon: "🏷️",
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

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-slate-900/95 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <img src={logo2} alt="Nirbhor" className="h-7 w-auto object-contain" />
            <span className="ml-1 rounded-md bg-[#0066FF]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0066FF]">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          {menuItems
            .filter((item) => item.show)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
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
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
        </nav>

        {/* User Card in Sidebar Bottom */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white ring-1 ring-slate-700">
              {currentAdmin?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{currentAdmin?.name || "Admin"}</p>
              <span
                className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  isSuperAdmin
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {isSuperAdmin ? "Super Admin" : "Admin"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Management Console</span>
            <span>/</span>
            <span className="font-semibold text-white">
              {isSuperAdmin ? "Super Admin Mode" : "Operational Admin Mode"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-600 hover:text-white"
            >
              ← Back to Marketplace
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page View */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
