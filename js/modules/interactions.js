// ponytail: delegated pointerdown/pointerup listener for .btn/.card haptic scale(0.98) + CSS shimmer skeleton helper

export function renderSkeletonGrid(containerId = 'recipe-grid-full', count = 6) {
  if (typeof document === 'undefined') return null;
  const grid = document.getElementById(containerId);
  if (!grid) return null;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i += 1) {
    const skel = document.createElement('div');
    skel.className = 'skeleton-card card';
    skel.setAttribute('aria-hidden', 'true');
    frag.appendChild(skel);
  }
  grid.replaceChildren(frag);
  return grid;
}

export function initInteractions() {
  if (typeof document === 'undefined') return;

  const selector = '.btn, .card, .gpu-card, .filter-chip';

  document.addEventListener(
    'pointerdown',
    (e) => {
      const target = e.target.closest(selector);
      if (!target) return;
      target.classList.add('is-haptic-active');
      target.style.transform = 'scale(0.98)';
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate(6);
        } catch {
          // Ignore vibration permission restrictions
        }
      }
    },
    { passive: true }
  );

  const releaseHaptic = (e) => {
    const target = e.target && typeof e.target.closest === 'function' ? e.target.closest(selector) : null;
    if (target) {
      target.classList.remove('is-haptic-active');
      target.style.transform = '';
      return;
    }
    for (const el of document.querySelectorAll('.is-haptic-active')) {
      el.classList.remove('is-haptic-active');
      el.style.transform = '';
    }
  };

  document.addEventListener('pointerup', releaseHaptic, { passive: true });
  document.addEventListener('pointercancel', releaseHaptic, { passive: true });
}
