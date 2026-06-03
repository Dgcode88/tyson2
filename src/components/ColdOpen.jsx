import { useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { LuArrowRight } from "react-icons/lu";
import { playSound } from "../hooks/useSound.js";
import { vibrate, HAPTIC } from "../lib/haptics.js";

// ─────────────────────────────────────────────────────────────────────────────
// THE WALKOUT — the cold open. Black, a heartbeat, the day, your war cry, then
// you step through the ropes. Leads with the BODY (a pulse), not the ego: a
// fighter's nervous system already knows the walk to the ring. Shown once per
// session (the parent gates it on sessionStorage), always skippable, and it
// collapses to a calm static state under prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Screen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: radial-gradient(120% 100% at 50% 38%, #14060a 0%, #07070b 55%, #040406 100%);
  overflow: hidden;
  padding: 24px;
  /* The whole screen recoils once at the very start, like the first bell. */
  animation: ${({ $reduce }) => ($reduce ? "none" : "hitShake .5s cubic-bezier(.36,.07,.19,.97)")};
`;

// The heartbeat — a deep red glow thumping behind everything.
const Heart = styled.div`
  position: absolute;
  width: min(120vw, 1100px);
  height: min(120vw, 1100px);
  border-radius: 50%;
  background: radial-gradient(circle, ${({ theme }) => theme.color.blood} 0%, transparent 62%);
  filter: blur(40px);
  opacity: ${({ $reduce }) => ($reduce ? 0.28 : 0.3)};
  animation: ${({ $reduce }) => ($reduce ? "none" : "heartbeat 2.4s ease-in-out infinite")};
  pointer-events: none;
`;

const Grain = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.06;
  mix-blend-mode: overlay;
  pointer-events: none;
  background-size: 200px 200px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
`;

const Center = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 820px;
  display: grid;
  justify-items: center;
  gap: 0;
`;

// Each line animates in on a delay unless reduced-motion (then everything is
// already in place). `$d` is the stagger delay in seconds.
const reveal = ($reduce, $d) =>
  $reduce
    ? ""
    : `opacity:0; animation: impactIn .7s cubic-bezier(.2,.85,.25,1) forwards; animation-delay:${$d}s;`;
const fade = ($reduce, $d) =>
  $reduce
    ? ""
    : `opacity:0; animation: reveal .6s cubic-bezier(.22,1,.36,1) forwards; animation-delay:${$d}s;`;

const Eyebrow = styled.p`
  margin: 0 0 18px;
  font-size: clamp(10px, 1.4vw, 13px);
  font-weight: 800;
  letter-spacing: 0.42em;
  text-indent: 0.42em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.textDim};
  ${({ $reduce }) => fade($reduce, 0.2)}
`;

const DayWord = styled.span`
  display: block;
  font-size: clamp(11px, 1.5vw, 14px);
  font-weight: 800;
  letter-spacing: 0.32em;
  text-indent: 0.32em;
  color: ${({ theme }) => theme.color.blood};
  margin-bottom: clamp(12px, 3vw, 22px);
  ${({ $reduce }) => fade($reduce, 0.35)}
`;

const DayNum = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.font.brutal};
  font-size: clamp(96px, 24vw, 240px);
  line-height: 0.82;
  color: ${({ theme }) => theme.color.bone};
  text-shadow: 0 0 60px ${({ theme }) => theme.color.bloodGlow};
  ${({ $reduce }) => reveal($reduce, 0.5)}
`;

const Phase = styled.h1`
  margin: 14px 0 0;
  font-family: ${({ theme }) => theme.font.brutal};
  font-size: clamp(30px, 7vw, 76px);
  line-height: 0.92;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  background: ${({ $accent }) => `linear-gradient(100deg, ${$accent.from}, ${$accent.to})`};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  ${({ $reduce }) => reveal($reduce, 1.0)}
`;

const Line = styled.p`
  margin: 22px 0 0;
  max-width: 30ch;
  font-size: clamp(15px, 2.1vw, 20px);
  line-height: 1.45;
  font-style: italic;
  font-weight: 500;
  color: ${({ theme }) => theme.color.textMuted};
  ${({ $reduce }) => fade($reduce, 1.5)}

  span {
    display: block;
    margin-top: 8px;
    font-family: ${({ theme }) => theme.font.display};
    font-style: normal;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.24em;
    color: ${({ theme }) => theme.color.textDim};
  }
`;

