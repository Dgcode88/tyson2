import { motion } from "framer-motion";
import styled from "styled-components";
import { LuArrowRight, LuArrowLeft } from "react-icons/lu";
import { GlassCard } from "./ui.jsx";
import { phaseAccent } from "../theme.js";
import { useCountUp, Burst } from "./cinematic/index.jsx";
import ProgressRing from "./ProgressRing.jsx";
import DaySelector from "./DaySelector.jsx";
import FighterSilhouette from "./FighterSilhouette.jsx";
import { phaseMission, phaseOrder, restMission, restOrder } from "../data/creed.js";

const Hero = styled(GlassCard)`
  position: relative;
  padding: clamp(16px, 2vw, 28px);
  overflow: hidden;
`;

// The fighter, standing in the corner of the room. Atmosphere, not illustration.
const Ghost = styled.div`
  position: absolute;
  right: 22%;
  bottom: -8%;
  width: clamp(200px, 22vw, 340px);
  height: 122%;
  opacity: 0.1;
  pointer-events: none;
  mask-image: linear-gradient(to top, transparent 2%, #000 40%);
  -webkit-mask-image: linear-gradient(to top, transparent 2%, #000 40%);

  @media (max-width: 1080px) {
    right: -8%;
    opacity: 0.07;
    width: 300px;
  }
`;

// A faint accent wash bleeding up from the floor of the card.
const FloorGlow = styled.div`
  position: absolute;
  inset: auto -10% -40% -10%;
  height: 70%;
  background: radial-gradient(60% 100% at 60% 100%, ${({ $accent }) => $accent.glow}, transparent 70%);
  opacity: 0.45;
  pointer-events: none;
`;

const Top = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) clamp(218px, 22vw, 262px);
  align-items: start;
  gap: clamp(16px, 2.2vw, 34px);

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    gap: clamp(12px, 2vw, 20px);
  }
`;

const RingWrap = styled.div`
  position: relative;
  align-self: center;
`;

const Info = styled.div`
  min-width: 0;
  width: 100%;
`;

const Eyebrow = styled.p`
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.34em;
  text-indent: 0.34em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.blood};
`;

const Meta = styled.p`
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textDim};
`;

const PhaseName = styled.h1`
  font-family: ${({ theme }) => theme.font.brutal};
  font-size: clamp(34px, 5vw, 92px);
  line-height: 0.88;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
  margin: 0;
  background: ${({ $accent }) => `linear-gradient(100deg, ${$accent.from}, ${$accent.to})`};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: stamp 0.6s cubic-bezier(0.2, 0.85, 0.25, 1);
`;

const Mission = styled.p`
  margin: 10px 0 0;
  font-size: clamp(14px, 1.2vw, 18px);
  line-height: 1.38;
  font-weight: 600;
  color: ${({ theme }) => theme.color.text};
  max-width: 50ch;

  b {
    color: ${({ theme }) => theme.color.gold};
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  @media (max-width: 1080px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

// ── War cry (editable) ──────────────────────────────────────────────────────
const CryRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px dashed ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.goldSoft};
  max-width: 100%;
`;

const CryLabel = styled.span`
  flex: 0 0 auto;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.2em;
  line-height: 1.1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textDim};
`;

const CryText = styled.span`
  font-family: ${({ theme }) => theme.font.brutal};
  font-size: clamp(14px, 1.4vw, 19px);
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gold};
`;

const PhaseBar = styled.div`
  margin-top: 14px;
  position: relative;
  z-index: 1;
`;

const BarHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;

  @media (max-width: 560px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const BarLabel = styled.span`
  flex: 1;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};

  @media (max-width: 560px) {
    flex-basis: 100%;
    order: -1;
  }
`;

const Track = styled.div`
  height: 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.track};
  overflow: hidden;
`;

const Fill = styled(motion.div)`
  height: 100%;
  border-radius: inherit;
  background: ${({ $accent }) => `linear-gradient(90deg, ${$accent.from}, ${$accent.to})`};
  box-shadow: 0 0 18px ${({ $accent }) => $accent.glow};
`;

const PhaseJump = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ $accent }) => $accent.from}55;
  background: ${({ $accent }) => `linear-gradient(100deg, ${$accent.from}1f, ${$accent.to}14)`};
  color: ${({ theme }) => theme.color.text};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  svg {
    color: ${({ $accent }) => $accent.from};
    font-size: 14px;
  }

  &:hover {
    border-color: ${({ $accent }) => $accent.from};
    background: ${({ $accent }) => `linear-gradient(100deg, ${$accent.from}33, ${$accent.to}22)`};
    transform: translateY(-1px);
    box-shadow: 0 8px 20px -10px ${({ $accent }) => $accent.glow};
  }
`;

