import { Fragment } from "react";
import { site } from "../../config/site";
import Motion from "../../ui/Motion";
import SectionHeading from "../../ui/SectionHeading";

// جمله‌ی اصلی را کلمه‌به‌کلمه می‌شکند؛ فاصله‌ها و نقطه‌گذاری دست‌نخورده می‌مانند.
function Statement({ segments }) {
  let n = 0;
  return segments.map((seg, i) => (
    <Fragment key={i}>
      {seg.text.split(/(\s+)/).map((token, j) => {
        if (!token) return null;
        if (/^\s+$/.test(token)) return token;
        const idx = n;
        n += 1;
        return (
          <span
            key={j}
            style={{ "--i": idx }}
            className={`fw ${seg.strong ? "fw-strong font-black text-primary" : ""}`}
          >
            {token}
          </span>
        );
      })}
    </Fragment>
  ));
}

export default function About() {
  const { statement, principles } = site.about;

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="scroll-mt-24 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading id="about-title" {...site.sections.about} />
          <Motion
            as="p"
            fx="words"
            delay={200}
            className="mt-8 text-2xl font-bold leading-[2] text-foreground/90 md:text-3xl"
          >
            <Statement segments={statement} />
          </Motion>
        </div>

        <ol className="divide-y divide-border border-y border-border">
          {principles.map((item, i) => (
            <Motion
              as="li"
              key={item.title}
              fx="line"
              delay={i * 150}
              className="group relative py-8"
            >
              <div className="flex gap-6">
                <span
                  aria-hidden="true"
                  style={{ "--cd": "150ms" }}
                  className="fx-child fx-slide text-5xl font-black text-transparent transition-colors duration-300 [-webkit-text-stroke:1.5px_rgb(var(--foreground)/0.35)] group-hover:text-primary group-hover:[-webkit-text-stroke:0]"
                >
                  {(i + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}
                </span>
                <div>
                  <h3
                    style={{ "--cd": "280ms" }}
                    className="fx-child fx-up text-xl font-black"
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{ "--cd": "400ms" }}
                    className="fx-child fx-up mt-2 text-sm leading-8 text-muted md:text-base"
                  >
                    {item.text}
                  </p>
                </div>
              </div>
            </Motion>
          ))}
        </ol>
      </div>
    </section>
  );
}
