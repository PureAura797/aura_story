"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import ru from "@/lib/i18n/ru";
import en from "@/lib/i18n/en";

export type Locale = "ru" | "en";

type Dictionary = typeof ru;

const dictionaries: Record<Locale, Dictionary> = { ru, en };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "ru",
  setLocale: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  // Persist and restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved && (saved === "ru" || saved === "en")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: string): string => {
      const dict = dictionaries[locale] as Record<string, string>;
      return dict[key] ?? key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}

export function useLocale() {
  return useContext(LanguageContext).locale;
}
