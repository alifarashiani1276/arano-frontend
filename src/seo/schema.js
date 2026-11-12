// ساخت Schema (JSON-LD): Organization برای کل سایت،
// BreadcrumbList + FAQPage + Service برای هر صفحه خدمت،
// BlogPosting (+ FAQPage اگر مقاله faq دارد) برای مقاله.

import { site } from "../config/site.js";
import { LANG_META } from "../i18n/config.js";
import { SITE_NAME, SITE_NAME_EN, SITE_URL, absUrl, getBreadcrumbs } from "./registry.js";

const CTX = "https://schema.org";

const emailItem = site.contact.items.find((i) => i.icon === "mail");
const phoneItem = site.contact.items.find((i) => i.icon === "phone");

// 09370876514 → +989370876514
const toIntlPhone = (v) => (v ? v.replace(/^0/, "+98") : undefined);

export const organizationLd = () => ({
  "@context": CTX,
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: SITE_NAME_EN,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/images/icon-512.png`,
  description: site.slogan,
  email: emailItem?.value,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: toIntlPhone(phoneItem?.value),
    contactType: "customer support",
    availableLanguage: ["fa", "en"],
  },
  telephone: toIntlPhone(phoneItem?.value),
  address: {
    "@type": "PostalAddress",
    addressRegion: "خراسان رضوی",
    addressLocality: "جغتای",
    addressCountry: "IR",
  },
  sameAs: site.socials.map((s) => s.href),
});

export const websiteLd = (lang) => ({
  "@context": CTX,
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: SITE_NAME_EN,
  url: `${SITE_URL}/`,
  inLanguage: LANG_META[lang].ldLang,
});

export const breadcrumbLd = (items) => ({
  "@context": CTX,
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absUrl(item.path),
  })),
});

export const faqLd = (faq) => ({
  "@context": CTX,
  "@type": "FAQPage",
  mainEntity: faq.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

export const serviceLd = (page) => ({
  "@context": CTX,
  "@type": "Service",
  name: page.h1,
  serviceType: page.h1,
  description: page.description,
  url: absUrl(page.path),
  areaServed: { "@type": "Country", name: "ایران" },
  provider: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
});

const absAsset = (src) =>
  /^https?:\/\//.test(src) ? src : `${SITE_URL}${src}`;

export const articleLd = (page) => {
  const post = page.article;
  return {
    "@context": CTX,
    "@type": "BlogPosting",
    headline: post.title,
    description: page.description,
    url: absUrl(page.path),
    mainEntityOfPage: absUrl(page.path),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: LANG_META[page.lang ?? "fa"].ldLang,
    ...(post.cover
      ? { image: absAsset(post.cover.src || post.cover.mobileSrc) }
      : {}),
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
  };
};

// همه‌ی JSON-LD هر صفحه (آرایه‌ای از آبجکت‌ها)
export function getJsonLd(page) {
  const out = [organizationLd()];
  if (page.kind === "home") out.push(websiteLd(page.lang ?? "fa"));
  if (page.kind === "service") {
    out.push(breadcrumbLd(getBreadcrumbs(page)));
    out.push(serviceLd(page));
    out.push(faqLd(page.service.faq));
  } else if (["blog", "blog-category", "article"].includes(page.kind)) {
    out.push(breadcrumbLd(getBreadcrumbs(page)));
    if (page.kind === "article") {
      out.push(articleLd(page));
      if (page.article.faq?.length) out.push(faqLd(page.article.faq));
    }
  }
  return out;
}
