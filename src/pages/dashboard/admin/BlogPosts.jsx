import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { apiMessage, statusOf } from "../../../lib/api";
import { useSession } from "../../../features/auth/session";
import { BLOG_CATEGORIES } from "../../../data/blog";
import {
  deleteAdminBlogPost,
  getAdminBlogPosts,
  publishAdminBlogPost,
  rebuildAdminBlog,
  unpublishAdminBlogPost,
} from "../../../services/adminBlogService";
import ConfirmModal from "../../../features/dashboard/ConfirmModal";
import DataTable from "../../../features/dashboard/DataTable";
import EmptyState from "../../../features/dashboard/EmptyState";
import FilterTabs from "../../../features/dashboard/FilterTabs";
import PageHeader from "../../../features/dashboard/PageHeader";
import StatusBadge from "../../../features/dashboard/StatusBadge";

const FILTERS = [
  { value: "", label: "همه" },
  { value: "draft", label: "پیش‌نویس" },
  { value: "published", label: "منتشرشده" },
];

const CATEGORY_NAME = Object.fromEntries(
  BLOG_CATEGORIES.map((category) => [category.slug, category.name]),
);

const dateFormat = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" });
const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? dateFormat.format(date) : "—";
};

// خطای ۴۲۲ انتشار: اولین پیام فیلد را نشان بده (مثلاً «کاور الزامی است»)
const publishMessage = (error) => {
  if (statusOf(error) === 422) {
    const first = Object.values(error.response?.data?.errors ?? {})[0];
    const text = Array.isArray(first) ? first[0] : first;
    if (text) return text;
    if (error.response?.data?.message) return error.response.data.message;
  }
  return apiMessage(error, "تغییر وضعیت مقاله انجام نشد.");
};

