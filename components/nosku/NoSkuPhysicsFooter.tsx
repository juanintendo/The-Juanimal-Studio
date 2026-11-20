"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { playOnce } from "@/lib/nosku-sound";

export interface FooterCopy {
  headline: string;
  subline: string;
  dropAgain: string;
  replayPeel: string;
  claimBox: string;
  soundOn: string;
  soundOff: string;
  links: Array<{ label: string; href: string }>;
  copyright: string;
}

interface NoSkuPhysicsFooterProps {
  copy: FooterCopy;
  soundOn: boolean;
  onToggleSound: () => void;
  onReplayPeel: () => void;
  onClaimBox: () => void;
  bindPoke?: (el: HTMLElement | null) => void;
}

interface BallSpec {
  id: string;
  label: string;
  sub?: string;
  bg: string;
  fg: string;
  ring: string;
  radiusVw: number;
  homeXFrac: number;
  homeYFrac: number;
}

const BALL_SPECS: BallSpec[] = [
  {
    id: "nosku",
    label: "NO SKU",
    sub: "#000",
    bg: "#FF4D29",
    fg: "#F4EFE6",
    ring: "#18110E",
    radiusVw: 5.4,
    homeXFrac: 0.11,
    homeYFrac: 0.34,
  },
  {
    id: "zero-prod",
    label: "00%",
    sub: "PROD",
    bg: "#1F4BFF",
    fg: "#F4EFE6",
    ring: "#18110E",
    radiusVw: 4.5,
    homeXFrac: 0.22,
    homeYFrac: 0.25,
  },
  {
    id: "proof",
    label: "100%",
    sub: "PROOF",
    bg: "#D4FF2B",
    fg: "#18110E",
    ring: "#18110E",
    radiusVw: 5.0,
    homeXFrac: 0.33,
    homeYFrac: 0.38,
  },
  {
    id: "finds-us",
    label: "IT FINDS",
    sub: "US",
    bg: "#FF2E88",
    fg: "#F4EFE6",
    ring: "#18110E",
    radiusVw: 5.1,
    homeXFrac: 0.44,
    homeYFrac: 0.28,
  },
  {
    id: "no-chase",
    label: "NO",
    sub: "CHASE",
    bg: "#FFB800",
    fg: "#18110E",
    ring: "#18110E",
    radiusVw: 4.4,
    homeXFrac: 0.55,
    homeYFrac: 0.36,
  },
  {
    id: "fps",
    label: "60 FPS",
    sub: "CRAFT",
    bg: "#F4EFE6",
    fg: "#18110E",
    ring: "#18110E",
    radiusVw: 4.7,
    homeXFrac: 0.66,
    homeYFrac: 0.26,
  },
  {
    id: "flex",
    label: "PURE",
    sub: "FLEX",
    bg: "#18110E",
    fg: "#FF4D29",
    ring: "#F4EFE6",
    radiusVw: 5.2,
    homeXFrac: 0.77,
    homeYFrac: 0.35,
  },
  {
    id: "box000",
    label: "BOX",
    sub: "#000",
    bg: "#C8A27A",
    fg: "#18110E",
    ring: "#18110E",
    radiusVw: 4.5,
    homeXFrac: 0.87,
    homeYFrac: 0.28,
  },
  {
    id: "juanimal",
    label: "JUANIMAL",
    sub: "LAB",
    bg: "#FF4D29",
    fg: "#18110E",
    ring: "#18110E",
    radiusVw: 4.9,
    homeXFrac: 0.93,
    homeYFrac: 0.42,
  },
];

