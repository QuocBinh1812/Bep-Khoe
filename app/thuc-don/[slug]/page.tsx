import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CircleCheck, NotebookPen, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { SectionHeading } from "@/components/common/section-heading";
import { SharePrint } from "@/components/common/share-print";
import { MealPlanCard } from "@/components/meal-planner/meal-plan-card";
import { MealPlanWeek, type ResolvedDay } from "@/components/meal-planner/meal-plan-week";
import { UsePlanButton } from "@/components/meal-planner/use-plan-button";
import { AddToListButton } from "@/components/shopping-list/add-to-list-button";
import { MEAL_PLAN_CATEGORIES, labelOf } from "@/data/taxonomy";
import {
  getMealPlan,
  getMealPlans,
  mealPlanRecipeCounts,
  mealPlanShoppingInputs,
  mealPlanToPlannerDays,
  resolveMealItem,
} from "@/lib/meal-plans";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/text";

export const dynamicParams = false;

export function generateStaticParams() {
  return getMealPlans().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/thuc-don/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const plan = getMealPlan(slug);
  if (!plan) return {};
  return buildMetadata({
    title: plan.title,
    description: plan.description,
    path: `/thuc-don/${plan.slug}/`,
    type: "article",
    publishedTime: plan.publishedAt,
    modifiedTime: plan.updatedAt,
  });
}

export default async function MealPlanPage({ params }: PageProps<"/thuc-don/[slug]">) {
  const { slug } = await params;
  const plan = getMealPlan(slug);
  if (!plan) notFound();

  const days: ResolvedDay[] = plan.days.map((d) => ({
    sang: d.sang.map(resolveMealItem),
    trua: d.trua.map(resolveMealItem),
    toi: d.toi.map(resolveMealItem),
  }));
  const shopping = mealPlanShoppingInputs(plan);
  const recipeCount = mealPlanRecipeCounts(plan).size;
  const others = getMealPlans().filter((p) => p.slug !== plan.slug).slice(0, 3);

  return (
    <article className="pb-16">
      <header className="border-b border-line bg-gradient-to-b from-cream-50 to-white">
        <div className="container-page py-8 sm:py-12">
          <Breadcrumbs
            items={[
              { name: "Thực đơn", path: "/thuc-don/" },
              { name: plan.title, path: `/thuc-don/${plan.slug}/` },
            ]}
          />
          <p className="mt-6 font-semibold text-accent-700">{labelOf(MEAL_PLAN_CATEGORIES, plan.category)}</p>
          <h1 className="mt-2 max-w-4xl text-[2rem] sm:text-[2.6rem]">{plan.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-ink-soft">{plan.intro}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <Users aria-hidden className="size-4 text-brand-600" /> Định lượng cho {plan.servings} người
            </span>
            <span>{recipeCount} món có công thức chi tiết</span>
            <span>
              Cập nhật <time dateTime={plan.updatedAt}>{formatDate(plan.updatedAt)}</time>
            </span>
          </p>
          <div className="no-print mt-6 flex flex-wrap items-start gap-3">
            <AddToListButton items={shopping} label="Thêm nguyên liệu cả tuần vào danh sách đi chợ" />
            <UsePlanButton plan={{ servings: plan.servings, days: mealPlanToPlannerDays(plan) }} />
            <SharePrint title={plan.title} text={plan.description} />
          </div>
        </div>
      </header>

      <div className="container-page mt-10 space-y-10">
        <section aria-labelledby="lich">
          <h2 id="lich" className="mb-5 text-2xl sm:text-3xl">
            Thực đơn từ thứ hai đến chủ nhật
          </h2>
          <MealPlanWeek days={days} />
          <p className="mt-3 text-sm text-muted">
            Món có liên kết là công thức chi tiết trên Bếp Khỏe. Danh sách đi chợ chỉ tính nguyên liệu của các món này (quy đổi
            cho {plan.servings} người); cơm, trái cây và món đơn giản bạn tự bổ sung.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section aria-labelledby="nguyen-tac" className="rounded-[var(--radius-card)] bg-brand-50 p-6">
            <h2 id="nguyen-tac" className="text-xl">
              Vì sao thực đơn này cân bằng?
            </h2>
            <ul className="mt-3 space-y-2">
              {plan.principles.map((p) => (
                <li key={p} className="flex gap-2.5">
                  <CircleCheck aria-hidden className="mt-1 size-5 shrink-0 text-brand-600" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
          {plan.notes.length > 0 && (
            <section aria-labelledby="ghi-chu" className="rounded-[var(--radius-card)] bg-cream-100 p-6">
              <h2 id="ghi-chu" className="text-xl">
                Ghi chú khi áp dụng
              </h2>
              <ul className="mt-3 space-y-2">
                {plan.notes.map((n) => (
                  <li key={n} className="flex gap-2.5">
                    <NotebookPen aria-hidden className="mt-1 size-5 shrink-0 text-accent-700" />
                    {n}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {others.length > 0 && (
          <section aria-labelledby="khac" className="no-print pt-6">
            <SectionHeading id="khac" title="Thực đơn khác" href="/thuc-don/" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <MealPlanCard key={p.slug} plan={p} dishCount={mealPlanRecipeCounts(p).size} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
