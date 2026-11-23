"use client";

import { useEffect, useRef } from "react";
import type { TelemetrySample } from "./SignalWebGLCanvas";

interface SchematicArmCanvasProps {
  active: boolean;
  reduced: boolean;
  onTelemetry: (sample: TelemetrySample) => void;
}

export default function SchematicArmCanvas({
  active,
  reduced,
  onTelemetry,
}: SchematicArmCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const reducedRef = useRef(reduced);
  const onTelRef = useRef(onTelemetry);
  const stackedRef = useRef(false);

  activeRef.current = active;
  reducedRef.current = reduced;
  onTelRef.current = onTelemetry;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
    };

    resize();
    window.addEventListener("resize", resize);
    const ro =
      typeof ResizeObserver !== "undefined" && canvas.parentElement
        ? new ResizeObserver(resize)
        : null;
    if (ro && canvas.parentElement) ro.observe(canvas.parentElement);

    let mx = 0.68;
    let my = 0.44;
    let smx = 0.68;
    let smy = 0.44;
    let frameCount = 0;
    let fpsLast = performance.now();
    let currentFps = 60;
    let rafId = 0;
    let disposed = false;

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      mx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      my = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    };

    const onClick = () => {
      if (!activeRef.current) return;
      stackedRef.current = !stackedRef.current;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("click", onClick);

    const draw = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(draw);
      if (!activeRef.current) return;

      const t0 = performance.now();
      const w = canvas.width;
      const h = canvas.height;
      const t = reducedRef.current ? 0 : now * 0.001;

      smx += (mx - smx) * 0.09;
      smy += (my - smy) * 0.09;

      ctx.fillStyle = "#040404";
      ctx.fillRect(0, 0, w, h);

      // CAD graph paper grid
      const major = 120;
      const minor = 24;
      ctx.strokeStyle = "rgba(244, 241, 234, 0.035)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += minor) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += minor) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(244, 241, 234, 0.08)";
      for (let x = 0; x < w; x += major) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += major) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Base pedestal on right half
      const bx = w > h * 1.15 ? w * 0.7 : w * 0.5;
      const by = h * 0.72;
      const l1 = Math.min(w, h) * 0.22;
      const l2 = Math.min(w, h) * 0.19;

      const tx = stackedRef.current
        ? bx + Math.sin(t * 2.2) * 28
        : w * (0.48 + smx * 0.36);
      const ty = stackedRef.current
        ? by - l1 * 1.35 + Math.cos(t * 1.6) * 14
        : h * (0.18 + smy * 0.48);

      // 2-link analytical IK
      const dx = tx - bx;
      const dy = ty - by;
      const dist = Math.min(l1 + l2 - 4, Math.max(24, Math.hypot(dx, dy)));
      const cosA2 =
        (dist * dist - l1 * l1 - l2 * l2) / (2 * l1 * l2);
      const a2 = Math.acos(Math.max(-1, Math.min(1, cosA2)));
      const baseAngle = Math.atan2(dy, dx);
      const a1 =
        baseAngle -
        Math.atan2(l2 * Math.sin(a2), l1 + l2 * Math.cos(a2));

      const j1x = bx + Math.cos(a1) * l1;
      const j1y = by + Math.sin(a1) * l1;
      const j2x = j1x + Math.cos(a1 + a2) * l2;
      const j2y = j1y + Math.sin(a1 + a2) * l2;

      // Dashed target line
      ctx.save();
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = "rgba(255, 42, 31, 0.45)";
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.restore();

      // Base rectangle
      ctx.strokeStyle = "rgba(244, 241, 234, 0.75)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx - 34, by, 68, 22);

      // Arm links
      ctx.strokeStyle = "#f4f1ea";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(j1x, j1y);
      ctx.lineTo(j2x, j2y);
      ctx.stroke();

      // Joint rings & labels
      const joints = [
        { x: bx, y: by, lbl: `J1 ${(a1 * 57.3).toFixed(0)}°` },
        { x: j1x, y: j1y, lbl: `J2 ${(a2 * 57.3).toFixed(0)}°` },
        { x: j2x, y: j2y, lbl: stackedRef.current ? "LOCK" : "TCP" },
      ];
      ctx.font = "11px monospace";
      joints.forEach((j, idx) => {
        ctx.fillStyle = "#040404";
        ctx.beginPath();
        ctx.arc(j.x, j.y, idx === 2 ? 7 : 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = idx === 2 ? "#ff2a1f" : "#f4f1ea";
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.fillStyle = idx === 2 ? "#ff2a1f" : "rgba(244, 241, 234, 0.78)";
        ctx.fillText(j.lbl, j.x + 14, j.y + 4);
      });

      // Target reticle
      ctx.strokeStyle = "#ff2a1f";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(tx, ty, 12, 0, Math.PI * 2);
      ctx.moveTo(tx - 18, ty);
      ctx.lineTo(tx + 18, ty);
      ctx.moveTo(tx, ty - 18);
      ctx.lineTo(tx, ty + 18);
      ctx.stroke();

      const cookMs = performance.now() - t0;
      frameCount += 1;
      if (now - fpsLast >= 250) {
        currentFps = Math.round((frameCount * 1000) / (now - fpsLast));
        frameCount = 0;
        fpsLast = now;
      }
      if (frameCount % 3 === 0) {
        onTelRef.current({ tx: smx, ty: smy, cookMs, fps: currentFps });
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="sg-stage-canvas"
      aria-hidden="true"
    />
  );
}
