import { FiCheck } from "react-icons/fi";
import MediaImage from "../../ui/MediaImage";
import InlineText from "./InlineText";

// رندر بلوک‌های محتوای مقاله (بدون dangerouslySetInnerHTML).
// داخل متن‌ها **پررنگ** و [لینک](...) پشتیبانی می‌شود (InlineText).
// بلوک‌ها: p | h2 | h3 | ul | ol | quote | image | code | table | checklist

function Checklist({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item, j) => (
        <li key={j} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-2 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary"
          >
            <FiCheck size={14} />
          </span>
          <span>
            <InlineText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Table({ head = [], rows = [] }) {
  return (
    <div className="max-w-full overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[32rem] border-collapse text-start text-sm leading-8 md:text-base">
        {head.length > 0 && (
          <thead className="bg-surface-2">
            <tr>
              {head.map((cell, i) => (
                <th key={i} scope="col" className="min-w-[7rem] px-4 py-3 text-start font-black">
                  <InlineText text={cell} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-border">
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) => (
                <td key={i} className={`min-w-[7rem] px-4 py-3 ${i === 0 ? "font-bold" : "text-muted"}`}>
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ArticleBody({ content }) {
  return (
    <div className="min-w-0 space-y-6 break-words text-base leading-[2.2] md:text-lg">
      {content.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={b.id} className="scroll-mt-28 pt-6 text-2xl font-black leading-[1.6] md:text-3xl">
                <InlineText text={b.text} />
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id} className="scroll-mt-28 pt-3 text-xl font-black leading-[1.6] md:text-2xl">
                <InlineText text={b.text} />
              </h3>
            );
          case "ul":
          case "ol": {
            const List = b.type;
            return (
              <List
                key={i}
                start={b.type === "ol" && b.start > 1 ? b.start : undefined}
                className={`space-y-2 ps-6 marker:text-primary ${b.type === "ul" ? "list-disc" : "list-decimal"}`}
              >
                {(b.items ?? []).map((item, j) => (
                  <li key={j}>
                    <InlineText text={item} />
                  </li>
                ))}
              </List>
            );
          }
          case "checklist":
            return <Checklist key={i} items={b.items ?? []} />;
          case "table":
            return <Table key={i} head={b.head} rows={b.rows} />;
          case "quote":
            return (
              <blockquote key={i} className="rounded-2xl border-s-4 border-primary bg-surface-2 px-6 py-4">
                <p>
                  <InlineText text={b.text} />
                </p>
                {b.cite && <footer className="mt-2 text-sm text-muted">— {b.cite}</footer>}
              </blockquote>
            );
          case "image":
            return (
              <figure key={i}>
                <MediaImage
                  src={b.src}
                  mobileSrc={b.mobileSrc}
                  alt={b.alt ?? ""}
                  className="aspect-[16/9] rounded-2xl border border-border bg-surface-2"
                />
                {b.caption && (
                  <figcaption className="mt-2 text-center text-sm text-muted">{b.caption}</figcaption>
                )}
              </figure>
            );
          case "code":
            return (
              <pre
                key={i}
                dir="ltr"
                tabIndex={0}
                className="max-w-full overflow-x-auto rounded-2xl border border-border bg-surface-2 p-4 text-left text-xs leading-7 md:p-5 md:text-sm"
              >
                <code>{b.code}</code>
              </pre>
            );
          default:
            return (
              <p key={i}>
                <InlineText text={b.text} />
              </p>
            );
        }
      })}
    </div>
  );
}
