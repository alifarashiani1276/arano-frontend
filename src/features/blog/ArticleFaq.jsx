import { FiPlus } from "react-icons/fi";

// سوالات متداول مقاله (آکاردئون با <details>؛ متن جواب همیشه داخل HTML است و Schema آن هم ساخته می‌شود).
export default function ArticleFaq({ items, title, dir = "rtl" }) {
  if (!items?.length) return null;
  return (
    <section id="faq" dir={dir} aria-labelledby="faq-title" className="mt-14 scroll-mt-28">
      <h2 id="faq-title" className="text-2xl font-black leading-[1.6] md:text-3xl">
        {title}
      </h2>
      <ul className="mt-6 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
        {items.map(({ q, a }) => (
          <li key={q}>
            <details className="group p-5 md:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-black">{q}</h3>
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-primary transition-transform duration-300 group-open:rotate-45"
                >
                  <FiPlus size={16} />
                </span>
              </summary>
              <p className="mt-3 text-sm leading-8 text-muted md:text-base">
                {a}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
