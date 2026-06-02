import styled from "styled-components";
import { LuFlame, LuCheckCircle2, LuTrendingUp } from "react-icons/lu";
import { GlassCard } from "./ui.jsx";
import { useCountUp } from "./cinematic/index.jsx";
import { TOTAL_DAYS, getCurrentPhaseProgress, phaseMeta } from "../data/program.js";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(12px, 1.6vw, 20px);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled(GlassCard)`
  padding: clamp(18px, 2.2vw, 26px);
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
`;

const Num = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 900;
  font-size: clamp(38px, 4.4vw, 56px);
  line-height: 0.86;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.color.text};
`;

const Suffix = styled.span`
  font-size: 0.5em;
  color: ${({ theme }) => theme.color.textDim};
  margin-left: 2px;
`;

const Bar = styled.div`
  height: 6px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.track};
  overflow: hidden;
`;

const BarFill = styled.i`
  display: block;
  height: 100%;
  border-radius: inherit;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $accent }) => `linear-gradient(90deg, ${$accent.from}, ${$accent.to})`};
  box-shadow: 0 0 12px ${({ $accent }) => $accent.glow};
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
`;

const Foot = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.color.textDim};
`;

function StatCard({ icon: Icon, value, suffix, label, foot, pct, accent, d }) {
  const n = useCountUp(value, 1000);
  return (
    <Stat className="reveal" style={{ "--d": d }}>
      <Topline>
        <Label>{label}</Label>
        <Icon size={18} style={{ color: accent.from }} aria-hidden="true" />
      </Topline>
      <Num>
        {n}
        {suffix && <Suffix>{suffix}</Suffix>}
      </Num>
      {pct != null && (
        <Bar>
          <BarFill $pct={pct} $accent={accent} />
        </Bar>
      )}
      {foot && <Foot>{foot}</Foot>}
    </Stat>
  );
}

export default function StatsStrip({ completedDays, currentDay, currentPhase, accent }) {
  const total = Object.values(completedDays).filter(Boolean).length;
  let streak = 0;
  for (let d = currentDay; d >= 1; d--) {
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
      <StatCard
        icon={LuCheckCircle2}
        value={total}
        suffix={`/ ${TOTAL_DAYS}`}
        label="Days Conquered"
        pct={overallPct}
        accent={accent}
        d=".12s"
      />
      <StatCard
        icon={LuTrendingUp}
        value={phasePct}
        suffix="%"
        label="Phase Progress"
        pct={phasePct}
        foot={phaseMeta[currentPhase].name}
        accent={accent}
        d=".19s"
      />
    </Grid>
  );
}
