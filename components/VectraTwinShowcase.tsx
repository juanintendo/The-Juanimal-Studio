"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type ChapterId = "what" | "how" | "why" | "where";
type RecapLens = "matrix" | "stack" | "telemetry";
type InspectionMode = "mesh" | "thermal" | "delta";

interface SwapPair {
  before: string;
  after: string;
}

interface ChapterCopy {
  id: ChapterId;
  num: string;
  tag: string;
  label: string;
  headline: string;
  swapA: SwapPair;
  swapB: SwapPair;
  scrubParagraphs: string[];
  statLabel: string;
  statValue: string;
  recapSummary: string;
  recapMetric: string;
}

const COPY_VT: Record<
  "en" | "es",
  {
    backStudio: string;
    brandSub: string;
    recapBtn: string;
    heroKicker: string;
    heroTitleTop: string;
    heroTitleAccent: string;
    heroLede: string;
    heroCta: string;
    heroBook: string;
    scrollPrompt: string;
    telemetryLabels: [string, string, string];
    inspectionTitle: string;
    inspectionSubtitle: string;
    modes: { id: InspectionMode; label: string; spec: string }[];
    chapters: ChapterCopy[];
    recap: {
      eyebrow: string;
      title: string;
      subtitle: string;
      close: string;
      jump: string;
      lenses: { id: RecapLens; label: string }[];
      stack: { step: string; title: string; detail: string }[];
      metrics: { value: string; label: string; note: string }[];
      bookCta: string;
    };
    studioPitch: {
      eyebrow: string;
      title: string;
      desc: string;
      cta: string;
      secondary: string;
    };
  }
