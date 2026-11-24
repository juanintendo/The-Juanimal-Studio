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
import type { ArepaMenuItem } from "./catalog";

export interface TrayItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  tag: string;
}

interface Arepa2GoContextValue {
  tray: TrayItem[];
  totalItems: number;
  subtotal: number;
  trayOpen: boolean;
  setTrayOpen: (open: boolean) => void;
  addToTray: (item: ArepaMenuItem, qty?: number) => void;
  updateQty: (id: string, delta: number) => void;
}

const Arepa2GoContext = createContext<Arepa2GoContextValue | null>(null);

export function useArepa2GoTray() {
  const ctx = useContext(Arepa2GoContext);
  if (!ctx) throw new Error("useArepa2GoTray must be used inside Arepa2GoShell");
  return ctx;
}

export function Arepa2GoShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const [tray, setTray] = useState<TrayItem[]>([
    {
      id: "caracas",
      name: "CARACAS",
      price: 10.5,
      qty: 1,
      img: "/images/studies/arepa2go/arepa-caracas.png",
      tag: "01 · AREPAS",
    },
    {
      id: "tequenos",
      name: "TEQUEÑOS (5 PCS)",
      price: 7.0,
      qty: 1,
      img: "/images/studies/arepa2go/side-tequenos.png",
      tag: "02 · SIDES & SWEETS",
    },
  ]);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem("a2g_intro_seen_v2");
    if (!reduced && !seen) {
      setShowIntro(true);
      window.sessionStorage.setItem("a2g_intro_seen_v2", "1");
      const timer = window.setTimeout(() => setShowIntro(false), 1250);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const totalItems = useMemo(
    () => tray.reduce((sum, item) => sum + item.qty, 0),
    [tray]
  );

  const subtotal = useMemo(
    () => tray.reduce((sum, item) => sum + item.price * item.qty, 0),
    [tray]
  );

  const addToTray = useCallback((item: ArepaMenuItem, qty = 1) => {
    setOrdered(false);
    setTray((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          qty,
          img: item.img,
          tag: item.categoryLabel,
        },
      ];
    });
    setTrayOpen(true);
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setTray((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const value = useMemo(
    () => ({
      tray,
      totalItems,
      subtotal,
      trayOpen,
      setTrayOpen,
      addToTray,
      updateQty,
    }),
    [tray, totalItems, subtotal, trayOpen, addToTray, updateQty]
  );

  const navItems = [
    { href: "/studies/arepa2go", label: "TOP" },
    { href: "/studies/arepa2go/menu", label: "PRODUCT" },
    { href: "/studies/arepa2go/ingredients", label: "INGREDIENTS" },
    { href: "/studies/arepa2go/museum", label: "MUSEUM" },
    { href: "/studies/arepa2go/visit", label: "VISIT" },
  ];

  return (
    <Arepa2GoContext.Provider value={value}>
      <a href="#a2g-main" className="a2g-skip-link">
        Skip to content
      </a>

      {/* ── CALORIEMATE YELLOW WIPE INTRO ──────────────────────── */}
      {showIntro && (
        <div className="a2g-intro-overlay" aria-hidden="true">
          <div className="a2g-intro-curtain" />
          <img
            src="/images/studies/arepa2go/logo-arepa2go.png"
            alt=""
            className="a2g-intro-logo"
          />
        </div>
      )}

      {/* ── CALORIEMATE FLOATING FULL-WIDTH HEADER ─────────────── */}
      <header className="a2g-header-wrap">
        <div className="a2g-header-bar">
          <Link href="/studies/arepa2go" className="a2g-brand-link">
            <img
              src="/images/studies/arepa2go/logo-arepa2go.png"
              alt="Arepa 2GO Latin American Kitchen"
              className="a2g-logo-img"
            />
          </Link>

          <div className="a2g-header-right">
            <div
              role="navigation"
              className="a2g-text-nav"
              aria-label="Arepa 2GO navigation"
            >
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={active ? "a2g-nav-link active" : "a2g-nav-link"}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="a2g-header-icons">
              <button
                type="button"
                className="a2g-tray-pill"
                onClick={() => setTrayOpen(true)}
                aria-label={`Open takeaway tray (${totalItems} items)`}
              >
                TRAY ({totalItems})
              </button>
              <button
                type="button"
                className="a2g-mobile-toggle"
                aria-expanded={mobileMenuOpen}
                aria-controls="a2g-mobile-nav"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                {mobileMenuOpen ? "CLOSE" : "MENU"}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            id="a2g-mobile-nav"
            role="navigation"
            className="a2g-mobile-drawer"
            aria-label="Arepa 2GO mobile navigation"
          >
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active ? "a2g-mobile-nav-link active" : "a2g-mobile-nav-link"
                  }
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <main id="a2g-main">{children}</main>

      {/* ── ICONIC CALORIEMATE YELLOW ROUNDED FOOTER ───────────── */}
      <footer className="a2g-cmt-footer-wrap">
        <img
          src="/images/studies/arepa2go/hero-triptych-arepa.png"
          alt=""
          className="a2g-footer-peek"
          aria-hidden="true"
        />

        <div className="a2g-cmt-footer-card">
          <div className="a2g-cmt-footer-top">
            <button
              type="button"
              aria-label="Scroll back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              TOP ↑
            </button>
          </div>

          <div className="a2g-cmt-footer-body">
            <div className="a2g-cmt-footer-left">
              <Link href="/studies/arepa2go" aria-label="Arepa 2GO Home">
                <img
                  src="/images/studies/arepa2go/logo-arepa2go.png"
                  alt="Arepa 2GO"
                  className="a2g-footer-logo-lg"
                />
              </Link>
              <div className="a2g-social-pill">
                <span>SOCIAL</span>
                <a
                  href="https://arepa2go.net/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Arepa 2GO Website"
                >
                  WEB
                </a>
                <a href="mailto:arepa2go.info@gmail.com" aria-label="Email">
                  MAIL
                </a>
              </div>
            </div>

            <div className="a2g-cmt-footer-cols">
              <div className="a2g-cmt-col">
                <h4>PRODUCT</h4>
                <ul>
                  <li>
                    <Link href="/studies/arepa2go/menu">Signature Arepas (6)</Link>
                  </li>
                  <li>
                    <Link href="/studies/arepa2go/menu">Empanadas &amp; Sides</Link>
                  </li>
                  <li>
                    <Link href="/studies/arepa2go/menu">Tropical Drinks</Link>
                  </li>
                  <li>
                    <Link href="/studies/arepa2go/menu">Full Menu</Link>
                  </li>
                </ul>
              </div>

              <div className="a2g-cmt-col">
                <h4>INGREDIENTS</h4>
                <ul>
                  <li>
                    <Link href="/studies/arepa2go/ingredients">
                      100% Gluten-Free Masa
                    </Link>
                  </li>
                  <li>
                    <Link href="/studies/arepa2go/ingredients">
                      3 House Dips Trio
                    </Link>
                  </li>
                  <li>
                    <Link href="/studies/arepa2go/ingredients">
                      Slow-Cooked Craft
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="a2g-cmt-col">
                <h4>MUSEUM &amp; VISIT</h4>
                <ul>
                  <li>
                    <Link href="/studies/arepa2go/museum">
                      White Corn Masa Ritual
                    </Link>
                  </li>
                  <li>
                    <Link href="/studies/arepa2go/museum">
                      Caribbean Stand in Southsea
                    </Link>
                  </li>
                  <li>
                    <Link href="/studies/arepa2go/museum">
                      Takeaway Block Box
                    </Link>
                  </li>
                  <li>
                    <Link href="/studies/arepa2go/visit">
                      Southsea Hours &amp; Reviews
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="a2g-footer-bottom">
          <span>
            AREPA 2GO SOUTHSEA · +44-0239-2791746 · arepa2go.info@gmail.com
          </span>
          <span>
            Reinterpretation of Otsuka CalorieMate (otsuka.co.jp/cmt/) · The
            Juanimal Studio
          </span>
        </div>
      </footer>

      {/* ── SLIDE-OVER TAKEAWAY TRAY ───────────────────────────── */}
      {trayOpen && (
        <div className="a2g-drawer-backdrop" onClick={() => setTrayOpen(false)}>
          <aside
            className="a2g-drawer"
            aria-label="Takeaway tray"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="a2g-drawer-top">
              <div>
                <div className="a2g-drawer-head">
                  <h2>TAKEAWAY TRAY ({totalItems})</h2>
                  <button
                    type="button"
                    className="a2g-close-btn"
                    aria-label="Close tray"
                    onClick={() => setTrayOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                <p className="a2g-drawer-sub">
                  Prepared fresh to order · Southsea Takeaway &amp; Table
                </p>
              </div>

              {tray.length === 0 ? (
                <p style={{ color: "#666", marginTop: 24 }}>
                  Your tray is empty. Pick an arepa or tequeños from the lineup.
                </p>
              ) : (
                <div className="a2g-tray-list">
                  {tray.map((item) => (
                    <div key={item.id} className="a2g-tray-row">
                      <img src={item.img} alt={item.name} className="a2g-tray-img" />
                      <div>
                        <div className="a2g-tray-tag">{item.tag}</div>
                        <div className="a2g-tray-name">{item.name}</div>
                        <div className="a2g-qty-ctrl">
                          <button
                            type="button"
                            aria-label="Decrease"
                            onClick={() => updateQty(item.id, -1)}
                          >
                            −
                          </button>
                          <span>{item.qty}</span>
                          <button
                            type="button"
                            aria-label="Increase"
                            onClick={() => updateQty(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="a2g-tray-price">
                        £{(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="a2g-drawer-foot">
              <div className="a2g-subtotal-row">
                <span>TOTAL</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              {ordered ? (
                <div className="a2g-order-ok">
                  ✓ Demo takeaway ticket printed! Ready in ~15 mins at Southsea
                  kitchen.
                </div>
              ) : (
                <button
                  type="button"
                  className="a2g-checkout-btn"
                  disabled={tray.length === 0}
                  onClick={() => setOrdered(true)}
                >
                  PLACE TAKEAWAY ORDER · £{subtotal.toFixed(2)}
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </Arepa2GoContext.Provider>
  );
}
