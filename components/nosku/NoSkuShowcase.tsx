"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { HeroTapeCanvas, StickyNoteWebGL } from "@/components/nosku/NoSkuHero3D";
import {
  FooterCopy,
  NoSkuPhysicsFooter,
} from "@/components/nosku/NoSkuPhysicsFooter";

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function smoothStep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function distPt(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

interface SlideSpec {
  id: string;
  code: string;
  kicker: string;
  word: string;
  bg: string;
  ink: string;
  tagBg: string;
  tagInk: string;
  subhead: string;
  tags: Array<{ label: string; rot: number }>;
  description: string;
  image: string;
  imageAlt: string;
}

interface LocalizedCopy {
  preSub: string;
  menuTabOpen: string;
  menuTabClose: string;
  menuTopMeta: string;
  menuFootLeft: string;
  menuFootRight: string;
  menuItems: Array<{
    label: string;
    href: string;
    thumb: string;
    scrollTarget?: string;
  }>;
  heroBadge: string;
  heroStampIdle: string;
  heroStampPressed: string;
  heroLines: [string, string];
  stickyNoteLines: string[];
  handNoteLeft: string;
  crateCaptionLeft: string;
  crateCaptionRightPending: string;
  crateCaptionRightSealed: string;
  ledgerTitle: string;
  ledgerRows: Array<[string, string]>;
  waveHead: string;
  waveTail: string;
  waveBadges: [string, string, string];
  rollButton: string;
  slides: SlideSpec[];
  giantKicker: string;
  giantSubhead: string;
  giantRows: [
    { index: string; word: string; copy: string; prop: string },
    { index: string; word: string; copy: string; prop: string },
    { index: string; word: string; copy: string; prop: string }
  ];
  stickEyebrow: string;
  stickTitle: string;
  stickBody: string;
  stickShotCapLeft: string;
  stickShotCapRight: string;
  claimCta: string;
  inspectVectraCta: string;
  modalTag: string;
  modalTitle: string;
  modalBody: string;
  modalManifest: string[];
  modalGoContact: string;
  modalClose: string;
  footer: FooterCopy;
}

const COPY_NS: Record<"en" | "es", LocalizedCopy> = {
  en: {
    preSub: "UNPACKING PROTOTYPE #000 • CLICK ANYWHERE TO SKIP",
    menuTabOpen: "PULL ME",
    menuTabClose: "CLOSE TAPE",
    menuTopMeta: "NO SKU™ — CASE #02 BY JUANIMAL STUDIO",
    menuFootLeft: "00% PRODUCT • 100% PROOF OF CRAFT",
    menuFootRight: "WE DON'T CHASE IT — THE PRODUCT FINDS US.",
    menuItems: [
      {
        label: "EMPTY CRATE",
        href: "#ns-hero",
        scrollTarget: "ns-hero",
        thumb: "/images/nosku/crate-empty.png",
      },
      {
        label: "06 POWERS",
        href: "#ns-orbital",
        scrollTarget: "ns-orbital",
        thumb: "/images/nosku/specimen-motion.png",
      },
      {
        label: "2D CAMERA",
        href: "#ns-giant",
        scrollTarget: "ns-giant",
        thumb: "/images/nosku/specimen-tactile.png",
      },
      {
        label: "MANIFESTO",
        href: "#ns-stick",
        scrollTarget: "ns-stick",
        thumb: "/images/nosku/studio-collage.png",
      },
      {
        label: "VECTRA #01",
        href: "/work/vectra-twin",
        thumb: "/images/v3/vectra-twin-core.png",
      },
      {
        label: "JUANIMAL",
        href: "/",
        thumb: "/images/nosku/crate-empty.png",
      },
    ],
    heroBadge: "PROTOTYPE #000 • NO PRODUCT INSIDE",
    heroStampIdle: "PEELING CORNER • PRESS",
    heroStampPressed: "STUCK FLAT • NICE",
    heroLines: ["THERE IS NO PRODUCT YET.", "WATCH WHAT WE CAN DO."],
    stickyNoteLines: [
      "note to self:",
      "still no SKU.",
      "just watch what",
      "this site does.",
    ],
    handNoteLeft:
      "we built an entire launch flagship for an empty cardboard box.",
    crateCaptionLeft: "BOX #000 // ARCHIVAL KRAFT",
    crateCaptionRightPending: "SCROLL DOWN TO FOLD & SEAL CRATE ↓",
    crateCaptionRightSealed: "SEALED BY SCROLL • SCROLL UP TO REOPEN ↑",
    ledgerTitle: "MANIFEST // SKU #000",
    ledgerRows: [
      ["Physical Units", "000 in stock"],
      ["Warehouse", "None / Localhost"],
      ["Render Engine", "Three.js + 60fps DOM"],
      ["Interaction", "Free Orbit + 2D Physics"],
      ["Mission", "Let the product find us"],
    ],
    waveHead: "THERE IS NO PRODUCT YET",
    waveTail: "ONLY PURE SHOWOFF ENGINEERING",
    waveBadges: ["SKU #000", "NO CHASE", "IT FINDS US"],
    rollButton: "ROLL IT!",
    slides: [
      {
        id: "motion",
        code: "POWER 01 / 06",
        kicker: "THE",
        word: "MOTION",
        bg: "#FF4D29",
        ink: "#18110E",
        tagBg: "#18110E",
        tagInk: "#F4EFE6",
        subhead:
          "Scroll becomes physical torque. Nothing static gets out alive.",
        tags: [
          { label: "WEBGL RIBBONS", rot: -4 },
          { label: "ELASTIC POKE", rot: 3 },
          { label: "ZERO JANK", rot: -2 },
        ],
        description:
          "Real-time vertex deformation, synchronized frontal roll-unspooling and spring recovery tuned by hand — before a product even exists.",
        image: "/images/nosku/specimen-motion.png",
        imageAlt: "Coiled glossy vermilion tape strips on archival bone paper",
      },
      {
        id: "tactile",
        code: "POWER 02 / 06",
        kicker: "THE",
        word: "TACTILE",
        bg: "#1F4BFF",
        ink: "#F4EFE6",
        tagBg: "#D4FF2B",
        tagInk: "#18110E",
        subhead:
          "Pixels that feel like you can peel them off the glass with a thumbnail.",
        tags: [
          { label: "3D PAPER CURL", rot: 4 },
          { label: "ARC MASKS", rot: -3 },
          { label: "GRAB & THROW", rot: 2 },
        ],
        description:
          "Sticky notes bend away from your cursor, SVG curve masks sweep across the viewport, and footer hollow rolls bounce with real mass.",
        image: "/images/nosku/specimen-tactile.png",
        imageAlt:
          "Electric cobalt industrial tape strips peeling off kraft grid paper",
      },
      {
        id: "kinetic",
        code: "POWER 03 / 06",
        kicker: "THE",
        word: "KINETIC",
        bg: "#D4FF2B",
        ink: "#18110E",
        tagBg: "#18110E",
        tagInk: "#D4FF2B",
        subhead:
          "Spring solvers, gravity collisions and damped inertia built straight into DOM & GL.",
        tags: [
          { label: "ARC-LENGTH 1:1", rot: -3 },
          { label: "ELASTIC COLLISIONS", rot: 4 },
          { label: "DAMPED INERTIA", rot: -2 },
        ],
        description:
          "No canned video loops masquerading as interactivity: scroll couples 1:1 to cylinder rotation, flaps fold cleanly shut, and rolls throw on release.",
        image: "/images/nosku/specimen-kinetic.png",
        imageAlt:
          "Acid chartreuse adhesive tape slings suspending a brushed steel sphere in tension",
      },
      {
        id: "loud",
        code: "POWER 04 / 06",
        kicker: "THE",
        word: "LOUD",
        bg: "#FF2E88",
        ink: "#F4EFE6",
        tagBg: "#18110E",
        tagInk: "#FF2E88",
        subhead:
          "Condensed display voices engineered to command the entire room.",
        tags: [
          { label: "PARABOLIC WARP", rot: 3 },
          { label: "DIP & SPRING", rot: -4 },
          { label: "SWISS GRID", rot: 2 },
        ],
        description:
          "Oversized type that reacts letter-by-letter to pointer distance — dipping down cleanly on slide changes and rebounding back.",
        image: "/images/nosku/specimen-loud.png",
        imageAlt:
          "Radial sunburst of serrated hot-magenta gaffer tape layered on corrugated kraft square",
      },
      {
        id: "weird",
        code: "POWER 05 / 06",
        kicker: "THE",
        word: "WEIRD",
        bg: "#FFB800",
        ink: "#18110E",
        tagBg: "#18110E",
        tagInk: "#FFB800",
        subhead:
          "Why behave like a polite SaaS template when you can warp the camera diagonally?",
        tags: [
          { label: "BEZIER PATHS", rot: -4 },
          { label: "DIAGONAL PAN", rot: 5 },
          { label: "ANTI-TEMPLATE", rot: -2 },
        ],
        description:
          "Vertical scroll detours horizontally and cuts diagonally along an arc-length-parameterized canvas right after this deck.",
        image: "/images/nosku/specimen-weird.png",
        imageAlt:
          "Golden amber translucent tape twisted into a floating Mobius sculpture above grid paper",
      },
      {
        id: "next",
        code: "POWER 06 / 06",
        kicker: "THE",
        word: "NEXT",
        bg: "#14161A",
        ink: "#F4EFE6",
        tagBg: "#FF4D29",
        tagInk: "#18110E",
        subhead: "Seat reserved. Crate empty. Waiting for the right founder.",
        tags: [
          { label: "YOUR SKU HERE", rot: -3 },
          { label: "OPEN SLOT", rot: 3 },
          { label: "BUILT TO CONVERT", rot: -2 },
        ],
        description:
          "The product does not exist yet — and that is the whole flex. Imagine what happens the day we put your real product in this box.",
        image: "/images/nosku/crate-empty.png",
        imageAlt: "Empty open kraft box stamped NO SKU // 000 waiting for a product",
      },
    ],
    giantKicker: "WHY BUILD ALL OF THIS FOR ZERO INVENTORY?",
    giantSubhead:
      "BECAUSE A GREAT STUDIO DOESN'T WAIT FOR PERMISSION TO FLEX.",
    giantRows: [
      {
        index: "01",
        word: "TO PROVE",
        copy: "that craft comes before the brief. Anyone can put pretty screenshots on an existing product; making an empty box unforgettable takes obsession.",
        prop: "zero SKUs harmed",
      },
      {
        index: "02",
        word: "TO FLEX",
        copy: "Three.js vertex ribbons, 2D physics collisions, arc-length camera splines, SVG arc-cuts and 60fps typographic springs inside one unified codebase.",
        prop: "try poking the letters ↑",
      },
      {
        index: "03",
        word: "TO ATTRACT",
        copy: "We don't chase the product — the right product sees this, smirks, and finds its way straight into the crate.",
        prop: "next launch: yours?",
      },
    ],
    stickEyebrow: "FINAL SEAL // STUDIO MANIFESTO",
    stickTitle: "LET'S MAKE NOTHING STICK!",
    stickBody:
      "No factory floor. No fulfillment warehouse. Just an absurdly over-engineered web flagship waiting for the founder brave enough to ship with The Juanimal Studio.",
    stickShotCapLeft: "JUANIMAL LAB • PROTOTYPE #000",
    stickShotCapRight: "CALIPERS + BONE SWATCHES",
    claimCta: "CLAIM BOX #000 →",
    inspectVectraCta: "SEE CASE #01 (VECTRA) →",
    modalTag: "SHIPPING LABEL // SKU #000 RESERVED",
    modalTitle: "YOU JUST CLAIMED AN EMPTY BOX.",
    modalBody:
      "Right now Box #000 contains 0g of physical merchandise and 100% of our motion, 3D and physics craft. Want us to fill it with your actual product launch?",
    modalManifest: [
      "ITEM:        NONE YET (PURE PROOF)",
      "SKU ID:      NO-SKU-000",
      "WEIGHT:      0.00 KG (100% CODE CRAFT)",
      "STACK:       THREE.JS + SPRING PHYSICS + NEXT.JS",
      "NEXT STEP:   PUT YOUR PRODUCT INSIDE",
    ],
    modalGoContact: "FILL THIS BOX WITH JUANIMAL →",
    modalClose: "KEEP PLAYING",
    footer: {
      headline: "THE PRODUCT FINDS US.",
      subline:
        "Go ahead — grab any hollow tape roll and throw it across the tray.",
      dropAgain: "DROP AGAIN",
      replayPeel: "REPLAY PEEL",
      claimBox: "CLAIM BOX #000",
      links: [
        { label: "← JUANIMAL STUDIO", href: "/" },
        { label: "VECTRA TWIN #01", href: "/work/vectra-twin" },
      ],
      copyright: "© 2026 NO SKU™ — BUILT BY THE JUANIMAL STUDIO",
    },
  },
  es: {
    preSub: "DESEMPACANDO PROTOTIPO #000 • CLICK PARA SALTAR",
    menuTabOpen: "JÁLAME",
    menuTabClose: "CERRAR CINTA",
    menuTopMeta: "NO SKU™ — CASO #02 DE THE JUANIMAL STUDIO",
    menuFootLeft: "00% PRODUCTO • 100% PRUEBA DE OFICIO",
    menuFootRight: "NO LO PERSEGUIMOS — EL PRODUCTO NOS ENCUENTRA.",
    menuItems: [
      {
        label: "CAJA VACÍA",
        href: "#ns-hero",
        scrollTarget: "ns-hero",
        thumb: "/images/nosku/crate-empty.png",
      },
      {
        label: "06 PODERES",
        href: "#ns-orbital",
        scrollTarget: "ns-orbital",
        thumb: "/images/nosku/specimen-motion.png",
      },
      {
        label: "CÁMARA 2D",
        href: "#ns-giant",
        scrollTarget: "ns-giant",
        thumb: "/images/nosku/specimen-tactile.png",
      },
      {
        label: "MANIFIESTO",
        href: "#ns-stick",
        scrollTarget: "ns-stick",
        thumb: "/images/nosku/studio-collage.png",
      },
      {
        label: "VECTRA #01",
        href: "/work/vectra-twin",
        thumb: "/images/v3/vectra-twin-core.png",
      },
      {
        label: "JUANIMAL",
        href: "/",
        thumb: "/images/nosku/crate-empty.png",
      },
    ],
    heroBadge: "PROTOTIPO #000 • CERO PRODUCTO ADENTRO",
    heroStampIdle: "ESQUINA DESPEGADA • TOCA",
    heroStampPressed: "BIEN PEGADA • LISTO",
    heroLines: ["AÚN NO HAY PRODUCTO.", "MIRA LO QUE HACEMOS."],
    stickyNoteLines: [
      "nota mental:",
      "cero producto aún.",
      "solo mira lo que",
      "hace esta web.",
    ],
    handNoteLeft:
      "construimos una web insignia entera para una caja de cartón vacía.",
    crateCaptionLeft: "CAJA #000 // KRAFT DE ARCHIVO",
    crateCaptionRightPending: "BAJA PARA PLEGAR Y SELLAR ↓",
    crateCaptionRightSealed: "SELLADA AL SCROLL • SUBE PARA ABRIR ↑",
    ledgerTitle: "MANIFIESTO // SKU #000",
    ledgerRows: [
      ["Unidades Físicas", "000 en bodega"],
      ["Bodega", "Ninguna / Localhost"],
      ["Motor 3D", "Three.js + DOM 60fps"],
      ["Interacción", "Órbita Libre + Física 2D"],
      ["Regla", "El producto nos encuentra"],
    ],
    waveHead: "AÚN NO EXISTE NINGÚN PRODUCTO",
    waveTail: "SOLO PURO SHOWOFF EN CÓDIGO",
    waveBadges: ["SKU #000", "NO CHASE", "NOS ENCUENTRA"],
    rollButton: "¡GÍRALO!",
    slides: [
      {
        id: "motion",
        code: "PODER 01 / 06",
        kicker: "EL",
        word: "MOTION",
        bg: "#FF4D29",
        ink: "#18110E",
        tagBg: "#18110E",
        tagInk: "#F4EFE6",
        subhead: "El scroll se vuelve torque físico. Nada estático sobrevive.",
        tags: [
          { label: "CINTAS WEBGL", rot: -4 },
          { label: "POKE ELÁSTICO", rot: 3 },
          { label: "CERO JANK", rot: -2 },
        ],
        description:
          "Deformación de vértices en tiempo real, giro frontal 1:1 al desenrollar y resortes calibrados a mano incluso sin un producto real.",
        image: "/images/nosku/specimen-motion.png",
        imageAlt: "Cintas vermilion brillantes enrolladas sobre papel archivo",
      },
      {
        id: "tactile",
        code: "PODER 02 / 06",
        kicker: "LO",
        word: "TÁCTIL",
        bg: "#1F4BFF",
        ink: "#F4EFE6",
        tagBg: "#D4FF2B",
        tagInk: "#18110E",
        subhead:
          "Píxeles que sientes que podrías despegar del vidrio con la uña.",
        tags: [
          { label: "PAPEL 3D VIVO", rot: 4 },
          { label: "MÁSCARAS CURVAS", rot: -3 },
          { label: "AGARRA Y LANZA", rot: 2 },
        ],
        description:
          "Notas adheribles que se curvan con tu cursor, barridos de pintura SVG y rollos huecos en el footer con física y peso real.",
        image: "/images/nosku/specimen-tactile.png",
        imageAlt: "Cinta azul cobalto despegándose sobre grilla kraft",
      },
      {
        id: "kinetic",
        code: "PODER 03 / 06",
        kicker: "LO",
        word: "CINÉTICO",
        bg: "#D4FF2B",
        ink: "#18110E",
        tagBg: "#18110E",
        tagInk: "#D4FF2B",
        subhead:
          "Resortes, colisiones con gravedad e inercia amortiguada directo en código.",
        tags: [
          { label: "SINCRONÍA 1:1", rot: -3 },
          { label: "COLISIÓN 2D", rot: 4 },
          { label: "INERCIA SUAVE", rot: -2 },
        ],
        description:
          "Nada de videos falsos haciéndose pasar por interacción: el scroll gira el cilindro 1:1, pliega la caja al bajar y lanza cada rollo al soltar.",
        image: "/images/nosku/specimen-kinetic.png",
        imageAlt:
          "Cintas chartreuse tensadas suspendiendo una esfera de acero cromado en el aire",
      },
      {
        id: "loud",
        code: "PODER 04 / 06",
        kicker: "EL",
        word: "IMPACTO",
        bg: "#FF2E88",
        ink: "#F4EFE6",
        tagBg: "#18110E",
        tagInk: "#FF2E88",
        subhead:
          "Tipografía condensada diseñada para adueñarse de toda la pantalla.",
        tags: [
          { label: "ARCO PARABÓLICO", rot: 3 },
          { label: "REBOTE RESORTE", rot: -4 },
          { label: "GRILLA SUIZA", rot: 2 },
        ],
        description:
          "Letras gigantes que esquivan tu puntero una por una — hundiéndose al cambiar de lámina y rebotando con carácter.",
        image: "/images/nosku/specimen-loud.png",
        imageAlt:
          "Explosión radial de tiras rasgadas de cinta magenta sobre cartón kraft",
      },
      {
        id: "weird",
        code: "PODER 05 / 06",
        kicker: "LO",
        word: "RARO",
        bg: "#FFB800",
        ink: "#18110E",
        tagBg: "#18110E",
        tagInk: "#FFB800",
        subhead:
          "¿Por qué hacer otro template aburrido si puedes viajar en diagonal?",
        tags: [
          { label: "RUTAS BÉZIER", rot: -4 },
          { label: "PANEO DIAGONAL", rot: 5 },
          { label: "ANTI-TEMPLATE", rot: -2 },
        ],
        description:
          "Justo abajo, el scroll vertical gira en horizontal y viaja en diagonal sobre un lienzo continuo con esquinas suavizadas.",
        image: "/images/nosku/specimen-weird.png",
        imageAlt:
          "Cinta translúcida ámbar dorado flotando en un bucle de Möbius imposible sobre retícula",
      },
      {
        id: "next",
        code: "PODER 06 / 06",
        kicker: "EL",
        word: "SIGUIENTE",
        bg: "#14161A",
        ink: "#F4EFE6",
        tagBg: "#FF4D29",
        tagInk: "#18110E",
        subhead: "Espacio reservado. Caja vacía. Esperando al fundador correcto.",
        tags: [
          { label: "TU SKU AQUÍ", rot: -3 },
          { label: "CUPO ABIERTO", rot: 3 },
          { label: "HECHO PARA VENDER", rot: -2 },
        ],
        description:
          "El producto todavía no existe — y ese es el chiste completo. Imagina el día que metamos tu producto real en esta caja.",
        image: "/images/nosku/crate-empty.png",
        imageAlt: "Caja kraft abierta vacía con sello NO SKU // 000",
      },
    ],
    giantKicker: "¿POR QUÉ HACER TODO ESTO PARA CERO INVENTARIO?",
    giantSubhead:
      "PORQUE UN ESTUDIO DE VERDAD NO PIDE PERMISO PARA DEMOSTRAR SU NIVEL.",
    giantRows: [
      {
        index: "01",
        word: "PROBAR",
        copy: "que el oficio va antes que el brief. Cualquiera decora un producto que ya vende; hacer memorable una caja vacía exige obsesión.",
        prop: "cero SKUs lastimados",
      },
      {
        index: "02",
        word: "LUJEAR",
        copy: "cintas 3D en Three.js, física 2D con colisiones, rutas Bézier de cámara, máscaras SVG curvas y resortes 60fps en un solo sistema.",
        prop: "empuja las letras con el mouse ↑",
      },
      {
        index: "03",
        word: "ATRAER",
        copy: "Nosotros no perseguimos el producto — el producto indicado ve esto, sonríe y llega directo a nuestra caja.",
        prop: "¿el próximo launch es el tuyo?",
      },
    ],
    stickEyebrow: "SELLO FINAL // MANIFIESTO DEL ESTUDIO",
    stickTitle: "¡QUE LA NADA SE QUEDE PEGADA!",
    stickBody:
      "Sin fábrica ni bodega. Solo un prototipo web exageradamente trabajado esperando al fundador con ganas de lanzar en grande con Juanimal.",
    stickShotCapLeft: "JUANIMAL LAB • PROTOTIPO #000",
    stickShotCapRight: "CALIBRE + CARTULINAS",
    claimCta: "RECLAMAR CAJA #000 →",
    inspectVectraCta: "VER CASO #01 (VECTRA) →",
    modalTag: "GUÍA DE ENVÍO // SKU #000 RESERVADO",
    modalTitle: "ACABAS DE RECLAMAR UNA CAJA VACÍA.",
    modalBody:
      "Ahora mismo la Caja #000 trae 0g de mercancía física y 100% de nuestro oficio en 3D, motion y física. ¿La llenamos con tu próximo lanzamiento?",
    modalManifest: [
      "ARTÍCULO:    NINGUNO AÚN (PURO SHOWOFF)",
      "SKU ID:      NO-SKU-000",
      "PESO:        0.00 KG (100% CÓDIGO & MOTION)",
      "STACK:       THREE.JS + SPRING PHYSICS + NEXT.JS",
      "SIGUIENTE:   PONER TU PRODUCTO ADENTRO",
    ],
    modalGoContact: "LLENAR ESTA CAJA CON JUANIMAL →",
    modalClose: "SEGUIR JUGANDO",
    footer: {
      headline: "EL PRODUCTO NOS ENCUENTRA.",
      subline:
        "Dale sin miedo — agarra cualquiera de los rollos huecos y lánzalo por la bandeja.",
      dropAgain: "SOLTAR DE NUEVO",
      replayPeel: "REPETIR INTRO",
      claimBox: "RECLAMAR CAJA #000",
      links: [
        { label: "← JUANIMAL STUDIO", href: "/" },
        { label: "VECTRA TWIN #01", href: "/work/vectra-twin" },
      ],
      copyright: "© 2026 NO SKU™ — HECHO POR THE JUANIMAL STUDIO",
    },
  },
};

const PRELOADER_COLORS = [
  "#FF4D29",
  "#FFB800",
  "#D4FF2B",
  "#1F4BFF",
  "#FF2E88",
  "#14161A",
];

export function NoSkuShowcase() {
  const { lang, setLang } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const copy = COPY_NS[lang];

  // Preloader states
  const [preloaderKey, setPreloaderKey] = useState(0);
  const [preLifted, setPreLifted] = useState(false);
  const [preHidden, setPreHidden] = useState(false);

  // Menu, Crate & Modal states
  const [menuOpen, setMenuOpen] = useState(false);
  const [stampPressed, setStampPressed] = useState(false);
  const [crateSealed, setCrateSealed] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);

  // Orbital slider states
  const [bgPrevIdx, setBgPrevIdx] = useState(0);
  const [bgNextIdx, setBgNextIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [wipeNonce, setWipeNonce] = useState(0);
  const [wipeActive, setWipeActive] = useState(false);
  const [glyphDip, setGlyphDip] = useState(false);
  const [wheelOffsetDeg, setWheelOffsetDeg] = useState(180);

  // DOM Refs
  const crateRef = useRef<HTMLDivElement | null>(null);
  const crateSealedRef = useRef(false);
  const waveSectionRef = useRef<HTMLElement | null>(null);
  const wavePathRef = useRef<SVGPathElement | null>(null);
  const waveTextPathRef = useRef<SVGTextPathElement | null>(null);
  const waveTextRef = useRef<SVGTextElement | null>(null);
  const badgeRefs = useRef<Array<SVGGElement | null>>([]);
  const giantTrackRef = useRef<HTMLElement | null>(null);
  const giantCanvasRef = useRef<HTMLDivElement | null>(null);
  const row3Ref = useRef<HTMLDivElement | null>(null);
  const downArrowWrapRef = useRef<HTMLDivElement | null>(null);
  const downShaftRef = useRef<SVGPathElement | null>(null);
  const downHeadRef = useRef<SVGPathElement | null>(null);
  const upArrowWrapRef = useRef<HTMLDivElement | null>(null);
  const upShaftRef = useRef<SVGPathElement | null>(null);
  const upHeadRef = useRef<SVGPathElement | null>(null);
  const curveArrowWrapRef = useRef<HTMLDivElement | null>(null);
  const curveShaftRef = useRef<SVGPathElement | null>(null);
  const curveHeadRef = useRef<SVGPathElement | null>(null);
  const hudStopRef = useRef<HTMLSpanElement | null>(null);
  const hudCoordRef = useRef<HTMLSpanElement | null>(null);
  const orbitalTimersRef = useRef<number[]>([]);

  // Poke registries
  const pokeTargetsRef = useRef<Set<HTMLElement>>(new Set());

  const bindPoke = useCallback((el: HTMLElement | null) => {
    if (el) {
      pokeTargetsRef.current.add(el);
    }
  }, []);

  // Live 60fps Crate Folding & Sealing progress synced reversibly to HeroTapeCanvas scroll
  const handleSealProgress = useCallback((p: number) => {
    const el = crateRef.current;
    if (el) {
      const flapT = smoothStep(0.62, 0.9, p);
      el.style.setProperty("--seal-p", p.toFixed(4));
      el.style.setProperty("--flap-t", flapT.toFixed(4));
    }
    if (!crateSealedRef.current && p >= 0.88) {
      crateSealedRef.current = true;
      setCrateSealed(true);
    } else if (crateSealedRef.current && p < 0.84) {
      crateSealedRef.current = false;
      setCrateSealed(false);
    }
  }, []);

  // Preloader Curtain Sequence
  useEffect(() => {
    if (reduced) {
      setPreLifted(true);
      setPreHidden(true);
      return;
    }
    setPreLifted(false);
    setPreHidden(false);
    const liftTimer = window.setTimeout(() => {
      setPreLifted(true);
    }, 1350);
    const hideTimer = window.setTimeout(() => {
      setPreHidden(true);
    }, 2150);
    return () => {
      window.clearTimeout(liftTimer);
      window.clearTimeout(hideTimer);
    };
  }, [preloaderKey, reduced]);

  const handleReplayPreloader = useCallback(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPreloaderKey((k) => k + 1);
  }, []);

  // Reusable Elastic Character Poke Engine
  useEffect(() => {
    if (reduced) return;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!finePointer) return;

    const cleanups: Array<() => void> = [];

    pokeTargetsRef.current.forEach((container) => {
      if (!container.isConnected) {
        pokeTargetsRef.current.delete(container);
        return;
      }
      const chars = Array.from(
        container.querySelectorAll<HTMLElement>(".ns-poke-char")
      );
      if (!chars.length) return;

      let centers: Array<{ x: number; y: number }> = [];
      let fontSize = 64;
      let raf = 0;
      let pointer: { x: number; y: number } | null = null;
      let active = false;

      const cacheMetrics = () => {
        const rect = container.getBoundingClientRect();
        fontSize =
          parseFloat(getComputedStyle(chars[0] ?? container).fontSize) || 64;
        centers = chars.map((ch) => {
          const r = (ch.parentElement ?? ch).getBoundingClientRect();
          return {
            x: r.left - rect.left + r.width * 0.5,
            y: r.top - rect.top + r.height * 0.5,
          };
        });
      };

      const renderFrame = () => {
        raf = 0;
        if (!pointer) return;
        if (!active) {
          cacheMetrics();
          active = true;
        }
        const rect = container.getBoundingClientRect();
        const lx = pointer.x - rect.left;
        const ly = pointer.y - rect.top;
        const radius = 0.8 * fontSize;

        chars.forEach((ch, idx) => {
          const c = centers[idx];
          if (!c) return;
          const dist = Math.hypot(lx - c.x, ly - c.y);
          const t = clamp(1 - dist / radius, 0, 1);
          const a = t * t * (3 - 2 * t);
          const yPx = -0.08 * fontSize * a;
          const dirX = clamp((lx - c.x) / (0.5 * radius), -1, 1);
          const rot = -11 * a * dirX;
          const scale = 1 + 0.08 * a;
          ch.style.transition =
            "transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)";
          ch.style.transform = `translate3d(0, ${yPx.toFixed(
            2
          )}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        });
      };

      const onMove = (e: PointerEvent) => {
        pointer = { x: e.clientX, y: e.clientY };
        if (!raf) raf = requestAnimationFrame(renderFrame);
      };

      const onLeave = () => {
        pointer = null;
        active = false;
        const mid = (chars.length - 1) * 0.5;
        chars.forEach((ch, idx) => {
          const delay = Math.round(Math.abs(idx - mid) * 14);
          ch.style.transition = `transform 0.72s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`;
          ch.style.transform = "translate3d(0, 0, 0) rotate(0deg) scale(1)";
        });
      };

      const onResize = () => {
        active = false;
      };

      container.addEventListener("pointermove", onMove);
      container.addEventListener("pointerleave", onLeave);
      window.addEventListener("resize", onResize);

      cleanups.push(() => {
        if (raf) cancelAnimationFrame(raf);
        container.removeEventListener("pointermove", onMove);
        container.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("resize", onResize);
        chars.forEach((ch) => {
          ch.style.transition = "";
          ch.style.transform = "";
        });
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [lang, reduced]);

  // Seamless Wave Marquee Band with exact unitLen modular wrap & normal-offset alternating badges
  const waveUnitText = `${copy.waveHead}   •   ${copy.waveTail}   •   `;

  useEffect(() => {
    const section = waveSectionRef.current;
    const pathEl = wavePathRef.current;
    const tpEl = waveTextPathRef.current;
    const textEl = waveTextRef.current;
    if (!section || !pathEl || !tpEl || !textEl) return;

    let offset = 0;
    let lastScrollY = window.scrollY;
    let timeScale = 0.9;
    let visible = false;
    let raf = 0;
    let lastTs = performance.now();

    const totalLen = pathEl.getTotalLength() || 4840;
    let unitLen = 1100;

    const measureUnit = () => {
      try {
        const measured = textEl.getSubStringLength(0, waveUnitText.length);
        if (Number.isFinite(measured) && measured > 200) {
          unitLen = measured;
        }
      } catch {
        // Keep safe fallback unitLen if fonts not ready
      }
    };

    measureUnit();
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measureUnit);
    }

    // Badge rail traverses visible window [minDist..maxDist] cleanly offscreen before wrapping
    const minBadgeDist = totalLen * 0.27;
    const maxBadgeDist = totalLen * 0.73;
    const badgeWindow = Math.max(400, maxBadgeDist - minBadgeDist);

    const placeBadges = (baseOff: number) => {
      const spacing = badgeWindow / copy.waveBadges.length;
      badgeRefs.current.forEach((g, idx) => {
        if (!g) return;
        const posInWindow =
          (((baseOff + idx * spacing) % badgeWindow) + badgeWindow) %
          badgeWindow;
        const dist = minBadgeDist + posInWindow;

        const pt = pathEl.getPointAtLength(dist);
        const p1 = pathEl.getPointAtLength(Math.max(0, dist - 8));
        const p2 = pathEl.getPointAtLength(Math.min(totalLen, dist + 8));
        const tx = p2.x - p1.x;
        const ty = p2.y - p1.y;
        const tLen = Math.hypot(tx, ty) || 1;
        const nx = -ty / tLen;
        const ny = tx / tLen;
        const deg = (Math.atan2(ty, tx) * 180) / Math.PI;

        // Alternate badges cleanly ABOVE (-58px) and BELOW (+58px) along path normal
        const sideOffset = idx % 2 === 0 ? -58 : 58;
        const bx = pt.x + nx * sideOffset;
        const by = pt.y + ny * sideOffset;

        // Soft fade well outside the SVG [0..1600] viewBox
        const edgeFade = Math.min(
          clamp(posInWindow / 180, 0, 1),
          clamp((badgeWindow - posInWindow) / 180, 0, 1)
        );

        g.setAttribute(
          "transform",
          `translate(${bx.toFixed(1)} ${by.toFixed(1)}) rotate(${deg.toFixed(
            1
          )})`
        );
        g.style.opacity = edgeFade.toFixed(2);
      });
    };

    const tick = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;

      if (!reduced) {
        const sy = window.scrollY;
        const delta = sy - lastScrollY;
        lastScrollY = sy;

        const targetScale = clamp(0.9 + delta * 0.35, -3.6, 4.8);
        const ease =
          Math.abs(targetScale - 0.9) > Math.abs(timeScale - 0.9) ? 0.14 : 0.04;
        timeScale += (targetScale - timeScale) * ease;
        offset -= 98 * timeScale * dt;
      }

      // Exact modulo wrap against measured text unit length: 0 micro-stutter
      const wrappedTextOffset =
        (((offset % unitLen) + unitLen) % unitLen) - unitLen;
      tpEl.setAttribute("startOffset", `${wrappedTextOffset.toFixed(2)}`);
      placeBadges(offset);

      raf = requestAnimationFrame(tick);
    };

    placeBadges(0);

    const onResize = () => {
      measureUnit();
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) {
          measureUnit();
          lastTs = performance.now();
          lastScrollY = window.scrollY;
          raf = requestAnimationFrame(tick);
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(section);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [copy.waveBadges.length, lang, reduced, waveUnitText]);

  // Orbital Switcher with flash-free Curved Paint Wipe + Color Sync to Hero Roll
  const triggerSlideChange = useCallback(
    (nextIndex: number) => {
      const normalized =
        ((nextIndex % copy.slides.length) + copy.slides.length) %
        copy.slides.length;
      if (normalized === bgNextIdx) return;

      orbitalTimersRef.current.forEach((id) => window.clearTimeout(id));
      orbitalTimersRef.current = [];

      setBgPrevIdx(bgNextIdx);
      setBgNextIdx(normalized);
      setGlyphDip(true);
      setWipeNonce((n) => n + 1);
      setWipeActive(true);

      const stepDeg = 360 / copy.slides.length;
      setWheelOffsetDeg(180 - normalized * stepDeg);

      const tSwap = window.setTimeout(() => {
        setDisplayIdx(normalized);
        setGlyphDip(false);
      }, 190);

      const tDone = window.setTimeout(() => {
        setWipeActive(false);
      }, 700);

      orbitalTimersRef.current.push(tSwap, tDone);
    },
    [bgNextIdx, copy.slides.length]
  );

  useEffect(() => {
    return () => {
      orbitalTimersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Keyboard Navigation (Arrows + Escape)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (claimOpen) setClaimOpen(false);
        if (menuOpen) setMenuOpen(false);
        return;
      }
      if (claimOpen || menuOpen) return;
      if (e.key === "ArrowRight") {
        triggerSlideChange(bgNextIdx + 1);
      } else if (e.key === "ArrowLeft") {
        triggerSlideChange(bgNextIdx - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bgNextIdx, claimOpen, menuOpen, triggerSlideChange]);

  // 2D Multi-Directional Arc-Length Parameterized Bézier Camera + Exit Down Curve
  useEffect(() => {
    const track = giantTrackRef.current;
    const canvas = giantCanvasRef.current;
    if (!track || !canvas) return;
    if (reduced || window.innerWidth <= 900) return;

    interface Pt {
      x: number;
      y: number;
    }

    let filletedPts: Pt[] = [];
    let segCumLen: number[] = [0];
    let totalArcLen = 1;
    let smoothP = 0;
    let raf = 0;

    const buildFilletedPath = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const toPxX = (v: number) => (v * vw) / 100;
      const toPxY = (s: number) => (s * vh) / 100;

      const row3El = row3Ref.current;
      const row3EndStopX = row3El
        ? Math.min(
            -toPxX(320),
            -(row3El.offsetLeft + row3El.offsetWidth - vw * 0.94)
          )
        : -toPxX(338);

      const rawStops: Pt[] = [
        { x: 0, y: 0 },
        { x: -toPxX(4), y: -toPxY(42) },
        { x: -toPxX(42), y: -toPxY(42) },
        { x: -toPxX(152), y: -toPxY(114) },
        { x: -toPxX(198), y: -toPxY(114) },
        { x: -toPxX(308), y: -toPxY(34) },
        { x: row3EndStopX, y: -toPxY(34) },
      ];

      const smoothPts: Pt[] = [];
      for (let i = 0; i < rawStops.length; i++) {
        const cur = rawStops[i];
        const prev = rawStops[i - 1];
        const next = rawStops[i + 1];
        if (!prev || !next) {
          smoothPts.push(cur);
          continue;
        }
        const dx1 = cur.x - prev.x;
        const dy1 = cur.y - prev.y;
        const dx2 = next.x - cur.x;
        const dy2 = next.y - cur.y;
        const l1 = Math.hypot(dx1, dy1);
        const l2 = Math.hypot(dx2, dy2);
        if (l1 < 1 || l2 < 1) {
          smoothPts.push(cur);
          continue;
        }
        const cos = clamp((dx1 * dx2 + dy1 * dy2) / (l1 * l2), -1, 1);
        const angleDeg = (Math.acos(cos) * 180) / Math.PI;
        if (angleDeg < 15) {
          smoothPts.push(cur);
          continue;
        }
        const r = 0.13 * Math.min(l1, l2);
        const pIn = { x: cur.x - (dx1 / l1) * r, y: cur.y - (dy1 / l1) * r };
        const pOut = { x: cur.x + (dx2 / l2) * r, y: cur.y + (dy2 / l2) * r };
        const steps = 6;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const omt = 1 - t;
          smoothPts.push({
            x: omt * omt * pIn.x + 2 * omt * t * cur.x + t * t * pOut.x,
            y: omt * omt * pIn.y + 2 * omt * t * cur.y + t * t * pOut.y,
          });
        }
      }

      filletedPts = smoothPts;
      segCumLen = [0];
      let acc = 0;
      for (let i = 1; i < filletedPts.length; i++) {
        acc += distPt(filletedPts[i - 1], filletedPts[i]);
        segCumLen.push(acc);
      }
      totalArcLen = Math.max(1, acc);
    };

    const sampleAtProgress = (p: number): Pt => {
      const targetLen = clamp(p, 0, 1) * totalArcLen;
      for (let i = 1; i < filletedPts.length; i++) {
        if (segCumLen[i] >= targetLen || i === filletedPts.length - 1) {
          const l0 = segCumLen[i - 1];
          const l1 = segCumLen[i];
          const span = Math.max(0.001, l1 - l0);
          const u = clamp((targetLen - l0) / span, 0, 1);
          return {
            x: filletedPts[i - 1].x + (filletedPts[i].x - filletedPts[i - 1].x) * u,
            y: filletedPts[i - 1].y + (filletedPts[i].y - filletedPts[i - 1].y) * u,
          };
        }
      }
      return filletedPts[0] ?? { x: 0, y: 0 };
    };

    buildFilletedPath();

    const initArrowPair = (
      shaft: SVGPathElement | null,
      head: SVGPathElement | null,
      fallbackShaftLen: number,
      fallbackHeadLen: number
    ) => {
      const sLen = shaft ? shaft.getTotalLength() : fallbackShaftLen;
      const hLen = head ? head.getTotalLength() : fallbackHeadLen;
      if (shaft) {
        shaft.style.strokeDasharray = `${sLen} ${sLen + 8}`;
        shaft.style.strokeDashoffset = `${sLen}`;
        shaft.style.opacity = "0";
      }
      if (head) {
        head.style.strokeDasharray = `${hLen} ${hLen + 8}`;
        head.style.strokeDashoffset = `${hLen}`;
        head.style.opacity = "0";
      }
      return { shaft, head, sLen, hLen };
    };

    const setArrowProgress = (
      pair: {
        shaft: SVGPathElement | null;
        head: SVGPathElement | null;
        sLen: number;
        hLen: number;
      },
      progress: number
    ) => {
      const p = clamp(progress, 0, 1);
      const sProg = clamp(p / 0.84, 0, 1);
      const hProg = clamp((p - 0.8) / 0.2, 0, 1);
      if (pair.shaft) {
        pair.shaft.style.strokeDashoffset = `${(pair.sLen * (1 - sProg)).toFixed(1)}`;
        pair.shaft.style.opacity = sProg <= 0.004 ? "0" : "1";
      }
      if (pair.head) {
        pair.head.style.strokeDashoffset = `${(pair.hLen * (1 - hProg)).toFixed(1)}`;
        pair.head.style.opacity = hProg <= 0.004 ? "0" : "1";
      }
    };

    const downPair = initArrowPair(
      downShaftRef.current,
      downHeadRef.current,
      540,
      140
    );
    const upPair = initArrowPair(upShaftRef.current, upHeadRef.current, 540, 140);
    const curvePair = initArrowPair(
      curveShaftRef.current,
      curveHeadRef.current,
      460,
      130
    );

    const props = Array.from(
      track.querySelectorAll<HTMLElement>(".ns-giant-tape-prop")
    );

    const tick = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const maxScroll = Math.max(1, track.offsetHeight - window.innerHeight);
      const targetP = clamp(-rect.top / maxScroll, 0, 1);
      smoothP += (targetP - smoothP) * 0.11;

      const pos = sampleAtProgress(smoothP);
      canvas.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(
        1
      )}px, 0)`;

      const vw = window.innerWidth || 1280;

      if (downArrowWrapRef.current) {
        const r = downArrowWrapRef.current.getBoundingClientRect();
        const pDown = clamp((vw * 0.78 - r.left) / Math.max(220, vw * 0.68), 0, 1);
        setArrowProgress(downPair, pDown);
      }
      if (upArrowWrapRef.current) {
        const r = upArrowWrapRef.current.getBoundingClientRect();
        const pUp = clamp((vw * 0.82 - r.left) / Math.max(220, vw * 0.76), 0, 1);
        setArrowProgress(upPair, pUp);
      }
      if (curveArrowWrapRef.current) {
        const r = curveArrowWrapRef.current.getBoundingClientRect();
        const curveStartLeft = vw * 0.96;
        const curveRestLeft = vw * 0.94 - Math.max(180, r.width);
        const pCurveView = clamp(
          (curveStartLeft - r.left) /
            Math.max(140, curveStartLeft - curveRestLeft),
          0,
          1
        );
        const pCurve =
          smoothP >= 0.985
            ? Math.max(pCurveView, clamp((smoothP - 0.94) / 0.045, 0, 1))
            : pCurveView;
        setArrowProgress(curvePair, pCurve);
      }

      props.forEach((el, idx) => {
        const start = 0.08 + idx * 0.27;
        const peel = clamp((smoothP - start) / 0.14, 0, 1);
        el.style.setProperty("--peel", peel.toFixed(3));
      });

      const stopIdx =
        smoothP < 0.12
          ? "00"
          : smoothP < 0.42
            ? "01"
            : smoothP < 0.72
              ? "02"
              : "03";
      if (hudStopRef.current) {
        hudStopRef.current.textContent = `CAMERA 2D // STOP ${stopIdx} / 03`;
      }
      if (hudCoordRef.current) {
        hudCoordRef.current.textContent = `CAM X: ${Math.round(
          -pos.x
        )}PX • Y: ${Math.round(-pos.y)}PX`;
      }

      if (Math.abs(targetP - smoothP) > 0.0005) {
        raf = requestAnimationFrame(tick);
      }
    };

    const scheduleTick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      buildFilletedPath();
      scheduleTick();
    };

    let unmounted = false;
    document.fonts?.ready?.then(() => {
      if (!unmounted) {
        buildFilletedPath();
        scheduleTick();
      }
    });

    window.addEventListener("scroll", scheduleTick, { passive: true });
    window.addEventListener("resize", onResize);
    scheduleTick();

    return () => {
      unmounted = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", scheduleTick);
      window.removeEventListener("resize", onResize);
    };
  }, [lang, reduced]);

  const currentSlide = copy.slides[displayIdx];
  const activeColorSlide = copy.slides[bgNextIdx];
  const prevBgColor = copy.slides[bgPrevIdx].bg;
  const nextBgColor = activeColorSlide.bg;

  const handleMenuLinkClick = (scrollTarget?: string) => {
    setMenuOpen(false);
    if (scrollTarget) {
      const target = document.getElementById(scrollTarget);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="ns-page" data-loading={preHidden ? undefined : "true"}>
      {/* 1. 6-Layer Curved Preloader */}
      <div
        key={preloaderKey}
        className={`ns-preloader ${preHidden ? "is-hidden" : ""}`}
        aria-hidden={preHidden}
        onClick={() => {
          setPreLifted(true);
          window.setTimeout(() => setPreHidden(true), 650);
        }}
      >
        {PRELOADER_COLORS.map((bg, i) => (
          <div
            key={bg}
            className={`ns-pre-layer ns-arc-cut ${preLifted ? "is-lifted" : ""}`}
            style={{
              background: bg,
              zIndex: 6 - i,
              transitionDelay: `${i * 55}ms`,
            }}
          />
        ))}
        <div
          className={`ns-pre-sheet ns-arc-cut ${preLifted ? "is-lifted" : ""}`}
        >
          <div className="ns-pre-center">
            <div
              className="ns-pre-sticker"
              style={{ "--cols": 32 } as React.CSSProperties}
            >
              {Array.from({ length: 32 }).map((_, c) => (
                <div
                  key={c}
                  className="ns-pre-col"
                  style={{ "--col-i": c } as React.CSSProperties}
                >
                  <span className="ns-pre-col-inner">NO SKU™</span>
                </div>
              ))}
            </div>
            <span className="ns-pre-sub">{copy.preSub}</span>
          </div>
        </div>
      </div>

      {/* 2. Physical PULL ME Menu */}
      <nav
        className="ns-menu"
        data-open={menuOpen ? "true" : "false"}
        aria-label="NO SKU navigation"
      >
        <button
          type="button"
          className="ns-menu-tab"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="ns-menu-tab-dot" aria-hidden="true" />
          <span>{menuOpen ? copy.menuTabClose : copy.menuTabOpen}</span>
        </button>

        <div className="ns-menu-panel" aria-hidden={!menuOpen}>
          <div className="ns-menu-sheet">
            <div className="ns-menu-topmeta">
              <span>{copy.menuTopMeta}</span>
              <div className="ns-menu-lang-group">
                <button
                  type="button"
                  className={`ns-lang-btn ${lang === "en" ? "is-active" : ""}`}
                  onClick={() => setLang("en")}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`ns-lang-btn ${lang === "es" ? "is-active" : ""}`}
                  onClick={() => setLang("es")}
                >
                  ES
                </button>
                <button
                  type="button"
                  className="ns-lang-btn"
                  onClick={handleReplayPreloader}
                >
                  {copy.footer.replayPeel}
                </button>
              </div>
            </div>

            <ul className="ns-menu-list">
              {copy.menuItems.map((item) => (
                <li key={item.label} className="ns-menu-item">
                  {item.scrollTarget ? (
                    <button
                      type="button"
                      className="ns-menu-link"
                      onClick={() => handleMenuLinkClick(item.scrollTarget)}
                    >
                      <span className="ns-menu-link-left">
                        <span className="ns-menu-thumb" aria-hidden="true">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.thumb} alt="" />
                        </span>
                        <span className="ns-menu-label">
                          {Array.from(item.label).map((ch, i) => (
                            <span
                              key={i}
                              className="ns-clip"
                              style={{ "--i": i } as React.CSSProperties}
                            >
                              <span className="ns-char">
                                {ch === " " ? "\u00A0" : ch}
                              </span>
                            </span>
                          ))}
                        </span>
                      </span>
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="ns-menu-arrow"
                        aria-hidden="true"
                      >
                        <path
                          d="M1.4 10.6 10.6 1.4M3.6 1.4h7v7"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="square"
                        />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="ns-menu-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="ns-menu-link-left">
                        <span className="ns-menu-thumb" aria-hidden="true">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.thumb} alt="" />
                        </span>
                        <span className="ns-menu-label">
                          {Array.from(item.label).map((ch, i) => (
                            <span
                              key={i}
                              className="ns-clip"
                              style={{ "--i": i } as React.CSSProperties}
                            >
                              <span className="ns-char">
                                {ch === " " ? "\u00A0" : ch}
                              </span>
                            </span>
                          ))}
                        </span>
                      </span>
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="ns-menu-arrow"
                        aria-hidden="true"
                      >
                        <path
                          d="M1.4 10.6 10.6 1.4M3.6 1.4h7v7"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="square"
                        />
                      </svg>
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="ns-menu-foot">
              <span>{copy.menuFootLeft}</span>
              <span>{copy.menuFootRight}</span>
            </div>
          </div>
        </div>
      </nav>

      <main id="main">
        {/* 3. Hero with Parabolic Poke Headlines + Interactive Draggable Color-Sync 3D Roll + Reversible Folding Crate */}
        <section className="ns-hero" id="ns-hero">
          <div className="ns-hero-wrapper">
            <div className="ns-hero-top ns-arc-cut">
              <div className="ns-hero-kicker-row">
                <span className="ns-stamp-badge">
                  <span className="ns-stamp-dot" aria-hidden="true" />
                  <span>{copy.heroBadge}</span>
                </span>

                <div className="ns-hero-brandmark">
                  <button
                    type="button"
                    className={`ns-peel-stamp ${stampPressed ? "is-pressed" : ""}`}
                    onClick={() => setStampPressed((s) => !s)}
                  >
                    {stampPressed
                      ? copy.heroStampPressed
                      : copy.heroStampIdle}
                  </button>
                </div>
              </div>

              <h1
                ref={(el) => bindPoke(el)}
                className="ns-warped-title"
                aria-label={`${copy.heroLines[0]} ${copy.heroLines[1]}`}
              >
                {copy.heroLines.map((line, lIdx) => {
                  const chars = Array.from(line);
                  return (
                    <span
                      key={lIdx}
                      className="ns-warped-line"
                      style={{ "--letters": chars.length } as React.CSSProperties}
                    >
                      {chars.map((ch, idx) => (
                        <span
                          key={idx}
                          className="ns-warped-char-slot"
                          style={{ "--i": idx } as React.CSSProperties}
                        >
                          <span className="ns-poke-char">
                            {ch === " " ? "\u00A0" : ch}
                          </span>
                        </span>
                      ))}
                    </span>
                  );
                })}
              </h1>
            </div>

            {/* 3D Unspooling Tape Roll suspended cleanly in open runway into crate */}
            <HeroTapeCanvas
              crateRef={crateRef}
              reduced={reduced}
              tapeColor={nextBgColor}
              onSealProgress={handleSealProgress}
            />

            {/* Lower Kraft Corridor: 3D Curling Sticky Note + Reversible Folding Crate + Ledger */}
            <div className="ns-hero-bottom">
              <div className="ns-note-column">
                <StickyNoteWebGL
                  reduced={reduced}
                  noteLines={copy.stickyNoteLines}
                />
                <p className="ns-hand-note">{copy.handNoteLeft}</p>
              </div>

              <div
                ref={crateRef}
                className="ns-crate-stage"
                style={
                  {
                    "--active-tape-bg": nextBgColor,
                    "--active-tape-ink": activeColorSlide.ink,
                  } as React.CSSProperties
                }
              >
                <div className="ns-crate-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/nosku/crate-empty.png"
                    alt="Empty open kraft cardboard crate stamped NO SKU // 000"
                  />
                  {/* Reversible 3D corrugated folding box flaps */}
                  <div className="ns-crate-flap is-left" aria-hidden="true" />
                  <div className="ns-crate-flap is-right" aria-hidden="true" />
                </div>
                <div className="ns-crate-caption">
                  <span>{copy.crateCaptionLeft}</span>
                  <span>
                    {crateSealed
                      ? copy.crateCaptionRightSealed
                      : copy.crateCaptionRightPending}
                  </span>
                </div>
              </div>

              <aside className="ns-spec-ledger">
                <h3>{copy.ledgerTitle}</h3>
                <dl>
                  {copy.ledgerRows.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </div>
        </section>

        {/* 4. Seamless Scroll-Velocity Wave Marquee Band + Non-Occluding Alternating Badges */}
        <section
          ref={waveSectionRef}
          className="ns-wave-band"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1600 280"
            preserveAspectRatio="xMidYMid slice"
            className="ns-wave-svg"
          >
            <defs>
              <path
                ref={wavePathRef}
                id="ns-wave-path"
                d="M -1600 140 Q -1200 72 -800 140 T 0 140 T 800 140 T 1600 140 T 2400 140 T 3200 140"
              />
            </defs>

            <text ref={waveTextRef} className="ns-wave-text">
              <textPath ref={waveTextPathRef} href="#ns-wave-path" startOffset="0">
                {waveUnitText.repeat(8)}
              </textPath>
            </text>

            {copy.waveBadges.map((badgeText, idx) => (
              <g
                key={badgeText}
                ref={(el) => {
                  badgeRefs.current[idx] = el;
                }}
                className="ns-band-badge"
              >
                <rect x="-58" y="-17" width="116" height="34" rx="17" />
                <text x="0" y="1">
                  {badgeText}
                </text>
              </g>
            ))}
          </svg>
        </section>

        {/* 5. Orbital 6-Specimen Selector (All 6 With Bespoke Studio Photography) */}
        <section
          className="ns-orbital"
          id="ns-orbital"
          style={
            { "--ns-slide-ink": currentSlide.ink } as React.CSSProperties
          }
        >
          <div className="ns-bg-overlay" aria-hidden="true">
            <div
              className="ns-bg-layer"
              style={{ background: prevBgColor }}
            />
            <div
              key={`bg-${bgNextIdx}-${wipeNonce}`}
              className="ns-bg-layer ns-bg-layer--next ns-arc-cut"
              style={{
                background: nextBgColor,
                animation: wipeActive
                  ? "nsPaintSweep 0.68s cubic-bezier(0.22, 1, 0.36, 1) forwards"
                  : "none",
              }}
            />
          </div>

          <style>{`@keyframes nsPaintSweep { from { transform: translateY(-102%); } to { transform: translateY(0%); } }`}</style>

          <div className="ns-sweep-paint">
            <p className="ns-sweep-subhead">{currentSlide.subhead}</p>
          </div>

          <div className="ns-orbital-grid">
            {/* Left Manifesto Column */}
            <div className="ns-orbital-left">
              <span className="ns-orbital-code">{currentSlide.code}</span>
              <div className="ns-orbital-tags">
                {currentSlide.tags.map((tg) => (
                  <span
                    key={tg.label}
                    className="ns-orbital-tag"
                    style={
                      {
                        "--ns-tag-bg": currentSlide.tagBg,
                        "--ns-tag-ink": currentSlide.tagInk,
                        "--rot": tg.rot,
                      } as React.CSSProperties
                    }
                  >
                    {tg.label}
                  </span>
                ))}
              </div>

              <p className="ns-orbital-desc">{currentSlide.description}</p>

              <div className="ns-orbital-nav" role="tablist" aria-label="Capabilities">
                {copy.slides.map((sl, idx) => (
                  <button
                    key={sl.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === bgNextIdx}
                    className={`ns-step-pill ${
                      idx === bgNextIdx ? "is-active" : ""
                    }`}
                    onClick={() => triggerSlideChange(idx)}
                  >
                    {`0${idx + 1} ${sl.word}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Center Monolithic Word + Taped Photo Specimen Card */}
            <div className="ns-orbital-middle">
              <div className="ns-orbital-archetype">
                <span className="ns-archetype-kicker">
                  {currentSlide.kicker}
                </span>
                <div className="ns-archetype-word">
                  {Array.from(currentSlide.word).map((ch, gi) => (
                    <span
                      key={gi}
                      className={`ns-archetype-glyph ${
                        glyphDip ? "is-dipping" : ""
                      }`}
                      style={{ "--gi": gi } as React.CSSProperties}
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ns-key-card">
                <span
                  className="ns-key-card-tape"
                  style={{ background: currentSlide.tagBg }}
                  aria-hidden="true"
                />
                <div className="ns-key-card-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.imageAlt}
                  />
                </div>
              </div>
            </div>

            {/* Right 360deg Orbital Wheel ("ROLL IT!") */}
            <div className="ns-roll-parent">
              <div className="ns-orbital-wheel">
                <div className="ns-orbital-ring-track" aria-hidden="true" />
                <button
                  type="button"
                  className="ns-roll-it"
                  onClick={() => triggerSlideChange(bgNextIdx + 1)}
                >
                  {copy.rollButton}
                </button>
                {copy.slides.map((sl, idx) => {
                  const angleDeg =
                    idx * (360 / copy.slides.length) + wheelOffsetDeg;
                  const rad = (angleDeg * Math.PI) / 180;
                  const radiusPx = 112;
                  const tx = Math.cos(rad) * radiusPx;
                  const ty = Math.sin(rad) * radiusPx;
                  return (
                    <button
                      key={sl.id}
                      type="button"
                      aria-label={`Select ${sl.word}`}
                      className={`ns-orbit-node ${
                        idx === bgNextIdx ? "is-selected" : ""
                      }`}
                      style={
                        {
                          transform: `translate3d(${tx.toFixed(
                            1
                          )}px, ${ty.toFixed(1)}px, 0) scale(${
                            idx === bgNextIdx ? 1.18 : 0.94
                          })`,
                          "--node-bg": sl.bg,
                          "--node-fg": sl.ink,
                        } as React.CSSProperties
                      }
                      onClick={() => triggerSlideChange(idx)}
                    >
                      {`0${idx + 1}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 6. 2D Multi-Directional Camera Canvas + Thick Vector Arrows + Curved Exit Down Arrow */}
        <section ref={giantTrackRef} className="ns-giant" id="ns-giant">
          <div className="ns-giant-sticky">
            <div className="ns-giant-hud" aria-hidden="true">
              <span ref={hudStopRef} className="ns-giant-hud-pill">
                CAMERA 2D // STOP 00 / 03
              </span>
              <span ref={hudCoordRef} className="ns-giant-hud-pill">
                CAM X: 0PX • Y: 0PX
              </span>
            </div>

            <div ref={giantCanvasRef} className="ns-giant-canvas">
              <div className="ns-giant-opener">
                <span className="ns-giant-kicker">{copy.giantKicker}</span>
                <h2 className="ns-giant-subhead">{copy.giantSubhead}</h2>
              </div>

              {/* Row 1 */}
              <div className="ns-giant-row ns-giant-row--1">
                <div>
                  <span className="ns-giant-index">
                    {copy.giantRows[0].index}
                  </span>
                  <h3
                    ref={(el) => bindPoke(el)}
                    className="ns-giant-word"
                    aria-label={copy.giantRows[0].word}
                  >
                    {Array.from(copy.giantRows[0].word).map((ch, i) => (
                      <span key={i} className="ns-poke-wrap" aria-hidden="true">
                        <span className="ns-poke-char">
                          {ch === " " ? "\u00A0" : ch}
                        </span>
                      </span>
                    ))}
                  </h3>
                </div>
                <p className="ns-giant-copy">{copy.giantRows[0].copy}</p>
                <span className="ns-giant-tape-prop">
                  {copy.giantRows[0].prop}
                </span>
              </div>

              {/* Thick Diagonal Down-Right Self-Drawing Vector Arrow */}
              <div
                ref={downArrowWrapRef}
                className="ns-diag-down-arrow"
                aria-hidden="true"
              >
                <svg viewBox="0 0 460 300">
                  <path
                    ref={downShaftRef}
                    d="M 18 22 C 155 102, 285 188, 424 274"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    ref={downHeadRef}
                    d="M 372 276 L 428 278 L 408 224"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Row 2 */}
              <div className="ns-giant-row ns-giant-row--2">
                <div>
                  <span className="ns-giant-index">
                    {copy.giantRows[1].index}
                  </span>
                  <h3
                    ref={(el) => bindPoke(el)}
                    className="ns-giant-word"
                    aria-label={copy.giantRows[1].word}
                  >
                    {Array.from(copy.giantRows[1].word).map((ch, i) => (
                      <span key={i} className="ns-poke-wrap" aria-hidden="true">
                        <span className="ns-poke-char">
                          {ch === " " ? "\u00A0" : ch}
                        </span>
                      </span>
                    ))}
                  </h3>
                </div>
                <p className="ns-giant-copy">{copy.giantRows[1].copy}</p>
                <span className="ns-giant-tape-prop">
                  {copy.giantRows[1].prop}
                </span>
              </div>

              {/* Thick Diagonal Up-Right Self-Drawing Vector Arrow */}
              <div
                ref={upArrowWrapRef}
                className="ns-diag-up-arrow"
                aria-hidden="true"
              >
                <svg viewBox="0 0 460 300">
                  <path
                    ref={upShaftRef}
                    d="M 22 274 C 165 202, 294 118, 426 28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    ref={upHeadRef}
                    d="M 374 26 L 430 26 L 414 82"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Row 3 */}
              <div ref={row3Ref} className="ns-giant-row ns-giant-row--3">
                <div>
                  <span className="ns-giant-index">
                    {copy.giantRows[2].index}
                  </span>
                  <h3
                    ref={(el) => bindPoke(el)}
                    className="ns-giant-word"
                    aria-label={copy.giantRows[2].word}
                  >
                    {Array.from(copy.giantRows[2].word).map((ch, i) => (
                      <span key={i} className="ns-poke-wrap" aria-hidden="true">
                        <span className="ns-poke-char">
                          {ch === " " ? "\u00A0" : ch}
                        </span>
                      </span>
                    ))}
                  </h3>
                </div>
                <p className="ns-giant-copy">{copy.giantRows[2].copy}</p>
                <span className="ns-giant-tape-prop">
                  {copy.giantRows[2].prop}
                </span>

                {/* Smooth Curved Downward Exit Arrow Guiding Straight Into Manifesto */}
                <div
                  ref={curveArrowWrapRef}
                  className="ns-curve-down-arrow"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 360 320">
                    <path
                      ref={curveShaftRef}
                      d="M 14 56 L 210 56 C 280 56, 296 106, 296 292"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      ref={curveHeadRef}
                      d="M 264 258 L 296 298 L 328 258"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Manifesto Collage Band ("LET'S MAKE NOTHING STICK!") */}
        <section className="ns-stick ns-arc-cut" id="ns-stick">
          <div className="ns-stick-inner">
            <div className="ns-stick-shot">
              <span className="ns-stick-shot-tape" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nosku/studio-collage.png"
                alt="Sunlit Swiss studio desk with sealed empty kraft crate, calipers, bone swatches and clips"
              />
              <div className="ns-stick-shot-cap">
                <span>{copy.stickShotCapLeft}</span>
                <span>{copy.stickShotCapRight}</span>
              </div>
            </div>

            <div className="ns-stick-card">
              <span className="ns-stick-eyebrow">{copy.stickEyebrow}</span>
              <h2 className="ns-stick-title">{copy.stickTitle}</h2>
              <p className="ns-stick-body">{copy.stickBody}</p>
              <div className="ns-stick-actions">
                <button
                  type="button"
                  className="ns-btn-primary"
                  onClick={() => setClaimOpen(true)}
                >
                  {copy.claimCta}
                </button>
                <Link href="/work/vectra-twin" className="ns-btn-ghost">
                  {copy.inspectVectraCta}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Physics Playground Footer With Hollow Top-Down Adhesive Rolls */}
      <NoSkuPhysicsFooter
        copy={copy.footer}
        onReplayPeel={handleReplayPreloader}
        onClaimBox={() => setClaimOpen(true)}
        bindPoke={bindPoke}
      />

      {/* Claim Box #000 Modal */}
      {claimOpen && (
        <div
          className="ns-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={copy.modalTitle}
          onClick={() => setClaimOpen(false)}
        >
          <div
            className="ns-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ns-modal-head">
              <span>{copy.modalTag}</span>
              <button
                type="button"
                className="ns-modal-close"
                onClick={() => setClaimOpen(false)}
              >
                ✕
              </button>
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--ns-disp)",
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 0.9,
              }}
            >
              {copy.modalTitle}
            </h2>
            <p style={{ margin: 0, lineHeight: 1.5, fontSize: 15 }}>
              {copy.modalBody}
            </p>
            <pre className="ns-modal-label-box">
              {copy.modalManifest.join("\n")}
            </pre>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link
                href="/contact"
                className="ns-btn-primary"
                style={{ textDecoration: "none" }}
              >
                {copy.modalGoContact}
              </Link>
              <button
                type="button"
                className="ns-footer-chip"
                onClick={() => setClaimOpen(false)}
              >
                {copy.modalClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
