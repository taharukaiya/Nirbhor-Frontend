const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/pages/PublicProfilePage.jsx',
  'src/pages/SectionPage.jsx',
  'src/pages/ProfilePage.jsx',
  'src/pages/WalletPage.jsx',
  'src/pages/TransactionDashboardPage.jsx',
  'src/pages/PostJobPage.jsx',
  'src/pages/HirerDashboardPage.jsx',
  'src/pages/ProviderDashboardPage.jsx',
  'src/pages/FindServicePage.jsx',
  'src/pages/FindJobsPage.jsx',
  'src/pages/ChatPage.jsx',
];

const replacements = [
  // 1. Remove light backgrounds from main wrappers
  { regex: /bg-gradient-to-br from-slate-50 via-white to-blue-50\/30/g, replace: 'bg-transparent' },
  { regex: /bg-slate-50/g, replace: 'bg-transparent' },
  { regex: /bg-slate-50\/50/g, replace: 'bg-white/[0.02]' },
  
  // 2. Card Backgrounds
  { regex: /bg-white(?!\/)/g, replace: 'bg-white/[0.06] backdrop-blur-2xl' },
  { regex: /glass-panel/g, replace: 'bg-white/[0.06] border border-white/10 backdrop-blur-2xl' },
  
  // 3. Borders
  { regex: /border-slate-100/g, replace: 'border-white/10' },
  { regex: /border-slate-200/g, replace: 'border-white/10' },
  { regex: /border-slate-300/g, replace: 'border-white/20' },
  
  // 4. Texts
  { regex: /text-slate-900/g, replace: 'text-white' },
  { regex: /text-slate-800/g, replace: 'text-white/90' },
  { regex: /text-slate-700/g, replace: 'text-white/80' },
  { regex: /text-slate-600/g, replace: 'text-white/60' },
  { regex: /text-slate-500/g, replace: 'text-white/60' },
  { regex: /text-slate-400/g, replace: 'text-white/40' },
  { regex: /text-\[\#011F50\]/g, replace: 'text-white' },
  { regex: /text-\[\#0a1936\]/g, replace: 'text-white' },

  // 5. Hovers
  { regex: /hover:bg-slate-50/g, replace: 'hover:bg-white/10' },
  { regex: /hover:bg-slate-100/g, replace: 'hover:bg-white/10' },
  { regex: /hover:bg-slate-200/g, replace: 'hover:bg-white/20' },
  { regex: /hover:text-slate-900/g, replace: 'hover:text-white' },
  { regex: /hover:text-\[\#011F50\]/g, replace: 'hover:text-white' },
  
  // 6. Accent Colors & Badges
  { regex: /bg-blue-50(?!(\/))/g, replace: 'bg-[#0066FF]/10' },
  { regex: /bg-amber-50/g, replace: 'bg-amber-500/10' },
  { regex: /bg-emerald-50/g, replace: 'bg-emerald-500/10' },
  { regex: /bg-rose-50/g, replace: 'bg-rose-500/10' },
  
  // 7. Inputs
  { regex: /bg-white\/\[0\.06\] backdrop-blur-2xl/g, replace: 'bg-white/[0.06] backdrop-blur-2xl' }, // Prevent double replace
];

filesToProcess.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    replacements.forEach(({ regex, replace }) => {
      content = content.replace(regex, replace);
    });

    // Special fix: button text colors
    content = content.replace(/text-white\/90 shadow-lg/g, 'text-white shadow-lg');
    content = content.replace(/text-white\/60 shadow-lg/g, 'text-white shadow-lg');
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Processed: ${filePath}`);
  }
});
console.log('Redesign complete.');
