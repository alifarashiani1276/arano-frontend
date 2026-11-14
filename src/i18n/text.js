// Language-aware data selectors (plain JS: used by components, registry and the build plugin).
// Persian sources stay untouched in src/data/* and src/config/site.js;
// English text lives in src/i18n/en/* and is merged over them.

import { site as FA_SITE } from "../config/site.js";
import { SERVICE_PAGES as BASE_SERVICE_PAGES, SERVICE_GROUPS } from "../data/servicePages.js";
import { WEB_DESIGN_CONTENT } from "../data/webDesignContent.js";
import { SERVICES_CONTENT_VOL2 } from "../data/servicesContentVol2.js";
import { WEB_DESIGN_PILLAR } from "../data/webDesignPillar.js";
import { TEAM } from "../data/team.js";
import { PROJECTS } from "../data/projects.js";
import { SERVICES } from "../data/services.js";
import { termsMeta as FA_TERMS_META, termsSections as FA_TERMS } from "../data/terms.js";
import { BLOG_CATEGORIES } from "../data/blog.js";

import { EN_SITE } from "./en/site.js";
import { EN_SERVICE_PAGES } from "./en/servicePages.js";
import { EN_WEB_DESIGN_CONTENT } from "./en/webDesignContent.js";
import { EN_SERVICES_CONTENT_VOL2 } from "./en/servicesContentVol2.js";
import { EN_WEB_DESIGN_PILLAR } from "./en/webDesignPillar.js";
import { EN_SERVICES, EN_TEAM, EN_PROJECTS, EN_BLOG_CATEGORIES, EN_GROUPS } from "./en/data.js";
import { termsMeta as EN_TERMS_META, termsSections as EN_TERMS } from "./en/terms.js";

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

// Objects merge recursively; arrays and primitives from `en` replace the Persian ones.
export function deepMerge(fa, en) {
  if (!isObj(fa) || !isObj(en)) return en ?? fa;
  const out = { ...fa };
  for (const key of Object.keys(en)) out[key] = deepMerge(fa[key], en[key]);
  return out;
}

const SITE_EN = deepMerge(FA_SITE, EN_SITE);
export const getSite = (lang) => (lang === "en" ? SITE_EN : FA_SITE);

// Persian: the SEO specialist's full text (src/data/webDesignContent.js) is merged over the 8 /web-design/* pages.
// Full SEO text per page: Vol.1 (8 /web-design/* pages) + Vol.2 (4 main services + 5 site types).
const FA_CONTENT = { ...WEB_DESIGN_CONTENT, ...SERVICES_CONTENT_VOL2 };
const EN_CONTENT = { ...EN_WEB_DESIGN_CONTENT, ...EN_SERVICES_CONTENT_VOL2 };

const SERVICE_PAGES = BASE_SERVICE_PAGES.map((p) =>
  FA_CONTENT[p.slug] ? { ...p, ...FA_CONTENT[p.slug] } : p,
);

const SERVICE_PAGES_EN = BASE_SERVICE_PAGES.map((p) => {
  const en = EN_SERVICE_PAGES[p.slug];
  if (!en) return p;
  // `short` of the four main services mirrors src/data/services.js
  // EN_WEB_DESIGN_CONTENT (full SEO text of the 8 /web-design/* pages) is merged last.
  return { ...p, ...en, tags: p.tags, ...(EN_CONTENT[p.slug] ?? {}) };
});
export const getServicePages = (lang) =>
  lang === "en" ? SERVICE_PAGES_EN : SERVICE_PAGES;

// Full text of the /web-design pillar page (SEO specialist's "Step 2" file), Persian and English.
export const getWebDesignPillar = (lang) =>
  lang === "en" ? EN_WEB_DESIGN_PILLAR : WEB_DESIGN_PILLAR;

const GROUPS_EN = SERVICE_GROUPS.map((g) => ({ ...g, ...EN_GROUPS[g.id] }));
export const getServiceGroups = (lang) => (lang === "en" ? GROUPS_EN : SERVICE_GROUPS);

const TEAM_EN = TEAM.map((m) => {
  const en = EN_TEAM[m.id] ?? {};
  return {
    ...m,
    ...en,
    links: m.links.map((l, i) => ({ ...l, ...(en.links?.[i] ?? {}) })),
  };
});
export const getTeam = (lang) => (lang === "en" ? TEAM_EN : TEAM);

export const getProjectsRaw = (lang) =>
  lang === "en"
    ? PROJECTS.map((p) => ({ ...p, ...(EN_PROJECTS[p.id] ?? {}) }))
    : PROJECTS;

export const getServices = (lang) =>
  lang === "en" ? SERVICES.map((s) => ({ ...s, ...(EN_SERVICES[s.id] ?? {}) })) : SERVICES;

export const getTerms = (lang) =>
  lang === "en"
    ? { meta: EN_TERMS_META, sections: EN_TERMS }
    : { meta: FA_TERMS_META, sections: FA_TERMS };

const CATS = {
  fa: BLOG_CATEGORIES,
  en: BLOG_CATEGORIES.map((c) => ({ ...c, ...(EN_BLOG_CATEGORIES[c.slug] ?? {}) })),
};
export const getBlogCategories = (lang) => (lang === "en" ? CATS.en : CATS.fa);
