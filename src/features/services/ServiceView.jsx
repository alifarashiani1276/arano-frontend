import { Link } from "../../i18n/Link";
import { ArrowForward } from "../../i18n/Arrow";
import { useLang } from "../../i18n/LangContext";
import { useServiceGroups } from "../../i18n/useData";
import useBlogLinks from "../../hooks/useBlogLinks";
import useProjects from "../../hooks/useProjects";
import { getBreadcrumbs, getPage } from "../../seo/registry";
import MediaImage from "../../ui/MediaImage";
import Reveal from "../../ui/Reveal";
import ProjectCard from "../home/ProjectCard";
import Breadcrumb from "./Breadcrumb";
import { EN_STEPS } from "../../i18n/en/ui";
import Faq from "./Faq";
import ServiceBody, { Inline } from "./ServiceBody";

// مراحل کار: بخش مشترک همه صفحه‌های خدمت (متن نهایی بعداً می‌آید). متن انگلیسی: src/i18n/en/ui.js
const STEPS = [
  {
    title: "جلسه مشاوره و نیازسنجی",
    text: "نیاز، هدف و محدودیت‌های پروژه را با هم روشن می‌کنیم و مسیر اجرا و زمان‌بندی را مشخص می‌کنیم.",
  },
  {
    title: "طراحی و تأیید ساختار",
    text: "ساختار صفحه‌ها و طرح اولیه را می‌سازیم و پیش از شروع توسعه، تأیید شما را می‌گیریم.",
  },
  {
    title: "توسعه و گزارش مرحله‌ای",
    text: "کار را مرحله‌به‌مرحله پیش می‌بریم و در هر مرحله نسخه قابل مشاهده نشان می‌دهیم.",
  },
  {
    title: "تست، تحویل و پشتیبانی",
    text: "سرعت، سازگاری با موبایل و صحت عملکرد را تست می‌کنیم، پروژه را تحویل می‌دهیم و در صورت نیاز پشتیبانی ادامه دارد.",
  },
];

const H2 = "text-2xl font-black leading-[1.5] md:text-4xl";

