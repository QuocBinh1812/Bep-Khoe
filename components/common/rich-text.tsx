import { Fragment } from "react";

/**
 * Hiển thị văn bản có **in đậm** một cách an toàn (không dùng HTML thô).
 * Chỉ hỗ trợ cú pháp **...**; mọi ký tự khác được React escape tự động.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
