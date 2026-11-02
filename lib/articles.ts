/** Truy vấn bài viết dinh dưỡng & sức khỏe (server). */
import { getContent } from "@/lib/content/loader";
import { countWords, readingMinutes } from "@/lib/text";
import { HEALTH_CATEGORIES, NUTRITION_CATEGORIES } from "@/data/taxonomy";
import type { Article, ArticleBlock, ArticleSection } from "@/types/content";

export const SECTIONS: Record<
  ArticleSection,
  { name: string; path: string; categories: readonly { slug: string; name: string }[] }
> = {
  "dinh-duong": { name: "Dinh dưỡng", path: "/dinh-duong/", categories: NUTRITION_CATEGORIES },
  "suc-khoe": { name: "Sức khỏe", path: "/suc-khoe/", categories: HEALTH_CATEGORIES },
};

const byNewest = (a: Article, b: Article) => b.publishedAt.localeCompare(a.publishedAt);

export function getArticles(section: ArticleSection): Article[] {
  const c = getContent();
  const list = section === "dinh-duong" ? c.nutrition : c.health;
  return list.map((a) => ({ ...a, section }) as Article).sort(byNewest);
}

export function getAllArticles(): Article[] {
  return [...getArticles("dinh-duong"), ...getArticles("suc-khoe")].sort(byNewest);
}

export function getArticle(section: ArticleSection, slug: string): Article | undefined {
  return getArticles(section).find((a) => a.slug === slug);
}

export function articlePath(a: Pick<Article, "section" | "slug">): string {
  return `/${a.section}/${a.slug}/`;
}

function blockText(b: ArticleBlock): string {
  switch (b.type) {
    case "ul":
    case "ol":
      return b.items.join(" ");
    case "table":
      return [...b.headers, ...b.rows.flat()].join(" ");
    case "callout":
      return `${b.title ?? ""} ${b.text}`;
    default:
      return b.text;
  }
}

export function articleWordCount(a: Article): number {
  return countWords(a.body.map(blockText).join(" "));
}

export function articleReadingMinutes(a: Article): number {
  return readingMinutes(articleWordCount(a));
}

export function getRelatedArticles(a: Article, limit = 3): Article[] {
  const same = getArticles(a.section).filter((x) => x.slug !== a.slug);
  return [...same.filter((x) => x.category === a.category), ...same.filter((x) => x.category !== a.category)].slice(
    0,
    limit,
  );
}

/** Tạo id cho tiêu đề mục (mục lục). */
export function headingId(text: string, index: number): string {
  const base = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "muc"}-${index}`;
}
