import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CookingPot } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { RECIPE_CATEGORIES, type RecipeCategorySlug } from "@/data/taxonomy";
import { getRecipesByCategory, toSummary } from "@/lib/recipes";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/text";

export const dynamicParams = false;

export function generateStaticParams() {
  return RECIPE_CATEGORIES.map((c) => ({ slug: c.slug }));
}

function findCategory(slug: string) {
  return RECIPE_CATEGORIES.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/cong-thuc/danh-muc/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cat = findCategory(slug);
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.name} – công thức dễ nấu, lành mạnh`,
    description: `${cat.description} ${cat.intro}`.slice(0, 200),
    path: `/cong-thuc/danh-muc/${cat.slug}/`,
  });
}

export default async function RecipeCategoryPage({ params }: PageProps<"/cong-thuc/danh-muc/[slug]">) {
  const { slug } = await params;
  const cat = findCategory(slug);
  if (!cat) notFound();
  const recipes = getRecipesByCategory(cat.slug as RecipeCategorySlug).map(toSummary);

  return (
    <>
      <PageHeader
        title={cat.name}
        description={cat.intro}
        crumbs={[
          { name: "Công thức", path: "/cong-thuc/" },
          { name: cat.name, path: `/cong-thuc/danh-muc/${cat.slug}/` },
        ]}
      >
        <nav aria-label="Danh mục khác" className="mt-6">
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {RECIPE_CATEGORIES.map((c) => (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={`/cong-thuc/danh-muc/${c.slug}/`}
                  aria-current={c.slug === cat.slug ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-10 items-center rounded-full border px-4 font-medium",
                    c.slug === cat.slug
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-line bg-white text-ink-soft hover:border-brand-300 hover:bg-brand-50",
                  )}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      <div className="container-page py-8 sm:py-10">
        <p className="mb-5 font-semibold text-ink-soft">{recipes.length} công thức</p>
        {recipes.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((r, i) => (
              <RecipeCard key={r.slug} recipe={r} priority={i < 2} headingLevel="h2" />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CookingPot}
            title="Danh mục đang được cập nhật"
            description="Bếp Khỏe đang thử nghiệm thêm công thức cho danh mục này."
            action={
              <Link href="/cong-thuc/" className="font-semibold text-brand-700 underline">
                Xem tất cả công thức
              </Link>
            }
          />
        )}
        <p className="mt-10 text-muted">
          Muốn lọc theo nguyên liệu và thời gian nấu?{" "}
          <Link href={`/cong-thuc/?danh-muc=${cat.slug}`} className="font-semibold text-brand-700 underline">
            Dùng bộ lọc nâng cao
          </Link>
        </p>
      </div>
    </>
  );
}
