import { animate, stagger } from '../animations/anime.js';

const NS = 'http://www.w3.org/2000/svg';
const el = (name, attrs = {}, parent) => {
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
};
const LIME = [200, 255, 61], TEAL = [45, 212, 191], WHITE = [240, 244, 235];
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
const polar = (r, deg) => [Math.cos(((deg - 90) * Math.PI) / 180) * r, Math.sin(((deg - 90) * Math.PI) / 180) * r];

/**
 * The hero "signal core": concentric rings, radial ticks, a breathing waveform
 * made of stacked lines and a row of dots tracing a sine curve.
 * Returns { play(), frame(t), setPointer(x, y), setVisible(bool) }.
 */
export function mountSignalCore(host, { reduced, mobile }) {
  const svg = el('svg', { viewBox: '-300 -300 600 600', class: 'core-svg', focusable: 'false' }, host);

  const defs = el('defs', {}, svg);
  const glow = el('filter', { id: 'core-glow', x: '-25%', y: '-25%', width: '150%', height: '150%' }, defs);
  el('feGaussianBlur', { stdDeviation: mobile ? 0 : 9 }, glow);

  // parallax layers (outer group = pointer parallax, inner .spin = anime loops)
  const layers = [];
  const layer = (depth) => {
    const g = el('g', { class: 'layer' }, svg);
    const spin = el('g', { class: 'spin' }, g);
    layers.push({ g, depth });
    return spin;
  };

  // 1. outer segmented gradient ring + glow
  const ringLayer = layer(0.4);
  const SEG = mobile ? 36 : 56;
  const R0 = 262;
  const glowG = el('g', { filter: mobile ? '' : 'url(#core-glow)', opacity: 0.55 }, ringLayer);
  const segG = el('g', {}, ringLayer);
  const segs = [];
  for (let i = 0; i < SEG; i++) {
    const a0 = (i / SEG) * 360 + 1.2, a1 = ((i + 1) / SEG) * 360 - 1.2;
    const [x0, y0] = polar(R0, a0), [x1, y1] = polar(R0, a1);
    const u = i / SEG, v = u < 0.5 ? u * 2 : 2 - u * 2;
    const col = v < 0.5 ? mix(LIME, TEAL, v * 2) : mix(TEAL, WHITE, (v - 0.5) * 2);
    const d = `M${x0.toFixed(2)} ${y0.toFixed(2)} A${R0} ${R0} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    segs.push(el('path', { d, stroke: rgb(col), 'stroke-width': 11, fill: 'none', class: 'seg' }, segG));
    if (!mobile) el('path', { d, stroke: rgb(col), 'stroke-width': 16, fill: 'none' }, glowG);
  }

  // 2. radial ticks
  const tickLayer = layer(0.9);
  const TICKS = mobile ? 72 : 144;
  const ticks = [];
  for (let i = 0; i < TICKS; i++) {
    const long = i % 6 === 0;
    const g = el('g', { transform: `rotate(${(i / TICKS) * 360})` }, tickLayer);
    ticks.push(el('line', { x1: 0, x2: 0, y1: -226, y2: long ? -246 : -236, stroke: long ? '#ecebe6' : '#8b8a85', 'stroke-width': long ? 1.4 : 1, class: 'tk' }, g));
  }

  // 3. mid rings
  const midLayer = layer(1.4);
  const rings = [];
  rings.push(el('circle', { r: 206, class: 'ring', stroke: '#8b8a85', 'stroke-width': 1, 'stroke-dasharray': '1.5 9', opacity: 0.8 }, midLayer));
  rings.push(el('circle', { r: 184, class: 'ring', stroke: '#ecebe6', 'stroke-width': 1, opacity: 0.22 }, midLayer));
  rings.push(el('circle', { r: 156, class: 'ring', stroke: '#c8ff3d', 'stroke-width': 1.2, 'stroke-dasharray': '34 120', opacity: 0.9 }, midLayer));
  rings.push(el('circle', { r: 128, class: 'ring', stroke: '#8b8a85', 'stroke-width': 1, 'stroke-dasharray': '3 6', opacity: 0.5 }, midLayer));

  // 4. breathing waveform: stacked thin horizontal lines
  const waveLayer = layer(2.2);
  const N = mobile ? 13 : 21;
  const waves = [];
  for (let i = 0; i < N; i++) {
    const y = (i - (N - 1) / 2) * (mobile ? 9 : 7.2);
    const env = 0.28 + 0.72 * Math.abs(Math.sin(i * 0.62 + 0.4));
    const clip = Math.sqrt(Math.max(0, 1 - Math.pow(y / 104, 2)));
    const L = 92 * env * clip;
    const mid = i === (N - 1) / 2;
    waves.push(el('line', { x1: -L, x2: L, y1: y, y2: y, stroke: mid ? '#c8ff3d' : '#ecebe6', 'stroke-width': mid ? 1.6 : 1, opacity: mid ? 1 : 0.8, class: 'wv' }, waveLayer));
  }

  // 5. dots tracing a sine curve (moved per frame, transform only)
  const dotLayer = layer(2.8);
  const DOTS = mobile ? 21 : 33;
  const dots = [];
  for (let i = 0; i < DOTS; i++) {
    const x = (i - (DOTS - 1) / 2) * (mobile ? 11 : 8);
    dots.push(el('circle', { cx: x, cy: 0, r: i % 4 === 0 ? 2.6 : 1.8, fill: i % 4 === 0 ? '#c8ff3d' : '#ecebe6', class: 'dt' }, dotLayer));
  }
  const spins = layers.map((l) => l.g.firstChild);

  // initial hidden state (skipped for reduced motion)
  if (!reduced) {
    segs.forEach((s) => (s.style.opacity = 0));
    ticks.forEach((t) => (t.style.opacity = 0));
    rings.forEach((r) => (r.style.opacity = 0));
    waves.forEach((w) => (w.style.opacity = 0));
    dots.forEach((d) => (d.style.opacity = 0));
    glowG.style.opacity = 0;
  }

  const state = { mx: 0, my: 0, sx: 0, sy: 0, visible: true, t0: 0, looping: false };

  function play() {
    if (reduced) return;
    animate(segs, { opacity: [0, 1], duration: 900, delay: stagger(16), ease: 'outQuart' });
    animate(glowG, { opacity: [0, 0.55], duration: 1600, delay: 400, ease: 'outQuart' });
    animate(ticks, { opacity: [0, 1], translateY: [10, 0], duration: 900, delay: stagger(9, { from: 'first' }), ease: 'outQuart' });
    animate(rings, { opacity: (el_, i) => [0.8, 0.22, 0.9, 0.5][i] || 0.5, duration: 1200, delay: stagger(140, { start: 300 }), ease: 'outQuart' });
    animate(waves, { opacity: [0, 0.8], scaleX: [0, 1], duration: 1100, delay: stagger(40, { from: 'center', start: 500 }), ease: 'outExpo' });
    animate(dots, { opacity: [0, 1], duration: 700, delay: stagger(22, { start: 900 }), ease: 'outQuart' });

    // gentle loops: no linear easing, everything sways with sine
    animate(spins[1], { rotate: [-5, 5], duration: 9000, ease: 'inOutSine', loop: true, alternate: true });
    animate(spins[2], { rotate: [-14, 14], duration: 12000, ease: 'inOutSine', loop: true, alternate: true });
    animate(waves, { scaleX: [1, 0.42], duration: 1700, delay: stagger(90, { from: 'center', start: 1800 }), ease: 'inOutSine', loop: true, alternate: true });
    animate(spins[0], { rotate: [-3, 3], duration: 14000, ease: 'inOutSine', loop: true, alternate: true });
    state.looping = true;
    state.t0 = performance.now();
  }

  function frame(now) {
    if (!state.visible) return;
    state.sx += (state.mx - state.sx) * 0.07;
    state.sy += (state.my - state.sy) * 0.07;
    layers.forEach(({ g, depth }) => {
      g.style.transform = `translate(${(state.sx * depth * 9).toFixed(2)}px, ${(state.sy * depth * 9).toFixed(2)}px) rotate(${(state.sx * depth * 1.6).toFixed(2)}deg)`;
    });
    if (reduced) return;
    const t = ((now - state.t0) / 1000) * (state.looping ? 1 : 0);
    dots.forEach((d, i) => {
      d.style.transform = `translateY(${(Math.sin(i * 0.42 - t * 2.2) * 30 * (0.35 + 0.65 * Math.sin((i / DOTS) * Math.PI))).toFixed(2)}px)`;
    });
  }

  return {
    play,
    frame,
    setPointer(nx, ny) { state.mx = nx; state.my = ny; },
    setVisible(v) { state.visible = v; },
  };
}
