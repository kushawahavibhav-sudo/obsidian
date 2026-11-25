// Single import point for animejs v4 (pinned in package.json).
import * as A from 'animejs';
import { animate, createTimeline, stagger, onScroll, createDraggable, createSpring, utils } from 'animejs';

export { animate, createTimeline, stagger, onScroll, createDraggable, createSpring, utils };

/**
 * createDrawable moved between v4 releases (top-level export vs `svg.createDrawable`).
 * Look it up dynamically so either layout works, and fall back to plain
 * stroke-dashoffset if neither exists.
 * Returns { targets, from } where `from` is the property map to spread into a tween.
 */
export function makeDrawable(paths) {
  const fn = A['createDrawable'] || (A['svg'] && A['svg']['createDrawable']);
  if (fn) {
    try {
      return { targets: fn(paths), from: { draw: ['0 0', '0 1'] } };
    } catch (e) {
      /* fall through */
    }
  }
  paths.forEach((p) => {
    p.setAttribute('pathLength', '1');
    p.style.strokeDasharray = '1';
    p.style.strokeDashoffset = '1';
  });
  return { targets: paths, from: { strokeDashoffset: [1, 0] } };
}
