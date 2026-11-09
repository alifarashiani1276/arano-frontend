import EmptyState from "./EmptyState";

// columns: [{ key, header, render?(row) }]
// scroll افقی فقط داخل خود جدول است، نه کل صفحه.
export default function DataTable({ columns, rows, actions, empty }) {
  if (!rows.length) {
    return <EmptyState {...(empty ?? { title: "موردی برای نمایش نیست" })} />;
  }

  return (
    <div className="dashboard-table-wrap">
      <table className="dashboard-data-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col">
                {c.header}
              </th>
            ))}
            {actions && <th scope="col">عملیات</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
              ))}
              {actions && (
                <td>
                  <div className="dashboard-row-actions">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
