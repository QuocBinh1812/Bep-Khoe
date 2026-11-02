import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonClass } from "@/components/common/button";

export const metadata = { title: "Không tìm thấy trang", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
      <span className="grid size-16 place-items-center rounded-full bg-brand-50 text-brand-600">
        <SearchX aria-hidden className="size-8" />
      </span>
      <p className="mt-6 font-semibold text-accent-700">Lỗi 404</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">Không tìm thấy trang bạn cần</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        Có thể đường dẫn đã thay đổi hoặc món ăn này chưa có trên Bếp Khỏe. Hãy thử tìm công thức khác nhé.
      </p>
      <form action="/cong-thuc/" method="get" role="search" className="mt-6 flex w-full max-w-md gap-2">
        <label htmlFor="nf-search" className="sr-only">
          Tìm công thức
        </label>
        <input id="nf-search" name="q" type="search" placeholder="Tìm công thức…" className="field" />
        <button type="submit" className={buttonClass("primary")}>
          Tìm
        </button>
      </form>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClass("outline")}>
          Về trang chủ
        </Link>
        <Link href="/thuc-don/" className={buttonClass("ghost")}>
          Xem thực đơn mẫu
        </Link>
      </div>
    </div>
  );
}
