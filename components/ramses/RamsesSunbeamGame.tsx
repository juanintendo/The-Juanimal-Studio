"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ComicSfxKind } from "@/lib/ramses/ramsesAudio";

interface RamsesSunbeamGameProps {
  lang: "en" | "es";
  onPlaySfx: (kind: ComicSfxKind) => void;
  onViewBoard: () => void;
  backHref: string;
  backLabel: string;
}

const COPY = {
  en: {
    eyebrow: "PANEL 08 • PLAYABLE FINALE",
    title: "Hold the Sunbeam!",
    subtitle:
      "Move Ramses (mouse, touch, or ← → keys) to bask in the warm golden beam, grab cozy socks & crowns (+25), and dodge freezing snowflakes (-10)!",
    startBtn: "Start 15s Basking Run →",
    replayBtn: "↺ Play Again",
    boardBtn: "⊞ View Full Board",
    scoreLabel: "SOLAR HEAT",
    timeLabel: "TIME",
    bestLabel: "BEST",
    ranks: {
      low: {
        badge: "COLD PEASANT · 19°C",
        note: "Tragic. The radiator has abandoned His Hairless Majesty.",
      },
      mid: {
        badge: "RADIATOR DUKE · 27°C",
        note: "Respectable toastiness. The coffee mug trembles in fear.",
      },
      high: {
        badge: "SUPREME SUN-GOD · 35°C",
        note: "Pure cosmic bliss! All humans in the apartment must bow.",
      },
    },
  },
  es: {
    eyebrow: "VIÑETA 08 • FINAL JUGABLE",
    title: "¡Caza el Rayo de Sol!",
    subtitle:
      "Mueve a Ramses (ratón, tacto o flechas ← →) dentro del rayo dorado, atrapa medias calientes y coronas (+25) y esquiva copos helados (-10).",
    startBtn: "¡Jugar Ronda de 15s! →",
    replayBtn: "↺ Jugar Otra Vez",
    boardBtn: "⊞ Ver Tablero Completo",
    scoreLabel: "CALOR SOLAR",
    timeLabel: "TIEMPO",
    bestLabel: "RÉCORD",
    ranks: {
      low: {
        badge: "PLEBEYO TIBIO · 19°C",
        note: "Tragedia total. El radiador ha traicionado a Su Majestad Pelona.",
      },
      mid: {
        badge: "DUQUE DEL RADIADOR · 27°C",
        note: "Nivel respetable de siesta. La taza de café ya tiembla de miedo.",
      },
      high: {
        badge: "DIOS SOLAR SUPREMO · 35°C",
        note: "¡Éxtasis térmico absoluto! Todo humano del apartamento debe rendirse.",
      },
    },
  },
} as const;

interface FallingDrop {
  x: number;
  y: number;
  vy: number;
  rot: number;
  vRot: number;
  kind: "crown" | "sock" | "flake";
}

interface ConfettiDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

