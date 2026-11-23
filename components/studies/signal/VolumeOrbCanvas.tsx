"use client";

import { useEffect, useRef } from "react";
import { writeTelemetry, type TelemetryRefs } from "./types";

interface VolumeOrbCanvasProps {
  active: boolean;
  reduced: boolean;
  telemetryRefs: TelemetryRefs;
  onProgramChange: (programName: string) => void;
}

const PROGRAMS = ["Zander", "Printer", "Vortex"];

const VERT_SRC = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Real-time WebGL1 ray-traced glass dome + 64-layer swept-volume LED voxel shader
const ORB_FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMode;

const float R = 0.80;
const float RI = 0.784;
const float CUT = -0.443;
const float VR = 0.62;
const float VP = 0.0096875;
const float VSL = 384.0;
const float T3 = 1.0 / 3.0;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i = 0; i < 4; i++){
    v += a * noise(p);
    p = p * 2.02 + vec2(17.1, 31.7);
    a *= 0.5;
  }
  return v;
}
vec2 rot2(vec2 p, float a){
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c) * p;
}
vec3 q2(vec3 c){ return floor(clamp(c, 0.0, 1.0) * 3.0 + 0.5) / 3.0; }
float h3(vec3 p){ return hash(p.xz * vec2(0.731, 1.37) + p.y * vec2(3.11, 0.53)); }

// Program 0: Zander — checkered hills, animated sea, hovering voxel lander
vec3 zander(vec3 c, float t){
  vec3 col = vec3(0.0);
  vec2 w = c.xz + vec2(t * 0.035, t * 0.05);
  float h = 0.02 + 0.26 * fbm(w * 2.6 + 3.0), sea = 0.11;
  float hh = max(h, sea);
  if (abs(c.y - hh) < VP * 0.65){
    if (h < sea){
      col = mix(vec3(0.0, T3, 1.0), vec3(0.0, 2.0 * T3, 1.0), step(0.5, fract((w.x + w.y) * 9.0 + t * 0.6)));
    } else {
      float chk = mod(floor(w.x * 13.0) + floor(w.y * 13.0), 2.0);
      if (h < 0.15) col = mix(vec3(0.0, 2.0 * T3, 0.0), vec3(T3, 1.0, 0.0), chk);
      else if (h < 0.19) col = mix(vec3(2.0 * T3, 2.0 * T3, 0.0), vec3(1.0, 1.0, T3), chk);
      else col = mix(vec3(2.0 * T3, T3, 0.0), vec3(1.0, 1.0, 1.0), chk);
    }
  }
  vec3 lp = vec3(0.16 * sin(t * 0.45), 0.4 + 0.025 * sin(t * 1.7), 0.12 * cos(t * 0.33));
  vec3 q = c - lp;
  q.xz = rot2(q.xz, t * 0.6);
  float d = max(abs(q.x) + abs(q.z) - (0.055 - q.y * 0.9), abs(q.y) - 0.035);
  if (abs(d) < VP * 0.7) col = q.y > 0.005 ? vec3(1.0) : vec3(1.0, T3, T3);
  if (q.y < -0.03 && q.y > -0.22 && length(q.xz) < (-q.y - 0.02) * 0.32 && h3(floor(c / VP) + floor(t * 24.0)) > 0.72)
    col = mix(vec3(1.0, 1.0, T3), vec3(1.0, T3, 0.0), clamp((-q.y - 0.04) * 7.0, 0.0, 1.0));
  return col;
}

// Program 1: Printer — twisted vase printing layer by layer with orbiting nozzle
float vase(float y, float a){
  float r0 = 0.12 + 0.06 * sin(y * 8.0 + 0.8) + 0.03 * y;
  return r0 * (1.0 + 0.09 * cos(6.0 * (a + y * 3.2)));
}
vec3 printer(vec3 c, float t){
  vec3 col = vec3(0.0);
  float cyc = fract(t / 14.0), hp = 0.03 + cyc * 0.46;
  float r = length(c.xz), a = atan(c.z, c.x);
  if (c.y < VP * 1.2 && r < 0.42){
    float g = step(0.88, fract(c.x * 18.0)) + step(0.88, fract(c.z * 18.0));
    col = g > 0.0 ? vec3(0.0, T3, 2.0 * T3) : vec3(0.0, 0.0, T3);
  }
  if (c.y > VP * 1.5 && c.y < hp && abs(r - vase(c.y, a)) < VP * 0.75){
    col = hp - c.y < VP * 1.4 ? vec3(1.0, 1.0, 2.0 * T3) : vec3(1.0, T3, 0.0);
  }
  float na = t * 2.6;
  float nr = vase(hp, na);
  vec3 q = c - vec3(nr * cos(na), hp + 0.006, nr * sin(na));
  float rq = length(q.xz);
  if (q.y > 0.0 && q.y < 0.045 && abs(rq - min(q.y * 0.55, 0.022)) < VP * 0.7) col = vec3(2.0 * T3);
  float bx = max(abs(q.x), abs(q.z));
  if (q.y > 0.045 && q.y < 0.085 && bx < 0.032 && (abs(bx - 0.032) < VP * 0.7 || abs(q.y - 0.085) < VP * 0.7)) col = vec3(1.0);
  if (abs(c.y - (hp + 0.12)) < VP * 0.6 && abs(c.z - nr * sin(na)) < VP * 0.6) col = vec3(T3, T3, 2.0 * T3);
  return col;
}

