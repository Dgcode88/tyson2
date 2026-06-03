import { motion } from "framer-motion";
import styled, { keyframes, css } from "styled-components";

const Wrap = styled.div`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex: 0 0 auto;
`;

// Soft halo behind the ring that slowly breathes, tinted to the phase accent.
const Halo = styled.div`
  position: absolute;
  inset: 14px;
  border-radius: 50%;
  z-index: 0;
  background: ${({ $glow }) => `radial-gradient(circle, ${$glow}, transparent 70%)`};
  animation: ringPulse 3.4s ease-in-out infinite;
`;

const ringFlash = keyframes`
  0%   { filter: drop-shadow(0 0 0 transparent); }
  30%  { filter: drop-shadow(0 0 22px #34D399); }
  100% { filter: drop-shadow(0 0 0 transparent); }
`;

const Svg = styled.svg`
  position: relative;
  z-index: 1;
`;

const Center = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Big = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 900;
  font-size: ${({ $size }) => Math.round($size * 0.34)}px;
  line-height: 1;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.color.text};
  font-variant-numeric: tabular-nums;
`;

const Small = styled.span`
  margin-top: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textMuted};
`;

const FlashCircle = styled(motion.circle)`
  ${({ $flash }) =>
    $flash &&
    css`
      animation: ${ringFlash} 0.7s ease-out;
    `}
`;

// A circular progress arc tinted with the current phase gradient. The arc value
// animates whenever it changes; a breathing halo sits behind it, and a green
// flash fires when `flashKey` ticks (day marked complete).
export default function ProgressRing({
  value,
  accent,
  size = 208,
  stroke = 15,
  big,
  small,
  glow,
  flashKey = 0,
  gradientId = "ringGrad",
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <Wrap $size={size}>
      <Halo $glow={glow || `${accent.from}66`} />
      <Svg width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accent.from} />
            <stop offset="100%" stopColor={accent.to} />
          </linearGradient>
          <filter id={`${gradientId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <FlashCircle
          key={flashKey}
          $flash={flashKey > 0}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          filter={`url(#${gradientId}-glow)`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </Svg>
      <Center>
        {big != null && <Big $size={size}>{big}</Big>}
        {small && <Small>{small}</Small>}
      </Center>
    </Wrap>
  );
}
