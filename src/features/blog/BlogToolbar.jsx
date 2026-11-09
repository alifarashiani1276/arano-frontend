import { FiSearch, FiX } from "react-icons/fi";
import { useLang } from "../../i18n/LangContext";
import { useBlogCategories } from "../../i18n/useData";
import { formatNumber } from "../../lib/blog";

// جست‌وجو + فیلتر دسته + مرتب‌سازی. showCategories=false در صفحه‌ی یک دسته.
export default function BlogToolbar({
  filters,
  total,
  showCategories = true,
}) {
  const BLOG_CATEGORIES = useBlogCategories();
  const { t, lang, isEn } = useLang();
  const { input, setInput, category, setCategory, sort, setSort, filtered, isFiltering } = filters;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 basis-64">
          <FiSearch
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("جست‌وجو در مقاله‌ها…")}
            aria-label={t("جست‌وجو در مقاله‌ها")}
            maxLength={80}
            className="h-12 w-full rounded-full border border-border bg-surface ps-12 pe-12 text-sm text-foreground placeholder:text-muted focus:border-primary focus:ring-0 [&::-webkit-search-cancel-button]:hidden"
          />
          {input && (
            <button
              type="button"
              onClick={() => setInput("")}
              aria-label={t("پاک کردن جست‌وجو")}
              className="absolute end-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <FiX size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <span className="sr-only sm:not-sr-only">{t("مرتب‌سازی")}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-12 rounded-full border border-border bg-surface pl-5 pr-10 text-sm font-bold text-foreground focus:border-primary focus:ring-0"
          >
            <option value="newest">{t("جدیدترین")}</option>
            <option value="oldest">{t("قدیمی‌ترین")}</option>
          </select>
        </label>
      </div>

      {showCategories && (
        <div role="group" aria-label={t("فیلتر دسته‌بندی مقاله‌ها")} className="flex flex-wrap gap-2">
          {[{ slug: "all", name: t("همه") }, ...BLOG_CATEGORIES].map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={category === c.slug}
              onClick={() => setCategory(c.slug)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition-[background-color,color,border-color] duration-200 ${
                category === c.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-muted hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <p aria-live="polite" className="text-sm text-muted">
        {isFiltering
          ? isEn
            ? `${formatNumber(filtered.length, lang)} of ${formatNumber(total, lang)} articles`
            : `${formatNumber(filtered.length)} نتیجه از ${formatNumber(total)} مقاله`
          : isEn
            ? `${formatNumber(total, lang)} ${total === 1 ? "article" : "articles"}`
            : `${formatNumber(total)} مقاله`}
      </p>
    </div>
  );
}
