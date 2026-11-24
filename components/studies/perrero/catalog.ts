export type SauceCategory = "creamy" | "sweet" | "fire";

export interface PerreroSauce {
  id: string;
  slug: string;
  num: string;
  name: string;
  shortName: string;
  category: SauceCategory;
  tagline: string;
  price: number;
  size: string;
  heat: number; // 0..5
  accentHex: string;
  cardBgHex: string;
  pdpBgHex: string;
  bottleImg: string;
  pdpImg: string;
  ingredientImg: string;
  secondaryIngImg: string;
  mascotImg: string;
  badgeText: string;
  description: string;
  tasteProfile: string[];
  pairing: string[];
  ingredients: string;
  orbitItems: Array<{ label: string; img: string; x: number; y: number }>;
}

export const PERRERO_SAUCES: PerreroSauce[] = [
  {
    id: "guasacaca-seria",
    slug: "guasacaca-seria",
    num: "01",
    name: "GUASACACA SERIA",
    shortName: "GUASACACA SERIA",
    category: "creamy",
    tagline: "The emerald Caracas street-cart legend. Zero mayo shortcuts.",
    price: 12,
    size: "12 OZ · 355 ML",
    heat: 1,
    accentHex: "#58C446",
    cardBgHex: "#2F7828",
    pdpBgHex: "#24561E",
    bottleImg: "/images/studies/perrero/bottle-guasacaca.png",
    pdpImg: "/images/studies/perrero/pdp-guasacaca.png",
    ingredientImg: "/images/studies/perrero/ing-avocado.png",
    secondaryIngImg: "/images/studies/perrero/ing-lime.png",
    mascotImg: "/images/studies/perrero/ing-mascot-avocado.png",
    badgeText: "AVOCADO · CILANTRO · AJÍ DULCE",
    description:
      "Whipped ripe Hass avocado, fresh cilantro, Venezuelan sweet ají dulce, green bell pepper, and cold-pressed lime. Bright, herby, and dangerously addictive on everything.",
    tasteProfile: [
      "Creamy ripe Hass avocado opens rich and velvety",
      "Fresh chopped cilantro & sweet green ají dulce hit bright",
      "Cold-pressed lime cuts through grilled meats",
      "Clean, herby finish with zero heavy mayo film",
    ],
    pairing: [
      "Perro con todo",
      "Tequeños",
      "Crispy papitas",
      "Grilled steaks",
      "Arepas & grilled chicken",
    ],
    ingredients:
      "Hass Avocado, Fresh Cilantro, Sweet Ají Dulce, Green Bell Pepper, White Onion, Garlic, Lime Juice, White Vinegar, Sea Salt.",
    orbitItems: [
      { label: "HASS AVOCADO", img: "/images/studies/perrero/ing-avocado.png", x: -122, y: -64 },
      { label: "FRESH LIME", img: "/images/studies/perrero/ing-lime.png", x: 118, y: -50 },
      { label: "ROASTED GARLIC", img: "/images/studies/perrero/ing-garlic.png", x: -108, y: 76 },
      { label: "AJÍ DULCE", img: "/images/studies/perrero/ing-chili.png", x: 112, y: 70 },
    ],
  },
  {
    id: "las-mercedes",
    slug: "las-mercedes",
    num: "02",
    name: "3.AM LAS MERCEDES",
    shortName: "3.AM LAS MERCEDES",
    category: "creamy",
    tagline: "Silky midnight cart garlic emulsion. Kissing is optional.",
    price: 12,
    size: "12 OZ · 355 ML",
    heat: 1,
    accentHex: "#F0B938",
    cardBgHex: "#B5811C",
    pdpBgHex: "#9E6E16",
    bottleImg: "/images/studies/perrero/bottle-las-mercedes.png",
    pdpImg: "/images/studies/perrero/pdp-las-mercedes.png",
    ingredientImg: "/images/studies/perrero/ing-garlic.png",
    secondaryIngImg: "/images/studies/perrero/ing-lime.png",
    mascotImg: "/images/studies/perrero/ing-mascot-garlic.png",
    badgeText: "ROASTED GARLIC · PARSLEY · LIME",
    description:
      "Triple-garlic punch straight from the late-night corners of Las Mercedes: slow-roasted cloves for sweetness, confit garlic for bite, and bright flat-leaf parsley.",
    tasteProfile: [
      "Slow-roasted garlic brings warm nutty sweetness",
      "Raw confit garlic delivers unmistakable midnight punch",
      "Flat-leaf parsley & lime keep the emulsion snappy",
      "Built to rescue 3AM fries, dogs, and fried chicken",
    ],
    pairing: [
      "Loaded hot dogs",
      "Garlic fries",
      "Arepa Reina Pepiada",
      "Fried chicken",
      "Crispy yuca",
    ],
    ingredients:
      "Roasted Garlic, Confit Garlic, Avocado Oil, Free-Range Egg Yolk, Flat-Leaf Parsley, Lime Juice, Dijon Mustard, Sea Salt.",
    orbitItems: [
      { label: "ROASTED GARLIC", img: "/images/studies/perrero/ing-garlic.png", x: -120, y: -60 },
      { label: "KEY LIME", img: "/images/studies/perrero/ing-lime.png", x: 118, y: -52 },
      { label: "AVOCADO OIL", img: "/images/studies/perrero/ing-avocado.png", x: -106, y: 76 },
      { label: "SWEET CORN", img: "/images/studies/perrero/ing-corn.png", x: 112, y: 68 },
    ],
  },
  {
    id: "liquid-cachapa",
    slug: "liquid-cachapa",
    num: "03",
    name: "LIQUID CACHAPA",
    shortName: "LIQUID CACHAPA",
    category: "sweet",
    tagline: "Charred sweet corn cream that puts boring mustard to shame.",
    price: 12,
    size: "12 OZ · 355 ML",
    heat: 1,
    accentHex: "#F5841F",
    cardBgHex: "#C95D14",
    pdpBgHex: "#B55110",
    bottleImg: "/images/studies/perrero/bottle-liquid-cachapa.png",
    pdpImg: "/images/studies/perrero/pdp-liquid-cachapa.png",
    ingredientImg: "/images/studies/perrero/ing-corn.png",
    secondaryIngImg: "/images/studies/perrero/ing-chili.png",
    mascotImg: "/images/studies/perrero/ing-mascot-garlic.png",
    badgeText: "FIRE-CHARRED CORN · HONEY · PAPRIKA",
    description:
      "Fire-roasted sweet yellow corn blended with smoked paprika, wildflower honey, and a tang of apple cider vinegar. The iconic golden drizzle from every Caracas corner.",
    tasteProfile: [
      "Fire-charred sweet yellow corn leads with smoky sweetness",
      "Wildflower honey rounds out the toasted griddle notes",
      "Smoked paprika & cider vinegar add bright tang",
      "Silky pour made for burgers, tenders, and street dogs",
    ],
    pairing: [
      "Cachapas con queso",
      "Street dogs",
      "Crispy tenders",
      "Smash burgers",
      "Grilled pork",
    ],
    ingredients:
      "Fire-Charred Sweet Corn, Smoked Paprika, Apple Cider Vinegar, Wildflower Honey, Roasted Onion, Sea Salt.",
    orbitItems: [
      { label: "CHARRED CORN", img: "/images/studies/perrero/ing-corn.png", x: -118, y: -64 },
      { label: "SMOKED AJÍ", img: "/images/studies/perrero/ing-chili.png", x: 118, y: -48 },
      { label: "ROASTED GARLIC", img: "/images/studies/perrero/ing-garlic.png", x: -108, y: 74 },
      { label: "FRESH LIME", img: "/images/studies/perrero/ing-lime.png", x: 110, y: 68 },
    ],
  },
  {
    id: "tocineta-tartar",
    slug: "tocineta-tartar",
    num: "04",
    name: "TOCINETA TARTAR",
    shortName: "TOCINETA TARTAR",
    category: "sweet",
    tagline: "Crunchy sweet pickles, crispy shallots & smoky bacon depth.",
    price: 12,
    size: "12 OZ · 355 ML",
    heat: 0,
    accentHex: "#E05638",
    cardBgHex: "#AE3B26",
    pdpBgHex: "#943220",
    bottleImg: "/images/studies/perrero/bottle-tocineta-tartar.png",
    pdpImg: "/images/studies/perrero/pdp-tocineta-tartar.png",
    ingredientImg: "/images/studies/perrero/ing-bacon.png",
    secondaryIngImg: "/images/studies/perrero/ing-garlic.png",
    mascotImg: "/images/studies/perrero/ing-mascot-avocado.png",
    badgeText: "SMOKED BACON · PICKLE CRUNCH · DILL",
    description:
      "Not your grandma's fish tartar. Packed with finely diced sweet gherkin pickles, caramelized shallots, smoky bacon bits, and fresh dill for maximum crunch per squeeze.",
    tasteProfile: [
      "Smoky caramelized bacon depth in every squeeze",
      "Crisp diced sweet gherkin pickles bring real crunch",
      "Fresh dill & capers brighten the savory base",
      "Zero heat — pure umami crowd-pleaser on burgers",
    ],
    pairing: [
      "Perro especial",
      "Smash burgers",
      "Onion rings",
      "Empanadas",
      "Crispy fish tacos",
    ],
    ingredients:
      "Sweet Gherkin Pickles, Smoked Bacon Bits, Caramelized Shallots, Capers, Fresh Dill, Avocado Oil, Apple Cider Vinegar.",
    orbitItems: [
      { label: "SMOKED BACON", img: "/images/studies/perrero/ing-bacon.png", x: -120, y: -62 },
      { label: "ROASTED GARLIC", img: "/images/studies/perrero/ing-garlic.png", x: 118, y: -50 },
      { label: "FRESH LIME", img: "/images/studies/perrero/ing-lime.png", x: -104, y: 76 },
      { label: "CHARRED CORN", img: "/images/studies/perrero/ing-corn.png", x: 110, y: 66 },
    ],
  },
  {
    id: "molotov-love",
    slug: "molotov-love",
    num: "05",
    name: "MOLOTOV LOVE",
    shortName: "MOLOTOV LOVE",
    category: "fire",
    tagline: "Aromatic Venezuelan ají dulce meets roasted red habanero.",
    price: 13,
    size: "12 OZ · 355 ML",
    heat: 4,
    accentHex: "#F02E49",
    cardBgHex: "#B5172E",
    pdpBgHex: "#991328",
    bottleImg: "/images/studies/perrero/bottle-molotov-love.png",
    pdpImg: "/images/studies/perrero/pdp-molotov-love.png",
    ingredientImg: "/images/studies/perrero/ing-chili.png",
    secondaryIngImg: "/images/studies/perrero/ing-lime.png",
    mascotImg: "/images/studies/perrero/ing-mascot-garlic.png",
    badgeText: "HABANERO · AJÍ DULCE · TROPICAL HEAT",
    description:
      "Real tropical fruit meets serious street heat. Roasted red habaneros balanced with sweet mango, charred tomato, and fragrant ají dulce — heat with actual flavor.",
    tasteProfile: [
      "Sweet ripe mango & roasted tomato open smooth",
      "Fragrant Venezuelan ají dulce layers tropical aroma",
      "Fire-roasted red habanero kicks in right on cue",
      "Warm lingering heat without bitter vinegar burn",
    ],
    pairing: [
      "Everything",
      "Tacos & arepas",
      "Crispy wings",
      "Grilled ribs",
      "Late-night survival",
    ],
    ingredients:
      "Roasted Red Habanero, Sweet Ají Dulce, Ripe Mango, Fire-Roasted Tomato, Garlic, Lime Juice, Cane Vinegar, Sea Salt.",
    orbitItems: [
      { label: "RED HABANERO", img: "/images/studies/perrero/ing-chili.png", x: -120, y: -60 },
      { label: "FRESH LIME", img: "/images/studies/perrero/ing-lime.png", x: 118, y: -50 },
      { label: "ROASTED GARLIC", img: "/images/studies/perrero/ing-garlic.png", x: -108, y: 74 },
      { label: "HASS AVOCADO", img: "/images/studies/perrero/ing-avocado.png", x: 110, y: 68 },
    ],
  },
];

