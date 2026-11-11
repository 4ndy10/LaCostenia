import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PRODUCTS, RECIPES, filterRecipes } from '../js/data.js';

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/styles.css'), 'utf8');
const appJs = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');

// FASE 1: Maquetado Estructural Vanilla HTML5/CSS3 y Presupuesto de Rendimiento
assert.match(html, /<header\b/i, 'Falta <header> semántico');
assert.match(html, /<nav\b/i, 'Falta <nav> semántico');
assert.match(html, /<main\b/i, 'Falta <main> semántico');
assert.match(html, /<footer\b/i, 'Falta <footer> semántico');
assert.match(appJs, /largest-contentful-paint/, 'Falta monitoreo de presupuesto LCP');
assert.match(appJs, /layout-shift/, 'Falta monitoreo de presupuesto CLS');

// FASE 2: Formatos .webp y .avif, fetchpriority="high" en Hero, y loading="lazy" en catálogo
assert.match(html, /fetchpriority="high"/, 'El Hero debe priorizar carga con fetchpriority="high"');
assert.match(appJs, /loading="lazy"/, 'El catálogo y recetas deben usar loading="lazy" nativo');
for (const item of [...PRODUCTS, ...RECIPES]) {
  assert.ok(fs.existsSync(path.join(root, `${item.image}.avif`)), `Falta activo AVIF: ${item.image}.avif`);
  assert.ok(fs.existsSync(path.join(root, `${item.image}.webp`)), `Falta activo WebP: ${item.image}.webp`);
}
assert.ok(fs.existsSync(path.join(root, 'assets/img/hero-banner.avif')), 'Falta hero-banner.avif');
assert.ok(fs.existsSync(path.join(root, 'assets/img/hero-banner.webp')), 'Falta hero-banner.webp');

// FASE 3: Lógica Modular ES Modules (filtrado matricial) y Micro-interacciones por GPU
assert.equal(filterRecipes(RECIPES, { category: 'all', heat: 'all', time: 'all' }).length, 6);
assert.equal(filterRecipes(RECIPES, { category: 'chiles', heat: 'alto', time: 'tradicional' }).length, 1);
assert.equal(filterRecipes(RECIPES, { category: 'chiles', heat: 'alto', time: 'tradicional' })[0].id, 'rec-tinga');
assert.equal(filterRecipes(RECIPES, { category: 'vegetales', heat: 'medio', time: 'express' })[0].id, 'rec-esquites');
assert.equal(filterRecipes(RECIPES, { query: 'Cotija' }).length, 2);
assert.match(css, /translate3d\(/, 'Las micro-interacciones deben usar aceleración GPU translate3d');
assert.match(css, /transition:\s*transform/, 'Las transiciones deben animar transform/opacity');

// FASE 4: WCAG 2.2 (aria-expanded, aria-live, focus-visible), prefers-reduced-motion y AEO JSON-LD
assert.match(html, /aria-expanded="/, 'Falta atributo dinámico aria-expanded');
assert.match(html, /aria-live="polite"/, 'Falta región aria-live para filtros asíncronos');
assert.match(css, /:focus-visible/, 'Faltan anillos de foco de alto contraste :focus-visible');
assert.match(css, /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/, 'Falta soporte @media (prefers-reduced-motion: reduce)');

const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(jsonLdMatch, 'Falta bloque JSON-LD en index.html');
const schema = JSON.parse(jsonLdMatch[1]);
const types = schema['@graph'].map((node) => node['@type']);
assert.ok(types.includes('Product'), 'JSON-LD debe incluir Product Schema');
assert.ok(types.includes('Recipe'), 'JSON-LD debe incluir Recipe Schema');

console.log('OK: Todas las verificaciones de las Fases 1, 2, 3 y 4 pasaron exitosamente.');
