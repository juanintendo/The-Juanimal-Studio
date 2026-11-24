import type { Locale } from "@/lib/i18n";

export interface GalleryFrame {
  src: string;
  videoSrc?: string;
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
  posterVideoSrc?: string;
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
    slug: "no-sku",
    num: "01",
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
    slug: "ramses-mania",
    num: "02",
    title: "RAMSES",
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
      en: "An interactive spatial WebGL comic board starring Ramses, our 100% hairless Sun-Pharaoh cat freezing at 19°C.",
      es: "Cómic espacial WebGL protagonizado por Ramses, nuestro faraón pelón congelándose a 19°C.",
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
    num: "03",
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
    posterVideoSrc: "/images/gallery/posters/poster-04.mp4",
    summary: {
      en: "Architectural spatial AI portal translating complex spatial telemetry into luminous, scroll-coupled storytelling.",
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
    title: "FUEL OR FOOL",
    subtitle: {
      en: "38 KB PURE JS FILM · JESTER COBRA LAB",
      es: "FILM EN 38 KB DE JS PURO · LAB DE LA COBRA",
    },
    year: "2026",
    role: {
      en: "Creative Coding · Mascot Direction · Spring Physics",
      es: "Creative Coding · Mascota Cobra · Físicas",
    },
    stack: "Canvas 2D · Archivo Variable · Zero Video",
    accentHex: "#EE1C16",
    accentTextHex: "#FFFDF6",
    posterSrc: "/images/gallery/posters/poster-06.png",
    summary: {
      en: "Fuel or fooling. We do both — a 15-second live-drawn studio opening compiled into 38 KB of pure deterministic JS featuring our halftone Jester Cobra.",
      es: "Fuel or fooling. Hacemos ambas cosas: apertura de 15 segundos dibujada en vivo con 38 KB de JS puro junto a nuestra Cobra Arlequín.",
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
        src: "/media/fof/snake-jester.webp",
        caption: { en: "Halftone Jester Cobra Mascot", es: "Cobra Arlequín en Halftone" },
      },
      {
        src: "/media/fof/station.webp",
        caption: { en: "Interactive Service Station Stage", es: "Escenario Estación de Servicio" },
      },
      {
        src: "/media/fof/stage.webp",
        caption: { en: "Deterministic draw(t) Architecture", es: "Arquitectura draw(t) en Vivo" },
      },
    ],
  },
  {
    slug: "molotov-love",
    num: "07",
    title: "MOLOTOV LOVE",
    subtitle: {
      en: "CARACAS 1997 SKA VIDEO · VARIABLE TYPE MOTION",
      es: "VIDEOCLIP CARACAS 1997 · TIPOGRAFÍA VARIABLE",
    },
    year: "2026",
    role: {
      en: "Music Video Direction · Kinetic Typography · Halftones",
      es: "Dirección Musical · Tipografía Cinética · Halftones",
    },
    stack: "Variable Fonts · 12fps Ink Plates · Desorden Público",
    accentHex: "#0C6B6D",
    accentTextHex: "#FAF7F2",
    posterSrc: "/images/gallery/posters/poster-07.png",
    posterVideoSrc: "/images/gallery/posters/poster-07.mp4",
    summary: {
      en: "A love letter to a love letter: an animated music video for Desorden Público's Caracas 1997 ska anthem driven by beat-locked halftone inflation.",
      es: "Una carta de amor a una carta de amor: videoclip animado para el clásico ska caraqueño de Desorden Público con tipografía que late al ritmo.",
    },
    storyParagraphs: {
      en: [
        "Built from found Caracas textures, etched skeleton ska performers, and cobalt blue print halftones of Torre La Previsora stepping on twos (12fps) while variable type axes swell on every downbeat.",
      ],
      es: [
        "Construido entre grabados de esqueletos ska, tramas halftone cobalto de Torre La Previsora a 12fps y ejes tipográficos variables sincronizados al beat.",
      ],
    },
    liveHref: "https://fuelorfool.ing/work/04-molotov-love/",
    liveExternal: true,
    liveLabel: {
      en: "VIEW ON FUELORFOOL.ING ↗",
      es: "VER EN FUELORFOOL.ING ↗",
    },
    isInteractiveToy: false,
    galleryFrames: [
      {
        src: "/media/fof/molotov-hey-poster.webp",
        videoSrc: "/media/fof/molotov-hey.mp4",
        caption: { en: "HEY! — Ska Skeleton Performer", es: "HEY! — Esqueleto Ska en Vivo" },
      },
      {
        src: "/images/gallery/cases/molotov-coro.webp",
        videoSrc: "/media/fof/molotov-coro.mp4",
        caption: { en: "Chorus Kinetic Print Frame", es: "Cuadro de Coro en Serigrafía" },
      },
      {
        src: "/images/gallery/cases/molotov-inversion.webp",
        videoSrc: "/media/fof/molotov-inversion.mp4",
        caption: { en: "Caracas 1997 · La Previsora Halftone", es: "Caracas 1997 · Torre La Previsora" },
      },
    ],
  },
  {
    slug: "keys-to-my-heart",
    num: "08",
    title: "KEYS TO MY HEART",
    subtitle: {
      en: "MUSICAL FILM STARRING CLAUDIA · 7 ANIMATION ERAS",
      es: "FILM MUSICAL CON CLAUDIA · 7 ERAS DE ANIMACIÓN",
    },
    year: "2026",
    role: {
      en: "Director · Claudia Pipeline · 122.5 BPM Sync",
      es: "Director · Pipeline de Claudia · Ritmo BPM",
    },
    stack: "Claudia Model Chain · 122.5 BPM · 7 Visual Eras",
    accentHex: "#D6333B",
    accentTextHex: "#FAF7F2",
    posterSrc: "/images/gallery/posters/poster-08.png",
    summary: {
      en: "Starring Claudia: a frozen gallery portrait learns all twelve classical principles of animation across 3:16 @ 122.5 BPM with her orange star surviving every visual era.",
      es: "Protagonizado por Claudia: un retrato congelado aprende los doce principios clásicos de la animación en 3:16 a 122.5 BPM con su estrella intacta en 7 eras.",
    },
    storyParagraphs: {
      en: [
        "Directed for the $CLAUDIA video challenge with $0 commercial video-gen spend: Claudia evolves seamlessly from 1926 pencil tests and silent black-ink slapstick to 1950s pin-up cel, 1990s anime, and 3D.",
      ],
      es: [
        "Dirigido para el reto $CLAUDIA con presupuesto cero en generación de video: Claudia atraviesa pruebas de lápiz de 1926, tinta silenciosa, cel de los 50, anime noventero y 3D.",
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
        src: "/images/gallery/cases/claudia-title.webp",
        caption: { en: "1926 Title Card · Juanimal Cartoons", es: "Título 1926 · Juanimal Cartoons" },
      },
      {
        src: "/images/gallery/cases/claudia-pinup.webp",
        caption: { en: "1950s Diner Pin-Up Cel", es: "Cel Pin-Up Años 50" },
      },
      {
        src: "/images/gallery/cases/claudia-90s.webp",
        caption: { en: "1990s Anime Botanical Look-Dev", es: "Look-Dev Anime Noventero" },
      },
      {
        src: "/images/gallery/cases/claudia-3d.webp",
        caption: { en: "1920s Ink vs 3D Studio Desk", es: "Tinta 1920 vs Claudia 3D" },
      },
    ],
  },
  {
    slug: "club-of-the-dead",
    num: "09",
    title: "CLUB OF THE DEAD",
    subtitle: {
      en: "SYNTHIA-2 · BEAT-LOCKED ROCKABILLY RHYTHM RPG",
      es: "SYNTHIA-2 · RPG RÍTMICO ROCKABILLY CUADRO A CUADRO",
    },
    year: "2026",
    role: {
      en: "Game Art Direction · Frame-by-Frame Combat · Sprites",
      es: "Dirección Arcade · Combate Cuadro a Cuadro · Sprites",
    },
    stack: "1024px Sprites · <0.5px Jitter · 4-Day Agent Sprint",
    accentHex: "#0B2428",
    accentTextHex: "#F5E4B8",
    posterSrc: "/images/gallery/posters/poster-09.png",
    summary: {
      en: "Update 01 of Synthia-2: Club of the Dead — a rockabilly rhythm RPG where every mace swing lands on the beat, built from grey test card to dancing cemetery club in four days.",
      es: "RPG rítmico rockabilly protagonizado por Synthia-2 y el club de los muertos bailando al tempo, llevado de tarjeta gris a escena viva en 4 días.",
    },
    storyParagraphs: {
      en: [
        "Starring feathered rockabilly brawler Synthia-2 facing the lightning Vampire Ringmaster and his werewolf mount in front of a cemetery skeleton trio.",
        "Every character locks strictly to 1024px sprite sheets with grounded feet at (512, 900) and under 0.5px head jitter across combo, feral, and berserk states.",
      ],
      es: [
        "Protagonizado por Synthia-2 y su mazo de púas frente al Domador Vampiro y su hombre lobo bajo la luna llena y una banda esqueleto rockabilly.",
        "Cada personaje respeta hojas de 1024px con pies fijados en (512, 900) y menos de 0.5px de vibración en combos y estado berserk.",
      ],
    },
    liveHref: "https://fuelorfool.ing/club-of-the-dead/",
    liveExternal: true,
    liveLabel: {
      en: "PLAY DEMO ON FUELORFOOL.ING ↗",
      es: "VER DEMO EN FUELORFOOL.ING ↗",
    },
    isInteractiveToy: false,
    galleryFrames: [
      {
        src: "/images/gallery/cases/cotd-faceoff.webp",
        caption: { en: "Synthia-2 vs Vampire Werewolf Showdown", es: "Duelo Synthia-2 vs Vampiro & Hombre Lobo" },
      },
      {
        src: "/media/fof/cine-moon.webp",
        caption: { en: "Moonlit Cemetery Arrival Keyframe", es: "Escena Cinematográfica Bajo la Luna" },
      },
      {
        src: "/media/fof/combat-poster.webp",
        caption: { en: "Beat-Locked Heavy Finish Combat HUD", es: "Combate Rítmico Sincronizado al Beat" },
      },
      {
        src: "/images/gallery/cases/cotd-berserk.webp",
        caption: { en: "Synthia-2 Berserk Combo State", es: "Estado Berserk de Synthia-2" },
      },
    ],
  },
  {
    slug: "brrt-receipts",
    num: "10",
    title: "BRRT",
    subtitle: {
      en: "THERMAL RECEIPT BRAND EDITOR · 58 & 80 MM",
      es: "EDITOR DE TICKETS TÉRMICOS · 58 Y 80 MM",
    },
    year: "2026",
    role: {
      en: "Product Design · Thermal Dithering · Mascot",
      es: "Diseño de Producto · Trama Térmica · Mascota",
    },
    stack: "Thermal 1-Bit Engine · 58/80mm Roll Sim · Live Editor",
    accentHex: "#1547E5",
    accentTextHex: "#FAF7F2",
    posterSrc: "/images/gallery/posters/poster-10.png",
    summary: {
      en: "Tu ticket. Tu sello. A tactile live receipt designer that stamps any shop logo, custom artwork, and message onto 58mm and 80mm thermal rolls with crisp B&W dithering.",
      es: "Tu ticket. Tu sello. Un editor táctil para imprimir el logo, ilustraciones y mensajes de tu local sobre rollos térmicos de 58 y 80 mm en tiempo real.",
    },
    storyParagraphs: {
      en: [
        "Built so indie cafés, shops, and bakeries give their paper receipts the exact same personality as their storefront — swap headers, drop artwork behind the receipt text with tunable contrast, and preview live B&W thermal ink output before printing.",
      ],
      es: [
        "Pensado para que cafés y locales independientes pongan su sello personal hasta en el recibo: sube tu logotipo o ilustración de fondo con intensidad ajustable, reordena bloques tocando el ticket y compara rollos de 58 y 80 mm en vivo.",
      ],
    },
    liveHref: "https://taller-de-ticket.juanintendo.chatgpt.site/producto/",
    liveExternal: true,
    liveLabel: {
      en: "OPEN BRRT EDITOR ↗",
      es: "PROBAR EDITOR BRRT ↗",
    },
    isInteractiveToy: false,
    galleryFrames: [
      {
        src: "/images/gallery/cases/brrt-mascot.png",
        caption: { en: "BRRT Thermal Printer Mascot", es: "Mascota Impresora Térmica BRRT" },
      },
      {
        src: "/images/gallery/cases/brrt-ticket.webp",
        caption: { en: "80mm 1-Bit Thermal Receipt Preview", es: "Vista Previa Térmica 80 mm en B&N" },
      },
    ],
  },
  {
    slug: "kanzen-toys",
    num: "11",
    title: "KANZEN",
    subtitle: {
      en: "GRAFFITI VINYL TOYS & 2D PHYSICS POSTER",
      es: "JUGUETES DE VINIL GRAFFITI & PÓSTER CON FÍSICA",
    },
    year: "2026",
    role: {
      en: "Toy Direction · Japanese Web Study · Spray Physics",
      es: "Dirección de Juguetes · Estudio Web Japonés · Física 2D",
    },
    stack: "Canvas 2D Physics · WebAudio Spray Studio · Sofubi Toy Line",
    accentHex: "#FF4F1A",
    accentTextHex: "#0E0E0D",
    posterSrc: "/images/gallery/posters/poster-11-kanzen.png",
    summary: {
      en: "缶全 KANZEN Graffiti Toys — 13 collectible sofubi designer toys sculpted after hardcore spray cans, NY Fat & Pink Dot caps, drip mops, steel markers and blackbooks.",
      es: "缶全 KANZEN Graffiti Toys — 13 juguetes coleccionables de vinil esculpidos a partir de latas, válvulas NY Fat y Pink Dot, mops, marcadores y blackbooks.",
    },
    storyParagraphs: {
      en: [
        "Inspired by Japanese underground design galleries, KANZEN turns hardcore street-art tools into a cohesive designer vinyl toy line where each character's silhouette mirrors how it paints.",
        "Features an interactive drag-through hero, a WebAudio spray studio with per-cap physics and drips, plus this live 2D rigid-body poster where all 18 v1 & v2 toys rain and bounce under your cursor.",
      ],
      es: [
        "Inspirado en las galerías de diseño web japonés, KANZEN convierte herramientas reales de graffiti en una colección de juguetes sofubi donde la silueta y actitud de cada pieza refleja cómo pinta.",
        "Incluye un estudio interactivo de spray con sonido WebAudio y boquillas reales, además de este póster vivo con física 2D donde los 18 juguetes caen, se apilan y rebotan con tu cursor.",
      ],
    },
    liveHref: "/studies/kanzen/index.html",
    liveExternal: true,
    liveLabel: {
      en: "OPEN KANZEN TOYS ↗",
      es: "ABRIR KANZEN TOYS ↗",
    },
    isInteractiveToy: true,
    galleryFrames: [
      {
        src: "/studies/kanzen/img/cap-nyfat.webp",
        caption: { en: "NY FAT — 90s Subway King Vinyl Toy", es: "NY FAT — Juguete de Vinil Clásico NYC" },
      },
      {
        src: "/studies/kanzen/img/can-fat.webp",
        caption: { en: "缶全 FAT FILL — 750ml Sumo Can Toy", es: "缶全 FAT FILL — Lata 750ml Sumo" },
      },
      {
        src: "/studies/kanzen/img/mop.webp",
        caption: { en: "DRIP MOP — Acid Lime Squeezer Toy", es: "DRIP MOP — Squeezer Verde Ácido" },
      },
      {
        src: "/studies/kanzen/img/mask.webp",
        caption: { en: "RESPIRATOR — Half-Mask Street Gear Toy", es: "RESPIRATOR — Máscara Urbana de Vinil" },
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
