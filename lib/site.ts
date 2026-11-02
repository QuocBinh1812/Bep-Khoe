/**
 * Cấu hình chung của website. Đổi domain thật bằng biến môi trường NEXT_PUBLIC_SITE_URL.
 */
function resolveSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined);
  const url = fromEnv ?? "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

export const site = {
  name: "Bếp Khỏe",
  shortName: "Bếp Khỏe",
  slogan: "Ăn ngon mỗi ngày – Sống khỏe lâu dài.",
  description:
    "Bếp Khỏe – công thức nấu ăn ngon, lành mạnh cho gia đình Việt, kiến thức dinh dưỡng dễ hiểu, thực đơn 7 ngày và công cụ tính dinh dưỡng, lập thực đơn, danh sách đi chợ miễn phí.",
  url: resolveSiteUrl(),
  locale: "vi_VN",
  language: "vi",
  themeColor: "#277A43",
  editorialTeam: "Ban biên tập Bếp Khỏe",
} as const;

/** Tạo URL tuyệt đối (có dấu "/" cuối, khớp cấu hình trailingSlash). */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  let p = path.startsWith("/") ? path : `/${path}`;
  const hasFile = /\.[a-z0-9]+$/i.test(p);
  if (!hasFile && !p.endsWith("/")) p = `${p}/`;
  return `${site.url}${p}`;
}

export type NavItem = { href: string; label: string; description?: string };

export const mainNav: NavItem[] = [
  { href: "/cong-thuc/", label: "Công thức", description: "Món ngon dễ nấu cho cả nhà" },
  { href: "/thuc-don/", label: "Thực đơn", description: "Thực đơn 7 ngày, gia đình, tiết kiệm" },
  { href: "/dinh-duong/", label: "Dinh dưỡng", description: "Kiến thức dinh dưỡng dễ hiểu" },
  { href: "/suc-khoe/", label: "Sức khỏe", description: "Thói quen sống khỏe mỗi ngày" },
  { href: "/cong-cu/", label: "Công cụ", description: "Tính dinh dưỡng, lập thực đơn, đi chợ" },
];
