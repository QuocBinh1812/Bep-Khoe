import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Clock, CookingPot, Gauge, Lightbulb, Refrigerator, Timer, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { SectionHeading } from "@/components/common/section-heading";
import { SharePrint } from "@/components/common/share-print";
import { NutritionFacts } from "@/components/nutrition/nutrition-facts";
import { FavoriteButton } from "@/components/recipe/favorite-button";
import { IngredientPanel } from "@/components/recipe/ingredient-panel";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { DIFFICULTIES, RECIPE_CATEGORIES, SUITABLE_FOR, labelOf } from "@/data/taxonomy";
import { getAllRecipes, getAuthor, getRecipe, getRecipeNutrition, getRelatedRecipes, toSummary } from "@/lib/recipes";
import { recipeJsonLd } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate, formatMinutes } from "@/lib/text";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllRecipes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cong-thuc/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return {};
  return buildMetadata({
    title: `Cách làm ${recipe.title.charAt(0).toLowerCase()}${recipe.title.slice(1)}`,
    description: recipe.description,
    path: `/cong-thuc/${recipe.slug}/`,
    image: recipe.image,
    type: "article",
    publishedTime: recipe.publishedAt,
    modifiedTime: recipe.updatedAt,
    keywords: recipe.keywords,
  });
}

