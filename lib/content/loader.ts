/**
 * Đọc & validate nội dung JSON trong /content. Chỉ chạy phía server (build time).
 * Khi chuyển sang PostgreSQL/Supabase, chỉ cần thay các hàm trong file này
 * bằng truy vấn database – phần giao diện không cần thay đổi.
 */
import fs from "node:fs";
import path from "node:path";
import type { z } from "zod";
import {
  authorSchema,
  foodSchema,
  healthArticleSchema,
  imageSchema,
  mealPlanSchema,
  nutritionArticleSchema,
  recipeSchema,
} from "@/lib/schemas";
import foodsJson from "@/data/foods.json";
import authorsJson from "@/data/authors.json";
import recipeImagesJson from "@/data/recipe-images.json";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readCollection<S extends z.ZodType>(dir: string, schema: S): z.output<S>[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  const files = fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .sort();
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(full, file), "utf8");
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      throw new Error(`[content] JSON không hợp lệ: content/${dir}/${file}: ${(e as Error).message}`);
    }
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(`[content] Sai cấu trúc content/${dir}/${file}:\n${issues}`);
    }
    const data = parsed.data as { slug?: string };
    const expected = file.replace(/\.json$/, "");
    if (data.slug && data.slug !== expected) {
      throw new Error(`[content] content/${dir}/${file}: slug "${data.slug}" phải trùng tên file "${expected}"`);
    }
    return parsed.data;
  });
}

let cache: ReturnType<typeof loadAll> | null = null;

function loadAll() {
  const foods = foodSchema.array().parse(foodsJson);
  const authors = authorSchema.array().parse(authorsJson);
  const imageMap = new Map(
    Object.entries(recipeImagesJson as Record<string, unknown>).map(([slug, img]) => [
      slug,
      imageSchema.parse(img),
    ]),
  );

  const recipes = readCollection("recipes", recipeSchema).map((r) => ({
    ...r,
    image: r.image ?? imageMap.get(r.slug),
  }));
  const nutrition = readCollection("nutrition", nutritionArticleSchema);
  const health = readCollection("health", healthArticleSchema);
  const mealPlans = readCollection("meal-plans", mealPlanSchema);

  validateReferences({ foods, authors, recipes, nutrition, health, mealPlans });

  return { foods, authors, recipes, nutrition, health, mealPlans };
}

function validateReferences(c: {
  foods: z.output<typeof foodSchema>[];
  authors: z.output<typeof authorSchema>[];
  recipes: z.output<typeof recipeSchema>[];
  nutrition: z.output<typeof nutritionArticleSchema>[];
  health: z.output<typeof healthArticleSchema>[];
  mealPlans: z.output<typeof mealPlanSchema>[];
}) {
  const errors: string[] = [];
  const foodIds = new Set(c.foods.map((f) => f.id));
  const authorIds = new Set(c.authors.map((a) => a.id));
  const recipeSlugs = new Set(c.recipes.map((r) => r.slug));

  for (const r of c.recipes) {
    if (!authorIds.has(r.author)) errors.push(`recipes/${r.slug}: author "${r.author}" không tồn tại`);
    if (r.updatedAt < r.publishedAt) errors.push(`recipes/${r.slug}: updatedAt < publishedAt`);
    for (const ing of r.ingredients) {
      if (ing.food && !foodIds.has(ing.food.id)) {
        errors.push(`recipes/${r.slug}: nguyên liệu "${ing.name}" trỏ tới food "${ing.food.id}" không có trong data/foods.json`);
      }
    }
  }
  for (const a of [...c.nutrition, ...c.health]) {
    if (!authorIds.has(a.author)) errors.push(`article ${a.slug}: author "${a.author}" không tồn tại`);
    if (a.reviewer && !authorIds.has(a.reviewer)) errors.push(`article ${a.slug}: reviewer "${a.reviewer}" không tồn tại`);
    if (a.updatedAt < a.publishedAt) errors.push(`article ${a.slug}: updatedAt < publishedAt`);
    for (const s of a.relatedRecipes) {
      if (!recipeSlugs.has(s)) errors.push(`article ${a.slug}: relatedRecipes "${s}" không tồn tại`);
    }
  }
  const articleSlugs = new Set<string>();
  for (const a of [...c.nutrition, ...c.health]) {
    if (articleSlugs.has(a.slug)) errors.push(`Trùng slug bài viết: ${a.slug}`);
    articleSlugs.add(a.slug);
  }
  for (const p of c.mealPlans) {
    if (!authorIds.has(p.author)) errors.push(`meal-plans/${p.slug}: author "${p.author}" không tồn tại`);
    p.days.forEach((d, i) => {
      for (const meal of [d.sang, d.trua, d.toi]) {
        for (const item of meal) {
          if ("recipe" in item && !recipeSlugs.has(item.recipe)) {
            errors.push(`meal-plans/${p.slug}: ngày ${i + 1} dùng công thức "${item.recipe}" không tồn tại`);
          }
        }
      }
    });
  }
  if (errors.length) {
    throw new Error(`[content] Lỗi liên kết dữ liệu:\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  }
}

export function getContent() {
  if (!cache) cache = loadAll();
  return cache;
}
