// ponytail: native <dialog id="sheet"> Bottom Sheet component animated via GPU translate3d

import { RECIPES } from '../data.js';

let lastSheetTrigger = null;

export function ensureBottomSheetDOM() {
  if (typeof document === 'undefined') return null;
  let sheet = document.getElementById('sheet');
  if (!sheet) {
    sheet = document.createElement('dialog');
    sheet.id = 'sheet';
    sheet.className = 'bottom-sheet-dialog glass-panel';
    sheet.setAttribute('aria-labelledby', 'sheet-recipe-title');
    sheet.innerHTML = '<div id="sheet-content" class="dialog-inner"></div>';
    document.body.appendChild(sheet);
  }
  return sheet;
}

export function openBottomSheet(recipeId, triggerEl = null) {
  const rec = RECIPES.find((r) => r.id === recipeId);
  const sheet = ensureBottomSheetDOM();
  if (!rec || !sheet) return;

  const content = sheet.querySelector('#sheet-content') || sheet.querySelector('#recipe-dialog-content') || sheet;
  lastSheetTrigger = triggerEl;

  content.innerHTML = `
    <div class="sheet-handle" aria-hidden="true"></div>
    <div class="dialog-header">
      <div>
        <span class="tag-pill">${rec.categoryLabel}</span>
        <span class="heat-pill heat-${rec.picor}">${rec.heatLabel}</span>
        <h2 id="sheet-recipe-title" class="dialog-title">${rec.nombre}</h2>
      </div>
      <button type="button" class="btn-icon-close" id="btn-close-sheet" aria-label="Cerrar panel inferior">
        ✕
      </button>
    </div>
    <div class="dialog-meta-bar">
      <span><strong>Tiempo:</strong> ${rec.timeMinutes} min (${rec.tiempo})</span>
      <span><strong>Porciones:</strong> ${rec.servings} personas</span>
      <span><strong>Información nutricional:</strong> ${rec.calories} · Sin conservadores</span>
    </div>
    <div class="dialog-columns">
      <div class="dialog-col">
        <h3>Ingredientes Locales (Calimax BC)</h3>
        <ul class="dialog-list">
          ${rec.ingredientes_locales.map((i) => `<li>${i}</li>`).join('')}
        </ul>
      </div>
      <div class="dialog-col">
        <h3>Preparación paso a paso</h3>
        <ol class="dialog-steps">
          ${rec.steps.map((s) => `<li>${s}</li>`).join('')}
        </ol>
      </div>
    </div>
    <div class="dialog-footer-actions">
      <a
        href="${rec.deep_link_whatsapp}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-whatsapp-calimax is-bc-active"
        data-recipe-id="${rec.id}"
        data-recipe-name="${rec.nombre}"
      >
        Pedir por Whats (Envío Gratis) — Calimax Tijuana
      </a>
    </div>
  `;

  if (typeof sheet.showModal === 'function') {
    if (!sheet.open) sheet.showModal();
  } else {
    sheet.setAttribute('open', '');
  }

  const closeBtn = document.getElementById('btn-close-sheet');
  if (closeBtn) {
    closeBtn.focus();
    closeBtn.addEventListener('click', () => sheet.close(), { once: true });
  }
}

export function initBottomSheet() {
  if (typeof document === 'undefined') return;
  const sheet = ensureBottomSheetDOM();
  if (!sheet || sheet.dataset.bound === 'true') return;
  sheet.dataset.bound = 'true';

  sheet.addEventListener('close', () => {
    if (lastSheetTrigger && typeof lastSheetTrigger.focus === 'function') {
      lastSheetTrigger.focus();
    }
  });

  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) sheet.close();
  });
}
