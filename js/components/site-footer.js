// ponytail: native CustomElement + Shadow DOM encapsulates shared footer across index.html and recetas.html

const FOOTER_TEMPLATE = `
  <style>
    :host {
      display: block;
      background: #141413;
      color: #F8FAFC;
      padding-block: 3rem;
      font-family: 'Nunito Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    }
    .footer-inner {
      max-width: 1280px;
      margin-inline: auto;
      padding-inline: 1rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
    }
    .footer-links {
      display: flex;
      gap: 1rem;
      list-style: none;
      margin: 0.5rem 0 0;
      padding: 0;
    }
    .footer-links a {
      color: #FDE68A;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    p {
      margin: 0.25rem 0 0;
      color: #CBD5E1;
      font-size: 0.9rem;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  </style>
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div>
        <strong>Conservas La Costeña® · Por Sabor (Arquitectura MPA v3.0)</strong>
        <p>HTML5 + CSS3 + Web Components Shadow DOM · Mercado Baja California (Calimax Tijuana).</p>
        <ul class="footer-links">
          <li><a href="index.html">Escaparate Sensorial</a></li>
          <li><a href="recetas.html">Catálogo Anidado (12 Recetas)</a></li>
        </ul>
      </div>
      <p>&copy; 2026 La Costeña. Cumplimiento WCAG 2.2 AA, NIST AI RMF &amp; LFPDPPP.</p>
    </div>
  </footer>
`;

const BaseHTMLElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

export class SiteFooter extends BaseHTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = FOOTER_TEMPLATE;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('site-footer')) {
  customElements.define('site-footer', SiteFooter);
}
