import fs from 'fs';
import path from 'path';

const CATALOG_PATH = 'public/courses_catalog.json';
const GDRIVE_ROOT = '/Users/toni/Library/CloudStorage/GoogleDrive-leblangarcia@gmail.com';
const SHORTCUTS_DIR = path.join(GDRIVE_ROOT, '.shortcut-targets-by-id');
const MI_UNIDAD_DIR = path.join(GDRIVE_ROOT, 'Mi unidad');

// Read existing catalog
const existingCatalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
console.log(`Original catalog courses count: ${existingCatalog.length}`);

// Safe URI encode helper
function safeEncode(str) {
  try {
    return encodeURIComponent(str);
  } catch (e) {
    return encodeURIComponent((str || '').replace(/[\uD800-\uDFFF]/g, ''));
  }
}

// Clean title
function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/^[@]?[0-9️⃣🔟._ -]+/, '')
    .replace(/@cursosp0rmega/gi, '')
    .replace(/@MEMBRESIATPC/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeKey(str) {
  return cleanTitle(str).toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Platform detection map
function detectPlatform(title, originName = '', pathStr = '') {
  const combined = `${title} ${originName} ${pathStr}`.toLowerCase();
  
  // Specific branded academies/creators
  if (combined.includes('devtalles') || combined.includes('fernando herrera')) return 'DevTalles';
  if (combined.includes('codely')) return 'Codely';
  if (combined.includes('platzi')) return 'Platzi';
  if (combined.includes('udemy')) return 'Udemy';
  if (combined.includes('edteam') || combined.includes('ed.team')) return 'EDteam';
  if (combined.includes('domestika')) return 'Domestika';
  if (combined.includes('crehana')) return 'Crehana';
  if (combined.includes('mindvalley')) return 'Mindvalley';
  if (combined.includes('mastermind')) return 'Mastermind';
  if (combined.includes('seo warriors') || combined.includes('dean romero')) return 'Seo Warriors';
  if (combined.includes('bemaster')) return 'BeMaster';
  if (combined.includes('biialab') || combined.includes('jurgen klaric') || combined.includes('jürguen')) return 'BiiaLab';
  if (combined.includes('convierte mas') || combined.includes('convierte más') || combined.includes('vilma nuñez') || combined.includes('vilma núñez')) return 'Convierte Más';
  if (combined.includes('emprendeaprendiendo') || combined.includes('euge oller')) return 'Emprende Aprendiendo';
  if (combined.includes('instituto 11') || combined.includes('carlos muñoz')) return 'Instituto 11';
  if (combined.includes('musihacks') || combined.includes('jaime altozano')) return 'Musihacks';
  if (combined.includes('codigo facilito') || combined.includes('código facilito')) return 'Código Facilito';
  if (combined.includes('hotmart')) return 'Hotmart';
  if (combined.includes('openwebinars')) return 'OpenWebinars';
  if (combined.includes('smartbeemo')) return 'SmartBeemo';
  if (combined.includes('escuela it')) return 'Escuela IT';
  if (combined.includes('alvaro chirou') || combined.includes('álvaro chirou')) return 'Álvaro Chirou';
  if (combined.includes('juan fernando urrego')) return 'Juan Fernando Urrego';
  if (combined.includes('arcux')) return 'Arcux';
  if (combined.includes('neetwork')) return 'Neetwork Digital';
  if (combined.includes('netzun')) return 'Netzun';
  if (combined.includes('craftsy')) return 'Craftsy';
  if (combined.includes('gaia')) return 'Gaia';
  if (combined.includes('masterclass')) return 'Masterclass USA';
  if (combined.includes('21draw')) return '21Draw';
  if (combined.includes('backtrack academy')) return 'BackTrack Academy';
  if (combined.includes('fhi') || combined.includes('fitness and health')) return 'FHI';
  if (combined.includes('tus clases de guitarra')) return 'Tus Clases de Guitarra';
  if (combined.includes('escuela de bajistas')) return 'Escuela de Bajistas';
  if (combined.includes('skool') || combined.includes('vibe coding')) return 'Skool';
  if (combined.includes('founderz')) return 'Founderz';
  if (combined.includes('bigseo') || combined.includes('romuald fons')) return 'BIGSEO';
  if (combined.includes('the power') || combined.includes('powersales')) return 'The Power MBA';
  if (combined.includes('youtube') || combined.includes('ytmillonario')) return 'YouTube Academy';
  if (combined.includes('tony robbins')) return 'Tony Robbins';
  if (combined.includes('dispenza')) return 'Joe Dispenza';

  // If from Mi Unidad or Atajos
  if (originName.includes('Mi Unidad')) return 'Google Drive • Mi Unidad';
  if (originName.includes('Atajos')) return 'Google Drive • Atajos Cloud';

  return 'Google Drive Cloud';
}

// Author detection
function detectAuthor(title, currentAuthor, originName = '') {
  if (currentAuthor && currentAuthor !== 'Especialista de la Industria' && !currentAuthor.includes('EMPRENDEDORES') && currentAuthor.length > 2) {
    return currentAuthor;
  }
  const t = title.toLowerCase();
  if (t.includes('fernando herrera')) return 'Fernando Herrera';
  if (t.includes('tony robbins')) return 'Tony Robbins';
  if (t.includes('joe dispenza')) return 'Dr. Joe Dispenza';
  if (t.includes('jaime altozano')) return 'Jaime Altozano';
  if (t.includes('vilma nuñez') || t.includes('vilma núñez')) return 'Dra. Vilma Núñez';
  if (t.includes('carlos muñoz')) return 'Carlos Muñoz';
  if (t.includes('euge oller')) return 'Euge Oller';
  if (t.includes('romuald fons')) return 'Romuald Fons';
  if (t.includes('dean romero')) return 'Dean Romero';
  if (t.includes('franck scipion')) return 'Franck Scipion';
  if (t.includes('álvaro chirou') || t.includes('alvaro chirou')) return 'Álvaro Chirou';
  if (t.includes('nufal bakkali')) return 'Nufal Bakkali';
  if (t.includes('joel montes')) return 'Joel Montes';
  if (t.includes('victor heras') || t.includes('víctor heras')) return 'Víctor Heras';
  if (t.includes('adria sola') || t.includes('adrià solà')) return 'Adrià Solà Pastor';
  if (t.includes('lisa nichols')) return 'Lisa Nichols';
  if (t.includes('vishen lakhiani') || t.includes('vishean')) return 'Vishen Lakhiani';
  if (t.includes('pamela jean')) return 'Pamela Jean';
  if (t.includes('sebastian beja') || t.includes('sebastián beja')) return 'Sebastián Beja';
  if (t.includes('ruben guo') || t.includes('rubén guo')) return 'Rubén Guo';
  if (t.includes('david tevosyan')) return 'David Tevosyan';
  if (t.includes('jurgen klaric') || t.includes('jürgen klarić')) return 'Jürgen Klarić';
  if (t.includes('shadia shamie')) return 'Shadia Shamie';
  if (t.includes('marc basi')) return 'Marc Basi';
  if (t.includes('andrea vega')) return 'Andrea Vega';
  if (t.includes('emilio puigredon') || t.includes('emilio puigrredón')) return 'Emilio Puigredón';
  if (t.includes('hermo benito')) return 'Hermo Benito';
  if (t.includes('luis xtorres')) return 'Luis Xtorres';

  // Extract from format "Title - Author"
  const parts = title.split(' - ');
  if (parts.length >= 2) {
    const candidate = parts[parts.length - 1].trim();
    if (candidate.length > 2 && candidate.length < 35 && !candidate.match(/parte \d/i) && !candidate.match(/202\d/) && !candidate.match(/completo/i) && !candidate.match(/curso/i) && !candidate.match(/modulo/i)) {
      return candidate;
    }
  }

  return 'Especialista de la Industria';
}

// Category refinement
function refineCategory(title, currentCategory, platform, originName = '') {
  const t = `${title} ${platform} ${originName}`.toLowerCase();
  
  if (t.includes('trading') || t.includes('scalping') || t.includes('wyckoff') || t.includes('ninjatrader') || t.includes('forex') || t.includes('inversión') || t.includes('inversion') || t.includes('cripto') || t.includes('futuros') || t.includes('drawdown') || t.includes('finanzas')) {
    return 'Trading, Inversión & Finanzas';
  }
  if (t.includes('claude') || t.includes('chatgpt') || t.includes('antigravity') || t.includes('vibe coding') || t.includes('ia ') || t.includes('inteligencia artificial') || t.includes('agente') || t.includes('gpt') || t.includes('deepseek') || t.includes('n8n') || t.includes('automatizac')) {
    return 'IA & Agentes Autónomos';
  }
  if (t.includes('amazon') || t.includes('fba') || t.includes('ecommerce') || t.includes('e-commerce') || t.includes('importar de china') || t.includes('shopify') || t.includes('dropshipping')) {
    return 'E-Commerce & Amazon FBA';
  }
  if (t.includes('hacking') || t.includes('ciberseguridad') || t.includes('pentesting') || t.includes('seguridad')) {
    return 'Ciberseguridad & Hacking Ético';
  }
  if (t.includes('música') || t.includes('musica') || t.includes('guitarra') || t.includes('bajistas') || t.includes('ableton') || t.includes('fl studio') || t.includes('davinci') || t.includes('produccion musical') || t.includes('producción musical') || t.includes('audio') || t.includes('waves')) {
    return 'Música & Producción Sonora';
  }
  if (t.includes('seo') || t.includes('marketing') || t.includes('copywriting') || t.includes('copy') || t.includes('facebook ads') || t.includes('instagram') || t.includes('tiktok') || t.includes('redes sociales') || t.includes('tráfico') || t.includes('trafico') || t.includes('funnel')) {
    return 'Marketing, Tráfico & SEO';
  }
  if (t.includes('react') || t.includes('javascript') || t.includes('typescript') || t.includes('python') || t.includes('angular') || t.includes('rust') || t.includes('node') || t.includes('desarrollo web') || t.includes('programación') || t.includes('programacion') || t.includes('software') || t.includes('codely') || t.includes('devtalles') || t.includes('edteam') || t.includes('codigo facilito')) {
    return 'Desarrollo Web & Software';
  }
  if (t.includes('diseño') || t.includes('diseno') || t.includes('fotografía') || t.includes('fotografia') || t.includes('ilustrac') || t.includes('dibujo') || t.includes('3d') || t.includes('blender') || t.includes('photoshop') || t.includes('ilustrator') || t.includes('canva') || t.includes('vfx') || t.includes('domestika') || t.includes('crehana')) {
    return 'Diseño, Audiovisual & 3D';
  }
  if (t.includes('meditación') || t.includes('meditacion') || t.includes('mindfulness') || t.includes('liderazgo') || t.includes('comunicación') || t.includes('comunicacion') || t.includes('hablar en publico') || t.includes('desarrollo personal') || t.includes('oratoria') || t.includes('mente') || t.includes('prosperidad') || t.includes('hábitos') || t.includes('habitos') || t.includes('mindvalley')) {
    return 'Desarrollo Personal, Mente & Productividad';
  }

  let res = 'Negocios, Estrategia & Emprendimiento';
  if (currentCategory && currentCategory !== 'Negocios, Estrategia & Emprendimiento') {
    res = currentCategory;
  }

  // Canonical 10-category normalization
  if (res.includes('Desarrollo Web') || res.includes('Software') || res.includes('Programación') || res.includes('Programacion')) {
    return 'Desarrollo Web & Software';
  }
  if (res.includes('Marketing') || res.includes('Tráfico') || res.includes('Trafico') || res.includes('SEO') || res.includes('Copywriting')) {
    return 'Marketing, Tráfico & SEO';
  }
  if (res.includes('Personal') || res.includes('Mente') || res.includes('Mentalidad') || res.includes('Productividad') || res.includes('Liderazgo') || res.includes('Idiomas')) {
    return 'Desarrollo Personal, Mente & Productividad';
  }
  if (res.includes('Trading') || res.includes('Finanzas') || res.includes('Inversión') || res.includes('Inversion') || res.includes('Bienes')) {
    return 'Trading, Inversión & Finanzas';
  }
  if (res.includes('IA') || res.includes('Inteligencia Artificial') || res.includes('Agentes')) {
    return 'IA & Agentes Autónomos';
  }
  if (res.includes('Diseño') || res.includes('Diseno') || res.includes('Audiovisual') || res.includes('3D') || res.includes('Fotografía') || res.includes('Retoque')) {
    return 'Diseño, Audiovisual & 3D';
  }
  if (res.includes('Ciberseguridad') || res.includes('Hacking')) {
    return 'Ciberseguridad & Hacking Ético';
  }
  if (res.includes('Ecommerce') || res.includes('E-Commerce') || res.includes('Amazon')) {
    return 'E-Commerce & Amazon FBA';
  }
  if (res.includes('Música') || res.includes('Musica') || res.includes('Sonora') || res.includes('Sonido')) {
    return 'Música & Producción Sonora';
  }

  return res;
}

// 1. Process existing catalog courses
console.log('Processing existing catalog...');
const cleanedCatalog = [];
const existingTitles = new Map();

for (const c of existingCatalog) {
  // Discard document and spreadsheet non-courses
  if (c.title.endsWith('.docx') || c.title.endsWith('.gdoc') || c.title.endsWith('.xlsx') || c.title.endsWith('.gsheet')) {
    continue;
  }
  // Discard container folder courses from Mi unidad that we unpack
  if (c.localPath && (
    c.localPath.endsWith('001-CURSOS/00-IA-CURSOS') ||
    c.localPath.endsWith('001-CURSOS/01-Mente, comunicación ') ||
    c.localPath.endsWith('001-CURSOS/Creatividad') ||
    c.localPath.endsWith('001-CURSOS/Marketing') ||
    c.localPath.endsWith('001-CURSOS/Trading') ||
    c.localPath.endsWith('CURSOS???') ||
    c.localPath.endsWith('Cursos Ventas')
  )) {
    continue;
  }

  const cleanT = cleanTitle(c.title);
  const platform = detectPlatform(cleanT, c.originName, c.localPath);
  const author = detectAuthor(cleanT, c.author, c.originName);
  const category = refineCategory(cleanT, c.category, platform, c.originName);
  
  // Format drive search link with clean title for instant 1-click opening
  const driveWebSearchUrl = `https://drive.google.com/drive/u/0/search?q=${safeEncode(cleanT)}`;

  const updatedCourse = {
    ...c,
    title: cleanT,
    platform,
    author,
    category,
    webUrl: (c.webUrl && !c.webUrl.includes('shared-drives')) ? c.webUrl : driveWebSearchUrl,
  };

  const key = normalizeKey(cleanT);
  existingTitles.set(key, updatedCourse);
  cleanedCatalog.push(updatedCourse);
}

console.log(`Cleaned existing courses: ${cleanedCatalog.length}`);

// 2. Scan and unpack "Mi unidad" real courses
console.log('Scanning Mi unidad courses...');
const miUnidadSubfolders = [
  { folder: '001-CURSOS/00-IA-CURSOS', category: 'IA & Agentes Autónomos' },
  { folder: '001-CURSOS/01-Mente, comunicación ', category: 'Desarrollo Personal, Mente & Productividad' },
  { folder: '001-CURSOS/Creatividad', category: 'Diseño, Audiovisual & 3D' },
  { folder: 'CURSOS???', category: 'Negocios, Estrategia & Emprendimiento' },
  { folder: 'Cursos Ventas', category: 'E-Commerce & Amazon FBA' },
  { folder: 'N8N-Tutoriales', category: 'IA & Agentes Autónomos' },
];

let addedMiUnidadCount = 0;

for (const entry of miUnidadSubfolders) {
  const p = path.join(MI_UNIDAD_DIR, entry.folder);
  try {
    if (!fs.existsSync(p)) continue;
    const items = fs.readdirSync(p, { withFileTypes: true });
    for (const item of items) {
      if (item.name.startsWith('.') || item.name.endsWith('.docx') || item.name.endsWith('.gdoc') || item.name.endsWith('.xlsx')) continue;
      
      const courseTitle = cleanTitle(item.name);
      if (!courseTitle || courseTitle.length < 3) continue;

      const key = normalizeKey(courseTitle);
      const platform = detectPlatform(courseTitle, 'Mi Unidad', entry.folder);
      const author = detectAuthor(courseTitle, 'Especialista de la Industria');
      const category = refineCategory(courseTitle, entry.category, platform);
      const fullPath = path.join(p, item.name);

      if (existingTitles.has(key)) {
        const existing = existingTitles.get(key);
        existing.originType = 'DRIVE_MI_UNIDAD';
        existing.originName = 'Google Drive • Mi Unidad';
        existing.localPath = fullPath;
        existing.hasLocalFiles = true;
        existing.category = category;
        existing.platform = platform;
        continue;
      }

      const newId = `course-mi-unidad-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      const newCourse = {
        id: newId,
        slug: courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        title: courseTitle,
        author,
        category,
        platform,
        niche: category,
        utility: 'Formación especializada directa en Google Drive.',
        targetAudience: 'Profesionales, desarrolladores y emprendedores.',
        difficulty: 'Todos los niveles',
        estimatedHours: '8-15 hrs',
        originType: 'DRIVE_MI_UNIDAD',
        originName: 'Google Drive • Mi Unidad',
        localPath: fullPath,
        drivePath: fullPath,
        webUrl: `https://drive.google.com/drive/u/0/search?q=${safeEncode(courseTitle)}`,
        rating: 4.9,
        totalLessons: 12,
        tags: [platform, category, 'Mi Unidad', 'Google Drive'],
        hasLocalFiles: true,
        modules: []
      };

      existingTitles.set(key, newCourse);
      cleanedCatalog.push(newCourse);
      addedMiUnidadCount++;
    }
  } catch(e) {
    console.warn(`Error scanning ${entry.folder}:`, e.message);
  }
}

// 2b. Add specific Trading & Marketing courses verified via Google Drive API
const specificApiCourses = [
  {
    title: 'Sugar Trader 2025 - Nufal Bakkali',
    author: 'Nufal Bakkali',
    category: 'Trading, Inversión & Finanzas',
    platform: 'Google Drive • Mi Unidad',
    driveId: '190Djd1MnPDAN4IuJc6Wb92um62gZ1CTi',
    webUrl: 'https://drive.google.com/drive/folders/190Djd1MnPDAN4IuJc6Wb92um62gZ1CTi',
    folder: '001-CURSOS/Trading'
  },
  {
    title: 'Joel Montes - Master Scalping 10x',
    author: 'Joel Montes',
    category: 'Trading, Inversión & Finanzas',
    platform: 'Google Drive • Mi Unidad',
    driveId: '1PV2RcHD-gjibz4vmpAGLD67dgwuzRUAo',
    webUrl: 'https://drive.google.com/drive/folders/1PV2RcHD-gjibz4vmpAGLD67dgwuzRUAo',
    folder: '001-CURSOS/Trading'
  },
  {
    title: 'Método Wyckoff  Precio y Volumen',
    author: 'Rubén Villahermosa',
    category: 'Trading, Inversión & Finanzas',
    platform: 'Google Drive • Mi Unidad',
    driveId: '1m-seYcp6kHfGrCWhQby_xDtlqIo0KnFJ',
    webUrl: 'https://drive.google.com/drive/folders/1m-seYcp6kHfGrCWhQby_xDtlqIo0KnFJ',
    folder: '001-CURSOS/Trading'
  },
  {
    title: 'Ninjatrader 2025 - crea estrategias automatizadas desde cero',
    author: 'Especialista en Algoritmos',
    category: 'Trading, Inversión & Finanzas',
    platform: 'Google Drive • Mi Unidad',
    driveId: '1H9zDnUPQIDhtEGcf5O6ADh2ypBsfqYSp',
    webUrl: 'https://drive.google.com/drive/folders/1H9zDnUPQIDhtEGcf5O6ADh2ypBsfqYSp',
    folder: '001-CURSOS/Trading'
  },
  {
    title: 'Trading Algorítmico -crea tus propios bots sin programación',
    author: 'Especialista en Bots',
    category: 'Trading, Inversión & Finanzas',
    platform: 'Google Drive • Mi Unidad',
    driveId: '1Uq6wfWVrFueMuY28JaDGxR2xL64GjJRc',
    webUrl: 'https://drive.google.com/drive/folders/1Uq6wfWVrFueMuY28JaDGxR2xL64GjJRc',
    folder: '001-CURSOS/Trading'
  },
  {
    title: 'Máster en Marca Personal 5.0 - Victor Heras',
    author: 'Víctor Heras',
    category: 'Marketing, Tráfico & SEO',
    platform: 'Google Drive • Mi Unidad',
    driveId: '1j1mbT0kQg3xcQvkoQwU4d5FkHSwAMFCj',
    webUrl: 'https://drive.google.com/file/d/1j1mbT0kQg3xcQvkoQwU4d5FkHSwAMFCj/view?usp=drivesdk',
    folder: '001-CURSOS/Marketing'
  }
];

for (const sc of specificApiCourses) {
  const key = normalizeKey(sc.title);
  const fullPath = path.join(MI_UNIDAD_DIR, sc.folder, sc.title);
  if (existingTitles.has(key)) {
    const existing = existingTitles.get(key);
    existing.webUrl = sc.webUrl;
    existing.originType = 'DRIVE_MI_UNIDAD';
    existing.originName = 'Google Drive • Mi Unidad';
    existing.localPath = fullPath;
    existing.author = sc.author;
    existing.platform = sc.platform;
    existing.category = sc.category;
  } else {
    const newCourse = {
      id: `course-api-${sc.driveId}`,
      slug: sc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      title: cleanTitle(sc.title),
      author: sc.author,
      category: sc.category,
      platform: sc.platform,
      niche: sc.category,
      utility: 'Formación especializada con acceso directo a Google Drive.',
      targetAudience: 'Inversores, traders y profesionales.',
      difficulty: 'Intermedio - Avanzado',
      estimatedHours: '15 hrs',
      originType: 'DRIVE_MI_UNIDAD',
      originName: 'Google Drive • Mi Unidad',
      localPath: fullPath,
      drivePath: fullPath,
      webUrl: sc.webUrl,
      rating: 5.0,
      totalLessons: 24,
      tags: [sc.platform, sc.category, 'Mi Unidad', 'Google Drive Cloud'],
      hasLocalFiles: true,
      modules: []
    };
    existingTitles.set(key, newCourse);
    cleanedCatalog.push(newCourse);
    addedMiUnidadCount++;
  }
}

console.log(`Mi unidad complete. Total added: ${addedMiUnidadCount}`);

// 3. Scan and enrich from .shortcut-targets-by-id (158 shared shortcut courses)
console.log('Scanning .shortcut-targets-by-id (Direct Cloud Shortcuts)...');
let addedShortcutCount = 0;
let updatedShortcutCount = 0;

try {
  const shortcutDirs = fs.readdirSync(SHORTCUTS_DIR, { withFileTypes: true });
  for (const sDir of shortcutDirs) {
    if (!sDir.isDirectory()) continue;
    const targetId = sDir.name;
    const targetPath = path.join(SHORTCUTS_DIR, targetId);
    
    try {
      const children = fs.readdirSync(targetPath, { withFileTypes: true });
      for (const child of children) {
        if (child.name.startsWith('.')) continue;
        const rawName = child.name;
        const courseTitle = cleanTitle(rawName);
        if (!courseTitle || courseTitle.length < 3) continue;

        const key = normalizeKey(courseTitle);
        const directDriveUrl = `https://drive.google.com/drive/folders/${targetId}`;
        const platform = detectPlatform(courseTitle, 'Google Drive Atajos', rawName);
        const author = detectAuthor(courseTitle, 'Especialista de la Industria');
        const category = refineCategory(courseTitle, 'Negocios, Estrategia & Emprendimiento', platform);
        const fullPath = path.join(targetPath, rawName);

        if (existingTitles.has(key)) {
          // Update existing with direct drive folder link!
          const existing = existingTitles.get(key);
          existing.webUrl = directDriveUrl;
          existing.originType = 'DRIVE_SHORTCUT';
          existing.originName = 'Google Drive • Atajos Cloud';
          existing.localPath = fullPath;
          existing.platform = platform;
          existing.author = author !== 'Especialista de la Industria' ? author : existing.author;
          existing.category = category;
          updatedShortcutCount++;
        } else {
          // Add new shortcut course
          const newCourse = {
            id: `course-sc-${targetId}`,
            slug: courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            title: courseTitle,
            author,
            category,
            platform,
            niche: category,
            utility: 'Curso completo con enlace directo a carpeta de Google Drive.',
            targetAudience: 'Estudiantes, profesionales y creadores.',
            difficulty: 'Intermedio',
            estimatedHours: '10-20 hrs',
            originType: 'DRIVE_SHORTCUT',
            originName: 'Google Drive • Atajos Cloud',
            localPath: fullPath,
            drivePath: fullPath,
            webUrl: directDriveUrl,
            rating: 5.0,
            totalLessons: 15,
            tags: [platform, category, 'Atajo Directo', 'Google Drive Cloud'],
            hasLocalFiles: true,
            modules: []
          };
          existingTitles.set(key, newCourse);
          cleanedCatalog.push(newCourse);
          addedShortcutCount++;
        }
      }
    } catch(e) {}
  }
} catch(e) {
  console.warn('Error reading shortcut-targets-by-id:', e.message);
}

console.log(`Shortcuts: ${addedShortcutCount} new courses added, ${updatedShortcutCount} enriched with direct 1-click Drive links.`);
console.log(`Final total catalog courses: ${cleanedCatalog.length}`);

// Sort catalog: First local & Mi Unidad & Shortcuts, then by rating and title
cleanedCatalog.sort((a, b) => {
  const priority = { DRIVE_MI_UNIDAD: 4, DRIVE_SHORTCUT: 3, LOCAL_SSD: 2, TELEGRAM_TPC: 1, DRIVE_COMPARTIDA: 0 };
  const pA = priority[a.originType] || 0;
  const pB = priority[b.originType] || 0;
  if (pA !== pB) return pB - pA;
  return a.title.localeCompare(b.title, 'es');
});

// Write to public/courses_catalog.json
fs.writeFileSync(CATALOG_PATH, JSON.stringify(cleanedCatalog, null, 2), 'utf8');
console.log('✅ Catalog successfully updated and saved to public/courses_catalog.json');
