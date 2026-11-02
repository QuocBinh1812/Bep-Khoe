"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { CalendarDays, Coffee, Moon, Plus, Printer, Search, ShoppingBasket, Sun, Trash, X } from "lucide-react";
import { buttonClass } from "@/components/common/button";
import { ServingsStepper } from "@/components/common/servings-stepper";
import { DISH_TYPES, MEALS, WEEKDAYS, labelOf, type MealSlug } from "@/data/taxonomy";
import { addShoppingItems, scaleAmount, type ShoppingItemInput } from "@/lib/quantity";
import type { PlannerRecipe } from "@/lib/recipes";
import { EMPTY_PLANNER, useHydrated, useMealPlanner, writeShoppingList, type PlannerState } from "@/lib/storage";
import { formatMinutes, matchesQuery, normalizeVi } from "@/lib/text";

type SamplePlan = { slug: string; title: string; plan: PlannerState };

const MEAL_ICONS = { sang: Coffee, trua: Sun, toi: Moon } as const;

export function MealPlanner({ recipes, samples }: { recipes: PlannerRecipe[]; samples: SamplePlan[] }) {
  const hydrated = useHydrated();
  const [state, setState] = useMealPlanner();
  const [target, setTarget] = useState<{ day: number; meal: MealSlug } | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const recipeMap = useMemo(() => new Map(recipes.map((r) => [r.slug, r])), [recipes]);

  const plan = hydrated ? state : EMPTY_PLANNER;
  const totalDishes = plan.days.reduce((n, d) => n + d.sang.length + d.trua.length + d.toi.length, 0);

  const filtered = useMemo(() => {
    if (!query.trim()) return recipes;
    return recipes.filter((r) => matchesQuery(normalizeVi(`${r.title} ${r.ingredients.map((i) => i.name).join(" ")}`), query));
  }, [recipes, query]);

  function openPicker(day: number, meal: MealSlug) {
    setTarget({ day, meal });
    setQuery("");
    dialogRef.current?.showModal();
  }

  function addDish(slug: string) {
    if (!target) return;
    setState((s) => ({
      ...s,
      days: s.days.map((d, i) => (i === target.day ? { ...d, [target.meal]: [...d[target.meal], slug].slice(0, 8) } : d)),
    }));
    dialogRef.current?.close();
  }

  function removeDish(day: number, meal: MealSlug, index: number) {
    setState((s) => ({
      ...s,
      days: s.days.map((d, i) => (i === day ? { ...d, [meal]: d[meal].filter((_, j) => j !== index) } : d)),
    }));
  }

  function buildShopping(): ShoppingItemInput[] {
    const inputs: ShoppingItemInput[] = [];
    for (const d of plan.days) {
      for (const meal of [d.sang, d.trua, d.toi]) {
        for (const slug of meal) {
          const r = recipeMap.get(slug);
          if (!r) continue;
          for (const ing of r.ingredients) {
            inputs.push({
              name: ing.name,
              amount: scaleAmount(ing.amount, r.servings, plan.servings),
              unit: ing.unit,
              source: r.title,
            });
          }
        }
      }
    }
    return inputs;
  }

  function sendToShoppingList() {
    const inputs = buildShopping();
    if (!inputs.length) {
      setMessage("Thực đơn chưa có món nào để tạo danh sách đi chợ.");
      return;
    }
    writeShoppingList((prev) => addShoppingItems(prev, inputs));
    setMessage(`Đã thêm ${inputs.length} dòng nguyên liệu (đã gộp nguyên liệu trùng) vào danh sách đi chợ.`);
  }

  function loadSample(slug: string) {
    const sample = samples.find((s) => s.slug === slug);
    if (!sample) return;
    if (totalDishes > 0 && !window.confirm("Thay thực đơn hiện tại bằng thực đơn mẫu?")) return;
    setState(sample.plan);
    setMessage(`Đã tải “${sample.title}”. Bạn có thể thay đổi từng món.`);
  }

  function dayKcal(day: PlannerState["days"][number]): { kcal: number; missing: boolean } {
    let kcal = 0;
    let missing = false;
    for (const slug of [...day.sang, ...day.trua, ...day.toi]) {
      const k = recipeMap.get(slug)?.kcalPerServing;
      if (k == null) missing = true;
      else kcal += k;
    }
    return { kcal, missing };
  }

  return (
    <div>
      <div className="no-print card flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <ServingsStepper
          id="planner-servings"
          label="Số người ăn"
          value={plan.servings}
          onChange={(n) => setState((s) => ({ ...s, servings: n }))}
        />
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="sample" className="sr-only">
            Bắt đầu từ thực đơn mẫu
          </label>
          <select
            id="sample"
            className="field min-h-11 w-auto max-w-full"
            value=""
            onChange={(e) => loadSample(e.target.value)}
          >
            <option value="">Bắt đầu từ thực đơn mẫu…</option>
            {samples.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
          <button type="button" onClick={sendToShoppingList} className={buttonClass("primary")}>
            <ShoppingBasket aria-hidden className="size-5" /> Tạo danh sách đi chợ
          </button>
          <button type="button" onClick={() => window.print()} className={buttonClass("outline")}>
            <Printer aria-hidden className="size-5" /> In
          </button>
          <button
            type="button"
            disabled={!totalDishes}
            onClick={() => {
              if (window.confirm("Xóa toàn bộ món trong thực đơn tuần này?")) {
                setState((s) => ({ ...EMPTY_PLANNER, servings: s.servings }));
                setMessage("Đã xóa thực đơn.");
              }
            }}
            className={buttonClass("danger")}
          >
            <Trash aria-hidden className="size-5" /> Xóa tuần
          </button>
        </div>
      </div>

      <p role="status" aria-live="polite" className="no-print mt-3 min-h-6 text-brand-800">
        {message}{" "}
        {message.startsWith("Đã thêm") && (
          <Link href="/cong-cu/danh-sach-di-cho/" className="font-semibold underline">
            Mở danh sách đi chợ
          </Link>
        )}
      </p>

      <h2 className="sr-only print:not-sr-only print:mt-2 print:text-2xl">
        Thực đơn tuần – {plan.servings} người ăn
      </h2>

      <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4 print:grid-cols-2">
        {plan.days.map((day, di) => {
          const { kcal, missing } = dayKcal(day);
          return (
            <section key={di} aria-labelledby={`day-${di}`} className="card flex flex-col p-4 print:break-inside-avoid">
              <div className="flex items-baseline justify-between gap-2">
                <h3 id={`day-${di}`} className="text-lg">
                  {WEEKDAYS[di]}
                </h3>
                {kcal > 0 && (
                  <span className="text-xs text-muted" title="Tổng năng lượng ước tính mỗi người từ các món có công thức, chưa gồm cơm">
                    ~{kcal}
                    {missing ? "+" : ""} kcal/người*
                  </span>
                )}
              </div>
              <div className="mt-2 flex-1 divide-y divide-line">
                {MEALS.map((m) => {
                  const Icon = MEAL_ICONS[m.slug];
                  const slugs = day[m.slug];
                  return (
                    <div key={m.slug} className="py-2.5">
                      <p className="flex items-center gap-1.5 text-sm font-bold text-ink-soft">
                        <Icon aria-hidden className="size-4 text-brand-600" /> {m.name}
                      </p>
                      <ul className="mt-1.5 space-y-1">
                        {slugs.map((slug, idx) => {
                          const r = recipeMap.get(slug);
                          return (
                            <li key={`${slug}-${idx}`} className="animate-scale-in flex items-center gap-1 rounded-lg bg-surface pl-2.5">
                              {r ? (
                                <Link href={`/cong-thuc/${slug}/`} className="flex-1 py-1.5 text-[0.95rem] leading-snug hover:text-brand-700 hover:underline">
                                  {r.title}
                                </Link>
                              ) : (
                                <span className="flex-1 py-1.5 text-[0.95rem] text-muted">Món không còn tồn tại</span>
                              )}
                              <button
                                type="button"
                                onClick={() => removeDish(di, m.slug, idx)}
                                className="no-print grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-700"
                                aria-label={`Bỏ ${r?.title ?? "món"} khỏi ${m.name.toLowerCase()} ${WEEKDAYS[di].toLowerCase()}`}
                              >
                                <X aria-hidden className="size-4" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      <button
                        type="button"
                        onClick={() => openPicker(di, m.slug)}
                        disabled={!hydrated || slugs.length >= 8}
                        className="no-print mt-1.5 inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
                        aria-label={`Thêm món cho ${m.name.toLowerCase()} ${WEEKDAYS[di].toLowerCase()}`}
                      >
                        <Plus aria-hidden className="size-4" /> Thêm món
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
        <aside className="no-print flex flex-col justify-center rounded-[var(--radius-card)] bg-cream-100 p-5 text-sm text-ink-soft">
          <CalendarDays aria-hidden className="mb-2 size-7 text-brand-600" />
          <p>
            <strong className="text-ink">{totalDishes} món</strong> trong tuần. Thực đơn được lưu tự động trên trình duyệt của
            bạn (LocalStorage), không cần đăng nhập.
          </p>
          <p className="mt-2">* Năng lượng ước tính mỗi người từ các món có công thức, chưa gồm cơm và món phụ.</p>
        </aside>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="picker-title"
        onClose={() => setTarget(null)}
        className="dialog-anim m-auto w-[min(40rem,calc(100vw-2rem))] rounded-[var(--radius-card)] p-0 shadow-2xl backdrop:bg-ink/50"
      >
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-line p-4">
            <h2 id="picker-title" className="text-xl">
              Chọn món{target ? ` – ${MEALS.find((m) => m.slug === target.meal)?.name} ${WEEKDAYS[target.day]}` : ""}
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="grid size-11 place-items-center rounded-full hover:bg-brand-50"
              aria-label="Đóng"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <div className="p-4 pb-2">
            <label htmlFor="picker-search" className="sr-only">
              Tìm món
            </label>
            <div className="relative">
              <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
              <input
                id="picker-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên món hoặc nguyên liệu"
                className="field pl-11"
                autoFocus
              />
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto px-4 pb-4">
            {filtered.map((r) => (
              <li key={r.slug}>
                <button
                  type="button"
                  onClick={() => addDish(r.slug)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left hover:bg-brand-50"
                >
                  <span>
                    <span className="block font-semibold">{r.title}</span>
                    <span className="text-sm text-muted">
                      {labelOf(DISH_TYPES, r.dishType)} · {formatMinutes(r.totalMinutes)}
                      {r.kcalPerServing !== null && ` · ~${r.kcalPerServing} kcal/phần`}
                    </span>
                  </span>
                  <Plus aria-hidden className="size-5 shrink-0 text-brand-600" />
                </button>
              </li>
            ))}
            {!filtered.length && <li className="p-6 text-center text-muted">Không tìm thấy món phù hợp.</li>}
          </ul>
        </div>
      </dialog>
    </div>
  );
}
