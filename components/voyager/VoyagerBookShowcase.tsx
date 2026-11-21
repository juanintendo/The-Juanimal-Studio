"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  VoyagerBook3D,
  VoyagerSpreadSpec,
} from "@/components/voyager/VoyagerBook3D";

const SPREADS: VoyagerSpreadSpec[] = [
  {
    id: "hello",
    image: "/images/voyager/spread-01-hello.png",
    title: {
      en: "For Curious Kids & Grown-Ups",
      es: "Para Niños Curiosos y Grandes",
    },
    story: {
      en: "Look up on a quiet evening and a billion tiny stars blink back. Long before you were born, a team of dreamers built a brave golden robot — Voyager 1 — and sent our planet's biggest 'hello' across the dark with Maca keeping watch.",
      es: "Mira al cielo en una noche tranquila y mil millones de estrellitas te devuelven el guiño. Mucho antes de que nacieras, un equipo de soñadores construyó un valiente robot dorado —la Voyager 1— para enviar el 'hola' más grande de la Tierra.",
    },
    macaFact: {
      en: "Voyager 1 is about the size of a small compact car — except its white umbrella dish is 3.7 meters wide so it can whisper all the way home!",
      es: "La Voyager 1 mide más o menos como un carro pequeño — ¡pero su plato blanco tipo paraguas mide 3.7 metros para poder susurrar hasta casa!",
    },
    parentPrompt: {
      en: "Ask together: If you could tape one drawing onto a spaceship, what would it show an alien friend?",
      es: "Pregúntenlo juntos: Si pudieras pegar un solo dibujo en una nave espacial, ¿qué le mostrarías a un amigo extraterrestre?",
    },
  },
  {
    id: "launch",
    image: "/images/voyager/spread-02-launch.png",
    title: {
      en: "Blast Off! September 5, 1977",
      es: "¡Despegue! 5 de Septiembre de 1977",
    },
    story: {
      en: "With a thunderous wax-crayon roar of orange and turquoise clouds, a Titan rocket boosted Voyager 1 past the treetops. Even the jungle tapir, curious monkey, and Maca cheered as humanity's longest road trip began!",
      es: "Con un rugido de crayón naranja y nubes turquesa, un cohete Titan impulsó a la Voyager 1 sobre los árboles. ¡Hasta el tapir, el monito curioso y Maca celebraron el viaje más largo de la historia!",
    },
    macaFact: {
      en: "Voyager left Earth cruising faster than 61,000 km per hour — quick enough to fly across the entire ocean in just a few minutes!",
      es: "¡Salió de la Tierra volando a más de 61,000 km por hora — tan rápido que cruzaría un océano entero en pocos minutos!",
    },
    parentPrompt: {
      en: "Ask together: Which animals from Earth do you think would make the best co-pilots in space?",
      es: "Pregúntenlo juntos: ¿Qué animales de la Tierra crees que serían los mejores copilotos espaciales?",
    },
  },
  {
    id: "jupiter",
    image: "/images/voyager/spread-03-jupiter.png",
    title: {
      en: "Hello, Giant Striped Jupiter",
      es: "Hola, Gigante Rayado Júpiter",
    },
    story: {
      en: "Two years later, Voyager floated past Jupiter — a swirling swirl of terracotta, honey, and cinnamon clouds larger than a thousand Earths combined! Its cameras caught pizza-spotted volcanoes erupting on moon Io for the very first time.",
      es: "Dos años después, la Voyager planeó junto a Júpiter — un remolino gigante de nubes terracota, miel y canela donde cabrían más de mil Tierras. ¡Sus cámaras descubrieron volcanes activos por primera vez en su luna Ío!",
    },
    macaFact: {
      en: "Jupiter's famous Great Red Spot isn't painted on — it's a giant spinning windstorm bigger than our entire planet Earth!",
      es: "La famosa Gran Mancha Roja de Júpiter no está pintada — ¡es una tormenta gigante girando más grande que todo nuestro planeta Tierra!",
    },
    parentPrompt: {
      en: "Ask together: Notice how Jupiter gets a 'gravity slingshot' boost — like swinging faster off a playground merry-go-round!",
      es: "Pregúntenlo juntos: Júpiter impulsó a la nave con su gravedad — ¡como cuando saltas tomando vuelo en un carrusel!",
    },
  },
  {
    id: "saturn",
    image: "/images/voyager/spread-04-saturn.png",
    title: {
      en: "Dancing on Saturn's Icy Hula Hoops",
      es: "Bailando en los Aros de Saturno",
    },
    story: {
      en: "Next came honey-gold Saturn, wearing glimmering pastel rings made of billions of floating icebergs and diamond dust. While a brave ginger kitten balanced on an ice ring, Voyager tilted north toward uncharted stars.",
      es: "Luego llegó Saturno en tonos miel dorada, luciendo anillos pastel hechos de miles de millones de témpanos de hielo espacial. Mientras un gatito curioso hacía equilibrio sobre el hielo, Voyager tomó rumbo hacia las estrellas.",
    },
    macaFact: {
      en: "Saturn's rings stretch hundreds of thousands of kilometers wide, yet in many places they are thinner than a backyard slide — sometimes only 10 meters thick!",
      es: "Los anillos de Saturno miden cientos de miles de kilómetros de ancho, pero en muchas zonas son tan delgados como una casa pequeña — ¡unos 10 metros!",
    },
    parentPrompt: {
      en: "Ask together: If Saturn's rings are sparkling snowballs, what would they sound like tumbling past our spaceship window?",
      es: "Pregúntenlo juntos: Si los anillos son bolas de nieve brillantes, ¿cómo crees que sonarían rozando nuestra nave?",
    },
  },
  {
    id: "record",
    image: "/images/voyager/spread-05-record.png",
    title: {
      en: "The Golden Record — Earth's Mixtape",
      es: "El Disco de Oro — Nuestra Cinta al Universo",
    },
    story: {
      en: "Bolted gently onto Voyager's golden side is a real copper record plated in shiny gold. Engraved with pulsar star maps and sound waves, it carries footsteps, laughter, humpback whales, Beethoven, Chuck Berry, and hellos in 55 tongues!",
      es: "Atornillado al costado de la Voyager viaja un disco real bañado en oro puro. Lleva grabados un mapa de estrellas púlsar, cantos de ballenas, risas, guitarra rock, música clásica y saludos en 55 idiomas — ¡incluido nuestro 'Hola y saludos a todos'!",
    },
    macaFact: {
      en: "Scientists tucked a needle right beside the record AND drew step-by-step instructions on the cover so alien musicians could play Earth's songs!",
      es: "¡Los científicos guardaron la aguja junto al disco y dibujaron las instrucciones en la tapa para que cualquier músico extraterrestre pudiera escucharnos!",
    },
    parentPrompt: {
      en: "Ask together: Pick 1 song and 1 everyday sound from your kitchen or garden to add to our family Golden Record!",
      es: "Pregúntenlo juntos: ¡Elijan 1 canción y 1 sonido cotidiano de su casa o jardín para añadirlo a su propio Disco de Oro!",
    },
  },
  {
    id: "dot",
    image: "/images/voyager/spread-06-dot.png",
    title: {
      en: "One Pale Blue Dot — & Still Whispering",
      es: "Un Punto Azul Pálido — Y Sigue Susurrando",
    },
    story: {
      en: "From 6 billion kilometers away, Voyager turned its camera back one last time and captured Earth suspended in a golden sunbeam — just one fragile, shimmering pale blue dot holding every child, bird, ocean, and story we love.",
      es: "A 6 mil millones de kilómetros, la Voyager giró su cámara por última vez y retrató a la Tierra suspendida en un rayo de sol — solo un frágil puntito azul pálido donde cabemos todos: niños, guacamayas, océanos y sueños.",
    },
    macaFact: {
      en: "Today Voyager 1 is over 24 billion kilometers from Earth inside Interstellar Space — the farthest human object ever built, still sending faint radio notes home!",
      es: "Hoy la Voyager 1 viaja a más de 24 mil millones de km en el espacio interestelar — el objeto humano más lejano de la historia, ¡y todavía responde por radio!",
    },
    parentPrompt: {
      en: "Ask together: Since everyone we have ever loved lives on that tiny blue marble, how should we care for it together?",
      es: "Pregúntenlo juntos: Si todas las personas y animales que queremos viven en esa canica azulita, ¿cómo la cuidamos hoy entre todos?",
    },
  },
];