// Program 2: Vortex — holographic harmonic torus + pulsing wave rings
vec3 vortexProg(vec3 c, float t){
  vec3 col = vec3(0.0);
  float r = length(c.xz), a = atan(c.z, c.x);
  float wave = 0.28 + 0.12 * sin(a * 3.0 - t * 2.4) * cos(r * 10.0 + t * 1.6);
  if (abs(c.y - wave) < VP * 0.75 && r < 0.56){
    float band = fract(r * 8.0 - t * 0.9);
    col = band > 0.5 ? vec3(T3, 1.0, 1.0) : vec3(1.0, T3, 2.0 * T3);
  }
  float ringD = length(vec2(r - 0.34, c.y - 0.28));
  if (abs(ringD - 0.09) < VP * 0.75){
    col = vec3(1.0, 0.16, 0.12);
  }
  return col;
}

vec3 vxContent(vec3 c, float t){
  if (uMode < 0.5) return q2(zander(c, t));
  if (uMode < 1.5) return q2(printer(c, t));
  return q2(vortexProg(c, t));
}

float softbox(vec3 d, vec3 c, vec3 u, vec3 v, vec2 sz, float soft){
  float k = dot(d, c); if (k <= 0.0) return 0.0;
  vec2 q = vec2(dot(d, u), dot(d, v)) / k;
  vec2 e = abs(q) - sz;
  float sd = length(max(e, 0.0)) + min(max(e.x, e.y), 0.0);
  return smoothstep(soft, -soft, sd);
}

vec3 env(vec3 d, float yaw){
  d.xz = rot2(d.xz, yaw);
  vec3 c = vec3(0.0);
  c += vec3(1.85) * softbox(d, vec3(-0.868, 0.049, -0.493), vec3(-0.494, 0.0, 0.869), vec3(0.043, 0.998, 0.024), vec2(0.07, 0.8), 0.04);
  c += vec3(1.45, 1.5, 1.6) * softbox(d, vec3(0.80, 0.439, -0.410), vec3(-0.456, 0.0, -0.890), vec3(-0.391, 0.899, 0.200), vec2(0.18, 0.38), 0.06);
  c += vec3(0.5) * softbox(d, vec3(0.099, 0.890, -0.445), vec3(-0.976, 0.0, -0.217), vec3(-0.193, 0.456, 0.869), vec2(0.6, 0.035), 0.025);
  return c;
}

vec3 envDisp(vec3 r, vec3 n, float ci, float yaw){
  float s = 0.006 + 0.06 * pow(1.0 - ci, 3.0);
  return vec3(env(normalize(r + n * s), yaw).r, env(r, yaw).g, env(normalize(r - n * s), yaw).b);
}

float fres(float ci){ return 0.04 + 0.96 * pow(1.0 - ci, 5.0); }

