import { site } from "../../config/site";
import Reveal from "../../ui/Reveal";

export default function Stats() {
  return (
    <section
      aria-label="آمار تیم"
      className="border-y border-border bg-surface/50"
    >
      <Reveal>
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-5 md:grid-cols-4">
          {site.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse items-center gap-2 border-border px-4 py-10 text-center odd:border-l md:border-l md:last:border-l-0"
            >
              <dt className="text-sm text-muted">{stat.label}</dt>
              <dd className="text-4xl font-black text-primary md:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
