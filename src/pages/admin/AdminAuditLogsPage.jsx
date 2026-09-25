/**
 * AdminAuditLogsPage
 * 
 * Architectural Intent:
 * RBAC-protected administrative view for managing and overseeing platform auditlogs.
 * Integrates directly with the `adminApi.js` service to perform privileged mutations (e.g., bans, approvals, deletions).
 * 
 * Security:
 * Strictly enclosed by the `<AdminRoute>` wrapper. Requires a valid Admin JWT and specific RBAC permissions matrix.
 */
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

  const formatActionString = (actionStr) => {
    if (!actionStr) return "";
    return actionStr
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatTargetEntity = (type, id) => {
    if (!type) return "System";
    const readableType = type.replace(/([a-z])([A-Z])/g, "$1 $2");
    const capitalized = readableType.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-800 dark:text-slate-200">{capitalized}</span>
        {id && <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 break-all">ID: {String(id)}</span>}
      </div>
    );
  };

  const formatDetails = (details) => {
    if (!details || Object.keys(details).length === 0) return <span className="text-slate-400">-</span>;
    return (
      <div className="flex flex-col gap-1.5 text-xs">
        {Object.entries(details).map(([key, value]) => {
          let displayKey = key;
          let displayValue = String(value);

          // Handle specific well-known details
          if (key === "reason") {
            displayKey = "Reason";
          } else if (key === "disputeId") {
            displayKey = "Dispute ID";
          } else if (key === "jobId") {
            displayKey = "Job ID";
          } else if (key === "status") {
            displayKey = "Status";
          } else if (key === "amount") {
            displayKey = "Amount";
            displayValue = `৳${value}`;
          } else {
            // General fallback format
            displayKey = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ");
            displayKey = displayKey.charAt(0).toUpperCase() + displayKey.slice(1).toLowerCase();
            if (typeof value === 'object') {
               displayValue = JSON.stringify(value).replace(/["{}]/g, '').replace(/:/g, ': ').replace(/,/g, ', ');
            }
          }

          return (
            <div key={key} className="flex flex-col">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{displayKey}:</span>
              <span className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded" title={typeof value === 'object' ? JSON.stringify(value) : String(value)}>{displayValue || "None"}</span>
            </div>
          );
        })}
      </div>
    );
  };

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
                    {log.admin?.name || "Admin"} <span className="block font-normal text-[10px] text-slate-500">({log.admin?.role || "ADMIN"})</span>
                  </td>
                  <td className="p-4">
                    <span className="rounded bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                      {formatActionString(log.action)}
                    </span>
                  </td>
                  <td className="p-4">
                    {formatTargetEntity(log.targetType, log.targetId)}
                  </td>
                  <td className="p-4">
                    {formatDetails(log.details)}
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
