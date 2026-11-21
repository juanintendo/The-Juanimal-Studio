"use client";

import React, { useEffect, useRef, useState } from "react";

export interface VoyagerSpreadSpec {
  id: string;
  image: string;
  title: Record<"en" | "es", string>;
  story: Record<"en" | "es", string>;
  macaFact: Record<"en" | "es", string>;
  parentPrompt: Record<"en" | "es", string>;
}

interface VoyagerBook3DProps {
  page: number;
  onChangePage: (nextPage: number) => void;
  lang: "en" | "es";
  reduced: boolean;
  spreads: VoyagerSpreadSpec[];
  coverImage: string;
  backCoverImage: string;
  coverTopLine: string;
  coverMainTitle: string;
  coverTagline: string;
  backColophon: string;
}

const TOTAL_STOPS = 8; // 0 = front cover, 1..6 = double spreads, 7 = back cover

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function createCottonPaperBumpCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  const img = ctx.createImageData(256, 256);
  const d = img.data;
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 256; x++) {
      const idx = (y * 256 + x) * 4;
      const wave =
        Math.sin(x * 0.24 + Math.cos(y * 0.19) * 1.4) * 14 +
        Math.cos(y * 0.31) * 10;
      const tooth = ((x * 73856093) ^ (y * 19349663)) & 31;
      const val = clamp(128 + wave + (tooth - 15) * 1.2, 70, 210);
      d[idx] = val;
      d[idx + 1] = val;
      d[idx + 2] = val;
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function paintFrontCoverCanvas(
  canvas: HTMLCanvasElement,
  coverImg: HTMLImageElement,
  topLine: string,
  mainTitle: string,
  tagline: string
) {
  canvas.width = 896;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, 896, 1200);
  ctx.drawImage(coverImg, 0, 0, 896, 1200);

  // Subtle top indigo vignette behind upper-right title area so golden record on left shines cleanly
  const grad = ctx.createRadialGradient(575, 225, 20, 575, 225, 290);
  grad.addColorStop(0, "rgba(11, 14, 46, 0.72)");
  grad.addColorStop(0.65, "rgba(11, 14, 46, 0.34)");
  grad.addColorStop(1, "rgba(11, 14, 46, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(280, 36, 580, 360);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Top storybook serif lines
  const lines = topLine.split("\n");
  ctx.shadowColor = "rgba(8, 10, 28, 0.85)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#FAF4E6";
  ctx.font = "800 34px 'Fraunces', Georgia, serif";
  lines.forEach((ln, idx) => {
    ctx.fillText(ln, 575, 114 + idx * 42);
  });

  // Hero "Voyager 1" wax-gold title
  ctx.save();
  ctx.translate(575, 240);
  ctx.rotate(-0.025);
  ctx.fillStyle = "#FFD166";
  ctx.font = "italic 900 84px 'Fraunces', Georgia, serif";
  ctx.fillText(mainTitle, 0, 0);
  ctx.restore();

  // Playful crayon subtitle
  ctx.fillStyle = "#A8F0EA";
  ctx.font = "400 24px 'Patrick Hand', cursive";
  ctx.fillText(tagline, 575, 314);
  ctx.shadowBlur = 0;
}

function paintBackCoverCanvas(
  canvas: HTMLCanvasElement,
  backImg: HTMLImageElement,
  colophon: string
) {
  canvas.width = 896;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, 896, 1200);
  ctx.drawImage(backImg, 0, 0, 896, 1200);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(8, 10, 28, 0.8)";
  ctx.shadowBlur = 8;

  const lines = colophon.split("\n");
  lines.forEach((ln, idx) => {
    ctx.fillStyle = idx === 0 ? "#FFD166" : "#FAF4E6";
    ctx.font =
      idx === 0
        ? "800 32px 'Fraunces', Georgia, serif"
        : "400 24px 'Patrick Hand', cursive";
    ctx.fillText(ln, 448, 865 + idx * 44);
  });
  ctx.shadowBlur = 0;
}

