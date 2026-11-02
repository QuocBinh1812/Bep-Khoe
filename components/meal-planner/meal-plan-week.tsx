import Link from "next/link";
import { Coffee, Moon, Sun } from "lucide-react";
import { MEALS, WEEKDAYS } from "@/data/taxonomy";
import type { ResolvedMealItem } from "@/lib/meal-plans";

const MEAL_ICONS = { sang: Coffee, trua: Sun, toi: Moon } as const;

export type ResolvedDay = Record<"sang" | "trua" | "toi", ResolvedMealItem[]>;

function Items({ items }: { items: ResolvedMealItem[] }) {
  return (
    <ul className="space-y-1">
      {items.map((it, i) => (
        <li key={i} className="leading-snug">
          {it.recipe ? (
            <Link href={`/cong-thuc/${it.recipe.slug}/`} className="font-medium text-brand-700 underline-offset-2 hover:underline">
              {it.name}
            </Link>
          ) : (
            <span className="text-ink-soft">{it.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Thực đơn 7 ngày: bảng trên desktop, thẻ theo ngày trên điện thoại. */
export function MealPlanWeek({ days }: { days: ResolvedDay[] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-line md:block print:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Thực đơn 7 ngày gồm bữa sáng, trưa, tối</caption>
          <thead className="bg-brand-50">
            <tr>
              <th scope="col" className="w-32 px-4 py-3 font-semibold text-brand-900">
                Ngày
              </th>
              {MEALS.map((m) => {
                const Icon = MEAL_ICONS[m.slug];
                return (
                  <th key={m.slug} scope="col" className="px-4 py-3 font-semibold text-brand-900">
                    <span className="inline-flex items-center gap-2">
                      <Icon aria-hidden className="size-4" /> {m.name}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => (
              <tr key={i} className="border-t border-line align-top even:bg-surface">
                <th scope="row" className="px-4 py-3.5 font-display font-bold">
                  {WEEKDAYS[i]}
                </th>
                {MEALS.map((m) => (
                  <td key={m.slug} className="px-4 py-3.5">
                    <Items items={d[m.slug]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ol className="space-y-4 md:hidden print:hidden">
        {days.map((d, i) => (
          <li key={i} className="card p-4">
            <h3 className="text-lg">{WEEKDAYS[i]}</h3>
            <dl className="mt-2 divide-y divide-line">
              {MEALS.map((m) => {
                const Icon = MEAL_ICONS[m.slug];
                return (
                  <div key={m.slug} className="grid grid-cols-[6.5rem_1fr] gap-2 py-2.5">
                    <dt className="inline-flex items-start gap-1.5 text-sm font-semibold text-ink-soft">
                      <Icon aria-hidden className="mt-0.5 size-4 text-brand-600" /> {m.name}
                    </dt>
                    <dd>
                      <Items items={d[m.slug]} />
                    </dd>
                  </div>
                );
              })}
            </dl>
          </li>
        ))}
      </ol>
    </>
  );
}
