// منطق خالص فرم مقاله (بدون JSX): مقدار اولیه، تبدیل به payload، اعتبارسنجی پیش از انتشار
// و نگاشت خطای ۴۲۲ بک‌اند به نام فیلدهای فرم. هیچ وابستگی به React یا DOM ندارد.

export const COVER_RATIO = 1690 / 900;
export const COVER_RATIO_TOLERANCE = 0.02;

export const SEO_TITLE_MAX = 60;
export const EXCERPT_MIN = 120;
export const EXCERPT_MAX = 160;

export const SLUG_MAX = 100;
export const SLUG_RE = /^[a-z0-9-]+$/;
export const RESERVED_SLUGS = ["category"];
// لینک داخلی: با / شروع شود، // نباشد و فاصله نداشته باشد
export const INTERNAL_LINK_RE = /^\/(?!\/)\S*$/;

// بلوک‌هایی که «متن» حساب می‌شوند (تصویر، کد و جدول تنها کافی نیستند)
const TEXT_BLOCKS = ["p", "h2", "h3", "ul", "ol", "quote", "checklist"];
export const hasTextBlock = (content) =>
  (content ?? []).some((block) => TEXT_BLOCKS.includes(block.type));

const tehranDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// هر مقدار تاریخ (YYYY-MM-DD یا ISO کامل) ← «YYYY-MM-DD» میلادی به وقت تهران
export const toDateOnly = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : tehranDate.format(date);
};
export const todayDateOnly = () => tehranDate.format(new Date());

// مسیر تو در تو مثل "faq.0.q" یا "en.title" را از یک شیء بخوان
export const getIn = (object, path) =>
  String(path)
    .split(".")
    .reduce((current, key) => (current == null ? undefined : current[key]), object);

export const emptyEn = () => ({
  title: "",
  seoTitle: "",
  excerpt: "",
  tags: [],
  coverAlt: "",
  content: [],
  faq: [],
});

export const emptyValues = (author = "") => ({
  title: "",
  slug: "",
  category: "",
  author,
  tags: [],
  publishedAt: "",
  featured: false,
  status: "draft",
  seoTitle: "",
  excerpt: "",
  cover: { src: "", mobileSrc: "", alt: "" },
  content: [],
  faq: [],
  links: [],
  en: emptyEn(),
});

const faqToForm = (faq) =>
  (faq ?? []).map((item) => ({ q: item?.q ?? "", a: item?.a ?? "" }));

// مقاله‌ی کامل API ← مقدار فرم
export function toFormValues(post, fallbackAuthor = "") {
  const en = post.en ?? null;

  return {
    title: post.title ?? "",
    slug: post.slug ?? "",
    category: post.category ?? "",
    author: post.author || fallbackAuthor,
    tags: post.tags ?? [],
    publishedAt: toDateOnly(post.publishedAt),
    featured: Boolean(post.featured),
    status: post.status === "published" ? "published" : "draft",
    seoTitle: post.seoTitle ?? "",
    excerpt: post.excerpt ?? "",
    cover: {
      src: post.cover?.src ?? "",
      mobileSrc: post.cover?.mobileSrc ?? "",
      alt: post.cover?.alt ?? "",
    },
    content: post.content ?? [],
    faq: faqToForm(post.faq),
    links: (post.links ?? []).map((value) => ({ value })),
    en: en
      ? {
          title: en.title ?? "",
          seoTitle: en.seoTitle ?? "",
          excerpt: en.excerpt ?? "",
          tags: en.tags ?? [],
          coverAlt: en.coverAlt ?? "",
          content: en.content ?? [],
          faq: faqToForm(en.faq),
        }
      : emptyEn(),
  };
}

const cleanFaq = (faq) =>
  (faq ?? [])
    .map((item) => ({ q: (item?.q ?? "").trim(), a: (item?.a ?? "").trim() }))
    .filter((item) => item.q || item.a);

// نسخه‌ی انگلیسی فقط وقتی «وجود دارد» که چیزی در آن نوشته شده باشد
export const hasEnglish = (en) =>
  Boolean(
    en &&
      (en.title?.trim() ||
        en.seoTitle?.trim() ||
        en.excerpt?.trim() ||
        en.coverAlt?.trim() ||
        (en.tags ?? []).length ||
        (en.content ?? []).length ||
        cleanFaq(en.faq).length),
  );

