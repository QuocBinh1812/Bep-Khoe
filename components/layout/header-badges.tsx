"use client";

import Link from "next/link";
import { Heart, ShoppingBasket } from "lucide-react";
import { useFavorites, useHydrated, useShoppingList } from "@/lib/storage";

function Count({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent-400 px-1 text-[0.7rem] font-bold leading-5 text-ink">
      {n > 99 ? "99+" : n}
    </span>
  );
}

/** Lối tắt Yêu thích & Danh sách đi chợ kèm số lượng (đọc từ LocalStorage). */
export function HeaderBadges() {
  const hydrated = useHydrated();
  const { favorites } = useFavorites();
  const [list] = useShoppingList();
  const fav = hydrated ? favorites.length : 0;
  const toBuy = hydrated ? list.filter((i) => !i.checked).length : 0;

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/yeu-thich/"
        className="relative grid size-11 place-items-center rounded-full text-ink-soft hover:bg-brand-50 hover:text-accent-500"
        aria-label={`Công thức yêu thích${fav ? ` (${fav})` : ""}`}
        title="Công thức yêu thích"
      >
        <Heart aria-hidden className="size-[1.35rem]" />
        <Count n={fav} />
      </Link>
      <Link
        href="/cong-cu/danh-sach-di-cho/"
        className="relative grid size-11 place-items-center rounded-full text-ink-soft hover:bg-brand-50 hover:text-brand-700"
        aria-label={`Danh sách đi chợ${toBuy ? ` (${toBuy} món cần mua)` : ""}`}
        title="Danh sách đi chợ"
      >
        <ShoppingBasket aria-hidden className="size-[1.35rem]" />
        <Count n={toBuy} />
      </Link>
    </div>
  );
}
