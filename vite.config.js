import { createHash } from "node:crypto";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// فقط در Build (نه در حالت dev که HMR به اسکریپت inline نیاز دارد):
// یک Content-Security-Policy به index.html اضافه می‌کند تا جلوی اجرای
// اسکریپت‌های ناخواسته (XSS) و ارتباط با دامنه‌های غیرمجاز گرفته شود.
// هش اسکریپت inline (تنظیم Theme) هنگام Build خودکار محاسبه می‌شود.
function cspPlugin(apiOrigin) {
  return {
    name: "arano-csp",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const hashes = [
          ...html.matchAll(
            /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi,
          ),
        ].map((m) => {
          // مرورگر پایان‌خط ویندوزی (CRLF) را قبل از محاسبه‌ی هش به LF تبدیل می‌کند؛
          // پس ما هم باید همین کار را بکنیم وگرنه هش اشتباه می‌شود.
          const code = m[1].replace(/\r\n?/g, "\n");
          return `'sha256-${createHash("sha256").update(code).digest("base64")}'`;
        });

        const csp = [
          "default-src 'self'",
          `script-src 'self' ${hashes.join(" ")}`.trim(),
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          `connect-src 'self' ${apiOrigin}`.trim(),
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; ");

        return html.replace(
          /<meta charset="UTF-8"\s*\/>/i,
          (tag) =>
            `${tag}\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
        );
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  // مبدأ (origin) آدرس API بک‌اند برای مجاز شدن در connect-src
  let apiOrigin = "";
  try {
    apiOrigin = new URL(env.VITE_BASE_URL ?? "").origin;
  } catch {
    apiOrigin = "";
  }

  return {
    plugins: [react(), cspPlugin(apiOrigin)],
    server: {
      port: 3000,
    },
    // در نسخه‌ی تولید console.log و debugger از کد حذف می‌شود
    esbuild: mode === "production" ? { drop: ["console", "debugger"] } : {},
  };
});
