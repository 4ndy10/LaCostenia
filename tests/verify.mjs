import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PRODUCTS, RECIPES, FEATURED_RECIPES, filterRecipes } from '../js/data.js';
import {
  CALIMAX_WHATSAPP_NUMBER,
  isWithinBajaCalifornia,
  buildCalimaxWhatsAppUrl
} from '../js/modules/omnichannel.js';
import {
  DEFAULT_AUTH_STATUS,
  readSessionState,
  purgeEphemeralSession
} from '../js/modules/auth-state.js';
import { buildGranularJsonLd } from '../js/modules/router.js';

const root = process.cwd();
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const recetasHtml = fs.readFileSync(path.join(root, 'recetas.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/styles.css'), 'utf8');
const appJs = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const routerJs = fs.readFileSync(path.join(root, 'js/modules/router.js'), 'utf8');
const matrixFilterJs = fs.readFileSync(path.join(root, 'js/modules/matrix-filter.js'), 'utf8');
const omnichannelJs = fs.readFileSync(path.join(root, 'js/modules/omnichannel.js'), 'utf8');
const authStateJs = fs.readFileSync(path.join(root, 'js/modules/auth-state.js'), 'utf8');
const swJs = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const siteHeaderJs = fs.readFileSync(path.join(root, 'js/components/site-header.js'), 'utf8');
const siteFooterJs = fs.readFileSync(path.join(root, 'js/components/site-footer.js'), 'utf8');
const waCartWidgetJs = fs.readFileSync(path.join(root, 'js/components/whatsapp-cart-widget.js'), 'utf8');

// 1. WEB COMPONENTS REUTILIZABLES CON SHADOW DOM
assert.match(siteHeaderJs, /attachShadow\(\{\s*mode:\s*'open'\s*\}\)/, '<site-header> debe usar Shadow DOM');
assert.match(siteFooterJs, /attachShadow\(\{\s*mode:\s*'open'\s*\}\)/, '<site-footer> debe usar Shadow DOM');
assert.match(waCartWidgetJs, /attachShadow\(\{\s*mode:\s*'open'\s*\}\)/, '<whatsapp-cart-widget> debe usar Shadow DOM');

