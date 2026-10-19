import fs from 'fs';
import path from 'path';

const CATALOG_PATH = 'public/courses_catalog.json';
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));

console.log(`Initial courses in catalog: ${catalog.length}`);

const DOWNLOADS_DIR = '/Users/toni/Downloads';
const MI_UNIDAD_CURSOS = '/Users/toni/Library/CloudStorage/GoogleDrive-leblangarcia@gmail.com/Mi unidad/001-CURSOS';

function safeEncode(str) {
  try {
    return encodeURIComponent(str || '');
  } catch (e) {
    return encodeURIComponent((str || '').replace(/[\uD800-\uDFFF]/g, ''));
  }
}

function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/^[@]?[0-9️⃣🔟._ -]+/, '')
    .replace(/@cursosp0rmega/gi, '')
    .replace(/@MEMBRESIATPC/gi, '')
    .replace(/@TUSCURSOSFULL/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeKey(str) {
  return cleanTitle(str).toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Map existing catalog courses
const catalogMapByKey = new Map();
catalog.forEach((c) => {
  catalogMapByKey.set(normalizeKey(c.title), c);
  if (c.slug) catalogMapByKey.set(c.slug.replace(/[^a-z0-9]/g, ''), c);
});

// Recursive file scanner for a directory
function scanDirFiles(dir, maxDepth = 4, currentDepth = 0) {
  if (currentDepth > maxDepth) return [];
  let results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.name.startsWith('.')) continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        results.push(...scanDirFiles(full, maxDepth, currentDepth + 1));
      } else {
        results.push({
          name: ent.name,
          fullPath: full,
          relPath: path.relative(dir, full),
          size: fs.statSync(full).size
        });
      }
    }
  } catch (e) {}
  return results;
}

// Helper to build modules from files
function buildModules(baseDir, files) {
  const mediaFiles = files.filter(f => /\.(mp4|mkv|mov|avi|webm|pdf|zip|rar|7z)$/i.test(f.name));
  const modulesMap = new Map();

  mediaFiles.forEach((file) => {
    const dirParts = path.dirname(file.relPath).split(path.sep);
    let modTitle = dirParts[0] === '.' ? '01 - Contenido Principal' : dirParts[0];
    modTitle = modTitle.replace(/^[0-9️⃣🔟._ -]+/, '').replace(/@.*$/i, '').trim();
    if (!modTitle) modTitle = '01 - Lecciones';

    if (!modulesMap.has(modTitle)) {
      modulesMap.set(modTitle, []);
    }
    modulesMap.get(modTitle).push(file);
  });

  return Array.from(modulesMap.entries()).map(([modTitle, mFiles], mIdx) => ({
    id: `m-${mIdx + 1}`,
    title: modTitle,
    order: mIdx + 1,
    lessons: mFiles.map((file, lIdx) => {
      const ext = path.extname(file.name).toLowerCase();
      let fileType = 'video';
      if (['.pdf', '.doc', '.docx', '.txt'].includes(ext)) fileType = 'doc';
      if (['.zip', '.rar', '.7z'].includes(ext)) fileType = 'archive';

      const cleanName = file.name
        .replace(/@MEMBRESIATPC/gi, '')
        .replace(/@TUSCURSOSFULL/gi, '')
        .replace(/\.[^/.]+$/, '')
        .replace(/^[0-9️⃣🔟._ -]+/, '')
        .trim();

      return {
        id: `l-${mIdx + 1}-${lIdx + 1}`,
        title: cleanName || file.name,
        fileType,
        order: lIdx + 1,
        relPath: file.relPath
      };
    })
  }));
}

let addedTelegramCount = 0;
let updatedLocalCount = 0;

