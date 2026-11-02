import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { HeaderBadges } from "@/components/layout/header-badges";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/80 bg-white/95">
      <div className="container-page flex h-16 items-center gap-3 lg:h-[4.5rem]">
        <Link href="/" className="mr-auto rounded-xl lg:mr-4" aria-label="Bếp Khỏe – Trang chủ">
          <Logo />
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <NavLinks />
        </nav>

        {/* Form GET – vẫn hoạt động khi JavaScript chưa tải */}
        <form action="/cong-thuc/" method="get" role="search" className="relative ml-auto hidden md:block">
          <label htmlFor="header-search" className="sr-only">
            Tìm công thức
          </label>
          <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-[1.1rem] -translate-y-1/2 text-muted" />
          <input
            id="header-search"
            name="q"
            type="search"
            placeholder="Tìm công thức…"
            className="field w-52 rounded-full bg-surface pl-10 xl:w-64"
          />
        </form>

        <HeaderBadges />
        <MobileNav />
      </div>
    </header>
  );
}
