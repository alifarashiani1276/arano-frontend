import PageShell from "./PageShell";
import BlogEmptyState from "../features/blog/BlogEmptyState";
import BlogListing from "../features/blog/BlogListing";
import CategoryGrid from "../features/blog/CategoryGrid";
import useBlogPosts from "../hooks/useBlogPosts";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

// صفحه‌ی اصلی وبلاگ: /blog
// بدون مقاله: Empty State + noindex. با مقاله: فهرست، جست‌وجو و فیلتر.
export default function BlogPage() {
  const { data: posts = [], isLoading, isError, refetch } = useBlogPosts();

  return (
    <PageShell path="/blog" seo={{ noindex: posts.length === 0 }}>
      <section aria-labelledby="blog-title" className="pb-24 md:pb-32">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            as="h1"
            id="blog-title"
            eyebrow="وبلاگ"
            title="وبلاگ آرانو"
            description="مقاله‌های تخصصی درباره‌ی توسعه نرم‌افزار، طراحی رابط، طراحی سایت و سئو."
          />

          <div className="mt-12">
            <BlogListing
              posts={posts}
              isLoading={isLoading}
              isError={isError}
              refetch={refetch}
              emptyState={
                <BlogEmptyState
                  title="به‌زودی مطالب و مقالات تخصصی آرانو در این بخش منتشر خواهند شد."
                  description="تا آن زمان می‌توانی با خدمات و نمونه‌کارهای ما آشنا شوی."
                  actions={[
                    { label: "خدمات آرانو", to: "/services", primary: true },
                    { label: "نمونه‌کارها", to: "/portfolio" },
                  ]}
                />
              }
            />
          </div>

          <section aria-labelledby="blog-categories-title" className="mt-24">
            <Reveal>
              <h2 id="blog-categories-title" className="text-2xl font-black md:text-3xl">
                دسته‌بندی‌های وبلاگ
              </h2>
            </Reveal>
            <div className="mt-8">
              <CategoryGrid posts={posts} />
            </div>
          </section>
        </div>
      </section>
    </PageShell>
  );
}
