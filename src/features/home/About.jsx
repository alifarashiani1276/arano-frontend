import { site } from "../../config/site";
import Reveal from "../../ui/Reveal";
import SectionHeading from "../../ui/SectionHeading";

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
          <Reveal delay={1}>
            <p className="mt-8 text-2xl font-bold leading-[2] text-foreground/90 md:text-3xl">
              {statement.map((seg, i) =>
                seg.strong ? (
                  <strong key={i} className="font-black text-primary">
                    {seg.text}
                  </strong>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
            </p>
          </Reveal>
        </div>

        <ol className="divide-y divide-border border-y border-border">
          {principles.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={Math.min(i, 3)}
              className="group py-8"
            >
              <div className="flex gap-6">
                <span
                  aria-hidden="true"
                  className="text-5xl font-black text-transparent transition-colors duration-300 [-webkit-text-stroke:1.5px_rgb(var(--foreground)/0.35)] group-hover:text-primary group-hover:[-webkit-text-stroke:0]"
                >
                  {(i + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}
                </span>
                <div>
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-8 text-muted md:text-base">
                    {item.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
