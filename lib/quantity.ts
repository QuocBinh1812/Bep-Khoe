/**
 * Quy đổi khẩu phần, định dạng định lượng và gộp nguyên liệu cho danh sách đi chợ.
 * Logic thuần (không phụ thuộc React) để dễ kiểm thử – xem tests/quantity.test.ts.
 */

/** Đơn vị có thể quy đổi an toàn về đơn vị gốc. */
const CONVERTIBLE: Record<string, { base: "g" | "ml"; factor: number }> = {
  g: { base: "g", factor: 1 },
  gr: { base: "g", factor: 1 },
  gram: { base: "g", factor: 1 },
  kg: { base: "g", factor: 1000 },
  ml: { base: "ml", factor: 1 },
  l: { base: "ml", factor: 1000 },
  lít: { base: "ml", factor: 1000 },
};

const SPOON_UNITS = new Set(["muỗng canh", "muỗng cà phê", "chén"]);
const METRIC_UNITS = new Set(["g", "kg", "ml", "l"]);

export function normalizeUnit(unit: string): string {
  return unit.trim().toLowerCase().replace(/\s+/g, " ");
}

export function scaleAmount(amount: number | null, fromServings: number, toServings: number): number | null {
  if (amount === null) return null;
  if (fromServings <= 0) return amount;
  return (amount * toServings) / fromServings;
}

const FRACTIONS: Array<[number, string]> = [
  [0.25, "1/4"],
  [1 / 3, "1/3"],
  [0.5, "1/2"],
  [2 / 3, "2/3"],
  [0.75, "3/4"],
];

function trimNumber(n: number, digits: number): string {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: digits }).format(n);
}

/** Hiển thị số dạng phân số thân thiện: 1.5 -> "1 1/2", 0.25 -> "1/4". */
function asFraction(value: number): string {
  const whole = Math.floor(value + 1e-9);
  const frac = value - whole;
  if (frac < 0.07) return String(whole);
  if (frac > 0.93) return String(whole + 1);
  let best = FRACTIONS[0];
  for (const f of FRACTIONS) if (Math.abs(f[0] - frac) < Math.abs(best[0] - frac)) best = f;
  return whole ? `${whole} ${best[1]}` : best[1];
}

/**
 * Làm tròn hợp lý theo đơn vị rồi định dạng.
 * Trả về { amount, unit } – có thể đổi g -> kg, ml -> l khi số lớn.
 */
export function formatQuantity(amount: number | null, unit: string): { amount: string; unit: string } {
  if (amount === null) return { amount: "", unit: "vừa đủ" };
  const u = normalizeUnit(unit);

  if (METRIC_UNITS.has(u)) {
    const conv = CONVERTIBLE[u];
    const base = amount * conv.factor;
    if (base >= 1000) {
      return { amount: trimNumber(base / 1000, 2), unit: conv.base === "g" ? "kg" : "l" };
    }
    let rounded: number;
    if (base >= 100) rounded = Math.round(base / 5) * 5;
    else if (base >= 10) rounded = Math.round(base);
    else rounded = Math.round(base * 10) / 10;
    return { amount: trimNumber(rounded, 1), unit: conv.base };
  }

  if (SPOON_UNITS.has(u)) {
    const quarter = Math.max(0.25, Math.round(amount * 4) / 4);
    return { amount: asFraction(quarter), unit };
  }

  // Đơn vị đếm (quả, củ, tép, nhánh...): làm tròn tới 1/2, tối thiểu 1/4.
  const half = amount < 0.5 ? Math.max(0.25, Math.round(amount * 4) / 4) : Math.round(amount * 2) / 2;
  return { amount: asFraction(half), unit };
}

/** Ghi chú trùng với "vừa đủ" thì không cần hiển thị lại. */
export function isToTasteNote(note?: string): boolean {
  return !!note && /^\s*(vừa đủ|tùy khẩu vị|nêm vừa ăn)\s*$/i.test(note);
}

