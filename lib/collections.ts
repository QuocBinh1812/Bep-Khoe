/**
 * Bộ sưu tập công thức theo chủ đề. Mỗi bộ được lọc TỰ ĐỘNG từ dữ liệu công thức
 * (thời gian, nhãn phù hợp, danh mục, loại món) nên luôn khớp nội dung thật khi thêm món mới.
 * Bộ nào có ít hơn MIN_RECIPES món sẽ tự ẩn.
 */
import { getAllRecipes, totalMinutes } from "@/lib/recipes";
import { QUICK_MINUTES } from "@/lib/recipe-constants";
import type { Recipe } from "@/types/content";

export const MIN_RECIPES = 3;

export type Collection = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  /** Tiêu chí lọc – hiển thị cho người đọc để minh bạch */
  rule: string;
  match: (r: Recipe) => boolean;
};

const COLLECTIONS: Collection[] = [
  {
    slug: "com-nha-30-phut",
    title: "Cơm nhà trong 30 phút",
    description: "Những món ngon nấu xong trong khoảng 30 phút – cứu tinh cho ngày đi làm về muộn mà vẫn muốn cả nhà ăn cơm nhà.",
    intro:
      "Đi làm về muộn vẫn kịp có mâm cơm nóng. Các món dưới đây tính cả thời gian sơ chế lẫn nấu đều không quá 30 phút; kết hợp một món mặn, một món rau hoặc canh là đủ bữa.",
    rule: `Tổng thời gian chuẩn bị và nấu ≤ ${QUICK_MINUTES} phút`,
    match: (r) => totalMinutes(r) <= QUICK_MINUTES,
  },
  {
    slug: "mon-mem-cho-ong-ba",
    title: "Món mềm, dễ ăn cho ông bà",
    description: "Món mềm, dễ nhai, dễ tiêu cho người lớn tuổi: cháo, canh, món hấp – vẫn đủ đạm và đậm đà vừa phải.",
    intro:
      "Người lớn tuổi thường khó nhai, ăn ít nhưng vẫn cần đủ đạm. Bộ sưu tập này gom các món mềm, ít dầu mỡ và dễ chia nhỏ. Khi nấu cho ông bà, hãy nêm nhạt hơn và cắt nhỏ hơn bình thường.",
    rule: "Công thức được gắn nhãn “Người lớn tuổi” hoặc “Mềm, dễ ăn”",
    match: (r) => r.suitableFor.includes("nguoi-lon-tuoi") || r.suitableFor.includes("de-tieu"),
  },
  {
    slug: "it-dau-mo",
    title: "Món ít dầu mỡ",
    description: "Hấp, luộc, nấu canh, xào nhanh với ít dầu – bữa cơm nhẹ bụng mà vẫn ngon miệng cho cả nhà.",
    intro:
      "Giảm dầu mỡ không có nghĩa là bữa ăn nhạt nhẽo. Các món dưới đây dùng cách nấu hấp, luộc, nấu canh hoặc xào nhanh với lượng dầu vừa phải.",
    rule: "Công thức được gắn nhãn “Ít dầu mỡ”",
    match: (r) => r.suitableFor.includes("it-dau-mo"),
  },
  {
    slug: "giau-dam-cho-ca-nha",
    title: "Giàu đạm cho cả nhà",
    description: "Món giàu đạm từ cá, thịt nạc, trứng, đậu phụ – giúp no lâu, phù hợp người vận động và trẻ đang lớn.",
    intro:
      "Đạm giúp no lâu và cần cho cơ bắp. Bộ sưu tập này gồm các món có nguồn đạm chính rõ ràng: cá, thịt nạc, trứng, tôm hoặc đậu phụ.",
    rule: "Công thức được gắn nhãn “Giàu đạm”",
    match: (r) => r.suitableFor.includes("giau-dam"),
  },
  {
    slug: "canh-ngon-moi-ngay",
    title: "Canh ngon mỗi ngày",
    description: "Bát canh nóng không thể thiếu trong mâm cơm Việt: canh chua, canh rau, canh bí – dễ nấu, nhiều rau.",
    intro:
      "Mâm cơm Việt khó thiếu bát canh. Canh giúp bữa ăn có thêm rau và nước; nấu canh nhạt một chút rồi để mỗi người tự nêm thêm sẽ tốt hơn cho người cần ăn ít muối.",
    rule: "Loại món: Canh – súp",
    match: (r) => r.dishType === "canh",
  },
  {
    slug: "bua-sang-am-bung",
    title: "Bữa sáng ấm bụng",
    description: "Cháo, phở, bún và món trứng cho bữa sáng đủ năng lượng – nấu ở nhà sạch sẽ, vừa vị cả nhà.",
    intro:
      "Bữa sáng nấu ở nhà giúp bạn chủ động lượng muối, dầu mỡ và chọn nguyên liệu tươi. Một số món có thể chuẩn bị nước dùng từ tối hôm trước.",
    rule: "Công thức thuộc danh mục “Món ăn sáng”",
    match: (r) => r.categories.includes("mon-an-sang"),
  },
  {
    slug: "thanh-dam-mon-chay",
    title: "Thanh đạm ngày chay",
    description: "Món chay từ đậu phụ, nấm và rau củ – đủ đạm, đủ vị cho ngày rằm, mùng một hay khi muốn ăn nhẹ.",
    intro:
      "Ăn chay vẫn có thể đủ chất nếu kết hợp đậu phụ, nấm và nhiều loại rau củ. Các món dưới đây dùng nước tương thay nước mắm.",
    rule: "Công thức thuộc danh mục “Món chay”",
    match: (r) => r.categories.includes("mon-chay"),
  },
];

export type CollectionWithRecipes = Omit<Collection, "match"> & { recipes: Recipe[] };

export function getCollections(): CollectionWithRecipes[] {
  const all = getAllRecipes();
  return COLLECTIONS.map(({ match, ...c }) => ({ ...c, recipes: all.filter(match) })).filter(
    (c) => c.recipes.length >= MIN_RECIPES,
  );
}

export function getCollection(slug: string): CollectionWithRecipes | undefined {
  return getCollections().find((c) => c.slug === slug);
}

/** Các bộ sưu tập có chứa công thức này (liên kết nội bộ ở trang công thức). */
export function getCollectionsForRecipe(slug: string): CollectionWithRecipes[] {
  return getCollections().filter((c) => c.recipes.some((r) => r.slug === slug));
}

/** Dữ liệu gọn cho thẻ bộ sưu tập. */
export function toCollectionCard(c: CollectionWithRecipes) {
  return {
    slug: c.slug,
    title: c.title,
    description: c.description,
    count: c.recipes.length,
    covers: [...c.recipes]
      .sort((a, b) => Number(!!b.image) - Number(!!a.image))
      .slice(0, 4)
      .map((r) => ({ title: r.title, image: r.image, dishType: r.dishType, ingredientTags: r.ingredientTags })),
  };
}
