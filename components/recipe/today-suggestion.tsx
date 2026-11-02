"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { buttonClass } from "@/components/common/button";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { useHydrated } from "@/lib/storage";
import type { RecipeSummary } from "@/types/content";

type Slot = { label: string; recipes: RecipeSummary[] };

function dayIndex(date: Date): number {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const now = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((now - start) / 86_400_000);
}

/**
 * Gợi ý thay đổi theo ngày (tính trên trình duyệt để trang vẫn dựng tĩnh được).
 * Trước khi hydrate hiển thị gợi ý mặc định để không bị trống.
 */
export function TodaySuggestion({ slots }: { slots: Slot[] }) {
  const hydrated = useHydrated();
  const [offset, setOffset] = useState(0);
  const base = hydrated ? dayIndex(new Date()) : 0;

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {slots.map((slot, i) => {
          if (!slot.recipes.length) return null;
          const r = slot.recipes[(base + offset + i * 7) % slot.recipes.length];
          return (
            <div key={slot.label}>
              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-brand-800">{slot.label}</p>
              <RecipeCard recipe={r} />
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center">
        <button type="button" onClick={() => setOffset((o) => o + 1)} className={buttonClass("outline")}>
          <RefreshCw aria-hidden className="size-5" /> Gợi ý món khác
        </button>
      </div>
    </div>
  );
}
