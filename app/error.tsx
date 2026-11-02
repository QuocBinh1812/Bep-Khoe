"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { buttonClass } from "@/components/common/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-red-50 text-red-700">
        <TriangleAlert aria-hidden className="size-8" />
      </span>
      <h1 className="mt-6 text-3xl">Đã có lỗi xảy ra</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        Trang chưa hiển thị được. Bạn thử tải lại; nếu vẫn lỗi, hãy quay lại sau ít phút.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className={buttonClass("primary")}>
          Thử lại
        </button>
        <Link href="/" className={buttonClass("outline")}>
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
