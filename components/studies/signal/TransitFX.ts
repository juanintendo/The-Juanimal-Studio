export function runPixelBlockTransit(
  canvas: HTMLCanvasElement,
  leavingEl: HTMLElement | null,
  originX: number,
  originY: number,
  reverse = false,
  reduced = false
): Promise<void> {
  if (reduced) {
    if (leavingEl) leavingEl.style.clipPath = "";
    return Promise.resolve();
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve();

  const w = window.innerWidth || 1440;
  const h = window.innerHeight || 900;
  canvas.width = w;
  canvas.height = h;
  canvas.classList.add("on");

  const cell = w <= 760 ? 11 : 15;
  const duration = w <= 760 ? 520 : 620;
  const lead = 0.05;
  const trail = 0.035;

  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const total = cols * rows;
  const thresh = new Float32Array(total);
  const rnd = new Float32Array(total);

  let maxDist = 1;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const d = Math.hypot(c * cell + cell * 0.5 - originX, r * cell + cell * 0.5 - originY);
      if (d > maxDist) maxDist = d;
    }
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const idx = r * cols + c;
      const rv = Math.random();
      rnd[idx] = rv;
      const distNorm =
        Math.hypot(c * cell + cell * 0.5 - originX, r * cell + cell * 0.5 - originY) /
        maxDist;
      thresh[idx] = (reverse ? 1 - distNorm : distNorm) * 0.8 + rv * 0.1;
    }
  }

  const start = performance.now();

  return new Promise<void>((resolve) => {
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration) * (1 + lead + trail);
      ctx.clearRect(0, 0, w, h);

      let pathD = "";
      for (let r = 0; r < rows; r += 1) {
        let runStart = -1;
        for (let c = 0; c <= cols; c += 1) {
          const idx = r * cols + c;
          const b = c < cols ? p - thresh[idx] : 1;
          if (b <= 0 && c < cols) {
            if (runStart < 0) runStart = c;
          } else if (runStart >= 0) {
            const x0 = runStart * cell;
            const y0 = r * cell;
            const rw = (c - runStart) * cell;
            pathD += `M${x0} ${y0}h${rw}v${cell}h-${rw}z`;
            runStart = -1;
          }

          if (c === cols) break;
          const px = c * cell;
          const py = r * cell;
          if (b > -lead && b <= 0) {
            const rv = rnd[idx];
            ctx.fillStyle =
              rv > 0.84
                ? "#ff2a1f"
                : rv > 0.3
                ? "#f4f1ea"
                : "rgba(244, 241, 234, 0.55)";
            ctx.fillRect(px + 1, py + 1, cell - 2, cell - 2);
          } else if (b > 0 && b < trail) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(px, py, cell, cell);
          }
        }
      }

      if (leavingEl) {
        leavingEl.style.clipPath = pathD ? `path('${pathD}')` : "inset(50%)";
      }

      if (p < 1 + lead + trail) {
        requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, w, h);
        canvas.classList.remove("on");
        if (leavingEl) leavingEl.style.clipPath = "";
        resolve();
      }
    };

    requestAnimationFrame(step);
  });
}
