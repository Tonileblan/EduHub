import fs from 'fs';
import path from 'path';
import { execSync, exec } from 'child_process';

const GDRIVE_ROOT = '/Users/toni/Library/CloudStorage/GoogleDrive-leblangarcia@gmail.com';
const MI_UNIDAD_CURSOS = path.join(GDRIVE_ROOT, 'Mi unidad', '001-CURSOS');
const CATALOG_PATH = path.resolve('public/courses_catalog.json');

// Parse CLI args
const args = process.argv.slice(2);
function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const argId = getArg('--id');
let argSource = getArg('--source');
let argTitle = getArg('--title');
let argCategory = getArg('--category');

function cleanTitle(raw) {
  if (!raw) return 'Curso';
  return raw
    .replace(/^[@]?[0-9️⃣🔟._ -]+/, '')
    .replace(/@cursosp0rmega/gi, '')
    .replace(/@MEMBRESIATPC/gi, '')
    .replace(/@TUSCURSOSFULL/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[._-]+/g, ' ')
    .replace(/[/\\:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

let catalog = [];
try {
  catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
} catch (e) {}

let matchedCourse = null;
if (argId) {
  matchedCourse = catalog.find(c => c.id === argId);
} else if (argTitle) {
  const normArg = cleanTitle(argTitle).toLowerCase();
  matchedCourse = catalog.find(c => cleanTitle(c.title).toLowerCase() === normArg || c.title.toLowerCase().includes(normArg));
}

if (matchedCourse) {
  if (!argTitle) argTitle = matchedCourse.title;
  if (!argCategory) argCategory = matchedCourse.category;
  if (!argSource) {
    if (matchedCourse.localPath && fs.existsSync(matchedCourse.localPath)) {
      argSource = matchedCourse.localPath;
    } else if (matchedCourse.archivePath && fs.existsSync(matchedCourse.archivePath)) {
      argSource = matchedCourse.archivePath;
    } else {
      argSource = matchedCourse.localPath || matchedCourse.archivePath;
    }
  }
}

if (!argTitle && argSource) {
  argTitle = path.basename(argSource).replace(/\.(rar|zip|7z)$/i, '');
}

if (!argTitle) {
  console.error(JSON.stringify({ error: "Missing --title, --id or --source argument" }));
  process.exit(1);
}

const safeTitle = cleanTitle(argTitle);

// Determine subfolder in 001-CURSOS
let subfolder = '';
const catLower = (argCategory || '').toLowerCase();
const titleLower = safeTitle.toLowerCase();

if (catLower.includes('ia') || titleLower.includes('antigravity') || titleLower.includes('claude') || titleLower.includes('vibe') || titleLower.includes('ia')) {
  subfolder = '00-IA-CURSOS';
}

let targetDir = subfolder ? path.join(MI_UNIDAD_CURSOS, subfolder, safeTitle) : path.join(MI_UNIDAD_CURSOS, safeTitle);

// 1. Check if already prepared
if (fs.existsSync(targetDir)) {
  const existingFiles = fs.readdirSync(targetDir).filter(f => !f.startsWith('.'));
  if (existingFiles.length > 0) {
    try { exec(`open "${targetDir}"`); } catch (e) {}
    const result = {
      success: true,
      alreadyPrepared: true,
      destinationPath: targetDir,
      filesCount: existingFiles.length,
      message: `El curso "${safeTitle}" ya está preparado en Google Drive listo para streaming.`,
      webUrl: `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(safeTitle)}`
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }
}

// 2. Locate source if missing
if (!argSource || !fs.existsSync(argSource)) {
  // Try to find in ~/Downloads
  const dl = '/Users/toni/Downloads';
  const candidates = [
    path.join(dl, 'Academia Prime IA', safeTitle),
    path.join(dl, safeTitle),
    path.join(dl, `${safeTitle}.rar`),
    path.join(dl, `${safeTitle}.zip`),
    path.join(dl, `${safeTitle}.part1.rar`),
    path.join(dl, 'Academia Prime IA.part1.rar')
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      argSource = c;
      break;
    }
  }
}

if (!argSource || !fs.existsSync(argSource)) {
  const result = {
    error: `No se encontró el archivo local para "${safeTitle}". Descárgalo primero desde Telegram (@MEMBRESIATPC).`,
    telegramUrl: matchedCourse?.telegramSearchUrl || `https://t.me/MEMBRESIATPC`
  };
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

// If multipart archive, normalize to .part1.rar
if (/\.part\d+\.rar$/i.test(argSource) && !/\.part1\.rar$/i.test(argSource)) {
  const part1 = argSource.replace(/\.part\d+\.rar$/i, '.part1.rar');
  if (fs.existsSync(part1)) {
    argSource = part1;
  }
}

fs.mkdirSync(targetDir, { recursive: true });

const stat = fs.statSync(argSource);
const isDirectory = stat.isDirectory();

console.log(`[PREPARING] Source: "${argSource}" (${isDirectory ? "Carpeta" : "Archivo Comprimido"}) ➔ Target Drive: "${targetDir}"`);

if (isDirectory) {
  // Copy directory content to Google Drive
  try {
    execSync(`cp -R "${argSource}/." "${targetDir}/"`);
  } catch (err) {
    console.error(JSON.stringify({ error: `Fallo al copiar contenido a Drive: ${err.message}` }));
    process.exit(1);
  }
} else {
  // Unpack with unar
  const unarBin = '/opt/homebrew/bin/unar';
  if (!fs.existsSync(unarBin)) {
    console.error(JSON.stringify({ error: "unar no está instalado en /opt/homebrew/bin/unar" }));
    process.exit(1);
  }

  // Trigger materialization if on Google Drive
  try { exec(`open -R "${argSource}"`); } catch (e) {}

  const unarCmd = `"${unarBin}" -force-overwrite -output-directory "${targetDir}" "${argSource}"`;
  try {
    execSync(unarCmd);
  } catch (err) {
    console.warn(`[UNAR WARNING] ${err.message}`);
  }
}

let fileCount = 0;
try {
  fileCount = fs.readdirSync(targetDir).filter(f => !f.startsWith('.')).length;
} catch (e) {}

// Reveal in Finder / Google Drive
try {
  exec(`open "${targetDir}"`);
} catch (e) {}

// Update course in catalog if matched
if (matchedCourse) {
  matchedCourse.isPreparedInDrive = true;
  matchedCourse.isUploadedToDrive = true;
  matchedCourse.pipelineStatus = "UPLOADED";
  matchedCourse.drivePath = targetDir;
  try {
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
  } catch (e) {}
}

const successResult = {
  success: true,
  destinationPath: targetDir,
  filesExtracted: fileCount,
  message: `¡Curso "${safeTitle}" preparado con éxito en Google Drive (${fileCount} elementos)!`,
  webUrl: `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(safeTitle)}`
};

console.log(JSON.stringify(successResult, null, 2));
