import { describe, expect, it } from "vitest";
import { getContent } from "@/lib/content/loader";

describe("Nội dung trong /content", () => {
  it("validate schema và liên kết chéo (food, author, recipe slug)", () => {
    const c = getContent();
    expect(c.foods.length).toBeGreaterThanOrEqual(30);
    expect(new Set(c.foods.map((f) => f.id)).size).toBe(c.foods.length);
  });

  it("mỗi công thức có ít nhất 1 nguyên liệu liên kết bảng thực phẩm", () => {
    for (const r of getContent().recipes) {
      expect(r.ingredients.some((i) => i.food), r.slug).toBe(true);
    }
  });
});
