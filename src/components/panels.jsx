import styled from "styled-components";
import { LuCircle, LuCheckCircle2, LuRotateCcw, LuSunrise, LuSun, LuMoon } from "react-icons/lu";
import {
  Panel,
  PanelHead,
  PanelTitle,
  PanelSub,
  SectionTitle,
  CategoryTitle,
  DetailSection,
  List,
  ListItem,
  Pill,
  Quote,
  Highlight,
} from "./ui.jsx";
import QuoteBlock from "./QuoteBlock.jsx";
import {
  getDailySchedule,
  getDailyTrainingPlan,
  getDailyNutritionPlan,
  getDailyMindsetPlan,
  getDailySupplements,
  getRecoveryProtocols,
  getWeeklyShoppingList,
  getDailyChecklist,
  checklistKey,
} from "../data/program.js";

// ── shared layout helpers ─────────────────────────────────────────────────────
function Head({ title, sub, badge }) {
  return (
    <PanelHead>
      <div>
        <PanelTitle>{title}</PanelTitle>
        {sub && <PanelSub>{sub}</PanelSub>}
      </div>
      {badge && <Pill>{badge}</Pill>}
    </PanelHead>
  );
}

// Responsive multi-column grid so wide screens are actually used.
const Cols = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: clamp(20px, 2.6vw, 36px);
  align-items: start;
`;

const Group = styled.div`
  min-width: 0;
  & > h4:first-child {
    margin-top: 0;
  }
`;

// Bulleted list with a boot-window stagger.
const Bullets = ({ items }) => (
  <List>
    {items.map((item, i) => (
      <ListItem key={i} className="reveal-i" style={{ "--i": i }}>
        {item}
      </ListItem>
    ))}
  </List>
);

// ── Schedule ──────────────────────────────────────────────────────────────────
const SUPP_RE = /supplement|vitamin|protein|creatine/i;

// Day-part shading: each block of the day gets its own tint, accent edge and
// icon so morning / afternoon / evening read at a glance. Gold dawn → teal
// daylight → indigo dusk mirrors the natural arc of the day.
const DAYPARTS = [
  { key: "morning", label: "Morning", Icon: LuSunrise, edge: "#F5B643", tint: "rgba(245, 182, 67, 0.07)", chip: "rgba(245, 182, 67, 0.14)" },
  { key: "afternoon", label: "Afternoon", Icon: LuSun, edge: "#2DD4BF", tint: "rgba(45, 212, 191, 0.06)", chip: "rgba(45, 212, 191, 0.14)" },
  { key: "evening", label: "Evening", Icon: LuMoon, edge: "#A78BFA", tint: "rgba(124, 58, 237, 0.09)", chip: "rgba(124, 58, 237, 0.16)" },
];

// "4:30 AM" / "12:30 PM" → minutes since midnight (robust to spacing/case).
const toMinutes = (t) => {
  const m = String(t).match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + parseInt(m[2], 10);
};
// Morning < 12pm · Afternoon 12–5pm · Evening 5pm+
const partKey = (t) => {
  const mins = toMinutes(t);
  if (mins < 12 * 60) return "morning";
  if (mins < 17 * 60) return "afternoon";
  return "evening";
};

const DayPart = styled.section`
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $tint }) => $tint};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-left: 3px solid ${({ $edge }) => $edge};
  padding: clamp(12px, 1.5vw, 18px) clamp(14px, 1.6vw, 20px);
  & + & {
    margin-top: clamp(10px, 1.2vw, 16px);
  }
`;

const DayPartHead = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  svg {
    color: ${({ $edge }) => $edge};
    font-size: 18px;
    flex: 0 0 auto;
  }
`;

const DayPartName = styled.h4`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.text};
`;

const DayPartRange = styled.span`
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.color.textDim};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const PartGrid = styled.div`
  display: grid;
  /* min(360px, 100%) so a narrow phone collapses to one full-width column
     instead of forcing the whole page wider than the viewport. */
  grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 1fr));
  gap: clamp(6px, 0.8vw, 10px) clamp(16px, 2.5vw, 40px);
`;

const ScheduleRow = styled.div`
  display: flex;
  gap: 14px;
  padding: 9px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $supp }) => ($supp ? theme.color.tealSoft : "transparent")};
  transition: background 0.15s ease, transform 0.15s ease;
  &:hover {
    background: ${({ theme, $supp }) => ($supp ? theme.color.tealSoft : theme.color.surfaceHover)};
    transform: translateX(4px);
  }