interface RecordTrack {
  id: string;
  code: string;
  color: string;
  label: Record<"en" | "es", string>;
  quote: Record<"en" | "es", string>;
  detail: Record<"en" | "es", string>;
}

const RECORD_TRACKS: RecordTrack[] = [
  {
    id: "spanish",
    code: "01",
    color: "#E63946",
    label: { en: "Earth Greetings (EN / ES)", es: "Saludos de la Tierra (ES / EN)" },
    quote: {
      en: "\"Hola y saludos a todos\" & \"Hello from the children of planet Earth\"",
      es: "\"Hola y saludos a todos\" y \"Hello from the children of planet Earth\"",
    },
    detail: {
      en: "Spoken among 55 human languages compiled by Carl Sagan & team in 1977 so every corner of Earth was represented.",
      es: "Grabados entre 55 idiomas humanos reunidos por Carl Sagan en 1977 para representar a cada rincón de nuestro hogar.",
    },
  },
  {
    id: "whale",
    code: "02",
    color: "#2B7A78",
    label: { en: "Humpback Whale Songs", es: "Canto de Ballenas Jorobadas" },
    quote: {
      en: "\"Deep ocean melodies echoing across the Milky Way\"",
      es: "\"Melodías profundas del océano viajando por la Vía Láctea\"",
    },
    detail: {
      en: "Humans weren't the only Earthlings invited — whale greetings let distant listeners know Earth's seas sing too.",
      es: "No solo hablaron humanos — los cantos de ballena cuentan al universo que nuestros mares también saben cantar.",
    },
  },
  {
    id: "maca",
    code: "03",
    color: "#F4B942",
    label: { en: "Maca's Tropical Hello", es: "Saludo Tropical de Maca" },
    quote: {
      en: "\"Squawk-chime! Rainforest flutes + Chuck Berry's guitar!\"",
      es: "\"¡Flautas de selva, guacamayas y la guitarra de Chuck Berry!\"",
    },
    detail: {
      en: "The real disc actually includes panpipes from Peru, crickets, rain, thunderstorms, Mozart, Bach, and 'Johnny B. Goode'!",
      es: "¡El disco real incluye zampoñas andinas, grillos, lluvia, truenos, Mozart, Bach y 'Johnny B. Goode'!",
    },
  },
  {
    id: "pulsar",
    code: "04",
    color: "#A8DADC",
    label: { en: "14-Line Pulsar Star Map", es: "Mapa Estelar de 14 Púlsares" },
    quote: {
      en: "\" cosmic treasure lines pointing right back to our Sun\"",
      es: "\"14 líneas cósmicas indicando justo dónde queda nuestro Sol\"",
    },
    detail: {
      en: "Carved in gold aluminum so smart cosmic explorers could measure blinking pulsar stars and find Earth's exact street address.",
      es: "Tallado en aluminio dorado para que exploradores del futuro puedan leer las estrellas púlsar y ubicarnos.",
    },
  },
  {
    id: "dot",
    code: "05",
    color: "#FF85C0",
    label: { en: "Feb 14, 1990 • Pale Blue Dot", es: "14 Feb 1990 • Punto Azul Pálido" },
    quote: {
      en: "\"Just 0.12 pixels wide inside a warm band of scattered sunlight\"",
      es: "\"Apenas 0.12 píxeles de ancho flotando en un rayito de sol\"",
    },
    detail: {
      en: "Voyager snapped 60 final family portraits of our solar system before switching cameras off to save nuclear battery power.",
      es: "Voyager tomó 60 fotos finales de nuestro sistema solar antes de apagar sus cámaras para ahorrar batería camino a las estrellas.",
    },
  },
];