interface BallBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  angle: number;
  omega: number;
  released: boolean;
  releaseDelay: number;
  dragging: boolean;
  mass: number;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function NoSkuPhysicsFooter({
  copy,
  soundOn,
  onToggleSound,
  onReplayPeel,
  onClaimBox,
  bindPoke,
}: NoSkuPhysicsFooterProps) {
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const ballElsRef = useRef<Array<HTMLDivElement | null>>([]);
  const relaunchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = arena.clientWidth || 1000;
    let height = arena.clientHeight || 380;
    let bodies: BallBody[] = [];
    let raf = 0;
    let lastTs = 0;
    let simElapsed = 0;
    let active = false;
    let hasLaunched = false;
    let lastSoundAt = 0;

    // Active drag tracking
    let dragIndex = -1;
    let dragPointerId = -1;
    let pointerX = 0;
    let pointerY = 0;
    let pointerVx = 0;
    let pointerVy = 0;
    let lastPointerTs = 0;

    const computeRadius = (spec: BallSpec) => {
      const vwPx = (window.innerWidth || width) / 100;
      const base = spec.radiusVw * vwPx;
      const minR = width < 700 ? 28 : 38;
      const maxR = width < 700 ? 52 : 76;
      return clamp(base, minR, maxR);
    };

    const initBodies = (instantRest: boolean) => {
      width = arena.clientWidth || 1000;
      height = arena.clientHeight || 380;
      const floorY = Math.max(80, height - 10);

      bodies = BALL_SPECS.map((spec, idx) => {
        const r = computeRadius(spec);
        if (instantRest) {
          const x = clamp(spec.homeXFrac * width, r + 8, width - r - 8);
          const y = floorY - r - (idx % 2) * 4;
          return {
            x,
            y,
            vx: 0,
            vy: 0,
            r,
            angle: (idx % 2 === 0 ? -1 : 1) * (6 + idx * 3),
            omega: 0,
            released: true,
            releaseDelay: 0,
            dragging: false,
            mass: r * r,
          };
        }

        const fromLeft = idx % 2 === 0;
        const startX = fromLeft ? -r - 24 : width + r + 24;
        const startY = clamp(height * (0.14 + (idx % 4) * 0.11), r + 10, height * 0.65);
        const speedX = (360 + (idx % 3) * 140) * (fromLeft ? 1 : -1);
        const speedY = -120 - (idx % 3) * 75;

        return {
          x: startX,
          y: startY,
          vx: speedX,
          vy: speedY,
          r,
          angle: fromLeft ? -25 : 25,
          omega: (fromLeft ? 1 : -1) * (3.2 + (idx % 3) * 1.1),
          released: false,
          releaseDelay: idx * 0.11,
          dragging: false,
          mass: r * r,
        };
      });
    };

    const paintDom = () => {
      for (let i = 0; i < bodies.length; i++) {
        const el = ballElsRef.current[i];
        const b = bodies[i];
        if (!el || !b) continue;
        el.style.width = `${b.r * 2}px`;
        el.style.height = `${b.r * 2}px`;
        el.style.opacity = b.released ? "1" : "0";
        el.style.transform = `translate3d(${(b.x - b.r).toFixed(2)}px, ${(
          b.y - b.r
        ).toFixed(2)}px, 0) rotate(${b.angle.toFixed(2)}deg)`;
      }
    };

    const maybeBeep = (speed: number) => {
      if (speed < 120) return;
      const now = performance.now();
      if (now - lastSoundAt < 85) return;
      lastSoundAt = now;
      playOnce("BALL_HIT", clamp((speed - 120) / 700, 0.08, 1));
    };

    const stepPhysics = (dt: number) => {
      const subSteps = 2;
      const sdt = dt / subSteps;
      const gravity = 1350;
      const restitution = 0.44;
      const airDamp = 0.996;
      const wallTopPad = 6;
      const floorY = Math.max(80, height - 10);

      for (let step = 0; step < subSteps; step++) {
        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i];
          if (!b.released) continue;

          if (b.dragging) {
            const dx = pointerX - b.x;
            const dy = pointerY - b.y;
            b.x += dx * 0.52;
            b.y += dy * 0.52;
            b.vx = clamp(pointerVx, -1650, 1650);
            b.vy = clamp(pointerVy, -1650, 1650);
            b.omega = clamp(b.vx * 0.008, -9, 9);
            b.angle += b.omega * sdt * 57.2958;
            continue;
          }

          b.vy += gravity * sdt;
          b.vx *= airDamp;
          b.vy *= airDamp;
          b.x += b.vx * sdt;
          b.y += b.vy * sdt;

          // Roll spin coupled softly with horizontal travel
          b.angle += b.omega * sdt * 57.2958;
          b.omega *= 0.992;

          // Floor
          if (b.y + b.r > floorY) {
            const impact = Math.abs(b.vy);
            b.y = floorY - b.r;
            if (b.vy > 0) {
              if (step === 0) maybeBeep(impact);
              b.vy = -b.vy * restitution;
              if (Math.abs(b.vy) < 28) b.vy = 0;
              b.vx *= 0.94;
              b.omega = b.vx / Math.max(24, b.r);
            }
          }

          // Gentle ceiling after release inside arena
          if (b.y - b.r < wallTopPad) {
            b.y = wallTopPad + b.r;
            if (b.vy < 0) b.vy = -b.vy * 0.35;
          }

          // Side walls once entered inside container bounds
          if (b.x - b.r < 6 && b.vx < 0) {
            const impact = Math.abs(b.vx);
            b.x = b.r + 6;
            if (step === 0) maybeBeep(impact);
            b.vx = -b.vx * 0.55;
          } else if (b.x + b.r > width - 6 && b.vx > 0) {
            const impact = Math.abs(b.vx);
            b.x = width - b.r - 6;
            if (step === 0) maybeBeep(impact);
            b.vx = -b.vx * 0.55;
          }
        }

        // Pairwise circle-circle elastic collision + separation
        for (let i = 0; i < bodies.length; i++) {
          const a = bodies[i];
          if (!a.released) continue;
          for (let j = i + 1; j < bodies.length; j++) {
            const b = bodies[j];
            if (!b.released) continue;

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const minDist = a.r + b.r;
            const distSq = dx * dx + dy * dy;
            if (distSq >= minDist * minDist) continue;

            const dist = Math.sqrt(distSq) || 0.001;
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;

            const invMa = a.dragging ? 0 : 1 / a.mass;
            const invMb = b.dragging ? 0 : 1 / b.mass;
            const invMassSum = invMa + invMb;
            if (invMassSum <= 0) continue;

            // Positional correction
            const corr = (overlap * 0.88) / invMassSum;
            a.x -= nx * corr * invMa;
            a.y -= ny * corr * invMa;
            b.x += nx * corr * invMb;
            b.y += ny * corr * invMb;

            // Relative velocity along collision normal
            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const velAlongNormal = rvx * nx + rvy * ny;
            if (velAlongNormal > 0) continue;

            const jImp = (-(1 + restitution) * velAlongNormal) / invMassSum;
            const impX = jImp * nx;
            const impY = jImp * ny;

            if (!a.dragging) {
              a.vx -= impX * invMa;
              a.vy -= impY * invMa;
            }
            if (!b.dragging) {
              b.vx += impX * invMb;
              b.vy += impY * invMb;
            }

            // Tangential slip drives angular spin
            const tx = -ny;
            const ty = nx;
            const tanVel = rvx * tx + rvy * ty;
            if (!a.dragging) a.omega += (tanVel / Math.max(24, a.r)) * 0.22;
            if (!b.dragging) b.omega -= (tanVel / Math.max(24, b.r)) * 0.22;

            if (step === 0) maybeBeep(Math.abs(velAlongNormal));
          }
        }
      }
    };

    const tick = (ts: number) => {
      raf = 0;
      if (!active) return;
      const rawDt = lastTs ? (ts - lastTs) / 1000 : 1 / 60;
      lastTs = ts;
      const dt = Math.min(rawDt, 0.032);
      simElapsed += dt;

      for (let i = 0; i < bodies.length; i++) {
        if (!bodies[i].released && simElapsed >= bodies[i].releaseDelay) {
          bodies[i].released = true;
        }
      }

      stepPhysics(dt);
      paintDom();
      raf = requestAnimationFrame(tick);
    };

    const launchCascade = () => {
      if (reduced) {
        initBodies(true);
        paintDom();
        return;
      }
      hasLaunched = true;
      simElapsed = 0;
      lastTs = 0;
      dragIndex = -1;
      initBodies(false);
      paintDom();
      if (active && !raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    relaunchRef.current = launchCascade;

    // Initial resting state before scroll entry
    initBodies(true);
    paintDom();

    const toLocalCoords = (clientX: number, clientY: number) => {
      const rect = arena.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragIndex < 0 || e.pointerId !== dragPointerId) return;
      const pt = toLocalCoords(e.clientX, e.clientY);
      const now = performance.now();
      const dtMs = Math.max(8, now - lastPointerTs);
      pointerVx = ((pt.x - pointerX) / dtMs) * 1000;
      pointerVy = ((pt.y - pointerY) / dtMs) * 1000;
      pointerX = pt.x;
      pointerY = pt.y;
      lastPointerTs = now;
    };

    const onPointerEnd = (e: PointerEvent) => {
      if (dragIndex < 0 || e.pointerId !== dragPointerId) return;
      const b = bodies[dragIndex];
      if (b) {
        b.dragging = false;
        b.vx = clamp(pointerVx, -1650, 1650);
        b.vy = clamp(pointerVy, -1650, 1650);
      }
      const el = ballElsRef.current[dragIndex];
      if (el && el.hasPointerCapture?.(e.pointerId)) {
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          // noop
        }
      }
      dragIndex = -1;
      dragPointerId = -1;
    };

    const bindBallDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-ball-idx]"
      );
      if (!target) return;
      const idx = Number(target.dataset.ballIdx);
      const b = bodies[idx];
      if (!Number.isFinite(idx) || !b || !b.released) return;

      e.preventDefault();
      const pt = toLocalCoords(e.clientX, e.clientY);
      dragIndex = idx;
      dragPointerId = e.pointerId;
      pointerX = pt.x;
      pointerY = pt.y;
      pointerVx = 0;
      pointerVy = 0;
      lastPointerTs = performance.now();
      b.dragging = true;
      playOnce("TAPE_PRESS", 0.7);
      try {
        target.setPointerCapture?.(e.pointerId);
      } catch {
        // noop
      }
    };

    arena.addEventListener("pointerdown", bindBallDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerEnd);
    window.addEventListener("pointercancel", onPointerEnd);

    const ro = new ResizeObserver(() => {
      const nextW = arena.clientWidth || 1000;
      const nextH = arena.clientHeight || 380;
      if (nextW === width && nextH === height) return;
      width = nextW;
      height = nextH;
      const floorY = Math.max(80, height - 10);
      bodies.forEach((b, i) => {
        b.r = computeRadius(BALL_SPECS[i]);
        b.mass = b.r * b.r;
        b.x = clamp(b.x, b.r + 6, Math.max(b.r + 6, width - b.r - 6));
        b.y = clamp(b.y, b.r + 6, Math.max(b.r + 6, floorY - b.r));
      });
      paintDom();
    });
    ro.observe(arena);

    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) {
          if (!hasLaunched && !reduced) {
            launchCascade();
          } else if (!reduced && !raf) {
            lastTs = 0;
            raf = requestAnimationFrame(tick);
          }
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.12 }
    );
    io.observe(arena);

    return () => {
      relaunchRef.current = null;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      arena.removeEventListener("pointerdown", bindBallDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
    };
  }, []);

  const renderAnimatedLinkLabel = (label: string) =>
    Array.from(label).map((ch, idx) => (
      <span
        key={idx}
        className="ns-footer-clip"
        style={{ "--i": idx } as React.CSSProperties}
      >
        <span className="ns-footer-char">{ch === " " ? "\u00A0" : ch}</span>
      </span>
    ));

  return (
    <footer className="ns-footer" id="ns-footer">
      <div className="ns-footer-top">
        <div className="ns-footer-head-wrap">
          <h2
            ref={(el) => {
              bindPoke?.(el);
            }}
            className="ns-footer-headline"
            aria-label={copy.headline}
          >
            {Array.from(copy.headline).map((ch, i) => (
              <span key={i} className="ns-poke-wrap" aria-hidden="true">
                <span className="ns-poke-char">
                  {ch === " " ? "\u00A0" : ch}
                </span>
              </span>
            ))}
          </h2>
          <p className="ns-footer-subline">{copy.subline}</p>
        </div>

        <nav className="ns-footer-nav" aria-label="Footer navigation">
          {copy.links.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="ns-footer-link"
              onMouseEnter={() => playOnce("MENU_HOVER", 0.8)}
            >
              <span className="ns-footer-link-dot" aria-hidden="true" />
              <span className="ns-footer-link-text">
                {renderAnimatedLinkLabel(item.label)}
              </span>
            </Link>
          ))}

          <button
            type="button"
            className="ns-footer-link ns-footer-btn"
            onClick={onClaimBox}
            onMouseEnter={() => playOnce("MENU_HOVER", 0.8)}
          >
            <span className="ns-footer-link-dot" aria-hidden="true" />
            <span className="ns-footer-link-text">
              {renderAnimatedLinkLabel(copy.claimBox)}
            </span>
          </button>
        </nav>

        <div className="ns-footer-tools">
          <button
            type="button"
            className="ns-footer-chip"
            onClick={() => {
              playOnce("TAPE_PRESS", 0.85);
              relaunchRef.current?.();
            }}
          >
            {copy.dropAgain}
          </button>
          <button
            type="button"
            className="ns-footer-chip"
            onClick={() => {
              playOnce("MENU_PULL", 0.9);
              onReplayPeel();
            }}
          >
            {copy.replayPeel}
          </button>
          <button
            type="button"
            className={`ns-footer-chip ${soundOn ? "is-active" : ""}`}
            onClick={onToggleSound}
          >
            {soundOn ? copy.soundOn : copy.soundOff}
          </button>
        </div>
      </div>

      {/* Interactive 2D Physics Playground */}
      <div
        ref={arenaRef}
        className="ns-footer-bottom"
        aria-label="Interactive physics sticker balls playground"
      >
        <div className="ns-footer-watermark" aria-hidden="true">
          NO SKU // 000 — THROW &amp; BOUNCE
        </div>

        <div className="ns-footer-balls">
          {BALL_SPECS.map((ball, idx) => (
            <div
              key={ball.id}
              ref={(el) => {
                ballElsRef.current[idx] = el;
              }}
              data-ball-idx={idx}
              role="img"
              aria-label={`${ball.label} ${ball.sub ?? ""} draggable ball`}
              className="ns-footer-ball"
              style={
                {
                  "--ball-bg": ball.bg,
                  "--ball-fg": ball.fg,
                  "--ball-ring": ball.ring,
                } as React.CSSProperties
              }
            >
              <span className="ns-ball-ring">
                <span className="ns-ball-main">{ball.label}</span>
                {ball.sub && <span className="ns-ball-sub">{ball.sub}</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="ns-footer-legal">
        <span>{copy.copyright}</span>
        <span>SKU #000 • NO WAREHOUSE • 100% CODE CRAFT</span>
      </div>
    </footer>
  );
}
