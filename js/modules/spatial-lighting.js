// ponytail: lightweight Three.js-compatible DirectionalLight PBR rig driven by mousemove + DeviceOrientationEvent, gated by IntersectionObserver and requestAnimationFrame

export class DirectionalLight {
  constructor(color = 0xffffff, intensity = 1.25) {
    this.type = 'DirectionalLight';
    this.color = color;
    this.intensity = intensity;
    this.position = {
      x: 0.4,
      y: 0.6,
      z: 1.0,
      set(nx, ny, nz) {
        this.x = nx;
        this.y = ny;
        this.z = nz;
      }
    };
  }
}

export function createSpatialLightingController(canvasEl) {
  const directionalLight = new DirectionalLight(0xfff4e0, 1.35);
  const state = {
    isVisible: true,
    rafId: null,
    targetX: 0.35,
    targetY: 0.45
  };

  const renderPbrFrame = () => {
    state.rafId = null;
    if (!state.isVisible || !canvasEl) return;

    directionalLight.position.set(state.targetX, state.targetY, 1.0);

    const ctx = typeof canvasEl.getContext === 'function' ? canvasEl.getContext('2d') : null;
    if (!ctx) return;

    const w = canvasEl.width || 160;
    const h = canvasEl.height || 96;
    ctx.clearRect(0, 0, w, h);

    const specX = w * (0.5 + directionalLight.position.x * 0.38);
    const specY = h * (0.5 - directionalLight.position.y * 0.38);

    const grad = ctx.createRadialGradient(specX, specY, 4, w * 0.5, h * 0.5, w * 0.65);
    grad.addColorStop(0, 'rgba(255, 250, 240, 0.95)');
    grad.addColorStop(0.35, 'rgba(200, 16, 46, 0.85)');
    grad.addColorStop(1, 'rgba(28, 28, 28, 0.92)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  };

  const scheduleFrame = () => {
    if (!state.isVisible || state.rafId !== null || typeof requestAnimationFrame !== 'function') return;
    state.rafId = requestAnimationFrame(renderPbrFrame);
  };

  const onMouseMove = (e) => {
    if (!state.isVisible || typeof window === 'undefined') return;
    const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
    const ny = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
    state.targetX = Number(nx.toFixed(3));
    state.targetY = Number(ny.toFixed(3));
    scheduleFrame();
  };

  const onDeviceOrientation = (e) => {
    if (!state.isVisible) return;
    const gamma = typeof e.gamma === 'number' ? e.gamma : 0; // [-90, 90]
    const beta = typeof e.beta === 'number' ? e.beta : 45;  // [-180, 180]
    state.targetX = Math.max(-1, Math.min(1, gamma / 45));
    state.targetY = Math.max(-1, Math.min(1, (45 - beta) / 45));
    scheduleFrame();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    }
  }

  if (typeof IntersectionObserver !== 'undefined' && canvasEl) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          state.isVisible = entry.isIntersecting;
          if (state.isVisible) {
            scheduleFrame();
          } else if (state.rafId !== null && typeof cancelAnimationFrame === 'function') {
            cancelAnimationFrame(state.rafId);
            state.rafId = null;
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvasEl);
  }

  scheduleFrame();
  return { directionalLight, state, scheduleFrame };
}

export function initSpatialLighting() {
  if (typeof document === 'undefined') return null;
  const canvasEl = document.getElementById('spatial-pbr-canvas');
  if (!canvasEl) return null;
  return createSpatialLightingController(canvasEl);
}
