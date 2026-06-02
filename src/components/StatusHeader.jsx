import { motion } from "framer-motion";
import styled from "styled-components";
import { LuArrowRight, LuArrowLeft } from "react-icons/lu";
import { GlassCard } from "./ui.jsx";
import { phaseAccent } from "../theme.js";
import { useCountUp, Burst } from "./cinematic/index.jsx";
import ProgressRing from "./ProgressRing.jsx";
import DaySelector from "./DaySelector.jsx";

const Hero = styled(GlassCard)`
  padding: clamp(18px, 2.4vw, 32px);
  overflow: hidden;
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: clamp(20px, 3vw, 44px);

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
`;

const RingWrap = styled.div`
  position: relative;
`;

const Info = styled.div`
  min-width: 0;
`;

const Eyebrow = styled.p`
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
`;

const PhaseNum = styled.span`
  display: block;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.22em;
  color: ${({ theme }) => theme.color.textDim};
  margin-bottom: 8px;
  -webkit-text-fill-color: ${({ theme }) => theme.color.textDim};
`;

const PhaseName = styled.h1`
  font-size: clamp(32px, 4.4vw, 62px);
  font-weight: 900;
  line-height: 0.92;
  letter-spacing: -0.035em;
  word-break: break-word;
  margin: 0;
  background: ${({ $accent }) => `linear-gradient(100deg, ${$accent.from}, ${$accent.to})`};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: stamp 0.6s cubic-bezier(0.2, 0.85, 0.25, 1);
`;

const Desc = styled.p`
  margin: 12px 0 0;
  font-size: clamp(14px, 1.2vw, 17px);
  line-height: 1.45;
  color: ${({ theme }) => theme.color.textMuted};
  max-width: 52ch;

  @media (max-width: 860px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const PhaseBar = styled.div`
  margin-top: 18px;
`;

const BarHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 9px;

  @media (max-width: 560px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const BarLabel = styled.span`
  flex: 1;
  text-align: center;
  font-size: 12px;
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
  height: 12px;
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
  padding: 8px 15px;
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

const Controls = styled.div`
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid ${({ theme }) => theme.color.border};
`;

export default function StatusHeader({
  currentDay,
  totalDays,
  currentPhase,
  accent,
  phaseName,
  phaseDescription,
  phaseProgress,
  phaseDay,
  nextPhaseName,
  prevPhaseName,
  completed,
  burst,
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

  return (
    <Hero>
      <Top>
        <RingWrap className="reveal">
          <ProgressRing
            value={(currentDay / totalDays) * 100}
            accent={accent}
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
            90-Day Tyson Transformation
          </Eyebrow>
          <PhaseName key={currentPhase} $accent={accent}>
            <PhaseNum>
              PHASE {currentPhase} · {pctCount}% COMPLETE
            </PhaseNum>
            {phaseName}
          </PhaseName>
          <Desc className="reveal" style={{ "--d": ".16s" }}>
            {phaseDescription}
          </Desc>

          <PhaseBar className="reveal" style={{ "--d": ".22s" }}>
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
      </Top>

      <Controls className="reveal" style={{ "--d": ".3s" }}>
        <DaySelector
          currentDay={currentDay}
          totalDays={totalDays}
          completed={completed}
          onPrev={onPrev}
          onNext={onNext}
          onJump={onJump}
          onToggleComplete={onToggleComplete}
        />
      </Controls>
    </Hero>
  );
}