// مقدار فرم ← بدنه‌ی POST/PUT. فیلدهای سمت سرور (id، updatedAt، readingMinutes، slugLocked) فرستاده نمی‌شوند.
export function buildPayload(values, { status, slugLocked }) {
  const cover = values.cover ?? {};
  const en = values.en ?? emptyEn();

  return {
    title: values.title.trim(),
    ...(slugLocked ? {} : { slug: values.slug.trim() }),
    category: values.category || null,
    author: values.author.trim(),
    featured: Boolean(values.featured),
    status,
    publishedAt: values.publishedAt || null,
    tags: values.tags ?? [],
    seoTitle: values.seoTitle.trim(),
    excerpt: values.excerpt.trim(),
    cover: cover.src
      ? {
          src: cover.src,
          ...(cover.mobileSrc ? { mobileSrc: cover.mobileSrc } : {}),
          alt: (cover.alt ?? "").trim(),
        }
      : null,
    content: values.content ?? [],
    faq: cleanFaq(values.faq),
    links: (values.links ?? []).map((item) => item.value.trim()).filter(Boolean),
    en: hasEnglish(en)
      ? {
          title: en.title.trim(),
          seoTitle: en.seoTitle.trim(),
          excerpt: en.excerpt.trim(),
          tags: en.tags ?? [],
          coverAlt: en.coverAlt.trim(),
          content: en.content ?? [],
          faq: cleanFaq(en.faq),
        }
      : null,
  };
}

// اجباری‌های انتشار. خروجی: { نام‌فیلد: پیام } (خالی = مشکلی نیست)
export function validateForPublish(values) {
  const problems = {};
  const need = (name, ok, message) => {
    if (!ok) problems[name] = message;
  };

  need("title", values.title.trim(), "عنوان الزامی است.");
  need("slug", values.slug.trim(), "آدرس (slug) الزامی است.");
  need("category", values.category, "دسته را انتخاب کنید.");
  need("excerpt", values.excerpt.trim(), "خلاصه (Meta Description) الزامی است.");
  need("cover.src", values.cover?.src, "کاور مقاله الزامی است.");
  need(
    "cover.alt",
    !values.cover?.src || values.cover?.alt?.trim(),
    "متن جایگزین (alt) کاور الزامی است.",
  );
  need("content", hasTextBlock(values.content), "مقاله باید حداقل یک بلوک متن داشته باشد.");

  // نسخه‌ی انگلیسی نیمه‌کاره نباید hreflang بسازد
  if (hasEnglish(values.en)) {
    need("en.title", values.en.title.trim(), "عنوان انگلیسی الزامی است.");
    need("en.excerpt", values.en.excerpt.trim(), "خلاصه‌ی انگلیسی الزامی است.");
    need("en.content", hasTextBlock(values.en.content), "متن انگلیسی باید حداقل یک بلوک متن داشته باشد.");
  }

  return problems;
}

const FORM_ROOTS = new Set([
  "title",
  "slug",
  "category",
  "author",
  "tags",
  "publishedAt",
  "featured",
  "status",
  "seoTitle",
  "excerpt",
  "cover",
  "content",
  "faq",
  "links",
  "en",
]);

// خطای ۴۲۲ لاراول ({ "cover.alt": ["..."], "faq.0.q": [...] }) ← { fields, general }
// fields: نام فیلد فرم ← پیام؛ general: پیام‌هایی که فیلد مشخصی ندارند.
export function mapServerErrors(errors = {}) {
  const fields = {};
  const general = [];

  Object.entries(errors).forEach(([key, value]) => {
    const message = Array.isArray(value) ? value[0] : value;
    if (!message) return;

    let name = key
      .replace(/^(en\.)?content\..*$/, "$1content")
      .replace(/^(en\.)?tags\..*$/, "$1tags");
    if (/^links\.\d+$/.test(name)) name = `${name}.value`;
    if (name === "cover") name = "cover.src";

    if (FORM_ROOTS.has(name.split(".")[0])) fields[name] = message;
    else general.push(message);
  });

  return { fields, general };
}

// هر فیلد در کدام تب است
export function fieldTab(name) {
  const root = String(name).split(".")[0];
  if (root === "en") return "en";
  if (["seoTitle", "excerpt", "faq", "links"].includes(root)) return "seo";
  return "content";
}
