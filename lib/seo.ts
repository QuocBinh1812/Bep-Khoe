import type { Metadata } from "next";
import { absoluteUrl, site } from "@/lib/site";
import type { ContentImage } from "@/types/content";

export const DEFAULT_OG_IMAGE = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "Bếp Khỏe – Ăn ngon mỗi ngày, sống khỏe lâu dài",
};

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Đường dẫn tương đối, ví dụ /cong-thuc/canh-chua-ca/ */
  path: string;
  image?: ContentImage;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  /** Tiêu đề đầy đủ, bỏ qua template "%s | Bếp Khỏe" */
  absoluteTitle?: boolean;
  keywords?: string[];
};

/** Metadata chuẩn cho mọi trang: canonical, Open Graph, Twitter, robots. */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = absoluteUrl(input.path);
  const images = input.image
    ? [{ url: input.image.src, width: input.image.width, height: input.image.height, alt: input.image.alt }]
    : [DEFAULT_OG_IMAGE];
  const ogTitle = input.absoluteTitle ? input.title : `${input.title} | ${site.name}`;

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    keywords: input.keywords?.length ? input.keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: input.description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: input.type ?? "website",
      images,
      ...(input.type === "article"
        ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: input.description,
      images: images.map((i) => i.url),
    },
    robots: input.noindex ? { index: false, follow: true } : undefined,
  };
}
