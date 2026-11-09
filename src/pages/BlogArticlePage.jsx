import { useParams } from "react-router-dom";
import PageShell from "./PageShell";
import ArticleView from "../features/blog/ArticleView";
import BlogEmptyState from "../features/blog/BlogEmptyState";
import useBlogPosts from "../hooks/useBlogPosts";
import { useLang } from "../i18n/LangContext";
import { BLOG_PATH, articlePath } from "../lib/blog";
import { articleMeta } from "../seo/registry";
import { FiFileText } from "react-icons/fi";

// صفحه‌ی مقاله: /blog/<slug> — قالب ArticleView با داده‌ی همان مقاله.
// اگر مقاله‌ای با این آدرس نبود: پیام «پیدا نشد» + noindex (SPA نمی‌تواند وضعیت ۴۰۴ بدهد).
export default function BlogArticlePage() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const { data: posts = [], isLoading } = useBlogPosts();
  const post = posts.find((p) => p.slug === slug);

  if (post) {
    return (
      <PageShell path={articlePath(post.slug)} seo={articleMeta(post, lang)} hideCta>
        <ArticleView post={post} posts={posts} />
      </PageShell>
    );
  }

  return (
    <PageShell
      path={articlePath(slug ?? "")}
      seo={{
        title: t("مقاله پیدا نشد | وبلاگ آرانو"),
        description: t("مقاله‌ای با این آدرس پیدا نشد."),
        noindex: true,
      }}
      hideCta
    >
      <section className="mx-auto max-w-6xl px-5 pb-24">
        {isLoading ? (
          <div aria-hidden="true" className="h-64 animate-pulse rounded-3xl bg-surface-2" />
        ) : (
          <BlogEmptyState
            icon={FiFileText}
            title={t("مقاله‌ای با این آدرس پیدا نشد.")}
            description={t("ممکن است آدرس تغییر کرده یا مقاله هنوز منتشر نشده باشد.")}
            actions={[{ label: t("بازگشت به وبلاگ"), to: BLOG_PATH, primary: true }]}
          />
        )}
      </section>
    </PageShell>
  );
}
