import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// The War Room sound kit — every sound synthesised on the fly with the Web Audio
// API. No audio files: nothing to download, nothing an ad-blocker can swallow.
// Opt-in and OFF by default; we never make noise without the user turning it on.
// A module-level singleton means the cold open, the oath and day-complete all
// share one AudioContext and one enabled flag.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "tysonSoundOn";

const engine = (() => {
  let ctx = null;
  let master = null;
  let enabled = false;
  try {
    enabled = localStorage.getItem(KEY) === "1";
  } catch {
    /* private mode / storage blocked — stay silent */
  }
  const listeners = new Set();

  // Lazily create (and resume) the context. Must run inside a user gesture the
  // first time, which it always does: the enabling toggle and the cold-open
  // ENTER are both real clicks/taps.
  const ensure = () => {
    if (typeof window === "undefined") return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.85;
      master.connect(ctx.destination);
    }
    // resume() returns a promise that can reject if the state changed under us
    // (e.g. two sounds firing back-to-back) — swallow it, the context is fine.
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  };

  // Short burst of white noise — the raw material for impacts and clicks.
  const noiseBuffer = (ctx, seconds) => {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  };

  // ── The boxing ring bell ────────────────────────────────────────────────
  // Additive synthesis with INHARMONIC partials (a real bell's overtones are
  // not integer multiples) → a bright metallic clang that rings out ~1.6s.
  const bell = (ctx, out) => {
    const t = ctx.currentTime;
    const base = 523; // ~C5, the airy register of a small fight bell
    const partials = [1, 2.71, 4.16, 5.43, 6.79, 8.21];
    const gains = [1, 0.62, 0.44, 0.3, 0.2, 0.13];
    const bus = ctx.createGain();
    bus.gain.value = 0.5;
    bus.connect(out);

    partials.forEach((ratio, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = base * ratio;
      const decay = 1.6 / (1 + i * 0.55); // higher partials die faster
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gains[i] * 0.5, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(g).connect(bus);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    });

    // The clapper strike — a tiny bright tick at the very front.
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.05);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 3000;
    const cg = ctx.createGain();
    cg.gain.setValueAtTime(0.5, t);
    cg.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    src.connect(hp).connect(cg).connect(out);
    src.start(t);
    src.stop(t + 0.06);
  };

  // ── Body shot ──────────────────────────────────────────────────────────
  // A filtered noise "smack" over a fast pitch-dropping sine "body". ~140ms.
  const thud = (ctx, out) => {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.14);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(900, t);
    lp.frequency.exponentialRampToValueAtTime(180, t + 0.13);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.55, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    src.connect(lp).connect(ng).connect(out);
    src.start(t);
    src.stop(t + 0.15);

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(165, t);
    osc.frequency.exponentialRampToValueAtTime(48, t + 0.13);
    g.gain.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.17);
  };

  // ── Lock in ──────────────────────────────────────────────────────────────
  // A mechanical "ka-chunk" — noise click + low thunk + a confirming metallic
  // tick. The sound of a decision becoming non-negotiable.
  const lock = (ctx, out) => {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.04);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.4, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    src.connect(bp).connect(ng).connect(out);
    src.start(t);
    src.stop(t + 0.05);

    const thunk = ctx.createOscillator();
    const tg = ctx.createGain();
    thunk.type = "square";
    thunk.frequency.setValueAtTime(150, t);
    thunk.frequency.exponentialRampToValueAtTime(70, t + 0.09);
    tg.gain.setValueAtTime(0.0001, t);
    tg.gain.linearRampToValueAtTime(0.5, t + 0.006);
    tg.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    thunk.connect(tg).connect(out);
    thunk.start(t);
    thunk.stop(t + 0.13);

    const tick = ctx.createOscillator();
    const tkg = ctx.createGain();
    tick.type = "triangle";
    tick.frequency.value = 720;
    tkg.gain.setValueAtTime(0, t + 0.05);
    tkg.gain.linearRampToValueAtTime(0.18, t + 0.06);
    tkg.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    tick.connect(tkg).connect(out);
    tick.start(t + 0.05);
    tick.stop(t + 0.17);
  };

  // ── Tick ───────────────────────────────────────────────────────────────
  // A tiny dry click for small confirmations (stepping a day, checking an item).
  const tick = (ctx, out) => {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.02);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    src.connect(hp).connect(g).connect(out);
    src.start(t);
    src.stop(t + 0.03);
  };

  // ── Whoosh ────────────────────────────────────────────────────────────────
  // A rising filtered-noise sweep — the cold open igniting into the arena.
  const whoosh = (ctx, out) => {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.6);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(300, t);
    bp.frequency.exponentialRampToValueAtTime(4200, t + 0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.4, t + 0.28);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    src.connect(bp).connect(g).connect(out);
    src.start(t);
    src.stop(t + 0.62);
  };

  const sounds = { bell, thud, lock, tick, whoosh };

  const setEnabled = (v) => {
    enabled = !!v;
    try {
      localStorage.setItem(KEY, enabled ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (enabled) ensure(); // unlock the context on the enabling gesture
    listeners.forEach((fn) => fn(enabled));
  };

  return {
    get enabled() {
      return enabled;
    },
    setEnabled,
    toggle: () => setEnabled(!enabled),
    play: (name) => {
      if (!enabled) return;
      const c = ensure();
      if (!c || !master) return;
      (sounds[name] || (() => {}))(c, master);
    },
    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
})();

// React hook: mirrors the engine's enabled flag into state so toggles re-render,
// and exposes a stable play(). `play` always reflects the live enabled flag.
export function useSound() {
  const [enabled, setEnabledState] = useState(engine.enabled);

  useEffect(() => engine.subscribe(setEnabledState), []);

  return {
    enabled,
    toggle: engine.toggle,
    setEnabled: engine.setEnabled,
    play: engine.play,
  };
}

// Direct play for non-React call sites; respects the enabled flag internally.
export const playSound = engine.play;
