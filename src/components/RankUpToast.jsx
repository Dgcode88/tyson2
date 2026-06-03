import styled from "styled-components";

// Fires only when you climb a rank — four, maybe five times across 90 days. Rare
// enough to deserve a real moment. Auto-dismissed by the parent; reduced-motion
// users still get the card, just without the slam.
const Wrap = styled.div`
  position: fixed;
  z-index: 120;
  top: clamp(16px, 7vh, 64px);
  left: 50%;
  transform: translateX(-50%);
  width: min(92vw, 480px);
  pointer-events: none;
  text-align: center;
  padding: 22px 26px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ $c }) => `${$c}80`};
  background: linear-gradient(180deg, rgba(13, 17, 26, 0.96), rgba(8, 10, 16, 0.96));
  box-shadow: 0 30px 80px -30px #000, 0 0 60px -20px ${({ $c }) => $c};
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  animation: rankToastIn 0.5s cubic-bezier(0.2, 0.85, 0.25, 1) both;

  @keyframes rankToastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-18px) scale(0.96); }
    to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Kicker = styled.p`
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textDim};
`;

const Name = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.font.brutal};
  font-size: clamp(34px, 8vw, 56px);
  line-height: 0.9;
  text-transform: uppercase;
  color: ${({ $c }) => $c};
  text-shadow: 0 0 36px ${({ $c }) => `${$c}66`};
`;

const Line = styled.p`
  margin: 14px 0 0;
  font-size: 14px;
  line-height: 1.5;
  font-style: italic;
  color: ${({ theme }) => theme.color.textMuted};

  span {
    display: block;
    margin-top: 6px;
    font-family: ${({ theme }) => theme.font.display};
    font-style: normal;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.2em;
    color: ${({ theme }) => theme.color.textDim};
  }
`;

export default function RankUpToast({ rank }) {
  return (
    <Wrap $c={rank.color} role="status" aria-live="polite">
      <Kicker>Rank earned</Kicker>
      <Name $c={rank.color}>You are now a {rank.name}</Name>
      <Line>
        “{rank.line}”<span>— Mike Tyson</span>
      </Line>
    </Wrap>
  );
}
