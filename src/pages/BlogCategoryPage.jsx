import PageShell from "./PageShell";
import BlogEmptyState from "../features/blog/BlogEmptyState";
import BlogListing from "../features/blog/BlogListing";
import CategoryNav from "../features/blog/CategoryNav";
import Breadcrumb from "../features/services/Breadcrumb";
import useBlogPosts from "../hooks/useBlogPosts";
import { useLang } from "../i18n/LangContext";
import { BLOG_PATH, categoryPath, getCategory } from "../lib/blog";
import { getPage } from "../seo/registry";
import SectionHeading from "../ui/SectionHeading";

// صفحه‌ی اختصاصی هر دسته: /blog/category/<slug> (روت‌ها در App.jsx از BLOG_CATEGORIES ساخته می‌شوند)
export default function BlogCategoryPage({ slug }) {
  const { t, lang, isEn } = useLang();
  const category = getCategory(slug, lang);
  const path = categoryPath(slug);
  const { data: all = [], isLoading, isError, refetch } = useBlogPosts();
  const posts = all.filter((p) => p.category === slug);

  return (
    <PageShell path={path} seo={{ noindex: posts.length === 0 }}>
      <section aria-labelledby="blog-category-title" className="pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5">
          <Breadcrumb items={getPage(path, lang).breadcrumbs} />

          <SectionHeading
            as="h1"
            id="blog-category-title"
            className="mt-8"
            eyebrow={t("دسته‌بندی وبلاگ")}
            title={category.name}
            description={category.description}
          />

          <div className="mt-10">
            <CategoryNav active={slug} />
          </div>

          <div className="mt-12">
            <BlogListing
              posts={posts}
              isLoading={isLoading}
              isError={isError}
              refetch={refetch}
              fixedCategory={slug}
              emptyState={
                <BlogEmptyState
                  title={
                    isEn
                      ? `No articles have been published in "${category.name}" yet.`
                      : `هنوز مقاله‌ای در دسته «${category.name}» منتشر نشده است.`
                  }
                  description={t("به‌زودی مطالب تخصصی این دسته در همین صفحه قرار می‌گیرد.")}
                  actions={[{ label: t("بازگشت به وبلاگ"), to: BLOG_PATH, primary: true }]}
                />
              }
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
