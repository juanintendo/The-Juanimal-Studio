export type ArepaCategory = "arepas" | "sides" | "drinks";

export interface ArepaMenuItem {
  id: string;
  num: string;
  name: string;
  category: ArepaCategory;
  categoryLabel: string;
  price: number;
  tag: string;
  glutenFree: boolean;
  vegetarian: boolean;
  accentHex: string;
  img: string;
  description: string;
  ingredients: string;
}

export const AREPA_MENU: ArepaMenuItem[] = [
  // ── 01 AREPAS ──────────────────────────────────────────────────────────
  {
    id: "sifrina",
    num: "01",
    name: "SIFRINA",
    category: "arepas",
    categoryLabel: "01 · AREPAS",
    price: 9.5,
    tag: "GLUTEN-FREE · REINA PEPIADA",
    glutenFree: true,
    vegetarian: false,
    accentHex: "#F8C61E",
    img: "/images/studies/arepa2go/arepa-sifrina.png",
    description:
      "Shredded chicken-avocado salad crowned with bright grated cheddar cheese inside a crisp griddled white-corn pocket.",
    ingredients:
      "White Corn Masa, Shredded Chicken, Hass Avocado, Cheddar Cheese, Garlic Sauce, Sea Salt.",
  },
  {
    id: "domino",
    num: "02",
    name: "DOMINÓ",
    category: "arepas",
    categoryLabel: "01 · AREPAS",
    price: 8.5,
    tag: "GLUTEN-FREE · VEGETARIAN",
    glutenFree: true,
    vegetarian: true,
    accentHex: "#1AA8A8",
    img: "/images/studies/arepa2go/arepa-domino.png",
    description:
      "The timeless Caracas black-and-white classic: slow-simmered black beans, fresh crumbled white cheese & emerald guasacaca.",
    ingredients:
      "White Corn Masa, Black Beans, Fresh White Cheese, Guasacaca (Avocado & Cilantro).",
  },
  {
    id: "caracas",
    num: "03",
    name: "CARACAS",
    category: "arepas",
    categoryLabel: "01 · AREPAS",
    price: 10.5,
    tag: "GLUTEN-FREE · PABELLÓN",
    glutenFree: true,
    vegetarian: false,
    accentHex: "#F2633A",
    img: "/images/studies/arepa2go/arepa-caracas.png",
    description:
      "Our flagship Pabellón powerhouse: slow-cooked shredded beef, black beans, sweet fried plantain, white cheese & guasacaca.",
    ingredients:
      "White Corn Masa, Slow-Cooked Shredded Beef, Black Beans, Sweet Plantain, White Cheese, Guasacaca.",
  },
  {
    id: "pelua",
    num: "04",
    name: "PELÚA",
    category: "arepas",
    categoryLabel: "01 · AREPAS",
    price: 9.5,
    tag: "GLUTEN-FREE · HOUSE FAVORITE",
    glutenFree: true,
    vegetarian: false,
    accentHex: "#F8C61E",
    img: "/images/studies/arepa2go/arepa-pelua.png",
    description:
      "Tender slow-cooked shredded beef piled high with melted cheddar cheese and finished with silky Venezuelan garlic sauce.",
    ingredients:
      "White Corn Masa, Slow-Cooked Shredded Beef, Cheddar Cheese, House Garlic Sauce.",
  },
  {
    id: "platanera",
    num: "05",
    name: "PLATANERA",
    category: "arepas",
    categoryLabel: "01 · AREPAS",
    price: 9.0,
    tag: "GLUTEN-FREE · VEGETARIAN",
    glutenFree: true,
    vegetarian: true,
    accentHex: "#1AA8A8",
    img: "/images/studies/arepa2go/arepa-platanera.png",
    description:
      "Sweet caramelized plantain meets savoury black beans, fresh pico de gallo, white cheese & bright guasacaca.",
    ingredients:
      "White Corn Masa, Sweet Plantain, Black Beans, Pico de Gallo, White Cheese, Guasacaca.",
  },
  {
    id: "avila",
    num: "06",
    name: "ÁVILA",
    category: "arepas",
    categoryLabel: "01 · AREPAS",
    price: 10.0,
    tag: "GLUTEN-FREE · MOUNTAIN STACK",
    glutenFree: true,
    vegetarian: false,
    accentHex: "#F2633A",
    img: "/images/studies/arepa2go/arepa-avila.png",
    description:
      "Named after Caracas' iconic peak: shredded chicken-avocado, cheddar cheese, sweet plantain & house garlic drizzle.",
    ingredients:
      "White Corn Masa, Chicken-Avocado Salad, Cheddar Cheese, Sweet Plantain, Garlic Sauce.",
  },

  // ── 02 EMPANADAS, SIDES & SWEETS ───────────────────────────────────────
  {
    id: "empanadas",
    num: "07",
    name: "EMPANADAS (CARNE / QUESO / POLLO)",
    category: "sides",
    categoryLabel: "02 · SIDES & SWEETS",
    price: 7.5,
    tag: "GLUTEN-FREE · CRISPY CORN",
    glutenFree: true,
    vegetarian: false,
    accentHex: "#F8C61E",
    img: "/images/studies/arepa2go/side-empanadas.png",
    description:
      "Golden crispy Venezuelan corn turnovers filled to order with slow-cooked shredded beef, fresh white cheese, or shredded chicken.",
    ingredients: "Sweet White Corn Crust, Choice of Carne / Queso / Pollo.",
  },
  {
    id: "tequenos",
    num: "08",
    name: "TEQUEÑOS (5 PCS)",
    category: "sides",
    categoryLabel: "02 · SIDES & SWEETS",
    price: 7.0,
    tag: "VEGETARIAN · PARTY ESSENTIAL",
    glutenFree: false,
    vegetarian: true,
    accentHex: "#F2633A",
    img: "/images/studies/arepa2go/side-tequenos.png",
    description:
      "White cheese fingers wrapped in crisp handmade pastry dough, served piping hot with house garlic sauce.",
    ingredients: "White Queso Blanco, Handmade Wheat Dough, Garlic Dip.",
  },
  {
    id: "tostones",
    num: "09",
    name: "TOSTONES",
    category: "sides",
    categoryLabel: "02 · SIDES & SWEETS",
    price: 8.0,
    tag: "GLUTEN-FREE · VEGETARIAN",
    glutenFree: true,
    vegetarian: true,
    accentHex: "#1AA8A8",
    img: "/images/studies/arepa2go/side-tostones.png",
    description:
      "Twice-fried crispy green plantain discs stacked with black beans, crumbled white cheese, pico de gallo & guasacaca.",
    ingredients: "Green Plantain, Black Beans, White Cheese, Pico de Gallo, Guasacaca.",
  },
  {
    id: "yuca-fries",
    num: "10",
    name: "YUCA FRITA & LATINO FRIES",
    category: "sides",
    categoryLabel: "02 · SIDES & SWEETS",
    price: 6.5,
    tag: "GLUTEN-FREE · VEGETARIAN",
    glutenFree: true,
    vegetarian: true,
    accentHex: "#F8C61E",
    img: "/images/studies/arepa2go/side-yuca-fries.png",
    description:
      "Golden crispy cassava fries paired with skin-on Latino fries dusted in herbs and our emerald guasacaca dip.",
    ingredients: "Cassava (Yuca), Skin-On Potatoes, Sea Salt, Guasacaca.",
  },
  {
    id: "churros",
    num: "11",
    name: "CHURROS CON DULCE DE LECHE",
    category: "sides",
    categoryLabel: "02 · SIDES & SWEETS",
    price: 6.5,
    tag: "VEGETARIAN · ALGO DULCE",
    glutenFree: false,
    vegetarian: true,
    accentHex: "#F2633A",
    img: "/images/studies/arepa2go/side-churros.png",
    description:
      "Five crisp sugar-dusted churros fried fresh to order and served beside rich caramelized dulce de leche.",
    ingredients: "Crisp Churro Dough, Fine Sugar, Caramelized Dulce de Leche.",
  },

  // ── 03 DRINKS & DIPS ───────────────────────────────────────────────────
  {
    id: "coco-loco",
    num: "12",
    name: "COCO LOCO COCKTAIL",
    category: "drinks",
    categoryLabel: "03 · DRINKS & DIPS",
    price: 9.5,
    tag: "CARIBBEAN COCKTAIL",
    glutenFree: true,
    vegetarian: true,
    accentHex: "#1AA8A8",
    img: "/images/studies/arepa2go/drink-coco-loco.png",
    description:
      "Rum, coconut rum, tropical pineapple, blue curaçao & fresh lime over crushed ice — Venezuela in a sip.",
    ingredients: "White Rum, Coconut Rum, Pineapple Juice, Blue Curaçao, Fresh Lime.",
  },
  {
    id: "jugos",
    num: "13",
    name: "JUGOS TROPICALES",
    category: "drinks",
    categoryLabel: "03 · DRINKS & DIPS",
    price: 4.5,
    tag: "GLUTEN-FREE · FRESH FRUIT",
    glutenFree: true,
    vegetarian: true,
    accentHex: "#F8C61E",
    img: "/images/studies/arepa2go/drink-tropical-juices.png",
    description:
      "Chilled tropical fruit juices bursting with sun-ripened passion fruit, mango, or sweet pink guava.",
    ingredients: "Passion Fruit (Parchita), Mango, or Pink Guava, Cane Sugar, Water.",
  },
  {
    id: "dips-trio",
    num: "14",
    name: "HOUSE DIPS TRIO",
    category: "drinks",
    categoryLabel: "03 · DRINKS & DIPS",
    price: 4.0,
    tag: "GLUTEN-FREE · MADE IN HOUSE",
    glutenFree: true,
    vegetarian: true,
    accentHex: "#F2633A",
    img: "/images/studies/arepa2go/dips-trio.png",
    description:
      "Our three daily-blended Venezuelan dipping essentials: Emerald Guasacaca, Traditional Garlic Sauce & Red Picante.",
    ingredients: "Avocado, Cilantro, Garlic, Lime, Venezuelan Chili Peppers.",
  },
];

