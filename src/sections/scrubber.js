/**
 * Pill scrubber of thin ticks with a lime playhead.
 * Reflects scroll progress; click/drag/keys move the page scroll (single source of truth).
 */
export function initScrubber({ el, getRange, scroll, reduced }) {
  const ticksEl = el.querySelector('.ticks');
  const ph = el.querySelector('.ph');
  const COUNT = 48;
  const ticks = [];
  for (let i = 0; i < COUNT; i++) {
    const t = document.createElement('i');
    t.className = 'tk' + (i % 6 === 0 ? ' big' : '');
    ticksEl.appendChild(t);
    ticks.push(t);
  }
  let width = 0, lit = -1, last = 0;
  const measure = () => { width = ticksEl.clientWidth; };
  measure();
  addEventListener('resize', measure);

  function set(p) {
    last = p;
    ph.style.transform = `translate3d(${(18 + p * (width - 1)).toFixed(1)}px,0,0)`;
    const n = Math.round(p * (COUNT - 1));
    if (n !== lit) {
      for (let i = 0; i < COUNT; i++) ticks[i].classList.toggle('on', i <= n);
      lit = n;
    }
    el.setAttribute('aria-valuenow', String(Math.round(p * 100)));
  }

  const go = (p, immediate, duration) => {
    const { top, range } = getRange();
    scroll.scrollTo(top + Math.min(1, Math.max(0, p)) * range, { immediate, duration });
  };
  const pFromEvent = (e) => {
    const r = ticksEl.getBoundingClientRect();
    return (e.clientX - r.left) / r.width;
  };

  let dragging = false;
  el.addEventListener('pointerdown', (e) => {
    dragging = true;
    el.setPointerCapture(e.pointerId);
    go(pFromEvent(e), reduced, 1.1); // click → eased jump
  });
  el.addEventListener('pointermove', (e) => { if (dragging && e.buttons) go(pFromEvent(e), true); });
  const end = () => { dragging = false; };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  el.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 0.15 : 0.04;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); go(last + step, false, 0.6); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); go(last - step, false, 0.6); }
    if (e.key === 'Home') { e.preventDefault(); go(0, false, 1); }
    if (e.key === 'End') { e.preventDefault(); go(1, false, 1); }
  });

  set(0);
  return { set, measure };
}
