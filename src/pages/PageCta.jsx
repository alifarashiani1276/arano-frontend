import { FiArrowLeft } from "react-icons/fi";
import { site } from "../config/site";
import Reveal from "../ui/Reveal";
import SmartLink from "../ui/SmartLink";

// نوار پایین صفحه‌های جداشده: مسیر مستقیم به فرم ارتباط در صفحه اصلی.
export default function PageCta() {
  const { contact } = site.sections;

  return (
    <section aria-label="شروع پروژه" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-border bg-surface p-8 md:p-12">
            <div className="max-w-xl">
              <h2 className="text-2xl font-black leading-[1.5] md:text-3xl">
                {contact.title}
              </h2>
              <p className="mt-3 text-sm leading-8 text-muted md:text-base">
                {contact.description}
              </p>
            </div>

            <SmartLink
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              {site.cta.label}
              <FiArrowLeft
                size={18}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
            </SmartLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
