import type { ReactNode } from "react";
import { PageHeader } from "@/components/common/page-header";
import { formatDate } from "@/lib/text";

/** Khung cho các trang thông tin (giới thiệu, chính sách...). */
export function StaticPage({
  title,
  description,
  path,
  updatedAt,
  children,
}: {
  title: string;
  description: string;
  path: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHeader title={title} description={description} crumbs={[{ name: title, path }]} />
      <div className="container-page max-w-3xl py-10">
        <div className="prose-bk">{children}</div>
        <p className="mt-10 border-t border-line pt-4 text-sm text-muted">
          Cập nhật lần cuối: <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
        </p>
      </div>
    </>
  );
}
