import { useEffect, useMemo, useState } from "react";
import { site } from "../../config/site";
import HeroIntro from "./HeroIntro";

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

export default function Hero() {
  return (
    <>
      <HeroBanner />
      <HeroIntro />
    </>
  );
}
