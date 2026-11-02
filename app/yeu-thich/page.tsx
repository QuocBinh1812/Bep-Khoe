import { PageHeader } from "@/components/common/page-header";
import { FavoritesList } from "@/components/favorites/favorites-list";
import { getRecipeSummaries } from "@/lib/recipes";
import { buildMetadata } from "@/lib/seo";

// Trang cá nhân hóa (nội dung phụ thuộc LocalStorage) – không cần lập chỉ mục.
export const metadata = buildMetadata({
  title: "Công thức yêu thích của bạn",
  description: "Các công thức bạn đã lưu trên Bếp Khỏe, lưu trên trình duyệt của bạn.",
  path: "/yeu-thich/",
  noindex: true,
});

export default function FavoritesPage() {
  return (
    <>
      <PageHeader
        title="Công thức yêu thích"
        description="Những món bạn đã lưu để nấu sau. Danh sách lưu trên trình duyệt của thiết bị này."
        crumbs={[{ name: "Yêu thích", path: "/yeu-thich/" }]}
      />
      <div className="container-page py-8 sm:py-10">
        <FavoritesList recipes={getRecipeSummaries()} />
      </div>
    </>
  );
}