`;

const Time = styled.div`
  flex: 0 0 86px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.color.gold};
  @media (max-width: 480px) {
    flex-basis: 70px;
    font-size: 14px;
  }
`;

const Activity = styled.div`
  flex: 1;
  line-height: 1.5;
  color: ${({ theme }) => theme.color.textMuted};
  strong {
    color: ${({ theme }) => theme.color.teal};
    font-weight: 700;
  }
`;

export function SchedulePanel({ currentDay, currentPhase, accent }) {
  const isRest = currentDay % 7 === 0;
  const items = getDailySchedule(currentDay);
  const groups = DAYPARTS.map((dp) => ({
    ...dp,
    rows: items.filter((it) => partKey(it.time) === dp.key),
  })).filter((g) => g.rows.length);

  let idx = 0; // continuous stagger index across all bands
  return (
    <Panel>
      <Head
        title={`Day ${currentDay} Schedule`}
        sub={`${isRest ? "Rest day" : "Training day"} schedule for Phase ${currentPhase}`}
        badge={isRest ? "Rest day" : "Training day"}
      />
      <QuoteBlock moduleId="schedule" day={currentDay} accent={accent} />
      {groups.map((g) => (
        <DayPart key={g.key} $tint={g.tint} $edge={g.edge}>
          <DayPartHead $edge={g.edge}>
            <g.Icon aria-hidden="true" />
            <DayPartName>{g.label}</DayPartName>
            <DayPartRange>
              {g.rows[0].time} – {g.rows[g.rows.length - 1].time}
            </DayPartRange>
          </DayPartHead>
          <PartGrid>
            {g.rows.map((item) => {
              const i = idx++;
              return (
                <ScheduleRow key={i} className="reveal-i" style={{ "--i": i }} $supp={SUPP_RE.test(item.activity)}>
                  <Time>{item.time}</Time>
                  <Activity>
                    <Highlight text={item.activity} />
                  </Activity>
                </ScheduleRow>
              );
            })}
          </PartGrid>
        </DayPart>
      ))}
    </Panel>
  );
}

// ── Training ────────────────────────────────────────────────────────────────
export function TrainingPanel({ currentPhase, currentDay, accent }) {
  const p = getDailyTrainingPlan(currentPhase);
  return (
    <Panel>
      <Head title="Training Plan" sub={p.description} badge={`Phase ${currentPhase}`} />
      <QuoteBlock moduleId="training" day={currentDay} accent={accent} />
      <SectionTitle>{p.title}</SectionTitle>
      <Bullets items={p.items} />

      <DetailSection>
        <Cols>
          <Group>
            <CategoryTitle>Knee Rehabilitation</CategoryTitle>
            <Bullets items={p.details.kneeRehab} />
          </Group>
          <Group>
            <CategoryTitle>Boxing Technique</CategoryTitle>
            <Bullets items={p.details.boxingTechnique} />
          </Group>
          <Group>
            <CategoryTitle>Conditioning Protocol</CategoryTitle>
            <Bullets items={p.details.conditioning} />
          </Group>
          <Group>
            <CategoryTitle>Strength Development</CategoryTitle>
            <Bullets items={p.details.strength} />
          </Group>
        </Cols>

        <CategoryTitle>Weekly Workout Schedule</CategoryTitle>
        <List>
          {p.workoutSchedule.map((w, i) => (
            <ListItem key={i} className="reveal-i" style={{ "--i": i }}>
              <span>
                <strong>{w.day}:</strong> {w.focus}
              </span>
            </ListItem>
          ))}
        </List>
      </DetailSection>
    </Panel>
  );
}

// ── Nutrition ─────────────────────────────────────────────────────────────────
const MealFlag = styled.p`
  margin: 4px 0 14px;
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 800;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.color.gold};
`;

// Resolve the banner label for a structured meal plan. Order matters: a phase-3
// carb-load day ALSO carries `trainingDay`, so it has to be checked first or it
// would mislabel as "TRAINING DAY NUTRITION".
function mealFlag(mp) {
  if (typeof mp !== "object" || mp === null) return null;
  if (mp.carb_loadDay) return "CARB-LOAD DAY";
  if (mp.refeedDay !== undefined) return mp.refeedDay ? "REFEED DAY" : "REGULAR DAY";
  if (mp.feedingDay !== undefined) return mp.feedingDay ? "FEEDING DAY" : "FASTING DAY";
  if (mp.refeeding !== undefined) return `${mp.refeeding} — ${mp.feedingWindow}`;
  if (mp.trainingDay !== undefined)
    return mp.trainingDay ? "TRAINING DAY NUTRITION" : "REST DAY NUTRITION";
  return null;
}

export function NutritionPanel({ currentDay, currentPhase, accent }) {
  const p = getDailyNutritionPlan(currentDay, currentPhase);
  const mp = p.mealPlan;
  const flag = mealFlag(mp);

  return (
    <Panel>
      <Head title="Nutrition Protocol" sub={p.description} badge={`Phase ${currentPhase}`} />
      <QuoteBlock moduleId="nutrition" day={currentDay} accent={accent} />
      <SectionTitle>{p.title}</SectionTitle>
      <Bullets items={p.items} />

      <DetailSection>
        <Cols>
          <Group>
            <CategoryTitle>Implementation Details</CategoryTitle>
            <Bullets items={p.details} />
          </Group>
          <Group>
            <CategoryTitle>Daily Meal Plan</CategoryTitle>
            {typeof mp === "string" ? (
              <PanelSub>{mp}</PanelSub>
            ) : (
              <>
                {flag && <MealFlag>{flag}</MealFlag>}
                {mp.meals && (
                  <List>
                    {mp.meals.map((m, i) => (
                      <ListItem key={i} className="reveal-i" style={{ "--i": i }}>
                        <span>
                          <strong>{m.time}:</strong> {m.food}
                        </span>
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            )}
          </Group>
        </Cols>
      </DetailSection>
    </Panel>
  );
}

// ── Mindset ───────────────────────────────────────────────────────────────────
export function MindsetPanel({ currentPhase, currentDay, accent }) {
  const p = getDailyMindsetPlan(currentPhase);
  return (
    <Panel>
      <Head title="Mindset Programming" sub={p.description} badge={`Phase ${currentPhase}`} />
      <QuoteBlock moduleId="mindset" day={currentDay} accent={accent} />
      <SectionTitle>{p.title}</SectionTitle>
      <Bullets items={p.items} />

      <DetailSection>
        <Cols>
          <Group>
            <CategoryTitle>Implementation Steps</CategoryTitle>
            <Bullets items={p.details} />
          </Group>
          <Group>
            <CategoryTitle>Daily Affirmations</CategoryTitle>
            <List>
              {p.affirmations.map((a, i) => (
                <ListItem key={i} className="reveal-i" style={{ "--i": i }}>
                  “{a}”
                </ListItem>
              ))}
            </List>
          </Group>
        </Cols>

        <CategoryTitle>Daily Visualization Script</CategoryTitle>
        <Quote>{p.visualizationScript}</Quote>
      </DetailSection>
    </Panel>
  );
}

// ── Supplements ───────────────────────────────────────────────────────────────
export function SupplementsPanel({ currentPhase, currentDay, accent }) {
  const p = getDailySupplements(currentPhase);
  return (
    <Panel>
      <Head
        title="Supplement Protocol"
        sub={`Phase ${currentPhase} optimized supplementation`}
        badge={`Phase ${currentPhase}`}
      />
      <QuoteBlock moduleId="supplements" day={currentDay} accent={accent} />
      <SectionTitle>{p.title}</SectionTitle>
      <Bullets items={p.items} />

      <DetailSection>
        <Cols>
          <Group>
            <CategoryTitle>Exact Dosages</CategoryTitle>
            <Bullets items={p.details.dosage} />
          </Group>
          <Group>
            <CategoryTitle>Timing Strategy</CategoryTitle>
            <Bullets items={p.details.timing} />
          </Group>
          <Group>
            <CategoryTitle>Recommended Brands</CategoryTitle>
            <Bullets items={p.details.brandRecommendations} />
          </Group>
        </Cols>
      </DetailSection>
    </Panel>
  );
}

// ── Recovery ──────────────────────────────────────────────────────────────────
export function RecoveryPanel({ currentPhase, currentDay, accent }) {
  const p = getRecoveryProtocols(currentPhase);
  return (
    <Panel>
      <Head title="Recovery Protocols" sub={p.description} badge={`Phase ${currentPhase}`} />
      <QuoteBlock moduleId="recovery" day={currentDay} accent={accent} />
      <SectionTitle>{p.title}</SectionTitle>
      <Bullets items={p.items} />

      <DetailSection>
        <Cols>
          <Group>
            <CategoryTitle>Detailed Protocol</CategoryTitle>
            <Bullets items={p.details} />
          </Group>
          <Group>
            <CategoryTitle>Implementation Steps</CategoryTitle>
            <Bullets items={p.implementation} />
          </Group>
        </Cols>
      </DetailSection>
    </Panel>
  );
}

// ── Shopping ──────────────────────────────────────────────────────────────────
const ShopGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: clamp(16px, 2vw, 22px);
`;

