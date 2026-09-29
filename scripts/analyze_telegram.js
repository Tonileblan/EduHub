import fs from 'fs';
import path from 'path';

const catalog = JSON.parse(fs.readFileSync('public/courses_catalog.json', 'utf8'));

const downloadsPath = '/Users/toni/Downloads';
const dirs = fs.readdirSync(downloadsPath, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('.'));

console.log('=== Directories in ~/Downloads ===');
dirs.forEach(d => {
  const dirPath = path.join(downloadsPath, d.name);
  let files = [];
  try {
    files = fs.readdirSync(dirPath);
  } catch(e) {}
  
  const hasTPC = files.some(f => f.includes('@MEMBRESIATPC') || f.includes('TPC'));
  
  const normName = d.name.toLowerCase().trim();
  const match = catalog.find(c => {
    const cNorm = c.title.toLowerCase().trim();
    return cNorm === normName || cNorm.includes(normName) || normName.includes(cNorm);
  });

  console.log(`- Folder: "${d.name}"`);
  console.log(`  TPC Signature: ${hasTPC ? 'YES (@MEMBRESIATPC)' : 'No'}`);
  console.log(`  Already in Drive Catalog: ${match ? `YES (ID: ${match.id} - "${match.title}")` : 'NO (New course from Telegram)'}`);
});
