import { animate } from '../animations/anime.js';

let timer;
export function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  clearTimeout(timer);
  animate(t, { opacity: [0, 1], translateY: [20, 0], duration: 450, ease: 'outQuart' });
  timer = setTimeout(() => animate(t, { opacity: 0, translateY: 20, duration: 400, ease: 'outQuart' }), 1800);
}