export default function RamsesSunbeamGame({
  lang,
  onPlaySfx,
  onViewBoard,
  backHref,
  backLabel,
}: RamsesSunbeamGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeImgRef = useRef<HTMLImageElement | null>(null);
  const sfxRef = useRef(onPlaySfx);
  sfxRef.current = onPlaySfx;

  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [bestScore, setBestScore] = useState(0);

  const c = COPY[lang];

  useEffect(() => {
    const img = new Image();
    img.src = "/images/ramses/ramses-badge.png";
    img.onload = () => {
      badgeImgRef.current = img;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 720;
    const H = 390;
    let rafId = 0;
    let lastTs = performance.now();

    let playerX = W * 0.5;
    let targetX = W * 0.5;
    let sunX = W * 0.5;
    let sunDir = 1;
    let sunSpeed = 128;
    let curScore = 0;
    let remainSec = 15.0;
    let spawnClock = 0;
    let beamAccum = 0;
    let shiverMs = 0;
    let keyDir = 0;
    const drops: FallingDrop[] = [];
    const confetti: ConfettiDot[] = [];

    const clampPlayer = (x: number) => Math.max(54, Math.min(W - 54, x));

    const handlePointerMove = (e: PointerEvent) => {
      if (phase !== "playing") return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * W;
      targetX = clampPlayer(nx);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keyDir = -1;
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D")
        keyDir = 1;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "a" ||
        e.key === "A" ||
        e.key === "d" ||
        e.key === "D"
      ) {
        keyDir = 0;
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const spawnDrop = () => {
      const r = Math.random();
      const kind: FallingDrop["kind"] =
        r < 0.28 ? "crown" : r < 0.60 ? "sock" : "flake";
      drops.push({
        x: 56 + Math.random() * (W - 112),
        y: -26,
        vy: kind === "flake" ? 165 + Math.random() * 85 : 130 + Math.random() * 65,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 3.2,
        kind,
      });
    };

    const seedConfetti = () => {
      const palette = ["#FFE14D", "#F894C0", "#7E7EFF", "#161420"];
      for (let i = 0; i < 42; i += 1) {
        const ang = (i / 42) * Math.PI * 2;
        const spd = 90 + Math.random() * 210;
        confetti.push({
          x: W * 0.5,
          y: H * 0.45,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 95,
          color: palette[i % palette.length],
          size: 5 + Math.random() * 6,
        });
      }
    };

    if (phase === "done") {
      seedConfetti();
    }

    const drawCrown = (x: number, y: number, r: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(r * 0.35);
      ctx.beginPath();
      ctx.moveTo(-16, 10);
      ctx.lineTo(-18, -10);
      ctx.lineTo(-7, 0);
      ctx.lineTo(0, -14);
      ctx.lineTo(7, 0);
      ctx.lineTo(18, -10);
      ctx.lineTo(16, 10);
      ctx.closePath();
      ctx.fillStyle = "#FFE14D";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#161420";
      ctx.stroke();
      ctx.restore();
    };

    const drawSock = (x: number, y: number, r: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(r * 0.3);
      ctx.fillStyle = "#F894C0";
      ctx.strokeStyle = "#161420";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-8, -15, 16, 20, 4);
      ctx.roundRect(-8, 0, 22, 12, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#7E7EFF";
      ctx.fillRect(-7, -14, 14, 5);
      ctx.restore();
    };

    const drawFlake = (x: number, y: number, r: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(r);
      ctx.strokeStyle = "#161420";
      ctx.lineWidth = 5;
      for (let i = 0; i < 3; i += 1) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(-14, 0);
        ctx.lineTo(14, 0);
        ctx.stroke();
      }
      ctx.strokeStyle = "#9CE6FF";
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 3; i += 1) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(-13, 0);
        ctx.lineTo(13, 0);
        ctx.stroke();
      }
      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;

      // Update game simulation while playing
      if (phase === "playing") {
        remainSec = Math.max(0, remainSec - dt);
        setTimeLeft(Math.ceil(remainSec));

        if (keyDir !== 0) {
          targetX = clampPlayer(targetX + keyDir * 440 * dt);
        }
        playerX += (targetX - playerX) * Math.min(1, dt * 16);

        // Drift sunbeam gently with direction reverses
        sunSpeed = 126 + Math.sin(now * 0.0017) * 58;
        sunX += sunDir * sunSpeed * dt;
        if (sunX > W - 110) {
          sunX = W - 110;
          sunDir = -1;
        } else if (sunX < 110) {
          sunX = 110;
          sunDir = 1;
        }

        const inBeam = Math.abs(playerX - sunX) < 84;
        if (inBeam) {
          beamAccum += dt * 48;
          if (beamAccum >= 1) {
            const pts = Math.floor(beamAccum);
            beamAccum -= pts;
            curScore += pts;
            setScore(curScore);
          }
        }

        spawnClock += dt;
        if (spawnClock > 0.62) {
          spawnClock = 0;
          spawnDrop();
        }

        for (let i = drops.length - 1; i >= 0; i -= 1) {
          const d = drops[i];
          d.y += d.vy * dt;
          d.rot += d.vRot * dt;
          const hit = Math.hypot(d.x - playerX, d.y - (H - 82)) < 50;
          if (hit) {
            if (d.kind === "flake") {
              curScore = Math.max(0, curScore - 10);
              shiverMs = 260;
              sfxRef.current("crash");
            } else {
              curScore += 25;
              sfxRef.current("pop");
            }
            setScore(curScore);
            drops.splice(i, 1);
            continue;
          }
          if (d.y > H + 30) {
            drops.splice(i, 1);
          }
        }

        if (shiverMs > 0) shiverMs = Math.max(0, shiverMs - dt * 1000);

        if (remainSec <= 0) {
          setBestScore((prev) => Math.max(prev, curScore));
          sfxRef.current("ascend");
          setPhase("done");
        }
      } else {
        // Gentle idle sunbeam sway
        sunX = W * 0.5 + Math.sin(now * 0.0012) * 140;
        playerX += (sunX - playerX) * Math.min(1, dt * 3);
      }

      // Render graphic-novel apartment floor stage
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#FAF8F4";
      ctx.fillRect(0, 0, W, H);

      // Subtle striped rug (#7E7EFF + #F894C0) along bottom
      const floorY = H - 62;
      ctx.fillStyle = "#7E7EFF";
      ctx.fillRect(0, floorY, W, 62);
      ctx.fillStyle = "#F894C0";
      for (let x = -20; x < W + 40; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, floorY);
        ctx.lineTo(x + 40, floorY);
        ctx.lineTo(x + 22, H);
        ctx.lineTo(x - 18, H);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = "#161420";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(W, floorY);
      ctx.stroke();

      // Golden diagonal sunbeam sweeping across floor
      const topLeft = sunX - 58;
      const topRight = sunX + 58;
      const botLeft = sunX - 95;
      const botRight = sunX + 95;
      ctx.save();
      ctx.fillStyle = "rgba(255, 225, 77, 0.52)";
      ctx.beginPath();
      ctx.moveTo(topLeft, 0);
      ctx.lineTo(topRight, 0);
      ctx.lineTo(botRight, H);
      ctx.lineTo(botLeft, H);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#161420";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Floor basking oval inside beam
      ctx.fillStyle = "#FFE14D";
      ctx.beginPath();
      ctx.ellipse(sunX, floorY + 20, 86, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Falling collectibles & flakes
      for (const d of drops) {
        if (d.kind === "crown") drawCrown(d.x, d.y, d.rot);
        else if (d.kind === "sock") drawSock(d.x, d.y, d.rot);
        else drawFlake(d.x, d.y, d.rot);
      }

      // Draw Ramses mascot sprite with warm glow when in beam or shivering
      const inBeamNow = Math.abs(playerX - sunX) < 84;
      const shakeX = shiverMs > 0 ? Math.sin(now * 0.09) * 6 : 0;
      const bobY = inBeamNow ? Math.sin(now * 0.012) * 4 : 0;
      const rx = playerX + shakeX;
      const ry = H - 84 + bobY;

      if (inBeamNow) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 225, 77, 0.45)";
        ctx.beginPath();
        ctx.arc(rx, ry, 54, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (badgeImgRef.current) {
        ctx.save();
        ctx.translate(rx, ry);
        const tilt = Math.max(-0.18, Math.min(0.18, (targetX - playerX) * 0.005));
        ctx.rotate(tilt);
        ctx.drawImage(badgeImgRef.current, -46, -46, 92, 92);
        ctx.restore();
      } else {
        ctx.fillStyle = "#F9C7B8";
        ctx.strokeStyle = "#161420";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(rx, ry, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Confetti when round complete
      for (const p of confetti) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 260 * dt;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size * 0.7);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [phase]);

  const startRun = () => {
    setScore(0);
    setTimeLeft(15);
    setPhase("playing");
    onPlaySfx("sunbeam");
  };

  const rank =
    score >= 300 ? c.ranks.high : score >= 140 ? c.ranks.mid : c.ranks.low;

  return (
    <div className="rm-game-card">
      <div className="rm-game-head">
        <div>
          <p className="rm-game-eyebrow">{c.eyebrow}</p>
          <h2 className="rm-game-title">{c.title}</h2>
        </div>

        <div className="rm-game-stats">
          <div className="rm-stat-pill is-gold">
            <span>{c.scoreLabel}</span>
            <strong>{score}</strong>
          </div>
          <div className="rm-stat-pill">
            <span>{c.timeLabel}</span>
            <strong>{timeLeft}s</strong>
          </div>
          {bestScore > 0 ? (
            <div className="rm-stat-pill is-pink">
              <span>{c.bestLabel}</span>
              <strong>{bestScore}</strong>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rm-game-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={720}
          height={390}
          className="rm-game-canvas"
        />

        {phase === "idle" ? (
          <div className="rm-game-overlay">
            <p className="rm-game-desc">{c.subtitle}</p>
            <button
              type="button"
              className="rm-comic-btn is-gold"
              onClick={startRun}
            >
              {c.startBtn}
            </button>
          </div>
        ) : null}

        {phase === "done" ? (
          <div className="rm-game-overlay is-done">
            <span className="rm-rank-badge">{rank.badge}</span>
            <p className="rm-game-desc">{rank.note}</p>
            <div className="rm-game-actions">
              <button
                type="button"
                className="rm-comic-btn is-gold"
                onClick={startRun}
              >
                {c.replayBtn}
              </button>
              <button
                type="button"
                className="rm-comic-btn is-pink"
                onClick={onViewBoard}
              >
                {c.boardBtn}
              </button>
              <Link href={backHref} className="rm-comic-btn is-ink">
                {backLabel}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
