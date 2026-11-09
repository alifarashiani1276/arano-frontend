import { useCallback, useEffect, useState } from "react";
import { FiSearch, FiStar, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiMessage } from "../../../lib/api";
import {
  deleteAdminComment,
  getAdminComments,
} from "../../../services/dashboardService";
import ConfirmModal from "../../../features/dashboard/ConfirmModal";
import DataTable from "../../../features/dashboard/DataTable";
import PageHeader from "../../../features/dashboard/PageHeader";

const PER_PAGE = 10;

const fa = (value) => Number(value).toLocaleString("fa-IR");

function RatingCell({ value }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-amber-500">
      <FiStar size={15} aria-hidden="true" style={{ fill: "currentColor" }} />
      <span className="text-sm font-bold text-foreground">
        {fa(value)} از ۵
      </span>
    </span>
  );
}

export default function AdminComments() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [toDelete, setToDelete] = useState(null);

  // جستجو با کمی تأخیر تا برای هر حرف درخواست ارسال نشود
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getAdminComments({ page, per_page: PER_PAGE, q: query || undefined })
      .then((result) => {
        if (cancelled) return;
        setItems(result.comments ?? []);
        setMeta(result.meta ?? { current_page: 1, last_page: 1, total: 0 });
      })
      .catch((error) => {
        if (!cancelled) toast.error(apiMessage(error, "دریافت نظرها انجام نشد."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, query, reloadKey]);

  const remove = useCallback(
    async (item) => {
      try {
        await deleteAdminComment(item.id);
        toast.success("نظر حذف شد.");

        // اگر آخرین نظر صفحه حذف شد، به صفحه‌ی قبل برگرد
        if (items.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          setReloadKey((key) => key + 1);
        }
      } catch (error) {
        toast.error(apiMessage(error, "حذف نظر انجام نشد."));
      }
    },
    [items.length, page],
  );

  const columns = [
    {
      key: "user",
      header: "کاربر",
      render: (item) => (
        <>
          <span className="dashboard-cell-main">
            {[item.user?.first_name, item.user?.last_name]
              .filter(Boolean)
              .join(" ") || "—"}
          </span>
          <span className="dashboard-cell-sub" dir="ltr">
            {item.user?.phone ?? ""}
          </span>
        </>
      ),
    },
    {
      key: "rating",
      header: "امتیاز",
      render: (item) => <RatingCell value={item.rating} />,
    },
    {
      key: "body",
      header: "نظر",
      render: (item) => (
        <span className="dashboard-cell-main max-w-[24rem]" title={item.body}>
          {item.body}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "تاریخ",
      render: (item) =>
        item.created_at
          ? new Date(item.created_at).toLocaleString("fa-IR")
          : "—",
    },
  ];

  return (
    <>
      <PageHeader
        title="نظرات کاربران"
        subtitle="نظرهای ثبت‌شده در انتهای صفحه‌ی اصلی سایت؛ نظرهای نامناسب را می‌توانید حذف کنید"
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <FiSearch
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="جستجو در متن نظر، نام یا موبایل…"
            aria-label="جستجو در نظرها"
            className="dashboard-input pr-10"
          />
        </div>
        <span className="dashboard-hint">
          {fa(meta.total ?? 0)} نظر
        </span>
      </div>

      <section className="dashboard-panel" aria-busy={loading}>
        <DataTable
          columns={columns}
          rows={items}
          empty={{
            title: loading ? "در حال بارگذاری…" : "نظری یافت نشد",
          }}
          actions={(item) => (
            <button
              type="button"
              className="dashboard-icon-button dashboard-icon-button--bad"
              aria-label="حذف نظر"
              title="حذف نظر"
              onClick={() => setToDelete(item)}
            >
              <FiTrash2 size={16} aria-hidden="true" />
            </button>
          )}
        />
      </section>

      {meta.last_page > 1 && (
        <nav
          aria-label="صفحه‌بندی نظرها"
          className="mt-4 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            type="button"
            className="secondary-button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            صفحه‌ی قبل
          </button>
          <span className="dashboard-hint">
            صفحه‌ی {fa(meta.current_page)} از {fa(meta.last_page)}
          </span>
          <button
            type="button"
            className="secondary-button"
            disabled={page >= meta.last_page || loading}
            onClick={() => setPage((current) => current + 1)}
          >
            صفحه‌ی بعد
          </button>
        </nav>
      )}

      {toDelete && (
        <ConfirmModal
          danger
          title="حذف نظر"
          text={`نظر ${
            [toDelete.user?.first_name, toDelete.user?.last_name]
              .filter(Boolean)
              .join(" ") || "این کاربر"
          } برای همیشه حذف می‌شود و از سایت پنهان خواهد شد. ادامه می‌دهید؟`}
          confirmLabel="حذف نظر"
          onConfirm={() => remove(toDelete)}
          onClose={() => setToDelete(null)}
        />
      )}
    </>
  );
}
