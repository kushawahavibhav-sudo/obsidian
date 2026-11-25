import Lenis from 'lenis';

const inOutExpo = (t) => (t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2);

/** Smooth scroll (Lenis) + one shared rAF ticker. With reduced motion Lenis is off. */
export function createScroll({ reduced }) {
  let lenis = null;
  const scrollFns = new Set();
  const frameFns = new Set();

  if (!reduced) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.on('scroll', () => scrollFns.forEach((f) => f()));
  } else {
    addEventListener('scroll', () => scrollFns.forEach((f) => f()), { passive: true });
  }

  const raf = (t) => {
    if (lenis) lenis.raf(t);
    frameFns.forEach((f) => f(t));
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  return {
    lenis,
    onScroll: (f) => scrollFns.add(f),
    onFrame: (f) => frameFns.add(f),
    scrollTo(target, { immediate = false, duration = 1.5, offset = 0 } = {}) {
      if (lenis) {
        lenis.scrollTo(target, { immediate, duration, offset, easing: inOutExpo });
      } else {
        const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + scrollY;
        scrollTo({ top: y + offset, behavior: 'auto' });
      }
    },
    stop() {
      lenis ? lenis.stop() : document.body.classList.add('locked');
    },
    start() {
      lenis ? lenis.start() : document.body.classList.remove('locked');
    },
  };
}
