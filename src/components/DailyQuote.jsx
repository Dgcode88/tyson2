import styled from "styled-components";
import { LuQuote } from "react-icons/lu";
import { GlassCard } from "./ui.jsx";
import { getDailyQuote } from "../data/quotes.js";

const Card = styled(GlassCard)`
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: clamp(16px, 1.8vw, 22px) clamp(20px, 2.6vw, 32px);
  border-left: 3px solid ${({ $accent }) => $accent.from};
`;

// Quotation glyph bled into the corner, tinted to the phase.
const Watermark = styled(LuQuote)`
  position: absolute;
  top: -16px;
  right: 8px;
  width: clamp(72px, 9vw, 120px);
  height: auto;
  color: ${({ $accent }) => $accent.from};
  opacity: 0.08;
  transform: scaleX(-1);
  pointer-events: none;
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
`;

const Eyebrow = styled.p`
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gold};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Tag = styled.span`
  color: ${({ theme }) => theme.color.textDim};
  font-weight: 700;
  letter-spacing: 0.16em;
`;

const Words = styled.blockquote`
  margin: 0;
  font-family: ${({ theme }) => theme.font.body};
  font-size: clamp(16px, 1.7vw, 23px);
  line-height: 1.32;
  font-weight: 600;
  font-style: italic;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.color.text};
  max-width: 62ch;
`;

const Attribution = styled.figcaption`
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Rule = styled.span`
  height: 2px;
  width: 56px;
  border-radius: 2px;
  background: ${({ $accent }) => `linear-gradient(90deg, ${$accent.from}, ${$accent.to})`};
  flex: 0 0 auto;
`;

const Name = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.text};
`;

// The day's headline Mike Tyson quote — the room's voice. Deterministic per day.
export default function DailyQuote({ currentDay, accent, phaseName }) {
  const quote = getDailyQuote(currentDay);
  return (
    <Card as="figure" $accent={accent} className="reveal" style={{ "--d": ".34s" }}>
      <Watermark $accent={accent} aria-hidden="true" />
      <Inner>
        <Eyebrow>
          Voice of the Champion
          <Tag>
            DAY {currentDay} · {phaseName}
          </Tag>
        </Eyebrow>
        <Words>“{quote.text}”</Words>
        <Attribution>
          <Rule $accent={accent} aria-hidden="true" />
          <Name>Mike Tyson</Name>
        </Attribution>
      </Inner>
    </Card>
  );
}
