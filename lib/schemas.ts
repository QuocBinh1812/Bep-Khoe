/**
 * Zod schema cho toàn bộ nội dung. Đây là "nguồn sự thật" về cấu trúc dữ liệu:
 * - Dùng để validate file JSON trong /content khi build (dữ liệu sai => build lỗi rõ ràng).
 * - Kiểu TypeScript được suy ra từ schema (xem /types/content.ts).
 * - Khi chuyển sang PostgreSQL/Supabase, mỗi schema tương ứng một bảng (xem README).
 */
import { z } from "zod";
import {
  DIFFICULTIES,
  DISH_TYPES,
  HEALTH_CATEGORIES,
  INGREDIENT_TAGS,
  MEAL_PLAN_CATEGORIES,
  NUTRITION_CATEGORIES,
  RECIPE_CATEGORIES,
  SUITABLE_FOR,
} from "@/data/taxonomy";

const slugs = <T extends readonly { slug: string }[]>(list: T) =>
  list.map((x) => x.slug) as unknown as [T[number]["slug"], ...T[number]["slug"][]];

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang");

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày theo định dạng YYYY-MM-DD");

export const imageSchema = z.object({
  /** Đường dẫn trong /public, ví dụ /images/recipes/canh-chua-ca.webp */
  src: z.string().startsWith("/"),
  alt: z.string().min(5),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** true = ảnh món tương tự (không đúng hoàn toàn món này) – không dùng cho Recipe schema */
  similar: z.boolean().optional(),
  credit: z
    .object({
      author: z.string(),
      license: z.string(),
      licenseUrl: z.url().optional(),
      sourceUrl: z.url(),
    })
    .optional(),
});

/* ------------------------------------------------------------------ */
/* Công thức                                                           */
/* ------------------------------------------------------------------ */

export const recipeIngredientSchema = z.object({
  name: z.string().min(1),
  /** null = "vừa đủ" (gia vị nêm nếm theo khẩu vị) */
  amount: z.number().positive().nullable(),
  unit: z.string(),
  note: z.string().optional(),
  /** Nhóm hiển thị, ví dụ "Nước dùng", "Gia vị" */
  group: z.string().optional(),
  optional: z.boolean().optional(),
  /**
   * Liên kết tới bảng thành phần thực phẩm để tính dinh dưỡng.
   * grams = khối lượng phần ăn được (đã bỏ vỏ/xương) ứng với `amount` ở khẩu phần gốc.
   */
  food: z
    .object({
      id: z.string(),
      grams: z.number().positive(),
    })
    .optional(),
});

export const recipeStepSchema = z.object({
  title: z.string().optional(),
  text: z.string().min(10),
  durationMinutes: z.number().int().positive().optional(),
});

export const recipeSchema = z.object({
  slug: slugSchema,
  title: z.string().min(3),
  description: z.string().min(40).max(220),
  intro: z.string().min(40),
  categories: z.array(z.enum(slugs(RECIPE_CATEGORIES))).min(1),
  dishType: z.enum(slugs(DISH_TYPES)),
  ingredientTags: z.array(z.enum(slugs(INGREDIENT_TAGS))).min(1),
  suitableFor: z.array(z.enum(slugs(SUITABLE_FOR))).default([]),
  difficulty: z.enum(slugs(DIFFICULTIES)),
  prepMinutes: z.number().int().nonnegative(),
  cookMinutes: z.number().int().nonnegative(),
  servings: z.number().int().min(1).max(20),
  cuisine: z.string().default("Việt Nam"),
  course: z.string(),
  ingredients: z.array(recipeIngredientSchema).min(2),
  steps: z.array(recipeStepSchema).min(2),
  tips: z.array(z.string()).default([]),
  storage: z.string().min(10),
  keywords: z.array(z.string()).default([]),
  image: imageSchema.optional(),
  featured: z.boolean().default(false),
  author: z.string(),
  publishedAt: isoDateSchema,
  updatedAt: isoDateSchema,
});

/* ------------------------------------------------------------------ */
/* Bài viết (dinh dưỡng / sức khỏe)                                    */
/* ------------------------------------------------------------------ */

