// Authoritative product catalogue.
//
// SECURITY: prices live here, on the server, and are never accepted from the
// client. The browser only ever sends { id, variant, qty }; the checkout route
// looks the real price up in this map. Trusting a client-sent price is how
// storefronts get drained by someone editing a fetch payload in devtools.

export type ProductVariant = "black" | "white";

export type Product = {
  id: string;
  title: string;
  /** Price in the smallest currency unit (cents) to avoid float rounding. */
  unitAmount: number;
  currency: string;
  image: string;
  variants?: ProductVariant[];
  sizes?: readonly string[];
};

export const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export const POSTER_SIZES = ['12x18"', '18x24"', '24x36"'] as const;

export const PRODUCTS: Record<string, Product> = {
  tee: {
    id: "tee",
    title: "Tech Wizard Tee",
    unitAmount: 2800,
    currency: "usd",
    image: "/images/merch-tee-black.jpg",
    variants: ["black", "white"],
    sizes: APPAREL_SIZES,
  },
  "female-fly": {
    id: "female-fly",
    title: "Devra Tee",
    unitAmount: 2800,
    currency: "usd",
    image: "/images/merch/tee-female-fly-front-v1.webp",
    sizes: APPAREL_SIZES,
  },
  devsaurus: {
    id: "devsaurus",
    title: "DevSaurus Limited Edition",
    unitAmount: 2800,
    currency: "usd",
    image: "/images/merch/tee-devsaurus-front-v1.webp",
    sizes: APPAREL_SIZES,
  },
  "devsaurus-poster": {
    id: "devsaurus-poster",
    title: "DevSaurus Poster Limited Edition",
    unitAmount: 2200,
    currency: "usd",
    image: "/images/merch/poster-devsaurus-v1.webp",
    sizes: POSTER_SIZES,
  },
  hoodie: {
    id: "hoodie",
    title: "Spellbook Hoodie",
    unitAmount: 5200,
    currency: "usd",
    image: "/images/merch-tee-white.jpg",
  },
  dragon: {
    id: "dragon",
    title: "Dragon Seal Pack ×5",
    unitAmount: 900,
    currency: "usd",
    image: "/images/star-2.png",
  },
  burst: {
    id: "burst",
    title: "Studio Burst Pack ×5",
    unitAmount: 900,
    currency: "usd",
    image: "/images/star-1.png",
  },
  brew: {
    id: "brew",
    title: "Wizard Brew Mug",
    unitAmount: 1800,
    currency: "usd",
    image: "/images/brand-logo.png",
  },
  seal: {
    id: "seal",
    title: "Midnight Seal Mug",
    unitAmount: 1800,
    currency: "usd",
    image: "/images/brand-logo.png",
  },
};

export type ShippingRate = {
  id: string;
  label: string;
  /** cents */
  amount: number;
  minDays: number;
  maxDays: number;
};

export const SHIPPING_RATES: Record<string, ShippingRate> = {
  standard: {
    id: "standard",
    label: "International standard — tracked",
    amount: 900,
    minDays: 7,
    maxDays: 14,
  },
  express: {
    id: "express",
    label: "International express — tracked",
    amount: 2400,
    minDays: 3,
    maxDays: 5,
  },
};
