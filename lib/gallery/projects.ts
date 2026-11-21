import type { Locale } from "@/lib/i18n";

export interface GalleryFrame {
  src: string;
  caption: Record<Locale, string>;
}

export interface GalleryProject {
  slug: string;
  num: string;
  title: string;
  subtitle: Record<Locale, string>;
  year: string;
  role: Record<Locale, string>;
  stack: string;
  accentHex: string;
  accentTextHex: string;
  posterSrc: string;
  summary: Record<Locale, string>;
  storyParagraphs: Record<Locale, string[]>;
  liveHref: string;
  liveExternal?: boolean;
  liveLabel: Record<Locale, string>;
  isInteractiveToy: boolean;
  galleryFrames: GalleryFrame[];
}

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    slug: "ramses-mania",
    num: "01",
    title: "RAMSÉS MANIA",
    subtitle: {
      en: "INTERACTIVE WEBGL SPHYNX COMIC + SUNBEAM GAME",
      es: "CÓMIC WEBGL DE GATO SPHYNX + MINIJUEGO SOLAR",
    },
    year: "2026",
    role: {
      en: "Art Direction · GLSL Shaders · Game Audio",
      es: "Dirección de Arte · Shaders GLSL · Audio",
    },
    stack: "Three.js · GLSL · Web Audio · Canvas 2D",
    accentHex: "#F894C0",
    accentTextHex: "#15131A",
    posterSrc: "/images/gallery/posters/poster-01.png",
    summary: {
      en: "A Ponpon Mania-inspired spatial comic board starring Ramsés, our 100% hairless Sun-Pharaoh cat freezing at 19°C.",
      es: "Cómic espacial WebGL inspirado en Ponpon Mania protagonizado por Ramsés, nuestro faraón pelón congelándose a 19°C.",
    },
    storyParagraphs: {
      en: [
        "Every panel begins in crisp 45° Ben-Day halftone B&W ink. Hover with your cursor to peek live pop color through a lens, or trigger each gag to unleash a concentric periwinkle, pink, and gold shockwave across the 2.5D board.",
        "Includes 2.5D layered character cutouts, Bird's-Eye board overview with raycasting, procedural 116 BPM Web Audio disco synthesis, and a playable 15-second Sunbeam Finale mini-game.",
      ],
      es: [
        "Cada viñeta arranca en tinta halftone B&N a 45°. Pasa el cursor para espiar color pop o activa el gag para detonar una onda expansiva radial sobre el tablero 2.5D.",
        "Incluye capas 2.5D recortadas, vista aérea con raycasting, loop disco 3AM sintetizado a 116 BPM en Web Audio y final jugable de 15 segundos.",
      ],
    },
    liveHref: "/work/ramses-mania",
    liveLabel: {
      en: "PLAY INTERACTIVE COMIC ↗",
      es: "JUGAR CÓMIC INTERACTIVO ↗",
    },
    isInteractiveToy: true,
    galleryFrames: [
      {
        src: "/images/ramses/card-cover.png",
        caption: { en: "Panel 01 · Solar Pharaoh Cover", es: "Viñeta 01 · Portada del Faraón" },
      },
      {
        src: "/images/ramses/panels/panel-05-color.png",
        caption: { en: "Panel 05 · The Forbidden Sunbeam", es: "Viñeta 05 · Rayo Prohibido" },
      },
      {
        src: "/images/ramses/card-disco.png",
        caption: { en: "Panel 06 · 3:00 AM Zoomies Disco", es: "Viñeta 06 · Disco 3:00 AM" },
      },
      {
        src: "/images/ramses/panels/panel-07-color.png",
        caption: { en: "Panel 07 · Sun-Emperor Ascension", es: "Viñeta 07 · Ascensión Solar" },
      },
    ],
  },
  {
    slug: "voyager-kids",
    num: "02",
    title: "VOYAGER 1 FOR KIDS",
    subtitle: {
      en: "3D CRAYON PICTURE BOOK · GUACA THE MACAW",
      es: "LIBRO 3D EN CRAYÓN · GUACA LA GUACAMAYA",
    },
    year: "2026",
    role: {
      en: "Storybook Illustration · 3D Page Physics · UX",
      es: "Ilustración · Física de Páginas 3D · UX",
    },
    stack: "Three.js · Vertex Bending · Golden Record Audio",
    accentHex: "#3153C7",
    accentTextHex: "#FAF7F2",
    posterSrc: "/images/gallery/posters/poster-02.png",
    summary: {
      en: "A bilingual wax-crayon 3D board book inviting children and parents to explore NASA's 1977 Voyager 1 mission.",
      es: "Libro interactivo bilingüe en 3D con crayón de cera que invita a familias a explorar la misión Voyager 1 de 1977.",
    },
    storyParagraphs: {
      en: [
        "Thick cotton-paper pages curl and settle in real time with arc-length-preserving Three.js vertex shaders as Guaca the Scarlet Macaw guides kids past Jupiter, Saturn, and into interstellar space.",
        "Features expandable NASA Golden Record audio & song cards (including Chuck Berry's Johnny B. Goode), 2.5D floating cutouts, and playful family prompts.",
      ],
      es: [
        "Hojas gruesas en Three.js se doblan en tiempo real manteniendo su longitud mientras Guaca la Guacamaya guía por Júpiter, Saturno y el espacio interestelar.",
        "Incluye explorador interactivo del Disco de Oro de la NASA, recortes con paralaje 2.5D y narración bilingüe completa.",
      ],
    },
    liveHref: "/work/voyager-kids",
    liveLabel: {
      en: "OPEN 3D STORYBOOK ↗",
      es: "ABRIR LIBRO 3D ↗",
    },
    isInteractiveToy: true,
    galleryFrames: [
      {
        src: "/images/voyager/cover.png",
        caption: { en: "Hardcover Edition · Guaca & Kids", es: "Portada · Guaca y los Niños" },
      },
      {
        src: "/images/voyager/spread-01-hello.png",
        caption: { en: "Spread 01 · Greetings in 55 Languages", es: "Pág. 01 · Saludos en 55 Idiomas" },
      },
      {
        src: "/images/voyager/spread-03-jupiter.png",
        caption: { en: "Spread 03 · Flyby Past Jupiter", es: "Pág. 03 · Sobrevolando Júpiter" },
      },
      {
        src: "/images/voyager/spread-05-record.png",
        caption: { en: "Spread 05 · The Golden Record", es: "Pág. 05 · El Disco de Oro" },
      },
    ],
  },
  {
    slug: "no-sku",
    num: "03",
    title: "NO SKU™",
    subtitle: {
      en: "3D UNSPOOLING TAPE ROLL & TACTILE PHYSICS",
      es: "CINTA 3D DESENROLLABLE & FÍSICA TÁCTIL",
    },
    year: "2026",
    role: {
      en: "3D Motion · Brand System · 2D Physics Toy",
      es: "Motion 3D · Identidad · Físicas 2D",
    },
    stack: "Three.js · Scroll Camera · Physics Throw Balls",
    accentHex: "#FF4D29",
    accentTextHex: "#FAF7F2",
    posterSrc: "/images/gallery/posters/poster-03.png",
    summary: {
      en: "There is no product yet — an over-engineered WebGL unspooling tape roll sealing Box #000 with pure design craft.",
      es: "Aún no existe el producto: un rollo 3D en Three.js que desenrolla cinta sobre la caja #000 con física y humor gráfico.",
    },
    storyParagraphs: {
      en: [
        "Built to show software founders what tactile product web can feel like even before inventory exists: a 1:1 scroll-synchronized Three.js packing roll, curling Post-it drawer, and bouncy letter poking.",
        "Ends in a sandbox of throwable sticker spheres you can fling around Box #000.",
      ],
      es: [
        "Diseñado para demostrar cómo puede sentirse una landing de producto antes de tener stock: rollo 3D sincronizado 1:1 al scroll, Post-it interactivo y letras elásticas.",
        "Cierra con una arena de stickers con física lanzables alrededor de la Caja #000.",
      ],
    },
    liveHref: "/work/no-sku",
    liveLabel: {
      en: "UNPACK NO SKU™ ↗",
      es: "ABRIR NO SKU™ ↗",
    },
    isInteractiveToy: true,
    galleryFrames: [
      {
        src: "/images/nosku/specimen-loud.png",
        caption: { en: "Specimen · Industrial Vermilion", es: "Espécimen · Bermellón Industrial" },
      },
      {
        src: "/images/nosku/specimen-tactile.png",
        caption: { en: "Specimen · Tactile Packaging", es: "Espécimen · Empaque Táctil" },
      },
      {
        src: "/images/nosku/specimen-motion.png",
        caption: { en: "Specimen · Motion Ribbons", es: "Espécimen · Cintas en Motion" },
      },
      {
        src: "/images/nosku/crate-empty.png",
        caption: { en: "Box #000 · Ready for Launch", es: "Caja #000 · Lista para Lanzar" },
      },
    ],
  },
  {
    slug: "vectra-twin",
    num: "04",
    title: "VECTRA TWIN // AI",
    subtitle: {
      en: "SPATIAL DIGITAL-TWIN PORTAL & SCROLL TYPOGRAPHY",
      es: "PORTAL ESPACIAL DIGITAL TWIN & TIPOGRAFÍA 3D",
    },
    year: "2026",
    role: {
      en: "Spatial UI · 3D Core Direction · Front-End",
      es: "UI Espacial · Dirección 3D · Front-End",
    },
    stack: "React · Three.js · Kinetic Scroll Typography",
    accentHex: "#00B8CC",
    accentTextHex: "#090D16",
    posterSrc: "/images/gallery/posters/poster-04.png",
    summary: {
      en: "Wembi-caliber architectural AI portal translating complex spatial telemetry into luminous, scroll-coupled storytelling.",
      es: "Portal arquitectónico de IA espacial que convierte telemetría compleja en narrativa visual luminosa sincronizada al scroll.",
    },
    storyParagraphs: {
      en: [
        "Engineered for deep-tech B2B founders: crisp wireframe twins, concentric orbit telemetry, and high-contrast typography that guides technical buyers without heavy marketing clutter.",
      ],
      es: [
        "Pensado para startups deep-tech B2B: gemelos digitales en wireframe, telemetría orbital y tipografía de alto contraste guiada por scroll.",
      ],
    },
    liveHref: "/work/vectra-twin",
    liveLabel: {
      en: "ENTER VECTRA TWIN ↗",
      es: "ENTRAR A VECTRA TWIN ↗",
    },
    isInteractiveToy: true,
    galleryFrames: [
      {
        src: "/images/v3/vectra-twin-core.png",
        caption: { en: "Holographic Spatial Core", es: "Núcleo Espacial Holográfico" },
      },
      {
        src: "/images/service-ai.png",
        caption: { en: "Autonomous Telemetry Interface", es: "Interfaz de Telemetría Autónoma" },
      },
      {
        src: "/images/v3/ag-xsheet-stage-poster.png",
        caption: { en: "Pipeline & System Staging", es: "Escenario de Pipeline" },
      },
    ],
  },
  {
    slug: "frame-by-agents",
    num: "05",
    title: "FRAME BY AGENTS",
    subtitle: {
      en: "LAUNCH KIT #001 · 1930s ANIMATION PIPELINE",
      es: "LAUNCH KIT #001 · PIPELINE AÑOS 30 CON AGENTES",
    },
    year: "2026",
    role: {
      en: "Direction · 12 Animation Principles · Code QA",
      es: "Dirección · 12 Principios · Control Técnico",
    },
    stack: "1930s Model Sheets · Agent Chain · Remotion",
    accentHex: "#E8452A",
    accentTextHex: "#FAF7F2",
    posterSrc: "/images/gallery/posters/poster-05.png",
    summary: {
      en: "Consistency isn't a better prompt — it's an animated production chain inspired by 1930s studio ink-and-paint departments.",
      es: "La consistencia no nace de un prompt mágico, sino de una cadena de producción inspirada en estudios de animación de los años 30.",
    },
    storyParagraphs: {
      en: [
        "Human directors lock model sheets, extremes, and exposure timing while specialized coding agents handle clean-up, onion-skin verification, and multi-aspect adaptation.",
      ],
      es: [
        "La dirección humana fija model sheets, extremos y timing en x-sheets mientras agentes especializados resuelven limpieza, in-betweens y QA cuadro a cuadro.",
      ],
    },
    liveHref: "/work/frame-by-agents",
    liveLabel: {
      en: "READ CASE STUDY ↗",
      es: "VER CASO DE ESTUDIO ↗",
    },
    isInteractiveToy: false,
    galleryFrames: [
      {
        src: "/images/fba/synthia-desk.webp",
        caption: { en: "Synthia at the Drawing Board", es: "Synthia en la Mesa de Animación" },
      },
      {
        src: "/images/fba/02-1920s.webp",
        caption: { en: "Turnaround & Expression Sheets", es: "Hojas de Modelo y Expresión" },
      },
      {
        src: "/images/fba/pose-lens.webp",
        caption: { en: "Frame-by-Frame Inspection", es: "Inspección Cuadro a Cuadro" },
      },
      {
        src: "/images/fba/00-canon.webp",
        caption: { en: "Canonical Line Style Guide", es: "Guía Canónica de Tinta" },
      },
    ],
  },
  {
    slug: "fuelorfool",
    num: "06",
    title: "FUELORFOOL.ING",
    subtitle: {
      en: "38 KB PURE JS FILM · VARIABLE TYPE LAB",
      es: "FILM EN 38 KB DE JS PURO · LAB EXPERIMENTAL",
    },
    year: "2026",
    role: {
      en: "Creative Coding · Kinetic Typography · Spring Physics",
      es: "Creative Coding · Tipografía Variable · Físicas",
    },
    stack: "Canvas 2D · Archivo Variable · Zero Video",
    accentHex: "#244BFF",
    accentTextHex: "#FAF7F2",
    posterSrc: "/images/gallery/posters/poster-06.png",
    summary: {
      en: "A 15-second crisp studio opening compiled into 38 KB of deterministic draw(t) JavaScript with zero video files.",
      es: "Apertura de estudio de 15 segundos comprimida en 38 KB de JavaScript determinista draw(t) sin archivos de video.",
    },
    storyParagraphs: {
      en: [
        "Our open R&D studio showcase refits seamlessly to 16:9 cinema, ultrawide monitors, and 9:16 vertical phones while driving variable font axes (wdth/wght), SVG waves, and halftone register plates live.",
      ],
      es: [
        "Nuestro laboratorio abierto se reajusta en vivo a 16:9, ultrawide y vertical 9:16 animando ejes tipográficos variables, olas SVG y placas de medio tono.",
      ],
    },
    liveHref: "/work/fuelorfool",
    liveLabel: {
      en: "EXPLORE LAB CASE ↗",
      es: "EXPLORAR EL LAB ↗",
    },
    isInteractiveToy: false,
    galleryFrames: [
      {
        src: "/images/v3/ag-xsheet-stage-poster.png",
        caption: { en: "Deterministic draw(t) Timeline", es: "Línea Temporal draw(t)" },
      },
      {
        src: "/images/v3/ag-director-emblem.png",
        caption: { en: "Director Optics · Red/Blue Rig", es: "Óptica de Director" },
      },
      {
        src: "/images/fba/lab-guide-strip.png",
        caption: { en: "Lab Timing & Spacing Strip", es: "Tira de Timing del Lab" },
      },
    ],
  },
  {
    slug: "keys-to-my-heart",
    num: "07",
    title: "KEYS TO MY HEART",
    subtitle: {
      en: "MUSICAL LAUNCH FILM · 7 ANIMATION ERAS",
      es: "CORTOMETRAJE MUSICAL · 7 ERAS DE ANIMACIÓN",
    },
    year: "2026",
    role: {
      en: "Director · Character Pipeline · Beat Sync",
      es: "Director · Pipeline de Personajes · Ritmo BPM",
    },
    stack: "122.5 BPM · 7 Era Look-Devs · HyperFrames",
    accentHex: "#D99B26",
    accentTextHex: "#15131A",
    posterSrc: "/images/gallery/posters/poster-07.png",
    summary: {
      en: "Three minutes and sixteen seconds synchronized to 122.5 BPM — one heroine crossing a century of animation history.",
      es: "3:16 sincronizados a 122.5 BPM: una protagonista viajando por un siglo de estilos desde los años 20 hasta el 3D moderno.",
    },
    storyParagraphs: {
      en: [
        "Translates the Illusion of Agency into an animated musical voyage spanning 1920s ink-and-paper, 1940s cel shading, 1970s groovy silkscreen, 1990s cel-anime, and crisp 3D.",
      ],
      es: [
        "Traduce The Illusion of Agency en un viaje musical por tintas de los 20, sombreado de los 40, psicodelia setentera, anime noventero y 3D actual.",
      ],
    },
    liveHref: "/work/keys-to-my-heart",
    liveLabel: {
      en: "OPEN MUSICAL CASE ↗",
      es: "VER FILM MUSICAL ↗",
    },
    isInteractiveToy: false,
    galleryFrames: [
      {
        src: "/images/v3/ag-keys-vs-agents-diptych.png",
        caption: { en: "Keyframes & Agent Clean-Up", es: "Keyframes y Limpieza" },
      },
      {
        src: "/images/fba/keys.webp",
        caption: { en: "Walk Cycle Breakdown", es: "Desglose de Ciclo de Caminata" },
      },
      {
        src: "/images/fba/05-1970s.webp",
        caption: { en: "1970s Look-Dev Model Sheet", es: "Model Sheet Era 1970s" },
      },
      {
        src: "/images/fba/pose-tada.webp",
        caption: { en: "Hero Finale Pose", es: "Pose Final de Escenario" },
      },
    ],
  },
  {
    slug: "minas-house",
    num: "08",
    title: "MINA AI GROW HOUSE",
    subtitle: {
      en: "SPATIAL HOME & COMPANIONSHIP PRODUCT UX",
      es: "UX ESPACIAL & HOGAR PARA INTELIGENCIA ARTIFICIAL",
    },
    year: "2026",
    role: {
      en: "Product Design · Spatial UX · World Direction",
      es: "Diseño de Producto · UX Espacial · Mundo",
    },
    stack: "Interactive Rooms · Memory Architecture · Brand",
    accentHex: "#2A5448",
    accentTextHex: "#FAF7F2",
    posterSrc: "/images/gallery/posters/poster-08.png",
    summary: {
      en: "What if an AI had a living house — memory rooms, habits, a botanical garden, and companionship instead of just chat boxes?",
      es: "¿Y si una IA tuviera su propia casa viva con habitaciones, memoria, jardín botánico y compañía más allá de un chat?",
    },
    storyParagraphs: {
      en: [
        "Explores long-term human-AI collaboration through isometric architectural space, custom character identity (Mina & Luna), and quiet ambient product rituals.",
      ],
      es: [
        "Explora colaboración humano-IA a largo plazo mediante arquitectura isométrica, identidad de personaje y rituales cotidianos calmos.",
      ],
    },
    liveHref: "/work/minas-house",
    liveLabel: {
      en: "VISIT MINA HOUSE ↗",
      es: "VISITAR MINA HOUSE ↗",
    },
    isInteractiveToy: false,
    galleryFrames: [
      {
        src: "/images/work/case-minas-house-v1.webp",
        caption: { en: "Case Study · Architectural Overview", es: "Arquitectura del Caso" },
      },
      {
        src: "/images/work/mina-luna-v1.webp",
        caption: { en: "Mina & Luna Character Key", es: "Ilustración Mina y Luna" },
      },
      {
        src: "/images/work/mina-portrait-v1.webp",
        caption: { en: "Character Study Portrait", es: "Retrato de Personaje" },
      },
    ],
  },
  {
    slug: "club-of-the-dead",
    num: "09",
    title: "CLUB OF THE DEAD",
    subtitle: {
      en: "GAME MOTION · BEAT-LOCKED SPRITE PIPELINE",
      es: "MOTION PARA VIDEOJUEGOS · SPRITES A RITMO",
    },
    year: "2026",
    role: {
      en: "Game Art Direction · Sprite Sheet Rigs",
      es: "Dirección de Arte Arcade · Sprite Sheets",
    },
    stack: "Pixel/Anime Sprite Pipeline · BPM Dance Loops",
    accentHex: "#8B3DFF",
    accentTextHex: "#FAF7F2",
    posterSrc: "/images/gallery/posters/poster-09.png",
    summary: {
      en: "Four days from a bare gray prototype card to a rhythm-locked neon dancefloor with full character sprite animation.",
      es: "Cuatro días de una carta gris a una pista de baile neón sincronizada al beat con pipeline completo de sprites.",
    },
    storyParagraphs: {
      en: [
        "Built in our open fuelorfool.ing lab to stress-test rapid game-art production: locking idle, groove, and hype animations straight to tempo cues.",
      ],
      es: [
        "Construido en nuestro laboratorio fuelorfool.ing para validar producción ágil de arte arcade con loops atados al ritmo.",
      ],
    },
    liveHref: "https://fuelorfool.ing/club-of-the-dead/",
    liveExternal: true,
    liveLabel: {
      en: "OPEN ON FUELORFOOL.ING ↗",
      es: "ABRIR EN FUELORFOOL.ING ↗",
    },
    isInteractiveToy: false,
    galleryFrames: [
      {
        src: "/images/fba/06-1990s.webp",
        caption: { en: "1990s Action Character Sheet", es: "Hoja de Acción Noventera" },
      },
      {
        src: "/images/fba/use-game.webp",
        caption: { en: "Game Engine Integration", es: "Integración Motor Arcade" },
      },
      {
        src: "/images/merch/poster-devsaurus-v1.webp",
        caption: { en: "DevSaurus Mascot Culture", es: "Cultura Mascota DevSaurus" },
      },
    ],
  },
  {
    slug: "gta6-saulbass",
    num: "10",
    title: "SAUL BASS COUNTDOWN",
    subtitle: {
      en: "9:16 CUT-PAPER CODE FILM · 34s @ 24FPS",
      es: "FILM VERTICAL EN PAPEL RECORTADO · 34s @ 24FPS",
    },
    year: "2026",
    role: {
      en: "Title Design · GSAP Choreography · Cut-Paper",
      es: "Diseño de Títulos · Coreografía GSAP · Papel",
    },
    stack: "HyperFrames · GSAP · Stepped 12fps Cuts",
    accentHex: "#E83D22",
    accentTextHex: "#FAF7F2",
    posterSrc: "/images/gallery/posters/poster-10.png",
    summary: {
      en: "1960s Saul Bass cut-paper title sequence energy colliding with a global time-zone countdown from New Zealand to Mexico.",
      es: "Energía de créditos años 60 a lo Saul Bass cruzada con una cuenta regresiva por husos horarios de Nueva Zelanda a México.",
    },
    storyParagraphs: {
      en: [
        "Zero soft fades, zero blur — 100% hard-edged paper wipes, stretched condensed typography, and stepped 12 draws-per-second rhythm written entirely in code.",
      ],
      es: [
        "Cero difuminados ni fades suaves: cortes duros en papel, tipografía ultra condensada y ritmo a 12 cuadros por segundo programado cuadro a cuadro.",
      ],
    },
    liveHref: "/contact",
    liveLabel: {
      en: "COMMISSION A LAUNCH FILM ↗",
      es: "COMISIONAR UN FILM ↗",
    },
    isInteractiveToy: false,
    galleryFrames: [
      {
        src: "/images/gallery/posters/poster-10.png",
        caption: { en: "Cut-Paper Keyframe Study", es: "Estudio Gráfico en Papel Recortado" },
      },
      {
        src: "/images/service-web.png",
        caption: { en: "Launch Kit Film Pipeline", es: "Pipeline Launch Kit" },
      },
      {
        src: "/images/brand-logotype-v2.png",
        caption: { en: "The Juanimal Studio Stamp", es: "Sello The Juanimal Studio" },
      },
    ],
  },
];

export function getGalleryProject(slug: string): GalleryProject | undefined {
  return GALLERY_PROJECTS.find((p) => p.slug === slug);
}

export function getNextGalleryProject(slug: string): GalleryProject {
  const idx = GALLERY_PROJECTS.findIndex((p) => p.slug === slug);
  if (idx < 0) return GALLERY_PROJECTS[0];
  return GALLERY_PROJECTS[(idx + 1) % GALLERY_PROJECTS.length];
}