for (const doc of [indexHtml, recetasHtml]) {
  assert.match(doc, /<site-header\b/i, 'Falta <site-header> en documento HTML');
  assert.match(doc, /<site-footer\b/i, 'Falta <site-footer> en documento HTML');
  assert.match(doc, /<whatsapp-cart-widget\b/i, 'Falta <whatsapp-cart-widget> en documento HTML');
  assert.match(doc, /<aside\s+id="ai-chatbot"/i, 'Falta <aside id="ai-chatbot">');
  assert.match(doc, /<a\s+href="#main-content"\s+class="skip-link">/i, 'Falta skip-link de accesibilidad');
  assert.doesNotMatch(doc, />Recetario Completo<\/a>/i, 'Enlace huérfano "Recetario Completo" no debe existir');
  assert.doesNotMatch(doc, />Volver al inicio<\/a>/i, 'Enlace huérfano "Volver al inicio" no debe existir');
}
assert.match(css, /\.skip-link\s*\{[\s\S]*?clip:\s*rect\(0,\s*0,\s*0,\s*0\)/, 'Falta ocultamiento accesible clip: rect(0, 0, 0, 0) en .skip-link');
assert.match(css, /\.skip-link:focus[\s\S]*?position:\s*static/, 'Falta regla .skip-link:focus con position: static');

// 2. PÁGINA PRINCIPAL (index.html) Y CARRUSEL CSS SCROLL-SNAP
assert.doesNotMatch(indexHtml, /id="recipe-matrix-controls"/, 'index.html no debe alojar la matriz de filtrado');
assert.match(indexHtml, /id="sensory-carousel-track"/, 'Falta carrusel sensorial en index.html');
assert.match(indexHtml, /<a\s+href="recetas\.html"\s+class="btn[^"]*btn-primary"[^>]*fetchpriority="high"[^>]*>Ver recetario completo<\/a>/i, 'Falta CTA principal hacia recetas.html con fetchpriority="high"');
assert.match(css, /scroll-snap-type:\s*x\s+mandatory/, 'El carrusel debe usar scroll-snap-type: x mandatory');
assert.match(css, /overscroll-behavior-x:\s*contain/, 'El carrusel debe usar overscroll-behavior-x: contain');
assert.equal(FEATURED_RECIPES.length, 3, 'El carrusel sensorial debe exhibir exactamente 3 recetas insignia');

// 3. PÁGINA ANIDADA (recetas.html) Y CONTENEDOR #recipe-grid-full
assert.match(recetasHtml, /id="recipe-matrix-controls"/, 'recetas.html debe alojar los controles de la matriz');
assert.match(recetasHtml, /id="recipe-grid-full"/, 'recetas.html debe incluir el contenedor #recipe-grid-full');
assert.match(matrixFilterJs, /createDocumentFragment\(\)/, 'matrix-filter.js debe renderizar con DocumentFragment');

// 4. REPOSITORIO DE DATOS ESCALADO (12+ RECETAS CON INGREDIENTES LOCALES Y DEEP LINK WHATSAPP)
assert.ok(RECIPES.length >= 12, `Debe haber al menos 12 recetas completas (actual: ${RECIPES.length})`);
for (const rec of RECIPES) {
  assert.ok(rec.id, 'Falta id');
  assert.ok(rec.nombre, `Falta nombre en ${rec.id}`);
  assert.ok(Array.isArray(rec.ingredientes_locales) && rec.ingredientes_locales.length > 0, `Falta ingredientes_locales en ${rec.id}`);
  assert.ok(['express', 'tradicional'].includes(rec.tiempo), `Tiempo inválido en ${rec.id}`);
  assert.ok(['suave', 'medio', 'alto'].includes(rec.picor), `Picor inválido en ${rec.id}`);
  assert.match(rec.deep_link_whatsapp, /^https:\/\/wa\.me\/8002254629\?text=/, `deep_link_whatsapp inválido en ${rec.id}`);
  assert.ok(fs.existsSync(path.join(root, `${rec.image}.avif`)), `Falta activo AVIF: ${rec.image}.avif`);
  assert.ok(fs.existsSync(path.join(root, `${rec.image}.webp`)), `Falta activo WebP: ${rec.image}.webp`);
}

for (const prod of PRODUCTS) {
  assert.ok(fs.existsSync(path.join(root, `${prod.image}.avif`)), `Falta activo AVIF: ${prod.image}.avif`);
  assert.ok(fs.existsSync(path.join(root, `${prod.image}.webp`)), `Falta activo WebP: ${prod.image}.webp`);
}

// 4.5. POBLACIÓN DE ACTIVOS FOTORREALISTAS (0 JPG/PNG, SEMÁNTICA .WEBP/.AVIF, <picture> EN DOM)
const imgFiles = fs.readdirSync(path.join(root, 'assets/img'));
const forbiddenImgs = imgFiles.filter((f) => /\.(jpe?g|png)$/i.test(f));
assert.equal(forbiddenImgs.length, 0, `Prohibido guardar .jpg/.png en assets/img: ${forbiddenImgs.join(', ')}`);

const requiredSemanticBases = [
  'campo-agricola-mexicano',
  'ingrediente-jalapeno',
  'ingrediente-chipotle',
  'ingrediente-tomatillo',
  'ingrediente-cebolla-cilantro',
  'receta-chilaquiles-verdes',
  'receta-tinga-pollo',
  'receta-esquites',
  'receta-croquetas-platano'
];
for (const base of requiredSemanticBases) {
  assert.ok(imgFiles.includes(`${base}.avif`), `Falta ${base}.avif en assets/img/`);
  assert.ok(imgFiles.includes(`${base}.webp`), `Falta ${base}.webp en assets/img/`);
}

assert.match(indexHtml, /<picture\b[\s\S]*?assets\/img\/campo-agricola-mexicano\.avif[\s\S]*?fetchpriority="high"/i, 'Hero banner debe usar <picture> con .avif/.webp y fetchpriority="high"');
assert.match(indexHtml, /<picture\b[\s\S]*?assets\/img\/receta-tinga-pollo\.avif[\s\S]*?loading="lazy"[\s\S]*?decoding="async"/i, 'index.html debe inyectar <picture> con loading="lazy" y decoding="async"');
assert.match(recetasHtml, /<picture\b[\s\S]*?assets\/img\/receta-croquetas-platano\.avif[\s\S]*?loading="lazy"[\s\S]*?decoding="async"/i, 'recetas.html debe inyectar <picture> con loading="lazy" y decoding="async"');

// 5. ENRUTADOR NATIVO Y AEO JSON-LD GRANULAR (3 EN INDEX VS 12 EN RECETAS)
assert.match(appJs, /const\s+isRecipePage\s*=\s*window\.location\.pathname\.includes\('recetas'\)/, 'Falta detección de ruta recetas en app.js');
assert.match(appJs, /if\s*\(isRecipePage\)\s*\{\s*import\('\.\/modules\/matrix-filter\.js'\);?\s*\}/, 'Falta import dinámico de matrix-filter.js en app.js');
assert.match(routerJs, /window\.location\.pathname\.includes\('recetas'\)/, 'Falta detección de ruta en router.js');

const indexLd = buildGranularJsonLd(false);
const recetasLd = buildGranularJsonLd(true);
const indexRecipeNodes = indexLd['@graph'].filter((n) => n['@type'] === 'Recipe');
const recetasRecipeNodes = recetasLd['@graph'].filter((n) => n['@type'] === 'Recipe');
assert.equal(indexRecipeNodes.length, 3, 'JSON-LD en index.html debe inyectar 3 recetas principales');
assert.equal(recetasRecipeNodes.length, 12, 'JSON-LD en recetas.html debe inyectar las 12 recetas completas');

// 6. FILTRADO MATRICIAL, OMNICANALIDAD, SESIÓN EFÍMERA Y SERVICE WORKER
assert.equal(filterRecipes(RECIPES, { category: 'all', heat: 'all', time: 'all' }).length, 12);
assert.equal(filterRecipes(RECIPES, { category: 'chiles', heat: 'alto', time: 'tradicional' }).length, 2);
assert.equal(isWithinBajaCalifornia(32.5149, -117.0382), true, 'Tijuana debe detectarse en Baja California');
assert.equal(CALIMAX_WHATSAPP_NUMBER, '8002254629');
assert.match(buildCalimaxWhatsAppUrl(RECIPES[0]), /^https:\/\/wa\.me\/8002254629\?text=/);
assert.match(omnichannelJs, /navigator\.geolocation/);
assert.match(omnichannelJs, /new CustomEvent\(/);
assert.equal(DEFAULT_AUTH_STATUS, 'Usuario no registrado');
assert.equal(readSessionState().status, 'Usuario no registrado');
assert.match(authStateJs, /sessionStorage/);
assert.doesNotMatch(authStateJs, /localStorage/);
assert.match(authStateJs, /beforeunload/);
purgeEphemeralSession();
assert.match(css, /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{\s*\*\s*\{\s*transition:\s*none\s*!important;\s*\}/);
assert.match(swJs, /recetas\.html/, 'Service Worker debe cachear recetas.html');

// 7. V4 DESIGN SYSTEM, COMPONENTES TRANSACCIONALES, HAPTIC FEEDBACK, SPATIAL LIGHTING Y MICRO-COPY
const variablesCss = fs.readFileSync(path.join(root, 'css/variables.css'), 'utf8');
const mobileNavJs = fs.readFileSync(path.join(root, 'js/components/mobile-nav.js'), 'utf8');
const bottomSheetJs = fs.readFileSync(path.join(root, 'js/components/bottom-sheet.js'), 'utf8');
const interactionsJs = fs.readFileSync(path.join(root, 'js/modules/interactions.js'), 'utf8');
const spatialLightingJs = fs.readFileSync(path.join(root, 'js/modules/spatial-lighting.js'), 'utf8');

assert.match(variablesCss, /--primary:\s*#C8102E/i, 'Falta --primary: #C8102E en variables.css');
assert.match(variablesCss, /--surface:\s*#FDFBF7/i, 'Falta --surface: #FDFBF7 en variables.css');
assert.match(variablesCss, /--text:\s*#1C1C1C/i, 'Falta --text: #1C1C1C en variables.css');
assert.match(variablesCss, /@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)[\s\S]*?--surface:\s*#1E1E1E[\s\S]*?--text:\s*#EAEAEA/i, 'Falta modo oscuro automático en variables.css');
assert.match(css, /\.glass-panel\s*\{[\s\S]*?backdrop-filter:\s*blur\(12px\)/i, 'Falta .glass-panel con backdrop-filter: blur(12px)');

assert.match(mobileNavJs, /customElements\.define\('bottom-nav'/, 'Falta registro de <bottom-nav>');
assert.match(mobileNavJs, /customElements\.define\('whatsapp-fab'/, 'Falta registro de <whatsapp-fab>');
assert.match(bottomSheetJs, /sheet/, 'Falta soporte para <dialog id="sheet"> en bottom-sheet.js');
assert.match(indexHtml, /<dialog\s+id="sheet"/i, 'Falta <dialog id="sheet"> en index.html');
assert.match(recetasHtml, /<dialog\s+id="sheet"/i, 'Falta <dialog id="sheet"> en recetas.html');

assert.match(interactionsJs, /scale\(0\.98\)/, 'Falta escala negativa scale(0.98) en interactions.js');
assert.match(css, /@keyframes\s+shimmer/, 'Falta @keyframes shimmer en styles.css');

assert.match(spatialLightingJs, /DirectionalLight/, 'Falta DirectionalLight en spatial-lighting.js');
assert.match(spatialLightingJs, /mousemove/, 'Falta listener mousemove en spatial-lighting.js');
assert.match(spatialLightingJs, /DeviceOrientationEvent/, 'Falta integración DeviceOrientationEvent en spatial-lighting.js');
assert.match(spatialLightingJs, /requestAnimationFrame/, 'Falta requestAnimationFrame en spatial-lighting.js');
assert.match(spatialLightingJs, /IntersectionObserver/, 'Falta IntersectionObserver en spatial-lighting.js');

assert.match(recetasHtml, /placeholder="Busca por ingrediente\.\.\. ej\. chipotle, elotitos, salsa verde"/, 'Falta micro-copy de buscador en recetas.html');
assert.match(indexHtml, /Pedir por Whats \(Envío Gratis\)/, 'Falta micro-copy de botón FAB en index.html');
assert.match(recetasHtml, /Preparar para la carnita asada/, 'Falta micro-copy de CTA Recetas en recetas.html');

console.log('OK: Todas las verificaciones de La Costeña v4.0 UI/UX Pro Design System pasaron exitosamente.');
