"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Plus, Trash } from "lucide-react";
import { buttonClass } from "@/components/common/button";
import { AddToListButton } from "@/components/shopping-list/add-to-list-button";
import { UNITS } from "@/data/taxonomy";
import { formatQuantity, scaleAmount } from "@/lib/quantity";
import type { PlannerRecipe } from "@/lib/recipes";

const rowSchema = z.object({
  name: z.string().trim().max(80, "Tối đa 80 ký tự"),
  amount: z.number().positive("Phải lớn hơn 0").max(100000).optional(),
  unit: z.string().max(30),
});

const schema = z.object({
  from: z.number({ error: "Nhập số" }).int("Số nguyên").min(1, "Tối thiểu 1").max(100, "Tối đa 100"),
  to: z.number({ error: "Nhập số" }).int("Số nguyên").min(1, "Tối thiểu 1").max(100, "Tối đa 100"),
  rows: z.array(rowSchema).max(40),
});
type Values = z.infer<typeof schema>;

const toNumber = (v: unknown) => (v === "" || v === null || v === undefined ? undefined : Number(v));

const EMPTY_ROW = { name: "", amount: undefined, unit: "g" };

export function ServingsConverter({ recipes }: { recipes: PlannerRecipe[] }) {
  const {
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      from: 4,
      to: 2,
      rows: [
        { name: "Thịt heo nạc", amount: 300, unit: "g" },
        { name: "Trứng gà", amount: 4, unit: "quả" },
        { name: "Nước mắm", amount: 2, unit: "muỗng canh" },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "rows" });

  const values = useWatch({ control });
  const from = Number(values.from);
  const to = Number(values.to);
  const valid = from >= 1 && to >= 1 && Number.isFinite(from) && Number.isFinite(to);
  const rows = (values.rows ?? []).filter((r): r is { name: string; amount?: number; unit: string } => !!r?.name?.trim());
  const ratio = valid ? to / from : 1;

  function loadRecipe(slug: string) {
    const r = recipes.find((x) => x.slug === slug);
    if (!r) return;
    reset({
      from: r.servings,
      to: Number.isFinite(to) && to >= 1 ? to : r.servings,
      rows: r.ingredients.map((i) => ({
        name: i.name,
        amount: i.amount ?? undefined,
        unit: i.amount === null ? "" : i.unit,
      })),
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <form className="card p-5 sm:p-6" noValidate onSubmit={(e) => e.preventDefault()}>
        <h2 className="text-xl">1. Định lượng gốc</h2>
        <label htmlFor="from-recipe" className="mt-4 mb-1.5 block text-sm font-bold text-ink-soft">
          Lấy nhanh từ công thức Bếp Khỏe (tùy chọn)
        </label>
        <select id="from-recipe" className="field" defaultValue="" onChange={(e) => loadRecipe(e.target.value)}>
          <option value="">— Tự nhập nguyên liệu —</option>
          {recipes.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.title} ({r.servings} khẩu phần)
            </option>
          ))}
        </select>

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
          <div>
            <label htmlFor="from" className="mb-1.5 block text-sm font-bold text-ink-soft">
              Khẩu phần gốc
            </label>
            <input id="from" type="number" inputMode="numeric" min={1} {...register("from", { valueAsNumber: true })} aria-invalid={!!errors.from} className="field" />
          </div>
          <ArrowRight aria-hidden className="mb-3 size-5 text-brand-600" />
          <div>
            <label htmlFor="to" className="mb-1.5 block text-sm font-bold text-ink-soft">
              Khẩu phần mong muốn
            </label>
            <input id="to" type="number" inputMode="numeric" min={1} {...register("to", { valueAsNumber: true })} aria-invalid={!!errors.to} className="field" />
          </div>
        </div>
        {(errors.from || errors.to) && (
          <p className="mt-2 text-sm text-red-700">{errors.from?.message ?? errors.to?.message}</p>
        )}

        <fieldset className="mt-6">
          <legend className="text-sm font-bold text-ink-soft">Nguyên liệu ({fields.length})</legend>
          <ul className="mt-2 space-y-3">
            {fields.map((field, i) => (
              <li key={field.id} className="grid grid-cols-[1fr_5.5rem_auto] gap-2 sm:grid-cols-[1fr_5.5rem_8.5rem_auto]">
                <input
                  {...register(`rows.${i}.name`)}
                  placeholder="Tên nguyên liệu"
                  aria-label={`Tên nguyên liệu ${i + 1}`}
                  className="field col-span-3 sm:col-span-1"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  {...register(`rows.${i}.amount`, { setValueAs: toNumber })}
                  placeholder="SL"
                  aria-label={`Số lượng nguyên liệu ${i + 1}`}
                  aria-invalid={!!errors.rows?.[i]?.amount}
                  className="field px-2"
                />
                <select {...register(`rows.${i}.unit`)} aria-label={`Đơn vị nguyên liệu ${i + 1}`} className="field px-2">
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u || "(không)"}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="grid size-11 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"
                  aria-label={`Xóa nguyên liệu ${i + 1}`}
                >
                  <Trash aria-hidden className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => append(EMPTY_ROW)}
            disabled={fields.length >= 40}
            className={buttonClass("secondary", "sm", "mt-4")}
          >
            <Plus aria-hidden className="size-4" /> Thêm nguyên liệu
          </button>
        </fieldset>
      </form>

      <section aria-labelledby="ket-qua-quy-doi" className="card p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 id="ket-qua-quy-doi" className="text-xl">
          2. Định lượng cho {valid ? to : "…"} khẩu phần
        </h2>
        {valid && (
          <p className="mt-1 text-sm text-muted">
            Hệ số quy đổi: × {new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 3 }).format(ratio)}
          </p>
        )}
        {!valid || rows.length === 0 ? (
          <p className="mt-4 rounded-xl bg-surface p-4 text-muted">
            Nhập số khẩu phần và ít nhất một nguyên liệu để xem kết quả.
          </p>
        ) : (
          <>
            <table className="mt-4 w-full border-collapse text-left">
              <thead className="text-sm text-brand-900">
                <tr className="border-b border-line">
                  <th scope="col" className="py-2 pr-2 font-semibold">Nguyên liệu</th>
                  <th scope="col" className="py-2 pr-2 text-right font-semibold">Gốc ({from})</th>
                  <th scope="col" className="py-2 text-right font-semibold">Mới ({to})</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const amount = r.amount && r.amount > 0 ? r.amount : null;
                  const before = formatQuantity(amount, r.unit);
                  const after = formatQuantity(scaleAmount(amount, from, to), r.unit);
                  return (
                    <tr key={i} className="border-b border-line">
                      <td className="py-2.5 pr-2">{r.name}</td>
                      <td className="py-2.5 pr-2 text-right text-muted tabular-nums">
                        {before.amount} {before.unit}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-brand-800 tabular-nums">
                        {after.amount} {after.unit}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-3 text-sm text-muted">
              Số lượng được làm tròn hợp lý (gam/ml theo số tròn, muỗng theo 1/4, quả/củ theo 1/2). Gia vị nên nêm lại theo
              khẩu vị; thời gian nấu có thể cần điều chỉnh khi lượng thay đổi nhiều.
            </p>
            <div className="mt-5">
              <AddToListButton
                variant="outline"
                items={() =>
                  rows.map((r) => {
                    const amount = r.amount && r.amount > 0 ? r.amount : null;
                    return { name: r.name.trim(), amount: scaleAmount(amount, from, to), unit: amount === null ? "" : r.unit };
                  })
                }
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
