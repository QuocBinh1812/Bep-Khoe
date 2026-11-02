import { PageHeader } from "@/components/common/page-header";
import { NutritionCalculator } from "@/components/nutrition/nutrition-calculator";
import { getFoods } from "@/lib/recipes";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Công cụ tính dinh dưỡng món ăn (calo, đạm, chất béo)",
  description:
    "Tính năng lượng (kcal), protein, carbohydrate, chất béo và chất xơ của món ăn từ khối lượng nguyên liệu. Xem tổng và giá trị mỗi khẩu phần, miễn phí.",
  path: "/cong-cu/tinh-dinh-duong/",
});

export default function NutritionToolPage() {
  const foods = getFoods();
  return (
    <>
      <PageHeader
        title="Tính dinh dưỡng món ăn"
        description={`Chọn nguyên liệu (${foods.length} loại phổ biến), nhập khối lượng phần ăn được, công cụ cộng dồn theo bảng thành phần thực phẩm và chia theo khẩu phần.`}
        crumbs={[
          { name: "Công cụ", path: "/cong-cu/" },
          { name: "Tính dinh dưỡng", path: "/cong-cu/tinh-dinh-duong/" },
        ]}
      />
      <div className="container-page py-8 sm:py-10">
        <NutritionCalculator foods={foods} />
      </div>
    </>
  );
}
