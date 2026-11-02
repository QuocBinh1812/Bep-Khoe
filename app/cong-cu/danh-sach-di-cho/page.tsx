import { PageHeader } from "@/components/common/page-header";
import { ShoppingList } from "@/components/shopping-list/shopping-list";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Danh sách đi chợ thông minh",
  description:
    "Tạo danh sách đi chợ từ công thức và thực đơn, tự gộp nguyên liệu trùng, đánh dấu đã mua, in hoặc sao chép gửi người thân. Lưu ngay trên trình duyệt.",
  path: "/cong-cu/danh-sach-di-cho/",
});

export default function ShoppingListPage() {
  return (
    <>
      <PageHeader
        title="Danh sách đi chợ"
        description="Thêm nguyên liệu tự do hoặc từ công thức, thực đơn. Danh sách lưu trên trình duyệt của bạn – mở lại lúc ra chợ vẫn còn."
        crumbs={[
          { name: "Công cụ", path: "/cong-cu/" },
          { name: "Danh sách đi chợ", path: "/cong-cu/danh-sach-di-cho/" },
        ]}
      />
      <div className="container-page py-8 sm:py-10">
        <ShoppingList />
      </div>
    </>
  );
}
