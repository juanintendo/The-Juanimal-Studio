import * as THREE from "three";

export const KANZEN_STICKER_URLS: string[] = [
  "/images/gallery/kanzen-toys/v2-can-matte.webp",
  "/images/gallery/kanzen-toys/v2-can-chrome.webp",
  "/images/gallery/kanzen-toys/v2-can-fat.webp",
  "/images/gallery/kanzen-toys/v2-cap-pinkdot.webp",
  "/images/gallery/kanzen-toys/v2-cap-skinny.webp",
  "/images/gallery/kanzen-toys/v2-cap-outline.webp",
  "/images/gallery/kanzen-toys/v2-cap-nyfat.webp",
  "/images/gallery/kanzen-toys/v2-cap-fat.webp",
  "/images/gallery/kanzen-toys/v2-cap-calli.webp",
  "/images/gallery/kanzen-toys/v2-mop.webp",
  "/images/gallery/kanzen-toys/v2-marker.webp",
  "/images/gallery/kanzen-toys/v2-book.webp",
  "/images/gallery/kanzen-toys/v2-mask.webp",
  "/images/gallery/kanzen-toys/v1-can-fat.webp",
  "/images/gallery/kanzen-toys/v1-mask.webp",
  "/images/gallery/kanzen-toys/v1-can-chrome.webp",
  "/images/gallery/kanzen-toys/v1-cap-nyfat.webp",
  "/images/gallery/kanzen-toys/v1-mop.webp",
];

interface ToyBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  angle: number;
  va: number;
  delay: number;
  spawned: boolean;
  img: HTMLImageElement | null;
}

export interface KanzenPosterPhysics {
  texture: THREE.CanvasTexture;
  update: (
    dt: number,
    hitX: number,
    hitY: number,
    isHovering: boolean,
    reduced: boolean
  ) => void;
  nudge: () => void;
  dispose: () => void;
}

const W = 768;
const H = 1152;
const GRAVITY = 1420;
const MAX_SPIN = 2.6;
const PTR_RADIUS = 64;

