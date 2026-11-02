import { describe, expect, it } from "vitest";
import { MIN_RECIPES, getCollections } from "@/lib/collections";
import { totalMinutes } from "@/lib/recipes";

describe("Bộ sưu tập", () => {
  const collections = getCollections();

  it("mỗi bộ hiển thị có đủ số món tối thiểu và slug không trùng", () => {
    expect(collections.length).toBeGreaterThanOrEqual(4);
    expect(new Set(collections.map((c) => c.slug)).size).toBe(collections.length);
    for (const c of collections) expect(c.recipes.length, c.slug).toBeGreaterThanOrEqual(MIN_RECIPES);
  });

  it("bộ 30 phút chỉ chứa món ≤ 30 phút", () => {
    const quick = collections.find((c) => c.slug === "com-nha-30-phut");
    expect(quick).toBeDefined();
    for (const r of quick!.recipes) expect(totalMinutes(r)).toBeLessThanOrEqual(30);
  });
});
