import * as THREE from 'three';
import { CHIP_COUNT, CAM_LAYERS } from './phoneSpec.js';

/*
 * Procedural smartphone, built from primitives only. Units are arbitrary.
 *   +z = front (screen) · -z = back · +x = hinge side of the back panel
 * Depth stack (z):  front glass 0.20..0.24 · frame -0.20..0.20 · back panel -0.24..-0.20
 * Every movable part sits on its own pivot (Group) so it rotates around the right hinge:
 *   backPivot  – side hinge at x = +HX, also slides down + pops out for the "unlatch"
 *   batPivot   – lifts out along -z, then travels along an arc
 *   boardPivot – rises along -z; chip pivots + camera layer pivots lift further, staggered
 */
const W = 3.0, H = 6.2, D = 0.4, R = 0.36;
const HX = W / 2 - 0.01;
const BACK_Z = -0.22;
const CAM = { x: -0.65, y: 2.2 };
const BOARD_Y = 1.4, BOARD_Z = -0.14, BAT_Y = -1.45;

const PAPER = new THREE.Color(0xe9e6df);
const LIME = new THREE.Color(0xc8ff3d);
const EDGE_DARK = new THREE.Color(0xb9b8b0);
const EDGE_PAPER = new THREE.Color(0x4a4a46);
const BG_DARK = new THREE.Color(0x0e0f11);
const HOT_EDGE = new THREE.Color(0x1d2600);

function rrPath(p, w, h, r, ox = 0, oy = 0) {
  const x = ox - w / 2, y = oy - h / 2;
  p.moveTo(x + r, y);
  p.lineTo(x + w - r, y);
  p.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  p.lineTo(x + w, y + h - r);
  p.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  p.lineTo(x + r, y + h);
  p.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  p.lineTo(x, y + r);
  p.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return p;
}

/** Rounded-rectangle slab (optionally with rounded holes), centred on the origin. */
function slab(w, h, r, depth, holes = []) {
  const s = rrPath(new THREE.Shape(), w, h, r);
  holes.forEach((o) => s.holes.push(rrPath(new THREE.Path(), o.w, o.h, o.r, o.x, o.y)));
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 10 });
  g.translate(0, 0, -depth / 2);
  return g;
}
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (r, h, seg = 36) => new THREE.CylinderGeometry(r, r, h, seg).rotateX(Math.PI / 2); // axis along z

