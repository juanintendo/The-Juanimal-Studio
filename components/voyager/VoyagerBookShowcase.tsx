"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { VoyagerLayerSet, VoyagerSpreadSpec } from "./VoyagerBook3D";

const VoyagerBook3D = dynamic(() => import("./VoyagerBook3D"), {
  ssr: false,
  loading: () => <div className="vg-loading-stage">...</div>,
});

function makeLayerSet(folder: string): VoyagerLayerSet {
  const base = `/images/voyager/layers/${folder}`;
  return {
    bg: `${base}/bg.png`,
    letters: {
      en: `${base}/letters-en.png`,
      es: `${base}/letters-es.png`,
    },
    mid: `${base}/mid.png`,
    fg: `${base}/fg.png`,
    text: {
      en: `${base}/text-en.png`,
      es: `${base}/text-es.png`,
    },
    thumb: `${base}/thumb.png`,
  };
}

const COVER_LAYERS = makeLayerSet("cover");
const BACK_COVER_LAYERS = makeLayerSet("back-cover");

const SPREADS: VoyagerSpreadSpec[] = [
  {
    id: "spread-01",
    layers: makeLayerSet("spread-01"),
    navLabel: { en: "Look Up!", es: "¡Mira Arriba!" },
    title: {
      en: "Look Up — A Tiny Explorer Far Away",
      es: "Mira Arriba — Una Nave Muy Lejana",
    },
    story: {
      en: "Long before you were born, dreamers launched Voyager 1—a brave golden explorer racing past the stars with Maca keeping watch.",
      es: "Mucho antes de que nacieras, unos soñadores lanzaron a Voyager 1: una nave dorada que viaja entre estrellas con Maca mirando el cielo.",
    },
    macaFact: {
      en: "Voyager 1 left Earth in 1977 and has never come home—it is now the farthest human-made object in the entire universe!",
      es: "Voyager 1 despegó en 1977 y nunca ha regresado: hoy es el objeto creado por humanos más lejano del universo.",
    },
    parentPrompt: {
      en: "Ask together: If you pointed a cardboard telescope at the sky tonight, what faraway world would you say hello to first?",
      es: "Pregunta en familia: Si apuntaras un telescopio de cartón al cielo esta noche, ¿a qué mundo lejano saludarías primero?",
    },
  },
  {
    id: "spread-02",
    layers: makeLayerSet("spread-02"),
    navLabel: { en: "Blast Off", es: "Despegue" },
    title: {
      en: "Blast Off on a Pillar of Fire",
      es: "Despegue en un Pilar de Fuego",
    },
    story: {
      en: "WHOOOOSH! On a bright September morning, a roaring orange rocket lifted Voyager past rainforests and oceans as Maca cheered.",
      es: "¡FUUUUM! Una mañana luminosa de septiembre, un cohete gigante rugió hacia las nubes mientras Maca celebraba su viaje.",
    },
    macaFact: {
      en: "Voyager speeds at more than 61,000 kilometers per hour—faster than twenty racing jets flying nose to tail!",
      es: "Voyager viaja a más de 61.000 kilómetros por hora: ¡más rápido que veinte aviones de carreras juntos!",
    },
    parentPrompt: {
      en: "Count down from 5 to 1 together and flap your brightest macaw wings like Maca climbing into the clouds!",
      es: "¡Cuenten juntos del 5 al 1 y agiten sus alas de guacamaya como Maca subiendo hasta las nubes!",
    },
  },
  {
    id: "spread-03",
    layers: makeLayerSet("spread-03"),
    navLabel: { en: "Jupiter", es: "Júpiter" },
    title: {
      en: "Jupiter's Giant Swirls and Moons",
      es: "Las Tormentas de Júpiter y sus Lunas",
    },
    story: {
      en: "Voyager buzzed past marbled Jupiter and spotted orange volcanoes erupting on moon Io—beside a swirling hurricane wider than our Earth.",
      es: "Voyager rozó las nubes rayadas de Júpiter y descubrió volcanes activos en Ío, junto a una gran tormenta donde cabría la Tierra.",
    },
    macaFact: {
      en: "Jupiter's Great Red Spot is a spinning storm larger than planet Earth that has been swirling for over three centuries!",
      es: "La Gran Mancha Roja de Júpiter es un huracán más grande que la Tierra entera que lleva girando más de tres siglos.",
    },
    parentPrompt: {
      en: "Which crayon colors would you grab to draw Jupiter's striped clouds—tangerine, honey yellow, or hot volcanic cinnamon?",
      es: "¿Qué crayones elegirías para pintar las nubes de Júpiter: mandarina, miel o rojo volcán?",
    },
  },
  {
    id: "spread-04",
    layers: makeLayerSet("spread-04"),
    navLabel: { en: "Saturn", es: "Saturno" },
    title: {
      en: "Dancing Through Saturn's Icy Rings",
      es: "Bailando en los Anillos de Saturno",
    },
    story: {
      en: "Then came Saturn's glittering ribbon of icy jewels—stretching wider than Earth to the Moon yet thinner than a backyard slide.",
      es: "Después brillaron los anillos mágicos de Saturno, hechos de millones de cristales de hielo bailando en el silencio azul.",
    },
    macaFact: {
      en: "Saturn's rings stretch wider than Earth to the Moon, yet in many places they are thinner than a backyard slide!",
      es: "Los anillos de Saturno son anchísimos, pero en muchas partes son más delgados que un tobogán del parque.",
    },
    parentPrompt: {
      en: "Look closely! Can you spot the cosmic cat gliding through Saturn's rainbow rings while Maca flies alongside Voyager?",
      es: "¡Mira con lupa! ¿Ves al gatito espacial flotando en los anillos mientras Maca vuela junto a Voyager?",
    },
  },
  {
    id: "spread-05",
    layers: makeLayerSet("spread-05"),
    navLabel: { en: "Golden Song", es: "Disco de Oro" },
    title: {
      en: "The Golden Record — Earth's Mixtape",
      es: "El Disco de Oro — Canción del Planeta",
    },
    story: {
      en: "Bolted to Voyager's side rides a copper record plated in gold—carrying whale songs, guitars, laughter, Beethoven, and hellos in 55 languages.",
      es: "Sujeto a la nave viaja un disco dorado lleno de cantos de ballena, risas, lluvia suave, guitarras y saludos en 55 idiomas.",
    },
    macaFact: {
      en: "A tiny six-year-old boy named Nick Sagan recorded Earth's warm greeting: 'Hello from the children of planet Earth!'",
      es: "Un niño de seis años llamado Nick Sagan grabó el saludo más tierno del disco: «¡Hola de parte de los niños del planeta Tierra!».",
    },
    parentPrompt: {
      en: "Tap the Golden Record pill below! Pick 1 favorite song and 1 home sound you would pack inside our family time capsule.",
      es: "¡Toca el botón del Disco de Oro! Elijan juntos 1 canción favorita y 1 sonido de casa para enviar a las estrellas.",
    },
  },
  {
    id: "spread-06",
    layers: makeLayerSet("spread-06"),
    navLabel: { en: "Blue Dot", es: "Punto Azul" },
    title: {
      en: "One Tiny Pale Blue Dot — Our Home",
      es: "Un Pequeño Punto Azul — Nuestro Hogar",
    },
    story: {
      en: "Six billion kilometers away, Voyager looked back through a sunbeam and photographed Earth—one tiny blue spark holding every child and dream.",
      es: "A seis mil millones de kilómetros, Voyager miró atrás y fotografió la Tierra en un rayo de sol: un puntito azul donde cabe todo nuestro amor.",
    },
    macaFact: {
      en: "Voyager 1 is now in interstellar space beyond our Sun, yet faint radio whispers still arrive on Earth more than 22 hours later!",
      es: "Voyager 1 ya navega en el espacio interestelar: sus débiles susurros de radio tardan más de 22 horas en llegar a la Tierra.",
    },
    parentPrompt: {
      en: "Carl Sagan reminded us that seeing Earth so small teaches us to be kinder to one another and to care for our only pale blue dot.",
      es: "Carl Sagan nos recordó que ver la Tierra tan chiquita nos invita a cuidarla con ternura y ser más amables entre todos.",
    },
  },
];

