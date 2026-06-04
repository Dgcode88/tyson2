import styled from "styled-components";
import { LuFlame, LuMedal, LuTrendingUp } from "react-icons/lu";
import { GlassCard } from "./ui.jsx";
import { useCountUp } from "./cinematic/index.jsx";
import { TOTAL_DAYS, getCurrentPhaseProgress } from "../data/program.js";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(10px, 1.2vw, 16px);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled(GlassCard)`
  padding: clamp(11px, 1.3vw, 16px) clamp(14px, 1.6vw, 20px);
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: ${({ theme }) => theme.color.borderStrong};
    box-shadow: 0 24px 48px -28px rgba(0, 0, 0, 0.92);
  }
`;

const Topline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Label = styled.span`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
`;

const Num = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 900;
  font-size: clamp(28px, 2.8vw, 40px);
  line-height: 0.9;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.color.text};
`;

const Suffix = styled.span`
  font-size: 0.5em;
  color: ${({ theme }) => theme.color.textDim};
  margin-left: 2px;
`;

// The prominent context line under the number (e.g. "DAYS TO CONTENDER").
const Unit = styled.span`
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ $c, theme }) => $c || theme.color.textMuted};
`;

const Bar = styled.div`
  height: 5px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.track};
  overflow: hidden;
  margin-top: 2px;
`;

const BarFill = styled.i`
  display: block;
  height: 100%;
  border-radius: inherit;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $accent }) => `linear-gradient(90deg, ${$accent.from}, ${$accent.to})`};
  /* No outer glow here — the glow budget is reserved for the ring + lock-in. */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
`;

const Foot = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.color.textDim};
`;

function StatCard({ icon: Icon, value, suffix, unit, unitColor, label, foot, pct, accent, d }) {
  const n = useCountUp(value, 1000);
  return (
    <Stat className="reveal" style={{ "--d": d }}>
      <Topline>
        <Label>{label}</Label>
        <Icon size={17} style={{ color: accent.from }} aria-hidden="true" />
      </Topline>
      <Num>
        {n}
        {suffix && <Suffix>{suffix}</Suffix>}
      </Num>
      {unit && <Unit $c={unitColor}>{unit}</Unit>}
      {pct != null && (
        <Bar>
          <BarFill $pct={pct} $accent={accent} />
        </Bar>
      )}
      {foot && <Foot>{foot}</Foot>}
    </Stat>
  );
}

export default function StatsStrip({ completedDays, currentDay, currentPhase, accent, nextRank }) {
  const total = Object.values(completedDays).filter(Boolean).length;
  // Anchor the streak to the furthest day actually locked in — not the browsing
  // cursor — so previewing a future day no longer reports a streak of 0.
  const conqueredDays = Object.keys(completedDays)
    .filter((d) => completedDays[d])
    .map(Number);
  const anchor = conqueredDays.length ? Math.max(...conqueredDays) : 0;
  let streak = 0;
  for (let d = anchor; d >= 1; d--) {
    if (completedDays[d]) streak++;
    else break;
  }
  const phasePct = Math.round(getCurrentPhaseProgress(currentDay, currentPhase));
  const overallPct = Math.round((total / TOTAL_DAYS) * 100);

  return (
    <Grid>
      <StatCard
        icon={LuFlame}
        value={streak}
        label="Day Streak"
        foot={streak === 0 ? "Light the fire today" : "Don't break the chain"}
        accent={accent}
        d=".05s"
      />
      {nextRank ? (
        <StatCard
          icon={LuMedal}
          value={nextRank.remaining}
          label="Next Rank"
          unit={`days to ${nextRank.name}`}
          unitColor={nextRank.color}
          foot={`${total} of ${TOTAL_DAYS} conquered`}
          pct={overallPct}
          accent={accent}
          d=".12s"
        />
      ) : (
        <StatCard
          icon={LuMedal}
          value={total}
          suffix={`/ ${TOTAL_DAYS}`}
          label="Conquered"
          unit="Champion — fully forged"
          pct={100}
          accent={accent}
          d=".12s"
        />
      )}
      <StatCard
        icon={LuTrendingUp}
        value={phasePct}
        suffix="%"
        label="Phase Progress"
        pct={phasePct}
        accent={accent}
        d=".19s"
      />
    </Grid>
  );
}
