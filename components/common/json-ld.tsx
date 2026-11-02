/**
 * Render JSON-LD. Đây là trường hợp duy nhất trong dự án dùng dangerouslySetInnerHTML
 * (theo khuyến nghị của Next.js). Dữ liệu đến từ nội dung nội bộ và ký tự "<" được
 * thoát thành < để chặn chèn thẻ </script>.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