function paintHalfSpreadCanvas(
  img: HTMLImageElement,
  side: "left" | "right"
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 688;
  c.height = 768;
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  const sx = side === "left" ? 0 : Math.floor(img.naturalWidth * 0.5);
  const sw = Math.floor(img.naturalWidth * 0.5);
  ctx.drawImage(img, sx, 0, sw, img.naturalHeight, 0, 0, c.width, c.height);

  // Subtle realistic book gutter shadow along center spine
  if (side === "left") {
    const gL = ctx.createLinearGradient(c.width - 72, 0, c.width, 0);
    gL.addColorStop(0, "rgba(18, 14, 10, 0)");
    gL.addColorStop(1, "rgba(18, 14, 10, 0.24)");
    ctx.fillStyle = gL;
    ctx.fillRect(c.width - 72, 0, 72, c.height);
  } else {
    const gR = ctx.createLinearGradient(0, 0, 72, 0);
    gR.addColorStop(0, "rgba(18, 14, 10, 0.24)");
    gR.addColorStop(1, "rgba(18, 14, 10, 0)");
    ctx.fillStyle = gR;
    ctx.fillRect(0, 0, 72, c.height);
  }
  return c;
}

function createCreamBoardCanvas(label?: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 684;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  ctx.fillStyle = "#F5EEDC";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.strokeStyle = "rgba(24, 26, 36, 0.14)";
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, c.width - 40, c.height - 40);

  if (label) {
    ctx.fillStyle = "rgba(24, 26, 36, 0.45)";
    ctx.font = "400 22px 'Patrick Hand', cursive";
    ctx.textAlign = "center";
    ctx.fillText(label, c.width / 2, c.height / 2);
  }
  return c;
}

