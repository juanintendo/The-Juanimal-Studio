"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface RamsesStageProps {
  activePanel: number;
  overviewMode: boolean;
  revealedPanels: boolean[];
  waveOrigins: Array<[number, number]>;
  discoPlaying: boolean;
  shakeNonce: number;
  reduced: boolean;
  onPanelClick: (panelIdx: number, uv?: { x: number; y: number }) => void;
}

interface BoardPanelSlot {
  x: number;
  y: number;
  rotZ: number;
  hasFg: boolean;
  num: string;
}

const BOARD_SLOTS: BoardPanelSlot[] = [
  { x: -7.65, y: 2.38, rotZ: -0.022, hasFg: true, num: "01" },
  { x: -2.55, y: 2.18, rotZ: 0.018, hasFg: false, num: "02" },
  { x: 2.55, y: 2.38, rotZ: -0.016, hasFg: false, num: "03" },
  { x: 7.65, y: 2.16, rotZ: 0.024, hasFg: false, num: "04" },
  { x: -7.55, y: -2.26, rotZ: 0.020, hasFg: false, num: "05" },
  { x: -2.50, y: -2.44, rotZ: -0.022, hasFg: true, num: "06" },
  { x: 2.58, y: -2.24, rotZ: 0.018, hasFg: true, num: "07" },
  { x: 7.65, y: -2.42, rotZ: -0.016, hasFg: false, num: "08" },
];

