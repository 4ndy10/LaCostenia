// ponytail: URL pathname micro-router + granular JSON-LD AEO injection (3 featured on index, 12 full on recetas)

import { RECIPES, FEATURED_RECIPES, PRODUCTS, buildRecipeSchemaNodes } from '../data.js';

export function buildGranularJsonLd(isRecipePage = false) {
  const targetRecipes = isRecipePage ? RECIPES : FEATURED_RECIPES;
  const graph = [
    {
      '@type': 'Organization',
      '@id': 'https://www.lacostena.com.mx/#organization',
      name: 'Conservas La Costeña S.A. de C.V.',
      url: 'https://www.lacostena.com.mx/',
      slogan: 'Por sabor',
      foundingDate: '1923'
    },
    ...(!isRecipePage
      ? PRODUCTS.slice(0, 3).map((p) => ({
          '@type': 'Product',
          '@id': `https://www.lacostena.com.mx/#${p.id}`,
          name: `${p.name} La Costeña ${p.weight}`,
          sku: p.sku,
          brand: { '@type': 'Brand', name: 'La Costeña' },
          description: p.description,
          image: [
            `https://www.lacostena.com.mx/${p.image}.avif`,
            `https://www.lacostena.com.mx/${p.image}.webp`
          ],
          offers: {
            '@type': 'Offer',
            priceCurrency: 'MXN',
            price: p.price,
            availability: 'https://schema.org/InStock'
          }
        }))
      : []),
    ...buildRecipeSchemaNodes(targetRecipes)
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}

export function injectGranularJsonLd(isRecipePage = false) {
  if (typeof document === 'undefined') return null;
  const payload = buildGranularJsonLd(isRecipePage);
  let scriptEl = document.querySelector('script[type="application/ld+json"]');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(payload, null, 2);
  return payload;
}

export async function runPageRouter() {
  if (typeof window === 'undefined') return { isRecipePage: false };
  const isRecipePage = window.location.pathname.includes('recetas') || Boolean(document.getElementById('recipe-grid-full'));
  injectGranularJsonLd(isRecipePage);

  if (isRecipePage) {
    await import('./matrix-filter.js');
  }
  return { isRecipePage };
}
