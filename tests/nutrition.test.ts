import { describe, expect, it } from "vitest";
import { computeRecipeNutrition, computeTotals, divideTotals, macroEnergySplit, roundTotals } from "@/lib/nutrition";
import { getContent } from "@/lib/content/loader";
import { recipeJsonLd } from "@/lib/schema";
import type { Food } from "@/types/content";

const foods: Food[] = [
  {
    id: "a",
    name: "A",
    group: "thit",
    state: "",
    per100g: { kcal: 200, protein: 20, carbs: 0, fat: 10, fiber: null },
    source: "usda-fdc",
    sourceRef: "",
    verified: false,
  },
  {
    id: "b",
    name: "B",
    group: "rau",
    state: "",
    per100g: { kcal: 20, protein: 2, carbs: 4, fat: 0, fiber: 2 },
    source: "usda-fdc",
    sourceRef: "",
    verified: false,
  },
];

describe("computeTotals", () => {
  it("tính theo công thức per100g × gam / 100", () => {
    const t = computeTotals(
      [
        { foodId: "a", grams: 150 },
        { foodId: "b", grams: 50 },
      ],
      foods,
    );
    expect(t.kcal).toBeCloseTo(310);
    expect(t.protein).toBeCloseTo(31);
    expect(t.carbs).toBeCloseTo(2);
    expect(t.fat).toBeCloseTo(15);
    expect(t.fiber).toBeCloseTo(1);
  });
  it("chất xơ = null khi không nguyên liệu nào có dữ liệu", () => {
    expect(computeTotals([{ foodId: "a", grams: 100 }], foods).fiber).toBeNull();
  });
  it("bỏ qua nguyên liệu không có trong bảng hoặc khối lượng không hợp lệ", () => {
    const t = computeTotals(
      [
        { foodId: "x", grams: 100 },
        { foodId: "a", grams: -5 },
      ],
      foods,
    );
    expect(t.kcal).toBe(0);
  });
  it("chia khẩu phần và làm tròn", () => {
    const per = roundTotals(divideTotals({ kcal: 301, protein: 10.04, carbs: 3, fat: 1, fiber: null }, 2));
    expect(per).toEqual({ kcal: 151, protein: 5, carbs: 1.5, fat: 0.5, fiber: null });
  });
  it("tỷ lệ năng lượng 4-4-9", () => {
    expect(macroEnergySplit({ kcal: 0, protein: 10, carbs: 10, fat: 0, fiber: null })).toEqual({
      protein: 50,
      carbs: 50,
      fat: 0,
    });
  });
});

describe("Dữ liệu công thức thực tế", () => {
  const { recipes, foods: allFoods } = getContent();
  it("năng lượng mỗi khẩu phần nằm trong khoảng hợp lý (bắt lỗi nhập gam)", () => {
    for (const r of recipes) {
      const n = computeRecipeNutrition(r, allFoods);
      expect(n, r.slug).not.toBeNull();
      expect(n!.perServing.kcal, r.slug).toBeGreaterThan(30);
      expect(n!.perServing.kcal, r.slug).toBeLessThan(900);
    }
  });
  it("Recipe JSON-LD khớp nội dung và không khai báo ảnh món tương tự", () => {
    for (const r of recipes) {
      const ld = recipeJsonLd(r, computeRecipeNutrition(r, allFoods), { name: "Ban biên tập", type: "Organization" });
      expect(ld["@type"]).toBe("Recipe");
      expect((ld.recipeIngredient as string[]).length).toBe(r.ingredients.length);
      expect((ld.recipeInstructions as unknown[]).length).toBe(r.steps.length);
      if (!r.image || r.image.similar) expect(ld.image).toBeUndefined();
      else expect(ld.image).toBeDefined();
    }
  });
});