// 1. Scan Academia Prime IA subcourses
const primeIaDir = path.join(DOWNLOADS_DIR, 'Academia Prime IA');
if (fs.existsSync(primeIaDir)) {
  const subDirs = fs.readdirSync(primeIaDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'));

  console.log(`Found ${subDirs.length} subcourses inside Academia Prime IA`);

  subDirs.forEach((sub) => {
    const subTitle = sub.name;
    const subPath = path.join(primeIaDir, subTitle);
    const subFiles = scanDirFiles(subPath);

    if (subFiles.length === 0) return;

    const normKey = normalizeKey(subTitle);
    const cleanT = cleanTitle(subTitle);
    const mediaCount = subFiles.filter(f => /\.(mp4|mkv|mov|avi|webm|pdf)$/i.test(f.name)).length;
    const totalLessons = mediaCount || subFiles.length;
    const estimatedHours = `${Math.max(2, Math.round(totalLessons * 0.4))}h`;

    let niche = "IA & Automatización";
    let utility = `Formación práctica sobre ${cleanT} descargada de Academia Prime IA (Telegram TPC) con soporte para preparación automática en Google Drive.`;

    if (subTitle.toLowerCase().includes('runninghub') || subTitle.toLowerCase().includes('n8n')) {
      niche = "N8N & Automatizaciones con IA";
    } else if (subTitle.toLowerCase().includes('claude')) {
      niche = "Claude Code & Asistentes IA";
    } else if (subTitle.toLowerCase().includes('lora') || subTitle.toLowerCase().includes('wan') || subTitle.toLowerCase().includes('comfyui') || subTitle.toLowerCase().includes('krea')) {
      niche = "Generación de Vídeo & Modelos IA";
    }

    const driveTargetFolder = path.join(MI_UNIDAD_CURSOS, '00-IA-CURSOS', cleanT);
    const isPreparedInDrive = fs.existsSync(driveTargetFolder);

    const newCourse = {
      id: `tpc-primeia-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      slug: cleanT.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: cleanT,
      author: "Academia Prime IA",
      category: "IA & Automatización",
      platform: "Academia Prime IA",
      niche: niche,
      utility: utility,
      targetAudience: "Desarrolladores, creadores de contenido y profesionales que buscan dominar la IA generativa y la automatización.",
      difficulty: "Intermedio",
      estimatedHours: estimatedHours,
      originType: "TELEGRAM_TPC",
      originName: "Telegram • Academia Prime IA 📥 (@MEMBRESIATPC)",
      localPath: subPath,
      drivePath: `Mi unidad / 001-CURSOS / 00-IA-CURSOS / ${cleanT}`,
      webUrl: `https://drive.google.com/drive/u/0/search?q=${safeEncode(cleanT)}`,
      rating: 4.9,
      totalLessons: totalLessons,
      tags: ["telegram", "tpc", "prime-ia", "ia", "automatizacion", niche.toLowerCase().split(' ')[0]],
      hasLocalFiles: true,
      isArchive: false,
      archivePath: path.join(DOWNLOADS_DIR, 'Academia Prime IA.part1.rar'),
      archiveType: "RAR",
      telegramChannel: "DESCARGAS TPC 📥 (@MEMBRESIATPC)",
      telegramSearchUrl: `tg://resolve?domain=MEMBRESIATPC&query=${safeEncode(cleanT)}`,
      isUploadedToDrive: isPreparedInDrive,
      isPreparedInDrive: isPreparedInDrive,
      pipelineStatus: isPreparedInDrive ? "UPLOADED" : "DOWNLOADED",
      modules: buildModules(subPath, subFiles)
    };

    if (catalogMapByKey.has(normKey)) {
      const existing = catalogMapByKey.get(normKey);
      existing.hasLocalFiles = true;
      existing.localPath = subPath;
      existing.archivePath = path.join(DOWNLOADS_DIR, 'Academia Prime IA.part1.rar');
      existing.isArchive = true;
      existing.archiveType = "RAR";
      existing.isPreparedInDrive = isPreparedInDrive;
      updatedLocalCount++;
    } else {
      catalog.push(newCourse);
      catalogMapByKey.set(normKey, newCourse);
      addedTelegramCount++;
      console.log(`[ADDED PRIME IA] ${newCourse.title} (${totalLessons} lecciones)`);
    }
  });
}

// 2. Scan other Downloads courses from Telegram
const candidateFolders = [
  { dir: 'Google antigravity desde cero crea apps con ayuda de la IA', cat: 'IA & Automatización', niche: 'Google Antigravity & Vibe Coding', author: 'Especialista Antigravity' },
  { dir: 'Máster Claude Code 2026 Agentes IA, MCP, Skills y Comandos', cat: 'Desarrollo & Programación', niche: 'Claude Code & MCP Agentes', author: 'Membresía TPC' },
  { dir: 'Lovable con Sites', cat: 'Desarrollo & Programación', niche: 'Lovable & No-Code Fullstack', author: 'Lovable Sites Master' },
  { dir: 'Inicio Antigravity', cat: 'IA & Automatización', niche: 'Google Antigravity Básico', author: 'Antigravity Guías' },
  { dir: 'Panel.De.Trading.IFT', cat: 'Trading & Inversión', niche: 'Trading Algorítmico & Scripts', author: 'IFT Trading' },
  { dir: 'Daily.Win.manual', cat: 'Trading & Inversión', niche: 'Trading & Estrategias Intradía', author: 'Daily Win' },
  { dir: 'Estrategias', cat: 'Trading & Inversión', niche: 'Estrategias de Inversión', author: 'Trading Master' }
];

candidateFolders.forEach(({ dir: dirName, cat: category, niche, author }) => {
  const fullPath = path.join(DOWNLOADS_DIR, dirName);
  if (!fs.existsSync(fullPath)) return;

  const files = scanDirFiles(fullPath);
  if (files.length === 0) return;

  const cleanT = cleanTitle(dirName);
  const normKey = normalizeKey(cleanT);
  const mediaCount = files.filter(f => /\.(mp4|mkv|mov|avi|webm|pdf)$/i.test(f.name)).length;
  const totalLessons = mediaCount || files.length;
  const estimatedHours = `${Math.max(2, Math.round(totalLessons * 0.4))}h`;

  const driveTargetFolder = path.join(MI_UNIDAD_CURSOS, category === 'Trading & Inversión' ? 'Trading' : '00-IA-CURSOS', cleanT);
  const isPreparedInDrive = fs.existsSync(driveTargetFolder);

  if (catalogMapByKey.has(normKey)) {
    const existing = catalogMapByKey.get(normKey);
    existing.hasLocalFiles = true;
    existing.localPath = fullPath;
    existing.isPreparedInDrive = isPreparedInDrive;
    if (existing.modules && existing.modules.length === 0) {
      existing.modules = buildModules(fullPath, files);
    }
    updatedLocalCount++;
    console.log(`[UPDATED LOCAL] ${existing.title} -> localPath attached`);
  } else {
    const newCourse = {
      id: `tpc-telegram-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      slug: cleanT.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: cleanT,
      author: author,
      category: category,
      platform: "Telegram TPC",
      niche: niche,
      utility: `Curso completo de ${cleanT} descargado desde Telegram TPC, listo para ver y preparar en Google Drive.`,
      targetAudience: `Interesados en ${niche.toLowerCase()}.`,
      difficulty: "Intermedio",
      estimatedHours: estimatedHours,
      originType: "TELEGRAM_TPC",
      originName: "Telegram • DESCARGAS TPC 📥 (@MEMBRESIATPC)",
      localPath: fullPath,
      drivePath: `Mi unidad / 001-CURSOS / ${category === 'Trading & Inversión' ? 'Trading' : '00-IA-CURSOS'} / ${cleanT}`,
      webUrl: `https://drive.google.com/drive/u/0/search?q=${safeEncode(cleanT)}`,
      rating: 4.8,
      totalLessons: totalLessons,
      tags: ["telegram", "tpc", category.toLowerCase().split(' ')[0], niche.toLowerCase().split(' ')[0]],
      hasLocalFiles: true,
      isArchive: false,
      telegramChannel: "DESCARGAS TPC 📥 (@MEMBRESIATPC)",
      telegramSearchUrl: `tg://resolve?domain=MEMBRESIATPC&query=${safeEncode(cleanT)}`,
      isUploadedToDrive: isPreparedInDrive,
      isPreparedInDrive: isPreparedInDrive,
      pipelineStatus: isPreparedInDrive ? "UPLOADED" : "DOWNLOADED",
      modules: buildModules(fullPath, files)
    };

    catalog.push(newCourse);
    catalogMapByKey.set(normKey, newCourse);
    addedTelegramCount++;
    console.log(`[ADDED TELEGRAM COURSE] ${newCourse.title} (${totalLessons} lecciones)`);
  }
});

// 3. Mark all archive courses across the catalog (.rar, .zip, .7z)
let markedArchiveCount = 0;
catalog.forEach((c) => {
  const isArchiveFile = c.localPath && /\.(zip|rar|7z)$/i.test(c.localPath);
  if (isArchiveFile) {
    c.isArchive = true;
    const ext = path.extname(c.localPath).toUpperCase().replace('.', '');
    c.archiveType = ext === 'ZIP' ? 'ZIP' : ext === 'RAR' ? 'RAR' : '7Z';
    c.archivePath = c.localPath;

    // Check if target folder already exists in Mi unidad/001-CURSOS
    const targetFolder = path.join(MI_UNIDAD_CURSOS, cleanTitle(c.title));
    c.isPreparedInDrive = fs.existsSync(targetFolder);
    markedArchiveCount++;
  } else if (!c.isArchive) {
    c.isArchive = false;
  }
});

console.log(`\n================ Sync Report ================`);
console.log(`Telegram Subcourses Added: ${addedTelegramCount}`);
console.log(`Existing Courses Updated with Local Files: ${updatedLocalCount}`);
console.log(`Archive Courses Tagged (.rar / .zip): ${markedArchiveCount}`);
console.log(`Total Courses in Catalog: ${catalog.length}`);

fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`Catalog saved at ${CATALOG_PATH}`);
