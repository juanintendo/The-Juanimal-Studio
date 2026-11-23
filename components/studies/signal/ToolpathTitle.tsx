"use client";

import { useEffect, useRef } from "react";

interface ToolpathTitleProps {
  triggerKey: number;
  reduced: boolean;
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "span";
}

function easeOutCubic(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - c, 3);
}

export default function ToolpathTitle({
  triggerKey,
  reduced,
  children,
  className,
  as = "h1",
}: ToolpathTitleProps) {
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el || reduced || triggerKey <= 0) return;

    let cancelled = false;
    let rafId = 0;
    let overlayCanvas: HTMLCanvasElement | null = null;

    const timer = setTimeout(() => {
      if (cancelled) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 4 || rect.height <= 4) return;

      const pad = 6;
      const cw = Math.ceil(rect.width + pad * 2);
      const ch = Math.ceil(rect.height + pad * 2);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Rasterize text offscreen using exact computed font & line metrics
      const off = document.createElement("canvas");
      off.width = cw;
      off.height = ch;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;

      const cs = getComputedStyle(el);
      const fs = parseFloat(cs.fontSize) || 32;
      octx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      octx.fillStyle = "#ffffff";
      octx.textBaseline = "alphabetic";
      const upper = cs.textTransform === "uppercase";

      // Walk text nodes with Range to place every character accurately
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      let node = walker.nextNode();
      while (node) {
        const text = node.textContent || "";
        for (let i = 0; i < text.length; i += 1) {
          const chStr = text[i];
          if (!chStr || /^\s$/.test(chStr)) continue;
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const cr = range.getBoundingClientRect();
          if (cr.width <= 0) continue;
          const drawChar = upper ? chStr.toUpperCase() : chStr;
          octx.fillText(
            drawChar,
            cr.left - rect.left + pad,
            cr.bottom - rect.top + pad - fs * 0.16
          );
        }
        node = walker.nextNode();
      }

      const imgData = octx.getImageData(0, 0, cw, ch).data;
      const inside = (x: number, y: number) =>
        x >= 0 &&
        y >= 0 &&
        x < cw &&
        y < ch &&
        imgData[((y | 0) * cw + (x | 0)) * 4 + 3] > 95;

      // Build alternating 45° diagonal CNC infill segments
      const stepPx = Math.max(1.8, fs / 15);
      const segs: Array<[number, number, number, number]> = [];
      const diagCount = Math.ceil((cw + ch) / stepPx);
      for (let d = 0; d < diagCount; d += 1) {
        const offset = d * stepPx;
        const rowSegs: Array<[number, number, number, number]> = [];
        let startPt: [number, number] | null = null;
        for (let y = 0; y <= ch; y += 1.0) {
          const x = offset - y;
          const hit = inside(x, y);
          if (hit && !startPt) startPt = [x, y];
          else if (!hit && startPt) {
            rowSegs.push([startPt[0], startPt[1], x, y]);
            startPt = null;
          }
        }
        if (startPt) rowSegs.push([startPt[0], startPt[1], offset - ch, ch]);
        if (d % 2 === 1) {
          for (let k = rowSegs.length - 1; k >= 0; k -= 1) {
            const s = rowSegs[k];
            segs.push([s[2], s[3], s[0], s[1]]);
          }
        } else {
          for (let k = 0; k < rowSegs.length; k += 1) {
            segs.push(rowSegs[k]);
          }
        }
      }

      if (segs.length === 0) return;

      const lens = segs.map((s) => Math.hypot(s[2] - s[0], s[3] - s[1]));
      const totalLen = lens.reduce((acc, l) => acc + l, 0) || 1;

      overlayCanvas = document.createElement("canvas");
      overlayCanvas.className = "sg-fx";
      overlayCanvas.width = cw * dpr;
      overlayCanvas.height = ch * dpr;
      overlayCanvas.style.width = `${cw}px`;
      overlayCanvas.style.height = `${ch}px`;
      overlayCanvas.style.left = `${rect.left - pad}px`;
      overlayCanvas.style.top = `${rect.top - pad}px`;
      document.body.appendChild(overlayCanvas);

      const ctx = overlayCanvas.getContext("2d");
      if (!ctx) {
        overlayCanvas.remove();
        return;
      }
      ctx.scale(dpr, dpr);

      el.style.opacity = "0";
      const tStart = performance.now();
      const dur = Math.min(1350, 620 + totalLen * 0.1);
      const color = cs.color || "#f4f1ea";

      const render = (now: number) => {
        if (cancelled || !overlayCanvas) return;
        const p = (now - tStart) / dur;
        ctx.clearRect(0, 0, cw, ch);

        let budget = easeOutCubic(p) * totalLen;
        let head: [number, number] | null = null;
        let prevHead: [number, number] | null = null;

        ctx.lineWidth = Math.max(1.1, stepPx * 0.65);
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.92;
        ctx.beginPath();

        for (let i = 0; i < segs.length && budget > 0; i += 1) {
          const s = segs[i];
          const sl = lens[i] || 1;
          const frac = Math.min(1, budget / sl);
          budget -= sl;
          const hx = s[0] + (s[2] - s[0]) * frac;
          const hy = s[1] + (s[3] - s[1]) * frac;
          ctx.moveTo(s[0], s[1]);
          ctx.lineTo(hx, hy);
          prevHead = head;
          head = [hx, hy];
        }
        ctx.stroke();

        // Red CNC laser head + vertical beam + dashed travel
        if (head && p < 1) {
          ctx.globalAlpha = 1;
          if (prevHead) {
            ctx.strokeStyle = "#ff2a1f";
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 3]);
            ctx.beginPath();
            ctx.moveTo(prevHead[0], prevHead[1]);
            ctx.lineTo(head[0], head[1]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          ctx.fillStyle = "#ff2a1f";
          ctx.fillRect(head[0] - 2.5, head[1] - 2.5, 5, 5);
          ctx.strokeStyle = "rgba(255, 42, 31, 0.5)";
          ctx.beginPath();
          ctx.moveTo(head[0], 0);
          ctx.lineTo(head[0], Math.max(0, head[1] - 4));
          ctx.stroke();
        }

        if (p < 1) {
          rafId = requestAnimationFrame(render);
        } else {
          el.style.opacity = "1";
          el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240 });
          const fade = overlayCanvas.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 240,
            fill: "forwards",
          });
          fade.onfinish = () => {
            overlayCanvas?.remove();
            overlayCanvas = null;
          };
        }
      };

      rafId = requestAnimationFrame(render);
    }, 30);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
      if (el) el.style.opacity = "";
      if (overlayCanvas) {
        overlayCanvas.remove();
        overlayCanvas = null;
      }
    };
  }, [triggerKey, reduced]);

  const Tag = as;
  return (
    <Tag
      ref={elRef as React.RefObject<HTMLHeadingElement & HTMLSpanElement>}
      className={className}
    >
      {children}
    </Tag>
  );
}
