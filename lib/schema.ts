/**
 * Dữ liệu có cấu trúc (JSON-LD, schema.org).
 * Nguyên tắc: chỉ khai báo những gì THỰC SỰ hiển thị trên trang.
 * - Recipe: chỉ thêm `image` khi công thức có ảnh thật của món ăn (không dùng ảnh minh họa).
 * - Không dùng SearchAction: Google đã ngừng hiển thị sitelinks search box từ 11/2024.
 */
import { absoluteUrl, site } from "@/lib/site";
import { isoDuration } from "@/lib/text";
import { ingredientLine } from "@/lib/quantity";
import type { RecipeNutrition } from "@/lib/nutrition";
import type { Article, Recipe } from "@/types/content";

type JsonLd = Record<string, unknown>;

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
      width: 512,
      height: 512,
    },
    slogan: site.slogan,
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: absoluteUrl("/"),
    inLanguage: "vi-VN",
    description: site.description,
    publisher: { "@id": ORG_ID },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

function authorNode(name: string, type: "Organization" | "Person" = "Organization"): JsonLd {
  return { "@type": type, name, url: absoluteUrl("/gioi-thieu/") };
}

export function recipeJsonLd(
  recipe: Recipe,
  nutrition: RecipeNutrition | null,
  author: { name: string; type: "Organization" | "Person" },
): JsonLd {
  const url = absoluteUrl(`/cong-thuc/${recipe.slug}/`);
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "@id": `${url}#recipe`,
    name: recipe.title,
    description: recipe.description,
    url,
    author: authorNode(author.name, author.type),
    publisher: { "@id": ORG_ID },
    datePublished: recipe.publishedAt,
    dateModified: recipe.updatedAt,
    prepTime: isoDuration(recipe.prepMinutes),
    cookTime: isoDuration(recipe.cookMinutes),
    totalTime: isoDuration(recipe.prepMinutes + recipe.cookMinutes),
    recipeYield: `${recipe.servings} khẩu phần`,
    recipeCategory: recipe.course,
    recipeCuisine: recipe.cuisine,
    inLanguage: "vi-VN",
    keywords: recipe.keywords.join(", ") || undefined,
    recipeIngredient: recipe.ingredients.map((i) => ingredientLine(i)),
    recipeInstructions: recipe.steps.map((s, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: s.title ?? `Bước ${idx + 1}`,
      text: s.text,
      url: `${url}#buoc-${idx + 1}`,
    })),
  };
  // Chỉ khai báo ảnh khi đúng là ảnh của món này (không dùng ảnh minh họa món tương tự).
  if (recipe.image && !recipe.image.similar) {
    data.image = [absoluteUrl(recipe.image.src)];
  }
  if (nutrition) {
    const n = nutrition.perServing;
    data.nutrition = {
      "@type": "NutritionInformation",
      servingSize: "1 khẩu phần",
      calories: `${n.kcal} kcal`,
      proteinContent: `${n.protein} g`,
      carbohydrateContent: `${n.carbs} g`,
      fatContent: `${n.fat} g`,
      ...(n.fiber !== null ? { fiberContent: `${n.fiber} g` } : {}),
    };
  }
  return data;
}

export function articleJsonLd(
  article: Article,
  author: { name: string; type: "Organization" | "Person" },
  reviewer?: { name: string; type: "Organization" | "Person" },
): JsonLd {
  const url = absoluteUrl(`/${article.section}/${article.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: url,
    inLanguage: "vi-VN",
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: authorNode(author.name, author.type),
    publisher: { "@id": ORG_ID },
    ...(article.image ? { image: [absoluteUrl(article.image.src)] } : {}),
    ...(reviewer ? { reviewedBy: authorNode(reviewer.name, reviewer.type) } : {}),
    citation: article.references.map((r) => ({
      "@type": "CreativeWork",
      name: r.title,
      publisher: r.publisher,
      ...(r.url ? { url: r.url } : {}),
    })),
  };
}
