import './components/index.js';
import { PRODUCTS, RECIPES, FEATURED_RECIPES, filterRecipes } from './data.js';
import { initOmnichannel, syncCalimaxButtonsDOM, emitOmnichannelEvent } from './modules/omnichannel.js';
import { initAuthState, recordChatInteraction } from './modules/auth-state.js';
import { injectGranularJsonLd } from './modules/router.js';
import { initInteractions } from './modules/interactions.js';
import { initSpatialLighting } from './modules/spatial-lighting.js';
import { initBottomSheet, openBottomSheet } from './components/bottom-sheet.js';

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

function renderSensoryCarousel() {
  const track = document.getElementById('sensory-carousel-track');
  if (!track) return;

  const frag = document.createDocumentFragment();
  for (const rec of FEATURED_RECIPES) {
    const slide = document.createElement('article');
    slide.className = 'carousel-slide recipe-card gpu-card';
    slide.innerHTML = `
      <div class="recipe-media">
        ${createPictureHTML(rec.image, `Platillo insignia: ${rec.nombre}`, 600, 400, false)}
        <span class="recipe-time-badge">${rec.timeMinutes} min · ${rec.servings} porciones</span>
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
            class="btn btn-primary btn-open-recipe"
            data-recipe-id="${rec.id}"
            aria-haspopup="dialog"
          >
            Preparar para la carnita asada
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-add-wa-cart"
            data-recipe-id="${rec.id}"
          >
            + Agregar al Carrito Calimax
          </button>
        </div>
      </div>
    `;
    frag.appendChild(slide);
  }
  track.replaceChildren(frag);
  syncCalimaxButtonsDOM();
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
          <a
            href="recetas.html?category=${item.category}"
            class="btn btn-secondary"
            aria-label="Ver recetas con ${item.name}"
          >
            Ver recetas
          </a>
        </div>
      </div>
    `;
    frag.appendChild(article);
  }
  grid.replaceChildren(frag);
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
        ? `Te recomiendo preparar "${matches[0].nombre}" (${matches[0].timeMinutes} min, ${matches[0].heatLabel}). Puedes pedir sus ingredientes en Calimax Tijuana vía WhatsApp.`
        : 'Puedo ayudarte a filtrar las 12 recetas en recetas.html o conectarte con Calimax en el 800-225-4629.';

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

function setupCartDelegation() {
  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('.btn-open-recipe');
    if (openBtn) {
      openBottomSheet(openBtn.dataset.recipeId, openBtn);
      return;
    }
    const cartBtn = e.target.closest('.btn-add-wa-cart');
    if (!cartBtn) return;
    const rec = RECIPES.find((r) => r.id === cartBtn.dataset.recipeId);
    const widget = document.querySelector('whatsapp-cart-widget');
    if (rec && widget && typeof widget.addRecipe === 'function') {
      widget.addRecipe(rec);
      cartBtn.textContent = '✓ En Carrito Calimax';
      emitOmnichannelEvent('recipe_added_to_wa_cart', { recipeId: rec.id });
    }
  });
}

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
    // Fallback metrics remain visible
  }
}

function registerServiceWorker() {
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
}

function init() {
  initAuthState();
  initBottomSheet();
  initInteractions();
  initSpatialLighting();
  renderSensoryCarousel();
  renderProducts();
  setupChatbot();
  setupCartDelegation();
  initOmnichannel();
  setupPerformanceAudit();
  registerServiceWorker();

  const isRecipePage = window.location.pathname.includes('recetas');
  injectGranularJsonLd(isRecipePage);
  if (isRecipePage) {
    import('./modules/matrix-filter.js');
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
