import { useEffect } from "react";

// یک IntersectionObserver مشترک برای همه‌ی المان‌های انیمیشنی (Motion).
// وقتی المان وارد دید شد، data-in="true" می‌گیرد و CSS بقیه‌ی کار را انجام می‌دهد.
let io;
function getIO() {
  if (io || typeof IntersectionObserver === "undefined") return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.dataset.in = "true";
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );
  return io;
}

export default function useInView(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = getIO();
    if (!obs) {
      el.dataset.in = "true";
      return undefined;
    }
    obs.observe(el);
    return () => obs.unobserve(el);
  }, [ref]);
}
