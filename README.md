# Bếp Khỏe

> Ăn ngon mỗi ngày – Sống khỏe lâu dài.

Website nội dung về nấu ăn, dinh dưỡng và sức khỏe cho gia đình Việt Nam: công thức, kiến thức dinh dưỡng, thực đơn 7 ngày và 4 công cụ miễn phí (tính dinh dưỡng, lập thực đơn, danh sách đi chợ, quy đổi khẩu phần).

**Công nghệ:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zod · React Hook Form · Lucide · Vitest.

---

## 1. Chạy trên máy

Yêu cầu: **Node.js ≥ 20.9** (đã thử với Node 22).

```bash
npm install
cp .env.example .env.local      # sửa NEXT_PUBLIC_SITE_URL nếu cần
npm run dev                     # http://localhost:3000
```

| Lệnh                | Tác dụng                                                                 |
| ------------------- | ------------------------------------------------------------------------ |
| `npm run dev`       | Chạy chế độ phát triển                                                   |
| `npm run build`     | Build production (dựng sẵn toàn bộ 77 trang tĩnh)                        |
| `npm start`         | Chạy bản đã build (`PORT=3000` mặc định)                                 |
| `npm run typecheck` | Sinh kiểu route + kiểm tra TypeScript                                    |
| `npm run lint`      | ESLint (cấu hình Next.js core-web-vitals + TypeScript)                   |
| `npm test`          | Vitest: validate nội dung, logic định lượng, dinh dưỡng, JSON-LD         |
| `npm run check`     | Chạy tất cả: typecheck → lint → test → build                             |
| `npm run assets`    | Sinh lại favicon, logo, ảnh Open Graph mặc định từ SVG                   |

## 2. Triển khai

**Bắt buộc:** đặt biến môi trường `NEXT_PUBLIC_SITE_URL` = domain thật (ví dụ `https://bepkhoe.vn`) **trước khi build**. Canonical, sitemap, Open Graph và JSON-LD đều dùng giá trị này.

### Vercel (miễn phí cho dự án cá nhân)

1. Đẩy mã nguồn lên GitHub.
2. Import repo trên vercel.com → thêm biến `NEXT_PUBLIC_SITE_URL` → Deploy.

### Máy chủ riêng (VPS) với Node + Nginx

```bash
npm ci
NEXT_PUBLIC_SITE_URL=https://bepkhoe.vn npm run build
PORT=3000 npm start            # nên chạy bằng pm2 hoặc systemd để tự khởi động lại
```

Nginx chỉ cần `proxy_pass http://127.0.0.1:3000;` cho domain. Thư mục `/_next/static/` có thể cache lâu (immutable).

