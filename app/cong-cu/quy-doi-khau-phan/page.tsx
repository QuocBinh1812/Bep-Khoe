import { PageHeader } from "@/components/common/page-header";
import { ServingsConverter } from "@/components/recipe/servings-converter";
import { getPlannerRecipes } from "@/lib/recipes";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Quy đổi khẩu phần – tính lại định lượng nguyên liệu",
  description:
    "Nhập định lượng nguyên liệu và số khẩu phần gốc, chọn số người ăn mong muốn – công cụ tự quy đổi và làm tròn hợp lý. Có sẵn công thức để chọn nhanh.",
  path: "/cong-cu/quy-doi-khau-phan/",
});

export default function ServingsToolPage() {
  return (
    <>
      <PageHeader
        title="Quy đổi khẩu phần"
        description="Công thức cho 4 người nhưng nhà bạn có 2 hay 6 người? Nhập định lượng gốc, công cụ tính lại cho số khẩu phần bạn cần."
        crumbs={[
          { name: "Công cụ", path: "/cong-cu/" },
          { name: "Quy đổi khẩu phần", path: "/cong-cu/quy-doi-khau-phan/" },
        ]}
      />
      <div className="container-page py-8 sm:py-10">
        <ServingsConverter recipes={getPlannerRecipes()} />
      </div>
    </>
  );
}
