import { Link, useLocation } from "react-router-dom";
import { site } from "../config/site";

// لوگوی نوشتاری آرانو (ARANO): مسیرها در src/config/site.js (logo.wordmark) تعیین می‌شود.
// در تم تیره نسخه‌ی سبز و در تم روشن نسخه‌ی مشکی نمایش داده می‌شود.
export default function Logo({ className = "" }) {
  const { logo, name } = site;
  const { pathname, hash } = useLocation();

  // اگر همین الان روی صفحه اصلی هستیم، فقط به بالای صفحه برگرد.
  const onClick = () => {
    if (pathname === "/" && !hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${name} - صفحه اصلی`}
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
