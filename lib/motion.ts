/**
 * Deterministic motion math shared across the Launch Film Player and
 * interactive Product Motion specs. Every animation state is a pure
 * function of time `t` with zero inter-frame mutable state.
 */

export const clamp = (v: number, a = 0, b = 1): number =>
  Math.min(b, Math.max(a, v));

export const prog = (t: number, a: number, b: number): number =>
  b === a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a), 0, 1);

export const lerp = (a: number, b: number, p: number): number =>
  a + (b - a) * p;

export const expoOut = (p: number): number =>
  p >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(p, 0, 1));

export const inOutQuart = (p: number): number => {
  const x = clamp(p, 0, 1);
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
};

export const easeInCubic = (p: number): number => {
  const x = clamp(p, 0, 1);
  return x * x * x;
};

/** Step time on twos (12 fps = 83.33ms intervals) for authentic drawn cadence. */
export const twos = (t: number): number => Math.floor(t * 12) / 12;

/**
 * Closed-form damped spring (m = 1).
 * - k=120, c=14: 7.4% overshoot, ~16f settle (expressive titles/stamps)
 * - k=100, c=15: 2.8% overshoot (sober UI cards & 2.5D layers)
 * - k=300, c=30: 0% bounce (functional telemetry / snap-back)
 */
export function spring(s: number, k = 120, c = 14): number {
  if (s <= 0) return 0;
  const w = Math.sqrt(k);
  const z = c / (2 * w);
  if (z >= 1) {
    return 1 - Math.exp(-w * s) * (1 + w * s);
  }
  const wd = w * Math.sqrt(1 - z * z);
  return (
    1 -
    Math.exp(-z * w * s) *
      (Math.cos(wd * s) + ((z * w) / wd) * Math.sin(wd * s))
  );
}

/**
 * Volume-preserving squash & stretch transform anchored at the baseline.
 * Enforces scaleX * scaleY === 1 and limits vertical distortion safely.
 */
export function volumeSquash(syInput: number): string {
  const sy = Math.max(0.85, Math.min(1.15, syInput));
  const sx = 1 / sy;
  return `scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
}

export function formatTimecode(seconds: number): string {
  const s = Math.max(0, seconds);
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  const frames = Math.floor((s % 1) * 12);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(frames * 2).padStart(2, "0")}`;
}
