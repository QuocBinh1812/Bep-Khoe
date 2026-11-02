/**
 * Tính dinh dưỡng bằng công thức xác định: giá_trị = per100g × khối_lượng / 100.
 * Không dùng AI hay ước đoán – kết quả chỉ chính xác trong phạm vi dữ liệu nguồn (data/foods.json).
 */
import type { Food, NutritionTotals, Recipe } from "@/types/content";

export const NUTRIENT_KEYS = ["kcal", "protein", "carbs", "fat", "fiber"] as const;

export const NUTRIENT_LABELS: Record<(typeof NUTRIENT_KEYS)[number], { label: string; unit: string }> = {
  kcal: { label: "Năng lượng", unit: "kcal" },
  protein: { label: "Chất đạm (protein)", unit: "g" },
  carbs: { label: "Carbohydrate (bột đường)", unit: "g" },
  fat: { label: "Chất béo", unit: "g" },
  fiber: { label: "Chất xơ", unit: "g" },
};

export const FOOD_SOURCES: Record<Food["source"], { label: string; url?: string }> = {
  "usda-fdc": { label: "USDA FoodData Central", url: "https://fdc.nal.usda.gov/" },
  "vn-fct-2007": { label: "Bảng thành phần thực phẩm Việt Nam (Viện Dinh dưỡng, 2007)" },
  "uoc-tinh": { label: "Ước tính từ thực phẩm tương đương" },
};

export const FOOD_GROUPS: Record<Food["group"], string> = {
  "ngu-coc": "Ngũ cốc – tinh bột",
  thit: "Thịt",
  "thuy-san": "Cá – thủy sản",
  "trung-sua": "Trứng – sữa",
  "dau-hat": "Đậu – hạt",
  rau: "Rau – nấm",
  "cu-qua": "Củ – quả",
  "trai-cay": "Trái cây",
  "gia-vi": "Gia vị",
  "dau-mo-duong": "Dầu mỡ – đường",
};

export type NutritionLine = { foodId: string; grams: number };

export function emptyTotals(): NutritionTotals {
  return { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: null };
}

/** Tổng dinh dưỡng của danh sách nguyên liệu (khối lượng tính bằng gam phần ăn được). */
export function computeTotals(lines: NutritionLine[], foods: Map<string, Food> | Food[]): NutritionTotals {
  const map = Array.isArray(foods) ? new Map(foods.map((f) => [f.id, f])) : foods;
  const t = emptyTotals();
  for (const line of lines) {
    const food = map.get(line.foodId);
    if (!food || !(line.grams > 0)) continue;
    const k = line.grams / 100;
    t.kcal += food.per100g.kcal * k;
    t.protein += food.per100g.protein * k;
    t.carbs += food.per100g.carbs * k;
    t.fat += food.per100g.fat * k;
    if (food.per100g.fiber !== null) t.fiber = (t.fiber ?? 0) + food.per100g.fiber * k;
  }
  return t;
}

export function divideTotals(t: NutritionTotals, by: number): NutritionTotals {
  const d = by > 0 ? by : 1;
  return {
    kcal: t.kcal / d,
    protein: t.protein / d,
    carbs: t.carbs / d,
    fat: t.fat / d,
    fiber: t.fiber === null ? null : t.fiber / d,
  };
}

/** Làm tròn để hiển thị: kcal số nguyên, gam 1 chữ số thập phân. */
export function roundTotals(t: NutritionTotals): NutritionTotals {
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return {
    kcal: Math.round(t.kcal),
    protein: r1(t.protein),
    carbs: r1(t.carbs),
    fat: r1(t.fat),
    fiber: t.fiber === null ? null : r1(t.fiber),
  };
}

/** Tỷ lệ năng lượng từ đạm / bột đường / chất béo (4 – 4 – 9 kcal/g). */
export function macroEnergySplit(t: NutritionTotals): { protein: number; carbs: number; fat: number } {
  const p = t.protein * 4;
  const c = t.carbs * 4;
  const f = t.fat * 9;
  const sum = p + c + f;
  if (sum <= 0) return { protein: 0, carbs: 0, fat: 0 };
  return {
    protein: Math.round((p / sum) * 100),
    carbs: Math.round((c / sum) * 100),
    fat: Math.round((f / sum) * 100),
  };
}

export type RecipeNutrition = {
  total: NutritionTotals;
  perServing: NutritionTotals;
  /** Số nguyên liệu có dữ liệu / tổng số nguyên liệu */
  linked: number;
  totalIngredients: number;
  unlinkedNames: string[];
};

export function computeRecipeNutrition(recipe: Recipe, foods: Map<string, Food> | Food[]): RecipeNutrition | null {
  const lines: NutritionLine[] = [];
  const unlinked: string[] = [];
  for (const ing of recipe.ingredients) {
    if (ing.food) lines.push({ foodId: ing.food.id, grams: ing.food.grams });
    else unlinked.push(ing.name);
  }
  if (!lines.length) return null;
  const total = computeTotals(lines, foods);
  return {
    total: roundTotals(total),
    perServing: roundTotals(divideTotals(total, recipe.servings)),
    linked: lines.length,
    totalIngredients: recipe.ingredients.length,
    unlinkedNames: unlinked,
  };
}
