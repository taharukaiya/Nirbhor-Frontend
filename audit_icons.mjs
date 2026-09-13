import fs from 'fs';
import path from 'path';

function findFiles(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(file, ext));
    } else {
      if (file.endsWith(ext) || file.endsWith(ext + 'x')) results.push(file);
    }
  });
  return results;
}

const iconsFilePath = path.join(process.cwd(), 'src/components/ui/Icons.jsx');
const iconsFileContent = fs.readFileSync(iconsFilePath, 'utf8');

// Find all exported functions in Icons.jsx
const exportRegex = /export\s+function\s+([A-Z][a-zA-Z0-9]+)/g;
let match;
const exportedIcons = new Set();
while ((match = exportRegex.exec(iconsFileContent)) !== null) {
  exportedIcons.add(match[1]);
}
console.log('Exported Icons:', [...exportedIcons].length);

// Find all files
const allFiles = findFiles(path.join(process.cwd(), 'src'), '.js');

// Parse imports
let allImportedIcons = new Set();
let fileImports = {};

allFiles.forEach(file => {
  if (file === iconsFilePath) return;
  const content = fs.readFileSync(file, 'utf8');
  // Regex to match: import { Icon1, Icon2 } from ".../components/ui/Icons.jsx"
  // It can span multiple lines
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"](?:\.\.\/)*components\/ui\/Icons(?:\.jsx)?['"]/g;
  let importMatch;
  while ((importMatch = importRegex.exec(content)) !== null) {
    const icons = importMatch[1].split(',').map(i => i.trim()).filter(i => i);
    icons.forEach(icon => {
      allImportedIcons.add(icon);
      if (!fileImports[file]) fileImports[file] = [];
      fileImports[file].push(icon);
    });
  }
});

console.log('\nMissing Icons:');
for (const icon of allImportedIcons) {
  if (!exportedIcons.has(icon)) {
    console.log(`- ${icon}`);
    // Find which files import it
    for (const [file, icons] of Object.entries(fileImports)) {
      if (icons.includes(icon)) {
        console.log(`  Imported in: ${file.replace(process.cwd(), '')}`);
      }
    }
  }
}
