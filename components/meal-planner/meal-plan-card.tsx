import Link from "next/link";
import { CalendarDays, Users } from "lucide-react";
import { MEAL_PLAN_CATEGORIES, labelOf } from "@/data/taxonomy";
import { cn } from "@/lib/text";
import type { MealPlan } from "@/types/content";

export function MealPlanCard({
  plan,
  dishCount,
  headingLevel = "h3",
  className,
}: {
  plan: MealPlan;
  dishCount: number;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        "card group relative flex flex-col overflow-hidden reveal transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      <div className="grid grid-cols-7 gap-1 bg-gradient-to-br from-brand-600 to-brand-800 p-4" aria-hidden>
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
          <span key={d} className="flex flex-col items-center gap-1 rounded-lg bg-white/10 py-1.5 text-xs font-semibold text-white">
            {d}
            <span className="flex flex-col gap-0.5">
              <span className="h-1 w-4 rounded-full bg-accent-400" />
              <span className="h-1 w-4 rounded-full bg-cream-200" />
              <span className="h-1 w-4 rounded-full bg-white/70" />
            </span>
          </span>
        ))}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-semibold text-accent-700">{labelOf(MEAL_PLAN_CATEGORIES, plan.category)}</p>
        <Heading className="mt-1.5 text-xl leading-snug">
          <Link
            href={`/thuc-don/${plan.slug}/`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-brand-700 focus-visible:outline-none"
          >
            {plan.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-3 text-[0.95rem] text-muted">{plan.description}</p>
        <p className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <Users aria-hidden className="size-4 text-brand-600" /> {plan.servings} người ăn
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden className="size-4 text-brand-600" /> 7 ngày · {dishCount} món có công thức
          </span>
        </p>
      </div>
    </article>
  );
}
