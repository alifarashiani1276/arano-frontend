import { FiAlertCircle } from "react-icons/fi";
import { site } from "../config/site";
import { termsMeta, termsSections } from "../data/terms";
import Reveal from "../ui/Reveal";
import PageShell from "./PageShell";

function Block({ block }) {
  if (block.type === "law") {
    return (
      <figure className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <figcaption className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
          <FiAlertCircle aria-hidden="true" />
          {block.label}
        </figcaption>
        <blockquote className="text-sm leading-8 md:text-base">
          «{block.text}»
        </blockquote>
      </figure>
    );
  }

  if (block.type === "ul") {
    return (
      <ul className="space-y-3">
        {block.items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-8 text-muted md:text-base"
          >
            <span
              aria-hidden="true"
              className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p className="text-sm leading-8 text-muted md:text-base">{block.text}</p>
  );
}

export default function TermsPage() {
  const [email, phone] = site.contact.items;

  return (
    <PageShell title="قوانین و مقررات">
      <section className="pb-12 md:pb-16">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal className="max-w-3xl">
            <p className="mb-4 flex items-center gap-3 text-sm font-bold text-primary">
              <span aria-hidden="true" className="h-px w-8 bg-primary" />
              {termsMeta.eyebrow}
            </p>
            <h1 className="text-3xl font-black leading-[1.5] md:text-5xl">
              {termsMeta.title}
            </h1>
            <p className="mt-5 text-base leading-8 text-muted md:text-lg">
              {termsMeta.description}
            </p>
            <p className="mt-4 text-xs text-muted">
              آخرین بازبینی: {termsMeta.updatedAt}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-[16rem_1fr]">
            <nav
              aria-label="فهرست قوانین"
              className="h-fit rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-28"
            >
              <p className="mb-3 text-sm font-black">فهرست</p>
              <ol className="space-y-2">
                {termsSections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-2 text-xs leading-6 text-muted transition-colors hover:text-primary"
                    >
                      <span className="text-primary">
                        {(i + 1).toLocaleString("fa-IR")}.
                      </span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="space-y-6">
              {termsSections.map((s, i) => (
                <Reveal
                  as="section"
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-title`}
                  className="scroll-mt-28 rounded-3xl border border-border bg-surface p-6 md:p-8"
                >
                  <h2
                    id={`${s.id}-title`}
                    className="mb-5 text-xl font-black leading-[1.6] md:text-2xl"
                  >
                    <span className="ml-2 text-primary">
                      {(i + 1).toLocaleString("fa-IR")}.
                    </span>
                    {s.title}
                  </h2>
                  <div className="space-y-4">
                    {s.blocks.map((b, j) => (
                      <Block key={j} block={b} />
                    ))}
                  </div>
                </Reveal>
              ))}

              <Reveal className="rounded-3xl border border-border bg-surface-2 p-6 md:p-8">
                <h2 className="mb-3 text-xl font-black">ارتباط با ما</h2>
                <p className="mb-4 text-sm leading-8 text-muted md:text-base">
                  برای سؤال، پیگیری سفارش یا اعلام انصراف با ما در تماس باشید:
                </p>
                <ul className="space-y-2 text-sm">
                  {[email, phone].map((c) => (
                    <li key={c.label} className="flex gap-2">
                      <span className="text-muted">{c.label}:</span>
                      <span className="flex flex-col">
                        {c.values.map((v) => (
                          <span key={v.value} dir={c.ltr ? "ltr" : undefined}>
                            {v.value}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
