import { FiAlertCircle, FiCheck, FiPlus } from "react-icons/fi";
import { ArrowForward } from "../../i18n/Arrow";
import { Link } from "../../i18n/Link";
import { useLang } from "../../i18n/LangContext";
import { useServicePages } from "../../i18n/useData";
import Icon from "../../ui/Icon";
import Reveal from "../../ui/Reveal";
import ProjectCard from "../home/ProjectCard";
import { Inline } from "./ServiceBody";

// بخش‌های صفحه ستون «طراحی سایت» (/web-design). متن همه‌ی بخش‌ها از
// src/data/webDesignPillar.js (فارسی) و src/i18n/en/webDesignPillar.js (انگلیسی) می‌آید؛
// این فایل فقط ظاهر است. رنگ‌ها همه از توکن‌های Theme (پالت + روشن/تاریک) خوانده می‌شوند.

const WRAP = "mx-auto max-w-6xl px-5";
const H2 = "text-xl font-black leading-[1.6] md:text-3xl";
const LEAD = "mt-3 max-w-3xl text-sm leading-8 text-muted md:text-base";
const LINK =
  "font-bold text-primary underline decoration-primary/40 underline-offset-4 transition-[text-decoration-color] duration-200 hover:decoration-primary";
const BTN =
  "group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]";
const ARROW =
  "transition-transform duration-200 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1";
const NUM =
  "text-4xl font-black text-transparent transition-colors duration-300 [-webkit-text-stroke:1.5px_rgb(var(--foreground)/0.35)] group-hover:text-primary group-hover:[-webkit-text-stroke:0]";

// قاب هر بخش: tone="alt" پس‌زمینه‌ی کمی متفاوت می‌دهد تا بخش‌ها از هم جدا دیده شوند.
export function Band({ id, tone = "plain", children }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`py-12 md:py-16 ${tone === "alt" ? "border-y border-border bg-surface-2/50" : ""}`}
    >
      <div className={WRAP}>{children}</div>
    </section>
  );
}

function Head({ id, title, lead }) {
  return (
    <Reveal className="max-w-3xl">
      <h2 id={`${id}-title`} className={H2}>
        {title}
      </h2>
      {lead && <p className={LEAD}>{lead}</p>}
    </Reveal>
  );
}

// «جزئیات: <لینک>»
function LinkLine({ link }) {
  return (
    <p className="text-sm leading-8">
      {link.lead && <span className="text-muted">{link.lead} </span>}
      <Link to={link.href} className={LINK}>
        {link.label}
      </Link>
    </p>
  );
}

function Footer({ text }) {
  return (
    <Reveal className="mt-8">
      <p className="text-sm leading-8 text-muted md:text-base">
        <Inline text={text} />
      </p>
    </Reveal>
  );
}

function IconBubble({ name, size = 18 }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
    >
      <Icon name={name} size={size} />
    </span>
  );
}

function Tick() {
  return (
    <span
      aria-hidden="true"
      className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary"
    >
      <FiCheck size={12} />
    </span>
  );
}

