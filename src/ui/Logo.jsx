import { Link, useLocation } from "react-router-dom";
import { site } from "../config/site";

// لوگوی سایت: مسیر آن در src/config/site.js (logo.src) تعیین می‌شود.
// اگر logo.src خالی باشد، یک Placeholder مربعی (۴۰×۴۰) نمایش داده می‌شود.
export default function Logo({ showName = true, className = "" }) {
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
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl ${
          logo.src
            ? ""
            : "border border-dashed border-border bg-surface-2 text-muted"
        }`}
      >
        {logo.src ? (
          <img
            src={logo.src}
            alt={logo.alt}
            width={40}
            height={40}
            decoding="async"
            className="h-full w-full object-contain"
          />
        ) : (
          <span
            aria-hidden="true"
            className="text-[10px] font-bold tracking-wider"
          >
            LOGO
          </span>
        )}
      </span>
      {showName && <span className="text-lg font-black">{name}</span>}
    </Link>
  );
}
