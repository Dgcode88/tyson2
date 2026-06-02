import { createGlobalStyle } from "styled-components";

// ── Design tokens ─────────────────────────────────────────────────────────────
// A premium athletic command center: near-black base, translucent glass surfaces,
// hairline borders, two signature accents — teal (action/progress) and gold
// (highlight) — and a per-phase accent gradient that escalates with progress.
export const theme = {
  color: {
    bg: "#0B0E14",
    bgGradient:
      "radial-gradient(1200px 600px at 50% -10%, #141B2A 0%, #0B0E14 55%, #07090F 100%)",
    surface: "rgba(255, 255, 255, 0.04)",
    surfaceHover: "rgba(255, 255, 255, 0.07)",
    border: "rgba(255, 255, 255, 0.08)",
    borderStrong: "rgba(255, 255, 255, 0.16)",
    text: "#F5F7FA",
    textMuted: "#9AA4B2",
    textDim: "#646E7E",
    teal: "#2DD4BF",
    tealSoft: "rgba(45, 212, 191, 0.14)",
    tealInk: "#052B27",
    gold: "#F5B643",
    goldSoft: "rgba(245, 182, 67, 0.14)",
    green: "#34D399",
    greenInk: "#06281C",
    danger: "#F0506A",
    track: "rgba(255, 255, 255, 0.08)",
  },
  // Per-phase accent gradients (Demolition / Reconstruction / Weaponization)
  phase: {
    1: { from: "#FB7185", to: "#E11D48", glow: "rgba(225, 29, 72, 0.45)" },
    2: { from: "#38BDF8", to: "#2563EB", glow: "rgba(37, 99, 235, 0.45)" },
    3: { from: "#A78BFA", to: "#7C3AED", glow: "rgba(124, 58, 237, 0.45)" },
  },
  radius: { sm: "10px", md: "14px", lg: "18px", pill: "999px" },
  shadow: {
    card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 40px -24px rgba(0,0,0,0.9)",
    raised: "0 24px 60px -28px rgba(0,0,0,0.95)",
  },
  font: {
    display: "'Archivo', system-ui, sans-serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
  },
  // Full-bleed app shell metrics
  layout: { rail: "96px", maxMain: "1760px" },
};

