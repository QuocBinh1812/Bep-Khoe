import Link from "next/link";
import { BookOpen, CalendarCheck, CircleCheck, ShieldCheck, UserRound } from "lucide-react";
import { ArticleBody, getToc } from "@/components/article/article-body";
import { ArticleCard, type ArticleCardData } from "@/components/article/article-card";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { JsonLd } from "@/components/common/json-ld";
import { PageHeader } from "@/components/common/page-header";
import { SectionHeading } from "@/components/common/section-heading";
import { SharePrint } from "@/components/common/share-print";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { SECTIONS, articlePath, articleReadingMinutes, getArticles, getRelatedArticles } from "@/lib/articles";
import { getAuthor, getRecipe, toSummary } from "@/lib/recipes";
import { articleJsonLd } from "@/lib/schema";
import { site } from "@/lib/site";
import { formatDate, labelOfCategory } from "@/components/article/helpers";
import type { Article, ArticleSection } from "@/types/content";

export function toCardData(a: Article): ArticleCardData {
  return {
    href: articlePath(a),
    title: a.title,
    description: a.description,
    categoryName: labelOfCategory(a.section, a.category),
    updatedAt: a.updatedAt,
    readingMinutes: articleReadingMinutes(a),
  };
}

/** Trang danh sách bài viết của một chuyên mục, nhóm theo danh mục con. */
export function ArticleSectionIndex({
  section,
  title,
  description,
}: {
  section: ArticleSection;
  title: string;
  description: string;
}) {
  const meta = SECTIONS[section];
  const articles = getArticles(section);
  const featured = articles.filter((a) => a.featured).slice(0, 2);
  const groups = meta.categories
    .map((c) => ({ ...c, items: articles.filter((a) => a.category === c.slug) }))
    .filter((g) => g.items.length);

  return (
    <>
      <PageHeader title={title} description={description} crumbs={[{ name: meta.name, path: meta.path }]}>
        <nav aria-label="Chủ đề" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <li key={g.slug}>
                <a
                  href={`#${g.slug}`}
                  className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 font-medium text-ink-soft hover:border-brand-300 hover:bg-brand-50"
                >
                  {g.name} <span className="ml-1.5 text-sm text-muted">({g.items.length})</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="container-page space-y-14 py-10">
        {featured.length > 0 && (
          <section aria-labelledby="noi-bat">
            <SectionHeading id="noi-bat" title="Bài viết nổi bật" />
            <div className="grid gap-5 md:grid-cols-2">
              {featured.map((a) => (
                <ArticleCard key={a.slug} article={toCardData(a)} className="bg-cream-50" />
              ))}
            </div>
          </section>
        )}
        {groups.map((g) => (
          <section key={g.slug} id={g.slug} aria-labelledby={`h-${g.slug}`} className="scroll-mt-24">
            <SectionHeading id={`h-${g.slug}`} title={g.name} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((a) => (
                <ArticleCard key={a.slug} article={toCardData(a)} />
              ))}
            </div>
          </section>
        ))}
        <MedicalNote />
      </div>
    </>
  );
}

function MedicalNote() {
  return (
    <aside className="flex gap-3 rounded-2xl border border-line bg-surface p-5 text-ink-soft">
      <ShieldCheck aria-hidden className="mt-0.5 size-6 shrink-0 text-brand-600" />
      <p>
        Nội dung của Bếp Khỏe nhằm cung cấp kiến thức phổ thông, được tổng hợp từ các tổ chức y tế uy tín và ghi rõ nguồn tham
        khảo. Thông tin không thay thế chẩn đoán, điều trị hay lời khuyên của bác sĩ và chuyên gia dinh dưỡng.{" "}
        <Link href="/chinh-sach-bien-tap/" className="font-semibold text-brand-700 underline">
          Xem chính sách biên tập
        </Link>
        .
      </p>
    </aside>
  );
}

