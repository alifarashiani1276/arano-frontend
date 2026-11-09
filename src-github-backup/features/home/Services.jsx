import { useRef } from "react";
import { site } from "../../config/site";
import { SERVICE_GROUPS, SERVICE_PAGES } from "../../data/servicePages";
import useSpotlight from "../../hooks/useSpotlight";
import Reveal from "../../ui/Reveal";
import SectionHeading from "../../ui/SectionHeading";
import ServiceCard from "../services/ServiceCard";

const COLS = {
  main: "lg:grid-cols-4",
  "web-design": "lg:grid-cols-4",
  extra: "lg:grid-cols-3",
};

function Group({ group }) {
  const listRef = useRef(null);
  useSpotlight(listRef, ".spot");
  const pages = SERVICE_PAGES.filter((p) => p.group === group.id);

  return (
    <section
      id={group.anchor}
      aria-labelledby={`${group.anchor}-title`}
      className="scroll-mt-24 py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <h2
            id={`${group.anchor}-title`}
            className="text-2xl font-black leading-[1.5] md:text-4xl"
          >
            {group.title}
          </h2>
          {group.description && (
            <p className="mt-3 text-sm leading-8 text-muted md:text-base">
              {group.description}
            </p>
          )}
        </Reveal>

        <ul
          ref={listRef}
          className={`mt-10 grid gap-5 sm:grid-cols-2 ${COLS[group.id]}`}
        >
          {pages.map((page, i) => (
            <ServiceCard key={page.path} page={page} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

// هاب خدمات: ۳ بخش کارتی (خدمات اصلی ← ۴ کارت، انواع طراحی سایت ← ۱۳ کارت، خدمات مکمل ← ۵ کارت).
// هر کارت لینک واقعی به صفحه‌ی مستقل همان خدمت است. داده‌ها: src/data/servicePages.js
export default function Services() {
  return (
    <>
      <section
        id="services"
        aria-labelledby="services-title"
        className="scroll-mt-24 pb-4 pt-6 md:pt-10"
      >
        <div className="mx-auto max-w-6xl px-5">
          <SectionHeading
            as="h1"
            id="services-title"
            {...site.sections.services}
          />
        </div>
      </section>

      {SERVICE_GROUPS.map((group) => (
        <Group key={group.id} group={group} />
      ))}
    </>
  );
}
