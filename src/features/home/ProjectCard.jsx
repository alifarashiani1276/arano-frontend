import { FiArrowUpRight } from "react-icons/fi";
import MediaImage from "../../ui/MediaImage";

export default function ProjectCard({ project, index, wide = false }) {
  const { title, description, categoryLabel, technologies, image, url, year } =
    project;
  const isExternal = typeof url === "string" && url.startsWith("http");

  return (
    <article className={`group relative ${wide ? "md:col-span-2" : ""}`}>
      <div
        className={`relative overflow-hidden rounded-3xl border border-border bg-surface-2 transition-colors duration-300 group-focus-within:border-primary group-hover:border-primary/50 ${
          wide ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[16/10]"
        }`}
      >
        <MediaImage
          src={image}
          alt={`تصویر پروژه ${title}`}
          label={title}
          variant={index}
          className="h-full w-full"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <span className="absolute right-4 top-4 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-bold backdrop-blur-sm">
          {categoryLabel}
        </span>

        <span
          aria-hidden="true"
          className="absolute bottom-4 left-4 grid h-12 w-12 translate-y-2 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-[opacity,transform] duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <FiArrowUpRight size={22} />
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-black">
            {url ? (
              <a
                href={url}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="after:absolute after:inset-0"
              >
                {title}
                <span className="sr-only"> - مشاهده پروژه</span>
              </a>
            ) : (
              title
            )}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            {description}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="shrink-0 text-3xl font-black text-foreground/10 transition-colors duration-300 group-hover:text-primary/40"
        >
          {(index + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}
        </span>
      </div>

      <ul dir="ltr" className="mt-4 flex flex-wrap items-center gap-2">
        {technologies.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted"
          >
            {tech}
          </li>
        ))}
        {year && (
          <li dir="rtl" className="px-1 text-xs text-muted">
            {year}
          </li>
        )}
      </ul>
    </article>
  );
}