interface RecordTrack {
  id: string;
  code: string;
  color: string;
  label: Record<"en" | "es", string>;
  note: Record<"en" | "es", string>;
}

const RECORD_TRACKS: RecordTrack[] = [
  {
    id: "greetings",
    code: "01",
    color: "#FFD166",
    label: { en: "55 Hellos + Kids' Greeting", es: "55 Saludos + Voz Infantil" },
    note: {
      en: '"Hello from the children of planet Earth" in English plus warm greetings in Spanish ("Hola y saludos a todos"), Mandarin, Quechua & 51 more languages.',
      es: '«¡Hola de parte de los niños del planeta Tierra!» en inglés, junto a «Hola y saludos a todos» en español, quechua y 52 idiomas más.',
    },
  },
  {
    id: "whales",
    code: "02",
    color: "#98DCE6",
    label: { en: "Humpback Whale Songs", es: "Cantos de Ballenas Jorobadas" },
    note: {
      en: "Deep underwater melodies recorded in the Pacific Ocean so alien listeners know the Earth sings even beneath its waves.",
      es: "Melodías submarinas grabadas en el océano Pacífico para contarle al universo que la Tierra también canta bajo el agua.",
    },
  },
  {
    id: "earth-sounds",
    code: "03",
    color: "#9BE0A2",
    label: { en: "Laughter, Birds & Heartbeat", es: "Risas, Aves y Latidos" },
    note: {
      en: "An audio postcard of life on Earth: crackling campfires, rainforest birds calling like Maca, gentle rain, a kiss, and a human heartbeat.",
      es: "Una postal sonora de la vida: fogatas crepitando, aves de la selva como Maca, lluvia suave, un beso y un latido del corazón.",
    },
  },
  {
    id: "johnny-b-goode",
    code: "04",
    color: "#E84A3A",
    label: { en: "Chuck Berry — Rock & Roll", es: "Chuck Berry — Rock & Roll" },
    note: {
      en: '"Johnny B. Goode" blazing from an electric guitar so stars light-years away can tap their toes to joyful human rhythm.',
      es: "«Johnny B. Goode» sonando a todo ritmo para demostrar que los humanos también sabemos bailar con guitarra eléctrica.",
    },
  },
  {
    id: "el-cascabel",
    code: "05",
    color: "#F4A236",
    label: { en: "Peruvian Panpipes & El Cascabel", es: "Siku Peruano y El Cascabel" },
    note: {
      en: "Vibrant harp strings from Veracruz, Mexico and soaring Andean panpipes from Peru flying together into interstellar night.",
      es: "Arpa jarocha de Veracruz (México) y zampoñas andinas del Perú viajando juntas hacia las estrellas más lejanas.",
    },
  },
];

