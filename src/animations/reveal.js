import { animate, onScroll, stagger } from './anime.js';
import { splitWords } from './split.js';

/**
 * Play an animation once when `el` scrolls into view, driven by anime's onScroll.
 * A tiny IntersectionObserver backs it up so content can never stay hidden.
 */
export function scrollPlay(el, targets, params, { enter = 'bottom-=70 top', reduced = false } = {}) {
  if (reduced) {
    return null;
  }
  let started = false;
  let anim;
  try {
    anim = animate(targets, {
      ...params,
      autoplay: onScroll({ target: el, enter }),
      onBegin: () => {
        started = true;
        params.onBegin && params.onBegin();
      },
    });
  } catch (e) {
    return animate(targets, params);
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      setTimeout(() => {
        if (!started) {
          started = true;
          anim.play();
        }
      }, 700);
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  io.observe(el);
  return anim;
}

/** Split a heading into masked words and stagger them up when it enters. */
export function revealHeading(el, { reduced = false } = {}) {
  const words = splitWords(el);
  if (reduced) return;
  scrollPlay(el, words, {
    translateY: ['112%', '0%'],
    duration: 1200,
    delay: stagger(70),
    ease: 'outExpo',
  }, { reduced });
}

/** Fade and rise a set of elements when `trigger` enters. */
export function revealItems(trigger, items, { reduced = false, delay = 80 } = {}) {
  if (reduced) return;
  scrollPlay(trigger, items, {
    opacity: [0, 1],
    translateY: [28, 0],
    duration: 1000,
    delay: stagger(delay),
    ease: 'outQuart',
  });
}
