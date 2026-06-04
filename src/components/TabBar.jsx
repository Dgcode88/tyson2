import { motion } from "framer-motion";
import styled from "styled-components";
import {
  LuCalendarDays,
  LuDumbbell,
  LuUtensils,
  LuBrain,
  LuPill,
  LuActivity,
  LuListChecks,
  LuLineChart,
  LuShoppingCart,
} from "react-icons/lu";
import { TAB_DEFS } from "../data/tabs.js";

// Ids/labels/colors live in src/data/tabs.js (shared with the PWA manifest
// shortcuts in vite.config.js); only the icon components are wired up here.
const ICONS = {
  schedule: LuCalendarDays,
  training: LuDumbbell,
  nutrition: LuUtensils,
  mindset: LuBrain,
  supplements: LuPill,
  recovery: LuActivity,
  checklist: LuListChecks,
  journey: LuLineChart,
  shopping: LuShoppingCart,
};

export const TABS = TAB_DEFS.map((t) => ({ ...t, Icon: ICONS[t.id] }));

// ── Logo mark — the progress-arc "T" from the brand kit ───────────────────────
function LogoMark({ size = 40 }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="railLogo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#F5B643" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#0B0E14" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#1C2230" strokeWidth="5" />
      <path d="M32 10 a22 22 0 0 1 19 33" fill="none" stroke="url(#railLogo)" strokeWidth="5" strokeLinecap="round" />
      <text x="32" y="43" textAnchor="middle" fontFamily="Archivo, sans-serif" fontSize="30" fontWeight="900" fill="#F5F7FA">
        T
      </text>
    </svg>
  );
}

const Rail = styled.nav`
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${({ theme }) => theme.layout.rail};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  padding: 18px 12px;
  background: linear-gradient(180deg, rgba(13, 17, 26, 0.86), rgba(8, 10, 16, 0.86));
  border-right: 1px solid ${({ theme }) => theme.color.border};
  backdrop-filter: blur(16px) saturate(120%);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* App-like fixed bottom bar on mobile */
  @media (max-width: 900px) {
    flex-direction: row;
    top: auto;
    left: 10px;
    right: 10px;
    bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    width: auto;
    height: auto;
    padding: 6px;
    gap: 4px;
    border-right: none;
    border: 1px solid ${({ theme }) => theme.color.border};
    border-radius: ${({ theme }) => theme.radius.lg};
    overflow-x: auto;
    box-shadow: ${({ theme }) => theme.shadow.raised};
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 6px 0 16px;
  margin-bottom: 6px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};

  span {
    font-family: ${({ theme }) => theme.font.display};
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.34em;
    text-indent: 0.34em;
    color: ${({ theme }) => theme.color.textDim};
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const Tab = styled.button`
  position: relative;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 62px;
  padding: 10px 6px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme, $active }) => ($active ? theme.color.text : theme.color.textDim)};
  transition: color 0.18s ease;
  font-size: 22px;

  svg {
    color: ${({ $color }) => $color};
    opacity: ${({ $active }) => ($active ? 1 : 0.62)};
    filter: ${({ $active, $color }) => ($active ? `drop-shadow(0 0 10px ${$color}99)` : "none")};
    transition: opacity 0.2s ease, filter 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
  &:hover svg {
    opacity: 1;
    transform: translateY(-2px) scale(1.08);
  }

  @media (max-width: 900px) {
    min-width: 0;
    min-height: 0;
    flex: 1;
    font-size: 20px;
    padding: 9px 4px;
  }
`;

const Label = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;

  /* Nine tabs on a phone: the colored icons carry identity; text labels would
     collide. The button keeps its accessible name via aria-label. */
  @media (max-width: 480px) {
    display: none;
  }
`;

const Active = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $color }) => `${$color}1f`};
  border: 1px solid ${({ $color }) => `${$color}59`};
  box-shadow: ${({ $color }) => `0 0 22px -8px ${$color}`};
  z-index: -1;
`;

export default function TabBar({ active, onChange }) {
  // WAI-ARIA tabs keyboard model: arrows (either axis, since the rail is
  // vertical on desktop and horizontal on mobile) + Home/End move selection and
  // focus together. Only the active tab is in the tab order (roving tabindex).
  const onKeyDown = (e) => {
    const idx = TABS.findIndex((t) => t.id === active);
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    const id = TABS[next].id;
    onChange(id);
    requestAnimationFrame(() => document.getElementById(`tab-${id}`)?.focus());
  };

  return (
    <Rail role="tablist" aria-label="Program sections" aria-orientation="vertical" onKeyDown={onKeyDown}>
      <Brand>
        <LogoMark size={42} />
        <span>TYSON</span>
      </Brand>
      {TABS.map(({ id, label, Icon, color }) => {
        const isActive = active === id;
        return (
          <Tab
            key={id}
            role="tab"
            id={`tab-${id}`}
            aria-label={label}
            aria-selected={isActive}
            aria-controls={`panel-${id}`}
            tabIndex={isActive ? 0 : -1}
            $active={isActive}
            $color={color}
            onClick={() => onChange(id)}
          >
            {isActive && (
              <Active
                $color={color}
                layoutId="active-tab"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <Icon aria-hidden="true" />
            <Label>{label}</Label>
          </Tab>
        );
      })}
    </Rail>
  );
}
