import { api } from "../lib/api";

// پاسخ‌ها به شکل { data: ... } هستند (مثل dashboardService).
const data = (response) => response.data.data;

// GET /admin/blog/posts?status=&q=&page=
// خروجی: { posts: [خلاصه‌ها], meta } — meta همان صفحه‌بندی لاراول است (current_page، last_page، total)
export const getAdminBlogPosts = (params) =>
  api.get("/admin/blog/posts", { params }).then((response) => {
    const body = response.data;
    const list = body.data;
    const posts = Array.isArray(list) ? list : (list?.posts ?? []);

    return { posts, meta: body.meta ?? list?.meta ?? null };
  });

// GET /admin/blog/posts/{id}  ->  مقاله‌ی کامل
export const getAdminBlogPost = (id) =>
  api.get(`/admin/blog/posts/${id}`).then((response) => data(response));

// POST /admin/blog/posts  ->  مقاله‌ی ساخته‌شده (خطای ۴۲۲ با errors به‌ازای هر فیلد)
export const createAdminBlogPost = (payload) =>
  api.post("/admin/blog/posts", payload).then((response) => data(response));

// PUT /admin/blog/posts/{id}
export const updateAdminBlogPost = (id, payload) =>
  api
    .put(`/admin/blog/posts/${id}`, payload)
    .then((response) => data(response));

export const deleteAdminBlogPost = (id) =>
  api.delete(`/admin/blog/posts/${id}`).then((response) => response.data);

// POST /admin/blog/posts/{id}/publish  و  /unpublish  ->  مقاله‌ی به‌روز
export const publishAdminBlogPost = (id) =>
  api
    .post(`/admin/blog/posts/${id}/publish`)
    .then((response) => data(response));

export const unpublishAdminBlogPost = (id) =>
  api
    .post(`/admin/blog/posts/${id}/unpublish`)
    .then((response) => data(response));

// POST /admin/blog/uploads (multipart، فیلد image)  ->  { url, width, height }
// Content-Type را دستی نمی‌گذاریم تا مرورگر boundary را خودش بسازد.
export const uploadAdminBlogImage = (file) => {
  const form = new FormData();
  form.append("image", file);

  return api
    .post("/admin/blog/uploads", form, {
      headers: { "Content-Type": undefined },
      timeout: 60000,
    })
    .then((response) => data(response));
};

// POST /admin/blog/rebuild (فقط سوپرادمین)  ->  کل بدنه‌ی پاسخ (message و ...)
export const rebuildAdminBlog = () =>
  api
    .post("/admin/blog/rebuild", null, { timeout: 120000 })
    .then((response) => response.data);
