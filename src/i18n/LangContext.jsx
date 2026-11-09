import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { LANG_META, langFromPath, localePath } from "./config";
import { EN_UI } from "./en/ui";

const LangContext = createContext(null);

// Language comes from the URL: /en/... = English, everything else = Persian.
// Sets <html lang dir> so layout (RTL/LTR) and screen readers follow the page language.
export function LangProvider({ children }) {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const meta = LANG_META[lang];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = meta.htmlLang;
    root.dir = meta.dir;
  }, [meta]);

  const value = useMemo(() => {
    const isEn = lang === "en";
    const locale = isEn ? "en-US" : "fa-IR";
    return {
      lang,
      isEn,
      dir: meta.dir,
      locale,
      // UI text: Persian source string -> English (falls back to the Persian string itself)
      t: (fa) => (isEn ? (EN_UI[fa] ?? fa) : fa),
      // link to a path in the current language
      to: (path) => localePath(path, lang),
      // numbers: ۰۱ (Persian) or 01 (English)
      n: (num, opts) => Number(num).toLocaleString(locale, opts),
    };
  }, [lang, meta]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

const FALLBACK = {
  lang: "fa",
  isEn: false,
  dir: "rtl",
  locale: "fa-IR",
  t: (fa) => fa,
  to: (p) => p,
  n: (num, opts) => Number(num).toLocaleString("fa-IR", opts),
};

export const useLang = () => useContext(LangContext) ?? FALLBACK;

// Stable helper for effects
export function useLocalePath() {
  const { lang } = useLang();
  return useCallback((p) => localePath(p, lang), [lang]);
}
