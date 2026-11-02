/**
 * Bộ kiểm tra dữ liệu siêu nhẹ cho LocalStorage (chạy trên mọi trang).
 * Không dùng Zod ở đây để tránh đưa ~80 KB JavaScript vào mọi trang;
 * Zod vẫn được dùng cho nội dung (lúc build) và biểu mẫu ở các trang công cụ.
 */
export type Check<T> = (x: unknown) => x is T;
export type Validator<T> = { safeParse: (data: unknown) => { success: true; data: T } | { success: false } };

export const v = {
  string:
    (opts: { min?: number; max?: number } = {}): Check<string> =>
    (x): x is string =>
      typeof x === "string" && x.length >= (opts.min ?? 0) && x.length <= (opts.max ?? Infinity),
  number:
    (opts: { min?: number; max?: number; gt?: number; int?: boolean } = {}): Check<number> =>
    (x): x is number =>
      typeof x === "number" &&
      Number.isFinite(x) &&
      (!opts.int || Number.isInteger(x)) &&
      x >= (opts.min ?? -Infinity) &&
      x <= (opts.max ?? Infinity) &&
      (opts.gt === undefined || x > opts.gt),
  boolean: (): Check<boolean> => (x): x is boolean => typeof x === "boolean",
  nullable:
    <T>(c: Check<T>): Check<T | null> =>
    (x): x is T | null =>
      x === null || c(x),
  array:
    <T>(c: Check<T>, opts: { max?: number; length?: number } = {}): Check<T[]> =>
    (x): x is T[] =>
      Array.isArray(x) &&
      x.length <= (opts.max ?? Infinity) &&
      (opts.length === undefined || x.length === opts.length) &&
      x.every(c),
  object:
    <S extends Record<string, Check<unknown>>>(shape: S): Check<{ [K in keyof S]: S[K] extends Check<infer U> ? U : never }> =>
    (x): x is { [K in keyof S]: S[K] extends Check<infer U> ? U : never } =>
      typeof x === "object" && x !== null && !Array.isArray(x) && Object.entries(shape).every(([k, c]) => c((x as Record<string, unknown>)[k])),
};

export function validator<T>(check: Check<T>): Validator<T> {
  return { safeParse: (data) => (check(data) ? { success: true, data } : { success: false }) };
}