export default function AdminBlogPosts() {
  const queryClient = useQueryClient();
  const user = useSession();
  const isSuper = user?.role === "SUPER_ADMIN";

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);

  // جست‌وجو با تأخیر کوتاه تا با هر کلید درخواست نرود
  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const query = useQuery({
    queryKey: ["admin-blog-posts", { status, q, page }],
    queryFn: () =>
      getAdminBlogPosts({
        status: status || undefined,
        q: q || undefined,
        page,
      }),
    placeholderData: keepPreviousData,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });

  const toggle = useMutation({
    mutationFn: (post) =>
      post.status === "published"
        ? unpublishAdminBlogPost(post.id)
        : publishAdminBlogPost(post.id),
    onSuccess: (post) => {
      toast.success(
        post?.status === "published"
          ? "مقاله منتشر شد."
          : "انتشار مقاله لغو شد و به پیش‌نویس برگشت.",
      );
      refresh();
    },
    onError: (error) => toast.error(publishMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (post) => deleteAdminBlogPost(post.id),
    onSuccess: () => {
      toast.success("مقاله حذف شد.");
      // اگر آخرین ردیف صفحه‌ی غیر از اول حذف شد، یک صفحه عقب برگرد تا صفحه‌ی خالی نبینی
      if (page > 1 && posts.length === 1) setPage(page - 1);
      refresh();
    },
    onError: (error) => toast.error(apiMessage(error, "حذف مقاله انجام نشد.")),
  });

  const rebuild = useMutation({
    mutationFn: rebuildAdminBlog,
    onSuccess: (body) =>
      toast.success(body?.message ?? "صفحه‌های وبلاگ بازسازی شد."),
    onError: (error) =>
      toast.error(apiMessage(error, "بازسازی صفحه‌های وبلاگ انجام نشد.")),
  });

  const posts = query.data?.posts ?? [];
  const meta = query.data?.meta;
  const lastPage = meta?.last_page ?? 1;

  const columns = [
    {
      key: "title",
      header: "عنوان",
      render: (post) => (
        <>
          <span className="dashboard-cell-main max-w-[22rem]">
            {post.title || "بدون عنوان"}
          </span>
          <span className="dashboard-cell-sub" dir="ltr">
            /blog/{post.slug}
          </span>
        </>
      ),
    },
    {
      key: "category",
      header: "دسته",
      render: (post) => CATEGORY_NAME[post.category] ?? post.category ?? "—",
    },
    {
      key: "status",
      header: "وضعیت",
      render: (post) => <StatusBadge kind="blog" value={post.status} />,
    },
    ...(isSuper
      ? [{ key: "author", header: "نویسنده", render: (post) => post.author || "—" }]
      : []),
    {
      key: "publishedAt",
      header: "تاریخ انتشار",
      render: (post) => formatDate(post.publishedAt),
    },
    {
      key: "updatedAt",
      header: "آخرین ویرایش",
      render: (post) => formatDate(post.updatedAt),
    },
  ];

  const rowActions = (post) => {
    const published = post.status === "published";

    return (
      <>
        <Link
          to={`/admin/blog/${post.id}/edit`}
          className="dashboard-icon-button"
          aria-label="ویرایش مقاله"
          title="ویرایش"
        >
          <FiEdit2 size={16} aria-hidden="true" />
        </Link>
        <button
          type="button"
          className="dashboard-icon-button"
          aria-label={published ? "لغو انتشار" : "انتشار"}
          title={published ? "لغو انتشار" : "انتشار"}
          disabled={toggle.isPending}
          onClick={() => toggle.mutate(post)}
        >
          {published ? (
            <FiEyeOff size={16} aria-hidden="true" />
          ) : (
            <FiEye size={16} aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          className="dashboard-icon-button"
          aria-label="حذف مقاله"
          title="حذف"
          onClick={() => setToDelete(post)}
        >
          <FiTrash2 size={16} aria-hidden="true" />
        </button>
      </>
    );
  };

  let body;
  if (query.isPending) {
    body = <EmptyState title="در حال بارگذاری مقاله‌ها…" />;
  } else if (query.isError) {
    body = (
      <EmptyState
        title="دریافت مقاله‌ها انجام نشد"
        text={apiMessage(query.error)}
      >
        <button
          type="button"
          className="secondary-button"
          onClick={() => query.refetch()}
        >
          تلاش دوباره
        </button>
      </EmptyState>
    );
  } else {
    body = (
      <DataTable
        columns={columns}
        rows={posts}
        actions={rowActions}
        empty={{
          title: q || status ? "مقاله‌ای پیدا نشد" : "هنوز مقاله‌ای ننوشته‌اید",
          text: q || status ? undefined : "با دکمه‌ی «مقاله‌ی جدید» شروع کنید.",
        }}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="مقاله‌ها"
        subtitle={
          isSuper
            ? "همه‌ی مقاله‌های وبلاگ"
            : "مقاله‌هایی که خودتان نوشته‌اید"
        }
      >
        {isSuper && (
          <button
            type="button"
            className="secondary-button"
            disabled={rebuild.isPending}
            onClick={() => rebuild.mutate()}
          >
            <FiRefreshCw size={16} aria-hidden="true" />
            {rebuild.isPending ? "در حال بازسازی…" : "بازسازی صفحه‌های وبلاگ"}
          </button>
        )}
        <Link to="/admin/blog/new" className="primary-button">
          <FiPlus size={16} aria-hidden="true" />
          مقاله‌ی جدید
        </Link>
      </PageHeader>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          options={FILTERS}
          value={status}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />
        <div className="relative w-full sm:w-72">
          <FiSearch
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            className="dashboard-input ps-9"
            placeholder="جست‌وجوی عنوان یا آدرس…"
            aria-label="جست‌وجوی مقاله"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <section className="dashboard-panel">{body}</section>

      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            className="secondary-button"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            قبلی
          </button>
          <span className="dashboard-subtitle">
            صفحه {page.toLocaleString("fa-IR")} از{" "}
            {lastPage.toLocaleString("fa-IR")}
          </span>
          <button
            type="button"
            className="secondary-button"
            disabled={page >= lastPage}
            onClick={() => setPage((current) => current + 1)}
          >
            بعدی
          </button>
        </div>
      )}

      {toDelete && (
        <ConfirmModal
          title="حذف مقاله"
          text={`مقاله‌ی «${toDelete.title || toDelete.slug}» برای همیشه حذف می‌شود${
            toDelete.status === "published"
              ? " و صفحه‌ی آن هم از سایت برداشته می‌شود"
              : ""
          }. ادامه می‌دهید؟`}
          confirmLabel="حذف"
          danger
          onConfirm={() => remove.mutate(toDelete)}
          onClose={() => setToDelete(null)}
        />
      )}
    </>
  );
}
