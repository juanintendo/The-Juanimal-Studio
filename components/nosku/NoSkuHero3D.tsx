"use client";

import React, { useEffect, useRef, useState } from "react";

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

interface HeroTapeCanvasProps {
  crateRef: React.RefObject<HTMLDivElement | null>;
  reduced: boolean;
  resetKey?: number;
  onCut?: () => void;
}

export function HeroTapeCanvas({
  crateRef,
  reduced,
  resetKey = 0,
  onCut,
}: HeroTapeCanvasProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

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
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.06;
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        stage.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
        camera.position.set(0, 0, 14.2);

        // Studio lighting rig
        const hemi = new THREE.HemisphereLight(0xfff7ec, 0x3a241b, 1.38);
        scene.add(hemi);
        const key = new THREE.DirectionalLight(0xffffff, 1.65);
        key.position.set(4.5, 6.5, 9.0);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xff8c66, 0.72);
        rim.position.set(-5.5, -3.5, 4.5);
        scene.add(rim);

        // 1. Inner hollow Kraft cardboard core texture
        const coreCanvas = document.createElement("canvas");
        coreCanvas.width = 1024;
        coreCanvas.height = 256;
        const cCtx = coreCanvas.getContext("2d");
        if (cCtx) {
          cCtx.fillStyle = "#CFA97E";
          cCtx.fillRect(0, 0, coreCanvas.width, coreCanvas.height);
          for (let i = 0; i < 900; i++) {
            cCtx.fillStyle =
              i % 2 === 0 ? "rgba(65,38,16,0.08)" : "rgba(255,244,225,0.08)";
            cCtx.fillRect(
              Math.random() * coreCanvas.width,
              Math.random() * coreCanvas.height,
              12 + Math.random() * 28,
              1.5
            );
          }
          cCtx.fillStyle = "#18110E";
          cCtx.font = "900 32px Arial Narrow, Helvetica, sans-serif";
          cCtx.textBaseline = "middle";
          const txt =
            "NO SKU // 000  •  EMPTY BY DESIGN  •  NO SKU // 000  •  ";
          cCtx.fillText(txt, 14, 76);
          cCtx.fillText(txt, -140, 178);
        }
        const coreTex = new THREE.CanvasTexture(coreCanvas);
        coreTex.wrapS = THREE.RepeatWrapping;
        coreTex.colorSpace = THREE.SRGBColorSpace;

        // Subtle extrusion grain bump map
        const bumpCanvas = document.createElement("canvas");
        bumpCanvas.width = 256;
        bumpCanvas.height = 256;
        const bCtx = bumpCanvas.getContext("2d");
        if (bCtx) {
          bCtx.fillStyle = "#808080";
          bCtx.fillRect(0, 0, 256, 256);
          for (let y = 0; y < 256; y += 2) {
            const shade = 118 + Math.round(Math.sin(y * 0.45) * 14);
            bCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
            bCtx.fillRect(0, y, 256, 1);
          }
        }
        const grainBump = new THREE.CanvasTexture(bumpCanvas);
        grainBump.wrapS = THREE.RepeatWrapping;
        grainBump.wrapT = THREE.RepeatWrapping;

        // 2. Outer tape roll texture (4 repeated registration tiles around circumference)
        const tilesPerCircumference = 4;
        const outerTapeCanvas = document.createElement("canvas");
        outerTapeCanvas.width = 1024;
        outerTapeCanvas.height = 256;
        const otCtx = outerTapeCanvas.getContext("2d");
        if (otCtx) {
          otCtx.fillStyle = "#FF4D29";
          otCtx.fillRect(0, 0, 1024, 256);
          const slotW = 1024 / tilesPerCircumference;
          for (let i = 0; i < tilesPerCircumference; i++) {
            const cx = i * slotW + slotW * 0.5;
            const cy = 128;

            // Registration edge ticks
            otCtx.fillStyle = "rgba(24, 17, 14, 0.28)";
            otCtx.fillRect(i * slotW, 10, slotW * 0.14, 18);
            otCtx.fillRect(i * slotW, 228, slotW * 0.14, 18);
            otCtx.fillRect(i * slotW, 0, 2, 256);

            // Micro-stencil rotated +90deg so after rotateZ(+PI/2) it reads upright in front view
            otCtx.save();
            otCtx.translate(cx, cy);
            otCtx.rotate(Math.PI / 2);
            otCtx.fillStyle = "rgba(24, 17, 14, 0.56)";
            otCtx.font = "900 22px ui-monospace, Menlo, monospace";
            otCtx.textAlign = "center";
            otCtx.textBaseline = "middle";
            otCtx.fillText("NO SKU // 000 ▼", 0, 0);
            otCtx.restore();
          }
        }
        const outerTapeTex = new THREE.CanvasTexture(outerTapeCanvas);
        outerTapeTex.wrapS = THREE.RepeatWrapping;
        outerTapeTex.wrapT = THREE.ClampToEdgeWrapping;
        outerTapeTex.colorSpace = THREE.SRGBColorSpace;

        // 3. Matching 1:1 vertical texture for the unspooling ribbon
        const ribbonCanvas = document.createElement("canvas");
        ribbonCanvas.width = 256;
        ribbonCanvas.height = 256;
        const rCtx = ribbonCanvas.getContext("2d");
        if (rCtx) {
          rCtx.fillStyle = "#FF4D29";
          rCtx.fillRect(0, 0, 256, 256);
          rCtx.fillStyle = "rgba(24, 17, 14, 0.28)";
          rCtx.fillRect(10, 0, 18, 36);
          rCtx.fillRect(228, 0, 18, 36);
          rCtx.fillRect(0, 0, 256, 2);

          rCtx.fillStyle = "rgba(24, 17, 14, 0.56)";
          rCtx.font = "900 22px ui-monospace, Menlo, monospace";
          rCtx.textAlign = "center";
          rCtx.textBaseline = "middle";
          rCtx.fillText("NO SKU // 000 ▼", 128, 128);
        }
        const ribbonTex = new THREE.CanvasTexture(ribbonCanvas);
        ribbonTex.wrapS = THREE.ClampToEdgeWrapping;
        ribbonTex.wrapT = THREE.RepeatWrapping;
        ribbonTex.colorSpace = THREE.SRGBColorSpace;

        // 4. Side caps showing concentric wound layers
        const sideRingCanvas = document.createElement("canvas");
        sideRingCanvas.width = 512;
        sideRingCanvas.height = 512;
        const sCtx = sideRingCanvas.getContext("2d");
        if (sCtx) {
          sCtx.fillStyle = "#E83B18";
          sCtx.fillRect(0, 0, 512, 512);
          for (let r = 138; r < 252; r += 4) {
            sCtx.beginPath();
            sCtx.arc(256, 256, r, 0, Math.PI * 2);
            sCtx.strokeStyle =
              r % 8 === 0
                ? "rgba(255, 198, 178, 0.32)"
                : "rgba(92, 16, 4, 0.26)";
            sCtx.lineWidth = 1.5;
            sCtx.stroke();
          }
        }
        const sideRingTex = new THREE.CanvasTexture(sideRingCanvas);
        sideRingTex.colorSpace = THREE.SRGBColorSpace;

        // Roll hierarchy: rollPivot handles framing pose, rollSpinGroup spins purely around X
        const rollPivot = new THREE.Group();
        scene.add(rollPivot);

        const rollSpinGroup = new THREE.Group();
        rollPivot.add(rollSpinGroup);

        const tapeWidth = 1.16;
        const outerR = 1.46;
        const innerR = 0.88;
        const patternPeriodWorld = (2 * Math.PI * outerR) / tilesPerCircumference;

        const coreGeo = new THREE.CylinderGeometry(
          innerR,
          innerR,
          tapeWidth + 0.04,
          48,
          1,
          true
        );
        coreGeo.rotateZ(Math.PI / 2);
        const coreMat = new THREE.MeshStandardMaterial({
          map: coreTex,
          roughness: 0.78,
          metalness: 0.02,
          side: THREE.DoubleSide,
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        rollSpinGroup.add(coreMesh);

        const outerGeo = new THREE.CylinderGeometry(
          outerR,
          outerR,
          tapeWidth,
          64,
          1,
          true
        );
        outerGeo.rotateZ(Math.PI / 2);
        const tapeMat = new THREE.MeshPhysicalMaterial({
          map: outerTapeTex,
          roughness: 0.26,
          metalness: 0.03,
          clearcoat: 0.72,
          clearcoatRoughness: 0.18,
          bumpMap: grainBump,
          bumpScale: 0.012,
          transparent: true,
          opacity: 0.98,
        });
        const outerMesh = new THREE.Mesh(outerGeo, tapeMat);
        rollSpinGroup.add(outerMesh);

        const ringGeoLeft = new THREE.RingGeometry(innerR, outerR, 56);
        ringGeoLeft.rotateY(-Math.PI / 2);
        ringGeoLeft.translate(-tapeWidth / 2, 0, 0);

        const ringGeoRight = new THREE.RingGeometry(innerR, outerR, 56);
        ringGeoRight.rotateY(Math.PI / 2);
        ringGeoRight.translate(tapeWidth / 2, 0, 0);

        const ringMat = new THREE.MeshPhysicalMaterial({
          map: sideRingTex,
          roughness: 0.34,
          clearcoat: 0.55,
          metalness: 0.03,
        });
        const ringLeft = new THREE.Mesh(ringGeoLeft, ringMat);
        const ringRight = new THREE.Mesh(ringGeoRight, ringMat);
        rollSpinGroup.add(ringLeft, ringRight);

        // Dynamic 3D Unspooling Tape Ribbon
        const segX = 8;
        const segY = 48;
        const ribbonGeo = new THREE.PlaneGeometry(tapeWidth, 1, segX, segY);
        const baseRibbonPos = Float32Array.from(
          ribbonGeo.attributes.position.array
        );
        const ribbonMat = new THREE.MeshPhysicalMaterial({
          map: ribbonTex,
          roughness: 0.24,
          metalness: 0.03,
          clearcoat: 0.78,
          clearcoatRoughness: 0.16,
          bumpMap: grainBump,
          bumpScale: 0.01,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.94,
        });
        const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
        scene.add(ribbonMesh);

        // Layout & Synchronized Scroll State Machine
        let stageW = 1000;
        let stageH = 900;
        let visibleHeightWorld = 8;
        let worldPerPx = 0.01;
        let rollHomeYWorld = 2.0;
        let crateTopWorld = -1.2;
        let crateBottomWorld = -3.0;

        const baseStubLen = 0.24;
        const restRotY = 32 * (Math.PI / 180);

        let mode: "scrub" | "finale" | "done" = reduced ? "done" : "scrub";
        let isIntersecting = true;
        let smoothProg = 0;
        let unspoolLen = baseStubLen;
        let prevUnspool = baseStubLen;
        let smoothVel = 0;
        let finaleCut = 0;
        let finaleHome = 0;
        let finaleStartTs = 0;
        let finaleStartSpin = 0;
        let cutCalled = false;

        let pointerNormX = 0;
        let pointerNormY = 0;
        let pointerActive = false;
        let smoothTiltX = 0;
        let smoothTiltY = 0;

        const computeLayoutMetrics = () => {
          const rect = stage.getBoundingClientRect();
          stageW = Math.max(240, rect.width);
          stageH = Math.max(320, rect.height);
          renderer.setSize(stageW, stageH, false);
          camera.aspect = stageW / stageH;
          camera.updateProjectionMatrix();

          const vFov = (camera.fov * Math.PI) / 180;
          visibleHeightWorld = 2 * Math.tan(vFov / 2) * camera.position.z;
          worldPerPx = visibleHeightWorld / stageH;

          // Suspend roll cleanly in upper clear runway above crate
          const rollPxFromTop = Math.min(stageH * 0.17, 175);
          rollHomeYWorld =
            visibleHeightWorld / 2 - rollPxFromTop * worldPerPx;

          if (crateRef.current) {
            const cRect = crateRef.current.getBoundingClientRect();
            const crateTopInStage = cRect.top - rect.top;
            const crateCenterInStage =
              cRect.top - rect.top + cRect.height * 0.5;
            crateTopWorld =
              visibleHeightWorld / 2 - crateTopInStage * worldPerPx;
            crateBottomWorld =
              visibleHeightWorld / 2 - crateCenterInStage * worldPerPx;
          } else {
            crateTopWorld = rollHomeYWorld - 2.4;
            crateBottomWorld = rollHomeYWorld - 4.0;
          }
        };

        /**
         * Updates both the 3D vertex strip curving off the roll tangent and exact 1:1
         * UVs synced to rollSpinGroup.rotation.x = unspoolDelta / outerR.
         */
        const updateRibbonGeometry = (
          startY: number,
          totalDropLen: number,
          cutGap: number,
          unspoolDelta: number,
          velAmp: number,
          timeSec: number,
          pinToPlaneZ: boolean
        ) => {
          const pos = ribbonGeo.attributes.position;
          const uv = ribbonGeo.attributes.uv;
          const totalDrop = Math.max(0.18, totalDropLen);
          const detachedDrop = Math.max(0, cutGap);
          const actualTopY = startY - detachedDrop;
          const activeLen = Math.max(0.12, totalDrop - detachedDrop);

          for (let i = 0; i < pos.count; i++) {
            const origX = baseRibbonPos[i * 3];
            const origY = baseRibbonPos[i * 3 + 1]; // +0.5 (top) -> -0.5 (bottom)
            const t = 0.5 - origY; // 0 at top -> 1 at bottom

            const worldY = actualTopY - t * activeLen;

            // Top attaches seamlessly tangent to the front (+Z = outerR) face when pinned to roll
            const baseZ = pinToPlaneZ
              ? 0.16
              : 0.16 + Math.pow(1 - t, 1.85) * (outerR - 0.16 + 0.018);

            // Subtle wave ripple scaled solely by active scroll speed (calm when paused)
            const ripple =
              velAmp > 0.002
                ? Math.sin(t * 7.0 - timeSec * 5.2) * velAmp * t * (1 - t)
                : 0;

            pos.setXYZ(i, origX, worldY, baseZ + ripple);

            // Exact 1:1 linear arc UV phase continuity off the rotating roll tangent
            const distFromTop = detachedDrop + t * activeLen;
            const uWidth = (origX + tapeWidth / 2) / tapeWidth;
            const vLength = (unspoolDelta - distFromTop) / patternPeriodWorld;
            uv.setXY(i, uWidth, vLength);
          }

          pos.needsUpdate = true;
          uv.needsUpdate = true;
          ribbonGeo.computeVertexNormals();
        };

        computeLayoutMetrics();

        const onPointerMove = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          pointerActive = true;
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
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });

        const ro = new ResizeObserver(() => {
          computeLayoutMetrics();
        });
        ro.observe(stage);
        if (crateRef.current) ro.observe(crateRef.current);

        const io = new IntersectionObserver(
          ([entry]) => {
            isIntersecting = entry.isIntersecting;
          },
          { rootMargin: "40% 0px" }
        );
        io.observe(stage);

        let lastTime = performance.now();

        const tick = (now: number) => {
          if (disposed) return;
          raf = requestAnimationFrame(tick);
          if (!isIntersecting) return;

          const dt = clamp((now - lastTime) / 1000, 0.001, 0.05);
          lastTime = now;
          const timeSec = now / 1000;

          if (reduced) {
            rollPivot.position.set(0, rollHomeYWorld, 0);
            rollPivot.rotation.set(0.22, restRotY, -0.1);
            rollSpinGroup.rotation.x = 0;
            updateRibbonGeometry(rollHomeYWorld, 1.85, 0, 1.85, 0, 0, false);
            renderer.render(scene, camera);
            return;
          }

          const targetSpan = Math.max(1.8, rollHomeYWorld - crateBottomWorld);

          if (mode === "scrub") {
            // Track bidirectional scroll progress toward the crate seam
            let rawProg = 0;
            if (crateRef.current) {
              const cRect = crateRef.current.getBoundingClientRect();
              const vh = window.innerHeight || 900;
              const startBottom = vh * 1.15;
              const endTop = vh * 0.24;
              rawProg = clamp(
                (startBottom - cRect.top) / Math.max(240, startBottom - endTop),
                0,
                1
              );
            } else {
              const stageTop = stage.getBoundingClientRect().top + window.scrollY;
              const localScroll = Math.max(0, window.scrollY - stageTop + 160);
              rawProg = clamp(localScroll / Math.max(360, stageH * 0.45), 0, 1);
            }

            smoothProg += (rawProg - smoothProg) * clamp(1 - Math.exp(-10 * dt), 0, 1);

            // Pivot cleanly from 3/4 intro (rotY = 32deg) to DEAD FRONTAL (rotY = 0deg) right as it unspools!
            const frontT = smoothStep(0, 0.24, smoothProg);
            const rotY = restRotY * (1 - frontT);
            const rotZ = -0.1 * (1 - frontT);
            const rotX = 0.22 * (1 - frontT) + 0.12 * frontT;

            rollPivot.position.set(0, rollHomeYWorld, 0);
            rollPivot.rotation.set(rotX, rotY, rotZ);

            // Synchronized 1:1 roll spin + unspool length
            const unspoolProg = smoothStep(0.04, 1.0, smoothProg);
            unspoolLen = baseStubLen + (targetSpan - baseStubLen) * unspoolProg;
            const unspoolDelta = Math.max(0, unspoolLen - baseStubLen);

            // Positive rotation around X moves the front +Z cylinder surface DOWNWARD (-Y) at 1:1 speed
            rollSpinGroup.rotation.x = unspoolDelta / outerR;

            const rawVel = Math.abs(unspoolLen - prevUnspool) / dt;
            prevUnspool = unspoolLen;
            smoothVel += (clamp(rawVel * 0.025, 0, 0.08) - smoothVel) * clamp(1 - Math.exp(-8 * dt), 0, 1);

            updateRibbonGeometry(
              rollHomeYWorld,
              unspoolLen,
              0,
              unspoolDelta,
              smoothVel,
              timeSec,
              false
            );

            if (smoothProg >= 0.965) {
              mode = "finale";
              finaleStartTs = now;
              finaleStartSpin = unspoolDelta / outerR;
              if (!cutCalled) {
                cutCalled = true;
                onCut?.();
              }
            }
          } else if (mode === "finale") {
            const elapsed = (now - finaleStartTs) / 1000;
            finaleCut = smoothStep(0, 0.48, elapsed);
            finaleHome = smoothStep(0.25, 0.98, elapsed);

            // Return smoothly from dead-frontal (0deg) back to 3/4 hero pose (32deg)
            const rotY = restRotY * finaleHome;
            const rotZ = -0.14 * finaleHome;
            const rotX = 0.12 + 0.14 * finaleHome;

            rollPivot.position.set(
              Math.sin(finaleHome * Math.PI) * 0.14,
              rollHomeYWorld + finaleHome * 0.18,
              0
            );
            rollPivot.rotation.set(rotX, rotY, rotZ);
            rollSpinGroup.rotation.x = finaleStartSpin;

            // Snap cut strip down onto crate seam
            const totalDetachedLen = Math.max(0.9, targetSpan);
            const cutDetach = finaleCut * Math.max(0.8, rollHomeYWorld - crateTopWorld);
            const finalDelta = Math.max(0, totalDetachedLen - baseStubLen);

            updateRibbonGeometry(
              rollHomeYWorld,
              totalDetachedLen,
              cutDetach,
              finalDelta,
              0,
              timeSec,
              false
            );

            if (elapsed >= 1.02) {
              mode = "done";
            }
          } else {
            // Done: organic micro-bob + gentle pointer-driven 3D parallax tilt
            const targetX = pointerActive ? pointerNormY * 0.2 : 0;
            const targetY = pointerActive ? pointerNormX * 0.24 : 0;
            const damp = 1 - Math.exp(-4.5 * dt);
            smoothTiltX += (targetX - smoothTiltX) * damp;
            smoothTiltY += (targetY - smoothTiltY) * damp;

            const bobY = Math.sin(timeSec * 1.45) * 0.09;
            const driftX = Math.cos(timeSec * 0.85) * 0.06;
            rollPivot.position.set(driftX, rollHomeYWorld + 0.18 + bobY, 0);
            rollPivot.rotation.set(
              0.26 + smoothTiltX + Math.sin(timeSec * 1.1) * 0.04,
              restRotY + smoothTiltY,
              -0.14 - smoothTiltY * 0.3
            );
            rollSpinGroup.rotation.x = finaleStartSpin + Math.sin(timeSec * 0.9) * 0.05;

            // Cut piece stays cleanly sealing the empty crate center
            const sealedLen = Math.max(0.95, crateTopWorld - crateBottomWorld + 0.35);
            updateRibbonGeometry(
              crateTopWorld + 0.08,
              sealedLen,
              0,
              sealedLen,
              0,
              timeSec,
              true
            );
          }

          renderer.render(scene, camera);
        };

        raf = requestAnimationFrame(tick);

        cleanupFns.push(
          () => window.removeEventListener("pointermove", onPointerMove),
          () => ro.disconnect(),
          () => io.disconnect(),
          () => {
            coreGeo.dispose();
            coreMat.dispose();
            coreTex.dispose();
            outerGeo.dispose();
            outerTapeTex.dispose();
            tapeMat.dispose();
            grainBump.dispose();
            ringGeoLeft.dispose();
            ringGeoRight.dispose();
            ringMat.dispose();
            sideRingTex.dispose();
            ribbonGeo.dispose();
            ribbonTex.dispose();
            ribbonMat.dispose();
            renderer.dispose();
            if (renderer.domElement.parentNode === stage) {
              stage.removeChild(renderer.domElement);
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
  }, [crateRef, onCut, reduced, resetKey]);

  return (
    <div ref={stageRef} className="ns-hero-tape" aria-hidden="true">
      {fallback && (
        <svg viewBox="0 0 220 280" className="ns-hero-tape-fallback">
          <rect x="64" y="24" width="92" height="92" rx="18" fill="#FF4D29" stroke="#18110E" strokeWidth="4" />
          <rect x="86" y="102" width="48" height="150" rx="6" fill="#FF4D29" opacity="0.9" />
        </svg>
      )}
    </div>
  );
}

