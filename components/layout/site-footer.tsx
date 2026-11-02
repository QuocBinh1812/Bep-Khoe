import Link from "next/link";
import { Logo } from "@/components/common/logo";
import { RECIPE_CATEGORIES } from "@/data/taxonomy";
import { site } from "@/lib/site";

const toolLinks = [
  { href: "/cong-cu/tinh-dinh-duong/", label: "Tính dinh dưỡng" },
  { href: "/cong-cu/lap-thuc-don/", label: "Lập thực đơn 7 ngày" },
  { href: "/cong-cu/danh-sach-di-cho/", label: "Danh sách đi chợ" },
  { href: "/cong-cu/quy-doi-khau-phan/", label: "Quy đổi khẩu phần" },
];

const aboutLinks = [
  { href: "/gioi-thieu/", label: "Giới thiệu" },
  { href: "/chinh-sach-bien-tap/", label: "Chính sách biên tập" },
  { href: "/mien-tru-trach-nhiem/", label: "Miễn trừ trách nhiệm" },
  { href: "/chinh-sach-bao-mat/", label: "Chính sách bảo mật" },
];

export function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-line bg-cream-50">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-block rounded-xl">
            <Logo />
            <span className="sr-only"> – Trang chủ</span>
          </Link>
          <p className="mt-4 max-w-sm text-ink-soft">{site.slogan}</p>
          <p className="mt-3 max-w-sm text-sm text-muted">
            Nội dung trên Bếp Khỏe mang tính tham khảo, không thay thế lời khuyên của bác sĩ hoặc chuyên gia dinh dưỡng.
          </p>
        </div>
        <FooterCol title="Công thức" links={RECIPE_CATEGORIES.map((c) => ({ href: `/cong-thuc/danh-muc/${c.slug}/`, label: c.name }))} />
        <FooterCol title="Công cụ miễn phí" links={toolLinks} />
        <FooterCol
          title="Về Bếp Khỏe"
          links={[
            { href: "/bo-suu-tap/", label: "Bộ sưu tập món" },
            { href: "/thuc-don/", label: "Thực đơn mẫu" },
            { href: "/dinh-duong/", label: "Dinh dưỡng" },
            { href: "/suc-khoe/", label: "Sức khỏe" },
            ...aboutLinks,
          ]}
        />
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-sm text-muted sm:flex-row sm:justify-between">
          <p>© 2026 {site.name}. Nội dung thuộc bản quyền Bếp Khỏe.</p>
          <p>Ảnh món ăn từ Wikimedia Commons được ghi nguồn tại từng công thức.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-brand-800">{title}</h2>
      <ul className="mt-3 space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-9 items-center text-ink-soft hover:text-brand-700 hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
