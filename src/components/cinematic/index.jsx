import { useEffect, useRef, useState } from "react";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── Animated count-up ─────────────────────────────────────────────────────────
// Eases out cubic from the previous value to the new one whenever `target`
// changes. Snaps instantly when the user prefers reduced motion.
export function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(target);
  const raf = useRef(0);
  // Track the currently displayed value so an interrupted animation resumes
  // from what's on screen, not from a stale target.
  const valRef = useRef(target);
  valRef.current = val;

  useEffect(() => {
    if (REDUCED) {
      setVal(target);
      return;
    }
    const start = performance.now();
    const startVal = valRef.current;
    cancelAnimationFrame(raf.current);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(startVal + (target - startVal) * e));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return val;
}

// ── Ambient field ─────────────────────────────────────────────────────────────
// Three drifting, phase-tinted orbs + scanline + grain + vignette behind all
// content. The orbs cross-fade to the new accent when the phase changes.
export function Ambient({ accent }) {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="orb orb-1" style={{ background: `radial-gradient(circle, ${accent.from}, transparent 70%)` }} />
      <div className="orb orb-2" style={{ background: `radial-gradient(circle, ${accent.to}, transparent 70%)` }} />
      <div className="orb orb-3" style={{ background: `radial-gradient(circle, ${accent.from}, transparent 70%)` }} />
      <div className="scan" />
      <div className="grain" />
      <div className="vignette" />
    </div>
  );
}

// ── Phase-change flash ────────────────────────────────────────────────────────
// Expanding accent ring + a fading gradient sweep. Re-keyed by `nonce`.
export function PhaseFlash({ nonce, accent }) {
  if (!nonce) return null;
  return (
    <div className="flash" key={nonce} aria-hidden="true">
      <div className="flash-sweep" style={{ background: `linear-gradient(120deg, ${accent.from}, ${accent.to})` }} />
      <div
        className="flash-ring"
        style={{ background: `radial-gradient(circle, ${accent.from}, ${accent.to} 40%, transparent 70%)` }}
      />
    </div>
  );
}

// ── Day-complete burst ────────────────────────────────────────────────────────
// 14 sparks radiating from the ring in teal / gold / green / white.
export function Burst({ nonce }) {
  if (!nonce) return null;
  const colors = ["#34D399", "#2DD4BF", "#F5B643", "#F5F7FA"];
  const sparks = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const dist = 64 + (i % 3) * 24;
    return {
      x: Math.cos(a) * dist,
      y: Math.sin(a) * dist,
      c: colors[i % colors.length],
      delay: (i % 4) * 0.03,
    };
  });
  return (
    <div className="burst" key={nonce} aria-hidden="true">
      {sparks.map((s, i) => (
        <span
          key={i}
          className="spark"
          style={{
            "--x": `${s.x}px`,
            "--y": `${s.y}px`,
            background: s.c,
            boxShadow: `0 0 10px ${s.c}`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
