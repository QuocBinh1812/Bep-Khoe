/** Truy vấn thực đơn mẫu (server). */
import { getContent } from "@/lib/content/loader";
import { getRecipe, recipeShoppingInputs } from "@/lib/recipes";
import type { ShoppingItemInput } from "@/lib/quantity";
import type { MealItem, MealPlan, Recipe } from "@/types/content";

export function getMealPlans(): MealPlan[] {
  return [...getContent().mealPlans].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.publishedAt.localeCompare(a.publishedAt),
  );
}

export function getMealPlan(slug: string): MealPlan | undefined {
  return getContent().mealPlans.find((p) => p.slug === slug);
}

export type ResolvedMealItem = { name: string; recipe?: Recipe };

export function resolveMealItem(item: MealItem): ResolvedMealItem {
  if ("recipe" in item) {
    const recipe = getRecipe(item.recipe);
    return { name: recipe?.title ?? item.recipe, recipe };
  }
  return { name: item.name };
}

/** Các công thức (không trùng lặp, theo số lần xuất hiện) trong thực đơn. */
export function mealPlanRecipeCounts(plan: MealPlan): Map<string, number> {
  const counts = new Map<string, number>();
  for (const day of plan.days) {
    for (const meal of [day.sang, day.trua, day.toi]) {
      for (const item of meal) {
        if ("recipe" in item) counts.set(item.recipe, (counts.get(item.recipe) ?? 0) + 1);
      }
    }
  }
  return counts;
}

/** Toàn bộ nguyên liệu cần mua cho cả tuần (mỗi lần nấu quy đổi theo plan.servings). */
export function mealPlanShoppingInputs(plan: MealPlan): ShoppingItemInput[] {
  const inputs: ShoppingItemInput[] = [];
  for (const [slug, times] of mealPlanRecipeCounts(plan)) {
    const recipe = getRecipe(slug);
    if (!recipe) continue;
    for (let i = 0; i < times; i++) {
      inputs.push(
        ...recipeShoppingInputs(recipe, plan.servings).map((x) => ({ ...x, source: plan.title })),
      );
    }
  }
  return inputs;
}

/** Chuyển thực đơn mẫu sang trạng thái của công cụ lập thực đơn (chỉ giữ món có công thức). */
export function mealPlanToPlannerDays(plan: MealPlan) {
  const pick = (items: MealItem[]) => items.flatMap((i) => ("recipe" in i ? [i.recipe] : []));
  return plan.days.map((d) => ({ sang: pick(d.sang), trua: pick(d.trua), toi: pick(d.toi) }));
}
