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
  image?: string;
  imageAlt?: string;
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
  heroSubcap: string;
  stickyNoteLines: string[];
  handNoteLeft: string;
  crateCaptionLeft: string;
  crateCaptionRightPending: string;
  crateCaptionRightSealed: string;
  crateSealedBanner: string;
  rerollTape: string;
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
    heroLines: ["THERE IS NO PRODUCT YET.", "JUST WATCH WHAT WE CAN DO."],
    heroSubcap:
      "Scroll to pivot the Three.js roll frontal and unspool tape straight down onto an empty box. Poke any headline. Throw the stickers in the footer. Zero inventory — 100% proof.",
    stickyNoteLines: [
      "note to self:",
      "still no SKU.",
      "just watch what",
      "this site does.",
    ],
    handNoteLeft:
      "we built an entire launch flagship for an empty cardboard box.",
    crateCaptionLeft: "BOX #000 // ARCHIVAL KRAFT",
    crateCaptionRightPending: "SCROLL DOWN TO SEAL CRATE ↓",
    crateCaptionRightSealed: "SEALED WITH PURE SHOWOFF ✓",
    crateSealedBanner: "NO SKU // SEALED EMPTY",
    rerollTape: "RE-ROLL TAPE",
    ledgerTitle: "MANIFEST // SKU #000",
    ledgerRows: [
      ["Physical Units", "000 in stock"],
      ["Warehouse", "None / Localhost"],
      ["Render Engine", "Three.js + 60fps DOM"],
      ["Interaction", "Elastic Poke + 2D Physics"],
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
          "Sticky notes bend away from your cursor, SVG curve masks sweep across the viewport, and footer stickers bounce with weight.",
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
          "No canned video loops masquerading as interactivity: scroll couples 1:1 to cylinder rotation, ribbons flex with velocity, and balls throw on release.",
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
      subline: "Go ahead — grab a sticker ball and throw it across the tray.",
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
    heroLines: ["AÚN NO HAY PRODUCTO.", "SOLO MIRA LO QUE HACEMOS."],
    heroSubcap:
      "Haz scroll para girar el rollo Three.js de frente y desenrollar cinta 1:1 directo hasta sellar la caja vacía. Empuja cualquier titular con el mouse.",
    stickyNoteLines: [
      "nota mental:",
      "cero producto aún.",
      "solo mira lo que",
      "hace esta web.",
    ],
    handNoteLeft:
      "construimos una web insignia entera para una caja de cartón vacía.",
    crateCaptionLeft: "CAJA #000 // KRAFT DE ARCHIVO",
    crateCaptionRightPending: "BAJA PARA SELLAR LA CAJA ↓",
    crateCaptionRightSealed: "SELLADA A PURO SHOWOFF ✓",
    crateSealedBanner: "NO SKU // SELLADA VACÍA",
    rerollTape: "RE-ENROLLAR CINTA",
    ledgerTitle: "MANIFIESTO // SKU #000",
    ledgerRows: [
      ["Unidades Físicas", "000 en bodega"],
      ["Bodega", "Ninguna / Localhost"],
      ["Motor 3D", "Three.js + DOM 60fps"],
      ["Interacción", "Poke Elástico + Física 2D"],
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
          "Notas adheribles que se curvan con tu cursor, barridos de pintura SVG y stickers en el footer con física y peso real.",
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
          "Nada de videos falsos haciéndose pasar por interacción: el scroll gira el cilindro 1:1, la cinta flexiona con la velocidad y las bolas se lanzan.",
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
        "Dale sin miedo — agarra cualquiera de las bolas y lánzala por la bandeja.",
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

function KineticSlideArtwork({ id, ink }: { id: string; ink: string }) {
  if (id === "kinetic") {
    return (
      <svg viewBox="0 0 360 450" className="ns-key-svg" aria-hidden="true">
        <rect width="360" height="450" fill="#D4FF2B" />
        <g stroke="#18110E" strokeWidth="4" fill="none">
          <circle cx="180" cy="198" r="132" strokeDasharray="12 8" />
          <circle cx="180" cy="198" r="88" />
          <path d="M 180 66 L 180 330 M 48 198 L 312 198" strokeWidth="2.5" opacity="0.45" />
          <circle cx="180" cy="198" r="34" fill="#FF4D29" />
          <circle cx="268" cy="198" r="18" fill="#18110E" />
          <circle cx="118" cy="136" r="14" fill="#1F4BFF" />
          <path d="M 52 368 Q 116 320 180 368 T 308 368" strokeWidth="5" />
        </g>
        <text
          x="180"
          y="416"
          textAnchor="middle"
          fill="#18110E"
          fontFamily="monospace"
          fontWeight="800"
          fontSize="14"
        >
          1:1 SPRING &amp; ORBITAL PHYSICS
        </text>
      </svg>
    );
  }
  if (id === "loud") {
    return (
      <svg viewBox="0 0 360 450" className="ns-key-svg" aria-hidden="true">
        <rect width="360" height="450" fill="#FF2E88" />
        <g transform="translate(180 220)">
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={Math.cos((i * Math.PI) / 6) * 175}
              y2={Math.sin((i * Math.PI) / 6) * 175}
              stroke="#18110E"
              strokeWidth="6"
            />
          ))}
          <circle r="86" fill="#F4EFE6" stroke="#18110E" strokeWidth="5" />
          <text
            x="0"
            y="14"
            textAnchor="middle"
            fill="#18110E"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="44"
          >
            POKE!
          </text>
        </g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 360 450" className="ns-key-svg" aria-hidden="true">
      <rect width="360" height="450" fill="#FFB800" />
      <g stroke="#18110E" strokeWidth="5" fill="none">
        <path
          d="M 48 92 L 306 92 L 96 225 L 308 225 L 62 358 L 312 358"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon points="292,340 326,358 292,376" fill={ink} />
        <circle cx="96" cy="225" r="24" fill="#FF4D29" />
        <circle cx="306" cy="92" r="20" fill="#F4EFE6" />
      </g>
    </svg>
  );
}

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
  const [tapeResetKey, setTapeResetKey] = useState(0);
  const [claimOpen, setClaimOpen] = useState(false);

  // Orbital slider states: separated background sweep vs headline swap for zero color flash
  const [bgPrevIdx, setBgPrevIdx] = useState(0);
  const [bgNextIdx, setBgNextIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [wipeNonce, setWipeNonce] = useState(0);
  const [wipeActive, setWipeActive] = useState(false);
  const [glyphDip, setGlyphDip] = useState(false);
  const [wheelOffsetDeg, setWheelOffsetDeg] = useState(180);

  // DOM Refs
  const crateRef = useRef<HTMLDivElement | null>(null);
  const waveSectionRef = useRef<HTMLElement | null>(null);
  const wavePathRef = useRef<SVGPathElement | null>(null);
  const waveTextPathRef = useRef<SVGTextPathElement | null>(null);
  const waveTextRef = useRef<SVGTextElement | null>(null);
  const badgeRefs = useRef<Array<SVGGElement | null>>([]);
  const giantTrackRef = useRef<HTMLElement | null>(null);
  const giantCanvasRef = useRef<HTMLDivElement | null>(null);
  const downArrowLineRef = useRef<SVGPathElement | null>(null);
  const upArrowLineRef = useRef<SVGPathElement | null>(null);
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

  // Reusable Elastic Character Poke Engine (fixed fontSize lookup + resize invalidation)
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

  // Wave Marquee Band: SVG textPath driven by scroll velocity
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

    const loopLen = 960;
    const totalLen = pathEl.getTotalLength();

    const placeBadges = (baseOff: number) => {
      const span = totalLen || 1900;
      const spacing = span / 3;
      badgeRefs.current.forEach((g, idx) => {
        if (!g) return;
        const raw = ((baseOff + idx * spacing + 260) % span + span) % span;
        if (raw < 40 || raw > span - 40) {
          g.style.opacity = "0";
          return;
        }
        const pt = pathEl.getPointAtLength(raw);
        const p1 = pathEl.getPointAtLength(Math.max(0, raw - 8));
        const p2 = pathEl.getPointAtLength(Math.min(span, raw + 8));
        const deg = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
        g.setAttribute(
          "transform",
          `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${deg.toFixed(
            1
          )})`
        );
        g.style.opacity = "1";
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
        offset -= 95 * timeScale * dt;
        if (offset < -loopLen) offset += loopLen;
        if (offset > 0) offset -= loopLen;
      }

      tpEl.setAttribute("startOffset", `${offset.toFixed(1)}`);
      placeBadges(offset);
      raf = requestAnimationFrame(tick);
    };

    placeBadges(0);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) {
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
      io.disconnect();
    };
  }, [lang, reduced]);

  // Orbital Switcher with flash-free Curved Paint Wipe + Dipping Typography
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

  // 2D Multi-Directional Arc-Length Parameterized Bézier Camera (zero-rerender 60fps HUD)
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

      const rawStops: Pt[] = [
        { x: 0, y: 0 },
        { x: -toPxX(4), y: -toPxY(42) },
        { x: -toPxX(42), y: -toPxY(42) },
        { x: -toPxX(152), y: -toPxY(114) },
        { x: -toPxX(198), y: -toPxY(114) },
        { x: -toPxX(312), y: -toPxY(34) },
        { x: -toPxX(364), y: -toPxY(34) },
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

    const downLine = downArrowLineRef.current;
    const upLine = upArrowLineRef.current;
    const downLen = downLine ? downLine.getTotalLength() : 400;
    const upLen = upLine ? upLine.getTotalLength() : 400;
    if (downLine) {
      downLine.style.strokeDasharray = `${downLen} ${downLen + 4}`;
      downLine.style.strokeDashoffset = `${downLen}`;
    }
    if (upLine) {
      upLine.style.strokeDasharray = `${upLen} ${upLen + 4}`;
      upLine.style.strokeDashoffset = `${upLen}`;
    }

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

      if (downLine) {
        const pDown = clamp((smoothP - 0.25) / 0.2, 0, 1);
        downLine.style.strokeDashoffset = `${(downLen * (1 - pDown)).toFixed(1)}`;
      }
      if (upLine) {
        const pUp = clamp((smoothP - 0.56) / 0.2, 0, 1);
        upLine.style.strokeDashoffset = `${(upLen * (1 - pUp)).toFixed(1)}`;
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

    window.addEventListener("scroll", scheduleTick, { passive: true });
    window.addEventListener("resize", onResize);
    scheduleTick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", scheduleTick);
      window.removeEventListener("resize", onResize);
    };
  }, [lang, reduced]);

  const currentSlide = copy.slides[displayIdx];
  const prevBgColor = copy.slides[bgPrevIdx].bg;
  const nextBgColor = copy.slides[bgNextIdx].bg;

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
        {/* 3. Hero with Parabolic Poke Headlines + Frontal 1:1 3D Roll + Empty Crate */}
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

              <p className="ns-hero-subcap">{copy.heroSubcap}</p>
            </div>

            {/* 3D Unspooling Tape Roll suspended cleanly in open runway into crate */}
            <HeroTapeCanvas
              crateRef={crateRef}
              reduced={reduced}
              resetKey={tapeResetKey}
              onCut={() => setCrateSealed(true)}
            />

            {/* Lower Kraft Corridor: 3D Curling Sticky Note + Empty Crate + Ledger */}
            <div className="ns-hero-bottom">
              <div className="ns-note-column">
                <StickyNoteWebGL
                  reduced={reduced}
                  noteLines={copy.stickyNoteLines}
                />
                <p className="ns-hand-note">{copy.handNoteLeft}</p>
              </div>

              <div ref={crateRef} className="ns-crate-stage">
                <div className="ns-crate-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/nosku/crate-empty.png"
                    alt="Empty open kraft cardboard crate stamped NO SKU // 000"
                  />
                  <div
                    className={`ns-crate-seal-banner ${
                      crateSealed ? "is-sealed" : ""
                    }`}
                  >
                    {copy.crateSealedBanner}
                  </div>
                </div>
                <div className="ns-crate-caption">
                  <span>{copy.crateCaptionLeft}</span>
                  {crateSealed ? (
                    <button
                      type="button"
                      className="ns-reroll-btn"
                      onClick={() => {
                        setCrateSealed(false);
                        setTapeResetKey((k) => k + 1);
                      }}
                    >
                      {copy.rerollTape}
                    </button>
                  ) : (
                    <span>{copy.crateCaptionRightPending}</span>
                  )}
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

        {/* 4. Scroll-Velocity Wave Marquee Band */}
        <section
          ref={waveSectionRef}
          className="ns-wave-band"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1600 220"
            preserveAspectRatio="xMidYMid slice"
            className="ns-wave-svg"
          >
            <defs>
              <path
                ref={wavePathRef}
                id="ns-wave-path"
                d="M -200 120 Q 200 35 600 120 T 1400 120 T 2200 120 T 3000 120"
              />
            </defs>

            <text ref={waveTextRef} className="ns-wave-text">
              <textPath ref={waveTextPathRef} href="#ns-wave-path" startOffset="0">
                {`${copy.waveHead}   •   ${copy.waveTail}   •   ${copy.waveHead}   •   ${copy.waveTail}   •   ${copy.waveHead}   •   ${copy.waveTail}   •   `}
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
                <rect x="-56" y="-17" width="112" height="34" rx="17" />
                <text x="0" y="1">
                  {badgeText}
                </text>
              </g>
            ))}
          </svg>
        </section>

        {/* 5. Orbital 6-Specimen Selector + Curved Paint Wipe */}
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

            {/* Center Monolithic Word + Taped Card */}
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
                <span className="ns-key-card-tape" aria-hidden="true" />
                <div className="ns-key-card-media">
                  {currentSlide.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.imageAlt ?? currentSlide.word}
                    />
                  ) : (
                    <KineticSlideArtwork
                      id={currentSlide.id}
                      ink={currentSlide.ink}
                    />
                  )}
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

        {/* 6. 2D Multi-Directional Camera Canvas (giant-pinning) */}
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

              {/* Diagonal Down-Right Self-Drawing Vector Arrow */}
              <div className="ns-diag-down-arrow" aria-hidden="true">
                <svg viewBox="0 0 320 220">
                  <path
                    ref={downArrowLineRef}
                    d="M 16 18 C 110 72, 198 134, 294 196 M 258 198 L 298 199 L 284 162"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
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

              {/* Diagonal Up-Right Self-Drawing Vector Arrow */}
              <div className="ns-diag-up-arrow" aria-hidden="true">
                <svg viewBox="0 0 320 220">
                  <path
                    ref={upArrowLineRef}
                    d="M 18 198 C 118 148, 206 86, 296 22 M 260 20 L 300 20 L 288 58"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Row 3 */}
              <div className="ns-giant-row ns-giant-row--3">
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

      {/* 8. Physics Bouncing Sticker Balls Footer */}
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