> = {
  en: {
    backStudio: "← Studio Home",
    brandSub: "PORTFOLIO CONCEPT // 01 · DIGITAL TWINS & AI OPS",
    recapBtn: "✦ RECAP",
    heroKicker: "AUTONOMOUS SYSTEM SIMULATION · BUILT BY THE JUANIMAL STUDIO",
    heroTitleTop: "ALIVE BEFORE",
    heroTitleAccent: "METAL MOVES.",
    heroLede:
      "Vectra Twin turns hardware fleets, GPU clusters, and industrial lines into sub-millisecond predictive digital twins. Scroll to scrub system state from inert CAD to live autonomous telemetry.",
    heroCta: "Explore 01 · WHAT ↓",
    heroBook: "Commission a Flagship Site →",
    scrollPrompt: "SCROLL TO IGNITE TELEMETRY · MINI-NAV HIDES IN MOTION",
    telemetryLabels: ["TWIN SYNC", "LATENCY", "PREDICTION HORIZON"],
    inspectionTitle: "ISOMETRIC TWIN CORE · LIVE LAYER INSPECTOR",
    inspectionSubtitle:
      "Custom generated darkroom asset framed 100% uncropped. Switch telemetry layers to inspect how hardware geometry binds to predictive neural state.",
    modes: [
      {
        id: "mesh",
        label: "01 · Wireframe Mesh",
        spec: "48,200 NURBS facets bound to live WebGL & WebGPU state buffers.",
      },
      {
        id: "thermal",
        label: "02 · Thermal Vector",
        spec: "Real-time junction load mapping across blower & compute dies.",
      },
      {
        id: "delta",
        label: "03 · +72h Predictive Delta",
        spec: "Counterfactual stress simulation forecasting fatigue 72 hours early.",
      },
    ],
    chapters: [
      {
        id: "what",
        num: "01",
        tag: "DEFINITION",
        label: "WHAT",
        headline: "Not a dashboard. A living spatial replica.",
        swapA: { before: "STATIC CAD", after: "LIVE TWIN" },
        swapB: { before: "INERT ASSET", after: "SELF-AWARE NODE" },
        scrubParagraphs: [
          "Most enterprise tools show yesterday's spreadsheet long after a turbine bearing or inference cluster has already overheated.",
          "Vectra Twin creates an exact spatial replica synchronized continuously with physical sensors, thermals, and torque curves.",
          "Every valve, fan blade, and power rail breathes in real time—giving operators human-readable intuition instead of noisy tables.",
        ],
        statLabel: "SYNC FIDELITY",
        statValue: "99.98%",
        recapSummary:
          "Real-time 3D digital replica mirroring physical hardware, thermal load, and operating physics without lag.",
        recapMetric: "99.98% Fidelity",
      },
      {
        id: "how",
        num: "02",
        tag: "ARCHITECTURE",
        label: "HOW",
        headline: "Edge telemetry fused with physics-informed AI.",
        swapA: { before: "DELAYED LOGS", after: "1.2MS SYNC" },
        swapB: { before: "SILOED SENSORS", after: "UNIFIED MESH" },
        scrubParagraphs: [
          "Lightweight edge collectors stream high-frequency vibration, wattage, and thermal deltas over compressed WebSockets.",
          "Instead of black-box guessing, our physics-informed neural engine tests millions of micro-scenarios in parallel inside your twin.",
          "Anomalies light up directly on the geometry in electric key-lime before a warning LED ever blinks on the factory floor.",
        ],
        statLabel: "INGEST LATENCY",
        statValue: "1.2 ms",
        recapSummary:
          "Sub-millisecond telemetry ingestion paired with physics-constrained simulation models running continuously.",
        recapMetric: "1.2 ms Loop",
      },
      {
        id: "why",
        num: "03",
        tag: "VALUE ENGINE",
        label: "WHY",
        headline: "See the failure seventy-two hours early.",
        swapA: { before: "REACTIVE FIX", after: "+72H HORIZON" },
        swapB: { before: "DOWNTIME", after: "AUTONOMOUS UPTIME" },
        scrubParagraphs: [
          "Unplanned outages cost high-density compute halls and manufacturing plants tens of thousands of dollars every single minute.",
          "By running forward-time stress simulations on the digital twin, teams schedule surgical maintenance between production runs.",
          "You gain calmer shifts, lower energy draw, and crystal-clear executive proof of every saved hour.",
        ],
        statLabel: "UNPLANNED STOP REDUCTION",
        statValue: "-41%",
        recapSummary:
          "Forecasts wear and thermal bottlenecks up to 72 hours ahead—turning emergency shutdowns into scheduled micro-windows.",
        recapMetric: "-41% Downtime",
      },
      {
        id: "where",
        num: "04",
        tag: "DEPLOYMENT",
        label: "WHERE",
        headline: "From local GPU labs to distributed global fleets.",
        swapA: { before: "SINGLE RIG", after: "GLOBAL FLEET" },
        swapB: { before: "LOCAL SCRIPTS", after: "EDGE-TO-CLOUD" },
        scrubParagraphs: [
          "Built to run smoothly from air-gapped studio workstation racks like NVIDIA Spark clusters out to cloud-federated energy grids.",
          "Clean multi-region browser consoles let directors inspect a cleanroom unit in Tokyo or a turbine hall in Monterrey from one URL.",
          "The Juanimal Studio architects websites and interactive AI portals like this for B2B founders selling complex frontier infrastructure.",
        ],
        statLabel: "EDGE FOOTPRINT",
        statValue: "ZERO PLUGINS",
        recapSummary:
          "Deploys cleanly across private GPU workstations, factory lines, and federated multi-site browser consoles.",
        recapMetric: "Edge -> Cloud",
      },
    ],
    recap: {
      eyebrow: "EXECUTIVE SYNTHESIS // VECTRA TWIN",
      title: "RECAP · THE ENTIRE SYSTEM IN ONE FRAME",
      subtitle:
        "Switch lenses or click any pillar to jump straight back into the live scroll narrative.",
      close: "CLOSE [ESC]",
      jump: "JUMP TO CHAPTER →",
      lenses: [
        { id: "matrix", label: "01 · WHAT / HOW / WHY / WHERE" },
        { id: "stack", label: "02 · ENGINE ARCHITECTURE" },
        { id: "telemetry", label: "03 · PROOF & OFFERING" },
      ],
      stack: [
        {
          step: "LAYER 01",
          title: "Edge Collector Agents",
          detail:
            "Captures CAN-bus, IPMI, GPU thermals, and acoustics at sub-millisecond cadence without stalling host compute.",
        },
        {
          step: "LAYER 02",
          title: "Spatial State Compiler",
          detail:
            "Binds raw time-series matrices directly to 3D wireframe coordinates, scroll chapters, and color-wheel alert tokens.",
        },
        {
          step: "LAYER 03",
          title: "72h Counterfactual Engine",
          detail:
            "Replays load spikes 1,000x faster than real time to pinpoint wear trajectories before hardware degrades.",
        },
        {
          step: "LAYER 04",
          title: "Motion-First Web Experience",
          detail:
            "Scroll-scrubbed typography, auto-hiding dock navigation, and zero-jank Canvas/WebGL built by The Juanimal Studio.",
        },
      ],
      metrics: [
        {
          value: "99.98%",
          label: "State Parity",
          note: "Live geometric match between physical fleet and digital twin viewport.",
        },
        {
          value: "1.2ms",
          label: "Frame Loop",
          note: "Deterministic RAF motion & telemetry interpolation with zero main-thread stutter.",
        },
        {
          value: "+72h",
          label: "Forecast Window",
          note: "Lead time on thermal throttling, bearing wear, and power draw anomalies.",
        },
        {
          value: "60fps",
          label: "Scroll Choreography",
          note: "Scroll-idle dock reveal, word-by-word illumination, and phosphor mouse trail.",
        },
      ],
      bookCta: "Want this architecture for your product? Book a sprint →",
    },
    studioPitch: {
      eyebrow: "PORTFOLIO CASE #01 // OFFERING THIS SYSTEM TO CLIENTS",
      title: "COMPLEX AI TECH DESERVES CLARITY YOU CAN FEEL.",
      desc: "This interactive showcase demonstrates how The Juanimal Studio translates deep technical products—digital twins, GPU ops, dev tools, robotics—into unforgettable motion websites with editorial typography, custom canvas 3D, and bilingual EN/ES polish.",
      cta: "Commission Your Flagship Web →",
      secondary: "Back to All Studio Works",
    },
  },
  es: {
    backStudio: "← Volver al Estudio",
    brandSub: "PORTFOLIO CONCEPT // 01 · GEMELOS DIGITALES & AI OPS",
    recapBtn: "✦ RECAP",
    heroKicker: "SIMULACIÓN AUTÓNOMA DE SISTEMAS · DISEÑADO POR THE JUANIMAL STUDIO",
    heroTitleTop: "VIVO ANTES QUE",
    heroTitleAccent: "EL METAL SE MUEVA.",
    heroLede:
      "Vectra Twin convierte flotas de hardware, clústeres GPU y líneas industriales en gemelos digitales predictivos en milisegundos. Haz scroll para encender la telemetría de CAD inerte a sistema vivo.",
    heroCta: "Explorar 01 · WHAT ↓",
    heroBook: "Encargar una Web Flagship →",
    scrollPrompt: "HAZ SCROLL PARA ENCENDER LA TELEMETRÍA · EL MINI-NAV SE OCULTA AL NAVEGAR",
    telemetryLabels: ["PARIDAD GEMELO", "LATENCIA", "HORIZONTE PREDICTIVO"],
    inspectionTitle: "NÚCLEO ISOMÉTRICO · INSPECTOR DE CAPAS EN VIVO",
    inspectionSubtitle:
      "Visual darkroom generado a medida sin recortes (100% encuadre limpio). Cambia de capa para ver cómo la geometría conecta con el estado neuronal.",
    modes: [
      {
        id: "mesh",
        label: "01 · Malla Wireframe",
        spec: "48,200 facetas conectadas a buffers de estado en tiempo real.",
      },
      {
        id: "thermal",
        label: "02 · Vector Térmico",
        spec: "Mapa de carga térmica entre turbina de enfriamiento y matriz de cómputo.",
      },
      {
        id: "delta",
        label: "03 · Delta Predictivo +72h",
        spec: "Simulación contrafactual que anticipa fatiga mecánica 72 horas antes.",
      },
    ],
    chapters: [
      {
        id: "what",
        num: "01",
        tag: "DEFINICIÓN",
        label: "WHAT",
        headline: "No es otro dashboard. Es una réplica espacial viva.",
        swapA: { before: "CAD ESTÁTICO", after: "GEMELO VIVO" },
        swapB: { before: "ACTIVO INERTE", after: "NODO CONSCIENTE" },
        scrubParagraphs: [
          "La mayoría de las plataformas empresariales muestran tablas de ayer mucho después de que un rodamiento o nodo GPU ya se sobrecalentó.",
          "Vectra Twin construye una réplica espacial exacta sincronizada continuamente con sensores físicos, temperaturas y curvas de torque.",
          "Cada turbina, válvula y línea de energía respira en tiempo real: intuición visual humana en lugar de planillas llenas de ruido.",
        ],
        statLabel: "FIDELIDAD DE SYNC",
        statValue: "99.98%",
        recapSummary:
          "Réplica digital 3D en tiempo real que refleja física operativa, carga térmica y hardware sin desfase.",
        recapMetric: "99.98% Fidelidad",
      },
      {
        id: "how",
        num: "02",
        tag: "ARQUITECTURA",
        label: "HOW",
        headline: "Telemetría edge fusionada con IA física.",
        swapA: { before: "LOGS LENTOS", after: "SYNC 1.2MS" },
        swapB: { before: "SENSORES AISLADOS", after: "MALLA UNIFICADA" },
        scrubParagraphs: [
          "Colectores ligeros en el edge transmiten vibración de alta frecuencia, consumo eléctrico y deltas térmicos vía WebSockets comprimidos.",
          "En vez de adivinar en caja negra, nuestro motor neuronal informado por física prueba millones de micro-escenarios en paralelo dentro del gemelo.",
          "Cada anomalía se ilumina en verde key-lime eléctrico directo sobre la geometría mucho antes de que parpadee una alarma física.",
        ],
        statLabel: "LATENCIA INGESTA",
        statValue: "1.2 ms",
        recapSummary:
          "Ingesta de telemetría sub-milisegundo combinada con modelos de simulación guiados por física.",
        recapMetric: "Loop 1.2 ms",
      },
      {
        id: "why",
        num: "03",
        tag: "MOTOR DE VALOR",
        label: "WHY",
        headline: "Ve la falla setenta y dos horas antes.",
        swapA: { before: "ARREGLO REACTIVO", after: "HORIZONTE +72H" },
        swapB: { before: "PARADAS CARAS", after: "UPTIME AUTÓNOMO" },
        scrubParagraphs: [
          "Una parada no planificada cuesta decenas de miles de dólares por minuto en plantas industriales y salas de cómputo de alta densidad.",
          "Al simular estrés futuro sobre el gemelo digital, tus equipos programan mantenimiento quirúrgico justo entre tandas de producción.",
          "Ganas turnos tranquilos, menor consumo energético y evidencia ejecutiva clara de cada hora salvada.",
        ],
        statLabel: "REDUCCIÓN DE PARADAS",
        statValue: "-41%",
        recapSummary:
          "Anticipa desgaste y cuellos térmicos hasta 72 horas antes, convirtiendo emergencias en ventanas planificadas.",
        recapMetric: "-41% Paradas",
      },
      {
        id: "where",
        num: "04",
        tag: "DESPLIEGUE",
        label: "WHERE",
        headline: "De nodos GPU locales a flotas globales.",
        swapA: { before: "EQUIPO AISLADO", after: "FLOTA GLOBAL" },
        swapB: { before: "SCRIPTS LOCALES", after: "EDGE-TO-CLOUD" },
        scrubParagraphs: [
          "Pensado para operar desde estaciones GPU privadas tipo NVIDIA Spark hasta redes industriales distribuidas en múltiples países.",
          "Consolas web limpias permiten a directores inspeccionar un rack en Tokio o una línea en Monterrey desde una sola URL.",
          "En The Juanimal Studio diseñamos y programamos portales flagship como este para empresas de IA y tecnología que quieren destacar a nivel mundial.",
        ],
        statLabel: "HUELLA EN CLIENTE",
        statValue: "CERO PLUGINS",
        recapSummary:
          "Se despliega desde estaciones GPU locales y racks privados hasta consolas cloud multi-sede en navegador.",
        recapMetric: "Edge -> Cloud",
      },
    ],
    recap: {
      eyebrow: "SÍNTESIS EJECUTIVA // VECTRA TWIN",
      title: "RECAP · TODO EL SISTEMA EN UN SOLO PLANO",
      subtitle:
        "Cambia de vista o toca cualquier pilar para saltar directo a esa escena de la narrativa.",
      close: "CERRAR [ESC]",
      jump: "IR AL CAPÍTULO →",
      lenses: [
        { id: "matrix", label: "01 · WHAT / HOW / WHY / WHERE" },
        { id: "stack", label: "02 · ARQUITECTURA ENGINE" },
        { id: "telemetry", label: "03 · MÉTRICAS & SERVICIO" },
      ],
      stack: [
        {
          step: "CAPA 01",
          title: "Agentes Colectores Edge",
          detail:
            "Captura métricas IPMI, termales GPU, vibración y consumo cada milisegundo sin frenar la carga principal.",
        },
        {
          step: "CAPA 02",
          title: "Compilador de Estado Espacial",
          detail:
            "Mapea matrices en vivo directo a coordenadas 3D wireframe, capítulos de scroll y acentos key-lime de alerta.",
        },
        {
          step: "CAPA 03",
          title: "Motor Contrafactual +72h",
          detail:
            "Simula picos de carga 1,000x más rápido que el tiempo real para detectar fatiga antes de que falle el hardware.",
        },
        {
          step: "CAPA 04",
          title: "Web Motion de Autor",
          detail:
            "Tipografía reactiva al scroll, mini-nav inteligente al detenerse y canvas + rastro de mouse creado por The Juanimal Studio.",
        },
      ],
      metrics: [
        {
          value: "99.98%",
          label: "Paridad Espacial",
          note: "Coincidencia geométrica continua entre flota física y viewport del gemelo.",
        },
        {
          value: "1.2ms",
          label: "Loop de Frame",
          note: "Interpolación determinista RAF sin tirones en el hilo principal.",
        },
        {
          value: "+72h",
          label: "Ventana Predictiva",
          note: "Margen anticipado frente a estrangulamiento térmico o desgaste.",
        },
        {
          value: "60fps",
          label: "Coreografía Scroll",
          note: "Mini-nav que desaparece al scrollear y vuelve al frenar + cursor fósforo key-lime.",
        },
      ],
      bookCta: "¿Quieres una web y sistema interactivo así para tu marca? →",
    },
    studioPitch: {
      eyebrow: "CASO DE PORTAFOLIO #01 // SERVICIO DISPONIBLE PARA CLIENTES",
      title: "LA TECNOLOGÍA COMPLEJA MERECE UNA EXPERIENCIA QUE SE SIENTA.",
      desc: "Esta pieza demuestra cómo en The Juanimal Studio convertimos productos técnicos (gemelos digitales, ops de IA, SaaS, robótica) en webs cinematográficas con tipografía scrolleable, canvas 3D procedural e inglés + español nativo.",
      cta: "Encargar Tu Web Flagship →",
      secondary: "Ver Todos los Trabajos",
    },
  },
};

