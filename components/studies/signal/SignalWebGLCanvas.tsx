"use client";

import { useEffect, useRef } from "react";
import { writeTelemetry, type TelemetryRefs } from "./types";

interface SignalWebGLCanvasProps {
  active: boolean;
  switchTick: number;
  reduced: boolean;
  telemetryRefs: TelemetryRefs;
}

const VERT_SRC = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const NOISE_GLSL = `
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
`;

const TRAIL_FRAG = `
precision highp float;
uniform sampler2D uPrev;
uniform vec2 uTRes;
uniform vec2 uMouse;
uniform vec2 uPM;
uniform float uDown;
void main(){
  vec2 uv = gl_FragCoord.xy / uTRes;
  vec2 px = 1.0 / uTRes;
  float a = uTRes.x / uTRes.y;
  vec4 c = texture2D(uPrev, uv);
  vec2 v = (c.gb - 0.5) * 2.0;
  vec2 u = uv - v * 0.004;
  vec4 s = texture2D(uPrev, u) * 0.5 + (
    texture2D(uPrev, u + vec2(px.x, 0.0)) +
    texture2D(uPrev, u - vec2(px.x, 0.0)) +
    texture2D(uPrev, u + vec2(0.0, px.y)) +
    texture2D(uPrev, u - vec2(0.0, px.y))
  ) * 0.125;
  float amt = max(s.r * 0.975 - 0.0045, 0.0);
  vec2 vel = (s.gb - 0.5) * 2.0 * 0.985;
  vel = sign(vel) * max(abs(vel) - 0.006, 0.0) * smoothstep(0.0, 0.05, amt);
  vec2 pa = (uv - uPM) * vec2(a, 1.0);
  vec2 ba = (uMouse - uPM) * vec2(a, 1.0);
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-7), 0.0, 1.0);
  float d = length(pa - ba * h);
  float spd = length(ba);
  float k = exp(-d * d / 0.0036);
  amt += k * (min(spd * 30.0, 1.0) * 0.45 + uDown * 0.05);
  vel = mix(vel, clamp(ba / max(spd, 1e-5) * min(spd * 40.0, 1.0), -1.0, 1.0), k * 0.6);
  gl_FragColor = vec4(clamp(amt, 0.0, 1.0), vel * 0.5 + 0.5, 1.0);
}
`;

