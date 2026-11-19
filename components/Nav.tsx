"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useScrolled } from "@/hooks/useScrolled";

type NavKey =
  | "work"
  | "packages"
  | "process"
  | "about"
  | "contact"
  | "merch"
  | "audit";

type NavProps = {
  active?: NavKey | null;
};

const SCROLL_SECTIONS: { id: string; key: NavKey }[] = [
  { id: "packages", key: "packages" },
  { id: "work", key: "work" },
  { id: "process", key: "process" },
];

export function Nav({ active = null }: NavProps) {
  const scrolled = useScrolled(40);
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrollKey, setScrollKey] = useState<NavKey | null>(null);
  const menuId = useId();

  const linkRefs = useRef<Partial<Record<NavKey, HTMLAnchorElement | null>>>(
    {}
  );
  const navLinksRef = useRef<HTMLUListElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);

  const isHome = pathname === "/" || pathname === "/es";
  const activeKey: NavKey | null = active ?? (isHome ? scrollKey : null);

  const LINKS: {
    href: string;
    label: string;
    key: NavKey;
    external?: boolean;
    isButton?: boolean;
  }[] = [
    { href: "/#work", label: t.nav.work, key: "work" },
    { href: "/#packages", label: t.nav.packages, key: "packages" },
    { href: "/#process", label: t.nav.process, key: "process" },
    { href: "/about", label: t.nav.about, key: "about" },
    {
      href: "https://fuelorfool.ing",
      label: t.nav.lab,
      key: "audit",
      external: true,
    },
    { href: "/contact", label: t.nav.contact, key: "contact", isButton: true },
  ];

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
    const mq = window.matchMedia("(min-width: 961px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const targets = SCROLL_SECTIONS.map((s) => ({
      ...s,
      el: document.getElementById(s.id),
    })).filter(
      (s): s is { id: string; key: NavKey; el: HTMLElement } => !!s.el
    );
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        let bestKey: NavKey | null = null;
        let bestRatio = -1;
        for (const entry of entries) {
          const match = targets.find((tItem) => tItem.el === entry.target);
          if (!match || !entry.isIntersecting) continue;
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestKey = match.key;
          }
        }
        if (bestKey) setScrollKey(bestKey);
        else if (window.scrollY < 200) setScrollKey(null);
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-30% 0px -30% 0px" }
    );
    targets.forEach((tItem) => io.observe(tItem.el));
    return () => io.disconnect();
  }, [isHome]);

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

  const seedPillOrigin = useCallback(() => {
    const pill = pillRef.current;
    const wrap = navLinksRef.current;
    const origin = linkRefs.current.work;
    if (!pill || !wrap || !origin) return;
    const wrapRect = wrap.getBoundingClientRect();
    const originRect = origin.getBoundingClientRect();
    pill.style.transition = "none";
    pill.style.top = originRect.top - wrapRect.top + "px";
    pill.style.left = originRect.left - wrapRect.left + "px";
    pill.style.width = "0px";
    pill.style.height = originRect.height + "px";
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
  }, [placePill, seedPillOrigin, lang]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(placePill, 60);
    return () => clearTimeout(timer);
  }, [open, placePill]);

  const close = () => setOpen(false);

  const navClass =
    [scrolled ? "scrolled" : "", open ? "menu-open" : ""]
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
          alt="The Juanimal Studio"
          className="nav-logo"
        />
      </Link>

      <div className="nav-right-controls">
        <div
          className="lang-toggle lang-toggle-mobile"
          role="group"
          aria-label="Language"
        >
          <button
            type="button"
            className={lang === "en" ? "is-active" : undefined}
            onClick={() => setLang("en")}
          >
            EN
          </button>
          <button
            type="button"
            className={lang === "es" ? "is-active" : undefined}
            onClick={() => setLang("es")}
          >
            ES
          </button>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle-bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label={t.nav.closeMenu}
          onClick={close}
        />
      )}

      <ul className="nav-links" id={menuId} ref={navLinksRef}>
        <span ref={pillRef} className="nav-pill" aria-hidden="true" />
        {LINKS.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                aria-current={activeKey === link.key ? "page" : undefined}
                className={
                  [
                    activeKey === link.key ? "active" : "",
                    link.isButton ? "nav-cta-link" : "",
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                onClick={close}
                ref={(el) => {
                  if (!link.isButton) {
                    linkRefs.current[link.key] = el;
                  } else if (activeKey === "contact") {
                    linkRefs.current[link.key] = el;
                  }
                }}
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
        <li className="lang-toggle-li">
          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === "en" ? "is-active" : undefined}
              onClick={() => {
                setLang("en");
                close();
              }}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === "es" ? "is-active" : undefined}
              onClick={() => {
                setLang("es");
                close();
              }}
            >
              ES
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
}
