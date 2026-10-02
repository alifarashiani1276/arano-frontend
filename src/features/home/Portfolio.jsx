import { useMemo, useState } from "react";
import { site } from "../../config/site";
import useProjects from "../../hooks/useProjects";
import Reveal from "../../ui/Reveal";
import SectionHeading from "../../ui/SectionHeading";
import ProjectCard from "./ProjectCard";

function Skeleton({ wide }) {
  return (
    <div className={wide ? "md:col-span-2" : ""} aria-hidden="true">
      <div
        className={`animate-pulse rounded-3xl bg-surface-2 ${
          wide ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[16/10]"
        }`}
      />
      <div className="mt-5 h-5 w-1/2 animate-pulse rounded-full bg-surface-2" />
      <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-surface-2" />
    </div>
  );
}

export default function Portfolio() {
  const { data: projects = [], isLoading, isError, refetch } = useProjects();
  const [active, setActive] = useState("all");

  const categories = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => map.set(p.category, p.categoryLabel));
    return [
      { id: "all", label: "همه پروژه‌ها" },
      ...Array.from(map, ([id, label]) => ({ id, label })),
    ];
  }, [projects]);

  const visible = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((p) => p.category === active),
    [projects, active],
  );

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-title"
      className="scroll-mt-24 border-y border-border bg-surface-2/50 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading id="portfolio-title" {...site.sections.portfolio} />
          {!isLoading && !isError && (
            <Reveal delay={1}>
              <p className="text-sm text-muted">
                <span className="text-4xl font-black text-primary">
                  {visible.length.toLocaleString("fa-IR")}
                </span>{" "}
                پروژه
              </p>
            </Reveal>
          )}
        </div>

        <Reveal delay={1}>
          <div
            role="group"
            aria-label="فیلتر دسته‌بندی نمونه‌کارها"
            className="mt-10 flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                aria-pressed={active === cat.id}
                onClick={() => setActive(cat.id)}
                className={`rounded-full border px-5 py-2.5 text-sm font-bold transition-[background-color,color,border-color] duration-200 ${
                  active === cat.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-muted hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Reveal>

        {isError ? (
          <div
            role="alert"
            className="mt-14 rounded-3xl border border-border bg-surface p-10 text-center"
          >
            <p className="text-muted">دریافت نمونه‌کارها با مشکل روبه‌رو شد.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              تلاش دوباره
            </button>
          </div>
        ) : (
          <div className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2">
            {isLoading
              ? [true, false, false, false].map((wide, i) => (
                  <Skeleton key={i} wide={wide} />
                ))
              : visible.map((project, i) => (
                  <Reveal
                    key={project.id}
                    delay={i % 2 === 0 ? 0 : 1}
                    className={
                      project.featured && active === "all"
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <ProjectCard
                      project={project}
                      index={i}
                      wide={project.featured && active === "all"}
                    />
                  </Reveal>
                ))}
          </div>
        )}
      </div>
    </section>
  );
}
