import { ArrowForward } from "../i18n/Arrow";
import { Link } from "../i18n/Link";
import { useLang } from "../i18n/LangContext";
import { useWebDesignPillar } from "../i18n/useData";
import useProjects from "../hooks/useProjects";
import Breadcrumb from "../features/services/Breadcrumb";
import {
  Choose,
  Compare,
  Cost,
  Deliverables,
  FinalCta,
  Includes,
  Intro,
  LocalAndExpertise,
  Mistakes,
  PillarFaq,
  PortfolioBand,
  Principles,
  Process,
  SeoDriven,
  Tech,
  Toc,
  Types,
  WhyNeed,
  WhyUs,
} from "../features/services/PillarSections";
import MediaImage from "../ui/MediaImage";
import { getBreadcrumbs, getPage } from "../seo/registry";
import PageShell from "./PageShell";

// عکس شاخص بالای صفحه (۱۶:۹). فایل را در public/images/services/ بگذارید و مسیرش را اینجا بنویسید، مثلاً:
// "/images/services/website-design-service-banner-arano-16x9.webp"
// تا وقتی null است، به‌جایش کارت‌های آمار نمایش داده می‌شود. Alt آن در webDesignPillar.js (imageAlt) است.
const HERO_IMAGE = null;

// صفحه ستون «طراحی سایت» (/web-design و /en/web-design).
// متن: src/data/webDesignPillar.js و src/i18n/en/webDesignPillar.js — بخش‌ها: src/features/services/PillarSections.jsx
// Title/Meta/Schema: src/seo/registry.js و src/seo/schema.js (همان متن FAQ برای FAQPage هم استفاده می‌شود).
export default function WebDesignPage() {
  const { lang } = useLang();
  const pillar = useWebDesignPillar();
  const { data: projects = [] } = useProjects();
  const portfolio = projects.slice(0, 4);
  const breadcrumbs = getBreadcrumbs(getPage("/web-design", lang));

  // چیپ‌های فهرست بالای صفحه، به ترتیب بخش‌های صفحه
  const toc = [
    pillar.includes,
    pillar.why,
    pillar.principles,
    pillar.types,
    pillar.compare,
    pillar.process,
    pillar.deliverables,
    pillar.tech,
    pillar.seo,
    pillar.cost,
    pillar.local,
    pillar.expertise,
    ...(portfolio.length ? [pillar.portfolio] : []),
    pillar.whyUs,
    pillar.choose,
    pillar.mistakes,
    pillar.faq,
  ];

  return (
    <PageShell path="/web-design" hideCta>
      {/* هدر: H1 + جواب کوتاه + دکمه‌ها */}
      <section aria-labelledby="web-design-title" className="pb-4 md:pb-6">
        <div className="mx-auto max-w-6xl px-5">
          <Breadcrumb items={breadcrumbs} />

          <div className="relative mt-6 overflow-hidden rounded-3xl border border-border bg-surface-2 p-6 sm:p-10 md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-12">
              <div className="max-w-3xl">
                <p className="mb-4 flex items-center gap-3 text-sm font-bold text-primary">
                  <span aria-hidden="true" className="h-px w-8 bg-primary" />
                  {pillar.eyebrow}
                </p>

                <h1
                  id="web-design-title"
                  className="text-2xl font-black leading-[1.6] sm:text-3xl md:text-4xl"
                >
                  {pillar.heading}
                </h1>

                {/* جواب کوتاه (Featured Snippet / پاسخ هوش مصنوعی) */}
                <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 px-5 py-4">
                  <p className="text-sm leading-8 md:text-base md:leading-9">
                    <strong className="font-black">{pillar.shortLabel}</strong> {pillar.short}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
                  >
                    {pillar.cta.primary}
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
                    {pillar.cta.secondary}
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                {HERO_IMAGE && (
                  <MediaImage
                    src={HERO_IMAGE}
                    alt={pillar.imageAlt}
                    priority
                    className="aspect-[16/9] w-full rounded-2xl border border-border bg-background"
                  />
                )}
                <div className="grid grid-cols-3 gap-3">
                  {pillar.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-border bg-surface p-3 text-center shadow-sm"
                    >
                      <div className="text-xl font-black text-foreground">{stat.value}</div>
                      <div className="mt-1 text-[11px] font-bold leading-5 text-muted">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Toc title={pillar.tocTitle} items={toc} />
        </div>
      </section>

      <Intro paragraphs={pillar.intro} />
      <Includes data={pillar.includes} />
      <WhyNeed data={pillar.why} />
      <Principles data={pillar.principles} />
      <Types data={pillar.types} />
      <Compare data={pillar.compare} />
      <Process data={pillar.process} />
      <Deliverables data={pillar.deliverables} />
      <Tech data={pillar.tech} />
      <SeoDriven data={pillar.seo} />
      <Cost data={pillar.cost} />
      <LocalAndExpertise local={pillar.local} expertise={pillar.expertise} />
      {portfolio.length > 0 && <PortfolioBand data={pillar.portfolio} projects={portfolio} />}
      <WhyUs data={pillar.whyUs} />
      <Choose data={pillar.choose} />
      <Mistakes data={pillar.mistakes} />
      <PillarFaq data={pillar.faq} />
      <FinalCta data={pillar.finalCta} />
    </PageShell>
  );
}
