// ponytail: bounding-box check + native CustomEvent on window avoids external SDK scripts (Lytics/Pixel) and keeps INP < 200ms
// shortcut: bounding box approximates Baja California (28.0°N–32.72°N, -117.15°W to -112.65°W); upgrade to GeoJSON polygon only if municipal-level routing is required

export const CALIMAX_WHATSAPP_NUMBER = '8002254629';

export const BC_BOUNDS = {
  minLat: 28.0,
  maxLat: 32.72,
  minLon: -117.15,
  maxLon: -112.65
};

let bcActiveState = true; // Mobile-first Baja California target market default; refined by navigator.geolocation

export function isWithinBajaCalifornia(lat, lon) {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= BC_BOUNDS.minLat &&
    lat <= BC_BOUNDS.maxLat &&
    lon >= BC_BOUNDS.minLon &&
    lon <= BC_BOUNDS.maxLon
  );
}

export function buildCalimaxWhatsAppUrl(recipe) {
  const name = recipe.nombre || recipe.title || 'Receta La Costeña';
  const items = (recipe.ingredientes || recipe.ingredients || []).join(', ');
  const msg = `Hola Calimax Baja California, quiero pedir los ingredientes para preparar "${name}": ${items}`;
  return `https://wa.me/${CALIMAX_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function emitOmnichannelEvent(eventType, payload = {}) {
  if (typeof window === 'undefined' || typeof CustomEvent === 'undefined') return null;
  const detail = {
    source: 'la-costena-v2-omnichannel',
    sink: ['Lytics', 'FacebookPixel', 'PowerBI'],
    eventType,
    region: bcActiveState ? 'MX-BCN' : 'MX-OTHER',
    timestamp: new Date().toISOString(),
    ...payload
  };
  const evt = new CustomEvent('lacostena:telemetry', { detail, bubbles: true });
  window.dispatchEvent(evt);
  return detail;
}

export function syncCalimaxButtonsDOM(isBajaCalifornia = bcActiveState) {
  bcActiveState = Boolean(isBajaCalifornia);
  if (typeof document === 'undefined') return;

  const geoBadge = document.getElementById('geo-region-badge');
  if (geoBadge) {
    geoBadge.textContent = bcActiveState
      ? '📍 Baja California · Calimax Activo'
      : '📍 Fuera de BC · Envío Nacional';
    geoBadge.dataset.bc = String(bcActiveState);
  }

  for (const btn of document.querySelectorAll('.btn-whatsapp-calimax')) {
    btn.dataset.bcActive = String(bcActiveState);
    btn.classList.toggle('is-bc-active', bcActiveState);
    if (bcActiveState) {
      btn.removeAttribute('aria-disabled');
    } else {
      btn.setAttribute('aria-disabled', 'false');
    }
  }
}

export function detectBajaCalifornia() {
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    syncCalimaxButtonsDOM(true);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const inBC = isWithinBajaCalifornia(latitude, longitude);
      syncCalimaxButtonsDOM(inBC);
      emitOmnichannelEvent('geolocation_resolved', {
        latitude,
        longitude,
        inBajaCalifornia: inBC
      });
    },
    () => {
      // Fallback: keep Calimax buttons enabled for Baja California prototype users who decline GPS prompt
      syncCalimaxButtonsDOM(true);
      emitOmnichannelEvent('geolocation_fallback', { inBajaCalifornia: true });
    },
    { timeout: 4000, maximumAge: 300000, enableHighAccuracy: false }
  );
}

export function initOmnichannel() {
  if (typeof document === 'undefined') return;

  detectBajaCalifornia();

  document.addEventListener('click', (e) => {
    const waBtn = e.target.closest('.btn-whatsapp-calimax');
    if (waBtn) {
      emitOmnichannelEvent('whatsapp_calimax_checkout', {
        recipeId: waBtn.dataset.recipeId || '',
        recipeName: waBtn.dataset.recipeName || '',
        retailer: 'Calimax',
        phone: CALIMAX_WHATSAPP_NUMBER
      });
      return;
    }

    const chipBtn = e.target.closest('.filter-chip');
    if (chipBtn) {
      emitOmnichannelEvent('matrix_filter_click', {
        axis: chipBtn.dataset.axis,
        value: chipBtn.dataset.value
      });
      return;
    }

    const favBtn = e.target.closest('.btn-fav-recipe');
    if (favBtn) {
      emitOmnichannelEvent('recipe_favorite_toggle', {
        recipeId: favBtn.dataset.recipeId || ''
      });
    }
  });

  const searchInput = document.getElementById('recipe-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      emitOmnichannelEvent('recipe_search_query', {
        query: e.target.value.trim()
      });
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('lacostena:telemetry', (e) => {
      const counterEl = document.getElementById('metric-events');
      if (counterEl && e.detail) {
        const count = Number(counterEl.dataset.count || '0') + 1;
        counterEl.dataset.count = String(count);
        counterEl.textContent = `${count} (${e.detail.eventType})`;
      }
    });
  }
}
