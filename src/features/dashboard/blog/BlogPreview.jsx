import { useMemo } from "react";
import ArticleView from "../../blog/ArticleView";
import { normalizePost } from "../../../lib/blog";
import { todayDateOnly } from "./postForm";

// پیش‌نمایش همان ArticleView عمومی با داده‌ی فعلی فرم (بدون ذخیره). فقط نسخه‌ی فارسی.
export default function BlogPreview({ values }) {
  const post = useMemo(
    () =>
      normalizePost({
        id: "preview",
        slug: values.slug || "preview",
        title: values.title || "بدون عنوان",
        excerpt: values.excerpt,
        category: values.category,
        tags: values.tags,
        cover: values.cover?.src
          ? {
              src: values.cover.src,
              mobileSrc: values.cover.mobileSrc || null,
              alt: values.cover.alt,
            }
          : null,
        author: values.author,
        publishedAt: values.publishedAt || todayDateOnly(),
        featured: values.featured,
        status: values.status,
        content: values.content ?? [],
      }),
    [values],
  );

  return (
    <div>
      <p className="dashboard-hint mb-3">
        پیش‌نمایش نسخه‌ی فارسی با داده‌ی فعلی فرم است و چیزی ذخیره نمی‌شود.
      </p>
      <div className="overflow-hidden rounded-2xl border border-border bg-background pt-2">
        <ArticleView post={post} posts={[]} />
      </div>
    </div>
  );
}
