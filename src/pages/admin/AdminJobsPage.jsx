import { useEffect, useState } from "react";
import { getJobs } from "../../services/api.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

export function AdminJobsPage() {
  useDocumentTitle("Admin  Jobs");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then((res) => {
        if (res?.jobs) setJobs(res.jobs);
        else if (Array.isArray(res)) setJobs(res);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Job Request Moderation</h1>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Audit posted service jobs, budgets, and status lifecycles across the platform
        </p>
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
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Budget Range</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {jobs.map((job) => (
                <tr key={job.id || job._id} className="hover:bg-slate-50 dark:bg-slate-800/40">
                  <td className="p-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                    {job.title}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{job.category || job.serviceType}</td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    {job.location?.district || job.location || "Bangladesh"}
                  </td>
                  <td className="p-4 font-mono font-semibold text-emerald-400">
                    ৳{job.budget?.min || 0} - ৳{job.budget?.max || 0}
                  </td>
                  <td className="p-4">
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                      {job.status}
                    </span>
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
