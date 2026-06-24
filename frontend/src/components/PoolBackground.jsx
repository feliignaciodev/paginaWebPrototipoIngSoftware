export default function PoolBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cielo */}
      <rect width="1440" height="350" fill="#87CEEB" />
      <circle cx="1200" cy="100" r="60" fill="#FDE68A" opacity="0.8" />
      <circle cx="1200" cy="100" r="45" fill="#FBBF24" opacity="0.6" />

      {/* Nubes cartoon */}
      <g opacity="0.7">
        <ellipse cx="200" cy="80" rx="70" ry="30" fill="white" />
        <ellipse cx="240" cy="65" rx="50" ry="25" fill="white" />
        <ellipse cx="160" cy="70" rx="40" ry="20" fill="white" />
      </g>
      <g opacity="0.5">
        <ellipse cx="800" cy="120" rx="60" ry="25" fill="white" />
        <ellipse cx="840" cy="108" rx="45" ry="22" fill="white" />
      </g>
      <g opacity="0.4">
        <ellipse cx="500" cy="60" rx="55" ry="22" fill="white" />
        <ellipse cx="535" cy="48" rx="40" ry="18" fill="white" />
      </g>

      {/* Piso / deck de piscina */}
      <rect y="350" width="1440" height="550" fill="#E8DCC8" />
      <rect y="350" width="1440" height="20" fill="#D4C4A8" />

      {/* Borde de la piscina */}
      <rect x="100" y="400" width="1240" height="420" rx="24" fill="#B0BEC5" />
      <rect x="112" y="412" width="1216" height="396" rx="18" fill="#90A4AE" />

      {/* Lado limpio (izquierda) */}
      <rect x="120" y="420" width="600" height="380" rx="14" fill="#06B6D4" opacity="0.35" />
      <rect x="120" y="420" width="600" height="380" rx="14" fill="url(#cleanWater)" />

      {/* Reflejos lado limpio */}
      <ellipse cx="300" cy="550" rx="120" ry="8" fill="white" opacity="0.18" />
      <ellipse cx="500" cy="620" rx="80" ry="5" fill="white" opacity="0.14" />
      <ellipse cx="250" cy="700" rx="100" ry="6" fill="white" opacity="0.12" />

      {/* Olas sutiles lado limpio */}
      <path
        d="M120 520 Q220 510 320 520 Q420 530 520 520 Q620 510 720 520"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        opacity="0.2"
        className="animate-[wave_4s_ease-in-out_infinite]"
      />
      <path
        d="M120 600 Q220 590 320 600 Q420 610 520 600 Q620 590 720 600"
        stroke="white"
        strokeWidth="1"
        fill="none"
        opacity="0.15"
        className="animate-[wave_4s_ease-in-out_0.8s_infinite]"
      />

      {/* Línea divisoria discreta */}
      <line x1="720" y1="425" x2="720" y2="795" stroke="#78909C" strokeWidth="1" opacity="0.3" />

      {/* Lado sucio (derecha) */}
      <rect x="720" y="420" width="608" height="380" rx="14" fill="#4A7A5A" opacity="0.45" />
      <rect x="720" y="420" width="608" height="380" rx="14" fill="url(#dirtyWater)" />

      {/* Manchas de algas cartoon */}
      <circle cx="850" cy="520" r="25" fill="#3D6B4E" opacity="0.25" />
      <circle cx="1000" cy="600" r="35" fill="#3D6B4E" opacity="0.2" />
      <circle cx="920" cy="700" r="20" fill="#4A7A5A" opacity="0.22" />
      <circle cx="1150" cy="550" r="28" fill="#3D6B4E" opacity="0.18" />
      <circle cx="1100" cy="720" r="22" fill="#4A7A5A" opacity="0.2" />
      <ellipse cx="780" cy="650" rx="30" ry="15" fill="#3D6B4E" opacity="0.15" />
      <ellipse cx="1200" cy="650" rx="25" ry="12" fill="#4A7A5A" opacity="0.18" />

      {/* Hojas flotando en lado sucio */}
      <ellipse cx="900" cy="480" rx="12" ry="6" fill="#6B8F4A" opacity="0.5" transform="rotate(-20 900 480)" />
      <ellipse cx="1080" cy="670" rx="10" ry="5" fill="#7A9F55" opacity="0.45" transform="rotate(15 1080 670)" />
      <ellipse cx="1250" cy="500" rx="8" ry="4" fill="#6B8F4A" opacity="0.4" transform="rotate(-35 1250 500)" />

      {/* Plantas decorativas alrededor */}
      <g opacity="0.6">
        <ellipse cx="60" cy="600" rx="25" ry="50" fill="#4CAF50" />
        <ellipse cx="45" cy="580" rx="20" ry="40" fill="#66BB6A" />
        <ellipse cx="75" cy="620" rx="18" ry="35" fill="#43A047" />
      </g>
      <g opacity="0.6">
        <ellipse cx="1400" cy="580" rx="22" ry="45" fill="#4CAF50" />
        <ellipse cx="1415" cy="600" rx="18" ry="38" fill="#66BB6A" />
      </g>

      {/* Baldosas del deck */}
      <line x1="100" y1="370" x2="1340" y2="370" stroke="#C4B498" strokeWidth="0.5" opacity="0.5" />
      <line x1="100" y1="390" x2="1340" y2="390" stroke="#C4B498" strokeWidth="0.5" opacity="0.3" />

      <defs>
        <linearGradient id="cleanWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0891B2" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="dirtyWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B8F4A" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#4A7A5A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3D6B4E" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
  );
}
