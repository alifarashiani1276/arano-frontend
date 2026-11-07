import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { filterPosts, sortNewest } from "../lib/blog";

const PAGE_SIZE = 9;

// جست‌وجو + فیلتر دسته + مرتب‌سازی + «نمایش بیشتر» برای فهرست مقاله‌ها.
// وضعیت در آدرس هم می‌ماند (?q=...&category=...&sort=oldest) تا لینک قابل‌اشتراک باشد.
// fixedCategory: در صفحه‌ی یک دسته، فیلتر دسته ثابت است و از آدرس خوانده نمی‌شود.
export default function useBlogFilters(posts, { fixedCategory } = {}) {
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get("q") ?? "";

  const [input, setInput] = useState(urlQuery);
  const [query, setQuery] = useState(urlQuery);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const category = fixedCategory ?? params.get("category") ?? "all";
  const sort = params.get("sort") === "oldest" ? "oldest" : "newest";

  // تایپ فوری در input؛ اعمال روی فیلتر و آدرس با ۲۵۰ms تأخیر
  useEffect(() => {
    const id = setTimeout(() => setQuery(input), 250);
    return () => clearTimeout(id);
  }, [input]);

  const patchParams = (patch) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(patch).forEach(([k, v]) => {
          if (v) next.set(k, v);
          else next.delete(k);
        });
        return next;
      },
      { replace: true },
    );

  useEffect(() => {
    if (query !== urlQuery) patchParams({ q: query.trim() });
    setLimit(PAGE_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const filtered = useMemo(() => {
    const list = filterPosts(posts, { query, category });
    return sort === "oldest" ? [...list].sort((a, b) => -sortNewest(a, b)) : list;
  }, [posts, query, category, sort]);

  const isFiltering = query.trim() !== "" || category !== "all";

  return {
    input,
    setInput,
    query,
    category,
    setCategory: (id) => {
      patchParams({ category: id === "all" ? "" : id });
      setLimit(PAGE_SIZE);
    },
    sort,
    setSort: (v) => patchParams({ sort: v === "oldest" ? "oldest" : "" }),
    filtered,
    visible: filtered.slice(0, limit),
    hasMore: filtered.length > limit,
    loadMore: () => setLimit((n) => n + PAGE_SIZE),
    isFiltering,
    reset: () => {
      setInput("");
      setQuery("");
      setLimit(PAGE_SIZE);
      patchParams({ q: "", category: fixedCategory ? undefined : "" });
    },
  };
}
