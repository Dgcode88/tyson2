// Light haptic feedback on devices that support the Vibration API (mostly
// Android / mobile). Silently no-ops on desktop and under reduced-motion. It's
// on by default because it's a physical acknowledgement, not noise — and it can
// never fire without a real user gesture behind it.
const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function vibrate(pattern) {
  if (reduced()) return;
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch {
    /* device refused — ignore */
  }
}

// Named patterns so call sites read like intent, not magic numbers.
export const HAPTIC = {
  lockIn: [40, 30, 70], // a coach's "good shot" — a firm double tap
  rankUp: [90, 50, 90, 50, 150], // a slow percussion roll for a promotion
  enter: [70], // one thump stepping through the ropes
  tap: 16, // a tiny confirm
};
