"use client";

import { useEffect, useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { startCheckout, type CartLine } from "@/lib/checkout";

type Filter = "all" | "shirts" | "posters" | "stickers" | "mugs";
type TeeColor = "white" | "black";
type Category = Exclude<Filter, "all">;

type MerchItem = {
  id: string;
  cat: Category;
  tag: string;
  title: string;
  price: number;
  kind: "tee" | "female-fly-tee" | "devsaurus-tee" | "poster" | "dragon-sticker" | "burst-sticker" | "brew-mug" | "seal-mug";
  /** Shown in the product detail view. */
  blurb: string;
  details: string[];
  /** Only apparel carries sizes. */
  sizes?: readonly string[];
};

const APPAREL_SIZES = ["S", "M", "L", "XL", "XXL"] as const;
const POSTER_SIZES = ['12x18"', '18x24"', '24x36"'] as const;

const TEE = {
  white: "/images/merch-tee-white.jpg",
  black: "/images/merch-tee-black.jpg",
} as const;

const FEMALE_FLY = {
  front: "/images/merch/tee-female-fly-front-v1.webp",
  back: "/images/merch/tee-female-fly-back-v1.webp",
} as const;

const DEVSAURUS_TEE = {
  front: "/images/merch/tee-devsaurus-front-v1.webp",
  back: "/images/merch/tee-devsaurus-back-v1.webp",
} as const;

const DEVSAURUS_POSTER = "/images/merch/poster-devsaurus-v1.webp";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "shirts", label: "Shirts" },
  { id: "posters", label: "Posters" },
  { id: "stickers", label: "Stickers" },
  { id: "mugs", label: "Mugs" },
];

const ITEMS: MerchItem[] = [
  {
    id: "tee",
    cat: "shirts",
    tag: "Apparel",
    title: "Tech Wizard Tee",
    price: 28,
    kind: "tee",
    blurb: "Heavyweight cotton, printed the way the site looks: aged halftone, hard ink, no gloss. The dragon rides the chest; the studio mark sits on the back collar.",
    details: ["240 gsm ringspun cotton","Water-based print, softens with every wash","Runs true to size — size up for a boxy fit"],
    sizes: APPAREL_SIZES
  },
  {
    id: "female-fly",
    cat: "shirts",
    tag: "Apparel",
    title: "Devra Tee",
    price: 28,
    kind: "female-fly-tee",
    blurb: "The studio dragon in leather-jacket rockabilly mode, front and back — bandana, glasses, wings spread clear across the shoulder blades. Black only.",
    details: ["240 gsm ringspun cotton","Water-based print, softens with every wash","Runs true to size — size up for a boxy fit","Black only — full front & back print"],
    sizes: APPAREL_SIZES
  },
  {
    id: "devsaurus",
    cat: "shirts",
    tag: "Apparel · Limited",
    title: "DevSaurus Limited Edition",
    price: 28,
    kind: "devsaurus-tee",
    blurb: "A punk-coded dragon soldering away at a CRT, breadboard and all — with the DevSaurus definition printed underneath. Studio mark on the back collar. White, limited run.",
    details: ["240 gsm ringspun cotton","Water-based print, softens with every wash","Runs true to size — size up for a boxy fit","White only — limited edition, while stocks last"],
    sizes: APPAREL_SIZES
  },
  {
    id: "devsaurus-poster",
    cat: "posters",
    tag: "Print · Limited",
    title: "DevSaurus Poster Limited Edition",
    price: 22,
    kind: "poster",
    blurb: "The full DevSaurus illustration and definition, printed as a poster. Same aged-halftone linework, straight off the desk and onto your wall.",
    details: ["Archival matte print","Ships rolled in a rigid mailer","Limited edition, while stocks last"],
    sizes: POSTER_SIZES
  },
  {
    id: "dragon",
    cat: "stickers",
    tag: "Sticker Pack",
    title: "Dragon Seal Pack ×5",
    price: 9,
    kind: "dragon-sticker",
    blurb: "Five die-cut seals of the studio dragon, laminated so they survive laptops, bottles and weather.",
    details: ["5 stickers, 7–9 cm each","Matte laminate, UV resistant","Weatherproof — outdoor safe"]
  },
  {
    id: "burst",
    cat: "stickers",
    tag: "Sticker Pack",
    title: "Studio Burst Pack ×5",
    price: 9,
    kind: "burst-sticker",
    blurb: "The starburst marks from the hero, cut loose as five stickers. Same aged print, same fire.",
    details: ["5 stickers, 7–9 cm each","Matte laminate, UV resistant","Weatherproof — outdoor safe"]
  },
  {
    id: "brew",
    cat: "mugs",
    tag: "Drinkware",
    title: "Wizard Brew Mug",
    price: 18,
    kind: "brew-mug",
    blurb: "A mug built for the third coffee of the afternoon. Glazed inside and out, print wraps the full body.",
    details: ["325 ml stoneware","Dishwasher and microwave safe","Print wraps both sides"]
  },
  {
    id: "seal",
    cat: "mugs",
    tag: "Drinkware",
    title: "Midnight Seal Mug",
    price: 18,
    kind: "seal-mug",
    blurb: "The midnight variant: ink-dark glaze with the seal in cream. Same body, opposite mood.",
    details: ["325 ml stoneware","Dishwasher and microwave safe","Print wraps both sides"]
  },
];

