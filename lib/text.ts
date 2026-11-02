/** Tiện ích xử lý chữ tiếng Việt & định dạng hiển thị. Dùng được ở cả server và client. */

/** Bỏ dấu tiếng Việt, chữ thường, gộp khoảng trắng – dùng cho tìm kiếm. */
export function normalizeVi(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Mọi từ khóa trong `query` đều phải xuất hiện trong `haystack` (đã chuẩn hóa). */
export function matchesQuery(haystackNormalized: string, query: string): boolean {
  const terms = normalizeVi(query).split(" ").filter(Boolean);
  return terms.every((t) => haystackNormalized.includes(t));
}

export function formatMinutes(total: number): string {
  if (total < 60) return `${total} phút`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m ? `${h} giờ ${m} phút` : `${h} giờ`;
}

/** ISO 8601 duration cho schema.org, ví dụ PT1H20M */
export function isoDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `PT${h ? `${h}H` : ""}${m || !h ? `${m}M` : ""}`;
}

const numberFormatters = new Map<number, Intl.NumberFormat>();
export function formatNumber(value: number, maxFractionDigits = 1): string {
  let f = numberFormatters.get(maxFractionDigits);
  if (!f) {
    f = new Intl.NumberFormat("vi-VN", { maximumFractionDigits: maxFractionDigits });
    numberFormatters.set(maxFractionDigits, f);
  }
  return f.format(value);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

/** Ước tính thời gian đọc (tiếng Việt ~ 200 từ/phút). */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Ghép class name, bỏ giá trị rỗng. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
