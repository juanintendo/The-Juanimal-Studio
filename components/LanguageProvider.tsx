"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { COPY, type Locale } from "@/lib/i18n";

type LanguageContextValue = {
  lang: Locale;
  setLang: (next: Locale) => void;
  toggleLang: () => void;
  t: (typeof COPY)[Locale];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "juanimal-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isEsRoute = pathname === "/es" || pathname.startsWith("/es/");

  const [lang, setLangState] = useState<Locale>(isEsRoute ? "es" : "en");

  useEffect(() => {
    if (isEsRoute) {
      setLangState("es");
      document.documentElement.lang = "es";
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get("lang");
    if (queryLang === "es" || queryLang === "en") {
      setLangState(queryLang);
      document.documentElement.lang = queryLang;
      try {
        window.localStorage.setItem(STORAGE_KEY, queryLang);
      } catch {
        /* ignore storage error */
      }
      return;
    }

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "es" || saved === "en") {
        setLangState(saved);
        document.documentElement.lang = saved;
      } else {
        document.documentElement.lang = "en";
      }
    } catch {
      document.documentElement.lang = "en";
    }
  }, [isEsRoute]);

  const setLang = useCallback(
    (next: Locale) => {
      setLangState(next);
      document.documentElement.lang = next;
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore storage error */
      }
      if (isEsRoute && next === "en") {
        router.push("/");
      }
    },
    [isEsRoute, router]
  );

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "es" : "en");
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, toggleLang, t: COPY[lang] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: "en" as Locale,
      setLang: () => {},
      toggleLang: () => {},
      t: COPY.en,
    };
  }
  return ctx;
}
