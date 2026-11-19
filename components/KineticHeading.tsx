"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, lerp, spring, volumeSquash } from "@/lib/motion";

type KineticHeadingProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "div";
  t?: number;
  start?: number;
  stagger?: number;
  k?: number;
  c?: number;
  maxFontPx?: number;
  minFontPx?: number;
  shadowColor?: string;
  className?: string;
  mode?: "letters" | "words";
};

/**
 * Accessible kinetic heading obeying the v3 Typography Contract:
 * - Preserves `.sr-only` text copy + `aria-hidden` visual layer (Roselli 2026)
 * - Uses `padding-block: 0.2em; margin-block: -0.2em; overflow: visible` so
 *   Spanish diacritics (Á, É, Í, Ó, Ú, Ñ) and descenders (g, j, p, q, y) never clip.
 * - Uses ResizeObserver to adapt max `wdth` (95 on mobile -> 125 on desktop)
 *   and scale font size cleanly inside container bounds.
 */
export function KineticHeading({
  text,
  as = "h2",
  t,
  start = 0,
  stagger = 0.04,
  k = 130,
  c = 13,
  maxFontPx = 88,
  minFontPx = 26,
  shadowColor,
  className = "",
  mode = "words",
}: KineticHeadingProps) {
  const Tag = as;
  const wrapRef = useRef<HTMLElement | null>(null);
  const [boxWidth, setBoxWidth] = useState<number>(960);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setBoxWidth(w);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const targetWdth = clamp(lerp(95, 125, (boxWidth - 320) / 720), 95, 125);
  const longestWord = text
    .split(/\s+/)
    .reduce((m, w) => Math.max(m, w.length), 1);
  // Fit both total phrase density and longest single word comfortably inside boxWidth
  const widthCapByWord = (boxWidth * 0.92) / Math.max(4, longestWord * 0.66);
  const widthCapByTotal = (boxWidth * 2.15) / Math.max(8, text.length * 0.56);
  const computedFontSize = clamp(
    Math.min(maxFontPx, widthCapByWord, widthCapByTotal),
    minFontPx,
    maxFontPx
  );

  const tokens =
    mode === "letters" ? text.split("") : text.split(/(\s+)/);

  const shadowCss =
    t !== undefined && shadowColor
      ? (() => {
          const dt = Math.max(0, t - (start + 0.12));
          const e =
            computedFontSize * (0.03 + 0.07 * Math.exp(-dt * 5));
          return `${e.toFixed(1)}px ${(e * 0.7).toFixed(1)}px 0 ${shadowColor}`;
        })()
      : shadowColor
        ? `3px 3px 0 ${shadowColor}`
        : undefined;

  let animIndex = 0;

  return (
    <Tag
      ref={wrapRef as React.RefObject<never>}
      className={`kh-wrap ${className}`}
      style={{
        fontSize: `${computedFontSize.toFixed(1)}px`,
        textShadow: shadowCss,
      }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="kh-visual">
        {tokens.map((tok, i) => {
          if (/^\s+$/.test(tok)) {
            return (
              <span key={`sp-${i}`} className="kh-space">
                {" "}
              </span>
            );
          }

          const idx = animIndex++;
          if (t === undefined) {
            return (
              <span
                key={`tk-${i}`}
                className="kh-unit"
                style={{
                  fontVariationSettings: `"wdth" ${targetWdth.toFixed(1)}, "wght" 900`,
                }}
              >
                {tok}
              </span>
            );
          }

          const s = spring(Math.max(0, t - start - idx * stagger), k, c);
          const axis = clamp(s, 0, 1);
          const wdth = lerp(62, targetWdth, axis);
          const wght = lerp(180, 900, axis);
          const over = s - axis;
          const sy = clamp(1 - over * 0.22, 0.86, 1.14);
          const visible = t >= start + idx * stagger * 0.55;

          return (
            <span
              key={`tk-${i}`}
              className="kh-unit"
              style={{
                fontVariationSettings: `"wdth" ${wdth.toFixed(1)}, "wght" ${wght.toFixed(0)}`,
                transformOrigin: "50% 100%",
                transform: volumeSquash(sy),
                opacity: visible ? 1 : 0,
              }}
            >
              {tok}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
