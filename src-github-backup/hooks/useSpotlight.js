import { useEffect } from "react";

// نور دنبال‌کننده‌ی موس روی کارت‌ها؛ فقط یک Listener روی والد (نه روی هر کارت)،
// فقط روی دستگاه‌های دارای موس، و با rAF. متغیرهای --mx و --my را ست می‌کند.
export default function useSpotlight(ref, selector) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia("(hover: hover)").matches) return undefined;

    let raf = 0;
    let last = null;

    const apply = () => {
      raf = 0;
      if (!last) return;
      const rect = last.card.getBoundingClientRect();
      last.card.style.setProperty("--mx", `${last.x - rect.left}px`);
      last.card.style.setProperty("--my", `${last.y - rect.top}px`);
    };

    const onMove = (e) => {
      const card = e.target.closest?.(selector);
      if (!card || !root.contains(card)) return;
      last = { card, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      root.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [ref, selector]);
}
