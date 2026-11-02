# Hướng dẫn soạn nội dung Bếp Khỏe

Toàn bộ nội dung nằm trong thư mục `content/` dưới dạng JSON, **mỗi mục một file**, tên file = `slug` + `.json`.
Khi build, mọi file được kiểm tra bằng Zod (`lib/schemas.ts`). Sai cấu trúc => build báo lỗi chỉ rõ file và trường sai.

| Loại            | Thư mục               | Schema                    |
| --------------- | --------------------- | ------------------------- |
| Công thức       | `content/recipes/`    | `recipeSchema`            |
| Bài dinh dưỡng  | `content/nutrition/`  | `nutritionArticleSchema`  |
| Bài sức khỏe    | `content/health/`     | `healthArticleSchema`     |
| Thực đơn mẫu    | `content/meal-plans/` | `mealPlanSchema`          |

Danh mục, nhãn, đơn vị đo: `data/taxonomy.ts`. Bảng thành phần thực phẩm: `data/foods.json`. Tác giả: `data/authors.json`.

## Nguyên tắc chung

- Viết tiếng Việt có dấu, tự nhiên, thân thiện, câu ngắn. Đối tượng gồm cả người trung niên và lớn tuổi.
- **Nội dung tự viết**, không sao chép từ website khác.
- Không nhồi nhét từ khóa. Viết để giúp người đọc nấu được / hiểu được.
- `author` dùng `"ban-bien-tap"`. **Không bịa người kiểm duyệt** (`reviewer`) – chỉ điền khi có chuyên gia thật.
- Ngày theo dạng `YYYY-MM-DD`. `updatedAt` ≥ `publishedAt`.
- `description`: 40–220 ký tự (lý tưởng 120–160), dùng làm meta description.
- Không đưa ra lời khuyên điều trị bệnh. Nội dung sức khỏe luôn mang tính tham khảo, khuyến khích hỏi ý kiến bác sĩ khi có bệnh lý.

## Công thức (`content/recipes/<slug>.json`)

```jsonc
{
  "slug": "canh-chua-ca",
  "title": "Canh chua cá lóc",
  "description": "…(40–220 ký tự)…",
  "intro": "Đoạn mở đầu 2–4 câu: món ăn là gì, vì sao nên nấu, điểm lành mạnh.",
  "categories": ["mon-viet", "mon-gia-dinh"],        // RECIPE_CATEGORIES
  "dishType": "canh",                                 // DISH_TYPES
  "ingredientTags": ["ca", "ca-chua", "rau-la"],      // INGREDIENT_TAGS – nguyên liệu CHÍNH
  "suitableFor": ["nguoi-lon-tuoi", "it-dau-mo"],     // SUITABLE_FOR
  "difficulty": "de",                                 // de | trung-binh | kho
  "prepMinutes": 15,
  "cookMinutes": 20,
  "servings": 4,
  "course": "Món canh",                               // loại bữa/món, hiển thị + schema recipeCategory
  "ingredients": [
    { "name": "Cá lóc", "amount": 500, "unit": "g", "note": "làm sạch, cắt khúc", "food": { "id": "ca-loc", "grams": 350 } },
    { "name": "Nước mắm", "amount": 2, "unit": "muỗng canh", "group": "Gia vị", "food": { "id": "nuoc-mam", "grams": 30 } },
    { "name": "Ngò gai", "amount": null, "unit": "", "note": "vừa đủ", "optional": true }
  ],
  "steps": [ { "title": "Sơ chế cá", "text": "…", "durationMinutes": 10 } ],
  "tips": ["…"],
  "storage": "Cách bảo quản, thời gian dùng được…",
  "keywords": ["canh chua cá", "canh chua miền Nam"],
  "featured": false,
  "author": "ban-bien-tap",
  "publishedAt": "2026-10-05",
  "updatedAt": "2026-10-28"
}
```

### Quy tắc nguyên liệu & dinh dưỡng

