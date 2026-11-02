import Link from "next/link";
import { StaticPage } from "@/components/common/static-page";
import { buildMetadata } from "@/lib/seo";

const title = "Giới thiệu Bếp Khỏe";
const description =
  "Bếp Khỏe là nền tảng nội dung về nấu ăn, dinh dưỡng và sức khỏe cho gia đình Việt: công thức dễ nấu, kiến thức dễ hiểu, công cụ miễn phí.";

export const metadata = buildMetadata({ title, description, path: "/gioi-thieu/" });

export default function AboutPage() {
  return (
    <StaticPage title={title} description={description} path="/gioi-thieu/" updatedAt="2026-11-01">
      <p>
        <strong>Bếp Khỏe</strong> ra đời với một mong muốn giản dị: giúp mỗi gia đình Việt nấu được những bữa cơm vừa ngon
        miệng, vừa cân bằng dinh dưỡng mà không tốn quá nhiều thời gian. Khẩu hiệu của chúng tôi là{" "}
        <em>“Ăn ngon mỗi ngày – Sống khỏe lâu dài.”</em>
      </p>
      <h2>Bếp Khỏe có gì?</h2>
      <ul>
        <li>
          <Link href="/cong-thuc/">Công thức nấu ăn</Link> quen thuộc với người Việt, hướng dẫn từng bước, có thể đổi khẩu phần
          và thêm nguyên liệu vào danh sách đi chợ.
        </li>
        <li>
          <Link href="/dinh-duong/">Kiến thức dinh dưỡng</Link> và <Link href="/suc-khoe/">sức khỏe</Link> viết dễ hiểu, ghi rõ
          nguồn tham khảo và ngày cập nhật.
        </li>
        <li>
          <Link href="/thuc-don/">Thực đơn mẫu 7 ngày</Link> cho gia đình, tiết kiệm, cân bằng và theo mùa.
        </li>
        <li>
          <Link href="/cong-cu/">Công cụ miễn phí</Link>: tính dinh dưỡng, lập thực đơn, danh sách đi chợ, quy đổi khẩu phần.
        </li>
      </ul>
      <h2>Ai đứng sau nội dung?</h2>
      <p>
        Nội dung được thực hiện bởi <strong>Ban biên tập Bếp Khỏe</strong>. Công thức được thử nghiệm trong bếp gia đình; bài
        viết dinh dưỡng và sức khỏe được tổng hợp từ khuyến nghị của các tổ chức uy tín như Tổ chức Y tế Thế giới (WHO), Viện
        Dinh dưỡng Quốc gia và các trường đại học, viện nghiên cứu lớn. Mỗi bài viết đều ghi nguồn tham khảo ở cuối bài.
      </p>
      <p>
        Hiện tại các bài viết <strong>chưa được chuyên gia y tế kiểm duyệt</strong>. Khi có chuyên gia tham gia kiểm duyệt, tên
        và chuyên môn của họ sẽ được ghi rõ trên từng bài. Xem thêm{" "}
        <Link href="/chinh-sach-bien-tap/">chính sách biên tập</Link>.
      </p>
      <h2>Cam kết của chúng tôi</h2>
      <ul>
        <li>Không bán, không quảng cáo thực phẩm chức năng hay “thần dược”.</li>
        <li>Không thu thập dữ liệu sức khỏe cá nhân. Công cụ lưu dữ liệu ngay trên trình duyệt của bạn.</li>
        <li>Số liệu dinh dưỡng luôn ghi rõ là ước tính và nêu nguồn.</li>
      </ul>
    </StaticPage>
  );
}
