import * as THREE from 'three';
import { buildPhone } from './phoneModel.js';

/**
 * Renderer + camera + lights around the procedural phone.
 * The scroll timeline writes into the shared state object `S`; render() just reads it.
 */
export function createPhoneScene({ canvas, S, reduced }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  // flat toon lighting + a soft lime rim from behind
  scene.add(new THREE.AmbientLight(0xffffff, 1.7));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(3, 5, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc8ff3d, 2.6);
  rim.position.set(-5, 3, -6);
  scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0xc8ff3d, 1.4);
  rim2.position.set(5, -2, -5);
  scene.add(rim2);

  const phone = buildPhone();
  const rig = new THREE.Group();
  rig.add(phone.root);
  scene.add(rig);

  const layout = { spread: 1, dist: 15 };
  const hv = {}, dv = {}; // eased highlight / dim per part
  let hl = null;
  let theme = -1;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const narrow = camera.aspect < 0.9;
    layout.spread = narrow ? 0.55 : 1;
    const needH = 7.2 / 0.82;
    const needW = (narrow ? 8.6 : 8.4) / 0.94;
    layout.dist = Math.max(needH / (2 * tan), needW / (2 * tan * camera.aspect));
  }
  resize();
  addEventListener('resize', resize);

  const tmp = new THREE.Vector3();
  const lerp = THREE.MathUtils.lerp;

  function render(time) {
    const t = reduced ? 0 : time;
    const yaw = lerp(0.55, Math.PI + 0.08, S.yaw) + Math.sin(t * 0.35) * 0.3;
    const pitch = 0.14 + S.yaw * 0.1 + Math.sin(t * 0.27) * 0.04;
    rig.rotation.set(pitch, yaw, lerp(-0.05, 0, S.yaw));
    const s = lerp(1, 0.94, S.theme);
    rig.scale.setScalar(s);
    rig.position.x = S.door * (1 - S.arc) * 0.8 * layout.spread;

    phone.apply(S, layout);

    camera.position.set(S.drift * 1.3, 0.3 + S.drift * 0.9, layout.dist * (1 - 0.05 * S.drift));
    camera.lookAt(0, 0, 0);

    // ease hover highlight
    const ids = Object.keys(phone.anchors);
    for (const id of ids) {
      hv[id] = (hv[id] || 0) + ((hl === id ? 1 : 0) - (hv[id] || 0)) * 0.2;
      dv[id] = (dv[id] || 0) + ((hl && hl !== id ? 1 : 0) - (dv[id] || 0)) * 0.2;
    }
    phone.paint(S.theme, hv, dv);
    renderer.render(scene, camera);
  }

  /** Screen position (px, relative to the canvas) of a part's anchor. */
  function project(id) {
    const a = phone.anchors[id];
    if (!a) return null;
    a.getWorldPosition(tmp);
    tmp.project(camera);
    return { x: (tmp.x * 0.5 + 0.5) * canvas.clientWidth, y: (-tmp.y * 0.5 + 0.5) * canvas.clientHeight };
  }

  return {
    render,
    resize,
    project,
    setHighlight(id) { hl = id; },
    dispose() {
      removeEventListener('resize', resize);
      renderer.dispose();
    },
  };
}