vec3 vortexTrace(vec3 ro, vec3 rd, float tmax, float pxk, float tOff, float t){
  vec3 acc = vec3(0.0);
  if (abs(rd.y) < 1e-4) return acc;
  float ya = ro.y, yb = ro.y + rd.y * tmax;
  float i0 = floor(min(ya, yb) / VP - 0.5), i1 = ceil(max(ya, yb) / VP - 0.5);
  for (int i = 0; i < 64; i += 2){
    float fi = float(i);
    if (fi < i0) continue;
    if (fi > i1) break;
    float yc = (fi + 0.5) * VP;
    float distT = (yc - ro.y) / rd.y;
    if (distT < 0.0 || distT > tmax) continue;
    vec3 p = ro + rd * distT;
    float r = length(p.xz);
    if (r > VR) continue;
    float ri = (floor(r / VP) + 0.5) * VP;
    float px = pxk * (tOff + distT) / max(abs(rd.y), 0.25);
    float dotR = VP * 0.24, reach = dotR + px * 0.85;
    if (abs(r - ri) >= reach) continue;
    float s = (atan(p.z, p.x) / 6.28318 + 0.5) * VSL;
    float thc = ((floor(s) + 0.5) / VSL - 0.5) * 6.28318;
    vec2 cc = ri * vec2(cos(thc), sin(thc));
    float d = length(p.xz - cc);
    float m = smoothstep(reach, dotR - px * 0.75, d);
    if (m < 0.004) continue;
    vec3 col = vxContent(vec3(cc.x, yc, cc.y), t);
    acc += col * m * 2.1;
  }
  return acc;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  bool wide = asp > 1.15;
  vec2 center = wide ? vec2(0.69, 0.48) : vec2(0.5, 0.50);
  float orbScale = wide ? 0.36 : 0.40;

  // Screen-space ray against sphere centered at orbCenter
  vec2 p = (uv - center) * vec2(asp, 1.0) / orbScale;
  float r2 = dot(p, p);

  // Subtle ambient background grid outside dome
  float gx = step(0.985, fract(gl_FragCoord.x / 48.0));
  vec3 bg = vec3(0.015) + vec3(0.018) * gx;

  if (r2 > 1.04){
    gl_FragColor = vec4(bg, 1.0);
    return;
  }

  float yaw = uTime * 0.18 + (uMouse.x - 0.5) * 1.4;
  float pitch = 0.26 + (uMouse.y - 0.5) * 0.35;

  // Ray setup in sphere space (radius R = 0.80)
  vec3 cam = vec3(0.0, sin(pitch) * 3.2, cos(pitch) * 3.2);
  vec3 fwd = normalize(-cam);
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, fwd);
  vec3 rd = normalize(fwd * 2.7 + right * p.x * 0.82 + up * p.y * 0.82);

  // Rotate camera into spinning rotor space
  vec3 ro = cam;
  ro.xz = rot2(ro.xz, yaw);
  vec3 lrd = rd;
  lrd.xz = rot2(lrd.xz, yaw);

  float b = dot(ro, lrd);
  float cc = dot(ro, ro) - R * R;
  float h = b * b - cc;

  if (h <= 0.0){
    // Outer prismatic halo rim
    float q = sqrt(r2);
    float side = pow(max(dot(normalize(p), normalize(vec2(-0.55, 0.83) + vec2(uMouse.x - 0.5, -(uMouse.y - 0.5)) * 0.9)), 0.0), 1.3) * 0.9 + 0.1;
    vec3 cool = vec3(0.35, 0.55, 1.0) * exp(-pow((q - 0.995) / 0.012, 2.0)) * 1.1;
    gl_FragColor = vec4(bg + cool * side, 1.0);
    return;
  }

  float t0 = -b - sqrt(h);
  vec3 p0 = ro + lrd * t0;

  // Rotary anodized base cap below CUT
  if (p0.y < CUT){
    vec3 nBase = normalize(vec3(p0.x, 0.25, p0.z));
    float spec = pow(max(dot(nBase, normalize(vec3(-0.4, 0.7, 0.6))), 0.0), 18.0);
    vec3 baseCol = vec3(0.06, 0.062, 0.068) + vec3(0.18) * spec;
    gl_FragColor = vec4(baseCol, 1.0);
    return;
  }

  vec3 n0 = p0 / R;
  float ci = max(-dot(lrd, n0), 0.0);
  float F = fres(ci);

  vec3 r1 = refract(lrd, n0, 1.0 / 1.49);
  float b1 = dot(p0, r1), c1 = dot(p0, p0) - RI * RI, h1 = b1 * b1 - c1;
  vec3 vox = vec3(0.0);
  if (h1 > 0.0){
    float s1 = -b1 - sqrt(h1);
    vec3 p1 = p0 + r1 * s1;
    vec3 n1 = p1 / RI;
    vec3 r2r = refract(r1, n1, 1.49);
    if (dot(r2r, r2r) < 0.5) r2r = reflect(r1, n1);
    float b2 = dot(p1, r2r), c2 = dot(p1, p1) - RI * RI;
    float s2 = -b2 + sqrt(max(b2 * b2 - c2, 0.0));
    float sp = 1e9;
    if (r2r.y < 0.0){
      float tt = (-0.368 - p1.y) / r2r.y;
      if (tt > 0.0) sp = tt;
    }
    vec3 vo = p1 + vec3(0.0, 0.31, 0.0);
    float vt = min(s2, sp);
    if (vt > 0.0) vox = vortexTrace(vo, r2r, vt, 0.0022, t0 + s1, uTime);
  }

  vec3 refl = envDisp(reflect(lrd, n0), n0, ci, yaw) * F;
  vec3 col = bg * (1.0 - F) * 0.45 + vox * (1.0 - F * 0.6) + refl;

  // Dual crisp rim lines (warm rainbow left vs cool double-line right)
  float q = length(p);
  vec2 Ld = normalize(vec2(-0.55, 0.83) + vec2(uMouse.x - 0.5, -(uMouse.y - 0.5)) * 1.1);
  float side = pow(max(dot(normalize(p), Ld), 0.0), 1.3) * 0.92 + 0.08;
  float kMode = clamp(uMouse.x, 0.0, 1.0);
  float wW = 0.0085, wC = 0.0045;
  vec3 warm = vec3(
    1.5 * exp(-pow((q - 0.996) / wW, 2.0)) + 0.6 * exp(-pow((q - 0.988) / wW, 2.0)),
    exp(-pow((q - 0.985) / wW, 2.0)),
    exp(-pow((q - 0.978) / wW, 2.0))
  );
  vec3 cool = vec3(0.35, 0.55, 1.0) * exp(-pow((q - 0.995) / wC, 2.0)) * 1.2 +
              vec3(0.9, 0.95, 1.0) * exp(-pow((q - 0.976) / wC, 2.0)) * 0.9;
  col += mix(warm * 1.6, cool * 1.4, kMode) * side * step(q, 1.005);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export default function VolumeOrbCanvas({
  active,
  reduced,
  telemetryRefs,
  onProgramChange,
}: VolumeOrbCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const reducedRef = useRef(reduced);
  const telRefsRef = useRef(telemetryRefs);
  const onProgRef = useRef(onProgramChange);
  const progIdxRef = useRef(0);

  activeRef.current = active;
  reducedRef.current = reduced;
  telRefsRef.current = telemetryRefs;
  onProgRef.current = onProgramChange;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl, gl.FRAGMENT_SHADER, ORB_FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog);
      return;
    }

    const loc = {
      aPos: gl.getAttribLocation(prog, "aPos"),
      uRes: gl.getUniformLocation(prog, "uRes"),
      uTime: gl.getUniformLocation(prog, "uTime"),
      uMouse: gl.getUniformLocation(prog, "uMouse"),
      uMode: gl.getUniformLocation(prog, "uMode"),
    };

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      if (w <= 0 || h <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
    };

    resize();
    window.addEventListener("resize", resize);
    const ro =
      typeof ResizeObserver !== "undefined" && canvas.parentElement
        ? new ResizeObserver(resize)
        : null;
    if (ro && canvas.parentElement) ro.observe(canvas.parentElement);

    let mx = 0.5;
    let my = 0.5;
    let smx = 0.5;
    let smy = 0.5;
    let frameCount = 0;
    let fpsAccum = 0;
    let fpsLast = performance.now();
    let currentFps = 60;
    let rafId = 0;
    let disposed = false;

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      mx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      my = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    };

    const onClick = () => {
      if (!activeRef.current) return;
      progIdxRef.current = (progIdxRef.current + 1) % PROGRAMS.length;
      onProgRef.current(PROGRAMS[progIdxRef.current]);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("click", onClick);

    const startTime = performance.now();

    const draw = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(draw);
      if (!activeRef.current || canvas.width <= 1 || canvas.height <= 1) return;

      const t0 = performance.now();
      const tSec = reducedRef.current ? 2.4 : (now - startTime) * 0.001;
      smx += (mx - smx) * 0.08;
      smy += (my - smy) * 0.08;

      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(loc.aPos);
      gl.vertexAttribPointer(loc.aPos, 2, gl.FLOAT, false, 0, 0);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(loc.uRes, canvas.width, canvas.height);
      gl.uniform1f(loc.uTime, tSec);
      gl.uniform2f(loc.uMouse, smx, smy);
      gl.uniform1f(loc.uMode, progIdxRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      const cookMs = performance.now() - t0;
      fpsAccum += 1;
      frameCount += 1;
      if (now - fpsLast >= 250) {
        currentFps = Math.round((fpsAccum * 1000) / (now - fpsLast));
        fpsAccum = 0;
        fpsLast = now;
      }
      if (frameCount % 3 === 0) {
        writeTelemetry(telRefsRef.current, smx, smy, cookMs, currentFps);
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("click", onClick);
      gl.deleteBuffer(quad);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="sg-stage-canvas"
      aria-hidden="true"
    />
  );
}
