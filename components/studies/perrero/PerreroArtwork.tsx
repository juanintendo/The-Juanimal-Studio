"use client";

export function PerreroEmblem({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <svg
        viewBox="0 0 110 64"
        className="pr-emblem-compact"
        aria-label="Perrero Sauce Co."
      >
        <path
          d="M 18,48 Q 8,28 24,14 Q 30,26 40,22 Q 44,10 55,8 Q 66,10 70,22 Q 80,26 86,14 Q 102,28 92,48 Q 76,36 55,40 Q 34,36 18,48 Z"
          fill="none"
          stroke="#F8F2E2"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <circle cx="43" cy="29" r="3" fill="#F4B942" />
        <circle cx="67" cy="29" r="3" fill="#F4B942" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 160 150"
      className="pr-emblem-svg"
      aria-label="Perrero Sauce Co. Emblem"
    >
      <defs>
        <path id="pr-crest-arc" d="M 24,48 Q 80,14 136,48" />
      </defs>

      <text
        fill="#F8F2E2"
        fontSize="24"
        fontWeight="900"
        letterSpacing="2"
        fontFamily="var(--font-pr-disp), Impact, sans-serif"
      >
        <textPath href="#pr-crest-arc" startOffset="50%" textAnchor="middle">
          PERRERO
        </textPath>
      </text>

      <text
        x="80"
        y="50"
        textAnchor="middle"
        fill="#F4B942"
        fontSize="10"
        fontWeight="800"
        letterSpacing="2.8"
        fontFamily="var(--font-pr-ui), sans-serif"
      >
        SAUCE CO.
      </text>

      {/* Street Chef-Dog Crest */}
      <g
        transform="translate(80, 96)"
        fill="none"
        stroke="#F8F2E2"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M -22,-18 C -28,-34 -10,-44 0,-38 C 10,-44 28,-34 22,-18 Z" />
        <path d="M -21,-18 L 21,-18 L 19,-11 L -19,-11 Z" fill="#10151C" />
        <path d="M -24,-8 L -38,14 L -20,10 Z" />
        <path d="M 24,-8 L 38,14 L 20,10 Z" />
        <circle cx="0" cy="6" r="21" fill="#0A0E12" />
        <rect x="-15" y="-3" width="12" height="8" rx="1.5" fill="#F8F2E2" />
        <rect x="3" y="-3" width="12" height="8" rx="1.5" fill="#F8F2E2" />
        <line x1="-3" y1="0" x2="3" y2="0" />
        <ellipse cx="0" cy="11" rx="5" ry="3.2" fill="#F4B942" stroke="none" />
        <path d="M -10,16 Q 0,25 10,16" />
      </g>
    </svg>
  );
}

export function PerreroBottleSilhouette() {
  return (
    <svg
      viewBox="0 0 110 210"
      className="pr-slot-silhouette"
      aria-hidden="true"
    >
      <path
        d="M40 8 H70 V26 L72 30 H38 L40 26 Z M38 30 L34 52 C22 66 18 82 18 102 V186 C18 196 25 202 36 202 H74 C85 202 92 196 92 186 V102 C92 82 88 66 76 52 L72 30 Z"
        fill="rgba(248, 242, 226, 0.03)"
        stroke="rgba(248, 242, 226, 0.28)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