/** Trang chi tiết bài viết (dinh dưỡng / sức khỏe). */
export function ArticleDetail({ article }: { article: Article }) {
  const meta = SECTIONS[article.section];
  const author = getAuthor(article.author);
  const reviewer = article.reviewer ? getAuthor(article.reviewer) : undefined;
  const toc = getToc(article.body);
  const related = getRelatedArticles(article, 3);
  const recipes = article.relatedRecipes.flatMap((s) => {
    const r = getRecipe(s);
    return r ? [toSummary(r)] : [];
  });
  const categoryName = labelOfCategory(article.section, article.category);
  const authorName = author?.name ?? site.editorialTeam;

  return (
    <article className="pb-16">
      <JsonLd
        data={articleJsonLd(
          article,
          { name: authorName, type: author?.type ?? "Organization" },
          reviewer ? { name: reviewer.name, type: reviewer.type } : undefined,
        )}
      />
      <header className="border-b border-line bg-gradient-to-b from-cream-50 to-white">
        <div className="container-page max-w-4xl py-8 sm:py-12">
          <Breadcrumbs
            items={[
              { name: meta.name, path: meta.path },
              { name: article.title, path: articlePath(article) },
            ]}
          />
          <p className="mt-6 font-semibold text-accent-700">{categoryName}</p>
          <h1 className="mt-2 text-[2rem] sm:text-[2.6rem]">{article.title}</h1>
          <p className="mt-4 text-lg text-ink-soft">{article.description}</p>
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
            <div className="flex items-center gap-1.5">
              <UserRound aria-hidden className="size-4 text-brand-600" />
              <dt className="sr-only">Tác giả</dt>
              <dd>
                <Link href="/gioi-thieu/" className="font-semibold hover:text-brand-700 hover:underline">
                  {authorName}
                </Link>
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt>Xuất bản:</dt>
              <dd>
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarCheck aria-hidden className="size-4 text-brand-600" />
              <dt>Cập nhật:</dt>
              <dd>
                <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen aria-hidden className="size-4 text-brand-600" />
              <dt className="sr-only">Thời gian đọc</dt>
              <dd>{articleReadingMinutes(article)} phút đọc</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-muted">
            {reviewer
              ? `Kiểm duyệt chuyên môn: ${reviewer.name}${reviewer.credentials ? ` – ${reviewer.credentials}` : ""}`
              : "Kiểm duyệt chuyên môn: chưa có – bài viết được biên tập dựa trên nguồn tham khảo liệt kê cuối bài."}
          </p>
          <div className="mt-5">
            <SharePrint title={article.title} text={article.description} />
          </div>
        </div>
      </header>

      <div className="container-page mt-10 grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 max-w-3xl">
          <section aria-labelledby="y-chinh" className="rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:p-6">
            <h2 id="y-chinh" className="font-sans text-lg font-bold text-brand-900">
              Những ý chính
            </h2>
            <ul className="mt-3 space-y-2">
              {article.keyTakeaways.map((k) => (
                <li key={k} className="flex gap-2.5">
                  <CircleCheck aria-hidden className="mt-1 size-5 shrink-0 text-brand-600" />
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-8">
            <ArticleBody body={article.body} />
          </div>

          <section aria-labelledby="nguon" className="mt-12 border-t border-line pt-6">
            <h2 id="nguon" className="text-xl">
              Nguồn tham khảo
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[0.95rem] text-ink-soft">
              {article.references.map((r) => (
                <li key={r.title}>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noopener" className="font-medium text-brand-700 underline hover:text-brand-800">
                      {r.title}
                    </a>
                  ) : (
                    <span className="font-medium text-ink">{r.title}</span>
                  )}
                  {" – "}
                  {r.publisher}
                  {r.year ? ` (${r.year})` : ""}
                </li>
              ))}
            </ol>
          </section>
          <div className="mt-8">
            <MedicalNote />
          </div>
        </div>

        {toc.length > 1 && (
          <aside className="no-print order-first lg:order-none">
            <nav aria-labelledby="muc-luc" className="rounded-2xl border border-line p-5 lg:sticky lg:top-24">
              <h2 id="muc-luc" className="font-sans text-sm font-bold uppercase tracking-wider text-brand-800">
                Mục lục
              </h2>
              <ol className="mt-3 space-y-1.5 text-[0.95rem]">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="block rounded py-0.5 text-ink-soft hover:text-brand-700 hover:underline">
                      {t.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>

      {recipes.length > 0 && (
        <section aria-labelledby="mon-goi-y" className="no-print container-page mt-16">
          <SectionHeading id="mon-goi-y" title="Món ăn gợi ý" description="Áp dụng ngay vào bữa cơm hôm nay." href="/cong-thuc/" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="bai-lien-quan" className="no-print container-page mt-16">
          <SectionHeading id="bai-lien-quan" title="Bài viết liên quan" href={meta.path} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={toCardData(a)} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