const UI_COPY = {
  en: {
    studioBack: "← JUANIMAL STUDIO",
    prevWork: "NO SKU #02",
    coverLabel: "FRONT COVER",
    backLabel: "RESOURCES & NOTES",
    spreadOf: (n: number, total: number) => `PAGE 0${n} OF 0${total}`,
    coverTopLine: "HOW TO TALK TO KIDS\nABOUT",
    coverMainTitle: "Voyager 1",
    coverTagline: "— A CRAYON GUIDE WITH MACA —",
    backColophon: "THE JUANIMAL STUDIO • PORTFOLIO #03\n4.7B+ KM FROM HOME IN CRAYON",
    openBookCta: "Open the Book →",
    dragHint: "Drag pages horizontally, scroll wheel, or use ← → arrows",
    factToggleOpen: "🦜 Hide Maca's Fact",
    factToggleClosed: "🦜 Maca's Fact & Parent Question",
    macaBadge: "MACA THE SCARLET MACAW SAYS:",
    exploreRecordBtn: "◎ Spin the Golden Record",
    modalEyebrow: "VOYAGER 1 • GOLDEN RECORD PLAYER",
    modalTitle: "Earth's Mixtape for the Stars",
    modalClose: "Close ✕",
    resourcesTitle: "Keep Exploring With Your Kids",
    resourcesLead:
      "Voyager 1 is still flying deeper into interstellar space every single second — curious kids welcome.",
    resources: [
      {
        verb: "Explore:",
        title: "NASA Eyes on the Solar System (Voyager Live)",
        href: "https://science.nasa.gov/mission/voyager/",
      },
      {
        verb: "Listen:",
        title: "NASA Golden Record Sounds & Greetings",
        href: "https://science.nasa.gov/mission/voyager/golden-record-contents/",
      },
      {
        verb: "Watch:",
        title: "Carl Sagan — Pale Blue Dot Portrait",
        href: "https://science.nasa.gov/resource/voyager-1s-pale-blue-dot/",
      },
      {
        verb: "Play:",
        title: "NASA Space Place For Kids",
        href: "https://spaceplace.nasa.gov/",
      },
    ],
    readAgain: "↺ Read Again from Cover",
    backHome: "← Portfolio Home",
  },
  es: {
    studioBack: "← JUANIMAL STUDIO",
    prevWork: "NO SKU #02",
    coverLabel: "PORTADA",
    backLabel: "RECURSOS Y NOTAS",
    spreadOf: (n: number, total: number) => `PÁGINA 0${n} DE 0${total}`,
    coverTopLine: "CÓMO HABLAR CON NIÑOS\nSOBRE LA",
    coverMainTitle: "Voyager 1",
    coverTagline: "— GUÍA EN CRAYÓN CON MACA —",
    backColophon: "THE JUANIMAL STUDIO • PORTAFOLIO #03\nUN VIAJE EN CRAYÓN AL ESPACIO",
    openBookCta: "Abrir el Libro →",
    dragHint: "Arrastra la página con el mouse o usa las flechas ← →",
    factToggleOpen: "🦜 Ocultar Dato de Maca",
    factToggleClosed: "🦜 Dato de Maca + Pregunta en Familia",
    macaBadge: "MACA LA GUACAMAYA ROJA DICE:",
    exploreRecordBtn: "◎ Girar el Disco de Oro",
    modalEyebrow: "VOYAGER 1 • REPRODUCTOR DEL DISCO DE ORO",
    modalTitle: "Nuestra Mixtape Para las Estrellas",
    modalClose: "Cerrar ✕",
    resourcesTitle: "Para Seguir Explorando Juntos",
    resourcesLead:
      "La Voyager 1 sigue adentrándose en el espacio interestelar cada segundo — el mejor libro empieza haciendo preguntas.",
    resources: [
      {
        verb: "Explora:",
        title: "NASA Voyager — Misión en Tiempo Real",
        href: "https://science.nasa.gov/mission/voyager/",
      },
      {
        verb: "Escucha:",
        title: "Los Saludos y Sonidos del Disco de Oro",
        href: "https://science.nasa.gov/mission/voyager/golden-record-contents/",
      },
      {
        verb: "Mira:",
        title: "Carl Sagan — El Punto Azul Pálido",
        href: "https://science.nasa.gov/resource/voyager-1s-pale-blue-dot/",
      },
      {
        verb: "Juega:",
        title: "NASA Space Place en Español para Niños",
        href: "https://spaceplace.nasa.gov/sp/",
      },
    ],
    readAgain: "↺ Volver a Leer desde Portada",
    backHome: "← Volver al Portafolio",
  },
};

