/**
 * Lưu dữ liệu người dùng trong LocalStorage (không cần đăng nhập).
 * - Dữ liệu được kiểm tra cấu trúc khi đọc (lib/validate.ts): dữ liệu hỏng/cũ => quay về giá trị mặc định.
 * - Đồng bộ giữa các tab qua sự kiện "storage".
 * - Không lưu thông tin cá nhân hay sức khỏe nhạy cảm.
 *
 * Khi có tài khoản người dùng (Supabase), có thể thay `createLocalStore` bằng store đồng bộ server
 * mà không cần đổi giao diện vì component chỉ dùng hook `useXxx()`.
 */
import { useCallback, useSyncExternalStore } from "react";
import { v, validator, type Validator } from "@/lib/validate";
import type { ShoppingItem } from "@/lib/quantity";

type Updater<T> = T | ((prev: T) => T);

const KEY_PREFIX = "bepkhoe:";

function createLocalStore<T>(key: string, schema: Validator<T>, fallback: T) {
  const fullKey = `${KEY_PREFIX}${key}`;
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue: T = fallback;

  function read(): T {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(fullKey);
    } catch {
      return cachedValue;
    }
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    if (raw === null) {
      cachedValue = fallback;
      return cachedValue;
    }
    try {
      const parsed = schema.safeParse(JSON.parse(raw));
      cachedValue = parsed.success ? parsed.data : fallback;
    } catch {
      cachedValue = fallback;
    }
    return cachedValue;
  }

  function emit() {
    for (const l of listeners) l();
  }

  function write(next: Updater<T>) {
    const prev = read();
    const value = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
    const raw = JSON.stringify(value);
    cachedRaw = raw;
    cachedValue = value;
    try {
      window.localStorage.setItem(fullKey, raw);
    } catch {
      // Trình duyệt chặn LocalStorage (chế độ riêng tư/hết dung lượng): vẫn giữ trong bộ nhớ phiên.
    }
    emit();
  }

  function subscribe(cb: () => void) {
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => {
      if (e.key === fullKey || e.key === null) cb();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", onStorage);
    };
  }

  const getServerSnapshot = () => fallback;

  function useStore(): [T, (next: Updater<T>) => void] {
    const value = useSyncExternalStore(subscribe, read, getServerSnapshot);
    const set = useCallback((next: Updater<T>) => write(next), []);
    return [value, set];
  }

  return { useStore, read, write, key: fullKey };
}

const noopSubscribe = () => () => {};
/** true sau khi component đã hydrate trên trình duyệt (tránh nháy nội dung LocalStorage). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/* ------------------------------------------------------------------ */
/* Yêu thích                                                           */
/* ------------------------------------------------------------------ */

const favoritesStore = createLocalStore(
  "favorites:v1",
  validator(v.array(v.string({ max: 120 }), { max: 500 })),
  [] as string[],
);

export function useFavorites() {
  const [favorites, setFavorites] = favoritesStore.useStore();
  const toggle = useCallback(
    (slug: string) =>
      setFavorites((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev])),
    [setFavorites],
  );
  return { favorites, toggle, setFavorites };
}

/* ------------------------------------------------------------------ */
/* Danh sách đi chợ                                                    */
/* ------------------------------------------------------------------ */

const isShoppingItem = v.object({
  id: v.string({ max: 100 }),
  name: v.string({ min: 1, max: 120 }),
  amount: v.nullable(v.number({ min: 0 })),
  unit: v.string({ max: 30 }),
  checked: v.boolean(),
  sources: v.array(v.string({ max: 160 }), { max: 50 }),
});
export const shoppingItemSchema = validator(isShoppingItem);

const shoppingStore = createLocalStore(
  "shopping-list:v1",
  validator(v.array(isShoppingItem, { max: 1000 })) as Validator<ShoppingItem[]>,
  [] as ShoppingItem[],
);

export const useShoppingList = shoppingStore.useStore;
export const writeShoppingList = shoppingStore.write;

/* ------------------------------------------------------------------ */
/* Lập thực đơn 7 ngày                                                 */
/* ------------------------------------------------------------------ */

export type PlannerState = {
  servings: number;
  days: { sang: string[]; trua: string[]; toi: string[] }[];
};
const mealSlots = v.array(v.string({ max: 120 }), { max: 8 });
export const plannerSchema: Validator<PlannerState> = validator(
  v.object({
    servings: v.number({ int: true, min: 1, max: 20 }),
    days: v.array(v.object({ sang: mealSlots, trua: mealSlots, toi: mealSlots }), { length: 7 }),
  }),
);

export const EMPTY_PLANNER: PlannerState = {
  servings: 4,
  days: Array.from({ length: 7 }, () => ({ sang: [], trua: [], toi: [] })),
};

const plannerStore = createLocalStore("meal-planner:v1", plannerSchema, EMPTY_PLANNER);
export const useMealPlanner = plannerStore.useStore;
export const writeMealPlanner = plannerStore.write;

/* ------------------------------------------------------------------ */
/* Công cụ tính dinh dưỡng                                             */
/* ------------------------------------------------------------------ */

export type CalcState = { servings: number; lines: { id: string; foodId: string; grams: number }[] };
export const calcSchema: Validator<CalcState> = validator(
  v.object({
    servings: v.number({ int: true, min: 1, max: 50 }),
    lines: v.array(v.object({ id: v.string({ max: 100 }), foodId: v.string({ max: 100 }), grams: v.number({ gt: 0, max: 10000 }) }), {
      max: 100,
    }),
  }),
);

const calcStore = createLocalStore("nutrition-calc:v1", calcSchema, { servings: 1, lines: [] } as CalcState);
export const useNutritionCalc = calcStore.useStore;
