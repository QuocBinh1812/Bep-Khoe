import { CollectionCard } from "@/components/collection/collection-card";
import { PageHeader } from "@/components/common/page-header";
import { getCollections, toCollectionCard } from "@/lib/collections";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Bộ sưu tập công thức theo chủ đề",
  description:
    "Công thức gom theo nhu cầu: cơm nhà 30 phút, món mềm cho ông bà, món ít dầu mỡ, giàu đạm, canh ngon mỗi ngày, bữa sáng, món chay thanh đạm.",
  path: "/bo-suu-tap/",
});

export default function CollectionsPage() {
  const collections = getCollections();
  return (
    <>
      <PageHeader
        title="Bộ sưu tập công thức"
        description="Chọn theo nhu cầu của gia đình bạn hôm nay – nấu nhanh, nấu cho ông bà, ăn nhẹ bụng hay cần thêm đạm."
        crumbs={[{ name: "Bộ sưu tập", path: "/bo-suu-tap/" }]}
      />
      <div className="container-page py-10">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <li key={c.slug} className="flex">
              <CollectionCard collection={toCollectionCard(c)} headingLevel="h2" className="w-full" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
