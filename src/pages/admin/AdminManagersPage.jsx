/**
 * AdminManagersPage
 * 
 * Architectural Intent:
 * RBAC-protected administrative view for managing and overseeing platform managers.
 * Integrates directly with the `adminApi.js` service to perform privileged mutations (e.g., bans, approvals, deletions).
 * 
 * Security:
 * Strictly enclosed by the `<AdminRoute>` wrapper. Requires a valid Admin JWT and specific RBAC permissions matrix.
 */
import { useEffect, useState } from "react";
import {
  createAdminManager,
  getAdminManagers,
  revokeAdminManager,
  updateAdminPermissions,
} from "../../services/adminApi.js";
import {
  User,
  Shield,
  Key,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  Save,
} from "lucide-react";
import { useToast } from "../../contexts/ToastContext.jsx";
import { ConfirmModal } from "../../components/ui/ConfirmModal.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

const PERMISSION_FLAGS = [
  { key: "canManageUsers", label: "Manage Users" },
  { key: "canVerifyNID", label: "Verify NID" },
  { key: "canManageJobs", label: "Manage Jobs" },
  { key: "canHandleDisputes", label: "Manage Disputes" },
  { key: "canModerateContent", label: "Manage Categories" },
  { key: "canViewAuditLogs", label: "View Audit Logs" },
];

export function AdminManagersPage() {
  useDocumentTitle("Admin  Managers");
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
    permissions: {
      canManageUsers: true,
      canVerifyNID: true,
      canManageJobs: true,
      canHandleDisputes: true,
      canModerateContent: true,
      canViewAuditLogs: true,
    },
  });
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const [confirmModalState, setConfirmModalState] = useState({ isOpen: false, adminId: null });

  function loadManagers() {
    setLoading(true);
    getAdminManagers()
      .then((res) => {
        if (res?.data?.admins) setManagers(res.data.admins);
      })
      .catch((err) => showError(err.message || "Failed to load admin managers"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadManagers();
  }, []);

  async function handleTogglePermission(adminId, currentPerms, permKey) {
    const updatedPermissions = {
      ...currentPerms,
      [permKey]: !currentPerms?.[permKey],
    };
    try {
      await updateAdminPermissions(adminId, updatedPermissions);
      showSuccess("Admin permissions updated");
      loadManagers();
    } catch (err) {
      showError(err.message || "Failed to update permissions");
    }
  }

  async function handleDeleteAdmin(adminId) {
    setConfirmModalState({ isOpen: true, adminId });
  }

  async function executeDeleteAdmin(adminId) {
    try {
      await revokeAdminManager(adminId);
      showSuccess("Admin access revoked successfully");
      loadManagers();
      setConfirmModalState({ isOpen: false, adminId: null });
    } catch (err) {
      showError(err.message || "Failed to revoke admin");
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAdminManager(form.name, form.email, form.password, form.role, form.permissions);
      showSuccess("Admin account created successfully");
      setShowCreateModal(false);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "ADMIN",
        permissions: {
          canManageUsers: true,
          canVerifyNID: true,
          canManageJobs: true,
          canHandleDisputes: true,
          canModerateContent: true,
          canViewAuditLogs: true,
        },
      });
      loadManagers();
    } catch (err) {
      showError(err.message || "Failed to create admin manager");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Super Admin Manager Panel</h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Create administrative accounts and manage dynamic scoped permission flags per Admin
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-xl bg-[#0066FF] px-4 py-2 text-xs font-bold text-slate-900 dark:text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600"
        >
          + Add New Admin
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-[#0066FF]" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-100 dark:bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <tr>
                <th className="p-4">Admin</th>
                <th className="p-4">Role Tier</th>
                <th className="p-4">Assigned Permissions</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {managers.map((m) => (
                <tr key={m._id || m.id} className="group transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:shadow-[inset_2px_0_0_0_#0066FF]">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {m.name}
                      {m.suspended && (
                        <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-rose-400 border border-rose-500/30">
                          Suspended
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">{m.email}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        m.role === "SUPER_ADMIN"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {m.role === "SUPER_ADMIN" ? (
                      <span className="text-[11px] font-semibold text-purple-400">
                        Unrestricted Platform Access
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {PERMISSION_FLAGS.map((flag) => {
                          const active = Boolean(m.permissions?.[flag.key]);
                          return (
                            <button
                              key={flag.key}
                              onClick={() =>
                                handleTogglePermission(m._id || m.id, m.permissions, flag.key)
                              }
                              className={`rounded px-2 py-1 text-[10px] font-bold transition border ${
                                active
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {active ? "✓ " : "✗ "}
                              {flag.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {m.role !== "SUPER_ADMIN" && (
                      <button
                        onClick={() => handleDeleteAdmin(m._id || m.id)}
                        className={`rounded-lg border px-3 py-1 text-[11px] font-bold ${
                          m.suspended
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        }`}
                      >
                        {m.suspended ? "Unsuspend" : "Suspend"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-100 dark:bg-slate-950/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md space-y-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Add New Admin Account</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              >
                ✕
              </button>
            </div>

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 space-y-1">
              Full Name
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0066FF]"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 space-y-1">
              Email Address
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@nirbhor.com"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0066FF]"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 space-y-1">
              Password
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0066FF]"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 space-y-1">
              Role Tier
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0066FF]"
              >
                <option value="ADMIN">Admin (Scoped Permissions)</option>
                <option value="SUPER_ADMIN">Super Admin (Unrestricted)</option>
              </select>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#0066FF] px-4 py-2 text-xs font-bold text-slate-900 dark:text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </form>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState({ isOpen: false, adminId: null })}
        onConfirm={() => executeDeleteAdmin(confirmModalState.adminId)}
        title="Revoke Admin Access"
        message="Are you sure you want to revoke this admin account? They will instantly lose access to the admin dashboard."
        confirmText="Revoke Access"
        isDestructive={true}
      />
    </div>
  );
}
