"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PerreroSauce } from "./catalog";

export interface CartItem {
  key: string;
  title: string;
  subtitle: string;
  unitPrice: number;
  qty: number;
  accentHex: string;
  img: string;
}

interface PerreroContextValue {
  cart: CartItem[];
  totalItems: number;
  subtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addBottleToCart: (sauce: PerreroSauce, qty?: number, sizeLabel?: string, priceOverride?: number) => void;
  addPackToCart: (sauces: PerreroSauce[]) => void;
  updateQty: (key: string, delta: number) => void;
}

const PerreroContext = createContext<PerreroContextValue | null>(null);

export function usePerreroCart() {
  const ctx = useContext(PerreroContext);
  if (!ctx) {
    throw new Error("usePerreroCart must be used inside PerreroShell");
  }
  return ctx;
}

export function PerreroShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showPromo, setShowPromo] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [clubEmail, setClubEmail] = useState("");
  const [clubJoined, setClubJoined] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([
    {
      key: "guasacaca-seria-1",
      title: "GUASACACA SERIA",
      subtitle: "12 OZ · SINGLE BOTTLE",
      unitPrice: 12,
      qty: 1,
      accentHex: "#58C446",
      img: "/images/studies/perrero/bottle-guasacaca.png",
    },
  ]);

  useEffect(() => {
    let last = window.scrollY > 90;
    setScrolled(last);
    const onScroll = () => {
      const next = window.scrollY > 90;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0),
    [cart]
  );

  const addBottleToCart = useCallback(
    (
      sauce: PerreroSauce,
      qty = 1,
      sizeLabel = `${sauce.size} · SINGLE BOTTLE`,
      priceOverride?: number
    ) => {
      const unitPrice = priceOverride ?? sauce.price;
      const itemKey = `${sauce.id}-${sizeLabel}`;
      setCheckedOut(false);
      setCart((prev) => {
        const existing = prev.find((i) => i.key === itemKey);
        if (existing) {
          return prev.map((i) =>
            i.key === itemKey ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [
          ...prev,
          {
            key: itemKey,
            title: sauce.name,
            subtitle: sizeLabel,
            unitPrice,
            qty,
            accentHex: sauce.accentHex,
            img: sauce.bottleImg,
          },
        ];
      });
      setCartOpen(true);
    },
    []
  );

  const addPackToCart = useCallback((chosen: PerreroSauce[]) => {
    if (chosen.length !== 3) return;
    const key = `3pack-${chosen.map((s) => s.id).join("-")}`;
    const subtitle = chosen.map((s) => s.shortName).join(" + ");
    setCheckedOut(false);
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          key,
          title: "CUSTOM 3-PACK BUNDLE",
          subtitle,
          unitPrice: 32,
          qty: 1,
          accentHex: "#F5841F",
          img: chosen[0].bottleImg,
        },
      ];
    });
    setCartOpen(true);
  }, []);

  const updateQty = useCallback((key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const value = useMemo(
    () => ({
      cart,
      totalItems,
      subtotal,
      cartOpen,
      setCartOpen,
      addBottleToCart,
      addPackToCart,
      updateQty,
    }),
    [cart, totalItems, subtotal, cartOpen, addBottleToCart, addPackToCart, updateQty]
  );

  const shipProgress = Math.min(100, (subtotal / 35) * 100);
  const navLinks = [
    { href: "/studies/perrero/shop", label: "SHOP" },
    { href: "/studies/perrero/wholesale", label: "WHOLESALE" },
    { href: "/studies/perrero/about", label: "ABOUT" },
    { href: "/studies/perrero/find-us", label: "STORES" },
    { href: "/studies/perrero/contact", label: "CONTACT" },
  ];

  return (
    <PerreroContext.Provider value={value}>
      {/* ── PROMO BANNER ───────────────────────────────────────── */}
      {showPromo && (
        <div className="pr-promo">
          <Link href="/studies/perrero/shop#pr-bundle">
            BUILD YOUR OWN 3-PACK &amp; SAVE $4.00 →
          </Link>
          <button
            type="button"
            className="pr-promo-close"
            aria-label="Dismiss promo"
            onClick={() => setShowPromo(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── STICKY MORPHING HEADER ─────────────────────────────── */}
      <header className="pr-header">
        <Link href="/studies/perrero" className="pr-header-logo" aria-label="Perrero Sauce Co. Home">
          {scrolled ? (
            <img
              src="/images/studies/perrero/brand-crest-compact.png"
              alt="Perrero"
              className="pr-emblem-compact"
            />
          ) : (
            <img
              src="/images/studies/perrero/brand-crest-ivory.png"
              alt="Perrero Sauce Co."
              className="pr-emblem-full"
            />
          )}
        </Link>

        {!scrolled ? (
          <div role="navigation" className="pr-topnav" aria-label="Store navigation">
            {navLinks.map((item) => {
              const active =
                pathname === item.href ||
                (item.href === "/studies/perrero/shop" &&
                  pathname?.startsWith("/studies/perrero/shop/"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "pr-nav-active" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <button type="button" onClick={() => setCartOpen(true)}>
              CART({totalItems})
            </button>
          </div>
        ) : (
          <div className="pr-scrolled-actions">
            <Link href="/studies/perrero/shop" className="pr-pill-cta">
              GET SAUCE
            </Link>
            <button
              type="button"
              className="pr-icon-btn"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 7h12l-1.5 11h-9L6 7z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
              {totalItems > 0 && <span className="pr-cart-badge">{totalItems}</span>}
            </button>
          </div>
        )}
      </header>

      <main>{children}</main>

      {/* ── BOXED CLUB FOOTER ──────────────────────────────────── */}
      <footer className="pr-footer">
        <div className="pr-footer-grid">
          <div className="pr-footer-box" style={{ alignItems: "center" }}>
            <Link href="/studies/perrero" aria-label="Perrero Home">
              <img
                src="/images/studies/perrero/brand-crest-ivory.png"
                alt="Perrero Sauce Co."
                className="pr-footer-crest"
              />
            </Link>
          </div>

          <div className="pr-footer-box">
            <ul className="pr-footer-links">
              <li>
                <Link href="/studies/perrero/shop">SHOP SAUCES</Link>
              </li>
              <li>
                <Link href="/studies/perrero/wholesale">WHOLESALE</Link>
              </li>
              <li>
                <Link href="/studies/perrero/about">OUR STORY</Link>
              </li>
              <li>
                <Link href="/studies/perrero/find-us">FIND US LOCALLY</Link>
              </li>
              <li>
                <Link href="/studies/perrero/contact">CONTACT</Link>
              </li>
            </ul>
          </div>

          <div className="pr-footer-box pr-footer-club">
            <h3>JOIN THE PERRERO CLUB</h3>
            <p>New flavors. Restocks. Midnight cart recipes. Merch drops.</p>
            {clubJoined ? (
              <p style={{ color: "#58C446", fontWeight: 700, margin: 0 }}>
                ✓ You&apos;re in the midnight club. Watch your inbox.
              </p>
            ) : (
              <form
                className="pr-club-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (clubEmail.trim()) setClubJoined(true);
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email..."
                  value={clubEmail}
                  onChange={(e) => setClubEmail(e.target.value)}
                />
                <button type="submit" aria-label="Subscribe">
                  →
                </button>
              </form>
            )}
          </div>

          <div className="pr-footer-social">
            <a
              href="https://instagram.com/juanintendo"
              target="_blank"
              rel="noreferrer"
              className="pr-social-btn"
            >
              IG
            </a>
            <a href="mailto:juan@fuelorfool.ing" className="pr-social-btn">
              MAIL
            </a>
          </div>
        </div>

        <div className="pr-footer-bottom">
          <span>
            © 2026 Perrero Sauce Co. · 7-Route E-Commerce Study by The Juanimal Studio
          </span>
          <span>Inspired by Bucks Sauce (Buzzworthy)</span>
        </div>
      </footer>

      {/* ── SLIDE-OVER CART DRAWER ─────────────────────────────── */}
      {cartOpen && (
        <div className="pr-drawer-backdrop" onClick={() => setCartOpen(false)}>
          <aside
            className="pr-drawer"
            aria-label="Shopping cart"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minHeight: 0,
                flex: 1,
              }}
            >
              <div className="pr-drawer-head">
                <h2>YOUR CART ({totalItems})</h2>
                <button
                  type="button"
                  aria-label="Close cart"
                  onClick={() => setCartOpen(false)}
                  style={{ fontSize: 18, padding: 6 }}
                >
                  ✕
                </button>
              </div>

              <div className="pr-ship-bar">
                {subtotal >= 35 ? (
                  <span>✓ FREE EXPRESS SHIPPING UNLOCKED!</span>
                ) : (
                  <span>
                    Add <strong>${(35 - subtotal).toFixed(2)}</strong> more for
                    free Caracas Express Shipping
                  </span>
                )}
                <div className="pr-ship-track">
                  <div
                    className="pr-ship-fill"
                    style={{ width: `${shipProgress}%` }}
                  />
                </div>
              </div>

              {cart.length === 0 ? (
                <p style={{ color: "var(--pr-dim)", fontSize: 14, marginTop: 20 }}>
                  Your cart is empty. Pick a weapon from the Caracas lineup.
                </p>
              ) : (
                <div className="pr-cart-list">
                  {cart.map((item) => (
                    <div key={item.key} className="pr-cart-item">
                      <img src={item.img} alt={item.title} className="pr-cart-thumb" />
                      <div>
                        <div
                          style={{
                            fontFamily: "var(--pr-ui)",
                            fontWeight: 800,
                            fontSize: 17,
                          }}
                        >
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--pr-dim)",
                            marginBottom: 6,
                          }}
                        >
                          {item.subtitle}
                        </div>
                        <div className="pr-qty">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(item.key, -1)}
                          >
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQty(item.key, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--pr-ui)",
                          fontWeight: 800,
                          fontSize: 18,
                        }}
                      >
                        ${(item.unitPrice * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: "1px dashed var(--pr-line)", paddingTop: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  fontFamily: "var(--pr-ui)",
                  fontWeight: 800,
                  fontSize: 22,
                }}
              >
                <span>SUBTOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {checkedOut ? (
                <div
                  style={{
                    border: "1px solid #58C446",
                    borderRadius: 8,
                    padding: "12px 14px",
                    fontSize: 13,
                    color: "#58C446",
                    textAlign: "center",
                  }}
                >
                  ✓ Demo order locked in! No real card charged — e-commerce study verified.
                </div>
              ) : (
                <button
                  type="button"
                  className="pr-pill-cta"
                  style={{ width: "100%", padding: "14px 20px", textAlign: "center" }}
                  disabled={cart.length === 0}
                  onClick={() => setCheckedOut(true)}
                >
                  CHECKOUT · ${subtotal.toFixed(2)}
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </PerreroContext.Provider>
  );
}
