import { StaticPage } from "@/components/common/static-page";
import { buildMetadata } from "@/lib/seo";

const title = "Miễn trừ trách nhiệm";
const description =
  "Thông tin trên Bếp Khỏe mang tính tham khảo, không thay thế chẩn đoán, điều trị hay tư vấn của bác sĩ và chuyên gia dinh dưỡng.";

export const metadata = buildMetadata({ title, description, path: "/mien-tru-trach-nhiem/" });

export default function DisclaimerPage() {
  return (
    <StaticPage title={title} description={description} path="/mien-tru-trach-nhiem/" updatedAt="2026-11-01">
      <p>
        Nội dung trên Bếp Khỏe – gồm công thức, bài viết, thực đơn và kết quả từ các công cụ – chỉ nhằm cung cấp thông tin phổ
        thông về nấu ăn, dinh dưỡng và lối sống.
      </p>
      <ul>
        <li>
          Thông tin <strong>không thay thế</strong> chẩn đoán, điều trị hoặc lời khuyên của bác sĩ, chuyên gia dinh dưỡng.
        </li>
        <li>
          Người có bệnh lý (tiểu đường, tăng huyết áp, bệnh thận, bệnh tim mạch…), phụ nữ mang thai, cho con bú, trẻ nhỏ và người
          cao tuổi có vấn đề sức khỏe nên hỏi ý kiến nhân viên y tế trước khi thay đổi chế độ ăn.
        </li>
        <li>Số liệu dinh dưỡng là ước tính; giá trị thực tế phụ thuộc giống, cách chế biến và lượng ăn.</li>
        <li>Kiểm tra dị ứng thực phẩm của các thành viên gia đình trước khi nấu.</li>
        <li>Khi có dấu hiệu cấp cứu (khó thở, hóc nghẹn, đau ngực…), hãy gọi 115 hoặc đến cơ sở y tế gần nhất.</li>
      </ul>
    </StaticPage>
  );
}
