"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SignalWebGLCanvas, { type TelemetrySample } from "./SignalWebGLCanvas";
import VolumeOrbCanvas from "./VolumeOrbCanvas";
import SchematicArmCanvas from "./SchematicArmCanvas";

type SectionId = "home" | "clients" | "visual-art" | "lab" | "about";
type OutputMode = "signal" | "volume" | "arm";

const OUTPUTS: Array<{
  id: OutputMode;
  label: string;
  hint: string;
}> = [
  {
    id: "signal",
    label: "Out 01 Signal",
    hint: "Move to bend. Click to melt.",
  },
  {
    id: "volume",
    label: "Out 02 Volume",
    hint: "Voxel Orb — Terrain. Click for the next program.",
  },
  {
    id: "arm",
    label: "Out 03 System",
    hint: "IK Rig. Click to lock pose, again to release.",
  },
];

const BOOT_ROWS = [
  { label: "TYPE: SILKSCREEN, COURIER PRIME", status: "OK" },
  { label: "GRAPHICS: WEBGL2/1 + CANVAS", status: "OK" },
  { label: "AUDIO: MUTED / STUDY MODE", status: "OK" },
  { label: "SIGNAL BUS: 01..04", status: "READY" },
];

const CLIENT_PLACEHOLDERS = [
  { no: "01", name: "PLACEHOLDER / CLIENT 01", meta: "Year / Role · Case Study Pending" },
  { no: "02", name: "PLACEHOLDER / CLIENT 02", meta: "Year / Role · Case Study Pending" },
  { no: "03", name: "PLACEHOLDER / CLIENT 03", meta: "Year / Role · Case Study Pending" },
  { no: "04", name: "PLACEHOLDER / CLIENT 04", meta: "Year / Role · Case Study Pending" },
  { no: "05", name: "PLACEHOLDER / CLIENT 05", meta: "Year / Role · Case Study Pending" },
  { no: "06", name: "PLACEHOLDER / CLIENT 06", meta: "Year / Role · Case Study Pending" },
];

const ART_PLACEHOLDERS = [
  { id: "ART_01", tag: "SHADERS", label: "PLACEHOLDER TILE 01 · REAL-TIME STUDY", span: "wide", meta: "16:9 · PENDING" },
  { id: "ART_02", tag: "MOTION", label: "PLACEHOLDER TILE 02 · MOTION LOOP", span: "", meta: "0:15 · PENDING" },
  { id: "ART_03", tag: "3D / AI", label: "PLACEHOLDER TILE 03 · FRAME STUDY", span: "half", meta: "FRAME · PENDING" },
  { id: "ART_04", tag: "SYSTEM", label: "PLACEHOLDER TILE 04 · PROCEDURAL", span: "half", meta: "GLSL · PENDING" },
  { id: "ART_05", tag: "TYPE", label: "PLACEHOLDER TILE 05 · KINETIC TYPE", span: "", meta: "0:08 · PENDING" },
  { id: "ART_06", tag: "LAB", label: "PLACEHOLDER TILE 06 · VISUAL ARCHIVE", span: "wide", meta: "ARCHIVE · PENDING" },
];

interface LabNode {
  id: string;
  fam: string;
  name: string;
  x: number;
  y: number;
  meta: string;
  summary: string;
  status: string;
}

const INITIAL_LAB_NODES: LabNode[] = [
  {
    id: "node_01",
    fam: "COMP",
    name: "placeholder_01",
    x: 68,
    y: 196,
    meta: "Study slot · 01",
    summary: "Placeholder node reserved for future Fuel or Fool interactive pipeline breakdown.",
    status: "PLACEHOLDER",
  },
  {
    id: "node_02",
    fam: "TOP",
    name: "placeholder_02",
    x: 344,
    y: 138,
    meta: "Shader slot · 02",
    summary: "Placeholder node for real-time WebGL / shader experiment documentation.",
    status: "PLACEHOLDER",
  },
  {
    id: "node_03",
    fam: "CHOP",
    name: "placeholder_03",
    x: 344,
    y: 332,
    meta: "Agent slot · 03",
    summary: "Placeholder node for agentic orchestration and automated production pipeline.",
    status: "PLACEHOLDER",
  },
  {
    id: "node_04",
    fam: "COMP",
    name: "output_window",
    x: 620,
    y: 234,
    meta: "Composite · 16:9",
    summary: "Output monitor placeholder routing selected study nodes into the inspector.",
    status: "STANDBY",
  },
];

