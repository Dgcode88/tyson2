// An archetypal fighter in a peek-a-boo guard — built from abstract geometry,
// NOT a likeness of any real person. It's rendered as low-opacity, softly
// blurred atmosphere with the phase gradient glowing through it: a presence in
// the corner of the room, not an illustration. Purely decorative.
export default function FighterSilhouette({ accent, id = "fighter", className }) {
  const gid = `${id}-grad`;
  const bid = `${id}-blur`;
  return (
    <svg
      className={className}
      viewBox="0 0 400 480"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent.from} />
          <stop offset="100%" stopColor={accent.to} />
        </linearGradient>
        <filter id={bid} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      <g fill={`url(#${gid})`} filter={`url(#${bid})`}>
        {/* Broad shoulders + torso wedge — the mass behind the guard */}
        <path d="M86 470 C 92 320, 120 250, 200 244 C 280 250, 308 320, 314 470 Z" />
        {/* Traps / neck base rising into the guard */}
        <path d="M150 250 C 160 214, 240 214, 250 250 C 232 240, 168 240, 150 250 Z" />

        {/* Head, tucked low behind the gloves (chin down, classic Tyson tuck) */}
        <circle cx="200" cy="196" r="46" />

        {/* Left forearm sweeping up to the glove */}
        <path d="M150 300 C 132 256, 138 214, 168 196 L 196 214 C 176 230, 172 268, 182 308 Z" />
        {/* Right forearm sweeping up to the glove */}
        <path d="M250 300 C 268 256, 262 214, 232 196 L 204 214 C 224 230, 228 268, 218 308 Z" />

        {/* The two raised gloves, guarding the face */}
        <circle cx="158" cy="178" r="40" />
        <circle cx="242" cy="178" r="40" />
      </g>
    </svg>
  );
}
