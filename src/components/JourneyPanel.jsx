import { useEffect, useState } from "react";
import styled from "styled-components";
import { LuCheck, LuScale } from "react-icons/lu";
import { Panel, PanelHead, PanelTitle, PanelSub, Pill } from "./ui.jsx";
import QuoteBlock from "./QuoteBlock.jsx";
import { playSound } from "../hooks/useSound.js";
import { TOTAL_DAYS } from "../data/program.js";

// ─────────────────────────────────────────────────────────────────────────────
// THE JOURNEY — the long arc of the transformation. The mirror lies day to day;
// the line doesn't. Weight drives the chart; tape numbers ride along as deltas.
// All of it lives in localStorage keyed by program day — no backend, no account.
// ─────────────────────────────────────────────────────────────────────────────

const METRICS = [
  { key: "w", label: "Weight", required: true },
  { key: "waist", label: "Waist" },
  { key: "chest", label: "Chest" },
  { key: "arm", label: "Arm" },
];

// ── entry form ───────────────────────────────────────────────────────────────
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 14px 18px;
  padding: 18px 20px;
  margin-bottom: 22px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const FieldName = styled.span`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
`;

const Num = styled.input`
  width: 86px;
  padding: 9px 10px;
  text-align: center;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.color.gold};
  background: ${({ theme }) => theme.color.bg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  appearance: textfield;
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.gold};
  }
`;

const Save = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 20px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid transparent;
  background: ${({ theme }) => theme.color.teal};
  color: ${({ theme }) => theme.color.tealInk};
  font-family: ${({ theme }) => theme.font.display};
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease;
  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.08);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }
`;

const UnitBtn = styled.button`
  align-self: flex-end;
  padding: 9px 13px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: none;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
  &:hover {
    color: ${({ theme }) => theme.color.text};
    border-color: ${({ theme }) => theme.color.borderStrong};
  }
`;

const FormNote = styled.p`
  flex-basis: 100%;
  margin: 0;
  font-size: 12px;
  color: ${({ theme }) => theme.color.textDim};
`;

// ── delta strip ──────────────────────────────────────────────────────────────
const Deltas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
  gap: 12px;
  margin-bottom: 22px;
`;

const Cell = styled.div`
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
`;

const CellLabel = styled.div`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
  margin-bottom: 4px;
`;

const CellNum = styled.div`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $gold }) => ($gold ? theme.color.gold : theme.color.text)};

  small {
    font-size: 12px;
    font-weight: 700;
    color: ${({ theme }) => theme.color.textDim};
    margin-left: 4px;
  }
`;

const TapeLine = styled.p`
  margin: -10px 0 22px;
  font-size: 12px;
  color: ${({ theme }) => theme.color.textDim};

  b {
    color: ${({ theme }) => theme.color.textMuted};
    font-weight: 700;
  }
`;

// ── chart ────────────────────────────────────────────────────────────────────
const ChartWrap = styled.div`
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  padding: clamp(12px, 1.6vw, 20px);

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const Empty = styled.div`
  padding: 44px 20px;
  text-align: center;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 15px;
  line-height: 1.6;

  svg {
    display: block;
    margin: 0 auto 10px;
    width: 28px;
    height: 28px;
    color: ${({ theme }) => theme.color.textDim};
  }
