// Hand-posed keyframes of a golf swing, expanded into MediaPipe's 33-landmark layout.
// Rough by design: it reads as a swing on screen; it is not biomechanics.

type V = [number, number, number];
type Core = {
  head: V; ls: V; rs: V; le: V; re: V; lw: V; rw: V;
  lh: V; rh: V; lk: V; rk: V; la: V; ra: V; club: V;
};

export const PHASES = ["Address", "Top of backswing", "Impact", "Finish"];

const KEYS: Core[] = [
  { // address
    head: [0, 1.55, 0.36], ls: [0.2, 1.38, 0.24], rs: [-0.2, 1.36, 0.24],
    le: [0.1, 1.12, 0.36], re: [-0.1, 1.12, 0.36], lw: [0.03, 0.9, 0.42], rw: [-0.02, 0.87, 0.42],
    lh: [0.15, 0.95, -0.05], rh: [-0.15, 0.95, -0.05], lk: [0.17, 0.5, 0.06], rk: [-0.17, 0.5, 0.06],
    la: [0.21, 0.08, 0], ra: [-0.21, 0.08, 0], club: [0.06, 0.03, 0.66],
  },
  { // top of backswing
    head: [-0.02, 1.55, 0.35], ls: [-0.02, 1.37, 0.36], rs: [-0.22, 1.42, 0.02],
    le: [-0.2, 1.46, 0.35], re: [-0.34, 1.52, 0.1], lw: [-0.36, 1.72, 0.24], rw: [-0.39, 1.69, 0.2],
    lh: [0.1, 0.95, 0.05], rh: [-0.17, 0.95, -0.12], lk: [0.08, 0.5, 0.12], rk: [-0.17, 0.5, 0.04],
    la: [0.21, 0.08, 0], ra: [-0.21, 0.08, 0], club: [0.08, 1.78, -0.28],
  },
  { // impact
    head: [-0.01, 1.54, 0.34], ls: [0.2, 1.38, 0.18], rs: [-0.18, 1.33, 0.28],
    le: [0.14, 1.12, 0.32], re: [-0.06, 1.1, 0.4], lw: [0.08, 0.89, 0.42], rw: [0.04, 0.86, 0.42],
    lh: [0.2, 0.96, -0.1], rh: [-0.1, 0.95, 0.08], lk: [0.18, 0.51, 0.02], rk: [-0.1, 0.5, 0.12],
    la: [0.21, 0.08, 0], ra: [-0.19, 0.1, 0.02], club: [0.02, 0.03, 0.66],
  },
  { // finish
    head: [0.08, 1.62, 0.1], ls: [0.17, 1.45, -0.18], rs: [0.06, 1.45, 0.26],
    le: [0.32, 1.6, -0.04], re: [0.22, 1.56, 0.16], lw: [0.26, 1.78, -0.14], rw: [0.23, 1.74, -0.08],
    lh: [0.12, 0.98, -0.15], rh: [-0.04, 0.98, 0.12], lk: [0.16, 0.52, -0.02], rk: [0.0, 0.52, 0.12],
    la: [0.21, 0.08, 0], ra: [-0.15, 0.16, 0.06], club: [-0.12, 1.62, -0.52],
  },
];

const lerp = (a: V, b: V, t: number): V => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const ease = (t: number) => t * t * (3 - 2 * t);

function blend(p: number): Core {
  const span = KEYS.length - 1;
  const x = Math.min(span - 1e-6, Math.max(0, p * span));
  const i = Math.floor(x);
  const t = ease(x - i);
  const a = KEYS[i], b = KEYS[i + 1];
  const out = {} as Core;
  (Object.keys(a) as (keyof Core)[]).forEach((k) => (out[k] = lerp(a[k], b[k], t)));
  return out;
}

/** The 33 landmarks, in MediaPipe order, for swing progress p in [0, 1]; plus the clubhead. */
export function poseAt(p: number): { points: V[]; club: V } {
  const c = blend(p);
  const towardClub = (w: V, d: number): V => lerp(w, c.club, d);
  const h = c.head;
  const points: V[] = [
    add(h, [0, 0, 0.09]),                                   // 0 nose
    add(h, [0.02, 0.03, 0.08]), add(h, [0.035, 0.03, 0.075]), add(h, [0.05, 0.03, 0.07]), // 1-3 left eye
    add(h, [-0.02, 0.03, 0.08]), add(h, [-0.035, 0.03, 0.075]), add(h, [-0.05, 0.03, 0.07]), // 4-6 right eye
    add(h, [0.08, 0.01, 0]), add(h, [-0.08, 0.01, 0]),      // 7-8 ears
    add(h, [0.025, -0.04, 0.075]), add(h, [-0.025, -0.04, 0.075]), // 9-10 mouth
    c.ls, c.rs, c.le, c.re, c.lw, c.rw,                     // 11-16
    towardClub(c.lw, 0.08), towardClub(c.rw, 0.08),         // 17-18 pinky
    towardClub(c.lw, 0.1), towardClub(c.rw, 0.1),           // 19-20 index
    towardClub(c.lw, 0.05), towardClub(c.rw, 0.05),         // 21-22 thumb
    c.lh, c.rh, c.lk, c.rk, c.la, c.ra,                     // 23-28
    add(c.la, [0, -0.05, -0.07]), add(c.ra, [0, -0.05, -0.07]), // 29-30 heels
    add(c.la, [0.02, -0.06, 0.16]), add(c.ra, [-0.02, -0.06, 0.16]), // 31-32 foot index
  ];
  return { points, club: c.club };
}

/** MediaPipe POSE_CONNECTIONS (subset that reads well at this scale). */
export const BONES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10],
  [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28],
  [27, 29], [28, 30], [29, 31], [30, 32], [27, 31], [28, 32],
];
