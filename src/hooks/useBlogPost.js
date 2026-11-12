import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "../i18n/LangContext";
import { getBootPost, invalidateBlogBoot } from "../lib/blogBoot";
import { getPost } from "../services/blogService";

// یک مقاله‌ی کامل با slug به زبان صفحه. data === null یعنی مقاله پیدا نشد (یا نسخه‌ی زبان را ندارد).
// اولین رندر از #blog-boot پر می‌شود (بدون لودینگ و چشمک).
export default function useBlogPost(slug) {
  const { lang } = useLang();

  useEffect(() => invalidateBlogBoot, []);

  return useQuery({
    queryKey: ["blog-post", slug, lang],
    queryFn: () => getPost(slug, lang),
    initialData: () => getBootPost(slug, lang),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(slug),
  });
}
