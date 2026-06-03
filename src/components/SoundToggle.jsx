import styled from "styled-components";
import { LuVolume2, LuVolumeX } from "react-icons/lu";
import { useSound, playSound } from "../hooks/useSound.js";

// A small always-reachable control. Sound is OFF by default; flipping it ON
// rings the bell once — both as confirmation and to unlock the audio context on
// the user's gesture (browsers require that first tap before any sound).
const Btn = styled.button`
  position: fixed;
  z-index: 90;
  top: max(16px, env(safe-area-inset-top, 0px));
  right: 16px;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid ${({ theme, $on }) => ($on ? theme.color.gold : theme.color.border)};
  background: ${({ theme, $on }) => ($on ? theme.color.goldSoft : "rgba(13,17,26,0.7)")};
  color: ${({ theme, $on }) => ($on ? theme.color.gold : theme.color.textMuted)};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
  font-size: 19px;
  transition: transform 0.15s ease, color 0.15s ease, border-color 0.15s ease, background 0.15s ease;

  &:hover {
    transform: scale(1.06);
    color: ${({ theme }) => theme.color.text};
  }

  @media (max-width: 900px) {
    top: 12px;
    right: 12px;
  }
`;

export default function SoundToggle() {
  const { enabled, setEnabled } = useSound();

  const handle = () => {
    const next = !enabled;
    setEnabled(next);
    if (next) playSound("bell");
  };

  return (
    <Btn
      type="button"
      $on={enabled}
      onClick={handle}
      aria-pressed={enabled}
      aria-label={enabled ? "Sound on — tap to mute" : "Sound off — tap for ring sound"}
      title={enabled ? "Ring sound: ON" : "Ring sound: OFF"}
    >
      {enabled ? <LuVolume2 /> : <LuVolumeX />}
    </Btn>
  );
}
