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
    | "predict";
}

interface StepperSectionData {
  id: string;
  navId: SectionNavId;
  index: string;
  heading: string;
  accentHex: string;
  accentSoft: string;
  reversed?: boolean;
  paletteMode: "coral-lead" | "cerulean-lead";
  items: [StepperItem, StepperItem, StepperItem];
}

interface PillItemData {
  id: string;
  label: string;
  subTag: string;
  targetScrollId?: string;
  bg: string;
  color: string;
  isRoundCapsule: boolean;
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
  howTower: {
    id: string;
    eyebrow: string;
    hint: string;
    ringTheme: "glacial-coral" | "cerulean-ice";
    pills: PillItemData[];
  };
  steppers: [StepperSectionData, StepperSectionData];
  whyTower: {
    id: string;
    eyebrow: string;
    hint: string;
    ringTheme: "glacial-coral" | "cerulean-ice";
    pills: PillItemData[];
  };
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

const HERO_VIDEO_SRC: string | null = "/media/vectra/hero-rings.mp4";

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
    heroCode: "N°001 · The Digital Twin of Everything",
    heroTitleA: "Instant Digital Twin",
    heroTitleB: "of Everything.",
    heroLede:
      "Vectra instantly improves the performance of any device, machine, GPU rack, or digital system by orchestrating its virtual replica in real time.",
    heroPrimary: "Scroll to WHAT ↓",
    heroSecondary: "Commission Similar Site",
    heroNote:
      "Pinned wheel tempo · Push pills by velocity · Data → Device → Application",
    whatStatement: {
      prefix: "n.001 · WHAT",
      lead: "An intelligent",
      highlight: "Digital Twin",
      tail: "managed remotely in real time—identifying the strongest operating scenario before steel ever feels stress.",
      sub: "Full-viewport cognitive pacing · Case #01 by The Juanimal Studio.",
    },
    howTower: {
      id: "vt-how-tower",
      eyebrow: "n.002 · HOW // SYSTEM PILLARS",
      hint: "MOVE POINTER ACROSS PILLS TO PUSH · CLICK TO JUMP",
      ringTheme: "cerulean-ice",
      pills: [
        {
          id: "pill-dt",
          label: "Digital Twin",
          subTag: "01 · SPATIAL REPLICA",
          targetScrollId: "vt-step-01",
          bg: "#f97279",
          color: "#0d1520",
          isRoundCapsule: false,
        },
        {
          id: "pill-fn",
          label: "Functioning",
          subTag: "02 · ENGINE LOOP",
          targetScrollId: "vt-step-02",
          bg: "#ffffff",
          color: "#0d1520",
          isRoundCapsule: true,
        },
      ],
    },
    steppers: [
      {
        id: "vt-step-01",
        navId: "how",
        index: "01",
        heading: "Digital Twin",
        accentHex: "#f97279",
        accentSoft: "rgba(249, 114, 121, 0.42)",
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
              "Usage rules and programmable logic: workflow automation, energy efficiency, real-time simulation, prediction, and agent orchestration.",
          },
        ],
      },
      {
        id: "vt-step-02",
        navId: "how",
        index: "02",
        heading: "Functioning",
        accentHex: "#2a72a3",
        accentSoft: "rgba(42, 114, 163, 0.25)",
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
    ],
    whyTower: {
      id: "vt-why-tower",
      eyebrow: "n.003 · WHY // OUTCOME PILLARS",
      hint: "ENTER FROM LEFT OR RIGHT TO KICK WITH VELOCITY",
      ringTheme: "glacial-coral",
      pills: [
        {
          id: "pill-eff",
          label: "Effective",
          subTag: "+24% THROUGHPUT",
          targetScrollId: "vt-where",
          bg: "#2a72a3",
          color: "#ffffff",
          isRoundCapsule: false,
        },
        {
          id: "pill-sus",
          label: "Sustainable",
          subTag: "-19% PEAK WATTAGE",
          targetScrollId: "vt-where",
          bg: "#ffffff",
          color: "#0d1520",
          isRoundCapsule: true,
        },
        {
          id: "pill-aut",
          label: "Autonomous",
          subTag: "-41% DOWNTIME",
          targetScrollId: "vt-where",
          bg: "#f97279",
          color: "#0d1520",
          isRoundCapsule: false,
        },
      ],
    },
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
      "Tempo natural bloqueado · Empuja las píldoras con el mouse · Data → Device → Application",
    whatStatement: {
      prefix: "n.001 · WHAT",
      lead: "Un",
      highlight: "Gemelo Digital",
      tail: "inteligente gestionado a distancia en tiempo real, capaz de identificar el mejor escenario futuro antes de que el metal sufra desgaste.",
      sub: "Composición a pantalla completa · Caso #01 por The Juanimal Studio.",
    },
    howTower: {
      id: "vt-how-tower",
      eyebrow: "n.002 · HOW // PILARES DEL SISTEMA",
      hint: "PASA EL MOUSE POR LOS BORDES PARA EMPUJAR · CLIC PARA IR",
      ringTheme: "cerulean-ice",
      pills: [
        {
          id: "pill-dt",
          label: "Digital Twin",
          subTag: "01 · RÉPLICA ESPACIAL",
          targetScrollId: "vt-step-01",
          bg: "#f97279",
          color: "#0d1520",
          isRoundCapsule: false,
        },
        {
          id: "pill-fn",
          label: "Functioning",
          subTag: "02 · MOTOR EN VIVO",
          targetScrollId: "vt-step-02",
          bg: "#ffffff",
          color: "#0d1520",
          isRoundCapsule: true,
        },
      ],
    },
    steppers: [
      {
        id: "vt-step-01",
        navId: "how",
        index: "01",
        heading: "Digital Twin",
        accentHex: "#f97279",
        accentSoft: "rgba(249, 114, 121, 0.42)",
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
        accentSoft: "rgba(42, 114, 163, 0.25)",
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
    ],
    whyTower: {
      id: "vt-why-tower",
      eyebrow: "n.003 · WHY // IMPACTO REAL",
      hint: "ENTRA POR IZQUIERDA O DERECHA PARA IMPULSAR LAS PÍLDORAS",
      ringTheme: "glacial-coral",
      pills: [
        {
          id: "pill-eff",
          label: "Effective",
          subTag: "+24% RENDIMIENTO",
          targetScrollId: "vt-where",
          bg: "#2a72a3",
          color: "#ffffff",
          isRoundCapsule: false,
        },
        {
          id: "pill-sus",
          label: "Sustainable",
          subTag: "-19% PICOS WATT",
          targetScrollId: "vt-where",
          bg: "#ffffff",
          color: "#0d1520",
          isRoundCapsule: true,
        },
        {
          id: "pill-aut",
          label: "Autonomous",
          subTag: "-41% PARADAS",
          targetScrollId: "vt-where",
          bg: "#f97279",
          color: "#0d1520",
          isRoundCapsule: false,
        },
      ],
    },
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
    { pos: 0.28, rgb: [42, 114, 163], alpha: 0.92 },
    { pos: 0.62, rgb: [249, 114, 121], alpha: 1 },
    { pos: 1, rgb: [13, 21, 32], alpha: 1 },
  ],
  "cerulean-lead": [
    { pos: 0, rgb: [13, 21, 32], alpha: 0.2 },
    { pos: 0.28, rgb: [249, 114, 121], alpha: 0.92 },
    { pos: 0.62, rgb: [42, 114, 163], alpha: 1 },
    { pos: 1, rgb: [13, 21, 32], alpha: 1 },
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

  const scrubP = clamp(subProgress / 0.82, 0, 1);
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

/* Sculptural 3D Glass Torus Rings Canvas (echoing Ref 1 background geometry in #c6d8e6 / #2a72a3 / #f97279) */
function SculpturalRingsCanvas({
  theme,
  reduced,
  pointerOffsetRef,
}: {
  theme: "glacial-coral" | "cerulean-ice";
  reduced: boolean;
  pointerOffsetRef?: React.MutableRefObject<{ nx: number; ny: number }>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let time = 0;
    let smoothNx = 0;
    let smoothNy = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(parent.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(parent.clientHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const drawRing = (
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      rot: number,
      bandW: number,
      cLight: string,
      cMid: string,
      cEdge: string
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);

      // Soft cast shadow beneath sculptural ring
      ctx.save();
      ctx.translate(10, 18);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(13, 21, 32, 0.14)";
      ctx.lineWidth = bandW * 1.08;
      ctx.stroke();
      ctx.restore();

      // Main sculpted 3D ring gradient body
      const grad = ctx.createLinearGradient(-rx, -ry, rx, ry);
      grad.addColorStop(0, cLight);
      grad.addColorStop(0.5, cMid);
      grad.addColorStop(1, cEdge);

      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = bandW;
      ctx.stroke();

      // Specular rim highlight along outer bevel
      ctx.beginPath();
      ctx.ellipse(0, 0, rx + bandW * 0.28, ry + bandW * 0.28, 0, 0.2, Math.PI * 1.1);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.62)";
      ctx.lineWidth = Math.max(2, bandW * 0.14);
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) {
        if (!reduced) raf = requestAnimationFrame(render);
        return;
      }

      if (!reduced) time += 0.012;
      const targetNx = pointerOffsetRef?.current.nx ?? 0;
      const targetNy = pointerOffsetRef?.current.ny ?? 0;
      smoothNx += (targetNx - smoothNx) * 0.06;
      smoothNy += (targetNy - smoothNy) * 0.06;

      ctx.clearRect(0, 0, w, h);

      // Soft atmospheric gradient backdrop
      const bg = ctx.createLinearGradient(0, 0, w, h);
      if (theme === "cerulean-ice") {
        bg.addColorStop(0, "#d7e5f0");
        bg.addColorStop(0.55, "#c6d8e6");
        bg.addColorStop(1, "#acc7dc");
      } else {
        bg.addColorStop(0, "#dfeaf3");
        bg.addColorStop(0.5, "#c6d8e6");
        bg.addColorStop(1, "#e5d5dc");
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const baseR = Math.min(w, h) * 0.24;
      const band = Math.max(26, baseR * 0.34);

      const cx = w * 0.5 + smoothNx * 28;
      const cy = h * 0.48 + smoothNy * 20;

      // Diagonal cascade of sculptural interlocking rings (matching Ref 1 silhouettes)
      const rings =
        theme === "cerulean-ice"
          ? [
              { ox: -1.35, oy: -0.95, s: 0.92, rot: -0.68, c1: "#f5f9fc", c2: "#c6d8e6", c3: "#8fb3cf" },
              { ox: -0.78, oy: -0.52, s: 1.0, rot: -0.62, c1: "#3e8ec5", c2: "#2a72a3", c3: "#164466" },
              { ox: -0.18, oy: -0.15, s: 1.06, rot: -0.58, c1: "#eaf3f9", c2: "#9bc4de", c3: "#2a72a3" },
              { ox: 0.44, oy: 0.16, s: 1.04, rot: -0.55, c1: "#d2e2ee", c2: "#7ca2be", c3: "#355066" },
              { ox: 1.02, oy: 0.56, s: 1.02, rot: -0.58, c1: "#ffc2c5", c2: "#f97279", c3: "#b8454b" },
            ]
          : [
              { ox: -1.3, oy: -0.82, s: 0.95, rot: 0.55, c1: "#f97279", c2: "#d4555d", c3: "#7c2c33" },
              { ox: -0.68, oy: -0.44, s: 1.02, rot: 0.6, c1: "#ffffff", c2: "#c6d8e6", c3: "#6c91b0" },
              { ox: 0.0, oy: -0.04, s: 1.08, rot: 0.62, c1: "#589fd0", c2: "#2a72a3", c3: "#133a57" },
              { ox: 0.68, oy: 0.34, s: 1.0, rot: 0.58, c1: "#ffe3e5", c2: "#f97279", c3: "#9e3b41" },
              { ox: 1.32, oy: 0.72, s: 0.92, rot: 0.52, c1: "#e6eff7", c2: "#95b8d4", c3: "#2a72a3" },
            ];

      rings.forEach((rg, i) => {
        const wobbleX = Math.sin(time + i * 1.1) * 8 + smoothNx * (i - 2) * 8;
        const wobbleY = Math.cos(time * 0.8 + i * 0.9) * 8 + smoothNy * (i - 2) * 6;
        drawRing(
          cx + rg.ox * baseR * 0.98 + wobbleX,
          cy + rg.oy * baseR * 0.74 + wobbleY,
          baseR * rg.s,
          baseR * rg.s * 0.72,
          rg.rot + Math.sin(time * 0.5 + i) * 0.04,
          band * (0.9 + (i % 2) * 0.14),
          rg.c1,
          rg.c2,
          rg.c3
        );
      });

      if (!reduced) raf = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [pointerOffsetRef, reduced, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="vt-rings-canvas"
      aria-hidden="true"
    />
  );
}

/* Full-Bleed Sculptural Stage + Oversized Stacked Pills with Velocity Directional Mouse-Push Physics */
function InteractivePillTower({
  eyebrow,
  hint,
  sectionId,
  ringTheme,
  pills,
  reduced,
  onJumpId,
  onEnterSection,
  navId,
  navAccent,
}: {
  eyebrow: string;
  hint: string;
  sectionId: string;
  ringTheme: "glacial-coral" | "cerulean-ice";
  pills: PillItemData[];
  reduced: boolean;
  onJumpId: (elId: string) => void;
  onEnterSection: (navId: SectionNavId, accentHex: string) => void;
  navId: SectionNavId;
  navAccent: string;
}) {
  const stageRef = useRef<HTMLElement | null>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ptrNormRef = useRef<{ nx: number; ny: number }>({ nx: 0, ny: 0 });
  const velRef = useRef<{ lastX: number; lastY: number; dx: number; dy: number }>({
    lastX: 0,
    lastY: 0,
    dx: 0,
    dy: 0,
  });

  // Per-pill elastic spring state: current offset + target impulse
  const springStatesRef = useRef<
    { x: number; y: number; rot: number; vx: number; vy: number; vrot: number }[]
  >([]);

  useEffect(() => {
    springStatesRef.current = pills.map(() => ({
      x: 0,
      y: 0,
      rot: 0,
      vx: 0,
      vy: 0,
      vrot: 0,
    }));
  }, [pills]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (r.top <= vh * 0.45 && r.bottom >= vh * 0.35) {
        onEnterSection(navId, navAccent);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navAccent, navId, onEnterSection]);

  // Spring physics RAF loop settling pushed pills organically
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const k = 0.085; // elastic stiffness
    const damp = 0.78; // silky elastic damping

    const step = () => {
      const states = springStatesRef.current;
      for (let i = 0; i < states.length; i++) {
        const s = states[i];
        s.vx = (s.vx - s.x * k) * damp;
        s.vy = (s.vy - s.y * k) * damp;
        s.vrot = (s.vrot - s.rot * k) * damp;
        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.vrot;

        const btn = pillRefs.current[i];
        const txt = textRefs.current[i];
        if (btn) {
          btn.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(
            2
          )}px, 0) rotate(${s.rot.toFixed(2)}deg)`;
        }
        if (txt) {
          txt.style.transform = `translate3d(${(s.x * 0.35).toFixed(2)}px, ${(
            s.y * 0.35
          ).toFixed(2)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const handleStageMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    ptrNormRef.current = {
      nx: ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2,
      ny: ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2,
    };

    const prev = velRef.current;
    if (prev.lastX !== 0 || prev.lastY !== 0) {
      prev.dx = e.clientX - prev.lastX;
      prev.dy = e.clientY - prev.lastY;
    }
    prev.lastX = e.clientX;
    prev.lastY = e.clientY;
  };

  const kickPill = (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced) return;
    const s = springStatesRef.current[idx];
    if (!s) return;

    const btnRect = e.currentTarget.getBoundingClientRect();
    const { dx, dy } = velRef.current;
    // Combine mouse velocity with side-of-entry geometry so even slow edge entries push clearly!
    const relX = (e.clientX - (btnRect.left + btnRect.width * 0.5)) / Math.max(1, btnRect.width * 0.5);
    const relY = (e.clientY - (btnRect.top + btnRect.height * 0.5)) / Math.max(1, btnRect.height * 0.5);

    const impulseX =
      Math.abs(dx) > 2
        ? Math.max(-26, Math.min(26, dx * 0.85))
        : -relX * 16; // Enter from left (relX < 0) -> kick RIGHT (+)!
    const impulseY =
      Math.abs(dy) > 2
        ? Math.max(-18, Math.min(18, dy * 0.7))
        : -relY * 11;
    const impulseRot = (impulseX > 0 ? 1 : -1) * Math.min(5, Math.abs(impulseX) * 0.16);

    s.vx += impulseX;
    s.vy += impulseY;
    s.vrot += impulseRot;
  };

  return (
    <section
      ref={stageRef}
      id={sectionId}
      className="vt-pill-tower-stage"
      onMouseMove={handleStageMouseMove}
      onMouseLeave={() => {
        velRef.current = { lastX: 0, lastY: 0, dx: 0, dy: 0 };
        ptrNormRef.current = { nx: 0, ny: 0 };
      }}
    >
      <SculpturalRingsCanvas
        theme={ringTheme}
        reduced={reduced}
        pointerOffsetRef={ptrNormRef}
      />

      <div className="vt-tower-video-wrap" aria-hidden="true">
        {!reduced ? (
          <>
            <video
              className="vt-tower-video-bg"
              autoPlay
              loop
              muted
              playsInline
              poster="/media/vectra/tower-rings-poster.jpg"
            >
              <source src="/media/vectra/tower-rings.mp4" type="video/mp4" />
            </video>
            <video
              className="vt-tower-video-fg"
              autoPlay
              loop
              muted
              playsInline
              poster="/media/vectra/tower-rings-poster.jpg"
            >
              <source src="/media/vectra/tower-rings.mp4" type="video/mp4" />
            </video>
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/media/vectra/tower-rings-poster.jpg"
            alt=""
            className="vt-tower-video-fg"
          />
        )}
      </div>

      <div className="vt-tower-top-meta">
        <span>{eyebrow}</span>
        <span>{hint}</span>
      </div>

      <div className="vt-tower-stack">
        {pills.map((pill, idx) => (
          <button
            key={pill.id}
            ref={(el) => {
              pillRefs.current[idx] = el;
            }}
            type="button"
            className={`vt-tower-pill ${
              pill.isRoundCapsule ? "is-capsule" : "is-rect"
            }`}
            style={{
              backgroundColor: pill.bg,
              color: pill.color,
              zIndex: pills.length - idx,
            }}
            onMouseEnter={(e) => kickPill(idx, e)}
            onMouseMove={(e) => {
              // Subtle live velocity transfer while moving across the pill surface
              if (
                Math.abs(velRef.current.dx) > 6 ||
                Math.abs(velRef.current.dy) > 6
              ) {
                const s = springStatesRef.current[idx];
                if (s) {
                  s.vx += clamp(velRef.current.dx * 0.08, -2.5, 2.5);
                  s.vy += clamp(velRef.current.dy * 0.08, -2, 2);
                }
              }
              void e;
            }}
            onClick={() => {
              if (pill.targetScrollId) onJumpId(pill.targetScrollId);
            }}
          >
            <span
              ref={(el) => {
                textRefs.current[idx] = el;
              }}
              className="vt-tower-pill-inner"
            >
              <small className="vt-tower-sub">{pill.subTag}</small>
              <span className="vt-tower-label">{pill.label}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function StepVisualMediaLayer({
  variant,
  isActive,
  reduced,
}: {
  variant: StepperItem["visualVariant"];
  isActive: boolean;
  reduced: boolean;
}) {
  const vidRef = useRef<HTMLVideoElement | null>(null);

  const clipConfig = useMemo(() => {
    if (variant === "data" || variant === "acquire") {
      return {
        src: "/media/vectra/step-data-ribbons.mp4",
        poster: "/media/vectra/step-data-ribbons-poster.jpg",
        isAmbientOnly: false,
      };
    }
    if (variant === "device" || variant === "control") {
      return {
        src: "/media/vectra/step-device-turbine.mp4",
        poster: "/media/vectra/step-device-turbine-poster.jpg",
        isAmbientOnly: false,
      };
    }
    return {
      src: "/media/vectra/hero-rings.mp4",
      poster: "/media/vectra/hero-rings-poster.jpg",
      isAmbientOnly: true,
    };
  }, [variant]);

  useEffect(() => {
    const el = vidRef.current;
    if (!el) return;
    if (isActive && !reduced) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isActive, reduced]);

  return (
    <>
      {!reduced ? (
        <video
          ref={vidRef}
          className={`vt-step-video ${clipConfig.isAmbientOnly ? "is-ambient" : ""}`}
          loop
          muted
          playsInline
          preload="metadata"
          poster={clipConfig.poster}
          aria-hidden="true"
        >
          <source src={clipConfig.src} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={clipConfig.poster}
          alt=""
          className={`vt-step-video ${clipConfig.isAmbientOnly ? "is-ambient" : ""}`}
          aria-hidden="true"
        />
      )}
      {clipConfig.isAmbientOnly && (
        <StepVisualCanvas
          variant={variant}
          isActive={isActive}
          reduced={reduced}
        />
      )}
    </>
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
      canvas.width = Math.max(1, Math.floor(parent.clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(parent.clientHeight * dpr));
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

      if (!reduced && isActive) tick += 0.022;

      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const r = Math.min(w, h) * 0.34;

      const grad = ctx.createRadialGradient(
        cx + Math.cos(tick * 0.4) * r * 0.16,
        cy + Math.sin(tick * 0.4) * r * 0.14,
        r * 0.14,
        cx,
        cy,
        r * 1.48
      );
      if (variant === "data" || variant === "acquire") {
        grad.addColorStop(0, "rgba(42, 114, 163, 0.28)");
        grad.addColorStop(0.55, "rgba(198, 216, 230, 0.48)");
        grad.addColorStop(1, "rgba(249, 114, 121, 0.14)");
      } else if (variant === "device" || variant === "control") {
        grad.addColorStop(0, "rgba(249, 114, 121, 0.30)");
        grad.addColorStop(0.55, "rgba(42, 114, 163, 0.22)");
        grad.addColorStop(1, "rgba(198, 216, 230, 0.3)");
      } else {
        grad.addColorStop(0, "rgba(42, 114, 163, 0.32)");
        grad.addColorStop(0.5, "rgba(249, 114, 121, 0.24)");
        grad.addColorStop(1, "rgba(198, 216, 230, 0.36)");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(13, 21, 32, 0.08)";
      ctx.lineWidth = 1;
      const step = 42;
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

      if (variant === "data" || variant === "acquire") {
        for (let line = 0; line < 4; line++) {
          ctx.beginPath();
          const baseY = cy + (line - 1.5) * 42;
          for (let px = w * 0.1; px <= w * 0.9; px += 4) {
            const normX = (px - w * 0.1) / (w * 0.8);
            const damp =
              variant === "acquire"
                ? 1 - normX * 0.7
                : Math.sin(normX * Math.PI);
            const amp = (28 - line * 4) * damp;
            const py =
              baseY +
              Math.sin(normX * 11 - tick * (1.8 + line * 0.25) + line) * amp;
            if (px <= w * 0.1 + 1) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle =
            line % 2 === 0
              ? "rgba(42, 114, 163, 0.95)"
              : "rgba(249, 114, 121, 0.92)";
          ctx.lineWidth = line === 0 ? 3.2 : 1.9;
          ctx.stroke();
        }
        for (let k = 0; k < 5; k++) {
          const prog = (tick * 0.28 + k * 0.2) % 1;
          const dx = w * 0.1 + prog * (w * 0.8);
          const dy =
            cy + Math.sin(prog * 11 - tick * 1.8) * 28 * Math.sin(prog * Math.PI);
          ctx.beginPath();
          ctx.arc(dx, dy, 6, 0, Math.PI * 2);
          ctx.fillStyle = "#f97279";
          ctx.fill();
        }
      } else if (variant === "device" || variant === "control") {
        [1.04, 0.76, 0.48].forEach((scale, idx) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((idx === 1 ? -1 : 1) * tick * (0.45 + idx * 0.2));
          ctx.scale(1, 0.58 + idx * 0.12);
          ctx.beginPath();
          ctx.arc(0, 0, r * scale, 0, Math.PI * 2);
          ctx.strokeStyle =
            idx === 0
              ? "#2a72a3"
              : idx === 1
              ? "#f97279"
              : "rgba(13, 21, 32, 0.78)";
          ctx.lineWidth = idx === 2 ? 2.2 : 3.2;
          if (idx === 1) ctx.setLineDash([12, 8]);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        });
        const boxS = r * 0.36;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tick * 0.35);
        ctx.strokeStyle = "#0d1520";
        ctx.lineWidth = 2.4;
        ctx.strokeRect(-boxS / 2, -boxS / 2, boxS, boxS);
        ctx.fillStyle = "rgba(249, 114, 121, 0.32)";
        ctx.fillRect(-boxS / 2, -boxS / 2, boxS, boxS);
        ctx.restore();
      } else {
        const pts: [number, number][] = [];
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI * 2) / 6 + tick * 0.25;
          const dist = r * (0.76 + Math.sin(tick + i) * 0.09);
          pts.push([cx + Math.cos(a) * dist, cy + Math.sin(a) * dist]);
        }
        ctx.strokeStyle = "rgba(42, 114, 163, 0.5)";
        ctx.lineWidth = 1.8;
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
          ctx.arc(px, py, i % 2 === 0 ? 8 : 6.5, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? "#f97279" : "#2a72a3";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.2;
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

  return <canvas ref={canvasRef} className="vt-step-canvas" aria-hidden="true" />;
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

      if (
        rect.top <= window.innerHeight * 0.48 &&
        rect.bottom >= window.innerHeight * 0.3
      ) {
        onEnterSection(data.navId, data.accentHex);
      }
    };

    const tick = () => {
      const diff = targetPRef.current - smoothPRef.current;
      if (Math.abs(diff) > 0.0005) {
        smoothPRef.current += diff * 0.11;
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
                    <StepVisualMediaLayer
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
                <span className="vt-step-progress-rail" aria-hidden="true">
                  <span
                    className="vt-step-progress-fill"
                    style={{
                      backgroundColor: data.accentHex,
                      transform: `scaleX(${subP.toFixed(3)})`,
                    }}
                  />
                </span>
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
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
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
      el.style.transform = `translate3d(${(current.x - 6).toFixed(1)}px, ${(
        current.y - 6
      ).toFixed(1)}px, 0) scale(${expanded ? 1.65 : 1})`;
      el.style.opacity = visible && !draggingOrScrollbar ? "1" : "0";
      el.classList.toggle("is-expanded", expanded);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        visible = false;
        syncDom();
        return;
      }
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
        tgtEl?.closest(
          "a, button, [role='button'], .vt-sector-card, .vt-mode-btn, .vt-tower-pill"
        )
      );
    };

    const onPointerDown = (e: PointerEvent) => {
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

/* Hover-Expanding Apple Frosted Glass Section Switcher (compacts to active item at rest on desktop, expands on hover) */
function ExpandableSectionNav({
  chapters,
  activeNav,
  onSelect,
}: {
  chapters: { id: SectionNavId; num: string; label: string }[];
  activeNav: SectionNavId;
  onSelect: (id: SectionNavId) => void;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLSpanElement | null>(null);

  const activeIdx = Math.max(
    0,
    chapters.findIndex((c) => c.id === activeNav)
  );
  const sliderIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

  const updateSlider = useCallback(() => {
    const btn = btnRefs.current[sliderIdx];
    const slider = sliderRef.current;
    if (!btn || !slider) return;
    if (!expanded) {
      slider.style.width = `${btn.offsetWidth}px`;
      slider.style.transform = "translateX(0px)";
    } else {
      slider.style.width = `${btn.offsetWidth}px`;
      slider.style.transform = `translateX(${btn.offsetLeft}px)`;
    }
  }, [expanded, sliderIdx]);

  useEffect(() => {
    updateSlider();
    const t = window.setTimeout(updateSlider, 80);
    window.addEventListener("resize", updateSlider);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", updateSlider);
    };
  }, [updateSlider, chapters]);

  return (
    <div
      className={`vt-glass-pill vt-nav-left vt-expand-nav ${
        expanded ? "is-expanded" : "is-compact"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        setExpanded(false);
        setHoveredIdx(null);
      }}
      onFocus={() => setExpanded(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setExpanded(false);
          setHoveredIdx(null);
        }
      }}
      role="group"
      aria-label="Dynamic section switcher"
    >
      <div className="vt-expand-inner" ref={listRef}>
        <span ref={sliderRef} className="vt-expand-slider" aria-hidden="true" />
        {chapters.map((item, i) => {
          const isAct = activeNav === item.id;
          return (
            <button
              key={item.id}
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              type="button"
              className={`vt-glass-btn vt-expand-btn ${
                isAct ? "is-active" : ""
              }`}
              onMouseEnter={() => setHoveredIdx(i)}
              onClick={() => onSelect(item.id)}
            >
              <span className="vt-nav-dot" aria-hidden="true" />
              <span className="vt-nav-num">{item.num}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function VectraTwinShowcase() {
  const { lang, setLang } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const c = COPY_VT[lang];

  const [activeNav, setActiveNav] = useState<SectionNavId>("what");
  const [cursorAccent, setCursorAccent] = useState<string>("#f97279");
  const [navVisible, setNavVisible] = useState(true);
  const [footerClear, setFooterClear] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);
  const [inspectionMode, setInspectionMode] = useState<InspectionMode>("mesh");
  const [whatP, setWhatP] = useState(reduced ? 1 : 0);

  const heroPtrRef = useRef<{ nx: number; ny: number }>({ nx: 0, ny: 0 });
  const whatRef = useRef<HTMLElement | null>(null);
  const whereRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  const handleEnterSection = useCallback(
    (navId: SectionNavId, accentHex: string) => {
      setActiveNav(navId);
      setCursorAccent(accentHex);
    },
    []
  );

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

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const vh = window.innerHeight || 800;

      if (whatRef.current && !reduced) {
        const wRect = whatRef.current.getBoundingClientRect();
        const prog = clamp((vh * 0.78 - wRect.top) / (vh * 0.45), 0, 1);
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

      if (footerRef.current) {
        const fRect = footerRef.current.getBoundingClientRect();
        setFooterClear(fRect.top <= vh * 0.72);
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

  const scrollToEl = (elId: string) => {
    setRecapOpen(false);
    const el = document.getElementById(elId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
        ? "vt-how-tower"
        : id === "why"
        ? "vt-why-tower"
        : "vt-where";
    scrollToEl(targetId);
  };

  const activeInspection =
    c.whereSection.modes.find((m) => m.id === inspectionMode) ||
    c.whereSection.modes[0];

  return (
    <div className="vt-page" id="top">
      <SoftDotCursor accentColor={cursorAccent} reduced={reduced} />

      {/* Clean Studio Return Bar */}
      <header className="vt-topbar">
        <Link
          href="https://the-juanimal-studio-git-v3-signature-director-juanimal-design.vercel.app"
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

      {/* MONUMENTAL TALL VERTICAL POSTER HERO (Wembi 1870/2380 Proportions) */}
      <section
        className="vt-hero-frame"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          heroPtrRef.current = {
            nx: ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2,
            ny: ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2,
          };
        }}
        onMouseLeave={() => {
          heroPtrRef.current = { nx: 0, ny: 0 };
        }}
      >
        <SculpturalRingsCanvas
          theme="glacial-coral"
          reduced={reduced}
          pointerOffsetRef={heroPtrRef}
        />
        {HERO_VIDEO_SRC && !reduced ? (
          <video
            className="vt-hero-video"
            autoPlay
            loop
            muted
            playsInline
            poster="/media/vectra/hero-rings-poster.jpg"
            aria-hidden="true"
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/media/vectra/hero-rings-poster.jpg"
            alt=""
            className="vt-hero-video"
            aria-hidden="true"
          />
        )}
        <div className="vt-hero-glass-scrim" aria-hidden="true" />

        {/* TOP EDGE-TO-EDGE GIANT GEOMETRIC SWISS WORDMARK */}
        <div className="vt-hero-top-wordmark">
          <svg
            className="vt-hero-wordmark"
            viewBox="0 0 1724 270"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="VECTRA"
          >
            <path
              d="M 28 30 L 146 240 L 264 30 M 556 30 H 362 V 240 H 556 M 362 135 H 524 M 852 54 C 818 28 730 22 686 68 C 650 106 650 164 686 202 C 730 248 818 242 852 216 M 920 30 H 1164 M 1042 30 V 240 M 1244 240 V 30 H 1364 C 1424 30 1446 62 1446 92 C 1446 122 1424 148 1364 148 H 1244 M 1344 148 L 1448 240 M 1500 240 L 1600 30 L 1700 240 M 1536 168 H 1664"
              stroke="currentColor"
              strokeWidth="36"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* BOTTOM MONUMENTAL STATEMENT + GOOEY TWIN-DOT BULLET */}
        <div className="vt-hero-bottom-block">
          <div className="vt-hero-minititle">
            <span>{c.heroCode}</span>
          </div>

          <h1 className="vt-hero-statement">
            <svg className="vt-goo-filter-svg" aria-hidden="true">
              <defs>
                <filter id="vtGooBullet">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="7"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                    result="goo"
                  />
                  <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
              </defs>
            </svg>
            <span className="vt-goo-bullet" aria-hidden="true">
              <span />
              <span />
            </span>
            <span>
              {lang === "es"
                ? "Vectra mejora al instante el rendimiento de cualquier máquina, clúster GPU o sistema digital creando su réplica virtual viva en tiempo real."
                : c.heroLede}
            </span>
          </h1>

          <div className="vt-hero-cue-row">
            <button
              type="button"
              className="vt-btn-dark"
              onClick={() => scrollToTarget("what")}
            >
              {c.heroPrimary}
            </button>
            <span className="vt-hero-note">{c.heroNote}</span>
          </div>
        </div>
      </section>

      {/* STOP 1: n.001 WHAT FULL-SCREEN COGNITIVE STATEMENT */}
      <section ref={whatRef} id="vt-what" className="vt-what-stage">
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

      {/* STOP 2: n.002 HOW INTERACTIVE PILL TOWER (Ref 1 + Directional Velocity Push Physics) */}
      <InteractivePillTower
        eyebrow={c.howTower.eyebrow}
        hint={c.howTower.hint}
        sectionId={c.howTower.id}
        ringTheme={c.howTower.ringTheme}
        pills={c.howTower.pills}
        reduced={reduced}
        onJumpId={scrollToEl}
        onEnterSection={handleEnterSection}
        navId="how"
        navAccent="#f97279"
      />

      {/* STOPS 3 & 4: PINNED 3-STEP STEPPERS (01 Digital Twin & 02 Functioning) */}
      {c.steppers.map((stepper) => (
        <PinnedStepperSection
          key={stepper.id}
          data={stepper}
          reduced={reduced}
          onEnterSection={handleEnterSection}
        />
      ))}

      {/* STOP 5: n.003 WHY INTERACTIVE PILL TOWER */}
      <InteractivePillTower
        eyebrow={c.whyTower.eyebrow}
        hint={c.whyTower.hint}
        sectionId={c.whyTower.id}
        ringTheme={c.whyTower.ringTheme}
        pills={c.whyTower.pills}
        reduced={reduced}
        onJumpId={scrollToEl}
        onEnterSection={handleEnterSection}
        navId="why"
        navAccent="#2a72a3"
      />

      {/* STOP 6: n.004 WHERE + CUSTOM CORE INSPECTOR */}
      <section ref={whereRef} id="vt-where" className="vt-where-frame">
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

      {/* CLEAN SWISS EDITORIAL FOOTER (Commission + Studio Return, Auto-Clears Bottom Nav) */}
      <footer ref={footerRef} id="vt-footer" className="vt-footer">
        <div className="vt-footer-top">
          <div>
            <span className="vt-chapter-chip">{c.studioPitch.eyebrow}</span>
            <h2 className="vt-footer-h2">{c.studioPitch.title}</h2>
          </div>

          <div className="vt-footer-pitch">
            <p>{c.studioPitch.desc}</p>
            <div className="vt-hero-cta-row">
              <Link href="/contact" className="vt-btn-dark">
                {c.studioPitch.cta}
              </Link>
              <Link
                href="https://the-juanimal-studio-git-v3-signature-director-juanimal-design.vercel.app/#work"
                className="vt-btn-outline"
              >
                {c.studioPitch.secondary}
              </Link>
            </div>
          </div>
        </div>

        <div className="vt-footer-grid">
          <div className="vt-footer-col">
            <small>{lang === "es" ? "Capítulos" : "Chapters"}</small>
            <button
              type="button"
              className="vt-footer-lang-btn"
              onClick={() => scrollToTarget("what")}
            >
              01 · WHAT
            </button>
            <button
              type="button"
              className="vt-footer-lang-btn"
              onClick={() => scrollToTarget("how")}
            >
              02 · HOW
            </button>
            <button
              type="button"
              className="vt-footer-lang-btn"
              onClick={() => scrollToTarget("why")}
            >
              03 · WHY
            </button>
            <button
              type="button"
              className="vt-footer-lang-btn"
              onClick={() => scrollToTarget("where")}
            >
              04 · WHERE
            </button>
          </div>

          <div className="vt-footer-col">
            <small>The Juanimal Studio</small>
            <Link href="https://the-juanimal-studio-git-v3-signature-director-juanimal-design.vercel.app">
              {lang === "es" ? "Portada del Estudio" : "Studio Home"}
            </Link>
            <Link href="https://the-juanimal-studio-git-v3-signature-director-juanimal-design.vercel.app/#work">
              {lang === "es" ? "8 Trabajos Reales" : "All 8 Shipped Works"}
            </Link>
            <Link href="/work/frame-by-agents">Launch Kit #001</Link>
            <Link href="/about">{lang === "es" ? "Sobre Mí" : "About"}</Link>
          </div>

          <div className="vt-footer-col">
            <small>{lang === "es" ? "Contacto Directo" : "Direct Contact"}</small>
            <a href="mailto:hello@juanimal.studio">hello@juanimal.studio</a>
            <Link href="/contact">
              {lang === "es" ? "Cotizar Proyecto" : "Start a Project"}
            </Link>
            <button
              type="button"
              className="vt-footer-lang-btn"
              onClick={() => setLang(lang === "en" ? "es" : "en")}
            >
              {lang === "es" ? "Switch to English (EN)" : "Cambiar a Español (ES)"}
            </button>
          </div>
        </div>

        <div className="vt-footer-bottom">
          <span>
            PORTFOLIO SHOWCASE #01 // VECTRA TWIN BY THE JUANIMAL STUDIO
          </span>
          <span>
            SWISS NEO-GROTESQUE · #C6D8E6 · #F97279 · #2A72A3
          </span>
        </div>
      </footer>

      {/* APPLE FROSTED GLASS SPLIT BOTTOM NAVIGATION (Hides smoothly while scrolling + clears Footer) */}
      <nav
        className={`vt-site-nav ${
          footerClear ? "is-footer-clear" : navVisible ? "is-visible" : "is-hidden"
        }`}
        aria-label="Vectra Twin primary section navigation"
      >
        <ExpandableSectionNav
          chapters={c.navChapters}
          activeNav={activeNav}
          onSelect={scrollToTarget}
        />

        <div className="vt-glass-pill vt-nav-right" role="group">
          <button
            type="button"
            className="vt-glass-btn"
            onClick={() => scrollToTarget("top")}
          >
            <span className="vt-roll-wrap">
              <span className="vt-roll-text" data-label={c.overview}>
                {c.overview}
              </span>
            </span>
          </button>
          <button
            type="button"
            className="vt-glass-btn is-recap"
            onClick={() => setRecapOpen(true)}
            aria-expanded={recapOpen}
          >
            <span className="vt-nav-dot" aria-hidden="true" />
            <span className="vt-roll-wrap">
              <span className="vt-roll-text" data-label={c.recapBtn}>
                {c.recapBtn}
              </span>
            </span>
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
            <span className="vt-roll-wrap">
              <span className="vt-roll-text" data-label={c.contactBtn}>
                {c.contactBtn}
              </span>
            </span>
          </Link>
        </div>
      </nav>

      {/* WEMBI FANNING 5-CARD RECAP DECK (#menu) */}
      {recapOpen && (
        <div
          className="vt-deck-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={c.recap.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setRecapOpen(false);
          }}
        >
          <div className="vt-deck-top">
            <span className="vt-chapter-chip">{c.recap.eyebrow}</span>
            <button
              type="button"
              className="vt-deck-close"
              onClick={() => setRecapOpen(false)}
            >
              {c.recap.close}
            </button>
          </div>

          <div className="vt-deck-inner">
            <button
              type="button"
              className="vt-deck-card"
              onClick={() => scrollToTarget("what")}
            >
              <div className="vt-deck-card-top">
                <span>n.001 // WHAT</span>
                <strong>{c.recap.matrix[0].metric}</strong>
              </div>
              <h3 className="vt-deck-card-title">{c.recap.matrix[0].title}</h3>
              <ul className="vt-deck-card-list">
                <li>{lang === "es" ? "Réplica Espacial" : "Spatial Replica"}</li>
                <li>{lang === "es" ? "Gemelo en Vivo" : "Live Twin"}</li>
                <li>{lang === "es" ? "Estado 99.98%" : "99.98% Sync"}</li>
              </ul>
              <div className="vt-deck-card-foot">
                <span>WHAT</span>
                <span>{c.recap.jump}</span>
              </div>
            </button>

            <button
              type="button"
              className="vt-deck-card"
              onClick={() => scrollToTarget("how")}
            >
              <div className="vt-deck-card-top">
                <span>n.002 // HOW</span>
                <strong>{c.recap.matrix[1].metric}</strong>
              </div>
              <h3 className="vt-deck-card-title">{c.recap.matrix[1].title}</h3>
              <ul className="vt-deck-card-list">
                <li>Data</li>
                <li>Device</li>
                <li>Application</li>
              </ul>
              <div className="vt-deck-card-foot">
                <span>HOW</span>
                <span>{c.recap.jump}</span>
              </div>
            </button>

            <button
              type="button"
              className="vt-deck-card"
              onClick={() => scrollToTarget("why")}
            >
              <div className="vt-deck-card-top">
                <span>n.003 // WHY</span>
                <strong>{c.recap.matrix[2].metric}</strong>
              </div>
              <h3 className="vt-deck-card-title">{c.recap.matrix[2].title}</h3>
              <ul className="vt-deck-card-list">
                <li>{lang === "es" ? "Efectivo" : "Effective"}</li>
                <li>{lang === "es" ? "Sostenible" : "Sustainable"}</li>
                <li>{lang === "es" ? "Autónomo" : "Autonomous"}</li>
              </ul>
              <div className="vt-deck-card-foot">
                <span>WHY</span>
                <span>{c.recap.jump}</span>
              </div>
            </button>

            <button
              type="button"
              className="vt-deck-card"
              onClick={() => scrollToTarget("where")}
            >
              <div className="vt-deck-card-top">
                <span>n.004 // WHERE</span>
                <strong>{c.recap.matrix[3].metric}</strong>
              </div>
              <h3 className="vt-deck-card-title">{c.recap.matrix[3].title}</h3>
              <ul className="vt-deck-card-list">
                <li>Industrial</li>
                <li>GPU &amp; AI Labs</li>
                <li>{lang === "es" ? "Energía & Aero" : "Energy & Aero"}</li>
              </ul>
              <div className="vt-deck-card-foot">
                <span>WHERE</span>
                <span>{c.recap.jump}</span>
              </div>
            </button>

            <button
              type="button"
              className="vt-deck-card"
              onClick={() => scrollToEl("vt-footer")}
            >
              <div className="vt-deck-card-top">
                <span>n.005 // CONTACT</span>
                <strong>JUANIMAL</strong>
              </div>
              <h3 className="vt-deck-card-title">
                {lang === "es" ? "Encargar Web" : "Commission Web"}
              </h3>
              <ul className="vt-deck-card-list">
                <li>{lang === "es" ? "Motion a Medida" : "Custom Motion"}</li>
                <li>Next.js + Canvas</li>
                <li>hello@juanimal.studio</li>
              </ul>
              <div className="vt-deck-card-foot">
                <span>FOOTER</span>
                <span>{c.recap.jump}</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
