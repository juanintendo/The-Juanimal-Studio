"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface NoSkuPostItStackProps {
  lang: "en" | "es";
  reduced: boolean;
}

interface PostItSpec {
  id: string;
  bg: string;
  strip: string;
  ink: string;
  fontVar: string;
  toolClass: string;
  restRot: number;
  toolLabel: Record<"en" | "es", string>;
  lines: Record<"en" | "es", string[]>;
  doodle: "highlight" | "oval" | "cube" | "star" | "checklist" | "swoosh";
}

const POSTIT_SPECS: PostItSpec[] = [
  {
    id: "yellow-marker",
    bg: "#FFF275",
    strip: "#F2DC4E",
    ink: "#18110E",
    fontVar: "var(--ns-hand)",
    toolClass: "is-marker",
    restRot: -2.2,
    toolLabel: { en: "FELT MARKER", es: "ROTULADOR" },
    lines: {
      en: ["note to self:", "still no SKU.", "just watch what", "this site does."],
      es: ["nota mental:", "sigue sin SKU.", "solo mira lo que", "hace esta web."],
    },
    doodle: "highlight",
  },
  {
    id: "pink-bic",
    bg: "#FF85C0",
    strip: "#F064A8",
    ink: "#1137A8",
    fontVar: "var(--ns-pen)",
    toolClass: "is-bic",
    restRot: 1.9,
    toolLabel: { en: "BIC BLUE PEN", es: "BOLI BIC AZUL" },
    lines: {
      en: [
        "client asked:",
        "\"where's the product?\"",
        "we pointed at",
        "the empty box.",
      ],
      es: [
        "cliente preguntó:",
        "\"¿y el producto?\"",
        "señalamos la",
        "caja vacía.",
      ],
    },
    doodle: "oval",
  },
  {
    id: "mint-pencil",
    bg: "#7CFCE0",
    strip: "#5CE8C8",
    ink: "#3D3A36",
    fontVar: "var(--ns-pencil)",
    toolClass: "is-pencil",
    restRot: -1.4,
    toolLabel: { en: "2B GRAPHITE", es: "LÁPIZ 2B" },
    lines: {
      en: ["sketch #04:", "0 inventory,", "100% overkill", "front-end craft."],
      es: ["boceto #04:", "0 inventario,", "100% obsesión", "en front-end."],
    },
    doodle: "cube",
  },
  {
    id: "peach-fineliner",
    bg: "#FFB56B",
    strip: "#F29A44",
    ink: "#B81D13",
    fontVar: "var(--ns-fineliner)",
    toolClass: "is-fineliner",
    restRot: 2.6,
    toolLabel: { en: "0.4MM FINELINER", es: "FINELINER ROJO" },
    lines: {
      en: [
        "URGENT:",
        "don't chase leads.",
        "build something",
        "too weird to ignore.",
      ],
      es: [
        "URGENTE:",
        "no persigas leads.",
        "haz algo imposible",
        "de ignorar.",
      ],
    },
    doodle: "star",
  },
  {
    id: "lavender-gel",
    bg: "#CCB8FF",
    strip: "#B398FA",
    ink: "#0E4F54",
    fontVar: "var(--ns-pen)",
    toolClass: "is-gel",
    restRot: -2.0,
    toolLabel: { en: "GEL PEN 0.7", es: "PLUMA GEL 0.7" },
    lines: {
      en: [
        "todo list:",
        "✓ 3D tape roll",
        "✓ folding flaps",
        "☐ actual product",
      ],
      es: [
        "pendientes:",
        "✓ rollo 3D",
        "✓ solapas reales",
        "☐ producto real",
      ],
    },
    doodle: "checklist",
  },
  {
    id: "lime-sharpie",
    bg: "#D8FF5C",
    strip: "#BFEA3A",
    ink: "#14110F",
    fontVar: "var(--ns-marker)",
    toolClass: "is-sharpie",
    restRot: 1.5,
    toolLabel: { en: "CHISEL SHARPIE", es: "MARCADOR BISEL" },
    lines: {
      en: ["found the bottom!", "peel, stick,", "move 'em anywhere.", "— Juanimal"],
      es: ["¡llegaste al fondo!", "despega y pega", "donde quieras.", "— Juanimal"],
    },
    doodle: "swoosh",
  },
];

