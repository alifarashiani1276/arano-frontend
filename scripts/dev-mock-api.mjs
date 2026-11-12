// سرور آزمایشی (فقط برای توسعه): بدون هیچ وابستگی، فقط با Node.
// اجرا:  node scripts/dev-mock-api.mjs            (ادمین کل = سوپرادمین)
//        MOCK_ROLE=ADMIN node scripts/dev-mock-api.mjs   (ادمین عادی)
// داده‌ها فقط در حافظه‌اند و با بستن سرور پاک می‌شوند.
import { createServer } from "node:http";

const PORT = Number(process.env.PORT ?? 8000);
const ROLE = process.env.MOCK_ROLE === "ADMIN" ? "ADMIN" : "SUPER_ADMIN";
const me = {
  id: 1, phone: "09120000000", first_name: "علی", last_name: "فراشیانی",
  email: "ali@example.com", bio: "", role: ROLE, status: "APPROVED",
  is_active: true, profile_completed: true,
};

const now = Date.now();
const day = 86400000;
let nextId = 6;
const posts = [
  ["seo-basics", "راهنمای سئو برای شروع", "seo", "published", 5],
  ["react-vs-next", "React یا Next.js؟", "frontend", "published", 12],
  ["design-system", "ساخت دیزاین سیستم", "ui-ux", "draft", 1],
  ["laravel-sanctum", "احراز هویت با Sanctum", "backend", "published", 20],
  ["landing-page-tips", "نکته‌های صفحه‌ی فرود", "seo", "draft", 2],
].map(([slug, title, category, status, ago], i) => ({
  id: i + 1, slug, title, category, status,
  author: i % 2 ? "رضا نوید" : "علی فراشیانی",
  publishedAt: status === "published" ? new Date(now - ago * day).toISOString() : null,
  updatedAt: new Date(now - (ago - 1 < 0 ? 0 : ago - 1) * day).toISOString(),
  featured: false, readingMinutes: 5, hasEn: false, excerpt: "", tags: [],
}));

const send = (res, code, body) => {
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  });
  res.end(JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString() || "{}")); }
      catch { resolve({}); }
    });
  });

createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname.replace(/^\/api/, "");
  console.log(req.method, req.url);

  if (path.startsWith("/uploads/blog/")) {
    res.writeHead(200, { "Content-Type": "image/svg+xml", "Access-Control-Allow-Origin": "*" });
    return res.end(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1690 900"><rect width="1690" height="900" fill="#cfe8dc"/><text x="845" y="470" font-size="72" text-anchor="middle" fill="#2c5a47">تصویر آزمایشی</text></svg>`);
  }

  if (path === "/admin/me") return send(res, 200, { data: { admin: me } });

  if (path === "/admin/blog/posts" && req.method === "GET") {
    const status = url.searchParams.get("status");
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const page = Number(url.searchParams.get("page") ?? 1);
    const per = 3; // کم گذاشته‌ایم تا صفحه‌بندی دیده شود
    let list = posts.filter((p) => (!status || p.status === status) &&
      (!q || p.title.toLowerCase().includes(q) || p.slug.includes(q)));
    if (ROLE === "ADMIN") list = list.filter((p) => p.author === "علی فراشیانی");
    const last = Math.max(1, Math.ceil(list.length / per));
    return send(res, 200, {
      data: list.slice((page - 1) * per, page * per),
      meta: { current_page: page, last_page: last, total: list.length },
    });
  }

  let m = path.match(/^\/admin\/blog\/posts\/(\d+)(\/(publish|unpublish))?$/);
  if (m) {
    const post = posts.find((p) => p.id === Number(m[1]));
    if (!post) return send(res, 404, { message: "مقاله پیدا نشد." });
    if (m[3] === "publish") {
      post.status = "published"; post.publishedAt ??= new Date().toISOString();
      return send(res, 200, { data: post });
    }
    if (m[3] === "unpublish") { post.status = "draft"; return send(res, 200, { data: post }); }
    if (req.method === "DELETE") {
      posts.splice(posts.indexOf(post), 1);
      return send(res, 200, { message: "حذف شد." });
    }
    if (req.method === "PUT") { Object.assign(post, await readBody(req)); return send(res, 200, { data: post }); }
    return send(res, 200, { data: post });
  }

  if (path === "/admin/blog/posts" && req.method === "POST") {
    const post = { id: nextId++, status: "draft", author: me.first_name, publishedAt: null,
      updatedAt: new Date().toISOString(), ...(await readBody(req)) };
    posts.unshift(post);
    return send(res, 201, { data: post });
  }

  // آپلود آزمایشی: فایل ذخیره نمی‌شود؛ یک تصویر SVG ۱۶۹۰×۹۰۰ به‌جایش برمی‌گردد
  if (path === "/admin/blog/uploads" && req.method === "POST") {
    req.resume();
    await new Promise((r) => req.on("end", r));
    return send(res, 200, {
      data: { url: `http://localhost:${PORT}/uploads/blog/placeholder-${Date.now()}.svg`, width: 1690, height: 900 },
    });
  }

  if (path === "/admin/blog/rebuild" && req.method === "POST") {
    await new Promise((r) => setTimeout(r, 800));
    return send(res, 200, { message: "۴ صفحه ساخته شد (آزمایشی)." });
  }

  send(res, 404, { message: "این مسیر در سرور آزمایشی نیست." });
}).listen(PORT, () => console.log(`Mock API: http://localhost:${PORT}  (نقش: ${ROLE})`));
