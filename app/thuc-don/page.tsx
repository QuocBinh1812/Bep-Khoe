import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { buttonClass } from "@/components/common/button";
import { PageHeader } from "@/components/common/page-header";
import { MealPlanCard } from "@/components/meal-planner/meal-plan-card";
import { MEAL_PLAN_CATEGORIES } from "@/data/taxonomy";
import { getMealPlans, mealPlanRecipeCounts } from "@/lib/meal-plans";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Thực đơn 7 ngày cho gia đình – cân bằng, tiết kiệm",
  description:
    "Thực đơn mẫu 7 ngày với bữa sáng, trưa, tối: thực đơn gia đình, tiết kiệm, cân bằng ít muối, theo mùa. Tạo danh sách đi chợ cả tuần chỉ với một lần bấm.",
  path: "/thuc-don/",
});

export default function MealPlansPage() {
  const plans = getMealPlans();
  const groups = MEAL_PLAN_CATEGORIES.map((c) => ({ ...c, items: plans.filter((p) => p.category === c.slug) })).filter(
    (g) => g.items.length,
  );
  return (
    <>
      <PageHeader
        title="Thực đơn mẫu"
        description="Không còn đau đầu “hôm nay ăn gì”. Chọn một thực đơn 7 ngày, xem món cho từng bữa và thêm toàn bộ nguyên liệu vào danh sách đi chợ."
        crumbs={[{ name: "Thực đơn", path: "/thuc-don/" }]}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/cong-cu/lap-thuc-don/" className={buttonClass("primary", "lg")}>
            <CalendarDays aria-hidden className="size-5" /> Tự lập thực đơn của bạn
          </Link>
        </div>
      </PageHeader>
      <div className="container-page space-y-12 py-10">
        {groups.map((g) => (
          <section key={g.slug} aria-labelledby={g.slug}>
            <h2 id={g.slug} className="mb-5 text-2xl sm:text-[1.75rem]">
              {g.name}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((p) => (
                <MealPlanCard key={p.slug} plan={p} dishCount={mealPlanRecipeCounts(p).size} />
              ))}
            </div>
          </section>
        ))}
        <aside className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-cream-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-bold">Gia đình bạn có khẩu vị riêng?</p>
            <p className="mt-1 text-ink-soft">Dùng công cụ lập thực đơn để chọn món cho từng bữa – dữ liệu lưu ngay trên máy bạn.</p>
          </div>
          <Link href="/cong-cu/lap-thuc-don/" className={buttonClass("primary")}>
            Lập thực đơn <ArrowRight aria-hidden className="size-4" />
          </Link>
        </aside>
      </div>
    </>
  );
}
