import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/common/page-header";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { RecipeExplorer } from "@/components/recipe/recipe-explorer";
import { RECIPE_CATEGORIES } from "@/data/taxonomy";
import { getRecipeSummaries } from "@/lib/recipes";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Công thức nấu ăn ngon, lành mạnh cho gia đình",
  description:
    "Tổng hợp công thức món Việt, món chay, món ăn sáng, món nhanh dễ nấu. Tìm món theo nguyên liệu bạn đang có, thời gian nấu và loại món.",
  path: "/cong-thuc/",
});

export default function RecipesPage() {
  const recipes = getRecipeSummaries();
  return (
    <>
      <PageHeader
        title="Công thức nấu ăn"
        description="Món ngon dễ nấu, ít dầu mỡ, đủ chất cho cả nhà. Tìm theo tên món hoặc chọn những nguyên liệu bạn đang có trong bếp."
        crumbs={[{ name: "Công thức", path: "/cong-thuc/" }]}
      >
        <nav aria-label="Danh mục công thức" className="mt-6">
          <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {RECIPE_CATEGORIES.map((c) => (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={`/cong-thuc/danh-muc/${c.slug}/`}
                  className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 font-medium text-ink-soft hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      <div className="container-page py-8 sm:py-10">
        {/* Fallback là danh sách đầy đủ dựng sẵn (HTML tĩnh cho SEO & khi JS chưa tải) */}
        <Suspense
          fallback={
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recipes.slice(0, 12).map((r, i) => (
                <RecipeCard key={r.slug} recipe={r} priority={i < 2} headingLevel="h2" />
              ))}
            </div>
          }
        >
          <RecipeExplorer recipes={recipes} />
        </Suspense>
      </div>
    </>
  );
}