export const articleBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string().min(1) }),
  z.object({ type: z.literal("h2"), text: z.string().min(1) }),
  z.object({ type: z.literal("h3"), text: z.string().min(1) }),
  z.object({ type: z.literal("ul"), items: z.array(z.string().min(1)).min(1) }),
  z.object({ type: z.literal("ol"), items: z.array(z.string().min(1)).min(1) }),
  z.object({
    type: z.literal("callout"),
    variant: z.enum(["info", "tip", "warning"]),
    title: z.string().optional(),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("table"),
    caption: z.string().optional(),
    headers: z.array(z.string()).min(2),
    rows: z.array(z.array(z.string())).min(1),
  }),
]);

export const referenceSchema = z.object({
  title: z.string().min(3),
  publisher: z.string().min(2),
  url: z.url().optional(),
  year: z.number().int().optional(),
});

const articleBase = {
  slug: slugSchema,
  title: z.string().min(10),
  description: z.string().min(50).max(220),
  author: z.string(),
  /** Người kiểm duyệt chuyên môn – chỉ điền khi thực sự có. */
  reviewer: z.string().optional(),
  publishedAt: isoDateSchema,
  updatedAt: isoDateSchema,
  keyTakeaways: z.array(z.string()).min(2).max(6),
  body: z.array(articleBlockSchema).min(5),
  references: z.array(referenceSchema).min(1),
  relatedRecipes: z.array(slugSchema).default([]),
  image: imageSchema.optional(),
  featured: z.boolean().default(false),
};

export const nutritionArticleSchema = z.object({
  ...articleBase,
  category: z.enum(slugs(NUTRITION_CATEGORIES)),
});

export const healthArticleSchema = z.object({
  ...articleBase,
  category: z.enum(slugs(HEALTH_CATEGORIES)),
});

/* ------------------------------------------------------------------ */
/* Thực đơn                                                            */
/* ------------------------------------------------------------------ */

export const mealItemSchema = z.union([
  z.object({ recipe: slugSchema }),
  /** Món đơn giản không có công thức riêng: cơm trắng, trái cây, sữa chua... */
  z.object({ name: z.string().min(2) }),
]);

export const mealPlanDaySchema = z.object({
  sang: z.array(mealItemSchema).min(1),
  trua: z.array(mealItemSchema).min(1),
  toi: z.array(mealItemSchema).min(1),
});

export const mealPlanSchema = z.object({
  slug: slugSchema,
  title: z.string().min(10),
  description: z.string().min(50).max(220),
  intro: z.string().min(40),
  category: z.enum(slugs(MEAL_PLAN_CATEGORIES)),
  servings: z.number().int().min(1).max(12),
  days: z.array(mealPlanDaySchema).length(7),
  principles: z.array(z.string()).min(2),
  notes: z.array(z.string()).default([]),
  author: z.string(),
  publishedAt: isoDateSchema,
  updatedAt: isoDateSchema,
  featured: z.boolean().default(false),
});

/* ------------------------------------------------------------------ */
/* Thực phẩm & tác giả                                                  */
/* ------------------------------------------------------------------ */

export const foodSchema = z.object({
  id: slugSchema,
  name: z.string(),
  group: z.enum([
    "ngu-coc",
    "thit",
    "thuy-san",
    "trung-sua",
    "dau-hat",
    "rau",
    "cu-qua",
    "trai-cay",
    "gia-vi",
    "dau-mo-duong",
  ]),
  /** Mô tả trạng thái phần ăn được, ví dụ "sống, bỏ da" */
  state: z.string(),
  /** Giá trị trên 100 g phần ăn được */
  per100g: z.object({
    kcal: z.number().nonnegative(),
    protein: z.number().nonnegative(),
    carbs: z.number().nonnegative(),
    fat: z.number().nonnegative(),
    fiber: z.number().nonnegative().nullable(),
  }),
  source: z.enum(["usda-fdc", "vn-fct-2007", "uoc-tinh"]),
  /** Tên mục tương ứng ở nguồn gốc để đối chiếu */
  sourceRef: z.string(),
  /** Đã được chuyên gia dinh dưỡng đối chiếu hay chưa */
  verified: z.boolean(),
});

export const authorSchema = z.object({
  id: slugSchema,
  name: z.string(),
  type: z.enum(["Organization", "Person"]),
  role: z.string(),
  bio: z.string(),
  credentials: z.string().optional(),
});
