import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import { RichText } from "@/components/common/rich-text";
import { headingId } from "@/lib/articles";
import { cn } from "@/lib/text";
import type { ArticleBlock } from "@/types/content";

const CALLOUTS = {
  info: { icon: Info, cls: "border-brand-200 bg-brand-50", iconCls: "text-brand-700", label: "Thông tin" },
  tip: { icon: Lightbulb, cls: "border-accent-200 bg-accent-100/60", iconCls: "text-accent-700", label: "Mẹo" },
  warning: { icon: TriangleAlert, cls: "border-red-200 bg-red-50", iconCls: "text-red-700", label: "Lưu ý" },
} as const;

export function getToc(body: ArticleBlock[]) {
  return body.flatMap((b, i) => (b.type === "h2" ? [{ id: headingId(b.text, i), text: b.text }] : []));
}

/** Hiển thị nội dung bài viết từ dữ liệu có cấu trúc (không dùng HTML thô). */
export function ArticleBody({ body }: { body: ArticleBlock[] }) {
  return (
    <div className="prose-bk">
      {body.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i}>
                <RichText text={b.text} />
              </p>
            );
          case "h2":
            return (
              <h2 key={i} id={headingId(b.text, i)} className="scroll-mt-24">
                {b.text}
              </h2>
            );
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "ul":
          case "ol": {
            const List = b.type;
            return (
              <List key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    <RichText text={it} />
                  </li>
                ))}
              </List>
            );
          }
          case "callout": {
            const c = CALLOUTS[b.variant];
            return (
              <aside key={i} className={cn("flex gap-3 rounded-2xl border p-4 sm:p-5", c.cls)}>
                <c.icon aria-hidden className={cn("mt-1 size-5 shrink-0", c.iconCls)} />
                <div>
                  <p className="font-bold">{b.title ?? c.label}</p>
                  <p className="mt-1">
                    <RichText text={b.text} />
                  </p>
                </div>
              </aside>
            );
          }
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-2xl border border-line">
                <table className="w-full min-w-[32rem] border-collapse text-left text-[0.95rem]">
                  {b.caption && <caption className="bg-surface px-4 py-2.5 text-left text-sm font-semibold text-ink-soft">{b.caption}</caption>}
                  <thead className="bg-brand-50">
                    <tr>
                      {b.headers.map((h) => (
                        <th key={h} scope="col" className="px-4 py-2.5 font-semibold text-brand-900">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r} className="border-t border-line">
                        {row.map((cell, c) => (
                          <td key={c} className="px-4 py-2.5 align-top">
                            <RichText text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