function RelatedProjects({ service }) {
  const { t, isEn } = useLang();
  const { data: projects = [] } = useProjects();
  const picked = service.projects
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean);
  const list = picked.length ? picked : projects.slice(0, 2);
  if (!list.length) return null;

  return (
    <section
      aria-labelledby="related-work-title"
      className="border-y border-border bg-surface-2/50 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <h2 id="related-work-title" className={H2}>
            {t("نمونه‌کارهای مرتبط")}
          </h2>
          <p className="mt-3 text-sm leading-8 text-muted md:text-base">
            {isEn
              ? `A few projects we have built that are close to "${service.name}".`
              : `چند پروژه از کارهایی که نزدیک به «${service.name}» ساخته‌ایم.`}
          </p>
        </Reveal>
        <div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2">
          {list.map((project, i) => (
            <Reveal key={project.id} delay={i % 2 === 0 ? 0 : 1}>
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const LINK_CARD =
  "group flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-5 py-4 text-sm font-bold transition-[border-color,background-color] duration-200 hover:border-primary/50 hover:bg-surface-2";

// قالب مشترک همه ۲۲ صفحه‌ی خدمت. فقط داده (src/data/servicePages.js) فرق می‌کند.
export default function ServiceView({ path }) {
  const { t, n, lang, isEn } = useLang();
  const SERVICE_GROUPS = useServiceGroups();
  const entry = getPage(path, lang);
  const service = entry.service;
  const group = SERVICE_GROUPS.find((g) => g.id === service.group);
  const related = service.related.map((p) => getPage(p, lang)).filter(Boolean);
  const apiBlog = useBlogLinks(path);
  const blog = service.blog.length > 0 ? service.blog : apiBlog;

  return (
    <>
      {/* هدر: H1 + توضیح کوتاه + دکمه مشاوره رایگان */}
      <section aria-labelledby="service-title" className="pb-12 md:pb-16">
        <div className="mx-auto max-w-6xl px-5">
          <Breadcrumb items={getBreadcrumbs(entry)} />

          <div className="relative mt-6 overflow-hidden rounded-3xl border border-border bg-surface-2 p-6 sm:p-10 md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            <div className="max-w-3xl">
              <p className="mb-4 flex items-center gap-3 text-sm font-bold text-primary">
                <span aria-hidden="true" className="h-px w-8 bg-primary" />
                {group.title}
              </p>
              <h1
                id="service-title"
                className="text-3xl font-black leading-[1.4] md:text-5xl"
              >
                {service.heading ?? service.name}
              </h1>
              <p className="mt-5 text-base leading-8 text-muted md:text-lg">
                {service.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
                >
                  {t("مشاوره رایگان")}
                  <ArrowForward
                    size={18}
                    aria-hidden="true"
                    className="transition-transform duration-200 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center rounded-full border border-border bg-surface px-6 py-4 text-sm font-bold transition-[background-color,border-color] duration-200 hover:border-primary hover:bg-primary/10"
                >
                  {t("همه خدمات آرانو")}
                </Link>
              </div>
            </div>

            {/* تصویر مخصوص همین خدمت؛ روی موبایل بالای متن، روی دسکتاپ کنار متن */}
            {service.image && (
              <MediaImage
                src={service.image}
                alt={service.imageAlt ?? `${t("تصویر خدمت")} ${service.name}`}
                priority
                imgClassName="absolute inset-0"
                className="order-first aspect-[16/10] w-full rounded-2xl border border-border bg-background lg:order-none"
              />
            )}
            </div>
          </div>
        </div>
      </section>

      {/* بدنه: اگر متن سئوشده‌ی کامل (service.body) موجود باشد همان، وگرنه توضیح کوتاه «درباره» */}
      {service.body ? (
        <section aria-label={service.name} className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-5">
            <ServiceBody blocks={service.body} />
            <div className="mt-12 rounded-3xl border border-border bg-surface p-6 md:p-8">
              <h2 className="text-lg font-black">{t("تکنولوژی‌ها")}</h2>
              <ul dir="ltr" className="mt-5 flex flex-wrap gap-2">
                {service.tech.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : (
        <>
      <section aria-labelledby="about-service-title" className="py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <h2 id="about-service-title" className={H2}>
              {isEn ? `About ${service.name}` : `درباره ${service.name}`}
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="text-base leading-9 text-foreground/90 md:text-lg">
              {service.about}
            </p>
          </Reveal>
        </div>
      </section>

        </>
      )}

      {!service.body && (
        <>
      {/* مراحل کار و تکنولوژی‌ها */}
      <section
        aria-labelledby="process-title"
        className="border-t border-border py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="max-w-2xl">
            <h2 id="process-title" className={H2}>
              {t("مراحل کار و تکنولوژی‌ها")}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <ol className="divide-y divide-border border-y border-border">
              {STEPS.map((stepFa, i) => {
                const step = isEn ? EN_STEPS[i] : stepFa;
                return (
                <Reveal as="li" key={step.title} delay={Math.min(i, 3)}>
                  <div className="group flex gap-6 py-7">
                    <span
                      aria-hidden="true"
                      className="text-5xl font-black text-transparent transition-colors duration-300 [-webkit-text-stroke:1.5px_rgb(var(--foreground)/0.35)] group-hover:text-primary group-hover:[-webkit-text-stroke:0]"
                    >
                      {n(i + 1, { minimumIntegerDigits: 2 })}
                    </span>
                    <div>
                      <h3 className="text-lg font-black">{step.title}</h3>
                      <p className="mt-2 text-sm leading-8 text-muted md:text-base">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
                );
              })}
            </ol>

            <Reveal delay={1}>
              <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
                <h3 className="text-lg font-black">{t("تکنولوژی‌ها")}</h3>
                <ul dir="ltr" className="mt-5 flex flex-wrap gap-2">
                  {service.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
        </>
      )}

      {/* نمونه‌کار مرتبط با همین خدمت */}
      <RelatedProjects service={service} />

      {/* سوالات متداول */}
      <section aria-labelledby="faq-title" className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal>
            <h2 id="faq-title" className={H2}>
              {isEn
                ? `Frequently asked questions about ${service.name}`
                : `سوالات متداول درباره ${service.name}`}
            </h2>
          </Reveal>
          <Reveal delay={1} className="mt-10">
            <Faq items={service.faq} />
          </Reveal>
        </div>
      </section>

      {/* دعوت به اقدام انتهای صفحه (از متن سئوکار) */}
      {service.cta && (
        <section aria-labelledby="service-cta-title" className="pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl px-5">
            <div className="rounded-3xl border border-border bg-surface-2 p-8 text-center md:p-12">
              <h2 id="service-cta-title" className={H2}>
                {service.cta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted md:text-lg">
                <Inline text={service.cta.text} />
              </p>
              <Link
                to="/contact"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
              >
                {t("مشاوره رایگان")}
                <ArrowForward
                  size={18}
                  aria-hidden="true"
                  className="transition-transform duration-200 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* لینک‌دهی داخلی: هاب خدمات + صفحه‌های مرتبط (+ مقاله‌های بلاگ وقتی آماده شد) */}
      <section aria-labelledby="links-title" className="pb-8 md:pb-12">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 id="links-title" className="text-xl font-black md:text-2xl">
              {t("خدمات مرتبط")}
            </h2>
          </Reveal>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <Link to="/services" className={LINK_CARD}>
                {t("همه خدمات آرانو")}
                <ArrowForward
                  size={15}
                  aria-hidden="true"
                  className="text-primary transition-transform duration-200 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
                />
              </Link>
            </li>
            {related.map((page) => (
              <li key={page.path}>
                <Link to={page.path} className={LINK_CARD}>
                  {page.h1}
                  <ArrowForward
                    size={15}
                    aria-hidden="true"
                    className="text-primary transition-transform duration-200 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {blog.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-black md:text-2xl">
                {t("مقاله‌های مرتبط")}
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {blog.map((post) => (
                  <li key={post.href}>
                    <Link to={post.href} className={LINK_CARD}>
                      {post.title}
                      <ArrowForward
                        size={15}
                        aria-hidden="true"
                        className="text-primary transition-transform duration-200 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
