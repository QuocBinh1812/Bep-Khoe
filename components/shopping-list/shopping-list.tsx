"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Copy, Plus, Printer, ShoppingBasket, Trash } from "lucide-react";
import { buttonClass } from "@/components/common/button";
import { EmptyState } from "@/components/common/empty-state";
import { UNITS } from "@/data/taxonomy";
import { addShoppingItems, formatQuantity, shoppingListToText, type ShoppingItem } from "@/lib/quantity";
import { useHydrated, useShoppingList } from "@/lib/storage";
import { cn } from "@/lib/text";

const addSchema = z.object({
  name: z.string().trim().min(1, "Nhập tên nguyên liệu").max(80, "Tên quá dài (tối đa 80 ký tự)"),
  amount: z
    .number({ error: "Số lượng phải là số" })
    .positive("Số lượng phải lớn hơn 0")
    .max(100000, "Số lượng quá lớn")
    .optional(),
  unit: z.string().max(30),
});
type AddValues = z.infer<typeof addSchema>;

export function ShoppingList() {
  const hydrated = useHydrated();
  const [items, setItems] = useShoppingList();
  const [copied, setCopied] = useState<"" | "ok" | "fail">("");

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<AddValues>({
    resolver: zodResolver(addSchema),
    defaultValues: { name: "", amount: undefined, unit: "g" },
  });

  const onAdd = (v: AddValues) => {
    setItems((prev) =>
      addShoppingItems(prev, [{ name: v.name, amount: v.amount ?? null, unit: v.amount ? v.unit : "" }]),
    );
    reset({ name: "", amount: undefined, unit: v.unit });
    setFocus("name");
  };

  const toBuy = items.filter((i) => !i.checked);
  const bought = items.filter((i) => i.checked);

  const update = (id: string, patch: Partial<ShoppingItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  async function copy() {
    try {
      await navigator.clipboard.writeText(shoppingListToText(items));
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied(""), 3000);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
      <form onSubmit={handleSubmit(onAdd)} className="no-print card p-5 sm:p-6 lg:sticky lg:top-24" noValidate>
        <h2 className="text-xl">Thêm nguyên liệu</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="item-name" className="mb-1.5 block text-sm font-bold text-ink-soft">
              Tên nguyên liệu
            </label>
            <input
              id="item-name"
              {...register("name")}
              aria-invalid={!!errors.name}
              placeholder="Ví dụ: Cà chua"
              className="field"
              autoComplete="off"
            />
            {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="item-amount" className="mb-1.5 block text-sm font-bold text-ink-soft">
                Số lượng
              </label>
              <input
                id="item-amount"
                type="number"
                inputMode="decimal"
                step="any"
                {...register("amount", { setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)) })}
                aria-invalid={!!errors.amount}
                placeholder="Tùy chọn"
                className="field"
              />
            </div>
            <div>
              <label htmlFor="item-unit" className="mb-1.5 block text-sm font-bold text-ink-soft">
                Đơn vị
              </label>
              <select id="item-unit" {...register("unit")} className="field">
                {UNITS.filter(Boolean).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.amount && <p className="text-sm text-red-700">{errors.amount.message}</p>}
          <button type="submit" className={buttonClass("primary", "md", "w-full")}>
            <Plus aria-hidden className="size-5" /> Thêm vào danh sách
          </button>
          <p className="text-sm text-muted">
            Nguyên liệu trùng tên sẽ tự gộp khi cùng đơn vị hoặc quy đổi được (g ↔ kg, ml ↔ l).
          </p>
        </div>
      </form>

      <section aria-labelledby="ds" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="ds" className="text-2xl">
            Cần mua{hydrated && items.length > 0 ? ` (${toBuy.length}/${items.length})` : ""}
          </h2>
          {hydrated && items.length > 0 && (
            <div className="no-print flex flex-wrap items-center gap-2">
              <button type="button" onClick={copy} className={buttonClass("outline", "sm")}>
                {copied === "ok" ? <Check aria-hidden className="size-4 text-brand-600" /> : <Copy aria-hidden className="size-4" />}
                {copied === "ok" ? "Đã sao chép" : "Sao chép để gửi"}
              </button>
              <button type="button" onClick={() => window.print()} className={buttonClass("outline", "sm")}>
                <Printer aria-hidden className="size-4" /> In
              </button>
              {bought.length > 0 && (
                <button type="button" onClick={() => setItems((p) => p.filter((i) => !i.checked))} className={buttonClass("ghost", "sm")}>
                  Xóa món đã mua
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Xóa toàn bộ danh sách đi chợ?")) setItems([]);
                }}
                className={buttonClass("danger", "sm")}
              >
                <Trash aria-hidden className="size-4" /> Xóa hết
              </button>
            </div>
          )}
        </div>
        <p role="status" aria-live="polite" className="sr-only">
          {copied === "ok" ? "Đã sao chép danh sách" : copied === "fail" ? "Trình duyệt không cho phép sao chép" : ""}
        </p>
        {copied === "fail" && (
          <p className="text-sm text-red-700">Trình duyệt chặn sao chép – hãy dùng nút In hoặc chụp màn hình.</p>
        )}

        {!hydrated ? (
          <div className="space-y-2" role="status" aria-label="Đang tải danh sách">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={ShoppingBasket}
            title="Danh sách đi chợ đang trống"
            description="Thêm nguyên liệu bằng biểu mẫu, hoặc bấm “Thêm vào danh sách đi chợ” ở trang công thức và thực đơn."
            action={
              <>
                <Link href="/cong-thuc/" className={buttonClass("primary")}>
                  Chọn công thức
                </Link>
                <Link href="/thuc-don/" className={buttonClass("outline")}>
                  Xem thực đơn mẫu
                </Link>
              </>
            }
          />
        ) : (
          <>
            {toBuy.length > 0 ? (
              <ItemList items={toBuy} onUpdate={update} onRemove={remove} />
            ) : (
              <p className="rounded-2xl bg-brand-50 p-4 font-semibold text-brand-800">Bạn đã mua đủ tất cả. Chúc nấu ngon!</p>
            )}
            {bought.length > 0 && (
              <div>
                <h3 className="mb-3 font-sans text-sm font-bold uppercase tracking-wider text-muted">
                  Đã mua ({bought.length})
                </h3>
                <ItemList items={bought} onUpdate={update} onRemove={remove} />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function ItemList({
  items,
  onUpdate,
  onRemove,
}: {
  items: ShoppingItem[];
  onUpdate: (id: string, patch: Partial<ShoppingItem>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <ul className="card divide-y divide-line">
      {items.map((item) => {
        const q = formatQuantity(item.amount, item.unit);
        return (
          <li key={item.id} className="flex items-center gap-3 px-4 py-3">
            <label className="flex flex-1 cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => onUpdate(item.id, { checked: e.target.checked })}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2 peer-focus-visible:ring-3 peer-focus-visible:ring-accent-400",
                  item.checked ? "border-brand-600 bg-brand-600 text-white" : "border-brand-300 bg-white",
                )}
              >
                {item.checked && <Check className="size-4" strokeWidth={3} />}
              </span>
              <span className="min-w-0">
                <span className={cn("block font-semibold", item.checked && "text-muted line-through")}>{item.name}</span>
                {item.sources.length > 0 && (
                  <span className="block truncate text-xs text-muted">Cho: {item.sources.join(", ")}</span>
                )}
              </span>
            </label>
            <div className="flex items-center gap-1.5">
              {item.amount !== null ? (
                <label className="flex items-center gap-1.5">
                  <span className="sr-only">Số lượng {item.name}</span>
                  <input
                    key={`${item.id}-${item.amount}`}
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min={0}
                    defaultValue={Number(item.amount.toFixed(2))}
                    onBlur={(e) => {
                      const n = Number(e.target.value);
                      if (n > 0 && n !== item.amount) onUpdate(item.id, { amount: n });
                      else e.target.value = String(Number(item.amount!.toFixed(2)));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                    }}
                    className="field min-h-10 w-20 px-2 py-1 text-right print:hidden"
                  />
                  <span className="hidden print:inline">{q.amount}</span>
                  <span className="w-20 truncate text-sm text-ink-soft" title={item.unit}>
                    {item.unit}
                  </span>
                </label>
              ) : (
                <span className="text-sm text-muted">vừa đủ</span>
              )}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="no-print grid size-10 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"
                aria-label={`Xóa ${item.name}`}
              >
                <Trash aria-hidden className="size-4" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
