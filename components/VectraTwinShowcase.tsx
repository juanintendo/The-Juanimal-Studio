"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type SectionNavId = "what" | "how" | "why" | "where";
type RecapLens = "matrix" | "stack" | "telemetry";
type InspectionMode = "mesh" | "thermal" | "delta";

interface StepperItem {
  category: string;
  description: string;
  tag: string;
  metric: string;
  visualVariant:
    | "data"
    | "device"
    | "application"
    | "acquire"
    | "control"
    | "predict"
    | "effective"
    | "sustainable"
    | "autonomous";
}

interface StepperSectionData {
  id: string;
  navId: SectionNavId;
  index: string;
  heading: string;
  accentHex: string;
  accentSoft: string;
  reversed?: boolean;
  paletteMode: "coral-lead" | "cerulean-lead" | "glacial-harmony";
  items: [StepperItem, StepperItem, StepperItem];
}

interface CopySchema {
  backStudio: string;
  navChapters: { id: SectionNavId; num: string; label: string }[];
  overview: string;
  recapBtn: string;
  contactBtn: string;
  heroBadge: string;
  heroCode: string;
  heroTitleA: string;
  heroTitleB: string;
  heroLede: string;
  heroPrimary: string;
  heroSecondary: string;
  heroNote: string;
  whatStatement: {
    prefix: string;
    lead: string;
    highlight: string;
    tail: string;
    sub: string;
  };
  steppers: [StepperSectionData, StepperSectionData, StepperSectionData];
  whereSection: {
    index: string;
    tag: string;
    headline: string;
    sub: string;
    sectors: { code: string; name: string; desc: string }[];
    inspectorTitle: string;
    inspectorSub: string;
    modes: { id: InspectionMode; label: string; spec: string }[];
  };
  recap: {
    eyebrow: string;
    title: string;
    subtitle: string;
    close: string;
    jump: string;
    lenses: { id: RecapLens; label: string }[];
    matrix: {
      navId: SectionNavId;
      code: string;
      title: string;
      metric: string;
      summary: string;
    }[];
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

const COPY_VT: Record<"en" | "es", CopySchema> = {
  en: {
    backStudio: "← Studio Home",
    navChapters: [
      { id: "what", num: "n.001", label: "WHAT" },
      { id: "how", num: "n.002", label: "HOW" },
      { id: "why", num: "n.003", label: "WHY" },
      { id: "where", num: "n.004", label: "WHERE" },
    ],
    overview: "Overview",
    recapBtn: "Recap",
    contactBtn: "Contact",
    heroBadge: "N°001 · INSTANT DIGITAL TWIN OF EVERYTHING",
    heroCode: "PALETTE // #C6D8E6 · #F97279 · #2A72A3",
    heroTitleA: "Instant Digital Twin",
    heroTitleB: "of Everything.",
    heroLede:
      "Vectra Twin elevates physical machinery, GPU compute racks, and complex digital infrastructure by orchestrating a living virtual replica in real time.",
    heroPrimary: "Scroll Narrative ↓",
    heroSecondary: "Commission Similar Site",
    heroNote:
      "Natural pinned wheel tempo · Scroll slowly through Data → Device → Application",
    whatStatement: {
      prefix: "n.001 · WHAT",
      lead: "An intelligent",
      highlight: "Digital Twin",
      tail: "managed remotely in real time—identifying the strongest future operating scenario before steel ever feels stress.",
      sub: "Built as Portfolio Showcase #01 by The Juanimal Studio to demonstrate natural scroll choreography and Swiss editorial precision.",
    },
    steppers: [
      {
        id: "vt-step-01",
        navId: "how",
        index: "01",
        heading: "Digital Twin",
        accentHex: "#f97279",
        accentSoft: "rgba(249, 114, 121, 0.24)",
        paletteMode: "coral-lead",
        items: [
          {
            category: "Data",
            tag: "STEP 01.A // FIELD INGEST",
            metric: "1.2 MS CADENCE",
            visualVariant: "data",
            description:
              "Acquisition and normalization of data from field devices: continuous collection, structural analysis, and crisp spatial visualization.",
          },
          {
            category: "Device",
            tag: "STEP 01.B // REMOTE COMMAND",
            metric: "99.98% SYNC",
            visualVariant: "device",
            description:
              "Remote management of physical equipment: deterministic control, predictive maintenance schedules, optimization, and safe integration.",
          },
          {
            category: "Application",
            tag: "STEP 01.C // AUTONOMOUS LOGIC",
            metric: "LIVE AI ENGINE",
            visualVariant: "application",
            description:
              "Usage rules and programmable logic: workflow automation, energy efficiency, real-time simulation, prediction, and agent AI orchestration.",
          },
        ],
      },
      {
        id: "vt-step-02",
        navId: "how",
        index: "02",
        heading: "Functioning",
        accentHex: "#2a72a3",
        accentSoft: "rgba(42, 114, 163, 0.22)",
        reversed: true,
        paletteMode: "cerulean-lead",
        items: [
          {
            category: "Data Acquisition",
            tag: "STEP 02.A // PHYSICAL-TO-DIGITAL",
            metric: "ZERO PACKET LOSS",
            visualVariant: "acquire",
            description:
              "Real-time conversion of an asset's physical vibration, wattage, and thermal behavior into clean digital telemetry streams.",
          },
          {
            category: "Full Control",
            tag: "STEP 02.B // STATE VALIDATION",
            metric: "DUAL-LOOP VERIFIED",
            visualVariant: "control",
            description:
              "Continuous interpretation and validation of the entire system state, giving operators calm, unified remote supervision.",
          },
          {
            category: "Prediction",
            tag: "STEP 02.C // +72H HORIZON",
            metric: "+72 HOURS AHEAD",
            visualVariant: "predict",
            description:
              "Anticipating tomorrow before it arrives: simulating what happens to your cluster or line if any load event does or does not occur.",
          },
        ],
      },
      {
        id: "vt-step-03",
        navId: "why",
        index: "03",
        heading: "Predictive Value",
        accentHex: "#f97279",
        accentSoft: "rgba(198, 216, 230, 0.85)",
        paletteMode: "glacial-harmony",
        items: [
          {
            category: "Effective",
            tag: "STEP 03.A // THROUGHPUT",
            metric: "+24% EFFICIENCY",
            visualVariant: "effective",
            description:
              "Transforms reactive guesswork into surgical operating adjustments that unlock higher throughput across existing hardware.",
          },
          {
            category: "Sustainable",
            tag: "STEP 03.B // THERMAL BALANCE",
            metric: "-19% PEAK WATTAGE",
            visualVariant: "sustainable",
            description:
              "Balances thermal load and power envelopes dynamically—extending machine longevity while lowering cooling waste.",
          },
          {
            category: "Autonomous",
            tag: "STEP 03.C // ZERO DOWNTIME",
            metric: "-41% OUTAGES",
            visualVariant: "autonomous",
            description:
              "Turns emergency midnight shutdowns into scheduled five-minute maintenance windows between high-priority production runs.",
          },
        ],
      },
    ],
    whereSection: {
      index: "n.004",
      tag: "WHERE // DEPLOYMENT FOOTPRINT",
      headline: "Industrial. Energy. GPU Clusters. Aerospace.",
      sub: "One unified browser surface connecting edge sensors across factories, renewable grids, medical diagnostics, and custom AI workstations.",
      sectors: [
        {
          code: "01",
          name: "Industrial",
          desc: "Assembly robotics, CNC cells, and predictive bearing telemetry.",
        },
        {
          code: "02",
          name: "GPU & AI Labs",
          desc: "Private NVIDIA Spark racks, thermals, and continuous inference load.",
        },
        {
          code: "03",
          name: "Clean Energy",
          desc: "Turbine pitch dynamics, substation transformers, and grid balance.",
        },
        {
          code: "04",
          name: "Med & Aero",
          desc: "Mission-critical cleanrooms and zero-tolerance propulsion rigs.",
        },
      ],
      inspectorTitle: "ISOMETRIC TWIN CORE · LAYER INSPECTOR",
      inspectorSub:
        "Custom generated visual framed 100% uncropped. Toggle optical overlays to inspect hardware geometry.",
      modes: [
        {
          id: "mesh",
          label: "01 · Structural Mesh",
          spec: "48,200 surface polygons bound cleanly to real-time kinematics.",
        },
        {
          id: "thermal",
          label: "02 · Coral Thermal Map",
          spec: "Highlights blower and compute die heat envelopes in #f97279.",
        },
        {
          id: "delta",
          label: "03 · Cerulean Forecast",
          spec: "Projects +72h stress drift curves in deep #2a72a3 precision.",
        },
      ],
    },
    recap: {
      eyebrow: "EXECUTIVE MATRIX // VECTRA TWIN",
      title: "RECAP · SYSTEM OVERVIEW IN ONE GLANCE",
      subtitle:
        "Switch lenses or select any pillar to scroll straight into that live narrative section.",
      close: "Close [ESC]",
      jump: "Go to section →",
      lenses: [
        { id: "matrix", label: "01 · WHAT / HOW / WHY / WHERE" },
        { id: "stack", label: "02 · OT-IT STACK" },
        { id: "telemetry", label: "03 · BENCHMARKS" },
      ],
      matrix: [
        {
          navId: "what",
          code: "N.001 // WHAT",
          title: "Instant Digital Twin",
          metric: "99.98% Sync",
          summary:
            "Living spatial replica mirroring equipment physics, state, and thermal draw continuously.",
        },
        {
          navId: "how",
          code: "N.002 // HOW",
          title: "Data → Device → Application",
          metric: "1.2ms Loop",
          summary:
            "Pinned multi-stage ingestion normalizing field sensors into autonomous control rules.",
        },
        {
          navId: "why",
          code: "N.003 // WHY",
          title: "Effective & Sustainable",
          metric: "-41% Downtime",
          summary:
            "72-hour predictive fault horizon turns sudden stoppages into scheduled micro-maintenance.",
        },
        {
          navId: "where",
          code: "N.004 // WHERE",
          title: "Industrial to GPU Clusters",
          metric: "Zero Lock-In",
          summary:
            "Open OT-IT browser console deploying cleanly on private workstations and global fleets.",
        },
      ],
      stack: [
        {
          step: "LAYER 01",
          title: "Field & GPU Collectors",
          detail:
            "Non-blocking edge telemetry ingestion without stalling compute or PLC cycles.",
        },
        {
          step: "LAYER 02",
          title: "Normalization Fabric",
          detail:
            "Unifies disparate protocols into a single deterministic spatial coordinate state.",
        },
        {
          step: "LAYER 03",
          title: "Counterfactual Twin Engine",
          detail:
            "Simulates millions of forward load scenarios before physical deployment.",
        },
        {
          step: "LAYER 04",
          title: "Juanimal Motion Interface",
          detail:
            "Swiss Neo-Grotesque editorial layout, pinned scroll cadence, and frosted glass navigation.",
        },
      ],
      metrics: [
        {
          value: "99.98%",
          label: "Twin Parity",
          note: "Live state agreement between physical asset and viewport model.",
        },
        {
          value: "1.2ms",
          label: "Ingest Loop",
          note: "Smooth high-frequency stream telemetry with damped interpolation.",
        },
        {
          value: "+72h",
          label: "Fault Horizon",
          note: "Early detection window across bearings, thermals, and power rails.",
        },
        {
          value: "42%",
          label: "Smooth Gradient Span",
          note: "Wide multi-stop wave across glacial blue, coral rose, cerulean, and ink black.",
        },
      ],
      bookCta: "Commission a flagship interactive site like this →",
    },
    studioPitch: {
      eyebrow: "JUANIMAL STUDIO PORTFOLIO #01",
      title: "Engineered motion that closes enterprise trust.",
      desc: "Available as a custom turnkey web build for AI startups, robotics founders, and hardware teams who refuse generic templates.",
      cta: "Book Your Web Sprint →",
      secondary: "All Studio Case Studies",
    },
  },
  es: {
    backStudio: "← Volver al Estudio",
    navChapters: [
      { id: "what", num: "n.001", label: "WHAT" },
      { id: "how", num: "n.002", label: "HOW" },
      { id: "why", num: "n.003", label: "WHY" },
      { id: "where", num: "n.004", label: "WHERE" },
    ],
    overview: "Inicio",
    recapBtn: "Recap",
    contactBtn: "Contacto",
    heroBadge: "N°001 · GEMELO DIGITAL INSTANTÁNEO DE TODO",
    heroCode: "PALETA // #C6D8E6 · #F97279 · #2A72A3",
    heroTitleA: "Gemelo Digital",
    heroTitleB: "en Tiempo Real.",
    heroLede:
      "Vectra Twin eleva maquinaria física, clústeres de GPU y sistemas digitales creando su réplica virtual viva en tiempo real y prediciendo el futuro operativo.",
    heroPrimary: "Explorar Scroll ↓",
    heroSecondary: "Encargar Web Similar",
    heroNote:
      "Tempo natural bloqueado · Haz scroll suave para recorrer Data → Device → Application",
    whatStatement: {
      prefix: "n.001 · WHAT",
      lead: "Un",
      highlight: "Gemelo Digital",
      tail: "inteligente gestionado a distancia en tiempo real, capaz de identificar el mejor escenario futuro antes de que el metal sufra desgaste.",
      sub: "Construido como Caso #01 por The Juanimal Studio con tempo editorial suizo y narrativa bloqueada por scroll.",
    },
    steppers: [
      {
        id: "vt-step-01",
        navId: "how",
        index: "01",
        heading: "Digital Twin",
        accentHex: "#f97279",
        accentSoft: "rgba(249, 114, 121, 0.24)",
        paletteMode: "coral-lead",
        items: [
          {
            category: "Data",
            tag: "PASO 01.A // ADQUISICIÓN EN CAMPO",
            metric: "CADENCIA 1.2 MS",
            visualVariant: "data",
            description:
              "Adquisición y normalización de datos desde dispositivos en campo: recolección continua, análisis estructural y visualización espacial clara.",
          },
          {
            category: "Device",
            tag: "PASO 01.B // CONTROL REMOTO",
            metric: "99.98% SYNC",
            visualVariant: "device",
            description:
              "Gestión remota del equipamiento físico: control determinista, mantenimiento predictivo, optimización e integración segura sin fricción.",
          },
          {
            category: "Application",
            tag: "PASO 01.C // LÓGICA AUTÓNOMA",
            metric: "MOTOR IA VIVO",
            visualVariant: "application",
            description:
              "Reglas de uso y lógica programable: automatización, mejora de eficiencia energética, simulación en vivo, predicción e integración de IA.",
          },
        ],
      },
      {
        id: "vt-step-02",
        navId: "how",
        index: "02",
        heading: "Functioning",
        accentHex: "#2a72a3",
        accentSoft: "rgba(42, 114, 163, 0.22)",
        reversed: true,
        paletteMode: "cerulean-lead",
        items: [
          {
            category: "Data Acquisition",
            tag: "PASO 02.A // FÍSICO A DIGITAL",
            metric: "CERO PÉRDIDA DE DATOS",
            visualVariant: "acquire",
            description:
              "Conversión en tiempo real del comportamiento físico de cada máquina en flujos limpios de datos digitales e información accionable.",
          },
          {
            category: "Full Control",
            tag: "PASO 02.B // VALIDACIÓN TOTAL",
            metric: "DOBLE VALIDACIÓN",
            visualVariant: "control",
            description:
              "Interpretación y validación continua del estado operativo completo del sistema, habilitando supervisión remota integral.",
          },
          {
            category: "Prediction",
            tag: "PASO 02.C // HORIZONTE +72H",
            metric: "+72 HORAS ANTES",
            visualVariant: "predict",
            description:
              "Anticipar el futuro antes de que ocurra: simular qué sucederá con el sistema si un evento de carga ocurre o no ocurre.",
          },
        ],
      },
      {
        id: "vt-step-03",
        navId: "why",
        index: "03",
        heading: "Valor Predictivo",
        accentHex: "#f97279",
        accentSoft: "rgba(198, 216, 230, 0.85)",
        paletteMode: "glacial-harmony",
        items: [
          {
            category: "Efectivo",
            tag: "PASO 03.A // RENDIMIENTO",
            metric: "+24% EFICIENCIA",
            visualVariant: "effective",
            description:
              "Convierte conjeturas reactivas en ajustes quirúrgicos de operación que liberan mayor productividad en el mismo hardware.",
          },
          {
            category: "Sostenible",
            tag: "PASO 03.B // BALANCE TÉRMICO",
            metric: "-19% PICOS WATT",
            visualVariant: "sustainable",
            description:
              "Equilibra carga térmica y envolventes eléctricas en vivo, alargando la vida útil del equipo y reduciendo consumo innecesario.",
          },
          {
            category: "Autónomo",
            tag: "PASO 03.C // CERO PARADAS",
            metric: "-41% FALLAS",
            visualVariant: "autonomous",
            description:
              "Transforma paradas imprevistas de emergencia en micro-ventanas planificadas entre ciclos de producción prioritarios.",
          },
        ],
      },
    ],
    whereSection: {
      index: "n.004",
      tag: "WHERE // ESCENARIOS DE DESPLIEGUE",
      headline: "Industria. Energía. Clústeres GPU. Aeroespacial.",
      sub: "Una consola web unificada que conecta sensores edge en fábricas, redes energéticas, laboratorios médicos y racks privados de IA.",
      sectors: [
        {
          code: "01",
          name: "Industria",
          desc: "Robótica de ensamble, celdas CNC y vibración predictiva.",
        },
        {
          code: "02",
          name: "Labs GPU & IA",
          desc: "Racks NVIDIA Spark privados, termales y carga continua.",
        },
        {
          code: "03",
          name: "Energía",
          desc: "Aerogeneradores, transformadores y balance de red inteligente.",
        },
        {
          code: "04",
          name: "Salud & Aero",
          desc: "Salas limpias críticas y bancos de prueba de tolerancia cero.",
        },
      ],
      inspectorTitle: "NÚCLEO ISOMÉTRICO · INSPECTOR DE CAPAS",
      inspectorSub:
        "Visual custom encuadrado 100% sin recortes. Cambia de modo óptico para revisar la geometría y capas térmicas.",
      modes: [
        {
          id: "mesh",
          label: "01 · Malla Estructural",
          spec: "48,200 polígonos enlazados a cinemática en tiempo real.",
        },
        {
          id: "thermal",
          label: "02 · Mapa Térmico Coral",
          spec: "Marca envolventes térmicas de turbina y die en coral #f97279.",
        },
        {
          id: "delta",
          label: "03 · Pronóstico Cerulean",
          spec: "Proyecta curvas de fatiga a +72h con trazos en azul #2a72a3.",
        },
      ],
    },
    recap: {
      eyebrow: "MATRIZ EJECUTIVA // VECTRA TWIN",
      title: "RECAP · EL SISTEMA COMPLETO EN UN PLANO",
      subtitle:
        "Cambia de vista o selecciona cualquier pilar para saltar directo a esa sección del scroll.",
      close: "Cerrar [ESC]",
      jump: "Ir al capítulo →",
      lenses: [
        { id: "matrix", label: "01 · WHAT / HOW / WHY / WHERE" },
        { id: "stack", label: "02 · STACK OT-IT" },
        { id: "telemetry", label: "03 · MÉTRICAS" },
      ],
      matrix: [
        {
          navId: "what",
          code: "N.001 // WHAT",
          title: "Gemelo Digital Vivo",
          metric: "99.98% Sync",
          summary:
            "Réplica espacial continua que refleja física real, estado operativo y carga térmica sin lag.",
        },
        {
          navId: "how",
          code: "N.002 // HOW",
          title: "Data → Device → Application",
          metric: "Loop 1.2ms",
          summary:
            "Flujo bloqueado por pasos que normaliza sensores y habilita control y lógica autónoma.",
        },
        {
          navId: "why",
          code: "N.003 // WHY",
          title: "Efectivo y Sostenible",
          metric: "-41% Paradas",
          summary:
            "Horizonte predictivo de 72 horas para anticipar fallas y optimizar consumo.",
        },
        {
          navId: "where",
          code: "N.004 // WHERE",
          title: "De Industria a Labs GPU",
          metric: "Cero Lock-In",
          summary:
            "Consola abierta OT-IT en navegador para estaciones privadas o flotas globales.",
        },
      ],
      stack: [
        {
          step: "CAPA 01",
          title: "Colectores Edge & GPU",
          detail:
            "Ingesta de telemetría no bloqueante sobre sensores y nodos de cómputo.",
        },
        {
          step: "CAPA 02",
          title: "Tejido de Normalización",
          detail:
            "Unifica protocolos heterogéneos en un único estado espacial determinista.",
        },
        {
          step: "CAPA 03",
          title: "Motor Contrafactual",
          detail:
            "Evalúa millones de escenarios futuros antes de ejecutar cambios físicos.",
        },
        {
          step: "CAPA 04",
          title: "Interfaz Juanimal Studio",
          detail:
            "Tipografía neo-grotesca suiza, tempo bloqueado por scroll y cristal esmerilado Apple.",
        },
      ],
      metrics: [
        {
          value: "99.98%",
          label: "Paridad Espacial",
          note: "Coincidencia exacta entre hardware físico y el modelo en pantalla.",
        },
        {
          value: "1.2ms",
          label: "Ciclo de Ingesta",
          note: "Streaming continuo suavizado con interpolación amortiguada.",
        },
        {
          value: "+72h",
          label: "Margen Predictivo",
          note: "Antelación frente a picos térmicos y desgaste mecánico.",
        },
        {
          value: "42%",
          label: "Amplitud de Gradiente",
          note: "Barrido sedoso multi-color entre hielo #c6d8e6, coral #f97279, azul #2a72a3 y negro.",
        },
      ],
      bookCta: "¿Quieres una web interactiva de este nivel para tu marca? →",
    },
    studioPitch: {
      eyebrow: "PORTAFOLIO JUANIMAL STUDIO #01",
      title: "Motion de precisión que genera confianza empresarial.",
      desc: "Disponible como desarrollo llave en mano para startups de IA, robótica y empresas tech que buscan diferenciarse con ingeniería visual de autor.",
      cta: "Reservar Sprint Web →",
      secondary: "Ver Todo el Portafolio",
    },
  },
};

function clamp(v: number, min = 0, max = 1) {
  return v < min ? min : v > max ? max : v;
}

type RGB = [number, number, number];
type AlphaStop = { pos: number; rgb: RGB; alpha: number };

const STOPS_BY_MODE: Record<StepperSectionData["paletteMode"], AlphaStop[]> = {
  "coral-lead": [
    { pos: 0, rgb: [13, 21, 32], alpha: 0.2 },
    { pos: 0.28, rgb: [42, 114, 163], alpha: 0.92 }, // #2a72a3 Cerulean transition
    { pos: 0.62, rgb: [249, 114, 121], alpha: 1 }, // #f97279 Coral wave peak
    { pos: 1, rgb: [13, 21, 32], alpha: 1 }, // Solid editorial black
  ],
  "cerulean-lead": [
    { pos: 0, rgb: [13, 21, 32], alpha: 0.2 },
    { pos: 0.28, rgb: [249, 114, 121], alpha: 0.92 }, // #f97279 Coral transition
    { pos: 0.62, rgb: [42, 114, 163], alpha: 1 }, // #2a72a3 Cerulean peak
    { pos: 1, rgb: [13, 21, 32], alpha: 1 }, // Solid editorial black
  ],
  "glacial-harmony": [
    { pos: 0, rgb: [13, 21, 32], alpha: 0.2 },
    { pos: 0.26, rgb: [122, 169, 204], alpha: 0.88 }, // Soft glacial blue bridge
    { pos: 0.56, rgb: [249, 114, 121], alpha: 0.98 }, // #f97279 Coral rose
    { pos: 0.8, rgb: [42, 114, 163], alpha: 1 }, // #2a72a3 Deep cerulean
    { pos: 1, rgb: [13, 21, 32], alpha: 1 }, // Solid editorial black
  ],
};

function sampleMultiStopColor(
  u: number,
  mode: StepperSectionData["paletteMode"]
): string {
  if (u <= 0) return "rgba(13, 21, 32, 0.2)";
  if (u >= 1) return "rgb(13, 21, 32)";
  const stops = STOPS_BY_MODE[mode];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (u >= a.pos && u <= b.pos) {
      const local = (u - a.pos) / Math.max(0.0001, b.pos - a.pos);
      const r = Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * local);
      const g = Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * local);
      const bl = Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * local);
      const al = +(a.alpha + (b.alpha - a.alpha) * local).toFixed(3);
      return `rgba(${r}, ${g}, ${bl}, ${al})`;
    }
  }
  return "rgb(13, 21, 32)";
}

