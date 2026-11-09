import { useLang } from "../../i18n/LangContext";
import { useSite } from "../../i18n/useData";
import Reveal from "../../ui/Reveal";

export default function Stats() {
  const site = useSite();
  const { t } = useLang();
  return (
    <section
      aria-label={t("آمار تیم")}
      className="border-y border-border bg-surface/50"
    >
      <Reveal>
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-5 md:grid-cols-4">
          {site.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse items-center gap-2 border-border px-4 py-10 text-center odd:border-e md:border-e md:last:border-e-0"
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
