import { ArrowForward } from "../../i18n/Arrow";
import { Link } from "../../i18n/Link";
import { useLang } from "../../i18n/LangContext";
import Icon from "../../ui/Icon";
import MediaImage from "../../ui/MediaImage";
import Motion from "../../ui/Motion";

// کارت خدمت در هاب. ظاهرش همان کارت قبلی بخش خدمات است؛
// عنوان (کلمه کلیدی) یک لینک واقعی <a href> است و با after:inset-0 کل کارت را کلیک‌پذیر می‌کند.
// «بیشتر بخوانید» فقط تزئینی است و کنار عنوان قرار دارد، نه به‌جای آن.
// ساختار: تصویر افقی ۱۶:۱۰ (بدون برش) بالا + متن پایین؛ ارتفاع همه‌ی کارت‌های یک ردیف با grid یکی می‌شود.
export default function ServiceCard({ page, index }) {
  const { t } = useLang();
  const tags = page.tags ?? page.tech.slice(0, 3);

  return (
    <Motion as="li" fx="deal" delay={(index % 4) * 140} className="h-full w-full">
      <article className="spot group relative mx-auto flex h-full w-full max-w-[320px] flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-primary/50">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-gradient-to-br from-secondary/60 via-secondary/25 to-transparent">
          <MediaImage
            src={page.image}
            alt={`${t("تصویر خدمت")} ${page.name}`}
            label={page.name}
            variant={index}
            className="h-full w-full"
            imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            style={{ "--cd": "350ms" }}
            className="fx-child fx-pop absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-xl bg-background/80 text-primary shadow-sm ring-1 ring-border/70 backdrop-blur-sm transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:right-4 sm:top-4 sm:h-10 sm:w-10"
          >
            <Icon name={page.icon} size={16} />
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-end p-3 pt-3 sm:p-4 sm:pt-4">
          <h3
            style={{ "--cd": "450ms" }}
            className="fx-child fx-up line-clamp-2 text-sm font-black leading-5 text-foreground sm:text-base sm:leading-6"
          >
            <Link
              to={page.path}
              className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-primary"
            >
              {page.name}
            </Link>
          </h3>

          <ul dir="ltr" className="mt-2 flex flex-wrap gap-1.5 sm:mt-3">
            {tags.map((tag, t) => (
              <li
                key={tag}
                style={{ "--cd": "650ms", "--i": t }}
                className="fx-child fx-pop rounded-full border border-border px-2 py-0.5 text-[10px] text-muted sm:text-[11px]"
              >
                {tag}
              </li>
            ))}
          </ul>

          <span
            aria-hidden="true"
            className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary sm:mt-3 sm:text-xs"
          >
            {t("بیشتر بخوانید")}
            <ArrowForward
              size={12}
              className="transition-transform duration-200 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
            />
          </span>
        </div>
      </article>
    </Motion>
  );
}
