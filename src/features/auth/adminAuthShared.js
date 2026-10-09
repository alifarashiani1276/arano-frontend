// ثابت‌های مشترک بین صفحه‌ی ورود مدیر و صفحه‌ی بازیابی رمز مدیر.

// قواعد رمز عبور (مطابق قواعد AdminAuthController در بک‌اند)
export const PASSWORD_RULES = [
  { id: "len", label: "حداقل ۸ کاراکتر", test: (v) => v.length >= 8 },
  { id: "upper", label: "یک حرف بزرگ انگلیسی", test: (v) => /[A-Z]/.test(v) },
  { id: "lower", label: "یک حرف کوچک انگلیسی", test: (v) => /[a-z]/.test(v) },
  { id: "digit", label: "یک عدد انگلیسی", test: (v) => /[0-9]/.test(v) },
  {
    id: "symbol",
    label: "یک نماد (مثل ! @ #)",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

export const INPUT =
  "h-14 w-full min-w-0 bg-transparent text-sm font-bold outline-none placeholder:text-muted/60";

export const OTP_BOX =
  "h-12 min-w-0 flex-1 rounded-xl border border-border bg-surface-2 text-center text-lg font-black text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 sm:h-14 sm:rounded-2xl sm:text-xl";
