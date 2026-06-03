// ─────────────────────────────────────────────────────────────────────────────
// THE GOLDEN NUGGET — wisdom from the corner, saved for whoever reaches the
// bottom of the page. Real, widely-attributed quotes from the fighters and the
// trainer who built them. Heavy on Cus D'Amato, Tyson's mentor, because almost
// no one has read him — that's the surprise. One surfaces per day, deterministically.
// ─────────────────────────────────────────────────────────────────────────────

export const LEGEND_QUOTES = [
  // ── Cus D'Amato — the architect of the mind ──────────────────────────────
  {
    text: "The hero and the coward both feel exactly the same fear. The hero just confronts his fear and converts it into fire.",
    author: "Cus D'Amato",
    role: "Tyson's trainer",
  },
  {
    text: "Fear is the greatest obstacle to learning. But fear is your best friend. Fear is like fire — if you learn to control it, you let it work for you.",
    author: "Cus D'Amato",
    role: "Tyson's trainer",
  },
  {
    text: "When two men are fighting, what you're watching is more a contest of wills than of skills. The stronger will usually wins.",
    author: "Cus D'Amato",
    role: "Tyson's trainer",
  },
  {
    text: "To see a man beaten not by a better opponent but by himself is a tragedy.",
    author: "Cus D'Amato",
    role: "Tyson's trainer",
  },
  {
    text: "No matter what anyone says, no matter the excuse or explanation, whatever a person does in the end is what he intended to do all along.",
    author: "Cus D'Amato",
    role: "Tyson's trainer",
  },
  {
    text: "A boy comes to me with a spark of interest. I feed the spark and it becomes a flame. I feed the flame and it becomes a fire. I feed the fire and it becomes a roaring blaze.",
    author: "Cus D'Amato",
    role: "Tyson's trainer",
  },
  {
    text: "The mind is everything. Muscles are nothing without it. You build a fighter from the head down.",
    author: "Cus D'Amato",
    role: "Tyson's trainer",
  },
  {
    text: "I make my fighters so familiar with fear that they no longer fear it.",
    author: "Cus D'Amato",
    role: "Tyson's trainer",
  },

  // ── Muhammad Ali — the greatest ──────────────────────────────────────────
  {
    text: "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.'",
    author: "Muhammad Ali",
    role: "Heavyweight champion",
  },
  {
    text: "It isn't the mountains ahead to climb that wear you out; it's the pebble in your shoe.",
    author: "Muhammad Ali",
    role: "Heavyweight champion",
  },
  {
    text: "Champions aren't made in gyms. Champions are made from something they have deep inside them — a desire, a dream, a vision.",
    author: "Muhammad Ali",
    role: "Heavyweight champion",
  },
  {
    text: "Don't count the days. Make the days count.",
    author: "Muhammad Ali",
    role: "Heavyweight champion",
  },
  {
    text: "He who is not courageous enough to take risks will accomplish nothing in life.",
    author: "Muhammad Ali",
    role: "Heavyweight champion",
  },

  // ── Sugar Ray Robinson — pound for pound ─────────────────────────────────
  {
    text: "To be a champion, you have to believe in yourself when nobody else will.",
    author: "Sugar Ray Robinson",
    role: "Pound-for-pound legend",
  },
  {
    text: "You always say you'll quit when you start to slide — and then one morning you wake up and realize you've done slid.",
    author: "Sugar Ray Robinson",
    role: "Pound-for-pound legend",
  },

  // ── Mike Tyson — the student who became the storm ────────────────────────
  {
    text: "Discipline is doing what you hate to do but doing it like you love it.",
    author: "Mike Tyson",
    role: "Youngest heavyweight champion",
  },
  {
    text: "The thing about being a champion is, you have to be willing to suffer.",
    author: "Mike Tyson",
    role: "Youngest heavyweight champion",
  },
];

// Deterministic per-day pick, so the nugget changes daily but never mid-day.
// Offset from the daily Tyson hero quote so the two rarely echo each other.
export const getLegendQuote = (day = 1) => {
  const i = (((day + 3) % LEGEND_QUOTES.length) + LEGEND_QUOTES.length) % LEGEND_QUOTES.length;
  return LEGEND_QUOTES[i];
};
