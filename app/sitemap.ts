import type { MetadataRoute } from "next";
import { RECIPE_CATEGORIES } from "@/data/taxonomy";
import { articlePath, getAllArticles } from "@/lib/articles";
import { getMealPlans } from "@/lib/meal-plans";
import { getAllRecipes } from "@/lib/recipes";
import { absoluteUrl } from "@/lib/site";

/** Sitemap tự sinh từ nội dung. Không chứa URL lọc (?q=, ?danh-muc=...) hay trang cá nhân (/yeu-thich/). */
export default function sitemap(): MetadataRoute.Sitemap {
  const recipes = getAllRecipes();
  const articles = getAllArticles();
  const plans = getMealPlans();
  const latest = [...recipes, ...articles, ...plans].map((x) => x.updatedAt).sort().at(-1);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/cong-thuc/"), lastModified: latest, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/thuc-don/"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/dinh-duong/"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/suc-khoe/"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/cong-cu/"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/cong-cu/tinh-dinh-duong/"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/cong-cu/lap-thuc-don/"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/cong-cu/danh-sach-di-cho/"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/cong-cu/quy-doi-khau-phan/"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/gioi-thieu/"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/chinh-sach-bien-tap/"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/mien-tru-trach-nhiem/"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/chinh-sach-bao-mat/"), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticPages,
    ...RECIPE_CATEGORIES.map((c) => ({
      url: absoluteUrl(`/cong-thuc/danh-muc/${c.slug}/`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...recipes.map((r) => ({
      url: absoluteUrl(`/cong-thuc/${r.slug}/`),
      lastModified: r.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      ...(r.image && !r.image.similar ? { images: [absoluteUrl(r.image.src)] } : {}),
    })),
    ...articles.map((a) => ({
      url: absoluteUrl(articlePath(a)),
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...plans.map((p) => ({
      url: absoluteUrl(`/thuc-don/${p.slug}/`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
