import { StaticPage } from "@/components/common/static-page";
import { buildMetadata } from "@/lib/seo";

const title = "Chính sách bảo mật";
const description =
  "Bếp Khỏe không yêu cầu đăng ký và không thu thập dữ liệu sức khỏe cá nhân. Dữ liệu công cụ chỉ lưu trên trình duyệt của bạn.";

export const metadata = buildMetadata({ title, description, path: "/chinh-sach-bao-mat/" });

export default function PrivacyPage() {
  return (
    <StaticPage title={title} description={description} path="/chinh-sach-bao-mat/" updatedAt="2026-11-01">
      <h2>Dữ liệu chúng tôi lưu</h2>
      <p>
        Bếp Khỏe không có tài khoản người dùng và không gửi dữ liệu bạn nhập về máy chủ. Các thông tin sau được lưu trong{" "}
        <strong>LocalStorage</strong> của trình duyệt, chỉ trên thiết bị bạn đang dùng:
      </p>
      <ul>
        <li>Danh sách công thức yêu thích.</li>
        <li>Danh sách đi chợ.</li>
        <li>Thực đơn 7 ngày bạn tự lập.</li>
        <li>Nguyên liệu trong công cụ tính dinh dưỡng.</li>
      </ul>
      <p>Chúng tôi không lưu cân nặng, bệnh lý hay bất kỳ dữ liệu sức khỏe cá nhân nào.</p>
      <h2>Xóa dữ liệu</h2>
      <p>
        Bạn có thể xóa từng mục bằng nút “Xóa” trong công cụ, hoặc xóa dữ liệu trang web trong phần cài đặt trình duyệt để xóa
        toàn bộ.
      </p>
      <h2>Liên kết bên ngoài</h2>
      <p>
        Bài viết có thể dẫn đến website của các tổ chức được trích dẫn (WHO, NIH…). Các trang đó có chính sách bảo mật riêng.
      </p>
    </StaticPage>
  );
}
