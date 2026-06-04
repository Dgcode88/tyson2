import { useEffect } from "react";
import styled from "styled-components";
import { phaseAccent } from "../theme.js";
import { phaseMeta } from "../data/program.js";

// ─────────────────────────────────────────────────────────────────────────────
// MILESTONES — the moments the program has been building toward. A phase falls
// when its last day is locked in (day 30 / 60); the whole forge finishes on
// day 90. Phase toasts auto-dismiss (parent timer); FORGED holds until dismissed.
// ─────────────────────────────────────────────────────────────────────────────

// Phase names come from phaseMeta (the canonical phase data — the toast's CSS
// uppercases them anyway); only the send-off lines live here.
const PHASE_LINES = {
  1: "The foundation held. Now build the weapons.",
  2: "The weapons are built. Now make them lethal.",
};

// ── Phase-conquered toast ────────────────────────────────────────────────────
// Sits BELOW the rank-up toast's slot — locking day 30 can legitimately fire
// both (30 conquered = KILLER), and they deserve to stack, not collide.
const Toast = styled.div`
  position: fixed;
  z-index: 119;
  top: clamp(150px, 26vh, 240px);
  left: 50%;
  transform: translateX(-50%);
  width: min(92vw, 440px);
  pointer-events: none;
  text-align: center;
  padding: 20px 24px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ $c }) => `${$c}80`};
  background: linear-gradient(180deg, rgba(13, 17, 26, 0.96), rgba(8, 10, 16, 0.96));
  box-shadow: 0 30px 80px -30px #000, 0 0 60px -20px ${({ $c }) => $c};
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  animation: phaseToastIn 0.5s cubic-bezier(0.2, 0.85, 0.25, 1) both;

  @keyframes phaseToastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-18px) scale(0.96); }
    to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ToastKicker = styled.p`
  margin: 0 0 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textDim};
`;

const ToastName = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.display};
  font-size: clamp(24px, 5vw, 34px);
  font-weight: 900;
  line-height: 0.95;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  color: ${({ $c }) => $c};
  text-shadow: 0 0 32px ${({ $c }) => `${$c}66`};
`;

const ToastLine = styled.p`
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.color.textMuted};
`;

export function PhaseConqueredToast({ phase }) {
  const line = PHASE_LINES[phase];
  if (!line) return null;
  const c = phaseAccent(phase).from;
  return (
    <Toast $c={c} role="status" aria-live="polite">
      <ToastKicker>Phase {phase} conquered</ToastKicker>
      <ToastName $c={c}>{phaseMeta[phase].name} complete</ToastName>
      <ToastLine>{line}</ToastLine>
    </Toast>
  );
}

// ── FORGED — the day-90 finish line ─────────────────────────────────────────
const Screen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: grid;
  place-items: center;
  padding: 24px;
  text-align: center;
  background: radial-gradient(120% 100% at 50% 40%, #171107 0%, #0a0805 55%, #050403 100%);
  animation: forgedIn 0.6s ease-out both;

  @keyframes forgedIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// The gold heart of the forge, breathing behind the words (heartbeat keyframe
// is defined globally in theme.js).
const Glow = styled.div`
  position: absolute;
  width: min(120vw, 1000px);
  height: min(120vw, 1000px);
  border-radius: 50%;
  background: radial-gradient(circle, ${({ theme }) => theme.color.gold} 0%, transparent 60%);
  filter: blur(50px);
  opacity: 0.22;
  animation: heartbeat 2.8s ease-in-out infinite;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 720px;
  display: grid;
  justify-items: center;
`;

const Kicker = styled.p`
  margin: 0 0 16px;
  font-size: clamp(10px, 1.4vw, 13px);
  font-weight: 800;
  letter-spacing: 0.42em;
  text-indent: 0.42em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
`;

const Word = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.font.brutal};
  font-size: clamp(64px, 17vw, 170px);
  line-height: 0.85;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.bone};
  text-shadow: 0 0 70px ${({ theme }) => theme.color.goldSoft},
    0 0 28px rgba(245, 182, 67, 0.45);
`;

const Line = styled.p`
  margin: 22px 0 0;
  max-width: 34ch;
  font-size: clamp(15px, 2vw, 19px);
  line-height: 1.5;
  font-weight: 500;
  color: ${({ theme }) => theme.color.textMuted};
`;

const Tally = styled.p`
  margin: 18px 0 0;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gold};
`;

const Stand = styled.button`
  margin-top: 36px;
  padding: 15px 34px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1.5px solid ${({ theme }) => theme.color.gold};
  background: ${({ theme }) => theme.color.goldSoft};
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.font.display};
  font-size: clamp(14px, 1.7vw, 16px);
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.16s ease, background 0.2s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    background: rgba(245, 182, 67, 0.24);
    box-shadow: 0 18px 50px -16px rgba(245, 182, 67, 0.5);
  }
`;

export function ForgedOverlay({ conquered, onClose }) {
  // Escape stands you down too.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <Screen role="dialog" aria-modal="true" aria-label="Day 90 complete">
      <Glow aria-hidden="true" />
      <Inner>
        <Kicker>90-Day Tyson Transformation · Complete</Kicker>
        <Word>Forged</Word>
        <Line>You walked in soft. You walked out a weapon.</Line>
        <Tally>{conquered} of 90 days conquered</Tally>
        <Stand type="button" onClick={onClose} autoFocus>
          Stand tall
        </Stand>
      </Inner>
    </Screen>
  );
}
