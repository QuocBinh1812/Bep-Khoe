import { ArticleSectionIndex } from "@/components/article/article-views";
import { buildMetadata } from "@/lib/seo";

const title = "Sức khỏe & lối sống cân bằng";
const description =
  "Thói quen lành mạnh, vận động, giấc ngủ và chăm sóc bữa ăn cho người lớn tuổi – gợi ý thực tế, dễ áp dụng cho gia đình Việt.";

export const metadata = buildMetadata({ title, description, path: "/suc-khoe/" });

export default function Page() {
  return <ArticleSectionIndex section="suc-khoe" title={title} description={description} />;
}