export function getSauceBySlug(slug: string): PerreroSauce | undefined {
  return PERRERO_SAUCES.find((s) => s.slug === slug);
}

export const FEATURE_STACK = [
  {
    id: "no-syrup",
    title: "NO CORN SYRUP",
    copy: "Sweet is fine. Sugar-lab syrup is not. We skip the cheap fillers so real roasted garlic, avocado, and sweet corn carry every drop.",
    icon: "corn",
  },
  {
    id: "no-seed-oils",
    title: "NO SEED OILS",
    copy: "Zero industrial soybean or canola sludge. If an ingredient reads like a chemistry project, it stays out of the bottle.",
    icon: "drop",
  },
  {
    id: "caracas-craft",
    title: "3AM CARACAS RECIPE",
    copy: "Inspired by the legendary late-night street carts of Sabana Grande & Las Mercedes — bottled fresh in small batches.",
    icon: "flame",
  },
];

export const WHY_PILLARS = [
  {
    num: "01",
    badge: "SMALL BATCHES",
    copy: "Blended in tight runs so every bottle tastes like the perrero just chopped the cilantro five minutes ago.",
  },
  {
    num: "02",
    badge: "REAL INGREDIENTS",
    copy: "Real avocado. Roasted garlic. Sweet ají dulce. No powders, no gummy thickeners, no shortcuts.",
  },
  {
    num: "03",
    badge: "OH, THIS?",
    copy: "Caracas Street Cart Hall of Fame — Unofficially voted 'Best Reason to Eat at 3AM' by every night owl in town.",
  },
];

