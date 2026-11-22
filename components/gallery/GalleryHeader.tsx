"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

interface GalleryHeaderProps {
  active: "home" | "about" | "case";
  tone?: "paper" | "light";
  onBrandClick?: () => void;
  onAboutClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function GalleryHeader({
  active,
  tone = "paper",
  onBrandClick,
  onAboutClick,
}: GalleryHeaderProps) {
  const { lang, setLang } = useLanguage();

  const labels = {
    en: {
      brand: "JUANIMAL DESIGNS",
      posters: "POSTERS",
      about: "ABOUT",
    },
    es: {
      brand: "JUANIMAL DESIGNS",
      posters: "PÓSTERS",
      about: "SOBRE MÍ",
    },
  }[lang];

  return (
    <header className={`jd-header ${tone === "light" ? "is-light" : "is-paper"}`}>
      <div className="jd-header-left">
        {onBrandClick ? (
          <button type="button" className="jd-brand-link" onClick={onBrandClick}>
            {labels.brand}
          </button>
        ) : (
          <Link href="/" className="jd-brand-link">
            {labels.brand}
          </Link>
        )}
      </div>

      <nav className="jd-header-nav" aria-label="Gallery primary navigation">
        {active !== "home" ? (
          <Link href="/" className="jd-nav-link">
            <span>{labels.posters}</span>
            <ZigZagUnderline />
          </Link>
        ) : null}

        <Link
          href="/about"
          className={`jd-nav-link ${active === "about" ? "is-current" : ""}`}
          onClick={onAboutClick}
        >
          <span>{labels.about}</span>
          <ZigZagUnderline />
        </Link>

        <div className="jd-pill-group" role="group" aria-label="Language toggle">
          <button
            type="button"
            className={`jd-pill-btn ${lang === "en" ? "is-active" : ""}`}
            onClick={() => setLang("en")}
            aria-pressed={lang === "en"}
          >
            EN
          </button>
          <button
            type="button"
            className={`jd-pill-btn ${lang === "es" ? "is-active" : ""}`}
            onClick={() => setLang("es")}
            aria-pressed={lang === "es"}
          >
            ES
          </button>
        </div>
      </nav>
    </header>
  );
}

export function ZigZagUnderline({ className = "jd-zigzag-svg" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="311"
      height="6"
      viewBox="0 0 311 6"
      fill="none"
      aria-hidden="true"
    >
      <path d="M0 1H155.026L144.122 5H311" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
