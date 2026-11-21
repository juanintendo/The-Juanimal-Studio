"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface VoyagerSpreadSpec {
  id: string;
  image: string;
  navLabel: Record<"en" | "es", string>;
  thumbPos: string;
  title: Record<"en" | "es", string>;
  displayTop: Record<"en" | "es", string>;
  displayMain: Record<"en" | "es", string>;
  story: Record<"en" | "es", string>;
  macaFact: Record<"en" | "es", string>;
  parentPrompt: Record<"en" | "es", string>;
  accentColor: string;
  lightPaper?: boolean;
  textSide: "left" | "right";
  textAnchor: {
    x: number;
    y: number;
    align: "left" | "center" | "right";
  };
}

interface VoyagerBook3DProps {
  page: number; // 0 = front cover, 1..spreads.length = spread, spreads.length + 1 = back cover
  onChangePage: (nextPage: number) => void;
  lang: "en" | "es";
  reduced: boolean;
  gyroActive?: boolean;
  spreads: VoyagerSpreadSpec[];
  coverImage: string;
  backCoverImage: string;
  coverTopLine: string;
  coverMainTitle: string;
  coverTagline: string;
  backColophon: string;
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radii: [number, number, number, number]
) {
  const [tl, tr, br, bl] = radii;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  if (tr > 0) ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  else ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h - br);
  if (br > 0) ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  else ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + bl, y + h);
  if (bl > 0) ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  else ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + tl);
  if (tl > 0) ctx.quadraticCurveTo(x, y, x + tl, y);
  else ctx.lineTo(x, y);
  ctx.closePath();
}

