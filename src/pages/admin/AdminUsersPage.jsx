import { useEffect, useState } from "react";
import { getAdminUsers, suspendUser } from "../../services/adminApi.js";
import { useToast } from "../../contexts/ToastContext.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

export function AdminUsersPage() {
  useDocumentTitle("Admin  Users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showSuccess, showError } = useToast();

  function loadUsers() {
    setLoading(true);
    getAdminUsers()
      .then((res) => {
        if (res?.data?.users) setUsers(res.data.users);
      })
      .catch((err) => showError(err.message || "Failed to load users"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleToggleSuspend(userId, currentSuspended) {
    try {
      await suspendUser(userId);
      showSuccess(currentSuspended ? "User unsuspended" : "User suspended successfully");
      loadUsers();
    } catch (err) {
      showError(err.message || "Failed to update user status");
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search),
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">User Management</h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            View registered Hirers and Service Providers, inspect ratings, and manage account suspensions
          </p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#0066FF]"
        />
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
                <th className="p-4">User</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Active Mode</th>
                <th className="p-4">Ratings</th>
                <th className="p-4">NID Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u._id || u.id} className="group transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:shadow-[inset_2px_0_0_0_#0066FF]">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">{u.email}</div>
                    {u.dateOfBirth && (
                      <div className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">
                        DoB: {new Date(u.dateOfBirth).toLocaleDateString()}
                      </div>
                    )}
                    {u.nidVerified && u.nidNumber && (
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-500">
                        NID: {u.nidNumber}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">{u.phone || "N/A"}</td>
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                    {u.activeMode || u.role}
                  </td>
                  <td className="p-4">
                    <div className="text-[11px]">
                      <span className="text-amber-400">★ {u.profile?.providerRating || u.profile?.rating || 0}</span>{" "}
                      <span className="text-slate-500 dark:text-slate-400">Provider</span>
                    </div>
                    <div className="text-[11px]">
                      <span className="text-amber-400">★ {u.profile?.hirerRating || 0}</span>{" "}
                      <span className="text-slate-500 dark:text-slate-400">Hirer</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        u.nidVerified
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {u.nidVerified ? "VERIFIED" : "UNVERIFIED"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleSuspend(u._id || u.id, u.suspended)}
                      className={`rounded-lg border px-3 py-1 text-[11px] font-bold ${
                        u.suspended
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      }`}
                    >
                      {u.suspended ? "Unsuspend" : "Suspend Account"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
