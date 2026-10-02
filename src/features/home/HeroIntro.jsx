import { FiArrowLeft } from "react-icons/fi";
import { site } from "../../config/site";
import Motion from "../../ui/Motion";
import SplitWords from "../../ui/SplitWords";

// بخش دوم Hero: بعد از تصویر، با اسکرول و به‌صورت پله‌ای نمایش داده می‌شود.
export default function HeroIntro() {
  const { hero } = site;
  let wordIndex = 0;

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

      <Motion
        fx="none"
        className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center"
      >
        <p className="fx-child fx-pop inline-flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          {hero.status}
        </p>

        <h1
          id="hero-title"
          style={{ "--d": "250ms" }}
          className="mt-7 text-[clamp(1.75rem,3vw+1rem,3.25rem)] font-black leading-[1.25]"
        >
          {hero.titleLines.map((line, i) => {
            const start = wordIndex;
            wordIndex += line.split(" ").filter(Boolean).length;
            return (
              <span key={line} className="block py-1">
                <span
                  className={i === hero.highlightLine ? "hl text-primary" : ""}
                >
                  <SplitWords text={line} start={start} />
                </span>
              </span>
            );
          })}
        </h1>

        <p
          style={{ "--cd": "900ms" }}
          className="fx-child fx-blur mt-7 max-w-xl text-base leading-8 text-muted md:text-lg"
        >
          {hero.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <span
            style={{ "--cd": "1100ms" }}
            className="fx-child fx-pop inline-flex"
          >
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
          </span>
          <span
            style={{ "--cd": "1250ms" }}
            className="fx-child fx-pop inline-flex"
          >
            <a
              href={hero.secondaryCta.href}
              className="inline-flex items-center rounded-full border border-border bg-surface px-7 py-4 text-sm font-bold transition-[border-color,background-color] duration-200 hover:border-primary/60 hover:bg-surface-2"
            >
              {hero.secondaryCta.label}
            </a>
          </span>
        </div>
      </Motion>
    </section>
  );
}
