// ponytail: native CustomElement + Shadow DOM encapsulates shared header without framework runtime

const HEADER_TEMPLATE = `
  <style>
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(250, 247, 242, 0.96);
      border-bottom: 1px solid #D8CFC0;
      font-family: 'Nunito Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    }
    .header-inner {
      max-width: 1280px;
      margin-inline: auto;
      padding-inline: 1rem;
      min-height: 4.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .brand-logo {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: #141413;
      font-weight: 800;
      font-size: 1.35rem;
      min-height: 44px;
    }
    .brand-crest {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      background: #9E0B22;
      color: #FFFFFF;
      border-radius: 0.5rem;
      font-weight: 900;
    }
    .nav-toggle {
      display: none;
      min-width: 44px;
      min-height: 44px;
      padding: 0.5rem 0.75rem;
      border: 2px solid #141413;
      background: #FFFFFF;
      color: #141413;
      border-radius: 0.5rem;
      font-weight: 700;
      cursor: pointer;
    }
    .nav-list {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .nav-link {
      display: inline-flex;
      align-items: center;
      min-height: 44px;
      padding-inline: 0.75rem;
      color: #141413;
      font-weight: 700;
      text-decoration: none;
      border-radius: 0.5rem;
      transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .nav-link:hover {
      opacity: 0.78;
      transform: translate3d(0, -1px, 0);
    }
    .nav-link[aria-current="page"] {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 2px;
    }
    .nav-cta {
      background: #9E0B22;
      color: #FFFFFF;
      padding-inline: 1rem;
    }
    :focus-visible {
      outline: 3px solid #047857;
      outline-offset: 3px;
    }
    @media (max-width: 768px) {
      .nav-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .nav-list {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #FFFFFF;
        border-bottom: 2px solid #141413;
        flex-direction: column;
        align-items: stretch;
        padding: 1rem;
      }
      .nav-list[data-open="true"] {
        display: flex;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  </style>
  <header class="site-header" role="banner">
    <div class="header-inner">
      <a href="index.html" class="brand-logo" aria-label="La Costeña Inicio">
        <span class="brand-crest" aria-hidden="true">LC</span>
        <span>La Costeña<sup>®</sup></span>
      </a>
      <nav aria-label="Navegación principal multipágina">
        <button type="button" class="nav-toggle" id="shadow-nav-toggle" aria-expanded="false" aria-controls="shadow-nav-list">
          Menú
        </button>
        <ul class="nav-list" id="shadow-nav-list" data-open="false">
          <li><a href="index.html" class="nav-link" data-page="index">Inicio Sensorial</a></li>
          <li><a href="index.html#catalogo" class="nav-link">Catálogo</a></li>
          <li><a href="recetas.html" class="nav-link" data-page="recetas">Recetario Matricial (12)</a></li>
          <li><a href="recetas.html" class="nav-link nav-cta">Cocinar Ahora</a></li>
        </ul>
      </nav>
    </div>
  </header>
`;

const BaseHTMLElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

export class SiteHeader extends BaseHTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = HEADER_TEMPLATE;

    const isRecetas = typeof window !== 'undefined' && window.location.pathname.includes('recetas');
    const activeKey = isRecetas ? 'recetas' : 'index';
    const activeLink = shadow.querySelector(`[data-page="${activeKey}"]`);
    if (activeLink) activeLink.setAttribute('aria-current', 'page');

    const toggle = shadow.getElementById('shadow-nav-toggle');
    const list = shadow.getElementById('shadow-nav-list');
    if (toggle && list) {
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        list.dataset.open = String(!open);
      });
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('site-header')) {
  customElements.define('site-header', SiteHeader);
}
