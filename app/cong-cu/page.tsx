import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { buildMetadata } from "@/lib/seo";
import { TOOLS } from "./tools";

export const metadata = buildMetadata({
  title: "Công cụ nấu ăn & dinh dưỡng miễn phí",
  description:
    "Công cụ tính dinh dưỡng món ăn, lập thực đơn 7 ngày, danh sách đi chợ tự gộp nguyên liệu và quy đổi khẩu phần – miễn phí, không cần đăng ký.",
  path: "/cong-cu/",
});

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        title="Công cụ cho căn bếp khỏe"
        description="Miễn phí, không cần tài khoản. Dữ liệu bạn nhập được lưu ngay trên trình duyệt của bạn."
        crumbs={[{ name: "Công cụ", path: "/cong-cu/" }]}
      />
      <div className="container-page py-10">
        <ul className="grid gap-5 md:grid-cols-2">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <article className="card group relative flex h-full gap-4 p-6 reveal transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <t.icon aria-hidden className="size-7 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
                </span>
                <div>
                  <h2 className="text-xl">
                    <Link href={t.href} className="after:absolute after:inset-0 after:content-[''] hover:text-brand-700 focus-visible:outline-none">
                      {t.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-muted">{t.description}</p>
                  <span aria-hidden className="mt-3 inline-flex items-center gap-1 font-semibold text-brand-700">
                    Dùng ngay <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <aside className="mt-10 flex gap-3 rounded-2xl bg-surface p-5 text-ink-soft">
          <LockKeyhole aria-hidden className="mt-0.5 size-6 shrink-0 text-brand-600" />
          <p>
            Bếp Khỏe không thu thập dữ liệu sức khỏe cá nhân. Thực đơn, danh sách đi chợ và bảng tính chỉ lưu trong
            LocalStorage của trình duyệt trên thiết bị bạn đang dùng; xóa dữ liệu trình duyệt sẽ xóa các thông tin này.
          </p>
        </aside>
      </div>
    </>
  );
}
