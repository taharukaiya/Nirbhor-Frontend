
const fs = require('fs');
const code = fs.readFileSync('src/pages/FindServicePage.jsx', 'utf8');
const regex = /t\(['\"\]+([^'\"\]+)['\"\]+\)/g;
let match;
const keys = new Set();
while ((match = regex.exec(code)) !== null) {
  keys.add(match[1]);
}
console.log(Array.from(keys));

