/**
 * Danh mục & nhãn phân loại. Đây là "bảng tra cứu" — khi chuyển sang PostgreSQL,
 * mỗi mảng dưới đây tương ứng một bảng (categories, dish_types, ingredient_tags...).
 */

export const RECIPE_CATEGORIES = [
  {
    slug: "mon-viet",
    name: "Món Việt",
    description: "Những món cơm nhà quen thuộc, đậm đà hương vị Việt.",
    intro:
      "Từ canh chua, cá kho đến thịt kho trứng – những món ăn gắn với bữa cơm gia đình Việt, được hướng dẫn chi tiết và điều chỉnh theo hướng ít dầu mỡ, ít muối hơn.",
  },
  {
    slug: "mon-chay",
    name: "Món chay",
    description: "Món chay thanh đạm, đủ đạm từ đậu phụ, nấm và các loại đậu.",
    intro:
      "Món chay không chỉ dành cho ngày rằm. Đậu phụ, nấm và rau củ kết hợp đúng cách giúp bữa ăn vẫn đủ đạm, đủ vị và nhẹ bụng.",
  },
  {
    slug: "mon-an-sang",
    name: "Món ăn sáng",
    description: "Bữa sáng ấm bụng, đủ năng lượng cho ngày mới.",
    intro:
      "Gợi ý các món ăn sáng nấu nhanh, dễ ăn và cân bằng – phù hợp cho cả người đi làm, trẻ đi học và người lớn tuổi.",
  },
  {
    slug: "mon-gia-dinh",
    name: "Món gia đình",
    description: "Món ăn hợp khẩu vị nhiều thế hệ trong nhà.",
    intro:
      "Những món dễ ăn với cả trẻ nhỏ và ông bà: mềm, vừa vị, có thể nấu một lần cho cả nhà.",
  },
  {
    slug: "mon-nhanh",
    name: "Món nhanh",
    description: "Hoàn thành trong khoảng 30 phút cho ngày bận rộn.",
    intro:
      "Ngày bận rộn vẫn có thể ăn ngon và lành mạnh. Các món dưới đây hoàn thành trong khoảng 30 phút.",
  },
  {
    slug: "nguyen-lieu-co-san",
    name: "Món từ nguyên liệu có sẵn",
    description: "Tận dụng trứng, đậu phụ, rau củ thường có trong tủ lạnh.",
    intro:
      "Mở tủ lạnh thấy trứng, đậu phụ, cà chua? Đây là những món chỉ cần nguyên liệu phổ biến, dễ mua, dễ thay thế.",
  },
] as const;

export type RecipeCategorySlug = (typeof RECIPE_CATEGORIES)[number]["slug"];

export const DISH_TYPES = [
  { slug: "canh", name: "Canh – súp" },
  { slug: "kho-rim", name: "Kho – rim" },
  { slug: "xao", name: "Xào" },
  { slug: "hap-luoc", name: "Hấp – luộc" },
  { slug: "sot", name: "Món sốt" },
  { slug: "chao", name: "Cháo" },
  { slug: "bun-pho", name: "Bún – phở" },
  { slug: "salad", name: "Salad – trộn" },
] as const;

export type DishTypeSlug = (typeof DISH_TYPES)[number]["slug"];

/** Nhãn nguyên liệu chính – dùng cho bộ lọc "tìm món từ nguyên liệu đang có". */
export const INGREDIENT_TAGS = [
  { slug: "ga", name: "Gà" },
  { slug: "thit-heo", name: "Thịt heo" },
  { slug: "thit-bo", name: "Thịt bò" },
  { slug: "ca", name: "Cá" },
  { slug: "tom", name: "Tôm" },
  { slug: "trung", name: "Trứng" },
  { slug: "dau-phu", name: "Đậu phụ" },
  { slug: "nam", name: "Nấm" },
  { slug: "rau-la", name: "Rau lá" },
  { slug: "cu-qua", name: "Củ quả" },
  { slug: "ca-chua", name: "Cà chua" },
  { slug: "gao-ngu-coc", name: "Gạo – ngũ cốc – bún" },
] as const;