const Cry = styled.p`
  margin: 26px 0 0;
  font-family: ${({ theme }) => theme.font.brutal};
  font-size: clamp(16px, 3vw, 26px);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.color.gold};
  text-shadow: 0 0 30px ${({ theme }) => theme.color.goldSoft};
  ${({ $reduce }) => fade($reduce, 1.9)}
`;

// The ENTER button fades in last, then breathes a soft accent glow so the eye
// lands on it without it ever shouting.
const enterPulse = (accent) => keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${accent.glow}; }
  50% { box-shadow: 0 0 38px -6px ${accent.glow}; }
`;

const Enter = styled.button`
  margin-top: 38px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 34px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1.5px solid ${({ $accent }) => $accent.from};
  background: ${({ $accent }) => `linear-gradient(100deg, ${$accent.from}22, ${$accent.to}14)`};
  color: ${({ theme }) => theme.color.text};
  font-family: ${({ theme }) => theme.font.display};
  font-size: clamp(14px, 1.7vw, 17px);
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.3s ease, background 0.2s ease;
  /* Entrance reveal, then a slow accent breath. One declaration so they never
     fight; reveal uses forwards so it holds opacity 1 while the pulse runs. */
  ${({ $reduce, $accent }) =>
    $reduce
      ? css`
          box-shadow: 0 0 24px -8px ${$accent.glow};
        `
      : css`
          opacity: 0;
          animation: reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) 2.4s forwards,
            ${enterPulse($accent)} 2.6s ease-in-out 5.4s infinite;
        `}

  &:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 18px 50px -16px ${({ $accent }) => $accent.glow};
    background: ${({ $accent }) => `linear-gradient(100deg, ${$accent.from}38, ${$accent.to}22)`};
    animation-play-state: paused;
  }
  svg {
    font-size: 18px;
    color: ${({ $accent }) => $accent.from};
  }
`;

const Skip = styled.button`
  position: absolute;
  top: max(18px, env(safe-area-inset-top, 0px));
  right: 20px;
  z-index: 3;
  border: none;
  background: none;
  color: ${({ theme }) => theme.color.textDim};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 8px 10px;
  opacity: 0.7;
  transition: opacity 0.15s ease, color 0.15s ease;
  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.color.text};
  }
`;

const Ignite = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;
  background: radial-gradient(circle at 50% 42%, #fff, ${({ $accent }) => $accent.from} 55%, transparent 80%);
  pointer-events: none;
  /* Duration matches the unmount delay below so the flash completes, not cuts. */
  animation: igniteFlash 0.45s ease-out forwards;
`;

export default function ColdOpen({ day, phaseName, accent, tysonLine, warCry, onEnter }) {
  const [igniting, setIgniting] = useState(false);
  const done = useRef(false);

  const enter = () => {
    if (done.current) return;
    done.current = true;
    playSound("bell");
    playSound("whoosh");
    vibrate(HAPTIC.enter);
    if (reduceMotion) {
      onEnter();
      return;
    }
    setIgniting(true);
    setTimeout(onEnter, 460);
  };

  // Keyboard: Enter/Space steps in, Escape skips straight through.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen $reduce={reduceMotion} role="dialog" aria-label="Enter the arena">
      <Heart $reduce={reduceMotion} aria-hidden="true" />
      <Grain aria-hidden="true" />

      <Skip type="button" onClick={enter}>
        Skip
      </Skip>

      <Center>
        <Eyebrow $reduce={reduceMotion}>90-Day Tyson Transformation</Eyebrow>
        <DayWord $reduce={reduceMotion}>DAY {day} OF 90</DayWord>
        <DayNum $reduce={reduceMotion}>{day}</DayNum>
        <Phase $reduce={reduceMotion} $accent={accent}>
          {phaseName}
        </Phase>
        <Line $reduce={reduceMotion}>
          “{tysonLine}”<span>— Mike Tyson</span>
        </Line>
        {warCry && <Cry $reduce={reduceMotion}>{warCry}</Cry>}
        <Enter type="button" $reduce={reduceMotion} $accent={accent} onClick={enter} autoFocus>
          Enter the Arena <LuArrowRight />
        </Enter>
      </Center>

      {igniting && <Ignite $accent={accent} aria-hidden="true" />}
    </Screen>
  );
}
