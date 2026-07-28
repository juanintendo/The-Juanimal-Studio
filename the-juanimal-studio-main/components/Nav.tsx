"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useScrolled } from "@/hooks/useScrolled";

type NavKey = "about" | "merch" | "contact";

type NavProps = {
  active?: "merch" | "about" | "contact" | null;
};

const LINKS: { href: string; label: string; key: NavKey }[] = [
  { href: "/about", label: "About a Wizard", key: "about" },
  { href: "/merch", label: "Studio Merch", key: "merch" },
  { href: "/contact", label: "Summon me", key: "contact" },
];

// No home sections drive the pill anymore — about, merch and contact are
// all separate routes now, handled entirely by the `active` prop.
const SCROLL_SECTIONS: { id: string; key: NavKey }[] = [];

export function Nav({ active = null }: NavProps) {
  const scrolled = useScrolled(40);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrollKey, setScrollKey] = useState<NavKey | null>(null);
  const menuId = useId();

  const linkRefs = useRef<Partial<Record<NavKey, HTMLAnchorElement | null>>>({});
  const navLinksRef = useRef<HTMLUListElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);

  const activeKey: NavKey | null =
    active === "merch"
      ? "merch"
      : active === "about"
        ? "about"
        : active === "contact"
          ? "contact"
          : pathname === "/"
            ? scrollKey
            : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // ---- Scrollspy: which home section is active right now ----
  useEffect(() => {
    if (pathname !== "/") return;
    const targets = SCROLL_SECTIONS.map((s) => ({
      ...s,
      el: document.getElementById(s.id),
    })).filter((s): s is { id: string; key: NavKey; el: HTMLElement } => !!s.el);
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        let bestKey: NavKey | null = null;
        let bestRatio = -1;
        for (const entry of entries) {
          const match = targets.find((t) => t.el === entry.target);
          if (!match || !entry.isIntersecting) continue;
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestKey = match.key;
          }
        }
        if (bestKey) setScrollKey(bestKey);
        else if (window.scrollY < 200) setScrollKey(null);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-35% 0px -35% 0px" }
    );
    targets.forEach((t) => io.observe(t.el));
    return () => io.disconnect();
  }, [pathname]);

  // ---- Active pill: slide/resize to the active link's real position ----
  const placePill = useCallback(() => {
    const pill = pillRef.current;
    const wrap = navLinksRef.current;
    if (!pill || !wrap) return;
    const a = activeKey ? linkRefs.current[activeKey] : null;
    if (!a) {
      pill.classList.remove("is-visible");
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();
    const linkRect = a.getBoundingClientRect();
    pill.style.top = linkRect.top - wrapRect.top + "px";
    pill.style.left = linkRect.left - wrapRect.left + "px";
    pill.style.width = linkRect.width + "px";
    pill.style.height = linkRect.height + "px";
    pill.classList.add("is-visible");
  }, [activeKey]);

  // Seed the pill collapsed at the first link, with transitions off, so the
  // very first placement (home OR merch) visibly travels into place instead
  // of just appearing — this is what gives merch its arrival animation too,
  // since its active link never otherwise changes after mount.
  const seedPillOrigin = useCallback(() => {
    const pill = pillRef.current;
    const wrap = navLinksRef.current;
    const origin = linkRefs.current.about;
    if (!pill || !wrap || !origin) return;
    const wrapRect = wrap.getBoundingClientRect();
    const originRect = origin.getBoundingClientRect();
    pill.style.transition = "none";
    pill.style.top = originRect.top - wrapRect.top + "px";
    pill.style.left = originRect.left - wrapRect.left + "px";
    pill.style.width = "0px";
    pill.style.height = originRect.height + "px";
    // Force the browser to commit this state before re-enabling transitions,
    // otherwise the two style writes can get coalesced into one frame and
    // the "travel" never gets painted.
    void pill.offsetWidth;
    pill.style.transition = "";
  }, []);

  const didInitRef = useRef(false);
  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
      seedPillOrigin();
      requestAnimationFrame(() => requestAnimationFrame(placePill));
    } else {
      placePill();
    }
    window.addEventListener("resize", placePill);
    return () => window.removeEventListener("resize", placePill);
  }, [placePill, seedPillOrigin]);

  // Reposition once the mobile dropdown finishes opening (layout shifts).
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(placePill, 60);
    return () => clearTimeout(t);
  }, [open, placePill]);

  const close = () => setOpen(false);

  const navClass = [
    scrolled ? "scrolled" : "",
    open ? "menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <nav id="nav" aria-label="Main" className={navClass}>
      <Link
        className="brand"
        href="/#top"
        aria-label="The Juanimal Studio — home"
        onClick={close}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brand-logo.png"
          alt="The Juanimal Studio — Tech Wizard"
          className="nav-logo"
        />
      </Link>

      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-toggle-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={close}
        />
      )}

      <ul className="nav-links" id={menuId} ref={navLinksRef}>
        <span ref={pillRef} className="nav-pill" aria-hidden="true" />
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={activeKey === link.key ? "page" : undefined}
              className={activeKey === link.key ? "active" : undefined}
              onClick={close}
              ref={(el) => {
                linkRefs.current[link.key] = el;
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
