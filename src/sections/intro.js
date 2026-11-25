import { animate } from '../animations/anime.js';

/** Loader curtain tied to real readiness (fonts). Resolves as the curtain starts to lift. */
export function runIntro({ reduced }) {
  const intro = document.getElementById('intro');
  if (reduced) {
    intro.remove();
    return Promise.resolve();
  }
  const pct = document.getElementById('pct');
  const fonts = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2200))]);

  return new Promise((resolve) => {
    const counter = { v: 0 };
    animate(counter, {
      v: 88,
      duration: 1100,
      ease: 'outQuart',
      onUpdate: () => (pct.textContent = String(Math.round(counter.v)).padStart(3, '0')),
      onComplete: () => {
        fonts.then(() => {
          animate(counter, {
            v: 100,
            duration: 350,
            ease: 'outQuart',
            onUpdate: () => (pct.textContent = String(Math.round(counter.v)).padStart(3, '0')),
            onComplete: () => {
              animate(intro, {
                translateY: ['0%', '-100%'],
                duration: 1000,
                ease: 'inOutExpo',
                onComplete: () => intro.remove(),
              });
              setTimeout(resolve, 520);
            },
          });
        });
      },
    });
  });
}
