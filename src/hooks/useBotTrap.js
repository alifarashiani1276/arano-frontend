import { useCallback, useRef } from "react";

// تله‌ی ساده‌ی ضد ربات برای فرم‌ها:
//  1) Honeypot: فیلد مخفی که انسان خالی می‌گذارد و ربات پر می‌کند
//  2) Time trap: ارسال کمتر از minMs بعد از اولین تعامل با فرم مشکوک است
// نتیجه‌ی check: "honeypot" | "fast" | null
export default function useBotTrap(minMs = 2000) {
  const startedAt = useRef(Date.now());
  const touched = useRef(false);

  const onFocus = useCallback(() => {
    if (!touched.current) {
      touched.current = true;
      startedAt.current = Date.now();
    }
  }, []);

  const check = useCallback(
    (honeypotValue) => {
      if (honeypotValue) return "honeypot";
      if (Date.now() - startedAt.current < minMs) return "fast";
      return null;
    },
    [minMs],
  );

  return { onFocus, check };
}
