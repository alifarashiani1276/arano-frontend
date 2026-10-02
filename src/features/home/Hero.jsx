import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { site } from "../../config/site";

// کلاس‌ها به‌صورت لفظی نوشته شده‌اند تا Tailwind آن‌ها را تشخیص دهد.
const TITLE_DELAYS = [
  "[animation-delay:100ms]",
  "[animation-delay:250ms]",
  "[animation-delay:400ms]",
  "[animation-delay:550ms]",
];

const TOKEN_CLASS = {
  k: "text-primary",
  s: "text-accent",
  f: "text-foreground",
  c: "italic text-muted/70",
  p: "text-muted",
};

// انیمیشن تایپ: تعداد کاراکترهای نمایش‌داده‌شده را کم‌کم زیاد می‌کند.
function useTyping(lines) {
  const lineLengths = useMemo(
    () =>
      lines.map((tokens) => tokens.reduce((n, [text]) => n + text.length, 0)),
    [lines],
  );
  const total = useMemo(
    () => lineLengths.reduce((n, len) => n + len, 0),
    [lineLengths],
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setCount(total);
      return undefined;
    }

    // کاراکترهای پایان هر خط؛ آنجا کمی مکث می‌کنیم تا طبیعی‌تر دیده شود
    const lineEnds = new Set();
    let acc = 0;
    lineLengths.forEach((len) => {
      acc += len;
      lineEnds.add(acc);
    });

    let n = 0;
    let timer;
    const tick = () => {
      n += 1;
      setCount(n);
      if (n >= total) return;
      const delay = 35 + Math.random() * 55;
      timer = setTimeout(tick, lineEnds.has(n) ? delay + 260 : delay);
    };
    timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
  }, [lineLengths, total]);

  return { count, lineLengths };
}

// پنجره‌ی کد تایپ‌شونده؛ روی تصویر بالای صفحه (گوشه‌ی پایین) قرار می‌گیرد.
function CodeWindow() {
  const { codeFile, codeLines } = site.hero;
  const { count, lineLengths } = useTyping(codeLines);

  // خطی که مکان‌نما (caret) روی آن است: اولین خطی که هنوز تایپ آن تمام نشده
  let remaining = count;
  const caretLine = lineLengths.findIndex((len) => {
    if (remaining <= len) return true;
    remaining -= len;
    return false;
  });
  const activeCaret = caretLine === -1 ? lineLengths.length - 1 : caretLine;

  let left = count;

  return (
    <div
      dir="ltr"
      className="overflow-hidden rounded-2xl border border-border bg-surface/75 shadow-2xl shadow-black/40 backdrop-blur-md"
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-2/80 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted/40" />
        <span className="ml-2 font-mono text-[11px] text-muted">
          {codeFile}
        </span>
      </div>
      <pre
        aria-hidden="true"
        className="overflow-x-auto p-3 font-mono text-[11px] leading-5 md:p-4 md:leading-6"
      >
        <code>
          {codeLines.map((tokens, i) => {
            let lineLeft = Math.max(Math.min(left, lineLengths[i]), 0);
            left -= lineLengths[i];

            return (
              <span
                key={i}
                className="block min-h-[1.25rem] whitespace-pre md:min-h-[1.5rem]"
              >
                <span className="mr-3 hidden w-4 select-none text-right text-muted/50 min-[400px]:inline-block">
                  {i + 1}
                </span>
                {tokens.map(([text, kind], j) => {
                  const part = text.slice(0, lineLeft);
                  lineLeft -= text.length;
                  return part ? (
                    <span
                      key={j}
                      className={TOKEN_CLASS[kind] ?? TOKEN_CLASS.p}
                    >
                      {part}
                    </span>
                  ) : null;
                })}
                {i === activeCaret && (
                  <span className="ml-px inline-block h-[1.1em] w-[2px] translate-y-[2px] animate-pulse bg-primary" />
                )}
              </span>
            );
          })}
        </code>
      </pre>
      <span className="sr-only">
        {codeLines
          .map((tokens) => tokens.map(([text]) => text).join(""))
          .join("\n")}
      </span>
    </div>
  );
}

// بخش اول صفحه: تصویر تمام‌صفحه (دسکتاپ/موبایل جدا) + پنجره‌ی کد در گوشه‌ی تصویر
function HeroBanner() {
  const { banner } = site.hero;

  return (
    <section
      id="top"
      aria-label="معرفی تصویری آرا نو"
      className="relative isolate h-[100svh] min-h-[34rem] overflow-hidden bg-background"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={banner.desktop} />
        <img
          src={banner.mobile}
          alt={banner.alt}
          width={941}
          height={1672}
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-top md:object-center"
        />
      </picture>

      {/* سایه‌ی نرم بالا (خوانایی منو) و پایین (ادغام تصویر با بقیه‌ی صفحه) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-background to-transparent"
      />

      <div className="absolute inset-x-3 bottom-5 md:inset-x-auto md:bottom-10 md:left-8 md:w-[22rem] lg:left-12">
        <CodeWindow />
      </div>
    </section>
  );
}

// بخش دوم: متن اصلی (بعد از تصویر، با اسکرول دیده می‌شود)
function HeroIntro() {
  const { hero } = site;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden py-20 md:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-grid bg-[length:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
        <div
          data-parallax="0.2"
          className="absolute -top-24 right-[8%] h-[24rem] w-[24rem]"
        >
          <div className="h-full w-full animate-float rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="absolute -bottom-10 left-[4%] h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center">
        <p className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          {hero.status}
        </p>

        <h1
          id="hero-title"
          className="mt-7 text-[clamp(1.75rem,3vw+1rem,3.25rem)] font-black leading-[1.25]"
        >
          {hero.titleLines.map((line, i) => (
            <span key={line} className="block overflow-hidden py-1">
              <span
                className={`block animate-line-up ${TITLE_DELAYS[i] ?? ""} ${
                  i === hero.highlightLine ? "text-primary" : ""
                }`}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className="mt-7 max-w-xl animate-fade-up text-base leading-8 text-muted [animation-delay:600ms] md:text-lg">
          {hero.description}
        </p>

        <div className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-4 [animation-delay:750ms]">
          <a
            href={hero.primaryCta.href}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
          >
            {hero.primaryCta.label}
            <FiArrowLeft
              size={18}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
          </a>
          <a
            href={hero.secondaryCta.href}
            className="inline-flex items-center rounded-full border border-border bg-surface px-7 py-4 text-sm font-bold transition-[border-color,background-color] duration-200 hover:border-primary/60 hover:bg-surface-2"
          >
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Hero() {
  return (
    <>
      <HeroBanner />
      <HeroIntro />
    </>
  );
}