const FIELD_FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uVelL;
uniform vec2 uCP;
uniform float uCA;
uniform sampler2D uTrail;
${NOISE_GLSL}
vec4 trail(vec2 uv){
  vec4 t = texture2D(uTrail, uv);
  return vec4(t.r, (t.gb - 0.5) * 2.0, 1.0);
}
vec2 bend(vec2 p, float asp){
  vec2 m = vec2(uMouse.x * asp, uMouse.y);
  vec2 d = p - m;
  float r2 = dot(d, d);
  p -= d * (0.28 + 0.4 * uVelL) * exp(-r2 * 6.0);
  p = m + rot2(p - m, (0.6 + 1.8 * uVelL) * exp(-r2 * 9.0));
  vec2 cp = vec2(uCP.x * asp, uCP.y);
  vec2 cd = p - cp;
  float k = exp(-uCA * 1.4) * exp(-dot(cd, cd) * 2.2);
  vec2 wob = vec2(noise(p * 6.0 + uTime * 2.5), noise(p * 6.0 - uTime * 2.5 + 3.0)) - 0.5;
  p = cp + rot2(cd, k * 2.6 * sin(uCA * 5.0 + 1.0)) + wob * k * 0.4;
  return p;
}
float height(vec2 p, vec2 q, float burst){
  return fbm(p * 1.3 + q * (1.6 + burst * 1.2) + vec2(0.0, uTime * 0.06));
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec4 tr = trail(uv);
  vec2 p = bend(vec2(uv.x * asp, uv.y), asp);
  p -= tr.yz * tr.x * 0.12 * smoothstep(0.03, 0.2, tr.x);
  p += (vec2(fbm(p * 2.3 + vec2(uTime * 0.05, 0.0)), fbm(p * 2.3 + vec2(3.1, -uTime * 0.05))) - 0.5) * 0.16;
  float burst = tr.x * 0.8;
  float t = uTime * 0.06;
  vec2 q = vec2(fbm(p * 1.7 + t), fbm(p * 1.7 - t + 5.2));
  float n = height(p, q, burst);
  float e = 0.006;
  float gx = (height(p + vec2(e, 0.0), q, burst) - n) / e * 0.55;
  float gy = (height(p + vec2(0.0, e), q, burst) - n) / e * 0.55;
  gl_FragColor = vec4(n, gx, gy, 1.0);
}
`;

const COMPOSITE_FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uCP;
uniform float uCA;
uniform sampler2D uTrail;
uniform sampler2D uField;
uniform float uK;
uniform float uSwitch;
${NOISE_GLSL}
float band(float s, float burst, float aa){
  float w = min(0.44, mix(0.09, 0.24, pow(hash(vec2(floor(s), 3.1)), 1.3)) + 0.09 + 0.04 * burst);
  return 1.0 - smoothstep(w - aa, w, abs(fract(s) - 0.5));
}
void main(){
  vec2 uv0 = gl_FragCoord.xy / uRes;
  vec2 uv = uv0;
  float asp = uRes.x / uRes.y;
  float gt = hash(vec2(floor(uv0.y * 40.0), floor(uTime * 24.0)));
  uv.x += (gt - 0.5) * 0.18 * uSwitch * step(0.45, gt);
  vec2 dir = (uv0 - 0.5) * (0.002 + 0.012 * exp(-uCA * 3.0)) + vec2(0.0007, 0.0);
  vec4 F = texture2D(uField, uv);
  float n = F.r;
  vec3 N = normalize(vec3(F.g, F.b, 1.0));
  float burst = texture2D(uTrail, uv).r * 0.8;
  float t15 = uTime * 0.15;
  float s = n * 16.0 - t15;
  float aa = clamp(16.0 * length(F.gb) / 0.55 / uRes.y * 1.3, 0.008, 0.12);
  float ca = 0.006 + 0.01 * burst;
  float sR = texture2D(uField, uv + dir).r * 16.0 - t15;
  float sB = texture2D(uField, uv - dir).r * 16.0 - t15;
  vec3 lines = vec3(band(sR + ca, burst, aa), band(s, burst, aa), band(sB - ca, burst, aa));
  float L = lines.g;
  float w = min(0.44, mix(0.09, 0.24, pow(hash(vec2(floor(s), 3.1)), 1.3)) + 0.09 + 0.04 * burst);
  float swirl = 0.0, glint = 0.0, fade = exp(-uCA * 1.1);
  if (fade > 0.002){
    vec2 cd = vec2(uv.x * asp, uv.y) - vec2(uCP.x * asp, uCP.y);
    float r = length(cd), an = atan(cd.y, cd.x);
    swirl = sin(an * 3.0 - r * 18.0 + uCA * 8.0) * exp(-r * 2.5) * fade;
    glint = exp(-pow((r - uCA * 0.7) * 10.0, 2.0)) * fade * (0.6 + 0.4 * sin(an * 6.0 + uCA * 10.0));
  }
  float inside = clamp((w - abs(fract(s) - 0.5)) / max(w, 1e-3), 0.0, 1.0);
  float edge = 1.0 - inside;
  float x = inside * 1.5 + n * 0.9 + (1.0 - N.z) * 0.9 + swirl * 0.6;
  vec3 spec7 = 0.5 + 0.5 * cos(6.28318 * (x + vec3(0.0, 0.27, 0.58)));
  spec7.g *= 0.82;
  spec7 = mix(spec7, vec3(0.72, 0.66, 1.0), 0.1);
  vec3 bands = pow(spec7, vec3(1.45)) * (0.22 + 1.5 * pow(edge, 1.2)) * 1.6;
  float env = pow(0.5 + 0.5 * cos(6.28318 * (N.x * 0.9 + N.y * 0.6 + n * 0.8 + swirl * 0.5 + glint * 0.3)), 4.0);
  vec3 sheen = mix(vec3(0.62, 0.58, 1.0), vec3(1.0), env) * env * smoothstep(0.15, 0.7, inside) * 0.75;
  vec3 rimLine = vec3(1.0) * exp(-inside * 26.0) * 0.9;
  float hl = pow(max(dot(N, normalize(vec3(-0.45, 0.55, 1.7))), 0.0), 90.0);
  vec3 oil = vec3(0.015, 0.012, 0.03) + bands + sheen + rimLine + vec3(1.0) * hl * 1.3;
  vec2 fc = gl_FragCoord.xy * uK;
  float grain = hash(floor(fc) * 0.73 + floor(uTime * 12.0));
  vec2 sp2 = vec2(dot(fc, vec2(0.8, 0.6)), dot(fc, vec2(-0.6, 0.8)));
  oil *= 0.86 + 0.28 * grain;
  oil += step(0.985, noise(vec2(sp2.x * 0.02, sp2.y * 1.4))) * 0.12 * (0.3 + edge);
  float s2 = n * 52.0 - uTime * 0.3;
  float hair = 1.0 - smoothstep(0.0, 0.045 + aa * 3.25, abs(fract(s2) - 0.5));
  vec3 RED = vec3(1.0, 0.165, 0.122);
  vec3 bg = RED * (hair * 0.06 + 0.02 * smoothstep(0.35, 0.9, n)) + vec3(0.04, 0.045, 0.062) * (0.7 + 0.3 * smoothstep(0.2, 0.8, n));
  vec3 o = bg * (1.0 - lines) + oil * lines * (1.18 + 0.2 * burst);
  o += vec3(0.85, 0.8, 1.0) * glint * L * 1.1;
  o *= mix(0.24, 1.0, smoothstep(0.08, 0.8, uv.x));
  vec3 c = o * 1.3;
  c += (hash(gl_FragCoord.xy + fract(uTime * 7.0) * 311.0) - 0.5) * 0.05;
  c *= 0.97 + 0.03 * sin(uTime * 50.0 + uv0.y * 8.0);
  vec2 v = uv0 - 0.5;
  c *= 1.0 - dot(v, v) * 0.3;
  c *= mix(0.93, 1.0, smoothstep(0.08, 0.7, uv0.x));
  if (uSwitch > 0.0){
    float st = hash(floor(gl_FragCoord.xy / 2.0) + floor(uTime * 30.0));
    c = mix(c, vec3(st) * 0.8, uSwitch * 0.75);
  }
  gl_FragColor = vec4(max(c, 0.0), 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
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

function createProgram(gl: WebGLRenderingContext, vertSrc: string, fragSrc: string) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

function createFbo(gl: WebGLRenderingContext, w: number, h: number) {
  const tex = gl.createTexture();
  const fbo = gl.createFramebuffer();
  if (!tex || !fbo) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { tex, fbo, w, h };
}

export default function SignalWebGLCanvas({
  active,
  switchTick,
  reduced,
  telemetryRefs,
}: SignalWebGLCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const reducedRef = useRef(reduced);
  const telRefsRef = useRef(telemetryRefs);
  const switchImpulseRef = useRef(0);

  activeRef.current = active;
  reducedRef.current = reduced;
  telRefsRef.current = telemetryRefs;

  useEffect(() => {
    if (switchTick > 0) {
      switchImpulseRef.current = 1;
    }
  }, [switchTick]);

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

    const progTrail = createProgram(gl, VERT_SRC, TRAIL_FRAG);
    const progField = createProgram(gl, VERT_SRC, FIELD_FRAG);
    const progComp = createProgram(gl, VERT_SRC, COMPOSITE_FRAG);
    if (!progTrail || !progField || !progComp) return;

    // Cache all attribute & uniform locations once
    const trailLoc = {
      aPos: gl.getAttribLocation(progTrail, "aPos"),
      uPrev: gl.getUniformLocation(progTrail, "uPrev"),
      uTRes: gl.getUniformLocation(progTrail, "uTRes"),
      uMouse: gl.getUniformLocation(progTrail, "uMouse"),
      uPM: gl.getUniformLocation(progTrail, "uPM"),
      uDown: gl.getUniformLocation(progTrail, "uDown"),
    };
    const fieldLoc = {
      aPos: gl.getAttribLocation(progField, "aPos"),
      uTrail: gl.getUniformLocation(progField, "uTrail"),
      uRes: gl.getUniformLocation(progField, "uRes"),
      uTime: gl.getUniformLocation(progField, "uTime"),
      uMouse: gl.getUniformLocation(progField, "uMouse"),
      uVelL: gl.getUniformLocation(progField, "uVelL"),
      uCP: gl.getUniformLocation(progField, "uCP"),
      uCA: gl.getUniformLocation(progField, "uCA"),
    };
    const compLoc = {
      aPos: gl.getAttribLocation(progComp, "aPos"),
      uTrail: gl.getUniformLocation(progComp, "uTrail"),
      uField: gl.getUniformLocation(progComp, "uField"),
      uRes: gl.getUniformLocation(progComp, "uRes"),
      uTime: gl.getUniformLocation(progComp, "uTime"),
      uCP: gl.getUniformLocation(progComp, "uCP"),
      uCA: gl.getUniformLocation(progComp, "uCA"),
      uK: gl.getUniformLocation(progComp, "uK"),
      uSwitch: gl.getUniformLocation(progComp, "uSwitch"),
    };

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const TRAIL_W = 224;
    const TRAIL_H = 126;
    let trailA = createFbo(gl, TRAIL_W, TRAIL_H);
    let trailB = createFbo(gl, TRAIL_W, TRAIL_H);
    let fieldFbo = createFbo(gl, 420, 236);

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      if (w <= 0 || h <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const cw = Math.max(1, Math.floor(w * dpr));
      const ch = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        const fw = Math.max(224, Math.floor(cw * 0.34));
        const fh = Math.max(126, Math.floor(ch * 0.34));
        if (fieldFbo) {
          gl.deleteTexture(fieldFbo.tex);
          gl.deleteFramebuffer(fieldFbo.fbo);
        }
        fieldFbo = createFbo(gl, fw, fh);
      }
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
    let pmx = 0.5;
    let pmy = 0.5;
    let isDown = 0;
    let velL = 0;
    let clickX = 0.5;
    let clickY = 0.5;
    let clickAge = 99;

    const updatePointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      mx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      my = Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / r.height));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!activeRef.current) return;
      isDown = 1;
      updatePointer(e);
      clickX = mx;
      clickY = my;
      clickAge = 0;
    };

    const onPointerUp = () => {
      isDown = 0;
    };

    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    let rafId = 0;
    let disposed = false;
    const startTime = performance.now();
    let prevNow = startTime;
    let fpsAccum = 0;
    let fpsCount = 0;
    let fpsLast = startTime;
    let currentFps = 60;

    const bindQuad = (loc: number) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    const renderFrame = (now: number) => {
      if (disposed) return;
      rafId = requestAnimationFrame(renderFrame);
      if (!activeRef.current || canvas.width <= 1 || canvas.height <= 1) return;

      const t0 = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - prevNow) / 1000));
      prevNow = now;
      const tSec = reducedRef.current ? 4.2 : (now - startTime) * 0.001;

      const dx = mx - pmx;
      const dy = my - pmy;
      const instVel = Math.min(1, Math.hypot(dx, dy) * 28);
      velL = velL * 0.88 + instVel * 0.12;
      clickAge = Math.min(99, clickAge + dt);
      switchImpulseRef.current = Math.max(0, switchImpulseRef.current - dt * 2.8);

      if (trailA && trailB) {
        gl.useProgram(progTrail);
        bindQuad(trailLoc.aPos);
        gl.bindFramebuffer(gl.FRAMEBUFFER, trailB.fbo);
        gl.viewport(0, 0, trailB.w, trailB.h);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, trailA.tex);
        gl.uniform1i(trailLoc.uPrev, 0);
        gl.uniform2f(trailLoc.uTRes, trailB.w, trailB.h);
        gl.uniform2f(trailLoc.uMouse, mx, my);
        gl.uniform2f(trailLoc.uPM, pmx, pmy);
        gl.uniform1f(trailLoc.uDown, isDown);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        const tmp = trailA;
        trailA = trailB;
        trailB = tmp;
      }

      if (fieldFbo && trailA) {
        gl.useProgram(progField);
        bindQuad(fieldLoc.aPos);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fieldFbo.fbo);
        gl.viewport(0, 0, fieldFbo.w, fieldFbo.h);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, trailA.tex);
        gl.uniform1i(fieldLoc.uTrail, 0);
        gl.uniform2f(fieldLoc.uRes, fieldFbo.w, fieldFbo.h);
        gl.uniform1f(fieldLoc.uTime, tSec);
        gl.uniform2f(fieldLoc.uMouse, mx, my);
        gl.uniform1f(fieldLoc.uVelL, velL);
        gl.uniform2f(fieldLoc.uCP, clickX, clickY);
        gl.uniform1f(fieldLoc.uCA, clickAge);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      if (fieldFbo && trailA) {
        gl.useProgram(progComp);
        bindQuad(compLoc.aPos);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, trailA.tex);
        gl.uniform1i(compLoc.uTrail, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, fieldFbo.tex);
        gl.uniform1i(compLoc.uField, 1);
        gl.uniform2f(compLoc.uRes, canvas.width, canvas.height);
        gl.uniform1f(compLoc.uTime, tSec);
        gl.uniform2f(compLoc.uCP, clickX, clickY);
        gl.uniform1f(compLoc.uCA, clickAge);
        gl.uniform1f(compLoc.uK, 1.0);
        gl.uniform1f(compLoc.uSwitch, switchImpulseRef.current);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      pmx = mx;
      pmy = my;

      const cookMs = performance.now() - t0;
      fpsAccum += 1;
      fpsCount += 1;
      if (now - fpsLast >= 250) {
        currentFps = Math.round((fpsAccum * 1000) / (now - fpsLast));
        fpsAccum = 0;
        fpsLast = now;
      }
      if (fpsCount % 3 === 0) {
        writeTelemetry(telRefsRef.current, mx, my, cookMs, currentFps);
      }
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      if (trailA) {
        gl.deleteTexture(trailA.tex);
        gl.deleteFramebuffer(trailA.fbo);
      }
      if (trailB) {
        gl.deleteTexture(trailB.tex);
        gl.deleteFramebuffer(trailB.fbo);
      }
      if (fieldFbo) {
        gl.deleteTexture(fieldFbo.tex);
        gl.deleteFramebuffer(fieldFbo.fbo);
      }
      gl.deleteBuffer(quad);
      gl.deleteProgram(progTrail);
      gl.deleteProgram(progField);
      gl.deleteProgram(progComp);
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
