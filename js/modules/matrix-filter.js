// ponytail: isolated matrix filter module loaded only on recetas.html via dynamic import()

import { RECIPES, filterRecipes } from '../data.js';
import { syncCalimaxButtonsDOM, emitOmnichannelEvent } from './omnichannel.js';
import { toggleFavoriteRecipe, isFavoriteRecipe } from './auth-state.js';
import { openBottomSheet, initBottomSheet } from '../components/bottom-sheet.js';

const state = {
  category: 'all',
  heat: 'all',
  time: 'all',
  query: ''
};

let lastTriggerElement = null;

function createPictureHTML(basePath, alt, width, height) {
  return `
    <picture class="media-picture">
      <source srcset="${basePath}.avif" type="image/avif">
      <source srcset="${basePath}.webp" type="image/webp">
      <img
        src="${basePath}.webp"
        alt="${alt}"
        width="${width}"
        height="${height}"
        loading="lazy"
        decoding="async"
        class="media-img"
      >
    </picture>
  `;
}

export function renderFullRecipeCatalog() {
  const grid = document.getElementById('recipe-grid-full') || document.getElementById('recipe-grid');
  const statusEl = document.getElementById('filter-status');
  const countBadge = document.getElementById('recipe-count-badge');
  if (!grid) return;

  grid.classList.add('is-filtering');

  const matched = filterRecipes(RECIPES, state);
  const frag = document.createDocumentFragment();

  if (matched.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <p class="empty-title">No encontramos recetas con esa combinación exacta de filtros.</p>
      <button type="button" class="btn btn-primary" id="btn-reset-inline">Restablecer matriz de filtros</button>
    `;
    frag.appendChild(empty);
  } else {
    for (const rec of matched) {
      const fav = isFavoriteRecipe(rec.id);
      const card = document.createElement('article');
      card.className = 'recipe-card gpu-card';
      card.innerHTML = `
        <div class="recipe-media">
          ${createPictureHTML(rec.image, `Platillo terminado: ${rec.nombre}`, 600, 400)}
          <span class="recipe-time-badge">${rec.timeMinutes} min · ${rec.servings} porciones</span>
          <button
            type="button"
            class="btn-fav-recipe"
            data-recipe-id="${rec.id}"
            aria-pressed="${fav}"
            aria-label="Guardar ${rec.nombre} en favoritos de sesión"
          >
            ${fav ? '★ Guardada' : '☆ Favorita'}
          </button>
        </div>
        <div class="recipe-body">
          <div class="recipe-tags">
            <span class="tag-pill">${rec.categoryLabel}</span>
            <span class="heat-pill heat-${rec.picor}">${rec.heatLabel}</span>
          </div>
          <h3 class="recipe-title">${rec.nombre}</h3>
          <p class="recipe-summary">${rec.summary}</p>
          <p class="recipe-ingredient-highlight">
            <strong>Ingrediente estrella:</strong> ${rec.productUsed}
          </p>
          <div class="recipe-actions">
            <a
              href="${rec.deep_link_whatsapp}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-whatsapp-calimax is-bc-active"
              data-recipe-id="${rec.id}"
              data-recipe-name="${rec.nombre}"
              data-bc-active="true"
            >
              Pedir ingredientes vía WhatsApp
            </a>
            <button
              type="button"
              class="btn btn-secondary btn-add-wa-cart"
              data-recipe-id="${rec.id}"
            >
              + Agregar al Carrito Calimax
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-open-recipe"
              data-recipe-id="${rec.id}"
              aria-haspopup="dialog"
            >
              Preparar para la carnita asada
            </button>
          </div>
        </div>
      `;
      frag.appendChild(card);
    }
  }

  grid.replaceChildren(frag);
  syncCalimaxButtonsDOM();

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => grid.classList.remove('is-filtering'));
  } else {
    grid.classList.remove('is-filtering');
  }

  if (countBadge) {
    countBadge.textContent = `${matched.length} de ${RECIPES.length} recetas`;
  }
  if (statusEl) {
    statusEl.textContent = `Mostrando ${matched.length} ${matched.length === 1 ? 'receta disponible' : 'recetas disponibles'} en el catálogo completo.`;
  }
}

export function openRecipeModal(recipeId, triggerEl) {
  const rec = RECIPES.find((r) => r.id === recipeId);
  const dialog = document.getElementById('recipe-dialog');
  const content = document.getElementById('recipe-dialog-content');
  if (!rec || !dialog || !content) return;

  lastTriggerElement = triggerEl || null;
  content.innerHTML = `
    <div class="dialog-header">
      <div>
        <span class="tag-pill">${rec.categoryLabel}</span>
        <span class="heat-pill heat-${rec.picor}">${rec.heatLabel}</span>
        <h2 id="dialog-recipe-title" class="dialog-title">${rec.nombre}</h2>
      </div>
      <button type="button" class="btn-icon-close" id="btn-close-dialog" aria-label="Cerrar ventana de receta">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="dialog-meta-bar">
      <span><strong>Tiempo total:</strong> ${rec.timeMinutes} min (${rec.tiempo})</span>
      <span><strong>Porciones:</strong> ${rec.servings} personas</span>
      <span><strong>Energía:</strong> ${rec.calories}</span>
    </div>
    <div class="dialog-columns">
      <div class="dialog-col">
        <h3>Ingredientes Locales (Tijuana / BC)</h3>
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
        Pedir ingredientes vía WhatsApp (Calimax Tijuana)
      </a>
    </div>
  `;

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }

  const closeBtn = document.getElementById('btn-close-dialog');
  if (closeBtn) {
    closeBtn.focus();
    closeBtn.addEventListener('click', () => dialog.close(), { once: true });
  }
}

export function initMatrixFilter() {
  if (typeof document === 'undefined') return;
  initBottomSheet();

  // Apply URL query parameter ?category=... if navigated from index.html product catalog
  if (typeof window !== 'undefined' && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    if (catParam) state.category = catParam;
  }

  const matrixForm = document.getElementById('recipe-matrix-controls');
  const searchInput = document.getElementById('recipe-search');
  const resetBtn = document.getElementById('btn-reset-filters');
  const filterToggleBtn = document.getElementById('btn-toggle-matrix');
  const matrixPanel = document.getElementById('matrix-panel');
  const dialog = document.getElementById('recipe-dialog');

  if (matrixForm && state.category !== 'all') {
    for (const btn of matrixForm.querySelectorAll('.filter-chip[data-axis="category"]')) {
      btn.setAttribute('aria-pressed', String(btn.dataset.value === state.category));
    }
  }

  renderFullRecipeCatalog();

  if (filterToggleBtn && matrixPanel) {
    filterToggleBtn.addEventListener('click', () => {
      const expanded = filterToggleBtn.getAttribute('aria-expanded') === 'true';
      filterToggleBtn.setAttribute('aria-expanded', String(!expanded));
      matrixPanel.hidden = expanded;
    });
  }

  if (matrixForm) {
    matrixForm.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip');
      if (!btn) return;
      const axis = btn.dataset.axis;
      const value = btn.dataset.value;
      state[axis] = value;

      const group = btn.closest('[role="group"]');
      if (group) {
        for (const sibling of group.querySelectorAll('.filter-chip')) {
          sibling.setAttribute('aria-pressed', String(sibling === btn));
        }
      }
      renderFullRecipeCatalog();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.query = e.target.value;
      renderFullRecipeCatalog();
    });
  }

  const resetAll = () => {
    state.category = 'all';
    state.heat = 'all';
    state.time = 'all';
    state.query = '';
    if (searchInput) searchInput.value = '';
    if (matrixForm) {
      for (const btn of matrixForm.querySelectorAll('.filter-chip')) {
        btn.setAttribute('aria-pressed', String(btn.dataset.value === 'all'));
      }
    }
    renderFullRecipeCatalog();
  };

  if (resetBtn) resetBtn.addEventListener('click', resetAll);

  if (dialog) {
    dialog.addEventListener('close', () => {
      if (lastTriggerElement && typeof lastTriggerElement.focus === 'function') {
        lastTriggerElement.focus();
      }
    });
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-reset-inline') {
      resetAll();
      return;
    }
    const favBtn = e.target.closest('.btn-fav-recipe');
    if (favBtn) {
      const isFav = toggleFavoriteRecipe(favBtn.dataset.recipeId);
      favBtn.setAttribute('aria-pressed', String(isFav));
      favBtn.textContent = isFav ? '★ Guardada' : '☆ Favorita';
      return;
    }
    const cartBtn = e.target.closest('.btn-add-wa-cart');
    if (cartBtn) {
      const rec = RECIPES.find((r) => r.id === cartBtn.dataset.recipeId);
      const widget = document.querySelector('whatsapp-cart-widget');
      if (rec && widget && typeof widget.addRecipe === 'function') {
        widget.addRecipe(rec);
        cartBtn.textContent = '✓ En Carrito Calimax';
        emitOmnichannelEvent('recipe_added_to_wa_cart', { recipeId: rec.id });
      }
      return;
    }
    const openRecBtn = e.target.closest('.btn-open-recipe');
    if (openRecBtn) {
      openBottomSheet(openRecBtn.dataset.recipeId, openRecBtn);
    }
  });
}

if (typeof document !== 'undefined') {
  initMatrixFilter();
}