interface StickyNoteWebGLProps {
  reduced: boolean;
  noteLines: string[];
}

export function StickyNoteWebGL({ reduced, noteLines }: StickyNoteWebGLProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let raf = 0;
    const cleanupFns: Array<() => void> = [];

    const setup = async () => {
      try {
        const THREE = await import("three");
        if (disposed || !hostRef.current) return;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 30);
        camera.position.set(0, 0, 5.2);

        const hemi = new THREE.HemisphereLight(0xfffef8, 0x73623e, 1.35);
        scene.add(hemi);
        const dir = new THREE.DirectionalLight(0xffffff, 1.15);
        dir.position.set(2.8, 3.6, 4.5);
        scene.add(dir);

        // Offscreen sticky note canvas
        const canvas = document.createElement("canvas");
        canvas.width = 768;
        canvas.height = 768;

        const paintStickyCanvas = () => {
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, 768, 768);

          const grad = ctx.createLinearGradient(0, 0, 0, 768);
          grad.addColorStop(0, "#FFF299");
          grad.addColorStop(1, "#F7DF68");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 768, 768);

          // Fine archival grid
          ctx.strokeStyle = "rgba(24, 17, 14, 0.065)";
          ctx.lineWidth = 1.5;
          for (let g = 48; g < 768; g += 48) {
            ctx.beginPath();
            ctx.moveTo(0, g);
            ctx.lineTo(768, g);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(g, 0);
            ctx.lineTo(g, 768);
            ctx.stroke();
          }

          // Translucent vermilion tape strip along top edge
          ctx.save();
          ctx.translate(384, 38);
          ctx.rotate(-0.025);
          ctx.fillStyle = "rgba(255, 77, 41, 0.84)";
          ctx.fillRect(-165, -26, 330, 52);
          ctx.strokeStyle = "rgba(255,255,255,0.35)";
          ctx.strokeRect(-165, -26, 330, 52);
          ctx.restore();

          // Handwritten copy
          ctx.fillStyle = "#18110E";
          ctx.font =
            "400 54px 'Nothing You Could Do', 'Segoe Script', cursive";
          ctx.textBaseline = "top";
          noteLines.forEach((line, idx) => {
            ctx.save();
            ctx.translate(72, 148 + idx * 124);
            ctx.rotate((idx % 2 === 0 ? -1 : 1) * 0.012);
            ctx.fillText(line, 0, 0);
            ctx.restore();
          });

          ctx.fillStyle = "rgba(24,17,14,0.45)";
          ctx.font = "700 22px monospace";
          ctx.fillText("REF // EMPTY-000", 72, 686);
        };

        paintStickyCanvas();

        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;

        // Repaint cleanly as soon as Nothing You Could Do finishes loading
        if (typeof document !== "undefined" && document.fonts?.ready) {
          document.fonts.ready.then(() => {
            if (!disposed) {
              paintStickyCanvas();
              tex.needsUpdate = true;
            }
          });
        }

        const geo = new THREE.PlaneGeometry(2.15, 2.02, 24, 24);
        const basePos = Float32Array.from(geo.attributes.position.array);
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.72,
          metalness: 0.02,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);

        const resize = () => {
          const r = host.getBoundingClientRect();
          const w = Math.max(120, r.width);
          const h = Math.max(120, r.height);
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();

        let isVisible = true;
        let lastScrollY = window.scrollY;
        let pointerX = NaN;
        let pointerY = NaN;
        let curlAmount = 0.24;
        let flutter = 0;

        const applyCurl = (curl: number, flt: number) => {
          const pos = geo.attributes.position;
          const halfW = 1.075;
          const halfH = 1.01;

          for (let i = 0; i < pos.count; i++) {
            const bx = basePos[i * 3];
            const by = basePos[i * 3 + 1];

            const u = (bx + halfW) / (halfW * 2);
            const v = (halfH - by) / (halfH * 2);

            const weight = Math.pow(v, 1.55) * (0.28 + 0.72 * Math.pow(u, 1.3));
            const bend = curl * weight;
            const z = Math.sin(bend * Math.PI * 0.5) * 0.78 + flt * v * u * 0.14;
            const xShift = -bend * 0.14 * u;
            const yShift = bend * 0.16 * v;

            pos.setXYZ(i, bx + xShift, by + yShift, z);
          }
          pos.needsUpdate = true;
          geo.computeVertexNormals();
        };

        const ro = new ResizeObserver(resize);
        ro.observe(host);

        const io = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry.isIntersecting;
          },
          { rootMargin: "25% 0px" }
        );
        io.observe(host);

        const onPointerMove = (e: PointerEvent) => {
          pointerX = e.clientX;
          pointerY = e.clientY;
        };
        window.addEventListener("pointermove", onPointerMove, { passive: true });

        let lastTs = performance.now();

        const tick = (now: number) => {
          if (disposed) return;
          raf = requestAnimationFrame(tick);
          if (!isVisible) return;

          const dt = clamp((now - lastTs) / 1000, 0.001, 0.05);
          lastTs = now;

          if (reduced) {
            applyCurl(0.18, 0);
            renderer.render(scene, camera);
            return;
          }

          const sy = window.scrollY;
          const sVel = sy - lastScrollY;
          lastScrollY = sy;

          let prox = 0;
          if (!Number.isNaN(pointerX)) {
            const rect = host.getBoundingClientRect();
            const cx = rect.left + rect.width * 0.5;
            const cy = rect.top + rect.height * 0.5;
            const dist = Math.hypot(pointerX - cx, pointerY - cy);
            const maxR = Math.max(rect.width, 220) * 1.15;
            prox = Math.max(0, 1 - dist / maxR);
          }

          const targetCurl = clamp(
            0.22 + prox * 0.42 + clamp(Math.abs(sVel) * 0.012, 0, 0.32),
            0.16,
            0.92
          );
          const targetFlutter = Math.sin(now * 0.0032) * (0.25 + prox * 0.45);
          const d = 1 - Math.exp(-6.5 * dt);
          curlAmount += (targetCurl - curlAmount) * d;
          flutter += (targetFlutter - flutter) * d;

          applyCurl(curlAmount, flutter);
          renderer.render(scene, camera);
        };

        raf = requestAnimationFrame(tick);

        cleanupFns.push(
          () => window.removeEventListener("pointermove", onPointerMove),
          () => ro.disconnect(),
          () => io.disconnect(),
          () => {
            geo.dispose();
            mat.dispose();
            tex.dispose();
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
  }, [noteLines, reduced]);

  return (
    <div ref={hostRef} className="ns-sticky-note" aria-hidden="true">
      {fallback && (
        <div className="ns-sticky-fallback">
          {noteLines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}
