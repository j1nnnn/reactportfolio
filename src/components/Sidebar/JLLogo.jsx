const JLLogo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" stroke="#c9a020" strokeWidth="1.5" opacity="0.3" />

    <g transform="translate(50, 54) scale(0.52)">
      {/* J — left letter */}
      <path
        d="M -40 -18 L -40 24 Q -40 36 -28 36 L -16 36 L -16 24 L -28 24 L -28 -6 Z"
        fill="#c9a020"
      />
      <path
        d="M -28 -6 L -28 24 L -16 24 L -16 36 L -4 36 L -4 24 Q -4 12 -16 12 L -16 -18 Z"
        fill="#9a7818"
      />

      {/* L — right letter (mirrored) */}
      <path
        d="M 28 -6 L 28 24 L 16 24 L 16 36 L 4 36 L 4 24 Q 4 12 16 12 L 16 -18 Z"
        fill="#9a7818"
      />
      <path
        d="M 40 -18 L 40 24 Q 40 36 28 36 L 16 36 L 16 24 L 28 24 L 28 -6 Z"
        fill="#c9a020"
      />

      {/* Data flow curves — converging from left and right to center top */}
      <path
        d="M -20 -16 Q -16 -32 0 -40"
        stroke="#c9a020"
        strokeWidth="2.5"
        opacity="0.7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 20 -16 Q 16 -32 0 -40"
        stroke="#c9a020"
        strokeWidth="2.5"
        opacity="0.7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner flow lines — thinner, more subtle */}
      <path
        d="M -12 -16 Q -8 -28 0 -34"
        stroke="#c9a020"
        strokeWidth="1.5"
        opacity="0.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 12 -16 Q 8 -28 0 -34"
        stroke="#c9a020"
        strokeWidth="1.5"
        opacity="0.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Convergence point — diamond */}
      <path
        d="M 0 -44 L 4 -39 L 0 -34 L -4 -39 Z"
        fill="#c9a020"
        opacity="0.85"
      />

      {/* Subtle dark fill between letters */}
      <path
        d="M -16 -18 L 0 -22 L 16 -18 L 10 -16 L 0 -18 L -10 -16 Z"
        fill="#2a2520"
        opacity="0.5"
      />
    </g>
  </svg>
)

export default JLLogo
