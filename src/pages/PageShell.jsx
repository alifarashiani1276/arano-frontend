import useScrollFx from "../hooks/useScrollFx";
import Navbar from "../features/home/Navbar";
import Footer from "../features/home/Footer";
import PageCta from "./PageCta";
import BackHome from "../ui/BackHome";
import Seo from "../seo/Seo";

// قالب مشترک صفحه‌های جداشده از Home (خدمات، نمونه‌کارها، درباره ما، تیم، ارتباط، صفحه‌های خدمت):
// همان Navbar و Footer صفحه اصلی + Title/Meta/canonical/Schema از src/seo/registry.js.
// path: آدرس صفحه (کلید در registry). hideCta: برای صفحه‌هایی که خودشان فرم تماس دارند.
// seo: Meta پویا (اختیاری) که روی registry می‌نشیند؛ برای صفحه‌های وبلاگ.
export default function PageShell({ path, seo, children, hideCta = false }) {
  useScrollFx();

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <Seo path={path} meta={seo} />

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
        {!hideCta && <PageCta />}
      </main>

      <Footer />
    </div>
  );
}
