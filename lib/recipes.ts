/** Truy vấn công thức (server). Tương đương lớp repository – thay bằng SQL khi có database. */
import { getContent } from "@/lib/content/loader";
import { computeRecipeNutrition } from "@/lib/nutrition";
import type { ShoppingItemInput } from "@/lib/quantity";
import { scaleAmount } from "@/lib/quantity";
import { normalizeVi } from "@/lib/text";
import { NEW_RECIPE_DAYS } from "@/lib/recipe-constants";
import type { RecipeCategorySlug } from "@/data/taxonomy";
import type { Food, Recipe, RecipeSummary } from "@/types/content";

const byNewest = (a: { publishedAt: string }, b: { publishedAt: string }) =>
  b.publishedAt.localeCompare(a.publishedAt);

export function getAllRecipes(): Recipe[] {
  return [...getContent().recipes].sort(byNewest);
}

export function getRecipe(slug: string): Recipe | undefined {
  return getContent().recipes.find((r) => r.slug === slug);
}

export function getRecipesByCategory(category: RecipeCategorySlug): Recipe[] {
  return getAllRecipes().filter((r) => r.categories.includes(category));
}

export function getFeaturedRecipes(limit = 6): Recipe[] {
  const all = getAllRecipes();
  const featured = all.filter((r) => r.featured);
  return [...featured, ...all.filter((r) => !r.featured)].slice(0, limit);
}

export function isNewRecipe(r: Pick<Recipe, "publishedAt">, now = Date.now()): boolean {
  const published = Date.parse(`${r.publishedAt}T00:00:00Z`);
  return now - published <= NEW_RECIPE_DAYS * 86_400_000 && published <= now;
}

export function totalMinutes(r: Recipe): number {
  return r.prepMinutes + r.cookMinutes;
}

export function getFoods(): Food[] {
  return getContent().foods;
}

let foodMap: Map<string, Food> | null = null;
export function getFoodMap(): Map<string, Food> {
  if (!foodMap) foodMap = new Map(getFoods().map((f) => [f.id, f]));
  return foodMap;
}

export function getRecipeNutrition(recipe: Recipe) {
  return computeRecipeNutrition(recipe, getFoodMap());
}

export function getAuthor(id: string) {
  return getContent().authors.find((a) => a.id === id);
}

export function toSummary(r: Recipe): RecipeSummary {
  const nutrition = getRecipeNutrition(r);
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    categories: r.categories,
    dishType: r.dishType,
    ingredientTags: r.ingredientTags,
    difficulty: r.difficulty,
    totalMinutes: totalMinutes(r),
    servings: r.servings,
    image: r.image,
    kcalPerServing: nutrition ? nutrition.perServing.kcal : null,
    isNew: isNewRecipe(r),
    publishedAt: r.publishedAt,
    searchText: normalizeVi(
      [r.title, r.description, ...r.keywords, ...r.ingredients.map((i) => i.name)].join(" "),
    ),
  };
}

export function getRecipeSummaries(): RecipeSummary[] {
  return getAllRecipes().map(toSummary);
}

/** Công thức liên quan: ưu tiên cùng nguyên liệu chính, cùng danh mục, cùng loại món. */
export function getRelatedRecipes(recipe: Recipe, limit = 4): Recipe[] {
  return getAllRecipes()
    .filter((r) => r.slug !== recipe.slug)
    .map((r) => {
      let score = 0;
      for (const t of r.ingredientTags) if (recipe.ingredientTags.includes(t)) score += 2;
      for (const c of r.categories) if (recipe.categories.includes(c)) score += 1;
      if (r.dishType === recipe.dishType) score += 1;
      return { r, score };
    })
    .sort((a, b) => b.score - a.score || byNewest(a.r, b.r))
    .slice(0, limit)
    .map((x) => x.r);
}

/** Nguyên liệu của công thức (đã quy đổi theo số khẩu phần) để đưa vào danh sách đi chợ. */
export function recipeShoppingInputs(recipe: Recipe, servings = recipe.servings): ShoppingItemInput[] {
  return recipe.ingredients
    .filter((i) => !i.optional)
    .map((i) => ({
      name: i.name,
      amount: scaleAmount(i.amount, recipe.servings, servings),
      unit: i.amount === null ? "" : i.unit,
      source: recipe.title,
    }));
}

/** Dữ liệu tối giản cho công cụ lập thực đơn (client). */
export type PlannerRecipe = {
  slug: string;
  title: string;
  servings: number;
  dishType: Recipe["dishType"];
  categories: Recipe["categories"];
  totalMinutes: number;
  kcalPerServing: number | null;
  ingredients: { name: string; amount: number | null; unit: string }[];
};

export function getPlannerRecipes(): PlannerRecipe[] {
  return getAllRecipes()
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      servings: r.servings,
      dishType: r.dishType,
      categories: r.categories,
      totalMinutes: totalMinutes(r),
      kcalPerServing: getRecipeNutrition(r)?.perServing.kcal ?? null,
      ingredients: r.ingredients
        .filter((i) => !i.optional)
        .map((i) => ({ name: i.name, amount: i.amount, unit: i.amount === null ? "" : i.unit })),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "vi"));
}
