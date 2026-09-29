import fs from 'fs';
import path from 'path';

const CATALOG_PATH = 'public/courses_catalog.json';
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));

console.log(`Original catalog courses: ${catalog.length}`);

// Normalize helper for deduplication
function normalizeTitle(str) {
  return str
    .toLowerCase()
    .replace(/^[0-9️⃣🔟._ -]+/, '')
    .replace(/@membresiatpc/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const existingNormalizedTitles = new Map();
catalog.forEach((course) => {
  existingNormalizedTitles.set(normalizeTitle(course.title), course.id);
  existingNormalizedTitles.set(course.slug, course.id);
});

const DOWNLOADS_DIR = '/Users/toni/Downloads';
const candidateDirs = fs.readdirSync(DOWNLOADS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('.'));

let addedTelegramCount = 0;
let skippedDuplicatesCount = 0;

candidateDirs.forEach((dirEnt) => {
  const dirName = dirEnt.name;
  const fullPath = path.join(DOWNLOADS_DIR, dirName);
  
  // Recursively find files to extract lessons and check TPC signature
  function scanDir(dir) {
    let results = [];
    try {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        if (item.name.startsWith('.')) continue;
        const itemPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          results.push(...scanDir(itemPath));
        } else {
          results.push({
            name: item.name,
            fullPath: itemPath,
            relPath: path.relative(fullPath, itemPath)
          });
        }
      }
    } catch(e) {}
    return results;
  }

  const allFiles = scanDir(fullPath);
  if (allFiles.length === 0) return;

  const isTPC = allFiles.some(f => f.name.includes('@MEMBRESIATPC') || f.name.includes('TPC')) ||
                dirName.toLowerCase().includes('trading') ||
                dirName.toLowerCase().includes('skool') ||
                dirName.toLowerCase().includes('vibe') ||
                dirName.toLowerCase().includes('ninjatrader') ||
                dirName.toLowerCase().includes('wyckoff');

  const normTitle = normalizeTitle(dirName);

  // Check deduplication against Google Drive
  let existingId = existingNormalizedTitles.get(normTitle);
  if (!existingId) {
    // Check partial fuzzy match
    for (const [existingNorm, id] of existingNormalizedTitles.entries()) {
      if (existingNorm.length > 5 && (existingNorm.includes(normTitle) || normTitle.includes(existingNorm))) {
        existingId = id;
        break;
      }
    }
  }

  if (existingId) {
    console.log(`[DEDUPLICATED] "${dirName}" matches existing Drive course (ID: ${existingId}). Skipped duplicate.`);
    skippedDuplicatesCount++;
    return;
  }

  // Determine category & niche
  let category = "Desarrollo & Programación";
  let niche = "General";
  let author = "Creador Especializado";

  const lowerName = dirName.toLowerCase();
  if (lowerName.includes('trading') || lowerName.includes('scalping') || lowerName.includes('wyckoff') || lowerName.includes('ninjatrader')) {
    category = "Trading & Inversión";
    niche = "Trading Algorítmico & Futuros";
  } else if (lowerName.includes('vibe') || lowerName.includes('claude') || lowerName.includes('code') || lowerName.includes('python')) {
    category = "Desarrollo & Programación";
    niche = "IA & Fullstack Development";
  } else if (lowerName.includes('lain garcia') || lowerName.includes('confianza') || lowerName.includes('meditaciones')) {
    category = "Mentalidad & Productividad";
    niche = "Desarrollo Personal & Liderazgo";
  } else if (lowerName.includes('seo') || lowerName.includes('marketing') || lowerName.includes('amazon')) {
    category = "Marketing & SEO";
    niche = "Marketing Digital & Ecommerce";
  }

  // Extract author if present
  if (dirName.includes(' - ')) {
    const parts = dirName.split(' - ');
    if (parts[0].length < 30) {
      author = parts[0].trim();
    }
  } else if (dirName.includes('Lain Garcia Calvo')) {
    author = "Laín García Calvo";
  } else if (dirName.includes('Joel Montes')) {
    author = "Joel Montes";
  }

  // Organize files into Modules & Lessons
  const mediaFiles = allFiles.filter(f => /\.(mp4|mkv|mov|avi|webm|pdf|zip|rar)$/i.test(f.name));
  
  // Group by subfolder
  const modulesMap = new Map();
  mediaFiles.forEach((file) => {
    const dirParts = path.dirname(file.relPath).split(path.sep);
    const modTitle = dirParts[0] === '.' ? '01 - Contenido Principal' : dirParts[0];
    if (!modulesMap.has(modTitle)) {
      modulesMap.set(modTitle, []);
    }
    modulesMap.get(modTitle).push(file);
  });

  const modules = Array.from(modulesMap.entries()).map(([modTitle, files], mIdx) => ({
    id: `m-${mIdx + 1}`,
    title: modTitle,
    order: mIdx + 1,
    lessons: files.map((file, lIdx) => {
      const ext = path.extname(file.name).toLowerCase();
      let fileType = 'video';
      if (ext === '.pdf' || ext === '.doc' || ext === '.docx') fileType = 'doc';
      if (ext === '.zip' || ext === '.rar' || ext === '.7z') fileType = 'archive';

      const cleanLessonTitle = file.name
        .replace(/@membresiatpc/gi, '')
        .replace(/\.[^/.]+$/, '')
        .trim();

      return {
        id: `l-${mIdx + 1}-${lIdx + 1}`,
        title: cleanLessonTitle,
        fileType,
        order: lIdx + 1,
        relPath: file.relPath
      };
    })
  }));

  const totalLessons = mediaFiles.length || 1;
  const estimatedHours = `${Math.max(2, Math.round(totalLessons * 0.4))}h`;

  const newCourse = {
    id: `tpc-telegram-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    slug: normTitle.replace(/\s+/g, '-'),
    title: dirName.replace(/@membresiatpc/gi, '').trim(),
    author: author,
    category: category,
    niche: niche,
    utility: `Formación completa descargable desde Telegram TPC (${dirName}) con pipeline para extracción en SSD y subida a Google Drive.`,
    targetAudience: `Estudiantes y profesionales interesados en ${niche.toLowerCase()}.`,
    difficulty: "Intermedio",
    estimatedHours: estimatedHours,
    originType: "TELEGRAM_TPC",
    originName: "Telegram • DESCARGAS TPC 📥 (@MEMBRESIATPC)",
    localPath: fullPath,
    drivePath: `Google Drive / Cursos / ${dirName}`,
    webUrl: `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(normTitle)}`,
    rating: 4.8,
    totalLessons: totalLessons,
    tags: ["telegram", "tpc", category.toLowerCase().split(' ')[0], niche.toLowerCase().split(' ')[0]],
    hasLocalFiles: true,
    telegramChannel: "DESCARGAS TPC 📥",
    telegramSearchUrl: `tg://resolve?domain=MEMBRESIATPC&query=${encodeURIComponent(normTitle)}`,
    isUploadedToDrive: false,
    pipelineStatus: "DOWNLOADED",
    modules: modules
  };

  catalog.push(newCourse);
  existingNormalizedTitles.set(normTitle, newCourse.id);
  addedTelegramCount++;
  console.log(`[ADDED TELEGRAM] "${newCourse.title}" | Lessons: ${totalLessons} | Category: ${category}`);
});

console.log(`\n================ Summary ================`);
console.log(`Total Telegram Courses Added: ${addedTelegramCount}`);
console.log(`Duplicates Skipped (Already in Drive): ${skippedDuplicatesCount}`);
console.log(`Total Courses in Updated Catalog: ${catalog.length}`);

fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`Catalog successfully updated at ${CATALOG_PATH}`);
