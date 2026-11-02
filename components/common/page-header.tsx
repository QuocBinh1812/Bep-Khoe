import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import type { Crumb } from "@/lib/schema";

/** Phần đầu trang danh mục: breadcrumb + H1 + mô tả. */
export function PageHeader({
  title,
  description,
  crumbs,
  children,
}: {
  title: string;
  description?: string;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line bg-gradient-to-b from-cream-50 to-white">
      <div className="container-page py-8 sm:py-12">
        <Breadcrumbs items={crumbs} className="mb-5" />
        <h1 className="text-[2rem] sm:text-[2.6rem]">{title}</h1>
        {description && <p className="mt-3 max-w-3xl text-lg text-ink-soft">{description}</p>}
        {children}
      </div>
    </header>
  );
}
