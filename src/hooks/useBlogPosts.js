import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "../i18n/LangContext";
import { getBootPosts, invalidateBlogBoot } from "../lib/blogBoot";
import { localizePosts } from "../lib/blog";
import { getPosts } from "../services/blogService";

// خلاصه‌ی مقاله‌ها. کش بین دو زبان مشترک است؛ زبان در select اعمال می‌شود
// (در /en فقط مقاله‌های دارای نسخه‌ی انگلیسی).
// اولین رندر از #blog-boot (HTML ثابت لاراول) پر می‌شود، پس لودینگ و چشمک ندارد.
export default function useBlogPosts() {
  const { lang } = useLang();

  useEffect(() => invalidateBlogBoot, []);

  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: getPosts,
    initialData: getBootPosts,
    staleTime: 5 * 60 * 1000,
    select: (posts) => localizePosts(posts, lang),
  });
}
