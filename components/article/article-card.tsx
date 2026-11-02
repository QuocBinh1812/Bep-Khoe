import Link from "next/link";
import { BookOpen } from "lucide-react";
import { formatDate } from "@/lib/text";
import { cn } from "@/lib/text";

export type ArticleCardData = {
  href: string;
  title: string;
  description: string;
  categoryName: string;
  updatedAt: string;
  readingMinutes: number;
};

export function ArticleCard({
  article,
  headingLevel = "h3",
  className,
}: {
  article: ArticleCardData;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        "card group relative flex flex-col p-5 sm:p-6 reveal transition-[translate,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      <p className="text-sm font-semibold text-accent-700">{article.categoryName}</p>
      <Heading className="mt-2 text-xl leading-snug">
        <Link
          href={article.href}
          className="after:absolute after:inset-0 after:content-[''] hover:text-brand-700 focus-visible:outline-none"
        >
          {article.title}
        </Link>
      </Heading>
      <p className="mt-2 line-clamp-3 text-[0.95rem] text-muted">{article.description}</p>
      <p className="mt-auto flex items-center gap-2 pt-4 text-sm text-ink-soft">
        <BookOpen aria-hidden className="size-4 text-brand-600" />
        {article.readingMinutes} phút đọc · Cập nhật <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
      </p>
    </article>
  );
}