function Thumb({ kind, tee }: { kind: MerchItem["kind"]; tee: TeeColor }) {
  const [side, setSide] = useState<"front" | "back">("front");

  if (kind === "tee") {
    return (
      <div className="merch-thumb" style={{ padding: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={TEE[tee]}
          alt="Tech Wizard Tee"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  if (kind === "female-fly-tee") {
    return (
      <div className="merch-thumb" style={{ padding: 0, position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FEMALE_FLY[side]}
          alt={`Female Fly Tee — ${side === "front" ? "front" : "back"}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <button
          type="button"
          className="merch-side-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setSide((s) => (s === "front" ? "back" : "front"));
          }}
        >
          {side === "front" ? "View back" : "View front"}
        </button>
      </div>
    );
  }

  if (kind === "devsaurus-tee") {
    return (
      <div className="merch-thumb" style={{ padding: 0, position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DEVSAURUS_TEE[side]}
          alt={`DevSaurus Limited Edition Tee — ${side === "front" ? "front" : "back"}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <button
          type="button"
          className="merch-side-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setSide((s) => (s === "front" ? "back" : "front"));
          }}
        >
          {side === "front" ? "View back" : "View front"}
        </button>
      </div>
    );
  }

  if (kind === "poster") {
    return (
      <div className="merch-thumb" style={{ padding: 12 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DEVSAURUS_POSTER}
          alt="DevSaurus Poster Limited Edition"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>
    );
  }

  if (kind === "dragon-sticker") {
    return (
      <div className="merch-thumb">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <g transform="rotate(-6 50 50)">
            <path
              d="M18 18 L82 18 L82 78 L60 78 L50 90 L40 78 L18 78 Z"
              fill="#F3E9CE"
              stroke="#171009"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M18 18 L30 26 L18 30 Z"
              fill="#E6D8B4"
              stroke="#171009"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <polygon
              points="50.0,12.0 56.7,20.9 67.0,16.6 68.4,27.6 79.4,29.0 75.1,39.3 84.0,46.0 75.1,52.7 79.4,63.0 68.4,64.4 67.0,75.4 56.7,71.1 50.0,80.0 43.3,71.1 33.0,75.4 31.6,64.4 20.6,63.0 24.9,52.7 16.0,46.0 24.9,39.3 20.6,29.0 31.6,27.6 33.0,16.6 43.3,20.9"
              fill="#E04E1F"
              stroke="#171009"
              strokeWidth="3"
              strokeLinejoin="round"
              transform="translate(0,-2) scale(.62) translate(30,25)"
            />
          </g>
        </svg>
      </div>
    );
  }

  if (kind === "burst-sticker") {
    return (
      <div className="merch-thumb">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <g transform="rotate(5 50 50)">
            <polygon
              points="50,4 62,20 80,12 78,32 96,40 80,50 88,68 68,64 62,84 50,68 38,84 32,64 12,68 20,50 4,40 22,32 20,12 38,20"
              fill="#F3E9CE"
              stroke="#171009"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <text
              x="50"
              y="46"
              textAnchor="middle"
              fontFamily="Archivo Black, sans-serif"
              fontSize="15"
              fill="#171009"
            >
              WEB
            </text>
            <text
              x="50"
              y="63"
              textAnchor="middle"
              fontFamily="Archivo Black, sans-serif"
              fontSize="15"
              fill="#E04E1F"
            >
              AI
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (kind === "brew-mug") {
    return (
      <div className="merch-thumb">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path
            d="M28 22 L28 78 C28 84 34 88 44 88 L60 88 C70 88 76 84 76 78 L76 22 Z"
            fill="#F3E9CE"
            stroke="#171009"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <rect x="28" y="22" width="48" height="10" fill="#171009" opacity=".08" />
          <path
            d="M76 34 C88 34 90 56 76 60"
            fill="none"
            stroke="#171009"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M32 50 L72 50 L68 68 L36 68 Z"
            fill="#E04E1F"
            stroke="#171009"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <text
            x="52"
            y="63"
            textAnchor="middle"
            fontFamily="Yellowtail, cursive"
            fontSize="15"
            fill="#F3E9CE"
          >
            Studio
          </text>
          <path
            d="M40 16 Q36 10 40 4"
            fill="none"
            stroke="#171009"
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".5"
          />
          <path
            d="M52 16 Q48 8 52 2"
            fill="none"
            stroke="#171009"
            strokeWidth="3"
            strokeLinecap="round"
            opacity=".5"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="merch-thumb">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M28 22 L28 78 C28 84 34 88 44 88 L60 88 C70 88 76 84 76 78 L76 22 Z"
          fill="#171009"
          stroke="#171009"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M76 34 C88 34 90 56 76 60"
          fill="none"
          stroke="#171009"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="52" cy="54" r="17" fill="#F3E9CE" stroke="#E04E1F" strokeWidth="3" />
        <polygon
          points="52.0,44.7 54.1,49.1 59.0,47.1 56.9,51.5 61.3,53.5 56.9,55.6 59.0,60.0 54.1,57.9 52.0,62.3 49.9,57.9 45.0,60.0 47.1,55.6 42.7,53.5 47.1,51.5 45.0,47.1 49.9,49.1"
          fill="#E04E1F"
          stroke="#171009"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Swatches({
  kind,
  tee,
  onTee,
}: {
  kind: MerchItem["kind"];
  tee: TeeColor;
  onTee: (c: TeeColor) => void;
}) {
  if (kind === "tee") {
    return (
      <div className="merch-swatches" aria-label="Colors">
        <button
          type="button"
          className={`swatch${tee === "white" ? " active" : ""}`}
          style={{ background: "#FFFFFF" }}
          aria-label="White"
          onClick={() => onTee("white")}
        />
        <button
          type="button"
          className={`swatch${tee === "black" ? " active" : ""}`}
          style={{ background: "#171009" }}
          aria-label="Black"
          onClick={() => onTee("black")}
        />
      </div>
    );
  }

  if (kind === "female-fly-tee") {
    return (
      <div className="merch-swatches" aria-label="Colors">
        <button
          type="button"
          className="swatch active"
          style={{ background: "#171009" }}
          aria-label="Black"
        />
      </div>
    );
  }

  if (kind === "devsaurus-tee") {
    return (
      <div className="merch-swatches" aria-label="Colors">
        <button
          type="button"
          className="swatch active"
          style={{ background: "#FFFFFF" }}
          aria-label="White"
        />
      </div>
    );
  }

  if (kind === "poster") {
    return null;
  }

  if (kind === "dragon-sticker") {
    return (
      <div className="merch-swatches" aria-label="Colors">
        <button
          type="button"
          className="swatch active"
          style={{ background: "#E04E1F" }}
          aria-label="Orange"
        />
      </div>
    );
  }

  if (kind === "burst-sticker" || kind === "brew-mug") {
    return (
      <div className="merch-swatches" aria-label="Colors">
        <button
          type="button"
          className="swatch active"
          style={{ background: "#F3E9CE" }}
          aria-label="Cream"
        />
        {kind === "brew-mug" && (
          <button
            type="button"
            className="swatch"
            style={{ background: "#171009" }}
            aria-label="Ink black"
          />
        )}
      </div>
    );
  }

  return (
    <div className="merch-swatches" aria-label="Colors">
      <button
        type="button"
        className="swatch active"
        style={{ background: "#171009" }}
        aria-label="Ink black"
      />
    </div>
  );
}

export function MerchShop() {
  const [filter, setFilter] = useState<Filter>("all");
  const [tee, setTee] = useState<TeeColor>("white");
  // Real line items, so checkout can be priced server-side. The tee is
  // tracked per colour, since black and white are separate SKUs.
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detailSize, setDetailSize] = useState<string | null>(null);
  const [sizeHint, setSizeHint] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState(false);
  const [bump, setBump] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const visible = useMemo(
    () => ITEMS.filter((item) => filter === "all" || item.cat === filter),
    [filter]
  );

  useEffect(() => {
    if (!bump) return;
    const t = window.setTimeout(() => setBump(false), 280);
    return () => window.clearTimeout(t);
  }, [bump]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(false), 1600);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!detailId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailId]);

  useEffect(() => {
    if (!addedId) return;
    const t = window.setTimeout(() => setAddedId(null), 900);
    return () => window.clearTimeout(t);
  }, [addedId]);

  const cartCount = lines.reduce((n, l) => n + l.qty, 0);

  const addToCart = (item: MerchItem, size?: string) => {
    const variant = item.kind === "tee" ? tee : undefined;
    setLines((prev) => {
      const match = prev.find(
        (l) => l.id === item.id && l.variant === variant && l.size === size
      );
      if (match) {
        return prev.map((l) =>
          l === match ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...prev, { id: item.id, variant, size, qty: 1 }];
    });
    setBump(true);
    setToast(true);
    setAddedId(item.id);
    setCartOpen(true);
  };

  const detailItem = detailId ? ITEMS.find((i) => i.id === detailId) ?? null : null;

  const openDetail = (item: MerchItem) => {
    setDetailId(item.id);
    setDetailSize(null);
    setSizeHint(false);
  };
  const closeDetail = () => setDetailId(null);

  /** Line -> catalogue entry, so the panel can show titles and prices. */
  const lineProduct = (line: CartLine) =>
    ITEMS.find((i) => i.id === line.id);

  const changeQty = (line: CartLine, delta: number) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.id === line.id && l.variant === line.variant && l.size === line.size
            ? { ...l, qty: l.qty + delta }
            : l
        )
        .filter((l) => l.qty > 0)
    );
  };

  const subtotal = lines.reduce((sum, l) => {
    const p = lineProduct(l);
    return sum + (p ? p.price * l.qty : 0);
  }, 0);

  const goToCheckout = async () => {
    if (!lines.length || paying) return;
    setPaying(true);
    setPayError(null);
    const result = await startCheckout(lines, "standard");
    if (!result.ok) {
      setPayError(result.error);
      setPaying(false);
    }
    // On success the browser is already navigating to Stripe.
  };

  return (
    <section className="merch sec-pad" id="merch">
      <Reveal as="span" className="eyebrow">
        Wear the magic
      </Reveal>
      <Reveal as="h2" className="sec-h2">
        Straight from
        <br />
        <span className="accent">the spellbook</span>
      </Reveal>

      <Reveal
        as="div"
        className="merch-tabs"
        role="tablist"
        aria-label="Filter merch by category"
      >
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            className={`mf-btn${filter === id ? " active" : ""}`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </Reveal>

      <div className="merch-grid" id="merchGrid">
        {visible.map((item) => (
          <Reveal
            as="article"
            key={item.id}
            className="merch-card"
            data-cat={item.cat}
          >
            <div
              role="button"
              tabIndex={0}
              className="merch-card-open"
              onClick={() => openDetail(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openDetail(item);
                }
              }}
              aria-label={`View ${item.title}`}
            >
              <Thumb kind={item.kind} tee={tee} />
            </div>
            <div className="merch-body">
              <span className="merch-tag">{item.tag}</span>
              <h3>
                <button
                  type="button"
                  className="merch-title-btn"
                  onClick={() => openDetail(item)}
                >
                  {item.title}
                </button>
              </h3>
              <Swatches kind={item.kind} tee={tee} onTee={setTee} />
              <div className="merch-foot">
                <span className="merch-price">${item.price}</span>
                <button
                  type="button"
                  className={`merch-add${addedId === item.id ? " added" : ""}`}
                  onClick={() =>
                    item.sizes ? openDetail(item) : addToCart(item)
                  }
                >
                  {addedId === item.id
                    ? "Added!"
                    : item.sizes
                      ? "Choose size"
                      : "Add to cart"}
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {detailItem && (
        <div
          className="pd-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={detailItem.title}
          onClick={closeDetail}
        >
          <div className="pd-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pd-close"
              onClick={closeDetail}
              aria-label="Close"
            >
              &times;
            </button>

            <div className="pd-art">
              <Thumb kind={detailItem.kind} tee={tee} />
            </div>

            <div className="pd-info">
              <span className="merch-tag">{detailItem.tag}</span>
              <h3 className="pd-title">{detailItem.title}</h3>
              <p className="pd-blurb">{detailItem.blurb}</p>

              {detailItem.kind === "tee" && (
                <div className="pd-block">
                  <span className="pd-label">
                    Colour — {tee === "black" ? "Black" : "White"}
                  </span>
                  <Swatches kind={detailItem.kind} tee={tee} onTee={setTee} />
                </div>
              )}

              {detailItem.sizes && (
                <div className="pd-block">
                  <span className="pd-label">Size</span>
                  <div className="pd-sizes">
                    {detailItem.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        className={`pd-size${detailSize === sz ? " active" : ""}`}
                        onClick={() => {
                          setDetailSize(sz);
                          setSizeHint(false);
                        }}
                        aria-pressed={detailSize === sz}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  {sizeHint && (
                    <p className="pd-hint" role="alert">
                      Pick a size first.
                    </p>
                  )}
                </div>
              )}

              <ul className="pd-details">
                {detailItem.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>

              <div className="pd-foot">
                <span className="merch-price">${detailItem.price}</span>
                <button
                  type="button"
                  className="merch-add pd-add"
                  onClick={() => {
                    if (detailItem.sizes && !detailSize) {
                      setSizeHint(true);
                      return;
                    }
                    addToCart(detailItem, detailSize ?? undefined);
                    closeDetail();
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`cart-fab${bump ? " bump" : ""}`}
        aria-label={
          cartCount ? `Checkout — ${cartCount} item(s)` : "Shopping cart (empty)"
        }
        onClick={() => setCartOpen((o) => !o)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#171009"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L22 7H6" />
          <circle cx="10" cy="21" r="1.4" fill="#171009" />
          <circle cx="18" cy="21" r="1.4" fill="#171009" />
        </svg>
        <span className="cart-count">{cartCount}</span>
      </button>

      <div
        className={`cart-panel${cartOpen ? " open" : ""}`}
        role="dialog"
        aria-label="Your cart"
        aria-hidden={!cartOpen}
      >
        <div className="cart-panel-head">
          <h3>Your cart</h3>
          <button
            type="button"
            className="cart-panel-close"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        <div className="cart-panel-items">
          {lines.length === 0 && <p className="cart-panel-empty">Your cart is empty.</p>}
          {lines.map((line) => {
            const p = lineProduct(line);
            if (!p) return null;
            const key = `${line.id}-${line.variant ?? ""}-${line.size ?? ""}`;
            const label = [
              p.title,
              line.variant ? (line.variant === "black" ? "Black" : "White") : null,
              line.size,
            ]
              .filter(Boolean)
              .join(" — ");
            return (
              <div className="cart-line" key={key}>
                <div className="cart-line-info">
                  <span className="cart-line-name">{label}</span>
                  <span className="cart-line-price">${p.price * line.qty}</span>
                </div>
                <div className="cart-qty">
                  <button
                    type="button"
                    onClick={() => changeQty(line, -1)}
                    aria-label={`Remove one ${label}`}
                  >
                    &minus;
                  </button>
                  <span>{line.qty}</span>
                  <button
                    type="button"
                    onClick={() => changeQty(line, 1)}
                    aria-label={`Add one ${label}`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-panel-foot">
          <div className="cart-total">
            <span>Total</span>
            <span>${subtotal}</span>
          </div>
          <button
            type="button"
            className="cta-btn cart-checkout"
            onClick={goToCheckout}
            disabled={!cartCount || paying}
          >
            {paying ? "Opening…" : "Checkout"}
          </button>
          {payError && <p className="cart-panel-error">{payError}</p>}
        </div>
      </div>
      <div className={`cart-toast${toast ? " show" : ""}`}>
        {paying ? "Opening checkout…" : "Added to cart!"}
      </div>
      {payError && (
        <p
          role="alert"
          style={{
            marginTop: 18,
            textAlign: "center",
            color: "var(--red)",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {payError}
        </p>
      )}
    </section>
  );
}

