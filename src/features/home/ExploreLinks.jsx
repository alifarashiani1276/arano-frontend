import { useRef } from "react";
import { FiArrowLeft, FiBriefcase, FiInfo, FiLayers } from "react-icons/fi";
import { Link } from "react-router-dom";
import useSpotlight from "../../hooks/useSpotlight";
import Reveal from "../../ui/Reveal";

// سه کارت بزرگ به صفحه‌های جداگانه؛ «نمونه‌کارها» عمداً برجسته‌تر است.
// انیمیشن‌ها سبک‌اند: فقط transform / opacity + نور دنبال‌کننده‌ی موس (همان .spot سایت).
const LINKS = [
  {
    to: "/portfolio",
    title: "نمونه‌کارها",
    text: "پروژه‌هایی که تا امروز ساخته‌ایم؛ وب‌اپلیکیشن، داشبورد و طراحی.",
    Icon: FiBriefcase,
    featured: true,
  },
  {
    to: "/services",
    title: "خدمات",
    text: "از طراحی رابط و فرانت‌اند تا بک‌اند، دیتابیس و استقرار.",
    Icon: FiLayers,
  },
  {
    to: "/about",
    title: "درباره ما",
    text: "کوچک، متمرکز و حرفه‌ای؛ با اصولی که روی آن‌ها کار می‌کنیم.",
    Icon: FiInfo,
  },
];

export default function ExploreLinks() {
  const listRef = useRef(null);
  useSpotlight(listRef, ".spot");

  return (
    <section
      id="explore"
      aria-label="مشاهده بخش‌های سایت"
      className="scroll-mt-24 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <ul ref={listRef} className="grid gap-5 md:grid-cols-[1.3fr_1fr_1fr]">
          {LINKS.map(({ to, title, text, Icon, featured }, i) => (
            <Reveal as="li" key={to} delay={i} className="h-full">
              <Link
                to={to}
                className={`spot group relative flex h-full min-h-[14rem] flex-col overflow-hidden rounded-3xl border p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98] ${
                  featured
                    ? "border-primary bg-primary text-primary-foreground hover:shadow-primary/30"
                    : "border-border bg-surface hover:border-primary/50 hover:shadow-primary/10"
                }`}
              >
                {/* هاله‌ی نرم گوشه‌ی کارت */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full blur-3xl transition-[opacity,transform] duration-500 group-hover:scale-125 ${
                    featured
                      ? "bg-primary-foreground/15 opacity-100"
                      : "bg-primary/20 opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* خط نور که روی کارت می‌گذرد */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-1/3 translate-x-[150%] -skew-x-12 bg-gradient-to-l from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out group-hover:-translate-x-[400%]"
                />

                {/* شماره‌ی محو بزرگ */}
                <span
                  aria-hidden="true"
                  className={`absolute left-6 top-4 select-none text-6xl font-black transition-[transform,color] duration-500 group-hover:-translate-y-1 group-hover:scale-110 ${
                    featured
                      ? "text-primary-foreground/10 group-hover:text-primary-foreground/20"
                      : "text-foreground/5 group-hover:text-primary/15"
                  }`}
                >
                  {(i + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}
                </span>

                <span
                  className={`relative grid h-12 w-12 place-items-center rounded-2xl transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 ${
                    featured
                      ? "bg-primary-foreground/10 text-primary-foreground group-hover:rotate-6 group-hover:bg-primary-foreground group-hover:text-primary"
                      : "bg-secondary text-primary group-hover:-rotate-6 group-hover:bg-primary group-hover:text-primary-foreground"
                  }`}
                >
                  <Icon size={22} aria-hidden="true" />
                </span>

                <h3 className="relative mt-8 text-2xl font-black">{title}</h3>
                <p
                  className={`relative mt-3 text-sm leading-7 ${
                    featured ? "text-primary-foreground/80" : "text-muted"
                  }`}
                >
                  {text}
                </p>

                <span className="relative mt-auto flex items-center justify-between pt-8 text-sm font-bold">
                  <span className="inline-flex items-center gap-2">
                    مشاهده
                    <span
                      aria-hidden="true"
                      className={`grid h-9 w-9 place-items-center rounded-full border transition-[transform,background-color,color,border-color] duration-300 group-hover:-translate-x-1.5 ${
                        featured
                          ? "border-primary-foreground/30 group-hover:border-primary-foreground group-hover:bg-primary-foreground group-hover:text-primary"
                          : "border-border group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                      }`}
                    >
                      <FiArrowLeft size={18} />
                    </span>
                  </span>
                </span>

                {/* خط پایین کارت که با هاور کشیده می‌شود */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-0.5 origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 ${
                    featured ? "bg-primary-foreground/60" : "bg-primary"
                  }`}
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
