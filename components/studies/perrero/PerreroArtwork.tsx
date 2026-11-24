"use client";

import type { PerreroSauce } from "./catalog";

export function PerreroEmblem({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <svg
        viewBox="0 0 64 44"
        className="pr-emblem-compact"
        aria-hidden="true"
      >
        <path
          d="M14 36 C8 28, 6 16, 12 6 C14 14, 18 20, 24 24"
          fill="none"
          stroke="#F5E4C7"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M50 36 C56 28, 58 16, 52 6 C50 14, 46 20, 40 24"
          fill="none"
          stroke="#F5E4C7"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="32" cy="24" r="10" fill="none" stroke="#F5E4C7" strokeWidth="2.2" />
        <rect x="24" y="20" width="7" height="4.5" rx="1" fill="#F5E4C7" />
        <rect x="33" y="20" width="7" height="4.5" rx="1" fill="#F5E4C7" />
        <path d="M27 29 Q32 32 37 29" fill="none" stroke="#F5E4C7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 180 180" className="pr-emblem-svg" aria-label="Perrero Sauce Co. Crest">
      <defs>
        <path id="pr-crest-arc" d="M 28,88 A 62,62 0 0,1 152,88" />
      </defs>
      {/* Crossed street-cart tongs */}
      <line x1="34" y1="146" x2="146" y2="54" stroke="#F5E4C7" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="146" y1="146" x2="34" y2="54" stroke="#F5E4C7" strokeWidth="3.5" strokeLinecap="round" />
      {/* Chef hat */}
      <path
        d="M64 62 C54 50, 62 34, 76 38 C82 28, 98 28, 104 38 C118 34, 126 50, 116 62 Z"
        fill="#100B06"
        stroke="#F5E4C7"
        strokeWidth="3"
      />
      <rect x="66" y="61" width="48" height="10" rx="2" fill="#F5E4C7" />
      {/* Bulldog head */}
      <path
        d="M58 76 C52 94, 56 120, 74 128 L106 128 C124 120, 128 94, 122 76 Z"
        fill="#100B06"
        stroke="#F5E4C7"
        strokeWidth="3.2"
      />
      {/* Floppy ears */}
      <path d="M58 78 C42 82, 42 104, 54 106" fill="#100B06" stroke="#F5E4C7" strokeWidth="2.8" />
      <path d="M122 78 C138 82, 138 104, 126 106" fill="#100B06" stroke="#F5E4C7" strokeWidth="2.8" />
      {/* Sunglasses */}
      <rect x="63" y="83" width="24" height="13" rx="3" fill="#F5E4C7" />
      <rect x="93" y="83" width="24" height="13" rx="3" fill="#F5E4C7" />
      <line x1="87" y1="88" x2="93" y2="88" stroke="#F5E4C7" strokeWidth="3" />
      {/* Snout & grin */}
      <ellipse cx="90" cy="108" rx="18" ry="12" fill="#100B06" stroke="#F5E4C7" strokeWidth="2.6" />
      <polygon points="84,101 96,101 90,107" fill="#F5E4C7" />
      <path d="M78 113 Q90 119 102 113" fill="none" stroke="#F5E4C7" strokeWidth="2.4" strokeLinecap="round" />
      {/* Arched lettering */}
      <text
        fill="#F5E4C7"
        fontSize="20"
        fontWeight="800"
        letterSpacing="2.5"
        fontFamily="var(--font-pr-disp), Impact, sans-serif"
      >
        <textPath href="#pr-crest-arc" startOffset="50%" textAnchor="middle">
          PERRERO
        </textPath>
      </text>
      <text
        x="90"
        y="156"
        textAnchor="middle"
        fill="#F5E4C7"
        fontSize="11"
        fontWeight="700"
        letterSpacing="3"
        fontFamily="var(--font-pr-body), sans-serif"
      >
        SAUCE CO.
      </text>
    </svg>
  );
}

