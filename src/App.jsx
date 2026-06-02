import { useState, useEffect, useRef } from "react";
import { ThemeProvider } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

import { theme, phaseAccent, GlobalStyle } from "./theme.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import {
  TOTAL_DAYS,
  phaseMeta,
  getPhaseFromDay,
  getCurrentPhaseProgress,
  getPhaseDay,
} from "./data/program.js";
import { Ambient, PhaseFlash } from "./components/cinematic/index.jsx";
import StatusHeader from "./components/StatusHeader.jsx";
import DailyQuote from "./components/DailyQuote.jsx";
import StatsStrip from "./components/StatsStrip.jsx";
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
  padding: clamp(14px, 1.8vw, 30px);
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
  gap: clamp(13px, 1.4vw, 20px);
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

  const currentPhase = getPhaseFromDay(currentDay);
  const accent = phaseAccent(currentPhase);
  const nextPhase = currentPhase < 3 ? currentPhase + 1 : null;
  const prevPhase = currentPhase > 1 ? currentPhase - 1 : null;
  const lastPhase = useRef(currentPhase);

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

  const phaseStartDay = (p) => (p - 1) * 30 + 1;
  const goToDay = (d) => setCurrentDay(clamp(d));
  const jumpToNextPhase = () => nextPhase && goToDay(phaseStartDay(nextPhase));
  const jumpToPrevPhase = () => prevPhase && goToDay(phaseStartDay(prevPhase));

  const toggleDayCompletion = () =>
    setCompletedDays((prev) => {
      const next = { ...prev, [currentDay]: !prev[currentDay] };
      if (next[currentDay]) setBurst((b) => b + 1);
      return next;
    });

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
              phaseDescription={phaseMeta[currentPhase].description}
              phaseProgress={getCurrentPhaseProgress(currentDay, currentPhase)}
              phaseDay={getPhaseDay(currentDay, currentPhase)}
              nextPhaseName={nextPhase ? phaseMeta[nextPhase].name : null}
              prevPhaseName={prevPhase ? phaseMeta[prevPhase].name : null}
              completed={!!completedDays[currentDay]}
              burst={burst}
              onPrev={() => goToDay(currentDay - 1)}
              onNext={() => goToDay(currentDay + 1)}
              onJump={goToDay}
              onToggleComplete={toggleDayCompletion}
              onNextPhase={jumpToNextPhase}
              onPrevPhase={jumpToPrevPhase}
            />

            <DailyQuote
              currentDay={currentDay}
              accent={accent}
              phaseName={phaseMeta[currentPhase].name}
            />

            <StatsStrip
              completedDays={completedDays}
              currentDay={currentDay}
              currentPhase={currentPhase}
              accent={accent}
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
          </Stack>
        </Main>
      </Layout>
    </ThemeProvider>
  );
}