export function buildPhone() {
  const root = new THREE.Group();
  const reg = []; // { part, fill, edge, base }
  const anchors = {};

  const tone = new THREE.DataTexture(new Uint8Array([72, 150, 255]), 3, 1, THREE.RedFormat);
  tone.minFilter = tone.magFilter = THREE.NearestFilter;
  tone.needsUpdate = true;

  function add(parent, geo, hex, part, { edges = true, angle = 28 } = {}) {
    const fill = new THREE.MeshToonMaterial({
      color: hex, gradientMap: tone, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
    });
    const mesh = new THREE.Mesh(geo, fill);
    parent.add(mesh);
    const edge = new THREE.LineBasicMaterial({ color: EDGE_DARK, transparent: true });
    if (edges) mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, angle), edge));
    reg.push({ part, fill, edge, base: new THREE.Color(hex) });
    return mesh;
  }
  const pivot = (parent, x = 0, y = 0, z = 0) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  };
  const anchor = (parent, part, x, y, z) => {
    const o = new THREE.Object3D();
    o.position.set(x, y, z);
    parent.add(o);
    anchors[part] = o;
  };

  /* ---------- body: frame (hollow rounded box), front glass, display ---------- */
  add(root, slab(W, H, R, D, [{ w: W - 0.16, h: H - 0.16, r: R - 0.1, x: 0, y: 0 }]), 0x2e3238, 'frame');

  const front = pivot(root, 0, 0, 0.22);
  add(front, slab(W - 0.02, H - 0.02, R - 0.01, 0.04), 0x181a1e, 'display');
  const lock = pivot(root, 0, 0, 0.243);
  add(lock, box(0.95, 0.13, 0.006), 0xcfcec6, 'display', { edges: false }).position.set(0, 1.25, 0);
  add(lock, box(0.55, 0.045, 0.006), 0x6d6c67, 'display', { edges: false }).position.set(0, 0.98, 0);
  add(lock, cyl(0.06, 0.006, 20), 0x050607, 'display', { edges: false }).position.set(0, 2.85, 0);
  add(lock, box(0.5, 0.035, 0.006), 0x050607, 'display', { edges: false }).position.set(0, 2.72, 0);

  const backing = pivot(root, 0, 0, 0.15);
  add(backing, slab(W - 0.2, H - 0.2, R - 0.14, 0.03), 0x1f2227, 'display');
  add(backing, box(0.8, 0.5, 0.012), 0x3a3f46, 'display').position.set(0.3, -2.4, -0.02); // flex cable
  anchor(backing, 'display', 0.25, -0.7, -0.018);

  /* ---------- frame details: hinge knuckles, antenna strips, speaker grille, buttons ---------- */
  [2.3, 0, -2.3].forEach((y) => {
    const k = add(root, new THREE.CylinderGeometry(0.05, 0.05, 0.5, 14), 0x4a4f57, 'frame');
    k.position.set(HX + 0.03, y, BACK_Z + 0.02);
  });

  const ant = pivot(root, 0, 0, -0.13);
  add(ant, box(1.9, 0.06, 0.03), 0x6b7078, 'antenna').position.set(0.2, 2.92, 0);
  add(ant, box(1.9, 0.06, 0.03), 0x6b7078, 'antenna').position.set(-0.2, -2.92, 0);
  add(ant, box(0.05, 1.7, 0.03), 0x6b7078, 'antenna').position.set(1.38, -0.2, 0);
  add(ant, box(0.05, 1.7, 0.03), 0x6b7078, 'antenna').position.set(-1.38, 0.2, 0);
  anchor(ant, 'antenna', 0.8, 2.92, -0.02);

  for (let i = 0; i < 6; i++) add(root, box(0.05, 0.014, 0.15), 0x07080a, 'frame').position.set(-0.9 + i * 0.12, -H / 2 - 0.004, 0);
  add(root, box(0.4, 0.014, 0.13), 0x07080a, 'frame').position.set(0.35, -H / 2 - 0.004, 0);
  add(root, box(0.05, 0.5, 0.12), 0x4a4f57, 'frame').position.set(-W / 2 - 0.02, 0.7, 0);
  add(root, box(0.05, 0.95, 0.12), 0x4a4f57, 'frame').position.set(-W / 2 - 0.02, 1.9, 0);

  /* ---------- back panel on a side hinge ---------- */
  const backPivot = pivot(root, HX, 0, BACK_Z);
  const back = add(backPivot, slab(W - 0.02, H - 0.02, R - 0.01, 0.04, [{ w: 1.0, h: 1.0, r: 0.22, x: CAM.x, y: CAM.y }]), 0x24272c, 'back');
  back.position.x = -HX;
  const logo = add(back, new THREE.TorusGeometry(0.28, 0.012, 8, 48), 0x6d717a, 'back', { angle: 40 });
  logo.position.set(0, -0.4, -0.022);

  /* ---------- battery ---------- */
  const batPivot = pivot(root, 0, BAT_Y, BOARD_Z);
  add(batPivot, box(2.5, 2.6, 0.07), 0x282c33, 'battery');
  add(batPivot, box(2.1, 1.9, 0.012), 0x343a43, 'battery').position.set(0, -0.12, -0.04);
  add(batPivot, box(0.5, 0.14, 0.04), 0x8a8e96, 'battery').position.set(0, 1.37, -0.01);
  anchor(batPivot, 'battery', 0.7, 0.45, -0.05);

  /* ---------- motherboard, chips, camera ---------- */
  const boardPivot = pivot(root, 0, BOARD_Y, BOARD_Z);
  add(boardPivot, box(2.5, 2.6, 0.03), 0x1f3028, 'board');
  anchor(boardPivot, 'board', -0.95, -1.0, -0.02);

  const chips = [];
  function chip(i, w, h, d, x, y, hex, part, extra) {
    const p = pivot(boardPivot, x, y, -(0.015 + d / 2));
    p.userData.rest = p.position.z;
    add(p, box(w, h, d), hex, part);
    if (extra) extra(p, d);
    chips[i] = p;
    return p;
  }
  chip(0, 0.7, 0.7, 0.06, 0.45, 0.35, 0x2b3037, 'soc', (p, d) => {
    add(p, box(0.34, 0.34, 0.02), 0x444b56, 'soc').position.z = -(d / 2 + 0.01);
    anchor(p, 'soc', 0, 0, -(d / 2 + 0.02));
  }); // square SoC
  chip(1, 0.72, 0.42, 0.04, 0.45, -0.55, 0x30343c, 'memory', (p, d) => anchor(p, 'memory', 0, 0, -d / 2));
  chip(2, 0.4, 0.4, 0.035, -0.6, -0.6, 0x2a2f36, 'board');
  chip(3, 0.5, 0.4, 0.04, -0.6, -0.02, 0x2a2f36, 'board');
  chip(4, 0.4, 0.5, 0.045, 1.0, 1.0, 0x3a3f47, 'board'); // RF shield
  const caps = pivot(boardPivot, 0.6, -1.08, -0.03);
  caps.userData.rest = caps.position.z;
  for (let i = 0; i < 5; i++) add(caps, box(0.12, 0.06, 0.03), 0x7a7c80, 'board').position.x = (i - 2) * 0.2;
  chips[5] = caps;

  const camBase = pivot(boardPivot, CAM.x, CAM.y - BOARD_Y, 0);
  const cams = [];
  const camLayer = (i, restZ, geo, hex, edgeAngle) => {
    const p = pivot(camBase, 0, 0, restZ);
    p.userData.rest = restZ;
    add(p, geo, hex, 'camera', { angle: edgeAngle });
    cams[i] = p;
    return p;
  };
  camLayer(0, -0.035, slab(0.86, 0.86, 0.18, 0.05), 0x111317, 28);
  camLayer(1, -0.085, cyl(0.28, 0.06), 0x2e3238, 40);
  camLayer(2, -0.108, cyl(0.19, 0.02), 0x12202f, 40);
  const ring = camLayer(3, -0.118, new THREE.TorusGeometry(0.27, 0.028, 10, 48), 0x9c9c94, 60);
  anchor(ring, 'camera', 0, 0, -0.03);

  /* ---------- state → transforms ---------- */
  function apply(S, k) {
    const sp = k.spread;
    backPivot.position.set(HX, -S.slide * 0.24, BACK_Z - S.unlatch * 0.06);
    backPivot.rotation.y = -S.door * 2.4;

    const c = S.arc * 1.15;
    batPivot.position.set(
      -Math.sin(c) * 2.4 * sp,
      BAT_Y - (1 - Math.cos(c)) * 1.1 - S.arc * 0.45,
      BOARD_Z - S.bat * 0.85 - S.arc * 0.3
    );
    batPivot.rotation.set(0, -S.arc * 0.2, S.arc * 0.45);

    boardPivot.position.set(0, BOARD_Y + S.board * 0.3, BOARD_Z - S.board * 1.1);
    boardPivot.rotation.set(-S.board * 0.05, 0, S.board * 0.02);

    for (let i = 0; i < CHIP_COUNT; i++) chips[i].position.z = chips[i].userData.rest - S.chips[i].v * (0.28 + (i % 3) * 0.14);
    for (let i = 0; i < CAM_LAYERS; i++) cams[i].position.z = cams[i].userData.rest - S.cam[i].v * (0.2 + i * 0.17);
  }

  /* ---------- theme (dark toon → blueprint line art) + hover highlight ---------- */
  const fade = new THREE.Color();
  function paint(t, hv, dv) {
    fade.copy(BG_DARK).lerp(PAPER, t);
    for (const r of reg) {
      const h = hv[r.part] || 0, d = dv[r.part] || 0;
      r.fill.color.copy(r.base).multiplyScalar(1 - t);
      r.fill.emissive.copy(PAPER).multiplyScalar(t);
      if (h > 0) r.fill.emissive.lerp(LIME, h * 0.95);
      r.edge.color.copy(EDGE_DARK).lerp(EDGE_PAPER, t);
      if (d > 0) r.edge.color.lerp(fade, d * 0.78);
      if (h > 0) r.edge.color.lerp(HOT_EDGE, h);
    }
  }

  return { root, anchors, apply, paint };
}
