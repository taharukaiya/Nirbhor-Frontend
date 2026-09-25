const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/AdminAuditLogsPage.jsx', 'utf8');

c = c.replace(/<td className="p-4 font-bold text-slate-900 dark:text-white">\s*\{log\.admin\?\.name \|\| "Admin"\}\s*\(\{log\.admin\?\.role \|\| "ADMIN"\}\)\s*<\/td>/g, 
  `<td className="p-4 font-bold text-slate-900 dark:text-white">\n                    {log.admin?.name || "Admin"} <span className="block font-normal text-[10px] text-slate-500">({log.admin?.role || "ADMIN"})</span>\n                  </td>`);

c = c.replace(/<td className="p-4">\s*<span className="rounded bg-purple-500\/20 border border-purple-500\/30 px-2 py-0\.5 text-\[10px\] font-bold text-purple-300">\s*\{log\.action\}\s*<\/span>\s*<\/td>/g, 
  `<td className="p-4">\n                    <span className="rounded bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">\n                      {formatActionString(log.action)}\n                    </span>\n                  </td>`);

c = c.replace(/<td className="p-4 font-mono text-slate-700 dark:text-slate-300">\s*\{log\.targetType\}\s*\(\{String\(log\.targetId\)\.slice\(-6\)\}\)\s*<\/td>/g, 
  `<td className="p-4">\n                    {formatTargetEntity(log.targetType, log.targetId)}\n                  </td>`);

c = c.replace(/<td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">\s*\{JSON\.stringify\(log\.details \|\| \{\}\)\}\s*<\/td>/g, 
  `<td className="p-4">\n                    {formatDetails(log.details)}\n                  </td>`);

fs.writeFileSync('src/pages/admin/AdminAuditLogsPage.jsx', c);
console.log("Done");
