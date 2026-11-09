import useBlogFilters from "../../hooks/useBlogFilters";
import { useLang } from "../../i18n/LangContext";
import BlogCard from "./BlogCard";
import BlogEmptyState from "./BlogEmptyState";
import BlogToolbar from "./BlogToolbar";

function Skeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-[1690/900] animate-pulse rounded-3xl bg-surface-2" />
      <div className="mt-5 h-5 w-2/3 animate-pulse rounded-full bg-surface-2" />
      <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-surface-2" />
    </div>
  );
}

// فهرست مقاله‌ها با جست‌وجو و فیلتر. posts = مقاله‌های همین صفحه (کل وبلاگ یا یک دسته).
// وقتی مقاله‌ای نیست، فقط emptyState نمایش داده می‌شود (نه نوار جست‌وجو).
export default function BlogListing({
  posts,
  isLoading,
  isError,
  refetch,
  fixedCategory,
  emptyState,
}) {
  const { t } = useLang();
  const filters = useBlogFilters(posts, { fixedCategory });
  const { visible, hasMore, loadMore, filtered, reset } = filters;

  if (isError) {
    return (
      <div role="alert" className="rounded-3xl border border-border bg-surface p-10 text-center">
        <p className="text-muted">{t("دریافت مقاله‌ها با مشکل روبه‌رو شد.")}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
        >
          {t("تلاش دوباره")}
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) return emptyState;

  return (
    <div className="space-y-10">
      <BlogToolbar filters={filters} total={posts.length} showCategories={!fixedCategory} />

      {filtered.length === 0 ? (
        <BlogEmptyState
          title={t("مقاله‌ای با این مشخصات پیدا نشد.")}
          description={t("عبارت جست‌وجو یا دسته‌بندی را تغییر بده.")}
          actions={[{ label: t("پاک کردن فیلترها"), onClick: reset, primary: true }]}
        />
      ) : (
        <>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center">
              <button
                type="button"
                onClick={loadMore}
                className="rounded-full border border-border bg-surface px-8 py-3 text-sm font-bold transition-[background-color,border-color,transform] duration-200 hover:border-primary hover:bg-primary/10 active:scale-[0.97]"
              >
                {t("نمایش مقاله‌های بیشتر")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
