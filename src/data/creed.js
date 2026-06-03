// ─────────────────────────────────────────────────────────────────────────────
// THE WAR ROOM — identity layer. Pure data, like program.js and quotes.js, so
// the presentation stays engine-agnostic. Mission lines and creeds are the
// program's own voice (NOT attributed to Tyson). Rank lines ARE real,
// widely-attributed Tyson quotes.
// ─────────────────────────────────────────────────────────────────────────────

// One line that frames the whole phase as a mission, not a date.
export const phaseMission = {
  1: "Burn the old you down. What's left standing is the foundation.",
  2: "Build the weapons. Drill the instincts until they fire without you.",
  3: "Sharpen everything. Walk in as something that wasn't here before.",
};

// The day's marching order, shown small under the phase name.
export const phaseOrder = {
  1: "Tear it down.",
  2: "Build it back dangerous.",
  3: "Make it lethal.",
};

// Rest days run at a different intensity on purpose — constant red-line burns
// you out by day 50. Sunday (day % 7 === 0) reframes the mission toward repair.
export const restMission = "Recover hard. Today you sharpen the blade — you don't break it.";
export const restOrder = "Rebuild.";

// ── War cry ─────────────────────────────────────────────────────────────────
// A new battle cry every week (~13 weeks across 90 days) so it never goes stale.
// The program's own voice — short, all-caps, no attribution.
export const WAR_CRIES = [
  "I DON'T NEGOTIATE WITH WEAKNESS.",
  "COMFORT IS THE ENEMY — I LEFT IT BEHIND.",
  "I AM BUILT, NOT BORN.",
  "NOBODY'S COMING. I SAVE MYSELF.",
  "THE WORK IS THE REWARD.",
  "I OUTWORK WHO I WAS YESTERDAY.",
  "FEAR RIDES ALONG. IT DOESN'T DRIVE.",
  "EVERY REP IS A VOTE FOR WHO I'M BECOMING.",
  "DISCIPLINE WHEN NO ONE'S WATCHING.",
  "I AM THE WEAPON.",
  "I DON'T BREAK. I FORGE.",
  "EARN THE MORNING. EARN THE NIGHT.",
  "QUIT ISN'T IN THE BUILDING.",
];

// The cry for a given day — same all week, then it turns over.
export const getWarCry = (day) => {
  const week = Math.ceil(Math.max(1, day) / 7); // 1..13
  return WAR_CRIES[(week - 1) % WAR_CRIES.length];
};

// ── The rank ladder ─────────────────────────────────────────────────────────
// Earned by days CONQUERED (completed), never by the calendar. A rank you can't
// get by waiting is a rank that means something. Each tier owns a colour and a
// real Tyson line that fits who you've become.
export const RANKS = [
  {
    id: "recruit",
    name: "RECRUIT",
    min: 0,
    color: "#9AA4B2",
    line: "Discipline is doing what you hate to do but doing it like you love it.",
    blurb: "Raw. Unproven. Hungry.",
  },
  {
    id: "contender",
    name: "CONTENDER",
    min: 10,
    color: "#2DD4BF",
    line: "Everyone has a plan until they get punched in the mouth.",
    blurb: "Tested. Still standing.",
  },
  {
    id: "killer",
    name: "KILLER",
    min: 30,
    color: "#F5B643",
    line: "When I fight someone, I want to break his will.",
    blurb: "Sharpened. Dangerous.",
  },
  {
    id: "warlord",
    name: "WARLORD",
    min: 60,
    color: "#FB7185",
    line: "I'm the best ever. The most brutal and vicious, the most ruthless champion there has ever been.",
    blurb: "Feared. Relentless.",
  },
  {
    id: "champion",
    name: "CHAMPION",
    min: 90,
    color: "#A78BFA",
    line: "I just want to conquer people and their souls.",
    blurb: "Forged. Complete. Reborn.",
  },
];

// Highest tier the user has earned for a given conquered-day count.
export const getRank = (conquered) => {
  let earned = RANKS[0];
  for (const tier of RANKS) if (conquered >= tier.min) earned = tier;
  return earned;
};

// The next tier and how many days remain to reach it (null once maxed out).
export const getNextRank = (conquered) => {
  const next = RANKS.find((t) => t.min > conquered);
  return next ? { ...next, remaining: next.min - conquered } : null;
};