// ───────── فهرست بخش‌ها (چیپ‌های لینک به همان صفحه) ─────────
export function Toc({ title, items }) {
  return (
    <nav aria-label={title} className="mt-6">
      <p className="mb-2 text-xs font-bold text-muted">{title}</p>
      <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              className="inline-flex rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-bold text-muted transition-[color,border-color,background-color] duration-200 hover:border-primary hover:bg-primary/10 hover:text-foreground"
            >
              {item.toc}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Intro({ paragraphs }) {
  return (
    <div className="pb-4 pt-12 md:pt-16">
      <div className="mx-auto max-w-4xl space-y-5 px-5 text-base leading-[2.2] md:text-lg">
        {paragraphs.map((text) => (
          <Reveal key={text}>
            <p>
              <Inline text={text} />
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

// ───────── طراحی سایت دقیقاً چیست؟ ─────────
export function Includes({ data }) {
  return (
    <Band id={data.id}>
      <Head id={data.id} title={data.title} lead={data.lead} />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i % 3} className="h-full">
            <div className="group flex h-full flex-col rounded-3xl border border-border bg-surface p-5 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary/50 md:p-6">
              <IconBubble name={item.icon} />
              <h3 className="mt-4 text-base font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-8 text-muted">{item.text}</p>
              {item.link && (
                <div className="mt-auto pt-3">
                  <LinkLine link={item.link} />
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </ul>
      {data.footer && <Footer text={data.footer} />}
    </Band>
  );
}

// ───────── چرا سایت حرفه‌ای؟ ─────────
export function WhyNeed({ data }) {
  return (
    <Band id={data.id} tone="alt">
      <Head id={data.id} title={data.title} />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i % 3} className="h-full">
            <div className="group flex h-full gap-4 rounded-3xl border border-border bg-surface p-5 md:p-6">
              <IconBubble name={item.icon} />
              <div>
                <h3 className="text-base font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-8 text-muted">{item.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Band>
  );
}

// ───────── چهار اصل ─────────
export function Principles({ data }) {
  const { n } = useLang();
  return (
    <Band id={data.id}>
      <Head id={data.id} title={data.title} />
      <ol className="mt-10 grid gap-5 sm:grid-cols-2">
        {data.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i % 2} className="h-full">
            <div className="group flex h-full gap-5 rounded-3xl border border-border bg-surface p-5 transition-[border-color] duration-300 hover:border-primary/50 md:p-6">
              <span aria-hidden="true" className={NUM}>
                {n(i + 1, { minimumIntegerDigits: 2 })}
              </span>
              <div>
                <h3 className="text-base font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-8 text-muted">{item.text}</p>
                {item.link && (
                  <div className="mt-2">
                    <LinkLine link={item.link} />
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Band>
  );
}

// ───────── انواع طراحی سایت (۱۳ لینک واقعی به صفحه‌های /web-design/*) ─────────
export function Types({ data }) {
  const pages = useServicePages();
  const iconOf = (href) => pages.find((p) => p.path === href)?.icon ?? "code";

  return (
    <Band id={data.id} tone="alt">
      <Head id={data.id} title={data.title} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <Reveal as="li" key={item.href} delay={i % 3} className="h-full">
            <article className="group relative flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-4 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-surface-2 md:p-5">
              <IconBubble name={iconOf(item.href)} />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black leading-6 md:text-base">
                  <Link
                    to={item.href}
                    className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-primary"
                  >
                    {item.label}
                  </Link>
                </h3>
                <p className="mt-1 text-xs leading-6 text-muted">
                  <span className="font-bold text-foreground/80">{data.forLabel}:</span>{" "}
                  {item.forWho}
                </p>
              </div>
              <ArrowForward
                size={16}
                aria-hidden="true"
                className={`mt-1 shrink-0 text-primary ${ARROW}`}
              />
            </article>
          </Reveal>
        ))}
      </ul>
    </Band>
  );
}

// ───────── وردپرس یا اختصاصی؟ ─────────
export function Compare({ data }) {
  return (
    <Band id={data.id}>
      <Head id={data.id} title={data.title} />
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {data.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i} className="h-full">
            <div
              className={`flex h-full flex-col rounded-3xl border p-5 md:p-6 ${
                i === data.items.length - 1
                  ? "border-primary/40 bg-primary/10"
                  : "border-border bg-surface"
              }`}
            >
              <h3 className="text-lg font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-8 text-muted">{item.text}</p>
              <div className="mt-auto pt-3">
                <LinkLine link={item.link} />
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
      {data.footer && <Footer text={data.footer} />}
    </Band>
  );
}

// ───────── فرایند ۸ مرحله‌ای ─────────
export function Process({ data }) {
  const { n } = useLang();
  return (
    <Band id={data.id} tone="alt">
      <Head id={data.id} title={data.title} />
      <ol className="mt-10 grid gap-x-10 md:grid-cols-2">
        {data.steps.map((step, i) => (
          <Reveal as="li" key={step.title} delay={i % 2}>
            <div className="group flex gap-5 border-b border-border py-6">
              <span aria-hidden="true" className={NUM}>
                {n(i + 1, { minimumIntegerDigits: 2 })}
              </span>
              <div>
                <h3 className="text-base font-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">
                  <span className="font-bold text-foreground/80">{data.outputLabel}:</span>{" "}
                  {step.output}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Band>
  );
}

// ───────── چه چیزی تحویل می‌گیرید؟ ─────────
export function Deliverables({ data }) {
  return (
    <Band id={data.id}>
      <Head id={data.id} title={data.title} />
      <Reveal className="mt-10">
        <ul className="grid gap-x-8 gap-y-4 rounded-3xl border border-border bg-surface p-6 sm:grid-cols-2 md:p-8">
          {data.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-7 md:text-base">
              <Tick />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Band>
  );
}

// ───────── فناوری‌ها ─────────
export function Tech({ data }) {
  return (
    <Band id={data.id} tone="alt">
      <Head id={data.id} title={data.title} />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.rows.map((row, i) => (
          <Reveal as="li" key={row.area} delay={i % 3} className="h-full">
            <div className="h-full rounded-3xl border border-border bg-surface p-5 md:p-6">
              <h3 className="text-base font-black">{row.area}</h3>
              <ul dir="ltr" className="mt-4 flex flex-wrap gap-2">
                {row.items.map((tech) => (
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
        ))}
      </ul>
      {data.note && (
        <Reveal className="mt-6">
          <p className="text-sm leading-8 text-muted md:text-base">{data.note}</p>
        </Reveal>
      )}
    </Band>
  );
}

// ───────── طراحی سایت سئو‌محور یعنی چه؟ ─────────
export function SeoDriven({ data }) {
  return (
    <Band id={data.id}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <Head id={data.id} title={data.title} lead={data.lead} />
        <Reveal delay={1}>
          <ul className="space-y-4 rounded-3xl border border-border bg-surface p-6 md:p-8">
            {data.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-7 md:text-base">
                <Tick />
                <span>
                  <Inline text={item} />
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Band>
  );
}

// ───────── هزینه ─────────
export function Cost({ data }) {
  return (
    <Band id={data.id} tone="alt">
      <Head id={data.id} title={data.title} lead={data.text} />
      <Reveal className="mt-8">
        <ul className="flex flex-wrap gap-2.5">
          {data.factors.map((factor) => (
            <li
              key={factor}
              className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold md:text-sm"
            >
              {factor}
            </li>
          ))}
        </ul>
      </Reveal>
      {data.footer && <Footer text={data.footer} />}
    </Band>
  );
}

// ───────── مشهد + تخصص (دو کارت کنار هم؛ هرکدام H2 و id خودش را دارد) ─────────
export function LocalAndExpertise({ local, expertise }) {
  const cards = [
    { data: local, icon: "pin" },
    { data: expertise, icon: "settings" },
  ];
  return (
    <section aria-label={`${local.title} / ${expertise.title}`} className="py-12 md:py-16">
      <div className={`${WRAP} grid gap-5 md:grid-cols-2`}>
        {cards.map(({ data, icon }, i) => (
          <Reveal key={data.id} delay={i} className="h-full">
            <article
              id={data.id}
              aria-labelledby={`${data.id}-title`}
              className="group h-full rounded-3xl border border-border bg-surface p-6 md:p-8"
            >
              <IconBubble name={icon} />
              <h2 id={`${data.id}-title`} className="mt-4 text-lg font-black leading-[1.6] md:text-2xl">
                {data.title}
              </h2>
              <p className="mt-3 text-sm leading-8 text-muted md:text-base">
                <Inline text={data.text} />
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ───────── نمونه‌کارها (پروژه‌های واقعی از src/data/projects.js) ─────────
export function PortfolioBand({ data, projects }) {
  return (
    <Band id={data.id} tone="alt">
      <Head id={data.id} title={data.title} lead={data.lead} />
      <div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i % 2}>
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10">
        <Link
          to="/portfolio"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-4 text-sm font-bold transition-[background-color,border-color] duration-200 hover:border-primary hover:bg-primary/10"
        >
          {data.all}
          <ArrowForward size={16} aria-hidden="true" className={`text-primary ${ARROW}`} />
        </Link>
      </Reveal>
    </Band>
  );
}

// ───────── چرا آرانو؟ ─────────
export function WhyUs({ data }) {
  return (
    <Band id={data.id}>
      <Head id={data.id} title={data.title} />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i % 3} className="h-full">
            <div className="flex h-full items-start gap-4 rounded-3xl border border-border bg-surface p-5 md:p-6">
              <Tick />
              <div>
                <h3 className="text-base font-black leading-7">{item.title}</h3>
                {item.text && (
                  <p className="mt-1 text-sm leading-8 text-muted">{item.text}</p>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Band>
  );
}

// ───────── چطور شرکت طراحی سایت را انتخاب کنیم؟ ─────────
export function Choose({ data }) {
  const { n } = useLang();
  return (
    <Band id={data.id} tone="alt">
      <Head id={data.id} title={data.title} lead={data.lead} />
      <ol className="mt-10 grid gap-4 md:grid-cols-2">
        {data.items.map((item, i) => (
          <Reveal as="li" key={item} delay={i % 2} className="h-full">
            <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-4 md:p-5">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground"
              >
                {n(i + 1)}
              </span>
              <p className="text-sm leading-8 md:text-base">{item}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Band>
  );
}

// ───────── اشتباه‌های رایج ─────────
export function Mistakes({ data }) {
  return (
    <Band id={data.id}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <Head id={data.id} title={data.title} />
        <Reveal delay={1}>
          <ul className="space-y-4 rounded-3xl border border-border bg-surface p-6 md:p-8">
            {data.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-7 md:text-base">
                <FiAlertCircle
                  aria-hidden="true"
                  size={18}
                  className="mt-1 shrink-0 text-primary"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {data.footer && (
            <p className="mt-5 text-sm leading-8 text-muted md:text-base">
              <Inline text={data.footer} />
            </p>
          )}
        </Reveal>
      </div>
    </Band>
  );
}

// ───────── سوالات متداول (آکاردئون <details>؛ متن همیشه در HTML است) ─────────
export function PillarFaq({ data }) {
  return (
    <Band id={data.id} tone="alt">
      <div className="mx-auto max-w-4xl">
        <Head id={data.id} title={data.title} />
        <Reveal delay={1} className="mt-10">
          <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
            {data.items.map(({ q, a }) => (
              <li key={q}>
                <details className="group p-5 md:p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base font-black">{q}</h3>
                    <span
                      aria-hidden="true"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-primary transition-transform duration-300 group-open:rotate-45"
                    >
                      <FiPlus size={16} />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-8 text-muted md:text-base">
                    <Inline text={a} />
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Band>
  );
}

// ───────── دعوت به اقدام پایانی ─────────
export function FinalCta({ data }) {
  return (
    <section aria-labelledby="pillar-final-title" className="py-12 md:py-16">
      <div className={WRAP}>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface-2 p-8 text-center md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
            />
            <div className="relative">
              <h2 id="pillar-final-title" className={H2}>
                {data.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-muted md:text-base">
                {data.text}
              </p>
              <Link to="/contact" className={`${BTN} mt-8`}>
                {data.button}
                <ArrowForward size={18} aria-hidden="true" className={ARROW} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
