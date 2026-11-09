import { BLOG_CATEGORIES } from "../../data/blog";
import Reveal from "../../ui/Reveal";
import CategoryCard from "./CategoryCard";

// شبکه‌ی ۷ دسته‌بندی وبلاگ (لینک به صفحه‌ی مستقل هر دسته).
export default function CategoryGrid({ posts = [] }) {
  const counts = posts.reduce((m, p) => m.set(p.category, (m.get(p.category) ?? 0) + 1), new Map());

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {BLOG_CATEGORIES.map((category, i) => (
        <li key={category.slug}>
          <Reveal delay={i % 3} className="h-full">
            <CategoryCard category={category} count={counts.get(category.slug) ?? 0} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
