const FINE = '(hover: hover) and (pointer: fine)';

/** Small lime dot + ring that eases behind it. Disabled on touch devices. */
export function initCursor() {
  if (!matchMedia(FINE).matches) return;
  const root = document.querySelector('.cursor');
  const dot = root.querySelector('.c-dot');
  const ring = root.querySelector('.c-ring');
  document.documentElement.classList.add('has-cursor');
  root.style.opacity = '0';

  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, s = 1, ts = 1;
  addEventListener('pointermove', (e) => {
    x = e.clientX;
    y = e.clientY;
    root.style.opacity = '1';
    ts = e.target.closest && e.target.closest('a, button, [role="slider"], [tabindex="0"], .dots, .thumb, .card') ? 1.9 : 1;
  }, { passive: true });
  document.addEventListener('pointerleave', () => (root.style.opacity = '0'));

  (function loop() {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    s += (ts - s) * 0.16;
    dot.style.transform = `translate3d(${x}px,${y}px,0)`;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0) scale(${s})`;
    requestAnimationFrame(loop);
  })();
}

/** Magnetic pull on [data-mag] elements (transform only). */
export function initMagnets(reduced) {
  if (reduced || !matchMedia(FINE).matches) return;
  const mags = [...document.querySelectorAll('[data-mag]')];
  addEventListener('pointermove', (e) => {
    const hit = e.target.closest && e.target.closest('[data-mag]');
    mags.forEach((m) => {
      if (m !== hit) m.style.transform = '';
    });
    if (hit) {
      const r = hit.getBoundingClientRect();
      hit.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    }
  }, { passive: true });
}
