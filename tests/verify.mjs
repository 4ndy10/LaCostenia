import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PRODUCTS, RECIPES, filterRecipes } from '../js/data.js';
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

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/styles.css'), 'utf8');
const appJs = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const omnichannelJs = fs.readFileSync(path.join(root, 'js/modules/omnichannel.js'), 'utf8');
const authStateJs = fs.readFileSync(path.join(root, 'js/modules/auth-state.js'), 'utf8');
const swJs = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

// FASE 1: Maquetado Estructural Vanilla HTML5/CSS3 y Presupuesto de Rendimiento
assert.match(html, /<header\b/i, 'Falta <header> semántico');
assert.match(html, /<nav\b/i, 'Falta <nav> semántico');
assert.match(html, /<main\b/i, 'Falta <main> semántico');
assert.match(html, /<footer\b/i, 'Falta <footer> semántico');
assert.match(html, /<aside\s+id="ai-chatbot"/i, 'Falta contenedor flotante <aside id="ai-chatbot">');
assert.match(appJs, /largest-contentful-paint/, 'Falta monitoreo de presupuesto LCP');
assert.match(appJs, /layout-shift/, 'Falta monitoreo de presupuesto CLS');

// FASE 2: Formatos .webp y .avif, fetchpriority="high" en Hero, y loading="lazy" en catálogo
assert.match(html, /fetchpriority="high"/, 'El Hero debe priorizar carga con fetchpriority="high"');
assert.match(appJs, /loading="lazy"/, 'El catálogo y recetas deben usar loading="lazy" nativo');
assert.ok(RECIPES.length >= 6, 'Debe haber al menos 6 recetas detalladas');
for (const rec of RECIPES) {
  assert.ok(rec.id && rec.nombre && rec.categoria && rec.picor && rec.tiempo && Array.isArray(rec.ingredientes) && rec.imagen, `Receta incompleta: ${rec.id}`);
}
for (const item of [...PRODUCTS, ...RECIPES]) {
  assert.ok(fs.existsSync(path.join(root, `${item.image}.avif`)), `Falta activo AVIF: ${item.image}.avif`);
  assert.ok(fs.existsSync(path.join(root, `${item.image}.webp`)), `Falta activo WebP: ${item.image}.webp`);
}
assert.ok(fs.existsSync(path.join(root, 'assets/img/hero-banner.avif')), 'Falta hero-banner.avif');
assert.ok(fs.existsSync(path.join(root, 'assets/img/hero-banner.webp')), 'Falta hero-banner.webp');

// FASE 3: Lógica Modular ES Modules (filtrado matricial + DocumentFragment + WhatsApp Calimax)
assert.equal(filterRecipes(RECIPES, { category: 'all', heat: 'all', time: 'all' }).length, 6);
assert.equal(filterRecipes(RECIPES, { category: 'chiles', heat: 'alto', time: 'tradicional' }).length, 1);
assert.equal(filterRecipes(RECIPES, { category: 'chiles', heat: 'alto', time: 'tradicional' })[0].id, 'rec-tinga');
assert.equal(filterRecipes(RECIPES, { category: 'vegetales', heat: 'medio', time: 'express' })[0].id, 'rec-esquites');
assert.equal(filterRecipes(RECIPES, { query: 'Cotija' }).length, 2);
assert.match(appJs, /createDocumentFragment\(\)/, 'El renderizado debe usar DocumentFragment');
assert.match(appJs, /Pedir ingredientes vía WhatsApp/, 'Falta botón transaccional de WhatsApp en tarjetas de recetas');
assert.equal(CALIMAX_WHATSAPP_NUMBER, '8002254629');
assert.match(buildCalimaxWhatsAppUrl(RECIPES[0]), /^https:\/\/wa\.me\/8002254629\?text=/, 'Deep link de WhatsApp Calimax inválido');

// FASE 4: Omnicanalidad, Geolocalización Baja California, Sesión Efímera LFPDPPP y Resiliencia Offline
assert.equal(isWithinBajaCalifornia(32.5149, -117.0382), true, 'Tijuana debe detectarse en Baja California');
assert.equal(isWithinBajaCalifornia(32.6245, -115.4523), true, 'Mexicali debe detectarse en Baja California');
assert.equal(isWithinBajaCalifornia(19.4326, -99.1332), false, 'CDMX no debe detectarse en Baja California');
assert.match(omnichannelJs, /navigator\.geolocation/, 'Falta integración con navigator.geolocation');
assert.match(omnichannelJs, /new CustomEvent\(/, 'Falta puente de telemetría CustomEvent hacia window');

assert.equal(DEFAULT_AUTH_STATUS, 'Usuario no registrado');
assert.equal(readSessionState().status, 'Usuario no registrado');
assert.match(authStateJs, /sessionStorage/, 'Debe utilizar sessionStorage');
assert.doesNotMatch(authStateJs, /localStorage/, 'No debe usar localStorage por gobernanza LFPDPPP');
assert.match(authStateJs, /beforeunload/, 'Debe purgar sessionStorage en beforeunload');
purgeEphemeralSession();

assert.match(css, /transform:\s*scale\(0\.95\)/, 'Las animaciones de filtrado deben usar transform: scale(0.95)');
assert.match(css, /opacity:\s*0/, 'Las animaciones de filtrado deben usar opacity: 0');
assert.match(css, /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{\s*\*\s*\{\s*transition:\s*none\s*!important;\s*\}/, 'Falta regla estricta prefers-reduced-motion');

assert.match(swJs, /index\.html/, 'Service Worker debe cachear index.html');
assert.match(swJs, /styles\.css/, 'Service Worker debe cachear styles.css');
assert.match(swJs, /app\.js/, 'Service Worker debe cachear app.js');
assert.match(swJs, /\.avif/, 'Service Worker debe cachear imágenes AVIF');
assert.match(swJs, /\.webp/, 'Service Worker debe cachear imágenes WebP');

const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(jsonLdMatch, 'Falta bloque JSON-LD en index.html');
const schema = JSON.parse(jsonLdMatch[1]);
const types = schema['@graph'].map((node) => node['@type']);
assert.ok(types.includes('Product'), 'JSON-LD debe incluir Product Schema');
assert.ok(types.includes('Recipe'), 'JSON-LD debe incluir Recipe Schema');

console.log('OK: Todas las verificaciones de La Costeña v2.0 Omnichannel pasaron exitosamente.');
