import { useEffect } from "react";
import { useLang } from "../i18n/LangContext";

const BRAND = {
  fa: "آرانو | طراحی و توسعه وب‌سایت",
  en: "Arano | Website Design & Development",
};

// عنوان تب مرورگر صفحه‌های ورود: «عنوان صفحه | نام برند» به زبان همان صفحه.
export default function useDocumentTitle(title) {
  const { lang } = useLang();

  useEffect(() => {
    const brand = BRAND[lang] ?? BRAND.fa;
    document.title = title ? `${title} | ${brand}` : brand;
  }, [title, lang]);
}