export const STREET_REVIEWS = [
  {
    handle: "@CARACASBITES",
    city: "MIAMI, FL",
    duration: "0:24",
    sauceId: "guasacaca-seria",
    sauceName: "GUASACACA SERIA",
    accentHex: "#58C446",
    bottleImg: "/images/studies/perrero/bottle-guasacaca.png",
    quote:
      "Put this on two dogs at midnight and suddenly I was back on a corner in Caracas. Zero mayo taste, pure avocado punch.",
  },
  {
    handle: "@3AM_LASMERCEDES",
    city: "BROOKLYN, NY",
    duration: "0:19",
    sauceId: "las-mercedes",
    sauceName: "3.AM LAS MERCEDES",
    accentHex: "#F0B938",
    bottleImg: "/images/studies/perrero/bottle-las-mercedes.png",
    quote:
      "Ordered the 3-pack on a whim. Finished the 3.AM Las Mercedes bottle in four days on fries, chicken, and straight off a spoon.",
  },
  {
    handle: "@GRILL_MARCO",
    city: "AUSTIN, TX",
    duration: "0:31",
    sauceId: "molotov-love",
    sauceName: "MOLOTOV LOVE",
    accentHex: "#F02E49",
    bottleImg: "/images/studies/perrero/bottle-molotov-love.png",
    quote:
      "Most hot sauces just burn your tongue. Molotov Love tastes like roasted mango and smoky peppers before the kick hits.",
  },
  {
    handle: "@PERREROCLUB",
    city: "MADRID, ES",
    duration: "0:22",
    sauceId: "liquid-cachapa",
    sauceName: "LIQUID CACHAPA",
    accentHex: "#F5841F",
    bottleImg: "/images/studies/perrero/bottle-liquid-cachapa.png",
    quote:
      "The Liquid Cachapa + Tocineta Tartar combo ruined regular ketchup forever. Best bottle design in my fridge.",
  },
  {
    handle: "@SALSAMANIA_NYC",
    city: "QUEENS, NY",
    duration: "0:27",
    sauceId: "tocineta-tartar",
    sauceName: "TOCINETA TARTAR",
    accentHex: "#E05638",
    bottleImg: "/images/studies/perrero/bottle-tocineta-tartar.png",
    quote:
      "Crunchy pickle bits and smoky bacon depth in every squeeze. Smash burgers at home will never be the same.",
  },
];

