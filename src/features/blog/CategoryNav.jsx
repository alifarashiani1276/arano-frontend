import { Link } from "../../i18n/Link";
import { useLang } from "../../i18n/LangContext";
import { useBlogCategories } from "../../i18n/useData";
import { BLOG_PATH, categoryPath } from "../../lib/blog";

// نوار لینک بین همه‌ی دسته‌ها (صفحه‌ی دسته)؛ active = slug دسته‌ی جاری.
export default function CategoryNav({ active }) {
  const BLOG_CATEGORIES = useBlogCategories();
  const { t } = useLang();
  const items = [
    { href: BLOG_PATH, label: t("همه مقاله‌ها"), on: !active },
    ...BLOG_CATEGORIES.map((c) => ({
      href: categoryPath(c.slug),
      label: c.name,
      on: active === c.slug,
    })),
  ];

  return (
    <nav aria-label={t("دسته‌بندی‌های وبلاگ")}>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              aria-current={item.on ? "page" : undefined}
              className={`inline-block rounded-full border px-4 py-2 text-sm font-bold transition-[background-color,color,border-color] duration-200 ${
                item.on
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-muted hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
