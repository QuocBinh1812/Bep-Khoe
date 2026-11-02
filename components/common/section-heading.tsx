import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/text";

export function SectionHeading({
  title,
  description,
  href,
  linkLabel = "Xem tất cả",
  eyebrow,
  id,
  className,
}: {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  eyebrow?: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-accent-700">{eyebrow}</p>
        )}
        <h2 id={id} className="text-[1.6rem] sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-2 text-muted">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-800"
        >
          {linkLabel}
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
