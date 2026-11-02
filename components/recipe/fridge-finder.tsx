"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Clock, Refrigerator, X } from "lucide-react";
import { buttonClass } from "@/components/common/button";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { INGREDIENT_TAGS } from "@/data/taxonomy";
import { rankByIngredients } from "@/lib/fridge";
import { cn, formatMinutes } from "@/lib/text";
import type { RecipeSummary } from "@/types/content";

const SHOW = 4;

/** "Tủ lạnh nhà bạn có gì?" – chọn nguyên liệu, gợi ý món ngay lập tức. */
export function FridgeFinder({ recipes }: { recipes: RecipeSummary[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const matches = useMemo(() => rankByIngredients(recipes, selected), [recipes, selected]);
  const complete = matches.filter((m) => m.complete).length;

  const toggle = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
      <div>
        <fieldset>
          <legend className="sr-only">Chọn nguyên liệu bạn đang có</legend>
          <ul className="flex flex-wrap gap-2.5">
            {INGREDIENT_TAGS.map((t) => {
              const on = selected.includes(t.slug);
              return (
                <li key={t.slug}>
                  <button
                    type="button"
                    onClick={() => toggle(t.slug)}
                    aria-pressed={on}
                    className={cn(
                      "inline-flex min-h-12 items-center gap-1.5 rounded-full border-2 px-4 text-base font-semibold transition-colors",
                      on
                        ? "border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
                        : "border-brand-200 bg-white text-brand-900 hover:border-brand-400 hover:bg-brand-50",
                    )}
                  >
                    {on && <Check aria-hidden className="animate-pop size-4" strokeWidth={3} />}
                    {t.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>
        {selected.length > 0 && (
          <button type="button" onClick={() => setSelected([])} className={buttonClass("ghost", "sm", "mt-4")}>
            <X aria-hidden className="size-4" /> Bỏ chọn tất cả
          </button>
        )}
      </div>

      <div aria-live="polite" className="min-h-48">
        {!selected.length ? (
          <div className="flex h-full flex-col items-center justify-center rounded-[var(--radius-card)] border-2 border-dashed border-brand-200 bg-white/60 p-8 text-center">
            <Refrigerator aria-hidden className="size-10 text-brand-600" />
            <p className="mt-3 font-display text-xl font-bold">
              Chọn nguyên liệu <span className="lg:hidden">ở trên</span>
              <span className="hidden lg:inline">bên cạnh</span>
            </p>
            <p className="mt-1 max-w-sm text-ink-soft">
              Ví dụ chọn <strong>Trứng</strong> và <strong>Cà chua</strong> – Bếp Khỏe gợi ý ngay món nấu được.
            </p>
          </div>
        ) : !matches.length ? (
          <div className="rounded-[var(--radius-card)] bg-white p-6 text-center">
            <p className="font-display text-xl font-bold">Chưa có món phù hợp</p>
            <p className="mt-1 text-ink-soft">Thử bỏ bớt một nguyên liệu nhé.</p>
          </div>
        ) : (
          <>
            <p className="font-semibold text-brand-900">
              {complete > 0
                ? `${complete} món dùng đủ ${selected.length > 1 ? `cả ${selected.length} nguyên liệu` : "nguyên liệu"} bạn chọn`
                : `Chưa có món dùng đủ cả ${selected.length} nguyên liệu – đây là các món dùng được một phần`}
            </p>
            <ul key={selected.join(",")} className="mt-3 grid gap-3 sm:grid-cols-2">
              {matches.slice(0, SHOW).map(({ recipe: r, matched, complete: full }, i) => (
                <li key={r.slug} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <Link
                    href={`/cong-thuc/${r.slug}/`}
                    className="group flex gap-3 rounded-2xl bg-white p-2.5 ring-1 ring-line transition-[translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <RecipeImage
                      title={r.title}
                      image={r.image}
                      dishType={r.dishType}
                      ingredientTags={r.ingredientTags}
                      sizes="112px"
                      className="w-28 shrink-0 rounded-xl"
                    />
                    <span className="flex min-w-0 flex-col py-0.5">
                      <span className="font-display font-bold leading-snug group-hover:text-brand-700">{r.title}</span>
                      <span className={cn("mt-1 text-sm font-semibold", full ? "text-brand-700" : "text-accent-700")}>
                        {full ? "Dùng đủ nguyên liệu bạn có" : `Dùng ${matched}/${selected.length} nguyên liệu`}
                      </span>
                      <span className="mt-auto inline-flex items-center gap-1 text-sm text-muted">
                        <Clock aria-hidden className="size-3.5" /> {formatMinutes(r.totalMinutes)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              {complete > 0 && (
                <Link
                  href={`/cong-thuc/?nguyen-lieu=${selected.join(",")}`}
                  className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand-700 hover:text-brand-800"
                >
                  Xem tất cả {complete} món <ArrowRight aria-hidden className="size-4" />
                </Link>
              )}
              {matches.length > SHOW && (
                <span className="text-sm text-muted">+ {matches.length - SHOW} món dùng được một phần</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
