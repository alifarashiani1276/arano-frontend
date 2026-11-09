import { ArrowBack } from "../i18n/Arrow";
import { Link } from "../i18n/Link";
import { useLang } from "../i18n/LangContext";

// دکمه «بازگشت به صفحه اصلی» مشترک بین صفحه‌های ورود و صفحه‌های داخلی سایت.
// compact: در هدرهای کم‌جا فقط آیکن + متن کوتاه نشان داده می‌شود.
export default function BackHome({ className = "" }) {
  const { t } = useLang();
  return (
    <Link
      to="/"
      className={`group inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-xs font-bold text-muted transition hover:bg-surface-2 hover:text-foreground sm:text-sm ${className}`}
    >
      <ArrowBack
        aria-hidden="true"
        className="transition-transform rtl:group-hover:translate-x-1 ltr:group-hover:-translate-x-1"
      />
      <span className="sm:hidden">{t("صفحه اصلی")}</span>
      <span className="hidden sm:inline">{t("بازگشت به صفحه اصلی")}</span>
    </Link>
  );
}