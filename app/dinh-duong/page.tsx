import { ArticleSectionIndex } from "@/components/article/article-views";
import { buildMetadata } from "@/lib/seo";

const title = "Kiến thức dinh dưỡng dễ hiểu cho gia đình";
const description =
  "Hiểu đúng về năng lượng, đạm, chất xơ, chất béo; cách ăn cân bằng cho phụ nữ, người lớn tuổi và cách đọc nhãn thực phẩm – có nguồn tham khảo rõ ràng.";

export const metadata = buildMetadata({ title, description, path: "/dinh-duong/" });

export default function Page() {
  return <ArticleSectionIndex section="dinh-duong" title={title} description={description} />;
}
