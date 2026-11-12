import { useFieldArray, useFormContext } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { INTERNAL_LINK_RE } from "./postForm";

// لینک‌های داخلی (زیر مقاله نمایش داده می‌شوند). فقط مسیر شروع‌شونده با /
export default function LinksEditor() {
  const { control, register, formState } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "links" });
  const itemErrors = formState.errors.links;

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="dashboard-label">لینک‌های داخلی</span>
        <button type="button" className="secondary-button" onClick={() => append({ value: "" })}>
          <FiPlus size={16} aria-hidden="true" />
          لینک جدید
        </button>
      </div>

      {fields.length === 0 && (
        <p className="dashboard-hint">
          مسیر صفحه‌های مرتبط سایت را اضافه کنید؛ مثلاً /services/seo یا /blog/website-design-cost
        </p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="grid gap-1">
          <div className="flex items-center gap-2">
            <input
              dir="ltr"
              aria-label={`لینک داخلی ${(index + 1).toLocaleString("fa-IR")}`}
              placeholder="/services/seo"
              className="dashboard-input text-left"
              {...register(`links.${index}.value`, {
                validate: (value) =>
                  !value.trim() ||
                  INTERNAL_LINK_RE.test(value.trim()) ||
                  "فقط مسیر داخلی، با / شروع شود و فاصله نداشته باشد.",
              })}
            />
            <button
              type="button"
              className="dashboard-icon-button dashboard-icon-button--bad"
              aria-label="حذف لینک"
              title="حذف"
              onClick={() => remove(index)}
            >
              <FiTrash2 size={16} aria-hidden="true" />
            </button>
          </div>
          {itemErrors?.[index]?.value && (
            <p className="dashboard-error" role="alert">
              {itemErrors[index].value.message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
