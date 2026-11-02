import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Filter } from "lucide-react";
import { CollectionCard } from "@/components/collection/collection-card";
import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getCollection, getCollections, toCollectionCard } from "@/lib/collections";
import { toSummary } from "@/lib/recipes";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/bo-suu-tap/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return {};
  return buildMetadata({
    title: `${c.title} – ${c.recipes.length} công thức`,
    description: c.description,
    path: `/bo-suu-tap/${c.slug}/`,
    image: c.recipes.find((r) => r.image && !r.image.similar)?.image,
  });
}

export default async function CollectionPage({ params }: PageProps<"/bo-suu-tap/[slug]">) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const others = getCollections().filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <>
      <PageHeader
        title={c.title}
        description={c.intro}
        crumbs={[
          { name: "Bộ sưu tập", path: "/bo-suu-tap/" },
          { name: c.title, path: `/bo-suu-tap/${c.slug}/` },
        ]}
      >
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm text-ink-soft ring-1 ring-line">
          <Filter aria-hidden className="size-4 text-brand-600" />
          Tiêu chí: {c.rule}
        </p>
      </PageHeader>
      <div className="container-page py-8 sm:py-10">
        <p className="mb-5 font-semibold text-ink-soft">{c.recipes.length} công thức</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {c.recipes.map((r, i) => (
            <RecipeCard key={r.slug} recipe={toSummary(r)} priority={i < 2} headingLevel="h2" />
          ))}
        </div>

        {others.length > 0 && (
          <section aria-labelledby="bst-khac" className="mt-16">
            <SectionHeading id="bst-khac" title="Bộ sưu tập khác" href="/bo-suu-tap/" />
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug} className="flex">
                  <CollectionCard collection={toCollectionCard(o)} className="w-full" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
