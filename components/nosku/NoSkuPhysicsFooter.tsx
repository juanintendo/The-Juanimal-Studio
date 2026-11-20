"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

export interface FooterCopy {
  headline: string;
  subline: string;
  dropAgain: string;
  replayPeel: string;
  claimBox: string;
  links: Array<{ label: string; href: string }>;
  copyright: string;
}

interface NoSkuPhysicsFooterProps {
  copy: FooterCopy;
  onReplayPeel: () => void;
  onClaimBox: () => void;
  bindPoke?: (el: HTMLElement | null) => void;
}

interface RollSpec {
  id: string;
  rimText: string;
  bg: string;
  fg: string;
  radiusVw: number;
  homeXFrac: number;
  homeYFrac: number;
}

const ROLL_SPECS: RollSpec[] = [
  {
    id: "nosku",
    rimText: "NO SKU // 000  •  EMPTY BY DESIGN  •  NO SKU // 000  •  ",
    bg: "#FF4D29",
    fg: "#18110E",
    radiusVw: 5.8,
    homeXFrac: 0.11,
    homeYFrac: 0.34,
  },
  {
    id: "tactile",
    rimText: "00% PRODUCT  •  100% PROOF  •  00% PRODUCT  •  100% PROOF  •  ",
    bg: "#1F4BFF",
    fg: "#F4EFE6",
    radiusVw: 4.9,
    homeXFrac: 0.22,
    homeYFrac: 0.25,
  },
  {
    id: "kinetic",
    rimText: "IT FINDS US  •  NO CHASE  •  IT FINDS US  •  NO CHASE  •  ",
    bg: "#D4FF2B",
    fg: "#18110E",
    radiusVw: 5.4,
    homeXFrac: 0.33,
    homeYFrac: 0.38,
  },
  {
    id: "loud",
    rimText: "PURE FLEX  •  ZERO INVENTORY  •  PURE FLEX  •  ZERO SKU  •  ",
    bg: "#FF2E88",
    fg: "#F4EFE6",
    radiusVw: 5.5,
    homeXFrac: 0.44,
    homeYFrac: 0.28,
  },
  {
    id: "weird",
    rimText: "60 FPS CRAFT  •  ANTI-TEMPLATE  •  60 FPS CRAFT  •  SWISS  •  ",
    bg: "#FFB800",
    fg: "#18110E",
    radiusVw: 4.8,
    homeXFrac: 0.55,
    homeYFrac: 0.36,
  },
  {
    id: "bone",
    rimText: "BOX #000  •  HANDLE WITH CARE  •  BOX #000  •  EMPTY CRATE  •  ",
    bg: "#F4EFE6",
    fg: "#18110E",
    radiusVw: 5.1,
    homeXFrac: 0.66,
    homeYFrac: 0.26,
  },
  {
    id: "ink",
    rimText: "JUANIMAL LAB  •  NO SKU™  •  JUANIMAL LAB  •  NO SKU™  •  ",
    bg: "#14161A",
    fg: "#FF4D29",
    radiusVw: 5.6,
    homeXFrac: 0.77,
    homeYFrac: 0.35,
  },
  {
    id: "kraft",
    rimText: "CARDBOARD  •  NO SKU // 000  •  CARDBOARD  •  SEAL IT  •  ",
    bg: "#C8A27A",
    fg: "#18110E",
    radiusVw: 4.9,
    homeXFrac: 0.87,
    homeYFrac: 0.28,
  },
  {
    id: "vermilion2",
    rimText: "THROW ME  •  BOUNCE ME  •  PEEL ME  •  NO PRODUCT YET  •  ",
    bg: "#FF4D29",
    fg: "#F4EFE6",
    radiusVw: 5.2,
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

    let dragIndex = -1;
    let dragPointerId = -1;
    let pointerX = 0;
    let pointerY = 0;
    let pointerVx = 0;
    let pointerVy = 0;
    let lastPointerTs = 0;

    const computeRadius = (spec: RollSpec) => {
      const vwPx = (window.innerWidth || width) / 100;
      const base = spec.radiusVw * vwPx;
      const minR = width < 700 ? 32 : 44;
      const maxR = width < 700 ? 58 : 84;
      return clamp(base, minR, maxR);
    };

    const initBodies = (instantRest: boolean) => {
      width = arena.clientWidth || 1000;
      height = arena.clientHeight || 380;
      const floorY = Math.max(80, height - 10);

      bodies = ROLL_SPECS.map((spec, idx) => {
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
            angle: (idx % 2 === 0 ? -1 : 1) * (12 + idx * 14),
            omega: 0,
            released: true,
            releaseDelay: 0,
            dragging: false,
            mass: r * r,
          };
        }

        const fromLeft = idx % 2 === 0;
        const startX = fromLeft ? -r - 24 : width + r + 24;
        const startY = clamp(
          height * (0.14 + (idx % 4) * 0.11),
          r + 10,
          height * 0.65
        );
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

          b.angle += b.omega * sdt * 57.2958;
          b.omega *= 0.992;

          if (b.y + b.r > floorY) {
            b.y = floorY - b.r;
            if (b.vy > 0) {
              b.vy = -b.vy * restitution;
              if (Math.abs(b.vy) < 28) b.vy = 0;
              b.vx *= 0.94;
              b.omega = b.vx / Math.max(24, b.r);
            }
          }

          if (b.y - b.r < wallTopPad) {
            b.y = wallTopPad + b.r;
            if (b.vy < 0) b.vy = -b.vy * 0.35;
          }

          if (b.x - b.r < 6 && b.vx < 0) {
            b.x = b.r + 6;
            b.vx = -b.vx * 0.55;
          } else if (b.x + b.r > width - 6 && b.vx > 0) {
            b.x = width - b.r - 6;
            b.vx = -b.vx * 0.55;
          }
        }

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

            const corr = (overlap * 0.88) / invMassSum;
            a.x -= nx * corr * invMa;
            a.y -= ny * corr * invMa;
            b.x += nx * corr * invMb;
            b.y += ny * corr * invMb;

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

            const tx = -ny;
            const ty = nx;
            const tanVel = rvx * tx + rvy * ty;
            if (!a.dragging) a.omega += (tanVel / Math.max(24, a.r)) * 0.22;
            if (!b.dragging) b.omega -= (tanVel / Math.max(24, b.r)) * 0.22;
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
        b.r = computeRadius(ROLL_SPECS[i]);
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
            onClick={() => relaunchRef.current?.()}
          >
            {copy.dropAgain}
          </button>
          <button
            type="button"
            className="ns-footer-chip"
            onClick={onReplayPeel}
          >
            {copy.replayPeel}
          </button>
        </div>
      </div>

      {/* Interactive 2D Physics Playground of Hollow Adhesive Rolls */}
      <div
        ref={arenaRef}
        className="ns-footer-bottom"
        aria-label="Interactive physics adhesive tape rolls playground"
      >
        <div className="ns-footer-watermark" aria-hidden="true">
          NO SKU // 000 — THROW &amp; BOUNCE
        </div>

        <div className="ns-footer-balls">
          {ROLL_SPECS.map((roll, idx) => {
            const pathId = `ns-roll-rim-${roll.id}-${idx}`;
            return (
              <div
                key={roll.id}
                ref={(el) => {
                  ballElsRef.current[idx] = el;
                }}
                data-ball-idx={idx}
                role="img"
                aria-label={`${roll.rimText.trim()} draggable tape roll`}
                className="ns-footer-ball"
              >
                <svg
                  viewBox="0 0 200 200"
                  className="ns-roll-svg"
                  aria-hidden="true"
                >
                  <defs>
                    <path
                      id={pathId}
                      d="M 100,28 A 72,72 0 1,1 99.9,28 Z"
                    />
                  </defs>

                  {/* Outer wound tape band (r = 48..96) with transparent core hole */}
                  <circle
                    cx="100"
                    cy="100"
                    r="72"
                    fill="none"
                    stroke={roll.bg}
                    strokeWidth="48"
                  />

                  {/* Subtle wound layer rings */}
                  <circle
                    cx="100"
                    cy="100"
                    r="86"
                    fill="none"
                    stroke={roll.fg}
                    strokeOpacity="0.16"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="58"
                    fill="none"
                    stroke={roll.fg}
                    strokeOpacity="0.18"
                    strokeWidth="1.5"
                  />

                  {/* Outer dark border */}
                  <circle
                    cx="100"
                    cy="100"
                    r="96"
                    fill="none"
                    stroke="#18110E"
                    strokeWidth="3.5"
                  />

                  {/* Glossy specular studio arc */}
                  <path
                    d="M 38 76 A 68 68 0 0 1 128 38"
                    fill="none"
                    stroke="rgba(255,255,255,0.44)"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  {/* Printed typography curving along the tape border */}
                  <text
                    fill={roll.fg}
                    fontSize="13.2"
                    fontWeight="800"
                    fontFamily="ui-monospace, Menlo, monospace"
                    letterSpacing="0.09em"
                    dominantBaseline="central"
                  >
                    <textPath href={`#${pathId}`} startOffset="0%">
                      {roll.rimText}
                    </textPath>
                  </text>

                  {/* Inner corrugated Kraft cardboard core (r = 40..48), hole center r < 40 stays transparent */}
                  <circle
                    cx="100"
                    cy="100"
                    r="44"
                    fill="none"
                    stroke="#CFA97E"
                    strokeWidth="8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="48"
                    fill="none"
                    stroke="#18110E"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="40"
                    fill="none"
                    stroke="#18110E"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ns-footer-legal">
        <span>{copy.copyright}</span>
        <span>SKU #000 • NO WAREHOUSE • 100% CODE CRAFT</span>
      </div>
    </footer>
  );
}