export const CRAFT_PILLARS = [
  {
    code: "01",
    title: "100% GLUTEN FREE",
    detail: "Pure white cornmeal masa — naturally wheat-free across every arepa, empanada & tostón.",
    color: "#F8C61E",
  },
  {
    code: "02",
    title: "HECHO A MANO",
    detail: "Hand-patted corn pockets griddled crisp on the outside, pillowy-soft inside.",
    color: "#F2633A",
  },
  {
    code: "03",
    title: "SLOW-COOKED",
    detail: "Carne mechada & caraotas negras simmered low with sweet ají, garlic & cumin.",
    color: "#1AA8A8",
  },
  {
    code: "04",
    title: "3 HOUSE DIPS",
    detail: "Guasacaca, Ajo & Picante blended fresh every morning before service.",
    color: "#F8C61E",
  },
  {
    code: "05",
    title: "SOUTHSEA COAST",
    detail: "Five minutes from the beach — Venezuelan warmth meets British seaside sunshine.",
    color: "#F2633A",
  },
];

export const MUSEUM_CHAPTERS = [
  {
    num: "CHAPTER 01",
    title: "THE WHITE CORN MASA RITUAL",
    subtitle: "Pre-cooked cornmeal, warm water, sea salt & two hands.",
    img: "/images/studies/arepa2go/museum-corn-craft.jpg",
    copy: "Before fillings ever touch the grill, everything begins with masa. Patting each disk by hand creates micro-pockets of steam inside so the crust blisters golden while the center stays tender enough to cradle shredded beef, black beans, and avocado.",
  },
  {
    num: "CHAPTER 02",
    title: "CARIBBEAN STAND IN SOUTHSEA",
    subtitle: "Five minutes from the sea — no passport needed.",
    img: "/images/studies/arepa2go/museum-beach-vibe.jpg",
    copy: "Arepa 2GO brings the retro-tropical energy of a Venezuelan beach kiosk to the UK South Coast. Crisp coral stripes, cold Polar beers, fresh lime over crushed ice, and plates built to share after a walk along the promenade.",
  },
  {
    num: "CHAPTER 03",
    title: "THE TAKEAWAY BLOCK SYSTEM",
    subtitle: "Inspired by Otsuka CalorieMate's iconic yellow geometry.",
    img: "/images/studies/arepa2go/museum-box-packaging.jpg",
    copy: "Just like Japan's most recognizable balanced-food block, our takeaway box pairs high-visibility corn-yellow `#F8C61E` with Swiss-grid clarity — keeping hot arepas crisp, tequeños intact, and house dips locked upright from kitchen to beach.",
  },
];

export const GUEST_REVIEWS = [
  {
    author: "LUKE B.",
    source: "GOOGLE REVIEW",
    quote:
      "Absolutely faultless. Lovely small restaurant with a homely feel. The staff are great, very attentive. The food is incredible — we'd never tried Venezuelan food before. We would definitely come back here.",
  },
  {
    author: "MR. STUFFY",
    source: "GOOGLE REVIEW",
    quote:
      "Authentic Venezuelan food in Southsea. This was a surprising find outside London. The decor makes it feel as if you are in a beach cafe on the Caribbean coast. The arepas were top notch, washed down with Polar beer.",
  },
];
