"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calculator, Plus, Trash } from "lucide-react";
import { buttonClass } from "@/components/common/button";
import { EmptyState } from "@/components/common/empty-state";
import { ServingsStepper } from "@/components/common/servings-stepper";
import {
  FOOD_GROUPS,
  FOOD_SOURCES,
  computeTotals,
  divideTotals,
  macroEnergySplit,
  roundTotals,
} from "@/lib/nutrition";
import { createId } from "@/lib/quantity";
import { useHydrated, useNutritionCalc } from "@/lib/storage";
import { formatNumber, matchesQuery, normalizeVi } from "@/lib/text";
import type { Food, NutritionTotals } from "@/types/content";

const addSchema = z.object({
  foodId: z.string().min(1, "Hãy chọn một nguyên liệu"),
  grams: z
    .number({ error: "Nhập khối lượng bằng số" })
    .positive("Khối lượng phải lớn hơn 0")
    .max(5000, "Tối đa 5.000 g cho mỗi dòng"),
});
type AddValues = z.infer<typeof addSchema>;

export function NutritionCalculator({ foods }: { foods: Food[] }) {
  const hydrated = useHydrated();
  const [state, setState] = useNutritionCalc();
  const [filter, setFilter] = useState("");
  const foodMap = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddValues>({
    resolver: zodResolver(addSchema),
    defaultValues: { foodId: "", grams: 100 },
  });

  const selected = foodMap.get(useWatch({ control, name: "foodId" }));

  const groups = useMemo(() => {
    const visible = filter.trim()
      ? foods.filter((f) => matchesQuery(normalizeVi(`${f.name} ${f.state}`), filter))
      : foods;
    return (Object.keys(FOOD_GROUPS) as Food["group"][])
      .map((g) => ({ g, items: visible.filter((f) => f.group === g) }))
      .filter((x) => x.items.length);
  }, [foods, filter]);

  const lines = hydrated ? state.lines.filter((l) => foodMap.has(l.foodId)) : [];
  const servings = state.servings;
  const total = computeTotals(lines, foodMap);
  const totalR = roundTotals(total);
  const perServing = roundTotals(divideTotals(total, servings));
  const split = macroEnergySplit(total);
  const usedSources = [...new Set(lines.map((l) => foodMap.get(l.foodId)!.source))];

  const onAdd = (v: AddValues) => {
    setState((s) => ({ ...s, lines: [...s.lines, { id: createId(), foodId: v.foodId, grams: v.grams }] }));
    reset({ foodId: "", grams: 100 });
  };

  const updateGrams = (id: string, grams: number) =>
    setState((s) => ({
      ...s,
      lines: s.lines.map((l) => (l.id === id ? { ...l, grams: Math.min(10000, Math.max(0.1, grams)) } : l)),
    }));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onAdd)} className="card p-5 sm:p-6" noValidate>
          <h2 className="text-xl">Thêm nguyên liệu</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_9rem]">
            <div className="space-y-2">
              <label htmlFor="food-filter" className="block text-sm font-bold text-ink-soft">
                Nguyên liệu
              </label>
              <input
                id="food-filter"
                type="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Gõ để lọc: gà, cá, rau…"
                className="field"
                aria-describedby="food-filter-hint"
              />
              <span id="food-filter-hint" className="sr-only">
                Lọc danh sách nguyên liệu bên dưới
              </span>
              <select
                id="food"
                {...register("foodId")}
                aria-label="Chọn nguyên liệu"
                aria-invalid={!!errors.foodId}
                className="field"
              >
                <option value="">— Chọn nguyên liệu ({groups.reduce((n, g) => n + g.items.length, 0)}) —</option>
                {groups.map(({ g, items }) => (
                  <optgroup key={g} label={FOOD_GROUPS[g]}>
                    {items.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.state})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.foodId && <p className="text-sm text-red-700">{errors.foodId.message}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="grams" className="block text-sm font-bold text-ink-soft">
                Khối lượng (g)
              </label>
              <input
                id="grams"
                type="number"
                inputMode="decimal"
                step="any"
                min={1}
                {...register("grams", { valueAsNumber: true })}
                aria-invalid={!!errors.grams}
                className="field"
              />
              {errors.grams && <p className="text-sm text-red-700">{errors.grams.message}</p>}
            </div>
          </div>

          {selected && (
            <div className="mt-4 rounded-xl bg-surface p-3.5 text-sm">
              <p className="font-semibold">
                {selected.name} – giá trị trên <span className="underline decoration-accent-400 decoration-2">100 g</span> phần ăn
                được ({selected.state}):
              </p>
              <p className="mt-1 text-ink-soft">
                {selected.per100g.kcal} kcal · Đạm {selected.per100g.protein} g · Bột đường {selected.per100g.carbs} g · Béo{" "}
                {selected.per100g.fat} g
                {selected.per100g.fiber !== null && ` · Xơ ${selected.per100g.fiber} g`}
              </p>
              <p className="mt-1 text-muted">
                Nguồn: {FOOD_SOURCES[selected.source].label} – “{selected.sourceRef}”
              </p>
            </div>
          )}

          <button type="submit" className={buttonClass("primary", "md", "mt-5")}>
            <Plus aria-hidden className="size-5" /> Thêm vào bảng tính
          </button>
        </form>

        <section aria-labelledby="bang-tinh" className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
            <h2 id="bang-tinh" className="text-xl">
              Bảng tính ({lines.length} nguyên liệu)
            </h2>
            {lines.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Xóa toàn bộ nguyên liệu trong bảng tính?")) setState((s) => ({ ...s, lines: [] }));
                }}
                className={buttonClass("danger", "sm")}
              >
                <Trash aria-hidden className="size-4" /> Xóa tất cả
              </button>
            )}
          </div>
          {!hydrated ? (
            <p className="px-6 pb-6 text-muted" role="status">
              Đang tải dữ liệu đã lưu…
            </p>
          ) : lines.length === 0 ? (
            <div className="px-5 pb-6 sm:px-6">
              <EmptyState
                icon={Calculator}
                title="Chưa có nguyên liệu"
                description="Chọn nguyên liệu và nhập khối lượng phần ăn được (đã bỏ vỏ, xương) để bắt đầu tính."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-left text-[0.95rem]">
                <thead className="bg-brand-50 text-sm text-brand-900">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-semibold">Nguyên liệu</th>
                    <th scope="col" className="px-2 py-2.5 font-semibold">Khối lượng</th>
                    <th scope="col" className="px-2 py-2.5 text-right font-semibold">kcal</th>
                    <th scope="col" className="px-2 py-2.5 text-right font-semibold">Đạm</th>
                    <th scope="col" className="px-2 py-2.5 text-right font-semibold">Bột đường</th>
                    <th scope="col" className="px-2 py-2.5 text-right font-semibold">Béo</th>
                    <th scope="col" className="px-2 py-2.5 text-right font-semibold">Xơ</th>
                    <th scope="col" className="px-2 py-2.5"><span className="sr-only">Xóa</span></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l) => {
                    const f = foodMap.get(l.foodId)!;
                    const t = roundTotals(computeTotals([l], foodMap));
                    return (
                      <tr key={l.id} className="border-t border-line">
                        <td className="px-4 py-2">
                          <span className="font-medium">{f.name}</span>
                          {f.source === "uoc-tinh" && <span className="ml-1 text-xs text-accent-700">(ước tính)</span>}
                        </td>
                        <td className="px-2 py-2">
                          <label className="inline-flex items-center gap-1">
                            <span className="sr-only">Khối lượng {f.name} (gam)</span>
                            <input
                              type="number"
                              inputMode="decimal"
                              step="any"
                              min={0.1}
                              defaultValue={l.grams}
                              onBlur={(e) => {
                                const n = Number(e.target.value);
                                if (n > 0) updateGrams(l.id, n);
                                else e.target.value = String(l.grams);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                              }}
                              className="field min-h-10 w-24 px-2 py-1"
                            />
                            g
                          </label>
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums">{formatNumber(t.kcal, 0)}</td>
                        <td className="px-2 py-2 text-right tabular-nums">{formatNumber(t.protein)}</td>
                        <td className="px-2 py-2 text-right tabular-nums">{formatNumber(t.carbs)}</td>
                        <td className="px-2 py-2 text-right tabular-nums">{formatNumber(t.fat)}</td>
                        <td className="px-2 py-2 text-right tabular-nums">{t.fiber === null ? "–" : formatNumber(t.fiber)}</td>
                        <td className="px-2 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => setState((s) => ({ ...s, lines: s.lines.filter((x) => x.id !== l.id) }))}
                            className="grid size-10 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"
                            aria-label={`Xóa ${f.name}`}
                          >
                            <Trash aria-hidden className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t-2 border-brand-200 bg-surface font-semibold">
                  <tr>
                    <th scope="row" className="px-4 py-2.5 text-left">Tổng cộng</th>
                    <td className="px-2 py-2.5 tabular-nums">{formatNumber(lines.reduce((n, l) => n + l.grams, 0), 0)} g</td>
                    <td className="px-2 py-2.5 text-right tabular-nums">{formatNumber(totalR.kcal, 0)}</td>
                    <td className="px-2 py-2.5 text-right tabular-nums">{formatNumber(totalR.protein)}</td>
                    <td className="px-2 py-2.5 text-right tabular-nums">{formatNumber(totalR.carbs)}</td>
                    <td className="px-2 py-2.5 text-right tabular-nums">{formatNumber(totalR.fat)}</td>
                    <td className="px-2 py-2.5 text-right tabular-nums">{totalR.fiber === null ? "–" : formatNumber(totalR.fiber)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
              <p className="px-4 py-3 text-sm text-muted">Đơn vị: kcal cho năng lượng, gam (g) cho các chất còn lại.</p>
            </div>
          )}
        </section>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24" aria-label="Kết quả">
        <div className="card p-5 sm:p-6">
          <ServingsStepper
            id="calc-servings"
            label="Chia thành"
            value={servings}
            max={50}
            onChange={(n) => setState((s) => ({ ...s, servings: n }))}
          />
          <p className="mt-1 text-sm text-muted">khẩu phần</p>
          <ResultBlock title="Mỗi khẩu phần" totals={perServing} highlight />
          <ResultBlock title="Tổng cả món" totals={totalR} />
          {lines.length > 0 && (
            <p className="mt-4 text-sm text-ink-soft">
              Tỷ lệ năng lượng: đạm {split.protein}% · bột đường {split.carbs}% · béo {split.fat}%
            </p>
          )}
        </div>
        <div className="rounded-2xl bg-cream-50 p-4 text-sm text-ink-soft">
          <p className="font-semibold text-ink">Cách tính</p>
          <p className="mt-1">
            Giá trị = (giá trị trên 100 g × khối lượng) ÷ 100, cộng dồn các nguyên liệu, sau đó chia cho số khẩu phần. Công cụ
            không dùng AI hay ước đoán.
          </p>
          <p className="mt-2">
            Số liệu tham khảo, đã làm tròn, chưa được chuyên gia dinh dưỡng kiểm định. Nguồn đang dùng:{" "}
            {(usedSources.length ? usedSources : (["usda-fdc", "vn-fct-2007"] as Food["source"][]))
              .map((s) => FOOD_SOURCES[s].label)
              .join("; ")}
            .
          </p>
        </div>
      </aside>
    </div>
  );
}

