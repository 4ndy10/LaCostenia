// ponytail: Shadow DOM WhatsApp Cart Widget aggregates local ingredients for Calimax Tijuana via sessionStorage

import { CALIMAX_WHATSAPP_NUMBER, emitOmnichannelEvent } from '../modules/omnichannel.js';

const CART_SESSION_KEY = 'lc_v3_whatsapp_cart';

const WIDGET_TEMPLATE = `
  <style>
    :host {
      display: block;
      position: fixed;
      bottom: 1rem;
      left: 1rem;
      z-index: 890;
      font-family: 'Nunito Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    }
    .cart-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      min-height: 48px;
      padding: 0.6rem 1.1rem;
      border-radius: 999px;
      background: #047857;
      color: #FFFFFF;
      border: 2px solid #FFFFFF;
      font-weight: 800;
      font-size: 0.9rem;
      text-decoration: none;
      box-shadow: 0 8px 24px rgba(20, 20, 19, 0.26);
      cursor: pointer;
      transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .cart-pill:hover {
      transform: translate3d(0, -2px, 0);
      background: #065F46;
    }
    .cart-badge {
      background: #FDE68A;
      color: #141413;
      padding: 0.15rem 0.55rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 900;
    }
    :focus-visible {
      outline: 3px solid #9E0B22;
      outline-offset: 3px;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  </style>
  <a
    id="wa-cart-link"
    class="cart-pill"
    href="https://wa.me/${CALIMAX_WHATSAPP_NUMBER}?text=Hola%20Calimax%20Tijuana%2C%20quiero%20pedir%20productos%20La%20Coste%C3%B1a"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Pedir carrito de ingredientes en Calimax Tijuana vía WhatsApp"
  >
    <span aria-hidden="true">🛒</span>
    <span id="wa-cart-label">Carrito Calimax BC</span>
    <span id="wa-cart-count" class="cart-badge">0</span>
  </a>
`;

const BaseHTMLElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

export class WhatsappCartWidget extends BaseHTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = WIDGET_TEMPLATE;
    this.syncFromSession();

    if (typeof window !== 'undefined') {
      window.addEventListener('lacostena:cart-updated', () => this.syncFromSession());
    }

    const link = shadow.getElementById('wa-cart-link');
    if (link) {
      link.addEventListener('click', () => {
        emitOmnichannelEvent('whatsapp_cart_widget_checkout', {
          retailer: 'Calimax Tijuana',
          itemsCount: this.getItems().length
        });
      });
    }
  }

  getItems() {
    try {
      const raw = window.sessionStorage.getItem(CART_SESSION_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  addRecipe(recipe) {
    try {
      const items = this.getItems();
      if (!items.some((i) => i.id === recipe.id)) {
        items.push({
          id: recipe.id,
          nombre: recipe.nombre || recipe.title,
          ingredientes: recipe.ingredientes_locales || recipe.ingredientes || []
        });
        window.sessionStorage.setItem(CART_SESSION_KEY, JSON.stringify(items));
      }
      this.syncFromSession();
    } catch {
      // sessionStorage unavailable
    }
  }

  syncFromSession() {
    if (!this.shadowRoot) return;
    const items = this.getItems();
    const countEl = this.shadowRoot.getElementById('wa-cart-count');
    const linkEl = this.shadowRoot.getElementById('wa-cart-link');
    if (countEl) countEl.textContent = String(items.length);
    if (linkEl && items.length > 0) {
      const names = items.map((i) => i.nombre).join(' + ');
      const allIng = items.flatMap((i) => i.ingredientes).join(', ');
      const text = `Hola Calimax Tijuana, quiero pedir los ingredientes para (${names}): ${allIng}`;
      linkEl.href = `https://wa.me/${CALIMAX_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('whatsapp-cart-widget')) {
  customElements.define('whatsapp-cart-widget', WhatsappCartWidget);
}
