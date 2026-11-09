import MediaImage from "../../ui/MediaImage";

// رندر بلوک‌های محتوای مقاله (بدون dangerouslySetInnerHTML؛ هر متن فقط متن ساده است).
export default function ArticleBody({ content }) {
  return (
    <div className="space-y-6 text-base leading-[2.2] md:text-lg">
      {content.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={b.id} className="scroll-mt-28 pt-6 text-2xl font-black leading-[1.6] md:text-3xl">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id} className="scroll-mt-28 pt-3 text-xl font-black leading-[1.6] md:text-2xl">
                {b.text}
              </h3>
            );
          case "ul":
          case "ol": {
            const List = b.type;
            return (
              <List
                key={i}
                className={`space-y-2 ps-6 marker:text-primary ${b.type === "ul" ? "list-disc" : "list-decimal"}`}
              >
                {(b.items ?? []).map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </List>
            );
          }
          case "quote":
            return (
              <blockquote key={i} className="rounded-2xl border-s-4 border-primary bg-surface-2 px-6 py-4">
                <p>{b.text}</p>
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
                className="overflow-x-auto rounded-2xl border border-border bg-surface-2 p-5 text-left text-sm leading-7"
              >
                <code>{b.code}</code>
              </pre>
            );
          default:
            return <p key={i}>{b.text}</p>;
        }
      })}
    </div>
  );
}
