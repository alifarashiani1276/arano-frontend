// options: [{ value, label }] — value خالی یعنی «همه»
export default function FilterTabs({ options, value, onChange }) {
  return (
    <div className="dashboard-tabs" role="group" aria-label="فیلتر">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          className={
            value === o.value ? "dashboard-chip is-on" : "dashboard-chip"
          }
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
