"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, Menu, Search, ShoppingBasket, X } from "lucide-react";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/text";

/** Menu trên điện thoại: mở dạng panel toàn màn hình, đóng bằng Esc / chọn link / nút đóng. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Đóng menu khi chuyển trang (cập nhật state trong lúc render theo khuyến nghị của React).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="grid size-11 place-items-center rounded-full text-ink hover:bg-brand-50"
      >
        <Menu aria-hidden className="size-6" />
        <span className="sr-only">Mở menu</span>
      </button>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        hidden={!open}
        className="fixed inset-0 z-50 overflow-y-auto bg-white"
      >
        <div className="container-page flex h-16 items-center justify-between border-b border-line">
          <span className="font-display text-xl font-bold text-brand-700">Bếp Khỏe</span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-11 place-items-center rounded-full hover:bg-brand-50"
          >
            <X aria-hidden className="size-6" />
            <span className="sr-only">Đóng menu</span>
          </button>
        </div>
        <div className="container-page py-5">
          <form action="/cong-thuc/" method="get" role="search" className="relative">
            <label htmlFor="mobile-search" className="sr-only">
              Tìm công thức
            </label>
            <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
            <input
              id="mobile-search"
              name="q"
              type="search"
              placeholder="Tìm món: canh chua, trứng, đậu phụ…"
              className="field pl-11"
            />
          </form>
          <nav aria-label="Điều hướng chính" className="mt-6">
            <ul className="divide-y divide-line">
              {[{ href: "/", label: "Trang chủ", description: "Gợi ý món ngon hôm nay" }, ...mainNav].map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 flex-col justify-center py-3 text-lg font-semibold",
                        active ? "text-brand-700" : "text-ink hover:text-brand-700",
                      )}
                    >
                      {item.label}
                      {item.description && <span className="text-sm font-normal text-muted">{item.description}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href="/yeu-thich/"
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cream-100 font-semibold text-ink hover:bg-cream-200"
            >
              <Heart aria-hidden className="size-5 text-accent-500" /> Yêu thích
            </Link>
            <Link
              href="/cong-cu/danh-sach-di-cho/"
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-50 font-semibold text-ink hover:bg-brand-100"
            >
              <ShoppingBasket aria-hidden className="size-5 text-brand-600" /> Đi chợ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
