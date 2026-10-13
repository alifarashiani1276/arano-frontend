import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// بعد از هر تغییر مسیر: اگر هش دارد (مثل /#contact) به همان بخش می‌رود،
// وگرنه بالای صفحه. (React Router خودش اسکرول را بازنشانی نمی‌کند.)
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView();
        else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return undefined;
  }, [pathname, hash]);

  return null;
}