function ScrollScrubParagraph({
  text,
  index,
  reduced,
}: {
  text: string;
  index: number;
  reduced: boolean;
}) {
  const pRef = useRef<HTMLParagraphElement | null>(null);
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const measure = () => {
      const el = pRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Start lighting as text enters lower 82% of viewport, complete near 26%
      const start = vh * 0.84;
      const end = vh * 0.24;
      const raw = (start - rect.top) / Math.max(1, start - end + rect.height * 0.35);
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(clamped);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  const words = useMemo(() => text.split(" "), [text]);

  return (
    <p
      ref={pRef}
      className="vt-scrub-p"
      data-index={index}
      aria-label={text}
    >
      {words.map((word, wi) => {
        const thresh = wi / Math.max(1, words.length);
        const frontier = progress;
        const delta = frontier - thresh;
        let state: "unlit" | "hot" | "lit" = "unlit";
        if (delta >= 0.085) state = "lit";
        else if (delta >= -0.025 && frontier > 0.02) state = "hot";
        return (
          <span key={wi} className={`vt-word is-${state}`}>
            {word}
            {wi < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

function TwinStageCanvas({
  activeChapter,
  reduced,
  pointerRef,
}: {
  activeChapter: ChapterId;
  reduced: boolean;
  pointerRef: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let angle = 0;
    const smoothPtr = { x: 0, y: 0 };

    const chapterParams: Record<
      ChapterId,
      { accent: string; secondary: string; speed: number; tilt: number; scale: number }
    > = {
      what: { accent: "#C8FF2E", secondary: "#2EE8D8", speed: 0.008, tilt: 0.42, scale: 1 },
      how: { accent: "#2EE8D8", secondary: "#C8FF2E", speed: 0.014, tilt: 0.56, scale: 1.08 },
      why: { accent: "#C8FF2E", secondary: "#7C5CFF", speed: 0.018, tilt: 0.34, scale: 1.12 },
      where: { accent: "#7C5CFF", secondary: "#C8FF2E", speed: 0.011, tilt: 0.48, scale: 1.04 },
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) {
        if (!reduced) raf = requestAnimationFrame(draw);
        return;
      }

      const cfg = chapterParams[activeChapter];
      if (!reduced) {
        angle += cfg.speed;
      }

      const targetX = pointerRef.current.active ? pointerRef.current.x : 0;
      const targetY = pointerRef.current.active ? pointerRef.current.y : 0;
      smoothPtr.x += (targetX - smoothPtr.x) * 0.08;
      smoothPtr.y += (targetY - smoothPtr.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5 + smoothPtr.x * 16;
      const cy = h * 0.5 + smoothPtr.y * 12;
      const radius = Math.min(w, h) * 0.31 * cfg.scale;

      // Subtle technical grid hairline crosshairs
      ctx.strokeStyle = "rgba(138, 147, 166, 0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - radius * 1.45, cy);
      ctx.lineTo(cx + radius * 1.45, cy);
      ctx.moveTo(cx, cy - radius * 1.2);
      ctx.lineTo(cx, cy + radius * 1.2);
      ctx.stroke();

      // 3 Concentric Orbital Telemetry Rings (skewed 3D isometric ellipse projection)
      const rings = [1.08, 0.84, 0.56];
      rings.forEach((factor, ri) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(
          (ri === 1 ? -1 : 1) * angle * (0.4 + ri * 0.25) + smoothPtr.x * 0.12
        );
        ctx.scale(1, cfg.tilt + ri * 0.06);

        ctx.beginPath();
        ctx.arc(0, 0, radius * factor, 0, Math.PI * 2);
        ctx.strokeStyle =
          ri === 0
            ? "rgba(200, 255, 46, 0.55)"
            : ri === 1
            ? "rgba(46, 232, 216, 0.48)"
            : "rgba(124, 92, 255, 0.55)";
        ctx.lineWidth = ri === 0 ? 2 : 1.4;
        if (ri === 1) ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbital telemetry packet nodes
        const nodes = 3 + ri * 2;
        for (let n = 0; n < nodes; n++) {
          const theta = angle * (1.2 + ri * 0.4) + (n * Math.PI * 2) / nodes;
          const nx = Math.cos(theta) * radius * factor;
          const ny = Math.sin(theta) * radius * factor;
          ctx.beginPath();
          ctx.arc(nx, ny, ri === 0 ? 4 : 3, 0, Math.PI * 2);
          ctx.fillStyle = ri === 0 ? cfg.accent : cfg.secondary;
          ctx.fill();
        }
        ctx.restore();
      });

      // Central 3D Wireframe Octahedron / Turbine Twin Core
      const tiltX = 0.52 + smoothPtr.y * 0.25;
      const verts: [number, number, number][] = [
        [0, -1.15, 0],
        [1, 0, 0],
        [0, 0, 1],
        [-1, 0, 0],
        [0, 0, -1],
        [0, 1.15, 0],
      ];

      const projected = verts.map(([vx, vy, vz]) => {
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rx = vx * cosA - vz * sinA;
        const rz = vx * sinA + vz * cosA;
        const cosT = Math.cos(tiltX);
        const sinT = Math.sin(tiltX);
        const ry = vy * cosT - rz * sinT;
        const fz = vy * sinT + rz * cosT;
        const persp = 3.2 / (3.2 - fz * 0.45);
        return {
          x: cx + rx * radius * 0.52 * persp,
          y: cy + ry * radius * 0.52 * persp,
        };
      });

      const edges: [number, number][] = [
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [5, 1],
        [5, 2],
        [5, 3],
        [5, 4],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 1],
      ];

      ctx.strokeStyle = cfg.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (const [a, b] of edges) {
        ctx.moveTo(projected[a].x, projected[a].y);
        ctx.lineTo(projected[b].x, projected[b].y);
      }
      ctx.stroke();

      for (const p of projected) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#F3F6F4";
        ctx.fill();
        ctx.strokeStyle = "#07080A";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      if (!reduced) {
        raf = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [activeChapter, pointerRef, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="vt-twin-canvas"
      aria-label="Interactive 3D Digital Twin wireframe simulation"
    />
  );
}

function KeyLimeMouseTrail({
  reduced,
  dockHover,
}: {
  reduced: boolean;
  dockHover: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<{ x: number; y: number; life: number }[]>([]);
  const lastMouseRef = useRef<{ x: number; y: number; inside: boolean }>({
    x: -100,
    y: -100,
    inside: false,
  });

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      lastMouseRef.current = { x: e.clientX, y: e.clientY, inside: true };
      pointsRef.current.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (pointsRef.current.length > 26) {
        pointsRef.current.shift();
      }
    };

    const onLeave = () => {
      lastMouseRef.current.inside = false;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      const pts = pointsRef.current;
      for (let i = pts.length - 1; i >= 0; i--) {
        pts[i].life -= 0.042;
        if (pts[i].life <= 0) pts.splice(i, 1);
      }

      if (pts.length > 1) {
        for (let i = 1; i < pts.length; i++) {
          const prev = pts[i - 1];
          const curr = pts[i];
          const ratio = Math.max(0, curr.life);
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(curr.x, curr.y);
          ctx.strokeStyle = dockHover
            ? `rgba(46, 232, 216, ${(ratio * 0.72).toFixed(3)})`
            : `rgba(200, 255, 46, ${(ratio * 0.58).toFixed(3)})`;
          ctx.lineWidth = (dockHover ? 4.5 : 2.8) * ratio;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }

      if (lastMouseRef.current.inside) {
        const { x, y } = lastMouseRef.current;
        const r = dockHover ? 16 : 7;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = dockHover
          ? "rgba(200, 255, 46, 0.92)"
          : "rgba(200, 255, 46, 0.55)";
        ctx.lineWidth = dockHover ? 2 : 1.25;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, dockHover ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = "#C8FF2E";
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [dockHover, reduced]);

  if (reduced) return null;

  return <canvas ref={canvasRef} className="vt-trail-canvas" aria-hidden="true" />;
}

export function VectraTwinShowcase() {
  const { lang, setLang } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const c = COPY_VT[lang];

  const [activeChapter, setActiveChapter] = useState<ChapterId>("what");
  const [swappedMap, setSwappedMap] = useState<Record<ChapterId, boolean>>({
    what: false,
    how: false,
    why: false,
    where: false,
  });
  const [pastHero, setPastHero] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [dockHover, setDockHover] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);
  const [recapLens, setRecapLens] = useState<RecapLens>("matrix");
  const [inspectionMode, setInspectionMode] = useState<InspectionMode>("mesh");

  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const scrollIdleTimerRef = useRef<number | null>(null);

  // Keyboard shortcut [R] to toggle RECAP and [Escape] to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setRecapOpen(false);
      } else if (
        (e.key === "r" || e.key === "R") &&
        !e.metaKey &&
        !e.ctrlKey &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        setRecapOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when RECAP drawer is open
  useEffect(() => {
    if (!recapOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [recapOpen]);

  // Core scroll choreography:
  // 1) Detect pastHero (>140px)
  // 2) Hide floating Mini-Nav immediately during active scroll, restore 220ms after idle stop
  // 3) Compute active chapter + scroll percentage + word-morph triggers
  useEffect(() => {
    const updateScrollState = () => {
      const y = window.scrollY || 0;
      const docH = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      setScrollPct(Math.round((y / docH) * 100));
      setPastHero(y > 140);

      if (y > 140) {
        setIsScrolling(true);
        if (scrollIdleTimerRef.current) {
          window.clearTimeout(scrollIdleTimerRef.current);
        }
        scrollIdleTimerRef.current = window.setTimeout(() => {
          setIsScrolling(false);
        }, 220);
      } else {
        setIsScrolling(false);
      }

      const chapterIds: ChapterId[] = ["what", "how", "why", "where"];
      const midY = (window.innerHeight || 800) * 0.45;
      let chosen: ChapterId = "what";
      const nextSwapped: Record<ChapterId, boolean> = {
        what: false,
        how: false,
        why: false,
        where: false,
      };

      for (const id of chapterIds) {
        const el = document.getElementById(`vt-chapter-${id}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= midY) {
          chosen = id;
        }
        // Trigger morph keyword flip once top half of chapter crosses center reading band
        if (rect.top <= (window.innerHeight || 800) * 0.46) {
          nextSwapped[id] = true;
        }
      }
      setActiveChapter(chosen);
      setSwappedMap(nextSwapped);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrollState);
      if (scrollIdleTimerRef.current) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }
    };
  }, []);

  const jumpToChapter = useCallback((id: ChapterId) => {
    setRecapOpen(false);
    setActiveChapter(id);
    const el = document.getElementById(`vt-chapter-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
    pointerRef.current = { x: nx, y: ny, active: true };
  };

  const activeInspection =
    c.modes.find((m) => m.id === inspectionMode) || c.modes[0];

  const renderDockNav = (mode: "hero" | "floating") => {
    const isFloatingVisible = mode === "floating" && pastHero && !isScrolling;
    const cls =
      mode === "hero"
        ? `vt-dock vt-dock-hero ${pastHero ? "is-docked-away" : ""}`
        : `vt-dock vt-dock-floating ${isFloatingVisible ? "is-visible" : ""}`;

    return (
      <nav
        className={cls}
        aria-label={
          lang === "es"
            ? "Navegación de capítulos Vectra Twin"
            : "Vectra Twin chapter navigation"
        }
        onMouseEnter={() => setDockHover(true)}
        onMouseLeave={() => setDockHover(false)}
      >
        <div className="vt-dock-links" role="group">
          {c.chapters.map((ch) => {
            const isActive = activeChapter === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                className={`vt-dock-item ${isActive ? "is-active" : ""}`}
                onClick={() => jumpToChapter(ch.id)}
              >
                <span className="vt-dock-num">{ch.num}</span>
                <span className="vt-dock-lbl">{ch.label}</span>
              </button>
            );
          })}
        </div>

        <div className="vt-dock-divider" aria-hidden="true" />

        <span className="vt-dock-pct" aria-label="Scroll progress">
          {String(scrollPct).padStart(2, "0")}%
        </span>

        <button
          type="button"
          className="vt-dock-recap"
          onClick={() => setRecapOpen(true)}
          aria-expanded={recapOpen}
        >
          {c.recapBtn}
        </button>
      </nav>
    );
  };

  return (
    <div className="vt-page" id="top">
      {/* 60fps Phosphor Key-Lime Cursor Trail */}
      <KeyLimeMouseTrail reduced={reduced} dockHover={dockHover} />

      {/* Prominent Top Return Bar featuring standalone thick Juanimal logo */}
      <header className="vt-topbar">
        <div className="vt-topbar-left">
          <Link
            href="/"
            className="vt-brand-return"
            aria-label="Return to The Juanimal Studio"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand-logo.png"
              alt="The Juanimal Studio"
              className="vt-return-logo"
            />
            <span className="vt-return-pill">{c.backStudio}</span>
          </Link>
          <span className="vt-brand-tag">{c.brandSub}</span>
        </div>

        <div className="vt-topbar-right">
          <div className="vt-lang" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === "en" ? "is-active" : undefined}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === "es" ? "is-active" : undefined}
              onClick={() => setLang("es")}
            >
              ES
            </button>
          </div>
          <button
            type="button"
            className="vt-top-recap-btn"
            onClick={() => setRecapOpen(true)}
          >
            {c.recapBtn} <kbd>R</kbd>
          </button>
        </div>
      </header>

      {/* GENEROUS HERO WITH LIVE 3D DIGITAL TWIN CANVAS & DOCK */}
      <section
        className="vt-hero"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={() => {
          pointerRef.current.active = false;
        }}
      >
        <div className="vt-hero-bg-grid" aria-hidden="true" />
        <TwinStageCanvas
          activeChapter={activeChapter}
          reduced={reduced}
          pointerRef={pointerRef}
        />

        <div className="vt-hero-inner">
          <span className="vt-kicker">{c.heroKicker}</span>

          <h1 className="vt-hero-h1">
            <span>{c.heroTitleTop}</span>
            <span className="vt-lime">{c.heroTitleAccent}</span>
          </h1>

          <p className="vt-hero-lede">{c.heroLede}</p>

          <div className="vt-hero-actions">
            <button
              type="button"
              className="vt-btn-primary"
              onClick={() => jumpToChapter("what")}
            >
              {c.heroCta}
            </button>
            <Link href="/contact" className="vt-btn-ghost">
              {c.heroBook}
            </Link>
          </div>

          <div className="vt-telemetry-strip">
            <div>
              <small>{c.telemetryLabels[0]}</small>
              <strong>99.98%</strong>
            </div>
            <div>
              <small>{c.telemetryLabels[1]}</small>
              <strong>1.2 MS</strong>
            </div>
            <div>
              <small>{c.telemetryLabels[2]}</small>
              <strong>+72 HOURS</strong>
            </div>
          </div>

          <p className="vt-scroll-hint">{c.scrollPrompt}</p>
        </div>

        {/* Hero-Anchored Positional Mini-Nav */}
        <div className="vt-hero-dock-slot">{renderDockNav("hero")}</div>
      </section>

      {/* SCROLL-SCRUBBED NARRATIVE CHAPTERS: WHAT / HOW / WHY / WHERE */}
      <main className="vt-chapters">
        {c.chapters.map((ch, idx) => {
          const isSwapped = swappedMap[ch.id] || reduced;
          return (
            <section
              key={ch.id}
              id={`vt-chapter-${ch.id}`}
              className={`vt-chapter vt-chapter-${ch.id}`}
            >
              <div className="vt-chapter-rail">
                <span className="vt-ch-num">{ch.num}</span>
                <span className="vt-ch-tag">
                  {ch.label} // {ch.tag}
                </span>
                <div className="vt-ch-stat">
                  <small>{ch.statLabel}</small>
                  <strong>{ch.statValue}</strong>
                </div>
              </div>

              <div className="vt-chapter-body">
                {/* Interactive Morphing State Swappers */}
                <div className="vt-swap-row" aria-live="polite">
                  <div className={`vt-swap-pill ${isSwapped ? "is-morphed" : ""}`}>
                    <span className="vt-swap-slot">
                      <span className="vt-swap-old">{ch.swapA.before}</span>
                      <span className="vt-swap-new">{ch.swapA.after}</span>
                    </span>
                  </div>
                  <span className="vt-swap-arrow" aria-hidden="true">
                    →
                  </span>
                  <div className={`vt-swap-pill ${isSwapped ? "is-morphed" : ""}`}>
                    <span className="vt-swap-slot">
                      <span className="vt-swap-old">{ch.swapB.before}</span>
                      <span className="vt-swap-new">{ch.swapB.after}</span>
                    </span>
                  </div>
                </div>

                <h2 className="vt-chapter-h2">{ch.headline}</h2>

                <div className="vt-scrub-stack">
                  {ch.scrubParagraphs.map((pText, pi) => (
                    <ScrollScrubParagraph
                      key={pi}
                      text={pText}
                      index={pi}
                      reduced={reduced}
                    />
                  ))}
                </div>

                {/* Chapter 02 HOW embeds the custom generated uncropped 3D Core Plate */}
                {idx === 1 && (
                  <div className="vt-inspector-card">
                    <div className="vt-inspector-head">
                      <div>
                        <span className="vt-inspector-kicker">
                          {c.inspectionTitle}
                        </span>
                        <p>{c.inspectionSubtitle}</p>
                      </div>
                      <div className="vt-mode-pills" role="group">
                        {c.modes.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            className={`vt-mode-btn ${
                              inspectionMode === m.id ? "is-active" : ""
                            }`}
                            onClick={() => setInspectionMode(m.id)}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`cel-frame cel-video-16x9 vt-core-frame is-${inspectionMode}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/v3/vectra-twin-core.png"
                        alt="Vectra Twin isometric 3D GPU and turbine digital twin core"
                      />
                    </div>

                    <div className="vt-inspector-foot">
                      <code>{activeInspection.label.toUpperCase()}</code>
                      <span>{activeInspection.spec}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </main>

      {/* STUDIO CAPABILITY CTA BLOCK */}
      <section className="vt-studio-cta">
        <div className="vt-studio-cta-inner">
          <span className="vt-kicker">{c.studioPitch.eyebrow}</span>
          <h2>{c.studioPitch.title}</h2>
          <p>{c.studioPitch.desc}</p>
          <div className="vt-hero-actions">
            <Link href="/contact" className="vt-btn-primary">
              {c.studioPitch.cta}
            </Link>
            <Link href="/#work" className="vt-btn-ghost">
              {c.studioPitch.secondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll-Idle Floating Mini-Nav (Hides while scrolling, springs back at rest) */}
      {renderDockNav("floating")}

      {/* EXECUTIVE RECAP DRAWER */}
      {recapOpen && (
        <div
          className="vt-recap-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={c.recap.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setRecapOpen(false);
          }}
        >
          <div className="vt-recap-modal">
            <div className="vt-recap-head">
              <div>
                <span className="vt-kicker">{c.recap.eyebrow}</span>
                <h2>{c.recap.title}</h2>
                <p>{c.recap.subtitle}</p>
              </div>
              <button
                type="button"
                className="vt-recap-close"
                onClick={() => setRecapOpen(false)}
              >
                {c.recap.close}
              </button>
            </div>

            <div className="vt-recap-tabs" role="tablist">
              {c.recap.lenses.map((lens) => (
                <button
                  key={lens.id}
                  type="button"
                  role="tab"
                  aria-selected={recapLens === lens.id}
                  className={`vt-recap-tab ${
                    recapLens === lens.id ? "is-active" : ""
                  }`}
                  onClick={() => setRecapLens(lens.id)}
                >
                  {lens.label}
                </button>
              ))}
            </div>

            {recapLens === "matrix" && (
              <div className="vt-recap-matrix">
                {c.chapters.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    className="vt-recap-card"
                    onClick={() => jumpToChapter(ch.id)}
                  >
                    <div className="vt-recap-card-top">
                      <span>
                        {ch.num} // {ch.label}
                      </span>
                      <strong>{ch.recapMetric}</strong>
                    </div>
                    <h3>{ch.headline}</h3>
                    <p>{ch.recapSummary}</p>
                    <span className="vt-recap-jump">{c.recap.jump}</span>
                  </button>
                ))}
              </div>
            )}

            {recapLens === "stack" && (
              <div className="vt-recap-matrix">
                {c.recap.stack.map((layer) => (
                  <div key={layer.step} className="vt-recap-card is-static">
                    <div className="vt-recap-card-top">
                      <span>{layer.step}</span>
                      <strong>ACTIVE</strong>
                    </div>
                    <h3>{layer.title}</h3>
                    <p>{layer.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {recapLens === "telemetry" && (
              <div className="vt-recap-matrix">
                {c.recap.metrics.map((m) => (
                  <div key={m.label} className="vt-recap-card is-static">
                    <div className="vt-recap-card-top">
                      <span>{m.label}</span>
                      <strong>VERIFIED</strong>
                    </div>
                    <h3 className="vt-recap-big-stat">{m.value}</h3>
                    <p>{m.note}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="vt-recap-foot">
              <Link
                href="/contact"
                className="vt-btn-primary"
                onClick={() => setRecapOpen(false)}
              >
                {c.recap.bookCta}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
