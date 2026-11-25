// Shared constants for the phone scene (no three.js import so it stays in the main bundle).
export const TOTAL = 12000; // master timeline length (ms); scroll progress maps 0..1 onto it
export const CHIP_COUNT = 6; // individually lifted board components
export const CAM_LAYERS = 4; // camera module layers: housing, barrel, glass, ring

// Blueprint labels. `side` = which screen edge, `order` = top→bottom on that edge.
export const PARTS = [
  { id: 'antenna', label: 'Networking', side: 'left', order: 0 },
  { id: 'soc', label: 'Linux / systems', side: 'left', order: 1 },
  { id: 'memory', label: 'Local LLMs (llama.cpp on-device)', side: 'left', order: 2 },
  { id: 'display', label: 'Web / frontend', side: 'left', order: 3 },
  { id: 'camera', label: 'Computer vision (placeholder)', side: 'right', order: 0 },
  { id: 'board', label: 'Android internals / custom ROMs', side: 'right', order: 1 },
  { id: 'battery', label: 'Optimization', side: 'right', order: 2 },
];

export const STEPS = [
  [0, '01 / Unlatch'],
  [800, '02 / Slide down'],
  [1800, '03 / Swing open on the hinge'],
  [3600, '04 / Battery out'],
  [5200, '05 / Board separates'],
  [7800, '06 / Blueprint'],
];

export function createState() {
  return {
    unlatch: 0, slide: 0, door: 0, bat: 0, arc: 0, board: 0, drift: 0, yaw: 0, theme: 0, end: 0,
    chips: Array.from({ length: CHIP_COUNT }, () => ({ v: 0 })),
    cam: Array.from({ length: CAM_LAYERS }, () => ({ v: 0 })),
  };
}