- `amount: null` = "vừa đủ" (gia vị nêm nếm). Số lượng theo `servings` gốc.
- `unit` lấy từ `UNITS` trong `data/taxonomy.ts` (g, kg, ml, l, muỗng canh, muỗng cà phê, chén, quả, củ, tép, nhánh, lá, cây, bó, miếng, lát, con, khúc, gói, "").
- `food` (không bắt buộc) liên kết tới `data/foods.json` để **tự tính dinh dưỡng**:
  - `id` phải tồn tại trong `data/foods.json`.
  - `grams` = khối lượng **phần ăn được** (đã bỏ xương, vỏ) ứng với `amount` ở khẩu phần gốc. Ví dụ "500 g cá lóc cả xương" ≈ 350 g phần ăn được; "2 quả trứng" ≈ 100 g; "1 muỗng canh nước mắm" ≈ 15 g; "1 muỗng canh dầu ăn" ≈ 13 g.
  - Gắn `food` cho mọi nguyên liệu chính và dầu ăn/đường/nước mắm nếu có trong bảng. Gia vị lượng nhỏ không có trong bảng thì bỏ qua.
- Giá trị dinh dưỡng trên trang được **tính tự động** từ bảng thực phẩm và ghi rõ là ước tính. Không tự ghi số calo vào công thức.

## Bài viết dinh dưỡng / sức khỏe

```jsonc
{
  "slug": "dam-la-gi",
  "title": "…",
  "description": "…",
  "category": "nhom-chat-dinh-duong",   // NUTRITION_CATEGORIES hoặc HEALTH_CATEGORIES
  "author": "ban-bien-tap",
  "publishedAt": "2026-10-01",
  "updatedAt": "2026-10-30",
  "keyTakeaways": ["2–6 ý chính"],
  "body": [
    { "type": "p", "text": "Đoạn văn. Có thể dùng **in đậm**." },
    { "type": "h2", "text": "Tiêu đề mục" },
    { "type": "h3", "text": "Tiêu đề phụ" },
    { "type": "ul", "items": ["…"] },
    { "type": "ol", "items": ["…"] },
    { "type": "callout", "variant": "tip", "title": "Mẹo", "text": "…" },     // info | tip | warning
    { "type": "table", "caption": "…", "headers": ["Cột 1", "Cột 2"], "rows": [["…", "…"]] }
  ],
  "references": [
    { "title": "Healthy diet – Fact sheet", "publisher": "World Health Organization", "url": "https://www.who.int/news-room/fact-sheets/detail/healthy-diet", "year": 2020 }
  ],
  "relatedRecipes": ["canh-chua-ca"],
  "featured": false
}
```

- Chỉ dùng **in đậm** dạng `**chữ**` trong `text` / `items`. Không dùng HTML, không dùng link trong nội dung.
- Bài viết dài khoảng 700–1.200 từ, có 3–6 mục `h2`.
- Nguồn tham khảo: chỉ dẫn nguồn có thật từ tổ chức uy tín. Nếu không chắc URL chính xác, **bỏ trường `url`** và chỉ ghi tên tài liệu + đơn vị phát hành.
- Không bịa số liệu thống kê cụ thể. Con số khuyến nghị chỉ dùng khi đó là khuyến nghị phổ biến của tổ chức được trích dẫn (ví dụ WHO: muối < 5 g/ngày).

## Thực đơn (`content/meal-plans/<slug>.json`)

- `days`: đúng 7 phần tử (Thứ hai → Chủ nhật), mỗi ngày có `sang`, `trua`, `toi`.
- Mỗi bữa là mảng món: `{ "recipe": "<slug công thức có thật>" }` hoặc `{ "name": "Cơm trắng" }` cho món đơn giản không có công thức.
- `servings`: số người ăn; danh sách đi chợ sẽ quy đổi nguyên liệu theo số này.

## Ảnh

- Ảnh đặt trong `public/images/...`, định dạng WebP, tỷ lệ 4:3 (ví dụ 1200×900).
- Ảnh công thức khai báo trong `data/recipe-images.json` (hoặc trường `image` của công thức).
- Ảnh có giấy phép CC phải ghi `credit` (tác giả, giấy phép, link nguồn) – website tự hiển thị dòng ghi công.
- Nếu ảnh chỉ là **món tương tự** (không đúng hoàn toàn món), thêm `"similar": true`: trang hiển thị chú thích "Ảnh minh họa món tương tự" và ảnh **không** được khai báo trong Recipe structured data.
- Công thức chưa có ảnh sẽ hiển thị hình minh họa và không khai báo `image` trong Recipe schema (Google yêu cầu ảnh thật của món để hiện rich result).
