import { FiArrowUpLeft, FiArrowUpRight } from "react-icons/fi";
import { Link } from "../../i18n/Link";
import { useLang } from "../../i18n/LangContext";
import MediaImage from "../../ui/MediaImage";
import { articlePath, categoryPath, getCategory } from "../../lib/blog";
import PostMeta from "./PostMeta";

// کارت مقاله: تصویر، دسته، عنوان، خلاصه، تاریخ و زمان مطالعه.
export default function BlogCard({ post, index = 0 }) {
  const { lang, isEn } = useLang();
  const Corner = isEn ? FiArrowUpRight : FiArrowUpLeft;
  const category = getCategory(post.category, lang);

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[1690/900] overflow-hidden rounded-3xl border border-border bg-surface-2 transition-colors duration-300 group-focus-within:border-primary group-hover:border-primary/50">
        <MediaImage
          src={post.cover?.src}
          mobileSrc={post.cover?.mobileSrc}
          alt={post.cover?.alt || post.title}
          label={category?.name}
          variant={index}
          className="h-full w-full"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-4 start-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-[opacity,transform] duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Corner size={20} />
        </span>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        {category && (
          <Link
            to={categoryPath(category.slug)}
            className="relative z-10 mb-3 w-fit rounded-full border border-border bg-surface px-3 py-1 text-xs font-bold text-primary transition-colors duration-200 hover:border-primary"
          >
            {category.name}
          </Link>
        )}

        <h3 className="text-xl font-black leading-[1.6]">
          <Link to={articlePath(post.slug)} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted">
            {post.excerpt}
          </p>
        )}

        <PostMeta post={post} className="mt-auto pt-4" />
      </div>
    </article>
  );
}
