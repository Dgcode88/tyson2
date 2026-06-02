import styled from "styled-components";
import { LuQuote } from "react-icons/lu";
import { getModuleQuote } from "../data/quotes.js";

const Block = styled.figure`
  margin: 0 0 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-left: 3px solid ${({ $accent }) => $accent.from};
`;

const Mark = styled(LuQuote)`
  flex: 0 0 auto;
  margin-top: 2px;
  color: ${({ $accent }) => $accent.from};
  opacity: 0.8;
  transform: scaleX(-1);
`;

const Body = styled.div`
  min-width: 0;
`;

const Text = styled.blockquote`
  margin: 0;
  font-size: clamp(15px, 1.5vw, 18px);
  line-height: 1.5;
  font-style: italic;
  font-weight: 500;
  color: ${({ theme }) => theme.color.text};
`;

const Cite = styled.figcaption`
  margin-top: 8px;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textDim};
`;

// A short, module-relevant Mike Tyson quote that frames each panel.
export default function QuoteBlock({ moduleId, day, accent }) {
  const quote = getModuleQuote(moduleId, day);
  return (
    <Block $accent={accent}>
      <Mark size={20} $accent={accent} aria-hidden="true" />
      <Body>
        <Text>“{quote.text}”</Text>
        <Cite>— Mike Tyson</Cite>
      </Body>
    </Block>
  );
}
