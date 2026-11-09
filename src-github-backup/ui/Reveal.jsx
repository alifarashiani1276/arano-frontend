import { useEffect, useRef } from "react";

// یک IntersectionObserver مشترک برای همه Revealها؛ بدون state و بدون Re-render.
let observer;
function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.dataset.in = "true";
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  return observer;
}

const DELAYS = ["", "delay-100", "delay-200", "delay-300", "delay-500"];

export default function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = getObserver();
    if (!io) {
      el.dataset.in = "true";
      return undefined;
    }
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`translate-y-6 opacity-0 transition-[opacity,transform] duration-700 ease-out data-[in=true]:translate-y-0 data-[in=true]:opacity-100 ${DELAYS[delay] ?? ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
