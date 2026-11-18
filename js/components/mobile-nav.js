// ponytail: <bottom-nav> (Thumb Zone mobile navigation) + <whatsapp-fab> (scroll-aware WhatsApp FAB) in one module

import { CALIMAX_WHATSAPP_NUMBER, emitOmnichannelEvent } from '../modules/omnichannel.js';

const BOTTOM_NAV_TEMPLATE = `
  <style>
    :host {
      display: none;
    }
    @media (max-width: 768px) {
      :host {
        display: block;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 950;
        background: rgba(253, 251, 247, 0.88);
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);
        border-top: 1px solid rgba(28, 28, 28, 0.14);
        font-family: 'Nunito Sans', system-ui, -apple-system, sans-serif;
      }
    }
    .thumb-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      min-height: 60px;
      margin: 0;
      padding: 0.25rem 0.5rem;
      list-style: none;
    }
    .thumb-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.15rem;
      min-height: 48px;
      color: var(--text, #1C1C1C);
      text-decoration: none;
      font-size: 0.75rem;
      font-weight: 800;
      border-radius: 0.5rem;
      transition: transform 150ms cubic-bezier(0.22, 1, 0.36, 1), opacity 150ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .thumb-link:active {
      transform: scale(0.98);
    }
    .thumb-link[aria-current="page"] {
      color: var(--primary, #C8102E);
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  </style>
  <nav aria-label="Navegación móvil en zona del pulgar (Thumb Zone)">
    <ul class="thumb-bar">
      <li><a href="index.html" class="thumb-link" data-page="index"><span>🏠</span><span>Inicio</span></a></li>
      <li><a href="recetas.html" class="thumb-link" data-page="recetas"><span>🌶</span><span>Recetario</span></a></li>
      <li><a href="index.html#catalogo" class="thumb-link"><span>🥫</span><span>Despensa</span></a></li>
      <li><a href="https://wa.me/${CALIMAX_WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" class="thumb-link"><span>🛵</span><span>Calimax</span></a></li>
    </ul>
  </nav>
`;

const WHATSAPP_FAB_TEMPLATE = `
  <style>
    :host {
      display: block;
      position: fixed;
      bottom: 4.75rem;
      left: 1rem;
      z-index: 920;
      font-family: 'Nunito Sans', system-ui, -apple-system, sans-serif;
      transform: translate3d(0, 0, 0);
      opacity: 1;
      transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    :host([data-hidden="true"]) {
      transform: translate3d(0, 120%, 0);
      opacity: 0;
      pointer-events: none;
    }
    .wa-fab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      min-height: 48px;
      padding: 0.65rem 1.15rem;
      border-radius: 999px;
      background: #047857;
      color: #FFFFFF;
      border: 2px solid #FFFFFF;
      font-weight: 800;
      font-size: 0.88rem;
      text-decoration: none;
      box-shadow: 0 8px 24px rgba(20, 20, 19, 0.28);
      transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .wa-fab-btn:active {
      transform: scale(0.98);
    }
    @media (prefers-reduced-motion: reduce) {
      :host,
      * {
        transition: none !important;
      }
    }
  </style>
  <a
    id="wa-fab-anchor"
    class="wa-fab-btn"
    href="https://wa.me/${CALIMAX_WHATSAPP_NUMBER}?text=Hola%20Calimax%20Baja%20California%2C%20quiero%20pedir%20ingredientes%20La%20Coste%C3%B1a%20con%20env%C3%ADo%20gratis"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span aria-hidden="true">🟢</span>
    <span>Pedir por Whats (Envío Gratis)</span>
  </a>
`;

const BaseHTMLElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

export class BottomNav extends BaseHTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = BOTTOM_NAV_TEMPLATE;

    const isRecetas = typeof window !== 'undefined' && window.location.pathname.includes('recetas');
    const active = shadow.querySelector(`[data-page="${isRecetas ? 'recetas' : 'index'}"]`);
    if (active) active.setAttribute('aria-current', 'page');
  }
}

export class WhatsappFab extends BaseHTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = WHATSAPP_FAB_TEMPLATE;

    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;
        if (delta > 8 && currentY > 80) {
          this.setAttribute('data-hidden', 'true');
        } else if (delta < -6 || currentY <= 80) {
          this.removeAttribute('data-hidden');
        }
        lastScrollY = currentY;
        ticking = false;
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    const anchor = shadow.getElementById('wa-fab-anchor');
    if (anchor) {
      anchor.addEventListener('click', () => {
        emitOmnichannelEvent('whatsapp_fab_click', { label: 'Pedir por Whats (Envío Gratis)' });
      });
    }
  }
}

if (typeof customElements !== 'undefined') {
  if (!customElements.get('bottom-nav')) customElements.define('bottom-nav', BottomNav);
  if (!customElements.get('whatsapp-fab')) customElements.define('whatsapp-fab', WhatsappFab);
}
