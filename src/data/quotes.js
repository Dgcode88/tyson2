// ─────────────────────────────────────────────────────────────────────────────
// MIKE TYSON — the voice in the room.
//
// Real, widely-attributed Mike Tyson quotes. One is surfaced every day as the
// "Quote of the Day" (deterministic from the day number, so it never changes
// mid-day), and each module pulls a quote whose theme fits what you're doing
// there. Casing in copy stays as Tyson said it; the UI sets the drama.
// ─────────────────────────────────────────────────────────────────────────────

// theme keys: discipline · fear · power · mind · will · victory · suffering · fuel
export const TYSON_QUOTES = [
  { text: "Discipline is doing what you hate to do but doing it like you love it.", themes: ["discipline"] },
  { text: "My power is discipline.", themes: ["discipline", "power"] },
  { text: "Without discipline, no matter how good you are, you are nothing.", themes: ["discipline", "will"] },
  { text: "Excellence is not an act, but a habit.", themes: ["discipline", "fuel"] },
  { text: "Everyone has a plan until they get punched in the mouth.", themes: ["mind", "fear"] },
  { text: "Fear is like fire. It can cook for you or it can burn your house down — it's all in how you control it.", themes: ["fear"] },
  { text: "I'm scared every time I step into the ring. It's how you handle that fear that matters.", themes: ["fear", "mind"] },
  { text: "The greatest obstacle is the fear in your own mind. Master it, and nothing can touch you.", themes: ["fear", "mind"] },
  { text: "Everybody thinks this is a tough-man sport. It's not. It's a thinking man's sport.", themes: ["mind"] },
  { text: "It's good to know how to read, but it's dangerous to know how to read and not understand what you read.", themes: ["mind"] },
  { text: "I just want to conquer people and their souls.", themes: ["power"] },
  { text: "I'm the best ever. The most brutal and vicious, the most ruthless champion there has ever been.", themes: ["power", "victory"] },
  { text: "I don't try to intimidate anybody before a fight. I intimidate people by hitting them.", themes: ["power"] },
  { text: "When I fight someone, I want to break his will.", themes: ["power", "will"] },
  { text: "I could feel his muscle tissue collapse under my force. It's ludicrous these mortals even attempt to enter my realm.", themes: ["power", "victory"] },
  { text: "The thing about being a champion is, you have to be willing to suffer.", themes: ["suffering", "will"] },
  { text: "As long as we persevere and endure, we can get anything we want.", themes: ["will", "suffering"] },
  { text: "Greatness is not guaranteed. It's earned.", themes: ["will", "discipline"] },
  { text: "The word 'no' to me means yes.", themes: ["will"] },
  { text: "I'm a dreamer. I have to dream and reach for the stars, and if I miss a star, I grab a handful of clouds.", themes: ["will", "victory"] },
  { text: "Confidence breeds success, and success breeds confidence.", themes: ["victory", "mind"] },
  { text: "People love you when you're a winner.", themes: ["victory"] },
  { text: "I'm in the hurt business — and right now, business is good.", themes: ["power", "victory"] },
  { text: "Champions get up when they can't.", themes: ["suffering", "will"] },
];

// Which themes each module leans on. The hero quote of the day uses the whole pool.
const MODULE_THEMES = {
  schedule: ["discipline", "will"],
  training: ["power", "will", "suffering"],
  nutrition: ["discipline", "fuel"],
  mindset: ["fear", "mind"],
  supplements: ["fuel", "discipline"],
  recovery: ["suffering", "will"],
  checklist: ["discipline"],
  shopping: ["discipline", "fuel"],
};

// Stable hash so a given (module, day) always lands on the same quote, but
// different modules on the same day rarely collide.
const pick = (pool, seed) => pool[((seed % pool.length) + pool.length) % pool.length];

// The day's headline quote — walks the full pool, deterministic per day.
export const getDailyQuote = (day) => pick(TYSON_QUOTES, day - 1);

// A quote that fits the module you're in, varied by day so it doesn't go stale.
export const getModuleQuote = (moduleId, day = 1) => {
  const themes = MODULE_THEMES[moduleId] || [];
  const pool = TYSON_QUOTES.filter((q) => q.themes.some((t) => themes.includes(t)));
  const list = pool.length ? pool : TYSON_QUOTES;
  // offset by module so module + daily quotes differ on the same day
  const seed = day + moduleId.length * 7;
  return pick(list, seed);
};
