import { describe, expect, it } from "vitest";
import { rankByIngredients } from "@/lib/fridge";
import type { RecipeSummary } from "@/types/content";

const r = (slug: string, tags: string[], totalMinutes = 30) =>
  ({ slug, title: slug, ingredientTags: tags, totalMinutes }) as unknown as RecipeSummary;

const recipes = [
  r("trung-xao-ca-chua", ["trung", "ca-chua"], 20),
  r("thit-kho-trung", ["thit-heo", "trung"], 60),
  r("trung-hap", ["trung"], 25),
  r("canh-chua", ["ca", "ca-chua", "rau-la"], 40),
  r("pho", ["thit-bo", "gao-ngu-coc"], 200),
];

describe("rankByIngredients", () => {
  it("không chọn gì -> không gợi ý", () => {
    expect(rankByIngredients(recipes, [])).toEqual([]);
  });
  it("món dùng đủ nguyên liệu đứng trước, bỏ món không liên quan", () => {
    const res = rankByIngredients(recipes, ["trung", "ca-chua"]);
    expect(res[0].recipe.slug).toBe("trung-xao-ca-chua");
    expect(res[0].complete).toBe(true);
    expect(res.every((m) => m.recipe.slug !== "pho")).toBe(true);
    expect(res.filter((m) => m.complete)).toHaveLength(1);
  });
  it("cùng mức khớp: ưu tiên món cần ít nguyên liệu chính khác", () => {
    const res = rankByIngredients(recipes, ["trung"]);
    expect(res.map((m) => m.recipe.slug)).toEqual(["trung-hap", "trung-xao-ca-chua", "thit-kho-trung"]);
  });
});