export function VoyagerBook3D({
  page,
  onChangePage,
  lang,
  reduced,
  spreads,
  coverImage,
  backCoverImage,
  coverTopLine,
  coverMainTitle,
  coverTagline,
  backColophon,
}: VoyagerBook3DProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  const pageRef = useRef(page);
  const onChangePageRef = useRef(onChangePage);
  const repaintCoverRef = useRef<(() => void) | null>(null);
  const copyRef = useRef({
    coverTopLine,
    coverMainTitle,
    coverTagline,
    backColophon,
  });

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    onChangePageRef.current = onChangePage;
  }, [onChangePage]);

  useEffect(() => {
    copyRef.current = {
      coverTopLine,
      coverMainTitle,
      coverTagline,
      backColophon,
    };
    repaintCoverRef.current?.();
  }, [lang, coverTopLine, coverMainTitle, coverTagline, backColophon]);

  useEffect(() => {
    const host = stageRef.current;
    if (!host) return;

    let disposed = false;
    let raf = 0;
    const cleanupFns: Array<() => void> = [];

    const setup = async () => {
      try {
        const THREE = await import("three");
        if (disposed || !stageRef.current) return;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1.5, 0.1, 60);
        camera.position.set(0, 0.08, 12.2);

        // Warm storybook studio lighting (Hello Monday inspired directional spot + soft sky fill)
        const hemi = new THREE.HemisphereLight(0xfff8e8, 0x1e2542, 1.25);
        scene.add(hemi);

        const spotLight = new THREE.SpotLight(
          0xfff3db,
          145,
          36,
          Math.PI / 3.4,
          0.55,
          1.45
        );
        spotLight.position.set(0.6, 2.2, 10.6);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.bias = -0.0005;
        scene.add(spotLight);

        const rimLight = new THREE.DirectionalLight(0xaad9ff, 0.72);
        rimLight.position.set(-4.5, -2.5, 6.0);
        scene.add(rimLight);

        // Subtle floating golden chalk dust particles behind book
        const starCount = 130;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
          starPositions[i * 3] = (Math.sin(i * 19.3) * 0.5 + (i % 7) / 7 - 0.5) * 18;
          starPositions[i * 3 + 1] = Math.cos(i * 31.7) * 6.5;
          starPositions[i * 3 + 2] = -2.2 - (i % 5) * 0.85;
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(starPositions, 3)
        );
        const starMat = new THREE.PointsMaterial({
          color: 0xffe49e,
          size: 0.075,
          transparent: true,
          opacity: 0.6,
        });
        const starField = new THREE.Points(starGeo, starMat);
        scene.add(starField);

        const bookWrapper = new THREE.Group();
        scene.add(bookWrapper);

        // Shared cotton paper bump texture
        const paperBumpCanvas = createCottonPaperBumpCanvas();
        const paperBumpTex = new THREE.CanvasTexture(paperBumpCanvas);
        paperBumpTex.wrapS = THREE.RepeatWrapping;
        paperBumpTex.wrapT = THREE.RepeatWrapping;
        paperBumpTex.repeat.set(2, 2);

        // Book dimensions matching cover 896x1200 (~3:4 per half-spread; double spread ~688x768)
        const pageW = 3.25;
        const pageH = 3.92;
        const segX = 28;
        const segY = 6;
        const leafCount = spreads.length + 1; // 7 turning leaves (0=cover, 1..6=spread leaves)

        // Preload cover, back cover, and all 6 double-page spreads in parallel
        const [coverImg, backImg, ...spreadImgs] = await Promise.all([
          loadHtmlImage(coverImage),
          loadHtmlImage(backCoverImage),
          ...spreads.map((sp) => loadHtmlImage(sp.image)),
        ]);
        if (disposed) return;

        // Dynamic Front & Back Cover canvases
        const frontCoverCanvas = document.createElement("canvas");
        const backCoverCanvas = document.createElement("canvas");
        paintFrontCoverCanvas(
          frontCoverCanvas,
          coverImg,
          copyRef.current.coverTopLine,
          copyRef.current.coverMainTitle,
          copyRef.current.coverTagline
        );
        paintBackCoverCanvas(
          backCoverCanvas,
          backImg,
          copyRef.current.backColophon
        );

        const frontCoverTex = new THREE.CanvasTexture(frontCoverCanvas);
        frontCoverTex.colorSpace = THREE.SRGBColorSpace;
        frontCoverTex.anisotropy = 4;

        const backCoverTex = new THREE.CanvasTexture(backCoverCanvas);
        backCoverTex.colorSpace = THREE.SRGBColorSpace;
        backCoverTex.anisotropy = 4;

        repaintCoverRef.current = () => {
          paintFrontCoverCanvas(
            frontCoverCanvas,
            coverImg,
            copyRef.current.coverTopLine,
            copyRef.current.coverMainTitle,
            copyRef.current.coverTagline
          );
          frontCoverTex.needsUpdate = true;

          paintBackCoverCanvas(
            backCoverCanvas,
            backImg,
            copyRef.current.backColophon
          );
          backCoverTex.needsUpdate = true;
        };

        if (typeof document !== "undefined" && document.fonts?.ready) {
          document.fonts.ready.then(() => {
            if (!disposed) repaintCoverRef.current?.();
          });
        }

        const makeHalfTex = (img: HTMLImageElement, side: "left" | "right") => {
          const tex = new THREE.CanvasTexture(paintHalfSpreadCanvas(img, side));
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 4;
          return tex;
        };

        const endpaperTex = new THREE.CanvasTexture(
          createCreamBoardCanvas("VOYAGER 1 • ARCHIVE #003")
        );
        endpaperTex.colorSpace = THREE.SRGBColorSpace;

        const disposedTextures: Array<{ dispose: () => void }> = [
          paperBumpTex,
          frontCoverTex,
          backCoverTex,
          endpaperTex,
        ];
        const disposedGeos: Array<{ dispose: () => void }> = [starGeo];
        const disposedMats: Array<{ dispose: () => void }> = [starMat];

        // Solid static cream endboard resting behind rightmost leaf
        const backBoardGeo = new THREE.BoxGeometry(
          pageW + 0.08,
          pageH + 0.1,
          0.05
        );
        backBoardGeo.translate(pageW * 0.5 + 0.02, 0, -0.055);
        const backBoardMat = new THREE.MeshStandardMaterial({
          map: endpaperTex,
          bumpMap: paperBumpTex,
          bumpScale: 0.01,
          roughness: 0.85,
          metalness: 0.02,
        });
        const backBoardMesh = new THREE.Mesh(backBoardGeo, backBoardMat);
        backBoardMesh.receiveShadow = true;
        bookWrapper.add(backBoardMesh);
        disposedGeos.push(backBoardGeo);
        disposedMats.push(backBoardMat);

        // Soft spine binding bridge
        const spineGeo = new THREE.CylinderGeometry(
          0.055,
          0.055,
          pageH + 0.1,
          16
        );
        const spineMat = new THREE.MeshStandardMaterial({
          color: 0x161938,
          roughness: 0.85,
        });
        const spineMesh = new THREE.Mesh(spineGeo, spineMat);
        spineMesh.position.set(0, 0, -0.025);
        bookWrapper.add(spineMesh);
        disposedGeos.push(spineGeo);
        disposedMats.push(spineMat);

        interface LeafRig {
          group: InstanceType<typeof THREE.Group>;
          frontGeo: InstanceType<typeof THREE.PlaneGeometry>;
          backGeo: InstanceType<typeof THREE.PlaneGeometry>;
          frontBaseY: Float32Array;
          frontBaseU: Float32Array;
          backBaseY: Float32Array;
          backBaseU: Float32Array;
          lagAmount: number;
          archLift: number;
        }

        const leafRigs: LeafRig[] = [];

        for (let k = 0; k < leafCount; k++) {
          const group = new THREE.Group();
          bookWrapper.add(group);

          const frontTex =
            k === 0 ? frontCoverTex : makeHalfTex(spreadImgs[k - 1], "right");
          const backTex =
            k === leafCount - 1
              ? backCoverTex
              : makeHalfTex(spreadImgs[k], "left");

          if (k > 0) disposedTextures.push(frontTex);
          if (k < leafCount - 1) disposedTextures.push(backTex);

          // Front face (+Z in resting state)
          const frontGeo = new THREE.PlaneGeometry(pageW, pageH, segX, segY);
          frontGeo.translate(pageW * 0.5, 0, 0);
          const fPos = frontGeo.attributes.position;
          const frontBaseY = new Float32Array(fPos.count);
          const frontBaseU = new Float32Array(fPos.count);
          for (let i = 0; i < fPos.count; i++) {
            frontBaseY[i] = fPos.getY(i);
            frontBaseU[i] = fPos.getX(i) / pageW; // 0 (spine) -> 1 (outer edge)
          }

          // Back face (-Z in resting state; faces viewer upright when turned PI left)
          const backGeo = new THREE.PlaneGeometry(pageW, pageH, segX, segY);
          backGeo.rotateY(Math.PI);
          backGeo.translate(pageW * 0.5, 0, 0);
          const bPos = backGeo.attributes.position;
          const backBaseY = new Float32Array(bPos.count);
          const backBaseU = new Float32Array(bPos.count);
          for (let i = 0; i < bPos.count; i++) {
            backBaseY[i] = bPos.getY(i);
            backBaseU[i] = bPos.getX(i) / pageW; // 0 (spine) -> 1 (outer edge)
          }

          const isCoverLeaf = k === 0 || k === leafCount - 1;
          const frontMat = new THREE.MeshStandardMaterial({
            map: frontTex,
            bumpMap: paperBumpTex,
            bumpScale: 0.011,
            roughness: isCoverLeaf ? 0.78 : 0.86,
            metalness: 0.02,
          });
          const backMat = new THREE.MeshStandardMaterial({
            map: backTex,
            bumpMap: paperBumpTex,
            bumpScale: 0.011,
            roughness: isCoverLeaf ? 0.78 : 0.86,
            metalness: 0.02,
          });

          const frontMesh = new THREE.Mesh(frontGeo, frontMat);
          frontMesh.castShadow = true;
          frontMesh.receiveShadow = true;

          const backMesh = new THREE.Mesh(backGeo, backMat);
          backMesh.castShadow = true;
          backMesh.receiveShadow = true;

          group.add(frontMesh, backMesh);
          disposedGeos.push(frontGeo, backGeo);
          disposedMats.push(frontMat, backMat);

          leafRigs.push({
            group,
            frontGeo,
            backGeo,
            frontBaseY,
            frontBaseU,
            backBaseY,
            backBaseU,
            lagAmount: k === 0 ? 0.07 : k === leafCount - 1 ? 0.1 : 0.25,
            archLift: k === 0 ? 0.22 : 0.44,
          });
        }

        // Arc-length preserving vertex bend integration per leaf
        const deformLeaf = (rig: LeafRig, k: number, turnT: number) => {
          const zRight = (leafCount - 1 - k) * 0.016 + 0.012;
          const zLeft = k * 0.016 + 0.012;
          const baseZ = zRight * (1 - turnT) + zLeft * turnT;

          // Sample strip angles & integrated X/Z positions along 29 columns
          const colX = new Float32Array(segX + 1);
          const colZ = new Float32Array(segX + 1);
          const colNx = new Float32Array(segX + 1);
          const colNz = new Float32Array(segX + 1);

          colX[0] = 0;
          colZ[0] = baseZ;
          const stepLen = pageW / segX;

          for (let s = 0; s < segX; s++) {
            const uMid = (s + 0.5) / segX;
            const localT = clamp(
              (turnT * (1 + rig.lagAmount) - uMid * rig.lagAmount),
              0,
              1
            );
            const theta = smoothStep(0, 1, localT) * Math.PI;
            const curlBoost =
              Math.sin(theta) * Math.sin(uMid * Math.PI) * rig.archLift * 0.05;

            const dirX = Math.cos(theta);
            const dirZ = Math.sin(theta);

            colX[s + 1] = colX[s] + dirX * stepLen;
            colZ[s + 1] = colZ[s] + dirZ * (stepLen + curlBoost);
          }

          for (let s = 0; s <= segX; s++) {
            const s0 = Math.max(0, s - 1);
            const s1 = Math.min(segX, s + 1);
            const tx = colX[s1] - colX[s0];
            const tz = colZ[s1] - colZ[s0];
            const len = Math.hypot(tx, tz) || 1;
            // Right-hand perpendicular normal pointing toward front (+Z when angle = 0)
            colNx[s] = -tz / len;
            colNz[s] = tx / len;
          }

          const sampleColumn = (u: number) => {
            const fCol = clamp(u * segX, 0, segX);
            const c0 = Math.floor(fCol);
            const c1 = Math.min(segX, c0 + 1);
            const f = fCol - c0;
            return {
              x: colX[c0] + (colX[c1] - colX[c0]) * f,
              z: colZ[c0] + (colZ[c1] - colZ[c0]) * f,
              nx: colNx[c0] + (colNx[c1] - colNx[c0]) * f,
              nz: colNz[c0] + (colNz[c1] - colNz[c0]) * f,
            };
          };

          const halfThick = 0.0028;
          const fPos = rig.frontGeo.attributes.position;
          for (let i = 0; i < fPos.count; i++) {
            const pt = sampleColumn(rig.frontBaseU[i]);
            fPos.setXYZ(
              i,
              pt.x + pt.nx * halfThick,
              rig.frontBaseY[i],
              pt.z + pt.nz * halfThick
            );
          }
          fPos.needsUpdate = true;
          rig.frontGeo.computeVertexNormals();

          const bPos = rig.backGeo.attributes.position;
          for (let i = 0; i < bPos.count; i++) {
            const pt = sampleColumn(rig.backBaseU[i]);
            bPos.setXYZ(
              i,
              pt.x - pt.nx * halfThick,
              rig.backBaseY[i],
              pt.z - pt.nz * halfThick
            );
          }
          bPos.needsUpdate = true;
          rig.backGeo.computeVertexNormals();
        };

        // Responsive camera framing so full open spread + cover never clip horizontally or vertically
        let stageW = 1280;
        let stageH = 720;
        const resize = () => {
          const r = host.getBoundingClientRect();
          stageW = Math.max(280, r.width);
          stageH = Math.max(280, r.height);
          renderer.setSize(stageW, stageH, false);
          camera.aspect = stageW / stageH;

          // Ensure width of 2 * pageW + margin (~7.6 units) fits inside frustum horizontally
          const vFov = (camera.fov * Math.PI) / 180;
          const targetSpreadW = stageW < 760 ? 7.35 : 7.85;
          const zForW = targetSpreadW / (2 * Math.tan(vFov / 2) * camera.aspect);
          const zForH = (pageH + 1.55) / (2 * Math.tan(vFov / 2));
          camera.position.z = clamp(Math.max(zForW, zForH, 7.6), 7.6, 17.5);
          camera.updateProjectionMatrix();
        };
        resize();

        const ro = new ResizeObserver(resize);
        ro.observe(host);

        // Pointer drag-to-turn + smooth 2.5D mouse hover tilt
        let pointerNormX = 0;
        let pointerNormY = 0;
        let dragging = false;
        let dragPointerId = -1;
        let dragStartX = 0;
        let dragDelta = 0;
        let smoothProgress = pageRef.current;

        const onPointerDown = (e: PointerEvent) => {
          // Only respond directly on canvas so HTML UI buttons never get hijacked
          if (e.target !== renderer.domElement) return;
          dragging = true;
          dragPointerId = e.pointerId;
          dragStartX = e.clientX;
          dragDelta = 0;
          renderer.domElement.style.cursor = "grabbing";
          try {
            renderer.domElement.setPointerCapture?.(e.pointerId);
          } catch {
            // noop
          }
        };

        const onPointerMove = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          pointerNormX = clamp(
            ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2,
            -1,
            1
          );
          pointerNormY = clamp(
            ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2,
            -1,
            1
          );

          if (dragging && e.pointerId === dragPointerId) {
            const dx = e.clientX - dragStartX;
            const rawDelta = -dx / Math.max(180, stageW * 0.34);
            const base = pageRef.current;
            dragDelta = clamp(rawDelta, -base, TOTAL_STOPS - 1 - base);
          }
        };

        const onPointerUp = (e: PointerEvent) => {
          if (!dragging || e.pointerId !== dragPointerId) return;
          dragging = false;
          dragPointerId = -1;
          renderer.domElement.style.cursor = "grab";

          const cur = pageRef.current;
          if (dragDelta > 0.16 && cur < TOTAL_STOPS - 1) {
            onChangePageRef.current(cur + 1);
          } else if (dragDelta < -0.16 && cur > 0) {
            onChangePageRef.current(cur - 1);
          }
          dragDelta = 0;
        };

        renderer.domElement.style.cursor = "grab";
        renderer.domElement.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);

        let lastTs = performance.now();

        const tick = (now: number) => {
          if (disposed) return;
          raf = requestAnimationFrame(tick);

          const dt = clamp((now - lastTs) / 1000, 0.001, 0.05);
          lastTs = now;

          const targetProgress = dragging
            ? clamp(pageRef.current + dragDelta, 0, TOTAL_STOPS - 1)
            : pageRef.current;

          if (reduced) {
            smoothProgress = targetProgress;
          } else {
            const k = dragging ? 16 : 6.2;
            smoothProgress +=
              (targetProgress - smoothProgress) * (1 - Math.exp(-k * dt));
            if (Math.abs(targetProgress - smoothProgress) < 0.0004) {
              smoothProgress = targetProgress;
            }
          }

          // Update every bending cardstock leaf
          for (let k = 0; k < leafCount; k++) {
            const turnT = clamp(smoothProgress - k, 0, 1);
            deformLeaf(leafRigs[k], k, turnT);
          }

          // HTWKR centering choreography:
          // - progress 0 (Cover): center cover at x = -pageW * 0.5
          // - progress 1..6 (Spreads): dead center at x = 0
          // - progress 7 (Back Cover): desktop frames slightly left (-pageW * 0.52) for Resources card on right
          const openMix = smoothStep(0, 1, smoothProgress);
          const closeMix = smoothStep(
            leafCount - 1,
            leafCount,
            smoothProgress
          );
          const isDesktop = stageW > 900;
          const restCoverX = -pageW * 0.5;
          const backFrameX = isDesktop ? pageW * 0.14 : pageW * 0.5;
          const targetBookX =
            restCoverX * (1 - openMix) + backFrameX * closeMix;

          // Subtle HTWKR Y rotation & light sweep toward back cover / hover tilt
          const hoverTiltY = reduced ? 0 : pointerNormX * 0.075;
          const hoverTiltX = reduced ? 0 : -pointerNormY * 0.055;
          const backTurnYaw = isDesktop ? 0.14 * closeMix : 0;

          bookWrapper.position.x = targetBookX;
          bookWrapper.position.y = reduced
            ? 0.16
            : 0.18 + Math.sin(now * 0.0011) * 0.03;
          bookWrapper.rotation.y = backTurnYaw + hoverTiltY;
          bookWrapper.rotation.x = 0.06 + hoverTiltX;

          // Keep static back board stacked neatly only while book is open or on back
          backBoardMesh.visible = true;
          spineMesh.visible = true;

          // Subtle spotlight tracking
          spotLight.position.x = 0.6 + closeMix * 2.4 + pointerNormX * 1.4;
          spotLight.position.y = 2.0 - pointerNormY * 1.1;

          // Gentle floating dust shimmer
          starField.rotation.z = reduced ? 0 : now * 0.000018;

          renderer.render(scene, camera);
        };

        raf = requestAnimationFrame(tick);

        cleanupFns.push(
          () => ro.disconnect(),
          () =>
            renderer.domElement.removeEventListener(
              "pointerdown",
              onPointerDown
            ),
          () => window.removeEventListener("pointermove", onPointerMove),
          () => window.removeEventListener("pointerup", onPointerUp),
          () => window.removeEventListener("pointercancel", onPointerUp),
          () => {
            disposedGeos.forEach((g) => g.dispose());
            disposedMats.forEach((m) => m.dispose());
            disposedTextures.forEach((t) => t.dispose());
            renderer.dispose();
            if (renderer.domElement.parentNode === host) {
              host.removeChild(renderer.domElement);
            }
          }
        );
      } catch {
        if (!disposed) setFallback(true);
      }
    };

    setup();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      cleanupFns.forEach((fn) => fn());
    };
  }, [backCoverImage, coverImage, reduced, spreads]);

  // Clean 2D storybook fallback if WebGL is unavailable
  const fallbackSrc =
    page === 0
      ? coverImage
      : page >= spreads.length + 1
        ? backCoverImage
        : spreads[page - 1].image;

  return (
    <div
      ref={stageRef}
      className="vg-book-stage"
      aria-label="Interactive 3D Voyager 1 storybook canvas"
    >
      {fallback && (
        <div className="vg-fallback-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fallbackSrc} alt="Voyager 1 illustrated page fallback" />
        </div>
      )}
    </div>
  );
}