const ShopGroup = styled.div`
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};

  & > h4:first-child {
    margin-top: 0;
  }
`;

export function ShoppingPanel({ currentDay, currentPhase, accent }) {
  const list = getWeeklyShoppingList(currentDay, currentPhase);
  const week = Math.ceil(currentDay / 7);
  return (
    <Panel>
      <Head
        title="Shopping List"
        sub={`Week ${week} essentials for Phase ${currentPhase}`}
        badge={`Week ${week}`}
      />
      <QuoteBlock moduleId="shopping" day={currentDay} accent={accent} />
      <ShopGrid>
        <ShopGroup>
          <CategoryTitle>Supplements</CategoryTitle>
          <Bullets items={list.supplements} />
        </ShopGroup>
        <ShopGroup>
          <CategoryTitle>Groceries</CategoryTitle>
          <Bullets items={list.groceries} />
        </ShopGroup>
        {list.equipment && (
          <ShopGroup>
            <CategoryTitle>Equipment</CategoryTitle>
            <Bullets items={list.equipment} />
          </ShopGroup>
        )}
      </ShopGrid>
    </Panel>
  );
}

// ── Checklist ─────────────────────────────────────────────────────────────────
const CheckGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(380px, 100%), 1fr));
  gap: 0 clamp(20px, 3vw, 48px);