const UI_COPY = {
  en: {
    backLabel: "Back to work",
    logoAria: "Voyager 1 Storybook — Return to front cover",
    openBookBtn: "Open Storybook",
    prevAria: "Previous page",
    nextAria: "Next page",
    prevWord: "Prev",
    nextWord: "Next",
    navAria: "Illustrated storybook chapter selector",
    coverLabel: "Cover",
    endLabel: "The End",
    tiltOn: "3D Tilt On",
    tiltOff: "3D Tilt",
    macaTrigger: "Maca's Fact & Parent Spark",
    macaFactTitle: "Maca's Explorer Note",
    parentPromptTitle: "Bedtime Question Together",
    closePopoverAria: "Close Maca note",
    exploreRecordBtn: "Spin the Golden Record",
    modalEyebrow: "VOYAGER 1 • GOLDEN RECORD PLAYER",
    modalTitle: "Earth's Golden Time Capsule",
    modalSubtitle:
      "Pick any engraved track below to spin the shiny Golden Record and see what humanity packed for faraway stars.",
    closeModalAria: "Close Golden Record Explorer",
    extraEyebrow: "MISSION ACCOMPLISHED • BEYOND THE STARS",
    extraTitle: "Keep Exploring the Universe Together",
    extraCopy:
      "Voyager 1 is over 24 billion kilometers from home — still whispering science back to kids and grownups on Earth. Read our real-life mission picks:",
    resources: [
      {
        title: "NASA Eyes on the Solar System (Voyager Live)",
        href: "https://science.nasa.gov/mission/voyager/",
        desc: "See exactly how far Voyager 1 is from Earth right this second.",
      },
      {
        title: "NASA Golden Record Sounds & Greetings",
        href: "https://science.nasa.gov/mission/voyager/golden-record-contents/",
        desc: "Listen to the real 55 greetings and whale songs stored on the copper disc.",
      },
      {
        title: "Pale Blue Dot Original Story",
        href: "https://science.nasa.gov/resource/voyager-1s-pale-blue-dot/",
        desc: "Discover how NASA turned Voyager's camera around one last time.",
      },
      {
        title: "NASA Space Place For Kids",
        href: "https://spaceplace.nasa.gov/",
        desc: "Games, crafts, and starry experiments built for curious young astronauts.",
      },
    ],
    replayBookBtn: "Read Again from Cover",
    coverMainTitle: "Voyager 1",
  },
  es: {
    backLabel: "Volver al portafolio",
    logoAria: "Voyager 1 — Volver a la portada",
    openBookBtn: "Abrir el Libro",
    prevAria: "Página anterior",
    nextAria: "Página siguiente",
    prevWord: "Atrás",
    nextWord: "Seguir",
    navAria: "Selector ilustrado de capítulos del cuento",
    coverLabel: "Portada",
    endLabel: "Final",
    tiltOn: "Inclinación 3D Activa",
    tiltOff: "Inclinación 3D",
    macaTrigger: "Dato de Maca + Pregunta",
    macaFactTitle: "Nota Exploradora de Maca",
    parentPromptTitle: "Chispa para Conversar Antes de Dormir",
    closePopoverAria: "Cerrar nota de Maca",
    exploreRecordBtn: "Girar el Disco de Oro",
    modalEyebrow: "VOYAGER 1 • TOCADISCOS CÓSMICO",
    modalTitle: "La Cápsula Dorada del Planeta",
    modalSubtitle:
      "Toca cualquiera de los surcos abajo para hacer girar el Disco de Oro y descubrir qué sonidos envió la Tierra al universo.",
    closeModalAria: "Cerrar Explorador del Disco de Oro",
    extraEyebrow: "MISIÓN CUMPLIDA • MÁS ALLÁ DEL SOL",
    extraTitle: "Sigamos Explorando el Universo Juntos",
    extraCopy:
      "Voyager 1 ya superó los 24 mil millones de kilómetros desde casa y aún envía ciencia a la Tierra. Sigue curioseando con enlaces reales de la NASA:",
    resources: [
      {
        title: "NASA Voyager — Misión en Tiempo Real",
        href: "https://science.nasa.gov/mission/voyager/",
        desc: "Mira la distancia exacta a la que vuela Voyager 1 en este preciso instante.",
      },
      {
        title: "Sonidos y Saludos del Disco de Oro",
        href: "https://science.nasa.gov/mission/voyager/golden-record-contents/",
        desc: "Escucha los 55 saludos reales y los cantos de ballena grabados en el disco.",
      },
      {
        title: "Historia Original del Punto Azul Pálido",
        href: "https://science.nasa.gov/resource/voyager-1s-pale-blue-dot/",
        desc: "Descubre cómo la NASA giró la cámara de Voyager para fotografiar nuestro hogar.",
      },
      {
        title: "NASA Space Place en Español para Niños",
        href: "https://spaceplace.nasa.gov/sp/",
        desc: "Juegos, manualidades y misterios estelares creados para pequeños astronautas.",
      },
    ],
    replayBookBtn: "Volver a Leer desde Portada",
    coverMainTitle: "Voyager 1",
  },
} as const;