`;

const fmt = (n) => (Math.round(n * 10) / 10).toString();
const signed = (n) => `${n > 0 ? "+" : n < 0 ? "−" : "±"}${fmt(Math.abs(n))}`;

// All entries that carry a usable value for `key`, in day order.
const series = (journey, key) =>
  Object.entries(journey)
    .map(([d, e]) => ({ day: Number(d), v: Number(e?.[key]) }))
    .filter((p) => p.day >= 1 && p.day <= TOTAL_DAYS && Number.isFinite(p.v))
    .sort((a, b) => a.day - b.day);

function Chart({ points, currentDay, accent, unit }) {
  const W = 600;
  const H = 230;
  const PX = 36;
  const PT = 14;
  const PB = 28;

  const ws = points.map((p) => p.v);
  const rawLo = Math.min(...ws);
  const rawHi = Math.max(...ws);
  const span = Math.max(rawHi - rawLo, 2); // never a zero-height range
  const lo = rawLo - span * 0.2;
  const hi = rawHi + span * 0.2;

  const x = (day) => PX + ((day - 1) / (TOTAL_DAYS - 1)) * (W - PX * 2);
  const y = (v) => PT + (1 - (v - lo) / (hi - lo)) * (H - PT - PB);

  const line = points
    .map((p, i) => `${i ? "L" : "M"}${x(p.day).toFixed(1)} ${y(p.v).toFixed(1)}`)
    .join(" ");
  const area =
    points.length > 1
      ? `${line} L${x(points[points.length - 1].day).toFixed(1)} ${H - PB} L${x(points[0].day).toFixed(1)} ${H - PB} Z`
      : null;

  const label = `Weight trend: ${points.length} ${points.length === 1 ? "entry" : "entries"}, from ${fmt(points[0].v)} to ${fmt(points[points.length - 1].v)} ${unit}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <defs>
        <linearGradient id="jLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent.from} />
          <stop offset="100%" stopColor={accent.to} />
        </linearGradient>
        <linearGradient id="jArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent.from} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent.to} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* phase boundaries */}
      {[30.5, 60.5].map((d) => (
        <line
          key={d}
          x1={x(d)}
          x2={x(d)}
          y1={PT}
          y2={H - PB}
          stroke="rgba(255,255,255,0.09)"
          strokeDasharray="3 5"
        />
      ))}

      {/* y range labels */}
      <text x={PX - 8} y={y(rawHi) + 4} textAnchor="end" fontSize="10" fill="#828B99">
        {fmt(rawHi)}
      </text>
      <text x={PX - 8} y={y(rawLo) + 4} textAnchor="end" fontSize="10" fill="#828B99">
        {fmt(rawLo)}
      </text>

      {/* x labels */}
      {[1, 30, 60, 90].map((d) => (
        <text key={d} x={x(d)} y={H - 8} textAnchor="middle" fontSize="10" fill="#828B99">
          {d === 1 ? "Day 1" : d}
        </text>
      ))}

      {area && <path d={area} fill="url(#jArea)" />}
      {points.length > 1 && (
        <path
          d={line}
          fill="none"
          stroke="url(#jLine)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {points.map((p) => {
        const isCurrent = p.day === currentDay;
        return (
          <circle
            key={p.day}
            cx={x(p.day)}
            cy={y(p.v)}
            r={isCurrent ? 5.5 : 3.5}
            fill={isCurrent ? accent.from : "#0B0E14"}
            stroke={accent.from}
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}

// ── panel ────────────────────────────────────────────────────────────────────
export default function JourneyPanel({ journey, onLog, currentDay, accent, unit, onToggleUnit }) {
  const entry = journey[currentDay] || {};
  const [draft, setDraft] = useState({});
  const [saved, setSaved] = useState(false);

  // Re-seed the form whenever the viewed day (or its stored entry) changes.
  useEffect(() => {
    const seeded = {};
    METRICS.forEach(({ key }) => {
      seeded[key] = entry[key] != null ? String(entry[key]) : "";
    });
    setDraft(seeded);
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDay, journey]);

  const weightValid = Number.isFinite(parseFloat(draft.w));

  const save = (e) => {
    e.preventDefault();
    if (!weightValid) return;
    const next = {};
    METRICS.forEach(({ key }) => {
      const n = parseFloat(draft[key]);
      if (Number.isFinite(n) && n > 0) next[key] = n;
    });
    onLog(currentDay, next);
    playSound("tick");
    setSaved(true);
  };

  const weights = series(journey, "w");
  const start = weights[0];
  const latest = weights[weights.length - 1];

  const tapeDeltas = METRICS.slice(1)
    .map(({ key, label }) => {
      const s = series(journey, key);
      return s.length >= 2 ? `${label} ${signed(s[s.length - 1].v - s[0].v)}` : null;
    })
    .filter(Boolean);

  return (
    <Panel>
      <PanelHead>
        <div>
          <PanelTitle>The Journey</PanelTitle>
          <PanelSub>The mirror lies day to day. The line doesn't.</PanelSub>
        </div>
        <Pill>
          {weights.length} {weights.length === 1 ? "entry" : "entries"}
        </Pill>
      </PanelHead>

      <QuoteBlock moduleId="journey" day={currentDay} accent={accent} />

      <Form onSubmit={save}>
        {METRICS.map(({ key, label, required }) => (
          <Field key={key}>
            <FieldName>
              {label}
              {required ? "" : " · optional"}
            </FieldName>
            <Num
              type="number"
              step="0.1"
              min="0"
              inputMode="decimal"
              placeholder="—"
              value={draft[key] ?? ""}
              onChange={(e) => {
                setDraft((d) => ({ ...d, [key]: e.target.value }));
                setSaved(false);
              }}
            />
          </Field>
        ))}
        <UnitBtn
          type="button"
          onClick={onToggleUnit}
          title={unit === "lbs" ? "Switch to kg — entries convert too" : "Switch to lbs — entries convert too"}
        >
          {unit}
        </UnitBtn>
        <Save type="submit" disabled={!weightValid || saved}>
          {saved ? (
            <>
              <LuCheck aria-hidden="true" /> Logged
            </>
          ) : (
            `Log day ${currentDay}`
          )}
        </Save>
        <FormNote>
          Weight drives the chart. Tape numbers are optional — once a week is plenty.
        </FormNote>
      </Form>

      {start && latest && (
        <Deltas>
          <Cell>
            <CellLabel>Start · Day {start.day}</CellLabel>
            <CellNum>
              {fmt(start.v)}
              <small>{unit}</small>
            </CellNum>
          </Cell>
          <Cell>
            <CellLabel>Latest · Day {latest.day}</CellLabel>
            <CellNum>
              {fmt(latest.v)}
              <small>{unit}</small>
            </CellNum>
          </Cell>
          <Cell>
            <CellLabel>Change</CellLabel>
            <CellNum $gold>
              {signed(latest.v - start.v)}
              <small>{unit}</small>
            </CellNum>
          </Cell>
        </Deltas>
      )}

      {tapeDeltas.length > 0 && (
        <TapeLine>
          <b>Tape since Day {start.day}:</b> {tapeDeltas.join(" · ")}
        </TapeLine>
      )}

      <ChartWrap>
        {weights.length === 0 ? (
          <Empty>
            <LuScale aria-hidden="true" />
            No entries yet. Log today's weight and give the line its first point.
          </Empty>
        ) : (
          <Chart points={weights} currentDay={currentDay} accent={accent} unit={unit} />
        )}
      </ChartWrap>
    </Panel>
  );
}
