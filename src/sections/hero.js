import { animate, createTimeline, stagger } from '../animations/anime.js';
import { splitWords } from '../animations/split.js';
import { mountSignalCore } from '../scenes/signalCore.js';
import { site } from '../data/site.js';
import { toast } from './toast.js';

export function initHero({ scroll, reduced, mobile }) {
  const h1 = document.getElementById('hero-h');
  const words = splitWords(h1);
  const sub = document.getElementById('hero-sub');
  sub.textContent = site.heroSubtitle;

  const core = mountSignalCore(document.getElementById('core'), { reduced, mobile });

  // pointer parallax
  addEventListener('pointermove', (e) => core.setPointer((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1), { passive: true });
  scroll.onFrame(core.frame);
  new IntersectionObserver((e) => core.setVisible(e[0].isIntersecting)).observe(document.querySelector('.hero'));

  // copy-email pill
  const btn = document.getElementById('copy-email');
  const label = document.getElementById('copy-label');
  if (site.email) label.textContent = site.email;
  btn.addEventListener('click', async () => {
    if (!site.email) return toast('Add your email in src/data/site.js');
    try {
      await navigator.clipboard.writeText(site.email);
    } catch (e) {
      const ta = Object.assign(document.createElement('textarea'), { value: site.email });
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    label.textContent = 'Copied ✓';
    toast('Email copied');
    setTimeout(() => (label.textContent = site.email), 1600);
  });

  // entrance (after the loader lifts)
  const fadeTargets = ['.hero-eyebrow', '.hero-sub', '.cta', '.hero-foot', '.top'].map((s) => document.querySelector(s));
  if (!reduced) fadeTargets.forEach((t) => t && (t.style.opacity = 0));

  return {
    play() {
      if (reduced) return core.play();
      const tl = createTimeline({ defaults: { ease: 'outQuart' } });
      tl.add(fadeTargets[0], { opacity: [0, 1], translateY: [14, 0], duration: 800 }, 0)
        .add(words, { translateY: ['112%', '0%'], duration: 1300, ease: 'outExpo', delay: stagger(60) }, 100)
        .add(fadeTargets[1], { opacity: [0, 1], translateY: [18, 0], duration: 900 }, 700)
        .add(fadeTargets[2], { opacity: [0, 1], translateY: [18, 0], duration: 900 }, 850)
        .add(fadeTargets[3], { opacity: [0, 1], duration: 900 }, 1200)
        .add(fadeTargets[4], { opacity: [0, 1], duration: 900 }, 300);
      core.play();
    },
  };
}