function VoyagerHandLogo({
  onClick,
  ariaLabel,
  subLabel,
}: {
  onClick: () => void;
  ariaLabel: string;
  subLabel: string;
}) {
  return (
    <button
      type="button"
      className="vg-hand-logo-btn"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 212 46"
        className="vg-hand-logo-svg"
        role="img"
        aria-hidden="true"
      >
        <g filter="url(#vgCrayonTex)">
          <ellipse
            cx="24"
            cy="22"
            rx="16"
            ry="6.5"
            transform="rotate(-18 24 22)"
            fill="none"
            stroke="#98DCE6"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="24" cy="22" r="8.2" fill="#F4A236" stroke="#182046" strokeWidth="1.4" />
          <path
            d="M 10,26 Q 24,29 38,18"
            fill="none"
            stroke="#FFD166"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M 192,10 L 195,15 L 201,15 L 196,19 L 198,25 L 192,21 L 186,25 L 188,19 L 183,15 L 189,15 Z"
            fill="#FFD166"
          />
          <path
            d="M 48,38 Q 112,42 180,35"
            fill="none"
            stroke="#E84A3A"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
        <text x="114" y="29" textAnchor="middle" className="vg-hand-logo-word">
          Voyager 1
        </text>
      </svg>
      <span className="sr-only">{subLabel}</span>
    </button>
  );
}

