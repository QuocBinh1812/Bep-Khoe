import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/common/json-ld";
import { breadcrumbJsonLd, type Crumb } from "@/lib/schema";
import { cn } from "@/lib/text";

/** Breadcrumb hiển thị + BreadcrumbList JSON-LD (khớp nội dung hiển thị). */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ name: "Trang chủ", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Đường dẫn" className={cn("no-print text-sm text-muted", className)}>
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="inline-flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="line-clamp-1 font-medium text-ink-soft">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="rounded hover:text-brand-700 hover:underline">
                      {c.name}
                    </Link>
                    <ChevronRight aria-hidden className="size-3.5 opacity-60" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}
