import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

// دکمه «بازگشت به صفحه اصلی» مشترک بین صفحه‌های ورود و صفحه‌های داخلی سایت.
// compact: در هدرهای کم‌جا فقط آیکن + متن کوتاه نشان داده می‌شود.
export default function BackHome({ className = "" }) {
  return (
    <Link
      to="/"
      className={`group inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-xs font-bold text-muted transition hover:bg-surface-2 hover:text-foreground sm:text-sm ${className}`}
    >
      <FiArrowRight
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-1"
      />
      <span className="sm:hidden">صفحه اصلی</span>
      <span className="hidden sm:inline">بازگشت به صفحه اصلی</span>
    </Link>
  );
}