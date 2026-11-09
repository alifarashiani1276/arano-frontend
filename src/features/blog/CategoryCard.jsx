import {
  FiBookOpen,
  FiBriefcase,
  FiLayout,
  FiMonitor,
  FiPenTool,
  FiSearch,
  FiServer,
  FiZap,
} from "react-icons/fi";
import { ArrowForward } from "../../i18n/Arrow";
import { Link } from "../../i18n/Link";
import { useLang } from "../../i18n/LangContext";
import { categoryPath, formatNumber } from "../../lib/blog";

const ICONS = {
  frontend: FiMonitor,
  backend: FiServer,
  "ui-ux": FiPenTool,
  "website-design": FiLayout,
  seo: FiSearch,
  performance: FiZap,
  "project-management": FiBriefcase,
};

// کارت دسته‌بندی برای صفحه اصلی وبلاگ؛ تعداد مقاله فقط وقتی بیشتر از صفر است نمایش داده می‌شود.
export default function CategoryCard({ category, count = 0 }) {
  const { lang, t, isEn } = useLang();
  const Icon = ICONS[category.slug] ?? FiBookOpen;

  return (
    <Link
      to={categoryPath(category.slug)}
      className="group flex h-full flex-col rounded-3xl border border-border bg-surface p-6 transition-[border-color,background-color,transform] duration-300 hover:border-primary/60 hover:bg-surface-2 active:scale-[0.99]"
    >
      <span
        aria-hidden="true"
        className="grid h-12 w-12 place-items-center rounded-2xl border border-border bg-surface-2 text-primary transition-colors duration-300 group-hover:border-primary/50"
      >
        <Icon size={22} />
      </span>
      <h3 className="mt-5 text-lg font-black leading-[1.6]">{category.name}</h3>
      <p className="mt-2 text-sm leading-7 text-muted">{category.short}</p>
      <span className="mt-auto flex items-center justify-between pt-5 text-xs font-bold text-muted transition-colors duration-200 group-hover:text-foreground">
        <span>{count > 0
            ? `${formatNumber(count, lang)} ${isEn ? (count === 1 ? "article" : "articles") : "مقاله"}`
            : t("مشاهده دسته")}</span>
        <ArrowForward
          size={16}
          aria-hidden="true"
          className="transition-transform duration-200 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
