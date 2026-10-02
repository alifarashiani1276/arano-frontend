import { site } from "../../config/site";

export default function Marquee() {
  const items = site.marquee;

  return (
    <section
      aria-label="تکنولوژی‌های مورد استفاده"
      className="overflow-hidden py-10 md:py-14"
    >
      <div
        dir="ltr"
        className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center"
            >
              {items.map((item, i) => (
                <li key={item} className="flex items-center">
                  <span
                    className={`px-6 text-4xl font-black md:text-6xl ${
                      i % 2
                        ? "text-transparent [-webkit-text-stroke:1.5px_rgb(var(--foreground)/0.45)]"
                        : "text-foreground"
                    }`}
                  >
                    {item}
                  </span>
                  <span aria-hidden="true" className="text-2xl text-primary">
                    ✦
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