function CrayonArrowSvg({ direction }: { direction: "prev" | "next" }) {
  const isNext = direction === "next";
  return (
    <svg viewBox="0 0 88 52" className="vg-crayon-arrow-svg" aria-hidden="true">
      <g
        filter="url(#vgCrayonTex)"
        transform={isNext ? undefined : "translate(88 0) scale(-1 1)"}
      >
        <path
          d="M 12,27 Q 41,22 72,26"
          fill="none"
          stroke="#E84A3A"
          strokeWidth="8.5"
          strokeLinecap="round"
        />
        <path
          d="M 55,10 Q 67,18 75,26 Q 66,34 55,42"
          fill="none"
          stroke="#E84A3A"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 13,26 Q 42,22 71,26"
          fill="none"
          stroke="#FFD166"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M 56,11 Q 67,19 74,26 Q 66,34 56,41"
          fill="none"
          stroke="#FFF7E6"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function VoyagerBookShowcase() {
  const { lang, setLang } = useLanguage();
  const reduced = usePrefersReducedMotion();
  const maxPage = SPREADS.length + 1;
  const [page, setPage] = useState(0);
  const [macaOpen, setMacaOpen] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);
  const [hasGyroPermissionApi, setHasGyroPermissionApi] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const wheelLockRef = useRef(0);

  const ui = UI_COPY[lang];
  const currentSpread =
    page >= 1 && page <= SPREADS.length ? SPREADS[page - 1] : null;
  const activeTrack = RECORD_TRACKS[activeTrackIdx] ?? RECORD_TRACKS[0];

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof (
        window.DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        }
      )?.requestPermission === "function"
    ) {
      setHasGyroPermissionApi(true);
    }
  }, []);

  const requestGyro = useCallback(async () => {
    try {
      const api = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (api?.requestPermission) {
        const res = await api.requestPermission();
        if (res === "granted") {
          setGyroActive(true);
        }
      }
    } catch {
      // Ignore permission rejection gracefully
    }
  }, []);

  const goToPage = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(maxPage, next));
      setPage(clamped);
      setMacaOpen(false);
      if (clamped !== 5) {
        setRecordModalOpen(false);
      }
    },
    [maxPage]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (recordModalOpen) setRecordModalOpen(false);
        else if (macaOpen) setMacaOpen(false);
        return;
      }
      if (recordModalOpen) return;
      if (e.key === "ArrowRight") {
        goToPage(page + 1);
      } else if (e.key === "ArrowLeft") {
        goToPage(page - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [page, macaOpen, recordModalOpen, goToPage]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (recordModalOpen || page >= maxPage) return;
      if (Math.abs(e.deltaY) < 28 && Math.abs(e.deltaX) < 28) return;
      const now = performance.now();
      if (now - wheelLockRef.current < 380) return;
      wheelLockRef.current = now;
      if (e.deltaY > 28 || e.deltaX > 28) {
        goToPage(page + 1);
      } else if (e.deltaY < -28 || e.deltaX < -28) {
        goToPage(page - 1);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [page, maxPage, recordModalOpen, goToPage]);

  const medallions = [
    {
      id: "cover",
      thumb: COVER_LAYERS.thumb,
      label: { en: ui.coverLabel, es: UI_COPY.es.coverLabel },
    },
    ...SPREADS.map((sp) => ({
      id: sp.id,
      thumb: sp.layers.thumb,
      label: sp.navLabel,
    })),
    {
      id: "back-cover",
      thumb: BACK_COVER_LAYERS.thumb,
      label: { en: ui.endLabel, es: UI_COPY.es.endLabel },
    },
  ];

  return (
    <div className="vg-page">
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <defs>
          <filter id="vgCrayonTex">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.065"
              numOctaves="3"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="vg-cosmos-bg" aria-hidden="true" />

      <header className="vg-topbar">
        <div className="vg-topbar-left">
          <Link href="/" className="vg-back-btn">
            <span aria-hidden="true">←</span>
            <span>{ui.backLabel}</span>
          </Link>
        </div>

        <div className="vg-topbar-center">
          <VoyagerHandLogo
            onClick={() => goToPage(0)}
            ariaLabel={ui.logoAria}
            subLabel={ui.coverMainTitle}
          />
        </div>

        <div className="vg-topbar-right">
          {hasGyroPermissionApi ? (
            <button
              type="button"
              className={`vg-tilt-btn ${gyroActive ? "is-active" : ""}`}
              onClick={requestGyro}
              aria-pressed={gyroActive}
            >
              ◎ {gyroActive ? ui.tiltOn : ui.tiltOff}
            </button>
          ) : null}

          <div className="vg-lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={`vg-lang-btn ${lang === "en" ? "is-active" : ""}`}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <button
              type="button"
              className={`vg-lang-btn ${lang === "es" ? "is-active" : ""}`}
              onClick={() => setLang("es")}
              aria-pressed={lang === "es"}
            >
              ES
            </button>
          </div>
        </div>
      </header>

      <main className="vg-book-stage">
        <VoyagerBook3D
          page={page}
          onChangePage={goToPage}
          lang={lang}
          reduced={reduced}
          gyroActive={gyroActive}
          spreads={SPREADS}
          coverLayers={COVER_LAYERS}
          backCoverLayers={BACK_COVER_LAYERS}
          coverMainTitle={ui.coverMainTitle}
        />

        {page > 0 ? (
          <button
            type="button"
            className="vg-crayon-arrow is-prev"
            onClick={() => goToPage(page - 1)}
            aria-label={ui.prevAria}
          >
            <CrayonArrowSvg direction="prev" />
            <span className="vg-crayon-arrow-label">{ui.prevWord}</span>
          </button>
        ) : null}

        {page < maxPage ? (
          <button
            type="button"
            className="vg-crayon-arrow is-next"
            onClick={() => goToPage(page + 1)}
            aria-label={ui.nextAria}
          >
            <CrayonArrowSvg direction="next" />
            <span className="vg-crayon-arrow-label">{ui.nextWord}</span>
          </button>
        ) : null}

        {page === 0 ? (
          <div className="vg-cover-cta-wrap">
            <button
              type="button"
              className="vg-enter-btn"
              onClick={() => goToPage(1)}
            >
              <span>{ui.openBookBtn}</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : null}

        {currentSpread ? (
          <>
            <div className="sr-only" aria-live="polite">
              {currentSpread.title[lang]} — {currentSpread.story[lang]}
            </div>

            <div className="vg-maca-dock">
              {macaOpen ? (
                <section className="vg-maca-popover" aria-label={ui.macaFactTitle}>
                  <div className="vg-maca-popover-head">
                    <span className="vg-maca-tag">🦜 {ui.macaFactTitle}</span>
                    <button
                      type="button"
                      className="vg-maca-close"
                      onClick={() => setMacaOpen(false)}
                      aria-label={ui.closePopoverAria}
                    >
                      ×
                    </button>
                  </div>
                  <p className="vg-maca-fact-text">
                    {currentSpread.macaFact[lang]}
                  </p>
                  <div className="vg-maca-divider" />
                  <p className="vg-maca-prompt-eyebrow">
                    {ui.parentPromptTitle}
                  </p>
                  <p className="vg-maca-prompt-text">
                    {currentSpread.parentPrompt[lang]}
                  </p>
                </section>
              ) : null}

              <div className="vg-maca-actions">
                {currentSpread.id === "spread-05" ? (
                  <button
                    type="button"
                    className="vg-dock-pill is-gold"
                    onClick={() => setRecordModalOpen(true)}
                  >
                    ◎ {ui.exploreRecordBtn}
                  </button>
                ) : null}
                <button
                  type="button"
                  className={`vg-dock-pill ${macaOpen ? "is-open" : ""}`}
                  onClick={() => setMacaOpen((v) => !v)}
                  aria-expanded={macaOpen}
                >
                  🦜 {ui.macaTrigger}
                </button>
              </div>
            </div>
          </>
        ) : null}

        <aside
          className={`vg-extra-resources ${page === maxPage ? "is-open" : ""}`}
          aria-hidden={page !== maxPage}
        >
          <p className="vg-extra-eyebrow">{ui.extraEyebrow}</p>
          <h2 className="vg-extra-title">{ui.extraTitle}</h2>
          <p className="vg-extra-copy">{ui.extraCopy}</p>
          <ul className="vg-resource-list">
            {ui.resources.map((res) => (
              <li key={res.href}>
                <a
                  href={res.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vg-resource-link"
                >
                  <strong>{res.title} ↗</strong>
                  <span>{res.desc}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="vg-extra-actions">
            <button
              type="button"
              className="vg-replay-btn"
              onClick={() => goToPage(0)}
            >
              ↺ {ui.replayBookBtn}
            </button>
            <Link href="/" className="vg-portfolio-link">
              {ui.backLabel}
            </Link>
          </div>
        </aside>
      </main>

      <nav className="vg-medallion-nav" aria-label={ui.navAria}>
        {medallions.map((item, idx) => {
          const isActive = page === idx;
          const label =
            idx === 0
              ? ui.coverLabel
              : idx === maxPage
                ? ui.endLabel
                : item.label[lang];
          const arcId = `vg-medallion-arc-${idx}`;
          return (
            <button
              key={item.id}
              type="button"
              className={`vg-medallion-btn ${isActive ? "is-active" : ""}`}
              onClick={() => goToPage(idx)}
              aria-label={`${idx + 1}. ${label}`}
              aria-current={isActive ? "page" : undefined}
              title={label}
            >
              {isActive ? (
                <svg
                  className="vg-medallion-arc-svg"
                  viewBox="0 0 124 124"
                  aria-hidden="true"
                >
                  <defs>
                    <path id={arcId} d="M 16,66 A 46,46 0 1,1 108,66" />
                  </defs>
                  <text className="vg-medallion-arc-text">
                    <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
                      {`• ${label} •`}
                    </textPath>
                  </text>
                </svg>
              ) : null}
              <span
                className="vg-medallion-disc"
                style={{
                  backgroundImage: `url("${item.thumb}")`,
                  backgroundPosition: "center",
                }}
              />
            </button>
          );
        })}
      </nav>

      {recordModalOpen ? (
        <div
          className="vg-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={ui.modalTitle}
        >
          <div className="vg-modal-card">
            <button
              type="button"
              className="vg-modal-close"
              onClick={() => setRecordModalOpen(false)}
              aria-label={ui.closeModalAria}
            >
              ×
            </button>

            <p className="vg-modal-eyebrow">{ui.modalEyebrow}</p>
            <h2 className="vg-modal-title">{ui.modalTitle}</h2>
            <p className="vg-modal-subtitle">{ui.modalSubtitle}</p>

            <div className="vg-modal-grid">
              <div className="vg-record-stage">
                <svg
                  viewBox="0 0 260 260"
                  className={`vg-record-svg ${!reduced ? "is-spinning" : ""}`}
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="vgGoldGrad" cx="42%" cy="38%" r="62%">
                      <stop offset="0%" stopColor="#FFF0A8" />
                      <stop offset="42%" stopColor="#F2B63D" />
                      <stop offset="78%" stopColor="#C97F17" />
                      <stop offset="100%" stopColor="#7C4B0C" />
                    </radialGradient>
                  </defs>
                  <circle
                    cx="130"
                    cy="130"
                    r="118"
                    fill="url(#vgGoldGrad)"
                    stroke="#FFF7E6"
                    strokeWidth="2.5"
                  />
                  {[98, 86, 74, 62, 50].map((r) => (
                    <circle
                      key={r}
                      cx="130"
                      cy="130"
                      r={r}
                      fill="none"
                      stroke="rgba(59, 34, 6, 0.36)"
                      strokeWidth="1.2"
                      strokeDasharray={r === 74 ? "6 4" : undefined}
                    />
                  ))}
                  <circle
                    cx="130"
                    cy="130"
                    r="32"
                    fill="#2A1D0D"
                    stroke="#FFD166"
                    strokeWidth="2"
                  />
                  <circle cx="130" cy="130" r="7" fill="#FFF7E6" />
                  <line
                    x1="88"
                    y1="68"
                    x2="108"
                    y2="88"
                    stroke="#FFF0B8"
                    strokeWidth="1.8"
                  />
                  <circle cx="108" cy="88" r="3" fill={activeTrack.color} />
                </svg>
              </div>

              <div className="vg-track-list">
                {RECORD_TRACKS.map((track, idx) => {
                  const selected = idx === activeTrackIdx;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      className={`vg-track-btn ${selected ? "is-selected" : ""}`}
                      onClick={() => setActiveTrackIdx(idx)}
                      style={{
                        borderColor: selected ? track.color : undefined,
                      }}
                    >
                      <span
                        className="vg-track-code"
                        style={{ backgroundColor: track.color }}
                      >
                        {track.code}
                      </span>
                      <span className="vg-track-text">
                        <strong>{track.label[lang]}</strong>
                        <span>{track.note[lang]}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default VoyagerBookShowcase;
