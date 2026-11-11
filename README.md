# La Costeña® — Portal Sensorial y Recetario Matricial

Portal web de alto rendimiento construido con **Vanilla HTML5, CSS3 y JavaScript ES Modules**, sin frameworks ni dependencias externas. Diseñado bajo presupuestos estrictos de Core Web Vitals, accesibilidad **WCAG 2.2 AA** y optimización para motores de respuesta (**AEO / JSON-LD**).

---

## Arquitectura por Fases

1. **Fase 1 — Cimentación Semántica y Presupuesto de Rendimiento**
   - Maquetado nativo en `index.html` (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`, `<dialog>`).
   - Telemetría en tiempo real con `PerformanceObserver` para auditar **LCP** ($\le 2500\text{ ms}$), **INP** ($\le 200\text{ ms}$) y **CLS** ($\le 0.10$).

2. **Fase 2 — Optimización Visual y Carga Diferida Nativa**
   - Catálogo de productos, recetas y Hero migrados a formatos `.avif` y `.webp` en `assets/img/`.
   - Priorización exclusiva del Hero con `fetchpriority="high"` y `<link rel="preload">`, y carga diferida nativa (`loading="lazy"`, `decoding="async"`) en el resto del catálogo.

3. **Fase 3 — Interactividad Modular y Micro-interacciones por GPU**
   - Filtrado matricial tridimensional (**Línea de Producto × Nivel de Picor × Tiempo en Cocina** + búsqueda por ingrediente) en `js/data.js` y `js/app.js` usando `DocumentFragment`.
   - Transiciones a 60 FPS en `css/styles.css` delegadas exclusivamente a la GPU (`transform: translate3d()`, `scale3d()`, `opacity`).

4. **Fase 4 — Accesibilidad WCAG 2.2, Neuro-inclusión y AEO**
   - Roles y estados ARIA dinámicos (`aria-expanded`, `aria-pressed`, `aria-controls`, `aria-live="polite"`) y anillos de foco `:focus-visible` de alto contraste.
   - Soporte de neuro-inclusión mediante `@media (prefers-reduced-motion: reduce)`.
   - Esquemas estructurados JSON-LD (`Organization`, `Product` y `Recipe`) incrustados en el documento base.

---

## Estructura del Proyecto

```text
.
├── assets/img/        # Activos visuales 2D en formatos .avif y .webp
├── css/styles.css     # Sistema de diseño CSS3, tokens WCAG 2.2 y animaciones GPU
├── js/data.js         # Catálogo estructurado y función pura de filtrado matricial
├── js/app.js          # Renderizado DOM directo, gestión ARIA y auditoría Web Vitals
├── tests/verify.mjs   # Suite de verificación automatizada (Node.js assert)
└── index.html         # Documento base HTML5 semántico con JSON-LD (AEO)
```

---

## Ejecución Local

Dado que el proyecto utiliza **ES Modules** (`<script type="module">`), debe servirse desde un servidor HTTP estático local:

```bash
# Opción 1: Python
python -m http.server 8080

# Opción 2: Node.js
npx serve .
```

Luego abre `http://localhost:8080` en el navegador.

---

## Verificación Automatizada

Ejecuta la prueba de integridad de las 4 fases (semántica HTML5, existencia de activos `.avif`/`.webp`, lógica de filtrado matricial, reglas GPU/WCAG y validez del JSON-LD):

```bash
node tests/verify.mjs
```
