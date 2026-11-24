"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { writeTelemetry, type TelemetryRefs } from "./types";

interface SchematicArmCanvasProps {
  active: boolean;
  reduced: boolean;
  telemetryRefs: TelemetryRefs;
}

interface JointNode {
  piv: THREE.Group;
  axis: THREE.Vector3;
  a: number;
  lim: [number, number];
}

interface CubeBody {
  g: THREE.Group;
  v: THREE.Vector3;
  w: THREE.Vector3;
  free: boolean;
  flung: boolean;
  bounced: boolean;
  heroCam?: THREE.Vector3;
  settle?: { from: THREE.Vector3; to: THREE.Vector3; t: number };
}

export default function SchematicArmCanvas({
  active,
  reduced,
  telemetryRefs,
}: SchematicArmCanvasProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeRef = useRef(active);
  const reducedRef = useRef(reduced);
  const telRefsRef = useRef(telemetryRefs);

  activeRef.current = active;
  reducedRef.current = reduced;
  telRefsRef.current = telemetryRefs;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    if (!wrap || !canvas || !svg) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 20);

    const INK = 0xf4f1ea;
    const fillMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 2,
      polygonOffsetUnits: 3,
    });
    const edgeMat = new THREE.LineBasicMaterial({
      color: INK,
      transparent: true,
      opacity: 0.9,
    });
    const ringMat = new THREE.LineBasicMaterial({
      color: INK,
      transparent: true,
      opacity: 0.38,
    });
    const dashMat = new THREE.LineDashedMaterial({
      color: INK,
      dashSize: 0.014,
      gapSize: 0.01,
      transparent: true,
      opacity: 0.24,
    });

    const addBlueprintPart = (
      parent: THREE.Object3D,
      geo: THREE.BufferGeometry,
      x = 0,
      y = 0,
      z = 0
    ) => {
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      const fill = new THREE.Mesh(geo, fillMat);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 22), edgeMat);
      grp.add(fill);
      grp.add(edges);
      parent.add(grp);
      return grp;
    };

    // Turntable calibration rings & crosshairs on floor
    const floor = new THREE.Group();
    scene.add(floor);
    const makeCircle = (r: number, dashed: boolean) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i += 1) {
        const a = (i / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const l = new THREE.Line(g, dashed ? dashMat : ringMat);
      if (dashed) l.computeLineDistances();
      floor.add(l);
    };
    makeCircle(0.5, true);
    makeCircle(0.14, false);

    const crossGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.55, 0, 0),
      new THREE.Vector3(0.55, 0, 0),
      new THREE.Vector3(0, 0, -0.55),
      new THREE.Vector3(0, 0, 0.55),
    ]);
    const cross = new THREE.LineSegments(crossGeo, dashMat);
    cross.computeLineDistances();
    floor.add(cross);

    // Tall upright 6-axis industrial robot arm hierarchy
    const armRoot = new THREE.Group();
    scene.add(armRoot);

    addBlueprintPart(armRoot, new THREE.CylinderGeometry(0.105, 0.125, 0.07, 22), 0, 0.035, 0);

    const joints: Record<string, JointNode> = {};
    const makeJoint = (
      name: string,
      parent: THREE.Object3D,
      pos: [number, number, number],
      axis: [number, number, number],
      lim: [number, number]
    ) => {
      const piv = new THREE.Group();
      piv.position.set(pos[0], pos[1], pos[2]);
      parent.add(piv);
      joints[name] = {
        piv,
        axis: new THREE.Vector3(axis[0], axis[1], axis[2]).normalize(),
        a: 0,
        lim,
      };
      return piv;
    };

    const setJointAngle = (name: string, angle: number) => {
      const j = joints[name];
      if (!j) return;
      const clamped = Math.max(j.lim[0], Math.min(j.lim[1], angle));
      j.a = clamped;
      j.piv.quaternion.setFromAxisAngle(j.axis, clamped);
    };

    // J1: Waist turret (tall upright pedestal)
    const j1 = makeJoint("joint1", armRoot, [0, 0.07, 0], [0, 1, 0], [-2.8, 2.8]);
    addBlueprintPart(j1, new THREE.CylinderGeometry(0.088, 0.098, 0.11, 20), 0, 0.055, 0);
    addBlueprintPart(j1, new THREE.BoxGeometry(0.11, 0.06, 0.11), 0, 0.125, 0);

    // J2: Shoulder (tall upper arm)
    const j2 = makeJoint("joint2", j1, [0, 0.175, 0], [0, 0, 1], [-1.45, 1.45]);
    addBlueprintPart(j2, new THREE.CylinderGeometry(0.048, 0.048, 0.145, 18), 0, 0, 0).rotation.x =
      Math.PI / 2;
    addBlueprintPart(j2, new THREE.BoxGeometry(0.058, 0.26, 0.072), 0, 0.13, 0);

    // J3: Elbow (forward forearm)
    const j3 = makeJoint("joint3", j2, [0, 0.26, 0], [0, 0, 1], [-2.2, 2.2]);
    addBlueprintPart(j3, new THREE.CylinderGeometry(0.04, 0.04, 0.125, 18), 0, 0, 0).rotation.x =
      Math.PI / 2;
    addBlueprintPart(j3, new THREE.BoxGeometry(0.058, 0.068, 0.064), -0.02, 0.032, 0);

    // J4: Forearm roll
    const j4 = makeJoint("joint4", j3, [0, 0.052, 0], [0, 1, 0], [-3.1, 3.1]);
    addBlueprintPart(j4, new THREE.CylinderGeometry(0.026, 0.032, 0.21, 14), 0, 0.105, 0);

    // J5: Wrist pitch
    const j5 = makeJoint("joint5", j4, [0, 0.21, 0], [0, 0, 1], [-2.0, 2.0]);
    addBlueprintPart(j5, new THREE.BoxGeometry(0.042, 0.05, 0.046), 0, 0.025, 0);

    // J6: Tool flange + 2-jaw parallel gripper
    const j6 = makeJoint("joint6", j5, [0, 0.056, 0], [0, 1, 0], [-3.1, 3.1]);
    addBlueprintPart(j6, new THREE.CylinderGeometry(0.026, 0.026, 0.018, 14), 0, 0.009, 0);
    const jawL = addBlueprintPart(j6, new THREE.BoxGeometry(0.01, 0.042, 0.016), -0.022, 0.038, 0);
    const jawR = addBlueprintPart(j6, new THREE.BoxGeometry(0.01, 0.042, 0.016), 0.022, 0.038, 0);

    const tip = new THREE.Object3D();
    tip.position.set(0, 0.068, 0);
    j6.add(tip);

    const REST_J2 = 0.30;
    const REST_J3 = -0.92;
    setJointAngle("joint2", REST_J2);
    setJointAngle("joint3", REST_J3);
    setJointAngle("joint5", -0.5);

    // 3D CCD Inverse Kinematics solver
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();
    const tmpAx = new THREE.Vector3();
    const tmpTw = new THREE.Vector3();
    const tmpQ = new THREE.Quaternion();

    const solveIK = (
      targetWorld: THREE.Vector3,
      chain: string[],
      effector: THREE.Object3D,
      iters: number
    ) => {
      for (let it = 0; it < iters; it += 1) {
        for (const name of chain) {
          const j = joints[name];
          if (!j) continue;
          armRoot.updateMatrixWorld(true);
          const jp = j.piv.getWorldPosition(tmpA);
          const ep = effector.getWorldPosition(tmpB);
          j.piv.parent?.getWorldQuaternion(tmpQ);
          const ax = tmpAx.copy(j.axis).applyQuaternion(tmpQ).normalize();

          const v1 = ep.sub(jp);
          const v2 = targetWorld.clone().sub(jp);
          v1.addScaledVector(ax, -v1.dot(ax));
          v2.addScaledVector(ax, -v2.dot(ax));
          if (v1.lengthSq() < 1e-8 || v2.lengthSq() < 1e-8) continue;
          v1.normalize();
          v2.normalize();

          let ang = Math.acos(Math.max(-1, Math.min(1, v1.dot(v2))));
          if (tmpTw.copy(v1).cross(v2).dot(ax) < 0) ang = -ang;
          setJointAngle(name, j.a + ang * 0.72);
        }
      }
    };

    // Cubes for interactive off-screen fetch + stack + knock-down physics
    const cubeSize = 0.032;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeEdges = new THREE.EdgesGeometry(cubeGeo);
    const cubes: CubeBody[] = [];

    const spawnCube = (pos: THREE.Vector3): CubeBody => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(cubeGeo, fillMat));
      g.add(new THREE.LineSegments(cubeEdges, edgeMat));
      g.position.copy(pos);
      scene.add(g);
      const body: CubeBody = {
        g,
        v: new THREE.Vector3(),
        w: new THREE.Vector3(),
        free: false,
        flung: false,
        bounced: false,
      };
      cubes.push(body);
      return body;
    };

    const feedDir = new THREE.Vector3(1.15, 0, -0.95).normalize();
    const stackCenter = new THREE.Vector3(0.25, 0, -0.06);
    const pyramidOffsets: Array<[number, number]> = [
      [-1, 0],
      [0, 0],
      [1, 0],
      [-0.5, 1],
      [0.5, 1],
      [0, 2],
    ];
    const stackTargets = pyramidOffsets.map(([ox, oy]) =>
      stackCenter
        .clone()
        .addScaledVector(feedDir, ox * cubeSize * 1.12)
        .setY(cubeSize * 0.5 + oy * cubeSize)
    );
    const pickSpot = new THREE.Vector3(0.45, cubeSize * 0.5, -0.35);

    type ActionState =
      | { kind: "build"; phase: number; t: number; i: number; block?: CubeBody }
      | { kind: "wreck"; phase: number; t: number; hit?: boolean }
      | null;

    let action: ActionState = null;
    let builtState: "empty" | "built" | "down" = "empty";

    const camDir = new THREE.Vector3(1.0, 0.62, 1.15).normalize();
    const camRight = new THREE.Vector3(0, 1, 0).cross(camDir).normalize();

    let viewW = 1280;
    let viewH = 720;

    const project2D = (v: THREE.Vector3): [number, number] => {
      const p = v.clone().project(camera);
      return [(p.x * 0.5 + 0.5) * viewW, (-p.y * 0.5 + 0.5) * viewH];
    };

    // Find off-screen pickSpot past the right edge of the viewport
    const computeOffscreenPickSpot = () => {
      const y = cubeSize * 0.5;
      let d = 0.25;
      for (; d < 0.72; d += 0.015) {
        const pt = feedDir.clone().multiplyScalar(d).setY(y);
        const [sx] = project2D(pt);
        if (sx > viewW + 85) break;
      }
      pickSpot.copy(feedDir).multiplyScalar(Math.min(d, 0.72)).setY(y);
    };

    const updateProjection = () => {
      const wide = viewW > viewH * 1.15;
      const halfH = wide ? 0.43 : 0.48;
      const m = (2 * halfH) / Math.max(1, viewH);
      const centerX = wide ? viewW * 0.72 : viewW * 0.5;
      const centerY = viewH * 0.53;
      camera.left = -centerX * m;
      camera.right = (viewW - centerX) * m;
      camera.top = centerY * m;
      camera.bottom = -(viewH - centerY) * m;
      camera.updateProjectionMatrix();

      const lookAt = new THREE.Vector3(0, 0.27, 0).addScaledVector(camRight, -0.02);
      camera.position.copy(lookAt).addScaledVector(camDir, 4);
      camera.lookAt(lookAt);
      camera.updateMatrixWorld();
      computeOffscreenPickSpot();
    };

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w <= 0 || h <= 0) return;
      viewW = w;
      viewH = h;
      renderer.setSize(w, h, false);
      updateProjection();
    };

    resize();
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const targetPos = new THREE.Vector3(0.2, 0.3, 0.2);
    const smoothTarget = targetPos.clone();
    const desiredTarget = targetPos.clone();
    const trailPts: THREE.Vector3[] = [];
    const lastTip = new THREE.Vector3();
    const tipVel = new THREE.Vector3();

    let mx = 0.68;
    let my = 0.44;
    let lastMove = -1e9;
    let hasMoved = false;

    const raycaster = new THREE.Raycaster();
    const pointerPlane = new THREE.Plane();
    const hitPt = new THREE.Vector3();

    const onPointerMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      mx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      my = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      lastMove = performance.now();
      hasMoved = true;
    };

    const onClick = () => {
      if (!activeRef.current) return;
      if (action && action.kind === "wreck") return;
      if (action && action.kind === "build") {
        if (action.block && action.block.g.parent === tip) {
          scene.attach(action.block.g);
          action.block.free = true;
          action.block.flung = true;
          action.block.v.copy(tipVel).multiplyScalar(0.35);
          action.block.w.set(3, 2, -4);
        }
        action = { kind: "wreck", phase: 0, t: 0 };
        return;
      }
      if (builtState === "built") {
        action = { kind: "wreck", phase: 0, t: 0 };
      } else {
        cubes.splice(0).forEach((c) => scene.remove(c.g));
        action = { kind: "build", phase: 0, t: 0, i: 0 };
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    wrap.addEventListener("click", onClick);

    const clampReach = (v: THREE.Vector3) => {
      const r = Math.hypot(v.x, v.z);
      const clampedR = Math.max(0.17, Math.min(0.42, r));
      if (r > 1e-4) {
        v.x *= clampedR / r;
        v.z *= clampedR / r;
      } else {
        v.set(0.24, v.y, 0.24);
      }
      v.y = Math.max(0.05, Math.min(0.54, v.y));
      return v;
    };

    let rafId = 0;
    let disposed = false;
    let prevNow = performance.now();
    const startTime = prevNow;
    let fpsAccum = 0;
    let frameCount = 0;
    let fpsLast = prevNow;
    let currentFps = 60;
    let gripOpen = 0.024;
    let wreckSnap = 0;
    let wreckTargetSnap = 0;

    const tick = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(tick);
      if (!activeRef.current || viewW <= 1 || viewH <= 1) return;

      const t0 = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - prevNow) / 1000));
      prevNow = now;
      const tSec = reducedRef.current ? 1.0 : (now - startTime) * 0.001;

      const idle = now - lastMove > 1600;
      if (hasMoved && !idle) {
        const nrm = new THREE.Vector3(1, 0, 1.15).normalize();
        pointerPlane.setFromNormalAndCoplanarPoint(nrm, nrm.clone().multiplyScalar(0.24));
        raycaster.setFromCamera(
          new THREE.Vector2(mx * 2 - 1, -(my * 2 - 1)),
          camera
        );
        if (raycaster.ray.intersectPlane(pointerPlane, hitPt)) {
          desiredTarget.copy(clampReach(hitPt));
        }
      } else {
        desiredTarget.set(
          0.1 + 0.18 * Math.cos(tSec * 0.45),
          0.26 + 0.12 * Math.sin(tSec * 0.9),
          0.24 + 0.1 * Math.sin(tSec * 0.45)
        );
        clampReach(desiredTarget);
      }

      targetPos.lerp(desiredTarget, Math.min(1, dt * (idle ? 2.6 : 8)));

      let statusLabel = "";
      let targetGrip = 0.024;

      if (action && action.kind === "build") {
        const dst = stackTargets[action.i];
        action.t += dt;
        const moveToward = (p: THREE.Vector3, spd: number) => {
          smoothTarget.lerp(p, Math.min(1, dt * spd));
          return smoothTarget.distanceTo(p);
        };
        const advance = () => {
          if (action && action.kind === "build") {
            action.phase += 1;
            action.t = 0;
          }
        };

        switch (action.phase) {
          case 0:
            if (action.t <= dt + 1e-5) computeOffscreenPickSpot();
            if (
              moveToward(new THREE.Vector3(pickSpot.x, 0.17, pickSpot.z), 5.2) < 0.01 &&
              action.t > 0.18
            )
              advance();
            break;
          case 1:
            if (
              moveToward(new THREE.Vector3(pickSpot.x, pickSpot.y, pickSpot.z), 4.8) < 0.006 &&
              action.t > 0.2
            )
              advance();
            break;
          case 2:
            targetGrip = 0.013;
            if (action.t > 0.25) {
              const worldTip = tip.getWorldPosition(new THREE.Vector3());
              action.block = spawnCube(worldTip);
              tip.attach(action.block.g);
              advance();
            }
            break;
          case 3:
            targetGrip = 0.013;
            if (moveToward(new THREE.Vector3(pickSpot.x, 0.21, pickSpot.z), 5.0) < 0.012)
              advance();
            break;
          case 4:
            targetGrip = 0.013;
            if (moveToward(new THREE.Vector3(dst.x, dst.y + 0.13, dst.z), 4.4) < 0.01)
              advance();
            break;
          case 5:
            targetGrip = 0.013;
            if (moveToward(dst, 4.0) < 0.006 || action.t > 1.8) advance();
            break;
          case 6:
            targetGrip = 0.026;
            if (action.block && action.block.g.parent === tip) {
              const b = action.block;
              scene.attach(b.g);
              b.g.rotation.set(0, 0, 0);
              b.settle = { from: b.g.position.clone(), to: dst.clone(), t: 0 };
            }
            if (action.t > 0.24) advance();
            break;
          default:
            if (moveToward(new THREE.Vector3(dst.x, dst.y + 0.11, dst.z), 4.8) < 0.012) {
              if (action.i + 1 < stackTargets.length) {
                action = { kind: "build", phase: 0, t: 0, i: action.i + 1 };
              } else {
                action = null;
                builtState = "built";
              }
            }
            break;
        }
        if (action && action.kind === "build") {
          const names = ["Fetch", "Reach", "Grip", "Lift", "Carry", "Place", "Release", "Clear"];
          statusLabel = `${names[action.phase] ?? "Move"} ${String(action.i + 1).padStart(
            2,
            "0"
          )}/${String(stackTargets.length).padStart(2, "0")}`;
        }
      } else if (action && action.kind === "wreck") {
        action.t += dt;
        const arcRadius = 0.29;
        const baseAngle = -0.22;
        const backAngle = baseAngle + 1.05;
        const endAngle = baseAngle - 0.85;
        const arcY = (a: number) => cubeSize * 1.2 + 0.22 * (a - baseAngle) * (a - baseAngle);
        const arcPt = (a: number, y: number) =>
          new THREE.Vector3(arcRadius * Math.cos(a), y, -arcRadius * Math.sin(a));

        if (action.phase === 0) {
          const u = Math.min(1, action.t / 0.85);
          const a = baseAngle + 0.35 + (backAngle - baseAngle - 0.35) * u * u * (3 - 2 * u);
          smoothTarget.lerp(arcPt(a, Math.max(arcY(a), 0.15)), Math.min(1, dt * 6));
          wreckTargetSnap = u;
          statusLabel = "Backswing";
          if (action.t > 0.95) {
            action.phase = 1;
            action.t = 0;
          }
        } else if (action.phase === 1) {
          const p = arcPt(backAngle, arcY(backAngle));
          if (action.t > 0.15) p.y += Math.sin(action.t * 70) * 0.002;
          smoothTarget.lerp(p, Math.min(1, dt * 14));
          wreckTargetSnap = 1 + 0.45 * Math.min(1, action.t / 0.45);
          statusLabel = "Charge";
          if (action.t > 0.5) {
            action.phase = 2;
            action.t = 0;
          }
        } else if (action.phase === 2) {
          const u = Math.min(1, action.t / 0.24);
          const a = backAngle + (endAngle - backAngle) * u * u;
          smoothTarget.lerp(arcPt(a, arcY(a)), Math.min(1, dt * 55));
          wreckTargetSnap = u < 0.55 ? 1.45 : 1.45 - ((u - 0.55) / 0.45) * 2.25;
          statusLabel = "Swing";
          if (!action.hit && a < baseAngle - 0.1) {
            action.hit = true;
            const speed = Math.max(2.0, Math.min(4.2, tipVel.length() || 2.8));
            const fwd = new THREE.Vector3(Math.sin(baseAngle), 0, Math.cos(baseAngle));
            const side = new THREE.Vector3(Math.cos(baseAngle), 0, -Math.sin(baseAngle));
            for (const c of cubes) {
              c.free = true;
              c.flung = true;
              const dir = fwd
                .clone()
                .addScaledVector(side, 0.25 + Math.random() * 0.45)
                .addScaledVector(feedDir, 0.45)
                .normalize();
              c.v.copy(dir).multiplyScalar(speed * (0.85 + Math.random() * 0.25));
              c.v.y = 0.55 + Math.random() * 0.45;
              c.w.copy(new THREE.Vector3(0, 1, 0).cross(dir)).multiplyScalar(-(6 + Math.random() * 4));
            }
            const topCube = cubes[cubes.length - 1];
            if (topCube) {
              topCube.v.copy(camDir).setY(0).normalize().multiplyScalar(speed * 1.15);
              topCube.v.y = 1.05;
              topCube.heroCam = topCube.g.position.clone();
            }
          }
          if (u >= 1) {
            action.phase = 3;
            action.t = 0;
          }
        } else {
          smoothTarget.lerp(arcPt(endAngle - 0.1, arcY(endAngle) + 0.02), Math.min(1, dt * 3.5));
          wreckTargetSnap = 0;
          statusLabel = "Knock down";
          if (action.t > 0.7) {
            action = null;
            builtState = "down";
          }
        }
      } else {
        smoothTarget.lerp(targetPos, Math.min(1, dt * 6.5));
        wreckTargetSnap = 0;
        statusLabel =
          (idle ? "Auto" : "Follow") +
          (builtState === "built" ? " / click to knock down" : " / click to stack");
      }

      // Cube physics & off-screen culling
      for (const c of cubes) {
        if (c.settle) {
          c.settle.t = Math.min(1, c.settle.t + dt / 0.14);
          const e = 1 - Math.pow(1 - c.settle.t, 3);
          c.g.position.lerpVectors(c.settle.from, c.settle.to, e);
          if (c.settle.t >= 1) c.settle = undefined;
        }
        if (c.free) {
          c.v.y -= 9.8 * dt * 0.6;
          c.g.position.addScaledVector(c.v, dt);
          c.g.rotation.x += c.w.x * dt;
          c.g.rotation.y += c.w.y * dt;
          c.g.rotation.z += c.w.z * dt;
          if (c.heroCam) {
            const distCam = Math.max(0, c.g.position.clone().sub(c.heroCam).dot(camDir));
            c.g.scale.setScalar(1 + distCam * 3.0);
          } else if (!c.bounced && c.g.position.y < cubeSize * 0.5) {
            c.bounced = true;
            c.g.position.y = cubeSize * 0.5;
            c.v.y = Math.abs(c.v.y) * 0.4;
            c.v.x *= 0.8;
            c.v.z *= 0.8;
          }
        }
      }
      for (let i = cubes.length - 1; i >= 0; i -= 1) {
        const c = cubes[i];
        if (!c.flung) continue;
        const [sx, sy] = project2D(c.g.position);
        const pad = 70 * c.g.scale.x;
        if (sx < -pad || sx > viewW + pad || sy > viewH + pad || sy < -viewH || c.g.position.y < -2) {
          scene.remove(c.g);
          cubes.splice(i, 1);
        }
      }

      // Gentle upright rest bias + 3D CCD IK
      if (!(action && action.kind === "wreck")) {
        setJointAngle("joint2", joints.joint2.a + (REST_J2 - joints.joint2.a) * 0.05);
        setJointAngle("joint3", joints.joint3.a + (REST_J3 - joints.joint3.a) * 0.05);
      }

      const wristTarget = smoothTarget.clone().add(new THREE.Vector3(0, 0.115, 0));
      solveIK(wristTarget, ["joint3", "joint2", "joint1"], j5, 6);
      solveIK(
        wristTarget.clone().add(new THREE.Vector3(0, -0.2, 0)),
        ["joint5"],
        tip,
        action && action.kind === "build" ? 5 : 2
      );

      if (action && action.kind === "wreck") {
        wreckSnap += (wreckTargetSnap - wreckSnap) * Math.min(1, dt * (action.phase === 2 ? 28 : 6));
        setJointAngle("joint4", wreckSnap * 1.1);
        setJointAngle("joint3", joints.joint3.a + Math.min(wreckSnap, 1.1) * 0.35);
        setJointAngle("joint5", joints.joint5.a - Math.min(wreckSnap, 1.1) * 0.45);
      } else {
        setJointAngle("joint4", 0.25 * Math.sin(tSec * 0.7));
      }
      setJointAngle("joint6", 0.55 * Math.sin(tSec * 0.5));

      gripOpen += (targetGrip - gripOpen) * Math.min(1, dt * 10);
      jawL.position.x = -gripOpen;
      jawR.position.x = gripOpen;

      armRoot.updateMatrixWorld(true);
      renderer.render(scene, camera);

      // Update SVG CAD overlay (callouts strictly anchored to right edge)
      const tipWorld = tip.getWorldPosition(new THREE.Vector3());
      if (dt > 0) tipVel.copy(tipWorld).sub(lastTip).divideScalar(dt);
      lastTip.copy(tipWorld);
      trailPts.unshift(tipWorld.clone());
      if (trailPts.length > 75) trailPts.pop();

      const [rx, ry] = project2D(smoothTarget);
      const trailStr = trailPts
        .map((p) => {
          const [px, py] = project2D(p);
          return `${px.toFixed(1)},${py.toFixed(1)}`;
        })
        .join(" ");

      let svgMarkup = `<circle class="red" cx="${rx.toFixed(1)}" cy="${ry.toFixed(
        1
      )}" r="9"/><line class="red" x1="${(rx - 18).toFixed(1)}" y1="${ry.toFixed(
        1
      )}" x2="${(rx - 11).toFixed(1)}" y2="${ry.toFixed(
        1
      )}"/><line class="red" x1="${(rx + 11).toFixed(1)}" y1="${ry.toFixed(
        1
      )}" x2="${(rx + 18).toFixed(1)}" y2="${ry.toFixed(
        1
      )}"/><line class="red" x1="${rx.toFixed(1)}" y1="${(ry - 18).toFixed(
        1
      )}" x2="${rx.toFixed(1)}" y2="${(ry - 11).toFixed(
        1
      )}"/><line class="red" x1="${rx.toFixed(1)}" y1="${(ry + 11).toFixed(
        1
      )}" x2="${rx.toFixed(1)}" y2="${(ry + 18).toFixed(
        1
      )}"/><polyline class="red" points="${trailStr}" opacity="0.78"/>`;

      const rightX = viewW - 22;
      svgMarkup += `<text class="red" x="${rightX}" y="86" text-anchor="end">X ${smoothTarget.x.toFixed(
        3
      )}  Y ${smoothTarget.y.toFixed(3)}  Z ${smoothTarget.z.toFixed(3)}</text>`;
      if (statusLabel) {
        svgMarkup += `<text class="tt red" x="${rightX}" y="104" text-anchor="end">${statusLabel}</text>`;
      }

      const callouts = ["joint1", "joint2", "joint3", "joint5"]
        .map((name) => {
          const j = joints[name];
          const [jx, jy] = project2D(j.piv.getWorldPosition(new THREE.Vector3()));
          return { name, x: jx, y: jy, deg: (j.a * 57.2958).toFixed(1) };
        })
        .sort((a, b) => a.y - b.y);

      const isMobile = viewW <= 760;
      const lblX = isMobile ? viewW - 14 : viewW - 22;
      const kneeX = isMobile ? viewW - 72 : viewW - 112;

      let prevY = 128;
      callouts.forEach((c, idx) => {
        const ly = Math.max(prevY + 26, Math.min(viewH - 72, c.y), 132 + idx * 26);
        prevY = ly;
        svgMarkup += `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(
          1
        )}" r="3"/><polyline class="dim" points="${c.x.toFixed(1)},${c.y.toFixed(
          1
        )} ${kneeX},${ly.toFixed(1)} ${lblX},${ly.toFixed(
          1
        )}"/><text class="tt" x="${lblX}" y="${(ly - 5).toFixed(
          1
        )}" text-anchor="end">J${c.name.slice(-1)} ${c.deg}°</text>`;
      });

      svg.innerHTML = svgMarkup;

      const cookMs = performance.now() - t0;
      fpsAccum += 1;
      frameCount += 1;
      if (now - fpsLast >= 250) {
        currentFps = Math.round((fpsAccum * 1000) / (now - fpsLast));
        fpsAccum = 0;
        fpsLast = now;
      }
      if (frameCount % 3 === 0) {
        writeTelemetry(telRefsRef.current, mx, my, cookMs, currentFps);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("click", onClick);
      fillMat.dispose();
      edgeMat.dispose();
      ringMat.dispose();
      dashMat.dispose();
      cubeGeo.dispose();
      cubeEdges.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="sg-arm-wrap">
      <canvas ref={canvasRef} className="sg-stage-canvas" aria-hidden="true" />
      <svg ref={svgRef} className="sg-arm-ov" aria-hidden="true" />
    </div>
  );
}