`;

const Item = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  text-align: left;
  padding: 14px 4px;
  background: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  cursor: pointer;
  transition: padding-left 0.15s ease;
  &:hover {
    padding-left: 8px;
  }
`;

const Mark = styled.span`
  flex: 0 0 auto;
  font-size: 22px;
  display: grid;
  place-items: center;
  color: ${({ theme, $on }) => ($on ? theme.color.green : theme.color.textDim)};
  transition: color 0.15s ease;
`;

const Text = styled.span`
  flex: 1;
  font-size: 15px;
  color: ${({ theme, $on }) => ($on ? theme.color.textDim : theme.color.text)};
  text-decoration: ${({ $on }) => ($on ? "line-through" : "none")};
`;

const When = styled.span`
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.gold};
`;

const Progress = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.color.track};
  overflow: hidden;
`;

const ProgressFill = styled.i`
  display: block;
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  border-radius: inherit;
  background: ${({ $accent }) => `linear-gradient(90deg, ${$accent.from}, ${$accent.to})`};
  box-shadow: 0 0 14px ${({ $accent }) => $accent.glow};
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
`;

const Done = styled.div`
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.textMuted};
  font-variant-numeric: tabular-nums;
`;

const ResetBtn = styled.button`
  margin-top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.danger};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    border-color: ${({ theme }) => theme.color.danger};
    background: rgba(240, 80, 106, 0.1);
  }
`;

export function ChecklistPanel({ currentDay, currentPhase, accent, checklist, onToggle, onReset }) {
  const items = getDailyChecklist(currentDay, currentPhase);
  // Checks are namespaced by day in App state, so read with the same key.
  const done = items.filter((it) => checklist[checklistKey(currentDay, it.id)]).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  return (
    <Panel>
      <Head title={`Day ${currentDay} Checklist`} sub="Close every box. Leave nothing for tomorrow." />
      <QuoteBlock moduleId="checklist" day={currentDay} accent={accent} />
      <Progress>
        <ProgressBar>
          <ProgressFill $pct={pct} $accent={accent} />
        </ProgressBar>
        <Done aria-live="polite">
          {done} / {items.length} complete
        </Done>
      </Progress>
      <CheckGrid>
        {items.map((it, i) => {
          const on = !!checklist[checklistKey(currentDay, it.id)];
          return (
            <Item key={`${it.id}-${i}`} onClick={() => onToggle(it.id)} aria-pressed={on}>
              <Mark $on={on}>{on ? <LuCheckCircle2 /> : <LuCircle />}</Mark>
              <Text $on={on}>{it.text}</Text>
              <When>{it.time}</When>
            </Item>
          );
        })}
      </CheckGrid>
      <ResetBtn type="button" onClick={() => onReset(items)}>
        <LuRotateCcw /> Reset checklist
      </ResetBtn>
    </Panel>
  );
}
