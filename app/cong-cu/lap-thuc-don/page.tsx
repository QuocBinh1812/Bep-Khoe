import { PageHeader } from "@/components/common/page-header";
import { MealPlanner } from "@/components/meal-planner/meal-planner";
import { getMealPlans, mealPlanToPlannerDays } from "@/lib/meal-plans";
import { getPlannerRecipes } from "@/lib/recipes";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Lập thực đơn 7 ngày cho gia đình",
  description:
    "Công cụ lập thực đơn tuần: chọn món cho bữa sáng, trưa, tối từ thứ hai đến chủ nhật, lưu trên máy và tạo danh sách đi chợ tự động. Miễn phí.",
  path: "/cong-cu/lap-thuc-don/",
});

export default function MealPlannerPage() {
  const samples = getMealPlans().map((p) => ({
    slug: p.slug,
    title: p.title,
    plan: { servings: p.servings, days: mealPlanToPlannerDays(p) },
  }));
  return (
    <>
      <PageHeader
        title="Lập thực đơn 7 ngày"
        description="Chọn món cho từng bữa, đổi món bất cứ lúc nào. Thực đơn tự lưu trên trình duyệt; khi xong, bấm “Tạo danh sách đi chợ”."
        crumbs={[
          { name: "Công cụ", path: "/cong-cu/" },
          { name: "Lập thực đơn", path: "/cong-cu/lap-thuc-don/" },
        ]}
      />
      <div className="container-page py-8 sm:py-10">
        <MealPlanner recipes={getPlannerRecipes()} samples={samples} />
      </div>
    </>
  );
}