function parseHashSection(): SectionId {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.replace(/^#/, "").toLowerCase();
  if (h === "clients" || h === "visual-art" || h === "lab" || h === "about") {
    return h;
  }
  return "home";
}

export default function SignalStudyApp() {
  const [section, setSection] = useState<SectionId>("home");
  const [outputIdx, setOutputIdx] = useState(0);
  const [volumeProgram, setVolumeProgram] = useState("Terrain");
  const [bootPct, setBootPct] = useState(0);
  const [bootDone, setBootDone] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [switchTick, setSwitchTick] = useState(0);
  const [staticOn, setStaticOn] = useState(false);
  const [wipeTick, setWipeTick] = useState(0);
  const [wordmarkText, setWordmarkText] = useState("Juan Colombo");
  const [telemetry, setTelemetry] = useState<TelemetrySample>({
    tx: 0.5,
    ty: 0.5,
    cookMs: 0.4,
    fps: 60,
  });

  // Draggable lab placeholder nodes
  const [labNodes, setLabNodes] = useState<LabNode[]>(INITIAL_LAB_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node_01");
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const staticCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrambleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync reduced motion + URL hash
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReduced = () => setReduced(mq.matches);
    syncReduced();
    mq.addEventListener("change", syncReduced);

    setSection(parseHashSection());
    const onHashChange = () => {
      setSection(parseHashSection());
      setMenuOpen(false);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      mq.removeEventListener("change", syncReduced);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  // Boot sequence (skip automatically if reduced motion or click/ESC)
  useEffect(() => {
    if (reduced) {
      setBootPct(100);
      setBootDone(true);
      return;
    }
    const start = performance.now();
    const duration = 1150;
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 2.2);
      setBootPct(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setBootDone(true), 140);
      }
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBootPct(100);
        setBootDone(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [reduced]);

  // Mini oscilloscope waveform in header
  useEffect(() => {
    const canvas = scopeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let disposed = false;

    const draw = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(draw);
      const t = reduced ? 1.2 : now * 0.004;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(244, 241, 234, 0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      ctx.strokeStyle = "#ff2a1f";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const nx = x / w;
        const env = Math.sin(nx * Math.PI);
        const y =
          h / 2 +
          Math.sin(nx * 14 + t * 2.2) * 5.2 * env +
          Math.cos(nx * 29 - t * 3.1) * 2.2 * env;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    raf = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Brief CRT static noise burst on channel switch
  useEffect(() => {
    if (!staticOn) return;
    const canvas = staticCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const drawNoise = () => {
      const img = ctx.createImageData(canvas.width, canvas.height);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(drawNoise);
    };
    raf = requestAnimationFrame(drawNoise);

    const timer = setTimeout(() => setStaticOn(false), 240);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [staticOn]);

  const triggerWipe = useCallback(() => {
    setWipeTick((n) => n + 1);
  }, []);

  const navigateTo = useCallback(
    (next: SectionId) => {
      setMenuOpen(false);
      if (next === section) return;
      triggerWipe();
      const targetHash = next === "home" ? "#home" : `#${next}`;
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", targetHash);
      }
      setSection(next);
    },
    [section, triggerWipe]
  );

  const cycleOutput = useCallback(
    (dir: 1 | -1) => {
      setOutputIdx((prev) => (prev + dir + OUTPUTS.length) % OUTPUTS.length);
      setSwitchTick((n) => n + 1);
      setStaticOn(true);
      triggerWipe();
    },
    [triggerWipe]
  );

  const selectOutput = useCallback(
    (mode: OutputMode) => {
      const idx = OUTPUTS.findIndex((o) => o.id === mode);
      if (idx === -1 || idx === outputIdx) return;
      setOutputIdx(idx);
      setSwitchTick((n) => n + 1);
      setStaticOn(true);
      triggerWipe();
    },
    [outputIdx, triggerWipe]
  );

  const handleWordmarkEnter = useCallback(() => {
    if (reduced) return;
    const target = "Juan Colombo";
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/";
    let frame = 0;
    if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current);
    scrambleTimerRef.current = setInterval(() => {
      frame += 1;
      const next = target
        .split("")
        .map((ch, idx) => {
          if (ch === " ") return " ";
          if (idx < frame / 2) return ch;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");
      setWordmarkText(next);
      if (frame >= target.length * 2) {
        if (scrambleTimerRef.current) clearInterval(scrambleTimerRef.current);
        setWordmarkText(target);
      }
    }, 28);
  }, [reduced]);

  const activeOutput = OUTPUTS[outputIdx] ?? OUTPUTS[0];
  const activeHint =
    activeOutput.id === "volume"
      ? `Voxel Orb — ${volumeProgram}. Click for the next program.`
      : activeOutput.hint;

  const selectedLabNode = useMemo(
    () => labNodes.find((n) => n.id === selectedNodeId) ?? labNodes[0],
    [labNodes, selectedNodeId]
  );

  const onNodePointerDown = (e: React.PointerEvent, node: LabNode) => {
    setSelectedNodeId(node.id);
    dragRef.current = {
      id: node.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: node.x,
      origY: node.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onNodePointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    setLabNodes((prev) =>
      prev.map((n) =>
        n.id === d.id
          ? { ...n, x: Math.max(16, d.origX + dx), y: Math.max(140, d.origY + dy) }
          : n
      )
    );
  };

  const onNodePointerUp = () => {
    dragRef.current = null;
  };

  const activeCells = Math.round((bootPct / 100) * 48);

  return (
    <div className={section === "home" ? "" : "is-subpage"}>
      {/* ── BOOT OVERLAY ────────────────────────────────────────── */}
      <div
        className={`sg-boot ${bootDone ? "is-done" : ""}`}
        aria-hidden={bootDone}
        onClick={() => {
          setBootPct(100);
          setBootDone(true);
        }}
      >
        <div className="sg-bt-top">
          <span className="sg-bt-name">
            <i />
            Juan Colombo
          </span>
          <span className="sg-bt-tag">System check · click or esc to skip</span>
        </div>

        <div className="sg-bt-log">
          {BOOT_ROWS.map((row, idx) => {
            const threshold = (idx + 1) * 22;
            const ok = bootPct >= threshold;
            return (
              <div
                key={row.label}
                className={`sg-bt-row ${ok ? "ok" : "go"}`}
              >
                <span className="sg-bt-t">{row.label}</span>
                <span className="sg-bt-dots" />
                <span className="sg-bt-s">{ok ? row.status : "..."}</span>
              </div>
            );
          })}
        </div>

        <div className="sg-bt-foot">
          <div className="sg-bt-pc">
            {String(bootPct).padStart(3, "0")}
            <small>%</small>
          </div>
          <div className="sg-bt-cells">
            {Array.from({ length: 48 }).map((_, idx) => {
              const cls =
                idx === activeCells - 1 && bootPct < 100
                  ? "hot"
                  : idx < activeCells
                  ? "on"
                  : "";
              return <i key={idx} className={cls} />;
            })}
          </div>
        </div>
      </div>

      {/* ── TOP HEADER ──────────────────────────────────────────── */}
      <header className="sg-top">
        <a
          className="sg-mark"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("home");
          }}
          onMouseEnter={handleWordmarkEnter}
          aria-label="Juan Colombo, home"
        >
          <span className="sg-mk-scope" aria-hidden="true">
            <canvas ref={scopeCanvasRef} width={50} height={22} />
          </span>
          <span className="sg-name">
            {wordmarkText.split("").map((ch, idx) => (
              <span
                key={idx}
                className={
                  ch !== "Juan Colombo"[idx] ? "sg-dec" : undefined
                }
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </span>
        </a>

        {section !== "home" ? (
          <div role="navigation" className="sg-mainnav" aria-label="Sections">
            <a
              href="#clients"
              aria-current={section === "clients" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("clients");
              }}
            >
              <b>01</b>
              <span>Clients</span>
            </a>
            <a
              href="#visual-art"
              aria-current={section === "visual-art" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("visual-art");
              }}
            >
              <b>02</b>
              <span>Visual Art</span>
            </a>
            <a
              href="#lab"
              aria-current={section === "lab" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("lab");
              }}
            >
              <b>03</b>
              <span>Creative Lab</span>
            </a>
            <a
              href="#about"
              aria-current={section === "about" ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("about");
              }}
            >
              <b>04</b>
              <span>About</span>
            </a>
          </div>
        ) : (
          <div className="sg-osd">
            <span className="sg-chn" aria-live="polite">
              {activeOutput.label}
            </span>
            <span className="sg-arrows">
              <button
                type="button"
                aria-label="Next output"
                onClick={() => cycleOutput(1)}
              >
                <span className="sg-tri up" />
              </button>
              <button
                type="button"
                aria-label="Previous output"
                onClick={() => cycleOutput(-1)}
              >
                <span className="sg-tri dn" />
              </button>
            </span>
          </div>
        )}

        <button
          type="button"
          className="sg-menubtn"
          aria-expanded={menuOpen}
          aria-controls="sg-mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span>Index</span>
          <i />
        </button>
      </header>

      {/* ── MOBILE INDEX DRAWER ─────────────────────────────────── */}
      <div
        role="navigation"
        id="sg-mobile-menu"
        className="sg-menu"
        aria-label="Index"
        hidden={!menuOpen}
      >
        {(
          [
            { id: "home", no: "00", label: "Home" },
            { id: "clients", no: "01", label: "Clients" },
            { id: "visual-art", no: "02", label: "Visual Art" },
            { id: "lab", no: "03", label: "Creative Lab" },
            { id: "about", no: "04", label: "About Me" },
          ] as const
        ).map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={section === item.id ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              navigateTo(item.id);
            }}
          >
            <b>{item.no}</b>
            <span>{item.label}</span>
          </a>
        ))}
        <p>
          <a href="mailto:juan@fuelorfool.ing">juan@fuelorfool.ing</a>
        </p>
      </div>

      {/* Horizontal Red Wipe Bar */}
      <div
        key={wipeTick}
        className={`sg-wipe ${wipeTick > 0 ? "go" : ""}`}
        aria-hidden="true"
      />

      {/* ── 00 HOME ─────────────────────────────────────────────── */}
      <section
        id="home"
        className="sg-page sg-home"
        aria-label="Home"
        hidden={section !== "home"}
      >
        <div className="sg-screen">
          {activeOutput.id === "signal" && (
            <SignalWebGLCanvas
              active={section === "home" && activeOutput.id === "signal"}
              switchTick={switchTick}
              reduced={reduced}
              onTelemetry={setTelemetry}
            />
          )}
          {activeOutput.id === "volume" && (
            <VolumeOrbCanvas
              active={section === "home" && activeOutput.id === "volume"}
              reduced={reduced}
              onTelemetry={setTelemetry}
              onProgramChange={setVolumeProgram}
            />
          )}
          {activeOutput.id === "arm" && (
            <SchematicArmCanvas
              active={section === "home" && activeOutput.id === "arm"}
              reduced={reduced}
              onTelemetry={setTelemetry}
            />
          )}

          <div className="sg-crt" aria-hidden="true" />
          <canvas
            ref={staticCanvasRef}
            className={`sg-chstatic ${staticOn ? "on" : ""}`}
            width={160}
            height={90}
            aria-hidden="true"
          />

          <div className="sg-mosd">
            <span>{activeOutput.label}</span>
            <span className="sg-arrows">
              <button
                type="button"
                aria-label="Previous output"
                onClick={() => cycleOutput(-1)}
              >
                <span className="sg-tri lf" />
              </button>
              <button
                type="button"
                aria-label="Next output"
                onClick={() => cycleOutput(1)}
              >
                <span className="sg-tri rt" />
              </button>
            </span>
          </div>
        </div>

        <div className="sg-hero">
          <div className="sg-intro">
            <h1 className="sg-statement">
              <span className="sg-l1">
                <span className="sg-ln">
                  <button
                    type="button"
                    className={`sg-k ${
                      activeOutput.id === "signal" ? "is-active" : "is-dim"
                    }`}
                    onClick={() => selectOutput("signal")}
                  >
                    Pixels,
                  </button>{" "}
                  <button
                    type="button"
                    className={`sg-k ${
                      activeOutput.id === "volume" ? "is-active" : "is-dim"
                    }`}
                    onClick={() => selectOutput("volume")}
                  >
                    voxels,
                  </button>
                </span>
                <span className="sg-ln">
                  <button
                    type="button"
                    className={`sg-k ${
                      activeOutput.id === "arm" ? "is-active" : "is-dim"
                    }`}
                    onClick={() => selectOutput("arm")}
                  >
                    agentic systems.
                  </button>
                </span>
              </span>
              <span className="sg-l2">
                Product &amp; creative lead. 18+ years shipping campaigns, Microsoft
                UX/UI and AI-driven tools at Fuel or Fool.
              </span>
            </h1>
            <div aria-hidden="true" />
          </div>

          <div role="navigation" className="sg-cols" aria-label="Sections">
            <a
              href="#clients"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("clients");
              }}
            >
              <span className="sg-n">01</span>
              <span className="sg-l">Clients</span>
            </a>
            <a
              href="#visual-art"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("visual-art");
              }}
            >
              <span className="sg-n">02</span>
              <span className="sg-l">Visual Art</span>
            </a>
            <a
              href="#lab"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("lab");
              }}
            >
              <span className="sg-n">03</span>
              <span className="sg-l">Creative Lab</span>
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                navigateTo("about");
              }}
            >
              <span className="sg-n">04</span>
              <span className="sg-l">About Me</span>
            </a>
          </div>

          <div className="sg-foot">
            <div className="sg-readout" aria-hidden="true">
              <span>
                tx <b>{telemetry.tx.toFixed(3)}</b>
              </span>
              <span>
                ty <b>{telemetry.ty.toFixed(3)}</b>
              </span>
              <span>
                cook <b>{telemetry.cookMs.toFixed(1)}</b> ms
              </span>
              <span>
                <b>{telemetry.fps}</b> fps
              </span>
            </div>
            <p className="sg-hint">{activeHint}</p>
          </div>
        </div>
      </section>

      {/* ── 01 CLIENTS (PLACEHOLDER) ────────────────────────────── */}
      <section
        id="clients"
        className="sg-page sg-scroll"
        aria-label="Clients"
        hidden={section !== "clients"}
      >
        <div className="sg-inner">
          <div className="sg-ptitle">
            <h1>Clients</h1>
            <p>
              Study placeholder — commercial product, campaign and UX/UI client
              roster will populate here.
            </p>
          </div>
          <div className="sg-kit is-tight">
            <span className="sg-lab">Toolkit</span>
            <span>Figma</span>
            <span>After Effects</span>
            <span>Illustrator</span>
            <span>Photoshop</span>
            <span>Jira</span>
            <span>Azure DevOps</span>
          </div>
          <div className="sg-kit">
            <span className="sg-lab">Focus</span>
            <span>Product Ownership</span>
            <span>UX/UI Systems</span>
            <span>Art Direction</span>
            <span>Motion</span>
            <span>ATL / BTL</span>
          </div>
          <ul className="sg-index">
            {CLIENT_PLACEHOLDERS.map((item) => (
              <li key={item.no}>
                <button type="button" onClick={() => navigateTo("about")}>
                  <span className="sg-no">{item.no}</span>
                  <span className="sg-cn">{item.name}</span>
                  <span className="sg-meta">{item.meta}</span>
                  <span className="sg-go">Soon ›</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 02 VISUAL ART (PLACEHOLDER) ─────────────────────────── */}
      <section
        id="visual-art"
        className="sg-page sg-scroll"
        aria-label="Visual Art"
        hidden={section !== "visual-art"}
      >
        <div className="sg-inner">
          <div className="sg-ptitle">
            <h1>Visual Art</h1>
            <p>
              Study placeholder — contact sheet reserved for real-time shaders,
              frame-by-frame AI animation and motion experiments.
            </p>
          </div>
          <div className="sg-kit is-tight">
            <span className="sg-lab">Toolkit</span>
            <span>GLSL</span>
            <span>Three.js</span>
            <span>Remotion</span>
            <span>ffmpeg</span>
            <span>After Effects</span>
          </div>
          <div className="sg-kit">
            <span className="sg-lab">Focus</span>
            <span>Shaders</span>
            <span>Kinetic Type</span>
            <span>Frame-by-Frame</span>
            <span>Generative Systems</span>
          </div>
          <div className="sg-sheet">
            {ART_PLACEHOLDERS.map((tile) => (
              <div key={tile.id} className={`sg-tile ${tile.span}`}>
                <div className="sg-hd">
                  <span className="sg-fam">{tile.tag}</span>
                  <span>{tile.id}</span>
                  <span className="sg-rt">{tile.meta}</span>
                </div>
                <div className="sg-bd">
                  <span>{tile.label}</span>
                </div>
                <div className="sg-ft">
                  <span>Placeholder slot</span>
                  <span>Fuel or Fool Lab</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 CREATIVE LAB (PLACEHOLDER) ───────────────────────── */}
      <section
        id="lab"
        className="sg-page sg-lab"
        aria-label="Creative Lab"
        hidden={section !== "lab"}
      >
        <div className="sg-net">
          {labNodes.map((node) => (
            <div
              key={node.id}
              className={`sg-node ${
                selectedLabNode.id === node.id ? "sel" : ""
              }`}
              style={{ left: node.x, top: node.y }}
              onPointerDown={(e) => onNodePointerDown(e, node)}
              onPointerMove={onNodePointerMove}
              onPointerUp={onNodePointerUp}
            >
              <div className="sg-nhd">
                <span className="sg-nfam">[{node.fam}]</span>
                <span>{node.name}</span>
              </div>
              <div className="sg-nbody">PLACEHOLDER</div>
              <div className="sg-nmeta">{node.meta}</div>
            </div>
          ))}
        </div>

        <div className="sg-ptitle sg-labt">
          <h1>Creative Lab</h1>
        </div>
        <div className="sg-netbar">
          <span>/juan/lab</span>
          <span className="sg-fps">{telemetry.fps} fps</span>
          <button
            type="button"
            onClick={() => setLabNodes(INITIAL_LAB_NODES)}
          >
            Re-center
          </button>
        </div>
        <p className="sg-nethelp">
          Placeholder node graph — drag nodes to reposition, click any node to
          inspect its slot.
        </p>

        <div className="sg-cwin">
          <div className="sg-ctab">
            <span>[{selectedLabNode.fam}]</span>
            <span>{selectedLabNode.name}</span>
          </div>
          <aside className="sg-case">
            <div className="sg-vw">[ PLACEHOLDER MONITOR ]</div>
            <h2>{selectedLabNode.name}</h2>
            <p>{selectedLabNode.summary}</p>
            <dl>
              <dt>Status</dt>
              <dd>{selectedLabNode.status}</dd>
              <dt>Slot</dt>
              <dd>{selectedLabNode.meta}</dd>
              <dt>Studio</dt>
              <dd>Fuel or Fool · Study Template</dd>
            </dl>
          </aside>
        </div>
      </section>

      {/* ── 04 ABOUT ME (FULLY POPULATED) ───────────────────────── */}
      <section
        id="about"
        className="sg-page sg-scroll"
        aria-label="About Me"
        hidden={section !== "about"}
      >
        <div className="sg-inner">
          <div className="sg-ptitle">
            <h1>About</h1>
          </div>
          <div className="sg-about">
            <div>
              <div className="sg-portrait">
                <div className="sg-portrait-inner">
                  <span>[portrait]</span>
                  <small>Juan Colombo · Drop photo here</small>
                </div>
              </div>
              <div className="sg-cap">
                <span>fig. 01</span>
                <span>[the secret weapon]</span>
              </div>
              <p className="sg-hi">Come say hi!</p>
              <p className="sg-mail">
                <a href="mailto:juan@fuelorfool.ing">juan@fuelorfool.ing</a>
              </p>
              <p className="sg-mail">
                <a
                  href="https://fuelorfool.ing"
                  target="_blank"
                  rel="noreferrer"
                >
                  fuelorfool.ing ↗
                </a>
              </p>
            </div>

            <div className="sg-bio">
              <p>
                Juan Colombo is a Product and Creative Lead with 18+ years
                shipping real work across mixed teams — from ATL and BTL
                campaigns at Leo Burnett Venezuela and end-to-end physical
                production QA in Miami, to UX/UI on{" "}
                <em>Microsoft Copilot</em> and <em>Xbox Game Pass</em>.
              </p>
              <p>
                Today he leads <em>Fuel or Fool</em>, an independent studio and
                lab building AI-driven pipelines, agentic animation workflows
                like <em>Frame by Agents</em> and <em>Illusion of Life</em>,
                programmatic video systems, and interactive web experiences.
              </p>
              <p>
                Known by colleagues as <em>&ldquo;The Secret Weapon&rdquo;</em>{" "}
                for unconventional problems — spotting the angle nobody else is
                looking at, whether launching a low-budget street campaign like{" "}
                <em>Notorious</em> (2009) or trimming sprint scope to unblock a
                team and ship on time.
              </p>

              <dl className="sg-spec">
                <dt>Practice</dt>
                <dd>
                  Product ownership (MoSCoW, Jira, Azure DevOps), UX/UI systems,
                  art direction, agentic AI pipelines, motion &amp; end-to-end
                  QA
                </dd>
                <dt>Experience</dt>
                <dd>
                  Fuel or Fool — Founder, Product &amp; AI Lead
                  <br />
                  Microsoft — UX/UI Designer, Copilot &amp; Xbox Game Pass
                  <br />
                  Discount Favors — Production &amp; QA Director
                  <br />
                  Leo Burnett Venezuela — Creative Director (ATL/BTL)
                </dd>
                <dt>Education</dt>
                <dd>
                  Lambda School — UX/UI (GPA 3.77)
                  <br />
                  Prodesign — Graphic Design
                </dd>
                <dt>Stack</dt>
                <dd>
                  Figma, Adobe Creative Suite, Claude / Gemini / Codex, Python,
                  SQLite, HTML/CSS, Remotion, ffmpeg, Git
                </dd>
                <dt>Languages</dt>
                <dd>Spanish (Native · C2) · English (Bilingual · C1+)</dd>
                <dt>Lab &amp; Builds</dt>
                <dd>
                  Frame by Agents · Access Twin · Synthia: Club of the Dead ·
                  Illusion of Life · Molotov Love{" "}
                  <a
                    className="sg-more"
                    href="#lab"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo("lab");
                    }}
                  >
                    [lab]
                  </a>
                </dd>
                <dt>Links</dt>
                <dd>
                  <a
                    className="sg-more"
                    href="https://www.linkedin.com/in/juanbcolombodesigns/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn ↗
                  </a>{" "}
                  ·{" "}
                  <a
                    className="sg-more"
                    href="https://fuelorfool.ing"
                    target="_blank"
                    rel="noreferrer"
                  >
                    fuelorfool.ing ↗
                  </a>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
