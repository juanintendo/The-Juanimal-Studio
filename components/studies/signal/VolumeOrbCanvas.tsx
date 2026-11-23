"use client";

import { useEffect, useRef } from "react";
import type { TelemetrySample } from "./SignalWebGLCanvas";

interface VolumeOrbCanvasProps {
  active: boolean;
  reduced: boolean;
  onTelemetry: (sample: TelemetrySample) => void;
  onProgramChange: (programName: string) => void;
}

const PROGRAMS = ["Terrain", "Neural Pulse", "Vortex Ring"];

export default function VolumeOrbCanvas({
  active,
  reduced,
  onTelemetry,
  onProgramChange,
}: VolumeOrbCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const reducedRef = useRef(reduced);
  const onTelRef = useRef(onTelemetry);
  const onProgRef = useRef(onProgramChange);
  const progIdxRef = useRef(0);

  activeRef.current = active;
  reducedRef.current = reduced;
  onTelRef.current = onTelemetry;
  onProgRef.current = onProgramChange;

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

    let mx = 0.5;
    let my = 0.5;
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
      progIdxRef.current = (progIdxRef.current + 1) % PROGRAMS.length;
      onProgRef.current(PROGRAMS[progIdxRef.current]);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("click", onClick);

    // Precompute deterministic voxel lattice inside unit sphere
    const voxels: Array<{ x: number; y: number; z: number; u: number; v: number }> = [];
    const steps = 16;
    for (let ix = -steps; ix <= steps; ix += 2) {
      for (let iz = -steps; iz <= steps; iz += 2) {
        const nx = ix / steps;
        const nz = iz / steps;
        if (nx * nx + nz * nz <= 0.92) {
          voxels.push({ x: nx, y: 0, z: nz, u: nx, v: nz });
        }
      }
    }

    const draw = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(draw);
      if (!activeRef.current) return;

      const t0 = performance.now();
      const w = canvas.width;
      const h = canvas.height;
      const t = reducedRef.current ? 1.8 : now * 0.001;

      ctx.fillStyle = "#060607";
      ctx.fillRect(0, 0, w, h);

      // Subtle quantized grid
      ctx.fillStyle = "rgba(244, 241, 234, 0.028)";
      const cell = Math.max(12, Math.round(w / 96));
      for (let gx = 0; gx < w; gx += cell * 2) {
        ctx.fillRect(gx, 0, 1, h);
      }

      const cx = w > h * 1.15 ? w * 0.72 : w * 0.5;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * (w > h * 1.15 ? 0.36 : 0.38);

      // Outer swept-volume glass bezel rings
      for (let r = 0; r < 6; r += 1) {
        const rr = radius * (1.0 - r * 0.025);
        ctx.strokeStyle =
          r === 0
            ? "rgba(244, 241, 234, 0.42)"
            : "rgba(244, 241, 234, 0.09)";
        ctx.lineWidth = r === 0 ? 2 : 1;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Latitude / longitude calibration arcs
      const yaw = t * 0.85 + (mx - 0.5) * 2.4;
      const pitch = 0.36 + (my - 0.5) * 0.9;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      const prog = progIdxRef.current;

      // Project 3D voxels
      const projected: Array<{ sx: number; sy: number; z: number; hue: number; lum: number }> = [];
      for (let i = 0; i < voxels.length; i += 1) {
        const p = voxels[i];
        let vy = 0;
        const dist = Math.hypot(p.u, p.v);
        if (prog === 0) {
          vy =
            Math.sin(p.u * 4.2 + t * 1.7) * 0.24 +
            Math.cos(p.v * 4.5 - t * 1.3) * 0.22 -
            0.12;
        } else if (prog === 1) {
          vy = Math.sin(dist * 9.0 - t * 3.4) * 0.35 * (1.0 - dist * 0.55);
        } else {
          const ang = Math.atan2(p.v, p.u);
          vy = Math.sin(ang * 3.0 + dist * 6.0 - t * 2.8) * 0.3;
        }

        const rx = p.x * cosY - p.z * sinY;
        const rz = p.x * sinY + p.z * cosY;
        const ry = vy * cosP - rz * sinP;
        const fz = vy * sinP + rz * cosP;

        const persp = 1.0 / (1.0 - fz * 0.28);
        const sx = cx + rx * radius * 0.82 * persp;
        const sy = cy + ry * radius * 0.82 * persp;

        const hue =
          prog === 0
            ? 145 + vy * 180 + dist * 60
            : prog === 1
            ? 190 + vy * 220
            : 12 + dist * 210 + vy * 90;

        projected.push({
          sx,
          sy,
          z: fz,
          hue,
          lum: 46 + (fz + 1) * 16,
        });
      }

      projected.sort((a, b) => a.z - b.z);
      const box = Math.max(3, radius * 0.028);
      for (let i = 0; i < projected.length; i += 1) {
        const pt = projected[i];
        ctx.fillStyle = `hsla(${pt.hue.toFixed(0)}, 92%, ${pt.lum.toFixed(0)}%, 0.92)`;
        ctx.fillRect(pt.sx - box * 0.5, pt.sy - box * 0.5, box * 1.45, box * 0.85);
      }

      const cookMs = performance.now() - t0;
      frameCount += 1;
      if (now - fpsLast >= 250) {
        currentFps = Math.round((frameCount * 1000) / (now - fpsLast));
        frameCount = 0;
        fpsLast = now;
      }
      if (frameCount % 3 === 0) {
        onTelRef.current({ tx: mx, ty: my, cookMs, fps: currentFps });
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
