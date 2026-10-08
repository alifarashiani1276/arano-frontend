import { STATUS_META } from "../../data/dashboard";

// kind: project | account | active | conversation | role
export default function StatusBadge({ kind, value }) {
  const meta = STATUS_META[kind]?.[String(value)] ?? {
    label: String(value),
    tone: "neutral",
  };
  return (
    <span className={`dashboard-badge dashboard-badge--${meta.tone}`}>
      {meta.label}
    </span>
  );
}
