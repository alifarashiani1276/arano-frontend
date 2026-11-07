import BlogCard from "./BlogCard";

// مقاله‌های هم‌دسته (بدون مقاله‌ی جاری)؛ اگر چیزی نبود، هیچ‌چیز نمایش داده نمی‌شود.
export default function RelatedPosts({ post, posts, limit = 3 }) {
  const related = posts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, limit);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-title" className="mt-20 border-t border-border pt-12">
      <h2 id="related-title" className="text-2xl font-black">
        مقاله‌های مرتبط
      </h2>
      <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((p, i) => (
          <BlogCard key={p.id} post={p} index={i} />
        ))}
      </div>
    </section>
  );
}
