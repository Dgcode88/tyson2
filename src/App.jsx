import { useState, useEffect, useRef, useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
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
import TabBar from "./components/TabBar.jsx";
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

const clamp = (n) => Math.max(1, Math.min(TOTAL_DAYS, n));

export default function App() {
  const [currentDay, setCurrentDay] = useLocalStorage("tysonDashboardDay", 31);
  const [completedDays, setCompletedDays] = useLocalStorage("tysonCompletedDays", {});
  const [checklist, setChecklist] = useState({});
  const [activeTab, setActiveTab] = useState("schedule");

  const [burst, setBurst] = useState(0);
  const [flash, setFlash] = useState(0);
  const [boot, setBoot] = useState(true);
  const [rankUp, setRankUp] = useState(null);

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
    } else {
      playSound("tick");
    }
  };

  const enterArena = () => {
    try {
      sessionStorage.setItem("tysonWalkout", "done");
    } catch {
      /* ignore */
    }
    setWalkout(false);
  };

  const toggleChecklistItem = (id) =>
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));

  const resetChecklist = (items) => {
    const cleared = {};
    items.forEach((it) => {
      cleared[it.id] = false;
    });
    setChecklist((prev) => ({ ...prev, ...cleared }));
  };

  const panels = {
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
    shopping: <ShoppingPanel currentDay={currentDay} currentPhase={currentPhase} accent={accent} />,
  };

  return (
    <ThemeProvider theme={theme}>
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

      <Layout>
        <TabBar active={activeTab} onChange={setActiveTab} />

        <Main>
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

            <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {panels[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>

            <GoldenNugget currentDay={currentDay} />
          </Stack>
        </Main>
      </Layout>
    </ThemeProvider>
  );
}
