/**
 * Sinh icon, logo và ảnh Open Graph mặc định từ SVG (dùng sharp có sẵn trong Next.js).
 * Chạy: npm run assets
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const out = (p) => path.join(root, p);

const mark = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="14" fill="#277A43"/>
  <path d="M17 9.5c-1.6 2 1.6 3.5 0 5.6M24 8c-1.6 2 1.6 3.6 0 5.8M31 9.5c-1.6 2 1.6 3.5 0 5.6" stroke="#F3E8D5" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M9 22.5h30c0 8.3-6.7 15-15 15s-15-6.7-15-15z" fill="#F3E8D5"/>
  <path d="M17.5 41h13" stroke="#F3E8D5" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M30.5 16.5c-5.6.2-9.3 3.4-9.6 9 4.7.3 9.2-2.4 9.6-9z" fill="#F0A65A"/>
  <path d="M21.4 25.6c2.2-2.6 4.6-4.6 7.6-6.4" stroke="#277A43" stroke-width="1.3" stroke-linecap="round"/>
</svg>`;

fs.writeFileSync(out("app/icon.svg"), mark(48));
await sharp(Buffer.from(mark(512))).png().toFile(out("public/logo.png"));
await sharp(Buffer.from(mark(192))).png().toFile(out("public/icon-192.png"));
await sharp(Buffer.from(mark(180))).png().toFile(out("app/apple-icon.png"));

// Ảnh OG: chữ được vẽ bằng font hệ thống có hỗ trợ tiếng Việt (DejaVu/Noto). Kiểm tra lại bằng mắt sau khi sinh.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FBF7EF"/><stop offset="1" stop-color="#EEF6F0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1060" cy="110" r="220" fill="#F3E8D5"/>
  <circle cx="1120" cy="560" r="160" fill="#D7EBDD"/>
  <g transform="translate(96 150) scale(3.4)">${mark(48).replace(/<\/?svg[^>]*>/g, "")}</g>
  <text x="96" y="410" font-family="Noto Serif, DejaVu Serif, Georgia, serif" font-size="96" font-weight="700" fill="#1F6236">Bếp Khỏe</text>
  <text x="96" y="480" font-family="Noto Sans, DejaVu Sans, Arial, sans-serif" font-size="38" fill="#26332B">Ăn ngon mỗi ngày – Sống khỏe lâu dài.</text>
  <text x="96" y="540" font-family="Noto Sans, DejaVu Sans, Arial, sans-serif" font-size="28" fill="#5D6B62">Công thức · Dinh dưỡng · Thực đơn 7 ngày · Công cụ miễn phí</text>
</svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(out("public/og-default.png"));
console.log("Đã sinh: app/icon.svg, app/apple-icon.png, public/logo.png, public/icon-192.png, public/og-default.png");
