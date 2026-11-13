import { ArrowForward } from "../i18n/Arrow";
import { Link } from "../i18n/Link";
import { useLang } from "../i18n/LangContext";
import { useServicePages } from "../i18n/useData";
import Breadcrumb from "../features/services/Breadcrumb";
import ServiceCard from "../features/services/ServiceCard";
import Reveal from "../ui/Reveal";
import { getBreadcrumbs, getPage } from "../seo/registry";
import PageShell from "./PageShell";

export default function WebDesignPage() {
  const { lang, isEn } = useLang();
  const pages = useServicePages().filter((page) => page.group === "web-design");
  const entry = getPage("/web-design", lang) ?? getPage("/services", lang);
  const breadcrumbs = getBreadcrumbs(entry);

  const title = isEn ? "Web Design" : "طراحی سایت";
  const eyebrow = isEn ? "Website design services" : "خدمات طراحی سایت";
  const intro = isEn
    ? "We design websites that help businesses attract customers, build trust and turn visits into real conversions."
    : "ما سایت‌هایی طراحی می‌کنیم که به کسب‌وکارها کمک می‌کنند مشتری جذب کنند، اعتماد بسازند و بازدید را به تبدیل واقعی تبدیل کنند.";
  const sectionTitle = isEn
    ? "Website types we design"
    : "انواع سایت‌هایی که طراحی می‌کنیم";
  const primaryCta = isEn ? "Request a free consultation" : "درخواست مشاوره رایگان";
  const secondaryCta = isEn ? "See all services" : "مشاهده همه خدمات";

  const stats = isEn
    ? [
        { label: "Website types", value: "13" },
        { label: "Business-first approach", value: "SEO" },
        { label: "Responsive by default", value: "100%" },
      ]
    : [
        { label: "نوع سایت", value: "۱۳" },
        { label: "رویکرد کسب‌وکارمحور", value: "سئو" },
        { label: "واکنش‌گرا از ابتدا", value: "۱۰۰٪" },
      ];

  return (
    <PageShell path="/web-design">
      <section aria-labelledby="web-design-title" className="pb-12 md:pb-16">
        <div className="mx-auto max-w-6xl px-5">
          <Breadcrumb items={breadcrumbs} />

          <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface-2 p-6 sm:p-10 md:p-12">
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              <div className="max-w-3xl">
                <p className="mb-4 flex items-center gap-3 text-sm font-bold text-primary">
                  <span aria-hidden="true" className="h-px w-8 bg-primary" />
                  {eyebrow}
                </p>

                <h1 id="web-design-title" className="text-3xl font-black leading-[1.4] md:text-5xl">
                  {title}
                </h1>

                <p className="mt-5 text-base leading-8 text-muted md:text-lg">
                  {intro}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
                  >
                    {primaryCta}
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
                    {secondaryCta}
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border bg-surface p-4 text-center shadow-sm"
                  >
                    <div className="text-2xl font-black text-foreground">{stat.value}</div>
                    <div className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="web-design-types-title" className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 id="web-design-types-title" className="text-2xl font-black leading-[1.5] md:text-4xl">
              {sectionTitle}
            </h2>
          </Reveal>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pages.map((page, index) => (
              <ServiceCard key={page.path} page={page} index={index} />
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
