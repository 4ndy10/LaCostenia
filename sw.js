// ponytail: Offline-First Service Worker with static pre-cache list; no Workbox dependency needed

const CACHE_NAME = 'la-costena-v3-nested-catalog-v1';

const PRECACHE_ASSETS = [
  './',
  'index.html',
  'recetas.html',
  'css/variables.css',
  'css/styles.css',
  'js/app.js',
  'js/data.js',
  'js/components/index.js',
  'js/components/site-header.js',
  'js/components/site-footer.js',
  'js/components/whatsapp-cart-widget.js',
  'js/components/mobile-nav.js',
  'js/components/bottom-sheet.js',
  'js/modules/router.js',
  'js/modules/matrix-filter.js',
  'js/modules/omnichannel.js',
  'js/modules/auth-state.js',
  'js/modules/interactions.js',
  'js/modules/spatial-lighting.js',
  'assets/img/hero-banner.avif',
  'assets/img/hero-banner.webp',
  'assets/img/campo-agricola-mexicano.avif',
  'assets/img/campo-agricola-mexicano.webp',
  'assets/img/ingrediente-jalapeno.avif',
  'assets/img/ingrediente-jalapeno.webp',
  'assets/img/ingrediente-chipotle.avif',
  'assets/img/ingrediente-chipotle.webp',
  'assets/img/ingrediente-tomatillo.avif',
  'assets/img/ingrediente-tomatillo.webp',
  'assets/img/ingrediente-cebolla-cilantro.avif',
  'assets/img/ingrediente-cebolla-cilantro.webp',
  'assets/img/receta-chilaquiles-verdes.avif',
  'assets/img/receta-chilaquiles-verdes.webp',
  'assets/img/receta-tinga-pollo.avif',
  'assets/img/receta-tinga-pollo.webp',
  'assets/img/receta-esquites.avif',
  'assets/img/receta-esquites.webp',
  'assets/img/receta-croquetas-platano.avif',
  'assets/img/receta-croquetas-platano.webp',
  'assets/img/prod-jalapenos.avif',
  'assets/img/prod-jalapenos.webp',
  'assets/img/prod-chipotles.avif',
  'assets/img/prod-chipotles.webp',
  'assets/img/prod-salsa-verde.avif',
  'assets/img/prod-salsa-verde.webp',
  'assets/img/prod-frijoles-bayos.avif',
  'assets/img/prod-frijoles-bayos.webp',
  'assets/img/prod-elotes.avif',
  'assets/img/prod-elotes.webp',
  'assets/img/prod-salsa-ranchera.avif',
  'assets/img/prod-salsa-ranchera.webp',
  'assets/img/rec-chilaquiles.avif',
  'assets/img/rec-chilaquiles.webp',
  'assets/img/rec-tinga.avif',
  'assets/img/rec-tinga.webp',
  'assets/img/rec-enfrijoladas.avif',
  'assets/img/rec-enfrijoladas.webp',
  'assets/img/rec-huevos-rancheros.avif',
  'assets/img/rec-huevos-rancheros.webp',
  'assets/img/rec-esquites.avif',
  'assets/img/rec-esquites.webp',
  'assets/img/rec-tacos-dorados.avif',
  'assets/img/rec-tacos-dorados.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Offline-First strategy: respond from Cache first, fallback to network and cache new GET responses
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match('index.html'));
    })
  );
});
