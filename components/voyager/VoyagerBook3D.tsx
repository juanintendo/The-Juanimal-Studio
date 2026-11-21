"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface VoyagerLayerSet {
  bg: string;
  letters: Record<"en" | "es", string>;
  mid: string;
  fg: string;
  text: Record<"en" | "es", string>;
  thumb: string;
}

export interface VoyagerSpreadSpec {
  id: string;
  layers: VoyagerLayerSet;
  navLabel: Record<"en" | "es", string>;
  title: Record<"en" | "es", string>;
  story: Record<"en" | "es", string>;
  macaFact: Record<"en" | "es", string>;
  parentPrompt: Record<"en" | "es", string>;
}

interface VoyagerBook3DProps {
  page: number; // 0 = front cover, 1..spreads.length = spread, spreads.length + 1 = back cover
  onChangePage: (nextPage: number) => void;
  lang: "en" | "es";
  reduced: boolean;
  gyroActive?: boolean;
  spreads: VoyagerSpreadSpec[];
  coverLayers: VoyagerLayerSet;
  backCoverLayers: VoyagerLayerSet;
  coverMainTitle: string;
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
  const radius = 62;
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
    grad.addColorStop(0.55, "rgba(4, 6, 15, 0.40)");
    grad.addColorStop(1, "rgba(4, 6, 15, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

function createEmptyTexture(): THREE.DataTexture {
  const tex = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

function createSolidTexture(r: number, g: number, b: number): THREE.DataTexture {
  const tex = new THREE.DataTexture(new Uint8Array([r, g, b, 255]), 1, 1, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

interface ParallaxUniformBundle {
  uHalfSide: { value: number };
  uGutterShade: { value: number };
  uParallax: { value: THREE.Vector2 };
  uTime: { value: number };
  uMotionScale: { value: number };
  uLayer1: { value: THREE.Texture };
  uLayer2: { value: THREE.Texture };
  uLayer3: { value: THREE.Texture };
  uLayer4: { value: THREE.Texture };
  uMove1: { value: THREE.Vector2 };
  uMove2: { value: THREE.Vector2 };
  uMove3: { value: THREE.Vector2 };
  uMove4: { value: THREE.Vector2 };
}

interface LangSwappableMaterial {
  uniforms: ParallaxUniformBundle;
  layers: VoyagerLayerSet;
  lettersTex: Partial<Record<"en" | "es", THREE.Texture>>;
  textTex: Partial<Record<"en" | "es", THREE.Texture>>;
}

function createParallaxPageMaterial(opts: {
  fallbackBg: THREE.Texture;
  emptyTex: THREE.Texture;
  alphaMap: THREE.Texture;
  sharedParallax: { value: THREE.Vector2 };
  sharedTime: { value: number };
  sharedMotionScale: { value: number };
  halfSide: number; // -1 = full cover, 0 = spread left half, 1 = spread right half
  gutterShade: number; // 0 = cover, 1 = spread
  roughness: number;
}): { mat: THREE.MeshStandardMaterial; uniforms: ParallaxUniformBundle } {
  const uniforms: ParallaxUniformBundle = {
    uHalfSide: { value: opts.halfSide },
    uGutterShade: { value: opts.gutterShade },
    uParallax: opts.sharedParallax,
    uTime: opts.sharedTime,
    uMotionScale: opts.sharedMotionScale,
    uLayer1: { value: opts.emptyTex },
    uLayer2: { value: opts.emptyTex },
    uLayer3: { value: opts.emptyTex },
    uLayer4: { value: opts.emptyTex },
    uMove1: { value: new THREE.Vector2(0.34, 0.24) },
    uMove2: { value: new THREE.Vector2(0.52, 0.34) },
    uMove3: { value: new THREE.Vector2(0.95, 0.62) },
    uMove4: { value: new THREE.Vector2(0.10, 0.06) },
  };

  const mat = new THREE.MeshStandardMaterial({
    map: opts.fallbackBg,
    alphaMap: opts.alphaMap,
    alphaTest: 0.45,
    roughness: opts.roughness,
    metalness: 0.02,
  });

  mat.customProgramCacheKey = () => "vg-parallax-page-v3";
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uHalfSide = uniforms.uHalfSide;
    shader.uniforms.uGutterShade = uniforms.uGutterShade;
    shader.uniforms.uParallax = uniforms.uParallax;
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uMotionScale = uniforms.uMotionScale;
    shader.uniforms.uLayer1 = uniforms.uLayer1;
    shader.uniforms.uLayer2 = uniforms.uLayer2;
    shader.uniforms.uLayer3 = uniforms.uLayer3;
    shader.uniforms.uLayer4 = uniforms.uLayer4;
    shader.uniforms.uMove1 = uniforms.uMove1;
    shader.uniforms.uMove2 = uniforms.uMove2;
    shader.uniforms.uMove3 = uniforms.uMove3;
    shader.uniforms.uMove4 = uniforms.uMove4;

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <map_pars_fragment>",
        `
        #ifdef USE_MAP
          uniform sampler2D map;
          uniform float uHalfSide;
          uniform float uGutterShade;
          uniform vec2 uParallax;
          uniform float uTime;
          uniform float uMotionScale;
          uniform sampler2D uLayer1;
          uniform sampler2D uLayer2;
          uniform sampler2D uLayer3;
          uniform sampler2D uLayer4;
          uniform vec2 uMove1;
          uniform vec2 uMove2;
          uniform vec2 uMove3;
          uniform vec2 uMove4;
        #endif
        `
      )
      .replace(
        "#include <map_fragment>",
        `
        #ifdef USE_MAP
          vec2 baseUv = (uHalfSide < -0.5)
            ? vMapUv
            : vec2(uHalfSide * 0.5 + vMapUv.x * 0.5, vMapUv.y);

          vec4 comp = texture2D(map, baseUv);

          vec2 float1 = vec2(sin(uTime * 0.72) * 0.0022, cos(uTime * 0.56) * 0.0036) * uMotionScale;
          vec2 float2 = vec2(cos(uTime * 0.48 + 1.1) * 0.0018, sin(uTime * 0.62 + 0.7) * 0.0024) * uMotionScale;
          vec2 float3 = vec2(sin(uTime * 0.85 + 2.0) * 0.0026, cos(uTime * 0.68 + 0.4) * 0.0040) * uMotionScale;

          vec2 uv1 = baseUv + uParallax * uMove1 + float1;
          vec2 uv1S = uv1 + vec2(-0.0045, 0.0075) - uParallax * 0.14;
          if (uv1S.x >= 0.0 && uv1S.x <= 1.0 && uv1S.y >= 0.0 && uv1S.y <= 1.0) {
            comp.rgb *= (1.0 - texture2D(uLayer1, uv1S).a * 0.24);
          }
          if (uv1.x >= 0.0 && uv1.x <= 1.0 && uv1.y >= 0.0 && uv1.y <= 1.0) {
            vec4 c1 = texture2D(uLayer1, uv1);
            comp.rgb = mix(comp.rgb, c1.rgb, c1.a);
          }

          vec2 uv2 = baseUv + uParallax * uMove2 + float2;
          if (uv2.x >= 0.0 && uv2.x <= 1.0 && uv2.y >= 0.0 && uv2.y <= 1.0) {
            vec4 c2 = texture2D(uLayer2, uv2);
            comp.rgb = mix(comp.rgb, c2.rgb, c2.a);
          }

          vec2 uv3 = baseUv + uParallax * uMove3 + float3;
          vec2 uv3S = uv3 + vec2(-0.006, 0.009) - uParallax * 0.22;
          if (uv3S.x >= 0.0 && uv3S.x <= 1.0 && uv3S.y >= 0.0 && uv3S.y <= 1.0) {
            comp.rgb *= (1.0 - texture2D(uLayer3, uv3S).a * 0.20);
          }
          if (uv3.x >= 0.0 && uv3.x <= 1.0 && uv3.y >= 0.0 && uv3.y <= 1.0) {
            vec4 c3 = texture2D(uLayer3, uv3);
            comp.rgb = mix(comp.rgb, c3.rgb, c3.a);
          }

          vec2 uv4 = baseUv + uParallax * uMove4;
          if (uv4.x >= 0.0 && uv4.x <= 1.0 && uv4.y >= 0.0 && uv4.y <= 1.0) {
            vec4 c4 = texture2D(uLayer4, uv4);
            comp.rgb = mix(comp.rgb, c4.rgb, c4.a);
          }

          if (uGutterShade > 0.5) {
            float centerDist = abs(baseUv.x - 0.5);
            float crease = smoothstep(0.028, 0.0, centerDist);
            comp.rgb *= (1.0 - crease * 0.28);
          }

          diffuseColor *= comp;
        #endif
        `
      );
  };

  return { mat, uniforms };
}

export default function VoyagerBook3D({
  page,
  onChangePage,
  lang,
  reduced,
  gyroActive = false,
  spreads,
  coverLayers,
  backCoverLayers,
  coverMainTitle,
}: VoyagerBook3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetPageRef = useRef(page);
  const langRef = useRef(lang);
  const reducedRef = useRef(reduced);
  const onChangePageRef = useRef(onChangePage);
  const swappableRef = useRef<LangSwappableMaterial[]>([]);
  const [webglReady, setWebglReady] = useState(true);

  useEffect(() => {
    targetPageRef.current = page;
  }, [page]);

  useEffect(() => {
    langRef.current = lang;
    for (const item of swappableRef.current) {
      const lTex = item.lettersTex[lang];
      const tTex = item.textTex[lang];
      if (lTex) item.uniforms.uLayer1.value = lTex;
      if (tTex) item.uniforms.uLayer4.value = tTex;
    }
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
    renderer.toneMappingExposure = 1.04;
    renderer.domElement.className = "vg-canvas";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const width = container.clientWidth || 1200;
    const height = container.clientHeight || 720;
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(aspect < 1 ? 45 : 34, aspect, 0.1, 100);
    camera.position.set(0, 0, aspect < 1 ? 12.6 : 9.4);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xfff1dc, 1.38);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 1.42);
    keyLight.position.set(3.4, 4.4, 8.2);
    scene.add(keyLight);

    const warmSpot = new THREE.SpotLight(0xffdfb0, 2.4, 28, Math.PI / 3.2, 0.68, 1.1);
    warmSpot.position.set(-2.2, 2.6, 7.6);
    scene.add(warmSpot);

    const rimLight = new THREE.DirectionalLight(0x88b4ff, 0.36);
    rimLight.position.set(-4.5, -2.5, 4.5);
    scene.add(rimLight);

    // Floating depth starfield particles behind the storybook
    const starCount = 130;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 20;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      starPositions[i * 3 + 2] = -4.2 - Math.random() * 4.5;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffe4a3,
      size: 0.052,
      transparent: true,
      opacity: 0.50,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    const bookWrapper = new THREE.Group();
    scene.add(bookWrapper);

    // Panoramic 1.95:1 open two-page spread geometry (4.05 x 4.15 per half)
    const pageW = 4.05;
    const pageH = 4.15;
    const segX = 28;
    const segY = 6;
    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const rightCornerAlpha = createCornerAlphaTexture("right");
    const leftCornerAlpha = createCornerAlphaTexture("left");
    const deskShadowTex = createDeskShadowTexture();
    const emptyTex = createEmptyTexture();
    const fallbackCoverTex = createSolidTexture(24, 28, 68);
    const fallbackPageTex = createSolidTexture(28, 32, 74);

    const deskShadowMat = new THREE.MeshBasicMaterial({
      map: deskShadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.76,
    });
    const deskShadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(pageW * 2.24, pageH * 1.18),
      deskShadowMat
    );
    deskShadowMesh.position.set(0, -0.06, -0.24);
    bookWrapper.add(deskShadowMesh);

    const sharedParallax = { value: new THREE.Vector2(0, 0) };
    const sharedTime = { value: 0 };
    const sharedMotionScale = { value: 1 };

    interface LeafBundle {
      group: THREE.Group;
      frontGeo: THREE.PlaneGeometry;
      frontBaseX: Float32Array;
      backGeo: THREE.PlaneGeometry;
      backBaseX: Float32Array;
      frontMat: THREE.MeshStandardMaterial;
      backMat: THREE.MeshStandardMaterial;
      frontUniforms: ParallaxUniformBundle;
      backUniforms: ParallaxUniformBundle;
    }

    const leafCount = spreads.length + 1;
    const leaves: LeafBundle[] = [];
    const createdTextures: THREE.Texture[] = [
      rightCornerAlpha,
      leftCornerAlpha,
      deskShadowTex,
      emptyTex,
      fallbackCoverTex,
      fallbackPageTex,
    ];
    swappableRef.current = [];

    for (let i = 0; i < leafCount; i += 1) {
      const isCoverFront = i === 0;
      const isCoverBack = i === leafCount - 1;

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

      const { mat: frontMat, uniforms: frontUniforms } = createParallaxPageMaterial({
        fallbackBg: isCoverFront ? fallbackCoverTex : fallbackPageTex,
        emptyTex,
        alphaMap: rightCornerAlpha,
        sharedParallax,
        sharedTime,
        sharedMotionScale,
        halfSide: isCoverFront ? -1.0 : 1.0,
        gutterShade: isCoverFront ? 0.0 : 1.0,
        roughness: isCoverFront ? 0.64 : 0.80,
      });

      const { mat: backMat, uniforms: backUniforms } = createParallaxPageMaterial({
        fallbackBg: isCoverBack ? fallbackCoverTex : fallbackPageTex,
        emptyTex,
        alphaMap: leftCornerAlpha,
        sharedParallax,
        sharedTime,
        sharedMotionScale,
        halfSide: isCoverBack ? -1.0 : 0.0,
        gutterShade: isCoverBack ? 0.0 : 1.0,
        roughness: isCoverBack ? 0.64 : 0.80,
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
        frontUniforms,
        backUniforms,
      });
    }

    let disposed = false;
    const loader = new THREE.TextureLoader();

    const loadTex = (url: string, isOverlay: boolean): Promise<THREE.Texture> =>
      new Promise((resolve, reject) => {
        loader.load(
          url,
          (tex) => {
            if (disposed) {
              tex.dispose();
              return;
            }
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            if (isOverlay) {
              tex.minFilter = THREE.LinearFilter;
              tex.magFilter = THREE.LinearFilter;
              tex.generateMipmaps = false;
            } else {
              tex.anisotropy = maxAnisotropy;
              tex.minFilter = THREE.LinearMipmapLinearFilter;
            }
            tex.needsUpdate = true;
            createdTextures.push(tex);
            resolve(tex);
          },
          undefined,
          reject
        );
      });

    const wireLayerSetToTargets = (
      layers: VoyagerLayerSet,
      targets: Array<{ mat: THREE.MeshStandardMaterial; uniforms: ParallaxUniformBundle }>
    ) => {
      const entryTargets = targets.map((t) => {
        const entry: LangSwappableMaterial = {
          uniforms: t.uniforms,
          layers,
          lettersTex: {},
          textTex: {},
        };
        swappableRef.current.push(entry);
        return { t, entry };
      });

      loadTex(layers.bg, false)
        .then((tex) => {
          for (const { t } of entryTargets) {
            t.mat.map = tex;
            t.mat.needsUpdate = true;
          }
        })
        .catch(() => {});

      loadTex(layers.mid, true)
        .then((tex) => {
          for (const { t } of entryTargets) {
            t.uniforms.uLayer2.value = tex;
          }
        })
        .catch(() => {});

      loadTex(layers.fg, true)
        .then((tex) => {
          for (const { t } of entryTargets) {
            t.uniforms.uLayer3.value = tex;
          }
        })
        .catch(() => {});

      (["en", "es"] as const).forEach((code) => {
        loadTex(layers.letters[code], true)
          .then((tex) => {
            for (const { t, entry } of entryTargets) {
              entry.lettersTex[code] = tex;
              if (langRef.current === code) {
                t.uniforms.uLayer1.value = tex;
              }
            }
          })
          .catch(() => {});

        loadTex(layers.text[code], true)
          .then((tex) => {
            for (const { t, entry } of entryTargets) {
              entry.textTex[code] = tex;
              if (langRef.current === code) {
                t.uniforms.uLayer4.value = tex;
              }
            }
          })
          .catch(() => {});
      });
    };

    // Cover front face -> leaf 0 front
    wireLayerSetToTargets(coverLayers, [
      { mat: leaves[0].frontMat, uniforms: leaves[0].frontUniforms },
    ]);

    // Back cover face -> final leaf back
    wireLayerSetToTargets(backCoverLayers, [
      { mat: leaves[leafCount - 1].backMat, uniforms: leaves[leafCount - 1].backUniforms },
    ]);

    // All 6 spreads -> leaf i back (left half) + leaf i+1 front (right half) sharing loaded textures!
    spreads.forEach((sp, i) => {
      wireLayerSetToTargets(sp.layers, [
        { mat: leaves[i].backMat, uniforms: leaves[i].backUniforms },
        { mat: leaves[i + 1].frontMat, uniforms: leaves[i + 1].frontUniforms },
      ]);
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
        const gutterLift = Math.sin(Math.min(1, ratio * 2.5) * Math.PI) * 0.045;
        const curlAngle = bow * (0.36 * ratio * ratio);
        const rx = curlAngle > 0.001 ? bx * Math.cos(curlAngle) : bx;
        const rz =
          baseZ +
          gutterLift * (1 - bow * 0.65) +
          (curlAngle > 0.001 ? bx * Math.sin(curlAngle) : 0);
        pos.setX(i, rx);
        pos.setZ(i, rz);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    };

    let pointerNormX = 0;
    let pointerNormY = 0;
    let gyroNormX = 0;
    let gyroNormY = 0;
    let hasGyroSignal = false;
    let parallaxX = 0;
    let parallaxY = 0;
    let smoothProgress = targetPageRef.current;

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
        if (relX > 0.25) onChangePageRef.current(1);
      } else if (cur >= spreads.length + 1) {
        if (relX < 0.75) onChangePageRef.current(spreads.length);
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
      camera.fov = a < 1 ? 45 : 34;
      camera.position.z = a < 1 ? 12.6 : 9.4;
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

      // Drive shader-space 2.5D parallax & living bedtime float inside every open page surface
      sharedParallax.value.set(parallaxX * 0.034, -parallaxY * 0.026);
      sharedMotionScale.value = factor;
      if (!reducedRef.current) {
        sharedTime.value += dt;
      }

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

      const isDesktop = (container.clientWidth || 1200) > 900;
      const frontCoverOffset = -pageW * 0.5;
      const backCoverOffset = isDesktop ? pageW * 0.5 - 1.32 : pageW * 0.5;

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

      const swayY = Math.sin(now * 0.00055) * 0.024 * factor;
      bookWrapper.position.x = targetBookX;
      bookWrapper.position.y = parallaxY * -0.09 + swayY;
      bookWrapper.rotation.y = parallaxX * 0.10;
      bookWrapper.rotation.x = parallaxY * 0.065;

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

      starPoints.rotation.y = now * 0.000018 * factor;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      swappableRef.current = [];
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
      deskShadowMesh.geometry.dispose();
      deskShadowMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      createdTextures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, [spreads, coverLayers, backCoverLayers, gyroActive]);

  if (!webglReady) {
    const activeSpread =
      page >= 1 && page <= spreads.length ? spreads[page - 1] : null;
    const fallbackSrc =
      page === 0
        ? coverLayers.bg
        : page >= spreads.length + 1
          ? backCoverLayers.bg
          : activeSpread?.layers.bg ?? coverLayers.bg;
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
