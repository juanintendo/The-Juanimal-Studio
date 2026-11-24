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
      window.sessionStorage.getItem("a2g_intro_seen");
    if (!reduced && !seen) {
      setShowIntro(true);
      window.sessionStorage.setItem("a2g_intro_seen", "1");
      const timer = window.setTimeout(() => setShowIntro(false), 1250);
      return () => window.clearTimeout(timer);
    }
  }, []);

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
    { href: "/studies/arepa2go/menu", label: "MENU" },
    { href: "/studies/arepa2go/ingredients", label: "INGREDIENTS" },
    { href: "/studies/arepa2go/museum", label: "MUSEUM" },
    { href: "/studies/arepa2go/visit", label: "VISIT" },
  ];

  return (
    <Arepa2GoContext.Provider value={value}>
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

      {/* ── FLOATING SWISS-JAPANESE HEADER ─────────────────────── */}
      <header className="a2g-header">
        <Link href="/studies/arepa2go" className="a2g-brand-link">
          <img
            src="/images/studies/arepa2go/logo-arepa2go.png"
            alt="Arepa 2GO Latin American Kitchen"
            className="a2g-logo-img"
          />
        </Link>

        <div
          role="navigation"
          className="a2g-pill-nav"
          aria-label="Arepa 2GO navigation"
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "a2g-nav-link active" : "a2g-nav-link"}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            className="a2g-tray-btn"
            onClick={() => setTrayOpen(true)}
          >
            TRAY ({totalItems})
          </button>
        </div>
      </header>

      <main>{children}</main>

      {/* ── CLEAN SWISS GALLERY FOOTER ─────────────────────────── */}
      <footer className="a2g-footer">
        <div className="a2g-footer-inner">
          <div className="a2g-footer-brand">
            <img
              src="/images/studies/arepa2go/logo-arepa2go.png"
              alt="Arepa 2GO"
              className="a2g-footer-logo"
            />
            <p className="a2g-footer-desc">
              Authentic Venezuelan Cuisine · Five minutes from the beach in
              Southsea, UK. Hecho a mano, 100% gluten-free white corn arepas &amp;
              tropical drinks.
            </p>
          </div>

          <div className="a2g-footer-col">
            <h4>EXPERIENCE</h4>
            <Link href="/studies/arepa2go">Top / Overview</Link>
            <Link href="/studies/arepa2go/menu">Full Food &amp; Drink Menu</Link>
            <Link href="/studies/arepa2go/ingredients">Ingredients &amp; Dips</Link>
            <Link href="/studies/arepa2go/museum">Arepa Museum</Link>
            <Link href="/studies/arepa2go/visit">Visit &amp; Takeaway</Link>
          </div>

          <div className="a2g-footer-col">
            <h4>SOUTHSEA KITCHEN</h4>
            <span>arepa2go.info@gmail.com</span>
            <span>+44-0239-2791746</span>
            <span>Southsea, Portsmouth · UK</span>
            <span className="a2g-badge-gf">GLUTEN-FREE FRIENDLY</span>
          </div>
        </div>

        <div className="a2g-footer-bottom">
          <span>
            © 2026 Arepa 2GO Study · Architecture inspired by Otsuka CalorieMate
            (otsuka.co.jp/cmt/)
          </span>
          <span>Designed by The Juanimal Studio</span>
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