export interface Stockist {
  name: string;
  city: "CARACAS" | "MIAMI" | "NEW YORK" | "MADRID";
  neighborhood: string;
  address: string;
  hours: string;
  flavors: string;
}

export const STOCKISTS: Stockist[] = [
  {
    name: "LA ESQUINA DE LAS MERCEDES",
    city: "CARACAS",
    neighborhood: "Las Mercedes",
    address: "Calle Madrid c/ Veracruz, Caracas 1060",
    hours: "Thu–Sun · 7PM – 4AM",
    flavors: "Full 5-Bottle Lineup",
  },
  {
    name: "BODEGÓN SABANA GRANDE",
    city: "CARACAS",
    neighborhood: "Sabana Grande",
    address: "Av. Casanova, Local 14, Caracas 1050",
    hours: "Mon–Sat · 10AM – 8PM",
    flavors: "Guasacaca + 3.AM + Molotov",
  },
  {
    name: "WYNWOOD PANTRY & GRILL",
    city: "MIAMI",
    neighborhood: "Wynwood",
    address: "2418 NW 2nd Ave, Miami, FL 33127",
    hours: "Daily · 11AM – 10PM",
    flavors: "Full 5-Bottle Lineup + 3-Packs",
  },
  {
    name: "DORAL AREPA PROVISIONS",
    city: "MIAMI",
    neighborhood: "Doral",
    address: "8350 NW 53rd St, Doral, FL 33166",
    hours: "Daily · 9AM – 9PM",
    flavors: "Guasacaca + Cachapa + Tartar",
  },
  {
    name: "CHELSEA HOT SAUCE EMPORIUM",
    city: "NEW YORK",
    neighborhood: "Chelsea",
    address: "174 8th Ave, New York, NY 10011",
    hours: "Tue–Sun · 12PM – 8PM",
    flavors: "Full 5-Bottle Lineup",
  },
  {
    name: "CHAMBERÍ MERCADO URBANO",
    city: "MADRID",
    neighborhood: "Chamberí",
    address: "Calle de Ponzano 42, 28003 Madrid",
    hours: "Tue–Sun · 11AM – 11PM",
    flavors: "Full 5-Bottle Lineup + 3-Packs",
  },
];
