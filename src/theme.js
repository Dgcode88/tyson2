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
    // Lightened from #646E7E (~3.4:1, sub-AA) to ~4.7:1 so every micro-label,
    // eyebrow and time stamp clears WCAG AA — still a distinct dim tier below
    // textMuted, just no longer illegible dim-on-dark.
    textDim: "#828B99",
    teal: "#2DD4BF",
    tealSoft: "rgba(45, 212, 191, 0.14)",
    tealInk: "#052B27",
    gold: "#F5B643",
    goldSoft: "rgba(245, 182, 67, 0.14)",
    green: "#34D399",
    greenInk: "#06281C",
    danger: "#F0506A",
    // War red — the colour of the cold open, the oath, the bell. Blood in the canvas.
    blood: "#E11D2A",
    bloodSoft: "rgba(225, 29, 42, 0.16)",
    bloodGlow: "rgba(225, 29, 42, 0.5)",
    bone: "#EDE7DC",
    track: "rgba(255, 255, 255, 0.08)",
  },
  // Per-phase accent gradients (Demolition / Reconstruction / Weaponization).
  // `from`→`to` is the saturated version for rings, bars and glows. `textTo` is a
  // lighter far-stop used ONLY when the gradient fills TEXT (background-clip), so
  // the giant phase names clear contrast instead of fading into a ~3.3:1 dark end.
  // Every phase MUST define textTo — consumers use it directly, no fallback.
  phase: {
    1: { from: "#FB7185", to: "#E11D48", textTo: "#F43F5E", glow: "rgba(225, 29, 72, 0.45)" },
    2: { from: "#38BDF8", to: "#2563EB", textTo: "#3B82F6", glow: "rgba(37, 99, 235, 0.45)" },
    3: { from: "#A78BFA", to: "#7C3AED", textTo: "#8B5CF6", glow: "rgba(124, 58, 237, 0.45)" },
  },
  radius: { sm: "10px", md: "14px", lg: "18px", pill: "999px" },
  shadow: {
    card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 40px -24px rgba(0,0,0,0.9)",
    raised: "0 24px 60px -28px rgba(0,0,0,0.95)",
  },
  font: {
    // Two-tier display system. `display` (Archivo 600–900) is the everyday
    // heading + big-numeric voice — panel titles, the ring number, stat numbers,
    // the day stamp, legend names. `brutal` (Anton) is deliberately RESERVED for
    // full-screen/overlay "moment" typography — the cold-open walkout, the
    // rank-up toast, the Day-90 FORGED screen — and never sits in the persistent
    // dashboard next to Archivo numerals.
    display: "'Archivo', system-ui, sans-serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
    brutal: "'Anton', 'Archivo', system-ui, sans-serif",
  },
  // Full-bleed app shell metrics
  layout: { rail: "96px", maxMain: "1760px" },
};

// Helper: resolve a phase's accent (defaults to phase 1 if out of range).
export const phaseAccent = (phase) => theme.phase[phase] || theme.phase[1];

// The near-black, blood-tinged arena backdrop shared by the cold-open walkout
// and the crash screen. A plain module constant (not a theme token) so the
// ErrorBoundary can use it without a working ThemeProvider.
export const arenaBg =
  "radial-gradient(120% 100% at 50% 38%, #14060a 0%, #07070b 55%, #040406 100%)";

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
    --blood:${theme.color.blood}; --blood-soft:${theme.color.bloodSoft}; --blood-glow:${theme.color.bloodGlow}; --bone:${theme.color.bone};
    --display:${theme.font.display}; --body:${theme.font.body}; --brutal:${theme.font.brutal};
  }

  html, body, #root { height: 100%; }

  body {
    margin: 0;
    font-family: ${theme.font.body};
    background: ${theme.color.bg};
    color: ${theme.color.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
  }

  /* Fixed background gradient via a dedicated compositor layer instead of
     background-attachment: fixed, which repaints the whole viewport on every
     scroll frame (a well-known mobile jank source). */
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    background: ${theme.color.bgGradient};
    pointer-events: none;
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
  .ambient.paused .orb, .ambient.paused .scan { animation-play-state: paused; }
  .orb { position: absolute; border-radius: 50%; filter: blur(64px); opacity: .42;
    mix-blend-mode: screen; transition: background 1.1s ease; }
  .orb-1 { width: 860px; height: 860px; top: -340px; left: 34%; margin-left: -430px; animation: drift1 24s ease-in-out infinite; }
  .orb-2 { width: 660px; height: 660px; bottom: -300px; right: -160px; animation: drift2 30s ease-in-out infinite; }
  .orb-3 { width: 520px; height: 520px; top: 40%; left: -200px; opacity: .26; animation: drift3 34s ease-in-out infinite; }
  /* Phones do the most compositing work for the least visible payoff: drop the
     third orb and soften the blur so the glass cards have less to re-sample. */
  @media (max-width: 900px) {
    .orb-3 { display: none; }
    .orb { filter: blur(54px); }
  }
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
  .spark { position: absolute; width: 10px; height: 10px; border-radius: 50%;
    animation: spark .95s cubic-bezier(.2,.8,.3,1) forwards; }
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

  /* ══════════════════ WAR ROOM RITUAL LAYER ════════════════════════════════ */

  /* Cold-open heartbeat — a slow double-thump red pulse behind the words */
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); opacity: .28; }
    14% { transform: scale(1.12); opacity: .62; }
    28% { transform: scale(1); opacity: .32; }
    42% { transform: scale(1.07); opacity: .5; }
    56% { transform: scale(1); opacity: .28; }
  }

  /* A word slamming onto the screen — overshoot, blur clearing, weight landing */
  @keyframes impactIn {
    0%   { opacity: 0; transform: scale(1.6); filter: blur(14px); letter-spacing: .2em; }
    55%  { opacity: 1; filter: blur(0); }
    70%  { transform: scale(.965); }
    100% { opacity: 1; transform: scale(1); letter-spacing: normal; }
  }

  /* Screen recoil on a hit — tiny, fast, asymmetric so it feels like a thud */
  @keyframes hitShake {
    0%{transform:translate(0,0);} 20%{transform:translate(-5px,3px);} 40%{transform:translate(6px,-2px);}
    60%{transform:translate(-4px,-3px);} 80%{transform:translate(3px,2px);} 100%{transform:translate(0,0);}
  }
  .hit-shake { animation: hitShake .42s cubic-bezier(.36,.07,.19,.97); }

  /* The oath / lock-in stamp — slams in rotated like an ink stamp, then settles */
  @keyframes oathStamp {
    0%   { opacity: 0; transform: rotate(-9deg) scale(1.7); filter: blur(5px); }
    60%  { opacity: 1; filter: blur(0); transform: rotate(-7deg) scale(.94); }
    100% { opacity: 1; transform: rotate(-7deg) scale(1); }
  }

  /* Cold-open dissolve — the arena igniting white as you enter */
  @keyframes igniteFlash { 0%{opacity:0;} 30%{opacity:.9;} 100%{opacity:0;} }

  /* Rank-up: the identity badge pulsing gold when you climb a tier */
  @keyframes rankPop { 0%{transform:scale(1);} 40%{transform:scale(1.18);} 100%{transform:scale(1);} }

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