/** Dòng nguyên liệu dạng văn bản: "500 g Cá lóc (làm sạch)" hoặc "Muối – vừa đủ". */
export function ingredientLine(ing: { name: string; amount: number | null; unit: string; note?: string }): string {
  const note = ing.note && !isToTasteNote(ing.note) ? ` (${ing.note})` : "";
  if (ing.amount === null) return `${ing.name}${note} – vừa đủ`;
  return `${formatQuantityText(ing.amount, ing.unit)} ${ing.name}${note}`;
}

export function formatQuantityText(amount: number | null, unit: string): string {
  const q = formatQuantity(amount, unit);
  return [q.amount, q.unit].filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* Danh sách đi chợ                                                    */
/* ------------------------------------------------------------------ */

export type ShoppingItem = {
  id: string;
  name: string;
  amount: number | null;
  unit: string;
  checked: boolean;
  /** Công thức / thực đơn đã đưa nguyên liệu này vào */
  sources: string[];
};

export type ShoppingItemInput = {
  name: string;
  amount: number | null;
  unit: string;
  source?: string;
};

export function normalizeName(name: string): string {
  return name.trim().toLowerCase().normalize("NFC").replace(/\s+/g, " ");
}

/** Khóa gộp: cùng tên và cùng (nhóm) đơn vị quy đổi được. */
export function mergeKey(name: string, unit: string): string {
  const u = normalizeUnit(unit);
  const conv = CONVERTIBLE[u];
  return `${normalizeName(name)}|${conv ? conv.base : u}`;
}

function toBase(amount: number | null, unit: string): { amount: number | null; unit: string } {
  const conv = CONVERTIBLE[normalizeUnit(unit)];
  if (!conv || amount === null) return { amount, unit: conv ? conv.base : unit };
  return { amount: amount * conv.factor, unit: conv.base };
}

let idCounter = 0;
export function createId(): string {
  idCounter += 1;
  return `${Date.now().toString(36)}-${idCounter.toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Thêm nguyên liệu vào danh sách, gộp với mục có cùng tên và đơn vị quy đổi được.
 * - g/kg gộp về g; ml/l gộp về ml; đơn vị khác chỉ gộp khi giống hệt (ví dụ "quả" + "quả").
 * - Không gộp "quả" với "g" vì không thể quy đổi an toàn.
 * - Mục đã đánh dấu "đã mua" sẽ được bỏ đánh dấu khi có thêm số lượng mới.
 */
export function addShoppingItems(
  list: ShoppingItem[],
  inputs: ShoppingItemInput[],
  makeId: () => string = createId,
): ShoppingItem[] {
  const result = list.map((i) => ({ ...i, sources: [...i.sources] }));
  const index = new Map(result.map((item, i) => [mergeKey(item.name, item.unit), i]));

  for (const input of inputs) {
    const name = input.name.trim();
    if (!name) continue;
    const base = toBase(input.amount, input.unit);
    const key = mergeKey(name, input.unit);
    const existingIdx = index.get(key);
    if (existingIdx !== undefined) {
      const existing = result[existingIdx];
      const exBase = toBase(existing.amount, existing.unit);
      let amount: number | null;
      if (exBase.amount === null) amount = base.amount;
      else if (base.amount === null) amount = exBase.amount;
      else amount = exBase.amount + base.amount;
      result[existingIdx] = {
        ...existing,
        amount,
        unit: base.unit,
        checked: false,
        sources:
          input.source && !existing.sources.includes(input.source)
            ? [...existing.sources, input.source]
            : existing.sources,
      };
    } else {
      result.push({
        id: makeId(),
        name,
        amount: base.amount,
        unit: base.unit,
        checked: false,
        sources: input.source ? [input.source] : [],
      });
      index.set(key, result.length - 1);
    }
  }
  return result;
}

/** Văn bản thuần để sao chép / chia sẻ qua Zalo, Messenger... */
export function shoppingListToText(list: ShoppingItem[], title = "Danh sách đi chợ – Bếp Khỏe"): string {
  const lines = list.map((i) => {
    const q = formatQuantityText(i.amount, i.unit);
    return `${i.checked ? "☑" : "☐"} ${i.name}${q ? ` – ${q}` : ""}`;
  });
  return [title, "", ...lines].join("\n");
}