function createCornerAlphaTexture(outerSide: "left" | "right"): THREE.CanvasTexture {
  const size = 512;
  const radius = 56;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#ffffff";
    const radii: [number, number, number, number] =
      outerSide === "right" ? [0, radius, radius, 0] : [radius, 0, 0, radius];
    drawRoundedRectPath(ctx, 0, 0, size, size, radii);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

function createDeskShadowTexture(): THREE.CanvasTexture {
  const w = 1024;
  const h = 640;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createRadialGradient(
      w * 0.5,
      h * 0.52,
      w * 0.14,
      w * 0.5,
      h * 0.52,
      w * 0.49
    );
    grad.addColorStop(0, "rgba(4, 6, 15, 0.72)");
    grad.addColorStop(0.55, "rgba(4, 6, 15, 0.42)");
    grad.addColorStop(1, "rgba(4, 6, 15, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const paragraphs = text.split("\n");
  const lines: string[] = [];
  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;
    let current = words[0];
    for (let i = 1; i < words.length; i += 1) {
      const candidate = `${current} ${words[i]}`;
      if (ctx.measureText(candidate).width <= maxWidth) {
        current = candidate;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
  }
  return lines;
}

function addPaperTextureNoise(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  alpha = 0.025
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let i = 0; i < 1600; i += 1) {
    const x = (i * 97.3) % w;
    const y = (i * 53.7) % h;
    ctx.fillStyle = i % 2 === 0 ? "#241914" : "#fffbf0";
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.restore();
}

function paintFrontCoverCanvas(
  img: HTMLImageElement,
  topLine: string,
  mainTitle: string,
  tagline: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1164;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const iw = img.naturalWidth || 896;
  const ih = img.naturalHeight || 1200;
  const trimX = Math.round(iw * 0.036);
  const trimY = Math.round(ih * 0.034);
  ctx.drawImage(
    img,
    trimX,
    trimY,
    iw - trimX * 2,
    ih - trimY * 2,
    0,
    0,
    1024,
    1164
  );

  const topGrad = ctx.createLinearGradient(0, 0, 0, 440);
  topGrad.addColorStop(0, "rgba(15, 19, 43, 0.86)");
  topGrad.addColorStop(0.55, "rgba(15, 19, 43, 0.42)");
  topGrad.addColorStop(1, "rgba(15, 19, 43, 0)");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 1024, 440);

  const botGrad = ctx.createLinearGradient(0, 910, 0, 1164);
  botGrad.addColorStop(0, "rgba(15, 19, 43, 0)");
  botGrad.addColorStop(0.55, "rgba(15, 19, 43, 0.62)");
  botGrad.addColorStop(1, "rgba(15, 19, 43, 0.90)");
  ctx.fillStyle = botGrad;
  ctx.fillRect(0, 910, 1024, 254);

  const spineGrad = ctx.createLinearGradient(0, 0, 34, 0);
  spineGrad.addColorStop(0, "rgba(255, 240, 210, 0.28)");
  spineGrad.addColorStop(0.32, "rgba(9, 11, 24, 0.46)");
  spineGrad.addColorStop(1, "rgba(9, 11, 24, 0)");
  ctx.fillStyle = spineGrad;
  ctx.fillRect(0, 0, 34, 1164);

  ctx.textAlign = "center";
  ctx.save();
  ctx.translate(520, 96);
  ctx.rotate(-0.015);
  ctx.font = '700 32px "Patrick Hand", "Comic Sans MS", cursive';
  ctx.fillStyle = "#FFD166";
  ctx.fillText(topLine.toUpperCase(), 0, 0);
  ctx.restore();

  ctx.save();
  ctx.font = '700 108px "Caveat Brush", "Fraunces", Georgia, serif';
  const titleLines = wrapLines(ctx, mainTitle, 840);
  let ty = 204;
  for (const line of titleLines) {
    ctx.fillStyle = "rgba(8, 10, 24, 0.72)";
    ctx.fillText(line, 520 + 5, ty + 6);
    ctx.lineWidth = 6;
    ctx.strokeStyle = "rgba(21, 18, 42, 0.75)";
    ctx.strokeText(line, 520, ty);
    ctx.fillStyle = "#F4A236";
    ctx.fillText(line, 520 + 1.5, ty + 2);
    ctx.fillStyle = "#FFF7E6";
    ctx.fillText(line, 520, ty);
    ty += 108;
  }

  ctx.strokeStyle = "#E84A3A";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(300, ty - 72);
  ctx.quadraticCurveTo(520, ty - 56, 740, ty - 74);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(255, 247, 230, 0.94)";
  ctx.font = '600 30px "Fraunces", Georgia, serif';
  ctx.fillText(tagline, 520, 1068);
  ctx.restore();

  addPaperTextureNoise(ctx, 1024, 1164, 0.03);
  return canvas;
}

function paintBackCoverCanvas(
  img: HTMLImageElement,
  colophon: string
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1164;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const iw = img.naturalWidth || 896;
  const ih = img.naturalHeight || 1200;
  const trimX = Math.round(iw * 0.036);
  const trimY = Math.round(ih * 0.034);
  ctx.drawImage(
    img,
    trimX,
    trimY,
    iw - trimX * 2,
    ih - trimY * 2,
    0,
    0,
    1024,
    1164
  );

  const spineGrad = ctx.createLinearGradient(990, 0, 1024, 0);
  spineGrad.addColorStop(0, "rgba(9, 11, 24, 0)");
  spineGrad.addColorStop(0.7, "rgba(9, 11, 24, 0.44)");
  spineGrad.addColorStop(1, "rgba(255, 240, 210, 0.25)");
  ctx.fillStyle = spineGrad;
  ctx.fillRect(990, 0, 34, 1164);

  ctx.save();
  drawRoundedRectPath(ctx, 96, 868, 832, 184, [24, 24, 24, 24]);
  ctx.fillStyle = "rgba(18, 22, 46, 0.86)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(244, 162, 54, 0.55)";
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.font = '500 28px "Fraunces", Georgia, serif';
  ctx.fillStyle = "#FFF7E6";
  const lines = wrapLines(ctx, colophon, 740);
  let y = 930;
  for (const line of lines.slice(0, 3)) {
    ctx.fillText(line, 512, y);
    y += 40;
  }
  ctx.restore();

  addPaperTextureNoise(ctx, 1024, 1164, 0.025);
  return canvas;
}

function paintHalfSpreadCanvas(
  img: HTMLImageElement,
  side: "left" | "right"
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1164;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const iw = img.naturalWidth || 1376;
  const ih = img.naturalHeight || 768;
  const trimX = Math.round(iw * 0.041);
  const trimY = Math.round(ih * 0.058);
  const trimH = ih - trimY * 2;
  const halfX = Math.floor(iw * 0.5);
  const sx = side === "left" ? trimX : halfX;
  const sw = side === "left" ? halfX - trimX : iw - halfX - trimX;

  ctx.drawImage(img, sx, trimY, sw, trimH, 0, 0, 1024, 1164);

  if (side === "left") {
    const gutter = ctx.createLinearGradient(968, 0, 1024, 0);
    gutter.addColorStop(0, "rgba(18, 13, 10, 0)");
    gutter.addColorStop(0.62, "rgba(18, 13, 10, 0.14)");
    gutter.addColorStop(1, "rgba(14, 10, 8, 0.34)");
    ctx.fillStyle = gutter;
    ctx.fillRect(968, 0, 56, 1164);

    ctx.fillStyle = "rgba(255, 250, 238, 0.18)";
    ctx.fillRect(1022, 0, 2, 1164);
  } else {
    const gutter = ctx.createLinearGradient(0, 0, 56, 0);
    gutter.addColorStop(0, "rgba(14, 10, 8, 0.34)");
    gutter.addColorStop(0.38, "rgba(18, 13, 10, 0.14)");
    gutter.addColorStop(1, "rgba(18, 13, 10, 0)");
    ctx.fillStyle = gutter;
    ctx.fillRect(0, 0, 56, 1164);

    ctx.fillStyle = "rgba(255, 250, 238, 0.18)";
    ctx.fillRect(0, 0, 2, 1164);
  }

  return canvas;
}

function getZoneBounds(side: "left" | "right", spread: VoyagerSpreadSpec) {
  const W = 2048;
  const H = 1164;
  const padX = side === "left" ? 86 : 1094;
  const maxRight = side === "left" ? 950 : 1962;
  const zoneW = maxRight - padX;
  const anchorX = Math.max(padX + 16, Math.min(maxRight - 16, spread.textAnchor.x * W));
  const anchorY = Math.max(94, Math.min(H - 390, spread.textAnchor.y * H));
  return { W, H, padX, maxRight, zoneW, anchorX, anchorY };
}

function drawSpreadParallaxDisplay(
  canvas: HTMLCanvasElement,
  spread: VoyagerSpreadSpec,
  lang: "en" | "es"
) {
  canvas.width = 2048;
  canvas.height = 1164;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { padX, maxRight, zoneW, anchorX, anchorY } = getZoneBounds(
    spread.textSide,
    spread
  );
  const align = spread.textAnchor.align;
  const drawX =
    align === "center"
      ? (padX + maxRight) * 0.5
      : align === "right"
        ? maxRight
        : anchorX;
  const isLight = Boolean(spread.lightPaper);

  ctx.save();
  ctx.textAlign = align;
  ctx.textBaseline = "top";

  ctx.save();
  ctx.translate(drawX, anchorY - 46);
  ctx.rotate(-0.025);
  ctx.font = '700 36px "Patrick Hand", "Comic Sans MS", cursive';
  ctx.lineWidth = isLight ? 7 : 8;
  ctx.strokeStyle = isLight ? "rgba(255, 249, 235, 0.94)" : "rgba(13, 17, 38, 0.88)";
  ctx.strokeText(spread.displayTop[lang], 0, 0);
  ctx.fillStyle = isLight ? "#D93D2D" : spread.accentColor || "#FFD166";
  ctx.fillText(spread.displayTop[lang], 0, 0);
  ctx.restore();

  ctx.font = '700 72px "Caveat Brush", "Fraunces", Georgia, serif';
  const mainLines = wrapLines(ctx, spread.displayMain[lang], zoneW * 0.94);
  let y = anchorY;
  for (const line of mainLines.slice(0, 3)) {
    ctx.fillStyle = isLight ? "rgba(255, 248, 232, 0.72)" : "rgba(11, 14, 30, 0.55)";
    ctx.fillText(line, drawX + 4, y + 5);
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.strokeStyle = isLight ? "rgba(255, 248, 232, 0.92)" : "rgba(15, 19, 43, 0.86)";
    ctx.strokeText(line, drawX, y);
    ctx.fillStyle = spread.accentColor || "#F4A236";
    ctx.fillText(line, drawX + 2, y + 2);
    ctx.fillStyle = isLight ? "#182046" : "#FFF7E6";
    ctx.fillText(line, drawX, y);
    y += 74;
  }

  const measureW = Math.min(
    zoneW * 0.72,
    Math.max(200, ctx.measureText(mainLines[0] || "").width * 0.86)
  );
  const ulStart =
    align === "center"
      ? drawX - measureW * 0.5
      : align === "right"
        ? drawX - measureW
        : drawX;
  ctx.strokeStyle = spread.accentColor || "#FFD166";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(ulStart, y - 4);
  ctx.quadraticCurveTo(ulStart + measureW * 0.5, y + 10, ulStart + measureW, y - 6);
  ctx.stroke();

  ctx.restore();
}

function drawCrayonStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.2;
  ctx.lineCap = "round";
  for (let i = 0; i < 4; i += 1) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * -r, Math.sin(a) * -r);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();
  }
  ctx.fillStyle = "#FFF7E6";
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSpreadParallaxStory(
  canvas: HTMLCanvasElement,
  spread: VoyagerSpreadSpec,
  lang: "en" | "es"
) {
  canvas.width = 2048;
  canvas.height = 1164;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { H, padX, maxRight, zoneW, anchorX, anchorY } = getZoneBounds(
    spread.textSide,
    spread
  );
  const align = spread.textAnchor.align;
  const isLight = Boolean(spread.lightPaper);

  ctx.font = '700 72px "Caveat Brush", "Fraunces", Georgia, serif';
  const mainLines = wrapLines(ctx, spread.displayMain[lang], zoneW * 0.94);
  const headCount = Math.min(3, Math.max(1, mainLines.length));

  ctx.save();
  ctx.font = '600 26px "Fraunces", Georgia, serif';
  const storyMaxW = Math.min(720, zoneW * 0.92);
  const storyLines = wrapLines(ctx, spread.story[lang], storyMaxW).slice(0, 5);
  const lineH = 38;
  const blockH = storyLines.length * lineH + 34;
  const storyTop = Math.min(H - blockH - 46, anchorY + headCount * 74 + 20);

  let actualMaxW = 0;
  for (const l of storyLines) {
    actualMaxW = Math.max(actualMaxW, ctx.measureText(l).width);
  }
  const boxW = Math.min(zoneW, actualMaxW + 48);
  const boxX =
    align === "center"
      ? (padX + maxRight) * 0.5 - boxW * 0.5
      : align === "right"
        ? maxRight - boxW
        : anchorX - 18;
  const textDrawX =
    align === "center"
      ? (padX + maxRight) * 0.5
      : align === "right"
        ? maxRight - 14
        : Math.max(padX, anchorX + 6);

  ctx.save();
  drawRoundedRectPath(ctx, boxX, storyTop - 16, boxW, blockH, [24, 24, 24, 24]);
  ctx.shadowColor = isLight ? "rgba(255, 246, 224, 0.86)" : "rgba(11, 14, 30, 0.72)";
  ctx.shadowBlur = 22;
  ctx.fillStyle = isLight ? "rgba(255, 249, 235, 0.84)" : "rgba(13, 17, 38, 0.68)";
  ctx.fill();
  ctx.restore();

  ctx.textAlign = align;
  ctx.textBaseline = "top";
  ctx.font = '600 26px "Fraunces", Georgia, serif';
  let sy = storyTop + 2;
  for (const line of storyLines) {
    ctx.lineWidth = isLight ? 4 : 5;
    ctx.lineJoin = "round";
    ctx.strokeStyle = isLight ? "rgba(255, 250, 238, 0.9)" : "rgba(11, 14, 30, 0.86)";
    ctx.strokeText(line, textDrawX, sy);
    ctx.fillStyle = isLight ? "#182046" : "#FFF8EC";
    ctx.fillText(line, textDrawX, sy);
    sy += lineH;
  }

  // Floating parallax crayon sparkles scattered around the margins (foreground depth)
  const seedBase = spread.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const sparkles = [
    { x: padX + 36, y: 112, r: 12 },
    { x: maxRight - 42, y: 138, r: 9 },
    { x: padX + zoneW * 0.84, y: storyTop - 36, r: 11 },
    { x: spread.textSide === "left" ? 1860 : 196, y: 144, r: 13 },
    { x: spread.textSide === "left" ? 1910 : 148, y: 980, r: 10 },
  ];
  sparkles.forEach((sp, i) => {
    const jx = ((seedBase * (i + 3)) % 28) - 14;
    const jy = ((seedBase * (i + 7)) % 24) - 12;
    drawCrayonStar(
      ctx,
      sp.x + jx,
      sp.y + jy,
      sp.r,
      i % 2 === 0 ? spread.accentColor : "#98DCE6"
    );
  });

  ctx.restore();
}

