import { FiGlobe } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { LANG_META, switchLangPath } from "../../i18n/config";
import { useLang } from "../../i18n/LangContext";

// دکمه‌ی تغییر زبان: همان صفحه را در زبان دیگر باز می‌کند (/services ⇄ /en/services).
// لینک واقعی است (نه دکمه‌ی JS) تا گوگل نسخه‌ی دیگر را هم پیدا کند.
export default function LangSwitch() {
  const { lang } = useLang();
  const { pathname, search } = useLocation();
  const target = lang === "en" ? "fa" : "en";
  const { label, short, htmlLang } = LANG_META[target];

  return (
    <Link
      to={`${switchLangPath(pathname, target)}${search}`}
      state={{ keepScroll: true }}
      hrefLang={htmlLang}
      lang={htmlLang}
      aria-label={label}
      title={label}
      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-bold text-foreground transition-[border-color,background-color] duration-200 hover:border-primary/60 hover:bg-surface-2 sm:h-10 sm:text-sm"
    >
      <FiGlobe size={15} aria-hidden="true" className="hidden sm:block" />
      {short}
    </Link>
  );
}