// ── Right column: rank badge above the day console ──────────────────────────
const Aside = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  width: 100%;

  @media (max-width: 1080px) {
    max-width: 380px;
    margin-top: 4px;
  }
`;

const Badge = styled.span`
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 13px 6px 11px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ $c }) => `${$c}66`};
  background: ${({ $c }) => `${$c}1a`};
  white-space: nowrap;
  /* Pops when the rank id changes (re-keyed by the parent). */
  animation: rankPop 0.6s cubic-bezier(0.2, 0.85, 0.25, 1);

  b {
    font-family: ${({ theme }) => theme.font.display};
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ $c }) => $c};
  }
  i {
    font-style: normal;
    font-size: 11px;
    font-weight: 700;
    color: ${({ theme }) => theme.color.textDim};
  }
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $c }) => $c};
  box-shadow: 0 0 10px ${({ $c }) => $c};
`;

export default function StatusHeader({
  currentDay,
  totalDays,
  currentPhase,
  accent,
  phaseName,
  phaseProgress,
  phaseDay,
  nextPhaseName,
  prevPhaseName,
  completed,
  burst,
  rank,
  warCry,
  onPrev,
  onNext,
  onJump,
  onToggleComplete,
  onNextPhase,
  onPrevPhase,
}) {
  const overall = Math.round((currentDay / totalDays) * 100);
  const dayCount = useCountUp(currentDay, 700);
  const pctCount = useCountUp(overall, 900);
  const prevAccent = phaseAccent(currentPhase - 1);
  const nextAccent = phaseAccent(currentPhase + 1);

  const isRest = currentDay % 7 === 0;
  const mission = isRest ? restMission : phaseMission[currentPhase];
  const order = isRest ? restOrder : phaseOrder[currentPhase];

  return (
    <Hero>
      <FloorGlow $accent={accent} aria-hidden="true" />
      <Ghost aria-hidden="true">
        <FighterSilhouette accent={accent} id={`hero-${currentPhase}`} />
      </Ghost>

      <Top>
        <RingWrap className="reveal">
          <ProgressRing
            value={(currentDay / totalDays) * 100}
            accent={accent}
            size={188}
            big={dayCount}
            small={`Day / ${totalDays}`}
            glow={`${accent.from}66`}
            flashKey={burst}
            gradientId={`phase-${currentPhase}`}
          />
          <Burst nonce={burst} />
        </RingWrap>

        <Info>
          <Eyebrow className="reveal" style={{ "--d": ".06s" }}>
            Today's Mission
          </Eyebrow>
          <Meta className="reveal" style={{ "--d": ".1s" }}>
            Phase {currentPhase} · Day {dayCount} of {totalDays} · {pctCount}% complete
          </Meta>

          <PhaseName key={currentPhase} $accent={accent}>
            {phaseName}
          </PhaseName>

          <Mission className="reveal" style={{ "--d": ".16s" }}>
            <b>{order}</b> {mission}
          </Mission>

          <CryRow className="reveal" style={{ "--d": ".22s" }}>
            <CryLabel>War cry</CryLabel>
            <CryText>{warCry}</CryText>
          </CryRow>

          <PhaseBar className="reveal" style={{ "--d": ".28s" }}>
            <BarHead>
              {prevPhaseName ? (
                <PhaseJump $accent={prevAccent} onClick={onPrevPhase}>
                  <LuArrowLeft /> Prev: {prevPhaseName}
                </PhaseJump>
              ) : (
                <span aria-hidden="true" />
              )}
              <BarLabel>
                {phaseName} · Day {phaseDay} / 30
              </BarLabel>
              {nextPhaseName ? (
                <PhaseJump $accent={nextAccent} onClick={onNextPhase}>
                  Next: {nextPhaseName} <LuArrowRight />
                </PhaseJump>
              ) : (
                <span aria-hidden="true" />
              )}
            </BarHead>
            <Track>
              <Fill
                $accent={accent}
                initial={false}
                animate={{ width: `${Math.max(0, Math.min(100, phaseProgress))}%` }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </Track>
          </PhaseBar>
        </Info>

        <Aside className="reveal" style={{ "--d": ".2s" }}>
          {rank && (
            <Badge key={rank.id} $c={rank.color} title={rank.blurb}>
              <Dot $c={rank.color} aria-hidden="true" />
              <b>{rank.name}</b>
              <i>· {rank.conquered} conquered</i>
            </Badge>
          )}
          <DaySelector
            currentDay={currentDay}
            totalDays={totalDays}
            completed={completed}
            onPrev={onPrev}
            onNext={onNext}
            onJump={onJump}
            onToggleComplete={onToggleComplete}
          />
        </Aside>
      </Top>
    </Hero>
  );
}