Sau khi lên mạng: gửi `https://<domain>/sitemap.xml` vào Google Search Console và kiểm tra vài công thức bằng [Rich Results Test](https://search.google.com/test/rich-results).

## 3. Cấu trúc dự án

```
app/                      Route (App Router) – mỗi thư mục là một URL
  page.tsx                Trang chủ
  cong-thuc/              /cong-thuc/, /cong-thuc/[slug]/, /cong-thuc/danh-muc/[slug]/
  dinh-duong/ suc-khoe/   Danh sách + chi tiết bài viết
  thuc-don/               Thực đơn mẫu
  cong-cu/                4 công cụ
  bo-suu-tap/             /bo-suu-tap/, /bo-suu-tap/[slug]/ – bộ sưu tập lọc tự động (lib/collections.ts)
  yeu-thich/              Công thức đã lưu (noindex)
  gioi-thieu/ chinh-sach-*/ mien-tru-trach-nhiem/
  sitemap.ts robots.ts manifest.ts not-found.tsx error.tsx loading.tsx
components/               Giao diện, chia theo nhóm: layout, recipe, article, nutrition,
                          meal-planner, shopping-list, favorites, common
content/                  NỘI DUNG (JSON, mỗi mục 1 file) – xem docs/CONTENT_GUIDE.md
  recipes/ nutrition/ health/ meal-plans/
data/
  taxonomy.ts             Danh mục, loại món, nhãn nguyên liệu, đơn vị đo
  foods.json              Bảng thành phần thực phẩm (49 nguyên liệu, trên 100 g)
  authors.json            Tác giả / người kiểm duyệt
  recipe-images.json      Ảnh món ăn + ghi công tác giả
  site-images.json        Ảnh hero trang chủ
lib/
  schemas.ts              Zod schema – "nguồn sự thật" về cấu trúc dữ liệu
  content/loader.ts       Đọc + validate nội dung (thay bằng truy vấn DB khi nâng cấp)
  recipes.ts articles.ts meal-plans.ts   Truy vấn dữ liệu (lớp repository)
  quantity.ts             Quy đổi khẩu phần, làm tròn, gộp danh sách đi chợ
  nutrition.ts            Tính dinh dưỡng (công thức xác định)
  storage.ts validate.ts  LocalStorage có kiểm tra dữ liệu + đồng bộ giữa các tab
  seo.ts schema.ts site.ts Metadata, JSON-LD, cấu hình website
types/content.ts          Kiểu TypeScript suy ra từ Zod
tests/                    Vitest
scripts/generate-assets.mjs
public/                   Ảnh, logo, ảnh OG
```

Nguyên tắc: giao diện tách khỏi dữ liệu (component không đọc file, chỉ nhận props); logic nghiệp vụ nằm trong `lib/` và có test; Server Component là mặc định, Client Component chỉ dùng cho phần tương tác (bộ lọc, khẩu phần, yêu thích, công cụ).

## 4. Quản lý nội dung

Xem chi tiết tại **[docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md)**. Tóm tắt:

- Thêm công thức: tạo `content/recipes/<slug>.json` → `npm test` → build. Sai cấu trúc sẽ báo lỗi rõ file và trường sai.
- Dinh dưỡng của công thức được **tính tự động** từ `data/foods.json` qua trường `food: { id, grams }` của nguyên liệu.
- Thêm nguyên liệu vào bảng dinh dưỡng: thêm 1 dòng vào `data/foods.json` (ghi `source`, `sourceRef`, `verified`).
- Khi có chuyên gia kiểm duyệt thật: thêm vào `data/authors.json` (`type: "Person"`, `credentials`), rồi ghi `"reviewer": "<id>"` vào bài viết. Website sẽ hiển thị và khai báo `reviewedBy`.

## 5. Quyết định kỹ thuật chính

| Quyết định | Lý do |
| --- | --- |
| **Tắt `cacheComponents`**, dùng SSG cổ điển (`generateStaticParams` + `dynamicParams = false`) | Website nội dung tĩnh; slug không tồn tại trả **HTTP 404 thật** (quan trọng cho SEO). Với `cacheComponents`, `dynamicParams` không dùng được. |
| Nội dung dạng **JSON có cấu trúc** thay vì MDX | Validate được bằng Zod, không cần thêm thư viện MDX, không cần render HTML thô, ánh xạ trực tiếp sang PostgreSQL (cột JSONB). |
| Bộ lọc công thức chạy phía trình duyệt, trạng thái lưu trên URL | Trang `/cong-thuc/` vẫn dựng tĩnh (HTML đầy đủ cho Google); URL lọc chia sẻ được; canonical luôn trỏ về `/cong-thuc/` nên không bị trùng lặp chỉ mục. |
| Trang danh mục `/cong-thuc/danh-muc/<slug>/` tĩnh riêng | Có giá trị SEO và liên kết nội bộ, thay vì để Google lập chỉ mục URL `?danh-muc=`. |
| LocalStorage kiểm tra bằng validator tự viết (`lib/validate.ts`) thay vì Zod | Zod (~80 KB) bị đóng gói vào **mọi trang** vì nút yêu thích ở header; bỏ đi giúp giảm JS. Zod vẫn dùng cho nội dung lúc build và biểu mẫu ở trang công cụ. |
| **Không có SearchAction** trong schema WebSite | Google đã ngừng hiển thị sitelinks search box (11/2024). |
| Recipe schema chỉ có `image` khi ảnh **đúng là món đó** | Ảnh "món tương tự" (`similar: true`) và hình minh họa không được khai báo, tránh dữ liệu cấu trúc sai sự thật. |
| `/yeu-thich/` dùng `noindex` (không chặn trong robots.txt) | Nếu chặn trong robots.txt, Google không đọc được thẻ noindex. |
| Không dùng shadcn/ui | Bộ component nhỏ, tự viết với Tailwind là đủ; tránh thêm phụ thuộc. |

## 6. Mô hình dữ liệu → PostgreSQL / Supabase

Mỗi schema trong `lib/schemas.ts` tương ứng một bảng. Gợi ý:

| Bảng | Cột chính |
| --- | --- |
| `recipes` | `slug` (PK), `title`, `description`, `intro`, `dish_type`, `difficulty`, `prep_minutes`, `cook_minutes`, `servings`, `course`, `steps jsonb`, `tips text[]`, `storage`, `image jsonb`, `author_id`, `published_at`, `updated_at` |
| `recipe_ingredients` | `recipe_slug` (FK), `position`, `name`, `amount numeric null`, `unit`, `note`, `group`, `optional`, `food_id` (FK null), `grams` |
| `recipe_categories`, `recipe_ingredient_tags` | bảng nối nhiều-nhiều |
| `articles` | `slug`, `section` (`dinh-duong`/`suc-khoe`), `category`, `title`, `description`, `body jsonb`, `key_takeaways text[]`, `author_id`, `reviewer_id null`, `published_at`, `updated_at` |
| `article_references` | `article_slug`, `title`, `publisher`, `url`, `year` |
| `meal_plans`, `meal_plan_items` | `plan_slug`, `day 0–6`, `meal` (`sang`/`trua`/`toi`), `recipe_slug null`, `name null` |
| `foods` | `id`, `name`, `group`, `state`, `kcal`, `protein`, `carbs`, `fat`, `fiber null`, `source`, `source_ref`, `verified` |
| `authors` | `id`, `name`, `type`, `role`, `bio`, `credentials` |

Khi chuyển: chỉ cần viết lại `lib/content/loader.ts` (hoặc các hàm trong `lib/recipes.ts`, `lib/articles.ts`, `lib/meal-plans.ts`) để truy vấn DB. Dữ liệu người dùng (yêu thích, thực đơn, danh sách đi chợ) đang đi qua các hook `useFavorites`, `useShoppingList`, `useMealPlanner` trong `lib/storage.ts` – có thể thay bằng store đồng bộ Supabase mà không sửa giao diện.

## 7. Nội dung mẫu hiện có

- **21 công thức** món Việt (6 danh mục) – 17 món có ảnh thật từ Wikimedia Commons (3 trong số đó là ảnh món tương tự, có ghi chú), 4 món dùng hình minh họa.
- **10 bài dinh dưỡng**, **5 bài sức khỏe** – mỗi bài có tác giả, ngày xuất bản/cập nhật, ý chính, mục lục, nguồn tham khảo (16 URL nguồn đã được kiểm tra truy cập được).
- **5 thực đơn 7 ngày** (cơ bản, gia đình 4 người, tiết kiệm, cân bằng ít muối, thu đông).
- **49 nguyên liệu** có dữ liệu dinh dưỡng trên 100 g, ghi nguồn (USDA FoodData Central / Bảng thành phần thực phẩm Việt Nam 2007 / ước tính).

## 8. Kết quả kiểm thử (02/11/2026)

Đã chạy thực tế:

- `tsc --noEmit`: không lỗi. `eslint`: không lỗi, không cảnh báo.
- `vitest`: **27/27** test pass (validate nội dung & liên kết chéo, quy đổi/làm tròn, gộp danh sách đi chợ, tính dinh dưỡng, JSON-LD Recipe, validator LocalStorage, gợi ý theo tủ lạnh, bộ sưu tập).
- `next build`: thành công, **77 trang tĩnh**.
- Kiểm tra URL: 61/61 URL trong sitemap trả 200; slug sai trả **404**; `/cong-thuc` → 308 sang `/cong-thuc/`.
- Kiểm thử trình duyệt tự động (Playwright, màn hình điện thoại 390px): **26/26** kịch bản pass, 0 lỗi console – menu mobile, tìm kiếm không dấu, lọc nguyên liệu, đổi khẩu phần, đánh dấu nguyên liệu, yêu thích, thêm/gộp danh sách đi chợ, validate biểu mẫu, sao chép, lập thực đơn + lưu sau khi tải lại, tạo danh sách đi chợ từ thực đơn, tính dinh dưỡng (ức gà 200 g + cơm 150 g = 435 kcal), quy đổi khẩu phần.
- **Lighthouse** (Lighthouse 13, Chromium headless, trên máy chủ dev đang tải nặng – `benchmarkIndex` 600–1300, thấp hơn mức máy chuẩn):

| Trang | Mobile (Perf / A11y / BP / SEO) | Desktop (Perf / A11y / BP / SEO) |
| --- | --- | --- |
| Trang chủ | 78–90 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Danh sách công thức | 77–83 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Chi tiết công thức | 68–81 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Bài dinh dưỡng | 85–92 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Thực đơn | 74–87 / 100 / 100 / 100 | 99 / 100 / 100 / 100 |
| Công cụ (4 trang) | 67–85 / 100 / 100 / 100 | 99 / 100 / 100 / 100 |

Accessibility 100 có được sau khi sửa 2 lỗi Lighthouse phát hiện (cấu trúc `<dl>` ở trang công thức, thứ tự tiêu đề ở trang lập thực đơn).

**Chưa đạt mục tiêu Performance 90+ trên mobile** ở phần lớn trang khi đo trên máy này (mô phỏng 4G chậm + CPU chậm 4 lần trên máy vốn đã yếu; điểm dao động ±10 giữa các lần đo). CLS = 0, LCP thực tế không throttle ~0,4–0,8 s. Nên đo lại bằng [PageSpeed Insights](https://pagespeed.web.dev/) sau khi triển khai để có số liệu chuẩn.

### Bổ sung tăng sức hút (đợt 2)

- **Chế độ nấu** (nút “Bắt đầu nấu” ở trang công thức): toàn màn hình, chữ lớn, từng bước; giữ màn hình luôn sáng (Wake Lock API – nếu trình duyệt hỗ trợ); vuốt/phím mũi tên để chuyển bước; hẹn giờ theo `durationMinutes` của bước, báo bằng âm thanh + rung; xem nguyên liệu đúng số khẩu phần đang chọn.
- **“Tủ lạnh nhà bạn có gì?”** trên trang chủ: chọn nguyên liệu → gợi ý món ngay (món dùng đủ nguyên liệu xếp trước). Logic: `lib/fridge.ts`.
- **Bộ sưu tập** `/bo-suu-tap/`: 7 chủ đề lọc tự động theo dữ liệu (≤ 30 phút, món mềm cho ông bà, ít dầu mỡ, giàu đạm, canh, bữa sáng, món chay); bộ dưới 3 món tự ẩn. Trang công thức hiện “Có trong bộ sưu tập”.
- **Nhãn trên thẻ món**: “Mới” (đăng trong 21 ngày tính đến lúc build – cần build lại định kỳ để nhãn tự cập nhật) và “≤ 30 phút”. Cấu hình: `lib/recipe-constants.ts`.
- Kiểm thử trình duyệt cho đợt này: 17/17 kịch bản pass (nhãn, tủ lạnh, bộ sưu tập, mở/chuyển bước/hẹn giờ/tạm dừng/nguyên liệu khớp khẩu phần/hoàn thành/Esc trong chế độ nấu), bộ hồi quy cũ 26/26 pass, 0 lỗi console.

### Animation (đợt 3)

Chỉ dùng CSS (`app/globals.css`, khối “Animation”), không thêm thư viện JavaScript:

- **Hiện dần khi cuộn** (`.reveal`) cho tiêu đề mục, thẻ món/bài viết/thực đơn/bộ sưu tập, các bước nấu – dùng CSS scroll-driven animation. Hiệu ứng **chỉ trượt, không làm mờ chữ** để chữ luôn đủ tương phản. Trình duyệt chưa hỗ trợ (Firefox) vẫn hiển thị nội dung bình thường.
- Thẻ nhấc nhẹ và ảnh phóng to khi rê chuột; nút lún nhẹ khi bấm; gạch chân tiêu đề hero tự vẽ; ảnh hero trượt vào (không dùng opacity để không làm chậm LCP).
- Phản hồi tương tác: tim yêu thích nảy, số trên header nhảy khi thay đổi, dấu tích bật ra, kết quả “Tủ lạnh” và “Gợi ý món khác” hiện lần lượt, menu mobile trượt xuống, hộp thoại phóng nhẹ.
- Chế độ nấu: bước mới trượt theo hướng bấm (tới/lùi), đồng hồ rung lắc khi hết giờ, màn hình hoàn thành có hiệu ứng.
- **Tôn trọng cài đặt “Giảm chuyển động”** của hệ điều hành: tắt toàn bộ hiệu ứng và cuộn mượt. Khi in, mọi hiệu ứng bị tắt.
- Đã kiểm tra trên trình duyệt: 11/11 kịch bản animation + chế độ giảm chuyển động pass; Lighthouse sau khi thêm: Accessibility/Best Practices/SEO 100, CLS ≈ 0, desktop Performance 100.

## 9. Việc còn lại / hạn chế đã biết

- **Số liệu dinh dưỡng chưa được chuyên gia đối chiếu** (`verified: false`) – website ghi rõ điều này. Nên nhờ chuyên gia dinh dưỡng rà soát `data/foods.json` và đối chiếu từng mục với USDA FDC / Bảng TPTP Việt Nam.
- **Chưa có người kiểm duyệt chuyên môn** cho bài viết – không bịa tên; thêm khi có chuyên gia thật.
- 4 công thức chưa có ảnh thật (`canh-bi-do-thit-bam`, `canh-rau-ngot-thit-bam`, `canh-nam-dau-phu`, `chao-yen-mach-thit-bam`) → chưa đủ điều kiện rich result của Google. 3 ảnh "món tương tự" (`ga-luoc-la-chanh`, `bun-ga`, `dau-phu-kho-nam`) nên thay bằng ảnh tự chụp.
- Ảnh CC BY-SA: bản đã cắt/nén vẫn mang giấy phép CC BY-SA; ghi công hiển thị dưới ảnh, giữ nguyên khi chỉnh sửa.
- **Newsletter chưa làm** (cần dịch vụ gửi email – để giai đoạn sau theo phạm vi MVP), nên không đặt form giả trên giao diện.
- Performance mobile: bước tiếp theo nếu cần là đo bằng PageSpeed Insights trên domain thật, cân nhắc giảm số weight font và tách nhỏ phần JS hydrate của trang công cụ.
