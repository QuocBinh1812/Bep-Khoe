import { HEALTH_CATEGORIES, NUTRITION_CATEGORIES, labelOf } from "@/data/taxonomy";
import type { ArticleSection } from "@/types/content";

export { formatDate } from "@/lib/text";

type Category = { slug: string; name: string };

export function labelOfCategory(section: ArticleSection, slug: string): string {
  const list: readonly Category[] = section === "dinh-duong" ? NUTRITION_CATEGORIES : HEALTH_CATEGORIES;
  return labelOf(list, slug);
}
