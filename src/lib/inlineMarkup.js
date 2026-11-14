// تجزیه‌ی متن ساده‌ی مقاله‌ها که فقط دو سینتکس دارد:
//   **پررنگ**   و   [متن لینک](/مسیر یا https://...)
// همان فرمتی که ویرایشگر پنل (blogBlocks.js) و بک‌اند (BlockRenderer) استفاده می‌کنند.
// این فایل عمداً بدون React است تا با node:test تست شود.

// برای هر فراخوانی یک RegExp تازه ساخته می‌شود، چون parseInline بازگشتی است و lastIndex مشترک حلقه را خراب می‌کند.
const TOKEN_SOURCE = String.raw`\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)`;

// متن → درخت: { type: "text" | "bold" | "link", ... }
export function parseInline(text) {
  const source = String(text ?? "");
  const out = [];
  let last = 0;
  const tokenRe = new RegExp(TOKEN_SOURCE, "g");
  let m;
  while ((m = tokenRe.exec(source))) {
    if (m.index > last) out.push({ type: "text", text: source.slice(last, m.index) });
    if (m[1] !== undefined) {
      out.push({ type: "bold", children: parseInline(m[1]) });
    } else {
      out.push({ type: "link", href: m[3], children: parseInline(m[2]) });
    }
    last = m.index + m[0].length;
  }
  if (last < source.length) out.push({ type: "text", text: source.slice(last) });
  return out;
}

// فقط متن (برای فهرست مطالب و جاهایی که نشانه‌گذاری نباید دیده شود)
export function stripInline(text) {
  const flat = (nodes) =>
    nodes.map((n) => (n.type === "text" ? n.text : flat(n.children))).join("");
  return flat(parseInline(text));
}

// نوع لینک: داخلی (با Link روتر)، بیرونی (a با target=_blank) یا نامعتبر (فقط متن)
// siteUrl: آدرس اصلی سایت؛ لینک مطلق به همین دامنه داخلی حساب می‌شود.
export function classifyHref(href, siteUrl) {
  const value = String(href ?? "").trim();

  if (value.startsWith("/") && !value.startsWith("//")) {
    return { kind: "internal", to: value };
  }

  if (/^https:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      const site = new URL(siteUrl);
      const strip = (host) => host.replace(/^www\./, "");
      if (strip(url.host) === strip(site.host)) {
        // پیشوند زبان را Link خودش اضافه می‌کند؛ پس اینجا برداشته می‌شود.
        const path = url.pathname.replace(/^\/en(?=\/|$)/, "") || "/";
        return { kind: "internal", to: `${path}${url.search}${url.hash}` };
      }
      return { kind: "external", href: value };
    } catch {
      return { kind: "none" };
    }
  }

  return { kind: "none" };
}
