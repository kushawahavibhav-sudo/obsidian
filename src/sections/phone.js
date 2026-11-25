import { createTimeline, animate, stagger } from '../animations/anime.js';
import { TOTAL, STEPS, createState } from '../scenes/phoneSpec.js';
import { setupBlueprint } from './blueprint.js';
import { initScrubber } from './scrubber.js';

/**
 * The pinned scene: one master anime timeline, driven by scroll progress.
 * progress → tl.seek(progress * TOTAL) → writes S (3D state) + DOM overlays.
 * The three.js scene is created lazily when the section nears the viewport,
 * and its render loop only runs while the section is on screen.
 */
export function initStage({ scroll, reduced, mobile, nav }) {
  const stage = document.getElementById('phone');
  const pin = stage.querySelector('.pin');
  const canvas = document.getElementById('phone-canvas');
  const paper = stage.querySelector('.paper');
  const intro = stage.querySelector('.phone-intro');
  const head = stage.querySelector('.bp-head');
  const stepEl = stage.querySelector('.step');
  const S = createState();
  let scene = null;
  let visible = false;
  let blueprintOn = false;

  /* ---------- the master timeline (ms) ---------- */
  const tl = createTimeline({ autoplay: false, defaults: { ease: 'inOutExpo' } });
  tl.add(S, { unlatch: [0, 1], duration: 800, ease: 'outQuart' }, 0)              // 1. back panel unlatches
    .add(S, { slide: [0, 1], duration: 1000 }, 800)                                // …slides down slightly
    .add(S, { door: [0, 1], duration: 1900 }, 1800)                                // …swings open on the side hinge
    .add(S, { yaw: [0, 1], duration: 2800 }, 1500)                                 // turn the phone to show the inside
    .add(S, { bat: [0, 1], duration: 1500, ease: 'outQuart' }, 3600)               // 2. battery lifts out…
    .add(S, { arc: [0, 1], duration: 1800 }, 4300)                                 // …and slides away along an arc
    .add(S, { board: [0, 1], duration: 1900 }, 5200)                               // 3. board rises and separates
    .add(S.chips, { v: [0, 1], duration: 1000, ease: 'outQuart', delay: stagger(120) }, 6200)   // chips, staggered
    .add(S.cam, { v: [0, 1], duration: 1000, ease: 'outQuart', delay: stagger(150) }, 6500)     // camera layers, staggered
    .add(S, { drift: [0, 1], duration: 3600, ease: 'inOutSine' }, 5200)            // 4. camera drifts in
    .add(intro, { opacity: [1, 0], translateY: [0, -24], duration: 700, ease: 'outQuart' }, 900)
    .add(paper, { opacity: [0, 1], duration: 2200, ease: 'inOutSine' }, 7800)      // blueprint paper fades in
    .add(S, { theme: [0, 1], duration: 2200, ease: 'inOutSine' }, 7800)
    .add(head, { opacity: [0, 1], translateY: [24, 0], duration: 1100, ease: 'outQuart' }, 8800);

  const bp = setupBlueprint({
    pin, tl, t0: 9300,
    onHighlight: (id) => scene && scene.setHighlight(id),
  });
  tl.add(S, { end: [0, 1], duration: 400 }, TOTAL - 400); // pads the timeline to exactly TOTAL

  /* ---------- scroll progress ---------- */
  const range = () => {
    const top = stage.offsetTop;
    return { top, range: Math.max(1, stage.offsetHeight - innerHeight) };
  };
  let rangeCache = range();
  const scrub = initScrubber({ el: document.getElementById('scrub'), getRange: () => rangeCache, scroll, reduced });
  const measureAll = () => { rangeCache = range(); bp.layout(); scrub.measure(); scene && scene.resize(); };
  addEventListener('resize', measureAll);

  const progress = () => {
    const r = stage.getBoundingClientRect();
    return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
  };

  let target = 0, cur = 0, lastStep = -1, lastSeek = -1;
  function setStep(timeMs) {
    let idx = 0;
    STEPS.forEach(([t], i) => { if (timeMs >= t) idx = i; });
    if (pin.classList.contains('no-gl')) return;
    if (idx !== lastStep) { lastStep = idx; stepEl.textContent = STEPS[idx][1]; }
  }

  /* ---------- reduced motion: crossfade between two states ---------- */
  let openState = false, switching = false;
  function showState(open) {
    tl.seek(open ? TOTAL : 0);
    S.chips.forEach((c) => (c.v = open ? 1 : 0));
    setStep(open ? TOTAL : 0);
    blueprintOn = open;
    pin.classList.toggle('is-paper', open);
    nav.setPaper(open);
    scene && scene.render(0);
    bp.update((id) => scene && scene.project(id), open);
    scrub.set(open ? 1 : 0);
  }

  /* ---------- per-frame driver ---------- */
  scroll.onFrame((now) => {
    const p = progress();
    target = p;

    if (reduced) {
      const wantOpen = p > 0.5;
      if (wantOpen !== openState && !switching) {
        switching = true;
        animate(pin, { opacity: [1, 0], duration: 260, ease: 'outQuart', onComplete: () => {
          openState = wantOpen;
          showState(openState);
          animate(pin, { opacity: [0, 1], duration: 360, ease: 'outQuart', onComplete: () => (switching = false) });
        } });
      }
      return;
    }

    cur += (target - cur) * 0.18;
    if (Math.abs(target - cur) < 0.0002) cur = target;
    const time = cur * TOTAL;
    const inView = p > 0 || cur > 0;
    if (inView && time !== lastSeek) {
      tl.seek(time);
      lastSeek = time;
      setStep(time);
      const paperOn = S.theme > 0.55;
      if (paperOn !== blueprintOn) {
        blueprintOn = paperOn;
        pin.classList.toggle('is-paper', paperOn);
      }
      scrub.set(cur);
    }
    // top bar goes dark-on-paper only while the pinned scene is on screen
    const r = stage.getBoundingClientRect();
    const pinned = r.top < 60 && r.bottom > 60;
    nav.setPaper(pinned && S.theme > 0.55);

    if (visible && scene) {
      scene.render(now / 1000);
      bp.update((id) => scene.project(id), time > 9300);
    }
  });

  /* ---------- lazy-init + pause off-screen ---------- */
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { rootMargin: '0px' }).observe(stage);
  let loading = false;
  async function boot() {
    if (loading) return;
    loading = true;
    try {
      const { createPhoneScene } = await import('../scenes/phoneScene.js');
      scene = createPhoneScene({ canvas, S, reduced });
      canvas.addEventListener('webglcontextlost', (ev) => {
        ev.preventDefault();
        scene = null;
        pin.classList.add('no-gl');
        stepEl.textContent = '3D error: WebGL context lost';
      });
      measureAll();
      if (reduced) showState(openState);
    } catch (err) {
      console.warn('3D scene unavailable', err);
      pin.classList.add('no-gl');
      stepEl.textContent = '3D error: ' + (err && err.message ? err.message : err);
    }
  }
  new IntersectionObserver((e) => { if (e[0].isIntersecting) boot(); }, { rootMargin: '900px 0px' }).observe(stage);

  tl.seek(0);
  setStep(0);
  bp.layout();
  if (reduced) { tl.seek(0); }
}
