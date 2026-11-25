import { projects } from '../data/projects.js';
import { mountThumb } from '../animations/thumbs.js';
import { scrollPlay, revealHeading } from '../animations/reveal.js';
import { initDetail } from './detail.js';

export function initWork({ scroll, reduced }) {
  const grid = document.getElementById('projects');
  const detail = initDetail({ scroll, reduced });

  // heading: masked words + slow horizontal drift of the two lines (transform only)
  const h = document.getElementById('wk-h');
  const l1 = h.querySelector('.l1'), l2 = h.querySelector('.l2');
  revealHeading(h, { reduced });
  if (!reduced) {
    scroll.onFrame(() => {
      const r = h.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return;
      const sx = (r.top - innerHeight * 0.5) * 0.22;
      l1.style.transform = `translate3d(${sx.toFixed(1)}px,0,0)`;
      l2.style.transform = `translate3d(${(-sx).toFixed(1)}px,0,0)`;
    });
  }

  projects.forEach((p, i) => {
    const n = String(i + 1).padStart(2, '0');
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-head"><span class="num" aria-hidden="true">${n}</span><span class="label">${p.cat}</span></div>
      <div class="tilt"><div class="thumb"><canvas aria-hidden="true"></canvas><span class="chip label">${p.year}</span></div></div>
      <h3><button type="button" class="open" aria-haspopup="dialog">${p.name}</button></h3>
      <p class="desc">${p.desc}</p>
      <ul class="tags-line">${p.tech.map((t) => `<li>${t}</li>`).join('')}</ul>
      <span class="go label" aria-hidden="true">Open project →</span>`;
    grid.appendChild(card);

    const thumbEl = card.querySelector('.thumb');
    const th = mountThumb(thumbEl.querySelector('canvas'), p.thumb, { reduced });

    // hover: thumbnail tilts toward the cursor
    card.addEventListener('pointerenter', () => { th.setHover(true); thumbEl.classList.add('live'); });
    card.addEventListener('pointermove', (e) => {
      const r = thumbEl.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
      th.pointer(Math.min(1, Math.max(0, nx)), Math.min(1, Math.max(0, ny)));
      if (!reduced) thumbEl.style.transform = `rotateY(${((nx - 0.5) * 12).toFixed(2)}deg) rotateX(${((0.5 - ny) * 10).toFixed(2)}deg) translateZ(0)`;
    });
    card.addEventListener('pointerleave', () => { th.setHover(false); thumbEl.style.transform = ''; });

    card.querySelector('.open').addEventListener('click', () => detail.open(i, card));

    // scroll reveal: fade, rise, slight rotate, staggered per column
    if (reduced) card.style.opacity = 1;
    else scrollPlay(card, card, {
      opacity: [0, 1],
      translateY: [90, 0],
      rotate: [i % 2 ? 2.5 : -2.5, 0],
      duration: 1300,
      delay: (i % 2) * 160,
      ease: 'outQuart',
    }, { enter: 'bottom-=90 top' });
  });
}
