// Animated 2D-canvas thumbnails for project cards (one per `thumb` type).
const LIME = '#c8ff3d', TEXT = '#ecebe6', MUTE = '#8b8a85', DIM = '#2a2c30';

export function mountThumb(canvas, type, { reduced = false } = {}) {
  const g = canvas.getContext('2d');
  let dpr = 1, W = 0, H = 0, t = 0, run = false, hover = 0, hoverT = 0, mx = 0.5, my = 0.5, raf = 0;

  const nodes = Array.from({ length: 44 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random(), p: Math.random() * 6 }));
  const codeLines = Array.from({ length: 16 }, (_, i) => ({ w: 0.2 + Math.random() * 0.55, s: 0.4 + Math.random(), ind: i % 4 }));
  const tokens = Array.from({ length: 70 }, () => 0.5 + Math.random() * 1.6);

  function size() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = Math.max(1, Math.round(r.width * dpr));
    H = canvas.height = Math.max(1, Math.round(r.height * dpr));
  }
  const font = (px) => `${px * dpr}px "JetBrains Mono", ui-monospace, monospace`;
  const rr = (x, y, w, h, r) => {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  };

  const draw = {
    neural() {
      const P = nodes.map((n) => ({
        x: (n.x + Math.sin(t * 0.5 + n.p) * 0.02 + (mx - 0.5) * 0.06 * n.z) * W,
        y: (n.y + Math.cos(t * 0.4 + n.p) * 0.02 + (my - 0.5) * 0.06 * n.z) * H,
        z: n.z,
      }));
      g.lineWidth = dpr;
      for (let i = 0; i < P.length; i++)
        for (let j = i + 1; j < P.length; j++) {
          const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y), lim = W * 0.17;
          if (d < lim) {
            g.strokeStyle = `rgba(236,235,230,${(1 - d / lim) * 0.35})`;
            g.beginPath(); g.moveTo(P[i].x, P[i].y); g.lineTo(P[j].x, P[j].y); g.stroke();
          }
        }
      P.forEach((p, i) => {
        g.globalAlpha = 0.4 + p.z * 0.6;
        g.fillStyle = i % 9 === 0 ? LIME : TEXT;
        g.beginPath(); g.arc(p.x, p.y, (1.5 + p.z * 3) * dpr, 0, 7); g.fill();
      });
      g.globalAlpha = 1;
      const pulse = (t * 0.25) % 1;
      g.strokeStyle = 'rgba(200,255,61,.55)';
      g.beginPath(); g.arc(mx * W, my * H, pulse * W * 0.3, 0, 7); g.stroke();
    },

    island() {
      // perspective floor grid
      g.strokeStyle = '#17191d'; g.lineWidth = dpr;
      const hz = H * 0.38;
      for (let i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(W / 2 + i * W * 0.02, hz); g.lineTo(W / 2 + i * W * 0.14, H); g.stroke(); }
      for (let k = 1; k < 10; k++) { const y = hz + Math.pow(k / 10, 2) * (H - hz); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
      // the island morphs between idle pill and expanded card
      const e = hover;
      const w = W * (0.26 + 0.46 * e), h = H * (0.12 + 0.2 * e), x = (W - w) / 2, y = H * (0.2 + 0.04 * e);
      g.fillStyle = '#000'; g.strokeStyle = '#34363b';
      rr(x, y, w, h, h / 2); g.fill(); g.stroke();
      g.fillStyle = LIME; g.beginPath(); g.arc(x + h / 2, y + h / 2, 5 * dpr, 0, 7); g.fill();
      if (e > 0.45) {
        g.globalAlpha = Math.min(1, (e - 0.45) * 2.2);
        g.fillStyle = TEXT; g.font = font(11);
        g.fillText('Listening… "what\'s on my calendar?"', x + h / 2 + 16 * dpr, y + h / 2 + 4 * dpr);
        g.globalAlpha = 1;
      }
    },

    code() {
      codeLines.forEach((l, i) => {
        const y = ((i + 1) * H) / 17;
        const grow = Math.min(1, ((t * l.s * 0.5) % 1.3) + 0.15);
        g.fillStyle = i === Math.floor(t * 2) % 16 ? LIME : '#383b40';
        g.fillRect(W * 0.1 + l.ind * 18 * dpr, y, l.w * W * 0.6 * grow, 6 * dpr);
        g.fillStyle = '#5b5d62'; g.font = font(11);
        g.fillText(String(i + 1).padStart(2, '0'), W * 0.03, y + 7 * dpr);
      });
      g.strokeStyle = 'rgba(236,235,230,.5)'; g.lineWidth = dpr;
      g.strokeRect(W * 0.08, ((Math.floor(t * 2) % 16) + 1) * (H / 17) - 6 * dpr, W * 0.8, 18 * dpr);
    },

    rom() {
      // partitions "flashing" one after another
      const parts = ['boot', 'recovery', 'vendor', 'system', 'userdata'];
      g.font = font(10);
      parts.forEach((name, i) => {
        const y = H * (0.16 + i * 0.16), x = W * 0.12, w = W * 0.76, h = 14 * dpr;
        const prog = Math.min(1, Math.max(0, ((t * 0.28 + (hover ? 0.1 : 0)) % 1.6) * 1.4 - i * 0.22));
        g.fillStyle = MUTE; g.fillText(name, x, y - 6 * dpr);
        g.fillStyle = DIM; g.fillRect(x, y, w, h);
        g.fillStyle = prog >= 1 ? TEXT : LIME; g.fillRect(x, y, w * prog, h);
        g.fillStyle = MUTE; g.textAlign = 'right';
        g.fillText(prog >= 1 ? 'OK' : `${Math.round(prog * 100)}%`, x + w, y - 6 * dpr);
        g.textAlign = 'left';
      });
    },

    llm() {
      // a stream of tokens appearing one by one
      const cols = 11, gap = 8 * dpr, rowH = 22 * dpr, x0 = W * 0.08, x1 = W * 0.92;
      const shown = Math.floor((t * (hover ? 22 : 12)) % (tokens.length + 14));
      let x = x0, y = H * 0.16;
      const unit = (x1 - x0 - gap * (cols - 1)) / cols;
      for (let i = 0; i < Math.min(shown, tokens.length); i++) {
        const w = unit * Math.min(1.9, tokens[i]);
        if (x + w > x1) { x = x0; y += rowH + 6 * dpr; }
        g.fillStyle = i === shown - 1 ? LIME : '#3a3d43';
        rr(x, y, w, rowH, 5 * dpr); g.fill();
        x += w + gap;
      }
      if (Math.floor(t * 2) % 2 === 0) { g.fillStyle = LIME; g.fillRect(x, y, 7 * dpr, rowH); }
      g.fillStyle = MUTE; g.font = font(10);
      g.fillText('llama.cpp · on-device', W * 0.08, H * 0.93);
    },
  };

  function frame() {
    if (!run) return;
    t += 0.016;
    hover += (hoverT - hover) * 0.08;
    g.clearRect(0, 0, W, H);
    (draw[type] || draw.neural)();
    raf = requestAnimationFrame(frame);
  }

  size();
  const ro = new ResizeObserver(() => { size(); if (!run) staticFrame(); });
  ro.observe(canvas);
  function staticFrame() { t = 3.2; hover = hoverT; g.clearRect(0, 0, W, H); (draw[type] || draw.neural)(); }

  const io = new IntersectionObserver((e) => {
    if (e[0].isIntersecting && !reduced) { if (!run) { run = true; frame(); } }
    else { run = false; cancelAnimationFrame(raf); if (e[0].isIntersecting) staticFrame(); }
  });
  io.observe(canvas);

  return {
    pointer(nx, ny) { mx = nx; my = ny; },
    setHover(on) { hoverT = on ? 1 : 0; if (reduced) { hover = hoverT; staticFrame(); } },
    destroy() { run = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); },
  };
}
