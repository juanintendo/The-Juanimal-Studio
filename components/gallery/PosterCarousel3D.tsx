"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Link from "next/link";
import type { GalleryProject } from "@/lib/gallery/projects";
import { playPaperHover } from "@/lib/gallery/galleryAudio";

interface PosterCarousel3DProps {
  projects: GalleryProject[];
  jumpRequest: { idx: number; nonce: number } | null;
  reduced: boolean;
  onFocusChange: (idx: number) => void;
  onHoverChange: (idx: number | null) => void;
  onSelectProject: (project: GalleryProject) => void;
  onReady: () => void;
}

const POSTER_VERT = `
  varying vec2 vUv;
  varying float vBend;
  uniform float uVelocity;
  uniform float uHover;
  uniform float uTime;
  uniform float uMotionScale;
  uniform vec2 uPointer;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Velocity-driven S-wave paper flex like wheat-pasted posters sliding in space
    float curveY = sin(uv.y * 3.14159265);
    float curveX = (uv.x - 0.5) * 2.0;
    float velBend = -curveX * uVelocity * 0.24 - curveY * abs(uVelocity) * 0.16;

    // Subtle wind flutter + hover belly lift toward cursor
    float flutter = sin(uv.y * 5.2 + uTime * 1.9 + uv.x * 2.4) * 0.018 * uMotionScale;
    float hoverLift = sin(uv.x * 3.14159265) * sin(uv.y * 3.14159265) * 0.095 * uHover;
    float tiltX = (uPointer.x * (uv.x - 0.5) * 0.12 - uPointer.y * (uv.y - 0.5) * 0.10) * uHover * uMotionScale;

    pos.z += velBend + flutter + hoverLift + tiltX;
    vBend = clamp(abs(velBend) * 2.5, 0.0, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const POSTER_FRAG = `
  varying vec2 vUv;
  varying float vBend;
  uniform sampler2D uMap;
  uniform sampler2D uNormals;
  uniform float uHover;
  uniform float uFocusWeight;
  uniform vec2 uPointer;

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    vec3 nSample = texture2D(uNormals, vUv * vec2(0.85, 1.15)).rgb * 2.0 - 1.0;

    // Crumple relief depth relaxes slightly when zoomed/hovered so artwork reads crisply
    float relief = mix(0.36, 0.22, uHover) + vBend * 0.14;
    vec3 n = normalize(vec3(nSample.xy * relief, 1.0));

    // Dynamic gallery light responding gently to cursor position
    vec3 lightDir = normalize(vec3(0.32 + uPointer.x * 0.45, 0.55 - uPointer.y * 0.35, 1.0));
    float diff = clamp(dot(n, lightDir), 0.72, 1.08);

    // Subtle paper fiber specular catch across folded ridges
    vec3 halfVec = normalize(lightDir + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, halfVec), 0.0), 22.0) * (0.04 + 0.05 * uHover);

    vec3 col = tex.rgb * diff + vec3(spec);

    // Subtle archival matte soften for far-off side posters
    float vignette = mix(0.92, 1.0, uFocusWeight);
    col *= vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function modPositive(val: number, len: number): number {
  return ((val % len) + len) % len;
}

