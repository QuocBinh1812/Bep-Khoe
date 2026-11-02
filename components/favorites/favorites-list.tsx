"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { buttonClass } from "@/components/common/button";
import { EmptyState } from "@/components/common/empty-state";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { useFavorites, useHydrated } from "@/lib/storage";
import type { RecipeSummary } from "@/types/content";

export function FavoritesList({ recipes }: { recipes: RecipeSummary[] }) {
  const hydrated = useHydrated();
  const { favorites, setFavorites } = useFavorites();

  if (!hydrated) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Đang tải">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-[var(--radius-card)] bg-surface" />
        ))}
      </div>
    );
  }

  const bySlug = new Map(recipes.map((r) => [r.slug, r]));
  const items = favorites.flatMap((s) => (bySlug.has(s) ? [bySlug.get(s)!] : []));

  if (!items.length) {
    return (
      <EmptyState
        icon={Heart}
        title="Bạn chưa lưu công thức nào"
        description="Bấm biểu tượng trái tim trên công thức để lưu lại món muốn nấu. Danh sách được lưu trên trình duyệt của bạn."
        action={
          <Link href="/cong-thuc/" className={buttonClass("primary")}>
            Khám phá công thức
          </Link>
        }
      />
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-ink-soft">{items.length} công thức đã lưu</p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Bỏ lưu tất cả công thức yêu thích?")) setFavorites([]);
          }}
          className={buttonClass("ghost", "sm")}
        >
          Bỏ lưu tất cả
        </button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((r) => (
          <RecipeCard key={r.slug} recipe={r} headingLevel="h2" />
        ))}
      </div>
    </>
  );
}