function SmoothGradientDescription({
  text,
  subProgress,
  isActive,
  mode,
}: {
  text: string;
  subProgress: number;
  isActive: boolean;
  mode: StepperSectionData["paletteMode"];
}) {
  const words = useMemo(() => text.split(" "), [text]);
  const totalChars = useMemo(
    () => Math.max(1, text.replace(/\s+/g, "").length),
    [text]
  );

  // Reach full solid black by 82% of the sub-step, holding 82%..100% steady in solid black
  const scrubP = clamp(subProgress / 0.82, 0, 1);
  // Wide feather window (0.42) gives an unmistakably smooth liquid gradient sweep
  const feather = 0.42;
  const waveHead = scrubP * (1 + feather);

  let charCursor = 0;

  return (
    <p
      className={`vt-step-desc ${isActive ? "is-active" : ""}`}
      aria-hidden={!isActive}
    >
      {words.map((word, wi) => {
        const chars = Array.from(word);
        const startIdx = charCursor;
        charCursor += chars.length;
        return (
          <span key={wi} className="vt-word-keep">
            {chars.map((ch, ci) => {
              const charPos = (startIdx + ci) / totalChars;
              const u = clamp((waveHead - charPos) / feather, 0, 1);
              const color = sampleMultiStopColor(u, mode);
              return (
                <span key={ci} style={{ color }}>
                  {ch}
                </span>
              );
            })}
            {wi < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

function StepVisualCanvas({
  variant,
  isActive,
  reduced,
}: {
  variant: StepperItem["visualVariant"];
  isActive: boolean;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let tick = 0;

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
        if (!reduced && isActive) raf = requestAnimationFrame(draw);
        return;
      }

      if (!reduced && isActive) {
        tick += 0.022;
      }

      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const r = Math.min(w, h) * 0.34;

      // Soft ambient backdrop aura using uploaded palette (#c6d8e6, #f97279, #2a72a3)
      const grad = ctx.createRadialGradient(
        cx + Math.cos(tick * 0.4) * r * 0.16,
        cy + Math.sin(tick * 0.4) * r * 0.14,
        r * 0.15,
        cx,
        cy,
        r * 1.45
      );
      if (variant === "data" || variant === "acquire" || variant === "effective") {
        grad.addColorStop(0, "rgba(42, 114, 163, 0.24)");
        grad.addColorStop(0.55, "rgba(198, 216, 230, 0.42)");
        grad.addColorStop(1, "rgba(249, 114, 121, 0.12)");
      } else if (
        variant === "device" ||
        variant === "control" ||
        variant === "sustainable"
      ) {
        grad.addColorStop(0, "rgba(249, 114, 121, 0.26)");
        grad.addColorStop(0.55, "rgba(42, 114, 163, 0.2)");
        grad.addColorStop(1, "rgba(198, 216, 230, 0.25)");
      } else {
        grad.addColorStop(0, "rgba(42, 114, 163, 0.28)");
        grad.addColorStop(0.5, "rgba(249, 114, 121, 0.22)");
        grad.addColorStop(1, "rgba(198, 216, 230, 0.3)");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle Swiss Grid
      ctx.strokeStyle = "rgba(13, 21, 32, 0.08)";
      ctx.lineWidth = 1;
      const step = 36;
      ctx.beginPath();
      for (let gx = (w % step) / 2; gx < w; gx += step) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
      }
      for (let gy = (h % step) / 2; gy < h; gy += step) {
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
      }
      ctx.stroke();

      // Mode-specific geometry choreography
      if (variant === "data" || variant === "acquire") {
        // Multi-channel sine waves normalizing into tight equilibrium line
        for (let line = 0; line < 4; line++) {
          ctx.beginPath();
          const baseY = cy + (line - 1.5) * 34;
          for (let px = w * 0.12; px <= w * 0.88; px += 4) {
            const normX = (px - w * 0.12) / (w * 0.76);
            const damp = variant === "acquire" ? 1 - normX * 0.7 : Math.sin(normX * Math.PI);
            const amp = (24 - line * 4) * damp;
            const py = baseY + Math.sin(normX * 11 - tick * (1.8 + line * 0.25) + line) * amp;
            if (px <= w * 0.12 + 1) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle =
            line % 2 === 0 ? "rgba(42, 114, 163, 0.9)" : "rgba(249, 114, 121, 0.88)";
          ctx.lineWidth = line === 0 ? 2.8 : 1.7;
          ctx.stroke();
        }
        // Moving sample dots
        for (let k = 0; k < 5; k++) {
          const prog = ((tick * 0.28 + k * 0.2) % 1);
          const dx = w * 0.12 + prog * (w * 0.76);
          const dy = cy + Math.sin(prog * 11 - tick * 1.8) * 24 * Math.sin(prog * Math.PI);
          ctx.beginPath();
          ctx.arc(dx, dy, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#f97279";
          ctx.fill();
        }
      } else if (variant === "device" || variant === "control") {
        // Gyroscopic twin rings + mechanical crosshair control lock
        [1, 0.74, 0.48].forEach((scale, idx) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((idx === 1 ? -1 : 1) * tick * (0.45 + idx * 0.2));
          ctx.scale(1, 0.56 + idx * 0.12);
          ctx.beginPath();
          ctx.arc(0, 0, r * scale, 0, Math.PI * 2);
          ctx.strokeStyle =
            idx === 0
              ? "#2a72a3"
              : idx === 1
              ? "#f97279"
              : "rgba(13, 21, 32, 0.75)";
          ctx.lineWidth = idx === 2 ? 1.8 : 2.6;
          if (idx === 1) ctx.setLineDash([10, 7]);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        });
        // Locking cube node in center
        const boxS = r * 0.34;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tick * 0.35);
        ctx.strokeStyle = "#0d1520";
        ctx.lineWidth = 2;
        ctx.strokeRect(-boxS / 2, -boxS / 2, boxS, boxS);
        ctx.fillStyle = "rgba(249, 114, 121, 0.28)";
        ctx.fillRect(-boxS / 2, -boxS / 2, boxS, boxS);
        ctx.restore();
      } else {
        // Predictive fan / Autonomous node graph
        const pts: [number, number][] = [];
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI * 2) / 6 + tick * 0.25;
          const dist = r * (0.72 + Math.sin(tick + i) * 0.08);
          pts.push([cx + Math.cos(a) * dist, cy + Math.sin(a) * dist]);
        }
        ctx.strokeStyle = "rgba(42, 114, 163, 0.45)";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            ctx.moveTo(pts[i][0], pts[i][1]);
            ctx.lineTo(pts[j][0], pts[j][1]);
          }
        }
        ctx.stroke();

        pts.forEach(([px, py], i) => {
          ctx.beginPath();
          ctx.arc(px, py, i % 2 === 0 ? 7 : 5.5, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? "#f97279" : "#2a72a3";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }

      if (!reduced && isActive) {
        raf = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [isActive, reduced, variant]);

  return (
    <canvas
      ref={canvasRef}
      className="vt-step-canvas"
      aria-hidden="true"
    />
  );
}

function PinnedStepperSection({
  data,
  reduced,
  onEnterSection,
}: {
  data: StepperSectionData;
  reduced: boolean;
  onEnterSection: (navId: SectionNavId, accentHex: string) => void;
}) {
  const trackRef = useRef<HTMLElement | null>(null);
  const targetPRef = useRef(0);
  const smoothPRef = useRef(0);
  const [smoothP, setSmoothP] = useState(0);

  useEffect(() => {
    if (reduced) {
      setSmoothP(0.95);
      return;
    }

    let raf = 0;
    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const maxScroll = Math.max(1, el.offsetHeight - window.innerHeight);
      const raw = clamp(-rect.top / maxScroll, 0, 1);
      targetPRef.current = raw;

      if (rect.top <= window.innerHeight * 0.48 && rect.bottom >= window.innerHeight * 0.3) {
        onEnterSection(data.navId, data.accentHex);
      }
    };

    const tick = () => {
      const diff = targetPRef.current - smoothPRef.current;
      if (Math.abs(diff) > 0.0005) {
        smoothPRef.current += diff * 0.11; // Gentle physical inertia
        setSmoothP(smoothPRef.current);
      }
      raf = requestAnimationFrame(tick);
    };

    measure();
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [data.accentHex, data.navId, onEnterSection, reduced]);

  // Divide total pinned travel evenly into 3 sub-steps:
  // [0.00..0.34] -> stepIdx 0
  // [0.34..0.68] -> stepIdx 1
  // [0.68..1.00] -> stepIdx 2
  const stepIdx = smoothP < 0.34 ? 0 : smoothP < 0.68 ? 1 : 2;
  const subP =
    stepIdx === 0
      ? clamp(smoothP / 0.34, 0, 1)
      : stepIdx === 1
      ? clamp((smoothP - 0.34) / 0.34, 0, 1)
      : clamp((smoothP - 0.68) / 0.32, 0, 1);

  return (
    <section
      ref={trackRef}
      id={data.id}
      className={`vt-stepper-track ${data.reversed ? "is-reversed" : ""}`}
      aria-label={`${data.index} ${data.heading}`}
    >
      <div className="vt-stepper-sticky">
        <div className="vt-stepper-inner">
          {/* Left / Right Media Stage Column */}
          <div className="vt-step-media">
            <div className="vt-step-media-box">
              {data.items.map((item, idx) => {
                const isActive = idx === stepIdx;
                return (
                  <div
                    key={item.category}
                    className={`vt-step-media-el ${isActive ? "is-active" : ""}`}
                    aria-hidden={!isActive}
                  >
                    <StepVisualCanvas
                      variant={item.visualVariant}
                      isActive={isActive}
                      reduced={reduced}
                    />
                    <div className="vt-media-hud-top">
                      <span>{item.tag}</span>
                      <strong>{item.metric}</strong>
                    </div>
                    <div className="vt-media-hud-bottom">
                      <span>{item.category}</span>
                      <span>
                        0{idx + 1} / 03
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Copy & Rolling Title Column (Wembi formula) */}
          <div className="vt-step-content">
            <div className="vt-step-title-stack">
              <div className="vt-step-index-row">
                <span className="vt-step-index">{data.index}</span>
                <span className="vt-step-mini-progress">
                  STEP 0{stepIdx + 1} / 03
                </span>
              </div>

              <h2 className="vt-step-heading">
                <span
                  className="vt-step-highlight"
                  style={{
                    backgroundColor: data.accentSoft,
                    borderColor: data.accentHex,
                  }}
                >
                  {data.heading}
                </span>
              </h2>

              <div className="vt-step-category-mask" aria-live="polite">
                <div
                  className="vt-step-category-inner"
                  style={{
                    transform: `translateY(${-(stepIdx * 33.3333)}%)`,
                  }}
                >
                  {data.items.map((it) => (
                    <span key={it.category} className="vt-step-category-item">
                      {it.category}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="vt-step-descriptions">
              {data.items.map((item, idx) => (
                <div
                  key={item.category}
                  className={`vt-step-desc-slot ${
                    idx === stepIdx ? "is-active" : ""
                  }`}
                >
                  <SmoothGradientDescription
                    text={item.description}
                    subProgress={idx === stepIdx ? subP : idx < stepIdx ? 1 : 0}
                    isActive={idx === stepIdx}
                    mode={data.paletteMode}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SoftDotCursor({
  accentColor,
  reduced,
}: {
  accentColor: string;
  reduced: boolean;
}) {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer) return;

    let raf = 0;
    const target = { x: -120, y: -120 };
    const current = { x: -120, y: -120 };
    let visible = false;
    let expanded = false;
    let draggingOrScrollbar = false;

    const syncDom = () => {
      const el = dotRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${(current.x - 10).toFixed(1)}px, ${(
        current.y - 10
      ).toFixed(1)}px, 0) scale(${expanded ? 1.85 : 1})`;
      el.style.opacity = visible && !draggingOrScrollbar ? "1" : "0";
      el.classList.toggle("is-expanded", expanded);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        visible = false;
        syncDom();
        return;
      }
      // Hide immediately when hovering near the native browser scrollbar strip
      const nearScrollbar =
        e.clientX >= document.documentElement.clientWidth - 18 ||
        e.clientX <= 2 ||
        e.clientY <= 2;

      if (draggingOrScrollbar || nearScrollbar) {
        visible = false;
        syncDom();
        return;
      }

      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        current.x = e.clientX;
        current.y = e.clientY;
        visible = true;
      }

      const tgtEl = e.target as HTMLElement | null;
      expanded = Boolean(
        tgtEl?.closest("a, button, [role='button'], .vt-sector-card, .vt-mode-btn")
      );
    };

    const onPointerDown = (e: PointerEvent) => {
      // If user clicks to drag scrollbar or select text, suppress dot so zero residue remains
      if (
        e.clientX >= document.documentElement.clientWidth - 22 ||
        e.buttons === 1
      ) {
        draggingOrScrollbar = true;
        visible = false;
        syncDom();
      }
    };

    const onPointerUp = () => {
      draggingOrScrollbar = false;
    };

    const hideAll = () => {
      visible = false;
      draggingOrScrollbar = false;
      syncDom();
    };

    const loop = () => {
      current.x += (target.x - current.x) * 0.22;
      current.y += (target.y - current.y) * 0.22;
      syncDom();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("mouseleave", hideAll);
    window.addEventListener("blur", hideAll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseleave", hideAll);
      window.removeEventListener("blur", hideAll);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={dotRef}
      className="vt-cursor-dot"
      style={{ backgroundColor: accentColor }}
      aria-hidden="true"
    />
  );
}

export function VectraTwinShowcase() {
  const { lang, setLang } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const c = COPY_VT[lang];

  const [activeNav, setActiveNav] = useState<SectionNavId>("what");
  const [cursorAccent, setCursorAccent] = useState<string>("#f97279");
  const [navVisible, setNavVisible] = useState(true);
  const [recapOpen, setRecapOpen] = useState(false);
  const [recapLens, setRecapLens] = useState<RecapLens>("matrix");
  const [inspectionMode, setInspectionMode] = useState<InspectionMode>("mesh");
  const [whatP, setWhatP] = useState(reduced ? 1 : 0);

  const whatRef = useRef<HTMLElement | null>(null);
  const whereRef = useRef<HTMLElement | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const handleEnterSection = useCallback(
    (navId: SectionNavId, accentHex: string) => {
      setActiveNav(navId);
      setCursorAccent(accentHex);
    },
    []
  );

  // Keyboard toggle [R] for Recap & [Escape] to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRecapOpen(false);
      else if (
        (e.key === "r" || e.key === "R") &&
        !e.metaKey &&
        !e.ctrlKey &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        setRecapOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Gentle scroll choreography for top nav & WHAT statement scrub
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const vh = window.innerHeight || 800;

      // Measure WHAT statement scrub
      if (whatRef.current && !reduced) {
        const wRect = whatRef.current.getBoundingClientRect();
        const prog = clamp((vh * 0.8 - wRect.top) / (vh * 0.45), 0, 1);
        setWhatP(prog);
        if (wRect.top <= vh * 0.48 && wRect.bottom >= vh * 0.25) {
          setActiveNav("what");
          setCursorAccent("#f97279");
        }
      }

      if (whereRef.current) {
        const whRect = whereRef.current.getBoundingClientRect();
        if (whRect.top <= vh * 0.45) {
          setActiveNav("where");
          setCursorAccent("#2a72a3");
        }
      }

      if (y > 140) {
        setNavVisible(false);
        if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = window.setTimeout(() => {
          setNavVisible(true);
        }, 380);
      } else {
        setNavVisible(true);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    };
  }, [reduced]);

  const scrollToTarget = (id: SectionNavId | "top") => {
    setRecapOpen(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const targetId =
      id === "what"
        ? "vt-what"
        : id === "how"
        ? "vt-step-01"
        : id === "why"
        ? "vt-step-03"
        : "vt-where";
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeInspection =
    c.whereSection.modes.find((m) => m.id === inspectionMode) ||
    c.whereSection.modes[0];

  return (
    <div className="vt-page" id="top">
      <SoftDotCursor accentColor={cursorAccent} reduced={reduced} />

      {/* Top Subtle Studio Return Medallion */}
      <header className="vt-topbar">
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

        <div className="vt-topbar-meta">
          <span>{c.heroBadge}</span>
        </div>
      </header>

      {/* GENEROUS GLACIAL EDITORIAL HERO */}
      <section className="vt-hero">
        <div className="vt-hero-aura" aria-hidden="true" />
        <div className="vt-hero-grid-lines" aria-hidden="true" />

        <div className="vt-hero-content">
          <div className="vt-hero-top-row">
            <span className="vt-code-pill">{c.heroCode}</span>
          </div>

          <h1 className="vt-hero-title">
            <span>{c.heroTitleA}</span>
            <span className="vt-hero-title-accent">{c.heroTitleB}</span>
          </h1>

          <div className="vt-hero-split-body">
            <p className="vt-hero-lede">{c.heroLede}</p>
            <div className="vt-hero-cta-row">
              <button
                type="button"
                className="vt-btn-dark"
                onClick={() => scrollToTarget("what")}
              >
                {c.heroPrimary}
              </button>
              <Link href="/contact" className="vt-btn-outline">
                {c.heroSecondary}
              </Link>
            </div>
            <p className="vt-hero-note">{c.heroNote}</p>
          </div>
        </div>
      </section>

      {/* n.001 WHAT EDITORIAL STATEMENT */}
      <section ref={whatRef} id="vt-what" className="vt-what-section">
        <div className="vt-what-inner">
          <span className="vt-chapter-chip">{c.whatStatement.prefix}</span>
          <div className="vt-what-statement">
            <span className="vt-what-highlight-word">
              {c.whatStatement.lead}{" "}
              <mark>{c.whatStatement.highlight}</mark>{" "}
            </span>
            <SmoothGradientDescription
              text={c.whatStatement.tail}
              subProgress={whatP}
              isActive
              mode="coral-lead"
            />
          </div>
          <p className="vt-what-sub">{c.whatStatement.sub}</p>
        </div>
      </section>

      {/* n.002 HOW & n.003 WHY — PINNED 3-SUB-STEP WEMBI STEPPERS */}
      {c.steppers.map((stepper) => (
        <PinnedStepperSection
          key={stepper.id}
          data={stepper}
          reduced={reduced}
          onEnterSection={handleEnterSection}
        />
      ))}

      {/* n.004 WHERE + CUSTOM GENERATED CORE INSPECTOR */}
      <section ref={whereRef} id="vt-where" className="vt-where-section">
        <div className="vt-where-head">
          <span className="vt-chapter-chip">{c.whereSection.tag}</span>
          <h2 className="vt-where-h2">{c.whereSection.headline}</h2>
          <p className="vt-where-sub">{c.whereSection.sub}</p>
        </div>

        <div className="vt-sectors-grid">
          {c.whereSection.sectors.map((sec) => (
            <article key={sec.code} className="vt-sector-card">
              <span>{sec.code}</span>
              <h3>{sec.name}</h3>
              <p>{sec.desc}</p>
            </article>
          ))}
        </div>

        {/* Custom Core Diagram Framed Uncropped (object-fit: contain) */}
        <div className="vt-inspector-shell">
          <div className="vt-inspector-bar">
            <div>
              <span className="vt-inspector-tag">
                {c.whereSection.inspectorTitle}
              </span>
              <p>{c.whereSection.inspectorSub}</p>
            </div>
            <div className="vt-mode-switch" role="group">
              {c.whereSection.modes.map((m) => (
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
              alt="Vectra Twin isometric 3D digital twin architecture diagram"
            />
          </div>

          <div className="vt-inspector-spec">
            <strong>{activeInspection.label}</strong>
            <span>{activeInspection.spec}</span>
          </div>
        </div>
      </section>

      {/* BOTTOM STUDIO PITCH */}
      <section className="vt-studio-cta">
        <div className="vt-studio-cta-box">
          <span className="vt-chapter-chip">{c.studioPitch.eyebrow}</span>
          <h2>{c.studioPitch.title}</h2>
          <p>{c.studioPitch.desc}</p>
          <div className="vt-hero-cta-row">
            <Link href="/contact" className="vt-btn-dark">
              {c.studioPitch.cta}
            </Link>
            <Link href="/#work" className="vt-btn-outline">
              {c.studioPitch.secondary}
            </Link>
          </div>
        </div>
      </section>

      {/* APPLE BLURRED GLASS SPLIT BOTTOM NAVIGATION (Split Left/Right on Desktop, Centered on Mobile) */}
      <nav
        className={`vt-site-nav ${navVisible ? "is-visible" : "is-hidden"}`}
        aria-label="Vectra Twin primary section navigation"
      >
        {/* LEFT GLASS PILL: WHAT / HOW / WHY / WHERE */}
        <div className="vt-glass-pill vt-nav-left" role="group">
          {c.navChapters.map((item) => {
            const isAct = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`vt-glass-btn ${isAct ? "is-active" : ""}`}
                onClick={() => scrollToTarget(item.id)}
              >
                <span className="vt-nav-dot" aria-hidden="true" />
                <span className="vt-nav-num">{item.num}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* RIGHT GLASS PILL: Overview, Recap, EN/ES, Contact */}
        <div className="vt-glass-pill vt-nav-right" role="group">
          <button
            type="button"
            className="vt-glass-btn"
            onClick={() => scrollToTarget("top")}
          >
            {c.overview}
          </button>
          <button
            type="button"
            className="vt-glass-btn is-recap"
            onClick={() => setRecapOpen(true)}
            aria-expanded={recapOpen}
          >
            <span className="vt-nav-dot" aria-hidden="true" />
            {c.recapBtn}
          </button>
          <button
            type="button"
            className="vt-glass-btn vt-lang-chip"
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            aria-label="Switch language"
          >
            {lang.toUpperCase()}
          </button>
          <Link href="/contact" className="vt-glass-cta">
            {c.contactBtn}
          </Link>
        </div>
      </nav>

      {/* RECAP EXECUTIVE DRAWER */}
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
                <span className="vt-chapter-chip">{c.recap.eyebrow}</span>
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
              <div className="vt-recap-grid">
                {c.recap.matrix.map((m) => (
                  <button
                    key={m.code}
                    type="button"
                    className="vt-recap-card"
                    onClick={() => scrollToTarget(m.navId)}
                  >
                    <div className="vt-recap-card-top">
                      <span>{m.code}</span>
                      <strong>{m.metric}</strong>
                    </div>
                    <h3>{m.title}</h3>
                    <p>{m.summary}</p>
                    <span className="vt-recap-jump">{c.recap.jump}</span>
                  </button>
                ))}
              </div>
            )}

            {recapLens === "stack" && (
              <div className="vt-recap-grid">
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
              <div className="vt-recap-grid">
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
                className="vt-btn-dark"
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