export default function PosterCarousel3D({
  projects,
  jumpRequest,
  reduced,
  onFocusChange,
  onHoverChange,
  onSelectProject,
  onReady,
}: PosterCarousel3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [webglReady, setWebglReady] = useState(true);

  const reducedRef = useRef(reduced);
  const onFocusRef = useRef(onFocusChange);
  const onHoverRef = useRef(onHoverChange);
  const onSelectRef = useRef(onSelectProject);
  const onReadyRef = useRef(onReady);
  const targetScrollRef = useRef(0);
  const currentScrollRef = useRef(0);
  const lastInputTimeRef = useRef(0);

  reducedRef.current = reduced;
  onFocusRef.current = onFocusChange;
  onHoverRef.current = onHoverChange;
  onSelectRef.current = onSelectProject;
  onReadyRef.current = onReady;

  const stride = 3.25;
  const totalCount = projects.length;
  const loopW = totalCount * stride;

  useEffect(() => {
    if (!jumpRequest) return;
    const targetRaw = jumpRequest.idx * stride;
    const cur = targetScrollRef.current;
    const curMod = modPositive(cur, loopW);
    let delta = targetRaw - curMod;
    if (delta > loopW * 0.5) delta -= loopW;
    if (delta < -loopW * 0.5) delta += loopW;
    targetScrollRef.current = cur + delta;
    lastInputTimeRef.current = performance.now();
  }, [jumpRequest, loopW, stride]);

  useEffect(() => {
    const container = hostRef.current;
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
      onReadyRef.current();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const initW = container.clientWidth || 1280;
    const initH = container.clientHeight || 720;
    renderer.setPixelRatio(dpr);
    renderer.setSize(initW, initH);
    renderer.domElement.className = "jd-webgl-canvas";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      34,
      initW / Math.max(1, initH),
      0.1,
      80
    );

    const posterW = 2.55;
    const posterH = 3.40;
    const posterGeo = new THREE.PlaneGeometry(posterW, posterH, 28, 36);
    const shadowGeo = new THREE.PlaneGeometry(posterW * 1.01, posterH * 1.01);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x15131a,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });

    const createdTextures: THREE.Texture[] = [];
    const createdMats: THREE.Material[] = [shadowMat];

    const fallbackPosterTex = new THREE.DataTexture(
      new Uint8Array([240, 234, 224, 255]),
      1,
      1,
      THREE.RGBAFormat
    );
    fallbackPosterTex.needsUpdate = true;

    const flatNormalTex = new THREE.DataTexture(
      new Uint8Array([128, 128, 255, 255]),
      1,
      1,
      THREE.RGBAFormat
    );
    flatNormalTex.needsUpdate = true;
    createdTextures.push(fallbackPosterTex, flatNormalTex);

    const loader = new THREE.TextureLoader();
    let disposed = false;
    let readyFired = false;
    let loadedInitialCount = 0;

    const markLoaded = () => {
      loadedInitialCount += 1;
      if (!readyFired && loadedInitialCount >= Math.min(4, totalCount)) {
        readyFired = true;
        onReadyRef.current();
      }
    };

    const readyTimeout = setTimeout(() => {
      if (!readyFired) {
        readyFired = true;
        onReadyRef.current();
      }
    }, 1100);

    const loadTex = (
      url: string,
      wrapRepeat = false,
      onDone?: (tex: THREE.Texture) => void
    ) => {
      loader.load(
        url,
        (tex) => {
          if (disposed) {
            tex.dispose();
            return;
          }
          tex.wrapS = wrapRepeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
          tex.wrapT = wrapRepeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          tex.needsUpdate = true;
          createdTextures.push(tex);
          onDone?.(tex);
        },
        undefined,
        () => {
          markLoaded();
        }
      );
    };

    interface PosterRig {
      idx: number;
      project: GalleryProject;
      group: THREE.Group;
      mesh: THREE.Mesh;
      shadowMesh: THREE.Mesh;
      hoverVal: number;
      uniforms: {
        uMap: { value: THREE.Texture };
        uNormals: { value: THREE.Texture };
        uVelocity: { value: number };
        uHover: { value: number };
        uTime: { value: number };
        uMotionScale: { value: number };
        uPointer: { value: THREE.Vector2 };
        uFocusWeight: { value: number };
      };
    }

    const posterRigs: PosterRig[] = [];
    const hitTargets: THREE.Mesh[] = [];

    const sharedNormals = { value: flatNormalTex as THREE.Texture };
    loadTex("/images/gallery/paper-normals.png", true, (tex) => {
      sharedNormals.value = tex;
      posterRigs.forEach((rig) => {
        rig.uniforms.uNormals.value = tex;
      });
    });

    projects.forEach((project, idx) => {
      const group = new THREE.Group();
      scene.add(group);

      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(0.08, -0.10, -0.09);
      group.add(shadowMesh);

      const uniforms: PosterRig["uniforms"] = {
        uMap: { value: fallbackPosterTex },
        uNormals: { value: sharedNormals.value },
        uVelocity: { value: 0 },
        uHover: { value: 0 },
        uTime: { value: 0 },
        uMotionScale: { value: 1 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uFocusWeight: { value: 1 },
      };

      const mat = new THREE.ShaderMaterial({
        vertexShader: POSTER_VERT,
        fragmentShader: POSTER_FRAG,
        uniforms,
      });
      createdMats.push(mat);

      const mesh = new THREE.Mesh(posterGeo, mat);
      mesh.userData = { idx };
      group.add(mesh);
      hitTargets.push(mesh);

      // Slight varied tilt angle for organic pasted-poster feel
      const restTilt = ((idx % 2 === 0 ? -1 : 1) * (0.012 + (idx % 3) * 0.004));
      group.rotation.z = restTilt;

      posterRigs.push({
        idx,
        project,
        group,
        mesh,
        shadowMesh,
        hoverVal: 0,
        uniforms,
      });

      loadTex(project.posterSrc, false, (tex) => {
        uniforms.uMap.value = tex;
        markLoaded();
      });
    });

    const fitCamera = (w: number, h: number) => {
      const aspect = Math.max(0.42, w / Math.max(1, h));
      const fov = aspect < 1 ? 42 : 34;
      const halfTanV = Math.tan(THREE.MathUtils.degToRad(fov * 0.5));
      const halfTanH = halfTanV * aspect;
      const zH = (posterH * 1.48) / (2 * halfTanV);
      const zW = (posterW * 1.28) / (2 * halfTanH);
      camera.fov = fov;
      camera.aspect = aspect;
      camera.position.set(0, 0.04, Math.max(zH, zW));
      camera.updateProjectionMatrix();
    };

    fitCamera(initW, initH);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1280;
      const h = container.clientHeight || 720;
      fitCamera(w, h);
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => onResize())
        : null;
    resizeObserver?.observe(container);

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(0, 0);
    let pointerX = 0;
    let pointerY = 0;
    let hoveredIdx: number | null = null;
    let isDragging = false;
    let dragStartX = 0;
    let dragLastX = 0;
    let dragMoved = 0;
    let lastFocusReported = 0;

    const updateHover = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointerX = THREE.MathUtils.clamp(((clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      pointerY = THREE.MathUtils.clamp(-((clientY - rect.top) / rect.height) * 2 + 1, -1, 1);
      pointerNdc.set(pointerX, pointerY);
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitTargets, false);
      const nextHover = hits.length > 0 ? Number(hits[0].object.userData.idx ?? -1) : null;
      const resolved = nextHover !== null && nextHover >= 0 ? nextHover : null;
      if (resolved !== hoveredIdx) {
        hoveredIdx = resolved;
        onHoverRef.current(resolved);
        renderer.domElement.style.cursor = resolved !== null ? "pointer" : "grab";
        if (resolved !== null && !reducedRef.current) {
          playPaperHover();
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const raw = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      targetScrollRef.current += raw * 0.0056;
      lastInputTimeRef.current = performance.now();
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragLastX = e.clientX;
      dragMoved = 0;
      renderer.domElement.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      updateHover(e.clientX, e.clientY);
      if (!isDragging) return;
      const dx = e.clientX - dragLastX;
      dragLastX = e.clientX;
      dragMoved += Math.abs(dx);
      targetScrollRef.current -= dx * 0.009;
      lastInputTimeRef.current = performance.now();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      renderer.domElement.style.cursor = hoveredIdx !== null ? "pointer" : "grab";
      const totalMoved = Math.hypot(e.clientX - dragStartX, dragMoved);
      if (totalMoved > 12) return;

      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointerNdc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitTargets, false);
      if (hits.length > 0) {
        const hitIdx = Number(hits[0].object.userData.idx ?? -1);
        const rig = posterRigs[hitIdx];
        if (!rig) return;
        if (Math.abs(rig.group.position.x) > 1.75) {
          // Center off-axis poster smoothly first
          const delta = rig.group.position.x;
          targetScrollRef.current += delta;
          lastInputTimeRef.current = performance.now();
        } else {
          onSelectRef.current(rig.project);
        }
      }
    };

    const onPointerLeave = () => {
      isDragging = false;
      if (hoveredIdx !== null) {
        hoveredIdx = null;
        onHoverRef.current(null);
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("wheel", onWheel, { passive: false });
    domEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    domEl.addEventListener("pointerleave", onPointerLeave);

    let rafId = 0;
    let prevNow = performance.now();
    let smoothVel = 0;

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - prevNow) / 1000);
      prevNow = now;

      // Subtle magnetic settle onto nearest poster when user stops scrolling/dragging
      if (!isDragging && now - lastInputTimeRef.current > 460) {
        const nearest = Math.round(targetScrollRef.current / stride) * stride;
        targetScrollRef.current = THREE.MathUtils.lerp(
          targetScrollRef.current,
          nearest,
          Math.min(1, dt * 4.5)
        );
      }

      const prevScroll = currentScrollRef.current;
      const lerpAmt = reducedRef.current ? 1 : Math.min(1, dt * 9.5);
      currentScrollRef.current = THREE.MathUtils.lerp(
        prevScroll,
        targetScrollRef.current,
        lerpAmt
      );

      const instVel = THREE.MathUtils.clamp(
        (currentScrollRef.current - prevScroll) / Math.max(0.008, dt) * 0.085,
        -1.3,
        1.3
      );
      smoothVel = THREE.MathUtils.lerp(smoothVel, instVel, Math.min(1, dt * 12));

      const focusIdx =
        modPositive(Math.round(currentScrollRef.current / stride), totalCount);
      if (focusIdx !== lastFocusReported) {
        lastFocusReported = focusIdx;
        onFocusRef.current(focusIdx);
      }

      const tSec = now * 0.001;
      const mScale = reducedRef.current ? 0 : 1;

      for (let i = 0; i < posterRigs.length; i += 1) {
        const rig = posterRigs[i];
        const rawX = i * stride - currentScrollRef.current;
        const relX =
          modPositive(rawX + loopW * 0.5, loopW) - loopW * 0.5;

        const isHov = hoveredIdx === i;
        rig.hoverVal = THREE.MathUtils.lerp(
          rig.hoverVal,
          isHov ? 1 : 0,
          Math.min(1, dt * 10)
        );

        const distNorm = THREE.MathUtils.clamp(Math.abs(relX) / (stride * 1.45), 0, 1);
        const arcZ = -distNorm * distNorm * 0.65;
        const arcRotY = THREE.MathUtils.clamp(-relX * 0.042, -0.22, 0.22);

        rig.group.position.x = relX;
        rig.group.position.y =
          Math.sin(tSec * 1.1 + i * 0.9) * 0.024 * mScale + rig.hoverVal * 0.06;
        rig.group.position.z = arcZ + rig.hoverVal * 0.34;
        rig.group.rotation.y = arcRotY + pointerX * 0.028 * rig.hoverVal * mScale;
        rig.group.rotation.x = -pointerY * 0.022 * rig.hoverVal * mScale;

        const focusW = THREE.MathUtils.clamp(1.0 - distNorm * 0.72, 0.3, 1.0);
        rig.uniforms.uVelocity.value = reducedRef.current ? 0 : smoothVel;
        rig.uniforms.uHover.value = rig.hoverVal;
        rig.uniforms.uTime.value = tSec + i * 1.3;
        rig.uniforms.uMotionScale.value = mScale;
        rig.uniforms.uPointer.value.set(pointerX, pointerY);
        rig.uniforms.uFocusWeight.value = focusW;

        rig.shadowMesh.renderOrder = isHov ? 19 : 9;
        rig.mesh.renderOrder = isHov ? 20 : 10;
      }

      // Gentle camera parallax
      const swayScale = reducedRef.current ? 0 : 0.14;
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        pointerX * swayScale,
        Math.min(1, dt * 6)
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        0.04 + pointerY * (swayScale * 0.65),
        Math.min(1, dt * 6)
      );

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      clearTimeout(readyTimeout);
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      domEl.removeEventListener("wheel", onWheel);
      domEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      domEl.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
      posterGeo.dispose();
      shadowGeo.dispose();
      createdMats.forEach((m) => m.dispose());
      createdTextures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [loopW, projects, stride, totalCount]);

  if (!webglReady) {
    return (
      <div className="jd-fallback-strip">
        {projects.map((p) => (
          <Link key={p.slug} href={`/poster-work/${p.slug}`} className="jd-fallback-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.posterSrc} alt={p.title} className="jd-fallback-img" />
            <span className="jd-fallback-title">
              {p.num} · {p.title}
            </span>
          </Link>
        ))}
      </div>
    );
  }

  return <div ref={hostRef} className="jd-webgl-host" />;
}
