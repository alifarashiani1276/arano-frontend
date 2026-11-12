import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// هشدار خروج با تغییرات ذخیره‌نشده.
// پروژه با <BrowserRouter> کار می‌کند و useBlocker روتر فقط در data router هست؛
// پس: beforeunload برای بستن/رفرش تب + گرفتن کلیک روی لینک‌های داخلی (سایدبار، بازگشت و ...).
// دکمه‌ی Back مرورگر قابل مسدود شدن نیست.
export default function useUnsavedGuard(active) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(null);

  useEffect(() => {
    if (!active) return undefined;

    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const to = `${url.pathname}${url.search}${url.hash}`;
      const here = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (to === here) return;

      event.preventDefault();
      event.stopPropagation();
      setPending(to);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    // capture: قبل از onClick خود Link ها اجرا شود
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [active]);

  const confirm = useCallback(() => {
    if (pending) navigate(pending);
    setPending(null);
  }, [navigate, pending]);

  const cancel = useCallback(() => setPending(null), []);

  return { blocked: pending !== null, confirm, cancel };
}
