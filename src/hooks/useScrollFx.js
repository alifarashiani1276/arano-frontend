import { useEffect } from "react";

// تنها Listener اسکرول سایت (passive + rAF) و بدون setState:
// - نوار پیشرفت اسکرول:  [data-scroll-progress]
// - مخفی/نمایش Navbar:    [data-nav]
// - Parallax سبک:         [data-parallax="سرعت"]
export default function useScrollFx() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = document.querySelector("[data-nav]");
    const bar = document.querySelector("[data-scroll-progress]");
    const layers = Array.from(document.querySelectorAll("[data-parallax]")).map(
      (el) => ({ el, speed: parseFloat(el.dataset.parallax) || 0 })
    );

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      if (bar) {
        bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }

      if (nav) {
        const delta = y - lastY;
        if (y <= 120 || delta < -8) {
          nav.dataset.hidden = "false";
          lastY = y;
        } else if (delta > 8 && nav.dataset.menu !== "open") {
          nav.dataset.hidden = "true";
          lastY = y;
        }
      }

      if (!reduce && y < window.innerHeight * 1.3) {
        for (const { el, speed } of layers) {
          el.style.transform = `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`;
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}