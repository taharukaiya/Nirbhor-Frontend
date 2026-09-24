import { useEffect, useState } from "react";
import { getAuditLogs } from "../../services/adminApi.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

export function AdminAuditLogsPage() {
  useDocumentTitle("Admin  Audit Logs");
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then((res) => {
        if (res?.data?.auditLogs) setAuditLogs(res.data.auditLogs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">System Audit Logs</h1>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Immutable audit record of all privileged administrative actions across the platform
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-[#0066FF]" />
        </div>
      ) : auditLogs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-12 text-center text-xs text-slate-600 dark:text-slate-400">
          No audit log entries recorded yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-100 dark:bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Details</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {auditLogs.map((log) => (
                <tr key={log._id || log.id} className="group transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:shadow-[inset_2px_0_0_0_#0066FF]">
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {log.admin?.name || "Admin"} ({log.admin?.role || "ADMIN"})
                  </td>
                  <td className="p-4">
                    <span className="rounded bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-700 dark:text-slate-300">
                    {log.targetType} ({String(log.targetId).slice(-6)})
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {JSON.stringify(log.details || {})}
                  </td>
                  <td className="p-4 font-mono text-slate-500 dark:text-slate-400">{log.ipAddress || "127.0.0.1"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
