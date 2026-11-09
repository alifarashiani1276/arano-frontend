// Language helpers (plain JS: used by the browser AND by the build plugin vite/seoPlugin.js).
// Persian (fa) lives at the root (/services), English (en) under /en (/en/services).
// Dashboard / admin panel screens are Persian-only and are never prefixed.
// Auth screens (/auth/...) are bilingual: /auth/login (fa) and /en/auth/login (en).

export const LANGS = ["fa", "en"];
export const DEFAULT_LANG = "fa";

export const LANG_META = {
  fa: { dir: "rtl", htmlLang: "fa", locale: "fa_IR", ldLang: "fa-IR", label: "فارسی", short: "فا" },
  en: { dir: "ltr", htmlLang: "en", locale: "en_US", ldLang: "en", label: "English", short: "EN" },
};

const UNPREFIXED = ["/dashboard", "/admin"];

export const langFromPath = (pathname = "/") =>
  pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fa";

// "/en/services/seo" -> "/services/seo"   |   "/en" -> "/"
export function stripLang(pathname = "/") {
  if (pathname === "/en") return "/";
  return pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
}

// "/services" + "en" -> "/en/services". Hash/query are kept: "/#contact" -> "/en#contact".
// Already-prefixed paths, external URLs, bare "#hash" links and Persian-only areas are returned unchanged.
export function localePath(path, lang = DEFAULT_LANG) {
  if (typeof path !== "string" || !path.startsWith("/")) return path;
  const base = path.split(/[?#]/)[0];
  if (UNPREFIXED.some((p) => base === p || base.startsWith(`${p}/`))) return path;

  const rest = path.slice(base.length); // "?x" or "#y" or ""
  const plain = stripLang(base); // path without /en
  if (lang === "en") return plain === "/" ? `/en${rest}` : `/en${plain}${rest}`;
  return `${plain}${rest}`;
}

// Same page in the other language: "/en/services?x=1" <-> "/services?x=1"
export function switchLangPath(pathname, target) {
  const clean = stripLang(pathname);
  return localePath(clean, target);
}
