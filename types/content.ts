import type { z } from "zod";
import type {
  articleBlockSchema,
  authorSchema,
  foodSchema,
  healthArticleSchema,
  imageSchema,
  mealItemSchema,
  mealPlanDaySchema,
  mealPlanSchema,
  nutritionArticleSchema,
  recipeIngredientSchema,
  recipeSchema,
  recipeStepSchema,
  referenceSchema,
} from "@/lib/schemas";

export type Recipe = z.infer<typeof recipeSchema>;
export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;
export type RecipeStep = z.infer<typeof recipeStepSchema>;
export type ContentImage = z.infer<typeof imageSchema>;

export type ArticleBlock = z.infer<typeof articleBlockSchema>;
export type Reference = z.infer<typeof referenceSchema>;
export type NutritionArticle = z.infer<typeof nutritionArticleSchema>;
export type HealthArticle = z.infer<typeof healthArticleSchema>;
export type ArticleSection = "dinh-duong" | "suc-khoe";
export type Article = (NutritionArticle | HealthArticle) & { section: ArticleSection };

export type MealItem = z.infer<typeof mealItemSchema>;
export type MealPlanDay = z.infer<typeof mealPlanDaySchema>;
export type MealPlan = z.infer<typeof mealPlanSchema>;

export type Food = z.infer<typeof foodSchema>;
export type Author = z.infer<typeof authorSchema>;

export type NutritionTotals = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  /** null khi không có nguyên liệu nào có dữ liệu chất xơ */
  fiber: number | null;
};

/** Dữ liệu rút gọn của công thức – truyền xuống Client Component (nhẹ hơn bản đầy đủ). */
export type RecipeSummary = {
  slug: string;
  title: string;
  description: string;
  categories: Recipe["categories"];
  dishType: Recipe["dishType"];
  ingredientTags: Recipe["ingredientTags"];
  difficulty: Recipe["difficulty"];
  totalMinutes: number;
  servings: number;
  image?: ContentImage;
  kcalPerServing: number | null;
  /** Đăng trong vòng NEW_RECIPE_DAYS ngày tính đến lúc build */
  isNew: boolean;
  searchText: string;
  publishedAt: string;
};
