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
      strokeWidth="2"
      opacity="0.4"
    />
    {/* Inner accent arc */}
    <path
      d="M 50 8 A 42 42 0 0 1 92 50"
      stroke="var(--color-primary)"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.8"
    />
    {/* J letter */}
    <text
      x="30"
      y="64"
      fontFamily="'Coolvetica', sans-serif"
      fontSize="38"
      fontWeight="400"
      fill="var(--color-primary)"
      opacity="0.9"
    >
      J
    </text>
    {/* L letter */}
    <text
      x="52"
      y="64"
      fontFamily="'Coolvetica', sans-serif"
      fontSize="38"
      fontWeight="400"
      fill="var(--color-text)"
      opacity="0.7"
    >
      L
    </text>
  </svg>
)

export default JLLogo