// Helper: resolve a phase's accent (defaults to phase 1 if out of range).
export const phaseAccent = (phase) => theme.phase[phase] || theme.phase[1];

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    color-scheme: dark;
    --bg:${theme.color.bg}; --surface:${theme.color.surface}; --surface-hover:${theme.color.surfaceHover};
    --border:${theme.color.border}; --border-strong:${theme.color.borderStrong};
    --fg1:${theme.color.text}; --fg2:${theme.color.textMuted}; --fg3:${theme.color.textDim};
    --teal:${theme.color.teal}; --teal-soft:${theme.color.tealSoft};
    --gold:${theme.color.gold}; --gold-soft:${theme.color.goldSoft};
    --green:${theme.color.green}; --danger:${theme.color.danger}; --track:${theme.color.track};
    --display:${theme.font.display}; --body:${theme.font.body};
  }

  html, body, #root { height: 100%; }

  body {
    margin: 0;
    font-family: ${theme.font.body};
    background: ${theme.color.bg};
    background-image: ${theme.color.bgGradient};
    background-attachment: fixed;
    color: ${theme.color.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
  }

  h1, h2, h3, h4 { font-family: ${theme.font.display}; margin: 0; }
  button { font-family: inherit; }

  /* Visible, on-brand keyboard focus everywhere. */
  :focus-visible {
    outline: 2px solid ${theme.color.teal};
    outline-offset: 2px;
    border-radius: 6px;
  }
  ::selection { background: ${theme.color.tealSoft}; }

  /* ══════════════════ CINEMATIC LAYER ══════════════════════════════════════ */

  /* Ambient drifting light — re-tints to the active phase accent over ~1.1s */
  .ambient { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
  .orb { position: absolute; border-radius: 50%; filter: blur(90px); opacity: .42;
    mix-blend-mode: screen; transition: background 1.1s ease; will-change: transform; }
  .orb-1 { width: 860px; height: 860px; top: -340px; left: 34%; margin-left: -430px; animation: drift1 24s ease-in-out infinite; }
  .orb-2 { width: 660px; height: 660px; bottom: -300px; right: -160px; animation: drift2 30s ease-in-out infinite; }
  .orb-3 { width: 520px; height: 520px; top: 40%; left: -200px; opacity: .26; animation: drift3 34s ease-in-out infinite; }
  @keyframes drift1 { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(46px) scale(1.08);} }
  @keyframes drift2 { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(-64px,-34px) scale(1.13);} }
  @keyframes drift3 { 0%,100%{transform:translate(0,0);} 50%{transform:translate(54px,-44px);} }
  .grain { position: absolute; inset: 0; opacity: .05; mix-blend-mode: overlay; background-size: 200px 200px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
  .vignette { position: absolute; inset: 0; background: radial-gradient(130% 120% at 50% -5%, transparent 50%, rgba(0,0,0,.6) 100%); }
  .scan { position: absolute; left: 0; right: 0; height: 180px; opacity: .5;
    background: linear-gradient(180deg, transparent, rgba(255,255,255,.022), transparent); animation: scan 9s linear infinite; }
  @keyframes scan { 0%{top:-180px;} 100%{top:100%;} }

  /* Full-screen accent flash on phase change */
  .flash { position: fixed; inset: 0; z-index: 60; pointer-events: none; }
  .flash-ring { position: absolute; top: 46%; left: 50%; width: 12px; height: 12px; border-radius: 50%;
    transform: translate(-50%,-50%); animation: flashRing .85s cubic-bezier(.16,1,.3,1) forwards; }
  @keyframes flashRing { 0%{width:12px;height:12px;opacity:.5;} 100%{width:280vmax;height:280vmax;opacity:0;} }
  .flash-sweep { position: absolute; inset: 0; animation: flashFade .55s ease-out forwards; }
  @keyframes flashFade { from{opacity:.32;} to{opacity:0;} }

  /* Day-complete spark burst */
  .burst { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; z-index: 5; }
  .spark { position: absolute; width: 9px; height: 9px; border-radius: 50%;
    animation: spark .72s cubic-bezier(.2,.8,.3,1) forwards; }
  @keyframes spark { 0%{transform:translate(0,0) scale(1);opacity:1;} 100%{transform:translate(var(--x),var(--y)) scale(.2);opacity:0;} }

  /* Entrance choreography — only hidden during the self-healing boot window */
  .boot .reveal { opacity: 0; transform: translateY(16px);
    animation: reveal .75s cubic-bezier(.22,1,.36,1) forwards; animation-delay: var(--d, 0s); }
  @keyframes reveal { to { opacity: 1; transform: none; } }

  /* Phase-name stamp (retriggers on phase change via React key) */
  @keyframes stamp { 0%{opacity:.4;transform:scale(1.05);filter:blur(8px);} 55%{opacity:1;filter:blur(0);} 100%{transform:scale(1);} }

  /* Ring breathing glow + completion flash */
  @keyframes ringPulse { 0%,100%{opacity:.32;transform:scale(.96);} 50%{opacity:.6;transform:scale(1.03);} }

  /* Staggered list reveal (boot window only, so tab switches never stay hidden) */
  .boot li.reveal-i, .boot .reveal-i { opacity: 0;
    animation: liIn .5s cubic-bezier(.22,1,.36,1) forwards; animation-delay: calc(var(--i,0) * .045s + .1s); }
  @keyframes liIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:none;} }

  /* Honour reduced-motion everywhere. */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
    .reveal, .reveal-i { opacity: 1 !important; transform: none !important; }
    .orb, .scan { animation: none !important; }
  }
`;
