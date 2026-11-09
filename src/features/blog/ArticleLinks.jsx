import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { resolveInternalLink } from "../../seo/registry";

// «صفحه‌های مرتبط»: لینک‌های داخلی مقاله (فیلد links) با متن لینک = نام صفحه‌ی مقصد.
export default function ArticleLinks({ links = [], lang = "fa" }) {
  const items = links.map((path) => resolveInternalLink(path, lang)).filter(Boolean);
  if (items.length === 0) return null;
  const en = lang === "en";
  const Arrow = en ? FiArrowRight : FiArrowLeft;

  return (
    <section dir={en ? "ltr" : "rtl"} aria-labelledby="links-title" className="mt-14">
      <h2 id="links-title" className="text-2xl font-black md:text-3xl">
        {en ? "Related pages" : "صفحه‌های مرتبط"}
      </h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map(({ path, label }) => (
          <li key={path}>
            <Link
              to={path}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 text-sm font-bold transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/50"
            >
              {label}
              <Arrow size={15} aria-hidden="true" className="shrink-0 text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
