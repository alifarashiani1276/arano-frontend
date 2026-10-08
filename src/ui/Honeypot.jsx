// فیلد تله برای ربات‌ها. با sr-only مخفی می‌شود (نه display:none تا ربات‌ها
// آن را «قابل‌دیدن» فرض کنند) و برای صفحه‌خوان و کیبورد هم نادیده گرفته می‌شود.
export default function Honeypot() {
  return (
    <div aria-hidden="true" className="sr-only">
      <label>
        لطفاً این فیلد را خالی بگذارید
        <input
          type="text"
          name="ref_code"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}

