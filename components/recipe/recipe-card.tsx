import Link from "next/link";
import { Clock, Flame, Gauge } from "lucide-react";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { FavoriteButton } from "@/components/recipe/favorite-button";
import { DIFFICULTIES, DISH_TYPES, labelOf } from "@/data/taxonomy";
import { cn, formatMinutes } from "@/lib/text";
import type { RecipeSummary } from "@/types/content";

export function RecipeCard({
  recipe,
  priority,
  headingLevel = "h3",
  className,
}: {
  recipe: RecipeSummary;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        "card group relative flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      <div className="relative">
        <RecipeImage
          title={recipe.title}
          image={recipe.image}
          dishType={recipe.dishType}
          ingredientTags={recipe.ingredientTags}
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-800 shadow-sm">
          {labelOf(DISH_TYPES, recipe.dishType)}
        </span>
        <FavoriteButton slug={recipe.slug} title={recipe.title} className="absolute right-3 top-3 z-10" />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Heading className="text-lg leading-snug sm:text-xl">
          <Link
            href={`/cong-thuc/${recipe.slug}/`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-brand-700 focus-visible:outline-none"
          >
            {recipe.title}
          </Link>
        </Heading>
        <p className="mt-1.5 line-clamp-2 text-[0.95rem] text-muted">{recipe.description}</p>
        <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-sm text-ink-soft">
          <li className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-4 text-brand-600" />
            <span className="sr-only">Tổng thời gian:</span>
            {formatMinutes(recipe.totalMinutes)}
          </li>
          {recipe.kcalPerServing !== null && (
            <li className="inline-flex items-center gap-1.5" title="Ước tính mỗi khẩu phần">
              <Flame aria-hidden className="size-4 text-accent-500" />
              <span className="sr-only">Năng lượng ước tính mỗi khẩu phần:</span>~{recipe.kcalPerServing} kcal
            </li>
          )}
          <li className="inline-flex items-center gap-1.5">
            <Gauge aria-hidden className="size-4 text-brand-600" />
            <span className="sr-only">Độ khó:</span>
            {labelOf(DIFFICULTIES, recipe.difficulty)}
          </li>
        </ul>
      </div>
    </article>
  );
}
