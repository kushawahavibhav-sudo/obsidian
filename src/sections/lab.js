import { animate, createDraggable, createSpring, stagger } from '../animations/anime.js';
import { revealHeading } from '../animations/reveal.js';
import { site } from '../data/site.js';

export function initLab({ reduced, mobile }) {
  revealHeading(document.getElementById('lab-h'), { reduced });

  /* draggable element with spring release */
  try {
    createDraggable('#lab-chip', {
      container: '#lab-pad',
      releaseEase: createSpring({ stiffness: 140, damping: 8 }),
    });
  } catch (e) {
    console.warn('draggable unavailable', e);
  }

  /* dot grid that ripples from the click point (grid stagger) */
  const wrap = document.getElementById('lab-dots');
  const cols = mobile ? 12 : 20, rows = mobile ? 7 : 10;
  wrap.style.setProperty('--cols', cols);
  const dots = [];
  for (let i = 0; i < cols * rows; i++) {
    const d = document.createElement('i');
    wrap.appendChild(d);
    dots.push(d);
  }
  const ripple = (idx) => {
    if (reduced) return;
    animate(dots, {
      scale: [{ to: 2.8, duration: 240, ease: 'outQuart' }, { to: 1, duration: 800, ease: 'outQuart' }],
      opacity: [{ to: 1, duration: 240, ease: 'outQuart' }, { to: 0.22, duration: 800, ease: 'outQuart' }],
      delay: stagger(42, { grid: [cols, rows], from: idx }),
    });
  };
  wrap.addEventListener('pointerdown', (e) => {
    const r = wrap.getBoundingClientRect();
    const c = Math.min(cols - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * cols)));
    const rw = Math.min(rows - 1, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * rows)));
    ripple(rw * cols + c);
  });
  new IntersectionObserver((e, io) => { if (e[0].isIntersecting) { io.disconnect(); ripple(Math.floor((rows / 2) * cols + cols / 2)); } }, { threshold: 0.6 }).observe(wrap);

  /* fake terminal: types a boot message when scrolled into view */
  const out = document.getElementById('term-out');
  const lines = site.terminal;
  const render = (done, partial) => {
    const html = done.map((l) => esc(l).replace(/(\.\.\. )(ok)$/, '$1<span class="ok">$2</span>')).join('\n');
    out.innerHTML = html + (partial !== null ? (done.length ? '\n' : '') + esc(partial) + '<span class="caret"></span>' : '<span class="caret"></span>');
  };
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  if (reduced) { render(lines, null); return; }
  render([], '');
  let started = false;
  new IntersectionObserver((e, io) => {
    if (!e[0].isIntersecting || started) return;
    started = true; io.disconnect();
    const done = [];
    const typeLine = (i) => {
      if (i >= lines.length) return render(done, null);
      const st = { n: 0 };
      animate(st, {
        n: lines[i].length,
        duration: Math.max(500, lines[i].length * 38),
        ease: 'outQuad',
        onUpdate: () => render(done, lines[i].slice(0, Math.round(st.n))),
        onComplete: () => { done.push(lines[i]); setTimeout(() => typeLine(i + 1), 220); },
      });
    };
    typeLine(0);
  }, { threshold: 0.5 }).observe(out);
}
