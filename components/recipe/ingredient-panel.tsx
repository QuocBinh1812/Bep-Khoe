"use client";

import { useMemo, useState } from "react";
import { useRecipeServings } from "@/lib/recipe-session";
import { Check, RotateCcw } from "lucide-react";
import { AddToListButton } from "@/components/shopping-list/add-to-list-button";
import { ServingsStepper } from "@/components/common/servings-stepper";
import { formatQuantity, isToTasteNote, scaleAmount } from "@/lib/quantity";
import { cn } from "@/lib/text";
import type { RecipeIngredient } from "@/types/content";

type Props = {
  slug: string;
  recipeTitle: string;
  baseServings: number;
  ingredients: RecipeIngredient[];
};

/** Danh sách nguyên liệu: đổi khẩu phần, đánh dấu đã chuẩn bị, thêm vào danh sách đi chợ. */
export function IngredientPanel({ slug, recipeTitle, baseServings, ingredients }: Props) {
  // Dùng chung với Chế độ nấu để định lượng luôn khớp.
  const [servings, setServings] = useRecipeServings(slug, baseServings);
  const [checked, setChecked] = useState<Set<number>>(() => new Set());

  const groups = useMemo(() => {
    const map = new Map<string, { ing: RecipeIngredient; index: number }[]>();
    ingredients.forEach((ing, index) => {
      const g = ing.group ?? "Nguyên liệu";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push({ ing, index });
    });
    return [...map.entries()];
  }, [ingredients]);

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const shoppingInputs = () =>
    ingredients
      .filter((i) => !i.optional)
      .map((i) => ({
        name: i.name,
        amount: scaleAmount(i.amount, baseServings, servings),
        unit: i.amount === null ? "" : i.unit,
        source: recipeTitle,
      }));

  return (
    <section aria-labelledby="nguyen-lieu" className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="nguyen-lieu" className="text-2xl">
          Nguyên liệu
        </h2>
        <span className="text-sm text-muted">
          {checked.size}/{ingredients.length} đã chuẩn bị
        </span>
      </div>

      <div className="no-print mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-surface p-3">
        <ServingsStepper id="servings" value={servings} onChange={setServings} />
        {servings !== baseServings && (
          <button
            type="button"
            onClick={() => setServings(baseServings)}
            className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            <RotateCcw aria-hidden className="size-4" /> Về {baseServings} khẩu phần
          </button>
        )}
      </div>
      <p className="mt-2 hidden text-sm print:block">Định lượng cho {servings} khẩu phần.</p>
      <p aria-live="polite" className="sr-only">
        Định lượng đã cập nhật cho {servings} khẩu phần
      </p>

      <div className="mt-4 space-y-5">
        {groups.map(([group, items]) => (
          <div key={group}>
            {groups.length > 1 && (
              <h3 className="mb-1 font-sans text-sm font-bold uppercase tracking-wider text-brand-800">{group}</h3>
            )}
            <ul className="divide-y divide-line">
              {items.map(({ ing, index }) => {
                const q = formatQuantity(scaleAmount(ing.amount, baseServings, servings), ing.unit);
                const isChecked = checked.has(index);
                return (
                  <li key={index}>
                    <label className="flex min-h-12 cursor-pointer items-start gap-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(index)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2 transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-accent-400",
                          isChecked ? "border-brand-600 bg-brand-600 text-white" : "border-brand-300 bg-white",
                        )}
                      >
                        {isChecked && <Check className="animate-pop size-4" strokeWidth={3} />}
                      </span>
                      <span className={cn("flex-1", isChecked && "text-muted line-through")}>
                        {ing.amount !== null && (
                          <>
                            <span className="font-semibold tabular-nums text-brand-800">
                              {q.amount} {q.unit}
                            </span>{" "}
                          </>
                        )}
                        {ing.name}
                        {ing.note && !isToTasteNote(ing.note) && <span className="text-muted"> – {ing.note}</span>}
                        {ing.amount === null && <span className="font-semibold text-brand-800"> – vừa đủ</span>}
                        {ing.optional && <span className="ml-1 text-sm text-muted">(tùy chọn)</span>}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="no-print mt-5 border-t border-line pt-5">
        <AddToListButton items={shoppingInputs} className="w-full sm:w-auto" />
      </div>
    </section>
  );
}
