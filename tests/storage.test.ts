import { describe, expect, it } from "vitest";
import { calcSchema, plannerSchema, shoppingItemSchema, EMPTY_PLANNER } from "@/lib/storage";

describe("Validate dữ liệu LocalStorage (zod/mini)", () => {
  it("chấp nhận dữ liệu hợp lệ", () => {
    expect(plannerSchema.safeParse(EMPTY_PLANNER).success).toBe(true);
    expect(
      shoppingItemSchema.safeParse({ id: "1", name: "Tỏi", amount: null, unit: "", checked: false, sources: [] }).success,
    ).toBe(true);
    expect(calcSchema.safeParse({ servings: 2, lines: [{ id: "a", foodId: "toi", grams: 10 }] }).success).toBe(true);
  });
  it("từ chối dữ liệu hỏng / bị sửa tay", () => {
    expect(plannerSchema.safeParse({ servings: 0, days: [] }).success).toBe(false);
    expect(plannerSchema.safeParse({ servings: 2.5, days: EMPTY_PLANNER.days }).success).toBe(false);
    expect(shoppingItemSchema.safeParse({ id: "1", name: "", amount: -1, unit: "", checked: false, sources: [] }).success).toBe(false);
    expect(calcSchema.safeParse({ servings: 1, lines: [{ id: "a", foodId: "x", grams: 0 }] }).success).toBe(false);
  });
});
