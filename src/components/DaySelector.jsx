import { useEffect, useState } from "react";
import styled from "styled-components";
import { LuChevronLeft, LuChevronRight, LuCheck, LuLock } from "react-icons/lu";

// A compact, self-contained day console: step the day, type a day to jump, or
// lock it in. The day number IS the jump field — no separate block. Stacks
// vertically so it sits in the hero's top-right on desktop and full-width on mobile.
const Console = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const StepRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const RoundBtn = styled.button`
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  font-size: 19px;
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

// The day pill is a tiny form — type in the number and press Enter to jump.
const DayPill = styled.form`
  flex: 1;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 5px;
  padding: 7px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  transition: border-color 0.15s ease;
  &:focus-within {
    border-color: ${({ theme }) => theme.color.gold};
  }
`;

const DayWord = styled.span`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: ${({ theme }) => theme.color.textMuted};
`;

// Styled to read as the big day number, but it's an input you can jump with.
const DayInput = styled.input`
  width: 2.2em;
  text-align: center;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 24px;
  font-weight: 900;
  line-height: 1;
  color: ${({ theme }) => theme.color.gold};
  background: none;
  border: none;
  padding: 0;
  cursor: text;
  appearance: textfield;
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &:focus {
    outline: none;
  }
`;

const DayTot = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.color.textDim};
`;

const CompleteWrap = styled.div`
  position: relative;
`;

const Complete = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: ${({ theme }) => theme.radius.pill};
  cursor: pointer;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.15s ease;
  border: 1px solid
    ${({ theme, $on }) => ($on ? "transparent" : theme.color.borderStrong)};
  background: ${({ theme, $on }) =>
    $on ? theme.color.green : "linear-gradient(100deg, rgba(225,29,42,0.18), rgba(225,29,42,0.07))"};
  color: ${({ theme, $on }) => ($on ? theme.color.greenInk : theme.color.text)};
  box-shadow: ${({ theme, $on }) => ($on ? "0 8px 24px -12px " + theme.color.green : "none")};

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ theme, $on }) => ($on ? "transparent" : theme.color.blood)};
    filter: ${({ $on }) => ($on ? "brightness(1.04)" : "none")};
  }
`;

const Box = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  border: 2px solid ${({ theme, $on }) => ($on ? theme.color.greenInk : theme.color.blood)};
  font-size: 12px;
`;

// "LOCKED IN" stamp that slams in when the day is locked.
const Stamp = styled.span`
  position: absolute;
  left: 50%;
  top: -13px;
  transform: translateX(-50%);
  font-family: ${({ theme }) => theme.font.brutal};
  font-size: 12px;
  letter-spacing: 0.18em;
  color: ${({ theme }) => theme.color.green};
  border: 2px solid ${({ theme }) => theme.color.green};
  border-radius: 6px;
  padding: 2px 9px;
  background: ${({ theme }) => theme.color.bg};
  pointer-events: none;
  white-space: nowrap;
  z-index: 1;
  animation: oathStamp 0.6s cubic-bezier(0.2, 0.85, 0.25, 1) both;
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

  // Keep the day field in sync when the day changes elsewhere (arrows, phase jump).
  useEffect(() => {
    setTempDay(currentDay);
  }, [currentDay]);

  const jump = () => {
    const n = parseInt(tempDay, 10);
    if (!isNaN(n) && n >= 1 && n <= totalDays && n !== currentDay) onJump(n);
    else setTempDay(currentDay); // snap back on invalid / unchanged
  };

  return (
    <Console>
      <StepRow>
        <RoundBtn onClick={onPrev} disabled={currentDay === 1} aria-label="Previous day">
          <LuChevronLeft />
        </RoundBtn>
        <DayPill
          onSubmit={(e) => {
            e.preventDefault();
            jump();
          }}
        >
          <DayWord>DAY</DayWord>
          <DayInput
            type="number"
            min="1"
            max={totalDays}
            value={tempDay}
            onChange={(e) => setTempDay(e.target.value)}
            onBlur={jump}
            onFocus={(e) => e.target.select()}
            aria-label="Current day — type a day and press Enter to jump"
            title="Type a day and press Enter to jump"
          />
          <DayTot>/ {totalDays}</DayTot>
        </DayPill>
        <RoundBtn onClick={onNext} disabled={currentDay === totalDays} aria-label="Next day">
          <LuChevronRight />
        </RoundBtn>
      </StepRow>

      <CompleteWrap>
        {completed && <Stamp aria-hidden="true">LOCKED IN</Stamp>}
        <Complete
          type="button"
          $on={!!completed}
          onClick={onToggleComplete}
          aria-pressed={!!completed}
        >
          <Box $on={!!completed}>{completed ? <LuCheck /> : <LuLock />}</Box>
          {completed ? "Locked in" : "Lock in the day"}
        </Complete>
      </CompleteWrap>
    </Console>
  );
}
