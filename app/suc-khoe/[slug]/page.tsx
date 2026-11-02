import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleDetail } from "@/components/article/article-views";
import { getArticle, getArticles } from "@/lib/articles";
import { buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles("suc-khoe").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/suc-khoe/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("suc-khoe", slug);
  if (!article) return {};
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/suc-khoe/${article.slug}/`,
    image: article.image,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
}

export default async function Page({ params }: PageProps<"/suc-khoe/[slug]">) {
  const { slug } = await params;
  const article = getArticle("suc-khoe", slug);
  if (!article) notFound();
  return <ArticleDetail article={article} />;
}
