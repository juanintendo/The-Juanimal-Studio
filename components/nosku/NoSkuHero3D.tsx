"use client";

import React, { useEffect, useRef, useState } from "react";

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function contrastInkForHex(hex: string): { ink: string; edgeHighlight: string } {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) {
    return { ink: "rgba(24, 17, 14, 0.72)", edgeHighlight: "rgba(255, 255, 255, 0.28)" };
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (lum < 0.44) {
    return {
      ink: "rgba(244, 239, 230, 0.82)",
      edgeHighlight: "rgba(244, 239, 230, 0.26)",
    };
  }
  return {
    ink: "rgba(24, 17, 14, 0.72)",
    edgeHighlight: "rgba(255, 255, 255, 0.34)",
  };
}

interface HeroTapeCanvasProps {
  crateRef: React.RefObject<HTMLDivElement | null>;
  reduced: boolean;
  tapeColor?: string;
  onSealProgress?: (p: number) => void;
}

export function HeroTapeCanvas({
  crateRef,
  reduced,
  tapeColor = "#FF4D29",
  onSealProgress,
}: HeroTapeCanvasProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const hitRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);

  const tapeColorRef = useRef(tapeColor);
  const repaintFnRef = useRef<((hex: string) => void) | null>(null);
  const onSealProgressRef = useRef(onSealProgress);
  onSealProgressRef.current = onSealProgress;

  useEffect(() => {
    tapeColorRef.current = tapeColor;
    repaintFnRef.current?.(tapeColor);
  }, [tapeColor]);

  useEffect(() => {
    const stage = stageRef.current;
    const hitEl = hitRef.current;
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
        camera.position.set(0, 0, 15.6);

        // Studio lighting rig
        const hemi = new THREE.HemisphereLight(0xfff7ec, 0x3a241b, 1.42);
        scene.add(hemi);
        const key = new THREE.DirectionalLight(0xffffff, 1.65);
        key.position.set(4.5, 6.5, 9.0);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0xffb599, 0.65);
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

        // 2. Color-synced textures (outer tape, ribbon, side annular caps)
        const tilesPerCircumference = 4;
        const outerTapeCanvas = document.createElement("canvas");
        outerTapeCanvas.width = 1024;
        outerTapeCanvas.height = 256;

        const ribbonCanvas = document.createElement("canvas");
        ribbonCanvas.width = 256;
        ribbonCanvas.height = 256;

        const sideRingCanvas = document.createElement("canvas");
        sideRingCanvas.width = 512;
        sideRingCanvas.height = 512;

        const outerTapeTex = new THREE.CanvasTexture(outerTapeCanvas);
        outerTapeTex.wrapS = THREE.RepeatWrapping;
        outerTapeTex.wrapT = THREE.ClampToEdgeWrapping;
        outerTapeTex.colorSpace = THREE.SRGBColorSpace;

        const ribbonTex = new THREE.CanvasTexture(ribbonCanvas);
        ribbonTex.wrapS = THREE.ClampToEdgeWrapping;
        ribbonTex.wrapT = THREE.RepeatWrapping;
        ribbonTex.colorSpace = THREE.SRGBColorSpace;

        const sideRingTex = new THREE.CanvasTexture(sideRingCanvas);
        sideRingTex.colorSpace = THREE.SRGBColorSpace;

        const repaintTapeTextures = (hex: string) => {
          const { ink, edgeHighlight } = contrastInkForHex(hex);

          // Outer cylinder texture
          const otCtx = outerTapeCanvas.getContext("2d");
          if (otCtx) {
            otCtx.fillStyle = hex;
            otCtx.fillRect(0, 0, 1024, 256);
            const slotW = 1024 / tilesPerCircumference;
            for (let i = 0; i < tilesPerCircumference; i++) {
              const cx = i * slotW + slotW * 0.5;
              otCtx.fillStyle = ink;
              otCtx.fillRect(i * slotW, 10, slotW * 0.12, 16);
              otCtx.fillRect(i * slotW, 230, slotW * 0.12, 16);
              otCtx.fillRect(i * slotW, 0, 2, 256);

              otCtx.save();
              otCtx.translate(cx, 128);
              otCtx.rotate(Math.PI / 2);
              otCtx.fillStyle = ink;
              otCtx.font = "900 22px ui-monospace, Menlo, monospace";
              otCtx.textAlign = "center";
              otCtx.textBaseline = "middle";
              otCtx.fillText("NO SKU // 000 ▼", 0, 0);
              otCtx.restore();
            }
          }

          // Vertical ribbon texture
          const rCtx = ribbonCanvas.getContext("2d");
          if (rCtx) {
            rCtx.fillStyle = hex;
            rCtx.fillRect(0, 0, 256, 256);
            rCtx.fillStyle = ink;
            rCtx.fillRect(10, 0, 16, 32);
            rCtx.fillRect(230, 0, 16, 32);
            rCtx.fillRect(0, 0, 256, 2);

            rCtx.font = "900 22px ui-monospace, Menlo, monospace";
            rCtx.textAlign = "center";
            rCtx.textBaseline = "middle";
            rCtx.fillText("NO SKU // 000 ▼", 128, 128);
          }

          // Side wound layers texture
          const sCtx = sideRingCanvas.getContext("2d");
          if (sCtx) {
            sCtx.fillStyle = hex;
            sCtx.fillRect(0, 0, 512, 512);
            for (let r = 136; r < 252; r += 4) {
              sCtx.beginPath();
              sCtx.arc(256, 256, r, 0, Math.PI * 2);
              sCtx.strokeStyle = r % 8 === 0 ? edgeHighlight : ink;
              sCtx.lineWidth = r % 8 === 0 ? 1.2 : 0.9;
              sCtx.stroke();
            }
          }

          outerTapeTex.needsUpdate = true;
          ribbonTex.needsUpdate = true;
          sideRingTex.needsUpdate = true;
        };

        repaintTapeTextures(tapeColorRef.current);
        repaintFnRef.current = repaintTapeTextures;

        // Roll hierarchy: rollPivot handles framing pose + interactive orbit, rollSpinGroup spins around X
        const rollPivot = new THREE.Group();
        scene.add(rollPivot);

        const rollSpinGroup = new THREE.Group();
        rollPivot.add(rollSpinGroup);

        const tapeWidth = 1.18;
        const outerR = 1.38;
        const innerR = 0.82;
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

        // Continuous Reversible 3D Tape Ribbon
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
        ribbonMesh.visible = false;
        scene.add(ribbonMesh);

        // Layout Metrics & Interactive Orbit State
        let stageW = 1000;
        let stageH = 920;
        let visibleHeightWorld = 8;
        let worldPerPx = 0.01;
        let rollHomeYWorld = 2.0;
        let crateBottomWorld = -3.0;

        const restRotY = 32 * (Math.PI / 180);

        let isIntersecting = true;
        let smoothProg = 0;
        let unspoolLen = 0;
        let prevUnspool = 0;
        let smoothVel = 0;

        let pointerNormX = 0;
        let pointerNormY = 0;
        let pointerActive = false;
        let smoothHoverTiltX = 0;
        let smoothHoverTiltY = 0;

        // Free drag orbit around the 3D roll with inertia
        let dragging = false;
        let dragPointerId = -1;
        let lastDragX = 0;
        let lastDragY = 0;
        let dragRotX = 0;
        let dragRotY = 0;
        let dragVelX = 0;
        let dragVelY = 0;
        let userSpinBonus = 0;

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

          // Generous headroom on desktop so top silhouette curve of cylinder is never clipped
          const rollPxFromTop =
            stageH < 520 ? Math.round(stageH * 0.34) : Math.max(210, stageH * 0.22);
          rollHomeYWorld =
            visibleHeightWorld / 2 - rollPxFromTop * worldPerPx;

          if (hitEl) {
            hitEl.style.top = `${Math.round(rollPxFromTop)}px`;
          }

          if (crateRef.current) {
            const cRect = crateRef.current.getBoundingClientRect();
            const crateBottomInStage =
              cRect.top - rect.top + cRect.height * 0.72;
            crateBottomWorld =
              visibleHeightWorld / 2 - crateBottomInStage * worldPerPx;
          } else {
            crateBottomWorld = rollHomeYWorld - 4.9;
          }
        };

        const updateRibbonGeometry = (
          startY: number,
          startZ: number,
          totalDropLen: number,
          unspoolDelta: number,
          velAmp: number,
          timeSec: number
        ) => {
          const pos = ribbonGeo.attributes.position;
          const uv = ribbonGeo.attributes.uv;
          const activeLen = Math.max(0.08, totalDropLen);

          for (let i = 0; i < pos.count; i++) {
            const origX = baseRibbonPos[i * 3];
            const origY = baseRibbonPos[i * 3 + 1];
            const t = 0.5 - origY; // 0 at underside roll peel -> 1 at crate bottom

            const worldY = startY - t * activeLen;
            // Ribbon peels from bottom-front underside outside cylinder toward flat crate seam (z = 0.16)
            const baseZ = 0.16 + Math.pow(1 - t, 2.0) * (startZ - 0.16);
            const ripple =
              velAmp > 0.002
                ? Math.sin(t * 7.0 - timeSec * 5.2) * velAmp * t * (1 - t)
                : 0;

            pos.setXYZ(i, origX, worldY, baseZ + ripple);

            const distFromTop = t * activeLen;
            const uWidth = (origX + tapeWidth / 2) / tapeWidth;
            const vLength = (unspoolDelta - distFromTop) / patternPeriodWorld;
            uv.setXY(i, uWidth, vLength);
          }

          pos.needsUpdate = true;
          uv.needsUpdate = true;
          ribbonGeo.computeVertexNormals();
        };

        computeLayoutMetrics();

        const onGlobalPointerMove = (e: PointerEvent) => {
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

          if (dragging && e.pointerId === dragPointerId) {
            const dx = e.clientX - lastDragX;
            const dy = e.clientY - lastDragY;
            lastDragX = e.clientX;
            lastDragY = e.clientY;
            dragVelY = clamp(dx * 0.013, -0.4, 0.4);
            dragVelX = clamp(dy * 0.013, -0.4, 0.4);
            dragRotY += dragVelY;
            dragRotX = clamp(dragRotX + dragVelX, -1.25, 1.25);
            userSpinBonus += dy * 0.012;
          }
        };

        const onGlobalPointerUp = (e: PointerEvent) => {
          if (!dragging || e.pointerId !== dragPointerId) return;
          dragging = false;
          dragPointerId = -1;
          if (hitEl) hitEl.style.cursor = "grab";
        };

        const onHitDown = (e: PointerEvent) => {
          e.preventDefault();
          dragging = true;
          dragPointerId = e.pointerId;
          lastDragX = e.clientX;
          lastDragY = e.clientY;
          dragVelX = 0;
          dragVelY = 0;
          if (hitEl) {
            hitEl.style.cursor = "grabbing";
            try {
              hitEl.setPointerCapture?.(e.pointerId);
            } catch {
              // noop
            }
          }
        };

        window.addEventListener("pointermove", onGlobalPointerMove, {
          passive: true,
        });
        window.addEventListener("pointerup", onGlobalPointerUp);
        window.addEventListener("pointercancel", onGlobalPointerUp);
        hitEl?.addEventListener("pointerdown", onHitDown);

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
            ribbonMesh.visible = false;
            onSealProgressRef.current?.(0);
            renderer.render(scene, camera);
            return;
          }

          // True scroll-anchored progression: at scrollY <= 24 the roll rests freely at 32deg with no ribbon stub
          const sy = window.scrollY;
          let rawProg = 0;
          if (sy > 24) {
            if (crateRef.current) {
              const cRect = crateRef.current.getBoundingClientRect();
              const vh = window.innerHeight || 900;
              const crateDocTop = cRect.top + sy;
              const startSy = 24;
              const endSy = Math.max(startSy + 280, crateDocTop - vh * 0.22);
              rawProg = clamp(
                (sy - startSy) / Math.max(240, endSy - startSy),
                0,
                1
              );
            } else {
              const stageTop = stage.getBoundingClientRect().top + sy;
              const localScroll = Math.max(0, sy - stageTop + 160);
              rawProg = clamp(localScroll / Math.max(360, stageH * 0.45), 0, 1);
            }
          }

          smoothProg += (rawProg - smoothProg) * clamp(1 - Math.exp(-10 * dt), 0, 1);
          onSealProgressRef.current?.(smoothProg);

          // Pivot cleanly 32deg -> 0deg frontal during initial unspool, staying 100% connected
          const frontT = smoothStep(0, 0.22, smoothProg);
          const baseRotY = restRotY * (1 - frontT);
          const baseRotZ = -0.1 * (1 - frontT);
          const baseRotX = 0.22 * (1 - frontT) + 0.1 * frontT;

          // Interactive mouse hover + free drag orbit inertia (always interactive!)
          const hoverScale = 1 - 0.45 * smoothStep(0.04, 0.25, smoothProg);
          const hoverTargetX = pointerActive ? pointerNormY * 0.12 * hoverScale : 0;
          const hoverTargetY = pointerActive ? pointerNormX * 0.14 * hoverScale : 0;
          const hDamp = 1 - Math.exp(-4.5 * dt);
          smoothHoverTiltX += (hoverTargetX - smoothHoverTiltX) * hDamp;
          smoothHoverTiltY += (hoverTargetY - smoothHoverTiltY) * hDamp;

          if (!dragging) {
            dragRotY += dragVelY;
            dragRotX = clamp(dragRotX + dragVelX, -1.25, 1.25);
            const isSealing = smoothProg > 0.08;
            const inertiaDecay = Math.exp(-(isSealing ? 8 : 3.8) * dt);
            dragVelX *= inertiaDecay;
            dragVelY *= inertiaDecay;

            // Gentle float-back at rest; brisk alignment over vertical tape while scrolled
            const relax = Math.exp(-(isSealing ? 5.5 : 0.95) * dt);
            dragRotX *= relax;
            dragRotY *= relax;
            userSpinBonus *= relax;
          }

          const bobY = Math.sin(timeSec * 1.4) * 0.06;
          rollPivot.position.set(0, rollHomeYWorld + bobY, 0);
          rollPivot.rotation.set(
            baseRotX + smoothHoverTiltX * 0.5 + dragRotX,
            baseRotY + smoothHoverTiltY * 0.7 + dragRotY,
            baseRotZ - dragRotY * 0.15
          );

          // Hide ribbon at rest (no stub in hollow core); peel cleanly off underside on scroll
          const startY = rollHomeYWorld + bobY - outerR * 0.86;
          const startZ = outerR * 0.54;
          const targetSpan = Math.max(0.18, startY - crateBottomWorld);
          const unspoolProg = smoothStep(0.045, 0.96, smoothProg);
          unspoolLen = targetSpan * unspoolProg;
          const unspoolDelta = Math.max(0, unspoolLen);

          rollSpinGroup.rotation.x = unspoolDelta / outerR + userSpinBonus;

          const rawVel = Math.abs(unspoolLen - prevUnspool) / dt;
          prevUnspool = unspoolLen;
          smoothVel +=
            (clamp(rawVel * 0.025, 0, 0.075) - smoothVel) *
            clamp(1 - Math.exp(-8 * dt), 0, 1);

          if (smoothProg < 0.045 || unspoolLen <= 0.02) {
            ribbonMesh.visible = false;
          } else {
            ribbonMesh.visible = true;
            updateRibbonGeometry(
              startY,
              startZ,
              unspoolLen,
              unspoolDelta,
              smoothVel,
              timeSec
            );
          }

          renderer.render(scene, camera);
        };

        raf = requestAnimationFrame(tick);

        cleanupFns.push(
          () => window.removeEventListener("pointermove", onGlobalPointerMove),
          () => window.removeEventListener("pointerup", onGlobalPointerUp),
          () => window.removeEventListener("pointercancel", onGlobalPointerUp),
          () => hitEl?.removeEventListener("pointerdown", onHitDown),
          () => ro.disconnect(),
          () => io.disconnect(),
          () => {
            repaintFnRef.current = null;
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
  }, [crateRef, reduced]);

  return (
    <div ref={stageRef} className="ns-hero-tape" aria-hidden="true">
      <div
        ref={hitRef}
        className="ns-hero-tape-hit"
        title="Drag to rotate 3D tape roll"
      />
      {fallback && (
        <svg viewBox="0 0 220 280" className="ns-hero-tape-fallback">
          <rect
            x="64"
            y="24"
            width="92"
            height="92"
            rx="18"
            fill={tapeColor}
            stroke="#18110E"
            strokeWidth="4"
          />
          <rect
            x="86"
            y="102"
            width="48"
            height="150"
            rx="6"
            fill={tapeColor}
            opacity="0.9"
          />
        </svg>
      )}
    </div>
  );
}
