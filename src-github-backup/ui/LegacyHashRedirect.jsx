import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// لینک‌های قدیمی مثل /#team و /#contact (در بوکمارک‌ها، پیام‌ها یا سایت‌های دیگر)
// به صفحه‌ی واقعی همان بخش هدایت می‌شوند. (هش هیچ‌وقت به سرور نمی‌رسد؛ پس باید سمت مرورگر باشد.)
const MAP = {
  "#team": "/team",
  "#contact": "/contact",
  "#about": "/about",
  "#services": "/services",
  "#portfolio": "/portfolio",
};

export default function LegacyHashRedirect() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === "/" && MAP[hash]) navigate(MAP[hash], { replace: true });
  }, [pathname, hash, navigate]);

  return null;
}
