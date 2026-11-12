import { useMemo } from "react";
import { blogLinksFor } from "../lib/blog";
import useBlogPosts from "./useBlogPosts";

// «مقاله‌های مرتبط» یک صفحه‌ی خدمت [{ title, href }]؛ از فیلد links مقاله‌های منتشرشده.
// تا رسیدن پاسخ API (یا اگر خطا داد) آرایه‌ی خالی است و بخش نمایش داده نمی‌شود.
export default function useBlogLinks(path, limit = 3) {
  const { data } = useBlogPosts();
  return useMemo(() => blogLinksFor(data ?? [], path, limit), [data, path, limit]);
}