interface SheetState {
  peeled: boolean;
  x: number;
  y: number;
  rot: number;
  z: number;
}

const DESKTOP_FAN_SPOTS = [
  { x: 16, y: -96, rot: -10 },
  { x: 122, y: -36, rot: 9 },
  { x: -18, y: 118, rot: 7 },
  { x: 132, y: 92, rot: -9 },
  { x: 54, y: -128, rot: 5 },
  { x: -12, y: -8, rot: -4 },
];

const MOBILE_FAN_SPOTS = [
  { x: -24, y: -62, rot: -8 },
  { x: 28, y: -38, rot: 7 },
  { x: -20, y: 66, rot: 6 },
  { x: 26, y: 54, rot: -7 },
  { x: 8, y: -82, rot: 4 },
  { x: -6, y: 12, rot: -3 },
];

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

function makeInitialSheets(): SheetState[] {
  return POSTIT_SPECS.map((spec, idx) => ({
    peeled: false,
    x: (5 - idx) * 2.5 - 6,
    y: -(5 - idx) * 2 + 4,
    rot: spec.restRot,
    z: 20 - idx,
  }));
}

function PostItDoodle({
  kind,
  ink,
}: {
  kind: PostItSpec["doodle"];
  ink: string;
}) {
  if (kind === "highlight") {
    return (
      <svg
        className="ns-postit-doodle"
        viewBox="0 0 220 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 18 32 Q 108 24 202 30"
          stroke={ink}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="185"
          opacity="0.72"
        />
        <path
          d="M 38 40 Q 116 35 186 38"
          stroke={ink}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    );
  }
  if (kind === "oval") {
    return (
      <svg
        className="ns-postit-doodle"
        viewBox="0 0 220 52"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 36 26 C 28 10, 184 8, 186 24 C 188 40, 44 44, 34 24"
          stroke={ink}
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 176 28 Q 198 34 208 42 M 198 44 L 209 43 L 204 33"
          stroke={ink}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </svg>
    );
  }
  if (kind === "cube") {
    return (
      <svg
        className="ns-postit-doodle is-corner"
        viewBox="0 0 72 64"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 14 22 L 36 12 L 58 22 L 36 32 Z M 14 22 L 14 44 L 36 54 L 36 32 M 58 22 L 58 44 L 36 54"
          stroke={ink}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.65"
        />
      </svg>
    );
  }
  if (kind === "star") {
    return (
      <svg
        className="ns-postit-doodle"
        viewBox="0 0 220 46"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 28 24 L 172 22 M 34 31 L 166 29"
          stroke={ink}
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.78"
        />
        <path
          d="M 190 12 L 196 32 M 181 20 L 202 22 M 183 28 L 200 14"
          stroke={ink}
          strokeWidth="2.1"
          strokeLinecap="round"
          opacity="0.82"
        />
      </svg>
    );
  }
  if (kind === "checklist") {
    return (
      <svg
        className="ns-postit-doodle"
        viewBox="0 0 220 44"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 46 22 Q 112 30 178 19"
          stroke={ink}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 5"
          opacity="0.65"
        />
      </svg>
    );
  }
  return (
    <svg
      className="ns-postit-doodle"
      viewBox="0 0 220 44"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M 24 26 Q 112 12 198 24"
        stroke={ink}
        strokeWidth="4.6"
        strokeLinecap="round"
        opacity="0.72"
      />
    </svg>
  );
}

