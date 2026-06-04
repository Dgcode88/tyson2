import styled from "styled-components";
import { LuQuote } from "react-icons/lu";
import { getLegendQuote } from "../data/legends.js";

// The reward for reaching the bottom. A different voice from the corner each day —
// Cus, Ali, Sugar Ray, Tyson. Gold, because you earned the scroll.
const Card = styled.figure`
  position: relative;
  margin: 0;
  overflow: hidden;
  padding: clamp(22px, 3vw, 40px) clamp(20px, 3vw, 44px);
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.color.gold}40;
  background:
    radial-gradient(120% 140% at 50% 0%, rgba(245, 182, 67, 0.1), transparent 60%),
    ${({ theme }) => theme.color.surface};
  box-shadow: ${({ theme }) => theme.shadow.card}, 0 0 40px -42px ${({ theme }) => theme.color.gold};
  text-align: center;
`;

const Mark = styled(LuQuote)`
  color: ${({ theme }) => theme.color.gold};
  opacity: 0.85;
  transform: scaleX(-1);
  margin-bottom: 10px;
`;

const Kicker = styled.figcaption`
  margin: 0 0 16px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.32em;
  text-indent: 0.32em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gold};
`;

const Words = styled.blockquote`
  margin: 0 auto;
  max-width: 46ch;
  font-size: clamp(19px, 2.4vw, 30px);
  line-height: 1.3;
  font-weight: 600;
  font-style: italic;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.color.text};
`;

const By = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const Rule = styled.span`
  width: 48px;
  height: 2px;
  border-radius: 2px;
  margin-bottom: 10px;
  background: ${({ theme }) => `linear-gradient(90deg, ${theme.color.gold}, transparent)`};
`;

const Name = styled.span`
  font-family: ${({ theme }) => theme.font.display};
  font-weight: 900;
  font-size: clamp(17px, 1.8vw, 22px);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.bone};
`;

const Role = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textDim};
`;

export default function GoldenNugget({ currentDay }) {
  const q = getLegendQuote(currentDay);
  return (
    <Card>
      <Mark size={30} aria-hidden="true" />
      <Kicker>From the corner</Kicker>
      <Words>“{q.text}”</Words>
      <By>
        <Rule aria-hidden="true" />
        <Name>{q.author}</Name>
        <Role>{q.role}</Role>
      </By>
    </Card>
  );
}
