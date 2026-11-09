import { ArrowBack } from "../../i18n/Arrow";
import { Link } from "../../i18n/Link";
import { useLang } from "../../i18n/LangContext";
import MediaImage from "../../ui/MediaImage";
import Breadcrumb from "../services/Breadcrumb";
import { BLOG_PATH, categoryPath, formatDate, getCategory } from "../../lib/blog";
import { getBlogBreadcrumbs } from "../../seo/registry";
import ArticleBody from "./ArticleBody";
import PostMeta from "./PostMeta";
import RelatedPosts from "./RelatedPosts";

// قالب صفحه‌ی مقاله: مسیر صفحه، عنوان، اطلاعات، تصویر شاخص، فهرست مطالب، متن و مقاله‌های مرتبط.
export default function ArticleView({ post, posts }) {
  const { t, lang } = useLang();
  const category = getCategory(post.category, lang);
  const headings = post.content.filter((b) => b.type === "h2");
  const showUpdated =
    post.updatedAt && formatDate(post.updatedAt, lang) !== formatDate(post.publishedAt, lang);

  return (
    <article className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
      <Breadcrumb items={getBlogBreadcrumbs(post, lang)} />

      <header className="mt-8 max-w-3xl">
        {category && (
          <Link
            to={categoryPath(category.slug)}
            className="inline-block rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-bold text-primary transition-colors hover:border-primary"
          >
            {category.name}
          </Link>
        )}
        <h1 className="mt-5 text-3xl font-black leading-[1.5] md:text-5xl md:leading-[1.4]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-5 text-base leading-8 text-muted md:text-lg">{post.excerpt}</p>
        )}
        <PostMeta post={post} className="mt-6" />
        {showUpdated && (
          <p className="mt-2 text-xs text-muted">
            {t("آخرین به‌روزرسانی:")} <time dateTime={post.updatedAt}>{formatDate(post.updatedAt, lang)}</time>
          </p>
        )}
      </header>

      {post.cover && (
        <MediaImage
          src={post.cover.src}
          mobileSrc={post.cover.mobileSrc}
          alt={post.cover.alt || post.title}
          priority
          className="mt-10 aspect-[1690/900] rounded-3xl border border-border bg-surface-2"
        />
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="max-w-3xl">
          <ArticleBody content={post.content} />

          {post.tags.length > 0 && (
            <ul aria-label={t("برچسب‌ها")} className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        {headings.length > 1 && (
          <aside aria-label={t("فهرست مطالب")} className="order-first lg:order-none">
            <nav className="rounded-3xl border border-border bg-surface p-5 lg:sticky lg:top-28">
              <p className="mb-3 text-sm font-black">{t("فهرست مطالب")}</p>
              <ol className="space-y-2 text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-muted transition-colors hover:text-foreground">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>

      <RelatedPosts post={post} posts={posts} />

      <Link
        to={BLOG_PATH}
        className="group mt-14 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-bold transition-[background-color,border-color] hover:border-primary hover:bg-primary/10"
      >
        <ArrowBack size={16} aria-hidden="true" className="transition-transform rtl:group-hover:translate-x-1 ltr:group-hover:-translate-x-1" />
        {t("بازگشت به وبلاگ‌ها")}
      </Link>
    </article>
  );
}
