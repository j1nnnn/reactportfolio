const JLLogo = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer ring */}
    <circle
      cx="50"
      cy="50"
      r="46"
      stroke="var(--color-primary)"
      strokeWidth="1.5"
      opacity="0.35"
    />

    {/* JL monogram — geometric style matching original logo */}
    <g transform="translate(50, 50) scale(0.58)" strokeLinejoin="round" strokeLinecap="round">
      {/* Left arm — J letter */}
      {/* Outer face (lighter gold) */}
      <path
        d="M -38 -20 L -38 22 Q -38 32 -28 32 L -18 32 L -18 22 L -28 22 Q -28 22 -28 22 L -28 -8 Z"
        fill="#c9a020"
        opacity="0.9"
      />
      {/* Inner face (darker gold) */}
      <path
        d="M -28 -8 L -28 22 L -18 22 L -18 32 L -8 32 L -8 22 Q -8 12 -18 12 L -18 -20 Z"
        fill="#a07818"
        opacity="0.9"
      />

      {/* Right arm — L letter (mirrored) */}
      {/* Inner face (darker gold) */}
      <path
        d="M 28 -8 L 28 22 L 18 22 L 18 32 L 8 32 L 8 22 Q 8 12 18 12 L 18 -20 Z"
        fill="#a07818"
        opacity="0.9"
      />
      {/* Outer face (lighter gold) */}
      <path
        d="M 38 -20 L 38 22 Q 38 32 28 32 L 18 32 L 18 22 L 28 22 Q 28 22 28 22 L 28 -8 Z"
        fill="#c9a020"
        opacity="0.9"
      />

      {/* Top center chevron — dark accent */}
      <path
        d="M -18 -20 L 0 -38 L 18 -20 L 8 -20 L 0 -28 L -8 -20 Z"
        fill="#3a3530"
        opacity="0.85"
      />
      {/* Chevron highlight */}
      <path
        d="M -8 -20 L 0 -28 L 8 -20 L 4 -20 L 0 -24 L -4 -20 Z"
        fill="#4a4540"
        opacity="0.7"
      />
    </g>
  </svg>
)

export default JLLogo
