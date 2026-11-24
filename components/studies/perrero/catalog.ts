export interface PerreroSauce {
  id: string;
  num: string;
  name: string;
  shortName: string;
  tagline: string;
  price: number;
  size: string;
  heat: number; // 0..5
  accentHex: string;
  liquidTopHex: string;
  liquidMidHex: string;
  liquidDarkHex: string;
  speckleHex: string;
  badgeText: string;
  description: string;
  pairing: string[];
  ingredients: string;
  orbitItems: Array<{ label: string; emoji: string; x: number; y: number }>;
}

export const PERRERO_SAUCES: PerreroSauce[] = [
  {
    id: "guasacaca",
    num: "01",
    name: "GUASACACA VERDE",
    shortName: "GUASACACA",
    tagline: "The emerald Caracas street-cart legend. Zero mayo shortcuts.",
    price: 12,
    size: "12 OZ · 355 ML",
    heat: 1,
    accentHex: "#4E8A2E",
    liquidTopHex: "#82C341",
    liquidMidHex: "#4E8A2E",
    liquidDarkHex: "#244714",
    speckleHex: "#1E3B10",
    badgeText: "AVOCADO · CILANTRO · AJÍ DULCE",
    description:
      "Whipped ripe avocado, fresh cilantro, Venezuelan sweet ají dulce, green bell pepper, and cold-pressed lime. Bright, herby, and dangerously addictive on everything.",
    pairing: ["Perro con todo", "Tequeños", "Crispy papitas", "Grilled steaks"],
    ingredients:
      "Hass Avocado, Fresh Cilantro, Sweet Ají Dulce, Green Bell Pepper, White Onion, Garlic, Lime Juice, White Vinegar, Sea Salt.",
    orbitItems: [
      { label: "AVOCADO", emoji: "🥑", x: -115, y: -62 },
      { label: "LIME", emoji: "🍋", x: 112, y: -48 },
      { label: "CILANTRO", emoji: "🌿", x: -102, y: 74 },
      { label: "GARLIC", emoji: "🧄", x: 108, y: 68 },
    ],
  },
  {
    id: "garlic-3am",
    num: "02",
    name: "3AM GARLIC VELVET",
    shortName: "3AM GARLIC",
    tagline: "Silky midnight cart garlic emulsion. Kissing is optional.",
    price: 12,
    size: "12 OZ · 355 ML",
    heat: 1,
    accentHex: "#C99A2E",
    liquidTopHex: "#F4E7C1",
    liquidMidHex: "#DFC88E",
    liquidDarkHex: "#8F743A",
    speckleHex: "#3C5E22",
    badgeText: "ROASTED GARLIC · PARSLEY · LIME",
    description:
      "Triple-garlic punch: slow-roasted cloves for sweetness, raw confit garlic for bite, and bright flat-leaf parsley. Built for 3AM street dogs after the show.",
    pairing: ["Loaded hot dogs", "Garlic fries", "Arepa Reina Pepiada", "Fried chicken"],
    ingredients:
      "Roasted Garlic, Confit Garlic, Avocado Oil, Free-Range Egg Yolk, Flat-Leaf Parsley, Lime Juice, Dijon Mustard, Sea Salt.",
    orbitItems: [
      { label: "ROASTED GARLIC", emoji: "🧄", x: -116, y: -56 },
      { label: "PARSLEY", emoji: "🌿", x: 112, y: -54 },
      { label: "SEA SALT", emoji: "🧂", x: -96, y: 74 },
      { label: "LIME", emoji: "🍋", x: 108, y: 66 },
    ],
  },
  {
    id: "sweet-corn",
    num: "03",
    name: "SWEET CORN GOLD",
    shortName: "SWEET CORN",
    tagline: "Charred sweet corn cream that puts boring mustard to shame.",
    price: 12,
    size: "12 OZ · 355 ML",
    heat: 1,
    accentHex: "#D97E1A",
    liquidTopHex: "#FFD147",
    liquidMidHex: "#E8961E",
    liquidDarkHex: "#8C4D07",
    speckleHex: "#A83B0B",
    badgeText: "FIRE-CHARRED CORN · HONEY · PAPRIKA",
    description:
      "Fire-roasted sweet yellow corn blended with smoked paprika, wildflower honey, and a tang of apple cider vinegar. The iconic golden drizzle from every Caracas corner.",
    pairing: ["Cachapas", "Street dogs", "Crispy tenders", "Burgers"],
    ingredients:
      "Fire-Charred Sweet Corn, Smoked Paprika, Apple Cider Vinegar, Wildflower Honey, Roasted Onion, Sea Salt.",
    orbitItems: [
      { label: "SWEET CORN", emoji: "🌽", x: -112, y: -62 },
      { label: "HONEY", emoji: "🍯", x: 114, y: -50 },
      { label: "PAPRIKA", emoji: "🌶️", x: -102, y: 72 },
      { label: "ONION", emoji: "🧅", x: 106, y: 68 },
    ],
  },
  {
    id: "smoky-tartar",
    num: "04",
    name: "SMOKY BACON TARTAR",
    shortName: "SMOKY TARTAR",
    tagline: "Crunchy sweet pickles, crispy shallots & smoky bacon depth.",
    price: 12,
    size: "12 OZ · 355 ML",
    heat: 0,
    accentHex: "#D4542A",
    liquidTopHex: "#F2C6A0",
    liquidMidHex: "#D98A5B",
    liquidDarkHex: "#7E3B1D",
    speckleHex: "#3C5E22",
    badgeText: "PICKLE CRUNCH · BACON · DILL",
    description:
      "Not your grandma's fish tartar. Packed with finely diced sweet pickles, caramelized shallots, smoky bacon bits, and fresh dill for maximum crunch per squeeze.",
    pairing: ["Perro especial", "Smash burgers", "Onion rings", "Empanadas"],
    ingredients:
      "Sweet Gherkin Pickles, Smoked Bacon Bits, Caramelized Shallots, Capers, Fresh Dill, Avocado Oil, Apple Cider Vinegar.",
    orbitItems: [
      { label: "PICKLES", emoji: "🥒", x: -114, y: -60 },
      { label: "SMOKED BACON", emoji: "🥓", x: 114, y: -48 },
      { label: "SHALLOTS", emoji: "🧅", x: -100, y: 74 },
      { label: "DILL", emoji: "🌿", x: 106, y: 64 },
    ],
  },
  {
    id: "calle-heat",
    num: "05",
    name: "CALLE HEAT AJÍ",
    shortName: "CALLE HEAT",
    tagline: "Aromatic Venezuelan ají dulce meets roasted red habanero.",
    price: 13,
    size: "12 OZ · 355 ML",
    heat: 4,
    accentHex: "#C82233",
    liquidTopHex: "#FF4A3D",
    liquidMidHex: "#C82233",
    liquidDarkHex: "#690C16",
    speckleHex: "#F5C242",
    badgeText: "AJÍ DULCE · HABANERO · MANGO",
    description:
      "Real tropical fruit meets serious street heat. Roasted red habaneros balanced with sweet mango, charred tomato, and fragrant ají dulce — heat with actual flavor.",
    pairing: ["Everything", "Tacos & arepas", "Wings", "Late-night survival"],
    ingredients:
      "Roasted Red Habanero, Sweet Ají Dulce, Ripe Mango, Fire-Roasted Tomato, Garlic, Lime Juice, Cane Vinegar, Sea Salt.",
    orbitItems: [
      { label: "HABANERO", emoji: "🌶️", x: -116, y: -58 },
      { label: "MANGO", emoji: "🥭", x: 114, y: -50 },
      { label: "TOMATO", emoji: "🍅", x: -102, y: 72 },
      { label: "LIME", emoji: "🍋", x: 108, y: 66 },
    ],
  },
];

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
    author: "MARCO V.",
    city: "MIAMI, FL",
    sauce: "GUASACACA VERDE",
    quote: "Put this on two hot dogs at midnight and suddenly I was back on a corner in Caracas. Zero mayo taste, pure avocado punch.",
  },
  {
    author: "SOFÍA R.",
    city: "BROOKLYN, NY",
    sauce: "3AM GARLIC VELVET",
    quote: "Ordered the 3-pack on a whim. Finished the garlic bottle in four days on fries, chicken, and straight off a spoon.",
  },
  {
    author: "DEVON K.",
    city: "AUSTIN, TX",
    sauce: "CALLE HEAT AJÍ",
    quote: "Most hot sauces just burn your tongue. This one actually tastes like roasted mango and smoky peppers before the kick hits.",
  },
  {
    author: "ELENA M.",
    city: "MADRID, ES",
    sauce: "SWEET CORN GOLD",
    quote: "The sweet corn + smoky bacon tartar combo ruined regular ketchup forever. Best packaging in my fridge.",
  },
];
