import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dict, type Lang } from "./dict";

const LANG_KEY = "plushi.lang";

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function resolve(lang: Lang, path: string): string {
  const parts = path.split(".");
  let node: unknown = dict[lang];
  for (const p of parts) {
    if (node && typeof node === "object" && p in node) {
      node = (node as Record<string, unknown>)[p];
    } else {
      return path;
    }
  }
  return typeof node === "string" ? node : path;
}

function initialLang(): Lang {
  if (typeof window === "undefined") return "ru";
  const saved = window.localStorage.getItem(LANG_KEY);
  if (saved === "ru" || saved === "en") return saved;
  return navigator.language.toLowerCase().startsWith("en") ? "en" : "ru";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(LANG_KEY, l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = resolve(lang, "meta.title");
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t: (path: string) => resolve(lang, path) }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
