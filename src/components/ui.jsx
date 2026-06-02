import { Fragment } from "react";
import styled, { keyframes } from "styled-components";

// ── Glass surface ─────────────────────────────────────────────────────────────
export const GlassCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: clamp(18px, 3vw, 28px);
  backdrop-filter: blur(14px) saturate(120%);
  -webkit-backdrop-filter: blur(14px) saturate(120%);
  box-shadow: ${({ theme }) => theme.shadow.card};
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Panel = styled(GlassCard)`
  padding: clamp(22px, 2.8vw, 40px);
  animation: ${fadeUp} 0.45s ease both;
`;

export const PanelHead = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 16px;
  margin-bottom: 20px;
  padding-bottom: 18px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`;

export const PanelTitle = styled.h2`
  font-size: clamp(20px, 2.6vw, 26px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.color.text};
`;

export const PanelSub = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.color.textMuted};
  max-width: 60ch;
`;

export const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gold};
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CategoryTitle = styled.h4`
  font-family: ${({ theme }) => theme.font.body};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.teal};
  margin: 26px 0 12px;
`;

export const DetailSection = styled.div`
  margin-top: 24px;
  padding-top: 22px;
  border-top: 1px solid ${({ theme }) => theme.color.border};
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
`;

export const ListItem = styled.li`
  display: flex;
  gap: 12px;
  font-size: 15px;
  line-height: 1.55;
  color: ${({ theme }) => theme.color.textMuted};

  strong {
    color: ${({ theme }) => theme.color.text};
    font-weight: 600;
  }

  &::before {
    content: "";
    flex: 0 0 auto;
    width: 6px;
    height: 6px;
    margin-top: 9px;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.teal};
    box-shadow: 0 0 8px ${({ theme }) => theme.color.tealSoft};
  }
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ theme }) => theme.color.gold};
  background: ${({ theme }) => theme.color.goldSoft};
  border: 1px solid ${({ theme }) => theme.color.border};
`;

export const Quote = styled.blockquote`
  margin: 12px 0 0;
  padding: 18px 20px;
  font-size: 15px;
  line-height: 1.7;
  font-style: italic;
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme }) => theme.color.tealSoft};
  border-left: 3px solid ${({ theme }) => theme.color.teal};
  border-radius: ${({ theme }) => theme.radius.sm};
`;

// ── Safe keyword highlighter ────────────────────────────────────────────────
// Replaces the original dangerouslySetInnerHTML approach: splits the text on a
// keyword pattern and wraps matches in <strong> as real React nodes — no HTML
// is ever injected, so there is no XSS surface.
const KEYWORD = new RegExp(
  "(supplement|vitamin|protein|creatine|bcaa|enzyme|electrolyte|magnesium|zinc|" +
    "ashwagandha|zma|beta-alanine|caffeine|fish oil|multivitamin|citrulline)",
  "i"
);
const KEYWORD_SPLIT = new RegExp(KEYWORD.source, "gi");

export function Highlight({ text }) {
  const parts = String(text).split(KEYWORD_SPLIT);
  return parts.map((part, i) =>
    KEYWORD.test(part) ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>
  );
}
