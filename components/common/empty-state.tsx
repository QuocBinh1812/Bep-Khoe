import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/text";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-brand-200 bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <span className="mb-4 grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
        <Icon aria-hidden className="size-7" />
      </span>
      <p className="font-display text-xl font-bold">{title}</p>
      {description && <div className="mt-2 max-w-md text-muted">{description}</div>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
