import Link from "next/link";
import { StaticPage } from "@/components/common/static-page";
import { buildMetadata } from "@/lib/seo";

const title = "Chính sách biên tập";
const description =
  "Cách Bếp Khỏe xây dựng, kiểm tra và cập nhật công thức, bài viết dinh dưỡng – sức khỏe và số liệu dinh dưỡng.";

export const metadata = buildMetadata({ title, description, path: "/chinh-sach-bien-tap/" });

export default function EditorialPolicyPage() {
  return (
    <StaticPage title={title} description={description} path="/chinh-sach-bien-tap/" updatedAt="2026-11-01">
      <h2>1. Nguồn thông tin</h2>
      <p>
        Bài viết dinh dưỡng và sức khỏe dựa trên khuyến nghị đã công bố của các tổ chức uy tín: Tổ chức Y tế Thế giới (WHO),
        Viện Dinh dưỡng Quốc gia, Bộ Y tế, Viện Y tế Quốc gia Hoa Kỳ (NIH), Trường Y tế Công cộng Harvard… Mọi bài viết đều liệt
        kê nguồn tham khảo ở cuối bài. Chúng tôi không đưa ra số liệu nếu không có nguồn.
      </p>
      <h2>2. Số liệu dinh dưỡng</h2>
      <ul>
        <li>
          Bảng thành phần thực phẩm của Bếp Khỏe tổng hợp từ <strong>USDA FoodData Central</strong> và{" "}
          <strong>Bảng thành phần thực phẩm Việt Nam (Viện Dinh dưỡng, 2007)</strong>, tính trên 100 g phần ăn được, đã làm tròn.
          Mục nào không có số liệu trực tiếp được đánh dấu “ước tính”.
        </li>
        <li>
          Giá trị dinh dưỡng của công thức được <strong>tính tự động</strong> bằng phép cộng theo khối lượng nguyên liệu, không
          dùng AI hay ước đoán. Kết quả là con số tham khảo.
        </li>
        <li>Toàn bộ số liệu hiện chưa được chuyên gia dinh dưỡng đối chiếu; trạng thái này được ghi rõ trên công cụ và công thức.</li>
      </ul>
      <h2>3. Kiểm duyệt chuyên môn</h2>
      <p>
        Bài viết chỉ hiển thị “người kiểm duyệt” khi thực sự có chuyên gia (bác sĩ, chuyên gia dinh dưỡng) đọc và xác nhận nội
        dung. Chúng tôi không gắn tên chuyên gia cho bài viết họ chưa duyệt.
      </p>
      <h2>4. Cập nhật & sửa lỗi</h2>
      <p>
        Mỗi bài có ngày xuất bản và ngày cập nhật. Khi khuyến nghị thay đổi hoặc phát hiện sai sót, chúng tôi sửa nội dung và
        cập nhật ngày. Nội dung trên Bếp Khỏe là tự biên soạn, không sao chép từ website khác.
      </p>
      <h2>5. Giới hạn</h2>
      <p>
        Nội dung mang tính phổ thông, không thay thế tư vấn y tế. Xem <Link href="/mien-tru-trach-nhiem/">miễn trừ trách nhiệm</Link>.
      </p>
    </StaticPage>
  );
}
