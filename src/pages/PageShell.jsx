import { useEffect } from "react";
import { site } from "../config/site";
import useScrollFx from "../hooks/useScrollFx";
import Navbar from "../features/home/Navbar";
import Footer from "../features/home/Footer";
import PageCta from "./PageCta";
import BackHome from "../ui/BackHome";

// قالب مشترک صفحه‌های جداشده از Home (خدمات، نمونه‌کارها، درباره ما):
// همان Navbar و Footer صفحه اصلی + عنوان تب.
export default function PageShell({ title, children }) {
  useScrollFx();

  useEffect(() => {
    const prev = document.title;
    document.title = `${title} | ${site.name}`;
    return () => {
      document.title = prev;
    };
  }, [title]);

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-primary-foreground"
      >
        پرش به محتوای اصلی
      </a>

      <Navbar />

      <main id="main">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-24 sm:px-6 md:pt-28 md:pb-8">
          <BackHome />
        </div>
        {children}
        <PageCta />
      </main>

      <Footer />
    </div>
  );
}
