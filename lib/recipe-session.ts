/**
 * Trạng thái tạm của trang công thức, dùng chung giữa danh sách nguyên liệu và chế độ nấu
 * (ví dụ: số khẩu phần người dùng vừa chọn). Chỉ giữ trong bộ nhớ phiên, không lưu LocalStorage.
 */
import { useCallback, useSyncExternalStore } from "react";

const servingsBySlug = new Map<string, number>();
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useRecipeServings(slug: string, base: number): [number, (n: number) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => servingsBySlug.get(slug) ?? base,
    () => base,
  );
  const set = useCallback(
    (n: number) => {
      servingsBySlug.set(slug, n);
      for (const l of listeners) l();
    },
    [slug],
  );
  return [value, set];
}
