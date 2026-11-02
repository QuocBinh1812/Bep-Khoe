/** Gợi ý món từ nguyên liệu đang có. Logic thuần, dùng được ở client – xem tests/fridge.test.ts. */
import type { RecipeSummary } from "@/types/content";

export type FridgeMatch = {
  recipe: RecipeSummary;
  /** Số nguyên liệu đã chọn có trong món */
  matched: number;
  /** true khi món dùng đủ tất cả nguyên liệu đã chọn */
  complete: boolean;
};

/**
 * Xếp hạng: món dùng nhiều nguyên liệu đã chọn hơn lên trước;
 * cùng mức thì ưu tiên món cần ít nguyên liệu chính khác (dễ nấu với đồ sẵn có), rồi món nhanh hơn.
 */
export function rankByIngredients(recipes: RecipeSummary[], selected: string[]): FridgeMatch[] {
  if (!selected.length) return [];
  return recipes
    .map((recipe) => {
      const matched = selected.filter((t) => (recipe.ingredientTags as readonly string[]).includes(t)).length;
      return { recipe, matched, complete: matched === selected.length };
    })
    .filter((m) => m.matched > 0)
    .sort(
      (a, b) =>
        b.matched - a.matched ||
        a.recipe.ingredientTags.length - a.matched - (b.recipe.ingredientTags.length - b.matched) ||
        a.recipe.totalMinutes - b.recipe.totalMinutes,
    );
}
