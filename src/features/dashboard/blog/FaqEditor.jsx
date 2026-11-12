import { useFieldArray, useFormContext } from "react-hook-form";
import { FiArrowDown, FiArrowUp, FiPlus, FiTrash2 } from "react-icons/fi";
import { getIn } from "./postForm";

// ویرایشگر FAQ تکرارشونده. name: "faq" (فارسی) یا "en.faq" (انگلیسی)
// هر آیتمِ نیمه‌پر خطا می‌دهد؛ آیتم کاملاً خالی هنگام ذخیره حذف می‌شود.
export default function FaqEditor({ name = "faq", dir }) {
  const { control, register, formState } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({ control, name });
  const itemErrors = getIn(formState.errors, name);

  // سؤال و جواب باید با هم پر شوند
  const rule = (index, self, other, message) => ({
    validate: (value, values) => {
      const row = getIn(values, `${name}.${index}`);
      return !String(row?.[self] ?? "").trim() && String(row?.[other] ?? "").trim() ? message : true;
    },
  });

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="dashboard-label">سؤالات متداول (FAQ)</span>
        <button type="button" className="secondary-button" onClick={() => append({ q: "", a: "" })}>
          <FiPlus size={16} aria-hidden="true" />
          سؤال جدید
        </button>
      </div>

      {fields.length === 0 && (
        <p className="dashboard-hint">
          سؤالی ثبت نشده است. اگر بخش FAQ دارید، در صفحه‌ی مقاله و Schema (FAQPage) هم نمایش داده می‌شود.
        </p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="blog-repeat-item" dir={dir}>
          <div className="dashboard-field">
            <label htmlFor={`${name}-${index}-q`} className="dashboard-label">
              سؤال {(index + 1).toLocaleString("fa-IR")}
            </label>
            <input
              id={`${name}-${index}-q`}
              className="dashboard-input"
              {...register(`${name}.${index}.q`, rule(index, "q", "a", "سؤال را وارد کنید."))}
            />
            {itemErrors?.[index]?.q && (
              <p className="dashboard-error" role="alert">
                {itemErrors[index].q.message}
              </p>
            )}
          </div>
          <div className="dashboard-field">
            <label htmlFor={`${name}-${index}-a`} className="dashboard-label">
              پاسخ
            </label>
            <textarea
              id={`${name}-${index}-a`}
              rows={3}
              className="dashboard-input"
              {...register(`${name}.${index}.a`, rule(index, "a", "q", "پاسخ را وارد کنید."))}
            />
            {itemErrors?.[index]?.a && (
              <p className="dashboard-error" role="alert">
                {itemErrors[index].a.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="انتقال به بالا"
              title="انتقال به بالا"
              disabled={index === 0}
              onClick={() => move(index, index - 1)}
            >
              <FiArrowUp size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="انتقال به پایین"
              title="انتقال به پایین"
              disabled={index === fields.length - 1}
              onClick={() => move(index, index + 1)}
            >
              <FiArrowDown size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="dashboard-icon-button dashboard-icon-button--bad"
              aria-label="حذف سؤال"
              title="حذف"
              onClick={() => remove(index)}
            >
              <FiTrash2 size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
