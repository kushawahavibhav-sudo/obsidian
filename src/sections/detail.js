import { animate, stagger, utils } from '../animations/anime.js';
import { mountThumb } from '../animations/thumbs.js';
import { projects } from '../data/projects.js';

/** Full-screen project detail: the panel grows from the card's rect (FLIP), no page reload. */
export function initDetail({ scroll, reduced }) {
  const root = document.getElementById('detail');
  const panel = root.querySelector('.d-panel');
  const body = root.querySelector('.d-body');
  const q = (id) => document.getElementById(id);
  const closeBtn = q('d-close');
  let index = 0, opener = null, thumb = null, isOpen = false, busy = false;

  function fill(i) {
    const p = projects[i];
    index = i;
    q('d-num').textContent = String(i + 1).padStart(2, '0');
    q('d-cat').textContent = `${p.cat} · ${p.year}`;
    q('d-title').textContent = p.name;
    q('d-desc').textContent = p.desc;
    q('d-points').innerHTML = p.points.map((x) => `<li>${x}</li>`).join('');
    q('d-tags').innerHTML = p.tech.map((x) => `<li>${x}</li>`).join('');
    const link = q('d-link');
    if (p.url) { link.href = p.url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'View project'; link.classList.remove('off'); }
    else { link.removeAttribute('href'); link.textContent = 'Link coming soon'; link.classList.add('off'); link.setAttribute('aria-disabled', 'true'); }
    thumb && thumb.destroy();
    thumb = mountThumb(q('d-canvas'), p.thumb, { reduced });
    thumb.setHover(true);
  }

  const items = () => [...body.querySelectorAll('.d-num, .label, #d-title, .d-desc, .d-points, .d-tags, .d-actions, .d-vis')];

  function open(i, cardEl) {
    if (isOpen || busy) return;
    busy = true; isOpen = true; opener = cardEl;
    fill(i);
    root.hidden = false;
    scroll.stop();
    body.scrollTop = 0;
    const r = (cardEl || document.body).getBoundingClientRect();

    if (reduced) {
      utils.set(panel, { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1 });
      animate(root, { opacity: [0, 1], duration: 250, ease: 'outQuart', onComplete: () => { busy = false; closeBtn.focus(); } });
      return;
    }
    utils.set(body, { opacity: 0 });
    utils.set(panel, { translateX: r.left, translateY: r.top, scaleX: r.width / innerWidth, scaleY: r.height / innerHeight, opacity: 1 });
    animate(panel, {
      translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, duration: 950, ease: 'inOutExpo',
      onComplete: () => {
        utils.set(body, { opacity: 1 });
        animate(items(), { opacity: [0, 1], translateY: [34, 0], duration: 900, delay: stagger(65), ease: 'outQuart' });
        busy = false;
        closeBtn.focus();
      },
    });
  }

  function close() {
    if (!isOpen || busy) return;
    busy = true;
    const done = () => {
      root.hidden = true; isOpen = false; busy = false;
      thumb && thumb.destroy(); thumb = null;
      scroll.start();
      opener && opener.querySelector('.open') && opener.querySelector('.open').focus({ preventScroll: true });
    };
    if (reduced) return void animate(root, { opacity: [1, 0], duration: 200, ease: 'outQuart', onComplete: done });
    animate(items(), { opacity: 0, translateY: 20, duration: 300, ease: 'outQuart' });
    const r = (opener || document.body).getBoundingClientRect();
    animate(panel, {
      translateX: r.left, translateY: r.top, scaleX: r.width / innerWidth, scaleY: r.height / innerHeight,
      opacity: [1, 0.0], duration: 800, delay: 200, ease: 'inOutExpo',
      onBegin: () => utils.set(body, { opacity: 0 }),
      onComplete: done,
    });
  }

  function next() {
    if (busy) return;
    animate(items(), {
      opacity: 0, translateY: -16, duration: 220, ease: 'outQuart',
      onComplete: () => {
        fill((index + 1) % projects.length);
        body.scrollTop = 0;
        animate(items(), { opacity: [0, 1], translateY: [24, 0], duration: 700, delay: stagger(50), ease: 'outQuart' });
      },
    });
  }

  closeBtn.addEventListener('click', close);
  q('d-next').addEventListener('click', next);
  q('d-link').addEventListener('click', (e) => { if (e.currentTarget.classList.contains('off')) e.preventDefault(); });
  addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { // keep focus inside the dialog
      const f = [...root.querySelectorAll('button, a[href]')].filter((n) => n.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  return { open };
}
