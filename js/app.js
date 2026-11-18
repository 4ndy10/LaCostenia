import { PRODUCTS, RECIPES, filterRecipes } from './data.js';
import {
  buildCalimaxWhatsAppUrl,
  initOmnichannel,
  syncCalimaxButtonsDOM,
  emitOmnichannelEvent
} from './modules/omnichannel.js';
import {
  initAuthState,
  toggleFavoriteRecipe,
  isFavoriteRecipe,
  recordChatInteraction
} from './modules/auth-state.js';

const state = {
  category: 'all',
  heat: 'all',
  time: 'all',
  query: ''
};

// ponytail: direct DOM template string + DocumentFragment avoids VDOM/template-engine overhead; upgrade only if list exceeds >500 items
function createPictureHTML(basePath, alt, width, height, priority = false) {
  const loadingAttr = priority ? 'fetchpriority="high"' : 'loading="lazy"';
  return `
    <picture class="media-picture">
      <source srcset="${basePath}.avif" type="image/avif">
      <source srcset="${basePath}.webp" type="image/webp">
      <img
        src="${basePath}.webp"
        alt="${alt}"
        width="${width}"
        height="${height}"
        ${loadingAttr}
        decoding="async"
        class="media-img"
      >
    </picture>
  `;
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const frag = document.createDocumentFragment();
  for (const item of PRODUCTS) {
    const article = document.createElement('article');
    article.className = 'product-card gpu-card';
    article.setAttribute('itemscope', '');
    article.setAttribute('itemtype', 'https://schema.org/Product');
    article.innerHTML = `
      <div class="product-media">
        <span class="product-badge">${item.badge}</span>
        ${createPictureHTML(item.image, `${item.name} La Costeña (${item.weight})`, 480, 480, false)}
      </div>
      <div class="product-body">
        <div class="product-meta">
          <span class="tag-pill">${item.categoryLabel}</span>
          <span class="heat-pill heat-${item.heat}" aria-label="Nivel de picor: ${item.heatLabel}">
            ${'🌶'.repeat(item.heatLevel)} ${item.heatLabel}
          </span>
        </div>
        <h3 class="product-title" itemprop="name">${item.name}</h3>
        <p class="product-desc" itemprop="description">${item.description}</p>
        <div class="product-footer">
          <div class="product-price-wrap">
            <span class="product-weight">${item.weight}</span>
            <span class="product-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
              <meta itemprop="priceCurrency" content="MXN">
              $<span itemprop="price">${item.price}</span> <small>MXN</small>
            </span>
          </div>
          <button
            type="button"
            class="btn btn-secondary btn-filter-by-product"
            data-filter-category="${item.category}"
            aria-label="Ver recetas con ${item.name}"
          >
            Ver recetas
          </button>
        </div>
      </div>
    `;
    frag.appendChild(article);
  }
  grid.replaceChildren(frag);
}

