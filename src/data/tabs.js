// Single source of truth for the app's tabs. TabBar builds its buttons from
// this (adding the icon components), and vite.config.js derives the PWA
// manifest shortcuts from it — so renaming or removing a tab fails the build
// loudly instead of silently stranding an installed home-screen shortcut.
// Plain data only (no JSX/icons) so the Vite config can import it in Node.
export const TAB_DEFS = [
  { id: "schedule", label: "Schedule", color: "#2DD4BF" },
  { id: "training", label: "Training", color: "#FB7185" },
  { id: "nutrition", label: "Nutrition", color: "#F5B643" },
  { id: "mindset", label: "Mindset", color: "#A78BFA" },
  { id: "supplements", label: "Supplements", color: "#34D399" },
  { id: "recovery", label: "Recovery", color: "#38BDF8" },
  { id: "checklist", label: "Checklist", color: "#A3E635" },
  { id: "journey", label: "Journey", color: "#FB923C" },
  { id: "shopping", label: "Shopping", color: "#F472B6" },
];