export function PerreroBottle({
  sauce,
  className = "",
}: {
  sauce: PerreroSauce;
  className?: string;
}) {
  const gradId = `pr-liq-${sauce.id}`;
  const shineId = `pr-shine-${sauce.id}`;

  return (
    <svg
      viewBox="0 0 220 420"
      className={`pr-bottle-svg ${className}`}
      role="img"
      aria-label={`${sauce.name} bottle`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={sauce.liquidTopHex} />
          <stop offset="52%" stopColor={sauce.liquidMidHex} />
          <stop offset="100%" stopColor={sauce.liquidDarkHex} />
        </linearGradient>
        <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
          <stop offset="22%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="78%" stopColor="rgba(0,0,0,0.0)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.22)" />
        </linearGradient>
      </defs>

      {/* Subtle floor shadow */}
      <ellipse cx="110" cy="402" rx="56" ry="8" fill="rgba(0,0,0,0.52)" />

      {/* Screw cap */}
      <rect x="82" y="16" width="56" height="34" rx="5" fill="#171412" stroke="#3B332C" strokeWidth="1.5" />
      <line x1="89" y1="18" x2="89" y2="48" stroke="rgba(245,228,199,0.22)" strokeWidth="1.5" />
      <line x1="97" y1="18" x2="97" y2="48" stroke="rgba(245,228,199,0.16)" strokeWidth="1.5" />
      <line x1="123" y1="18" x2="123" y2="48" stroke="rgba(245,228,199,0.16)" strokeWidth="1.5" />
      <line x1="131" y1="18" x2="131" y2="48" stroke="rgba(245,228,199,0.22)" strokeWidth="1.5" />
      <rect x="78" y="47" width="64" height="8" rx="3" fill="#231D18" stroke="#4D4238" strokeWidth="1" />

      {/* Bottle glass silhouette filled with sauce */}
      <path
        d="M84 55 L136 55 L139 112 C140 126, 166 138, 168 168 L168 378 C168 392, 158 398, 144 398 L76 398 C62 398, 52 392, 52 378 L52 168 C54 138, 80 126, 81 112 Z"
        fill={`url(#${gradId})`}
        stroke="rgba(245,228,199,0.38)"
        strokeWidth="2"
      />

      {/* Fresh herb / spice / pepper speckles inside glass */}
      <g opacity="0.62" fill={sauce.speckleHex}>
        <circle cx="72" cy="184" r="2.6" />
        <circle cx="148" cy="176" r="2.2" />
        <circle cx="85" cy="156" r="1.9" />
        <circle cx="132" cy="148" r="2.4" />
        <circle cx="68" cy="348" r="2.5" />
        <circle cx="152" cy="360" r="2.8" />
        <circle cx="94" cy="374" r="2.2" />
        <circle cx="128" cy="356" r="1.8" />
        <circle cx="110" cy="382" r="2.6" />
      </g>

      {/* Neck craft collar */}
      <path
        d="M82 68 L138 68 L139 94 L81 94 Z"
        fill="#14100C"
        stroke="#F5E4C7"
        strokeWidth="1.2"
      />
      <text
        x="110"
        y="85"
        textAnchor="middle"
        fill="#F5E4C7"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="2"
        fontFamily="var(--font-pr-body), sans-serif"
      >
        CARACAS BATCH
      </text>

      {/* Main matte black & cream label */}
      <rect
        x="58"
        y="192"
        width="104"
        height="148"
        rx="4"
        fill="#120D09"
        stroke="#F5E4C7"
        strokeWidth="1.6"
      />
      <rect
        x="63"
        y="197"
        width="94"
        height="138"
        rx="2"
        fill="none"
        stroke="rgba(245,228,199,0.32)"
        strokeDasharray="3 3"
        strokeWidth="1"
      />

      {/* Label header */}
      <text
        x="110"
        y="222"
        textAnchor="middle"
        fill="#F5E4C7"
        fontSize="24"
        fontWeight="400"
        letterSpacing="1.2"
        fontFamily="var(--font-pr-disp), Impact, sans-serif"
      >
        PERRERO
      </text>
      <text
        x="110"
        y="235"
        textAnchor="middle"
        fill="rgba(245,228,199,0.72)"
        fontSize="7.5"
        fontWeight="700"
        letterSpacing="2.4"
        fontFamily="var(--font-pr-body), sans-serif"
      >
        SMALL-BATCH SAUCE
      </text>

      {/* Accent divider pill */}
      <rect x="68" y="246" width="84" height="24" rx="3" fill={sauce.accentHex} />
      <text
        x="110"
        y="262"
        textAnchor="middle"
        fill="#F5E4C7"
        fontSize="12"
        fontWeight="700"
        letterSpacing="0.8"
        fontFamily="var(--font-pr-disp), Impact, sans-serif"
      >
        {sauce.shortName}
      </text>

      {/* Label footer details */}
      <text
        x="110"
        y="289"
        textAnchor="middle"
        fill="rgba(245,228,199,0.82)"
        fontSize="6.5"
        fontWeight="600"
        letterSpacing="1.1"
        fontFamily="var(--font-pr-body), sans-serif"
      >
        {sauce.badgeText}
      </text>
      <line x1="72" y1="302" x2="148" y2="302" stroke="rgba(245,228,199,0.28)" strokeWidth="1" />
      <text
        x="73"
        y="319"
        fill="#F5E4C7"
        fontSize="8.5"
        fontWeight="700"
        fontFamily="var(--font-pr-body), sans-serif"
      >
        NO.{sauce.num}
      </text>
      <text
        x="147"
        y="319"
        textAnchor="end"
        fill="rgba(245,228,199,0.72)"
        fontSize="7.5"
        fontWeight="600"
        fontFamily="var(--font-pr-body), sans-serif"
      >
        12 OZ
      </text>

      {/* Specular studio glass highlights */}
      <path
        d="M84 55 L136 55 L139 112 C140 126, 166 138, 168 168 L168 378 C168 392, 158 398, 144 398 L76 398 C62 398, 52 392, 52 378 L52 168 C54 138, 80 126, 81 112 Z"
        fill={`url(#${shineId})`}
        pointerEvents="none"
      />
      <path
        d="M62 172 C64 146, 82 134, 86 114"
        fill="none"
        stroke="rgba(255,255,255,0.48)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="62"
        y1="184"
        x2="62"
        y2="372"
        stroke="rgba(255,255,255,0.24)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
