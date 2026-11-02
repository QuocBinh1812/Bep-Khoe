import type { NextConfig } from "next";

/**
 * Bếp Khỏe là website nội dung tĩnh (SSG): toàn bộ công thức, bài viết và thực đơn
 * được dựng sẵn khi build. Vì vậy dự án dùng mô hình rendering "cổ điển" của App Router
 * (generateStaticParams + dynamicParams = false) để slug không tồn tại trả về HTTP 404 thật,
 * thay vì bật `cacheComponents` (mô hình streaming/PPR) vốn chưa cần thiết ở giai đoạn MVP.
 */
const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1600],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
