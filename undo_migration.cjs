const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/components/Header.jsx',
  'src/components/Footer.jsx',
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
  'src/pages/HomePage.jsx',
  'src/pages/ChatPage.jsx',
];

const replacements = [
  { regex: /bg-white\/\[0\.02\]/g, replace: 'bg-gray-50' },
  { regex: /bg-white\/\[0\.06\]/g, replace: 'bg-white' },
  { regex: /bg-\[\#0a1936\]\/80 backdrop-blur-2xl\/10/g, replace: 'bg-white/10' },
  { regex: /bg-\[\#0a1936\]\/80 backdrop-blur-2xl\/20/g, replace: 'bg-white/20' },
  { regex: /bg-\[\#0a1936\]\/80 backdrop-blur-2xl/g, replace: 'bg-white' },
  { regex: /bg-transparent\/50/g, replace: 'bg-slate-50/50' },
  { regex: /border-white\/10/g, replace: 'border-slate-200' },
  { regex: /border-white\/\[0\.09\]/g, replace: 'border-white/40' },
  { regex: /text-white\/90/g, replace: 'text-slate-800' },
  { regex: /text-white\/60/g, replace: 'text-slate-600' },
  { regex: /text-white\/40/g, replace: 'text-slate-500' },
  { regex: /text-white(?!(\/|space|s))/g, replace: 'text-slate-900' },
  { regex: /hover:bg-white\/10/g, replace: 'hover:bg-slate-50' },
  { regex: /hover:bg-transparent/g, replace: 'hover:bg-slate-50' },
  { regex: /hover:text-white/g, replace: 'hover:text-slate-900' },
  { regex: /bg-white\/\[0\.05\]/g, replace: 'bg-[#011F50]' },
];

filesToProcess.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    replacements.forEach(({ regex, replace }) => {
      content = content.replace(regex, replace);
    });
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Reverted: ' + filePath);
  }
});
console.log('Undo Migration complete.');
