import { ArrowForward } from "../i18n/Arrow";
import { Link } from "../i18n/Link";
import { useLang } from "../i18n/LangContext";

// دکمه «بیشتر بدانید» برای خلاصه‌ی بخش‌های صفحه اصلی که صفحه کامل جدا دارند.
// hint: متن مخصوص ریدرها و ربات‌ها تا لینک «بیشتر بدانید» تنها نماند (مثلاً «درباره تیم آرانو»).
export default function MoreLink({
  to,
  hint,
  children,
  className = "",
}) {
  const { t } = useLang();
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-bold transition-[background-color,border-color,transform] duration-200 hover:border-primary hover:bg-primary/10 active:scale-[0.97] ${className}`}
    >
      {children ?? t("بیشتر بدانید")}
      {hint && <span className="sr-only"> {hint}</span>}
      <ArrowForward
        size={16}
        aria-hidden="true"
        className="transition-transform duration-200 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
      />
    </Link>
  );
}