function ResultBlock({ title, totals, highlight }: { title: string; totals: NutritionTotals; highlight?: boolean }) {
  return (
    <div className={highlight ? "mt-5 rounded-2xl bg-brand-50 p-4" : "mt-4 border-t border-line pt-4"}>
      <p className="text-sm font-bold uppercase tracking-wider text-brand-800">{title}</p>
      <p className="mt-1">
        <span className="font-display text-3xl font-bold text-brand-700 tabular-nums">{formatNumber(totals.kcal, 0)}</span>{" "}
        <span className="font-semibold text-ink-soft">kcal</span>
      </p>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[0.95rem]">
        <dt className="text-ink-soft">Đạm</dt>
        <dd className="text-right font-semibold tabular-nums">{formatNumber(totals.protein)} g</dd>
        <dt className="text-ink-soft">Bột đường</dt>
        <dd className="text-right font-semibold tabular-nums">{formatNumber(totals.carbs)} g</dd>
        <dt className="text-ink-soft">Chất béo</dt>
        <dd className="text-right font-semibold tabular-nums">{formatNumber(totals.fat)} g</dd>
        <dt className="text-ink-soft">Chất xơ</dt>
        <dd className="text-right font-semibold tabular-nums">{totals.fiber === null ? "–" : `${formatNumber(totals.fiber)} g`}</dd>
      </dl>
    </div>
  );
}