export function NoSkuPostItStack({ lang, reduced }: NoSkuPostItStackProps) {
  const [sheets, setSheets] = useState<SheetState[]>(() => makeInitialSheets());
  const sheetRefs = useRef<Array<HTMLDivElement | null>>([]);
  const zCounterRef = useRef(40);
  const peelCountRef = useRef(0);

  const dragRef = useRef<{
    active: boolean;
    idx: number;
    pointerId: number;
    startClientX: number;
    startClientY: number;
    origX: number;
    origY: number;
    origRot: number;
    curX: number;
    curY: number;
    curRot: number;
    lastClientX: number;
    moved: boolean;
    wasPeeled: boolean;
  }>({
    active: false,
    idx: -1,
    pointerId: -1,
    startClientX: 0,
    startClientY: 0,
    origX: 0,
    origY: 0,
    origRot: 0,
    curX: 0,
    curY: 0,
    curRot: 0,
    lastClientX: 0,
    moved: false,
    wasPeeled: false,
  });

  const topUnpeeledIdx = sheets.findIndex((s) => !s.peeled);
  const peeledCount = sheets.filter((s) => s.peeled).length;
  const remainingCount = POSTIT_SPECS.length - peeledCount;

  const restackAll = useCallback(() => {
    peelCountRef.current = 0;
    zCounterRef.current = 40;
    setSheets(makeInitialSheets());
  }, []);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active || e.pointerId !== d.pointerId) return;

      const dx = e.clientX - d.startClientX;
      const dy = e.clientY - d.startClientY;
      if (!d.moved && Math.hypot(dx, dy) > 8) {
        d.moved = true;
      }

      if (d.moved) {
        const vx = e.clientX - d.lastClientX;
        d.lastClientX = e.clientX;
        d.curX = d.origX + dx;
        d.curY = d.origY + dy;
        const targetTilt = reduced ? 0 : clamp(vx * 0.48, -14, 14);
        d.curRot = d.origRot * 0.65 + targetTilt;

        const el = sheetRefs.current[d.idx];
        if (el) {
          el.classList.add("is-dragging");
          el.style.zIndex = String(zCounterRef.current);
          el.style.transform = `translate3d(${d.curX.toFixed(1)}px, ${d.curY.toFixed(
            1
          )}px, 0) rotate(${d.curRot.toFixed(2)}deg) scale(${
            reduced ? "1.01" : "1.05"
          })`;
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d.active || e.pointerId !== d.pointerId) return;

      d.active = false;
      const idx = d.idx;
      const el = sheetRefs.current[idx];
      if (el) {
        el.classList.remove("is-dragging");
        el.style.transform = "";
        el.style.zIndex = "";
      }

      if (d.moved) {
        const finalZ = ++zCounterRef.current;
        const settleRot = clamp(d.curRot, -16, 16);
        setSheets((prev) =>
          prev.map((item, i) =>
            i === idx
              ? {
                  peeled: true,
                  x: d.curX,
                  y: d.curY,
                  rot: settleRot,
                  z: finalZ,
                }
              : item
          )
        );
      } else {
        // Quick tap/click: peel unpeeled top sheet onto curated desk fan spot, or lift peeled note to front
        const isMobile =
          typeof window !== "undefined" && window.innerWidth <= 900;
        const spots = isMobile ? MOBILE_FAN_SPOTS : DESKTOP_FAN_SPOTS;
        if (!d.wasPeeled) {
          const spotIdx = peelCountRef.current % spots.length;
          peelCountRef.current += 1;
          const spot = spots[spotIdx];
          const finalZ = ++zCounterRef.current;
          setSheets((prev) =>
            prev.map((item, i) =>
              i === idx
                ? {
                    peeled: true,
                    x: spot.x,
                    y: spot.y,
                    rot: spot.rot,
                    z: finalZ,
                  }
                : item
            )
          );
        } else {
          const finalZ = ++zCounterRef.current;
          setSheets((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, z: finalZ } : item))
          );
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [reduced]);

  const handleSheetDown = (
    idx: number,
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    const item = sheets[idx];
    if (!item.peeled && idx !== topUnpeeledIdx) return;

    e.preventDefault();
    const zTop = ++zCounterRef.current;
    dragRef.current = {
      active: true,
      idx,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origX: item.x,
      origY: item.y,
      origRot: item.rot,
      curX: item.x,
      curY: item.y,
      curRot: item.rot,
      lastClientX: e.clientX,
      moved: false,
      wasPeeled: item.peeled,
    };

    const el = sheetRefs.current[idx];
    if (el) {
      el.style.zIndex = String(zTop);
    }
  };

  return (
    <div className="ns-postit-wrap">
      <div
        className="ns-postit-stage"
        aria-label={
          lang === "es"
            ? "Bloc multicolor de notas adhesivas interactivas"
            : "Interactive multicolor sticky note pad"
        }
      >
        {/* Solid Kraft Cardboard Pad Base */}
        <div className="ns-postit-backing">
          <span className="ns-postit-backing-code">NO SKU™ // PAD-006</span>
          <span className="ns-postit-backing-empty">
            {peeledCount === POSTIT_SPECS.length
              ? lang === "es"
                ? "BLOC VACÍO — DESPEGADAS"
                : "PAD EMPTY — ALL PEELED"
              : lang === "es"
                ? `${remainingCount} HOJAS RESTANTES`
                : `${remainingCount} SHEETS LEFT`}
          </span>
          {peeledCount > 0 && (
            <button
              type="button"
              className="ns-postit-restack-btn"
              onClick={restackAll}
            >
              {lang === "es" ? "↺ REAPILAR 6 NOTAS" : "↺ RE-STACK 6 NOTES"}
            </button>
          )}
        </div>

        {/* 6 Interactive Multicolor Paper Sheets */}
        {POSTIT_SPECS.map((spec, idx) => {
          const st = sheets[idx];
          const isTopUnpeeled = !st.peeled && idx === topUnpeeledIdx;
          const isInteractive = st.peeled || isTopUnpeeled;

          return (
            <div
              key={spec.id}
              ref={(el) => {
                sheetRefs.current[idx] = el;
              }}
              role={isInteractive ? "button" : undefined}
              tabIndex={isInteractive ? 0 : -1}
              aria-label={`${spec.toolLabel[lang]}: ${spec.lines[lang].join(" ")}`}
              onPointerDown={(e) => handleSheetDown(idx, e)}
              onKeyDown={(e) => {
                if (!isInteractive) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const isMobile =
                    typeof window !== "undefined" && window.innerWidth <= 900;
                  const spots = isMobile ? MOBILE_FAN_SPOTS : DESKTOP_FAN_SPOTS;
                  const spot = spots[peelCountRef.current % spots.length];
                  peelCountRef.current += 1;
                  const finalZ = ++zCounterRef.current;
                  setSheets((prev) =>
                    prev.map((item, i) =>
                      i === idx
                        ? {
                            peeled: true,
                            x: spot.x,
                            y: spot.y,
                            rot: spot.rot,
                            z: finalZ,
                          }
                        : item
                    )
                  );
                }
              }}
              className={`ns-postit-sheet ${spec.toolClass} ${
                st.peeled ? "is-peeled" : ""
              } ${isTopUnpeeled ? "is-top-sheet" : ""}`}
              style={
                {
                  "--note-bg": spec.bg,
                  "--note-strip": spec.strip,
                  "--note-ink": spec.ink,
                  zIndex: st.z,
                  transform: `translate3d(${st.x.toFixed(1)}px, ${st.y.toFixed(
                    1
                  )}px, 0) rotate(${st.rot.toFixed(2)}deg)`,
                } as React.CSSProperties
              }
            >
              <div className="ns-postit-strip" aria-hidden="true">
                <span className="ns-postit-idx">0{idx + 1}/06</span>
                <span className="ns-postit-tool-tag">{spec.toolLabel[lang]}</span>
              </div>

              <div
                className="ns-postit-body"
                style={{ fontFamily: spec.fontVar }}
              >
                {spec.lines[lang].map((line, lIdx) => (
                  <span
                    key={lIdx}
                    className="ns-postit-line"
                    style={
                      {
                        transform: `rotate(${lIdx % 2 === 0 ? -0.7 : 0.85}deg)`,
                      } as React.CSSProperties
                    }
                  >
                    {line}
                  </span>
                ))}
              </div>

              <PostItDoodle kind={spec.doodle} ink={spec.ink} />
            </div>
          );
        })}
      </div>

      <div className="ns-postit-bar">
        <span className="ns-postit-count">
          {remainingCount}/{POSTIT_SPECS.length}{" "}
          {lang === "es"
            ? "• ARRASTRA O HAZ CLICK PARA DESPEGAR"
            : "• DRAG OR CLICK TO PEEL"}
        </span>
        {peeledCount > 0 && (
          <button
            type="button"
            className="ns-postit-mini-reset"
            onClick={restackAll}
          >
            {lang === "es" ? "↺ REAPILAR" : "↺ RE-STACK"}
          </button>
        )}
      </div>
    </div>
  );
}
