import { useState, useEffect, useRef, useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { motion, MotionConfig } from "framer-motion";
import styled from "styled-components";

import { theme, phaseAccent, GlobalStyle } from "./theme.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { playSound } from "./hooks/useSound.js";
import { vibrate, HAPTIC } from "./lib/haptics.js";
import {
  TOTAL_DAYS,
  phaseMeta,
  getPhaseFromDay,
  getCurrentPhaseProgress,
  getPhaseDay,
  checklistKey,
} from "./data/program.js";
import { getDailyQuote } from "./data/quotes.js";
import { getRank, getNextRank, RANKS, getWarCry } from "./data/creed.js";
import { Ambient, PhaseFlash } from "./components/cinematic/index.jsx";
import ColdOpen from "./components/ColdOpen.jsx";
import SoundToggle from "./components/SoundToggle.jsx";
import RankUpToast from "./components/RankUpToast.jsx";
import StatusHeader from "./components/StatusHeader.jsx";
import StatsStrip from "./components/StatsStrip.jsx";
import GoldenNugget from "./components/GoldenNugget.jsx";
import DataControls from "./components/DataControls.jsx";
import JourneyPanel from "./components/JourneyPanel.jsx";
import { PhaseConqueredToast, ForgedOverlay } from "./components/Milestones.jsx";
import TabBar, { TABS } from "./components/TabBar.jsx";
import {
  SchedulePanel,
  TrainingPanel,
  NutritionPanel,
  MindsetPanel,
  SupplementsPanel,
  RecoveryPanel,
  ShoppingPanel,
  ChecklistPanel,
} from "./components/panels.jsx";

const Layout = styled.div`
  position: relative;
  z-index: 1;
`;

// Keyboard/screen-reader escape hatch over the tab rail straight to the content.
// Off-screen until focused, then it lands as an on-brand pill.
const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: 8px;
  z-index: 1200;
  padding: 10px 18px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.teal};
  color: ${({ theme }) => theme.color.tealInk};
  font-weight: 800;
  letter-spacing: 0.04em;
  text-decoration: none;
  &:focus {
    left: 12px;
  }
`;

const Main = styled.main`
  margin-left: ${({ theme }) => theme.layout.rail};
  padding: clamp(12px, 1.4vw, 22px);
  min-height: 100vh;

  @media (max-width: 900px) {
    margin-left: 0;
    padding-bottom: 108px;
  }
`;

const Stack = styled.div`
  max-width: ${({ theme }) => theme.layout.maxMain};
  margin: 0 auto;
  display: grid;
  gap: clamp(10px, 1vw, 14px);

  /* Grid items default to min-width:auto, letting a wide child force the whole
     column past the viewport. Pin them to 0 so cards clip internally instead. */
  & > * {
    min-width: 0;
  }
