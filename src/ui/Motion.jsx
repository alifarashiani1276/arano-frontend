import { useRef } from "react";
import useInView from "../hooks/useInView";

// fx: rise | pop | blur-up | deal | side | line | words | none
// delay: میلی‌ثانیه. بقیه‌ی استایل‌ها در src/styles/motion.css است.
export default function Motion({
  as: Tag = "div",
  fx = "rise",
  delay = 0,
  className = "",
  style,
  children,
  ...rest
}) {
  const ref = useRef(null);
  useInView(ref);

  return (
    <Tag
      ref={ref}
      data-fx={fx}
      className={className}
      style={{ "--d": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