export default function VoyagerBook3D({
  page,
  onChangePage,
  lang,
  reduced,
  gyroActive = false,
  spreads,
  coverImage,
  backCoverImage,
  coverTopLine,
  coverMainTitle,
  coverTagline,
  backColophon,
}: VoyagerBook3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetPageRef = useRef(page);
  const langRef = useRef(lang);
  const reducedRef = useRef(reduced);
  const onChangePageRef = useRef(onChangePage);
  const [webglReady, setWebglReady] = useState(true);

  useEffect(() => {
    targetPageRef.current = page;
  }, [page]);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  useEffect(() => {
    onChangePageRef.current = onChangePage;
  }, [onChangePage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setWebglReady(false);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth || 1200, container.clientHeight || 720);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.domElement.className = "vg-canvas";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 720;
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(aspect < 1 ? 46 : 35, aspect, 0.1, 100);
    camera.position.set(0, 0, aspect < 1 ? 11.4 : 8.5);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xfff1dc, 1.32);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 1.48);
    keyLight.position.set(3.2, 4.4, 7.6);
    scene.add(keyLight);

    const warmSpot = new THREE.SpotLight(0xffdfb0, 2.6, 26, Math.PI / 3.4, 0.65, 1.2);
    warmSpot.position.set(-2.2, 2.8, 7.0);
    scene.add(warmSpot);

    const rimLight = new THREE.DirectionalLight(0x88b4ff, 0.42);
    rimLight.position.set(-4.5, -2.5, 4.5);
    scene.add(rimLight);

    // Subtle floating star particles on background depth plane
    const starCount = 130;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 18;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      starPositions[i * 3 + 2] = -3.8 - Math.random() * 4.5;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffe4a3,
      size: 0.048,
      transparent: true,
      opacity: 0.52,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    const bookWrapper = new THREE.Group();
    scene.add(bookWrapper);

    const pageW = 3.45;
    const pageH = 3.92;
    const segX = 28;
    const segY = 6;
    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    // Rounded outer board-book corner masks
    const rightCornerAlpha = createCornerAlphaTexture("right");
    const leftCornerAlpha = createCornerAlphaTexture("left");
    const deskShadowTex = createDeskShadowTexture();

    const deskShadowMat = new THREE.MeshBasicMaterial({
      map: deskShadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.74,
    });
    const deskShadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(pageW * 2.24, pageH * 1.18),
      deskShadowMat
    );
    deskShadowMesh.position.set(0, -0.06, -0.22);
    bookWrapper.add(deskShadowMesh);

    const buildPlaceholderTexture = (tint: string): THREE.CanvasTexture => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const g = c.getContext("2d");
      if (g) {
        g.fillStyle = tint;
        g.fillRect(0, 0, 64, 64);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    interface LeafBundle {
      group: THREE.Group;
      frontGeo: THREE.PlaneGeometry;
      frontBaseX: Float32Array;
      backGeo: THREE.PlaneGeometry;
      backBaseX: Float32Array;
      frontMat: THREE.MeshStandardMaterial;
      backMat: THREE.MeshStandardMaterial;
    }

    const leafCount = spreads.length + 1;
    const leaves: LeafBundle[] = [];

    for (let i = 0; i < leafCount; i += 1) {
      const isHardCover = i === 0 || i === leafCount - 1;
      const frontGeo = new THREE.PlaneGeometry(pageW, pageH, segX, segY);
      frontGeo.translate(pageW * 0.5, 0, 0.0025);
      const fPos = frontGeo.attributes.position;
      const frontBaseX = new Float32Array(fPos.count);
      for (let k = 0; k < fPos.count; k += 1) {
        frontBaseX[k] = fPos.getX(k);
      }

      const backGeo = new THREE.PlaneGeometry(pageW, pageH, segX, segY);
      backGeo.rotateY(Math.PI);
      backGeo.translate(pageW * 0.5, 0, -0.0025);
      const bPos = backGeo.attributes.position;
      const backBaseX = new Float32Array(bPos.count);
      for (let k = 0; k < bPos.count; k += 1) {
        backBaseX[k] = bPos.getX(k);
      }

      const frontMat = new THREE.MeshStandardMaterial({
        map: buildPlaceholderTexture(i === 0 ? "#1C214A" : "#E9DEC8"),
        alphaMap: rightCornerAlpha,
        alphaTest: 0.45,
        roughness: isHardCover ? 0.62 : 0.82,
        metalness: 0.02,
      });

      const backMat = new THREE.MeshStandardMaterial({
        map: buildPlaceholderTexture(i === leafCount - 1 ? "#1A1E44" : "#E9DEC8"),
        alphaMap: leftCornerAlpha,
        alphaTest: 0.45,
        roughness: isHardCover ? 0.62 : 0.82,
        metalness: 0.02,
      });

      const frontMesh = new THREE.Mesh(frontGeo, frontMat);
      const backMesh = new THREE.Mesh(backGeo, backMat);
      const leafGroup = new THREE.Group();
      leafGroup.add(frontMesh);
      leafGroup.add(backMesh);
      bookWrapper.add(leafGroup);

      leaves.push({
        group: leafGroup,
        frontGeo,
        frontBaseX,
        backGeo,
        backBaseX,
        frontMat,
        backMat,
      });
    }

    // Two floating 2.5D parallax overlay planes parented to the book wrapper
    const displayCanvas = document.createElement("canvas");
    displayCanvas.width = 2048;
    displayCanvas.height = 1164;
    const displayTex = new THREE.CanvasTexture(displayCanvas);
    displayTex.colorSpace = THREE.SRGBColorSpace;
    displayTex.minFilter = THREE.LinearFilter;
    displayTex.anisotropy = maxAnisotropy;

    const layerDisplayMat = new THREE.MeshBasicMaterial({
      map: displayTex,
      transparent: true,
      depthWrite: false,
      opacity: 0,
    });
    const layerDisplayMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(pageW * 2, pageH),
      layerDisplayMat
    );
    layerDisplayMesh.position.set(0, 0, 0.21);
    layerDisplayMesh.visible = false;
    bookWrapper.add(layerDisplayMesh);

    const storyCanvas = document.createElement("canvas");
    storyCanvas.width = 2048;
    storyCanvas.height = 1164;
    const storyTex = new THREE.CanvasTexture(storyCanvas);
    storyTex.colorSpace = THREE.SRGBColorSpace;
    storyTex.minFilter = THREE.LinearFilter;
    storyTex.anisotropy = maxAnisotropy;

    const layerStoryMat = new THREE.MeshBasicMaterial({
      map: storyTex,
      transparent: true,
      depthWrite: false,
      opacity: 0,
    });
    const layerStoryMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(pageW * 2, pageH),
      layerStoryMat
    );
    layerStoryMesh.position.set(0, 0, 0.35);
    layerStoryMesh.visible = false;
    bookWrapper.add(layerStoryMesh);

    const makeCanvasTexture = (canvas: HTMLCanvasElement): THREE.CanvasTexture => {
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAnisotropy;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;
      return tex;
    };

    let disposed = false;
    const createdTextures: THREE.Texture[] = [
      rightCornerAlpha,
      leftCornerAlpha,
      deskShadowTex,
      displayTex,
      storyTex,
    ];

    const loadImg = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    // Load cover art immediately
    loadImg(coverImage)
      .then((img) => {
        if (disposed) return;
        const c = paintFrontCoverCanvas(img, coverTopLine, coverMainTitle, coverTagline);
        const tex = makeCanvasTexture(c);
        createdTextures.push(tex);
        leaves[0].frontMat.map = tex;
        leaves[0].frontMat.needsUpdate = true;
      })
      .catch(() => {});

    // Load back cover art onto final leaf's back face so book closes completely
    loadImg(backCoverImage)
      .then((img) => {
        if (disposed) return;
        const c = paintBackCoverCanvas(img, backColophon);
        const tex = makeCanvasTexture(c);
        createdTextures.push(tex);
        leaves[leafCount - 1].backMat.map = tex;
        leaves[leafCount - 1].backMat.needsUpdate = true;
      })
      .catch(() => {});

    // Load all 6 two-page spreads (left half -> leaf i back, right half -> leaf i+1 front)
    spreads.forEach((sp, i) => {
      loadImg(sp.image)
        .then((img) => {
          if (disposed) return;
          const leftC = paintHalfSpreadCanvas(img, "left");
          const rightC = paintHalfSpreadCanvas(img, "right");
          const leftTex = makeCanvasTexture(leftC);
          const rightTex = makeCanvasTexture(rightC);
          createdTextures.push(leftTex, rightTex);
          leaves[i].backMat.map = leftTex;
          leaves[i].backMat.needsUpdate = true;
          leaves[i + 1].frontMat.map = rightTex;
          leaves[i + 1].frontMat.needsUpdate = true;
        })
        .catch(() => {});
    });

    const bendGeometry = (
      geo: THREE.PlaneGeometry,
      baseX: Float32Array,
      baseZ: number,
      progress: number
    ) => {
      const pos = geo.attributes.position;
      const bow = Math.sin(progress * Math.PI);
      for (let i = 0; i < pos.count; i += 1) {
        const bx = baseX[i];
        const ratio = bx / pageW;
        const gutterLift = Math.sin(Math.min(1, ratio * 2.5) * Math.PI) * 0.042;
        const curlAngle = bow * (0.38 * ratio * ratio);
        const arcR = bx;
        const rx = curlAngle > 0.001 ? arcR * Math.cos(curlAngle) : bx;
        const rz =
          baseZ +
          gutterLift * (1 - bow * 0.65) +
          (curlAngle > 0.001 ? arcR * Math.sin(curlAngle) : 0);
        pos.setX(i, rx);
        pos.setZ(i, rz);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    };

    // Mouse parallax & mobile gyroscope state
    let pointerNormX = 0;
    let pointerNormY = 0;
    let gyroNormX = 0;
    let gyroNormY = 0;
    let hasGyroSignal = false;
    let parallaxX = 0;
    let parallaxY = 0;
    let smoothProgress = targetPageRef.current;
    let lastOverlayKey = "";

    const syncOverlayTextures = (spreadIdx: number, activeLang: "en" | "es") => {
      const sp = spreads[spreadIdx - 1];
      if (!sp) return;
      const key = `${sp.id}:${activeLang}`;
      if (key === lastOverlayKey) return;
      lastOverlayKey = key;
      drawSpreadParallaxDisplay(displayCanvas, sp, activeLang);
      displayTex.needsUpdate = true;
      drawSpreadParallaxStory(storyCanvas, sp, activeLang);
      storyTex.needsUpdate = true;
    };

    // Paint initial spread overlay when fonts settle
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (disposed) return;
        lastOverlayKey = "";
      });
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerNormX = THREE.MathUtils.clamp(nx, -1, 1);
      pointerNormY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      hasGyroSignal = true;
      gyroNormX = THREE.MathUtils.clamp(e.gamma / 28, -1, 1);
      gyroNormY = THREE.MathUtils.clamp((e.beta - 44) / 24, -1, 1);
    };

    let downX = 0;
    let downY = 0;
    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist > 10) return;
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const cur = targetPageRef.current;
      if (cur === 0) {
        if (relX > 0.28) onChangePageRef.current(1);
      } else if (cur >= spreads.length + 1) {
        if (relX < 0.72) onChangePageRef.current(spreads.length);
      } else if (relX < 0.44) {
        onChangePageRef.current(Math.max(0, cur - 1));
      } else if (relX > 0.56) {
        onChangePageRef.current(Math.min(spreads.length + 1, cur + 1));
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("deviceorientation", onDeviceOrientation, { passive: true });
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1200;
      const h = container.clientHeight || 720;
      const a = w / h;
      camera.aspect = a;
      camera.position.z = a < 1 ? 11.4 : 8.5;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let rafId = 0;
    let prevTime = performance.now();

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;

      const target = targetPageRef.current;
      if (reducedRef.current) {
        smoothProgress = target;
      } else {
        smoothProgress += (target - smoothProgress) * Math.min(1, dt * 6.8);
        if (Math.abs(target - smoothProgress) < 0.001) {
          smoothProgress = target;
        }
      }

      const factor = reducedRef.current ? 0 : 1;
      const goalX = hasGyroSignal ? gyroNormX : pointerNormX;
      const goalY = hasGyroSignal ? gyroNormY : pointerNormY;
      parallaxX += (goalX * factor - parallaxX) * Math.min(1, dt * 5.2);
      parallaxY += (goalY * factor - parallaxY) * Math.min(1, dt * 5.2);

      // Update all 7 leaves
      for (let i = 0; i < leaves.length; i += 1) {
        const leaf = leaves[i];
        const rawP = THREE.MathUtils.clamp(smoothProgress - i, 0, 1);
        const easedP =
          rawP < 0.5
            ? 4 * rawP * rawP * rawP
            : 1 - Math.pow(-2 * rawP + 2, 3) * 0.5;
        leaf.group.rotation.y = -easedP * Math.PI;
        const lift = Math.sin(easedP * Math.PI) * 0.14;
        const rightStackZ = (leafCount - 1 - i) * 0.007;
        const leftStackZ = i * 0.007;
        leaf.group.position.z =
          THREE.MathUtils.lerp(rightStackZ, leftStackZ, easedP) + lift;

        bendGeometry(leaf.frontGeo, leaf.frontBaseX, 0.0025, easedP);
        bendGeometry(leaf.backGeo, leaf.backBaseX, -0.0025, easedP);
      }

      // Smooth centering between Front Cover (0), Open Spreads (1..6), and Back Cover (7)
      const isDesktop = (container.clientWidth || 1200) > 900;
      const frontCoverOffset = -pageW * 0.5;
      const backCoverDesktopOffset = pageW * 0.5 - 1.15;
      const backCoverMobileOffset = pageW * 0.5;
      const backCoverOffset = isDesktop ? backCoverDesktopOffset : backCoverMobileOffset;

      let targetBookX = 0;
      if (smoothProgress < 1) {
        const openEase = 1 - Math.pow(1 - smoothProgress, 3);
        targetBookX = THREE.MathUtils.lerp(frontCoverOffset, 0, openEase);
      } else if (smoothProgress > spreads.length) {
        const closeT = THREE.MathUtils.clamp(smoothProgress - spreads.length, 0, 1);
        const closeEase =
          closeT < 0.5
            ? 2 * closeT * closeT
            : 1 - Math.pow(-2 * closeT + 2, 2) * 0.5;
        targetBookX = THREE.MathUtils.lerp(0, backCoverOffset, closeEase);
      }

      const swayY = Math.sin(now * 0.00055) * 0.025 * factor;
      bookWrapper.position.x = targetBookX;
      bookWrapper.position.y = parallaxY * -0.10 + swayY;
      bookWrapper.rotation.y = parallaxX * 0.11;
      bookWrapper.rotation.x = parallaxY * 0.07;

      // Adapt soft desk shadow behind single cover vs open spread
      const openFactor =
        smoothProgress < 1
          ? THREE.MathUtils.smoothstep(smoothProgress, 0.1, 0.9)
          : smoothProgress > spreads.length
            ? 1 - THREE.MathUtils.smoothstep(smoothProgress - spreads.length, 0.1, 0.9)
            : 1;
      deskShadowMesh.scale.x = THREE.MathUtils.lerp(0.56, 1.0, openFactor);
      deskShadowMesh.position.x =
        smoothProgress < 1
          ? THREE.MathUtils.lerp(pageW * 0.5, 0, openFactor)
          : smoothProgress > spreads.length
            ? THREE.MathUtils.lerp(0, -pageW * 0.5, 1 - openFactor)
            : 0;

      // Floating 2.5D parallax story & typography layers (visible cleanly when settled on a spread)
      const nearestIdx = Math.round(smoothProgress);
      const distFromStop = Math.abs(smoothProgress - nearestIdx);
      if (nearestIdx >= 1 && nearestIdx <= spreads.length) {
        syncOverlayTextures(nearestIdx, langRef.current);
        const settle = Math.pow(
          THREE.MathUtils.clamp(1 - distFromStop * 1.95, 0, 1),
          2
        );
        layerDisplayMat.opacity = settle;
        layerStoryMat.opacity = settle;
        const isVisible = settle > 0.015;
        layerDisplayMesh.visible = isVisible;
        layerStoryMesh.visible = isVisible;
        layerDisplayMesh.position.set(parallaxX * 0.14, parallaxY * 0.08, 0.21);
        layerStoryMesh.position.set(parallaxX * 0.24, parallaxY * 0.14, 0.35);
      } else {
        layerDisplayMesh.visible = false;
        layerStoryMesh.visible = false;
        layerDisplayMat.opacity = 0;
        layerStoryMat.opacity = 0;
      }

      starPoints.rotation.y = now * 0.000018 * factor;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("deviceorientation", onDeviceOrientation);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      leaves.forEach((l) => {
        l.frontGeo.dispose();
        l.backGeo.dispose();
        l.frontMat.dispose();
        l.backMat.dispose();
      });
      layerDisplayMesh.geometry.dispose();
      layerDisplayMat.dispose();
      layerStoryMesh.geometry.dispose();
      layerStoryMat.dispose();
      deskShadowMesh.geometry.dispose();
      deskShadowMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      createdTextures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [
    spreads,
    coverImage,
    backCoverImage,
    coverTopLine,
    coverMainTitle,
    coverTagline,
    backColophon,
    gyroActive,
  ]);

  if (!webglReady) {
    const activeSpread =
      page >= 1 && page <= spreads.length ? spreads[page - 1] : null;
    const fallbackSrc =
      page === 0
        ? coverImage
        : page >= spreads.length + 1
          ? backCoverImage
          : activeSpread?.image ?? coverImage;
    return (
      <div className="vg-webgl-fallback">
        <div
          className="vg-fallback-frame"
          style={{ backgroundImage: `url("${fallbackSrc}")` }}
          role="img"
          aria-label={activeSpread ? activeSpread.title[lang] : coverMainTitle}
        />
      </div>
    );
  }

  return <div ref={containerRef} className="vg-canvas-host" />;
}