`;

// NaN-safe: a corrupted/restored value falls back to Day 1 instead of poisoning
// every downstream day computation with NaN.
const clamp = (n) => (Number.isFinite(n) ? Math.max(1, Math.min(TOTAL_DAYS, n)) : 1);

// Open straight to a tab from a deep link / PWA shortcut (e.g. ...?tab=checklist).
const initialTab = () => {
  try {
    const t = new URLSearchParams(window.location.search).get("tab");
    return TABS.some((tab) => tab.id === t) ? t : "schedule";
  } catch {
    return "schedule";
  }
};

// Local calendar-date helpers for real-date anchoring (stored as YYYY-MM-DD).
const toISODate = (d) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const daysSince = (iso) =>
  Math.floor((Date.now() - new Date(`${iso}T00:00:00`).getTime()) / 86400000);
const isValidISODate = (iso) =>
  typeof iso === "string" && Number.isFinite(new Date(`${iso}T00:00:00`).getTime());

// Journey unit conversion — toggling lbs/kg converts the stored record itself
// (weight lbs↔kg, tape inches↔cm), so the chart, deltas, and form always read
// numbers in the active unit. Rounded to one decimal to match entry precision.
const LB_PER_KG = 2.20462;
const CM_PER_IN = 2.54;
const round1 = (n) => Math.round(n * 10) / 10;
const convertJourney = (journey, toMetric) => {
  const wf = toMetric ? 1 / LB_PER_KG : LB_PER_KG;
  const tf = toMetric ? CM_PER_IN : 1 / CM_PER_IN;
  const next = {};
  Object.entries(journey).forEach(([day, entry]) => {
    const conv = {};
    Object.entries(entry || {}).forEach(([k, v]) => {
      conv[k] = Number.isFinite(v) ? round1(v * (k === "w" ? wf : tf)) : v;
    });
    next[day] = conv;
  });
  return next;
};

export default function App() {
  const [currentDay, setCurrentDay] = useLocalStorage("tysonDashboardDay", 1);
  const [startDate, setStartDate] = useLocalStorage("tysonStartDate", null);
  const [completedDays, setCompletedDays] = useLocalStorage("tysonCompletedDays", {});
  // Per-day checklist, persisted and namespaced by day (`${day}:${id}`) so checks
  // survive a reload and never bleed from one day into the next.
  const [checklist, setChecklist] = useLocalStorage("tysonChecklist", {});
  // The Journey: body measurements keyed by program day, all on-device.
  const [journey, setJourney] = useLocalStorage("tysonJourney", {});
  const [journeyUnit, setJourneyUnit] = useLocalStorage("tysonJourneyUnit", "lbs");
  const [activeTab, setActiveTab] = useState(initialTab);

  const [burst, setBurst] = useState(0);
  const [flash, setFlash] = useState(0);
  const [boot, setBoot] = useState(true);
  const [rankUp, setRankUp] = useState(null);
  // {type:"phase", phase} when day 30/60 is locked in · {type:"forged"} on day 90.
  const [milestone, setMilestone] = useState(null);

  // THE WALKOUT — the cold open shows once per browser session, then steps aside.
  const [walkout, setWalkout] = useState(() => {
    try {
      return sessionStorage.getItem("tysonWalkout") !== "done";
    } catch {
      return true;
    }
  });

  const currentPhase = getPhaseFromDay(currentDay);
  const accent = phaseAccent(currentPhase);
  const warCry = getWarCry(currentDay); // rotates every week
  const nextPhase = currentPhase < 3 ? currentPhase + 1 : null;
  const prevPhase = currentPhase > 1 ? currentPhase - 1 : null;
  const lastPhase = useRef(currentPhase);

  const conquered = useMemo(
    () => Object.values(completedDays).filter(Boolean).length,
    [completedDays]
  );
  const rank = getRank(conquered);
  const nextRank = getNextRank(conquered);
  const rankIndex = RANKS.findIndex((r) => r.id === rank.id);
  const prevRankIndex = useRef(rankIndex);

  // Anchor the program to real calendar time. On the first run ever, pin the
  // start date so "today" equals the day the cursor is already on (this preserves
  // any existing progress instead of snapping a mid-program user back to Day 1).
  // Then every open jumps to today's real day; the stepper still previews any day.
  const anchored = useRef(false);
  useEffect(() => {
    if (anchored.current) return;
    anchored.current = true;

    // One-time migration: checklist entries stored under bare `id` keys (before
    // day-namespacing was introduced) are re-keyed to `currentDay:id` so existing
    // progress isn't silently lost on first load after the upgrade.
    setChecklist((prev) => {
      const legacy = Object.keys(prev).filter((k) => !/^\d+:/.test(k));
      if (!legacy.length) return prev;
      const next = { ...prev };
      const day = clamp(typeof currentDay === "number" ? currentDay : 1);
      legacy.forEach((k) => {
        next[checklistKey(day, k)] = next[k];
        delete next[k];
      });
      return next;
    });

    let sd = startDate;
    // A restored backup can carry a malformed date — treat it like a missing
    // one and re-anchor, instead of letting NaN flow into the day counter.
    if (!isValidISODate(sd)) {
      const d = new Date();
      d.setDate(d.getDate() - (clamp(currentDay) - 1));
      sd = toISODate(d);
      setStartDate(sd);
    }
    setCurrentDay(clamp(daysSince(sd) + 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Self-healing boot window: entrance choreography runs once, then content is
  // permanently visible (so tab switches never leave anything hidden).
  useEffect(() => {
    const id = setTimeout(() => setBoot(false), 1700);
    return () => clearTimeout(id);
  }, []);

  // Cinematic accent flash whenever the phase changes.
  useEffect(() => {
    if (lastPhase.current !== currentPhase) {
      setFlash((f) => f + 1);
      lastPhase.current = currentPhase;
    }
  }, [currentPhase]);

  // Promotion: celebrate only when the rank climbs (never on the way down from
  // un-locking a day). Bell + a long haptic roll + the rank-up card.
  useEffect(() => {
    if (rankIndex > prevRankIndex.current) {
      setRankUp(rank);
      playSound("bell");
      vibrate(HAPTIC.rankUp);
    }
    prevRankIndex.current = rankIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankIndex]);

  // Auto-dismiss the rank-up card.
  useEffect(() => {
    if (!rankUp) return;
    const id = setTimeout(() => setRankUp(null), 3400);
    return () => clearTimeout(id);
  }, [rankUp]);

  // Auto-dismiss the phase-conquered toast (FORGED holds until dismissed).
  useEffect(() => {
    if (milestone?.type !== "phase") return;
    const id = setTimeout(() => setMilestone(null), 4600);
    return () => clearTimeout(id);
  }, [milestone]);

  const phaseStartDay = (p) => (p - 1) * 30 + 1;
  const goToDay = (d) => setCurrentDay(clamp(d));
  const jumpToNextPhase = () => nextPhase && goToDay(phaseStartDay(nextPhase));
  const jumpToPrevPhase = () => prevPhase && goToDay(phaseStartDay(prevPhase));

  // Lock in / un-lock the day. Side effects live OUTSIDE the state updater so
  // React's StrictMode double-invoke can't double-ring the bell.
  const toggleDayCompletion = () => {
    const lockingIn = !completedDays[currentDay];
    setCompletedDays((prev) => ({ ...prev, [currentDay]: !prev[currentDay] }));
    if (lockingIn) {
      setBurst((b) => b + 1);
      playSound("bell");
      vibrate(HAPTIC.lockIn);
      // Milestones: a phase falls when its last day is locked; day 90 ends the forge.
      if (currentDay === TOTAL_DAYS) {
        setMilestone({ type: "forged" });
        vibrate(HAPTIC.rankUp);
      } else if (currentDay === 30 || currentDay === 60) {
        setMilestone({ type: "phase", phase: getPhaseFromDay(currentDay) });
      }
    } else {
      playSound("tick");
    }
  };

  const logJourney = (day, entry) => setJourney((prev) => ({ ...prev, [day]: entry }));

  // Convert the data, not just the label — otherwise entries logged under
  // different units silently mix in the same chart.
  const toggleJourneyUnit = () => {
    const toMetric = journeyUnit === "lbs";
    setJourney((prev) => convertJourney(prev, toMetric));
    setJourneyUnit(toMetric ? "kg" : "lbs");
  };

  const enterArena = () => {
    try {
      sessionStorage.setItem("tysonWalkout", "done");
    } catch {
      /* ignore */
    }
    setWalkout(false);
  };

  const toggleChecklistItem = (id) => {
    const key = checklistKey(currentDay, id);
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetChecklist = (items) => {
    const cleared = {};
    items.forEach((it) => {
      cleared[checklistKey(currentDay, it.id)] = false;
    });
    setChecklist((prev) => ({ ...prev, ...cleared }));
  };

  // Built once per relevant state change, not once per render — otherwise every
  // unrelated update (boot timer, lock-in burst, toasts) re-renders the active
  // panel. Handlers are deliberately not in the deps: every state value they
  // close over (currentDay, journeyUnit) IS listed, and setters are stable.
  const panels = useMemo(
    () => ({
      schedule: <SchedulePanel currentDay={currentDay} currentPhase={currentPhase} accent={accent} />,
      training: <TrainingPanel currentPhase={currentPhase} currentDay={currentDay} accent={accent} />,
      nutrition: <NutritionPanel currentDay={currentDay} currentPhase={currentPhase} accent={accent} />,
      mindset: <MindsetPanel currentPhase={currentPhase} currentDay={currentDay} accent={accent} />,
      supplements: <SupplementsPanel currentPhase={currentPhase} currentDay={currentDay} accent={accent} />,
      recovery: <RecoveryPanel currentPhase={currentPhase} currentDay={currentDay} accent={accent} />,
      checklist: (
        <ChecklistPanel
          currentDay={currentDay}
          currentPhase={currentPhase}
          accent={accent}
          checklist={checklist}
          onToggle={toggleChecklistItem}
          onReset={resetChecklist}
        />
      ),
      journey: (
        <JourneyPanel
          journey={journey}
          onLog={logJourney}
          currentDay={currentDay}
          accent={accent}
          unit={journeyUnit}
          onToggleUnit={toggleJourneyUnit}
        />
      ),
      shopping: <ShoppingPanel currentDay={currentDay} currentPhase={currentPhase} accent={accent} />,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDay, currentPhase, accent, checklist, journey, journeyUnit]
  );

  return (
    <ThemeProvider theme={theme}>
      <MotionConfig reducedMotion="user">
      <GlobalStyle />
      <Ambient accent={accent} />
      <PhaseFlash nonce={flash} accent={accent} />

      {walkout && (
        <ColdOpen
          day={currentDay}
          phaseName={phaseMeta[currentPhase].name}
          accent={accent}
          tysonLine={getDailyQuote(currentDay).text}
          warCry={warCry}
          onEnter={enterArena}
        />
      )}

      {!walkout && <SoundToggle />}
      {rankUp && <RankUpToast rank={rankUp} />}
      {milestone?.type === "phase" && <PhaseConqueredToast phase={milestone.phase} />}
      {milestone?.type === "forged" && (
        <ForgedOverlay conquered={conquered} onClose={() => setMilestone(null)} />
      )}

      <Layout>
        <SkipLink href="#main">Skip to content</SkipLink>
        <TabBar active={activeTab} onChange={setActiveTab} />

        <Main id="main" tabIndex={-1}>
          <Stack className={boot ? "boot" : undefined}>
            <StatusHeader
              currentDay={currentDay}
              totalDays={TOTAL_DAYS}
              currentPhase={currentPhase}
              accent={accent}
              phaseName={phaseMeta[currentPhase].name}
              phaseProgress={getCurrentPhaseProgress(currentDay, currentPhase)}
              phaseDay={getPhaseDay(currentDay, currentPhase)}
              nextPhaseName={nextPhase ? phaseMeta[nextPhase].name : null}
              prevPhaseName={prevPhase ? phaseMeta[prevPhase].name : null}
              completed={!!completedDays[currentDay]}
              burst={burst}
              rank={{ ...rank, conquered }}
              warCry={warCry}
              onPrev={() => goToDay(currentDay - 1)}
              onNext={() => goToDay(currentDay + 1)}
              onJump={goToDay}
              onToggleComplete={toggleDayCompletion}
              onNextPhase={jumpToNextPhase}
              onPrevPhase={jumpToPrevPhase}
            />

            <StatsStrip
              completedDays={completedDays}
              currentDay={currentDay}
              currentPhase={currentPhase}
              accent={accent}
              nextRank={nextRank}
            />

            {/* No AnimatePresence/exit: the new panel mounts immediately and
                fades up via its keyed entrance, so there's no empty "dead beat"
                between tabs. */}
            <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} tabIndex={0}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {panels[activeTab]}
              </motion.div>
            </div>

            <GoldenNugget currentDay={currentDay} />
            <DataControls />
          </Stack>
        </Main>
      </Layout>
      </MotionConfig>
    </ThemeProvider>
  );
}