function createComicSparkleTexture(fillHex: string): THREE.CanvasTexture {
  const size = 128;
  const cx = size * 0.5;
  const cy = size * 0.5;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    const outerR = 48;
    const innerR = 13;
    ctx.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const ang = (i * Math.PI) / 4;
      const rad = i % 2 === 0 ? outerR : innerR;
      const px = cx + Math.cos(ang) * rad;
      const py = cy + Math.sin(ang) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fillHex;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#161420";
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function createPanel08CardTexture(): THREE.CanvasTexture {
  const w = 1200;
  const h = 900;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#FAF8F4";
    ctx.fillRect(0, 0, w, h);

    // Pop stripes across bottom rug preview
    ctx.fillStyle = "#7E7EFF";
    ctx.fillRect(0, 620, w, 280);
    ctx.fillStyle = "#F894C0";
    for (let x = -80; x < w + 80; x += 150) {
      ctx.beginPath();
      ctx.moveTo(x, 620);
      ctx.lineTo(x + 70, 620);
      ctx.lineTo(x + 30, h);
      ctx.lineTo(x - 40, h);
      ctx.closePath();
      ctx.fill();
    }

    // Golden sunbeam diagonal column
    ctx.fillStyle = "rgba(255, 225, 77, 0.72)";
    ctx.beginPath();
    ctx.moveTo(410, 0);
    ctx.lineTo(790, 0);
    ctx.lineTo(930, h);
    ctx.lineTo(270, h);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#161420";
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    // Playable emblem center badge
    ctx.fillStyle = "#FFE14D";
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.44, 155, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = "#161420";
    ctx.font = "900 116px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("08", w * 0.5, h * 0.42);
    ctx.font = "800 34px sans-serif";
    ctx.fillText("SUNBEAM FINALE ★", w * 0.5, h * 0.54);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

const PANEL_VERT = `
  varying vec2 vUv;
  uniform float uVelocity;
  uniform float uTime;
  uniform float uMotionScale;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float arch = sin(uv.x * 3.14159265);
    pos.z += arch * uVelocity * 0.16;
    pos.z += sin(uv.y * 3.14159265 + uTime * 2.1) * 0.012 * uMotionScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const PANEL_FRAG = `
  varying vec2 vUv;
  uniform sampler2D uBwTex;
  uniform sampler2D uColorTex;
  uniform float uReveal;
  uniform vec2 uWaveOrigin;
  uniform float uTime;
  uniform vec2 uHoverUv;
  uniform float uHoverStrength;
  uniform float uBeatPulse;

  void main() {
    vec2 zoomCenter = vec2(0.5);
    vec2 sampleUv = mix(vUv, zoomCenter + (vUv - zoomCenter) * (1.0 - uBeatPulse * 0.022), uBeatPulse);
    vec4 bwCol = texture2D(uBwTex, sampleUv);
    vec4 colTex = texture2D(uColorTex, sampleUv);

    vec2 d = (vUv - uWaveOrigin) * vec2(1.3333, 1.0);
    float dist = length(d);
    float waveNoise =
      sin(d.x * 16.0 + uTime * 3.2) * 0.028 +
      cos(d.y * 18.0 - uTime * 2.5) * 0.028;
    float edgeDist = dist + waveNoise;
    float radius = uReveal * 1.82;

    float revealMask = step(0.002, uReveal) * (1.0 - smoothstep(radius - 0.055, radius + 0.018, edgeDist));

    // Three-band Pop-Color shockwave frontier while expanding
    float activeSweep = step(0.01, uReveal) * (1.0 - smoothstep(0.92, 1.0, uReveal));
    float bandOuter = (smoothstep(radius - 0.10, radius - 0.05, edgeDist) - smoothstep(radius - 0.01, radius + 0.02, edgeDist)) * activeSweep;
    float bandMid   = (smoothstep(radius - 0.06, radius - 0.03, edgeDist) - smoothstep(radius - 0.01, radius + 0.01, edgeDist)) * activeSweep;

    float hoverDist = length((vUv - uHoverUv) * vec2(1.3333, 1.0));
    float peekMask = smoothstep(0.24, 0.05, hoverDist) * uHoverStrength * (1.0 - revealMask);

    float colorMix = clamp(max(revealMask, peekMask), 0.0, 1.0);
    vec3 baseRgb = mix(bwCol.rgb, colTex.rgb, colorMix);

    vec3 periwinkle = vec3(0.494, 0.494, 1.0);
    vec3 bubblePink = vec3(0.973, 0.580, 0.753);
    vec3 sunGold    = vec3(1.0, 0.882, 0.302);
    vec3 waveHue = mix(periwinkle, bubblePink, 0.5 + 0.5 * sin(uTime * 4.0 + edgeDist * 10.0));
    waveHue = mix(waveHue, sunGold, clamp(bandMid * 1.4, 0.0, 1.0));

    baseRgb = mix(baseRgb, waveHue, clamp(bandOuter * 0.85, 0.0, 0.85));
    baseRgb += sunGold * (uBeatPulse * 0.06);

    gl_FragColor = vec4(baseRgb, 1.0);
  }
`;

const FG_FRAG = `
  varying vec2 vUv;
  uniform sampler2D uFgTex;
  uniform float uReveal;
  uniform float uBeatPulse;

  void main() {
    vec4 tx = texture2D(uFgTex, vUv);
    if (tx.a < 0.03) discard;
    float luma = dot(tx.rgb, vec3(0.299, 0.587, 0.114));
    vec3 mono = mix(vec3(0.98, 0.97, 0.95), vec3(0.086, 0.078, 0.125), smoothstep(0.92, 0.18, luma));
    vec3 col = mix(mono, tx.rgb, smoothstep(0.12, 0.65, uReveal));
    col += vec3(0.973, 0.580, 0.753) * (uBeatPulse * 0.05);
    gl_FragColor = vec4(col, tx.a);
  }
`;

export default function RamsesComicStage3D({
  activePanel,
  overviewMode,
  revealedPanels,
  waveOrigins,
  discoPlaying,
  shakeNonce,
  reduced,
  onPanelClick,
}: RamsesStageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [webglReady, setWebglReady] = useState(true);

  const activePanelRef = useRef(activePanel);
  const overviewRef = useRef(overviewMode);
  const revealedRef = useRef(revealedPanels);
  const waveOriginsRef = useRef(waveOrigins);
  const discoRef = useRef(discoPlaying);
  const reducedRef = useRef(reduced);
  const onPanelClickRef = useRef(onPanelClick);
  const shakePowerRef = useRef(0);

  activePanelRef.current = activePanel;
  overviewRef.current = overviewMode;
  revealedRef.current = revealedPanels;
  waveOriginsRef.current = waveOrigins;
  discoRef.current = discoPlaying;
  reducedRef.current = reduced;
  onPanelClickRef.current = onPanelClick;

  useEffect(() => {
    if (shakeNonce > 0 && !reducedRef.current) {
      shakePowerRef.current = 1.0;
    }
  }, [shakeNonce]);

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
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth || 1200, container.clientHeight || 720);
    renderer.domElement.className = "rm-canvas";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 720;
    const camera = new THREE.PerspectiveCamera(
      34,
      width / Math.max(1, height),
      0.1,
      120
    );

    const panelW = 4.4;
    const panelH = 3.3;

    // Floating starburst sparkle particles behind comic board
    const starTexGold = createComicSparkleTexture("#FFE14D");
    const starTexPink = createComicSparkleTexture("#F894C0");
    const card08Tex = createPanel08CardTexture();

    const makeStarfield = (count: number, tex: THREE.CanvasTexture, size: number) => {
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 32;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 2] = -3.4 - Math.random() * 5.0;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        map: tex,
        size,
        transparent: true,
        opacity: 0.72,
        alphaTest: 0.04,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      return { geo, mat, pts };
    };

    const starGold = makeStarfield(48, starTexGold, 0.42);
    const starPink = makeStarfield(36, starTexPink, 0.34);

    const boardGroup = new THREE.Group();
    scene.add(boardGroup);

    const fallbackTex = new THREE.DataTexture(
      new Uint8Array([250, 248, 244, 255]),
      1,
      1,
      THREE.RGBAFormat
    );
    fallbackTex.needsUpdate = true;

    const emptyFgTex = new THREE.DataTexture(
      new Uint8Array([0, 0, 0, 0]),
      1,
      1,
      THREE.RGBAFormat
    );
    emptyFgTex.needsUpdate = true;

    const createdTextures: THREE.Texture[] = [
      starTexGold,
      starTexPink,
      card08Tex,
      fallbackTex,
      emptyFgTex,
    ];
    const createdGeos: THREE.BufferGeometry[] = [];
    const createdMats: THREE.Material[] = [];

    const borderGeo = new THREE.PlaneGeometry(panelW + 0.22, panelH + 0.22);
    const artGeo = new THREE.PlaneGeometry(panelW, panelH, 24, 16);
    const fgGeo = new THREE.PlaneGeometry(panelW * 1.07, panelH * 1.07);
    createdGeos.push(borderGeo, artGeo, fgGeo);

    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x161420 });
    const borderMat = new THREE.MeshBasicMaterial({ color: 0x161420 });
    createdMats.push(shadowMat, borderMat);

    interface PanelRig {
      idx: number;
      group: THREE.Group;
      hitMesh: THREE.Mesh;
      fgMesh: THREE.Mesh | null;
      revealVal: number;
      hoverStrength: number;
      uniforms: {
        uBwTex: { value: THREE.Texture };
        uColorTex: { value: THREE.Texture };
        uReveal: { value: number };
        uWaveOrigin: { value: THREE.Vector2 };
        uTime: { value: number };
        uHoverUv: { value: THREE.Vector2 };
        uHoverStrength: { value: number };
        uBeatPulse: { value: number };
        uVelocity: { value: number };
        uMotionScale: { value: number };
      };
      fgUniforms: {
        uFgTex: { value: THREE.Texture };
        uReveal: { value: number };
        uBeatPulse: { value: number };
      } | null;
    }

    const panelRigs: PanelRig[] = [];
    const hitTargets: THREE.Mesh[] = [];
    const loader = new THREE.TextureLoader();
    let disposed = false;

    const loadTex = (url: string): Promise<THREE.Texture> =>
      new Promise((resolve, reject) => {
        loader.load(
          url,
          (tex) => {
            if (disposed) {
              tex.dispose();
              return;
            }
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            tex.needsUpdate = true;
            createdTextures.push(tex);
            resolve(tex);
          },
          undefined,
          reject
        );
      });

    BOARD_SLOTS.forEach((slot, idx) => {
      const group = new THREE.Group();
      group.position.set(slot.x, slot.y, 0);
      group.rotation.z = slot.rotZ;
      boardGroup.add(group);

      // Offset bold #161420 drop shadow + outer ink panel border
      const shadowMesh = new THREE.Mesh(borderGeo, shadowMat);
      shadowMesh.position.set(0.14, -0.14, -0.07);
      group.add(shadowMesh);

      const borderMesh = new THREE.Mesh(borderGeo, borderMat);
      borderMesh.position.set(0, 0, -0.03);
      group.add(borderMesh);

      const isFinalCard = idx === 7;
      const uniforms: PanelRig["uniforms"] = {
        uBwTex: { value: isFinalCard ? card08Tex : fallbackTex },
        uColorTex: { value: isFinalCard ? card08Tex : fallbackTex },
        uReveal: { value: isFinalCard ? 1 : 0 },
        uWaveOrigin: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uHoverUv: { value: new THREE.Vector2(0.5, 0.5) },
        uHoverStrength: { value: 0 },
        uBeatPulse: { value: 0 },
        uVelocity: { value: 0 },
        uMotionScale: { value: 1 },
      };

      const panelMat = new THREE.ShaderMaterial({
        vertexShader: PANEL_VERT,
        fragmentShader: PANEL_FRAG,
        uniforms,
      });
      createdMats.push(panelMat);

      const artMesh = new THREE.Mesh(artGeo, panelMat);
      artMesh.userData = { panelIdx: idx };
      group.add(artMesh);
      hitTargets.push(artMesh);

      let fgMesh: THREE.Mesh | null = null;
      let fgUniforms: PanelRig["fgUniforms"] = null;
      if (slot.hasFg) {
        fgUniforms = {
          uFgTex: { value: emptyFgTex },
          uReveal: { value: 0 },
          uBeatPulse: { value: 0 },
        };
        const fgMat = new THREE.ShaderMaterial({
          vertexShader: PANEL_VERT,
          fragmentShader: FG_FRAG,
          uniforms: {
            ...fgUniforms,
            uVelocity: uniforms.uVelocity,
            uTime: uniforms.uTime,
            uMotionScale: uniforms.uMotionScale,
          },
          transparent: true,
          depthWrite: false,
        });
        createdMats.push(fgMat);
        fgMesh = new THREE.Mesh(fgGeo, fgMat);
        fgMesh.position.set(0, 0.04, 0.28);
        group.add(fgMesh);
      }

      panelRigs.push({
        idx,
        group,
        hitMesh: artMesh,
        fgMesh,
        revealVal: isFinalCard ? 1 : 0,
        hoverStrength: 0,
        uniforms,
        fgUniforms,
      });

      if (!isFinalCard) {
        loadTex(`/images/ramses/panels/panel-${slot.num}-bw.png`)
          .then((tex) => {
            uniforms.uBwTex.value = tex;
          })
          .catch(() => {});

        loadTex(`/images/ramses/panels/panel-${slot.num}-color.png`)
          .then((tex) => {
            uniforms.uColorTex.value = tex;
          })
          .catch(() => {});

        if (slot.hasFg && fgUniforms) {
          loadTex(`/images/ramses/panels/panel-${slot.num}-fg.png`)
            .then((tex) => {
              if (fgUniforms) fgUniforms.uFgTex.value = tex;
            })
            .catch(() => {});
        }
      }
    });

    // Helper: compute exact camera target pose based on aspect ratios so panels fit Desktop, Portrait, and Mobile Landscape cleanly
    const computeCameraTarget = (
      w: number,
      h: number,
      panelIdx: number,
      isOverview: boolean
    ) => {
      const aspect = Math.max(0.45, w / Math.max(1, h));
      const fov = aspect < 1 ? 42 : 34;
      const halfTanV = Math.tan(THREE.MathUtils.degToRad(fov * 0.5));
      const halfTanH = halfTanV * aspect;

      if (isOverview) {
        const boardW = 20.6;
        const boardH = 9.2;
        const zH = (boardH * 1.18) / (2 * halfTanV);
        const zW = (boardW * 1.12) / (2 * halfTanH);
        return {
          x: 0,
          y: -0.05,
          z: Math.max(zH, zW),
          rotZ: 0,
          fov,
        };
      }

      const slot = BOARD_SLOTS[panelIdx] ?? BOARD_SLOTS[0];
      const isCompactLand = aspect >= 1 && h < 520;
      const marginH = isCompactLand ? 1.38 : aspect < 1 ? 1.56 : 1.44;
      const marginW = isCompactLand ? 1.24 : aspect < 1 ? 1.18 : 1.36;
      const zH = (panelH * marginH) / (2 * halfTanV);
      const zW = (panelW * marginW) / (2 * halfTanH);
      return {
        x: slot.x,
        y: slot.y - (isCompactLand ? 0.14 : 0.22),
        z: Math.max(zH, zW),
        rotZ: slot.rotZ * 0.35,
        fov,
      };
    };

    const initTarget = computeCameraTarget(
      width,
      height,
      activePanelRef.current,
      overviewRef.current
    );
    camera.fov = initTarget.fov;
    camera.aspect = width / Math.max(1, height);
    camera.position.set(initTarget.x, initTarget.y, initTarget.z);
    camera.rotation.z = initTarget.rotZ;
    camera.updateProjectionMatrix();

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(0, 0);
    let pointerNormX = 0;
    let pointerNormY = 0;
    let hoveredIdx = -1;
    let downX = 0;
    let downY = 0;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointerNormX = THREE.MathUtils.clamp(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -1,
        1
      );
      pointerNormY = THREE.MathUtils.clamp(
        -((clientY - rect.top) / rect.height) * 2 + 1,
        -1,
        1
      );
      pointerNdc.set(pointerNormX, pointerNormY);
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitTargets, false);
      if (hits.length > 0 && hits[0].uv) {
        const idx = Number(hits[0].object.userData.panelIdx ?? -1);
        hoveredIdx = idx;
        const rig = panelRigs[idx];
        if (rig) {
          rig.uniforms.uHoverUv.value.copy(hits[0].uv);
        }
      } else {
        hoveredIdx = -1;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (moved > 12) return;
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointerNdc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(hitTargets, false);
      if (hits.length > 0) {
        const hit = hits[0];
        const idx = Number(hit.object.userData.panelIdx ?? -1);
        if (idx >= 0) {
          onPanelClickRef.current(
            idx,
            hit.uv ? { x: hit.uv.x, y: hit.uv.y } : undefined
          );
        }
      }
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove, { passive: true });
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    let orientTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 1200;
      const h = container.clientHeight || 720;
      camera.aspect = w / Math.max(1, h);
      const tgt = computeCameraTarget(
        w,
        h,
        activePanelRef.current,
        overviewRef.current
      );
      camera.fov = tgt.fov;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const onOrientationChange = () => {
      if (orientTimer) clearTimeout(orientTimer);
      orientTimer = setTimeout(onResize, 140);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientationChange);

    let camX = initTarget.x;
    let camY = initTarget.y;
    let camZ = initTarget.z;
    let camRotZ = initTarget.rotZ;
    let prevCamX = camX;
    let prevCamY = camY;
    let camVel = 0;
    let rafId = 0;
    let prevTime = performance.now();

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;

      const curW = container.clientWidth || 1200;
      const curH = container.clientHeight || 720;
      const tgt = computeCameraTarget(
        curW,
        curH,
        activePanelRef.current,
        overviewRef.current
      );

      if (Math.abs(camera.fov - tgt.fov) > 0.05) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, tgt.fov, Math.min(1, dt * 8));
        camera.updateProjectionMatrix();
      }

      const speedFactor = reducedRef.current ? 1 : Math.min(1, dt * 6.5);
      camX = THREE.MathUtils.lerp(camX, tgt.x, speedFactor);
      camY = THREE.MathUtils.lerp(camY, tgt.y, speedFactor);
      camZ = THREE.MathUtils.lerp(camZ, tgt.z, speedFactor);
      camRotZ = THREE.MathUtils.lerp(camRotZ, tgt.rotZ, speedFactor);

      const dx = camX - prevCamX;
      const dy = camY - prevCamY;
      prevCamX = camX;
      prevCamY = camY;
      const instantSpeed = THREE.MathUtils.clamp(Math.hypot(dx, dy) * 3.5, 0, 1);
      camVel = THREE.MathUtils.lerp(camVel, instantSpeed, Math.min(1, dt * 10));

      let shakeX = 0;
      let shakeY = 0;
      if (shakePowerRef.current > 0.01) {
        shakePowerRef.current = Math.max(0, shakePowerRef.current - dt * 2.4);
        const amp = shakePowerRef.current * 0.14;
        shakeX = Math.sin(now * 0.075) * amp;
        shakeY = Math.cos(now * 0.092) * amp;
      }

      const swayScale = overviewRef.current || reducedRef.current ? 0.06 : 0.22;
      camera.position.set(
        camX + pointerNormX * swayScale + shakeX,
        camY + pointerNormY * (swayScale * 0.65) + shakeY,
        camZ
      );
      camera.rotation.z = camRotZ;
      camera.rotation.y = -pointerNormX * (overviewRef.current ? 0.018 : 0.032);
      camera.rotation.x = pointerNormY * (overviewRef.current ? 0.014 : 0.024);

      const tSec = now * 0.001;
      const mScale = reducedRef.current ? 0 : 1;
      const discoPulse =
        discoRef.current && !reducedRef.current
          ? Math.pow(0.5 + 0.5 * Math.sin(tSec * ((116 / 60) * Math.PI * 2)), 2)
          : 0;

      for (let i = 0; i < panelRigs.length; i += 1) {
        const rig = panelRigs[i];
        const isFinal = i === 7;
        const targetRev = isFinal ? 1 : revealedRef.current[i] ? 1 : 0;
        if (reducedRef.current) {
          rig.revealVal = targetRev;
        } else {
          rig.revealVal = THREE.MathUtils.lerp(
            rig.revealVal,
            targetRev,
            Math.min(1, dt * (targetRev > rig.revealVal ? 2.4 : 4.2))
          );
        }

        const isHovered = hoveredIdx === i;
        rig.hoverStrength = THREE.MathUtils.lerp(
          rig.hoverStrength,
          isHovered ? 1 : 0,
          Math.min(1, dt * 10)
        );

        const wo = waveOriginsRef.current[i] ?? [0.5, 0.5];
        rig.uniforms.uWaveOrigin.value.set(wo[0], wo[1]);
        rig.uniforms.uReveal.value = rig.revealVal;
        rig.uniforms.uTime.value = tSec;
        rig.uniforms.uHoverStrength.value = rig.hoverStrength;
        rig.uniforms.uBeatPulse.value = i === 5 ? discoPulse : 0;
        rig.uniforms.uVelocity.value = reducedRef.current ? 0 : camVel;
        rig.uniforms.uMotionScale.value = mScale;

        // Overview scale & active highlight lift
        const slot = BOARD_SLOTS[i];
        const targetZ =
          overviewRef.current && isHovered
            ? 0.42
            : activePanelRef.current === i && !overviewRef.current
              ? 0.25
              : 0;
        rig.group.position.z = THREE.MathUtils.lerp(
          rig.group.position.z,
          targetZ,
          Math.min(1, dt * 8)
        );
        const sLift = overviewRef.current && isHovered ? 1.04 : 1.0;
        rig.group.scale.setScalar(
          THREE.MathUtils.lerp(rig.group.scale.x, sLift, Math.min(1, dt * 8))
        );
        rig.group.rotation.z = slot.rotZ + (i === 5 ? discoPulse * 0.015 : 0);

        if (rig.fgMesh && rig.fgUniforms) {
          rig.fgUniforms.uReveal.value = rig.revealVal;
          rig.fgUniforms.uBeatPulse.value = i === 5 ? discoPulse : 0;
          const pScale = reducedRef.current ? 0 : 0.10;
          rig.fgMesh.position.x = pointerNormX * pScale;
          rig.fgMesh.position.y = 0.04 + pointerNormY * pScale + (i === 5 ? discoPulse * 0.04 : 0);
        }
      }

      starGold.pts.rotation.y = tSec * 0.018 * mScale;
      starPink.pts.rotation.y = -tSec * 0.014 * mScale;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      if (orientTimer) clearTimeout(orientTimer);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientationChange);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      createdGeos.forEach((g) => g.dispose());
      starGold.geo.dispose();
      starGold.mat.dispose();
      starPink.geo.dispose();
      starPink.mat.dispose();
      createdMats.forEach((m) => m.dispose());
      createdTextures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, []);

  if (!webglReady) {
    const num = `0${Math.min(7, activePanel + 1)}`;
    const isRev = revealedPanels[activePanel] ?? false;
    const fallbackSrc =
      activePanel < 7
        ? `/images/ramses/panels/panel-${num}-${isRev ? "color" : "bw"}.png`
        : "/images/ramses/card-disco.png";
    return (
      <div className="rm-webgl-fallback">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fallbackSrc}
          alt={`Ramsés Mania Panel ${num}`}
          className="rm-fallback-img"
        />
      </div>
    );
  }

  return <div ref={hostRef} className="rm-canvas-host" />;
}