export function VoyagerBookShowcase() {
  const { lang, setLang } = useLanguage();
  const reduced = usePrefersReducedMotion();

  const [page, setPage] = useState(0); // 0 = Cover, 1..6 = Spreads, 7 = Back Cover + Resources
  const [factOpen, setFactOpen] = useState(false);
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);

  const wheelLockRef = useRef(0);
  const maxPage = SPREADS.length + 1; // 7

  const ui = UI_COPY[lang];

  const goToPage = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(maxPage, next));
      setPage(clamped);
    },
    [maxPage]
  );

  // Keyboard Navigation (Left/Right arrows + Escape modal)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setRecordModalOpen(false);
        return;
      }
      if (recordModalOpen) return;
      if (e.key === "ArrowRight") {
        goToPage(page + 1);
      } else if (e.key === "ArrowLeft") {
        goToPage(page - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToPage, page, recordModalOpen]);

  // Debounced mouse-wheel page turning
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (recordModalOpen) return;
      const now = performance.now();
      if (now - wheelLockRef.current < 480) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const delta = absX > absY ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 28) return;

      wheelLockRef.current = now;
      if (delta > 0) goToPage(page + 1);
      else goToPage(page - 1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goToPage, page, recordModalOpen]);

  const currentSpread =
    page >= 1 && page <= SPREADS.length ? SPREADS[page - 1] : null;
  const activeTrack = RECORD_TRACKS[activeTrackIdx];

  const statusText =
    page === 0
      ? ui.coverLabel
      : page === maxPage
        ? ui.backLabel
        : ui.spreadOf(page, SPREADS.length);

  return (
    <div className="vg-page">
      {/* Subtle Cosmic Crayon Gallery Topbar */}
      <header className="vg-topbar">
        <div className="vg-topbar-left">
          <Link href="/" className="vg-top-brand">
            {ui.studioBack}
          </Link>
          <Link href="/work/no-sku" className="vg-top-link">
            {ui.prevWork}
          </Link>
        </div>

        <div className="vg-topbar-center">
          <span className="vg-status-pill">{statusText}</span>
        </div>

        <div className="vg-topbar-right">
          <div className="vg-lang-group" role="group" aria-label="Language">
            <button
              type="button"
              className={`vg-lang-btn ${lang === "en" ? "is-active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`vg-lang-btn ${lang === "es" ? "is-active" : ""}`}
              onClick={() => setLang("es")}
            >
              ES
            </button>
          </div>
          <button
            type="button"
            className="vg-record-btn"
            onClick={() => setRecordModalOpen(true)}
          >
            <span className="vg-record-dot" aria-hidden="true" />
            <span>{lang === "es" ? "DISCO DE ORO" : "GOLDEN RECORD"}</span>
          </button>
        </div>
      </header>

      {/* Main 3D Picture Book Theater */}
      <main className="vg-stage-main">
        <VoyagerBook3D
          page={page}
          onChangePage={goToPage}
          lang={lang}
          reduced={reduced}
          spreads={SPREADS}
          coverImage="/images/voyager/cover.png"
          backCoverImage="/images/voyager/back-cover.png"
          coverTopLine={ui.coverTopLine}
          coverMainTitle={ui.coverMainTitle}
          coverTagline={ui.coverTagline}
          backColophon={ui.backColophon}
        />

        {/* HTWKR Left / Right Crayon Navigation Arrows */}
        <button
          type="button"
          className="vg-nav-arrow is-prev"
          aria-label={lang === "es" ? "Página anterior" : "Previous page"}
          disabled={page === 0}
          onClick={() => goToPage(page - 1)}
        >
          <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path
              d="M17.5 6.5 L9.5 14 L17.5 21.5"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="vg-nav-arrow is-next"
          aria-label={lang === "es" ? "Página siguiente" : "Next page"}
          disabled={page === maxPage}
          onClick={() => goToPage(page + 1)}
        >
          <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path
              d="M10.5 6.5 L18.5 14 L10.5 21.5"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Front Cover CTA & Drag Prompt */}
        {page === 0 && (
          <div className="vg-cover-overlay">
            <button
              type="button"
              className="vg-enter-btn"
              onClick={() => goToPage(1)}
            >
              {ui.openBookCta}
            </button>
            <p className="vg-drag-hint">{ui.dragHint}</p>
          </div>
        )}

        {/* Open Spread Editorial Story Caption + Expandable Maca Fact Card */}
        {currentSpread && (
          <section
            className="vg-caption-card"
            aria-label={currentSpread.title[lang]}
          >
            <div className="vg-caption-head">
              <div className="vg-caption-meta">
                <span className="vg-chapter-pill">
                  0{page} / 0{SPREADS.length}
                </span>
                <h2>{currentSpread.title[lang]}</h2>
              </div>

              <div className="vg-caption-actions">
                {currentSpread.id === "record" && (
                  <button
                    type="button"
                    className="vg-mini-record-btn"
                    onClick={() => setRecordModalOpen(true)}
                  >
                    {ui.exploreRecordBtn}
                  </button>
                )}
                <button
                  type="button"
                  className={`vg-fact-toggle ${factOpen ? "is-open" : ""}`}
                  aria-expanded={factOpen}
                  onClick={() => setFactOpen((o) => !o)}
                >
                  {factOpen ? ui.factToggleOpen : ui.factToggleClosed}
                </button>
              </div>
            </div>

            <p className="vg-caption-story">{currentSpread.story[lang]}</p>

            {factOpen && (
              <div className="vg-fact-tray">
                <div className="vg-fact-box">
                  <span className="vg-fact-kicker">{ui.macaBadge}</span>
                  <p>{currentSpread.macaFact[lang]}</p>
                </div>
                <p className="vg-parent-spark">
                  {currentSpread.parentPrompt[lang]}
                </p>
              </div>
            )}
          </section>
        )}

        {/* HTWKR-Inspired Extra Resources Drawer Next to Closed Back Cover */}
        {page === maxPage && (
          <aside
            className="vg-extra-resources"
            aria-label={ui.resourcesTitle}
          >
            <span className="vg-res-eyebrow">VOYAGER 1 • 1977 → ∞</span>
            <h2>{ui.resourcesTitle}</h2>
            <p className="vg-res-lead">{ui.resourcesLead}</p>

            <ul className="vg-res-list">
              {ui.resources.map((item) => (
                <li key={item.href}>
                  <span className="vg-res-verb">{item.verb}</span>{" "}
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title} ↗
                  </a>
                </li>
              ))}
            </ul>

            <div className="vg-res-actions">
              <button
                type="button"
                className="vg-res-primary"
                onClick={() => goToPage(0)}
              >
                {ui.readAgain}
              </button>
              <Link href="/" className="vg-res-ghost">
                {ui.backHome}
              </Link>
            </div>
          </aside>
        )}

        {/* Bottom Scrubber Dots (Cover + 6 Spreads + Resources) */}
        <nav className="vg-scrubber" aria-label="Book page selector">
          {Array.from({ length: maxPage + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`vg-scrub-dot ${page === idx ? "is-active" : ""}`}
              onClick={() => goToPage(idx)}
              aria-label={
                idx === 0
                  ? ui.coverLabel
                  : idx === maxPage
                    ? ui.backLabel
                    : ui.spreadOf(idx, SPREADS.length)
              }
              title={
                idx === 0
                  ? ui.coverLabel
                  : idx === maxPage
                    ? ui.backLabel
                    : ui.spreadOf(idx, SPREADS.length)
              }
            />
          ))}
        </nav>
      </main>

      {/* Interactive Wax-Crayon Golden Record Explorer Modal */}
      {recordModalOpen && (
        <div
          className="vg-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={ui.modalTitle}
          onClick={() => setRecordModalOpen(false)}
        >
          <div
            className="vg-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vg-modal-head">
              <span>{ui.modalEyebrow}</span>
              <button
                type="button"
                className="vg-modal-close"
                onClick={() => setRecordModalOpen(false)}
              >
                {ui.modalClose}
              </button>
            </div>

            <div className="vg-modal-grid">
              {/* Hand-Drawn SVG Golden Record Vinyl Spinner */}
              <div className="vg-disc-stage">
                <svg
                  viewBox="0 0 240 240"
                  className={`vg-vinyl-svg ${reduced ? "" : "is-spinning"}`}
                  aria-hidden="true"
                >
                  <circle
                    cx="120"
                    cy="120"
                    r="112"
                    fill="#F4C44E"
                    stroke="#181A24"
                    strokeWidth="4"
                  />
                  {[98, 84, 70, 56].map((r) => (
                    <circle
                      key={r}
                      cx="120"
                      cy="120"
                      r={r}
                      fill="none"
                      stroke="#9F6B13"
                      strokeWidth="1.8"
                      strokeDasharray="18 7 34 9"
                      opacity="0.65"
                    />
                  ))}
                  <circle
                    cx="120"
                    cy="120"
                    r="36"
                    fill="#E63946"
                    stroke="#181A24"
                    strokeWidth="3"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="24"
                    fill="none"
                    stroke="#FAF4E6"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="9"
                    fill="#181A24"
                  />
                </svg>

                <span
                  className="vg-track-chip"
                  style={{ borderColor: activeTrack.color }}
                >
                  TRACK {activeTrack.code}
                </span>
              </div>

              <div className="vg-modal-body">
                <h2>{ui.modalTitle}</h2>
                <div className="vg-track-pills">
                  {RECORD_TRACKS.map((tr, i) => (
                    <button
                      key={tr.id}
                      type="button"
                      className={`vg-track-pill ${
                        activeTrackIdx === i ? "is-active" : ""
                      }`}
                      style={{ "--tr-col": tr.color } as React.CSSProperties}
                      onClick={() => setActiveTrackIdx(i)}
                    >
                      <span>{tr.code}</span>
                      <span>{tr.label[lang]}</span>
                    </button>
                  ))}
                </div>

                <div className="vg-track-readout">
                  <p className="vg-track-quote">{activeTrack.quote[lang]}</p>
                  <p className="vg-track-detail">{activeTrack.detail[lang]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
