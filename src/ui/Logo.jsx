import { useLocation } from "react-router-dom";
import { stripLang } from "../i18n/config";
import { Link } from "../i18n/Link";
import { useLang } from "../i18n/LangContext";
import { useSite } from "../i18n/useData";

// لوگوی نوشتاری آرانو (ARANO): مسیرها در src/config/site.js (logo.wordmark) تعیین می‌شود.
// در تم تیره نسخه‌ی سبز و در تم روشن نسخه‌ی مشکی نمایش داده می‌شود.
export default function Logo({ className = "" }) {
  const site = useSite();
  const { t } = useLang();
  const { logo, name } = site;
  const { pathname, hash } = useLocation();

  // اگر همین الان روی صفحه اصلی هستیم، فقط به بالای صفحه برگرد.
  const onClick = () => {
    if (stripLang(pathname) === "/" && !hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${name} - ${t("صفحه اصلی")}`}
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <img
        src={logo.wordmarkDark}
        alt={logo.alt}
        width={113}
        height={20}
        decoding="async"
        className="h-[16px] w-auto object-contain dark:hidden"
      />
      <img
        src={logo.wordmark}
        alt={logo.alt}
        width={113}
        height={20}
        decoding="async"
        className="hidden h-[16px] w-auto object-contain dark:block"
      />
    </Link>
  );
}
