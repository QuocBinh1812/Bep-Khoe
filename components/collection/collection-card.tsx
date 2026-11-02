import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { cn } from "@/lib/text";
import type { ContentImage } from "@/types/content";

export type CollectionCardData = {
  slug: string;
  title: string;
  description: string;
  count: number;
  covers: { title: string; image?: ContentImage; dishType: string; ingredientTags: readonly string[] }[];
};

/** Thẻ bộ sưu tập: ghép 4 ảnh món đầu tiên. */
export function CollectionCard({
  collection: c,
  headingLevel = "h3",
  className,
}: {
  collection: CollectionCardData;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        "card group relative flex flex-col overflow-hidden reveal transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      <div className="grid grid-cols-2 gap-0.5 bg-white" aria-hidden>
        {c.covers.slice(0, 4).map((r) => (
          <RecipeImage
            key={r.title}
            title={r.title}
            image={r.image}
            dishType={r.dishType}
            ingredientTags={r.ingredientTags}
            sizes="(min-width: 1024px) 180px, 50vw"
          />
        ))}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-semibold text-accent-700">{c.count} công thức</p>
        <Heading className="mt-1 text-xl leading-snug">
          <Link
            href={`/bo-suu-tap/${c.slug}/`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-brand-700 focus-visible:outline-none"
          >
            {c.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-2 text-[0.95rem] text-muted">{c.description}</p>
        <span aria-hidden className="mt-auto inline-flex items-center gap-1 pt-3 font-semibold text-brand-700">
          Xem bộ sưu tập <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
