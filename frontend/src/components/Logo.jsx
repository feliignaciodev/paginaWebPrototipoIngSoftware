export default function Logo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rayos del sol */}
      <g className="origin-center animate-[spin_20s_linear_infinite]">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="32"
            y1="6"
            x2="32"
            y2="12"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${angle} 32 32)`}
          />
        ))}
      </g>

      {/* Cuerpo del sol */}
      <circle cx="32" cy="28" r="12" fill="#F59E0B" />
      <circle cx="32" cy="28" r="9" fill="#FBBF24" />
      <circle cx="28" cy="25" r="3" fill="#FDE68A" opacity="0.6" />

      {/* Olas de agua */}
      <path
        d="M8 42 C14 36, 20 48, 26 42 S38 36, 44 42 S50 48, 56 42"
        stroke="#06B6D4"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        className="animate-[wave_3s_ease-in-out_infinite]"
      />
      <path
        d="M6 50 C12 44, 18 56, 24 50 S36 44, 42 50 S48 56, 58 50"
        stroke="#0EA5E9"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        className="animate-[wave_3s_ease-in-out_0.5s_infinite]"
      />
      <path
        d="M10 57 C16 52, 22 62, 28 57 S40 52, 46 57 S52 62, 54 57"
        stroke="#38BDF8"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="animate-[wave_3s_ease-in-out_1s_infinite]"
      />
    </svg>
  );
}
