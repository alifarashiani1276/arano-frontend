import { useMemo } from "react";
import { useLang } from "./LangContext";
import {
  getBlogCategories,
  getServiceGroups,
  getServicePages,
  getSite,
  getTeam,
  getTerms,
  getWebDesignPillar,
} from "./text";

// Language-aware data hooks. Persian sources: src/data/*, src/config/site.js. English: src/i18n/en/*.
export const useSite = () => getSite(useLang().lang);
export const useServicePages = () => getServicePages(useLang().lang);
export const useServiceGroups = () => getServiceGroups(useLang().lang);
export const useWebDesignPillar = () => getWebDesignPillar(useLang().lang);
export const useTeam = () => getTeam(useLang().lang);
export const useTerms = () => getTerms(useLang().lang);
export const useBlogCategories = () => {
  const { lang } = useLang();
  return useMemo(() => getBlogCategories(lang), [lang]);
};