export type IngredientTagSlug = (typeof INGREDIENT_TAGS)[number]["slug"];

export const DIFFICULTIES = [
  { slug: "de", name: "Dễ" },
  { slug: "trung-binh", name: "Trung bình" },
  { slug: "kho", name: "Khó" },
] as const;

export type DifficultySlug = (typeof DIFFICULTIES)[number]["slug"];

/** Nhóm phù hợp (hiển thị dạng nhãn, không phải lời khuyên y khoa). */
export const SUITABLE_FOR = [
  { slug: "nguoi-lon-tuoi", name: "Người lớn tuổi" },
  { slug: "tre-em", name: "Trẻ em" },
  { slug: "it-dau-mo", name: "Ít dầu mỡ" },
  { slug: "nhieu-rau", name: "Nhiều rau" },
  { slug: "giau-dam", name: "Giàu đạm" },
  { slug: "de-tieu", name: "Mềm, dễ ăn" },
] as const;

export type SuitableForSlug = (typeof SUITABLE_FOR)[number]["slug"];

export const NUTRITION_CATEGORIES = [
  { slug: "kien-thuc-co-ban", name: "Kiến thức dinh dưỡng cơ bản" },
  { slug: "nhom-chat-dinh-duong", name: "Nhóm chất dinh dưỡng" },
  { slug: "dinh-duong-phu-nu", name: "Dinh dưỡng cho phụ nữ" },
  { slug: "dinh-duong-nguoi-lon-tuoi", name: "Dinh dưỡng cho người lớn tuổi" },
  { slug: "an-uong-can-bang", name: "Ăn uống cân bằng" },
  { slug: "doc-nhan-thuc-pham", name: "Đọc nhãn thực phẩm" },
] as const;

export type NutritionCategorySlug = (typeof NUTRITION_CATEGORIES)[number]["slug"];

export const HEALTH_CATEGORIES = [
  { slug: "thoi-quen-lanh-manh", name: "Thói quen lành mạnh" },
  { slug: "van-dong", name: "Vận động" },
  { slug: "giac-ngu", name: "Giấc ngủ" },
  { slug: "cham-soc-nguoi-lon-tuoi", name: "Chăm sóc người lớn tuổi" },
  { slug: "loi-song-can-bang", name: "Lối sống cân bằng" },
] as const;

export type HealthCategorySlug = (typeof HEALTH_CATEGORIES)[number]["slug"];

export const MEAL_PLAN_CATEGORIES = [
  { slug: "thuc-don-7-ngay", name: "Thực đơn 7 ngày" },
  { slug: "thuc-don-gia-dinh", name: "Thực đơn gia đình" },
  { slug: "thuc-don-tiet-kiem", name: "Thực đơn tiết kiệm" },
  { slug: "thuc-don-can-bang", name: "Thực đơn cân bằng" },
  { slug: "thuc-don-theo-mua", name: "Thực đơn theo mùa" },
] as const;

export type MealPlanCategorySlug = (typeof MEAL_PLAN_CATEGORIES)[number]["slug"];

export const MEALS = [
  { slug: "sang", name: "Bữa sáng" },
  { slug: "trua", name: "Bữa trưa" },
  { slug: "toi", name: "Bữa tối" },
] as const;

export type MealSlug = (typeof MEALS)[number]["slug"];

export const WEEKDAYS = [
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
  "Chủ nhật",
] as const;

/** Đơn vị đo khuyến nghị cho nguyên liệu. */
export const UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "muỗng canh",
  "muỗng cà phê",
  "chén",
  "quả",
  "củ",
  "tép",
  "nhánh",
  "lá",
  "cây",
  "bó",
  "miếng",
  "lát",
  "con",
  "khúc",
  "gói",
  "",
] as const;

export function labelOf<T extends { slug: string; name: string }>(
  list: readonly T[],
  slug: string,
): string {
  return list.find((x) => x.slug === slug)?.name ?? slug;
}
