import { useEffect, useState } from "react";
import styled from "styled-components";
import { LuChevronLeft, LuChevronRight, LuCheck } from "react-icons/lu";

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 18px;
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RoundBtn = styled.button`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.color.surfaceHover};
    border-color: ${({ theme }) => theme.color.borderStrong};
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const DayPill = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  min-width: 96px;
  justify-content: center;
`;

const DayWord = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: ${({ theme }) => theme.color.textMuted};
`;

const DayNum = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 28px;
  font-weight: 900;
  color: ${({ theme }) => theme.color.text};
`;

const DayTot = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.color.textDim};
`;

const Complete = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 16px;
  border-radius: ${({ theme }) => theme.radius.pill};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s ease;
  border: 1px solid
    ${({ theme, $on }) => ($on ? "transparent" : theme.color.border)};
  background: ${({ theme, $on }) => ($on ? theme.color.green : theme.color.surface)};
  color: ${({ theme, $on }) => ($on ? theme.color.greenInk : theme.color.textMuted)};

  &:hover {
    border-color: ${({ theme }) => theme.color.borderStrong};
  }
`;

const Box = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 5px;
  display: grid;
  place-items: center;
  border: 2px solid ${({ theme, $on }) => ($on ? theme.color.greenInk : theme.color.textDim)};
  font-size: 12px;
`;

const Jump = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const JumpLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.color.textMuted};
`;

const NumInput = styled.input`
  width: 64px;
  padding: 9px 8px;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
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
`;

const GoBtn = styled.button`
  padding: 9px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.color.teal};
  color: ${({ theme }) => theme.color.tealInk};
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: filter 0.15s ease;
  &:hover {
    filter: brightness(1.08);
  }
`;

export default function DaySelector({
  currentDay,
  totalDays,
  completed,
  onPrev,
  onNext,
  onJump,
  onToggleComplete,
}) {
  const [tempDay, setTempDay] = useState(currentDay);

  // Keep the jump input in sync when the day changes elsewhere (arrows, phase jump).
  useEffect(() => {
    setTempDay(currentDay);
  }, [currentDay]);

  const submit = (e) => {
    e.preventDefault();
    const n = parseInt(tempDay, 10);
    if (!isNaN(n) && n >= 1 && n <= totalDays) onJump(n);
  };

  return (
    <Row>
      <Stepper>
        <RoundBtn onClick={onPrev} disabled={currentDay === 1} aria-label="Previous day">
          <LuChevronLeft />
        </RoundBtn>
        <DayPill>
          <DayWord>DAY</DayWord>
          <DayNum>{currentDay}</DayNum>
          <DayTot>/ {totalDays}</DayTot>
        </DayPill>
        <RoundBtn onClick={onNext} disabled={currentDay === totalDays} aria-label="Next day">
          <LuChevronRight />
        </RoundBtn>
      </Stepper>

      <Complete
        type="button"
        $on={!!completed}
        onClick={onToggleComplete}
        aria-pressed={!!completed}
      >
        <Box $on={!!completed}>{completed && <LuCheck />}</Box>
        {completed ? "Day complete" : "Mark day complete"}
      </Complete>

      <Jump onSubmit={submit}>
        <JumpLabel>JUMP TO</JumpLabel>
        <NumInput
          type="number"
          min="1"
          max={totalDays}
          value={tempDay}
          onChange={(e) => setTempDay(e.target.value)}
          aria-label="Jump to day"
        />
        <GoBtn type="submit" aria-label="Go to day">GO</GoBtn>
      </Jump>
    </Row>
  );
}
