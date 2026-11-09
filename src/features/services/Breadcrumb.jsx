import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "../../i18n/Link";
import { useLang } from "../../i18n/LangContext";

// Breadcrumb قابل‌مشاهده: خانه › خدمات › نام صفحه (Schema آن در src/seo/schema.js ساخته می‌شود).
export default function Breadcrumb({ items }) {
  const { t, isEn } = useLang();
  const Sep = isEn ? FiChevronRight : FiChevronLeft;
  return (
    <nav aria-label={t("مسیر صفحه")}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="font-bold text-foreground">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  {item.name}
                </Link>
              )}
              {!last && <Sep size={13} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