export default async function RecipePage({ params }: PageProps<"/cong-thuc/[slug]">) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const nutrition = getRecipeNutrition(recipe);
  const author = getAuthor(recipe.author);
  const related = getRelatedRecipes(recipe, 4).map(toSummary);
  const mainCategory = RECIPE_CATEGORIES.find((c) => c.slug === recipe.categories[0])!;
  const total = recipe.prepMinutes + recipe.cookMinutes;

  const stats = [
    { icon: Timer, label: "Chuẩn bị", value: formatMinutes(recipe.prepMinutes) },
    { icon: CookingPot, label: "Nấu", value: formatMinutes(recipe.cookMinutes) },
    { icon: Clock, label: "Tổng thời gian", value: formatMinutes(total) },
    { icon: Users, label: "Khẩu phần", value: `${recipe.servings} người` },
    { icon: Gauge, label: "Độ khó", value: labelOf(DIFFICULTIES, recipe.difficulty) },
  ];

  return (
    <article className="pb-16">
      <JsonLd
        data={recipeJsonLd(recipe, nutrition, {
          name: author?.name ?? site.editorialTeam,
          type: author?.type ?? "Organization",
        })}
      />

      <div className="bg-gradient-to-b from-cream-50 to-white">
        <div className="container-page pt-6 sm:pt-8">
          <Breadcrumbs
            items={[
              { name: "Công thức", path: "/cong-thuc/" },
              { name: mainCategory.name, path: `/cong-thuc/danh-muc/${mainCategory.slug}/` },
              { name: recipe.title, path: `/cong-thuc/${recipe.slug}/` },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div>
              <ul className="flex flex-wrap gap-2">
                {recipe.categories.map((c) => (
                  <li key={c}>
                    <Link
                      href={`/cong-thuc/danh-muc/${c}/`}
                      className="inline-flex min-h-8 items-center rounded-full bg-brand-50 px-3 text-sm font-semibold text-brand-800 hover:bg-brand-100"
                    >
                      {labelOf(RECIPE_CATEGORIES, c)}
                    </Link>
                  </li>
                ))}
              </ul>
              <h1 className="mt-4 text-[2.1rem] sm:text-[2.8rem]">{recipe.title}</h1>
              <p className="mt-4 text-lg text-ink-soft">{recipe.description}</p>
              <p className="mt-4 text-sm text-muted">
                {author?.name ?? site.editorialTeam} · Cập nhật{" "}
                <time dateTime={recipe.updatedAt}>{formatDate(recipe.updatedAt)}</time>
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <FavoriteButton slug={recipe.slug} title={recipe.title} variant="full" />
                <SharePrint title={recipe.title} text={recipe.description} />
              </div>
            </div>
            <figure>
              <RecipeImage
                title={recipe.title}
                image={recipe.image}
                dishType={recipe.dishType}
                ingredientTags={recipe.ingredientTags}
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="rounded-[var(--radius-card)] shadow-[var(--shadow-card)]"
              />
              {recipe.image?.credit ? (
                <figcaption className="mt-2 text-xs text-muted">
                  {recipe.image.similar ? "Ảnh minh họa món tương tự" : "Ảnh"}: {recipe.image.credit.author} ·{" "}
                  <a href={recipe.image.credit.sourceUrl} className="underline hover:text-brand-700" rel="noopener nofollow" target="_blank">
                    Wikimedia Commons
                  </a>{" "}
                  ·{" "}
                  {recipe.image.credit.licenseUrl ? (
                    <a href={recipe.image.credit.licenseUrl} className="underline hover:text-brand-700" rel="noopener nofollow license" target="_blank">
                      {recipe.image.credit.license}
                    </a>
                  ) : (
                    recipe.image.credit.license
                  )}
                </figcaption>
              ) : !recipe.image ? (
                <figcaption className="mt-2 text-xs text-muted">Hình minh họa – ảnh thật của món đang được cập nhật.</figcaption>
              ) : null}
            </figure>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
            {stats.map((s) => (
              <div
                key={s.label}
                className="grid grid-cols-[2.5rem_1fr] items-center gap-x-3 rounded-2xl border border-line bg-white p-3.5"
              >
                <dt className="contents">
                  <span
                    aria-hidden
                    className="row-span-2 grid size-10 place-items-center rounded-full bg-brand-50 text-brand-600"
                  >
                    <s.icon className="size-5" />
                  </span>
                  <span className="col-start-2 self-end text-xs font-semibold uppercase tracking-wide text-muted">
                    {s.label}
                  </span>
                </dt>
                <dd className="col-start-2 self-start font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="container-page mt-10">
        <p className="max-w-3xl text-lg leading-relaxed">{recipe.intro}</p>
        {recipe.suitableFor.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Phù hợp với">
            {recipe.suitableFor.map((s) => (
              <li key={s} className="rounded-full bg-accent-100 px-3 py-1 text-sm font-medium text-accent-700">
                {labelOf(SUITABLE_FOR, s)}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <IngredientPanel recipeTitle={recipe.title} baseServings={recipe.servings} ingredients={recipe.ingredients} />
          </div>

          <div className="space-y-8">
            <section aria-labelledby="cach-lam">
              <h2 id="cach-lam" className="text-2xl sm:text-3xl">
                Cách làm
              </h2>
              <ol className="mt-5 space-y-5">
                {recipe.steps.map((step, i) => (
                  <li key={i} id={`buoc-${i + 1}`} className="flex gap-4">
                    <span
                      aria-hidden
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 font-display text-lg font-bold text-white"
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1 pt-1">
                      <h3 className="font-sans text-lg font-bold">
                        <span className="sr-only">Bước {i + 1}: </span>
                        {step.title ?? `Bước ${i + 1}`}
                        {step.durationMinutes && (
                          <span className="ml-2 align-middle text-sm font-medium text-muted">
                            ~{formatMinutes(step.durationMinutes)}
                          </span>
                        )}
                      </h3>
                      <p className="mt-1.5 leading-relaxed text-ink-soft">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {recipe.tips.length > 0 && (
              <section aria-labelledby="meo" className="rounded-[var(--radius-card)] bg-accent-100/60 p-5 sm:p-6">
                <h2 id="meo" className="flex items-center gap-2 text-2xl">
                  <Lightbulb aria-hidden className="size-6 text-accent-700" /> Mẹo nấu ngon & lành mạnh
                </h2>
                <ul className="mt-3 space-y-2">
                  {recipe.tips.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-500" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="bao-quan" className="rounded-[var(--radius-card)] bg-brand-50 p-5 sm:p-6">
              <h2 id="bao-quan" className="flex items-center gap-2 text-2xl">
                <Refrigerator aria-hidden className="size-6 text-brand-700" /> Cách bảo quản
              </h2>
              <p className="mt-3">{recipe.storage}</p>
            </section>

            {nutrition && <NutritionFacts nutrition={nutrition} servings={recipe.servings} />}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="lien-quan" className="no-print container-page mt-16">
          <SectionHeading id="lien-quan" title="Công thức liên quan" href="/cong-thuc/" linkLabel="Tất cả công thức" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
