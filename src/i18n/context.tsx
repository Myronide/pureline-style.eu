import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { locales, messages, type Locale, type Messages } from "./messages";

const STORAGE_KEY = "pureline-locale";

/** The first visit follows the browser language; after that the user's choice wins. */
function initialLocale(): Locale {
  const saved = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  if (saved && (locales as string[]).includes(saved)) {
    return saved as Locale;
  }
  const browser = typeof navigator !== "undefined" ? navigator.language.slice(0, 2).toLowerCase() : "en";
  return (locales as string[]).includes(browser) ? (browser as Locale) : "en";
}

interface I18n {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Messages, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18n | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18n>(() => {
    const dictionary = messages[locale];
    const t = (key: keyof Messages, vars?: Record<string, string | number>) => {
      const text = dictionary[key] ?? messages.en[key];
      return vars ? text.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`)) : text;
    };
    return { locale, setLocale, t };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside LocaleProvider");
  }
  return ctx;
}
