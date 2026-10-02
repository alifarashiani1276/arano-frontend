import { site } from "../../config/site";
import { SERVICES } from "../../data/services";
import Icon from "../../ui/Icon";
import Reveal from "../../ui/Reveal";
import SectionHeading from "../../ui/SectionHeading";

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="scroll-mt-24 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading id="services-title" {...site.sections.services} />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <Reveal
              as="li"
              key={service.id}
              delay={Math.min(i, 3)}
              className="h-full"
            >
              <article className="group relative h-full overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-primary/50">
                <span
                  aria-hidden="true"
                  className="absolute left-5 top-3 select-none text-6xl font-black text-foreground/5 transition-colors duration-300 group-hover:text-primary/15"
                >
                  {(i + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}
                </span>

                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon name={service.icon} size={22} />
                </span>

                <h3 className="mt-8 text-lg font-black">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {service.description}
                </p>

                <ul dir="ltr" className="mt-5 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