export function createKanzenPosterPhysics(
  posterSrc: string,
  stickerUrls: string[] = KANZEN_STICKER_URLS
): KanzenPosterPhysics {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.NoColorSpace;

  let posterImg: HTMLImageElement | null = null;
  let posterLoaded = false;
  let disposed = false;

  const pImg = new Image();
  pImg.crossOrigin = "anonymous";
  pImg.onload = () => {
    if (disposed) return;
    posterImg = pImg;
    posterLoaded = true;
    drawFrame();
  };
  pImg.src = posterSrc;

  const bodies: ToyBody[] = stickerUrls.map((url, idx) => {
    const r = 46 + ((idx * 7) % 15);
    const lane = ((idx * 137) % 100) / 100;
    const body: ToyBody = {
      x: W * (0.18 + lane * 0.64),
      y: -70 - idx * 14,
      vx: (idx % 2 === 0 ? 1 : -1) * (30 + (idx % 5) * 14),
      vy: 60 + (idx % 4) * 30,
      r,
      angle: ((idx % 7) - 3) * 0.1,
      va: (idx % 2 === 0 ? 1 : -1) * 0.45,
      delay: idx * 0.08,
      spawned: false,
      img: null,
    };

    const sImg = new Image();
    sImg.crossOrigin = "anonymous";
    sImg.onload = () => {
      if (!disposed) body.img = sImg;
    };
    sImg.src = url;
    return body;
  });

  let elapsed = 0;
  let prevPtrX: number | null = null;
  let prevPtrY: number | null = null;
  let staticDrawn = false;

  function constrainWalls(b: ToyBody) {
    const floorY = H - 16;
    if (b.y + b.r > floorY) {
      b.y = floorY - b.r;
      if (Math.abs(b.vy) > 45) {
        b.vy = -b.vy * 0.22;
      } else {
        b.vy = 0;
      }
      b.vx *= 0.84;
      b.va *= 0.72;
    }

    // Left & right sloped urban wall ramps in bottom 30%
    if (b.y > H * 0.68) {
      const t = (b.y - H * 0.68) / (H * 0.32);
      const minX = 18 + t * 145;
      const maxX = W - 18 - t * 145;
      if (b.x - b.r < minX) {
        b.x = minX + b.r;
        b.vx = Math.abs(b.vx) * 0.35 + 22;
        b.va *= 0.72;
      } else if (b.x + b.r > maxX) {
        b.x = maxX - b.r;
        b.vx = -Math.abs(b.vx) * 0.35 - 22;
        b.va *= 0.72;
      }
    } else {
      if (b.x - b.r < 14) {
        b.x = 14 + b.r;
        b.vx = Math.abs(b.vx) * 0.32;
        b.va *= 0.72;
      } else if (b.x + b.r > W - 14) {
        b.x = W - 14 - b.r;
        b.vx = -Math.abs(b.vx) * 0.32;
        b.va *= 0.72;
      }
    }
  }

  function solveCollisions() {
    for (let iter = 0; iter < 3; iter++) {
      for (let i = 0; i < bodies.length; i++) {
        const a = bodies[i];
        if (!a.spawned) continue;
        for (let j = i + 1; j < bodies.length; j++) {
          const b = bodies[j];
          if (!b.spawned) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;
          const minDist = (a.r + b.r) * 0.86;
          if (distSq < minDist * minDist && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = (minDist - dist) * 0.5;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;

            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const sepVel = rvx * nx + rvy * ny;
            if (sepVel < 0) {
              const impulse = -(1 + 0.22) * sepVel * 0.5;
              a.vx -= impulse * nx;
              a.vy -= impulse * ny;
              b.vx += impulse * nx;
              b.vy += impulse * ny;

              if (iter === 0 && Math.abs(sepVel) > 40) {
                const tang = (-rvx * ny + rvy * nx) * 0.0006;
                a.va = THREE.MathUtils.clamp(a.va - tang, -MAX_SPIN, MAX_SPIN);
                b.va = THREE.MathUtils.clamp(b.va + tang, -MAX_SPIN, MAX_SPIN);
              }
            }
          }
        }
        constrainWalls(a);
      }
    }
  }

  function drawFrame() {
    if (disposed) return;
    ctx.clearRect(0, 0, W, H);
    if (posterLoaded && posterImg) {
      ctx.drawImage(posterImg, 0, 0, W, H);
    } else {
      ctx.fillStyle = "#e9e6df";
      ctx.fillRect(0, 0, W, H);
    }

    for (const b of bodies) {
      if (!b.spawned || !b.img) continue;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);
      const drawSize = b.r * 2.18;
      ctx.shadowColor = "rgba(14, 14, 13, 0.24)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.drawImage(b.img, -drawSize * 0.5, -drawSize * 0.5, drawSize, drawSize);
      ctx.restore();
    }

    texture.needsUpdate = true;
  }

  function settleStatic() {
    if (staticDrawn) return;
    bodies.forEach((b, idx) => {
      b.spawned = true;
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      b.x = W * (0.22 + col * 0.14);
      b.y = H - 72 - row * 78;
      b.vx = 0;
      b.vy = 0;
      b.va = 0;
    });
    solveCollisions();
    drawFrame();
    staticDrawn = true;
  }

  function update(
    dt: number,
    hitX: number,
    hitY: number,
    isHovering: boolean,
    reduced: boolean
  ) {
    if (disposed) return;
    if (reduced) {
      settleStatic();
      return;
    }

    const step = Math.min(dt, 0.033);
    elapsed += step;

    let ptrX: number | null = null;
    let ptrY: number | null = null;
    let pvx = 0;
    let pvy = 0;

    if (isHovering) {
      ptrX = (hitX + 0.5) * W;
      ptrY = (0.5 - hitY) * H;
      if (prevPtrX !== null && prevPtrY !== null && step > 0.001) {
        pvx = THREE.MathUtils.clamp((ptrX - prevPtrX) / step, -2200, 2200);
        pvy = THREE.MathUtils.clamp((ptrY - prevPtrY) / step, -2200, 2200);
      }
      prevPtrX = ptrX;
      prevPtrY = ptrY;
    } else {
      prevPtrX = null;
      prevPtrY = null;
    }

    for (const b of bodies) {
      if (!b.spawned) {
        if (elapsed >= b.delay) {
          b.spawned = true;
        } else {
          continue;
        }
      }

      b.vy += GRAVITY * step;
      b.vx *= 0.985;
      b.va *= 0.9;
      if (Math.abs(b.va) < 0.05) b.va = 0;

      // Solid circular bumper collision on mouseover
      if (ptrX !== null && ptrY !== null) {
        const dx = b.x - ptrX;
        const dy = b.y - ptrY;
        const dist = Math.hypot(dx, dy);
        const minReach = b.r + PTR_RADIUS;
        if (dist < minReach && dist > 0.01) {
          const nx = dx / dist;
          const ny = dy / dist;
          const push = minReach - dist;
          b.x += nx * push * 0.65;
          b.y += ny * push * 0.65;
          b.vx += nx * 340 + pvx * 0.42;
          b.vy += ny * 340 + pvy * 0.42 - 140;
          b.va = THREE.MathUtils.clamp(
            b.va + (nx > 0 ? 1.4 : -1.4),
            -MAX_SPIN,
            MAX_SPIN
          );
        }
      }

      b.x += b.vx * step;
      b.y += b.vy * step;
      b.va = THREE.MathUtils.clamp(b.va, -MAX_SPIN, MAX_SPIN);
      b.angle += b.va * step;

      if (Math.abs(b.vx) < 8 && Math.abs(b.vy) < 12) {
        b.vx *= 0.78;
        b.va *= 0.7;
      }
    }

    solveCollisions();
    drawFrame();
  }

  function nudge() {
    for (const b of bodies) {
      if (!b.spawned) continue;
      b.vy -= 220 + Math.random() * 200;
      b.vx += (Math.random() - 0.5) * 240;
      b.va = THREE.MathUtils.clamp(
        b.va + (Math.random() - 0.5) * 2.2,
        -MAX_SPIN,
        MAX_SPIN
      );
    }
  }

  function dispose() {
    disposed = true;
    texture.dispose();
  }

  return { texture, update, nudge, dispose };
}
