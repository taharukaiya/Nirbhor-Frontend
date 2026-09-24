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
  // Backgrounds
  { regex: /\bbg-slate-50\b/g, replace: 'bg-transparent' },
  { regex: /\bbg-gray-50\b/g, replace: 'bg-white/[0.02]' },
  { regex: /\bbg-white\/60\b/g, replace: 'bg-white/[0.06]' },
  { regex: /\bbg-white\/70\b/g, replace: 'bg-white/[0.06]' },
  { regex: /\bbg-white\/80\b/g, replace: 'bg-white/[0.06]' },
  { regex: /\bbg-white\/90\b/g, replace: 'bg-white/[0.06]' },
  { regex: /\bbg-white\b/g, replace: 'bg-[#0a1936]/80 backdrop-blur-2xl' },
  
  // Borders
  { regex: /\bborder-slate-100\b/g, replace: 'border-white/10' },
  { regex: /\bborder-slate-200\b/g, replace: 'border-white/10' },
  { regex: /\bborder-gray-100\b/g, replace: 'border-white/10' },
  { regex: /\bborder-gray-200\b/g, replace: 'border-white/10' },
  { regex: /\bborder-white\/40\b/g, replace: 'border-white/[0.09]' },
  { regex: /\bborder-white\/50\b/g, replace: 'border-white/[0.09]' },
  
  // Texts
  { regex: /\btext-slate-900\b/g, replace: 'text-white' },
  { regex: /\btext-gray-900\b/g, replace: 'text-white' },
  { regex: /\btext-\[\#011F50\]\b/g, replace: 'text-white' },
  { regex: /\btext-\[\#071f49\]\b/g, replace: 'text-white' },
  { regex: /\btext-\[\#10213f\]\b/g, replace: 'text-white' },
  { regex: /\btext-slate-800\b/g, replace: 'text-white/90' },
  { regex: /\btext-gray-800\b/g, replace: 'text-white/90' },
  { regex: /\btext-slate-700\b/g, replace: 'text-white/90' },
  { regex: /\btext-gray-700\b/g, replace: 'text-white/90' },
  { regex: /\btext-slate-600\b/g, replace: 'text-white/60' },
  { regex: /\btext-gray-600\b/g, replace: 'text-white/60' },
  { regex: /\btext-slate-500\b/g, replace: 'text-white/60' },
  { regex: /\btext-gray-500\b/g, replace: 'text-white/60' },
  { regex: /\btext-slate-400\b/g, replace: 'text-white/40' },
  { regex: /\btext-gray-400\b/g, replace: 'text-white/40' },
  
  // Hovers
  { regex: /\bhover:bg-slate-50\b/g, replace: 'hover:bg-white/10' },
  { regex: /\bhover:bg-gray-50\b/g, replace: 'hover:bg-white/10' },
  
  // Special backgrounds
  { regex: /\bbg-\[\#011F50\]\b/g, replace: 'bg-white/[0.05]' },
  
  // Remove dark: classes since everything is dark now
  { regex: /\bdark:bg-gray-[0-9]{3}(\/[0-9]+)?\b/g, replace: '' },
  { regex: /\bdark:text-gray-[0-9]{3}\b/g, replace: '' },
  { regex: /\bdark:border-gray-[0-9]{3}\b/g, replace: '' }
];

filesToProcess.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace logic
    replacements.forEach(({ regex, replace }) => {
      content = content.replace(regex, replace);
    });
    
    // Fix any double class artifacts
    content = content.replace(/bg-\[\#0a1936\]\/80 backdrop-blur-2xl\/\[[0-9.]+\]/g, 'bg-white/[0.06]'); // fix accidental double replacements
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Processed: ${filePath}`);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});
console.log('Migration complete.');
