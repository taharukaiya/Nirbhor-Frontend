const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src/pages/admin'),
  path.join(__dirname, 'src/components/admin')
];

const replacements = [
  { regex: /\bbg-slate-950\b/g, replacement: "bg-slate-50 dark:bg-slate-950" },
  { regex: /\bbg-slate-900\b(?!\/)/g, replacement: "bg-white dark:bg-slate-900" },
  { regex: /\bbg-slate-900\/95\b/g, replacement: "bg-white/95 dark:bg-slate-900/95" },
  { regex: /\bbg-slate-900\/80\b/g, replacement: "bg-white/80 dark:bg-slate-900/80" },
  { regex: /\bbg-slate-900\/60\b/g, replacement: "bg-slate-50 dark:bg-slate-900/60" },
  { regex: /\bbg-slate-950\/60\b/g, replacement: "bg-slate-100 dark:bg-slate-950/60" },
  { regex: /\bbg-slate-950\/80\b/g, replacement: "bg-slate-100 dark:bg-slate-950/80" },
  { regex: /\bbg-slate-800\b(?!\/)/g, replacement: "bg-slate-100 dark:bg-slate-800" },
  { regex: /\bbg-slate-800\/40\b/g, replacement: "bg-slate-50 dark:bg-slate-800/40" },
  { regex: /\bbg-slate-800\/80\b/g, replacement: "bg-slate-100 dark:bg-slate-800/80" },
  
  { regex: /\bborder-slate-800\b/g, replacement: "border-slate-200 dark:border-slate-800" },
  { regex: /\bborder-slate-800\/60\b/g, replacement: "border-slate-200 dark:border-slate-800/60" },
  { regex: /\bborder-slate-700\b/g, replacement: "border-slate-300 dark:border-slate-700" },

  { regex: /\btext-slate-100\b/g, replacement: "text-slate-900 dark:text-slate-100" },
  { regex: /\btext-slate-200\b/g, replacement: "text-slate-800 dark:text-slate-200" },
  { regex: /\btext-slate-300\b/g, replacement: "text-slate-700 dark:text-slate-300" },
  { regex: /\btext-slate-400\b/g, replacement: "text-slate-600 dark:text-slate-400" },
  { regex: /\btext-slate-500\b/g, replacement: "text-slate-500 dark:text-slate-400" },
  { regex: /\btext-white\b/g, replacement: "text-slate-900 dark:text-white" },
  { regex: /\bhover:text-white\b/g, replacement: "hover:text-slate-900 dark:hover:text-white" },
  { regex: /\bhover:bg-slate-800\b/g, replacement: "hover:bg-slate-100 dark:hover:bg-slate-800" },
  { regex: /\bhover:bg-slate-800\/80\b/g, replacement: "hover:bg-slate-100 dark:hover:bg-slate-800/80" },
  
  { regex: /\bring-slate-700\b/g, replacement: "ring-slate-300 dark:ring-slate-700" },
  { regex: /\bdivide-slate-800\/60\b/g, replacement: "divide-slate-200 dark:divide-slate-800/60" },
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (file.endsWith('.jsx')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });

      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file}`);
    }
  });
});
