import { describe, expect, it } from "vitest";
import { addShoppingItems, formatQuantity, formatQuantityText, scaleAmount, shoppingListToText } from "@/lib/quantity";

const ids = () => {
  let n = 0;
  return () => `id-${++n}`;
};

describe("scaleAmount", () => {
  it("quy đổi theo tỷ lệ khẩu phần", () => {
    expect(scaleAmount(300, 4, 2)).toBe(150);
    expect(scaleAmount(2, 4, 6)).toBe(3);
  });
  it("giữ nguyên 'vừa đủ' (null)", () => {
    expect(scaleAmount(null, 4, 8)).toBeNull();
  });
});

describe("formatQuantity", () => {
  it("làm tròn gam/ml hợp lý và đổi sang kg/l", () => {
    expect(formatQuantity(333.3, "g")).toEqual({ amount: "335", unit: "g" });
    expect(formatQuantity(1500, "g")).toEqual({ amount: "1,5", unit: "kg" });
    expect(formatQuantity(0.75, "l")).toEqual({ amount: "750", unit: "ml" });
    expect(formatQuantity(12.4, "ml")).toEqual({ amount: "12", unit: "ml" });
  });
  it("muỗng hiển thị phân số 1/4", () => {
    expect(formatQuantity(0.5, "muỗng canh").amount).toBe("1/2");
    expect(formatQuantity(1.5, "muỗng cà phê").amount).toBe("1 1/2");
    expect(formatQuantity(0.1, "muỗng canh").amount).toBe("1/4");
  });
  it("đơn vị đếm làm tròn tới 1/2", () => {
    expect(formatQuantity(1.4, "quả").amount).toBe("1 1/2");
    expect(formatQuantity(3, "tép").amount).toBe("3");
  });
  it("null hiển thị 'vừa đủ'", () => {
    expect(formatQuantityText(null, "g")).toBe("vừa đủ");
  });
});

describe("addShoppingItems", () => {
  it("gộp nguyên liệu trùng tên, quy đổi kg -> g", () => {
    const list = addShoppingItems(
      [],
      [
        { name: "Thịt heo nạc", amount: 300, unit: "g", source: "A" },
        { name: "thịt heo nạc", amount: 0.5, unit: "kg", source: "B" },
      ],
      ids(),
    );
    expect(list).toHaveLength(1);
    expect(list[0].amount).toBe(800);
    expect(list[0].unit).toBe("g");
    expect(list[0].sources).toEqual(["A", "B"]);
  });
  it("không gộp khi đơn vị không quy đổi được", () => {
    const list = addShoppingItems(
      [],
      [
        { name: "Trứng gà", amount: 2, unit: "quả" },
        { name: "Trứng gà", amount: 100, unit: "g" },
      ],
      ids(),
    );
    expect(list).toHaveLength(2);
  });
  it("gộp cùng đơn vị đếm và bỏ đánh dấu đã mua", () => {
    const first = addShoppingItems([], [{ name: "Cà chua", amount: 2, unit: "quả" }], ids());
    const bought = first.map((i) => ({ ...i, checked: true }));
    const next = addShoppingItems(bought, [{ name: "Cà chua", amount: 1, unit: "quả" }], ids());
    expect(next[0].amount).toBe(3);
    expect(next[0].checked).toBe(false);
  });
  it("'vừa đủ' không làm mất số lượng đã có", () => {
    const list = addShoppingItems(
      [],
      [
        { name: "Nước mắm", amount: 2, unit: "muỗng canh" },
        { name: "Nước mắm", amount: null, unit: "muỗng canh" },
      ],
      ids(),
    );
    expect(list[0].amount).toBe(2);
  });
  it("bỏ qua tên rỗng và tạo văn bản chia sẻ", () => {
    const list = addShoppingItems([], [{ name: "  ", amount: 1, unit: "g" }, { name: "Gừng", amount: 1, unit: "củ" }], ids());
    expect(list).toHaveLength(1);
    expect(shoppingListToText(list)).toContain("☐ Gừng – 1 củ");
  });
});
