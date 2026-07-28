"use client";

import { useEffect, useMemo, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { startCheckout, type CartLine } from "@/lib/checkout";

type Filter = "all" | "shirts" | "stickers" | "mugs";
type TeeColor = "white" | "black";
type Category = Exclude<Filter, "all">;

type MerchItem = {
  id: string;
  cat: Category;
  tag: string;
  title: string;
  price: number;
  kind: "tee" | "hoodie" | "dragon-sticker" | "burst-sticker" | "brew-mug" | "seal-mug";
};

const TEE = {
  white: "/images/merch-tee-white.jpg",
  black: "/images/merch-tee-black.jpg",
} as const;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "shirts", label: "Shirts" },
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
  },
  {
    id: "hoodie",
    cat: "shirts",
    tag: "Apparel",
    title: "Spellbook Hoodie",
    price: 52,
    kind: "hoodie",
  },
  {
    id: "dragon",
    cat: "stickers",
    tag: "Sticker Pack",
    title: "Dragon Seal Pack ×5",
    price: 9,
    kind: "dragon-sticker",
  },
  {
    id: "burst",
    cat: "stickers",
    tag: "Sticker Pack",
    title: "Studio Burst Pack ×5",
    price: 9,
    kind: "burst-sticker",
  },
  {
    id: "brew",
    cat: "mugs",
    tag: "Drinkware",
    title: "Wizard Brew Mug",
    price: 18,
    kind: "brew-mug",
  },
  {
    id: "seal",
    cat: "mugs",
    tag: "Drinkware",
    title: "Midnight Seal Mug",
    price: 18,
    kind: "seal-mug",
  },
];

function Thumb({ kind, tee }: { kind: MerchItem["kind"]; tee: TeeColor }) {
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

  if (kind === "hoodie") {
    return (
      <div className="merch-thumb">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path
            d="M35 8 L15 20 L22 35 L30 29 L30 92 L70 92 L70 29 L78 35 L85 20 L65 8 C65 8 60 19 50 19 C40 19 35 8 35 8 Z"
            fill="#171009"
            stroke="#171009"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle cx="50" cy="52" r="15" fill="none" stroke="#F3E9CE" strokeWidth="3" />
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontFamily="Archivo Black, sans-serif"
            fontSize="16"
            fill="#F3E9CE"
          >
            JS
          </text>
        </svg>
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

  if (kind === "hoodie") {
    return (
      <div className="merch-swatches" aria-label="Colors">
        <button
          type="button"
          className="swatch active"
          style={{ background: "#171009" }}
          aria-label="Ink black"
        />
        <button
          type="button"
          className="swatch"
          style={{ background: "#6E3410" }}
          aria-label="Rust brown"
        />
      </div>
    );
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
    if (!addedId) return;
    const t = window.setTimeout(() => setAddedId(null), 900);
    return () => window.clearTimeout(t);
  }, [addedId]);

  const cartCount = lines.reduce((n, l) => n + l.qty, 0);

  const addToCart = (item: MerchItem) => {
    const variant = item.kind === "tee" ? tee : undefined;
    setLines((prev) => {
      const match = prev.find((l) => l.id === item.id && l.variant === variant);
      if (match) {
        return prev.map((l) =>
          l === match ? { ...l, qty: l.qty + 1 } : l
        );
      }
      return [...prev, { id: item.id, variant, qty: 1 }];
    });
    setBump(true);
    setToast(true);
    setAddedId(item.id);
  };

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
            <Thumb kind={item.kind} tee={tee} />
            <div className="merch-body">
              <span className="merch-tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <Swatches kind={item.kind} tee={tee} onTee={setTee} />
              <div className="merch-foot">
                <span className="merch-price">${item.price}</span>
                <button
                  type="button"
                  className={`merch-add${addedId === item.id ? " added" : ""}`}
                  onClick={() => addToCart(item)}
                >
                  {addedId === item.id ? "Added!" : "Add to cart"}
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <button
        type="button"
        className={`cart-fab${bump ? " bump" : ""}`}
        aria-label={
          cartCount ? `Checkout — ${cartCount} item(s)` : "Shopping cart (empty)"
        }
        onClick={goToCheckout}
        disabled={!cartCount || paying}
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

