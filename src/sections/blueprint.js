import { stagger, makeDrawable } from '../animations/anime.js';
import { PARTS } from '../scenes/phoneSpec.js';
import { site } from '../data/site.js';

const NS = 'http://www.w3.org/2000/svg';

/**
 * Blueprint layer: monospace labels on both screen edges + elbow leader lines.
 * Adds its tweens to the master timeline `tl` starting at `t0` so everything
 * stays scrubbable. Lines are drawn with createDrawable (see anime.js).
 */
export function setupBlueprint({ pin, tl, t0, onHighlight }) {
  document.getElementById('bp-copy').textContent = site.blueprintCopy;
  const svg = pin.querySelector('.lines');
  const lists = { left: pin.querySelector('.tags-left'), right: pin.querySelector('.tags-right') };

  const items = PARTS.map((p, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag';
    btn.dataset.part = p.id;
    btn.innerHTML = `<span class="k">${String(i + 1).padStart(2, '0')}</span><span class="t"></span>`;
    btn.querySelector('.t').textContent = p.label;
    li.appendChild(btn);
    lists[p.side].appendChild(li);

    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', 'M0 0 L1 0');
    svg.appendChild(path);
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('r', '3.2');
    dot.setAttribute('cx', '-50');
    dot.setAttribute('cy', '-50');
    svg.appendChild(dot);

    const on = () => { btn.classList.add('on'); path.classList.add('hot'); onHighlight(p.id); };
    const off = () => { btn.classList.remove('on'); path.classList.remove('hot'); onHighlight(null); };
    btn.addEventListener('pointerenter', on);
    btn.addEventListener('pointerleave', off);
    btn.addEventListener('focus', on);
    btn.addEventListener('blur', off);

    return { ...p, li, btn, path, dot, rect: null };
  });

  // order within each side follows `order` (already the array order, but be explicit)
  const drawable = makeDrawable(items.map((i) => i.path));

  // timeline: labels slide in, lines draw, end dots pop
  const leftLis = items.filter((i) => i.side === 'left').map((i) => i.li);
  const rightLis = items.filter((i) => i.side === 'right').map((i) => i.li);
  tl.add(leftLis, { opacity: [0, 1], translateX: [-24, 0], duration: 900, ease: 'outQuart', delay: stagger(90) }, t0)
    .add(rightLis, { opacity: [0, 1], translateX: [24, 0], duration: 900, ease: 'outQuart', delay: stagger(90) }, t0)
    .add(drawable.targets, { ...drawable.from, duration: 1500, ease: 'inOutExpo', delay: stagger(130) }, t0 + 300)
    .add(items.map((i) => i.dot), { opacity: [0, 1], duration: 500, ease: 'outQuart', delay: stagger(130) }, t0 + 1200);

  /** Measure label anchor points relative to the pin (offset* ignores transforms). */
  function layout() {
    const rel = (el) => {
      let x = 0, y = 0, n = el;
      while (n && n !== pin) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };
    items.forEach((it) => { it.rect = rel(it.btn); });
  }

  const sideIndex = { left: 0, right: 0 };
  items.forEach((it) => { it.k = sideIndex[it.side]++; });

  /** Re-draw every leader line to follow its (moving) 3D anchor. */
  function update(project, enabled) {
    if (!enabled) return;
    items.forEach((it) => {
      const pt = project(it.id);
      if (!it.rect || !pt) return;
      const left = it.side === 'left';
      const x1 = left ? it.rect.x + it.rect.w : it.rect.x;
      const y1 = it.rect.y + it.rect.h / 2;
      const xm = x1 + (left ? 1 : -1) * (26 + it.k * 20);
      it.path.setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)} H${xm.toFixed(1)} V${pt.y.toFixed(1)} H${pt.x.toFixed(1)}`);
      it.dot.setAttribute('cx', pt.x.toFixed(1));
      it.dot.setAttribute('cy', pt.y.toFixed(1));
    });
  }

  return { layout, update };
}