function renderRecipes() {
  const grid = document.getElementById('recipe-grid');
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
      const title = rec.nombre || rec.title;
      const fav = isFavoriteRecipe(rec.id);
      const waUrl = buildCalimaxWhatsAppUrl(rec);
      const card = document.createElement('article');
      card.className = 'recipe-card gpu-card';
      card.innerHTML = `
        <div class="recipe-media">
          ${createPictureHTML(rec.image, `Platillo terminado: ${title}`, 640, 420, false)}
          <span class="recipe-time-badge">${rec.timeMinutes} min · ${rec.servings} porciones</span>
          <button
            type="button"
            class="btn-fav-recipe"
            data-recipe-id="${rec.id}"
            aria-pressed="${fav}"
            aria-label="Guardar ${title} en favoritos de sesión"
          >
            ${fav ? '★ Guardada' : '☆ Favorita'}
          </button>
        </div>
        <div class="recipe-body">
          <div class="recipe-tags">
            <span class="tag-pill">${rec.categoryLabel}</span>
            <span class="heat-pill heat-${rec.picor || rec.heat}">${rec.heatLabel}</span>
          </div>
          <h3 class="recipe-title">${title}</h3>
          <p class="recipe-summary">${rec.summary}</p>
          <p class="recipe-ingredient-highlight">
            <strong>Ingrediente estrella:</strong> ${rec.productUsed}
          </p>
          <div class="recipe-actions">
            <a
              href="${waUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-whatsapp-calimax is-bc-active"
              data-recipe-id="${rec.id}"
              data-recipe-name="${title}"
              data-bc-active="true"
            >
              Pedir ingredientes vía WhatsApp
            </a>
            <button
              type="button"
              class="btn btn-secondary btn-open-recipe"
              data-recipe-id="${rec.id}"
              aria-haspopup="dialog"
            >
              Preparar paso a paso
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
    statusEl.textContent = `Mostrando ${matched.length} ${matched.length === 1 ? 'receta disponible' : 'recetas disponibles'} para la selección actual.`;
  }
}

function setupMatrixFilters() {
  const matrixForm = document.getElementById('recipe-matrix-controls');
  const searchInput = document.getElementById('recipe-search');
  const resetBtn = document.getElementById('btn-reset-filters');
  const filterToggleBtn = document.getElementById('btn-toggle-matrix');
  const matrixPanel = document.getElementById('matrix-panel');

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
      renderRecipes();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.query = e.target.value;
      renderRecipes();
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
    renderRecipes();
  };

  if (resetBtn) resetBtn.addEventListener('click', resetAll);

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
    const prodFilterBtn = e.target.closest('.btn-filter-by-product');
    if (prodFilterBtn) {
      const cat = prodFilterBtn.dataset.filterCategory;
      state.category = cat;
      if (matrixForm) {
        for (const btn of matrixForm.querySelectorAll('.filter-chip[data-axis="category"]')) {
          btn.setAttribute('aria-pressed', String(btn.dataset.value === cat));
        }
      }
      renderRecipes();
      const recSection = document.getElementById('recetas');
      if (recSection) recSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const openRecBtn = e.target.closest('.btn-open-recipe');
    if (openRecBtn) {
      openRecipeModal(openRecBtn.dataset.recipeId, openRecBtn);
    }
  });
}

let lastTriggerElement = null;

function openRecipeModal(recipeId, triggerEl) {
  const rec = RECIPES.find((r) => r.id === recipeId);
  const dialog = document.getElementById('recipe-dialog');
  const content = document.getElementById('recipe-dialog-content');
  if (!rec || !dialog || !content) return;

  const title = rec.nombre || rec.title;
  const ingredients = rec.ingredientes || rec.ingredients || [];
  const waUrl = buildCalimaxWhatsAppUrl(rec);

  lastTriggerElement = triggerEl || null;
  content.innerHTML = `
    <div class="dialog-header">
      <div>
        <span class="tag-pill">${rec.categoryLabel}</span>
        <span class="heat-pill heat-${rec.picor || rec.heat}">${rec.heatLabel}</span>
        <h2 id="dialog-recipe-title" class="dialog-title">${title}</h2>
      </div>
      <button type="button" class="btn-icon-close" id="btn-close-dialog" aria-label="Cerrar ventana de receta">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="dialog-meta-bar">
      <span><strong>Tiempo total:</strong> ${rec.timeMinutes} min</span>
      <span><strong>Porciones:</strong> ${rec.servings} personas</span>
      <span><strong>Energía:</strong> ${rec.calories}</span>
    </div>
    <div class="dialog-columns">
      <div class="dialog-col">
        <h3>Ingredientes</h3>
        <ul class="dialog-list">
          ${ingredients.map((i) => `<li>${i}</li>`).join('')}
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
        href="${waUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-whatsapp-calimax is-bc-active"
        data-recipe-id="${rec.id}"
        data-recipe-name="${title}"
      >
        Pedir ingredientes vía WhatsApp (Calimax BC)
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

function setupChatbot() {
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const panel = document.getElementById('chatbot-panel');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');
  const messages = document.getElementById('chatbot-messages');
  if (!toggleBtn || !panel) return;

  const setOpen = (open) => {
    toggleBtn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (open && input) input.focus();
  };

  toggleBtn.addEventListener('click', () => {
    setOpen(toggleBtn.getAttribute('aria-expanded') !== 'true');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      setOpen(false);
      toggleBtn.focus();
    });
  }

  if (form && input && messages) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      input.value = '';

      const matches = filterRecipes(RECIPES, { query: q });
      const reply = matches.length > 0
        ? `Te recomiendo preparar "${matches[0].nombre}" (${matches[0].timeMinutes} min, ${matches[0].heatLabel}). Puedes pedir sus ingredientes en Calimax vía WhatsApp.`
        : 'Puedo ayudarte a filtrar por Chiles, Salsas, Frijoles o Vegetales, o conectarte con Calimax en el 800-225-4629.';

      recordChatInteraction(q, reply);
      emitOmnichannelEvent('chatbot_query', { query: q, matches: matches.length });

      const userDiv = document.createElement('div');
      userDiv.className = 'chat-msg chat-msg-user';
      userDiv.textContent = q;

      const botDiv = document.createElement('div');
      botDiv.className = 'chat-msg chat-msg-bot';
      botDiv.textContent = reply;

      messages.append(userDiv, botDiv);
      messages.scrollTop = messages.scrollHeight;
    });
  }
}

function setupDialogAndNav() {
  const dialog = document.getElementById('recipe-dialog');
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

  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('primary-nav-list');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.dataset.open = String(!isExpanded);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.dataset.open = 'false';
        navToggle.focus();
      }
    });
  }
}

/**
 * Fase 1: Auditoría de Rendimiento Base en Tiempo Real (LCP, INP, CLS).
 * Registra métricas reales sin bloquear el hilo principal.
 */
function setupPerformanceAudit() {
  const lcpEl = document.getElementById('metric-lcp');
  const inpEl = document.getElementById('metric-inp');
  const clsEl = document.getElementById('metric-cls');

  if (!('PerformanceObserver' in window)) return;

  try {
    let clsValue = 0;
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const last = entries[entries.length - 1];
      if (last && lcpEl) {
        const ms = Math.round(last.startTime);
        lcpEl.textContent = `${ms} ms`;
        lcpEl.dataset.status = ms <= 2500 ? 'optimal' : 'warn';
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) clsValue += entry.value;
      }
      if (clsEl) {
        clsEl.textContent = clsValue.toFixed(3);
        clsEl.dataset.status = clsValue <= 0.1 ? 'optimal' : 'warn';
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    let maxInp = 0;
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.duration > maxInp) {
          maxInp = Math.round(entry.duration);
          if (inpEl) {
            inpEl.textContent = `${maxInp} ms`;
            inpEl.dataset.status = maxInp <= 200 ? 'optimal' : 'warn';
          }
        }
      }
    });
    inpObserver.observe({ type: 'event', durationThreshold: 16, buffered: true });
  } catch {
    // Browser does not support one of the entryTypes; fallback values remain visible.
  }
}

function registerServiceWorker() {
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        // Ignore registration errors on file:// protocol
      });
    });
  }
}

function init() {
  initAuthState();
  renderProducts();
  renderRecipes();
  setupMatrixFilters();
  setupChatbot();
  setupDialogAndNav();
  initOmnichannel();
  setupPerformanceAudit();
  registerServiceWorker();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
